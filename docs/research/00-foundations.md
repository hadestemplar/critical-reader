# 00-foundations.md —— 第一性文档

> **地位**：`references/*` 与 `rubric/*` 是本文的**实现**，其头部必须指向本文。改实现之前先改本文。
> **规则**：每条结论标出处。`【无来源，本文自定】` ＝ 这是我们自己的设计决策，**不是文献结论**；引用前必须解到原页（台账 #50 / #65）。
> **状态**：Stage 1（构念 §1 + 模型选型 §2）初稿，**待用户过审**。Stage 2（§3 操作化 + §4 有效性证据）未开始。
> **证据文件**（均在 `_scratch/source-audit/`，gitignore）：`00-inventory.md`（659 行源层盘点）｜`03-source-defects.md`（旧源层缺陷 S-01…S-10）｜`w1-construct.md`（456 行）｜`w1b-multi-axis-precedents.md`（115）｜`w2-argument-model.md`（191）｜`w2b-cost-and-precedents.md`（206）｜`w3-genre.md`（221）｜`w3b-purposes.md`（375）｜`w4-source.md`（211）。

---

## §0 为什么要重建，而不是继续打补丁

历轮全部缺陷——`门禁`/`质量分` 双轴、`band`/`verdict` 双字段、`轨`/`档` 混用、`D1` 三名、`降权`、`H-07`、`H-08`——**没有一条是「规则写错了」，全部是「这个东西到底指什么没定义」**。每轮都在给没定义清楚的东西补定义，所以缺陷类别不收敛（第一轮 20 / 第二轮 18 / 第三轮 7），而第三轮最难的 `H-08` **是用户读出来的，不是跑次发现的**。

旧源层本身也在里面：`03-source-defects.md` 记了 10 条，其中 4 条是**事实性误引或无来源断言**——用 **Wikipedia** 支撑「Walton 归纳了 60+ 种方案」（一手事实是 **96**，`10.1017/CBO9780511802034` 出版方摘要逐字 "a compendium of 96 schemes"）；把一个**英文**、采自三个学生测验网站的数据集（arXiv 2202.13758）写成「中文逻辑谬误数据集」；给「cogency / effectiveness / reasonableness」三组高层特征**指错了出处**（指到 Marro & Cabrio，正确是 `10.18653/v1/E17-1017`）；用一个**实测 404** 的页面支撑「8–12 高频方案，每方案 3–5 CQ」这个执行成本估计。

⇒ **不是「调研做得浅」，是有误引与凭空断言。** 所以本文的纪律是：**只从可打开的一手来源推导；推不出来就写「无来源」。**

---

## §1 构念定义：这个东西到底在判断什么

### 1.1 不是一个轴，是三个互不可加的构念

**文献给的是三轴，不是一根轴。** `Wachsmuth et al. 2017`（`10.18653/v1/E17-1017`，pp.176–187）§2 p.177 逐字：

> Following Blair (2012), we distinguish three main quality aspects: **Logical** quality in terms of the cogency or strength of an argument. **Rhetorical** quality in terms of the persuasive effect. **Dialectical** quality in terms of the reasonableness…

同页另一句逐字：**"sufficiency thus presupposes relevance (Blair, 2012)"**——三个判据**不是可加的，是有前提关系的**。同页自认：**"overall argumentation quality seems hard to measure, as the impact and interaction of the different dimensions remain unclear"**。

**本项目采用的三构念（命名与分界是本项目的，`【无来源，本文自定】`）**：

| 构念 | 回答 | 输入范围 |
|---|---|---|
| **W**（warrant，站不站得住） | 从前提推得到结论吗 | **全在文本内** |
| **C**（credibility，值不值得信） | 它关于世界的说法是真的吗 | **必须含文本外检索** |
| **V**（value，值不值得读） | 相对**一个已声明的参照集合**，提供了多少**新的观点 / 思考 / 信息** | **文本 × 参照集合** |

> **`V` 的定义已按 `A3` 更正（2026-10-16）**：用户逐字「第三轴就是有没有**新的观点和新的思考**，有没有**新的信息增量**…… **不是**对我有没有价值，而是这篇文章本身有没有新的东西」。⇒ 「读者 / 目的」已从 `V` 的输入里删掉（那是 `A3` 之前的旧定义，S1 实测指出本节与 S1 冲突）。

**"三构念 + 不可加总"这个具体组织方式是 W1 自己组织的，没有一篇文献直接这么说**（W1 主动交底，`w1-construct.md` §E）。文献直接支持的是：① 三轴存在（上引）；② 判据间有前提关系（"sufficiency presupposes relevance"）；③ **成熟工具普遍拒绝出总分**（见 §2.1）。

### 1.2 骨架：`E17-1017` Figure 1 的 15 维分类

**父子关系是论文自己给的，不是我们拼的。** 题注逐字（p.181）："Figure 1: The proposed taxonomy of argumentation quality as well as the mapping of existing assessment approaches to the covered quality dimensions. Arrows show main dependencies between the dimensions."；§3.1 逐字："each high-level dimension has a set of **sub-dimensions** agreed upon. The sub-dimensions are shown on the **outer ring in Figure 1**"；§3.3 逐字："The taxonomy indicates what sub-dimensions will affect the same high-level dimension."

```
Argumentation quality（overall）                       1
├─ Cogency (Logic)                                     3
│   ├─ Local acceptability
│   ├─ Local relevance
│   └─ Local sufficiency
├─ Effectiveness (Rhetoric)                            5
│   ├─ Credibility
│   ├─ Emotional Appeal
│   ├─ Clarity
│   ├─ Appropriateness
│   └─ Arrangement
└─ Reasonableness (Dialectic)                          3
    ├─ Global acceptability
    ├─ Global relevance
    └─ Global sufficiency
                                              合计 3+11+1 = 15
```

计数与 §1 逐字「15 widely accepted quality dimensions (including the overall quality)」、同页「three experts assessed all 15 dimensions…over 14,000 annotations」及摘要三处自洽。

**★ 结构发现（这条决定了旧 `D2` 为什么塌）：3 个 `Local*` 全在 `Cogency` 下、3 个 `Global*` 全在 `Reasonableness` 下——local / global 的分界横跨逻辑侧与辩证侧，不是同一维度的高低两档。** 旧 `D2` 把「前提 → 结论」与「整篇 → 议题」两件事塞进了同一个「论证质量」。

### 1.3 `H-08` 的学理根因：`Global relevance` 就是那个编码位置

