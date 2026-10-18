# scripts/ —— 输入解析薄壳

两个**零 LLM 调用**的确定性脚本：把外部输入变成「归一化 Markdown 正文 + 一行元数据 JSON」，
交给后续的判定流程（协议文档见 `docs/PLAN.md` §三、输入形态决策见 `docs/DECISIONS.md` #3）。

- `input-wechat.mjs` —— 公众号链接（`/s/<id>` 分享短链、`/s?src=11&timestamp=…&signature=…` 时效签名链）→ 正文 Markdown
- `input-file.mjs` —— `.md` / `.txt` / `.pdf`（文本层）→ 正文 Markdown

## 0. 环境与依赖

- Node ≥ 22（`unpdf` 的 `engines` 要求）；本机实测 Node v24.21.0：
  `C:\Users\hades\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe`
- 仅 **PDF 路径**需要依赖；`.md` / `.txt` / 公众号路径**零依赖**，没装 `node_modules` 也能跑。
- 安装命令（在仓库根目录执行）：

  ```bash
  npm install unpdf        # 或：pnpm add unpdf
  ```

- **未安装 `node_modules` 时**：`.pdf` 会打印安装命令并退出码 5（不会抛堆栈）；其余路径照常工作。

| 包 | 版本（实测） | 许可 | 用途 | 来源 |
|---|---|---|---|---|
| `unpdf` | 1.8.1 | MIT | PDF 文本层抽取（PDF.js 的无依赖封装） | https://www.npmjs.com/package/unpdf |

> 备选：`pdfjs-dist` 6.4.299（Apache-2.0）。未采用的原因：它带可选原生依赖 `@napi-rs/canvas`，安装面更大；
> `unpdf` 零传递依赖（`dependencies: {}`）且同为 MIT。
>
> **红线**：严禁引入 PyMuPDF / fitz（AGPL-3.0，会污染本项目可分发许可，见 `docs/DECISIONS.md` #23）。
> 两个脚本的「缺依赖」提示里也写明了这一条。

## 1. `input-wechat.mjs`

```bash
node scripts/input-wechat.mjs <url> [--out <path>]
node scripts/input-wechat.mjs https://mp.weixin.qq.com/s/jnyzHQMecTY2C2HaK4Agfg --out out/article.md
```

- **URL 形态判定**（`classifyUrl()`；实测证据见 §4）：

  | 形态 | 样例 | 处置 |
  |---|---|---|
  | A | `https://mp.weixin.qq.com/s/<id>` 分享短链 | 直接抓取 |
  | B | `https://mp.weixin.qq.com/s?__biz=…&mid=…&idx=…&sn=…` 长链 | **前置拒绝**（退出码 2），实测 100% 302 到验证码页 |
  | C | `https://mp.weixin.qq.com/s?src=11&timestamp=…&ver=…&signature=…&new=1` | **不前置拒绝**，实抓：含 `js_content` → 退出码 0；不含（空壳页 / 验证码页）→ 退出码 4「内容不可用」 |

  形态 C 是**搜狗微信的时效签名链**：`timestamp` + `signature` 组成访问凭证，**签名会过期**，也可能被微信换成空壳页，
  因此同一批链接里有的可读、有的不可读——只能实抓后按 `js_content` 判定，不能按 URL 形状前置拒绝。
  判定规则：A 由 `pathname` 匹配 `/s/<id>`；B 命中 `__biz` / `mid` / `idx` / `sn` 任一（`chksm` 不算）；
  C 命中 `signature`，或同时命中 `timestamp` + `ver`；**B 优先于 C**（两者同时出现时按 B 拒绝）。

- **stdout**：归一化 Markdown 正文（`--out` 时写文件，父目录不存在会自动创建）。
- **stderr**：**一行**元数据 JSON（成功路径严格一行；错误路径是可读的多行中文提示）。
- 图片**不下载**，只在原位保留占位符 `![图1]`、`![图2]`……因为后续判定需要知道「这里本来有图」。
- 正文来源：`<div class="rich_media_content" id="js_content">`，用**精确 id 属性匹配 + div 深度计数**截取
  （页内还有同名字符串干扰，不能用 `indexOf('js_content')` 粗切）。
- 元数据字段（与 `input-wechat.mjs:421-443` 的 `meta` 定义逐字一致；本次改动未增删任何键名）：

  | 字段 | 说明 |
  |---|---|
  | `ok` / `source` | 成功标记 / 固定 `wechat` |
  | `input` / `url` / `finalUrl` | 原始入参 / 归一化后的链接 / 跟随重定向后的最终链接 |
  | `httpStatus` / `htmlBytes` | HTTP 状态码 / 抓到的 HTML 字节数（实测分享短链约 3.4–3.7 MB） |
  | `title` / `account` | 标题 / 公众号名（取自 `var msg_title`、`var nickname`，并有 `og:title`、`#activity-name`、`#js_name` 兜底；`account` 会剥掉 `htmlDecode()` 包裹与 `&#39;`） |
  | `publishedAt` / `publishedTs` / `publishedAtSource` | `YYYY-MM-DD` / Unix 秒 / 取值来源（实测为 `var ct/create_time`）；按 **UTC+8** 折算，与机器时区无关 |
  | `chars` / `cjk` / `latinWords` | 字数口径见下方「字数口径」 |
  | `nonSpaceChars` | 正文中所有非空白字符数（含标点、链接文字、`![图N]` 占位符） |
  | `lines` / `images` | 正文非空行数 / 图片数（= `![图N]` 占位符数量） |
  | `imageSrcs` | 图片原始地址列表（最多 200 条，仅记录、不下载） |
  | `out` / `outBytes` | 写出路径 / 写出字节数；**仅在带 `--out` 时出现**（stdout 模式 `out` 为 `null`、`outBytes` 缺省） |
  | `fetchedAt` | 抓取时刻（ISO 8601 UTC） |

