# 文章思维质量评估：方法论全景调研

> 项目：`critical-reader`（给 AI Agent 用的文章筛选协议包）
> 调研日期：2026-10-13（Asia/Shanghai）
> 检索工具：本机 `anysearch` 技能（`C:\Users\hades\.dsh\skills\anysearch\scripts\anysearch_cli.js`，web 搜索 / 垂直搜索 / 批量并行搜索 / URL 提取）
> 检索限制：本会话的 `web_search` / `read_page` 桥接整体返回 429（firecrawl keyless 限额），全程不可用；下述结论均来自 anysearch 实检结果。
> 证据等级约定：`[P]`=同行评议论文/官方标准文档；`[O]`=机构官网/官方文档；`[S]`=二手教学页/媒体/百科；无 URL 支撑的一律标【待核实】。
> 边界：本文只做**方法论本体**。体裁分类与三档处置见同目录 [`genre-taxonomy.md`](./genre-taxonomy.md)；评级制式（门禁 + 质量分 + 锚例校准）见同目录 [`rating-design.md`](./rating-design.md)。两份已有调研的结论本文不复述、不重写。

---

## 0. 结论先行

1. **不存在成熟的"一篇文章值不值得读"单一框架。** 检索到的所有成熟方法论都测三样东西之一：**人的思维**（Ennis / Paul–Elder / Halpern / Watson–Glaser）、**研究的证据强度**（CASP / JAMA / GRADE / AMSTAR 2 / RoB 2）、**单一论证的形式质量**（Toulmin / Walton / 论证挖掘标注）。没有一个是针对"流行文章该不该花时间读"设计的。→ 必须**组合拼装**，见 §5。
2. **唯一被实证支持优于"内部特征清单"的策略是横向阅读。** Wineburg & McGrew 的对照实验：专业事实核查者的**外部**核查（离开页面、查来源）比重在页面内的学生/教授表现更好，且更快；[P] https://journals.sagepub.com/doi/abs/10.1177/016146811912101102 、全文 https://stacks.stanford.edu/file/druid:yk133ht8603/Wineburg%20McGrew_Lateral%20Reading%20and%20the%20Nature%20of%20Expertise.pdf 。由此推出一条硬约束：**任何只读文章本身的检查表都不足**，必须包含"来源外部核查"这一步（CRAAP 的失效点亦在此，见 §3.5）。
3. **情报界的 ACH（竞争性假设分析）不推荐用于本系统。** 已有的随机对照实验与结构化分析技术（SATs）再评估均未发现其对准确率的提升：Dhami 等在 *Applied Cognitive Psychology* 的现场实验（50 名情报分析员随机分配使用/不使用 ACH）[P] https://onlinelibrary.wiley.com/doi/full/10.1002/acp.3550 ；UK 分析员的确认偏差再分析（2024）[P] https://pmc.ncbi.nlm.nih.gov/articles/PMC11169332/ ；RAND 对 SATs 价值的评估报告 [O] https://www.rand.org/pubs/research_reports/RR1408.html ；Chang & Berdini 对 SATs 的"重构"批评 [P] https://www.tandfonline.com/doi/abs/10.1080/02684527.2017.1400230 。ACH 成本高、收益无证据。
4. **LLM 自动判谬误目前不可靠，不能作为终判。** "LLMs suffer from critical reasoning gaps … poor accuracy in classifying logical fallacies" [P] https://arxiv.org/html/2510.09970v1 ；混合智能方案与 fallacy detection 评测 [P] https://aclanthology.org/2025.hcinlp-1.16.pdf ；中文侧亦报告"大模型在判断逻辑谬误时易误报正常语句，确认谬误后分类能力较强" [S] https://hub.baai.ac.cn/view/50912 。→ 谬误检测只能当**提示词生成器**（flag + 证据），不能当判定器。
5. **最贴合"值不值得读"的现成框架是 Mortimer Adler 的检视阅读（inspectional reading）**，其四问结构可直接作为报告骨架；但它是**教学方法**，无阈值、无评分、无可靠性数据。它必须与证据强度分层（GRADE/证据金字塔简化版）和门禁否决项拼接。URL [S] https://fs.blog/how-to-read-a-book/ 、https://bagerbach.com/books/how-to-read-a-book/ 。
6. **中文语料侧有可观的可复用资产**（议论文 15 种论辩关系标注规范、Logic 谬误数据集、中文批判性思维量表），但**没有**针对"中文公众号文章"的论证质量标注语料；图文混排对可信度判断的影响**未找到实证**（§8）。

---

## 1. 调研方法、证据等级与已知限制

### 1.1 检索方式

- 用 `anysearch_cli.js batch_search`（每批 ≤5 个 query，`--max_results 3~5`）覆盖约 50 个主题；对关键页用 `extract` 或二次检索补 URL。
- 垂直库：`academic.search` / `academic.preprint` / `academic.biomedical` / `academic.citation` / `academic.dataset`，社媒库 `social_media`（公众号/微博/知乎）。
- 所有 URL 均来自检索返回结果；**没有任何 URL 是本模型凭记忆写入的**。

### 1.2 检索失败与降级（必须记录，影响结论强度）

- `web_search` / `read_page` 全程 429 不可用 → 无法做"搜索摘要"式二次交叉验证，只能依赖检索片段与官方页面标题。
- 三处 `extract` 失败：Taylor & Francis 页面、Wiley 页面、IARPA 项目页均返回 `API Error: Unable to extract content from the URL` → 这些框架的**细节**（如 ACH 的步骤数、CREATE 的评估结果）未能逐字复核，已在正文标注。
- 因此：本文引用的是**检索结果片段 + 页面标题 + 机构权威性**三者构成的三级证据；凡我无法确证的细节，一律标【待核实】而非补全。

### 1.3 一个必须先讲清的分类错误（否则整份报告会走偏）

要区分三种不同的判定对象，现有框架各自只覆盖一种：

| 判定对象 | 代表框架 | 是否能直接回答"文章值不值得读" |
|---|---|---|
| **人**（读者/分析员的思维能力） | Ennis、Paul–Elder、Halpern HCTA、Watson–Glaser、CCTDI | 否（测人，不是测文） |
| **研究/证据**（论文、系统综述的方法学质量） | CASP、JAMA Users' Guides、GRADE、AMSTAR 2、RoB 2 | 部分（只处理证据强度，不处理论证结构） |
| **文本/论证**（这一段推理是否成立） | Toulmin、Walton 方案 + critical questions、谬误分类、论证挖掘标注、Argument Mapping | 是（局部可用，但不处理"来源可信度"） |
| **来源/信息**（这条信息可不可信） | 横向阅读、SIFT、CRAAP/RADAR、Admiralty Code、IMVAIN、källkritik | 部分（只处理来源，不处理论证） |

本文的推荐组合＝上表后两行的并集，加一行"体裁适配"（引用 `genre-taxonomy.md`）。

---

## 2. 框架全景地图

- **A. 逻辑与哲学**：Toulmin 模型｜Walton 论证方案 + critical questions｜非形式逻辑谬误分类体系｜Grice 合作原则/会话含义｜Principle of Charity / Steelmanning｜Stasis Theory
- **B. 批判性思维教学与测评**：Ennis 的 CT 定义｜Paul–Elder（8 要素 / 9 标准 / 智识特质）｜Socratic Questioning（六类问题）｜Delphi Report（Facione 1990）｜Bloom / Anderson 修订分类｜Halpern HCTA｜Watson–Glaser｜Stanovich（认知能力不预测 myside bias）
- **C. 情报分析**：Heuer《Psychology of Intelligence Analysis》｜ACH 竞争性假设分析｜结构化分析技术（SATs）与批判｜IARPA CREATE
- **D. 法律与医学专业实践**：IRAC / CRAC｜CASP 清单｜JAMA Users' Guides｜GRADE｜AMSTAR 2｜RoB 2｜证据金字塔与证据等级｜系统综述筛选与评分者一致性（κ）｜Rapid Review｜Greenhalgh《How to Read a Paper》
- **E. 新闻核实与信息素养**：横向阅读（实证）｜SIFT｜CRAAP｜RADAR｜Verification Handbook｜Admiralty Code（NATO 6×6）｜IMVAIN｜SMELL｜källkritik（源流批判）｜ACRL 信息素养框架｜CML 五问｜FLICC｜CONSPIR｜IPA 七种宣传手法｜Aristotle 三诉求｜Fogg 显著性-解释理论｜Epistemic Vigilance｜Prebunking/Inoculation
- **F. 论证映射与论证挖掘**：Argument Mapping 教学法（van Gelder / Davies）｜Argument Mining 综述｜Wachsmuth 论证质量维度体系｜Erduran–Osborne Toulmin 分级工具｜AP English Language 议论文 rubric｜LLM 谬误检测与 LLM-as-judge
- **G. 快速判定/阅读筛选（本任务最相关）**：Adler 检视阅读｜SQ3R｜学术论文阅读法（先读摘要与结论再决定读全文）｜阅读 triage（无成熟框架，只有低权威实践文）
- **H. 可读性/连贯性自动化**：Coh-Metrix｜可读性公式及其批评

---

## 3. 框架卡片

### 3.1 逻辑与哲学

#### 3.1.1 Toulmin 模型
- **核心构件**：claim（主张）/ grounds·data（根据）/ warrant（保证）为必要三件；qualifier（限定词）/ rebuttal（反驳条件）/ backing（支援）为附加三件。Toulmin 的本意是**场域依赖**的论证评价（法律、科学、伦理的标准不同）。[O] https://owl.purdue.edu/owl/general_writing/academic_writing/historical_perspectives_on_argumentation/toulmin_argument.html ；教材版说明"前三者必需、后三者附加" https://pressbooks.calstate.edu/writingargumentsinstem/chapter/toulmin-argument-model/ ；学界对模型的批评与再结构化 [P] https://hal.science/hal-03746876v2/file/TWG01_07_Cramer.pdf
- **判定方式**：结构化分解，非计分。可派生**计数**式判据：六要素中缺哪些。
- **可执行判据/阈值**：无原生阈值。可操作化为"claim 是否唯一可辨 / warrant 是否显式 / qualifier 是否存在（全称断言无 qualifier 即为红旗）"。
- **局限**：① warrant 常常是隐含的，作者不写就靠读者补（这正是中文指南里"假定"要处理的部分）；② 模型不判真假，只判结构完整；③ 字段边界在实践中难稳定划分，影响评分者一致性（未见针对 Toulmin 六要素的 κ 报告）【待核实】。
- **适配本系统**：**高**。作为报告骨架（"主张—根据—保证—限定—反驳"逐项填空）成本极低、可解释性强。