用户对第一篇的判词是 `C`、机器两跑次给 `B`，差别落在「整篇文章为另一个问题给出了完整漂亮的论证」。**这个失败模式在 `E17-1017` 里有名字，而且不在 cogency 那一侧：**

- `Global relevance` 逐字：**"Argumentation is relevant if it contributes to the issue's resolution, i.e., if it states arguments or other information that help to arrive at an ultimate conclusion."** ← 判定对象就是「该议题」。
- `Global acceptability` 逐字：…the target audience accepts both the consideration of the stated arguments **for the issue** and the way they are stated.
- `Global sufficiency` 逐字：**"Argumentation is sufficient if it adequately rebuts those counterarguments to it that can be anticipated."**
- §2.3 逐字：**"Global relevance implicitly excludes fallacious moves, so reasonable arguments are cogent (van Eemeren, 2015)."**

**为什么旧 `D2` 看不见它**：`Cogency` 三个 `Local*` 判据的逐字定义**全部以 "A premise of an argument…" / "An argument's premises…" 起头**，只在前提与结论之间工作，**不问结论对着的是不是被问的那个议题**。⇒ **整篇答了另一个问题，在 cogency 上可以拿满分。**

**旧 `D2` 与 `Reasonableness` 三个 global sub 的逐条对照（缺 2、半 1、多 2）：**

| 论文判据（§3.2 逐字） | 旧 `D2`（`rubric/quality-dims.md` 原文） | |
|---|---|---|
| `Global relevance`「contributes to the issue's resolution」 | **无**——`:16` 三问全文「支撑有多好：有几条、有没有处理反例与限定、核心链条是否可被检验」，**没有一问是「讨论的是不是这个议题」** | **缺** |
| `Global acceptability`「the target audience accepts … for the issue」 | **无**——`:16` 无受众层 | **缺** |
| `Global sufficiency`「rebuts … that can be anticipated」 | `:16`「有没有处理反例与限定」＝有；但无「可预见」收窄，且 `:75`/`:76` 把结论降级成「1 条／≥2 条正向原文片段」 | **有问句、无操作化** |
| ——（论文无「条数」量） | `:75`/`:76` 正向片段条数 | **多** |
| ——（论文无此项） | `:16`「核心链条是否可被检验」 | **多** |

**归属错误**：旧 `D2` 名义按 cogency 建（`:35` 原文），但「整篇答了另一个问题」的归属处是 `Reasonableness`，而 `D2` 三条判据**没有一条在那一侧**。⇒ 与 `H-08` 同源：**真正缺的就是 `Global relevance` 那一题。**

**★ 合成规则有出处，且是合取（非补偿）——我此前写的「论文没给合成规则」是错的，已撤回。**
`Reasonableness` 的**定义句本身就是合成式**，逐字：「Argumentation is reasonable if it **contributes to the issue's resolution** in a **sufficient way** that is **acceptable to the target audience**.」＝ `global relevance ∧ global sufficiency ∧ global acceptability`。`Cogency` 定义句同构（"acceptable premises that are relevant to its conclusion and that are sufficient"）＝ `local acceptability ∧ local relevance ∧ local sufficiency`。

⇒ **两个层级都是合取聚合，论文未给权重、未给部分满足的降档规则。**

**我的独立复核**（非转述）：`_scratch/source-audit/txt/E17-runsop.txt` 的 `L734`/`L737`/`L739` 是 **stream 14 / op `TJ`**，逐字三条正是上面那句 `Reasonableness` 定义；`L169` 是 **stream 3 / op `TJ`**，承载 `Cogency` 定义（"…dividually acceptable premises that are relevant to…"）。**⇒ 这两段定义不受 PDF 抽取器 `Tj` 分支丢字缺陷影响。**
**`Tj` 丢字缺陷的暴露面已归零（两条都定位并关闭）**：全文只有两个 stream 含 `Tj`——`stream 12`（`p.181` **Figure 1 图内文字**，`Tj=52`）与 `stream 19`（`p.184` **Figure 2 图内文字**，`Tj=79`）。两条**都是图内文字、都不是正文、都不被本文件任何结论引用**：`stream 19` 是示例论证「Water bottles, good or bad?」的 Pro/Con 段与三行打分数值，其特征词 `water bottle`/`bottled`/`Katrina` 在两份产物里 **0 命中**；`w1-construct.md:266` 唯一相关命中引的是 **Table 3 题注**（`stream 16`/`p.183`，全 `TJ`）。`stream 12` 修前修后 run 数同为 58，故 §1.2 的层级结论不受影响。

### 1.4 旧四维的逐条处置

| 旧维 | 处置 | 依据 |
|---|---|---|
| `D2` 论证质量 | **必须拆**——它把 `Cogency` 与 `Effectiveness` 混成一维；且名字对不上（`Credibility` 属 `Effectiveness(Rhetoric)` 不属 `Logic`） | `E17-1017` Figure 1 |
| `D1` 信息增量 | **降级为关系构念**，不是文本属性 | Saračević 1975 `10.1002/asi.4630260604` 摘要逐字 "Relevance is considered as a measure of the effectiveness of a contact between a source and a destination in a communication process."；Schamber et al. 1990 `10.1016/0306-4573(90)90050-C` 标题 "toward a dynamic, situational definition"；Balasubramanian 2007 `10.1145/1277741.1277922`（novelty 相对已读集合） |
| `D3` 结构与可复用性 | **拆**：「结构」有对应物（衔接类度量），**「可复用性」找不到对应物 ⇒ 删** | `【无来源，本文自定】` |
| `D4` 来源与可核查性 | **构念—操作不匹配**：名字承诺「来源可靠」，只量了「可核查」。改名为**「出处可核查性」**，并**明确不声称等价于来源可靠** | Admiralty Code 本身两轴（信源可靠性 A–F × 信息可信度 1–6）逐字 "requires the evaluation of source reliability and information credibility **independently** from one another"（Kelly et al. 2025，`10.31234/osf.io/m8yxb_v3`）；GRADE Handbook §1.2 标题 "Separation of confidence in effect estimates from strength of recommendations" |

**旧 `D4` 的第二个错**：它用「读文本自身的署名 / 出处」判来源——**这正是文献反复证伪的清单式评估**（Meola 2004 `10.1353/pla.2004.0055`；Kavanaugh & Lenart 2017 `10.4018/978-1-5225-1072-7.ch002`；SIFT / lateral reading 一线，Caulfield 2019、Wineburg & McGrew 2019 `10.1177/016146811912101102`）。

