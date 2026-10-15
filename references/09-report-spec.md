<!--
09 · 报告规范与模板说明
定位：**呈现规范**——把六层协议（00–08）已经定义的输出，渲染成人类可读、可复核、结构可机械核对的报告。本文件不定义任何判据、阈值、维度、档位。
唯一真源：`references/00-protocol.md`（§2 硬规则 / §3 统一输出块与字段约束 / §4 报告结构 / §5 降级表 / §6 术语 / §7 层间边界）。
配套模板与卡片：`templates/screening-card.md`（一页纸筛选卡，交付物**前置第一节**）、`templates/report-single.md`（A/B 轨，论证审查轨）、`templates/report-c-track.md`（C 轨，非论证审查轨）。
冲突裁决顺序：`00-protocol.md` > 各层文件（01–08）> `rubric/` > 本文件。本文件只规定「怎么摆」，不规定「怎么判」。
指针约定：本文件一律用「`文件` §节名 / 字段名 / 规则号」定位，**不写行号**；唯一例外是附录 C 的问题登记表（行号快照，见该表表头说明）。
-->

# 09 · 报告规范与模板（一页纸筛选卡 + 13 章逐章 + 报告级附录 A）

## 总则（不计入 1–13 编号）

### 0.1 本文件是什么、不是什么

- **是**：交付物**前置第一节**（一页纸筛选卡）与 13 章的呈现规范（每节/每章：目的 / 数据来源 / 渲染格式 / 反例）、报告级**附录 A**（分层统一输出块）的渲染规则，三份可直接复制填写的模板（`templates/screening-card.md`、`templates/report-single.md`、`templates/report-c-track.md`），以及占位符溯源表与两条机械核对规则。
- **不是**：判据规范。本文件出现的每一个字段名与取值，都能在 `references/00-protocol.md`、`01`–`08`、`rubric/vetoes.md`、`rubric/quality-dims.md` 中找到出处；不新增、不改名、不扩展任何枚举。
- 交付物以**一页纸筛选卡**开头（**前置第一节**），其后是 **13 章报告**——两者**必须同一次交付**，不得只交其一；筛选卡**可以另外单独导出一份只含第 0 章的一页纸**，但**不得**以单独那份替代完整报告（出处：用户裁定 `docs/DECISIONS.md` #55、#56 ⑤、#62）。筛选卡与报告级**附录 A** 一样**不带数字序号**；13 章的编号与顺序仍是 1–13，**不得**因筛选卡而重排或重编号。
- 报告结构**13 章固定顺序，不得增删**；某章无内容时写 `无`，**不得省略**（出处：`references/00-protocol.md` §4 报告结构（13 章表））。13 章之后另有报告级**附录 A**（分层统一输出块），**不计入 13 章**、不得插回章节序列（出处：`references/00-protocol.md` §4 报告结构（附录 A 行））。

### 0.2 五条硬口径（逐字落实，违反任一条即不合格）

1. 任何 `items[]` 条目，`evidence` 为空即不得成条——宁可写进第 11 章。（出处：`references/00-protocol.md` §2 硬规则 2「证据强制」）
2. 隐含假设**豁免**原文引用，但必须给：① 补全句 `P + 假定 ⇒ C`；② 最接近的触发片段（确无写 `无`）；③ 位置取固定值 `文中未给出（隐含）`。（出处：`references/00-protocol.md` §4 第 3 章（报告结构））
3. **v1 只出档位、不设任何数值位置**：报告不设总分 / 质量分位置，也不留「不适用」之类占位；命中否决项（`V1`–`V8` 任一，触发条件见 `rubric/vetoes.md`，契约 §2 硬规则 8「门禁唯一真源」）直接落 `D` 档 🔴、**不进质量分级**；档位不可判定时取第五值 `无法判定`（灯 🔵）。档位取**闭集** `A` / `B` / `C` / `D` / `无法判定`（闭集之外无任何合法取值）；灯与档位是同一根轴的两个形态：`A`=🟢 `B`=🟢 `C`=🟡 `D`=🔴 `无法判定`=🔵。第 10 章照常逐维给出**该维取值（`低` / `中` / `高`）与判定依据**，**禁止为填满字段倒推分数**。（出处：`references/00-protocol.md` §4 第 2 与第 10 章口径；用户裁定 `docs/DECISIONS.md` #40、#56 ①②③）
4. C 轨报告必须逐字包含 `本文未做论证审查，改按 C 轨判据评估`，且全文不得使用「前提」「结论」「推理有效性」「谬误」这类论证审查词汇。（出处：`references/08-track-c.md` §输出字段（`disclaimer`）、`references/08-track-c.md` §判定规则 R1（C 轨禁用词））
5. 任一层 `verdict = 无法判定` 或 `degraded: true` 时，报告不得给出高置信绿灯档（`A` / `B`），必须在第 10 章与第 13 章显式写出降级事实及其对档位的影响。（出处：`references/00-protocol.md` §2 硬规则 9「降级传导」）

三处必须显式承载的字段：第 1 章的「判定者模型标识」与「自偏好风险」（`references/00-protocol.md` §4 第 1 章（文章元数据）、`references/00-protocol.md` §4 第 1 章字段（`自偏好风险`））；第 11 章合并**全部层**的 `unknowns[]`（`references/00-protocol.md` §3 字段约束表 `unknowns[]` 行、`references/00-protocol.md` §4 第 11 章（不确定与待核实））；第 13 章写明「本文实际跑了哪几层 / 有无降级 / 已知局限」（`references/00-protocol.md` §4 第 13 章（成本与局限声明））。

### 0.3 阈值表述的硬约束

**v1 只出档位，不报 0–120 数值**（用户裁定 `docs/DECISIONS.md` #40、#55；契约 §4 第 2 与第 10 章口径）：报告**不设总分 / 质量分位置**，也不留「不适用」之类占位；**不得出现任何需要填 0–120 数值的位置**。临时门限与校准程序（`T_pass` / `T_border`，`references/07-rating.md` §判定规则 R9③）**已作废、不再恢复**（#55 取消校准）：报告不打印门限数值，也不出现与门限的比较串（`calibration` 字段与 `T_pass` / `T_border` 一并删除，见 `docs/DECISIONS.md` #58）。该组口径的处置见附录 C 的 C-11、C-15、C-24、C-25。

### 0.4 模板的用法

- 三份可直接复制填写的模板：一页纸筛选卡（`templates/screening-card.md`，交付物**前置第一节**）与两份报告模板（`templates/report-single.md`、`templates/report-c-track.md`——两份各自已含前置第一节的筛选卡区、13 章正文与报告级附录 A）。
- 填写顺序：先填筛选卡区（灯 / 档位 / 文章摘要 / 内容清单 / 结论·原因），再填 13 章；整份复制 → 卡区按字面标签填、正文逐项替换双花括号占位符 → 删除头部注释段与文末「最小填写示例」。
- 模板不新增任何字段；每个占位符的来源见附录 P；两条机械核对规则见附录 B。
- 模板中的 HTML 注释（`<!-- … -->`）是填写提示，产出报告时删除。

---

## 前置节 · 筛选卡（一页纸，不计入 1–13 编号）

- **目的**：让读者在不读全文的情况下判断「**值不值得花时间读**」——一页纸给出灯与档位、文章摘要、内容清单、结论/原因（出处：用户裁定 `docs/DECISIONS.md` #55、#56 ⑤）。
- **数据来源**：L0 的 `处置` / `理由`、L6 的 `verdict`（＝档位与灯）/ `confidence`、第 1 章的 `标题` / `来源` / `判定时间`；摘要与内容清单由执行者从原文与各层 `items[]` 归纳——**不是新增字段、不参与评分**（出处：`references/00-protocol.md` §4 第 1、2 章；`references/01-genre-routing.md` §输出字段；`references/07-rating.md` §输出字段）。
- **渲染格式**：三种载体同一套字段——① 独立卡片 `templates/screening-card.md`；② 两份报告模板的**前置第一节**（同一份交付物、同一次交付，「按序」＝卡在前、13 章报告在后；单独导出的一页纸不得替代完整报告）；③ 本规范。字段**全部必填、缺一即不合格**：**灯**（字面 `🟢` / `🟡` / `🔴` / `🔵` + 档位名，置最显眼位置；灯映射 `A`=🟢 `B`=🟢 `C`=🟡 `D`=🔴 `无法判定`=🔵）· **档位**（闭集 `A` / `B` / `C` / `D` / `无法判定`）· **文章摘要**（🟢/🟡/🔵 ≤200 字，必须讲清「谁 → 什么事 → 说了什么」；🔴 ≤80 字）· **内容清单**（≤7 条，每条一句话并标 `[数据]` / `[事实]` / `[观点]` / `[方法]`；写不满写实际条数、**不得凑**；一条都没有写「无」并说明原因；🔴 写「无（红灯略过内容清单）」）· **结论 / 原因**（🟢 写「为什么值得读」；🟡 写「值得读的部分 + 有问题的部分」；🔴 只写「为什么不用读」；🔵 写「已确认的部分 + 缺什么才能判」）。四种形态的骨架**都要在模板里给出**，填卡时只保留命中形态的那一段。**C 轨**：该字段名改为「判定 / 原因」，且卡片内保留逐字 `disclaimer`（见附录 C 的 C-21）（出处：`docs/DECISIONS.md` #56 ②⑤；`templates/screening-card.md`；`references/08-track-c.md` §判定规则 R1）。
- **反例**：把摘要或内容清单当可选项省略（两者是**必需字段**）；绿灯卡只写「值得读」却不说这篇讲了什么事；红灯卡保留内容清单或把摘要写到 200 字；蓝灯卡与黄灯卡合并（`无法判定` 是独立一档、独立蓝灯）；内容清单为凑满 7 条而注水或重复；筛选卡里出现需要填 0–120 数值的位置（出处：`docs/DECISIONS.md` #56 ②⑤；本文件 §0.3）。

---

## 1. 文章元数据

- **目的**：给出可追溯性——谁、何时、用什么模型判的，供第三方复核与复现（出处：`references/00-protocol.md` §4 第 1 章（文章元数据））。
- **数据来源**：输入元数据（`标题` / `来源` / `作者` / `日期` / `字数` / `采集方式`）+ 判定会话自报（`判定时间` / `判定者模型标识` / `自偏好风险`）（出处：`references/00-protocol.md` §4 第 1 章（文章元数据）；`references/01-genre-routing.md` §输入（元数据行））。
- **渲染格式**：9 行两列表格（字段 / 值），字段名逐字照抄；`判定者模型标识` 取执行者 agent 的 `provider/model` 字符串（如 `anthropic/claude-opus-4`），无法获得时写固定串 `未提供`，**不接受空值或「AI」这类占位写法**；该字段**只用于推导 `自偏好风险`，不参与评分**；**标识不可得时**（执行者工具面不提供自身 `provider/model` 时）：`自偏好风险` **一律记 `无法排除`**（依据 `references/00-protocol.md` §4 第 1 章字段（`自偏好风险`）：值域三值 `是` / `否` / `无法排除`，**不得自造第四值**；**不得**记 `是`——那会断言一个并未发生的事实——也不得记 `否`），并在第 13 章写明原因；`自偏好风险` ∈ `是` / `否` / `无法排除`，记 `是` 或 `无法排除` 时第 13 章必须复述（出处：`templates/report-single.md` §第 1 章元数据表；`references/00-protocol.md` §4 第 1 章字段（`自偏好风险`））。
- **反例**：把 `判定者模型标识` 写成 `AI`；`判定者模型标识` 写 `未提供` 却让 `自偏好风险` 记 `是`、留空或自造第四值（标识不可得时应记 `无法排除`，并在第 13 章写明原因）；省略 `自偏好风险` 一行；把「作者」与「来源」并成一格；C 轨漏掉表前的逐字 disclaimer（出处：`references/00-protocol.md` §4 第 1 章字段（`自偏好风险`）；`references/08-track-c.md` §输出字段（`disclaimer`））。

## 2. 一句话结论