#### 3.1.2 Walton 论证方案 + Critical Questions
- **核心构件**：把日常推理归纳为若干**论证方案**（schemes，如诉诸专家意见、诉诸后果、类比论证、滑坡论证等），每个方案配一组 **critical questions**；只要有一问无法回答得体，该论证即"可败"（defeasible）。[S] https://www.reasoninglab.com/patterns-of-argument/argumentation-schemes/waltons-argumentation-schemes/ ；critical questions 的性质与地位 [P] https://www.researchgate.net/publication/228653011_The_nature_and_status_of_critical_questions_in_argumentation_schemes
- **判定方式**：**二元/分档混合**——逐问回答"是/否/无法判断"，整体判"未被击破 / 可败 / 已被击破"。
- **可执行判据/阈值**：**有，且最接近"可执行"**：每个方案的 CQ 列表本身就是判据清单。局限是列表长（Walton 的方案数量与 CQ 完整清单本次未能逐字复核，标【待核实】）。
- **局限**：① 方案的**识别**是瓶颈——先要判断作者用的是哪个方案，误判则 CQ 全错；② 对论证方案的评价标准存在学术争议 [P] https://informallogic.ca/index.php/informal_logic/article/view/7224/5378 （对 Walton 方案的认识论评估，2022）；③ 无评分与权重。
- **适配本系统**：**高**。建议只保留 8–12 个高频方案（诉诸权威、诉诸因果、类比、以偏概全、滑坡、诉诸动机、诉诸人数、诉诸后果），每个 3–5 个 CQ。

#### 3.1.3 非形式逻辑谬误分类体系
- **核心构件**：按"相关性 / 歧义 / 预设 / 归纳不充分"等分组，每组有共同的失效结构（而不是一张扁平名单）。[S] https://press.rebus.community/intro-to-phil-logic/chapter/chapter-4-informal-fallacies/ ；形式谬误 vs 非形式谬误 [S] https://philosophy.lander.edu/logic/nature_fall.html ；"相关谬误"分类本身的理论困难 [P] https://informallogic.ca/index.php/informal_logic/article/view/2133 ；中文对照名单 [S] https://zh.wikipedia.org/zh-hans/谬误列表
- **判定方式**：**计数**（检出条数）——但这是它最危险的地方。
- **可执行判据/阈值**：无阈值；名单本身是"词典"不是"判据"。同一段文字归属哪条谬误的边界很糊（稻草人 vs 诉诸极端、滑坡 vs 因果链举证不足）。
- **局限（有实证）**：LLM 在谬误分类上准确率差、且**倾向把正常语句误报为谬误** [P] https://arxiv.org/html/2510.09970v1 、https://ink.library.smu.edu.sg/cgi/viewcontent.cgi?article=12100&context=sis_research ；中文报告同样指出误报问题 [S] https://hub.baai.ac.cn/view/50912 。
- **适配本系统**：**低—中**。只作为"提示词"，且必须强制**引用原句 + 说明触发结构**；禁止以"检出 N 条谬误"直接扣分。

#### 3.1.4 Grice 合作原则与会话含义
- **核心构件**：数量、质量、关系、方式四条准则；**故意违反**准则产生会话含义（implicature）；预设（presupposition）是"被当真的背景"。 [S] https://en.wikipedia.org/wiki/Cooperative_principle ；[S] https://www.cs.utexas.edu/~dnp/frege/the-cooperative-principle-and-conversational-implicature.html ；[S] https://1000wordphilosophy.com/2022/07/05/gricean-conversational-implicature/
- **判定方式**：**定性解释**（无计数、无分档）。
- **可执行判据/阈值**：无。它给出的是**解释工具**：为什么"不言自明""众所周知""显然"能骗过读者（把本应举证的内容塞进预设）。
- **局限**：① 需要读者有母语级语用直觉，无法机械化；② 对"读者不知道作者在违反哪条准则"的文章无能为力；③ 与意识形态/立场装载的文本只能给出解释，不能给判定。
- **适配本系统**：**中**。真正可用的是它的**落后代品**："预设触发词清单"（见 §6.1），把语用学变成可扫描的字符串规则。

#### 3.1.5 Principle of Charity / Steelmanning
- **核心构件**：在评价前，先构造对方论证的**最强版本**（"钢人"），而非最弱版本（"稻草人"）。与 Davidson/Quine 的 charity 原则同源但用途不同：charity 是**解释**原则（为理解而假定理性），steelman 是**评价**规范（为反驳而先强化）。[S] https://opentextbooks.rug.nl/philosophymigration/chapter/principle-of-charity/ （Davidson 把 logicality/rationality 与信念归给他人）；[P] https://ijoc.org/index.php/ijoc/article/viewFile/817/574 （charity 与跨文化沟通）；steelman 的通俗说明 [S] https://umbrex.com/resources/tools-for-thinking/what-is-steelmanning/
- **判定方式**：**流程约束**（先钢人化，再评价），不是评分项。
- **可执行判据/阈值**：无。可操作化为一条硬规则：**必须先写"作者最强版本"再写缺陷**。
- **局限**：**没有找到同行评议的 steelmanning 实证研究**（只找到通俗说明与论坛讨论）→ 其效力【待核实】。风险：钢人化可能替作者补出他没写的 warrant，从而**高估**文章。
- **适配本系统**：**中（作为反不公平流程，不作为评分项）**。

#### 3.1.6 Stasis Theory（争点理论）
- **核心构件**：四个递进的争点问题——事实（有没有发生）/ 定义（这算什么）/ 性质（严重吗、对不对）/ 行动（该怎么办）。用于定位**争议究竟在哪一层**。[O] https://owl.purdue.edu/owl/general_writing/the_writing_process/stasis_theory/index.html ；教学模块 [S] https://textrhet.com/2018/02/07/stasis-theory-a-mini-module/
- **判定方式**：分档（四个层级）。
- **可执行判据/阈值**：无阈值，但有**明确定位判据**：若作者在讨论"行动"层却未确立"事实"层，即为**层级跃迁**（对应中文指南里的"论题与结论错位"）。
- **局限**：古典修辞学遗产，缺少实证；对"数据型文章"（纯事实陈述的说明文）不适用。
- **适配本系统**：**中—高**。成本极低，且能捕捉一类高频缺陷：**用价值论战替换事实争议**。

### 3.2 批判性思维教学与测评

#### 3.2.1 Ennis 的批判性思维定义与"流线化概念"
- **核心构件**：CT = "reasonable, reflective thinking focused on deciding what to believe or do"（为决定信什么、做什么而进行的合理反思性思考）；拆为**能力**（澄清、判断信源可信度、演绎、归纳、价值判断…）与**倾向**（dispositions）。[P] https://education.illinois.edu/docs/default-source/faculty-documents/robert-ennis/ennisstreamlinedconception_002.pdf
- **判定方式**：概念框架；派生能力清单（可计数）。
- **可执行判据/阈值**：无阈值。其价值在于"**判断信源可信度**"被列为**独立能力项**——这一点比 Paul–Elder 更贴近本系统的需求。
- **局限**：术语体系庞大、层层嵌套，教师与研究者都难稳定操作化；未提供文本级评据。
- **适配本系统**：**中（作为能力项分类的词汇表）**。

#### 3.2.2 Paul–Elder 框架（8 要素 / 9 智识标准 / 智识特质）
- **核心构件**：**思维 8 要素**（目的、问题、信息、推断、概念、假定、启示、视角）+ **9 条智识标准**（清晰、准确、精确、相关、深度、广度、逻辑、重要性、公正）+ **智识特质**（谦逊、勇气、同理、自治、诚实、坚持、信心、公正）。[O] https://www.criticalthinking.org/pages/the-elements-of-reasoning-and-the-intellectual-standards/480 ；第三方整理（8 要素/9 标准）[S] https://www.structural-learning.com/post/paul-elder-critical-thinking-framework ；教师用清单 PDF（含特质表）[S] https://www.americanforensicsassoc.org/wp-content/uploads/2022/02/Paul-Elder-Crit-Thinking-Stuff.pdf
- **判定方式**：**分档**（rubric：某标准"强/中/弱"），但官方 rubric 是教学导向、无公开常模。
- **可执行判据/阈值**：**没有**。9 条标准的措辞是形容词（清晰、准确、深度），没有判定规则、没有边界例、没有量尺定义。
- **局限**：① 未找到同行评议的效度/信度研究（检索"Paul-Elder criticism"未返回学术批评文献）→【待核实】；② 与"文章筛选"的需求错位：它要求评价者逐条打分，成本高且不可复现。
- **适配本系统**：**中（只取"假定"与"视角"两要素，其余当术语表）**。注意：中文手写指南的"论题/结论/论证/概念/假定"五要素与 Paul–Elder 8 要素高度同构（见 §7）。

#### 3.2.3 Socratic Questioning 六类问题
- **核心构件**：六类问句——澄清、探查假定、探查理由与证据、考察视角与观点、考察推论与后果、关于问题本身的问题。[O] https://www.criticalthinking.org/store/get_file.php?inventories_id=231&inventories_files_id=422 （Paul & Elder 官方指南）；六类问题清单 PDF [S] https://www.unige.ch/innovations-pedagogiques/download_file/view/1577/1044 ；[P] https://www.researchgate.net/publication/234756453_Critical_Thinking_The_Art_of_Socratic_Questioning_Part_III
- **判定方式**：**提问清单**（无判定、无分档）。
- **可执行判据/阈值**：无。它是**问题生成器**——这一点对本系统有实际用途：报告的"追问"字段可以直接用这六类。
- **局限**：依赖追问者的领域知识；对静态文章无法追问（作者不在场），只能"代作者回答"，容易变成替作者补论。
- **适配本系统**：**中（作为报告模板的提问骨架）**。

#### 3.2.4 Delphi Report（Facione 1990）与 CT 核心技能
- **核心构件**：46 位专家两轮德尔菲共识，CT 定义 + **6 项核心技能**（interpretation、analysis、evaluation、inference、explanation、self-regulation）+ 倾向列表。[O] https://insightassessment.com/iaresource/the-delphi-report-a-statement-of-expert-consensus-on-the-definition-of-critical-thinking/ ；报告全文 PDF [S] https://www.damiantgordon.com/EducationalModels/CriticalThinking/Facione/CriticalThinking-Facione-DelphiReport.pdf ；技能表 [P] https://www.researchgate.net/figure/The-Core-Critical-Thinking-Skills-According-to-the-Delphi-Report_tbl1_259286333
- **判定方式**：**分档**（技能画像），但原始报告是"定义与评估框架"，非评分工具。
- **可执行判据/阈值**：无阈值；6 项技能构成**覆盖度检查表**（本系统可借用"解释"与"自我调节"两项：作者是否交代了自己的限定与不确定性）。
- **局限**：德尔菲共识≠效度证据；其后的标准化测试（WGCTA 等）与 Delphi 定义只是"大致对应"。
- **适配本系统**：**中**。

#### 3.2.5 Bloom / Anderson 修订分类（高阶思维）
- **核心构件**：记忆—理解—应用—分析—评价—创造（修订版把名词改动词、允许层级交叠）。[S] https://peterellerton.substack.com/p/blooms-taxonomy-is-wrongjust-ask
- **判定方式**：分档（六级）。
- **可执行判据/阈值**：无；官方声称"松弛的层级"，实质是**动词清单**。
- **局限（有实证）**：CBE—Life Sciences Education 的实证分析指出原始 Bloom 分类的**累积层级结构存在心理测量学不一致**，修订版亦承认非相邻层级交叠。[P] https://www.lifescied.org/doi/10.1187/cbe.20-08-0170 ；批评文 [S] https://joanakompa.com/2017/02/07/why-it-is-time-to-retire-blooms-taxonomy/
- **适配本系统**：**低**。可作为"文章要求的认知层级"描述词（读者需要动用到哪一级），不可作为质量分。