**旧协议关于「用 `D4` 替换『表达』」的那条理由（「表达只能给印象分」）是错的**：`E17-1017` 把 `Clarity` / `Appropriateness` / `Arrangement` 列为论证质量的**正式维度**。正确的措辞是——**本工具是信息评估框架，不是写作质量框架。** `【无来源，本文自定】`

### 1.5 官方先例：定义不清的维度应当删除

`E17-1017` §3.1 逐字给出三条**删除理由**，这是「删维」的官方先例：

| 被删 | 逐字理由 |
|---|---|
| `strength` | "we omit those dimensions… that have **unclear definitions**, such as strength" |
| `well-formedness` | "**covered by others**, such as well-formedness, which merely refines the acceptability part of cogency (Govier, 2010)" |
| `convincingness` | "**Convincingness is left out, as it is close to effectiveness** and as both the feasibility and the need of persuading the universal audience has been questioned (van Eemeren, 2015)" |

另有一条**替换而非删除**：把 Aristotle 的 `logos` 直接对齐到 `cogency`，逐字理由 "which better fits real-world argumentation"。

**缺口照写**：Table 1 里 `Fallaciousness` / `Validity` / `Soundness` **没有逐字删除句** ⇒ 属「未写出理由的删除」，**本文件不替它们编理由**。

---

## §2 模型选型

### 2.1 聚合方式：不是加权求和

**三条同领域官方工具的原文**（W1 `w1b-multi-axis-precedents.md`；W2b 另外独立取到 5 条）：

| 工具 | 逐字 |
|---|---|
| **Cochrane RoB 2**（Sterne 2019, BMJ 366:l4898, `10.1136/bmj.l4898`） | **"The overall risk of bias for the result is the least favourable assessment across the domains of bias."** |
| **AMSTAR 2**（Shea 2017, BMJ 358:j4008, `10.1136/bmj.j4008`） | "has an overall rating based on weaknesses in critical domains"；**"AMSTAR 2 is not intended to generate an overall score."** |
| **GRADE**（Guyatt 2008, BMJ 336:924-6, `10.1136/bmj.39489.470347.AD`） | **"GRADE is not a quantitative system for grading the quality of evidence"** |

**RoB 2 那句「取最不利」是一条可执行的非补偿聚合规则**，正是本项目「红灯不能被另外几维拉回」的正面学理支撑。

**反例与决定性差异**：走总分的两支（MQM、NewsGuard）**都依赖一份预设阈值**（MQM 逐字：阈值 "predetermined on the basis of stakeholder needs and expectations, text or content type, and practical experience"），而本项目已取消校准、**无阈值可用** ⇒ **总分机制在本项目里缺一个被定义的输入。** `【这不是偏好，是被证据逼出来的】`

**必须区分的两类**：上表是「**不是加权求和**」的**直接引文**；「**它们都等价于顺序否决**」是 W2 的概括，**无直接来源**。

**★ 同领域文献自己给出的聚合式就是合取**：`E17-1017` 的 `Cogency` 与 `Reasonableness` 两条定义句都是**合取式**（见 §1.3），**无权重、无部分满足降档规则**。⇒ 「非补偿」不只靠跨领域类比（RoB 2 / AMSTAR 2 / GRADE），**在论证质量这一层也有直接出处**。

**未核项（不得当先例用）**：CASP（页面 200 但只抽到 2,347 字符导航文本）、JBI（`fetch failed`）、MQM 阈值原文（检索 penalt / critical error / threshold / score 全 NOT FOUND）；**OECD/JRC 手册关于补偿性聚合的原文没核到**（oecd.org 403、两条 PDF 404、JRC handle `JRC49108` 指向另一份报告）⇒ 一律【待核实】。

### 2.2 单个论证的判据：`Hoffmann & Catrambone 2023`

`Informal Logic` 43(1) 23–90，`10.22329/il.v43i1.7076`。八条判据全部写成问句（4.1–4.8），其中一条**不需要方案识别**：

> **"Does your assessment regarding the truth of the conclusion change if you change the truth value of the premise from true to false?"**

**它的分量（三分，不二选一）**：
- **强于** Walton 名录与此前协议：475 篇论证 + 逐字**"The eight criteria cover all observed problems in the arguments."** + "to this assessor, there was no point at which the need for further criteria was made salient by the data."
- **但饱和主体是单一专家**：逐字 "the assessment of these 475 arguments has been performed by **just one expert**"；作者自陈 **"There is no theoretical foundation from which they are derived."** ⇒ 是**一个人的经验闭包**。
- **硬边界**：逐字 **"To assess the quality of an argumentation would require more than can be provided in the current contribution."** ⇒ **它判不到整篇文章。** 整篇聚合必须本项目自定（`【无来源，本文自定】`）。

**已知不一致及处置**：正文 4.1–4.8 共八条，**Table 1 只有 7 行**——缺的是 **4.7**（结构判据：独立前提组 vs 共依前提组）。行↔判据 1:1 为 1↔4.1 / 2↔4.2 / 3↔4.5 / 4↔4.3 / 5↔4.4 / 6↔4.6 / 7↔4.8；全文 `seventh criterion` / `criterion 7` 均 NOT FOUND。**论文没有任何一句解释 4.7 为何缺席 ⇒ 记「PDF 层面不可判定」。**

**真值改变测试的中文落地（4 步，`【步骤 0 无来源，本文自定】`）**：0 前提命题化（**最大失效点**）→ 1 把前提换成 ¬P、其余原文不动 → 2 唯一问句「其余不变，本文对 C 的支持是否下降？」（下降 = relevant / 完全不变 = irrelevant / 缺知识 = 无法判断，不计分）→ 3 同义反复例外。
**中文四个坑**：① 前提常非命题形式；② **连接词不得当相关性证据**——EMNLP 2024 `10.18653/v1/2024.emnlp-main.730` 逐字 "logical fallacies often use connective words to indicate an intended logical relation…, while the argument semantics does not actually support the logical relation"；③ 零形式衔接（无实证）；④ 领域知识不可省。

### 2.3 谬误与 CQ：只作报告提示层，不进判定

**Walton 路线的两个硬障碍**：① **方案识别没有唯一解**——两套竞争分类（Visser et al. 2020, `10.1007/s10503-020-09519-x`：Walton 分类 vs Wagemans Periodic Table）⇒ **一个没有唯一输入的量不能进判定**；② 完备性无解——Yu & Zenker 2020 摘要逐字 "the field currently lacks a method for providing a complete argument evaluation"。