- **目的**：用一行给出可判定的处置与档位，不展开论证（出处：`references/00-protocol.md` §4 第 2 章（一句话结论））。
- **数据来源**：L6 的 `verdict`（＝档位与灯）/ `confidence` + L0 的处置与 `理由`（**L6 无 `score` 字段**——该字段已删除（`docs/DECISIONS.md` #58），不是「不取」而是「无处可取」，出处：`references/00-protocol.md` §4 第 2 与第 10 章口径；`references/07-rating.md` §输出字段（输出块字段表）；`references/01-genre-routing.md` §输出字段）。
- **渲染格式**：单行引用块 `> {{verdict}}（＝档位）｜灯 = <🟢 / 🟡 / 🔴 / 🔵>｜置信度 = {{confidence}}｜理由 = {{理由}}`（档位取闭集 `A` / `B` / `C` / `D` / `无法判定`；**报告不设总分 / 质量分位置**，不得出现任何 0–120 数值位置或「不适用」占位；**档位不可判定**——任一层 `verdict = "无法判定"` 或 `degraded: true`，**且该层的产出按本层规则必须参与档位合成**，导致档位合成不出来——时档位取第五值 `无法判定`、灯 🔵，本行照常只写四项；**L1 的降级不在其列**——按 `references/07-rating.md` §判定规则 R2 的 `L1` 行，L1 降级不压档，后果只由 `degraded` + `confidence` 承担（`docs/e2e-run-2-defects.md` G-01））；`理由` ≤40 字且不得只写一个字母；A/B 轨在行末逐字追加 `【工程约定，非科学结论】`——这一句是报告第 2 章标记串的**唯一真源**：其它文件（含 `references/07-rating.md`）**不得复述串文**，只可指向本行（`docs/e2e-run-2-defects.md` G-07；见附录 C 的 C-33）（出处：`references/00-protocol.md` §4 第 2 章（一句话结论）、`references/00-protocol.md` §4 第 8 章（缺陷清单）；`references/07-rating.md` §判定规则 R9②；`references/01-genre-routing.md` §判定规则 R8（处置必须给理由））。C 轨标题改中性措辞「一句话判定」（`结论` 属 R1 禁用词），且不需要上述标记（门限与校准程序已整体作废、无待标记对象；见附录 C 的 C-10 与 C-25）。另：v1 **不输出 0–120 数值**，报告以**档位**为主输出；原「校准后恢复数值输出」的安排**已作废、不再恢复**（#55），**不得**做跨档位比较，也不得宣称 0–120 是等距量表（出处：`references/07-rating.md` §判定规则 R9 报告口径行；用户裁定 `docs/DECISIONS.md` #37、#40、#55）。
- **反例**：`理由` 写成「A」；报告里出现总分 / 质量分位置（含写「不适用」之类占位）；总分位置出现 0–120 数值（如 `57`、`82 分`）；命中否决项时仍填数值；档位不可判定却用任一默认档位填补（应取第五值 `无法判定`、灯 🔵）；把旧版本的 `score` / 0–120 数值带进报告；档位写出闭集之外的取值（如已删除的顶档、已废弃的三值门禁名）；任一层降级却仍写高置信绿灯档（`A` / `B`）（出处：`references/00-protocol.md` §4 第 2 与第 10 章口径；硬规则 9「降级传导」；`docs/DECISIONS.md` #56 ①）。

## 3. 四要素表

- **目的**：把「论题 / 结论 / 论据 / 前提假设」四项落到原文，可逐条核对（出处：`references/00-protocol.md` §4 第 3 章（四要素表）及其「报告结构」要求）。
- **数据来源**：L2 的四要素表（`claim` / `grounds`，含 `论题类型`）+ L3 的隐含假设（出处：`references/03-structure.md` §输出字段（四要素表）、`references/03-structure.md` §输出字段（Toulmin 五项）、`references/03-structure.md` §判定规则 R9（`论题类型`）；`references/04-assumptions.md` §输出字段（`items[]` 区））。
- **渲染格式**：5 行表；除隐含假设行外的四行必须附原文引用，格式 `[locator] 「原文逐字引用」`（`locator` 取值闭集四选一：`第 N 段`｜`小标题「…」`｜`第 N 节`｜`行 N`（源文件行号），自然段边界不可判时用 `行 N`；超 60 字截断；见 `references/03-structure.md` L2-R8）；隐含假设行固定写「见 L3（第 7 章）」，其位置字段取固定值 `文中未给出（隐含）`（出处：`references/03-structure.md` §判定规则 R8（引用格式）；`references/00-protocol.md` §4 第 3 章（报告结构））。
- **反例**：论题 / 结论 / 论据三行只写概述、不附逐字引用；隐含假设行留空或凭空编一段原文；`locator` 自造格式（如 `p.12`）（出处：`references/00-protocol.md` §4 第 3 章（报告结构）；`references/03-structure.md` §判定规则 R8（引用格式））。

## 4. 体裁与处置

- **目的**：锁定后续判据的选择依据（A / B / C 轨）（出处：`references/00-protocol.md` §4 第 4 章（体裁与处置））。
- **数据来源**：L0 的 `items[]`——`label` / `score` / 论证性分数 / 处置 / 理由（出处：`references/01-genre-routing.md` §输出字段、`references/01-genre-routing.md` §标签闭集）。
- **渲染格式**：4 行表；体裁标签取自闭集 7 种（`argument` / `academic` / `tutorial` / `news` / `exposition` / `narrative` / `persuasion`），可多标签，**每个标签附 ≥1 条原文引用**；处置取 `A` / `B` / `C` / `混合` / `不确定`；本层 `verdict` 照抄（出处：`references/01-genre-routing.md` §标签闭集、`references/01-genre-routing.md` §输出字段（`verdict` 取值）、`references/01-genre-routing.md` §判定规则 R8（处置必须给理由））。
- **反例**：自造第 8 个标签；只写「混合」不写理由；把 L0 的 `score`（标签分数 0–1）当成档位分数（出处：`references/01-genre-routing.md` §输出字段（`L0-G*` 的 `claim` 固定格式）、`references/01-genre-routing.md` §标签闭集）。

## 5. 来源与利益

- **目的**：把外部核查结论与利益关系落到可复核字段（出处：`references/00-protocol.md` §4 第 5 章（来源与利益））。
- **数据来源**：L1 的 `items[]`（作者可查性 / 信源可靠性 / 信息可信度 / 利益相关性 / 外部交叉核查结果 / SIFT 四步执行记录）+ `verdict`（出处：`references/02-source-check.md` §输出字段、`references/02-source-check.md` §输出字段（`verdict` 取值）、`references/02-source-check.md` §判定规则 R4（`作者可查性` 0/1/2/3）、`references/02-source-check.md` §判定规则 R9（`来源主体类型` 五档））。
- **渲染格式**：8 行表，逐项照抄取值：`作者可查性` 0/1/2/3；`来源主体类型` 五档；`信源可靠性` A–F；`信息可信度` 1–6；`外部交叉核查结果` 取 L1 的 `verdict` 四值之一；`SIFT 四步执行记录` 逐步写「做了什么 / 结果」（出处：`references/02-source-check.md` §判定规则、`references/02-source-check.md` §输出字段（`信源可靠性`））。
- **反例**：把「信源可靠性」与「信息可信度」合成一格；`SIFT 四步执行记录` 只写「已完成」；`作者可查性` 写「大概是机构」（出处：`references/02-source-check.md` §判定规则 R4（`作者可查性` 0/1/2/3）、`references/02-source-check.md` §判定规则）。

## 6. 结构完整性

- **目的**：显示主张—理由—保证—例外的完整度，以及论题与结论是否对齐（出处：`references/00-protocol.md` §4 第 6 章（结构完整性））。
- **数据来源**：L2 的 Toulmin 五要素 `claim` / `grounds` / `warrant` / `qualifier` / `rebuttal`，以及「论题—结论对齐」「论证 vs 解释」两项结论（出处：`references/03-structure.md` §输出字段、`references/03-structure.md` §输出字段（Toulmin 五项）、`references/03-structure.md` §判定规则 R2（论题还原测试）、`references/03-structure.md` §判定规则 R9（`论题类型`））。
- **渲染格式**：5 行表，状态列只能写 `显式` / `隐含` / `无`，并在第三列给 `[locator] 「evidence」`；表下三行写「论题—结论对齐」「论证 vs 解释」与本层 `verdict` / `confidence`（出处：`templates/report-single.md` §第 6 章区；`references/03-structure.md` §输出字段（Toulmin 五项））。
- **反例**：`warrant` 缺失时留空而不写 `无`；把 `qualifier`（限定词）与 `rebuttal`（例外）混用；状态列写「部分」（出处：`references/03-structure.md` §输出字段（Toulmin 五项））。

## 7. 隐藏假定

- **目的**：把未言明的假定显式化，并标注类型与是否承重（出处：`references/00-protocol.md` §4 第 7 章（隐藏假定））。
- **数据来源**：L3 的 `items[]`（`id`（`L3-A*`）/ `假定内容` / `类型` / `是否可核实` / `发现方法` / `承重性` / `原文位置`）+ `verdict`（出处：`references/04-assumptions.md` §输出字段（`items[]` 字段表）、§输出字段（`verdict` 取值））。
- **渲染格式**：**9 列表格**（逐条一行）：`id` / `假定内容` / `类型` / `是否可核实` / `发现方法` / `承重性` / `原文位置` / 补全句（`P + 假定 ⇒ C`）/ 最接近的触发片段（确无写 `无`）——这 9 项均为 L3 强制产出，**不得并格、不得省略**；`类型` 只能取 `事实型` / `价值型`（复合情形按 L3-R3 的有序步骤落到其中一型）；`原文位置` 固定填 `文中未给出（隐含）`（出处：`references/04-assumptions.md` §输出字段（`items[]` 字段表）、`references/04-assumptions.md` §判定规则 R1（补全句与固定位置）、`references/04-assumptions.md` §判定规则 R3（`类型` 三值）；`references/00-protocol.md` §4 第 3 章（报告结构））。
- **反例**：把 `发现方法` / `承重性` 省略或并进别的格（L3 强制产出，缺一即不合格）；给隐含假定编一个原文位置；`类型` 写「假设型」或「复合」；把触发词命中数当成条目数（L3 上限 7 条）；未发现时省略本章而非写 `无`（出处：`references/04-assumptions.md` §判定规则 R3（`类型` 三值）、§判定规则 R8（触发词上限 7 条）；`references/00-protocol.md` §4 第 7 章（隐藏假定））。

## 8. 缺陷清单

- **目的**：逐条列出疑似缺陷、触发它的原文、影响程度与最小修改（出处：`references/00-protocol.md` §4 第 8 章（缺陷清单））。
- **数据来源**：L4 的 `items[]`（`impact` / `kind` / `scheme` / `suspected` / `trigger` / `evidence`）（出处：`references/05-defects.md` §输出字段）。
- **渲染格式**：9 列表（含 `失效机制` 列，承载 `items[].trigger`——跨层去重的回指 `参见 L3-R4 命中 #k` 与同 `locator` 落选条目的并入说明写在这一列）；`impact` 三值（`致命` / `重要` / `提示`）；`kind` 五值（`结构缺口` / `推理失效` / `预设装载` / `修辞操纵` / `疑似谬误`）；`scheme` 必须从 L4-R2 的 8 选 1 表中取值；`suspected` 恒为 `true`；每条附 L4-R3 的「最小修改」与逐字原文片段（出处：`references/05-defects.md` §输出字段（字段表）、`references/05-defects.md` §输出字段（`kind`）、`references/05-defects.md` §判定规则 R2（八方案表）、`references/05-defects.md` §判定规则 R3（`最小修改`））。
- **反例**：`impact` 写「中等」；`scheme` 自造名称；`失效机制` 列留空或与「触发原文」列并格（`trigger` 是判定文字、`evidence` 是原文，两者不得合并）；`evidence` 为空的条目仍成条；无缺陷时省略本章（出处：`references/05-defects.md` §判定规则 R2（八方案表）；`references/00-protocol.md` §2 硬规则（证据强制）、`references/00-protocol.md` §4 第 8 章（缺陷清单））。

## 9. 证据强度

- **目的**：把事实主张逐条落地为「要不要人工核查」（出处：`references/00-protocol.md` §4 第 9 章（证据强度））。
- **数据来源**：L5 的 `items[]`（`sourceType` / `needManualCheck` / `imvain` / `downgrade` / `bearsWeight`）+ 计数 `N_total` / `N_with_source` + `verdict`（出处：`references/06-evidence.md` §输出字段）。
- **渲染格式**：9 列表；`sourceType` 四值（`一手` / `二手` / `无出处` / `不可核`）；`needManualCheck` 二值（`是` / `否`），填 `是` 的条目必须同时出现在第 11 章；`imvain` 给 6 位 0/1；`downgrade` 数组逐项列出；`bearsWeight` 二值；表下给两个计数（出处：`references/06-evidence.md` §输出字段（字段表）、`references/06-evidence.md` §判定规则 R5（`needManualCheck` 三条件）、§判定规则 R6（打折卡五域））。
- **反例**：`needManualCheck` 写「可能」；`N_total` 写估计值或省略计数；把整篇写成一条主张（出处：`references/06-evidence.md` §输出字段（`N_total` / `N_with_source`））。

## 10. 否决项与档位