#### 3.2.6 Halpern Critical Thinking Assessment（HCTA）
- **核心构件**：25 个**日常情境**；每个情境先用开放式作答、再用选择题作答（双反应格式，规避"识别 vs 生成"混淆）。[P] https://www.sciencedirect.com/science/article/abs/pii/S1871187112000247 ；[P] https://onlinelibrary.wiley.com/doi/10.1002/acp.2851 （对现实生活结果的预测效度）；量表 PDF [P] https://ris.utwente.nl/ws/files/6442251/halpern.pdf
- **判定方式**：计数 + 分档（分数→等级）。
- **可执行判据/阈值**：有评分规则，但为**商业量表**，题目与计分手册不公开。
- **局限（有实证批评）**：Possin 2013 指出 HCTA 存在**可负担性、可获取性与效度**方面的严重缺陷。[P] https://www.pdcnet.org/inquiryct/content/inquiryct_2013_0028_0003_0004_0012 ；另见批评汇总 [S] https://www.researchgate.net/publication/269738509_Some_Problems_with_the_Halpern_Critical_Thinking_Assessment_HCTA_Test
- **适配本系统**：**低**。它测**人**，且不可复现（题目保密）。但"双反应格式"提供了设计启示：**先让 agent 自由写结论，再让它从选项里选，两个结果不一致即为不确定点**。

#### 3.2.7 Watson–Glaser（WGCTA）
- **核心构件**：五类题——推断、识别假定、演绎、解释、论证评价；商业认知能力测试。[O] https://www.pearson.com/efficacy/product-evidence/watson-glaser.html ；效度研究 [P] https://www.jstor.org/stable/pdf/29735117.pdf ；心理测量学属性 [P] https://pubmed.ncbi.nlm.nih.gov/12931944/
- **判定方式**：计数（原始分 → 百分位）。
- **可执行判据/阈值**：有常模与切分，但**测的是人**。
- **局限**：与言语推理/阅读能力高度相关，"是否真测 CT 而非 IQ"长期争议 [S] https://www.jobtestprep.co.uk/blog/what-does-the-watson-glaser-test-measure （低权威，需谨慎）；用于招聘场景的公平性争议 [S] https://www.riotiq.com/articles/specific-iq-tests-and-formats/what-is-the-watson-glaser-test 。
- **适配本系统**：**低**（但它的五分类可作为"读者需要做的动作"清单）。

#### 3.2.8 Stanovich：认知能力与理性脱钩
- **核心构件**：myside bias / one-sided thinking 与智力测验分数**基本无关**；认知能力高者同样会做单向论证。[P] http://www.keithstanovich.com/Site/Research_on_Reasoning_files/SWTandR08.pdf ；[P] https://psycnet.apa.org/record/2008-16034-014
- **判定方式**：实证结论，不是框架。
- **对本系统的意义**：**"作者聪明"不能推出"文章公正"**；反之"作者陈述笨拙"也不能推出"结论错"。这条直接否定了以"作者专业程度"替代论证检查的做法。

### 3.3 情报分析：结构化分析技术（SATs）

#### 3.3.1 Heuer《Psychology of Intelligence Analysis》
- **核心构件**：认知局限（选择性注意、记忆偏差、证据先入为主）；"思维工具"章节给出检查清单。[O] https://www.cia.gov/resources/csi/books-monographs/psychology-of-intelligence-analysis-2/ ；PDF [S] https://www.ialeia.org/docs/Psychology_of_Intelligence_Analysis.pdf ；[S] https://en.wikipedia.org/wiki/Richards_Heuer
- **判定方式**：**定性**（分析流程规范 + 自查清单）。
- **可执行判据/阈值**：无量化阈值；其"关键假定检查（Key Assumptions Check）"可操作化为"列出全部未言明假定 + 逐条质证"，与中文指南的"假定"一节同源。
- **局限**：成书于 1999（内部版更早），无对照实验支撑；核心主张后来被部分实证质疑（见 3.3.3）。
- **适配本系统**：**中—高**（关键假定检查 + "证据诊断性"排序可直接借用）。

#### 3.3.2 ACH（竞争性假设分析）
- **核心构件**：列出全部假设 → 列证据 → 建矩阵 → 逐格评"一致/不一致" → **用最少的证据差淘汰假设**（拒绝"先证后立"，先证伪）。[S] https://www.futuribles.com/wp-content/uploads/related-documents/analysis-of-competing-hypotheses.pdf ；二手评述 [P] https://www.researchgate.net/publication/331942237_The_analysis_of_competing_hypotheses_in_intelligence_analysis
- **判定方式**：矩阵/计数（不一致证据计数最小化）。
- **可执行判据/阈值**：有流程但无阈值；步骤数（常被引作"8 步"）本次未逐字复核 →【待核实】。
- **局限（有实证）**：
  - Dhami 等 2019 现场实验：50 名分析员随机分配使用/不使用 ACH，未见准确率优势。[P] https://onlinelibrary.wiley.com/doi/full/10.1002/acp.3550
  - 2024 年重新分析：UK 分析员的**确认偏差证据很少**（即 ACH 要治的病本来就轻）。[P] https://pmc.ncbi.nlm.nih.gov/articles/PMC11169332/
  - RAND：SATs 的价值评估报告（未证实其提升效果）。[O] https://www.rand.org/pubs/research_reports/RR1408.html
  - Chang & Berdini 2018：SATs 需要"重构"而非继续推广。[P] https://www.tandfonline.com/doi/abs/10.1080/02684527.2017.1400230
  - 也有再评估持较温和立场 [P] https://www.tandfonline.com/doi/abs/10.1080/08850607.2023.2243803
- **适配本系统**：**低（用于"作者是否为对手假设留位"的小检查项，不整套引入）**。

#### 3.3.3 IARPA CREATE 项目
- **核心构件**：Crowdsourcing Evidence, Argumentation, Thinking and Evaluation——用众包 + SATs 改进分析推理。[O] https://www.iarpa.gov/research-programs/create ；项目背景报道 [S] https://www.nextgov.com/acquisition/2015/06/iarpa-looks-to-the-crowd/244353/
- **判定方式**：研究项目，不是可用框架。
- **局限**：**公开可查的成效数据未找到**（项目页 extract 失败）；本系统不引入。

### 3.4 法律与医学专业实践

#### 3.4.1 IRAC / CRAC（法律推理）
- **核心构件**：Issue（争点）— Rule（规则）— Application（涵摄）— Conclusion（结论）；变体 CRAC 把结论前置。[O] https://www.law.columbia.edu/sites/default/files/2021-07/organizing_a_legal_discussion.pdf ；[S] https://www.barbri.com/resources/how-to-use-the-irac-method-to-pass-the-bar
- **判定方式**：**结构完整性**（四段是否齐备）+ 涵摄是否成立。
- **可执行判据/阈值**：无阈值，但结构极其稳定，适合做"缺环检测"。
- **局限**：为**写作者**设计，不是评价者工具；只适用于"规则适用型"文本。
- **适配本系统**：**中**（作为"文章是否回答了它自己的问题"的检查）。

#### 3.4.2 CASP 清单
- **核心构件**：按研究设计分册（RCT、定性、队列、诊断、系统综述…）的**10 问左右**清单；"generic tool for appraising the strengths and limitations of any qualitative research methodology … has ten questions"。[O] https://casp-uk.net/casp-tools-checklists/ ；[P] https://journals.sagepub.com/doi/full/10.1177/2632084320947559 ；[O] https://www.ncbi.nlm.nih.gov/books/NBK311069/
- **判定方式**：**三元档**（是 / 否 / 无法判断），逐题回答，不汇总总分。
- **可执行判据/阈值**：**有**——每题都是 yes/no/can't tell，这是所有框架中最容易移植的判定格式。
- **局限**：为研究论文设计；移植到公众号文章需大幅改写（文章通常不报方法细节，导致大量"无法判断"）。
- **适配本系统**：**高（格式层面）**。"是/否/无法判断"三态 + 拒绝总分，是 rubric 设计的直接参照（与 `rating-design.md` 的门禁思路一致）。

#### 3.4.3 JAMA Users' Guides to the Medical Literature
- **核心构件**：按临床问题组织（治疗、诊断、预后、病因…），每篇指南的头号问题是"**Are the results of the study valid?**"，再看结果大小（理解置信区间与效应量）。[O] https://jamanetwork.com/collections/44069/users-guide-to-the-medical-literature ；[O] https://jamaevidence.mhmedical.com/book.aspx?bookId=847 ；[S] https://guides.library.stonybrook.edu/evidence-based-medicine/jama_users_guides ；[O] https://www.bmj.com/about-bmj/resources-readers/publications/how-read-paper （Greenhalgh《How to Read a Paper》，同源思路）
- **判定方式**：**两段式**：有效性门禁 → 结果解释（效应量/置信区间/临床意义）。
- **可执行判据/阈值**：有效性判据清单化（设计是否合适、随机化/盲法、失访、统计是否恰当）；阈值体现为"置信区间是否跨越无效线"。
- **局限**：面向临床研究者；对非实证类文章（观点、评论）不适用。
- **适配本系统**：**中—高**（"门禁 + 结果解释"两段式正是本项目的 M1 结构，见 `rating-design.md`）。

#### 3.4.4 GRADE
- **核心构件**：**证据确定性四档**（very low / low / moderate / high）；随机试验起始高、观察性研究起始低；五个**降级域**（偏倚风险、不一致性、间接性、不精确性、发表偏倚）+ 升级因素（大效应量、剂量-反应、混杂反向）。[O] https://book.gradepro.org/guideline/overview-of-the-grade-approach ；[O] https://www.cdc.gov/acip-grade-handbook/hcp/chapter-7-grade-criteria-determining-certainty-of-evidence/index.html ；[O] https://www.gradeworkinggroup.org/
- **判定方式**：**分档（4 级）+ 计数（降级域个数）**。
- **可执行判据/阈值**：**有**——降级域各可降 1–2 级，规则公开。
- **局限**：面向"一组研究"的确定性，不是单篇文章；理解成本高（WHO/CDC 手册数百页）。
- **适配本系统**：**高（通俗化后使用）**。建议降级为一张"证据打折卡"：样本量小 / 单一来源 / 观测性设计 / 无对照 / 利益相关方出资，各打一折。

#### 3.4.5 AMSTAR 2 与 RoB 2
- **AMSTAR 2**：系统综述质量评价工具；官方明确 "**AMSTAR 2 is not intended to generate an overall score**"。[O] https://amstar.ca/Amstar-2.php ；[P] https://www.bmj.com/content/358/bmj.j4008 （条目数本次未逐字复核 →【待核实】）
- **RoB 2**：Cochrane 的随机试验偏倚风险工具，按域评分（低/有一些担忧/高）。[O] https://methods.cochrane.org/bias/resources/rob-2-revised-cochrane-risk-bias-tool-randomized-trials ；使用要点 [P] https://pmc.ncbi.nlm.nih.gov/articles/PMC11795937/
- **判定方式**：**分档（域级）**，不汇总总分（AMSTAR 2 明确反对）。
- **对本系统的意义**：**"域级分档、拒绝总分"是成熟工具的一致选择**——但 `rating-design.md` 已采用"门禁 + 质量分"，两者需在报告里显式说明何者用于筛选、何者用于解释，避免出现"总分聚合掩盖致命缺陷"。