**数字更正**：Walton 2008 方案总数 = **96**（不是 60+）；「8–12 高频方案，每方案 3–5 CQ」**所引页面实测 404 ＝ 无来源**。

**Yu & Zenker 2020（`10.1007/s10503-020-09512-4`）已解出全文**（Springer `link.springer.com/content/pdf/…` CC-BY 实测 200，136,052 字符）：§6.3 **Full Meta-Level CQ-List 共 7 条**（CQ-1 / CQ-2.1–2.4 / CQ-3.1–3.2），**每条带停止规则**；配套逐字 "a complete evaluation requires a (preferably short) finite CQ-list"、"This list is meta-level complete insofar as sub-CQs arise only at the theoretical or applied level"。成本因此从 288–576 条降到 **7 条**。
**但结论不变（CQ 仍只作提示层），理由改为**：① 普遍性未证——逐字 "**Two anonymous reviewers therefore rightly expressed doubt that our CQ-list is general.** … we can only offer an **indirect** response"；② 硬假设在中文长文上不成立——逐字 "**Our CQ-list assumes that D is explicit.** In a realistic argumentative context, **this is implausible.**"

**pragma-dialectics 十条规则：完整一手条文仍未取到**（primary 章节 `10.1017/cbo9780511616389.009` OpenAlex 标 `oa=closed`；已试 5 条通道失败）。只取到**二手节选 5 条**（Born 2024, `10.1007/978-3-031-63284-6_2`，Table 2.1 标题逐字 "**Excerpt** from the code of conduct of pragma-dialectics"，含 Rule 1 / 2 / 7 / 8 / 10）。**节选里没有 Rule 4 ⇒ 它对「整篇偷换问题」的覆盖仍未证实，维持不引用。**

### 2.4 路由：由「目的」决定判据，不由体裁决定

**旧机制是被一份国家级框架明文否掉的形态。** PIRLS 2016 Ch.1 逐字：

> **"However, the purposes for reading do not align strictly with text types."** "For example, biographies or autobiographies can be primarily informational or literary, but include characteristics of both purposes."

CEFR Companion Volume `:2545` 亦逐字承认其类目 "**is a mixture** between reading purpose and reading particular genres with specific functions"。

**旧 7 类闭集是混维分类（至少跨 4 个维度）**，逐一对号到 PISA 四维：

| 旧类 | 真正所属维度 | 出处 |
|---|---|---|
| `argument` / `exposition` / `narrative` / `tutorial` | PISA `Text type`（`argumentation` / `exposition` / `narration` / `instruction`） | `pisa2018.txt:722` 逐字 6 值 |
| `persuasion` | **目的维**（NAEP `To Persuade`） | NAEP `:745-746` |
| `news` | **交际场景 / 机构维**（课标任务群 7「新闻传媒类」） | `gz-yuwen.txt:686-691`（**该处是任务群 7 的内部子分类，提升为全局维是推广**） |
| `academic` | **领域 / 话语社群维** | **本轮四框架内无落点，未决** |

**两条机械结论**：① 旧闭集在文本类型维上**既漏又溢**——PISA 6 值它只覆盖 4 个（**漏 `description` 与 `transaction`**），同时多出 3 个不是文本类型的值；② **「用一个标签选一套判据」这个机制本身被否定**（上引 PIRLS）。

**PISA 四维分立（`pisa2018.txt:717-723` Box 2.3 逐字）**：1) `Medium` print/electronic 2) `Environment` authored/message-based 3) `Text format` continuous/non-continuous/mixed/multiple 4) `Text type` = description, narration, exposition, argumentation, instruction, transaction。

**★ 未声明时的取值（Stage 2 更正，2026-10-16）**：**声明 > 推断 > `P0` 兜底**。原口径「未声明 → 直接取 `P0`」**错**：`P0` 判据族（可获得性 + 可核事实层）**不含论证质量**，一篇有承重缺陷的文章将无判据可用，验收测试①不可能通过，且正是旧失败案例 4 的形态。⇒ 未声明时先按 §6.4 的判定步骤**推断**，推断不出才落 `P0`，且必须逐字披露。

**替换形态（`【本项目的形态设计】`）**：单值闭集主标签 → **分维多标签字段，各自独立、可空**：`purpose`（判定步骤与兜底见 §6.4）｜`text_type[]`｜`medium`｜`environment`｜`text_format[]`｜`communicative_scene`｜`domain`（**无出处，不提供**）。
**两条硬要求**：① 每字段独立可空，**不得**再合成单值「主标签」用来选判据；② **字段多不等于判据多**——`text_type[]` / `communicative_scene` **只作描述**，**只有 `purpose` 参与判据族选择**。

### 2.5 目的集（四项，全部有出处）

| | 目的 | 出处 |
|---|---|---|
| **P0** | **定位与筛选**（**兜底值**，非「未声明时的默认取值」，见 §6.4） | CEFR Companion Volume `:2547-2549` 逐字：reading a text "'diagonally' at speed **in order to decide whether to read (parts of) it properly (= 'skimming')**" |
| **P1** | 明辨真伪 | NAEP `:745-746` "the ability to persuade in order to change the reader's point of view or affect the reader's action"；语文课标任务群 6（`gz-yuwen.txt:645-655`，逐字含「发展**实证、推理、批判与发现**的能力」） |
| **P2** | 获取信息 | NAEP `:749-750` "the ability to explain in order to expand the reader's understanding"；PIRLS `:126` "acquire and use information"；课标任务群 7（`gz-yuwen.txt:677-691`） |
| **P3** | 体验与欣赏 | NAEP `:754-756`；PIRLS `:133` "Literary Experience"；课标任务群 5（`gz-yuwen.txt:606-619`，逐字「从**语言、构思、形象、意蕴、情感**等多个角度欣赏作品」） |

**穷尽性不能给**——四份官方文本自己都不说穷尽：NAEP `:757-758` "do not intend to discount the importance of other common purposes for writing"；PIRLS `:123-126` 两目的 "account for **most** of the reading"；CEFR `:2545` 自认是 mixture；PISA 把目的放在 `scenarios` 维且 2018 已重定义。

**★ `P0` 这个默认目的有官方出处，这是本产品存在理由的学理落点。** 但 **`P0` 配哪一层判据在文献里没有出处**：PIRLS 对**两个目的都跑满全部四层**理解过程，即**目的不限制过程层**；四份框架**没有一处**把「阅读深度 / 投入程度」命名为独立轴。唯一有出处的形态是 **NAEP Exhibit 1.3 把 "Depth and complexity" 放在评估标准的内部子项**，且 `:1041-1043` 逐字 "in relation to the purpose and audience"。⇒ **`P0` 的深浅分档应在 `P0` 判据内部定义**，`【工程约定】`。