- 失败情形：

  | 退出码 | 情形 | 提示与处理 |
  |---|---|---|
  | 2 | 参数缺失 / 非 `mp.weixin.qq.com` 链接 | 打印用法 |
  | 2 | **长链形态**（`/s?__biz=…&mid=…&idx=…&sn=…`） | 「检测到长链形态。微信对 `?__biz=…&mid=…` 形态的链接做了风控（实测 302 到 `mp.weixin.qq.com/mp/wappoc_appmsgcaptcha`，页面文案「环境异常」），抓不到正文」→ 指引用微信「…」菜单复制分享短链 |
  | 3 | 网络失败 / 超时（45 s） | 提示检查网络后重试 |
  | 4 | **内容不可用**：形态 C 抓到的页面没有 `js_content`（空壳页 / 验证码页） | 「内容不可用：页面里没有正文容器 `div id="js_content"`」+ 三条实测证据（HTTP 状态码、响应字节数、未检出 `js_content`）→ 提示该形态是带 `timestamp` 的**时效签名链**，签名会过期：在微信里重新「…」→ 复制链接，或改用 `/s/<id>` 分享短链 |
  | 4 | 形态 A 命中验证码页（`wappoc_appmsgcaptcha` / 「环境异常」） | 同长链提示：改用分享短链 |
  | 4 | 形态 A 页面里没有 `js_content` | 常见原因：短链失效/下架/不是文章页；先确认在微信里能打开 |
  | 2 | `--out` 写入失败 | 提示检查目录权限 |

## 2. `input-file.mjs`

```bash
node scripts/input-file.mjs <path> [--out <path>]      # .md / .markdown / .txt / .pdf
node scripts/input-file.mjs -                          # 从 stdin 读纯文本（粘贴正文场景）
```

- 归一化规则：去 BOM、CRLF→LF、去行尾空白、≥3 连续空行压成 1 个空行，文件末尾保证单个换行。
- `.md` / `.markdown` / `.txt`：直读，不做语法改写（保护原文的引用块、列表、表格）。
- `.pdf`：**只做文本层抽取**（`unpdf` 的 `getDocumentProxy` + `extractText(..., { mergePages: true })`）。
  跨中日韩字符之间的空格会被删除，中拉之间的空格保留（例如 `共 30 家`）。
- 元数据字段（与 `input-file.mjs:290-309` 的 `meta` 定义逐字一致）：`ok`、`source`（固定 `file`）、`input`、
  `path`（stdin 时为 `(stdin)`）、`format`（`md` / `txt` / `pdf`，stdin 记为 `txt`）、`bytes`、`chars`、`cjk`、
  `latinWords`、`nonSpaceChars`、`lines`、`pages`、`pdfLib`、`pdfTitle`、`pdfAuthor`、`pdfProducer`、
  `pdfCreationDate`、`textLayer`（有文本层时为 `"yes"`）、`pdfWarnings`、`out` / `outBytes`（仅在 `--out` 时出现）。
- `pdfWarnings`：pdf.js 解析异常字体时本来会往控制台打 `Warning: …`（实测 `t-hotel.pdf` 触发
  `Warning: TT: undefined function: 3`）。这些内容被收进元数据（上限 20 条），以保证 **stderr 只有一行 JSON**。

- 失败情形：

  | 退出码 | 情形 | 提示与处理 |
  |---|---|---|
  | 2 | 文件不存在 / 参数缺失 / 不支持的扩展名 | 打印支持的格式；公众号文章请改用 `input-wechat.mjs` |
  | 4 | **PDF 无文本层（扫描件）** | 「该 PDF 无文本层，可能是扫描件，本工具 v1 不支持 OCR。（共 N 页，抽出 M 个非空白字符）」→ ① 先用 Acrobat / WPS / ABBYY 做 OCR 再导出文本层 PDF 或 `.txt`；② 或把正文粘贴成 `.txt` |
  | 4 | 加密 PDF（`PasswordException`） | 提示先解密 |
  | 4 | 非法/损坏 PDF（`InvalidPDFException` / `FormatError`） | 提示确认文件完整；后缀是 `.pdf` 但内容不是 PDF 时改用正确的输入方式 |
  | 5 | 缺依赖（`unpdf` 未装、没有 `node_modules`） | 打印 `npm install unpdf` / `pnpm add unpdf`，并重申 AGPL 红线 |

- 文本层判据：抽出文本的**非空白字符 < 20** 即视为无文本层（扫描件）。

## 3. 字数口径

- `chars` = CJK 字符数 + 拉丁词数（中文文章的「字数」直觉口径）；
- `cjk` = 汉字/假名等 CJK 区字符数；`latin` = 拉丁字母词数；
- `nonSpaceChars` = 所有非空白字符数（含标点）；
- 三个数都**不含** `![图N]` 占位符贡献之外的空行与首尾空白。判定阈值请固定引用同一字段，不要跨字段比较。

## 4. 实测证据（2026-10-13，全部真实执行）

命令（本机 Node 绝对路径见 §0；下同）：

```bash
node scripts/input-wechat.mjs <url> --out <file>.md     # 元数据从 stderr 落盘后按 UTF-8 读取
node scripts/input-file.mjs <file> --out <file>.md
```

公众号分享短链（4/4 成功，退出码 0）：

| 短链 | 公众号 | 发布日期 | 标题 | `chars` | `images` | `lines` |
|---|---|---|---|---|---|---|
| `…/s/jnyzHQMecTY2C2HaK4Agfg` | 镜子别酷 | 2026-09-19 | AI越强，我越希望你不要用AI | 2420 | 8 | 69 |
| `…/s/Mes1RqIOdp48CMw4pXTwXw` | 人物 | 2020-09-08 | 外卖骑手，困在系统里 | 19861 | 27 | 325 |
| `…/s/tvbKNOf_LB0GUQlEvZ4zPQ` | 虎嗅APP | 2026-10-05 | AI教育焦虑：中国家长疯狂加码的方向，美国富人却正在退出 | 5422 | 1 | 88 |
| `…/s/KWt-zIV7MdXJ18LOVQ7C2Q` | 常识Prologue | 2026-08-18 | 我们的社保还能撑多久？ | 2927 | 3 | 73 |

形态 C 时效签名链（3 条真实链接，改动后实测；`cjk` 口径 = `/s/<id>` 表格同源）：

| 链接（`/s?src=11&timestamp=…`） | HTTP | 响应字节 | `js_content` | 结果 | `cjk` | `images` |
|---|---|---|---|---|---|---|
| `timestamp=1791895970` | 200 | 3,693,336 | 有 | 退出码 0；《百亿保健帝国权健，和它阴影下的中国家庭（全文）》/ 创业邦 / `ct=1545816621` | 6290 | 19 |
| `timestamp=1791895990` | 200 | 3,579,306 | 有 | 退出码 0；《疫之殇丨疫苗之王》/ 莫问圭期 / `ct=1532361660` | 3730 | 1 |
| `timestamp=1791895879` | 200 | 31,772 | **无** | 退出码 4「内容不可用」——页面可见中文仅 41 字，是空壳页而非验证码页 | — | — |