#### 3.4.6 证据金字塔与证据等级
- **核心构件**：从案例报告 → 队列 → RCT → 系统综述/Meta 分析的分层排序。[P] https://pmc.ncbi.nlm.nih.gov/articles/PMC12064251/ ；[S] https://canberra.libguides.com/c.php?g=599346&p=4149721 ；面向外行的通俗化版本 [P] https://www.sciencedirect.com/science/article/pii/S2949866X23001168
- **判定方式**：**分档（排序）**。
- **可执行判据/阈值**：有排序但**无绝对判据**：观察性研究在特定情境可优于 RCT（如罕见副作用）。
- **局限**：对非医学领域（社科、评论）常被滥用为"只有 RCT 才算证据"；本系统须限定其适用范围。

#### 3.4.7 系统综述的筛选与评分者一致性（κ）
- **核心构件**：先定**纳入/排除标准**，再**双人独立筛选**，分歧由第三人仲裁；报告 Cohen's κ（一致性系数）。[P] https://pmc.ncbi.nlm.nih.gov/articles/PMC10952858/ ；[P] https://journals.sagepub.com/doi/10.1177/0049124118799372 ；[O] https://guides.lib.vt.edu/SRMA/screen ；快速综述（rapid review）作为降级路径 [O] https://guides.library.cornell.edu/evidence-synthesis/types 、[P] https://pmc.ncbi.nlm.nih.gov/articles/PMC10392303/
- **判定方式**：**二元纳入/排除 + 一致性统计**。
- **可执行判据/阈值**：**有**——κ ≥ 0.6/0.8 为常用门槛（κ 阈值为领域惯例，本次未逐字复核 →【待核实】）。
- **适配本系统**：**高（工程层面最有价值）**。它给出的是**可靠性纪律**：任何判定规则必须可被两个独立执行者复算出同一结果；本项目的"锚例集 + 校准"（见 `rating-design.md`）应据此报告一致性，而不是只报一个分数。

### 3.5 新闻核实与信息素养

#### 3.5.1 横向阅读（Lateral Reading）— 唯一有对照实验的核实策略
- **核心构件**：**Stop — Investigate the source — Find better coverage — Trace claims to the original**（SIFT 四步）。[S] https://hapgood.us/2019/06/19/sift-the-four-moves/ ；[S] https://clark.libguides.com/evaluating-information/SIFT ；与 ACRL 框架的映射 [P] https://crln.acrl.org/index.php/crlnews/article/view/26143/34085
- **判定方式**：**动作序列**（四步），无计分。
- **可执行判据/阈值**：无阈值；步骤可机械执行。
- **局限（重要）**：Wineburg & McGrew 的实验证明**专业核查者不读页面本身**——他们先离开页面查来源，速度快且结论更准；学生与教授的"细致阅读页面"策略表现更差。[P] https://journals.sagepub.com/doi/abs/10.1177/016146811912101102 ；工作论文 [S] https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3048994 ；全文 PDF [P] https://stacks.stanford.edu/file/druid:yk133ht8603/Wineburg%20McGrew_Lateral%20Reading%20and%20the%20Nature%20of%20Expertise.pdf
- **适配本系统**：**最高**。它为"先核查来源再读正文"提供了**实证依据**，也是 CRAAP 类清单失效的对照证据。

#### 3.5.2 CRAAP / RADAR
- **CRAAP**：Currency、Relevance、Authority、Accuracy、Purpose。[S] https://guides.lib.uchicago.edu/c.php?g=1241077&p=9082343 、https://researchguides.ben.edu/source-evaluation
- **RADAR**：Relevance、Authority、Date、Accuracy、Reason。[S] https://libguides.lmu.edu/aboutradar
- **判定方式**：计数式检查表（每维 0–5 分或逐条打勾）。
- **局限（有据）**：CRAAP 的**全部指标都在页面内部**，可被精心制作的页面满足（"a checklist that can be gamed"）；对照实验显示横向阅读在**批判性评估与速度**两方面都显著优于这类清单。[P] https://crln.acrl.org/index.php/crlnews/article/view/24195/32005
- **适配本系统**：**低**（作为问题清单可用，作为判定不可用）。

#### 3.5.3 Verification Handbook（欧洲新闻中心）
- **核心构件**：面向记者与 UGC 核实的操作手册与"验证工作流"；含虚假信息与信息操纵专辑。[O] https://datajournalism.com/read/handbook/verification-2 ；PDF [O] https://verificationhandbook.com/downloads/verification.handbook.pdf ；免费在线版与书目记录 [S] https://mediawell.ssrc.org/news-items/verification-handbook-for-disinformation-and-media-manipulation-datajournalism-com/?pdf=57823
- **判定方式**：**流程/工具清单**（反向图片搜索、时间戳核验、地理定位…）。
- **可执行判据/阈值**：步骤明确，无阈值。
- **局限**：面向新闻事件与影像素材，不面向论证质量。
- **适配本系统**：**中**（"事实性主张的外部可验证动作"清单由此提取）。

#### 3.5.4 Admiralty Code（NATO 6×6）
- **核心构件**：两个独立维度——**信源可靠性 A–F**（完全可靠…无法判断）× **信息可信度 1–6**（已确认…无法判断）。[S] https://en.wikipedia.org/wiki/Admiralty_code ；[S] https://eosgmbh.com/en/admiralty-code-for-the-verification-of-information/ ；[S] https://pangearesearch.substack.com/p/the-admiralty-code-nato-6x6-system
- **判定方式**：**二维分档**（36 格）。
- **可执行判据/阈值**：**有字母数字等级**，域定义短、可培训。
- **局限**：北约内部工具，无公开信度研究【待核实】；A–F 与 1–6 的边界仍需判断。
- **适配本系统**：**高**。它是"来源与会可信度"两轴分离的最省事方案，比 CRAAP 少而清晰，且天然支持"文章由多个主张构成 → 每个主张单独评级"。

#### 3.5.5 IMVAIN（Stony Brook 新闻素养）
- **核心构件**：来源必须 **I**ndependent、**M**ultiple、**V**erifies（而非只是声称）、**A**uthoritative/Informed、**N**amed、**E**vidence-based。[S] https://digitalresource.center/content/introducing-imvain
- **判定方式**：计数（六条命中数）。
- **可执行判据/阈值**：无阈值；每条是判定式问句，可直接机器化（"消息源是否具名""是否可独立核实"）。
- **局限**：教学工具，无实证；"具名"在中文自媒体语境下常被"某业内人士"规避。
- **适配本系统**：**高**（作为"来源质量"子清单，与 Admiralty Code 二选一或嵌套）。

#### 3.5.6 SMELL 与 källkritik（源流批判）
- **SMELL**（John McManus）：Source、Motivation、Evidence、Logic、Left Out。[S] http://mediashift.org/2013/02/dont-be-fooled-use-the-smell-test-to-separate-fact-from-fiction-online038/ ；[S] https://libraryguides.laniertech.edu/reliablesources/smelltest
- **källkritik（北欧源流批判）四标准**：真实性（authenticity）、独立性/依赖性（dependency & tendency）、时间性（time）。[S] https://en.wikipedia.org/wiki/Source_criticism ；[P] https://www.mdpi.com/2076-0787/10/1/13 （研究表明传统四标准"仍被认为有效"）
- **判定方式**：计数/核对表。
- **局限**：无阈值；SMELL 的 "Left Out"（遗漏）需要读者知道该有的东西——这恰恰是本系统要解决的循环问题（用体裁清单破环，见 `genre-taxonomy.md`）。
- **适配本系统**：**中—高**（källkritik 的"依赖性/倾向性"是 CRAAP 没有的，直接对应"作者立场与利益"检查）。

#### 3.5.7 ACRL 信息素养框架、CML 五问
- **ACRL Framework**：六个"阈概念"，核心是 "**Authority Is Constructed and Contextual**"（权威是被建构的、依赖情境）。[O] https://www.ala.org/acrl/standards/ilframework ；落地反思 [P] https://crl.acrl.org/index.php/crl/article/view/17397/19517
- **CML 五问**：谁创造？用了什么技术吸引注意？不同人如何理解？省略了什么价值/视角？为什么要发这条信息？[S] https://ahealthyiowa.org/center-for-media-literacy-five-key-questions/ ；官方 PDF [S] https://mlw.namle.org/wp-content/uploads/2015/07/cml25lessons.pdf
- **判定方式**：定性提问。
- **局限**：无可执行阈值；面向媒介素养教育而非文本判级。
- **适配本系统**：**中**（"省略了什么"与"为什么要发"两个问句值得保留）。

#### 3.5.8 科学与健康素养的欺骗手法清单：FLICC / CONSPIR / IPA
- **FLICC 五手法**：fake experts、logical fallacies、impossible expectations、cherry picking、conspiracy theories。[S] https://crankyuncle.com/a-history-of-flicc-the-5-techniques-of-science-denial/ ；[S] https://thinkingispower.com/give-science-denial-the-flicc/ ；被用于气候谬误检测的研究 [P] https://pmc.ncbi.nlm.nih.gov/articles/PMC11557567/
- **CONSPIR**（Lewandowsky & Cook 合著《The Conspiracy Theory Handbook》中的七条特征）。[P] https://digitalcommons.unl.edu/cgi/viewcontent.cgi?article=1248&context=scholcom （七项英文全称本次未逐字复核 →【待核实】）
- **IPA 七种宣传手法**（1937）：name calling、glittering generalities、transfer、testimonial、plain folks、card stacking、bandwagon。[S] https://www.physics.smu.edu/pseudo/Propaganda/ipatypes.html ；学术溯源 [P] https://www.jstor.org/stable/41939653 、[P] https://universityofleeds.github.io/philtaylorpapers/pmt/exhibits/2568/sproule.pdf
- **判定方式**：**计数（命中的手法）**。
- **可执行判据/阈值**：无阈值，但每个手法都有可举例的定义，是**最容易转成"检测字符串"**的一组清单。
- **局限**：本质是"作者在骗人"的清单，容易过度归因（misattribution）；对真诚但水平差的作者无效——而本项目的目标文章多数属于后者。
- **适配本系统**：**中—高**（作为"修辞操纵"检测层，不与"论证错误"混为一谈）。

#### 3.5.9 说服与信任的理论：Aristotle 三诉求、Fogg P-I、认知警惕
- **Aristotle**：ethos（人格/可信度）、pathos（情感）、logos（论证）。[O] https://owl.purdue.edu/owl/general_writing/academic_writing/rhetorical_situation/aristotles_rhetorical_situation.html ；[S] https://pressbooks.pub/openrhetoric/chapter/aristotles-rhetorical-appeals/ ；[S] https://www.lsu.edu/hss/english/files/university_writing_files/item35402.pdf
- **Fogg 显著性-解释理论**：信任判断 = 显著性（prominence，看到什么）× 解释（interpretation，如何理解）；用于解释"排版/界面/头衔如何影响可信度"。[P] https://credibility.stanford.edu/pdf/p-iTheory_Fogg_Oct02.pdf ；[S] https://www.nngroup.com/articles/prominence-interpretation-theory/ ；[P] https://aisel.aisnet.org/thci/vol8/iss2/1/
- **Epistemic Vigilance**（Sperber et al. 2010）：人类对信息的接收默认带"警惕机制"（来源可信度、与既有信念的一致性、论证的合理性）。[P] https://dan.sperber.fr/wp-content/uploads/EpistemicVigilance.pdf ；[P] https://onlinelibrary.wiley.com/doi/10.1111/j.1468-0017.2010.01394.x
- **判定方式**：解释框架，无判定。
- **对本系统的意义**：① Fogg 理论解释了**图文混排/排版**为什么能显著影响判断，是 §6.4 的理论依据；② 三诉求可直接作为"修辞负载"三栏标签。

