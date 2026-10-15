#!/usr/bin/env node
/**
 * input-file.mjs — 本地文件（.md / .txt / .pdf）→ 归一化 Markdown 正文
 *
 * 用法：
 *   node scripts/input-file.mjs <文件路径> [--out <path>]
 *   node scripts/input-file.mjs - [--out <path>]      # 从 stdin 读粘贴正文，按 .txt 处理
 *   node scripts/input-file.mjs --help
 *
 * 输出：
 *   stdout = 归一化后的正文；stderr = 单行 JSON 元数据
 *
 * PDF 只做**文本层抽取**，不做 OCR。
 * 依赖：unpdf（MIT，零传递依赖），仅 PDF 路径需要；.md/.txt 只用 Node 内置模块。
 */

import { readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { dirname, resolve, extname, basename, join } from 'node:path';
import { createRequire } from 'node:module';

const EXIT = { OK: 0, USAGE: 1, INPUT: 2, PARSE: 4, DEPS: 5 };

const TEXT_EXT = new Set(['.md', '.markdown', '.txt']);
const PDF_EXT = new Set(['.pdf']);

class UserError extends Error {
  constructor(message, hint, code = EXIT.INPUT) {
    super(message);
    this.hint = hint;
    this.code = code;
  }
}

// ---------------------------------------------------------------- 命令行

function parseArgs(argv) {
  const opts = { input: null, out: null, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--help' || a === '-h') {
      opts.help = true;
    } else if (a === '--out' || a === '-o') {
      const v = argv[i + 1];
      if (!v) throw new UserError('--out 缺少参数值。', '用法：node scripts/input-file.mjs <文件路径> --out <输出路径>', EXIT.USAGE);
      opts.out = v;
      i += 1;
    } else if (a.startsWith('-') && a !== '-') {
      throw new UserError(`未知参数：${a}`, '支持的参数只有 --out <path> 与 --help；用 - 表示从 stdin 读入正文。', EXIT.USAGE);
    } else if (opts.input === null) {
      opts.input = a;
    } else {
      throw new UserError(`出现了多余的位置参数：${a}`, '一次只处理一个文件。', EXIT.USAGE);
    }
  }
  return opts;
}

function usage() {
  return [
    '用法：node scripts/input-file.mjs <文件路径> [--out <输出路径>]',
    '',
    '  支持：.md / .markdown / .txt（直读）· .pdf（仅文本层抽取，不做 OCR）· -（从 stdin 读粘贴正文）',
    '',
    '  不带 --out：正文写 stdout，元数据 JSON 写 stderr。',
    '  带 --out：正文写文件，元数据 JSON 仍写 stderr。',
  ].join('\n');
}

// ---------------------------------------------------------------- 文本归一化

/** 通用正文归一化：统一换行、折叠空白、去掉行尾空格、连续空行压成一行。 */
function normalizeText(text) {
  const lines = String(text)
    .replace(/^\ufeff/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\u0000/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/\u200b|\u200c|\u200d|\ufeff/g, '')
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').replace(/[ \t]+$/, ''));

  const out = [];
  for (const line of lines) {
    if (line === '' && (out.length === 0 || out[out.length - 1] === '')) continue;
    out.push(line);
  }
  while (out.length && out[out.length - 1] === '') out.pop();
  return out.join('\n');
}

const CJK_CLASS = '\\u3000-\\u303f\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff\\uff01-\\uff60';

/**
 * PDF 文本层归一化。
 * 额外处理：PDF 抽出的中文常在字与字之间插空格（"我 们 的"），
 * 这里只删**两侧都是中日韩字符/标点**的空格；中文与拉丁字母/数字之间的空格保留（"共 30 家"）。
 */
function normalizePdfText(text) {
  const joined = String(text).replace(
    new RegExp(`([${CJK_CLASS}])[ \\t]+(?=[${CJK_CLASS}])`, 'g'),
    '$1',
  );
  return normalizeText(joined);
}

function countChars(text) {
  const cjk = (text.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff]/g) || []).length;
  const latinWords = (text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
  return {
    chars: cjk + latinWords,
    cjk,
    latinWords,
    nonSpaceChars: text.replace(/\s+/g, '').length,
    lines: text === '' ? 0 : text.split('\n').filter((l) => l.trim() !== '').length,
  };
}

// ---------------------------------------------------------------- PDF

const PDF_LIB = 'unpdf';
const INSTALL_HINT =
  '安装命令（在 critical-reader 仓库根目录执行）：\n' +
  '  npm install unpdf        # 或： pnpm add unpdf\n' +
  '或直接安装 pdfjs-dist（Apache-2.0）：npm install pdfjs-dist\n' +
  '注意：严禁引入 PyMuPDF / fitz（AGPL-3.0，会污染本项目可分发许可，见 docs/DECISIONS.md #23）。';