**★ 一条硬推论（Stage 2 必须处理）**：现行 `rubric/quality-dims.md:82-83` 的 `A` 档 = `n_low=0 ∧ n_high=4`，而 `:89` 规定某维无取值则该层不产出档位。⇒ 若 `D2` 在某些目的下不出，**(a) `n_high` 上限只到 3、`A` 档数学上不可达；(b) 按 `:89` 实现则每一篇都退化成 `无法判定` ＝旧失败案例以新形式复现。** ⇒ 契约必须**按目的给维度集**，并保证 `n_high = |维度集|` 可达；`D2` 改为**分目的替换槽**。

**替换槽取值**：`P1` ＝论证质量（**有出处**）；`P2` ＝信息完整性与来源层级（**只有方向性出处，条目本身标【无来源，本文自定】**）；`P0` ＝可获得性与可核事实层（**无来源，本文自定**）；`P3` ＝叙事与审美效果（**判据族整体缺失＝空档**，文献只证明 `P3` 是合法目的，不能替我们决定「新建判据族」还是「本产品不服务 `P3`」）。

### 2.6 来源轴：`N/A ≠ 0`

**「无法核查」在文献里有三派处理方式，没有一派把它记为低分**：
- **记显式类别**——Admiralty 原设计给两轴各一个格子：逐字 "if a source is completely novel, it is designated as **'reliability cannot be judged' ('F')**"、"truth cannot be judged ('6')"。
- **记低确定性**——GRADE 四档。
- **记缺失值**——Rubin 1976 `10.1093/biomet/63.3.581`；Altman & Bland 1995 `10.1136/bmj.311.7003.485` 逐字 **"absence of evidence is not evidence of absence"**。

**现行规则「`D4` 不因无法联网压档」方向正确但实现不完整**：现在「文本没署名」与「我们没去核」在评分表上是**同一个低档**。⇒ 建议三态：`有出处` / `无出处` × `已核` / `未核` / `无法核`，后者走**缺失值通道**。`【三态设计无来源，本文自定】`

**旧 `sourceType` 四分类（一手 / 二手 / 无出处 / 不可核）无依据**——它混了三种逻辑：「一 / 二手」是**类型**，「无出处」是**属性缺失**（是 `D4` 的取值，不是平行类别），「不可核」是**流程状态**。反证：Insights 36(7) 2023 `10.1629/uksg.604` 摘要逐字 "cannot easily be categorized in any information category but is defined instead by the ways it is used and interpreted by its users"。⇒ **改法：一个取值维度 × 一个状态字段。** `【无来源，本文自定】`

**Admiralty 移植到文章：既无背书也无批评文献** ⇒ 文档里必须明写 **【待核实】+ 无批评文献**。原始适用范围是二战英国海军部情报处开发、NATO 用于评 **raw intelligence**（"often unverified, incomplete, and/or prone to inaccuracies or biases"，Kelly et al. 2025）。

**反对证据必须随行**：Kelly et al. 2025 实证评判者把两轴**压成对角线**（A1/B2/C3…），逐字 "it is unclear whether information evaluators are capable of treating source reliability and information credibility as fully independent, even if such guidance were prescriptively valid"。⇒ **若拆轴，两轴必须走完全不同的证据通道，否则必塌。**

### 2.7 维度重复计分：可做成验收测试

工具现成：区分效度 ＝ Campbell & Fiske 1959（`10.1037/h0046016`）；复合指标冗余 / 权重 ＝ OECD/JRC 2008 手册 `10.1787/9789264043466-en`、Nardo et al. 2005 `10.1787/533411815016`、Saltelli 2006 `10.1007/s11205-006-0024-9`。
⇒ 可落成验收测试：**实测两个维度的秩相关，超阈值即合并或降权，而不是等权求和**。**阈值必须实测标定，不得编数字。**

---

## §3 待裁事项（需要用户决定，Stage 2 之前）

| # | 裁定（2026-10-16，用户） | 后果 |
|---|---|---|
| **A1** | `P3`（体验与欣赏）**不建判据族**——原文「不建。识别出是这个类型的文章给个提示就行」 | 命中 `P3` 时**只报体裁/目的提示**，不产出三轴 |
| **A2** | 「学术/领域」**只作现状信息**——原文「我其实并不关心来源是学术出版还是在什么领域。这个属性只是一个现状信息，不会影响文章本身的内容」 | **只作描述性字段记录，不做路由、也不单独增减任一轴**。旧的「同行评议起点更高」假设**作废**（与 W4 的 SIFT 证据同向） |
| **A3** | 输出＝**三轴各三档（🔴/🟡/🟢）+ 每轴状态位**。**第三轴改定义**：原文「值得读不是对我有没有用，而是这篇文章**有没有新的观点和新的思考，有没有新的信息增量**」；「多一个维度是对我有没有价值……**不应该成为影响这篇文章的维度**，我自己会判断」 | ① **「对我是否有价值」从框架中删除**（不是一轴，是用户自己的活）；② 旧「D/C/B/A + 无法判定」单一档位**退休**（推论，Stage 2 落定）；③ 筛选卡改为**三灯并排、不合成单一总分**——与 W1「三构念不可加」的证据一致 |
| **A4** | **选 (a)**——原文「a没问题，不用做的特别复杂，因为是定性判断，个人使用，没有风险……**历史的30篇报告不用参考了，没有参考价值**」 | ① v1 只声称**重测稳定性**；报告边界章**明写「跨判定者一致性未测」**；② **`docs/calibration-30.md` 作废**，`testset/` 校准用途降级；③ 不再为凑样本量做重跑 |

**用户给的参考判词（唯一一篇有用户判词的文章）**：`examples/ai-education-anxiety-china-vs-us/` → **站得住 🔴 ／ 信得过 🟡 ／ 值得读 🟡**，理由「原因之前描述过」／「有一部分有实证，有一部分没有实证」／「作者有新的思考和发现」。**注意：站得住红灯并不等于「不该读」**——用户给这篇的三轴里有一红，但他认为值得读。⇒ 三轴**不得**做成一票否决后的单一结论。

**待 Stage 2 落定的第二个推论**：`V1`…`V8` 否决项**改造成「各轴红灯的触发条件」**，仍只保留 `rubric/vetoes.md` 一张表（硬规则 8「门禁唯一真源」不变）。