> 改动前这 3 条**全部**被前置拒绝（退出码 2、无输出文件），而其中 2 条实际可读——门禁过宽，本批次修正为「实抓 + 按 `js_content` 判定」。
> 同一批链接的响应字节在一次抓取内可复现，但跨时段会有 ~1% 波动（页面自带动态脚本），因此字节数只作证据、不作判据。

文件（5/5 符合预期）：

| 输入 | 结果 |
|---|---|
| `docs/PLAN.md`（.md 路径） | `bytes=11960 chars=2648 lines=128 outBytes=11542`，退出码 0 |
| `PLAN.md` 走 `-`（stdin） | `format=txt input=(stdin) chars=2648 lines=128`，输出与文件模式逐字节一致 |
| `中英版机票行程单.pdf`（4 页） | `chars=902 nonSpaceChars=2944 lines=118`，退出码 0 |
| `龙虾炒股实战操作手册_打印版.pdf`（6 页） | `chars=2094 cjk=2055 lines=166`，退出码 0 |
| `日本中部行程.pdf`（3 页） | `chars=1535 lines=75`，退出码 0 |
| `君悦酒店…确认书.pdf`（1 页） | `chars=84 nonSpaceChars=273 lines=17`，退出码 0；`pdfWarnings=["Warning: TT: undefined function: 3"]` |
| `印刷版本.pdf`（2 页） | `chars=716 lines=62`，退出码 0 |
| `Korea e-Arrivalcard_EB8274782.pdf`（真扫描件，2 页） | 退出码 4：该 PDF 无文本层（抽出 0 个非空白字符） |

失败情形（全部实测通过，退出码与文案见 §1/§2 的表格）：

| 用例 | 输入 | 退出码 |
|---|---|---|
| 长链 | `…/s?__biz=…&mid=…&idx=1&sn=…&chksm=…` | 2 |
| 失效/空短链 | `…/s/AAAAAAAAAAAAAAAAAAAA` | 4 |
| 非法 PDF | 把 `docs/PLAN.md` 改名成 `fake.pdf` | 4 |
| 无文本层 PDF | 自造 2 页零文本算子 PDF（灰色矩形 + 8×8 DeviceGray 图像） | 4 |
| 不支持的扩展名 | `package.json` | 2 |
| 缺依赖 | 把 `scripts/` 拷到无 `node_modules` 的隔离目录后跑 `.pdf` | 5 |
| 文件不存在 | `nope.md` | 2 |

其它：

- 标题抽取踩过的坑：真实页面是 `var msg_title = '…'.html(false);`，若正则要求引号后紧跟分号，
  会跨引号吃到后续 JS，标题变成整段脏文本。现按「首个未转义同类引号」截断，并允许尾部 `.html(true|false)`。
- 图片数 `8 / 27 / 1` 与项目前期实测简报完全一致。
- 本项目**不做**任何 LLM 调用：两个脚本只用 `node:fs` / `node:path` / `fetch` / `unpdf`。

## 5. 已知边界与不达标项

1. **无 OCR**：扫描件 PDF 直接报错退出（v1 设计如此，不做静默降级）。
2. **不做版面重建**：PDF 文本按 pdf.js 的文本流顺序输出，跨栏/表格可能顺序错乱；需要精确版面时请在判定环节用原始 PDF。
3. **不下载图片**：只保留 `![图N]` 位置的占位符，也不保留「图注↔图片」的绑定关系（图注仍是普通段落）。
4. **付费/视频/图片消息类短链**没有 `js_content`，会报「没有正文容器」，不做特殊解析。
5. `pdfWarnings` 只保留前 20 条库日志。
6. **白名单偏差**：仓库根目录的 `package.json` / `pnpm-lock.yaml` / `node_modules/` 不在 `docs/PLAN.md` §三 列的
   `scripts/` 三文件清单里，是为安装 PDF 依赖所必需。实测 `node_modules` 共 160 个文件、2093 KB，其中
   `node_modules/.pnpm/unpdf@1.8.1/node_modules/unpdf/dist/pdfjs.mjs` = **1637 KB（>1 MB）**——若随仓库提交，
   D9 的「无单文件 >1MB」一条将在首次提交后不成立。**建议在 D9 首次提交前把 `node_modules/` 写进 `.gitignore`**
   （本批次未创建 `.gitignore`，避免继续扩大 3 文件白名单的偏差，交由调度侧决定）。
7. **形态 C 可读性由微信服务端决定**：签名链过期或被风控时，微信返回的是 HTTP 200 的**空壳页**（本例 31,772 字节、可见中文 41 字），
   既无 `js_content` 也无验证码页特征串，脚本只能如实报「内容不可用」（退出码 4）——这不是脚本缺陷，重取签名链或改用 `/s/<id>` 短链即可。
8. 字数与项目前期简报的差异：简报给出 2764 / 23969 / 6539，本脚本同一批文章的 `nonSpaceChars` 为
   2730 / 23257 / 6425（`chars` 更小）。简报口径未查明，判定阈值请统一使用本脚本的字段口径。

## 6. `struct-stats.mjs`

第三个**零 LLM 调用、零依赖**的确定性脚本：把一份归一化 Markdown（也可直接给普通 `.md` / `.txt`）读成
「结构统计」——旧单档链判据的必需输入（**该判据已随旧链退役**，原登记见 `_scratch/retired/stage1-protocol/references__01-genre-routing.md` 与 `…references__00-protocol.md`）；新链不依赖这项统计，它的结果只作可选的确定性参考。
**只统计、不判定**：不产出任何「好不好」类结论，也不读 `references/`。
统计前先剥掉文件开头的 YAML front-matter（`input-wechat.mjs` / `input-file.mjs` 的产物一定带），
被剥掉的行数由本节新增的 `frontMatterLines` 报出——**所有计数项一律只统计正文**，口径与证据见 §6.4。

```bash
node scripts/struct-stats.mjs <输入文件路径> [--json]
node scripts/struct-stats.mjs - [--json]        # 从 stdin 读
```