async function loadPdfLib() {
  try {
    return await import('unpdf');
  } catch (err) {
    if (err && (err.code === 'ERR_MODULE_NOT_FOUND' || /Cannot find package/.test(String(err.message)))) {
      throw new UserError(`缺少 PDF 依赖 ${PDF_LIB}（未安装 node_modules）。`, INSTALL_HINT, EXIT.DEPS);
    }
    throw err;
  }
}

/** 读出依赖的真实版本与许可（从解析到的入口文件向上找同名 package.json，兼容 pnpm 的 .pnpm 布局）。 */
function pkgVersion(name) {
  try {
    const require = createRequire(import.meta.url);
    let dir = dirname(require.resolve(name));
    for (let i = 0; i < 4; i += 1) {
      const candidate = join(dir, 'package.json');
      if (existsSync(candidate)) {
        const pj = JSON.parse(readFileSync(candidate, 'utf8'));
        if (pj.name === name) return `${name}@${pj.version} (${pj.license || '许可未声明'})`;
      }
      dir = dirname(dir);
    }
  } catch {
    /* 拿不到版本不影响主流程 */
  }
  return `${name}@unknown`;
}

/**
 * pdf.js 遇到异常字体/结构时会直接往控制台打 "Warning: …"（实测 t-hotel.pdf 触发
 * "Warning: TT: undefined function: 3"），会污染「stderr 只有一行 JSON」的约定。
 * 这里把解析期间的库日志收进 meta.pdfWarnings，既不污染通道也不丢诊断信息。
 */
async function withCapturedConsole(fn) {
  const methods = ['log', 'info', 'warn', 'error', 'debug'];
  const original = {};
  const captured = [];
  for (const m of methods) {
    original[m] = console[m];
    console[m] = (...args) => {
      if (captured.length >= 20) return;
      captured.push(
        args
          .map((a) => {
            if (typeof a === 'string') return a;
            try {
              return JSON.stringify(a);
            } catch {
              return String(a);
            }
          })
          .join(' '),
      );
    };
  }
  try {
    return { value: await fn(), captured };
  } finally {
    for (const m of methods) console[m] = original[m];
  }
}

function mapPdfError(err) {
  const name = (err && err.name) || '';
  const msg = String((err && err.message) || err);
  if (/PasswordException|password/i.test(`${name} ${msg}`)) {
    return new UserError(
      '该 PDF 已加密，需要密码才能打开。',
      '请先用阅读器去掉密码保护（另存为无密码副本）后重试。本工具 v1 不支持传密码。',
      EXIT.PARSE,
    );
  }
  if (/InvalidPDF|Invalid PDF structure|FormatError/i.test(`${name} ${msg}`)) {
    return new UserError(
      `文件不是有效的 PDF（${name || '解析失败'}）。`,
      '请确认文件完整、未损坏；若后缀是 .pdf 但内容其实是别的格式（如 HTML/图片被改名），请改用正确的输入方式。',
      EXIT.PARSE,
    );
  }
  return new UserError(`PDF 解析失败：${msg}`, '请确认该 PDF 能在普通阅读器里正常打开；若仍失败，请把文件与报错反馈给维护者。', EXIT.PARSE);
}

async function extractPdf(filePath, meta) {
  let buf;
  try {
    buf = readFileSync(filePath);
  } catch (err) {
    throw new UserError(`读取失败：${err.message}`, '请检查文件是否被其它程序占用、以及当前用户是否有读取权限。');
  }
  if (!buf.length) throw new UserError('文件是空的（0 字节）。', '请确认路径指向的 PDF 文件内容完整。');

  const unpdf = await loadPdfLib();
  meta.pdfLib = pkgVersion(PDF_LIB);

  let doc;
  let text;
  let totalPages;
  let parsed;
  try {
    parsed = await withCapturedConsole(async () => {
      doc = await unpdf.getDocumentProxy(new Uint8Array(buf));
      totalPages = doc.numPages;
      return unpdf.extractText(doc, { mergePages: true });
    });
  } catch (err) {
    throw mapPdfError(err);
  }
  ({ text } = parsed.value);
  meta.pdfWarnings = parsed.captured.length ? parsed.captured : null;

  meta.pages = totalPages;

  try {
    const info = (await doc.getMetadata()).info || {};
    meta.pdfTitle = info.Title ? String(info.Title) : null;
    meta.pdfAuthor = info.Author ? String(info.Author) : null;
    meta.pdfProducer = info.Producer ? String(info.Producer) : null;
    meta.pdfCreationDate = info.CreationDate ? String(info.CreationDate) : null;
  } catch {
    meta.pdfTitle = null;
  }

  if (typeof text !== 'string') text = Array.isArray(text) ? text.join('\n\n') : '';

  const normalized = normalizePdfText(text);
  const meaningful = normalized.replace(/\s+/g, '').length;
  if (meaningful < 20) {
    throw new UserError(
      `该 PDF 无文本层，可能是扫描件，本工具 v1 不支持 OCR。（共 ${totalPages} 页，抽出 ${meaningful} 个非空白字符）`,
      '处理方式：① 用带 OCR 的工具（如 Adobe Acrobat、WPS、ABBYY）先做 OCR 再导出为「文本层 PDF」或 .txt；② 或把正文粘贴成 .txt 后重新运行本脚本。',
      EXIT.PARSE,
    );
  }

  meta.textLayer = 'yes';
  return normalized;
}