#### 3.5.10 Prebunking / Inoculation 与媒介素养干预的效应量
- **核心构件**：通过"预先示弱化的操纵手法"提高识别能力（prebunking），与"事后纠正"（debunking）相对。[P] https://www.sciencedirect.com/science/article/pii/S2352250X25002076 （信号检测论 Meta 分析）；[P] https://pmc.ncbi.nlm.nih.gov/articles/PMC10498317/ ；[P] https://misinforeview.hks.harvard.edu/article/global-vaccination-badnews/
- **媒介素养干预的 Meta 分析**：报告合并效应量 **Hedges' g = 0.53**（本次检索片段值，未逐字复核原文 →【待核实】）。[P] https://journals.sagepub.com/doi/10.1089/cyber.2023.0324 ；早期 Meta [P] https://pmc.ncbi.nlm.nih.gov/articles/PMC3377317/
- **对本系统的意义**：干预有效但效应量中等——**不能假设用户或 agent 的"常识判断"足够**，必须外部化为清单与例证（这也支持把 rubric 写成显式协议）。

#### 3.5.11 Sagan 的"baloney detection kit"
- **核心构件**：独立验证、鼓励质疑、区分证据与权威、类比不是证据、考虑多重假设、量化、避免循环论证等。[S] https://centerforinquiry.org/learning-resources/carl-sagans-baloney-detection-kit/ ；[S] https://www.themarginalian.org/2014/01/03/baloney-detection-kit-carl-sagan/
- **判定方式**：原则清单，无计分。
- **局限**：科普散文，无操作性定义。
- **适配本系统**：**低—中**（"多重假设"与"量化"两条可作为追问项）。

### 3.6 论证映射与论证挖掘

#### 3.6.1 Argument Mapping（论证映射教学法）
- **核心构件**：把论证画成"方框-箭头"图（主张、理由、反驳、共前提），强迫显式化隐含链接；工具链包括 Reason!Able、Rationale、Araucaria 等。[P] https://www.reasoninglab.com/wp-content/uploads/2013/10/TvG-Using-argument-mapping-to-improve-critical-thinking-skills-2015.pdf ；[O] https://link.springer.com/chapter/10.1057/9781137378057_12 ；Meta 评述 [P] https://philarchive.org/rec/DAVAMI-6 （结论："a potentially promising technique"）
- **判定方式**：结构完整性与链接强度（可人工评分）。
- **可执行判据/阈值**：无公开阈值；但**映射结果本身可作为证据**（缺链接 = 缺 warrant）。
- **局限**：**成本极高**（人工映射一篇长文需小时级）；在 LLM 场景下必须先由模型抽取再人工抽查，因此可靠性取决于抽取质量（本会话上一步的实测已表明抽取会静默丢内容，见父会话记录）。
- **适配本系统**：**中**。建议只对"核心论证链"（≤5 个节点）做轻量映射，不做全文映射。

#### 3.6.2 Argument Mining 综述与标注方案
- **核心构件**：流水线 = 论证单元识别 → 关系分类（支持/攻击）→ 论证质量评估。[P] https://direct.mit.edu/coli/article/45/4/765/93362/Argument-Mining-A-Survey ；LLM 时代的综述 [P] https://arxiv.org/html/2506.16383v2 ；学术文档场景 [P] https://aclanthology.org/2021.sdp-1.7.pdf
- **判定方式**：分类任务 + 回归/序数评分（质量）。
- **可执行判据/阈值**：有数据集与评价指标（F1、Spearman），但**这些指标衡量的是"与标注者一致"，不是"判定正确"**。
- **局限**：领域标注成本高、跨域迁移差；标注者一致性中等（同类任务 κ/QWK 报告值本次未逐字复核 →【待核实】）。
- **适配本系统**：**中（概念与标注字段可借用，模型不自建）**。

#### 3.6.3 Wachsmuth 论证质量维度体系
- **核心构件**：三组高层特征 **cogency（说服力/逻辑性）、effectiveness（修辞有效性）、reasonableness（合理性）**，下挂 15 个可标注维度（如可信度、相关性、充分性、清晰度、恰当性…）。[P] https://aclanthology.org/2022.findings-emnlp.306.pdf ；理论驱动的领域多样化语料 [P] https://arxiv.org/html/2011.01589v1
- **判定方式**：**多维度分档/序数评分**（1–3 或 1–5）。
- **可执行判据/阈值**：**有维度定义与标注指引**，是最接近"可用于构建 rubric"的学术方案。
- **局限**：为**单条论证**设计，不是整篇文章；维度间相关性高（多重共线性未解决）。
- **适配本系统**：**高（作为评分维度的理论来源）**。`rating-design.md` 的 4 维度可直接与此对齐并注明来源。

#### 3.6.4 Erduran–Osborne Toulmin 分级工具
- **核心构件**：把论证按"主张 + 理由 + 支援 + 限定 + 反驳"的存在情况分为若干层级（科学教育领域）。[P] https://www.kcl.ac.uk/archive/website-resources/education/web-files2/enhancing-argument-science.pdf ；[P] https://www.researchgate.net/publication/227609235_Enhancing_the_quality_of_argument_in_school_science ；后续应用 [P] https://www.tandfonline.com/doi/full/10.1080/02635143.2021.1947223
- **判定方式**：**分档（层级制）**——这是 Toulmin 少见的"可比较打分"实现。
- **可执行判据/阈值**：层级定义公开；但阈值依赖评分者判断。
- **局限**：为中学科学课堂设计（短文本、单一论证），层级数少。
- **适配本系统**：**高（层级思想可直接移植为"论证完备度"档）**。

#### 3.6.5 AP English Language 议论文 rubric
- **核心构件**：三行 6 分制：thesis（是否有可辩护的主张）、evidence & commentary（证据与**阐释**）、sophistication（复杂性/回应反面）。[O] https://apcentral.collegeboard.org/media/pdf/ap-english-language-and-composition-frqs-1-2-3-scoring-rubrics.pdf ；解读 [S] https://www.albert.io/blog/understanding-the-ap-english-language-argument-rubric/
- **判定方式**：**分档（0–6）**，逐行给分。
- **可执行判据/阈值**：**有**公开评分细则与样卷；但由受训阅卷人执行，缺乏公开一致性系数。
- **局限**：面向**写作评分**（要求学生产出），不是阅读理解；对争议性议题的价值立场不做判断。
- **适配本系统**：**中—高**（"证据—阐释"分离这一维度极有价值：中文文章大量存在**只堆材料、不做阐释**的写法）。

#### 3.6.6 LLM 谬误检测与 LLM-as-judge
- **核心构件**：用 LLM 做谬误分类（知识增强、混合智能）或做通用评审（LLM-as-judge）。[P] https://arxiv.org/html/2510.09970v1 ；[P] https://aclanthology.org/2025.hcinlp-1.16.pdf ；裁判综述 [P] https://www.sciencedirect.com/science/article/pii/S2666675825004564 ；说服力测量 [O] https://www.anthropic.com/research/measuring-model-persuasiveness
- **判定方式**：分类 + 打分。
- **可执行判据/阈值**：无可靠阈值；实证显示谬误分类准确率差、偏向误报。
- **局限（关键）**：① 误报率高 → 会系统性冤枉文章；② 自我一致性差（同文多次评分漂移）；③ 现有 LLM-as-judge 研究多针对**参考答案可判定**的任务，而"论证质量"没有唯一答案。
- **适配本系统**：**中**。可用但必须限定为"生成候选缺陷 + 要求引用原文"，并把最终判定交给分层规则与门禁，而不是让模型自由心证（与项目"不绑定模型厂商"的要求也一致）。

### 3.7 快速判定 / 阅读筛选（"值得读"最相关的一组）

#### 3.7.1 Adler《如何阅读一本书》— 检视阅读（Inspectional Reading）
- **核心构件**：阅读四层次（基础/检视/分析/主题）；**检视阅读**分两步——系统略读（书名页、序、目录、索引、出版介绍、关键章节、随手翻读）与粗读（限时通读，不求全懂）；分析阅读的四问：这本书在谈什么？细部说了什么、怎么说？说得有道理吗（全部/部分）？这本书跟我有什么关系？[S] https://fs.blog/how-to-read-a-book/ ；读书笔记（含四问原文）[S] https://bagerbach.com/books/how-to-read-a-book/
- **判定方式**：**分档（略读 → 粗读 → 分析读 → 主题读）**。
- **可执行判据/阈值**：无阈值、无评分；但**"给文章分配的阅读深度"正是本项目要输出的三档决策**（与 `genre-taxonomy.md` 的 A/B/C 处置同构）。
- **局限**：面向书籍、面向"求知读者"，无实证；对"不值得读"的判定只给流程不给标准。
- **适配本系统**：**最高（作为报告骨架与处置分档的措辞来源）**。

#### 3.7.2 SQ3R 与学术论文阅读法
- **SQ3R**：Survey—Question—Read—Recite—Review（Robinson，1940s）。[S] https://www.adlit.org/in-the-classroom/strategies/sq3r-survey-question-read-recite-review ；[S] https://www.learningscientists.org/blog/2021/3/4-1 ；[S] https://ctl.stanford.edu/students/reading-efficacy-sq3r-method
- **期刊论文阅读法**：先读标题/摘要，再读结论与图表，**据此决定是否读全文**。[P] https://pmc.ncbi.nlm.nih.gov/articles/PMC3687192/ ；[S] https://libguides.brown.edu/evaluate/Read ；Harvard 六种阅读习惯（含"读前先问"）[S] https://guides.library.harvard.edu/sixreadinghabits
- **判定方式**：**动作序列 + 分档**（读/不读全文）。
- **可执行判据/阈值**：无阈值；"先看结论再决定"是本系统可直接照搬的顺序规则。
- **局限**：SQ3R 的效果证据主要来自学习科学（回忆/自测效应），**不是"筛选质量"的证据**，不可据此宣称能提高判定准确率。

#### 3.7.3 阅读 triage（业界实践）
- **现状**：只检索到博客级实践文（[S] https://warpread.app/blog/triage-reading 、https://daily.dev/blog/avoid-information-overload-developer/ ），**没有同行评议的方法论**。→ 本任务"重点开放问题"的答案是：**不存在**针对"一篇文章值不值得读"的成熟框架；最接近的是把 (a) Adler 检视阅读、(b) 论文筛选流程、(c) 来源可信度编码三者拼接，见 §5。