- 默认输出 10 行人类可读键值行（键名左对齐，末行 `textLines`、倒数第二行 `frontMatterLines`）；`--json` 输出**单行** JSON。
- JSON 字段：`ok` / `source`（固定 `struct-stats`）/ `input` / `path` / `bytes` / `stdin` + 六个统计字段（`sentences` / `paragraphs` / `orderedListItems` / `codeBlockLines` / `externalLinks` / `blockquotes`）+ `chars` / `latinWords` / `frontMatterLines` + `textLines`（**末位字段**）。
  本次只**追加**新键，原有键名、键序、类型一律未变；**不含时间戳**，同一输入重复运行逐字节一致（便于做差分核对）。
- 字段口径（**全部只统计剥离 front-matter 后的正文**）：

  | 字段 | 口径 | 备注 |
  |---|---|---|
  | `sentences` | 句末标记＝全角 `。｜！｜？｜；｜…`，以及**换行**（逐行切分）；ASCII `.` **不算**句末，ASCII `?` `!` 仅在后接空白/换行/CJK 时才算（K-1，与 `_scratch/retired/stage1-protocol/references__01-genre-routing.md` 一致） | **标题行、代码块（含围栏行）、引用块行、以及下行 `textLines` 定义的四类非文本行都不计入句数**；连续标点算一次切分；空句不计 |
  | `paragraphs` | **正文非空行数**（剥离 front-matter 后的非空行；与 `input-*.mjs` 的 `lines` 同口径） | **⚠ 它不是自然段落数**：标题行、代码块（含围栏行）、引用块行、四类非文本行都照算，空行不算；30/30 篇实测满足 `input-file.mjs 的 lines − frontMatterLines = paragraphs`（§6.5） |
  | `textLines` | **正文文本行数** ＝ `paragraphs` 减去非文本行数 | K-2 新增，**JSON 与人类可读输出的末位字段**；非文本行＝`![图N]` 独占行 / 纯 URL 独占行 / 水平分割线行（`---` `***` `___` 独占行）/ 纯标点行（整行不含任何字母或数字）；被减掉的行仍计入 `paragraphs`，但不计句数 |
  | `orderedListItems` | `^\s*\d+[.、)]\s+` 的行数 | `4.d`（标记后无空白）不计 |
  | `codeBlockLines` | ``` 围栏**之间的行数**，围栏行本身不计 | 交替开关；末段围栏未闭合时，其后的行仍计入 |
  | `externalLinks` | `http://` / `https://` 的**出现次数**（不分大小写；同行多次全数） | 含代码块与链接语法里的 URL |
  | `blockquotes` | `^\s*>\s?` 的**连续行块数**（连续多行算一块） | 空行或非 `>` 行断块 |
  | `chars` / `latinWords` | CJK 字符数 / 拉丁词数（对照用，非必需） | **`chars` 只含 CJK**，与 `input-*.mjs` 的 `chars`（CJK＋拉丁词）口径不同，不要跨脚本比较 |
  | `frontMatterLines` | 统计前剥掉的 YAML front-matter **行数**（含首尾两条 `---`） | T-F4c 新增；无 front-matter（含「开头不是 `---`」与「找不到配对结束 `---`」两种）时为 `0` |

- 失败情形：

  | 退出码 | 情形 | 提示与处理 |
  |---|---|---|
  | 2 | 无参数 / 未知参数 / 多余位置参数 | 打印用法（无参数时）或指出具体参数名 |
  | 2 | 文件不存在 / 是目录 / 读取失败 | 提示检查路径拼写与引号，路径示例见提示本身 |
  | 4 | **空文件（0 字节）** | 提示确认文件完整；公众号文章先用 `input-wechat.mjs` 落成 Markdown |
  | 4 | **剥离 front-matter 后的正文**里既无中日韩文字也无拉丁字母（例如纯标点、纯数字符号；**只有 front-matter、没有正文**的文件也落在这里） | 提示先跑 `input-file.mjs` / `input-wechat.mjs` 拿归一化 Markdown；T-F4c 前这种「只有 front-matter」的文件返回 `0`，见 §6.4 |
  | 4 | 输入是 **PDF 二进制**（以 `%PDF-` 开头） | 提示先用 `input-file.mjs` 抽文本层；不做其它二进制嗅探 |

- 归一化：与 `input-file.mjs` 同款轻归一化（去 BOM、CRLF→LF、去零宽字符、NBSP→空格、行内多空格压单空格、去行尾空白）；
  归一化**先于** front-matter 剥离，所以 BOM 与 CRLF 两种开头的 `---` 都能配对（`splitFrontMatter()` 内部再做一次 CRLF 归一化兜底）。
- 依赖与源码形态：只用 `node:fs` / `node:path`，**不装任何包、不改 `package.json`**；
  源码为**纯 ASCII**（中文一律 `\uXXXX` 转义，T-F5d 后实测 586 处；T-F4c 后 521 处，T-F4c 前 455 处），遵守「生成的脚本保持纯 ASCII」硬规则。

### 6.1 实测证据（2026-10-13，全部真实执行）

命令（本机 Node 绝对路径见 §0；下同）：

```bash
node scripts/struct-stats.mjs <输入文件>            # 人类可读
node scripts/struct-stats.mjs <输入文件> --json      # 单行 JSON
```