## §4 已声明缺口（不闭合，照实登记）

1. 「三构念 + 不可加总」的组织方式**无文献直证**（W1 自陈）。
2. 「文章评估拆两轴」**无直接文献**（W4 自陈，全靠跨域类比：情报单条 / 医学证据体 / 数据质量 / 图书馆学）。
3. 「顺序否决」的**整篇级**直接来源缺失；「从否定单个论证升级到否定整篇文章」是推断（W2 自陈）。
4. `Hoffmann` 判不到整篇；**整篇聚合规则无来源**。
5. `communicative_scene` 维的出处是局部的（课标任务群 7 内部子分类，本文件做了推广）。
6. 中文侧：**中文长文论证质量语料、中文谬误数据集均找不到**（边界：CNKI / 万方不可达 + `web_search` 全 429，故严格含义是「本次可达通道内找不到」）。
7. `GB/T 20093—2022` 附录 C「新闻信息体裁表」**8 类通道 / 15 个 URL 不可得** ⇒ 只能说「旧 `news` 类未引用国标」，不能说它对或错。
8. `E17-1017` 的 Krippendorff α 值取不到（密集数字表无法可靠对齐列）⇒【待核实】。
9. `GB/T`、`pragma-dialectics` 十条规则、`CASP` / `JBI` / `MQM` 阈值、`OECD/JRC` 补偿性聚合原文——**均未取到**。
10. Stage 2 待做：`§3 操作化`（每构念 → 可执行判据 → 字段）、`§4 有效性证据`（构念效度 / 信度 / 效标效度的检验方案与小样本实测）。

---

## §5 有效性：能声称什么、不能声称什么

> 证据：`_scratch/source-audit/w5-measurement.md`（387 行）+ 可跑脚本 `_scratch/w5/reliability.mjs`。文中共 **16 处【待核实】、17 处【无来源，本文自定】**，全部保留。

### 5.1 四条边界

| | **能声称** | **不能声称** |
|---|---|---|
| **内容效度** | 有一份**可审计的判据↔构念映射** | 已通过内容效度程序——CVR/CVI 需要 **≥3 名独立评审**，而**模型判定者不能当评审**（同义反复） |
| **构念效度** | 这是一个**操作化定义 + 可反驳预测** | 已确立。**用户点名的「Meehl 自我批评」未能复述**（Meehl 1978 `10.1037/0022-006X.46.4.806`、1990 `10.1207/s15327965pli0102_1` 只核到元数据） |
| **效标效度** | **一句话都不能声称** | 推断任何准确性——效标自身无信度（用户只判一次、单一评分者）+ 一致性 ≠ 准确性（Livingston & Lewis 1995 `10.1111/j.1745-3984.1995.tb00462.x`）+ `n=1` 时符号检验 `p=1` |
| **信度** | 可测量**重测一致率** | 「档位可靠」 |

### 5.2 「档位级可比」的判决

**不成立为跨篇比较的合法尺度**，只成立为「**同一判定者、同一批内、同一套规则下的有序标签**」。四条理由：① 切点来自文字锚点 + 判断（`rubric/quality-dims.md:130` 自认）⇒ 边界会移动；② 「同档内不比较」把噪声藏进档内（范围限制，Sackett & Yang 2000 `10.1037/0021-9010.85.1.112`；κ 悖论 Feinstein 1990 `10.1016/0895-4356(90)90158-L`、Byrt 1993、Hong 2014、Erosheva 2021 `10.1111/rssa.12681`）；③ 它被当结论写进定稿，兜底却交给「3 次一致」——**是两个不同命题**；④ 跨体裁不变性不成立（`news`/`narrative` 固定不适用）。

**禁止清单**：档位求均值 / 求差；当 1-2-3-4 喂线性模型；跨批比档位。

**与用户既有裁定的冲突——已复议结案（`§3 A4`，2026-10-16）**：用户此前裁定「档位之间可以比较就行，A 档和 A 档可以比，B 档和 B 档可以比」，与上面这条判决冲突。**用户裁 `(a)`：接受判决**，原文「不用做的特别复杂，因为是定性判断，个人使用，没有风险……后续样本量积攒起来可以再优化，现在不用做的特别重」。⇒ v1 **只声称重测稳定性**，报告边界章**明写「跨判定者一致性未测」**。

### 5.3 信度方案

- **「3 次判定 + 档位一致 → 稳定」命名错了**：同一模型 + 同一提示重复 = **重测**，不是评分者间；系统性偏差重复 3 次不抵消。**反例就在仓库里**：机器两跑次都判 `B`、用户判 `C`（`docs/e2e-run-3-defects.md:27-35` vs `:179-186`）——再同意一次就是「3 次一致、稳定」，而它是错的。⇒ 口径改为「**未探测到不稳定**」。
- **统计量**：**Krippendorff α（ordinal）为主**（任意评分者数、允许缺值；Hayes & Krippendorff 2007 `10.1080/19312450709336664`），加权 κ 为副（Cohen 1968 `10.1037/h0026256`，须与未加权并列）。**ICC 不建议**（需假设等距）。
- **门槛（只列已逐字核到的）**：α ≥0.667「good」、≥0.8「excellent」（Ishikawa 2019 `10.1371/journal.pone.0224202` 摘要逐字；Dwyer 2016 `10.1016/j.juro.2015.09.071` 摘要逐字）。
- **样本量**：Tractenberg 2010 `10.1097/WAD.0b013e3181d489c6` 摘要逐字——每等级 1–2 个案例算出的 κ 误差大、置信区间是错的；**每等级 ≥5 例（总 N=25）**，困难等级 ≥42 次评定。⇒ 现在 **19 篇挤 `C`，每档远不足 5 篇**，算出的 κ/α **不可信**。
- **点估计不可用的实证**：5 篇 × 3 次 → `α = 0.7166`，而**自助法 95% CI `[-0.120, 0.990]`（宽度 1.110）**。⇒ 预注册规则取「**CI 下界 ≥ 0.667 且每档 ≥5 篇**」才允许写「可暂行接受的一致性」。
- **判定者分量的制造方法**（`【本项目裁定，无来源】`）：现状是重测，而重测测不到系统性偏差。正确修法不是改名，而是**造出评分者间维度**——同一篇文章分别由 `(a)` 当前模型、`(b)` 另一个模型、`(c)` 同一模型换一套等价提示 判定。**本会话只有一套模型 ⇒ 只能估重测**，照实写。