#### 3.7.4 可读性/连贯性自动化（Coh-Metrix 与可读性公式）
- **Coh-Metrix**：自动计算 200 余项连贯性与语言指标（衔接、句法复杂度、词汇）。[O] https://ies.ed.gov/use-work/awards/coh-metrix-automated-cohesion-and-coherence-scores-predict-text-readability-and-facilitate ；[P] https://www.researchgate.net/publication/8358727_Coh-Metrix_Analysis_of_text_on_cohesion_and_language ；工具说明 [P] https://learning-analytics.info/index.php/JLA/article/download/4330/5754/23390
- **可读性公式的批评**：Flesch 等公式只测表层（句长、词长），**不能测理解难度或质量**。[O] https://www.ahrq.gov/talkingquality/resources/writing/tip6.html ；[S] https://www.effortmark.co.uk/readability-formulas-seven-reasons-to-avoid-them-and-what-to-do-instead/ ；LLM 时代的研究仍判定其"poor … for quality" [P] https://arxiv.org/html/2502.11150v3
- **适配本系统**：**低**。可把"句子长度/段落长度/术语密度"当作**难度**指标输出给读者，但**禁止**把它当作质量或可信度指标。

---

## 4. 横向对比表

> 说明：判定方式列 "计数"=可数出条数；"分档"=有序等级；"二元"=是/否；"定性"=无量化。可用度＝用于"中文文章筛选协议包"的实用价值（高/中/低），综合成本、可复现性与证据强度。

| 框架 | 判定对象 | 判定方式 | 现成可执行判据/阈值 | 有实证的局限 | 可用度 |
|---|---|---|---|---|---|
| Toulmin 模型 | 文本 | 定性（结构分解） | 无阈值；六要素齐备性可数 | 无（缺 κ 报告）【待核实】 | 高 |
| Walton 方案 + Critical Questions | 文本 | 二元/分档 | **有**（CQ 列表） | 方案识别是瓶颈；方案本身受批评 [P] | 高 |
| 谬误分类体系 | 文本 | 计数 | 无阈值；名单≠判据 | **有**：LLM 误报率高 [P] | 低—中 |
| Grice 合作原则 | 文本 | 定性 | 无 | 无（缺操作化） | 中 |
| Charity / Steelmanning | 流程 | 定性 | 无 | **未找到实证** | 中 |
| Stasis Theory | 文本 | 分档（四层） | 有定位判据（层级跃迁） | 无实证 | 中—高 |
| Ennis 定义/能力项 | 人 | 定性 | 无 | 无 | 中 |
| Paul–Elder | 人 | 分档（rubric） | 无阈值（形容词标准） | 未找到学术效度研究 | 中 |
| Socratic Questioning | 流程 | 定性 | 无（问题清单） | 无 | 中 |
| Delphi Report | 人 | 分档 | 无阈值（覆盖表） | 德尔菲≠效度 | 中 |
| Bloom/Anderson | 人 | 分档（六级） | 无 | **有**：层级结构心理测量不一致 [P] | 低 |
| Halpern HCTA | 人 | 计数→分档 | 商业量表，题/计分不公开 | **有**：可负担性/可获取性/效度批评 [P] | 低 |
| Watson–Glaser | 人 | 计数（常模） | 有常模 | 与 IQ/阅读能力混淆争议 [S] | 低 |
| Heuer/SATs | 流程 | 定性 | 关键假定检查可操作化 | SATs 整体效果未获证实 [P][O] | 中—高 |
| ACH | 流程/文本 | 计数（矩阵） | 有流程无阈值 | **有**：RCT 未见优势 [P] | 低 |
| IRAC | 文本 | 二元（结构齐备） | 无阈值 | 只适用规则适用型文本 | 中 |
| CASP | 研究 | **二元三态**（是/否/无法判断） | **有**（逐题问句） | 为论文设计，移植需改写 | 高（格式） |
| JAMA Users' Guides | 研究 | 两段式（有效性门禁+结果） | **有**（有效性清单、CI 跨零） | 仅适用实证研究 | 中—高 |
| GRADE | 研究集合 | 分档（4 级）+ 计数（5 降级域） | **有**（公开规则） | 面向研究集合，非单篇文章 | 高（通俗化后） |
| AMSTAR 2 / RoB 2 | 研究 | 分档（域级），**拒绝总分** | **有** | 面向特定研究设计 | 中—高 |
| 证据金字塔 | 研究 | 分档（排序） | 有排序，无绝对判据 | 常被滥用（唯 RCT 论） | 中—高 |
| 系统综述筛选 + κ | 流程 | 二元 + 一致性统计 | **有**（纳入/排除标准、κ 门槛）【待核实】 | 成本高 | 高（可靠性纪律） |
| 横向阅读 / SIFT | 来源 | 动作序列（4 步） | 无阈值，步骤明确 | **正面实证**：优于页面内清单 [P] | 最高 |
| CRAAP / RADAR | 来源 | 计数（检查表） | 有清单，无阈值 | **有**：可被页面内特征满足 [P] | 低 |
| Verification Handbook | 事实主张 | 流程/工具清单 | 步骤明确 | 面向新闻素材 | 中 |
| Admiralty Code | 来源+信息 | **二维分档**（36 格） | **有**（A–F × 1–6） | 无公开信度研究【待核实】 | 高 |
| IMVAIN | 来源 | 计数（六条） | 无阈值；判定式问句可机器化 | 教学工具，无实证 | 高 |
| SMELL / källkritik | 来源 | 计数/核对 | 无阈值 | 教学工具 | 中—高 |
| ACRL / CML 五问 | 来源+动机 | 定性提问 | 无 | 教育框架 | 中 |
| FLICC / CONSPIR / IPA | 修辞操纵 | 计数 | 无阈值；定义可列举 | 易过度归因 | 中—高 |
| Aristotle 三诉求 / Fogg P-I | 修辞 | 标签/定性 | 无 | 解释框架 | 中 |
| Prebunking/媒介素养 Meta | 干预效果 | 效应量 | 有（g≈0.53）【待核实】 | 效应量中等 | 中（设计依据） |
| Argument Mapping | 文本 | 结构评分 | 无阈值；成本极高 | Meta 结论"有希望"未定论 [P] | 中 |
| Argument Mining | 文本 | 分类+回归 | 有指标（F1/Spearman），非正确性 | 标注成本高、跨域差 | 中 |
| Wachsmuth 维度体系 | 单条论证 | 多维分档 | **有**（15 维度定义） | 面向单论证；维度共线 | 高 |
| Erduran–Osborne 分级 | 短文本 | 分档（层级） | 有层级定义 | 为课堂短文本设计 | 高 |
| AP English rubric | 写作 | 分档（0–6，三行） | **有**（公开细则+样卷） | 面向写作产出，无公开一致性系数 | 中—高 |
| LLM-as-judge / 谬误检测 | 文本 | 分类/打分 | 无可靠阈值 | **有**：准确率差、误报高 [P] | 中 |
| Adler 检视阅读 | 读者决策 | 分档（4 层次） | 无阈值 | 无实证 | 最高（骨架） |
| SQ3R / 论文阅读法 | 读者决策 | 动作序列+分档 | 无阈值 | 效果证据属学习科学，非筛选 | 中—高 |
| Coh-Metrix / 可读性公式 | 文本表层 | 计数（指标） | 有指标与归一值 | **有**：不能测质量 [O][P] | 低 |

---

## 5. 推荐组合与取舍理由

### 5.1 推荐的六层协议（每层只回答一个问题）

| 层 | 回答的问题 | 采用的方法论 | 为什么是它 |
|---|---|---|---|
| L0 体裁与处置 | 这是哪类文本？要花多少力气？ | `genre-taxonomy.md` 的体裁标签 + A/B/C 处置 | 不重复调研；非论证类文本必须先被识别，否则会误杀（诗歌、教程、新闻简讯） |
| L1 来源外部核查 | 来源是谁？有无利益与倾向？ | **横向阅读/SIFT 四步 + Admiralty Code 二维评级 + källkritik 的"依赖性"项** | 唯一有对照实验支持的策略 [P]；Admiralty 比 CRAAP 更省且"来源/信息"分离；依赖性项补上 CRAAP 缺的立场检查 |
| L2 结构完整性 | 它到底在论证什么？链条完整吗？ | **Toulmin 五要素填空 + 论题↔结论对齐（Stasis 四层定位）+ 解释/论证区分** | Toulmin 成本最低且可解释；Stasis 抓"层级跃迁"；解释/论证区分是中文指南最有价值的独立贡献（§7） |
| L3 假定与预设 | 它默认了什么没说的前提？ | **Heuer 关键假定检查 + Paul–Elder 的"假定/视角"两要素 + Grice 预设触发词** | 隐含前提是中文文章的最大缺陷源；三者互补：流程（Heuer）+ 词汇（Paul–Elder）+ 字符串级可得分（Grice 触发词） |
| L4 缺陷探测 | 具体哪一步坏了？ | **Walton critical questions（8–12 个高频方案）+ 谬误标签（仅提示）+ FLICC 五手法（仅限健康/科学类）** | CQ 是"可执行判据"里最像判据的；谬误与 FLICC 只允许作为"待人工确认的提示"，因实证误报率高 |
| L5 证据强度 | 事实主张有多硬？ | **证据金字塔简化 + GRADE 五降级域通俗化 + IMVAIN 六问** | 金字塔给排序、GRADE 给打折规则、IMVAIN 给来源细节；三者都以"计数/档位"输出，可机器化 |
| L6 分档与校准 | 最终值不值得读？ | `rating-design.md` 的门禁 + 质量分 + 锚例校准；**报告骨架用 Adler 四问** | 不重复调研；Adler 四问天然对应"讲什么/怎么讲/对不对/与我何干"四段 |

### 5.2 淘汰清单与理由（为什么不用）

| 淘汰对象 | 淘汰理由（附证据） |
|---|---|
| ACH 竞争性假设分析 | 有随机对照实验未见准确率优势 [P] https://onlinelibrary.wiley.com/doi/full/10.1002/acp.3550 ；SATs 整体价值未获 RAND 证实 [O] https://www.rand.org/pubs/research_reports/RR1408.html ；成本高（矩阵需逐格判定） |
| CRAAP / RADAR | 全部判据都在页面内部，可被精心排版满足；横向阅读对照实验显示其更差且更慢 [P] https://crln.acrl.org/index.php/crlnews/article/view/24195/32005 |
| Bloom / Anderson | 层级结构的累积性未获实证支持 [P] https://www.lifescied.org/doi/10.1187/cbe.20-08-0170 |
| Watson–Glaser / HCTA / CCTDI | 测的是**人**不是文；HCTA 有可负担性/可获取性/效度批评 [P] https://www.pdcnet.org/inquiryct/content/inquiryct_2013_0028_0003_0004_0012 ；商业量表不可复现 |
| Paul–Elder 9 标准（作为评分表） | 形容词标准无阈值、无边界例；未找到学术效度研究 → 只保留"假定/视角"两项当词汇表 |
| 谬误计数 → 直接扣分 | LLM 误报率高、以及正常语句被误判 [P] https://arxiv.org/html/2510.09970v1 、[S] https://hub.baai.ac.cn/view/50912 |
| Coh-Metrix / Flesch 类公式 | 只测表层难度，不能测质量 [O] https://www.ahrq.gov/talkingquality/resources/writing/tip6.html |
| 全文 Argument Mapping | 成本与文章长度成正比；且本会话已实测"LLM 抽取会静默丢内容"，只对核心链做轻量映射 |
| 单一 LLM-as-judge 打分 | 无唯一答案任务上一致性差；与"不绑定模型厂商"的交付要求冲突 → 改为规则+证据优先 |
| IARPA CREATE | 无公开可用的成品框架与成效数据（项目页 extract 失败） |