- **目的**：把**否决项**与**质量分级**分开呈现——命中任一否决项即落 `D` 档 🔴、**不进质量分级**，避免用高分补偿否决（出处：`references/00-protocol.md` §4 第 10 章（否决项与档位）；`references/07-rating.md` §判定规则 R1（红灯先于分级生效）；用户裁定 `docs/DECISIONS.md` #56 ③）。
- **数据来源**：L6 的 `gateHits[]` / `dims[]` / `verdict`（＝档位与灯）/ `confidence` / `stability`（**L6 已无 `score` / `calibration` 字段**，理由同第 2 章）+ `rubric/vetoes.md` 的否决项 `V1`–`V8`（触发条件只许引用该文件，不得在本规范复述）+ `rubric/quality-dims.md` 的四维与档位锚点（出处：`references/07-rating.md` §输出字段（输出块字段表）；`rubric/vetoes.md`；`rubric/quality-dims.md` §四维与合成；`docs/DECISIONS.md` #56 ③）。
- **渲染格式**：表 + 口径行。否决项**逐条写出三态之一**——`未命中（已核查）` / `未命中（无法执行）` / `命中`（**不得**只写「未命中」）；`gateHits[]` **只登记真正命中的条目**（登记条件＝有原文证据支撑命中），「未命中（无法执行）」**不得**进 `gateHits[]`（触发条件见 `rubric/vetoes.md`，不在本规范复述）；档位取闭集 `A` / `B` / `C` / `D` / `无法判定`（灯与档位同轴：`A`=🟢 `B`=🟢 `C`=🟡 `D`=🔴 `无法判定`=🔵）；四维（D1 / D2 / D3 / D4）逐维给出**该维取值（`低` / `中` / `高`）与判定依据**并附 ≥15 字原文片段（**不得只给档位**）；**报告不设总分 / 质量分位置**（不得出现 0–120 数值位置或「不适用」占位）；**档位不可判定**（任一层 `verdict = "无法判定"` 或 `degraded: true`，**且该层的产出按本层规则必须参与档位合成**，导致档位合成不出来；**L1 的降级不在其列**，见第 2 章「渲染格式」）时档位取第五值 `无法判定`、灯 🔵；**C 轨**某条判据不可执行时，档位与 `verdict` **只由可执行的判据产生**（不可执行判据不参与计数，**禁止**按最低档或「不通过」计入），第 10、13 章须逐字写明「**档位为条件性，仅由可执行的判据产生**」；报告不出现门限数值（门限与校准程序已整体作废、不再恢复；`calibration` 字段已删除）（出处：`references/00-protocol.md` §4 第 2 与第 10 章口径；`docs/DECISIONS.md` #56 ①②③、#55；`references/07-rating.md` §判定规则 R5（≥15 字原文片段）、`references/07-rating.md` §判定规则 R9③）。`stability` 三值：`稳定`（3 次档位一致）/ `不稳定`（3 次档位不一致；**阻断级**——该篇档位结论不得采信，必须写入第 11 章 `unknowns[]`，且 `confidence` 不得为 `高`）/ `未执行`（只做 1 次判定）（出处：`references/07-rating.md` §输出字段（`stability`）、`references/07-rating.md` §判定规则 R6（稳定性判定））。v1 **不输出 0–120 数值**，报告以**档位**为主输出（原「校准后恢复数值输出」的安排**已作废、不再恢复**）；**不得**做跨档位比较，也不得宣称 0–120 是等距量表（出处：`references/07-rating.md` §判定规则 R9 报告口径行；用户裁定 `docs/DECISIONS.md` #37、#40、#55）。
- **反例**：命中否决项却仍给档位以外的分值；把 `未命中（无法执行）` 登记进 `gateHits[]`、或否决项只写「未命中」而不写三态；报告里出现总分 / 质量分位置或 0–120 数值；档位写出闭集之外的取值（如已删除的顶档）；四维只给档位、不给该维取值与判定依据；把 `gateHits[]` 与 `dims[]` 混在一格；为凑满四维而倒推分数；档位不可判定却用任一默认档位填补；把 `stability` 写成四值、或填已作废的 `分数波动（不影响档位）`；C 轨把不可执行判据按最低档或「不通过」计入（应逐字写「档位为条件性，仅由可执行的判据产生」）；在报告里复述否决项的触发条件（只许引用 `rubric/vetoes.md`）（出处：`references/00-protocol.md` §4 第 2 与第 10 章口径；`references/07-rating.md` §判定规则 R1（红灯先于分级生效）；契约 §2 硬规则 8「门禁唯一真源」）。

## 11. 不确定与待核实

- **目的**：单一出口承载**全部层**的未知项，供人工接手（出处：`references/00-protocol.md` §4 第 11 章（不确定与待核实））。
- **数据来源**：全部层的 `unknowns[]`，每条含 `item` / `reason`，并标注来源层 `layer`（出处：`references/00-protocol.md` §3 字段约束表 `unknowns[]` 行、`references/00-protocol.md` §4 第 11 章（不确定与待核实））。
- **渲染格式**：4 列表（条目 / 原因 / 来源层 / 序号）；第 9 章 `needManualCheck = 是` 的条目必须在此出现；无内容写 `无`（出处：`references/06-evidence.md` §判定规则 R5（`needManualCheck` 三条件））。
- **反例**：只合并 L5 的 `unknowns[]`；无内容时省略本章；把「未做核查」写成「已核查无误」（出处：`references/00-protocol.md` §3 字段约束表 `unknowns[]` 行、`references/00-protocol.md` §4 第 11 章（不确定与待核实））。

## 12. 要点提炼

- **目的**：给读者 ≤5 条可复述要点，每条能回到原文（出处：`references/00-protocol.md` §4 第 12 章（要点提炼））。
- **数据来源**：L2 的结构结论 + L5 的证据强度结论（出处：`references/00-protocol.md` §4 第 12 章（要点提炼）；`references/07-rating.md` §判定规则 R16（第 12 章 Adler 四问））。
- **渲染格式**：编号列表，至多 5 条，按 Adler 四问组织（讲什么 / 怎么讲 / 对不对 / 与我何干），每条附 `[locator] 「evidence」`；无内容写 `无`（出处：`references/07-rating.md` §判定规则 R16（第 12 章 Adler 四问））。C 轨不执行 L2/L5，按其第 12 章缺口处理（附录 C 的 C-8）。
- **反例**：写 7 条；要点不带原文引用；把第 2 章的一句话复制成第 1 条要点（出处：`references/07-rating.md` §判定规则 R16（第 12 章 Adler 四问））。

## 13. 成本与局限声明

- **目的**：声明本文实际跑了哪几层、有无降级、已知局限，防止把残缺结果当完整结论（出处：`references/00-protocol.md` §4 第 13 章（成本与局限声明））。
- **数据来源**：全部层的 `layer` / `verdict` / `degraded` / `degradeReason` + L6 的 `confidence` + 第 1 章的 `自偏好风险`（出处：`references/00-protocol.md` §3 字段约束表（`degraded` / `degradeReason`）、`references/00-protocol.md` §4 第 13 章（成本与局限声明）、`references/00-protocol.md` §4 第 1 章字段（`自偏好风险`）；`references/07-rating.md` §输出字段（`stability`））。
- **渲染格式**：逐层一行的小表（层 / `verdict` / `degraded` / `degradeReason`），未执行的层逐行写 `未执行`；表下五行：实际执行层、已知局限、降级事实及其对档位的影响、**无法执行的条目清单**（若存在：逐条列出是哪些否决项 / 判据、因何无法执行，并与该层的 `degradeReason` **同源**）、自偏好风险复述（出处：`references/00-protocol.md` §4 第 13 章（成本与局限声明）、`references/00-protocol.md` §4 第 1 章字段（`自偏好风险`）；`templates/report-single.md` §第 13 章区）。
- **反例**：只写「无降级」而不逐层列层名；全篇存在「无法执行」的条目，本章却不列出是哪些条、因何无法执行；自偏好风险记 `是` 却不在本章复述；任一层 `无法判定` 或 `degraded: true` 却未写出对档位的影响（出处：`references/00-protocol.md` §4 第 13 章（成本与局限声明）、`references/00-protocol.md` §4 第 1 章字段（`自偏好风险`）；硬规则 9「降级传导」）。

---

## 附录 A · 分层统一输出块（报告级附录，不计入 13 章）

- **目的**：让每层的核心中间产物在报告里**有落点**——「按契约执行」与「按模板交付」由此可同时复核（出处：`references/00-protocol.md` §4 报告结构（附录 A 行）；`docs/fixwave-2.md` 簇 H1）。
- **数据来源**：各层 §3 统一输出块本身（`layer` / `question` / `verdict` / `items[]` / `unknowns[]` / `degraded` / `degradeReason`；C 轨另含 `disclaimer`）（出处：`references/00-protocol.md` §3 字段约束表、`references/00-protocol.md` §4 报告结构（附录 A 行））。
- **渲染格式**：按层序 `L0` → `L1` → `L2` → `L3` → `L4` → `L5` → `L6`（C 轨为 `L0` / `L1` / `LC` / `L6`——C 轨不执行 L2–L5，但 L6 否决项与档位层照跑）逐层一段，段内**原样**给出该层输出块的字段与取值：`items[]` 逐条照抄，`id` / `claim` / `evidence` / `locator` **不得摘要、不得改写**；`unknowns[]` 逐条照抄；某层未执行时整段写 `未执行（<原因>）`，并把原因登记进第 11 章；本附录位于第 13 章之后，**不计入 1–13 编号**，也不得插回章节序列；`LC` 块的 `items[]` 除 `id` / `criterion` / `check` / `counts` 外**必须逐条给出该条判据的依据**（原文片段；计数类判据给具体数字与清点基线）——契约 §2 硬规则 2（证据强制）「`evidence` 为空者不得成条」在 C 轨由该列承担，无依据的条目不成立、改记 `unknowns[]`；`L6` 块原样给出 `gateHits[]` / `dims[]` / `verdict`（＝档位与灯；`band` 字段**已废弃**，灯按 `references/07-rating.md` §判定规则 R18 映射），档位不可判定时取第五值 `无法判定`、灯 🔵（C 轨 `dims[]` 只写 `C1` / `C2` / `C3`、`gateHits[]` 只允许 `V2`–`V5` 与 `V7` / `V8`）（出处：`references/00-protocol.md` §4 报告结构（附录 A 行）、`references/00-protocol.md` §5 降级与失败（降级表））。
- **反例**：把附录 A 编成第 14 章；只给 `verdict`、不给同层的 `items[]`；未执行的层整段省略；把第 3–13 章的内容复述一遍当作附录 A（出处：`references/00-protocol.md` §4 报告结构（附录 A 行）；`references/00-protocol.md` §4 第 3 章（报告结构））。

---

## 附录 P · 占位符 → 来源字段完整对照表

说明：**（本附录原为「附录 A」，因契约 §4 于 2026-10-13 新增报告级「附录 A（分层统一输出块）」而改名为「附录 P」；表内容与附录 B 的规则号 B1 / B2 不变。）** 占位符书写形式为双花括号包裹（本表为可读性把外壳写在栏内）。「逐字一致」指占位符内的名字必须与来源文件中的字段名完全相同，**不得改名、不得自造**。同名占位符在多层间复用（`verdict` / `layer` / `id` / `evidence` / `locator` / `confidence` / `reason` / `item` / `claim`），其取值来源＝该章「数据来源」注明的层。核对方式见附录 B 的 B2。

### A.1 契约级（`references/00-protocol.md` §3 字段约束 / §4 报告结构）

| 占位符 | 来源文件 | 字段名与位置（逐字） |
|---|---|---|
| `{{layer}}` | `references/00-protocol.md` | `layer`（§3 字段约束表 `layer` 行；C 轨写 `LC`） |
| `{{verdict}}` | `references/00-protocol.md` | `verdict`（§3 字段约束表 `verdict` 行；取值见各层 §输出字段） |
| `{{id}}` | `references/00-protocol.md` | `items[].id`（§3 字段约束表命名法 `L<层号>-<块字母><序号>`） |
| `{{claim}}` | `references/00-protocol.md` | `items[].claim`（§3 字段约束表 `items[].claim` 行） |
| `{{evidence}}` | `references/00-protocol.md` | `items[].evidence`（§3 字段约束表 `items[].evidence` 行；为空不得成条） |
| `{{locator}}` | `references/00-protocol.md` | `items[].locator`（§3 字段约束表 `items[].locator` 行） |
| `{{confidence}}` | `references/00-protocol.md` | `items[].confidence`（§3 字段约束表 `items[].confidence` 行） |
| `{{unknowns[]}}` | `references/00-protocol.md` | `unknowns[]`（§3 字段约束表 `unknowns[]` 行） |
| `{{item}}` / `{{reason}}` | `references/00-protocol.md` | `unknowns[].item` / `unknowns[].reason`（§3 字段约束表 `unknowns[]` 行的元素字段） |
| `{{degraded}}` | `references/00-protocol.md` | `degraded`（§3 字段约束表 `degraded` 行） |
| `{{degradeReason}}` | `references/00-protocol.md` | `degradeReason`（§3 字段约束表 `degradeReason` 行；`degraded: true` 时必填） |

### A.2 第 1 章（`references/00-protocol.md` §4 第 1 章（文章元数据）；输入元数据见 `references/01-genre-routing.md` §输入（元数据行））

