#!/usr/bin/env node
/**
 * input-wechat.mjs — 微信公众号分享短链 → 归一化 Markdown 正文
 *
 * 用法：
 *   node scripts/input-wechat.mjs <url> [--out <path>]
 *   node scripts/input-wechat.mjs --help
 *
 * 输出：
 *   stdout = 归一化 Markdown 正文（正文中的图片保留为 ![图N] 占位符）
 *   stderr = 单行 JSON 元数据
 *
 * 依赖：只用 Node 内置模块（全局 fetch）。零 LLM 调用，纯确定性解析。
 * URL 形态（实测，见 scripts/README.md §1）：
 *   A  /s/<id>                                         → 直接抓。
 *   B  /s?__biz=…&mid=…&idx=…&sn=…                     → 前置拒绝 exit=2（实测 100% 302 到验证码页）。
 *   C  /s?src=11&timestamp=…&ver=…&signature=…&new=1   → 不前置拒绝，实抓后按是否含 js_content 判定。
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const EXIT = { OK: 0, USAGE: 1, INPUT: 2, NETWORK: 3, PARSE: 4 };

const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';

/** 可预期的用户级失败：只打印可操作信息，不打印堆栈。 */
class UserError extends Error {
  constructor(message, hint, code = EXIT.INPUT) {
    super(message);
    this.hint = hint;
    this.code = code;
  }
}

// ---------------------------------------------------------------- 命令行

function parseArgs(argv) {
  const opts = { url: null, out: null, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--help' || a === '-h') {
      opts.help = true;
    } else if (a === '--out' || a === '-o') {
      const v = argv[i + 1];
      if (!v) throw new UserError('--out 缺少参数值。', '用法：node scripts/input-wechat.mjs <url> --out <文件路径>', EXIT.USAGE);
      opts.out = v;
      i += 1;
    } else if (a.startsWith('-') && a !== '-') {
      throw new UserError(`未知参数：${a}`, '支持的参数只有 --out <path> 与 --help。', EXIT.USAGE);
    } else if (opts.url === null) {
      opts.url = a;
    } else {
      throw new UserError(`出现了多余的位置参数：${a}`, '一次只处理一个链接。', EXIT.USAGE);
    }
  }
  return opts;
}

function usage() {
  return [
    '用法：node scripts/input-wechat.mjs <公众号分享链接> [--out <文件路径>]',
    '',
    '  接受 mp.weixin.qq.com/s/<id> 形态的分享短链（微信里「…」→ 复制链接 得到的那条）。',
    '  长链 https://mp.weixin.qq.com/s?__biz=…&mid=…&idx=…&sn=… 会被微信风控拦截，本工具显式拒绝（退出码 2）。',
    '  签名链 https://mp.weixin.qq.com/s?src=11&timestamp=…&ver=…&signature=…&new=1 会实际抓取：',
    '  抓到正文即成功（退出码 0），抓不到（签名过期 / 只返回空壳页）报「内容不可用」（退出码 4）。',
    '',
    '  不带 --out：Markdown 正文写 stdout，元数据 JSON 写 stderr。',
    '  带 --out：Markdown 正文写文件，元数据 JSON 仍写 stderr。',
  ].join('\n');
}

// ---------------------------------------------------------------- URL 形态判定

/** 长链形态：/s?__biz=…&mid=…&idx=…&sn=… —— 实测必被 302 到验证码页。原文保留，勿改。 */
const LONG_LINK_HINT =
  '检测到长链形态。微信对 ?__biz=…&mid=… 形态的链接做了风控（实测 302 到 mp.weixin.qq.com/mp/wappoc_appmsgcaptcha，页面文案「环境异常」），抓不到正文。' +
  '请在微信中打开该文章 → 右上角「…」→ 复制链接，改用得到的 https://mp.weixin.qq.com/s/<id> 分享短链后重试。';

/** 形态 A：/s/<id> 分享短链。形态 C：/s?src=11&timestamp=…&ver=…&signature=…&new=1 时效签名链。 */
const FORM_SHORT = 'A';
const FORM_SIGNED = 'C';