| 输入 | 退出码 | 输出 |
|---|---|---|
| `testset/samples/python-progress-bar-methods.md`（4,658 B，短样本） | 0 | `sentences=77 paragraphs=81 orderedListItems=0 codeBlockLines=0 externalLinks=3 blockquotes=0 chars=647 latinWords=269 frontMatterLines=17 textLines=71`（T-F5d 前 `sentences` 87；T-F4c 前 106 / 98 / 4 / 711 / 341） |
| `testset/samples/social-security-sustainability.md`（11,282 B） | 0 | `sentences=110 paragraphs=73 orderedListItems=0 codeBlockLines=0 externalLinks=9 blockquotes=0 chars=2637 latinWords=290 frontMatterLines=17 textLines=70`（T-F5d 前 `sentences` 113；T-F4c 前 132 / 90 / 10 / 2697 / 361） |
| `testset/samples/over-modelization-critique-economics.md`（23,724 B） | 0 | `sentences=160 paragraphs=44 orderedListItems=0 codeBlockLines=0 externalLinks=0 blockquotes=0 chars=6973 latinWords=28 frontMatterLines=17 textLines=43`（T-F5d 前 `sentences` 161；T-F4c 前 179 / 61 / 1 / 7045 / 98） |
| `testset/samples/suicide-rescue-eighteen-days.md`（73,427 B，长样本） | 0 | `sentences=853 paragraphs=433 orderedListItems=0 codeBlockLines=0 externalLinks=0 blockquotes=0 chars=20670 latinWords=675 frontMatterLines=17 textLines=385`（T-F5d 前 `sentences` 902；T-F4c 前 920 / 450 / 1 / 20732 / 748） |
| `docs/PLAN.md`（19,108 B，无 front-matter 的普通 md） | 0 | `sentences=135 paragraphs=156 orderedListItems=7 codeBlockLines=39 externalLinks=0 blockquotes=2 chars=3173 latinWords=525 frontMatterLines=0 textLines=140`（T-F5d 前 `sentences` 149） |
| `-`（stdin，`你好。世界！……第二段？done.`） | 0 | `sentences=4 paragraphs=1 chars=7 latinWords=1 frontMatterLines=0 textLines=1` |
| 不存在的路径 | 2 | 「错误：找不到文件：<绝对路径>」 |
| 空文件（`$env:TEMP` 下 0 字节） | 4 | 「错误：内容不可用：文件是空的（0 字节）」 |
| 无中日韩文字也无拉丁字母（`12345 --- #####`） | 4 | 「错误：内容不可用：正文里既没有中日韩文字，也没有拉丁字母」 |
| 未知参数（`--nope`） | 2 | 「错误：未知参数：--nope」 |

> 注：`input-file.mjs` 对「无参数」用退出码 1、对「空文件 / 正文过短」用退出码 2；本脚本按需求方的显式约定统一为
> **用法类一律 2、内容不可用一律 4**，两者在这一点上不同码，调用方请按各自文档处理，不要混用判据。
>
> 上表 `sentences` 为 2026-10-13 二次裁决后的当前值；`你好。世界！……第二段？done.` 这一例在修订前也是 4（三处标记 + 末段），
> 该行的 `chars` / `latinWords` 与 `paragraphs` 同理不受句切分口径影响。
>
> ⚠ **T-F5d（K-1 / K-2）后本表已整体重测**：四个样本行的 `sentences` 由 87 / 113 / 161 / 902 变为 **77 / 110 / 160 / 853**，
> `docs/PLAN.md` 由 149 变为 **135**，并新增末位字段 `textLines`；`paragraphs` / `chars` / `latinWords` / `frontMatterLines` / `orderedListItems` /
> `codeBlockLines` / `blockquotes` / `externalLinks` 逐字未变。原因与逐篇分解见 §6.5。

#### 句切分口径变更（2026-10-13 二次裁决，旧→新）

上一版把句末标记实现为 `[\u3002\uff01\uff1f\u2026.?!]+` 并在**全文**上切分，与
`_scratch/retired/stage1-protocol/references__01-genre-routing.md` 的闭集口径不一致。现按该口径重写为唯一口径（源码为逐字符边界判定函数，
**已不存在单一正则**）：全角 `。！？；…` 无条件断句；ASCII `.` 永不；ASCII `?` `!` 仅在后接空白/换行/CJK 时断句
（避免 URL query string 被切开）；换行断句；标题行 / 代码块（含围栏行）/ 引用块行不计入句数；连续标点算一次；空片段不计。

| 输入 | 旧 `sentences` | 新 `sentences` | 差值 | 差异原因 |
|---|---|---|---|---|
| `testset/samples/python-progress-bar-methods.md` | 61 | 106 | +45 | 该样本 146 行、非空行 99，其中只有 13 行以全角标记收尾；旧口径只在 `.?!` 与全角标记处切，**39 行无句末标点的行并进了相邻句**。换行成为边界后逐行成句；同时 20 行含 ASCII `.`（`bar.next()` / `time.sleep(1)` / URL）的行不再被 `.` 多切。 |
| `testset/samples/suicide-rescue-eighteen-days.md` | 816 | 920 | +104 | 长文（`paragraphs=450`，`sentences/paragraphs` 从 1.81 升到 2.04）——中文短文习惯换行分段，旧口径把这些短段并成一句。 |
| `docs/PLAN.md` | 114 | 149 | +35 | 两个方向同时发生：换行边界大量增加（若只改标记口径、不做排除，本文件为 208 句）；**排除代码块+引用块+标题行**又扣掉 59（其中围栏之间 39 行代码本就在被 `.` 多切）。净 +35。 |

三个**不该受影响**的字段在 T-F4b 当时逐字未变（`paragraphs` 98 / 450 / 156，`codeBlockLines` 0 / 0 / 39，
`blockquotes` 0 / 0 / 2；`externalLinks` / `orderedListItems` / `chars` / `latinWords` 亦全部逐字相同）。
上表「新 `sentences`」记录的是 T-F4b 当时的实测值（front-matter 仍在计入）；**T-F4c 剥离 front-matter 后**同为三个输入：
`sentences` **87 / 902 / 149**，`paragraphs` **81 / 433 / 156**，`externalLinks` **3 / 0 / 0**（`docs/PLAN.md` 无 front-matter，三者逐字不变）。
**句切分口径本身未改一字**（§6.4 的边界用例已逐条复测），当前值以本节表格与 §6.4 为准。

#### 句切分边界用例（stdin 注入，期望值 vs 实测）