| 占位符 | 来源文件 | 字段名（逐字） |
|---|---|---|
| `{{标题}}` | `references/00-protocol.md` §4 第 1 章（文章元数据） | 标题（输入元数据：`references/01-genre-routing.md` §输入（元数据行）） |
| `{{来源}}` | `references/00-protocol.md` §4 第 1 章（文章元数据） | 来源 |
| `{{作者}}` | `references/00-protocol.md` §4 第 1 章（文章元数据） | 作者（输入元数据里叫「署名」，见附录 C 的 C-9） |
| `{{日期}}` | `references/00-protocol.md` §4 第 1 章（文章元数据） | 日期（输入元数据里叫「发布日期」） |
| `{{字数}}` | `references/00-protocol.md` §4 第 1 章（文章元数据） | 字数 |
| `{{采集方式}}` | `references/00-protocol.md` §4 第 1 章（文章元数据） | 采集方式 |
| `{{判定时间}}` | `references/00-protocol.md` §4 第 1 章（文章元数据） | 判定时间 |
| `{{判定者模型标识}}` | `references/00-protocol.md` §4 第 1 章（文章元数据） | 判定者模型标识（取执行者 agent 的 `provider/model`；无法获得时写固定串 `未提供`；只用于推导 `自偏好风险`，不参与评分；**标识不可得时** `自偏好风险` 一律记 `无法排除` 并在第 13 章写明原因，见第 1 章「渲染格式」） |
| `{{自偏好风险}}` | `references/00-protocol.md` §4 第 1 章（文章元数据）、`references/00-protocol.md` §4 第 1 章字段（`自偏好风险`） | 自偏好风险（三值 `是` / `否` / `无法排除`；记 `是` 或 `无法排除` 时第 13 章复述，标识不可得时写明原因，见第 1 章「渲染格式」） |

### A.3 第 2 / 4 章（L0，`references/01-genre-routing.md`）

| 占位符 | 来源文件 | 字段名与位置 |
|---|---|---|
| `{{label}}` / `{{score}}` | `references/01-genre-routing.md` | `label` / `score`（`L0-G*` 的 `claim` 固定格式，**值域 0–1：这是 L0 的体裁分数；与 L6 已删除的同名 `score`（0–120 合成分）无关**）；标签闭集见 `§标签闭集` |
| `{{论证性分数}}` | `references/01-genre-routing.md` | `论证性分数`（`L0-S*` 的 `claim` 格式，见 `§输出字段` 的 `items[]` 区；契约第 4 章要求，`references/00-protocol.md` §4 第 4 章（体裁与处置）） |
| `{{处置}}` | `references/01-genre-routing.md` | 处置（`A` / `B` / `C` / 混合 / 不确定，见 `§输出字段` 的 `verdict` 取值） |
| `{{理由}}` | `references/00-protocol.md` §4 第 2 章（一句话结论） | 理由（≤40 字；L0-R8 要求不得只写一个字母，`references/01-genre-routing.md` §判定规则 R8（处置必须给理由）） |
| `{{stability}}` | `references/07-rating.md` | `stability`（`§输出字段` 的 `stability` 行；判定见 `§判定规则` R6）。`band` 字段**已废弃**（T-G6a 裁定）：档位只由 `verdict` 承载，灯是其纯函数映射（`§判定规则` R18）。`calibration` 字段与 `{{calibration}}` 占位符**已删除**（`docs/DECISIONS.md` #58，见 A.11） |
| `{{gateHits[]}}` / `{{dims[]}}` | `references/07-rating.md` | `gateHits[]` / `dims[]`（`§输出字段` 字段表；C 轨 `dims[]` 只写 C1/C2/C3） |

### A.4 第 3 / 6 章（L2，`references/03-structure.md`）

| 占位符 | 来源文件 | 字段名与位置 |
|---|---|---|
| `{{论题}}` / `{{结论}}` / `{{论据}}` / `{{前提假设}}` | `references/00-protocol.md` §4 第 3 章（四要素表）；`references/03-structure.md` §输出字段（四要素表） | 四要素表行名（逐字） |
| `{{隐含假设}}` | `references/00-protocol.md` §4 第 3 章（四要素表）、`references/00-protocol.md` §4 第 3 章（报告结构）；`references/04-assumptions.md` §输出字段（`items[]` 区） | 隐含假设（三件套强制） |
| `{{补全句}}` / `{{最接近的触发片段}}` | `references/00-protocol.md` §4 第 3 章（报告结构） | 补全句 `P + 假定 ⇒ C` / 最接近的触发片段（确无写 `无`）——第 7 章表格的第 8 / 9 列，**不得**只写成表下注 |
| `{{论题类型}}` | `references/03-structure.md` §判定规则 R9（`论题类型`） | 论题类型（`事实判断型` / `价值主张型`） |
| `{{claim}}` / `{{grounds}}` / `{{warrant}}` / `{{qualifier}}` / `{{rebuttal}}` | `references/03-structure.md` §输出字段、`references/03-structure.md` §输出字段（Toulmin 五项） | Toulmin 五要素字段（逐字） |
| `{{论题—结论对齐}}` / `{{论证 vs 解释}}` | `references/00-protocol.md` §4 第 6 章（结构完整性）；`references/03-structure.md` §判定规则 R2（论题还原测试） | 契约第 6 章的两项要求（逐字） |

### A.5 第 5 章（L1，`references/02-source-check.md`）

| 占位符 | 来源文件 | 字段名与位置 |
|---|---|---|
| `{{作者可查性}}` | `references/02-source-check.md` §判定规则 R4（`作者可查性` 0/1/2/3） | 作者可查性（0/1/2/3） |
| `{{来源主体类型}}` | `references/02-source-check.md` §判定规则 R9（`来源主体类型` 五档） | 来源主体类型（五档） |
| `{{信源可靠性}}` | `references/02-source-check.md` §输出字段（`信源可靠性`） | 信源可靠性（A–F） |
| `{{信息可信度}}` | `references/02-source-check.md` §输出字段（`信息可信度`） | 信息可信度（1–6） |
| `{{利益相关性}}` | `references/02-source-check.md` §输出字段（`L1-X*`） | 利益相关性（`L1-D1`） |
| `{{外部交叉核查结果}}` | `references/02-source-check.md` §输出字段（`L1-X*`）、`references/02-source-check.md` §输出字段（`verdict` 取值） | 外部交叉核查结果（取 L1 `verdict` 四值） |
| `{{SIFT 四步执行记录}}` | `references/02-source-check.md` §输出字段（`SIFT 四步执行记录`） | SIFT 四步执行记录（`L1-F*`） |

### A.6 第 7 章（L3，`references/04-assumptions.md`）

| 占位符 | 来源文件 | 字段名与位置 |
|---|---|---|
| `{{id}}` / `{{假定内容}}` / `{{类型}}` / `{{是否可核实}}` / `{{原文位置}}` | `references/04-assumptions.md` §输出字段（`items[]` 字段表）、`references/04-assumptions.md` §输出字段（字段表）；`references/00-protocol.md` §4 第 7 章（隐藏假定） | L3 条目五字段（逐字）；`原文位置` 取固定值 `文中未给出（隐含）`；第 7 章表格共 **9 列**，见该章「渲染格式」 |
| `{{发现方法}}` / `{{承重性}}` | `references/04-assumptions.md` §输出字段（字段表） | `发现方法`（观点者/第三方）/ `承重性`（承重/非承重）——L3 强制产出的两项，第 7 章表格**不得省略** |

### A.7 第 8 章（L4，`references/05-defects.md`）

| 占位符 | 来源文件 | 字段名与位置 |
|---|---|---|
| `{{impact}}` | `references/05-defects.md` §输出字段（字段表） | `impact`（致命 / 重要 / 提示） |
| `{{kind}}` | `references/05-defects.md` §输出字段（`kind`） | `kind`（五值） |
| `{{scheme}}` | `references/05-defects.md` §输出字段（`scheme`） | `scheme`（L4-R2 八方案表 8 选 1，见 `§判定规则` R2） |
| `{{suspected}}` | `references/05-defects.md` §输出字段（`suspected`） | `suspected`（恒 `true`） |
| `{{trigger}}` | `references/05-defects.md` §输出字段（字段表） | `trigger`（读作**失效机制**：一句话说明该缺陷的失效机制；跨层去重的回指 `参见 L3-R4 命中 #k` 写在此列——第 8 章表格第 4 列，见该章「渲染格式」） |
| `{{最小修改}}` | `references/05-defects.md` §判定规则 R3（`最小修改`） | 最小修改（L4-R3） |

### A.8 第 9 章（L5，`references/06-evidence.md`）

| 占位符 | 来源文件 | 字段名与位置 |
|---|---|---|
| `{{sourceType}}` | `references/06-evidence.md` §输出字段 | `sourceType`（一手 / 二手 / 无出处 / 不可核） |
| `{{needManualCheck}}` | `references/06-evidence.md` §输出字段（`needManualCheck`） | `needManualCheck`（是 / 否） |
| `{{imvain}}` | `references/06-evidence.md` §输出字段（`imvain`） | `imvain`（6 位 0/1） |
| `{{downgrade}}` | `references/06-evidence.md` §输出字段（`downgrade`） | `downgrade`（数组） |
| `{{bearsWeight}}` | `references/06-evidence.md` §输出字段（`bearsWeight`） | `bearsWeight`（true / false） |
| `{{N_total}}` / `{{N_with_source}}` | `references/06-evidence.md` §输出字段（`N_total` / `N_with_source`） | `N_total` / `N_with_source`（两个清点计数） |

### A.9 C 轨判据块（`references/08-track-c.md`）

| 占位符 | 来源文件 | 字段名与位置 |
|---|---|---|
| `{{criterion}}` | `references/08-track-c.md` §输出字段（`criterion`） | `items[].criterion`（C1 / C2 / C3） |
| `{{check}}` | `references/08-track-c.md` §输出字段（`check`） | `items[].check`（通过 / 不通过 / 无法判断） |
| `{{counts}}` | `references/08-track-c.md` §输出字段（`counts`） | `counts`（`N_steps` / `N_sources` / `N_units` / `N_words` / `N_dup`） |

### A.10 第 12 / 13 章

| 占位符 | 来源文件 | 字段名与位置 |
|---|---|---|
| `{{要点提炼}}` | `references/00-protocol.md` §4 第 12 章（要点提炼） | 第 12 章「要点提炼」（≤5 条，Adler 四问见 `references/07-rating.md` §判定规则 R16（第 12 章 Adler 四问）） |
| `{{已知局限}}` | `references/00-protocol.md` §4 第 13 章（成本与局限声明） | 第 13 章「已知局限」（逐层局限，含各层「已知局限」小节） |

### A.11 不得出现在报告成品中的字段（已删除字段与已作废取值的黑名单）

定位：本表列出 **v1 根本不存在**的字段与取值——它们不是「存在但不许渲染」，而是**无处可渲染**。保留登记只为防止有人从旧版本、模板库或历史产出物把它们带回报告；今后同类删除一律追加到本表。

| 字段 | 出处 | 理由 |
|---|---|---|
| `T_pass` / `T_border` | `references/07-rating.md` §判定规则 R9③（R9③） | 临时门限**已作废、不再恢复**（`docs/DECISIONS.md` #55 取消校准）；报告成品不打印该组数值，也不出现与它们的比较串 |
| `score`（L6 合成分数，0–120） | `docs/DECISIONS.md` #58（字段已删除）；原出处 `references/07-rating.md` §输出字段 | **v1 不存在该字段**（#58 删除）：报告既不设总分 / 质量分位置，也不留「不适用」占位——不是「禁止渲染」，而是**无处可渲染**。本行仅作黑名单。L0 的 `{{score}}`（0–1 体裁分数，`references/01-genre-routing.md` §输出字段）是**另一个同名字段、仍然存活**，不在本行范围内 |
| `calibration`（L6 校准状态） | `docs/DECISIONS.md` #58（字段已删除）、#55（校准程序作废） | **v1 不存在该字段**：校准程序整体作废后该字段无取值可填，已随 #58 从 L6 判决块删除；报告不出现校准状态行，也不出现 `{{calibration}}` 占位符 |
| `band`（L6 档位副本） | `docs/DECISIONS.md` #57（T-G6a）；`references/07-rating.md` §判定规则 R18 | **v1 不存在该字段**：档位只由 `verdict` 承载、灯是其纯函数映射（R18）；`band` 原是「必须与 `verdict` 一致」的僵尸槽位，已删除 |

---

## 附录 B · 两条机械核对规则

两条规则都可对**模板成品**与**本规范**直接执行；两条都只查结构，不查内容质量。

### B1 章节编号 1–13 连续无缺

