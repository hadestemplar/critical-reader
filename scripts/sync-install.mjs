// 把仓库里「可分发集合」同步到 DSH 的技能安装目录。
//
// 为什么需要这个脚本：DSH 实际加载的是安装目录那一份，不是仓库那一份。两边
// 一旦不同步，判定者读到的是旧协议，而仓库里的一切看起来都对——本项目已经
// 被这个形态伤过一次（安装目录的 SKILL.md 指向已退役的旧链文件）。
//
// 为什么可分发集合不等于「仓库全部」：`00-protocol.md` §5.4 规定判定者在出
// 判定之前不得读 `examples/` 与 `docs/`（那里有具体文章的判词）。所以那份
// 白名单不是体积取舍，是被协议强制出来的洁净边界——把 `examples/` 装进去
// 等于主动违反自己的洁净约束。
//
// 用法：
//   node scripts/sync-install.mjs            只报告差异，不改任何文件（默认）
//   node scripts/sync-install.mjs --write    真的同步
//
// 退出码：0 = 已一致；1 = 有差异（dry-run 时）或同步失败。

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';

const REPO = path.resolve(import.meta.dirname, '..');
const INSTALL = process.env.CRITICAL_READER_INSTALL
  || path.join(os.homedir(), '.dsh', 'skills', 'critical-reader');

// 可分发集合：只有这些会进安装目录。其余（docs/ examples/ testset/ CHANGELOG.md
// README.md package.json pnpm-lock.yaml .gitignore .git）一律不进。
const DISTRIBUTABLE = ['SKILL.md', 'LICENSE', 'references', 'templates', 'scripts'];

// 安装目录里允许存在、但不来自仓库的东西。
const INSTALL_LOCAL = ['node_modules'];

const WRITE = process.argv.includes('--write');

function walk(root) {
  const out = [];
  const rec = (dir, rel) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const abs = path.join(dir, e.name);
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) rec(abs, r);
      else out.push({ rel: r, abs });
    }
  };
  rec(root, '');
  return out;
}

const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex').slice(0, 16);

// 仓库侧：可分发集合里的全部文件
const repoFiles = [];
for (const item of DISTRIBUTABLE) {
  const abs = path.join(REPO, item);
  if (!fs.existsSync(abs)) {
    console.error(`[sync-install] 仓库里缺少可分发项：${item}`);
    process.exit(1);
  }
  if (fs.statSync(abs).isDirectory()) {
    for (const f of walk(abs)) repoFiles.push({ rel: `${item}/${f.rel}`, abs: f.abs });
  } else repoFiles.push({ rel: item, abs });
}

// 安装侧：除 node_modules 外的全部文件
const installFiles = fs.existsSync(INSTALL)
  ? walk(INSTALL).filter((f) => !INSTALL_LOCAL.some((k) => f.rel === k || f.rel.startsWith(`${k}/`)))
  : [];

const repoMap = new Map(repoFiles.map((f) => [f.rel, f]));
const installMap = new Map(installFiles.map((f) => [f.rel, f]));

const missing = [];   // 在仓库、不在安装目录
const differing = []; // 两边都有、内容不同
const extra = [];     // 在安装目录、不在仓库（应删）

for (const [rel, f] of repoMap) {
  const g = installMap.get(rel);
  if (!g) missing.push(rel);
  else if (sha(f.abs) !== sha(g.abs)) differing.push(rel);
}
for (const rel of installMap.keys()) if (!repoMap.has(rel)) extra.push(rel);

console.log(`仓库   ：${REPO}`);
console.log(`安装目录：${INSTALL}`);
console.log(`可分发文件 ${repoMap.size} 个；安装目录 ${installMap.size} 个`);
console.log(`  缺失（仓库有、安装无） ${missing.length}`);
console.log(`  内容不同              ${differing.length}`);
console.log(`  多余（安装有、仓库无） ${extra.length}`);
for (const r of missing) console.log(`  - MISSING  ${r}`);
for (const r of differing) console.log(`  - DIFFER   ${r}`);
for (const r of extra) console.log(`  - EXTRA    ${r}`);

const drift = missing.length + differing.length + extra.length;

if (!WRITE) {
  if (drift === 0) console.log('已一致（dry-run，未改动任何文件）。');
  else console.log(`有 ${drift} 处差异。加 --write 才会真的同步（dry-run，未改动任何文件）。`);
  process.exit(drift === 0 ? 0 : 1);
}

fs.mkdirSync(INSTALL, { recursive: true });
for (const [rel, f] of repoMap) {
  const dst = path.join(INSTALL, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(f.abs, dst);
}
for (const rel of extra) {
  const p = path.join(INSTALL, rel);
  const real = path.resolve(p);
  if (!real.startsWith(path.resolve(INSTALL) + path.sep)) {
    console.error(`[sync-install] 拒绝删除越界路径：${real}`);
    process.exit(1);
  }
  fs.rmSync(p, { force: true });
  console.log(`  - REMOVED  ${rel}`);
}
// 清掉可能变空的目录（rubric/ 退役后就是这种情形）
for (const dir of fs.readdirSync(INSTALL)) {
  const p = path.join(INSTALL, dir);
  if (fs.statSync(p).isDirectory() && !INSTALL_LOCAL.includes(dir) && fs.readdirSync(p).length === 0) {
    fs.rmdirSync(p);
    console.log(`  - RMDIR    ${dir}/`);
  }
}
console.log(`已同步：写入 ${repoMap.size} 个、删除 ${extra.length} 个。`);
process.exit(0);