| 输入 | 期望 | 实测 |
|---|---|---|
| `你好。。世界` | 2（连续标点算一次） | 2 ✅（旧口径也是 2） |
| `版本 v1.2.0 发布了。` | 1（ASCII `.` 不切） | 1 ✅（旧口径 3 ❌） |
| `见 https://a.com/b?x=1 的说明。` | 1（URL 的 `.` 与 `?` 都不切） | 1 ✅（旧口径 3 ❌） |
| `## 标题`＋`正文一句。` | 1（标题行不计） | 1 ✅（旧口径同为 1，但原因不同：旧口径本就把两行并成一句） |
| `> 引用一句。`＋`正文一句。` | 1（引用块不计） | 1 ✅（旧口径 2 ❌） |
| ``` 围栏 2 行内容 + 正文一句 | 1（代码块不计） | 1 ✅（`codeBlockLines=2`，围栏行本身不计） |
| `你好。世界` | 2（基线） | 2 ✅ |
| `你好！世界` / `你好？世界`（全角） | 2 | 2 ✅（全角标记无条件断句） |
| `你好!世界` / `你好?世界`（ASCII 后接 CJK） | 2（后接 CJK → 算句末） | 2 ✅（**T-F5d 修正后才成立**：T-F5d 前实测 `sentences=1` ❌，源码与 `_scratch/retired/stage1-protocol/references__01-genre-routing.md` 不一致，见 §6.5） |
| `a.b` / `v1.2.0 e.g. a.com` | 1 | 1 ✅ |
| `；② 每篇……；③ 每篇……`（PLAN.md:97 真实行） | 4（全角 `；` 后接 ② 也要断） | 4 ✅ |

> 注：本表每一个用例都是单独跑一次 stdin（非同一进程内累加）；同一次 stdin 里全部用例相加会把「非空片段计 1 句」叠加成 `sentences=9`。

### 6.2 人工核对（独立实现，非复用脚本逻辑）

| 字段 | 人工方法 | 结果 |
|---|---|---|
| `blockquotes`（`docs/PLAN.md`） | `rg -n '^\s*>'` 命中 4 行（3、4、5、89），按行号相邻性手工归并 → 两个连续块 | 人工 2 = 脚本 2 ✅ |
| `codeBlockLines`（`docs/PLAN.md`） | `rg -n '^\s*```'` 命中 2 行（43、83），其间 44–82 共 39 行 | 人工 39 = 脚本 39 ✅ |
| `paragraphs` ↔ `input-file.mjs:lines` | 三个文件交叉跑 `input-file.mjs`（T-F4c 后复测） | `lines` 98 / 90 / 61 / 156，其中前三个各减去 `frontMatterLines=17` 后 = 脚本 `paragraphs` 81 / 73 / 44；`docs/PLAN.md` 无 front-matter，`lines` 156 = 脚本 156 ✅ |
| `externalLinks` | `rg --count-matches "https?://"` | 4 / 1 / 0 三例全等 ✅（T-F4b 时对**全文**；T-F4c 后为 3 / 0 / 0，前两例各有 1 条链接来自 front-matter 的 `source_url`，`docs/PLAN.md` 无 front-matter 故 0 不变） |
| `orderedListItems`（`docs/PLAN.md`） | `rg --count-matches "^\s*\d+[.、)]\s+"` | 7 = 脚本 7 ✅ |

口径边界用例（stdin 注入，逐条核对）：`你好。。世界` → 2 句（连续标点算一句）；`。！？` 连排 + 无字母 → 退出码 4；
同行两个链接 → `externalLinks=2`；`1. a / 2、b / 3) c / 4.d` → `orderedListItems=2`；
``` 围栏**之间** 2 行内容 → `codeBlockLines=2`（围栏行本身不计；`sentences` 的排除口径覆盖到围栏行自身）；
`> a / > b / 空行 / > c` → `blockquotes=2`。句切分的边界用例见 §6.1 末表（该表全部为 2026-10-13 二次裁决后实测）。

### 6.3 已知局限与主观判断

1. **换行即边界，会让「短行型」文件句数偏大**：无标点的短行现在各自成句。
   实测最极端的是短样本 `python-progress-bar-methods.md`：剥离 front-matter 后 129 行里只有 13 行以全角标记收尾，其余（含 `bar.next()` 这类代码行）全部按行成句。
   原文「`sentences` 从 61 升到 106」是 T-F4b 当时把 front-matter 一起计入的数字；T-F4c 剥离后正文为 87，**T-F5d（K-2）后为 77**（见 §6.4、§6.5）。
2. **ASCII `!` `?` 只按「后一个字符」判定**：后接空白/换行/CJK 才算句末（T-F5d 实测 `你好!你` → **2 句**、`你好!世界` → **2 句**、`你好! World` / `你好? 世界` / `你好?`＋换行＋`世界` → 2 句）；
   后接 ASCII 字母/数字算词内标点、不切（`a!b` → 1 句、`你好!World` → 1 句）；ASCII `!` / `?` 落在**行尾**时仍算句末（`Wow!` → 1 句、`你好!` → 1 句）。
   `?!` 这类**相邻标点**由「连续标点算一次」覆盖（`你好?!世界` → 2 句：`?` 后接 ASCII `!` 不算句末，`!` 后接 CJK `世` 才切）。
   真正的偏小场景是**句末无任何标点**的段落，只能靠换行结尾（末行无换行时该片段仍计 1 句）。
3. **排除项只作用于 `sentences` 与 `textLines`**：标题行 / 代码块（含围栏行）/ 引用块行只从 `sentences` 里剔除；四类非文本行（K-2）**同时**从 `sentences` 与 `textLines` 里剔除；
   `paragraphs` / `chars` / `latinWords` 对上述所有行照算（与 `input-*.mjs` 的 `lines` 同口径）。在标题、代码或图片占位密集的文档上，`sentences / paragraphs` 这类比值会被系统性拉低——
   旧链 `S`（操作块占比）的分母请用 `textLines`，不要用 `paragraphs`（§6.5）。
4. **~~YAML front-matter 不算标题行~~（T-F4c 已消除）**：T-F4c 之前只有 `^#{1,6}\s` 与 ``` 围栏被识别，`key: value` 打头的元信息整块计入句数；
   现在文件开头的 front-matter 在统计**之前**整段剥离，全部字段只看正文。剥离规则、失效场景与实测数字见 §6.4。
5. **单行 fenced code 不受保护**：```` ``` ```` 开在同一行的代码、以及行内反引号里的句末标记照常断句（只有整块被排除）。
6. 末段围栏**未闭合**时，其后的行仍计入 `codeBlockLines`（按「交替开关」实现，非报错）；句切分同样把其后的行当代码排除。
7. `chars` 只算 CJK；**与 `input-*.mjs` 的 `chars` 口径不同**（后者 = CJK + 拉丁词），判定阈值不要跨脚本引用。
8. 句切分口径**没有开关**，改口径需改源码。
9. 只做 `%PDF-` 前缀的二进制判定，不做通用二进制嗅探（其它二进制文件可能被当成文本统计出无意义数字）。