核对对象：`templates/report-single.md`、`templates/report-c-track.md`、`references/09-report-spec.md`（判据 ①②）；`templates/screening-card.md`（判据 ③）。
判据（三条须同时满足）：① 匹配 `^## (\d+)\.` 的章节标题必须**恰好 13 条**，序号依次为 1…13（不得跳号、不得重号）；② 必须存在**报告级附录 A**——同一文件内含匹配 `^## 附录 A` 的小节标题（两份模板与该附录同名）；③ **筛选卡存在且字段齐备**——`templates/screening-card.md` 存在，卡内齐备四种灯形态（`🟢` / `🟡` / `🔴` / `🔵`）与两项必需字段标签（`摘要`、`内容清单`），C 轨第 5 字段名写作「判定 / 原因」。13 章之外、不带数字序号的小节（前置节 · 筛选卡、报告级附录 A、附录 P、附录 B、附录 C、「最小填写示例」）不参与 ① 的匹配。
附加约定：模板的「最小填写示例」段落内一律用 `【第 N 章】` 标注章节，**不得出现以 `## N.` 开头的行**——否则任何朴素的「行首正则」都会把示例当成真章节（本规范初稿即因此被误判为 `1,2,…,13,2,7`）。

```bash
# 在项目根目录执行（本机 node：C:\Users\hades\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe）
node -e "const f=require('fs');const R=['references/09-report-spec.md','templates/report-single.md','templates/report-c-track.md'].map(p=>{const s=f.readFileSync(p,'utf8');const n=[...s.matchAll(/^## (\d+)\./gm)].map(m=>+m[1]);const c=n.length===13&&n.every((v,i)=>v===i+1);const a=/^## 附录 A/m.test(s);console.log(p,'=> chapters',n.join(','),c?'PASS':'FAIL','| 附录 A',a?'PASS':'FAIL','|',(c&&a)?'PASS':'FAIL');return c&&a;});const card=f.readFileSync('templates/screening-card.md','utf8');const lights=['🟢','🟡','🔴','🔵'].filter(x=>card.includes(x)).length;const fld=['摘要','内容清单'].filter(x=>card.includes(x)).length;console.log('templates/screening-card.md => lights',lights+'/4 | 必需字段',fld+'/2 |',(lights===4&&fld===2)?'PASS':'FAIL');console.log((R.every(Boolean)&&lights===4&&fld===2)?'PASS':'FAIL');"
```

清单版（无 node 时人工核对）：依次读出 13 个章节标题，逐条与 `references/00-protocol.md` §4 报告结构（13 章表）的 13 行比对；数量不足 13、序号重复或跳号即为不合格；报告级附录 A 的存在性单独核对（在 13 章之后、标题以「附录 A」开头）；筛选卡单独核对——`templates/screening-card.md` 存在，且卡内出现四种灯形态与「摘要」「内容清单」两个字段标签。

### B2 模板占位符与来源字段逐字一致

核对对象：两份报告模板（`templates/report-single.md`、`templates/report-c-track.md`）的全部占位符。`templates/screening-card.md` **不在本规则范围内**——它的字段是字面标签（灯 / 档位 / 摘要 / 内容清单 / 结论·原因），不使用双花括号占位符；其存在性与字段齐备由 B1 判据 ③ 覆盖。
判据（三条须同时满足）：（a）每个占位符内的名字必须在本 `references/00`–`08` 与 `rubric/` 中出现**逐字相同**的名字；（b）在附录 P 的表里有登记（即出现在本文件中）；（c）**v1 只出档位**——两份模板中**不得存在**「总分 / 质量分」位置（不设槽位，也不得留「不适用」之类占位）。缺失、改名、自造、或 (c) 被违反均为不合格。

```bash
# 在项目根目录执行
node -e "const f=require('fs');const src=f.readdirSync('references').filter(x=>/^0[0-8]-/.test(x)).map(x=>'references/'+x).concat(['rubric/vetoes.md','rubric/quality-dims.md']);const spec=f.readFileSync('references/09-report-spec.md','utf8');const pool=src.map(p=>f.readFileSync(p,'utf8')).join('\n');let bad=0;const v1=/(总分|质量分)\s*[=｜|:：]/;for(const t of ['templates/report-single.md','templates/report-c-track.md']){const s=f.readFileSync(t,'utf8');const u=[...new Set([...s.matchAll(/\{\{([^{}]+)\}\}/g)].map(m=>m[1]))];const hit=s.split('\n').filter(l=>v1.test(l));const okv=hit.length===0&&!s.includes('不适用（v1 只出档位）');console.log(t,'tokens='+u.length,'v1='+(okv?'PASS':'FAIL'),'v1-hits='+hit.length);for(const x of u){if(!pool.includes(x)||!spec.includes(x)){bad++;console.log('  MISS',x);}}if(!okv){bad++;}}console.log(bad?('FAIL '+bad):'PASS');"
```

已知局限（如实登记）：
1. B2 是**子串**匹配，只能证明「逐字存在」，不能证明「该处就是该字段的定义处」。例如 `check` 在 `references/00-protocol.md` §7 边界 作为普通词先出现，其字段定义处是 `references/08-track-c.md` §输出字段（`check`）——排错时必须看 `b3`/附录 A 给的位置，而不是脚本命中的第一处。
2. B2 不检查**取值**是否合法（如 `impact` 是否写了 `中等`）；取值合法性由各层 `verdict` / 枚举表与本规范各章「反例」条目约束，需人工或按层脚本另查。
3. B2 的 (c) 判据只对**模板文本**断言（模板里不得有渲染 0–120 数值的位置）；它不能证明填好的报告里没有硬写数值——后者由第 2 / 10 章的「反例」与人工复核约束。

### 本次实际运行结果（2026-10-13，T-F5c 后重跑，项目根目录，捆绑 node 24）

```text
=== B1 ===
references/09-report-spec.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-single.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-c-track.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
=== B2 ===
templates/report-single.md tokens=71 v1=PASS v1-hits=0
templates/report-c-track.md tokens=39 v1=PASS v1-hits=0
PASS
=== 行号扫描（附录 C 之前；附录 C 为冻结快照区）===
HEAD 第 N 行 = 0 ｜ HEAD 文件:行号 = 0 ｜ 附录 C 内残留：第 N 行 4 处、文件:行号 31 处（均为历史快照，不得作为现行引用）
```

另附三条与本规范口径相关的自查（不属于 B1/B2，仅登记结果）：C 轨模板中 `前提` / `结论` / `推理有效性` / `谬误` 四个禁用词的出现次数均为 `0`，且逐字包含 `本文未做论证审查，改按 C 轨判据评估`；本文件在附录 C 之前不再含任何行号式引用（`第 N 行` 与 `文件:行号` 两种形式的命中数均为 `0`），行号式引用仅保留在附录 C 的登记表内（快照，不得作为现行引用）。

**T-G3 复跑（2026-10-14；四个文件：本文件 + 两份报告模板 + 新增 `templates/screening-card.md`）**：

```
=== B1（13 章连续 + 报告级附录 A + 筛选卡）===
references/09-report-spec.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-single.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-c-track.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/screening-card.md => lights 4/4 | 必需字段 2/2 | PASS
B1 总判：PASS
=== B2（占位符逐字溯源 + v1 无 0–120 占位符）===
templates/report-single.md tokens=71 v1=PASS v1-hits=0
templates/report-c-track.md tokens=39 v1=PASS v1-hits=0
PASS
=== 档位闭集自查 ===
四文件：已删除的顶档代号 = 0 命中；旧门禁三值名 = 0 命中
=== C 轨禁用词 / disclaimer ===
前提:0 结论:0 推理有效性:0 谬误:0 ｜ disclaimer=OK
=== 终态体积 ===
本文件 363 行 / 61509 B；templates/report-single.md 231 行 / 13915 B；templates/report-c-track.md 216 行 / 14079 B；templates/screening-card.md 106 行 / 2919 B
```

**T-G6b 复跑（2026-10-14；四个文件：本文件 + 两份报告模板 + `templates/screening-card.md`）**：

```text
=== B1（13 章连续 + 报告级附录 A + 筛选卡）===
references/09-report-spec.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-single.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-c-track.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/screening-card.md => lights 4/4 | 必需字段 2/2 | PASS
B1 总判：PASS
=== B2（占位符逐字溯源 + v1 无 0–120 占位符）===
templates/report-single.md tokens=70 v1=PASS v1-hits=0
templates/report-c-track.md tokens=38 v1=PASS v1-hits=0
PASS
=== 用词与旧枚举自查 ===
v1 前旧词 = 0 命中；已废弃的字段名仅存活于废弃注记行与登记行（本文件 2 + 1；两份模板各 1；卡片 0）；旧三值门禁名 = 0；`LC` 改版前的旧枚举 = 0；已删除的顶档代号 = 0
=== C 轨禁用词 / disclaimer ===
前提:0 结论:0 推理有效性:0 谬误:0 ｜ disclaimer=OK
=== 终态体积（写入本块前一刻测量）===
本文件 384 行 / 63224 B；templates/report-single.md 231 行 / 14006 B；templates/report-c-track.md 216 行 / 14263 B；templates/screening-card.md 106 行 / 2920 B
```

注：B2 的 tokens 数比 T-G3 复跑各少 1——被废弃字段的占位符已移除；该字段名本次只作为**已废弃**注记出现在附录 A 的字段行内，不再是一个可填字段。

**T-G6c 复跑（2026-10-14；四个文件：本文件 + 两份报告模板 + `templates/screening-card.md`）**：

```text
=== B1（13 章连续 + 报告级附录 A + 筛选卡）===
references/09-report-spec.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-single.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-c-track.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/screening-card.md => lights 4/4 | 必需字段 2/2 | PASS
B1 总判：PASS
=== B2（占位符逐字溯源 + v1 不设总分 / 质量分位置）===
templates/report-single.md tokens=70 MISS=0 v1=PASS v1-hits=0
templates/report-c-track.md tokens=38 MISS=0 v1=PASS v1-hits=0
B2 总判：PASS
=== 槽位与作废措辞自查（两份模板）===
「总分 / 质量分」槽位 = 0 ｜「不适用（v1 只出档位）」 = 0 ｜「不计分」 = 0 ｜「未判定」 = 0 ｜「分数波动（不影响档位）」 = 0 ｜ `stability` 四值表述 = 0
=== 用词自查（四文件）===
v1 前旧词 = 0（与 T-G6b 块同式，不写该词本身）；已废弃字段名仅存活于废弃注记行与登记行；旧三值门禁名 = 0；已删除的顶档代号 = 0
=== C 轨禁用词 / disclaimer ===
前提:0 结论:0 推理有效性:0 谬误:0 ｜ disclaimer=OK
=== 体积（写入本块前一刻测量；本块插入后本文件的最终指纹见交付回报）===
本文件 419 行 / 66128 B；templates/report-single.md 228 行 / 12722 B；templates/report-c-track.md 214 行 / 12920 B；templates/screening-card.md 106 行 / 2920 B
```

注 1：T-G6c 把「总分 / 质量分」位置整体删除（不留「不适用」占位）——首两轮的 B2 tokens 数不变，但 v1 判据 (c) 已由「占位符不得渲染 0–120」收紧为「不得存在该位置」。

注 2：C 轨模板中 `stability` 的阻断级措辞写「该篇档位**判定**不得采信」而非「结论」——`templates/report-c-track.md` 受 C 轨禁用词约束（`references/08-track-c.md` §判定规则 R1），「结论」一词不得出现；A/B 轨模板保留原措辞。

=== T-G11 复跑（2026-10-14，`score` / `calibration` 字段删除后）===

```text
=== B1（13 章连续 + 报告级附录 A + 筛选卡）===
references/09-report-spec.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-single.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-c-track.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/screening-card.md => lights 4/4 | 必需字段 2/2 | PASS
B1 总判：PASS
=== B2（占位符逐字溯源 + v1 不设总分 / 质量分位置）===
templates/report-single.md tokens=69 MISS=0 v1=PASS v1-hits=0
templates/report-c-track.md tokens=37 MISS=0 v1=PASS v1-hits=0
B2 总判：PASS
=== 本次复跑时的体积（写入本块前一刻测量）===
references/09-report-spec.md 450 行 / 70705 B；templates/report-single.md 226 行 / 12541 B；templates/report-c-track.md 211 行 / 12574 B；templates/screening-card.md 105 行 / 2920 B（未改动）
```

T-G11 说明：B2 的 tokens 数由 70 / 38 降为 69 / 37——`{{calibration}}` 占位符随字段删除一并移除；MISS 仍为 0，其余占位符全部可逐字溯源。`score` / `calibration` 的字段级引用已从四个文件中清除（仅存于附录 A.11 黑名单、附录 C 的 C-25 登记与 A.3 / A.7 的例外说明）。

=== T-H3 复跑（2026-10-15，J-1 离线档位读法 + D-20「原始分」残留清除后）===