// ---------------------------------------------------------------- 主流程

function readStdin() {
  return new Promise((res, rej) => {
    const chunks = [];
    process.stdin.on('data', (c) => chunks.push(c));
    process.stdin.on('end', () => res(Buffer.concat(chunks).toString('utf8')));
    process.stdin.on('error', rej);
  });
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    process.stdout.write(`${usage()}\n`);
    process.exit(EXIT.OK);
  }
  if (!opts.input) {
    process.stderr.write(`${usage()}\n`);
    process.exit(EXIT.USAGE);
  }

  const meta = {
    ok: true,
    source: 'file',
    input: opts.input,
    path: null,
    format: null,
    bytes: null,
    chars: null,
    cjk: null,
    latinWords: null,
    nonSpaceChars: null,
    lines: null,
    pages: null,
    pdfLib: null,
    pdfTitle: null,
    pdfAuthor: null,
    pdfProducer: null,
    pdfCreationDate: null,
    textLayer: null,
    pdfWarnings: null,
    out: null,
    parsedAt: new Date().toISOString(),
  };

  let body;

  if (opts.input === '-') {
    meta.path = '(stdin)';
    meta.format = 'txt';
    meta.input = '(stdin)';
    const raw = await readStdin();
    meta.bytes = Buffer.byteLength(raw, 'utf8');
    body = normalizeText(raw);
    if (body.replace(/\s+/g, '').length < 20) {
      throw new UserError('从 stdin 读到的正文过短（少于 20 个非空白字符）。', '请确认已把正文通过管道传入，例如：Get-Content 文章.txt -Encoding UTF8 | node scripts/input-file.mjs -');
    }
  } else {
    const target = resolve(opts.input);
    meta.path = target;
    let st;
    try {
      st = statSync(target);
    } catch {
      throw new UserError(
        `找不到文件：${target}`,
        '请检查路径拼写；路径含空格或中文时用引号包起来，例如 node scripts/input-file.mjs "C:\\路径\\文章.pdf"',
      );
    }
    if (st.isDirectory()) {
      throw new UserError(`这是一个目录，不是文件：${target}`, '本工具 v1 只做单篇，请指向具体的 .md / .txt / .pdf 文件。');
    }
    if (!st.size) throw new UserError(`文件是空的（0 字节）：${target}`, '请确认文件内容完整。');
    meta.bytes = st.size;

    const ext = extname(target).toLowerCase();
    meta.format = TEXT_EXT.has(ext) ? (ext === '.txt' ? 'txt' : 'md') : PDF_EXT.has(ext) ? 'pdf' : null;

    if (!meta.format) {
      throw new UserError(
        `不支持的文件类型：${ext || '(无扩展名)'}（${basename(target)}）`,
        '支持的输入：.md / .markdown / .txt / .pdf；其它格式请先转成 .txt 或带文本层的 .pdf。公众号文章请用 input-wechat.mjs。',
      );
    }

    if (meta.format === 'pdf') {
      body = await extractPdf(target, meta);
    } else {
      let raw;
      try {
        raw = readFileSync(target, 'utf8');
      } catch (err) {
        throw new UserError(`读取失败：${err.message}`, '请检查文件是否被占用、以及当前用户是否有读取权限。');
      }
      if (/^\s*<(!doctype|html)\b/i.test(raw.slice(0, 400))) {
        throw new UserError('文件内容看起来是 HTML，不是文本文档。', '若是微信文章，请用 input-wechat.mjs 或先在浏览器里另存为 Markdown/纯文本。');
      }
      body = normalizeText(raw);
      if (body.replace(/\s+/g, '').length < 20) {
        throw new UserError(`正文过短（${body.replace(/\s+/g, '').length} 个非空白字符）。`, '请确认文件里确实有正文内容。');
      }
    }
  }

  Object.assign(meta, countChars(body));

  const output = `${body}\n`;
  if (opts.out) {
    const outTarget = resolve(opts.out);
    mkdirSync(dirname(outTarget), { recursive: true });
    writeFileSync(outTarget, output, 'utf8');
    meta.out = outTarget;
    meta.outBytes = Buffer.byteLength(output, 'utf8');
  } else {
    process.stdout.write(output);
  }

  process.stderr.write(`${JSON.stringify(meta)}\n`);
  process.exit(EXIT.OK);
}

function fail(err) {
  if (err instanceof UserError) {
    process.stderr.write(`错误：${err.message}\n`);
    if (err.hint) process.stderr.write(`处理建议：${err.hint}\n`);
    process.exit(err.code);
  }
  process.stderr.write(`错误：脚本内部异常：${err && err.message ? err.message : String(err)}\n`);
  process.stderr.write('处理建议：这是脚本缺陷，请把上方信息与所用文件路径反馈给维护者。\n');
  process.exit(EXIT.PARSE);
}

main().catch(fail);