### 5.4 唯一一个真正的统计推断（**语料已作废，仅留作历史观察**）

> **`§3 A4` 裁定：`docs/calibration-30.md` 作废**——原文「历史的30篇报告不用参考了，没有参考价值」。本节数字**不得**作为任何决策依据，只保留「曾经观察到什么」这一条记录。

`docs/calibration-30.md:117-125` 的 6 个可比点（#4 双方不确定，剔除）**6/6 全部是机器比用户宽一档**（5× `C→D`、1× `A→B`）；精确二项符号检验**双侧 `p = 0.03125`**。
命令：`node _scratch/w5/reliability.mjs --csv _scratch/w5/criterion-6.csv`。
**限制必须同写**：6 点不独立（同用户 / 同批 / 同判定者），且是**事后可得**样本。

### 5.5 三个必须记下的仓库事实

1. **同一语料里同时存在三套同名 `A/B/C`**：`testset/*.meta.json` 的 `tier`（体裁派生，`testset/README.md:89` 明说是映射自 `genre-taxonomy`）`A6/B15/C9`｜报告档位（四维计数）`A2/B7/C19/D1/未判定1`｜`轨道`。⇒ **任何 `A/B/C` 统计前必须先声明是哪一套。**
2. **仓库里不存在结构化的逐维取值表**（`rg n_low` 只命中协议定义、1 篇报告、缺陷文档）⇒ 维度相关/冗余检验**本轮全部不可执行**。这是 §5 的**第一个待补数据工件**（`item_id,D1,D2,D3,D4`），**优先级高于任何统计**。
3. **`meta.category` 有 9 个标签**（含「论证/评论」与「论证型」并存），与协议 7 体裁闭集**不同源** ⇒ 用它当自变量的分析都是在用另一套分类学。另：**A 档只出现在论证类体裁，报道型 6/6 全 `C`**（§F-4「机制造成的档位塌陷」的量化证据）。

### 5.6 永久局限（不是待办）

**效标自身无信度且方法学上无解**——用户判词是单一评分者、只判一次；「一致性 ≠ 准确性」。⇒ 写成**永久局限**，**不列成待办**。

### 5.7 六条失败案例的测量学定位

| 旧缺陷 | 测量学名称 |
|---|---|
| `H-08` | 构念覆盖不足（construct underrepresentation）+ 指标替代失效 + **协议内部漂移**（问句里有效度、取值定义里只剩数量） |
| 错误对照（美国精英 vs 中国大众） | **非等价组比较 ⇒ 构念置换/混杂：是效度问题而非信度问题，一致救不了** |
| 标签翻转 | **首要是信度**；更严重一层是分流器不可复现 ⇒ 同一篇文章被两套工具测量（不变性/DIF）。**`score` 5/5 相同是假象**（分歧在阈值裁决之后） |
| 非论证体裁空转 | **地板效应 + 跨体裁测量不变性失败 + 把 missing 当低分**（`k=1` 上限 `C` 的封顶在统计上等价于把缺失当 0） |
| 谬误清单 | **标准参照系被优化**：度量腐败（Campbell 1979 `10.1016/0149-7189(79)90048-X`）+ 枚举清单定义了一个可规避的补集 ⇒ 构念污染 |
| 维度重复计分 | 维度冗余 → 双重计分（加性组合下才成问题；形成型指标模型下相关不必然是错，Bollen & Lennox 1991） |

**冗余的检验办法（不依赖大样本）**：用「一手材料多但来源不可核」vs「来源可核但增量低」两类文本做**干预式判别**；30 篇里 `#1`/`#3`/`#6`/`#7`/`#10` 是天然候选。

---

## 6. Stage 2 收口（2026-10-16）

四条裁定 `A1`–`A4` 见 §3。四条并行研究的落地结论如下。**本节是实施依据：改动 `references/` / `rubric/` / `templates/` 之前，以本节为准。**
源文件：`_scratch/source-audit/stage2/s1-axes.md`（246 行）｜`s2-routing.md`（212 行）｜`s3-redlines.md`｜`s4-delivery.md`（333 行）。**四份均为方案，未改任何仓库文件。**

### 6.1 三轴（源：`s1-axes.md`）

- **`W` 站得住** ＝ 从**文中给出的**前提能不能推到**文中宣布的**结论，且推的是不是**文章自己提的那个问题**。输入全在文本内；**不含**前提是否为真（→`C`）。
- **`C` 信得过** ＝ 文中**关于世界的可核事实主张**是否与**文本外可打开证据**一致。输入必须含文本外检索；**不含**论证结构、来源类型、学科（`A2`）。
- **`V` 值得读** ＝ 相对**一个已声明的参照集合**提供了多少**新的观点 / 思考 / 信息**。参照集合 ＝ **已知公开讨论**（`【无来源，本项目自定】`：它是唯一**不占用外部检索通道**的候选，`C` 已占用该通道，通道 429 时两轴同时塌）。**不含**「对我是否有用」（`A3` 已删）。
- **每轴三档**（🔴/🟡/🟢）各给「可判定短句 + 至少要核什么 + 一个反例」，见 S1 §2。`W` 的判定顺序 ＝ 承重主张清单 → 结构(4.4) → **真值改变测试**(4.5) → 充分性(4.6) → 一致性(4.8) → **换题检查** → 可预见反例。
- **两处残留自由度已明写、不装精度**：`C` 轴的**抽样比例无来源**（不设固定条数 ⇒ 长文工作量不封顶）；`V` 轴的**参照集合不可复现** ⇒ `V` 的 🟢/🟡 边界**不可跨判定者比较**。
- **轴间零合成、零加权、零一票否决**（`E17-1017` 两条合取定义句 + RoB 2「取最不利」+ AMSTAR 2「not intended to generate an overall score」+ GRADE「not a quantitative system」）；**轴内**保留非补偿。
- **边界有出处**：`E17-1017` §2 p.177 逐字 "It replaces truth, which is often unclear" ⇒ acceptability 在 `W` 侧、truth 在 `C` 侧 ⇒ 同一段原文可进两轴，**重复的是判定动作，不是原文**。

### 6.2 状态位（闭集五值，固定串）

| 值 | 含义 | 出灯？ |
|---|---|---|
| `已评估` | 该轴判据已在本跑次执行完毕 | **出** 🔴 / 🟡 / 🟢 |
| `未评估` | 该轴判据未执行（含 `P3` 命中、本轮无对应输入） | 不出 |
| `未核查` | **仅 `C` 轴**：外部核查未执行 | 不出 |
| `无法核` | **仅 `C` 轴**：文本未给出可核验线索 | 不出 |
| `不适用` | 该轴判据对本篇结构性不适用（如没有承重结论时的 `W` 轴） | 不出 |

