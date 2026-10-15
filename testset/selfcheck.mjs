// testset/selfcheck.mjs -- re-runnable self-check for the sample set.
// Usage:  node testset/selfcheck.mjs            (checks every pair in testset/samples)
//         node testset/selfcheck.mjs --quiet    (summary only)
// ASCII-only source on purpose: no non-ASCII literal may appear here (see AGENTS.md).
// Chinese text is matched through \u escapes / is read from the files themselves.
import fs from 'node:fs';
import path from 'node:path';

const QUIET = process.argv.includes('--quiet');
const ROOT = path.resolve(import.meta.dirname);
const SAMPLES = path.join(ROOT, 'samples');

const FM_KEYS = ['title', 'slug', 'source_url', 'account', 'platform', 'publish_date', 'word_count', 'char_count', 'images', 'category', 'tier', 'length_band', 'collected_at', 'collect_method', 'fetch_status'];
const META_KEYS = ['slug', 'title', 'source_url', 'account', 'platform', 'publish_date', 'word_count', 'images', 'collected_at', 'collect_method', 'fetch_status', 'category', 'tier', 'category_note', 'length_band', 'char_count', 'word_count_method', 'image_placeholders', 'sample_url_id', 'http_status', 'final_url', 'html_bytes', 'publish_date_raw', 'body_source', 'discovered_via', 'license_note', 'collected_by', 'built_at'];
const TIERS = ['A', 'B', 'C'];
const BANDS = ['\u77ed', '\u4e2d', '\u957f']; // short / medium / long
const CJK = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/g;
const PLACEHOLDER = /!\[\u56fe(\d+)\]/g; // ![image N]
const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF\u00AD\u180E]/;
const HTML_RESIDUE = /<\/?[A-Za-z][A-Za-z0-9-]*(\s[^<>]*)?\/?>/;

// Grandfathered defects of the FIRST batch, found by this check on 2026-10-13.
// They are reported on every run as WARN and never as a failure: the first batch's
// bodies are kept byte-as-fetched (README section 3.4 forbids post-hoc cleaning).
// Any file NOT listed here fails hard, so new samples cannot inherit these defects.
const LEGACY_ZERO_WIDTH = ['pika-video-generation-tutorial', 'python-progress-bar-methods'];
const LEGACY_EMPTY_DISCOVERED_VIA = ['python-progress-bar-methods', 'token-ai-sociotechnical-imagination', 'wang-chuan-forty-years'];

let checks = 0;
let failures = 0;
let warnings = 0;
const problems = [];
const warns = [];
const fail = (slug, what, detail) => { failures += 1; problems.push(`${slug} :: ${what} :: ${detail}`); };
const warn = (slug, what, detail) => { warnings += 1; warns.push(`${slug} :: ${what} :: ${detail}`); };
const check = (slug, what, ok, detail) => { checks += 1; if (!ok) fail(slug, what, detail || ''); };
const checkLegacy = (slug, what, ok, legacyList, detail) => {
  checks += 1;
  if (ok) return;
  if (legacyList.includes(slug)) warn(slug, what, `${detail} [legacy first-batch file, kept as fetched]`);
  else fail(slug, what, detail);
};
const eq = (slug, what, got, want) => check(slug, what, got === want, `got=${JSON.stringify(got)} want=${JSON.stringify(want)}`);

function parseFrontMatter(text) {
  const lines = text.split('\n');
  if (lines[0].trim() !== '---') return { error: 'no front-matter opener' };
  let end = -1;
  for (let i = 1; i < lines.length; i += 1) if (lines[i].trim() === '---') { end = i; break; }
  if (end === -1) return { error: 'no front-matter closer' };
  const keys = [];
  const values = {};
  for (let i = 1; i < end; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;
    const at = line.indexOf(': ');
    if (at === -1) return { error: `unparsable front-matter line ${i + 1}: ${line}` };
    const key = line.slice(0, at);
    const raw = line.slice(at + 2);
    keys.push(key);
    if (raw.startsWith('"')) {
      try { values[key] = JSON.parse(raw); } catch { return { error: `bad quoted value on line ${i + 1}` }; }
    } else { values[key] = raw; }
  }
  const body = lines.slice(end + 1).join('\n');
  return { keys, values, body };
}

const files = fs.readdirSync(SAMPLES).sort();
const mds = files.filter((f) => f.endsWith('.md'));
const metas = files.filter((f) => f.endsWith('.meta.json'));

// 1. every .md has a .meta.json and vice versa
const mdSlugs = new Set(mds.map((f) => f.replace(/\.md$/, '')));
const metaSlugs = new Set(metas.map((f) => f.replace(/\.meta\.json$/, '')));
for (const s of mdSlugs) check(s, 'orphan-md', metaSlugs.has(s), 'no matching .meta.json');
for (const s of metaSlugs) check(s, 'orphan-meta', mdSlugs.has(s), 'no matching .md');