### 5.3 已知的取舍代价（必须写进协议文档）

1. **横向核查需要联网**。若使用者的 agent 不能联网，L1 层退化为"标注未知来源 + 降权"，不可伪造核查结论。
2. **GRADE 通俗化会损失严谨性**。"打折卡"是工程折衷，报告里必须声明它不是 GRADE 本身。
3. **拒绝总分与质量分并存**：AMSTAR 2/RoB 2 明确反对汇总总分，本项目为"筛选"目的保留质量分 —— 因此**门禁（否决项）必须先于总分生效**，且总分不得覆盖门禁结论（该约束已在 `rating-design.md` 的 M1 中体现，此处仅作方法论来源说明）。
4. **中文语料缺口**：中文侧的可用资产是"议论文标注规范/量表"，**没有**公众号文章的论证质量标注语料，因此 L2–L4 的判据只能来自英文文献的移植，需要锚例校准来补偿（见 `rating-design.md`）。

---

## 6. 中文文本 / 中文公众号文章的特别问题

> 说明：本节逐项区分"**有实证/文献**"与"**未找到**"。凡标"未找到"的，即本次检索（含中文垂直库 `social_media.wechatmp`）无对应证据。

### 6.1 论证标记词的语用歧义（有部分文献）

- **"因为"不是前提的可靠标记**。中文指南的"因为放置法"利用的正是"因为"的句法可插入性；但语料研究显示"因为…所以…"在现代汉语口语与网络语境中**出现连用形式，其句法功能与语义相对原本形式都发生了扩展**（不只是因果关系标记）。[P] https://pdf.hanspub.org/ml_2915664.pdf 、https://www.hanspub.org/journal/paperinformation?paperid=127425
- **"因为"还可用于解释、辩解、反驳导入**，其后的分句未必是作者真正依赖的前提。→ 协议结论：**"因为"只能作为候选定位器，前提的最终判定必须回到"删掉这一句后结论是否仍成立"的删除测试**（该测试在文献中常被称为 argument-identification 的操作化手段，本次未检索到中文实证验证 →【待核实】）。
- **"显然""众所周知""毫无疑问"是预设触发语**（把需要举证的内容塞进预设）。中文"预设触发语"以专名、虚词、叙实动词为主，[S] https://baike.baidu.com/item/预设触发语/6790642 （低权威，仅作词表线索）。→ 结论：这类词应作为**扫描字符串**处理，而不是靠模型"理解"。
- **因果连词的类别与用法**整理见 [S] https://baike.baidu.com/item/因果连词/161399 （低权威）。
- **未找到**：中文论证标记词（因为/所以/因此/可见）的**大规模实证频率与误导率研究**；也**未找到**"标记词滥用 → 论证质量差"的相关性实证。

### 6.2 零形式衔接与主语省略（有文献）

- **零形回指（zero anaphora）是汉语篇章衔接的主要手段**，源自陈平 1987《汉语零形回指的话语分析》（《中国语文》第 5 期）。文献条目 [S] https://www.hanspub.org/reference/Reference?ReferenceID=89560 ；基于话题的分析 [S] https://wenku.baidu.com/view/e30a51e6b24e852458fb770bf78a6529657d355b ；**零形回指在不同体裁语篇中的分布不同** [P] https://pdf.hanspub.org/ML20140400000_43493099.pdf （现代语言学 Vol.2 No.4，DOI 10.12677/ML.2014.24022）。
- **对本系统的三个具体后果**：
  1. **主语缺失导致责任主体模糊**："研究表明""有数据显示"这类无主语句在中文里语法上完全合法，因此不能靠语法异常检测，只能靠**专门的来源缺失检测**。
  2. **指代链断裂会伪造出"逻辑连贯"的假象**：读者把上一段的主语代入下一段，会自动补出作者没写的连接。→ 协议结论：对每一段执行"**该段能否独立说出主张与依据**"的检查（即"零形式惩罚项"）。
  3. **篇章回指密度可测量**：可作为"段落碎片化"的量化指标之一（但注意：回指密度高≠质量差，只是**可读性/连贯性的中性指标**）。
- **未找到**：零形回指密度与论证质量/可信度的相关性实证。

### 6.3 标题党（clickbait，有文献）

- **定义与手法**：以夸张、耸动标题与缩略图诱使点击。[S] https://zh.wikipedia.org/zh-hans/标题党
- **检测方法**：国际上有 clickbait detection 的经典工作与特征体系 [P] https://www.semanticscholar.org/paper/Clickbait-Detection-Potthast-K%C3%B6psel/817b4d24643ac0d36ea9e647f0c144abd6b2da10 ；神经网络方法 [P] https://cs229.stanford.edu/proj2017/final-reports/5231575.pdf
- **图文不符是中文语境的高频形态**：中文研究指出既有识别方法"**忽略了网络新闻由图像与文本两部分构成**"这一特点，只做文本检测。[P] https://www.researchgate.net/publication/342098316_Research_on_News_Recognition_of_Clickbait_Fusing_Image_Information → 协议结论：**标题/封面与正文的一致性检查**必须作为独立检查项（标题承诺 vs 正文兑现）。
- **大模型自身也会产出标题党**：中文实证研究探讨 LLM 在标题写作中的"标题党"特征倾向，且提示设计显著影响生成结果。[S] https://www.scribd.com/document/970955227/ （低权威聚合副本，原文出处待核实）→ 协议结论：**作者是否使用 LLM 不应作为判定依据**，只判文本本身。
- **关联的"情绪/夸大度"指标**：可读性 vs 标题夸张度的自动化检测未见可靠公开方案 →【待核实】。

### 6.4 图文混排（未找到直接证据）

- **未找到**：针对"公众号图文混排（长图、截图、动图、排版装饰）如何影响可信度判断"的实证研究或最佳实践标准。
- **可用的邻近证据（只能作为理论解释，不能作为判据）**：
  - Fogg 显著性-解释理论：信任判断取决于显眼线索 × 用户解读，因此**排版本身就是可信度线索**。[P] https://credibility.stanford.edu/pdf/p-iTheory_Fogg_Oct02.pdf
  - 多模态阅读的中文教学讨论（设题层面）[S] https://www.cacler.hku.hk/hk/content/basic/6610 ；多模态大模型综述 [P] https://aclanthology.org/2024.ccl-2.1.pdf
- **协议结论（工程决策，非文献结论）**：把"图片承载的关键信息是否可被文本独立复述"作为一条检查项（防止"关键结论只存在于图片里"），并明确标注该检查项**没有文献依据、是工程折衷**。

### 6.5 段落碎片化（弱证据）

- **唯一带数字的实证来源是中国青年报的社会调查**：超五成受访者感觉长时间接触碎片化信息后思考能力下降；48.9% 反映"逻辑不清晰"；43.8% 反映"难以集中注意力"；阅读耐受度低（一旦文章超过 1000 字就易放弃）。[S] https://zqb.cyol.com/pc/content/202506/12/content_412166.html （社会调查，非对照研究，证据等级低）
- 相关评论与倡议：[S] https://www.xinhuanet.com/politics/2019-04/10/c_1124345738.htm 、[S] https://cssn.cn/skgz/bwyc/202601/t20260114_5969178.shtml
- **未找到**："段落碎片化 → 论证质量下降"的因果实证；也**未找到**段落长度与论证完备度的相关性研究。
- **协议结论**：段落长度/句长只作为**难度与阅读成本**指标输出，不作为质量扣分项。

### 6.6 中文版可复用的测量与标注资产（有文献）

- **中文批判性思维量表**：
  - CCTDI（加利福尼亚批判性思维倾向问卷）中文版初步修订 [P] https://devpsy.bnu.edu.cn/CN/article/downloadArticleFile.do?attachType=PDF&id=285
  - 中国人批判性思维结构及量表编制（《北京大学学报》2022）[P] https://xbna.pku.edu.cn/fileup/0479-8023/HTML/2022-2-383.html ；英文版条目 [P] https://www.researchgate.net/publication/360643044_Chinese_Critical_Thinking_Structure_and_Measurement
  - → 用途：为**中文读者**的判定维度提供文化适配依据（个体主义/集体主义下"公正性"含义不同）；但仍是测人，不是测文。
- **中文议论文论证质量标注规范**：以中学生议论文为对象，论据分类 + **纵向与横向两个维度共 15 种论辩关系**。[P] https://www.airitilibrary.com/Article/Detail/0219810X-N202607020010-00002 ；相关中文智能批改专利 [O] https://patents.google.com/patent/CN112784878A/zh ；LLM 作文辅导系统 [P] https://www.ce-jeme.org/cgi/viewcontent.cgi?article=1062&context=journal
  - → 用途：**这是最接近"中文论证质量可执行判据"的资产**（15 种关系可作为关系标签树）。
- **中文逻辑谬误数据集**：Logic（中文逻辑谬误检测数据集）[P] https://www.alphaxiv.org/zh/abs/2202.13758 ；SMARTYPAT-BENCH（英文原生基准；报告大模型易误报正常语句）[S] https://hub.baai.ac.cn/view/50912
- **中文歧义研究**：现代汉语歧义现象综述 [P] https://www.sinoss.net/upload/resources/file/2023/12/01/35134.pdf ；数词触发歧义的认知机制 [P] https://pdf.hanspub.org/ml2024128_482913632.pdf
- **微信公众号谣言研究**：学术分析 [P] https://html.rhhz.net/WNSFXYXB/html/9d020207-9cc0-4ab1-8696-a322eeee7f53.htm ；新闻战线实务讨论 [S] https://paper.people.com.cn/xwzx/html/2016-04/01/content_1702591.htm ；社科院报告（公众号"谣言"传播）[O] https://www.pishu.com.cn/skwx_ps/initDatabaseDetail?contentId=5271781&siteId=14&contentType=literature
  - → 用途：提供**中文语境下的传播型失真形态**（情绪化、因果简化、权威嫁接），可转化为检查项；但这些研究针对"谣言"，不是"论证质量"。

## 7. 对输入材料《批判性思维-信息结构判断指南》的批判性评估

> 评估对象：`E:\Onedrive\rayknowledge\01-InBox收件箱\批判性思维-信息结构判断指南.md`（约 402 行，作者 ray.l，YAML frontmatter 标注 version 1.0.0 / created 2026-10-07，含 `rating` 字段与 1D–5S 的档位映射说明）。**定位：探索性启发材料，不是标准，也不是可执行的判据集。** 本节逐条给出"能进协议 / 不能进协议"的判定与理由；行号引用该文件。

### 7.1 真价值：标准框架里没有或很少被工程化的检查项（6 条）

