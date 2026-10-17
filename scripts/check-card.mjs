#!/usr/bin/env node
// check-card.mjs - mechanical linter for the screening card template (read-only).
// Every check below is justified by a line of templates/screening-card.md; see RULES.md table in the task report.
import fs from "node:fs";

const BT = String.fromCharCode(96);
const STATUS = ["\u5DF2\u8BC4\u4F30", "\u672A\u8BC4\u4F30", "\u672A\u6838\u67E5", "\u65E0\u6CD5\u5224\u5B9A", "\u4E0D\u9002\u7528"];
const GRADES = ["A", "B", "C", "D", "\u2014"];
const COLS = ["\u8BF4\u5F97\u6709\u9053\u7406\u5417", "\u8BF4\u7684\u662F\u771F\u7684\u5417", "\u503C\u5F97\u8BFB\u5417"];
const LIGHTS = ["\uD83D\uDFE2", "\uD83D\uDFE1", "\uD83D\uDD34", "\uD83D\uDD35"];

function strip(s) {
  return String(s).split(BT).join("").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
}

function splitRow(line) {
  let t = line.trim();
  if (t.startsWith("|")) t = t.slice(1);
  if (t.endsWith("|")) t = t.slice(0, -1);
  return t.split("|").map(function (s) { return s.trim(); });
}

function isRow(line) {
  return line.trim().startsWith("|");
}

function headingIndex(lines, name) {
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (/^##\s/.test(t) && t.indexOf(name) >= 0) return i;
  }
  return -1;
}