### 6.4 T-F4c：统计前剥离 YAML front-matter（2026-10-13）

`input-wechat.mjs` / `input-file.mjs` 产出的 `.md` 在文件开头带一段 YAML front-matter。T-F4c 之前这段元信息**整段参与统计**，
每篇凭空多出 17–19 句、17 个段落，第三个样本 **71% 的 `latinWords`** 来自英文字段名；而旧链的论证性分数把句数当 `P`（主张句比例）与 `D`（指示词密度）的分母、
把总行数当 `S`（操作块占比）的分母，三项同向被压低，`score` 系统性偏低，旧链那条 0.60 的体裁边界因此失真。

**规则**（`splitFrontMatter()`）：先做常规归一化（去 BOM、CRLF→LF），再判首行是否为 `---`；是则向下找**下一个** `---` 行，
连同该行一并剥离，仅其余部分交给各计数器（`splitFrontMatter()` 内部对 CRLF 再做一次兜底归一化）。首行不是 `---`，或找不到配对结束行，
一律**全文照常统计**（绝不吞正文）。剥离行数记入 `frontMatterLines`（含首尾两条 `---`；无则 `0`），该字段出现在 JSON、人类可读输出与 `--help` 统计项列表里（T-F4c 时它是末位字段；**T-F5d 起末位字段是 `textLines`**，见 §6.5）。

**三个样本「改前 → 改后」**（旧值 = 用改前脚本对同一文件实测）：

| 样本 | sentences | paragraphs | chars | latinWords | frontMatterLines |
|---|---|---|---|---|---|
| `python-progress-bar-methods.md` | 106 → **87** | 98 → **81** | 711 → **647** | 341 → **269** | 0 → **17** |
| `social-security-sustainability.md` | 132 → **113** | 90 → **73** | 2697 → **2637** | 361 → **290** | 0 → **17** |
| `over-modelization-critique-economics.md` | 179 → **161** | 61 → **44** | 7045 → **6973** | 98 → **28** | 0 → **17** |
| `suicide-rescue-eighteen-days.md`（长样本） | 920 → **902** | 450 → **433** | 20732 → **20670** | 748 → **675** | 0 → **17** |

`externalLinks` 同为「改前 → 改后」：4 → 3 / 10 → 9 / 1 → 0 / 1 → 0（front-matter 里的 `source_url` 不再计入）；`orderedListItems` / `codeBlockLines` / `blockquotes` 四个样本均为 0。
无 front-matter 的普通 md（`docs/PLAN.md`）在 T-F4c 下逐字不变：`sentences=149 paragraphs=156 orderedListItems=7 codeBlockLines=39 externalLinks=0 blockquotes=2 chars=3173 latinWords=525 frontMatterLines=0`；**T-F5d 后**再测为 `sentences=135` / `textLines=140`，其余字段仍逐字相同（§6.5）。

边界用例（构造小文件实跑，31 项断言全过）：

| 用例 | 结果 |
|---|---|
| front-matter（LF）+ 正文 | `frontMatterLines=6`，正文 8 个计数项与「只喂正文」逐字相同 |
| front-matter（**CRLF**）+ 正文 | 同上（LF 与 CRLF 两条路径结果一致） |
| **BOM** + front-matter + 正文 | 同上（BOM 被归一化后仍能配对 `---`） |
| 首行 `---` 但**无**配对结束行（19 行） | `frontMatterLines=0`，不吞正文（⚠ T-F5d 后：正文里独占一行的 `---` 属非文本行、不再计句，`sentences` 因此比 T-F4c 时少 1；`frontMatterLines` 与其余字段不变，结构等价复测见 §6.5） |
| 无 front-matter 的普通 `.md` | 与改前逐字相同 |
| front-matter 后**紧跟**另一条 `---` 分隔线 | `frontMatterLines=6`，第二条 `---` 留在正文里（T-F4c 时 `sentences` 8 vs 剥离前 7；⚠ T-F5d 后该 `---` 行属非文本行、不再计句，它贡献的那 1 句从两数里同时消失，结构等价复测见 §6.5） |
| 空文件 | 退出码 4（与改前一致） |
| 无 front-matter 的 CRLF 文件 vs LF 文件 | 两者 8 个计数项逐字相同 |

**已知代价 / 误伤面**：① 正文首行恰好是 `---`、且后文还有任意一条 `---` 行（例如紧跟一条水平分割线，或正文里再嵌一段 YAML）
的普通文档会被误剥到第二条 `---` 为止——本仓 `input-*.mjs` 的产物正好是这种「front-matter + 正文」形状，所以是刻意取舍；
② **只有 front-matter、没有正文**的文件现在返回退出码 **4**（正文里既无 CJK 也无拉丁字母），改前返回 0——这是唯一一处行为变化，属预期收紧。

### 6.5 T-F5d：ASCII `!` / `?` 断句修正 + 「非文本行」口径（2026-10-13，K-1 / K-2 / K-4 / K-5）

`docs/fixwave-3.md` §6 把 K-1…K-10 写成唯一口径，落到本脚本的是四条：

- **K-1（修实现）**：ASCII `!` / `?` 的句末判定改为与 `_scratch/retired/stage1-protocol/references__01-genre-routing.md` 一致——**后接空白 / 换行 / CJK 即断句**，其余情形算词内标点。
  旧实现只要后一个字符落在「字母 / 数字 / CJK」集合里就判**不断句**，于是 `你好!世界` 实测 1 句（协议要求 2 句）；而本文件 §6.1 边界表当时记的是 2 ✅，与 §6.3 第 2 条「`你好!你` → 1 句」**自相矛盾**。本次两处一并改掉（`isSentenceBoundary()`）。
  注意 K-1 是**双向**的：后接 ASCII 标点（如 `?!`）在旧口径下算断句、新口径下不算，因此不能只看「多切」一个方向。
- **K-2（新增口径）**：**非文本行**＝① `![图N]` 独占行；② 纯 URL 独占行（含 `<…>` 包裹）；③ 水平分割线独占行（`---` / `***` / `___`）；④ 纯标点行（整行不含任何字母或数字，含 `……` / `▼` / `##` / `◆ ◆ ◆ ◆` 与 emoji 行）。
  这类行**不计句数、也不计 `textLines`**，但仍计入 `paragraphs`（`isNonTextLine()`）。