```text
=== B1（13 章连续 + 报告级附录 A + 筛选卡）===
references/09-report-spec.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-single.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-c-track.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/screening-card.md => lights 4/4 | 必需字段 2/2 | PASS
B1 总判：PASS
=== B2（占位符逐字溯源 + v1 不设总分 / 质量分位置）===
templates/report-single.md tokens=69 MISS=0 v1=PASS v1-hits=0
templates/report-c-track.md tokens=37 MISS=0 v1=PASS v1-hits=0
B2 总判：PASS
=== 定点复扫 ===
`原始分`：四文件内 0 处（仅存于附录 C 的 C-15 更正说明、C.5 标题与 C-27 登记这三处历史叙述）
`档位不可判定` 的限定语：本文件第 2 / 10 章与两份模板对应注释均含「导致档位合成不出来」，与契约 §4 第 2 与第 10 章口径同源
C 轨禁用词：前提 0 / 结论 0 / 推理有效性 0 / 谬误 0；逐字 `disclaimer` 一致
=== 本次复跑时的体积（写入本块前一刻测量）===
references/09-report-spec.md 477 行 / 74369 B；templates/report-single.md 227 行 / 12628 B；templates/report-c-track.md 212 行 / 12648 B；templates/screening-card.md 106 行 / 2920 B（未改动）
```

T-H3 说明：J-1 的修法是**补限定语**而非改判据——本文件原先写「任一层 `verdict = "无法判定"` 或 `degraded: true` ⇒ 档位 `无法判定`」，缺契约 §4 的限定「导致档位合成不出来」；离线时 `L1` 恒 `degraded: true`，按原字面读法每篇都落 `无法判定`／🔵、筛选器失效。D-20 把「原始分」换成 `dims[]` 字段表的合法取值词「该维取值（`低` / `中` / `高`）」。两份模板内 `原始分` 亦为 0。

=== T-I3 复跑（2026-10-15，D-04 / D-05 / D-14 / D-19 与 D-11 下游同步后）===

```text
=== B1（13 章连续 + 报告级附录 A + 筛选卡）===
references/09-report-spec.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-single.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-c-track.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/screening-card.md => lights 4/4 | 必需字段 2/2 | PASS
B1 总判：PASS
=== B2（占位符逐字溯源 + v1 不设总分 / 质量分位置）===
templates/report-single.md tokens=70 MISS=0 v1=PASS v1-hits=0
templates/report-c-track.md tokens=37 MISS=0 v1=PASS v1-hits=0
B2 总判：PASS
=== 定点复扫 ===
`失效机制`：本文件 106 / 107 / 238；`templates/report-single.md` 111 / 115；`templates/report-c-track.md` 0（该文件第 8 章写「无」，无此表）
`待契约方裁定`：`templates/report-c-track.md` 0；本文件 1 处，在附录 C 的 C-30 历史登记内
`未命中（无法执行）`：本文件 120 / 121；`report-single.md` 133 / 141；`report-c-track.md` 100 / 113
`5 行表`：本文件 71（第 3 章四要素表）与 92（第 6 章 Toulmin 表）——两处均与 `references/03-structure.md` L2-R1 的字段数一致
C 轨禁用词：前提 0 / 结论 0 / 推理有效性 0 / 谬误 0；逐字 `disclaimer` 一致
=== 本次复跑时的体积（写入本块前一刻测量）===
references/09-report-spec.md 510 行 / 82531 B；templates/report-single.md 230 行 / 13655 B；templates/report-c-track.md 214 行 / 13396 B；templates/screening-card.md 106 行 / 2920 B（未改动）
```

T-I3 说明：D-04 在第 8 章表格补 `失效机制` 列（＝`items[].trigger`，承载跨层去重回指），本文件「8 列表」随之改为「9 列表」并在附录 P 增 `{{trigger}}` 行；D-05 清掉 C 轨第 12 章的悬空「待契约方裁定」；D-14 给 `判定者模型标识` 不可得时的 `自偏好风险` 补可执行规则（当时定为记 `是`、理由写进第 11 章；该处置已由 T-J3 改判——标识不可得时记 `无法排除`、原因写进第 13 章，见 C-32）；D-19 经实测为**一致**（L2 五要素 ＝ 5 行表），仅把契约行差异登记进 C-31。D-11 的下游同步（`rubric/vetoes.md` 的三态要求）落在第 10、13 章与两份模板：`gateHits[]` 只登记真正命中的条目，报告逐条写三态，无法执行的条目在第 13 章与 `degradeReason` 同源列出。

=== T-J3 复跑（2026-10-15，G-01 / G-02 / G-05 / G-07 / G-09 / G-10 / G-11 后）===

```text
=== B1（附录 B 原样命令执行）===
references/09-report-spec.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-single.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/report-c-track.md => chapters 1,2,3,4,5,6,7,8,9,10,11,12,13 PASS | 附录 A PASS | PASS
templates/screening-card.md => lights 4/4 | 必需字段 2/2 | PASS
PASS
=== B2（附录 B 原样命令执行）===
templates/report-single.md tokens=70 v1=PASS v1-hits=0
templates/report-c-track.md tokens=37 v1=PASS v1-hits=0
PASS
=== 定点复扫（块内不复写被扫串原文，以免本块自我命中）===
旧规则串 A（`自偏好风险` 标识不可得 ⇒ 记「是」的那条，C-32 所推翻）：本文件 0 / report-single.md 0 / report-c-track.md 0 / screening-card.md 0
旧串 B（`07:132` 复述的标记串，C-33）：本文件 0 处规范用法（C-33 的改前引文一处，属历史登记）
摘要栏头旧措辞（C-35）：本文件 0 / report-single.md 0 / report-c-track.md 0 / screening-card.md 0（四文件统一为「谁 → 什么事 → 说了什么」）
「同一文件」四字（C-36）：screening-card.md 0；本文件正文落点（§0.1 与前置节）已 0，另有 3 处属不同语义（B1 判据 ② 的「同一文件内含附录 A」）或历史引文（C-36 问题列、本块说明）
4 格 `degraded` 行（C-38）：本文件 0 / report-single.md 0 / report-c-track.md 0；2 格行：report-single.md 3 / report-c-track.md 4
C 轨处置闭集（report-c-track.md:64）：`A 轨` / `B 轨` / `C 轨` / `混合/不确定` / `无法判定`（与 `references/01-genre-routing.md:23-31` 的五行表逐字对齐）
C 轨禁用词：前提 0 / 结论 0 / 推理有效性 0 / 谬误 0；逐字 `disclaimer` = 本文未做论证审查，改按 C 轨判据评估（存在）
`原始分`：本文件仅附录 B 证据块与附录 C 历史登记内（写入本块前实测 7 行），三模板 0
=== 本次复跑时的体积（写入本块前一刻测量）===
references/09-report-spec.md 535 行 / 86162 B / ea2bb0fda203；templates/report-single.md 230 行 / 13671 B / cfa6340089d0；templates/report-c-track.md 214 行 / 13452 B / 94f518166c5b；templates/screening-card.md 106 行 / 3070 B / ead23de8bcaf
```

T-J3 说明：**G-01** 在第 2 章与第 10 章两处补上与 `references/00-protocol.md` §4 逐字一致的限定语「且该层的产出按本层规则必须参与档位合成」，并补「L1 的降级不在其列」（依据 `references/07-rating.md` §判定规则 R2 的 `L1` 行）——见 C-34。**G-02** 推翻 T-I3 的 D-14 处置：值域扩为三值 `是` / `否` / `无法排除`，标识不可得时记 `无法排除`、原因写进第 13 章，落点为本文件第 1 章「渲染格式」与反例、附录 P 两行、两份模板第 1 章表格——见 C-32。**G-05** 把摘要栏头的旧措辞（「结论」+「是什么」）改为「说了什么」，四文件对齐（含任务书未列的 `templates/report-single.md:14`）——见 C-35。**G-07** 在第 2 章就地声明该行是标记串唯一真源、其它文件不得复述——见 C-33。**G-09** 把「同一文件」改为与 `00:169` 逐字一致的交付口径，四个落点——见 C-36。**G-10** 以 `01:23-31` 的**实测现文**（五行，`混合/不确定` 为一个取值）逐字对齐 C 轨处置闭集——见 C-37。**G-11** 修正 5 处 4 格坏行（c-track 3 / single 2）——见 C-38。**G-15** 实测有落点：本文件第 3 章「渲染格式」原列三值闭集（缺 `行 N`，与 `references/03-structure.md` L2-R8 的四值不一致）与附录 P 的 `{{locator}}` 行（附录 P 属字段溯源，不改）；三模板内 0 处。闭集已换成与 L2-R8 逐字同一套四值并加回指——见 C-39。

---

## 附录 C · 既有文件问题登记（本文件写作时只报告；状态见每条「问题」列首）

以下问题在写本规范时发现，**本文件写作时未修改任何既有文件**。前 4 条是行号指针错误，5–9 条是契约/文档缺口，10–11 条是规则冲突，12–19 条是历次波次自己闭合的簇（12–15 属 T-F3，16–19 属 T-F5c），**20–22 条属 T-G3（交付形态与档位闭集，见下表 C.2）**，**23 条属 T-G6b（字段与用词收口，见下表 C.3）**，**24 条属 T-G6c（槽位删除与 `stability` 归位，见下表 C.4）**，**25 条属 T-G11（`score` / `calibration` 字段删除，见下表 C.4）**，**26–27 条属 T-H3（离线档位读法与「原始分」残留，见下表 C.5）**，**28–31 条属 T-I3（e2e 缺陷扫尾，见下表 C.6）**，**32–39 条属 T-J3（第二轮跑次缺陷扫尾，见下表 C.7）**。**状态在每条「问题」列首标出：【已修复】/【已闭合】/【仍开放】**；状态核实时间：C-1…C-15 为 2026-10-13（T-F3），C-16…C-19 为 2026-10-13（T-F5c），C-20…C-22 为 2026-10-14（T-G3），C-23 为 2026-10-14（T-G6b），C-24 为 2026-10-14（T-G6c），C-25 为 2026-10-15（T-G11），C-26…C-27 为 2026-10-15（T-H3），C-28…C-31 为 2026-10-15（T-I3），C-32…C-39 为 2026-10-15（T-J3）。

下列行号为问题发生时的快照，均已修复，不得作为现行引用。