**三条硬规则**：① 灯**只**在 `已评估` 下产生，其余四态**不得用默认档补齐**；② `未核查` / `无法核` / `不适用` 的轴**不得为 🟢、也不得为 🔴**；③ 非 `已评估` 的轴**不得参与任何跨轴叙述**。
**依据**：Admiralty F/6 逐字、GRADE 低确定性、Rubin 1976 / Altman & Bland 1995 逐字 "absence of evidence is not evidence of absence" —— **没有一派把「没查」记为低分**；仓库已有同形先例 `references/09-report-spec.md:120`（否决项三态）与 `references/08-track-c.md:100`（不可执行不得按最低档计入）。**推广到三轴这一步为本项目自定。**

### 6.3 红灯：8 → 4（源：`s3-redlines.md`）

| 新 id | 轴 | 构成 |
|---|---|---|
| `C-1` | `C` | 旧 `V1` 改造（加「**经本跑次核查**」前提）+ 旧 `V4` 并入 |
| `W-1` | `W` | 旧 `V2` 补形态③「整篇为**另一个问题**给出完整论证」＝ `Global relevance` |
| `W-2` | `W` | 旧 `V6` + 旧 `V8` 的「零支撑 / 承重前提未辩护」 |
| `V-1` | `V` | 旧 `V7` + 旧 `V4` 形态B |

**删除**：`V3`（③→`V-1`；①②**降为描述性状态** —— 两个阈值是【工程约定】无校准，用计数判红＝度量腐败）、`V5`（→`input_status`：抓取失败是**系统状态**，不是「文章差」）、`V8` 的另一半（「无材料可核」→ `C` 轴状态位 `无法核`）。
**红灯语义改写**：命中某轴红灯 ⇒ **该轴记 🔴，其余两轴照常判定，三灯并排不合成**。旧制式 `D` 档「不评四维」会让用户看不到另两轴，与用户判词（站得住🔴 / 信得过🟡 / 值得读🟡 **且他认为值得读**）冲突。
**唯一真源不变**（硬规则 8）：`rubric/vetoes.md` **按轴分三段**，触发条件只在该文件写全；其余文件只许写 id。
**已实测的漏放风险**：旧制式下 `V6` 要求 `impact=致命`，而第一篇的 `L4` 全是「重要」⇒ 旧制式给 `B`，新制式给 `W🔴` —— 这正是用户判词指出而旧协议看不见的那一条。

### 6.4 目的路由（源：`s2-routing.md`）

- **`P1` / `P2` 编号以 §2.5 表为准**（`P1` 明辨真伪 / `P2` 获取信息）；Stage 2 任务书里写的「`P2` 劝服」**是笔误**，已作废。
- **`P0` 是兜底值，不是「未声明时的默认取值」**（理由见 §2.5 顶部的更正条）。
- **判定步骤**：Step 1 找承重结论（「存在 `S`：删除 `S` 后全文其余部分不再指向同一结论」）→ Step 2 三分判（靠理由支持→`P1`／靠信息齐备或步骤可复现→`P2`／就是作者经验本身→`P3`）→ Step 3 兜底 `P0`。多目的并存**只取一个** `purpose`，另记 `purpose_secondary[]`（**仅描述**）。
- **判据族**：`P1` ＝ 论证质量族（**有出处**）｜`P2` ＝ 信息完整性与来源层级（**条目无来源，自定**）｜`P0` ＝ 可核事实层 + 可获得性（**自定**）｜**`P3` 不给判据族，只给一段逐字提示串**（`A1`）。
- **代价账**：推断引入新的不可复现源（可能走错判据族）⇒ 验收项：`purpose` 一致率**单独统计**，不一致样本标 `purpose_unstable`，**不得静默取其一**。同类实证：Prague DTB 捷克语新闻体裁标注 total 61% / κ=0.52、最差一对 33% / κ=0.26（`10.63317/2vhdvip6apdg`）；**κ 是体裁标注值，借到 `purpose` 是类比不是实测**。
- **旧机制删除**：`references/01-genre-routing.md:82-99` 的标签→轨表与 `L0-R1`/`R2`/`R4`/`R6`/`R9`/`R10`/`R11` **全部删**；`L0-R5` 三条硬覆盖**降级为描述性字段**；`L0-R7` 沿用、`L0-R8` 保留并改。**体裁标签的路由权被取消。**
- **描述性字段**：`text_type[]`（PISA 六值）/ `medium` / `environment` / `text_format[]` / `communicative_scene` / `domain` —— **全部不影响任何轴**（`A2`），**只有 `purpose` 参与判据族选择**。

### 6.5 交付形态（源：`s4-delivery.md`）

- 筛选卡头：单值灯 + 单值档位 → **三轴并排**，每轴「灯 + 状态位」；`templates/screening-card.md:77` 的「为什么不用读」句式**删**。
- 第 2 章 →「**三轴判定**」；第 10 章「否决项与档位」→「**红灯触发项与三轴判定**」；第 13 章逐字新增「**跨判定者一致性未测**」（`A4`）。
- **附录 A 只改 `L6` 段**（单值 → 三轴字段），`L0`–`L5` 照旧；**13 章编号与顺序不变**。
- **零总体等级**：卡面与报告任何位置**不得**出现总分、总体档位、总体建议。
- **非法合成点位已逐处实测列出**：`references/00-protocol.md:140/:142/:150/:154`；`references/09-report-spec.md:25/:46/:48/:64/:119/:120/:141/:150`；`templates/screening-card.md:6/:13/:19-21/:42-44/:63-65/:77/:83-85/:105`；`templates/report-single.md:12/:19/:39/:138/:212`；`templates/report-c-track.md:13/:20/:44/:104/:194/:210`。

### 6.6 两条已知做不到的（不得隐瞒）

1. **`V` 轴不可跨判定者复现**：参照集合「已知公开讨论」无来源且依赖判定者知识 ⇒ `V` 的 🟢/🟡 边界**不可跨判定者比较**。这是设计取舍（不占用检索通道），代价由状态位**暴露**而非伪装。
2. **「两执行者同档」只有 `W` 轴大致成立，且是设计意图、不是实测结论** —— 本文件**未跑任何实测**。`A4` 下 v1 只声称**重测**稳定性；**跨判定者一致性未测**，必须写进报告边界章。