- **K-4（新增字段）**：JSON 末位新增 `textLines` ＝ `paragraphs` − 非文本行数；人类可读输出末行、`--help` 统计项、本文件字段表均已同步。
- **K-5（语义不变 + 写清）**：`paragraphs` 语义**一字未改**，仍是「正文非空行数」，**不是自然段落数**（字段表已逐字写明）；跨脚本同名不同义见字段表 `chars` / `latinWords` 行。

**K-1 边界用例**（stdin 注入；「改前」= T-F5d 前的磁盘版本，已先复制到 `%TEMP%` 当 oracle，改前改后各跑一次 `--json`）：

| 输入 | 改前 `sentences` | 改后 `sentences` | 判据 |
|---|---|---|---|
| `你好!世界` | **1 ❌** | **2** ✅ | ASCII `!` 后接 CJK |
| `你好?世界` | **1 ❌** | **2** ✅ | ASCII `?` 后接 CJK |
| `你好!你` | **1 ❌** | **2** ✅ | 同上（§6.3 旧表述一并改掉） |
| `Hello! World` / `你好! World` / `你好? 世界` / `你好?`＋换行＋`世界` | 2 / 2 / 2 / 2 | 2 / 2 / 2 / 2 | 后接空格或换行（改前也对） |
| `你好?!世界` | 2 | 2 | `?` 后接 ASCII `!` 不算句末，`!` 后接 CJK `世` 才切 |
| `a!b` / `a?b` / `你好!World` / `A? B` | 1 / 1 / 1 / 2 | 1 / 1 / 1 / 2 | 后接 ASCII 字母 → 词内标点；后接空格 → 断句 |
| `Wow!` / `你好!`（`!` 在行尾） | 1 / 1 | 1 / 1 | 无后一个字符 → 仍算句末 |
| `你好！世界` / `你好。世界` / `你好。。世界` | 2 / 2 / 2 | 2 / 2 / 2 | 全角标记无条件断句；连续标点算一次 |
| `版本 v1.2.0 发布了。` / `见 https://a.com/b?x=1 的说明。` | 1 / 1 | 1 / 1 | ASCII `.` 永不切；URL query 不被切开 |
| `## 标题`＋`正文一句。` / ``` 围栏 2 行 + 引用行 + 正文两句 | 1 / 2 | 1 / 2 | 标题行、围栏内、引用块行不计（与改前一致） |

**K-2 边界用例**（stdin 注入）：

| 输入 | 改前 `sentences` | 改后 `sentences` | 改后 `paragraphs` / `textLines` |
|---|---|---|---|
| 两行正文之间夹 `![图1]`、`https://example.com/a?b=1`、`---`、`......` 各一行 | 7 ❌ | **3** ✅ | 7 / **3** |
| 只有 `![图1]` 一行 | 1 ❌ | **0** ✅ | 1 / **0** |
| 只有 `https://a.com` 一行 / 只有 `<https://a.com>` 一行 | 1 / 1 ❌ | **0** / **0** ✅ | 1 / **0** |
| 只有 `# 标题` 一行 / 只有 `> 引用一句。` 一行 | 0 / 0 | 0 / 0 | 1 / **1**（标题行与引用块行是**文本行**，只从句数里剔除） |
| 只有 `-` / `---` / `***` / `___` / `......` / `◆ ◆ ◆` / emoji 行 | 退出码 4 | 退出码 4 | 与 K-2 无关：这些行既无 CJK 也无拉丁字母，落进既有的「内容不可用」判定（改前改后一致） |

**30 篇样本回归**（`testset/samples/*.md` 全量跑 `--json`，改前 / 改后各一次）：

- `paragraphs` / `chars` / `latinWords` / `frontMatterLines` / `orderedListItems` / `codeBlockLines` / `blockquotes` / `externalLinks` **30 篇全部逐字未变**。
- `sentences` 合计 **7359 → 6749（−610）**；用「旧边界 + 只跳过非文本行」的中间版本逐篇复算可完全对齐这 610 句，即**本次样本上 K-1 的净影响为 0 句、610 句全部来自 K-2**。
- 610 而非 611 的原因：全样本非文本行共 **611** 行＝`![图N]` **551** + 纯 URL **6** + 水平分割线 **0** + 纯标点 **54**，其中 `a-prose-piece-midlife.md` 的那一行是 `……`（本身含全角句末标记、改前也产不出句子），故只有 610 行在改前各贡献 1 句——该篇也是唯一 `sentences` 不变的样本。
- 降幅最大的是 `reading-club-invitation-soft-launch.md`：256 → **152** 句（`paragraphs` 217 不变，`textLines` **113**；104 行非文本＝70 张图 + 34 行纯标点）。
- 交叉核对（30/30 全部成立，0 例外，`input-file.mjs` 的 `lines` 为准）：`lines − frontMatterLines = paragraphs`，且 `lines − frontMatterLines − textLines` = 非文本行数；合计 `4350 − 510 = 3840 = 3229(textLines) + 611`。
- 口径未动项的复测：`docs/PLAN.md`（无 front-matter）`sentences` 149 → **135**、`textLines=140`，其余 8 个字段逐字相同；front-matter 剥离（T-F4c）行为未动——首行 `---` 无配对结束行仍 `frontMatterLines=0`，front-matter 后紧跟的另一条 `---` 仍 `frontMatterLines=6` 且留在正文里（该行现按非文本行处理，不再计句）。

**已知观察（环境侧，未定性，与脚本逻辑无关）**：从 DSH `run_code`（父进程为该 runtime 的 node）用 `child_process` 管道捕获本脚本 stdout 时，曾观察到返回值只剩 `\r\n`、JSON 全丢（同一命令改用 `pwsh` + 捆绑 `node.exe` + 重定向到文件即正常）。
**未定性为脚本缺陷**：以捆绑 `node.exe` 作父进程、管道捕获 vs 文件重定向，本脚本 32 个输入 × 2 种输出模式共 **64 次运行逐字节一致（0 差异）**，故判为**环境侧**（疑与该 runtime 的 stdio 处理、或 `process.exit()` 前的管道写入有关）。
**防御性改动（不改输出语义、不改退出码）**：`main()` 与 `--help` 两条 stdout 出口在 `process.exit()` 前各加一次 `await flushStdout()`（等 stdout 排空）——这是本次唯一一处与口径无关的源码改动。
