#!/usr/bin/env node
/**
 * struct-stats.mjs -- deterministic structural statistics for one normalized Markdown / text file.
 *
 * Usage:
 *   node scripts/struct-stats.mjs <path> [--json]
 *   node scripts/struct-stats.mjs - [--json]       # read the body from stdin
 *
 * Output: six counters (sentences / paragraphs / orderedListItems / codeBlockLines /
 * externalLinks / blockquotes), textLines (body lines that carry text: paragraphs minus the
 * non-text lines), two optional counters (chars = CJK chars, latinWords) and frontMatterLines (how
 * many lines a leading YAML front-matter block removed). Statistics only, never a verdict.
 *
 * paragraphs is the raw count of non-empty body lines, NOT a count of natural paragraphs (ruling
 * K-5); textLines subtracts the non-text lines and is the denominator the scoring protocol uses.
 *
 * front-matter: a leading YAML block (--- ... ---) is stripped before counting, so every counter
 * covers the body only. Only a three-dash fence on the very first line opens it (a BOM is
 * tolerated, LF and CRLF both work) and it ends at the next three-dash fence, which is removed
 * too; without a closing fence the file is counted as is, so a body that merely opens with three
 * dashes is never swallowed.
 *
 * sentences: the full-width marks \u3002 \uff01 \uff1f \uff1b \u2026 end a sentence outright, an ASCII
 * . never does, and an ASCII ? or ! does only when whitespace, a line break or a CJK character
 * follows it (_scratch/retired/stage1-protocol/references__01-genre-routing.md, ruling K-1) so that a URL query string is not
 * split. Headings, fenced code blocks (fence lines included), blockquote lines and non-text lines
 * (image placeholder / bare URL / horizontal rule / punctuation only) are excluded from the count;
 * consecutive end marks are one boundary.
 *
 * Exit codes: 0 ok / 2 usage or file-not-found / 4 content unusable.
 * Zero dependencies (node: builtins only). This source is ASCII-only on purpose:
 * every Chinese literal is written as a \uXXXX escape (project hard rule).
 */

import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const EXIT = { OK: 0, USAGE: 2, CONTENT: 4 };