function sectionOf(lines, idx) {
  let s = idx;
  while (s >= 0 && !/^##\s/.test(lines[s].trim())) s--;
  let e = idx + 1;
  while (e < lines.length && !/^##\s/.test(lines[e].trim())) e++;
  return lines.slice(s + 1, e).join("\n");
}

function backtickedTokens(line) {
  return String(line).split(BT).filter(function (_, i, arr) { return i % 2 === 1; }).map(function (s) { return s.trim(); });
}

function statusOfHeading(lines, name) {
  const idx = headingIndex(lines, name);
  if (idx < 0) return null;
  const toks = backtickedTokens(lines[idx]);
  for (const t of toks) if (STATUS.indexOf(t) >= 0) return { value: t, line: idx + 1 };
  return null;
}

function checkFile(file) {
  const issues = [];
  const add = function (rule, line, msg) { issues.push({ rule: rule, line: line, msg: msg }); };
  let text;
  try {
    text = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  } catch (err) {
    return { file: file, issues: [{ rule: "IO", line: "-", msg: "\u65E0\u6CD5\u8BFB\u53D6\u6587\u4EF6\uFF1A" + err.message }], io: true };
  }
  const lines = text.split(/\r?\n/);
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  const n = lines.length;

  // R1 - template L89: H1 \u9010\u5B57
  if (n < 1 || lines[0].trim() !== "# \u503C\u4E0D\u503C\u5F97\u8BFB \u00B7 \u4E00\u9875\u7EB8") {
    add("R1", 1, "\u9996\u884C\u5FC5\u987B\u9010\u5B57\u662F # \u503C\u4E0D\u503C\u5F97\u8BFB \u00B7 \u4E00\u9875\u7EB8");
  }

  // R2 - template L90-L92: \u7A7A\u884C + **\u300A\u6807\u9898\u300B** + \u6765\u6E90\uFF5C\u53D1\u8868\u65E5\u671F\uFF5C\u7EA6 N \u5B57
  let titleLine = -1;
  for (let i = 1; i < n; i++) {
    if (lines[i].trim() !== "") { titleLine = i; break; }
  }
  if (titleLine < 0) {
    add("R2", 2, "H1 \u4E4B\u540E\u6CA1\u6709\u6807\u9898\u884C\uFF08\u6A21\u677F L91 \u8981\u6C42 **\u300A<\u6587\u7AE0\u6807\u9898>\u300B**\uFF09");
  } else {
    if (!/^\*\*\u300A.+\u300B\*\*$/.test(lines[titleLine].trim())) {
      add("R2", titleLine + 1, "\u6807\u9898\u884C\u5FC5\u987B\u9010\u5B57\u5F62\u5982 **\u300A<\u6587\u7AE0\u6807\u9898>\u300B**\uFF08\u6A21\u677F L91\uFF1B\u4E0D\u52A0\u7C97\u6216\u7F3A\u4E66\u540D\u53F7\u5373\u4E0D\u5408\u89C4\uFF09");
    }
    const metaLine = titleLine + 1;
    if (metaLine >= n || !/^.+\uFF5C.+\uFF5C\u7EA6 [\d,]+ \u5B57$/.test(lines[metaLine].trim())) {
      add("R2", metaLine + 1, "\u6807\u9898\u884C\u4E0B\u4E00\u884C\u5FC5\u987B\u5F62\u5982 <\u6765\u6E90>\uFF5C<\u53D1\u8868\u65E5\u671F>\uFF5C\u7EA6 <N> \u5B57\uFF08\u6A21\u677F L92\uFF1B\u5206\u9694\u7B26\u5168\u89D2\uFF5C\u3001\u5B57\u6570\u7EAF\u6570\u5B57\uFF09");
    }
  }

  // R3 - template L94-L100: \u4E09\u680F\u8868\uFF0C\u6070\u597D 3 \u4E2A\u6570\u636E\u884C\uFF0C\u7B2C\u4E00\u5217\u9010\u5B57\u4E09\u9879
  let rows = [];
  const h3 = headingIndex(lines, "\u4E09\u4E2A\u95EE\u9898\u5206\u5F00\u770B");
  if (h3 < 0) {
    add("R3", "-", "\u672A\u627E\u5230\u6807\u9898 ## \u4E09\u4E2A\u95EE\u9898\u5206\u5F00\u770B\uFF08\u6A21\u677F L94\uFF09");
  } else {
    let i = h3 + 1;
    while (i < n && !isRow(lines[i])) i++;
    if (i >= n) {
      add("R3", h3 + 1, "\u4E09\u4E2A\u95EE\u9898\u5206\u5F00\u770B \u4E4B\u540E\u6CA1\u6709\u8868\u683C\uFF08\u6A21\u677F L96-L100\uFF09");
    } else {
      const start = i;
      const table = [];
      while (i < n && isRow(lines[i])) { table.push(lines[i]); i++; }
      const data = table.slice(2);
      rows = data.map(function (l, k) { return { line: start + k + 3, cells: splitRow(l) }; });
      if (rows.length !== 3) {
        add("R3", start + 1, "\u4E09\u680F\u8868\u5FC5\u987B\u6070\u597D 3 \u4E2A\u6570\u636E\u884C\uFF0C\u5B9E\u9645 " + rows.length + " \u884C\uFF08\u6A21\u677F L98-L100\uFF09");
      }
      for (let k = 0; k < 3; k++) {
        const name = rows[k] ? strip(rows[k].cells[0] || "") : "";
        if (name !== COLS[k]) {
          add("R3", rows[k] ? rows[k].line : start + 1, "\u7B2C " + (k + 1) + " \u884C\u7B2C\u4E00\u5217\u5FC5\u987B\u662F " + COLS[k] + "\uFF0C\u5B9E\u9645\u300C" + name + "\u300D");
        }
      }
    }
  }

  const grades = rows.map(function (r) { return strip(r.cells[1] || ""); });

  // R4 / R11 - template L98-L100 \u7ED3\u8BBA\u5217 = **<A/B/C/D>**\uFF1B\u706F\u4E0D\u662F\u6863\u4F4D
  rows.forEach(function (r, k) {
    const g = grades[k];
    if (GRADES.indexOf(g) < 0) add("R4", r.line, "\u6863\u4F4D\u53D6\u503C\u300C" + g + "\u300D\u4E0D\u5728 {A,B,C,D,\u2014} \u5185\uFF08\u6A21\u677F L98-L100\uFF09");
    if (LIGHTS.some(function (x) { return g.indexOf(x) >= 0; })) {
      add("R11", r.line, "\u6863\u4F4D\u5217\u51FA\u73B0\u706F\u7B26\u53F7\u300C" + g + "\u300D\uFF08\u706F\u662F\u53E6\u4E00\u4E2A\u8F74\uFF0C\u4E0D\u5F97\u5199\u8FDB\u6863\u4F4D\uFF09");
    }
  });

  // R5 - template 2.1/2.2: \u5927\u5361(\u6709 ## \u8BF4\u5F97\u6709\u9053\u7406\u5417\uFF1A) vs \u5C0F\u5361(\u503C\u5F97\u8BFB\u5417=D \u4E14\u65E0\u8BE5\u6807\u9898) \u6070\u6709\u4E00\u4E2A\u6210\u7ACB
  const big = lines.some(function (l) { return /^##\s+\u8BF4\u5F97\u6709\u9053\u7406\u5417\uFF1A/.test(l.trim()); });
  const readGrade = rows.length >= 3 ? grades[2] : "";
  const small = readGrade === "D" && !big;
  if (big === small) {
    add("R5", "-", "\u5F62\u6001\u4E0D\u81EA\u6D3D\uFF1A\u5224\u4E3A\u5927\u5361=" + big + "\u3001\u5224\u4E3A\u5C0F\u5361=" + small + "\uFF08\u6A21\u677F 2.1 / 2.2 \u8981\u6C42\u6070\u6709\u4E00\u4E2A\u6210\u7ACB\uFF09");
  }

  // R6 - template L171: \u5927\u5361\u7684\u300C\u8BF4\u7684\u662F\u771F\u7684\u5417\u300D\u6807\u9898\u5FC5\u987B\u5E26 <\u72B6\u6001\u4F4D>
  if (big) {
    const s = statusOfHeading(lines, "\u8BF4\u7684\u662F\u771F\u7684\u5417");
    if (!s) add("R6", "-", "\u5927\u5361\u7684 ## \u8BF4\u7684\u662F\u771F\u7684\u5417 \u6807\u9898\u7F3A\u5C11 <\u72B6\u6001\u4F4D>\uFF08\u6A21\u677F L171\uFF09");
    else if (STATUS.indexOf(s.value) < 0) add("R6", s.line, "\u72B6\u6001\u4F4D\u53D6\u503C\u300C" + s.value + "\u300D\u4E0D\u5728\u95ED\u96C6\u5185");
  }
  COLS.forEach(function (name) {
    const s = statusOfHeading(lines, name);
    if (s && STATUS.indexOf(s.value) < 0) add("R6", s.line, name + " \u7684\u72B6\u6001\u4F4D\u53D6\u503C\u300C" + s.value + "\u300D\u4E0D\u5728\u95ED\u96C6\u5185");
    if (s && s.value === "\u65E0\u6CD5\u5224\u5B9A" && !/\u7F3A\u4EC0\u4E48\u624D\u80FD\u5224[\uFF1A:]\s*\S/.test(text)) {
      add("R6", s.line, "\u72B6\u6001\u4F4D\u4E3A \u65E0\u6CD5\u5224\u5B9A\uFF0C\u4F46\u7F3A\u5C11\u975E\u7A7A\u7684\u300C\u7F3A\u4EC0\u4E48\u624D\u80FD\u5224\u300D\u8BF4\u660E");
    }
  });
  rows.forEach(function (r, k) {
    const toks = backtickedTokens(r.cells[1] || "");
    for (const t of toks) {
      if (STATUS.indexOf(t) >= 0 && grades[k] === "\u2014" && t !== "\u65E0\u6CD5\u5224\u5B9A") {
        add("R6", r.line, "\u6863\u4F4D\u4E3A \u2014 \u65F6\u72B6\u6001\u4F4D\u5FC5\u987B\u662F \u65E0\u6CD5\u5224\u5B9A");
      }
    }
  });

  // R7 - template L216-L217: \u5224\u5B9A\u8005\u6A21\u578B\u6807\u8BC6 / \u81EA\u504F\u597D\u98CE\u9669
  const mIdx = lines.findIndex(function (l) { return l.indexOf("\u5224\u5B9A\u8005\u6A21\u578B\u6807\u8BC6") >= 0; });
  let modelVal = null;
  if (mIdx < 0) {
    add("R7", "-", "\u7F3A\u5C11\u5B57\u6BB5 \u5224\u5B9A\u8005\u6A21\u578B\u6807\u8BC6\uFF08\u6A21\u677F L216\uFF09");
  } else {
    modelVal = strip(String(lines[mIdx]).replace(/^.*?\u5224\u5B9A\u8005\u6A21\u578B\u6807\u8BC6/, "").replace(/^[\uFF1A:\s|]+/, "")).split(/[\uFF5C|]/)[0].trim();
    if (modelVal === "" || modelVal === "AI") add("R7", mIdx + 1, "\u5224\u5B9A\u8005\u6A21\u578B\u6807\u8BC6 \u4E3A\u7A7A\u6216\u7B49\u4E8E AI\uFF08\u503C\uFF1A\u300C" + modelVal + "\u300D\uFF09");
  }
  const rIdx = lines.findIndex(function (l) { return l.indexOf("\u81EA\u504F\u597D\u98CE\u9669") >= 0; });
  let riskVal = null;
  if (rIdx < 0) {
    add("R7", "-", "\u7F3A\u5C11\u5B57\u6BB5 \u81EA\u504F\u597D\u98CE\u9669\uFF08\u6A21\u677F L217\uFF09");
  } else {
    const rawRisk = String(lines[rIdx]).replace(/^.*?\u81EA\u504F\u597D\u98CE\u9669/, "").replace(/^[\s*:\uFF1A\x60|]+/, "");
    const mRisk = rawRisk.match(/^[^\uFF08(\u2014\uFF0D\uFF1B;,\uFF0C\s]+/);
    riskVal = mRisk ? mRisk[0].replace(/[\x60*]/g, "").trim() : "";
    if (["\u662F", "\u5426", "\u65E0\u6CD5\u6392\u9664"].indexOf(riskVal) < 0) add("R7", rIdx + 1, "\u81EA\u504F\u597D\u98CE\u9669 \u53D6\u503C\u300C" + riskVal + "\u300D\u4E0D\u5728 {\u662F,\u5426,\u65E0\u6CD5\u6392\u9664} \u5185");
    if (modelVal === "\u672A\u63D0\u4F9B" && riskVal !== "\u65E0\u6CD5\u6392\u9664") add("R7", rIdx + 1, "\u5224\u5B9A\u8005\u6A21\u578B\u6807\u8BC6=\u672A\u63D0\u4F9B \u21D2 \u81EA\u504F\u597D\u98CE\u9669 \u5FC5\u987B\u662F \u65E0\u6CD5\u6392\u9664");
    if (riskVal === "\u662F" || riskVal === "\u65E0\u6CD5\u6392\u9664") {
      const secLines = String(sectionOf(lines, rIdx)).split("\n").filter(function (s) {
        const t = s.trim();
        return t !== "" && t.indexOf("\u81EA\u504F\u597D\u98CE\u9669") < 0 && !/^#/.test(t);
      });
      if (secLines.length === 0) add("R7", rIdx + 1, "\u81EA\u504F\u597D\u98CE\u9669=" + riskVal + "\uFF0C\u4F46\u540C\u8282\u6CA1\u6709\u4EFB\u4F55\u8BF4\u660E\u6587\u5B57");
    }
  }

  // R8 - v1 \u5DF2\u4F5C\u5E9F\u7684\u5B57\u6BB5\u4E0E\u523B\u5EA6\uFF08#55/#56/#40\uFF09
  const bad = [
    [/\u603B\u5206/, "\u603B\u5206"],
    [/\u8D28\u91CF\u5206/, "\u8D28\u91CF\u5206"],
    [/(?<![A-Za-z_])band(?![A-Za-z_])/i, "band"],
    [/(?<![A-Za-z_])score(?![A-Za-z_])/i, "score"],
    [/(?<![A-Za-z_])calibration(?![A-Za-z_])/i, "calibration"],
    [/T_pass/, "T_pass"],
    [/T_border/, "T_border"],
  ];
  const NEG = /\u4E0D\u542B|\u4E0D\u8BBE|\u6CA1\u6709|\u4E0D\u5F97|\u4E0D\u5B58\u5728|\u4E0D\u51FA\u73B0|\u65E0/;
  lines.forEach(function (l, i) {
    const hit = [];
    bad.forEach(function (bp) {
      const idx = String(l).search(bp[0]);
      if (idx < 0) return;
      if (NEG.test(String(l).slice(Math.max(0, idx - 6), idx))) return;
      hit.push(bp[1]);
    });
    if (hit.length) add("R8", i + 1, "\u51FA\u73B0\u5DF2\u4F5C\u5E9F\u7684\u5206\u6570/\u6863\u5E26\u6B8B\u7559\uFF1A" + hit.join("\u3001") + "\uFF08" + l.trim().slice(0, 40) + "\uFF09");
  });
  grades.forEach(function (g, k) {
    if (g === "\u4E0D\u9002\u7528") add("R8", rows[k].line, "\u6863\u4F4D\u5217\u4E0D\u5F97\u7528 \u4E0D\u9002\u7528 \u4F5C\u5360\u4F4D\uFF08\u5E94\u5199 \u2014\uFF09");
  });

  // R9 - \u4E00\u53E5\u8BDD
  const oIdx = lines.findIndex(function (l) { return /^\*\*\u4E00\u53E5\u8BDD\*\*[\uFF1A:]/.test(l.trim()); });
  if (oIdx < 0) {
    add("R9", "-", "\u7F3A\u5C11 **\u4E00\u53E5\u8BDD**\uFF1A \u884C");
  } else {
    const tail = lines[oIdx].trim().replace(/^\*\*\u4E00\u53E5\u8BDD\*\*[\uFF1A:]/, "").replace(/\s/g, "");
    if (tail.length < 10) add("R9", oIdx + 1, "**\u4E00\u53E5\u8BDD**\uFF1A \u4E4B\u540E\u4E0D\u8DB3 10 \u4E2A\u975E\u7A7A\u767D\u5B57\u7B26\uFF08\u5B9E\u9645 " + tail.length + "\uFF09");
  }

  // R10 - \u300C## \u8FD9\u7BC7\u6587\u7AE0\u5728\u8BF4\u4EC0\u4E48\u300D\u8282\u5B58\u5728\u4E14\u975E\u7A7A\uFF08\u4E0D\u67E5\u6761\u6570/\u7F16\u53F7/\u5F62\u6001\uFF09
  let sIdx = -1;
  for (let i = 0; i < n; i++) {
    if (/^##\s*\u8FD9\u7BC7\u6587\u7AE0\u5728\u8BF4\u4EC0\u4E48/.test(lines[i].trim())) { sIdx = i; break; }
  }
  if (sIdx < 0) {
    add("R10", "-", "\u7F3A\u5C11\u300C## \u8FD9\u7BC7\u6587\u7AE0\u5728\u8BF4\u4EC0\u4E48\u300D\u8282");
  } else {
    let body = 0;
    for (let i = sIdx + 1; i < n; i++) {
      const t = lines[i].trim();
      if (/^##\s/.test(t)) break;
      if (t !== "") body++;
    }
    if (body === 0) add("R10", sIdx + 1, "\u300C\u8FD9\u7BC7\u6587\u7AE0\u5728\u8BF4\u4EC0\u4E48\u300D\u8282\u4E0B\u65E0\u5185\u5BB9");
  }

  return { file: file, issues: issues, io: false };
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("\u7528\u6CD5\uFF1Anode check-card.mjs <\u5361\u6587\u4EF6\u8DEF\u5F84> [\u66F4\u591A\u8DEF\u5F84...]");
  process.exit(2);
}
let badCount = 0;
let ioCount = 0;
for (const f of args) {
  const r = checkFile(f);
  console.log("== " + f + " ==");
  if (r.io) {
    ioCount++;
    console.log("\u2717 " + r.issues[0].rule + " " + r.issues[0].line + " " + r.issues[0].msg);
    continue;
  }
  if (r.issues.length === 0) {
    console.log("\u2713 " + f + " \u65E0\u95EE\u9898");
    continue;
  }
  badCount++;
  for (const it of r.issues) console.log("\u2717 " + it.rule + " " + it.line + " " + it.msg);
}
if (ioCount > 0) process.exit(2);
process.exit(badCount > 0 ? 1 : 0);