const seenSlugs = new Map();
for (const slug of [...mdSlugs].sort()) {
  const mdPath = path.join(SAMPLES, `${slug}.md`);
  const metaPath = path.join(SAMPLES, `${slug}.meta.json`);
  if (!metaSlugs.has(slug)) continue;
  const mdRaw = fs.readFileSync(mdPath, 'utf8');
  const metaRaw = fs.readFileSync(metaPath, 'utf8');
  const meta = JSON.parse(metaRaw);
  const fm = parseFrontMatter(mdRaw);
  if (fm.error) { fail(slug, 'front-matter', fm.error); continue; }

  // 2. slug uniqueness + filename == slug
  if (seenSlugs.has(meta.slug)) fail(slug, 'slug-duplicate', `also in ${seenSlugs.get(meta.slug)}`);
  else seenSlugs.set(meta.slug, `${slug}.md`);
  eq(slug, 'md-filename==slug', slug, meta.slug);

  // 3. key set and order
  eq(slug, 'meta-key-count', Object.keys(meta).length, META_KEYS.length);
  eq(slug, 'meta-key-order', Object.keys(meta).join(','), META_KEYS.join(','));
  eq(slug, 'fm-key-count', fm.keys.length, FM_KEYS.length);
  eq(slug, 'fm-key-order', fm.keys.join(','), FM_KEYS.join(','));

  // 4. front-matter <-> meta consistency
  for (const k of ['title', 'slug', 'source_url', 'account', 'platform', 'publish_date', 'collected_at', 'category', 'tier', 'length_band', 'collect_method', 'fetch_status']) {
    eq(slug, `fm.meta.${k}`, fm.values[k], meta[k]);
  }
  eq(slug, 'fm.meta.word_count', Number(fm.values.word_count), meta.word_count);
  eq(slug, 'fm.meta.char_count', Number(fm.values.char_count), meta.char_count);
  eq(slug, 'fm.meta.images', Number(fm.values.images), meta.images);
  eq(slug, 'meta.image_placeholders==images', meta.image_placeholders, meta.images);
  eq(slug, 'meta.sample_url_id==slug-of-url', `https://mp.weixin.qq.com/s/${meta.sample_url_id}`, meta.source_url);
  check(slug, 'meta.platform', meta.platform === 'weixin', `got=${meta.platform}`);
  check(slug, 'meta.fetch_status', meta.fetch_status === 'ok', `got=${meta.fetch_status}`);
  check(slug, 'meta.http_status', meta.http_status === 200, `got=${meta.http_status}`);
  check(slug, 'meta.category_note-nonempty', typeof meta.category_note === 'string' && meta.category_note.trim().length > 0, 'empty');
  check(slug, 'meta.discovered_via-array', Array.isArray(meta.discovered_via), 'not an array');
  checkLegacy(slug, 'meta.discovered_via-nonempty', Array.isArray(meta.discovered_via) && meta.discovered_via.length > 0, LEGACY_EMPTY_DISCOVERED_VIA, 'empty array');
  check(slug, 'meta.tier-enum', TIERS.includes(meta.tier), `got=${meta.tier}`);
  check(slug, 'meta.length_band-enum', BANDS.includes(meta.length_band), `got=${meta.length_band}`);

  // 5. counts recomputed from the body itself
  const body = fm.body;
  const cjk = (body.match(CJK) || []).length;
  const nonSpace = body.replace(/\s+/g, '').length;
  const nums = [...body.matchAll(PLACEHOLDER)].map((m) => Number(m[1]));
  eq(slug, 'word_count==cjk', meta.word_count, cjk);
  eq(slug, 'char_count==nonSpaceChars', meta.char_count, nonSpace);
  eq(slug, 'placeholder-count==images', nums.length, meta.images);
  const distinct = [...new Set(nums)].sort((a, b) => a - b);
  const expected = Array.from({ length: meta.images }, (_, i) => i + 1);
  eq(slug, 'placeholder-numbers==1..N', distinct.join(','), expected.join(','));
  let ascending = true;
  for (let i = 1; i < nums.length; i += 1) if (nums[i] <= nums[i - 1]) ascending = false;
  check(slug, 'placeholder-order-ascending', ascending, `nums=${nums.join(',')}`);

  // 6. hygiene
  check(slug, 'no-CRLF', !mdRaw.includes('\r') && !metaRaw.includes('\r'), 'carriage return found');
  const zw = mdRaw.match(new RegExp(ZERO_WIDTH, 'g')) || [];
  checkLegacy(slug, 'no-zero-width', zw.length === 0, LEGACY_ZERO_WIDTH, `zero-width x${zw.length} (${[...new Set(zw)].map((c) => 'U+' + c.codePointAt(0).toString(16).toUpperCase()).join(',')})`);
  const html = body.match(HTML_RESIDUE);
  check(slug, 'no-html-residue', !html, `found=${html && html[0]}`);
  check(slug, 'ends-with-newline', mdRaw.endsWith('\n') && metaRaw.endsWith('\n'), 'missing trailing newline');
  const tail = body.trimEnd().split('\n').filter(Boolean).slice(-1)[0] || '';
  check(slug, 'body-tail-nonempty', tail.length > 1, 'empty body tail');
}

if (!QUIET && problems.length) {
  console.log('--- failures ---');
  for (const p of problems) console.log(p);
}
if (!QUIET && warns.length) {
  console.log('--- warnings (grandfathered first-batch defects, see README 8.2) ---');
  for (const w of warns) console.log(w);
}
console.log(`samples=${mdSlugs.size} checks=${checks} passed=${checks - failures} failed=${failures} warnings=${warnings}`);
console.log(failures === 0 ? 'SELFCHECK OK' : 'SELFCHECK FAILED');
process.exit(failures === 0 ? 0 : 1);