function classifyUrl(raw) {
  let s = String(raw).trim().replace(/^<|>$/g, '');
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;

  let u;
  try {
    u = new URL(s);
  } catch {
    throw new UserError(`无法解析为 URL：${raw}`, '请粘贴完整链接，例如 https://mp.weixin.qq.com/s/jnyzHQMecTY2C2HaK4Agfg');
  }

  if (!/^mp\.weixin\.qq\.com$/i.test(u.hostname)) {
    throw new UserError(
      `本脚本只处理 mp.weixin.qq.com 的链接，当前域名是 ${u.hostname}。`,
      '其它来源（PDF / MD / TXT / 粘贴正文）请改用：node scripts/input-file.mjs <文件路径>',
    );
  }

  const q = u.searchParams;
  const looksLong = ['__biz', 'mid', 'idx', 'sn', 'chksm'].some((k) => q.has(k) && k !== 'chksm');
  const looksSigned = q.has('signature') || (q.has('timestamp') && q.has('ver'));
  const shortMatch = /^\/s\/([A-Za-z0-9_-]{8,})\/?$/.exec(u.pathname);

  if (shortMatch) return { url: u, id: shortMatch[1], form: FORM_SHORT };

  // 形态 C（搜狗微信签名链）实测 3 条里 2 条可直接抓到正文，参数里也不含 __biz/mid/idx/sn，
  // 因此不再按「参数式链接」前置拒绝，改为实抓后由 js_content 是否存在判定（见 main）。
  if (looksSigned && !looksLong) return { url: u, id: null, form: FORM_SIGNED };

  if (u.pathname === '/s' || u.pathname === '/s/' || looksLong) {
    throw new UserError('链接形态是长链 / 参数式链接，微信会返回验证码页。', LONG_LINK_HINT);
  }

  throw new UserError(
    `无法识别的公众号链接形态：${u.pathname}`,
    '支持的只有分享短链 https://mp.weixin.qq.com/s/<id>。其它形态（mp 页面、临时链接、带 scene 参数的跳转页）本工具 v1 不支持。',
  );
}

// ---------------------------------------------------------------- 抓取

async function fetchArticle(url, meta, form) {
  let res;
  try {
    res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': CHROME_UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      signal: AbortSignal.timeout(45_000),
    });
  } catch (err) {
    const why = err && err.name === 'TimeoutError' ? '请求超时（45 秒）' : `请求失败：${err && err.message ? err.message : String(err)}`;
    throw new UserError(
      why,
      '检查本机网络/代理。注意本机 curl.exe 走 Windows schannel，HTTPS 会报 SEC_E_NO_CREDENTIALS；本脚本用 Node 自带 fetch（OpenSSL），不受该问题影响。若需代理，设置 HTTPS_PROXY 后重试。',
      EXIT.NETWORK,
    );
  }

  meta.finalUrl = res.url;
  meta.httpStatus = res.status;

  if (form !== FORM_SIGNED && /wappoc_appmsgcaptcha|\/mp\/wappoc/i.test(res.url)) {
    throw new UserError('请求被重定向到微信验证码页（wappoc_appmsgcaptcha）。', LONG_LINK_HINT);
  }
  if (res.status === 404 || res.status === 410) {
    throw new UserError(
      `文章不存在（HTTP ${res.status}）。`,
      '链接可能已被作者删除、被平台删除，或复制时缺字符。请确认能在微信里正常打开该文章后重试。',
    );
  }
  if (!res.ok) {
    throw new UserError(
      `抓取失败：HTTP ${res.status}。`,
      '若是 403/418，多为风控（换网络或稍后重试）；422/466 类多为链接异常。请先在微信中确认文章可正常打开。',
      EXIT.NETWORK,
    );
  }

  const html = await res.text();
  meta.htmlBytes = Buffer.byteLength(html, 'utf8');

  // 形态 C：验证码页 / 空壳页 / 正文页一律读回全文，由 main 统一按 js_content 是否存在给出 exit=4 证据。
  if (form === FORM_SIGNED) return html;

  if (!html || meta.htmlBytes < 500) {
    throw new UserError(
      `返回内容过短（${meta.htmlBytes} 字节），不是文章页。`,
      '请确认链接是微信里「复制链接」得到的分享短链，且该文章当前可访问。',
      EXIT.PARSE,
    );
  }
  return html;
}

// ---------------------------------------------------------------- 容器抽取

function hasAttr(tag, id) {
  const re = new RegExp(`(?:^|\\s)id\\s*=\\s*(?:"${id}"|'${id}'|${id})(?=[\\s/>]|$)`);
  return re.test(tag);
}