| # | 检查项（含行号） | 为什么有价值 | 标准框架里为何缺 |
|---|---|---|---|
| 1 | **「是论证，还是解释？」**（L126 原文："解释的存在其实是一个陷阱，它并没有证明结论确实成立，而是把结论变成了默认的前提"） | 这是**筛选场景的高频致命缺陷**：文章把已知结论用"因为"重述一遍，读者会误读为论证 | Toulmin 只管结构齐备，不区分"理由是否独立于结论"；Houtlosser 论 because 三义、Govier「是否回应怀疑」有讨论但**未被工程化为检查步骤** |
| 2 | **「因为」放置法**（L106）：把"因为"套到每句句首，通顺即前提 | 零成本、可逐句机械执行，比 Argument Mining 便宜几个数量级 | 论证单元识别在文献里是 NLP 任务，少见人工可执行启发式 |
| 3 | **论题↔结论对齐**（L63 "只要能明确结论，就能倒推出论题"；L65 小节的判据可表述为"给结论加个问号，能否还原成论题"） | 能抓"答非所问/偷换论题"，且**只需读开头与结尾**，是筛选场景最省的一次检查 | 等价于 Stasis Theory 的层级跃迁，但 Stasis 要求先分类四层问题，成本更高 |
| 4 | **隐含假定的两种找法**（L172 反问"我心底持有什么样的观念，才能把已知的前提和结论从逻辑上完成无缝衔接？" + 假定自己是反对者、自己是无关第三方） | "无缝衔接"是**可操作的搜索目标**：把候选隐含前提写出来，检验它是否让链条闭合 | Heuer 的 key assumptions check 给流程不给问句；Paul–Elder 的"假定"是教学词汇 |
| 5 | **区分事实判断型 / 价值判断型假定**（L177–184：事实型问"跟经验/知识背景冲突吗、来源可靠吗"；价值型再加"我认同这个假定吗"） | 两类假定的失败模式不同：事实型可核，价值型只能显式化后交由读者裁决——把它拆开是正确设计 | CASP/GRADE/证据金字塔全部面向事实型证据，**不含价值判断通道** |
| 6 | **「调转立场/换人换情形，态度是否一致」（L274–333 的立场与情绪小节）+ 边界章（L24：不适用于个人感受、偏好） + 自我限定章（L359–366：批判性思维不负责构建）** | 前者的"一致性检验"是可执行的；后两者防止协议**误杀非论证文本**、以及把"没有提出新方案"当成缺陷 | 教学框架少有明确写"本框架不适用什么"，这是方法论文档的稀缺品质 |

### 7.2 只是概念框架、缺少可执行判据（9 条）

1. **"自洽"定义不可判定**（L44）："关键要素是不是完整，每一个要素是不是成立和互相匹配"——什么算完整？要素互相冲突时谁优先？无阈值、无边界例、无冲突消解规则。
2. **前提判据以读者自身经验为基准**（L110–111："跟常识、经验冲不冲突？跟背景知识冲不冲突？"）。这会把读者的先验当成检验标准，产生**用偏见检验偏见**的循环——正是该材料自己在"思考公正"一节反对的东西。缺的是**外部核查优先（横向阅读/SIFT，有对照实验支持）**。
3. **「因为」放置法的语用盲区**：汉语"因为"可标记解释、辩解，且"因为…所以…"连用形式已扩展为多功能标记（证据见 §6.1）。该方法**必须补删除测试**才能进协议。
4. **L182 的强规则过强**："只要有一个假定被判断成可驳或不成立的，那么就可以判断它支撑的结论也是可驳或不成立的"。多前提论证中单个前提被质疑**不等于**结论被推翻（结论可能由其他前提独立支撑）。若照搬会系统性过度否决。同一段 L183 又承认"假定成立了，它对应的结论就成立吗？也不一定"——**前后不对称**，需按"结论的可信度是各前提的合取"重写。
5. **"信念"一节不可判定**（L223–273）：L234 承认信念"更稳定、更隐秘"，识别法只有"抵触情绪排查"——情绪反应既非必要也非充分条件，且无法复核。
6. **"立场/情绪/欲望"三节是审人不是审文**（L274–333）：全部是自省式提问，无判据、无阈值、无外部可验证性。作为"作者动机提示"可保留，**不得进入打分**。
7. **"时代局限/格局局限"不可操作**（L334–356）："往前/往后放 3 年、30 年还适用吗"依赖预知；"我不知道我不知道什么"在逻辑上不可判定。只能作为报告里的固定提问，不能作为扣分项。
8. **无可复现性证据**：全篇只有零散单句示例，**没有一篇完整文章的走查**，也没有评分者一致性数据。任何判据集若无可复现演示，都不能直接当作协议。
9. **检查面完全在文本内部**：无来源可靠性、时效性、利益冲突、事实核查流程。而"页面内检查 vs 外部核查"的对照实验结论是后者更优（见 §3.5）。**另**：无体裁适配（对新闻简讯/教程/诗歌套用论题-论证-结论会误杀，项目已另有 `genre-taxonomy.md` 处理）、无中文特有检查项（零形回指导致的"研究表明"类无主语、图文混排，§6.2/§6.4 均未覆盖）。

### 7.3 与标准框架的对应关系（避免重复造轮子）

| 指南要素 | 对应标准框架 | 关系判定 |
|---|---|---|
| 论题—论证—结论 | Toulmin（claim–grounds–warrant） | 更简；缺 qualifier/rebuttal，需从 Toulmin 补 |
| 论题↔结论对齐 | Stasis Theory 层级定位 | 同判据、成本更低 → 用指南版本 |
| 隐含假定 | Heuer 关键假定检查 + Paul–Elder「假定」要素 | 指南的"无缝衔接"问句更可执行 → 用指南版本 + Heuer 流程 |
| 论证 vs 解释 | Houtlosser（because 三义）、Govier | **指南是二者的工程化，本次检索未见替代物 → 保留，但必须补独立证据要求** |
| 公正性/立场/情绪/信念 | 无直接对应（近 bias-awareness 训练） | 概念独有，不可判定 → 仅作报告提示 |
| 不完备性自省 | 无直接对应 | 概念独有，防止误用框架 → 保留为协议免责声明 |
| 「因为」放置法 | 论证单元识别的语用学讨论 | 指南版是启发式，需删除测试兜底 |

### 7.4 采纳决定（本项目的取舍）

- **进协议**：论证 vs 解释（+独立证据要求）、论题↔结论对齐、隐含假定两种找法、事实型/价值型假定分流、删除测试（**替换原「因为」放置法作为最终判据，放置法只作候选定位器**）、边界章（体裁白名单，配合 `genre-taxonomy.md`）。
- **不进协议**：信念/立场/情绪/欲望四节的提问（改为可选"作者动机提示"，不计分）、时代与格局局限（改为固定提问，不计分）、L182 的强规则（重写为"结论可信度 ≤ 最弱必要前提的可信度"）。
- **对材料作者的一句话结论**：这份材料在**结构自洽**这一层提供了 4 个可直接工程化的检查项（其中"论证 vs 解释"是本次全调研中未见替代物的贡献），但**没有一条带阈值或一致性证据**，且有 1 条强规则（L182）在逻辑上过强，直接照搬会过度否决。

---

## 8. 未查到的东西与不确定点

### 8.1 明确"未找到"

| # | 未找到的内容 | 检索范围与结论 |
|---|---|---|
| 1 | **针对"一篇文章值不值得读"的同行评议成熟框架** | 本轮全部检索（含 `academic.*`、news、IL 垂直库）均无。最接近的是 Adler 检视阅读（书籍、无评分）＋期刊论文筛选流程（限论文）＋来源可信度编码（限来源）。→ 本任务"重点开放问题"的答案＝**不存在**，只能拼接。 |
| 2 | 中文论证标记词（因为/所以）的误导率或滥用频率实证 | 未找到。仅有"因为…所以…"连用扩展的语料研究（§6.1）。 |
| 3 | 零形回指密度与论证质量/可信度的相关性实证 | 未找到。零形回指研究集中在回指消解与体裁分布。 |
| 4 | 图文混排对可信度判断影响的实证研究或最佳实践 | 未找到。仅有 Fogg 理论（排版即可信度线索）与多模态教学讨论。 |
| 5 | 段落碎片化 → 论证质量下降的因果实证 | 未找到。仅有社会调查（主观感受，低证据等级，§6.5）。 |
| 6 | Charitable interpretation / steelmanning 的操作化标准与实证 | 未找到。哲学讨论充分，无判定标准、无一致性研究。 |
| 7 | Paul–Elder 框架的独立效度/信度研究 | 未找到（有第三方背书性描述，无学术效度研究）。 |
| 8 | Toulmin 完整六要素的人工评分者一致性（κ）报告 | 未找到。 |
| 9 | Argument mining 标注一致性的具体 κ/QWK 数值 | 未逐字复核（综述提及一致性中等，无具体数值）。 |
| 10 | IARPA CREATE 的成品框架与成效数据 | 项目页 extract 失败；仅得项目描述。 |
| 11 | Admiralty Code 的信度研究 | 未找到。 |
| 12 | 可直接下载的**中文论证质量标注语料** | 未找到。最接近的是中学生议论文 15 种论辩关系标注规范，仅见摘要页。 |
| 13 | 中文文章"夸大概率"或"标题-正文不符"的可复现检测方案 | 未找到可公开复现的方法。 |

### 8.2 需要在项目内实测后才能确认的点

1. **本报告所有"适配本系统：高/中/低"都是推理判断，不是实测结果**。建议协议定稿前，用 20 篇真实文章（覆盖 `genre-taxonomy.md` 各体裁）做一次 A/B 校准，并把结果并入 `rating-design.md` 的锚例校准流程。
2. **删除测试（删掉某句后结论是否仍成立）在中文长文上的可行性**：预计成本随段落数线性增长，是否需限定到"核心论证链 ≤5 节点"待实测。
3. **Toulmin 五要素填空在中文公众号文章上的填充率**：多数文章可能只填得出 2–3 项，是否需要"缺项不扣分、只记录"待实测。
4. **零形式衔接惩罚项是否会误伤合法省略**：中文省主语是常态，阈值待实测。
5. **门禁与质量分的相互作用**：本报告推荐"门禁先于总分"，但**未验证**门禁误判率。

### 8.3 本次调研方法本身的局限（必须随报告一并声明）

- 检索通道为 anysearch CLI（web 搜索 + 垂直库）；`web_search` / `read_page` 桥接全程 429 不可用，**未能用第二条通道交叉验证**任何结论。
- 4 处 URL 内容提取失败（Taylor & Francis 两次、IARPA 官网一次、Wiley 一次），相关结论依赖摘要页或第三方综述。
- 部分来源为教学机构指南页、百科或博客（正文已逐条标注 `[S]`），**不得**在协议文档中当作学术证据引用。
- 中文垂直库检索到的主要是教材式内容与商业量表介绍，**未发现**公众号文章论证质量的任何标注语料或评估研究。
- 本报告**未做**任何"把一个框架实际应用到一篇中文文章并给出判定"的试验；所有阈值建议都是移植性推理。

### 8.4 结语（给项目的三条硬约束）

1. **判定顺序不可颠倒**：来源外部核查（L1）→ 结构完整性（L2）→ 假定（L3）→ 缺陷（L4）→ 证据强度（L5）→ 分档（L6）。先评分后核查会放大精心排版的伪可信文本。
2. **任何"论点不成立"的判定必须附原文引文与缺失环节的具体名称**（缺 warrant / 缺来源 / 前提被质疑 / 论证被写成解释）。无引文不出结论。
3. **协议不得依赖任何特定模型厂商的能力**：所有检查项必须能退化为"给模型看问题 + 要求引用原文 + 由规则表判定档位"的形式。