| # | 位置 | 问题 | 证据 |
|---|---|---|---|
| C-1 | `references/04-assumptions.md:21` | 【已修复】引「`00-protocol.md` 第 104 行」作四字段定义出处；104 行是 §3 字段约束表的 `unknowns[]` 行 | `00-protocol.md:104` = `| `unknowns[]` | 是 | 无内容时写空数组…`；四字段定义在 `00-protocol.md:123` |
| C-2 | `references/07-rating.md:39`、`:41`、`:83`、`:172` | 【已修复】引「契约 §7 第 172 行」作映射表强制项出处；`00-protocol.md:172` 是空行 | 契约强制项在 `00-protocol.md:185`（「缺此表即本层不合格」） |
| C-3 | `references/05-defects.md:28`、`references/06-evidence.md:28`、`references/07-rating.md:27`、`references/08-track-c.md:26` | 【已修复】引「§3 命名法（第 94 行）」；94 行是表头 | 命名法在 `00-protocol.md:97` |
| C-4 | `references/07-rating.md:82`、`references/08-track-c.md:100` | 【已修复】称「契约 §3 第 93 行只登记 `L0`–`L6`」；93 行是空行 | `layer` 枚举登记在 `00-protocol.md:96` |
| C-5 | `references/06-evidence.md:72` | 【已闭合】R8 曾要求条目用 `trigger` 字段，但 `trigger` 不在 `00-protocol.md` §3 字段表（94–107）内 | `trigger` 仅在 `references/05-defects.md:34` 被定义为 L4 字段 |
| C-6 | `references/04-assumptions.md:51` vs `references/05-defects.md:41` | 【已闭合】预设触发词的**扩展词表**两份不一致 | 现况：`04-assumptions.md` L3-R4 已声明**本表是唯一真源**（`不用多说` 已并入，扩展项＝【本报告工程约定】）；`05-defects.md` 已改为「以 `04-assumptions.md` L3-R4 为唯一真源，本层只引用、不得另行增删」 |
| C-7 | `docs/PLAN.md` §三（65–66 行）、§四 D4（95 行） | 【已闭合】目录结构与验收曾只登记 `templates/report-single.md`，未登记 `templates/report-c-track.md` | 现况：`docs/PLAN.md` 目录树含 `report-single.md` 与 `report-c-track.md` 两行；D4 验收对象已改为两份模板并列 |
| C-8 | `references/08-track-c.md:39`（R2） | 【已闭合】曾只规定第 3/6/7/8/9 章写「无」，未规定第 12 章；而契约第 12 章的来源是 L2 + L5，C 轨不执行这两层 ⇒ C 轨第 12 章无出处 | `00-protocol.md:128`；`08-track-c.md:39` |
| C-9 | `references/00-protocol.md:117` vs `references/01-genre-routing.md:14` | 【已闭合】曾同一元数据两个名字：报告第 1 章写「作者」，输入元数据写「署名」 | 现况：`01-genre-routing.md` 输入表已改用「作者 / 发布日期」，与契约第 1 章一致 | `00-protocol.md:117`；`01-genre-routing.md:14` |
| C-10 | `references/07-rating.md:124`（R9②） vs `references/08-track-c.md:35-37`（R1） | 【已闭合】**冲突**：R9② 无条件要求第 2 章末尾追加固定串 `【工程约定，非科学结论】`，该串含 R1 为 C 轨禁用的词；两条不能同时满足。本规范处置：A/B 轨照 R9② 逐字追加；C 轨不追加（原用 `calibration` 状态行），并在模板头注声明。**T-G11 更正**：`calibration` 字段已删除（`docs/DECISIONS.md` #58）、门限与校准整体作废，C 轨第 2 章不再有该状态行，本条处置自然闭合 |
| C-11 | `references/07-rating.md:126`（R9③） vs 本任务的「阈值出现处必须标记」 | 【已闭合】**曾不可同时满足于报告成品**：R9③ 禁把临时门限值写入对外交付材料。本规范处置：报告成品不打印 `T_pass` / `T_border` 数值；报告内凡提到门限（含契约第 10 章 D 带逐字口径串 `< T_border`）均在紧邻处给标记——A/B 轨用逐字 `【工程约定，非科学结论】`，C 轨因 R1 用词约束改写为「工程约定，非科学判定」（同 C-10 的处置口径） |
| C-12 | 本文件 + 契约（`docs/fixwave-2.md` 簇 H1） | §3 分层统一输出块在 13 章与两份模板里无落点，「按契约执行」与「按模板交付」不能同时证明 | 【已闭合】契约 §4 新增「附录 A 行」；本文件新增「## 附录 A · 分层统一输出块」，两份模板补齐同名附录；B1 判据同步改为「13 章连续 + 附录 A 存在」 |
| C-13 | 本文件第 1 章（簇 I4） | 「判定者模型标识」在协议全文未定义取值来源 | 【已闭合】**T-I3 更正**：本条原先只登记取值口径（执行者 agent 的 `provider/model`，无法获得时写固定串 `未提供`），未覆盖**标识不可得时 `自偏好风险` 如何推导**——执行者工具面不提供自身 `provider/model` 是常态（`docs/e2e-run-1-defects.md` D-14），原写法下 `自偏好风险` 的唯一输入消失、执行者各自猜。第 1 章已补可执行规则：标识不可得时 `自偏好风险` 一律记 `无法排除`（三值值域，依据契约 §4 第 1 章字段）并在第 13 章写明原因，见 C-28 与 C-32（T-I3 首版曾定为记 `是`，已由 T-J3 改判） |
| C-14 | 本文件第 7 章（簇 H2） | 第 7 章表格只有 7 列，装不下 L3 强制产出的 9 项 | 【已闭合】扩为 9 列（`id` / `假定内容` / `类型` / `是否可核实` / `发现方法` / `承重性` / `原文位置` / 补全句 / 最接近的触发片段），字段名与 `04-assumptions.md` 逐字一致 |
| C-15 | 本文件 + 两份模板（簇 C3，渲染侧） | 契约要求第 2 / 10 章填总分，但 v1 无 0–120 合成公式 | 【已闭合】四维改为逐维给「原始分 + 档位判定依据」；B2 增 (c) 判据（模板不得含渲染 0–120 数值的位置）。**T-G6c 收紧**：总分 / 质量分位置整体删除、不留「不适用」占位（见 C-24）。**T-H3 更正**：其中「原始分」为分数时代的残留词，已随 D-20 改为「该维取值（`低` / `中` / `高`）」（见 C-27） |
| C-16 | `templates/report-single.md`、`templates/report-c-track.md`、本文件第 10 章（`docs/fixwave-3.md` W3-07） | 【已闭合】`stability` 曾写「三值」且只列 `稳定` / `分数波动（不影响档位）` / `不稳定`，缺第四值 `未执行`；而 `references/07-rating.md` §输出字段已是四值 | 现况：三处均改「四值」并补 `未执行`（只做 1 次判定；该篇 `confidence` 不得为 `高`），并注明 v1 运行口径——三次判定只比**档位**（不产出 0–120，分数极差不可比）。**T-G6c 更正**：三处均已改回权威三值（删 `分数波动（不影响档位）` 分支），见 C-24 |
| C-17 | 本文件附录 A 与 `templates/report-c-track.md` 附录 A（`docs/fixwave-3.md` W3-08） | 【已闭合】C 轨附录 A 层序曾写 `L0` / `L1` / `LC`，未含 `L6`（`e2e2` 的 `ctrack` 跑次 `N-10` 报该歧义）：C 轨不做 L2–L5，但 L6 否决项与档位层照跑 | 现况：本文件附录 A 层序补 `L6`；C 轨模板附录 A 新增 `### L6 · 否决项与档位` 段（`gateHits[]` 只允许 `V2`–`V5` 与 `V7` / `V8`、`dims[]` 只写 `C1` / `C2` / `C3`） |
| C-18 | `templates/report-c-track.md` 附录 A 与第 10 章的 `LC` 块（`docs/fixwave-3.md` W3-09） | 【已闭合】`LC` 块 `items[]` 只列 `id` / `criterion` / `check` / `counts`，无 `evidence` 字段，与契约 §2 硬规则 2（证据强制）「指任何一层 `items[]` 的条目 `evidence` 为空者不得成条」存在张力 | 现况（渲染侧）：附录 A 与第 10 章判据表均要求逐条给出依据（原文片段；计数类判据给具体数字与清点基线）＝`evidence` 的 C 轨等价物，无依据的条目不成立、改记 `unknowns[]`；`references/08-track-c.md` 的 LC 字段表是否登记 `evidence` 归 protocol-tail 裁定 |
| C-19 | 本文件第 2 / 10 章 + 附录 A、两份模板（契约 §4 新增「质量分不可得」口径行） | 【已闭合】契约 §4 新增「质量分不可得」（任一层 `verdict = "无法判定"` 或 `degraded: true`）口径后，本规范与两份模板需同步，否则执行者无合法字符串可填 | 现况：第 2 章写 `verdict + 不计分（质量分不可得）+ ≤40 字理由`；第 10 章总分写 `不计分（质量分不可得）`、档位写 `未判定`；L6 的 `verdict` 可取第五值 `无法判定`；两份模板的注释与第 10 章表同步。**T-G6c 更正**：`不计分（质量分不可得）` / `未判定` 措辞取消——档位不可判定时一律取第五值 `无法判定`、灯 🔵，见 C-24 |

上游文档已自认的缺口（非本次发现，仅登记以免重复报告）：`references/05-defects.md` §判定规则 R9（FLICC 无文献依据）、`references/06-evidence.md` §判定规则 R8（图文检查为工程折衷）、`references/08-track-c.md` §已知局限（C 轨三条）、`references/07-rating.md` §映射表（`LC` 块未在契约 §3 登记）。

### C.2 交付形态与档位闭集（T-G3，`docs/DECISIONS.md` #55 / #56）

| 编号 | 涉及文件 | 问题（改前） | 处置（现况） |
|---|---|---|---|
| C-20 | `templates/screening-card.md`（新建）+ 两份报告模板 + 本文件（用户裁定 `docs/DECISIONS.md` #55、#56 ⑤） | 交付形态缺「一页纸筛选卡」：原交付只有 13 章报告，读者要读完才知道值不值得读 | 【已闭合】新增 `templates/screening-card.md`；两份报告模板在 13 章报告**之前**给出同一套字段（灯 / 档位 / 文章摘要 / 内容清单 / 结论·原因）；本文件新增「## 前置节 · 筛选卡」；四种灯形态骨架齐备（`🟢` / `🟡` / `🔴` / `🔵`） |
| C-21 | `templates/report-c-track.md` 的筛选卡字段名 | C 轨全文禁用「前提」「结论」「推理有效性」「谬误」（`references/08-track-c.md` §判定规则 R1），而卡片第 5 个字段名「结论 / 原因」含禁用词 | 【已闭合】C 轨卡片的该字段名改为「判定 / 原因」，且卡内保留逐字 `disclaimer`；本文件的「§前置节 · 筛选卡」同步登记该口径 |
| C-22 | 本文件 + 两份报告模板 + 卡片（用户裁定 `docs/DECISIONS.md` #56 ①） | 档位闭集原含已删除的顶档，且与已废弃的三值门禁名并存，同一交付物里两套档位语言 | 【已闭合】档位统一为闭集 `A` / `B` / `C` / `D` / `无法判定`；四个文件中旧档位名与已删除的顶档均已清除（四个文件内零出现）；灯映射 `A`=🟢 `B`=🟢 `C`=🟡 `D`=🔴 `无法判定`=🔵 同步登记 |

### C.3 字段与用词收口（T-G6b，`docs/DECISIONS.md` #57）

| 编号 | 涉及文件 | 问题（改前） | 处置（现况） |
|---|---|---|---|
| C-23 | 本文件 + 两份报告模板 + `templates/screening-card.md` | ① `band` 与 `verdict` 两个字段承载同一概念（档位），靠「两者必须一致」的人工纪律绑定；② v1 前对「档位」的旧称仍与术语表已统一的「档位」并存；③ C 轨 `gateHits[]` 枚举与 `LC` 的 `verdict` 仍是改版前的旧枚举（`V2`–`V5`；三值） | 【已闭合】`band` 字段废弃，档位只由 `verdict` 承载、灯为其纯函数映射（`references/07-rating.md` §判定规则 R18）；四个文件中旧称零出现；`templates/report-c-track.md` 的 `gateHits[]` 同步为 `V2`–`V5` 与 `V7` / `V8`，`LC` 的 `verdict` 改用五值闭集；卡片无命中（仅登记） |

### C.4 槽位删除与 `stability` 归位（T-G6c，`docs/DECISIONS.md` #40、#55）

| 编号 | 涉及文件 | 问题（改前） | 处置（现况） |
|---|---|---|---|
| C-24 | 本文件 + 两份报告模板 + `templates/screening-card.md`（只读核对） | ① 第 2 章保留 `质量分 = 不适用（v1 只出档位）` 槽位、第 10 章保留 `| 总分 | … |` 行——废止概念的「僵尸槽位」；② 三处 `stability` 写成四值（含已作废的 `分数波动（不影响档位）` 与「分数极差 >5」）；③ `0–120` / `校准` / `门限` / `T_pass` / `T_border` 仍以「将来会恢复」的承诺语气出现 | 【已闭合】第 2 章该行只剩四项（`verdict`＝档位 / 灯 / 置信度 / 理由），第 10 章总分行整体删除，**不留「不适用」占位**；三处 `stability` 统一为三值（`稳定` / `不稳定` / `未执行`，出处 `references/07-rating.md` §输出字段）；门限与校准一律改「**已作废、不再恢复**」（#55）；B2 的 (c) 判据改为「模板中不得存在总分 / 质量分位置」 |
| C-25 | 本文件 + 两份报告模板（`docs/DECISIONS.md` #58） | L6 判决块的 `score`（0–120 合成分）与 `calibration`（校准状态）两个字段各自命中「恒为不适用」「将来会恢复」两条僵尸槽位信号，已由 `protocol-tail` 从 `references/07-rating.md` 删除；本文件与两份模板仍把它们当作**存在的字段**引用（数据来源 / 渲染格式 / 第 13 章 / 附录 P / 附录 A.11） | 【已闭合】`score` / `calibration` 的字段级引用全部清除：第 2 / 10 / 13 章的「数据来源」不再列它们；第 10 章不再要求照抄 `calibration`；C 轨第 2 章的 `calibration` 状态行删除（门限与校准整体作废，无待标记对象）；`{{calibration}}` 占位符从两份模板与附录 P 移除；附录 A.11 明确为**已删除字段黑名单**，登记 `score` / `calibration` / `band`（L0 的 `{{score}}` 是另一个存活字段，保留例外说明） |

### C.5 离线档位读法与「原始分」残留（T-H3，`docs/DECISIONS.md` #61①）