const CJK_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff]/g;
const LATIN_WORD_RE = /[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g;
// Full-width end marks. Each one is unconditionally a sentence boundary.
const FULL_WIDTH_END_MARKS = '\u3002\uff01\uff1f\uff1b\u2026';
// An ASCII ? / ! is a boundary only when one of these follows it: whitespace, a line break or a
// CJK character (_scratch/retired/stage1-protocol/references__01-genre-routing.md, ruling K-1). Letters, digits and ASCII
// punctuation do not qualify, so "Hi!there" and a URL query string stay whole.
const SENTENCE_BOUNDARY_NEXT_RE = /[\s\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff\uac00-\ud7af]/;
const ORDERED_ITEM_RE = /^\s*\d+[.\u3001)]\s+/;
const FENCE_RE = /^\s*```/;
const QUOTE_RE = /^\s*>\s?/;
const HEADING_RE = /^#{1,6}\s/;
const LINK_RE = /https?:\/\//gi;
// Non-text lines (ruling K-2): an image placeholder standing alone, a bare URL standing alone, a
// horizontal rule, or a line of punctuation / symbols only. They carry no prose, so they are never
// a sentence and never a text line -- they still count in paragraphs.
const IMAGE_PLACEHOLDER_RE = /^!\[[^\]]*\]$/;
const BARE_URL_RE = /^<?https?:\/\/[^\s<>]+>?$/;
const HORIZONTAL_RULE_DASH_RE = /^(?:[ \t]*-){3,}[ \t]*$/;
const HORIZONTAL_RULE_STAR_RE = /^(?:[ \t]*\*){3,}[ \t]*$/;
const HORIZONTAL_RULE_UNDERSCORE_RE = /^(?:[ \t]*_){3,}[ \t]*$/;
// \p{L} / \p{N} need the u flag; the property escapes keep CJK and digits out of "punctuation only".
const PUNCTUATION_ONLY_RE = /^[^\p{L}\p{N}]+$/u;

class UserError extends Error {
  constructor(message, hint, code = EXIT.USAGE) {
    super(message);
    this.hint = hint;
    this.code = code;
  }
}

// ---------------------------------------------------------------- command line

function usage() {
  return [
    '\u7528\u6cd5\uff1anode scripts/struct-stats.mjs <\u6587\u4ef6\u8def\u5f84> [--json]',
    '      node scripts/struct-stats.mjs - [--json]',
    '',
    '  <\u6587\u4ef6\u8def\u5f84>  \u5f52\u4e00\u5316 Markdown / .md / .txt\uff08input-wechat.mjs \u6216 input-file.mjs \u7684\u4ea7\u7269\uff0c\u4e5f\u53ef\u76f4\u63a5\u7ed9\u666e\u901a\u6587\u672c\uff09',
    '  -           \u4ece stdin \u8bfb\u5165\u6b63\u6587',
    '  --json      \u8f93\u51fa\u5355\u884c JSON\uff08\u9ed8\u8ba4\u8f93\u51fa\u4eba\u7c7b\u53ef\u8bfb\u7684\u952e\u503c\u884c\uff09',
    '',
    '  \u7edf\u8ba1\u9879\uff1a\u53e5\u6570 sentences / \u6bb5\u843d\u6570 paragraphs\uff08\u6b63\u6587\u975e\u7a7a\u884c\u6570\uff0c\u542b\u975e\u6587\u672c\u884c\uff0c\u4e0d\u662f\u81ea\u7136\u6bb5\u843d\u6570\uff09 /',
    '          \u6709\u5e8f\u5217\u8868\u9879\u6570 orderedListItems / \u4ee3\u7801\u5757\u884c\u6570 codeBlockLines / \u5916\u90e8\u94fe\u63a5\u6570 externalLinks /',
    '          \u5f15\u7528\u5757\u6570 blockquotes / front-matter \u884c\u6570 frontMatterLines\uff08\u6b63\u6587\u7edf\u8ba1\u524d\u5df2\u5265\u79bb\uff1b\u65e0\u5219 0\uff09',
    '          \u6b63\u6587\u6587\u672c\u884c\u6570 textLines\uff08= paragraphs \u51cf\u53bb\u975e\u6587\u672c\u884c\uff1a![N] \u5360\u4f4d\u884c / \u7eaf URL \u884c /',
    '                        \u6c34\u5e73\u5206\u5272\u7ebf\u884c / \u7eaf\u6807\u70b9\u884c\uff1b\u8fd9\u4e9b\u884c\u4ecd\u8ba1\u5165 paragraphs\uff0c\u4f46\u4e0d\u8ba1\u53e5\u6570\uff09',
    '  \u6ce8\uff1a\u6587\u4ef6\u5f00\u5934\u7684 YAML front-matter\uff08--- \u5230 ---\uff09\u4e0d\u8ba1\u5165\u4efb\u4f55\u7edf\u8ba1\u9879\u3002',
    '  \u53ea\u7edf\u8ba1\u3001\u4e0d\u5224\u5b9a\u3002\u9000\u51fa\u7801\uff1a0 \u6210\u529f / 2 \u7528\u6cd5\u6216\u6587\u4ef6\u4e0d\u5b58\u5728 / 4 \u5185\u5bb9\u4e0d\u53ef\u7528\u3002',
  ].join('\n');
}

function parseArgs(argv) {
  const opts = { input: null, json: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--json' || a === '-j') {
      opts.json = true;
    } else if (a === '--help' || a === '-h') {
      opts.help = true;
    } else if (a.startsWith('-') && a !== '-') {
      throw new UserError(`\u672a\u77e5\u53c2\u6570\uff1a${a}`, '\u652f\u6301\u7684\u53c2\u6570\u53ea\u6709 --json \u4e0e --help\uff1b\u7528 - \u8868\u793a\u4ece stdin \u8bfb\u5165\u6b63\u6587\u3002');
    } else if (opts.input === null) {
      opts.input = a;
    } else {
      throw new UserError(`\u51fa\u73b0\u4e86\u591a\u4f59\u7684\u4f4d\u7f6e\u53c2\u6570\uff1a${a}`, '\u4e00\u6b21\u53ea\u7edf\u8ba1\u4e00\u4e2a\u6587\u4ef6\u3002');
    }
  }
  return opts;
}

// ---------------------------------------------------------------- text normalization

/** Same light normalization as scripts/input-file.mjs: BOM, CRLF, invisible chars, trailing blanks. */
function normalizeText(text) {
  const lines = String(text)
    .replace(/^\ufeff/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\u0000/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').replace(/[ \t]+$/, ''));

  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
}

// ---------------------------------------------------------------- front-matter

// A front-matter fence: three dashes, optionally followed by spaces or tabs.
const FRONT_MATTER_FENCE_RE = /^---[ \t]*$/;

/**
 * Strip a leading YAML front-matter block and report how many lines it held. The block opens only
 * when the very first line is a --- fence and ends at the next --- fence; both fences are removed.
 * Without a closing fence the text is returned untouched, so a body that merely opens with --- is
 * never swallowed. Input is expected LF-normalized (normalizeText does that) and is re-normalized
 * here anyway, so CRLF works on either path.
 */
function splitFrontMatter(text) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  if (lines[0] === undefined || !FRONT_MATTER_FENCE_RE.test(lines[0])) {
    return { body: text, frontMatterLines: 0 };
  }
  for (let i = 1; i < lines.length; i += 1) {
    if (FRONT_MATTER_FENCE_RE.test(lines[i])) {
      return { body: lines.slice(i + 1).join('\n'), frontMatterLines: i + 1 };
    }
  }
  return { body: text, frontMatterLines: 0 };
}

// ---------------------------------------------------------------- counting

/**
 * sentences: a full-width end mark, an ASCII ? / ! followed by whitespace / a line break / a CJK
 * character, or a line break closes a sentence; a heading line, a fenced code block (fence lines
 * included), a blockquote line and a non-text line are excluded; whitespace-only pieces are not
 * sentences. An ASCII ? / ! followed by anything else is part of a token (ruling K-1).
 */
function isSentenceBoundary(line, i) {
  const ch = line[i];
  if (FULL_WIDTH_END_MARKS.includes(ch)) return true;
  if (ch === '!' || ch === '?') {
    const next = line[i + 1];
    return next === undefined || SENTENCE_BOUNDARY_NEXT_RE.test(next);
  }
  return false;
}

/** True for a line that carries no prose: the four shapes listed above the counters (ruling K-2). */
function isNonTextLine(line) {
  const s = line.trim();
  if (s === '') return false;
  return IMAGE_PLACEHOLDER_RE.test(s)
    || BARE_URL_RE.test(s)
    || HORIZONTAL_RULE_DASH_RE.test(s)
    || HORIZONTAL_RULE_STAR_RE.test(s)
    || HORIZONTAL_RULE_UNDERSCORE_RE.test(s)
    || PUNCTUATION_ONLY_RE.test(s);
}

function countSentences(text) {
  let inFence = false;
  let n = 0;

  for (const line of text.split('\n')) {
    if (FENCE_RE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence || HEADING_RE.test(line) || QUOTE_RE.test(line) || line.trim() === '') continue;
    if (isNonTextLine(line)) continue;

    // A run of end marks is one boundary: the empty pieces it yields are not sentences.
    let piece = '';
    for (let i = 0; i < line.length; i += 1) {
      if (isSentenceBoundary(line, i)) {
        if (piece.trim() !== '') n += 1;
        piece = '';
      } else {
        piece += line[i];
      }
    }
    if (piece.trim() !== '') n += 1;
  }
  return n;
}

function countStats(text) {
  const lines = text.split('\n');
  let paragraphs = 0;
  let nonTextLines = 0;
  let orderedListItems = 0;
  let codeBlockLines = 0;
  let blockquotes = 0;
  let inFence = false;
  let prevWasQuote = false;

  for (const line of lines) {
    if (line.trim() !== '') {
      paragraphs += 1;
      if (isNonTextLine(line)) nonTextLines += 1;
    }
    if (ORDERED_ITEM_RE.test(line)) orderedListItems += 1;

    const isFence = FENCE_RE.test(line);
    if (isFence) {
      inFence = !inFence;
    } else if (inFence) {
      codeBlockLines += 1;
    }

    const isQuote = !isFence && QUOTE_RE.test(line);
    if (isQuote && !prevWasQuote) blockquotes += 1;
    prevWasQuote = isQuote;
  }

  return {
    sentences: countSentences(text),
    paragraphs,
    orderedListItems,
    codeBlockLines,
    externalLinks: (text.match(LINK_RE) || []).length,
    blockquotes,
    // Body lines that carry text: paragraphs without the non-text lines (ruling K-2 / K-4).
    textLines: paragraphs - nonTextLines,
  };
}
function formatHuman(stats, cjk, latinWords, frontMatterLines) {
  const rows = [
    ['sentences', stats.sentences],
    ['paragraphs', stats.paragraphs],
    ['orderedListItems', stats.orderedListItems],
    ['codeBlockLines', stats.codeBlockLines],
    ['externalLinks', stats.externalLinks],
    ['blockquotes', stats.blockquotes],
    ['chars', cjk],
    ['latinWords', latinWords],
    ['frontMatterLines', frontMatterLines],
    ['textLines', stats.textLines],
  ];
  const width = Math.max(...rows.map(([k]) => k.length)) + 2;
  return `${rows.map(([k, v]) => `${k.padEnd(width)}${v}`).join('\n')}\n`;
}

// ---------------------------------------------------------------- main

function readStdin() {
  return new Promise((res, rej) => {
    const chunks = [];
    process.stdin.on('data', (c) => chunks.push(c));
    process.stdin.on('end', () => res(Buffer.concat(chunks).toString('utf8')));
    process.stdin.on('error', rej);
  });
}

/** Resolves once stdout has no pending write left; process.exit() would otherwise cut a pipe short. */
function flushStdout() {
  return new Promise((r) => process.stdout.write('', r));
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    process.stdout.write(`${usage()}\n`);
    await flushStdout();
    process.exit(EXIT.OK);
  }
  if (!opts.input) {
    process.stderr.write(`${usage()}\n`);
    process.exit(EXIT.USAGE);
  }

  const base = { ok: true, source: 'struct-stats', input: opts.input, path: null, bytes: null, stdin: false };
  let raw;

  if (opts.input === '-') {
    base.path = '(stdin)';
    base.input = '(stdin)';
    base.stdin = true;
    raw = await readStdin();
    base.bytes = Buffer.byteLength(raw, 'utf8');
    if (base.bytes === 0) {
      throw new UserError(
        '\u5185\u5bb9\u4e0d\u53ef\u7528\uff1astdin \u91cc\u6ca1\u6709\u8bfb\u5230\u4efb\u4f55\u5b57\u8282\u3002',
        '\u8bf7\u628a\u6b63\u6587\u901a\u8fc7\u7ba1\u9053\u4f20\u5165\uff0c\u4f8b\u5982\uff1aGet-Content \u6587\u7ae0.md -Encoding UTF8 | node scripts/struct-stats.mjs -',
        EXIT.CONTENT,
      );
    }
  } else {
    const target = resolve(opts.input);
    base.path = target;
    let st;
    try {
      st = statSync(target);
    } catch {
      throw new UserError(
        `\u627e\u4e0d\u5230\u6587\u4ef6\uff1a${target}`,
        '\u8bf7\u68c0\u67e5\u8def\u5f84\u62fc\u5199\uff1b\u8def\u5f84\u542b\u7a7a\u683c\u6216\u4e2d\u6587\u65f6\u7528\u5f15\u53f7\u5305\u8d77\u6765\uff0c\u4f8b\u5982 node scripts/struct-stats.mjs "C:\\\u8def\u5f84\\\u6587\u7ae0.md"',
      );
    }
    if (st.isDirectory()) {
      throw new UserError(`\u8fd9\u662f\u4e00\u4e2a\u76ee\u5f55\uff0c\u4e0d\u662f\u6587\u4ef6\uff1a${target}`, '\u8bf7\u6307\u5411\u5177\u4f53\u7684 .md / .txt \u6587\u4ef6\u3002');
    }
    base.bytes = st.size;
    if (!st.size) {
      throw new UserError(
        `\u5185\u5bb9\u4e0d\u53ef\u7528\uff1a\u6587\u4ef6\u662f\u7a7a\u7684\uff080 \u5b57\u8282\uff09\uff1a${target}`,
        '\u8bf7\u786e\u8ba4\u6587\u4ef6\u5185\u5bb9\u5b8c\u6574\uff1b\u516c\u4f17\u53f7\u6587\u7ae0\u8bf7\u5148\u7528 scripts/input-wechat.mjs \u843d\u6210 Markdown\u3002',
        EXIT.CONTENT,
      );
    }
    try {
      raw = readFileSync(target, 'utf8');
    } catch (err) {
      throw new UserError(`\u8bfb\u53d6\u5931\u8d25\uff1a${err.message}`, '\u8bf7\u68c0\u67e5\u6587\u4ef6\u662f\u5426\u88ab\u5360\u7528\u3001\u4ee5\u53ca\u5f53\u524d\u7528\u6237\u662f\u5426\u6709\u8bfb\u53d6\u6743\u9650\u3002');
    }
  }

  if (/^%PDF-/.test(raw.slice(0, 8))) {
    throw new UserError(
      '\u5185\u5bb9\u4e0d\u53ef\u7528\uff1a\u8fd9\u770b\u8d77\u6765\u662f PDF \u4e8c\u8fdb\u5236\uff08\u4ee5 %PDF- \u5f00\u5934\uff09\uff0c\u4e0d\u662f\u6587\u672c\u3002',
      '\u8bf7\u5148\u7528 scripts/input-file.mjs \u628a PDF \u7684\u6587\u672c\u5c42\u62bd\u6210 Markdown\uff0c\u518d\u5bf9\u672c\u811a\u672c\u8fd0\u884c\u3002',
      EXIT.CONTENT,
    );
  }

  const text = normalizeText(raw);
  // Every counter below, including the usability probe and chars / latinWords, sees the body only.
  const { body, frontMatterLines } = splitFrontMatter(text);
  const cjk = (body.match(CJK_RE) || []).length;
  const latinWords = (body.match(LATIN_WORD_RE) || []).length;
  if (cjk === 0 && !/[A-Za-z]/.test(body)) {
    throw new UserError(
      '\u5185\u5bb9\u4e0d\u53ef\u7528\uff1a\u6b63\u6587\u91cc\u65e2\u6ca1\u6709\u4e2d\u65e5\u97e9\u6587\u5b57\uff0c\u4e5f\u6ca1\u6709\u62c9\u4e01\u5b57\u6bcd\u3002',
      '\u8bf7\u786e\u8ba4\u8f93\u5165\u662f\u6587\u7ae0\u6b63\u6587\uff1b\u53ef\u5148\u7528 scripts/input-file.mjs \u6216 scripts/input-wechat.mjs \u62ff\u5230\u5f52\u4e00\u5316 Markdown\u3002',
      EXIT.CONTENT,
    );
  }

  const stats = countStats(body);
  // textLines is pulled out first: a later key of the same name would be an overwrite, not a move.
  const { textLines, ...counters } = stats;
  const result = { ...base, ...counters, chars: cjk, latinWords, frontMatterLines, textLines };

  if (opts.json) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } else {
    process.stdout.write(formatHuman(stats, cjk, latinWords, frontMatterLines));
  }
  await flushStdout();
  process.exit(EXIT.OK);
}

function fail(err) {
  if (err instanceof UserError) {
    process.stderr.write(`\u9519\u8bef\uff1a${err.message}\n`);
    if (err.hint) process.stderr.write(`\u5904\u7406\u5efa\u8bae\uff1a${err.hint}\n`);
    process.exit(err.code);
  }
  process.stderr.write(`\u9519\u8bef\uff1a\u811a\u672c\u5185\u90e8\u5f02\u5e38\uff1a${err && err.message ? err.message : String(err)}\n`);
  process.stderr.write('\u5904\u7406\u5efa\u8bae\uff1a\u8fd9\u662f\u811a\u672c\u7f3a\u9677\uff0c\u8bf7\u628a\u4e0a\u65b9\u4fe1\u606f\u4e0e\u6240\u7528\u6587\u4ef6\u8def\u5f84\u53cd\u9988\u7ed9\u7ef4\u62a4\u8005\u3002\n');
  process.exit(EXIT.CONTENT);
}

main().catch(fail);