/** 精确按 id 抽 <div id="...">…</div>（深度计数，不受同名子串干扰）。 */
function extractDivById(html, id) {
  const openTag = /<div\b[^>]*>/gi;
  let m;
  while ((m = openTag.exec(html)) !== null) {
    if (!hasAttr(m[0], id)) continue;
    const innerStart = openTag.lastIndex;
    const tagRe = /<\/?div\b[^>]*>/gi;
    tagRe.lastIndex = innerStart;
    let depth = 1;
    let t;
    while ((t = tagRe.exec(html)) !== null) {
      if (t[0][1] === '/') {
        depth -= 1;
        if (depth === 0) return html.slice(innerStart, t.index);
      } else if (!/\/>$/.test(t[0])) {
        depth += 1;
      }
    }
    return null;
  }
  return null;
}

// ---------------------------------------------------------------- HTML → Markdown

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ensp: ' ', emsp: ' ', thinsp: ' ',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', mdash: '—', ndash: '–', hellip: '…',
  middot: '·', times: '×', divide: '÷', laquo: '«', raquo: '»', copy: '©', reg: '®', trade: '™',
  deg: '°', plusmn: '±', frac12: '½', sup2: '²', sup3: '³', bull: '•', dagger: '†',
  rarr: '→', larr: '←', harr: '↔', uarr: '↑', darr: '↓', sect: '§', para: '¶',
  euro: '€', pound: '£', yen: '¥', cent: '¢', brvbar: '¦', not: '¬', shy: '­',
};

function htmlDecode(s) {
  return String(s).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (whole, body) => {
    if (body[0] === '#') {
      const hex = body[1] === 'x' || body[1] === 'X';
      const cp = parseInt(hex ? body.slice(2) : body.slice(1), hex ? 16 : 10);
      if (Number.isFinite(cp) && cp > 0 && cp <= 0x10ffff) {
        try {
          return String.fromCodePoint(cp);
        } catch {
          return whole;
        }
      }
      return whole;
    }
    const key = body.toLowerCase();
    return Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, key) ? NAMED_ENTITIES[key] : whole;
  });
}

function stripTags(s) {
  return htmlDecode(String(s).replace(/<[^>]*>/g, '')).trim();
}

const BLOCK_END = 'p|div|section|article|header|footer|main|tr|table|figure|figcaption|pre|dl|dt|dd|hr';

/**
 * 正文 HTML → 归一化 Markdown。
 * 图片整体替换为 ![图N] 占位符，位置保留在原文处（后续判定需要知道「这里本来有图」）。
 */
function htmlToMarkdown(html) {
  let s = String(html);
  const imageSrcs = [];

  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  s = s.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = /\bdata-src\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(tag) || /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(tag);
    imageSrcs.push(src ? htmlDecode(src[1] ?? src[2] ?? '') : '');
    return `\n\n![图${imageSrcs.length}]\n\n`;
  });

  s = s.replace(/<h([1-6])\b[^>]*>/gi, (_m, n) => `\n\n${'#'.repeat(Number(n))} `);
  s = s.replace(/<\/h[1-6]\s*>/gi, '\n\n');
  s = s.replace(/<li\b[^>]*>/gi, '\n- ');
  s = s.replace(/<\/(li|ul|ol)\s*>/gi, '\n');
  s = s.replace(/<blockquote\b[^>]*>/gi, '\n> ');
  s = s.replace(/<\/blockquote\s*>/gi, '\n\n');
  s = s.replace(/<br\b[^>]*>/gi, '\n');
  s = s.replace(/<(td|th)\b[^>]*>/gi, ' | ');
  s = s.replace(/<\/(td|th)\s*>/gi, ' | ');
  s = s.replace(new RegExp(`<(?:${BLOCK_END})\\b[^>]*>`, 'gi'), '\n\n');
  s = s.replace(new RegExp(`</(?:${BLOCK_END})\\s*>`, 'gi'), '\n\n');

  s = s.replace(/<[^>]*>/g, '');
  s = htmlDecode(s);
  s = s.replace(/\u200b|\u200c|\u200d|\ufeff/g, '');

  const lines = [];
  for (const raw of s.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.replace(/[ \t\u00a0\u3000]+/g, ' ').trim();
    if (line === '' && (lines.length === 0 || lines[lines.length - 1] === '')) continue;
    lines.push(line);
  }
  while (lines.length && lines[lines.length - 1] === '') lines.pop();

  return { markdown: lines.join('\n'), imageSrcs };
}

// ---------------------------------------------------------------- 字段抽取