| 编号 | 涉及文件 | 问题（改前） | 处置（现况） |
|---|---|---|---|
| C-26 | 本文件第 2 / 10 章 + 两份报告模板（`docs/e2e-run-1-defects.md` D-03 ★★，用户裁定 `docs/DECISIONS.md` #61① J-1） | 「档位不可判定」的触发条件在本文件写成**无附加条件**的「任一层 `verdict = "无法判定"` 或 `degraded: true`」，而契约 §4 第 2 与第 10 章口径（`references/00-protocol.md` §4）带限定「**导致档位合成不出来**」。离线是本仓常态（`L1` 恒 `degraded: true`），按本文件字面读法每篇都落 `无法判定`／🔵、筛选器失效 | 【已闭合】取读法乙：本文件第 2 / 10 章与两份模板对应注释的括号补上与契约**逐字一致**的限定语「导致档位合成不出来」；C 轨部分判据不可执行时的「条件性」档位口径（`references/08-track-c.md` §判定规则 R9）不受影响。关闭者：`report-spec`（T-H3）；2026-10-15 |
| C-27 | 本文件第 10 章、§0.2 硬口径 3 + 两份报告模板（`docs/e2e-run-1-defects.md` D-20 ★） | 「**原始分**」是分数时代的词，在各轮清理中活了下来：本文件写「维度原始分与档位判定依据」，两份模板的四维 / 三条判据行与附录 P 写 `{{dims[]}}（原始分 + 档位判定依据）`；而 v1 已无任何数值（`docs/DECISIONS.md` #58 / #60） | 【已闭合】一律改为 v1 的合法取值词：本文件改为「**该维取值（`低` / `中` / `高`）与判定依据**」（与 `references/07-rating.md` §输出字段 `dims[]` 行的「四个维度各自的取值（`低` / `中` / `高`）」同源），反例句保住原语义（「四维只给档位、不给该维取值与判定依据」）；两份模板的四维 / 三条判据行与附录 P 改为「该维取值 低 / 中 / 高 + 判定依据」。四个文件内 `原始分` 零出现。关闭者：`report-spec`（T-H3）；2026-10-15 |

### C.6 e2e 缺陷扫尾（T-I3，`docs/e2e-run-1-defects.md`）

| 编号 | 涉及文件 | 问题（改前） | 处置（现况） |
|---|---|---|---|
| C-28 | 本文件第 1 章 + 两份报告模板（`docs/e2e-run-1-defects.md` D-14 ★） | `判定者模型标识` 的取值口径齐备，但**标识不可得时 `自偏好风险` 无推导规则**：执行者工具面不提供自身 `provider/model`（三个执行者实测全部只能写 `未提供`），`自偏好风险` 的唯一输入消失，各自按「无法排除同族」猜 | 【已闭合 · **T-J3 改判**】第 1 章「渲染格式」补可执行规则：**标识不可得时 `自偏好风险` 一律记 `无法排除`**（值域三值 `是` / `否` / `无法排除`；**不得**记 `是`——那会断言一个并未发生的事实；依据 `references/00-protocol.md` §4 第 1 章字段），并在第 13 章写明原因与复述；两份模板的第 1 章表格同步该注；同章反例与附录 P 的 `{{判定者模型标识}}` 行同步。关闭者：`report-spec`（T-I3）；2026-10-15 |
| C-29 | `templates/report-single.md` 第 8 章 + 本文件第 8 章 + 附录 P（`docs/e2e-run-1-defects.md` D-04 ★★） | `references/05-defects.md` 的 `items[].trigger` **必填**且要承载跨层去重回指（`参见 L3-R4 命中 #k`）与同 `locator` 落选条目的并入说明，但第 8 章表格**没有该列**（8 列），执行者只能把判定文字并进「触发原文」列，回指无处可落 | 【已闭合】第 8 章表格在「缺陷类型」与「影响程度」之间插入 `失效机制` 列（值 `{{trigger}}`），表头 / 分隔行 / 填法行 / 表下说明同步；本文件第 8 章「渲染格式」由「8 列表」改为「9 列表（含 `失效机制` 列…）」、反例补「`失效机制` 列留空或与『触发原文』并格」；附录 P 新增 `{{trigger}}` 行。`templates/report-c-track.md` 第 8 章为「无（C 轨，未做论证审查）」，无此表（实测），不涉及。关闭者：`report-spec`（T-I3）；2026-10-15 |
| C-30 | `templates/report-c-track.md` 第 12 章（`docs/e2e-run-1-defects.md` D-05 ★★） | 正文仍写「本章口径**待契约方裁定**；缺口登记见 …附录 C」，而该缺口早已由 `references/08-track-c.md` R2 规定（写「无（C 轨，未做论证审查）」）、C-8 也已标【已闭合】——悬空的「待裁定」让读者以为还没定 | 【已闭合】该句改为「本章口径见 `references/08-track-c.md` R2」，悬空表述与指向登记表的尾句一并移除。关闭者：`report-spec`（T-I3）；2026-10-15 |
| C-31 | 本文件第 6 章 + 契约第 6 章行 + `references/03-structure.md` L2-R1（`docs/e2e-run-1-defects.md` D-19 ★） | 登记称「第 6 章 Toulmin 行数三处不一致」（契约行 4 项 / 本文件与模板 5 行 / L2 为「5+2」） | 【已闭合 · 实测一致、无需改动】实测：`references/03-structure.md` L2-R1 定义 **Toulmin 五要素**（`claim` / `grounds` / `warrant` / `qualifier` / `rebuttal`，0–5 计数）＝第 6 章表格 5 行（主张 / 理由 / 保证 / 例外 / 限定词）＝本文件「5 行表」，三处同数；登记的「5+2」不成立（`qualifier` 是五要素之一，非额外项）。唯一 4 项处是契约第 6 章的章节摘要行（`references/00-protocol.md` §4 第 6 章），属边界外，本文件不改、仅登记 |

### C.7 第二轮跑次缺陷扫尾（T-J3，`docs/e2e-run-2-defects.md`）

| 编号 | 涉及文件 | 问题（改前） | 处置（现况） |
|---|---|---|---|
| C-32 | 本文件第 1 章 + 附录 P + 两份报告模板（`docs/e2e-run-2-defects.md` G-02 ★★，`docs/DECISIONS.md` #61 追加裁定 J-6） | `自偏好风险` 在模型标识不可得时被**强制记 `是`**（T-I3 / D-14 的处置），而执行者工具面读不到自身 `provider/model`（实测只有 `DSH_HOME` / `DSH_PROFILE` / `DSH_PROFILE_DIR` / `DSH_SESSION_ID` / `DSH_SHELL` / `DSH_WEB_URL`）⇒ 三个执行者全部只能写 `未提供`、该字段恒为「是」，**断言了一个并未发生的事实** | 【已闭合 · **改判**】值域扩为三值 `是` / `否` / `无法排除`（与 `references/00-protocol.md` §4 第 1 章字段逐字一致）；标识不可得时**一律记 `无法排除`**（不得记 `是`、不得记 `否`、不得自造第四值），原因写进第 13 章。落点：本文件第 1 章「渲染格式」与反例、附录 P 的 `{{判定者模型标识}}` 与 `{{自偏好风险}}` 两行、两份模板第 1 章表格；C-13 / C-28 两条历史登记已就地注明改判。关闭者：`report-spec`（T-J3）；2026-10-15 |
| C-33 | `references/07-rating.md:132`（R9③）vs 本文件第 2 章（`docs/e2e-run-2-defects.md` G-07 ★★） | 报告第 2 章的逐字标记串两处各写各的：`07:132` 复述「工程约定，**非校准结论**」，本文件写 A / B 轨逐字追加 `【工程约定，非科学结论】`——同一位置两个都自称「逐字」 | 【已闭合】本文件第 2 章「渲染格式」就地声明：该行是第 2 章标记串的**唯一真源**，其它文件（含 `references/07-rating.md`）**不得复述串文**、只可指向本行；`07` 侧的复述由 protocol-tail 删除（C-10 只覆盖 C 轨一侧，本行补 A / B 轨一侧）。实测本文件内 `非校准结论` 0 处。关闭者：`report-spec`（T-J3，本文件侧）；2026-10-15 |
| C-34 | 本文件第 2 / 10 章（`docs/e2e-run-2-defects.md` G-01 ★★★） | 「`无法判定`」的触发条件在本文件的读法仍与 `references/07-rating.md` 的 `L1` 行冲突：契约与本文件都写「任一层 `verdict = "无法判定"` 或 `degraded: true`」，而契约 §4 明确 L1 降级**不压档**——禁网跑次里 L1 必然 `degraded: true`，按字面读法每篇都应落 🔵（三个执行者各自独立撞上） | 【已闭合】第 2 章与第 10 章两处补上与 `references/00-protocol.md` §4（`00:167`）逐字一致的限定语「**且该层的产出按本层规则必须参与档位合成**」，并补「**L1 的降级不在其列**——按 `references/07-rating.md` §判定规则 R2 的 `L1` 行，L1 降级不压档，后果只由 `degraded` + `confidence` 承担」。闭合 C-26 的残留：C-26 只补了「导致档位合成不出来」，未处理 L1 与其它层的差别。关闭者：`report-spec`（T-J3）；2026-10-15 |
| C-35 | 本文件前置节 + `templates/screening-card.md` + 两份报告模板（`docs/e2e-run-2-defects.md` G-05 ★★） | 筛选卡摘要栏头写「谁 → 什么事 → **结论**是什么」，而 `references/08-track-c.md` §判定规则 R1 把「结论」列为 C 轨禁用词；C 轨执行者只能自行改写成 `templates/report-c-track.md:15` 的「谁 → 什么事 → 说了什么」——该改写**无契约依据** | 【已闭合】四文件统一为中性等价表述「谁 → 什么事 → **说了什么**」（落点：本文件前置节、`templates/screening-card.md` 的 🟢 / 🟡 两处、`templates/report-single.md:14`；`templates/report-c-track.md:15` 原本即此措辞）。`结论` 二字在两份模板与本文件前置节的其它用法（A / B 轨第 2 章字段名、卡片「结论 / 原因」字段名及其 C 轨改名说明）不在 R1 射程内，未动。关闭者：`report-spec`（T-J3）；2026-10-15 |
| C-36 | `templates/screening-card.md:4`、`:105` + 本文件 §0.1 与前置节（`docs/e2e-run-2-defects.md` G-09 ★） | 卡片仍写「其后接 13 章完整报告（同一交付物、**同一文件**）」，与 `references/00-protocol.md:169`（#62 裁定后）冲突——契约允许「另外单独导出一份只含第 0 章的一页纸」，只要求**同一次交付** | 【已闭合】四个落点一并改为与契约逐字一致的口径：「两者**必须同一次交付**，不得只交其一；筛选卡**可以另外单独导出一份只含第 0 章的一页纸**，但**不得**以单独那份替代完整报告」（本文件 §0.1、前置节；卡片用法注与尾注）。实测 `同一文件` 在卡片内 0 处。关闭者：`report-spec`（T-J3）；2026-10-15 |
| C-37 | `templates/report-c-track.md:64`（`docs/e2e-run-2-defects.md` G-10 ★） | 第 4 章「处置」行写 `A / B / C / 混合 / 不确定`：裸字母不带「轨 / 档」后缀（违 `references/00-protocol.md` §6 术语表的引用要求），且与 `references/01-genre-routing.md:23-31` 的现行闭集不一致 | 【已闭合】改为 `\`A 轨\` / \`B 轨\` / \`C 轨\` / \`混合/不确定\` / \`无法判定\``，**以 `01:23-31` 的实测现文逐字为准**——实测该表为**五行**（`混合/不确定` 是**一个**取值，任务书「六值」的描述与实测不符），故按实测写为五项。关闭者：`report-spec`（T-J3）；2026-10-15 |
| C-38 | `templates/report-c-track.md:165`、`:175`、`:186` + `templates/report-single.md:191`、`:201`（`docs/e2e-run-2-defects.md` G-11 ★） | 附录 A 的 `degraded` / `degradeReason` 行写成 **4 格**（`\| \`degraded\` \| \`degradeReason\` \| {{degraded}} \| {{degradeReason}} \|`），塞进 2 列表格 ⇒ 渲染成 4 列、后续行错位 | 【已闭合】五行一并改为与同文件既有写法（`report-c-track.md:199` / `report-single.md:217`）相同的 2 格形式 `\| \`degraded\` \| \`degradeReason\` \| {{degraded}} \| {{degradeReason}} \|`（即以 `\|` 行内分隔）。**范围说明**：任务书只报 `templates/report-c-track.md:165`，实测同一坏行形状共 5 处（c-track 3 / single 2），已全数修正。关闭者：`report-spec`（T-J3）；2026-10-15 |
| C-39 | 本文件第 3 章「渲染格式」（`docs/e2e-run-2-defects.md` G-15 ★★） | 第 3 章把 `locator` 取值闭集写成**三值**（缺 `行 N`），而 `references/03-structure.md` L2-R8 已定为**四值**（增 `行 N`，并规定自然段边界不可判时**必须**用它）⇒ 同一闭集两处不一致，渲染侧会直接照抄 `09` 的三值 | 【已闭合】**T-J3 追加**（裁定后落盘）：括号内闭集换成与 `references/03-structure.md` L2-R8 **逐字同一套四值**（分隔符同为 `｜`）并加回指（指向 `03-structure.md` 的 L2-R8）；`03` 侧「自然段边界不可判」的长说明**不复述**，本文件只留「四选一 + 边界不可判时用 `行 N`」。实测附录 P 的 `{{locator}}` 行属字段溯源（指向契约 §3 字段表），不改；三份模板内该闭集 0 处。关闭者：`report-spec`（T-J3）；2026-10-15 |