function cleanValue(v) {
  let s = String(v == null ? '' : v).trim();
  s = s.replace(/^htmlDecode\s*\(\s*/, '').replace(/\)\s*$/, '');
  s = s.replace(/^(['"])([\s\S]*)\1$/, '$2');
  s = htmlDecode(s);
  s = s.replace(/^['"\u2018\u2019\u201c\u201d\u300c\u300d]+/, '').replace(/['"\u2018\u2019\u201c\u201d\u300c\u300d]+$/, '');
  s = s.replace(/[ \t\u00a0]+/g, ' ').trim();
  return s;
}

/** 还原 JS 字符串字面量里的转义（\xNN / \uNNNN / \' / \" / \\ \/）。 */
function unescapeJsString(s) {
  return String(s).replace(/\\(x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|.)/g, (_m, esc) => {
    if (esc[0] === 'x') return String.fromCharCode(parseInt(esc.slice(1), 16));
    if (esc[0] === 'u') return String.fromCharCode(parseInt(esc.slice(1), 16));
    return esc;
  });
}

/**
 * 从页面 JS 变量抽字符串。
 * 真实形态：var msg_title = '标题'.html(false);  /  var nickname = "号名";  /  htmlDecode("…")
 * 引号匹配用「首个未转义同类引号」语义，避免跨引号吃到后续语句（曾把整段 JS 当标题）。
 */
function pickJsVar(html, names) {
  for (const name of names) {
    const re = new RegExp(
      `var\\s+${name}\\s*=\\s*(?:htmlDecode\\s*\\(\\s*)?(['"])((?:\\\\.|(?!\\1)[\\s\\S])*)\\1\\s*\\)?\\s*(?:\\.html\\s*\\(\\s*(?:true|false)\\s*\\))?\\s*;`,
    );
    const m = re.exec(html);
    if (m) {
      const v = cleanValue(unescapeJsString(m[2]));
      if (v) return v;
    }
  }
  return null;
}

function pickMeta(html, prop) {
  const re = new RegExp(`<meta\\s+[^>]*(?:property|name)\\s*=\\s*["']${prop}["'][^>]*>`, 'i');
  const m = re.exec(html);
  if (!m) return null;
  const c = /content\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(m[0]);
  if (!c) return null;
  const v = cleanValue(c[1] ?? c[2] ?? '');
  return v || null;
}

function pickNodeText(html, attrs) {
  for (const attr of attrs) {
    const re = new RegExp(`<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*${attr}[^>]*>([\\s\\S]*?)<\\/\\1\\s*>`, 'i');
    const m = re.exec(html);
    if (m) {
      const v = stripTags(m[2]);
      if (v) return v;
    }
  }
  return null;
}

function extractTitle(html) {
  return (
    pickJsVar(html, ['msg_title']) ||
    pickNodeText(html, ['id\\s*=\\s*["\']activity-name["\']']) ||
    pickMeta(html, 'og:title') ||
    pickNodeText(html, ['class\\s*=\\s*["\'][^"\']*rich_media_title'])
  );
}

function extractAccount(html) {
  return (
    pickJsVar(html, ['nickname', 'user_name']) ||
    pickNodeText(html, ['id\\s*=\\s*["\']js_name["\']']) ||
    pickMeta(html, 'og:article:author') ||
    pickNodeText(html, ['id\\s*=\\s*["\']js_profile_qrcode_name["\']'])
  );
}

const CST_OFFSET_SECONDS = 8 * 3600;
const TZ = 'Asia/Shanghai';

/** 时间戳按 UTC+8 折算为 YYYY-MM-DD（与机器时区无关，保证跨机器一致）。 */
function formatCstDate(tsSeconds) {
  return new Date((Number(tsSeconds) + CST_OFFSET_SECONDS) * 1000).toISOString().slice(0, 10);
}

function extractPublishedAt(html) {
  const ts = /var\s+(?:ct|create_time|oriCreateTime)\s*=\s*["']?(\d{9,11})["']?/.exec(html);
  if (ts) return { publishedAt: formatCstDate(ts[1]), publishedTs: Number(ts[1]), publishedAtSource: 'var ct/create_time' };

  const literal = /var\s+(?:publish_time|create_time|ct)\s*=\s*["'](\d{4}-\d{2}-\d{2})[ T]?([\d:]{0,8})["']/.exec(html);
  if (literal) return { publishedAt: literal[1], publishedTs: null, publishedAtSource: 'var publish_time (字符串)' };

  const meta = pickMeta(html, 'article:published_time') || pickMeta(html, 'og:release_date');
  if (meta) {
    const d = /^(\d{4}-\d{2}-\d{2})/.exec(meta);
    if (d) return { publishedAt: d[1], publishedTs: null, publishedAtSource: 'meta article:published_time' };
  }
  return { publishedAt: null, publishedTs: null, publishedAtSource: null };
}

/** 字数口径：CJK 字符数 + 拉丁/数字词数（与「镜子别酷」样例的 2764 字口径一致）。 */
function countChars(text) {
  const cjk = (text.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff]/g) || []).length;
  const latinWords = (text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
  return {
    chars: cjk + latinWords,
    cjk,
    latinWords,
    nonSpaceChars: text.replace(/\s+/g, '').length,
    lines: text === '' ? 0 : text.split('\n').filter((l) => l.trim() !== '').length,
    images: (text.match(/!\[图\d+\]/g) || []).length,
  };
}

// ---------------------------------------------------------------- 主流程

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || (!opts.url && !opts.out)) {
    process.stdout.write(`${usage()}\n`);
    process.exit(opts.help ? EXIT.OK : EXIT.USAGE);
  }

  const { url, form } = classifyUrl(opts.url);
  const meta = {
    ok: true,
    source: 'wechat',
    input: String(opts.url),
    url: url.href,
    finalUrl: null,
    httpStatus: null,
    htmlBytes: null,
    title: null,
    account: null,
    publishedAt: null,
    publishedTs: null,
    publishedAtSource: null,
    chars: null,
    cjk: null,
    latinWords: null,
    nonSpaceChars: null,
    lines: null,
    images: null,
    imageSrcs: null,
    out: null,
    fetchedAt: new Date().toISOString(),
  };

  const html = await fetchArticle(url, meta, form);

  const contentHtml = extractDivById(html, 'js_content');
  if (!contentHtml) {
    if (form === FORM_SIGNED) {
      const captcha = /wappoc_appmsgcaptcha|\/mp\/wappoc/i.test(meta.finalUrl || '');
      throw new UserError(
        `内容不可用：页面里没有正文容器 div id="js_content"${captcha ? '（响应被重定向到微信验证码页）' : ''}。`,
        `实测证据：HTTP 状态码 ${meta.httpStatus}；响应 ${meta.htmlBytes} 字节；未检出 js_content。` +
          '该链接是形态 C —— 带 timestamp 的时效签名链（/s?src=11&timestamp=…&ver=…&signature=…&new=1），签名会过期，也可能被微信换成空壳页。' +
          '处理：在微信中打开该文章 → 右上角「…」→ 复制链接，改用得到的 https://mp.weixin.qq.com/s/<id> 分享短链后重试。',
        EXIT.PARSE,
      );
    }
    if (/wappoc_appmsgcaptcha|环境异常|完成验证后即可继续访问/.test(html)) {
      throw new UserError('页面是微信「环境异常」验证页。', LONG_LINK_HINT, EXIT.PARSE);
    }
    throw new UserError(
      '页面里没有正文容器 div id="js_content"。',
      '常见原因：分享短链被平台失效/删除、文章被投诉下架、或该链接其实不是文章页。请先在微信里确认文章可正常打开；若已确认可打开，请把链接与复现时间反馈给维护者。',
      EXIT.PARSE,
    );
  }

  const { markdown, imageSrcs } = htmlToMarkdown(contentHtml);
  if (markdown.replace(/\s+/g, '').length < 20) {
    throw new UserError(
      `正文提取结果过短（${markdown.replace(/\s+/g, '').length} 个非空白字符，${imageSrcs.length} 张图）。`,
      '多半是该文章正文为纯图片/视频卡片（例如仅有图片的号外）。本工具 v1 不做 OCR，无法提供文本正文。',
      EXIT.PARSE,
    );
  }

  meta.title = extractTitle(html);
  meta.account = extractAccount(html);
  Object.assign(meta, extractPublishedAt(html));
  Object.assign(meta, countChars(markdown));
  meta.images = imageSrcs.length;
  meta.imageSrcs = imageSrcs.slice(0, 200);

  const body = `${markdown}\n`;
  if (opts.out) {
    const target = resolve(opts.out);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, body, 'utf8');
    meta.out = target;
    meta.outBytes = Buffer.byteLength(body, 'utf8');
  } else {
    process.stdout.write(body);
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
  process.stderr.write('处理建议：这是脚本缺陷，请把上方信息与所用 URL 反馈给维护者。\n');
  process.exit(EXIT.PARSE);
}

main().catch(fail);
