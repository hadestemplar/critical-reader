# 评级与档位制式调研：critical-reader 的「门禁 + 质量分」设计

调研日期：2026-10-13 ｜ 调研方式：联网检索（DuckDuckGo/OpenAlex/arXiv/期刊与厂商官网原文提取）
适用范围：为 `critical-reader`（AI agent 用的文章筛选器）确定两根轴——门禁档位（合不合格）与质量分（写得多好）——的制式、阈值与防漂移机制。

> 阅读约定：正文中的引文一律为**原文摘录**（英文原样给出）；凡未取得一手来源或无法交叉验证的结论，标注 **【待核实】**。

---

## 0. 结论速览

1. **唯一被工程化验证过的「门禁 + 质量分」结构是 MQM 式串行结构**：先做**否决（critical error）**，再用**加权错误罚分得到 0–100 类百分比分**，最后与**阈值**比较得到 Pass/Fail。官方定义原话见 §1.2。它同时解决了「一篇写得好但事实错误的文章不该过关」这种非补偿需求。
2. **连续分本身不带来跨文本可比性**：MQM 团队自己承认百分比型分数「do not use human-readable scales」「produce non-comparable quality values across various content types and scenarios」（arXiv:2405.16969）。真正的可比性来自**锚定**（固定锚例/阈值标定/统计质量控制），不是来自小数位。
3. **分档数量的实证最优区间是 4–7**（Lozano et al. 2008，原文见 §1.1）；LLM 判分的稳定性也支持「少档 + 硬规则」，而不是「0–100 连续微调」。
4. **尺度的最大敌人是漂移与膨胀，不是分辨率**：真实评分系统里 A 档占 43%（较 1960 年 +28 个百分点），D/F 合计不足 10%（Rojstaczer & Healy 2012）。制式设计必须把「防膨胀」做成机械规则（上限、条件门、锚例回测），而不是靠提示词祈祷。
5. **主推方案 M1**（§5.1）：门禁 3 值（Reject / Borderline / Pass，由「否决清单 + 阈值」串行产生）＋ 质量分 0–120（四维等权，5 档带，120 档只能由硬条件触发）；**备选 M2**：以冻结的 20–50 篇参考集做 Bradley–Terry/Elo 相对定位；**备选 M3**：单轴 5 档（最稳、最粗）。

---

## 1. 问题一：成熟制式及其证据

### 1.1 制式清单与实测证据

| 制式 | 使用场景 | 一手证据（原文摘录） | 来源 |
|---|---|---|---|
| 分档量表 4–7 档最优 | 教育评分 / Likert 型评分 | “As the number of response alternatives increases, both reliability and validity improve. **The optimum number of alternatives is between four and seven.** With fewer than four alternatives the reliability and validity decrease, and from seven alternatives onwards psychometric properties of the scale scarcely increase further.” | Lozano, García-Cueto & Muñiz 2008, *Methodology* 4(2):73–79，DOI 10.1027/1614-2241.4.2.73 ／ PDF: https://pdfs.semanticscholar.org/2ad4/5d4047f00b3c38467119706182e64408f37f.pdf |
| 字母等级 A–F | 高等教育评分 | “Contemporary data indicate that, on average across a wide range of schools, **A's represent 43% of all letter grades, an increase of 28 percentage points since 1960 and 12 percentage points since 1988.** D's and F's total typically less than 10% of all letter grades.”（样本：200+ 所四年制院校，当代数据来自 135 校、150 万学生） | Rojstaczer & Healy 2012, *Teachers College Record*，DOI 10.1177/016146811211400707：https://doi.org/10.1177/016146811211400707 |
| 同行评审：数字分 + 人工决策 + 置信度 | 学术评审 | NeurIPS 2024 审稿表：overall rating（1 very strong reject … 10 award quality）+ soundness/presentation/contribution 附加评分 + **confidence 1–5**（“You are absolutely certain about your assessment”…），最终由 AC/SAC 讨论后决策 | NeurIPS 2024 Reviewer Guidelines：https://neurips.cc/Conferences/2024/ReviewerGuidelines |
| 同行评审的可靠性反面证据 | 基金评审 | “Results showed **no agreement among reviewers regarding the quality of the applications** in either their qualitative or quantitative evaluations… the outcome of the grant review depended more on the reviewer to whom the grant was assigned than the research proposed in the grant.”（43 位评审 × 25 份 NIH 申请） | PNAS 2018，DOI 10.1073/pnas.1714379115：https://doi.org/10.1073/pnas.1714379115 |
| IRR 的测量陷阱（避免误判） | 评审一致性统计 | “estimating **local IRR from subsets of restricted-quality proposals will likely result in zero estimates**… when complete ranges of proposals are considered, **IRR estimates are above 0.6** which indicates good reviewer agreement… with a small number of reviewers per proposal, zero estimates of IRR are possible even when the true value is not zero.” | 《When Zero May Not Be Zero》*JRSS-A* 2021，DOI 10.1111/rssa.12681：https://doi.org/10.1111/rssa.12681 |
| 公开评审的一致性 | 期刊评审 | 465 篇投稿、1058 份评审：inter-rater reliability “is low (**kappa coefficient**) or reasonable (**Intraclass Correlation Coefficient**) in public peer review” | *Learned Publishing* 2010，DOI 10.1087/20100207：https://doi.org/10.1087/20100207 |
| 评分者效应（中心化倾向 / 严厉度漂移） | 大规模作文评分 | 英格兰 2008 年全国课程英语写作测试：**发现评分者中心化倾向（central tendency）**；未发现显著的 severity drift；经验较少的评分者更严厉（不显著）。另有专文指出 MFRM 的标准假设「评分者严厉度不随时间变化」在现实中不成立（rater severity drift） | Leckie & Baird 2011, *JEM*，DOI 10.1111/j.1745-3984.2011.00152.x：https://doi.org/10.1111/j.1745-3984.2011.00152.x ／ Bayesian MFRM：DOI 10.3758/s13428-022-01997-z：https://doi.org/10.3758/s13428-022-01997-z |
| 成对比较（Comparative Judgement, CJ） | 作文/作品测量 | 对 **101 个 CJ 数据集**的元分析，给出「招多少评估者、收多少比较」的建议，并指出存在两种并行的可靠性估计（scale separation reliability, SSR 与 split-halves reliability, SHR） | *Behavior Research Methods* 2025，DOI 10.3758/s13428-025-02744-w：https://doi.org/10.3758/s13428-025-02744-w |

**要点**：教育测量领域已用「4–7 档」作为可靠性与分辨率的折中；内容/文本评估领域（MQM、评审）则用「**多档 + 否决 + 阈值**」而非纯连续分。

### 1.2 MQM：目前唯一完整工程化的「门禁 + 质量分」制式

来源：MQM 官方术语页 https://www.themqm.org/guidance/values-and-scores/ ；模型页 https://www.themqm.org/mqm-pillars/the-mqm-scoring-models/

- **Pass/Fail 的官方定义（原文）**：“The Pass/Fail assessment decision to accept or reject an evaluated translation is based on **the absence of critical errors and an Overall Quality Score equal to or exceeding the Threshold Value**.”
- **Critical error 是一票否决（原文）**：“Critical Error Count … whereby **any value of one or more automatically triggers a Fail Rating, regardless of other score values**.”
- **三档严重度的定义（原文）**：minor =“has a limited impact… but **does not seriously impede** the usability, understandability, or reliability”；major =“**seriously affects** the understandability, reliability, or usability… for its intended purpose”；critical =“**renders the entire content unfit for purpose** or poses the risk for serious physical, financial, or reputational harm.”
- **阈值怎么来（原文）**：“The Threshold Value … is a percentage-like value **predetermined on the basis of stakeholder needs and expectations, text or content type, and practical experience**.”
- **校准的作用（原文）**：“With calibration, setting a relevant quality threshold and error tolerance limit is much easier and more flexible, making the pass/fail decision clearer and more understandable. In addition, **calibration allows adjustment of the scoring formula to match the perception of the rater**.”
- **计分结构**：错误数 × 错误类型权重 → Absolute Penalty Total（APT）→ 从满分（类百分比，通常 100）中扣除得到 Overall Quality Score。*具体权重数值（minor/major/critical 各多少分）本次未从官方页取到 → 【待核实】。*
- **MQM 自身的批评（原文，arXiv:2405.16969）**：这类分数 “a) **do not use human-readable scales**, b) have varying and non-intuitive error tolerance thresholds, and c) **produce non-comparable quality values across various content types and scenarios**”；作者的解法是 Multidimensional Quality Metrics 的多区间（Multi-Range）理论与**统计质量控制**（引用 ISO 2859-2:2020 抽样标准 https://www.iso.org/standard/64505.html），并强调 “errors always have a statistical nature”。
  - 论文：https://arxiv.org/abs/2405.16969 （HTML：https://arxiv.org/html/2405.16969v2）

**对本项目的直接含义**：合格判定应当是「**否决清单为空 ∧ 质量分 ≥ 阈值**」，而分数只用于合格之后的价值排序。这与用户设定的两轴完全同构。

### 1.3 0–100 连续分 vs 少档分级 vs 纯排序：跨文本可比性

| 方案 | 可比性证据 | 代价/已知问题 |
|---|---|---|
| 0–100 连续分 | 可比性**不来自刻度**：MQM 明确指出百分比型分数跨内容类型不可比（§1.2）；分数只有在**有锚定与统计抽样**时才可比 | 膨胀（A 档 43%，Rojstaczer 2012）、尺度漂移（rater severity drift 存在，MFRM 需扩展建模）、评分者中心化倾向（Leckie & Baird） |
| 少档分级（4–7 档） | 可靠性与效度在 4–7 档达到平台（Lozano 2008）；档位多则「分辨率收益递减、一致性成本上升」 | 丢失细粒度；相邻论文难以区分；档位边界需要明确判据，否则退化为「整体感觉」 |
| 纯排序 / 成对比较 | LLM 判分：「**absolute scoring being less robust than relative comparing**（Raina et al., 2024）」，部分工作因此把打分改造成成对比较（见 LLM-as-a-Judge 综述原文） | 需要参照集；O(n²) 或锚点；Elo 类估计**本身不稳定**：“Existing framework based on ELO rating system suffers from the inevitable **instability problem** due to ranking inconsistency and the lack of attention to the varying abilities of annotators”（am-ELO 论文）；无法给「120 分」这类直觉表达 |

来源：
- LLM-as-a-Judge 综述（含上述原文）：https://arxiv.org/abs/2411.15594
- Chatbot Arena（成对比较 + 众包，240K+ 票，与专家评分一致）：https://arxiv.org/abs/2403.04132
- am-ELO（Elo 不稳定性的反证与 MLE 改良）：https://arxiv.org/abs/2505.03475
- MT-Bench / LLM-as-a-judge 的位置、冗长、自偏好偏差与人类一致性（GPT-4 判分 vs 人类 >80%，人类之间 81%）：https://arxiv.org/abs/2306.05685

> 注：任务书提供的上一轮结论（MT-Bench 上 Cohen's κ 比 exact-match 缩水 33.8–41.3 个百分点；重测一致性 >0.95 与位置偏差 >0.10 可并存；κ<0.4 的 rubric 维度应重写或删除）本次未复核原始出处，按**已确认的前轮结论**引用。

### 1.4 超越满分的档位（bonus / S 档 / 破格）

| 先例 | 表达方式 | 证据 |
|---|---|---|
| 德国高中 15 分制 | 0–15 分，最高档 15 分对应「1+」（sehr gut 的上半区）；每一传统等级再拆成 plus / glatt / minus 三档 | “Das Punktesystem läuft in der Oberstufe von **15 (sehr gut, oberer Bereich)** bis 0 (ungenügend). Jede klassische Note wird in **drei Punktstufen** aufgeteilt, die der Tendenz plus, glatt und minus entsprechen.”（民间指南站；KMK 官方表【待核实】）https://www.lehrerplan.de/ratgeber/abitur-notenschluessel |
| Google 搜索质量评分 | 两把独立的尺子：**Page Quality（PQ）** 与 **Needs Met（NM）**，同一结果同时打两轴 | 官方 PDF 原文片段：“The General Guidelines primarily cover **Page Quality (PQ) rating and Needs Met (NM) rating**”（该句取自搜索引擎摘要，官方 PDF 本轮下载失败，**PDF 原文与档位命名【待核实】**）https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf |
| 美国 A+ / 英国 A* | 在最高常规等级之上再设一档 | 本轮未取得一手来源（Ofqual 页面未取到）→ **【待核实】** |

**风险（有证据）**：顶端档位一旦可达就会被大量使用——A 档 43%（Rojstaczer & Healy 2012）说明「顶端档位」需要**结构性的稀缺约束**（硬条件、配额或独立评审），否则必然膨胀。此外，若把分数当作优化目标，会触发 Goodhart 效应：奖励模型的代理优化会**反过来损害真实表现**（“Because the reward model is an imperfect proxy, optimizing its value too much can hinder ground truth performance, in accordance with **Goodhart's law**”：https://arxiv.org/abs/2210.10760 ）。

---

## 2. 问题二：两轴结构的先例与串并行取舍

| 先例 | 结构 | 串行 / 并行 | 证据 |
|---|---|---|---|
| MQM | 否决（critical error）+ 分数 ≥ 阈值 → Pass/Fail | **串行、非补偿**：critical error 直接 Fail，与分数无关 | https://www.themqm.org/guidance/values-and-scores/ |
| Google 搜索质量评分 | PQ 与 NM 两把尺子同时评 | **并行双轴**（同一结果两轴各自独立） | 官方 PDF 语句见 §1.4（档位命名【待核实】） |
| 学术评审（NeurIPS/NIH） | 数字评分 + 置信度 + AC 决策 | **串行**：评分是输入，决策由人（AC/SAC）在两阶段后作出 | https://neurips.cc/Conferences/2024/ReviewerGuidelines ；https://doi.org/10.1073/pnas.1714379115 |
| 医疗分诊（ESI） | 5 级急迫度（先分诊、后处置） | 串行前置门 | ESI v2 可靠性与效度：https://doi.org/10.1111/j.1553-2712.2003.tb00577.x |
| 决策理论：先筛选后排序 | screening → ranking 两阶段（consider-then-choose） | 串行，且被营销/心理学实证支持 | *Management Science* 2020：https://doi.org/10.1287/mnsc.2020.3681 |

**取舍分析**

- **串行（推荐）**：先判「是否合格」（只做否决 + 阈值，不产生细分数），再判「多好」。
  - 收益：正确表达非补偿性缺陷（写得漂亮但事实错误的文章会 Fail）；避免分数反向影响合格判定（同一模型先打分再判合格会发生锚定）。
  - 代价：判定成本约 ×1.5；需要在 prompt 层面分两次提问（这也与「逐维独立提问」的收益一致）。
- **并行（同一次输出两轴）**：成本最低，但两轴会互相「拉平」（一致性压力），且**位置/语义锚定风险**上升。
  - 注：两轴互相污染的具体实证本次未取到 → **【待核实，机制推断】**。
- **并成单轴（分数阈值即门禁）**：最简，但无法表达否决；MQM 的 critical-error 规则正是为此而设（§1.2）。

**结论**：轴 1 与轴 2 必须具备**不同的逻辑性质**——轴 1 是**非补偿的**（一票否决 + 阈值），轴 2 是**补偿的**（各维可互相抵消）。因此串行是唯一能同时表达二者的结构。

---

## 3. 问题三：尺度锚定（calibration）

| 方法 | 做法 | 效果证据 | 风险 |
|---|---|---|---|
| Anchoring vignettes | 用「假设人物/案例」的小故事标定评分者使用的刻度，再据此**校正**自评分数 | King, Murray, Salomon & Tandon 2004（APSR，962 次引用）：“We measure incomparability via respondents' assessments, on the same scale as the self-assessments to be corrected, of hypothetical individuals described in short vignettes.” https://doi.org/10.1017/s000305540400108x | 两个核心假设会被数据拒绝：“**Both assumptions are rejected** for reporting behaviors…”（vignette equivalence 与 response consistency）https://doi.org/10.1353/jhr.2011.0005 ；对 vignette 领域与选择敏感：https://doi.org/10.1111/j.1467-985x.2011.00704.x ；青少年场景下的校正比较：https://doi.org/10.1027/1015-5759/a000336 |
| 阈值标定（MQM calibration） | 用校准把「阈值 + 错误容忍度」调到符合评分者感知 | 官方原文：“calibration allows adjustment of the scoring formula **to match the perception of the rater**” https://www.themqm.org/mqm-pillars/the-mqm-scoring-models/ | 需要人工样本；校准结果依赖样本构成 |
| 专家标准设定（Angoff / Bookmark / Hofstee） | 由专家小组把「最低可接受水平」钉在分数轴上 | 同一份材料三种方法给出不同切分：**Angoff 62%（SD 18）、Hofstee 71%（SD 7）、Bookmark 65.9%（SD 10.7）**，通过率 64%/46%/42% https://doi.org/10.3109/0142159x.2013.778395 ；Angoff 与 Bookmark 效度比较（12 名专家/组）https://doi.org/10.1186/s12909-020-02436-3 ；Angoff 系统综述与元分析（2025）https://doi.org/10.1186/s12909-025-08300-6 | **切分点是方法依赖的**（62% vs 71%），不要把某一数字当成客观真值；需要 10–20 名专家与半天到数天的工作量 |
| 少样本参考集 / rubric 化 | 给出带评分描述的 rubric + 参考答案/示例 | Prometheus 2：“e is represented as a **score rubric including a description for the criteria itself and a set of descriptions for each score between the scoring range**”，同时支持 direct assessment 与 pairwise；Pearson 与人类相关性“surpassing other baselines by **0.2 units**”，并把与 GPT-4 的差距减半 https://arxiv.org/abs/2405.01535 | 参考集会随内容漂移；需要版本冻结 |
| 成对比较 + 可靠性估计 | 用 CJ 构造测量尺度，用 SSR/SHR 估计质量 | 101 个数据集的元分析给出评估者数量与比较次数的建议 https://doi.org/10.3758/s13428-025-02744-w | 需要参照集与更多判定次数 |

**「用 20–50 篇人工标注样本钉死档位边界」的落地形态（本项目建议）**

1. 分层抽样 30 篇（区间中值）：10 篇明确不合格、10 篇边界、10 篇明确合格及以上；**边界例必须占 1/3**，因为阈值只有在边界附近才有信息量。
2. 人工标注**只做二元判断 + 一句理由**（“若只允许读 1/3，这篇进不进？”），**不要先标分数**——避免把锚定样本变成「分数分布的先验」。
3. 用 **Bookmark 式**流程把 30 篇从低到高排序，标出「从这一篇起可读」的位置 → 初始阈值；再用 **Angoff 式**提问（“一篇刚达标的中文技术文章，应该具备什么？”）交叉验证。
4. 两种方法差值 >10 分 → 不要取平均，而是**下调阈值 + 提高否决项的权重**（因为切分点本身是方法依赖的，见上表证据）。
5. 冻结为 v1 锚例集（含分数与档位），作为后续漂移回测的唯一基准；锚例集版本号写进判定报告。

> 「20–50 篇」这一具体数字来自标准设定与校准的常规做法，**没有针对 LLM 判分的实验最优值** → 【待核实】。可执行的做法是先做 30 篇，若两种方法差值过大再加到 50 篇。

---

## 4. 问题四：多维合成方法

| 方法 | 机制 | 证据 / 已知问题 |
|---|---|---|
| 等权求和 | 各维独立打分后相加 | 可解释、无参数、不会因权重误设放大偏差；缺点是隐含「各维可完全补偿」 |
| 加权求和 | 按重要性给权重 | 权重的来源无法验证：Saaty-ANP 被批评“**does not define the basic concepts, nor does it check the rationality of the structure, which may lead to meaningless solutions**”（*Operations Research Perspectives* 2022，https://doi.org/10.1016/j.orp.2022.100244 ） |
| 计数制（命中数） | 数「命中几条优点/缺点」 | 与加权等价但更粗糙；易被「多说几条优点」操纵（长度/冗长偏差，见 https://arxiv.org/abs/2306.05685 ） |
| 最低项否决（veto / 连言规则） | 任一维低于下限即整体不合格 | 非补偿规则；MQM 的 critical-error 规则是直接先例（§1.2）；决策研究中非补偿/一因决策模型有独立传统（如 one-reason decision-making，https://doi.org/10.1007/s11166-008-9042-0 ；经典来源 Einhorn 1970 **本次未取到正确 DOI →【待核实】**） |
| AHP 层级分析 | 成对比较构造权重 | 见上；对结构合理性缺乏自检 |
| 学习式合成 | 用标注数据训练合成函数 | 数据不足时不可行；且把分数当优化目标会触发 Goodhart 效应（代理奖励优化伤害真实表现，https://arxiv.org/abs/2210.10760 ） |
| **（领域共识）** | —— | 计算论证学综述自陈：“**overall argumentation quality seems hard to measure, as the impact and interaction of the different dimensions remain unclear**”（Wachsmuth et al. 2017，EACL，https://aclanthology.org/E17-1017.pdf ；DOI 10.18653/v1/E17-1017） |

**结论**：在没有标注数据的情况下，**等权 + 否决**是唯一有证据支撑且可审计的组合方式；任何权重微调（AHP、学习式）都属于「不可验证的复杂度」。

---

## 5. 问题五：建议方案

### 5.1 主推方案 M1：串行两轴 + 硬条件顶档（0–120）

**轴 1 · 门禁档位（非补偿，先判）**

| 门禁 | 判据（全部可机械核对） | 备注 |
|---|---|---|
| **Reject** | 命中任一 veto 项（见下），或质量分 < 50 | 不再看分数 |
| **Borderline** | veto 为空 ∧ 50 ≤ 质量分 < 60 | 需要二次确认（换序重判一次或人工 30 秒速览） |
| **Pass** | veto 为空 ∧ 质量分 ≥ 60 | 进入轴 2 的解读 |

**veto 清单（建议，项目可改；每条都要求引用原文证据）**
1. 核心事实性主张存在**无法在原文中找到支撑**的错误或幻觉；
2. 与标题/声称主题不符（挂羊头卖狗肉）；
3. 主体为广告/软文/导流，无独立信息；
4. 无信息增量（纯拼接已有内容，且不提供新组织方式或新证据）；
5. 正文不可用（截断、乱码、仅目录页）。

**轴 2 · 质量分（补偿，后判）**

- 表达：**0–120 整数分 + 5 档带**（<60 不合格；60–79 C 合格；80–99 B 良好；100–119 A 优秀；**120 S 破格**）。
- 维度（4 维，各 0–5，等权 → 线性映射到 0–120）：
  1. 信息增量（有没有我原本不知道的东西）
  2. 论证与证据（主张是否有证据、是否有反例处理）
  3. 结构（能否被快速提取与复用）
  4. 表达（语言质量、可读性）
- **100 分的定义必须写死**：100 = 「该主题下优秀人类文章的典型水平」，**不是**「完美」。120 = 「超过典型优秀水平」，**且必须同时满足**：≥2 条可引用原文的超额证据（新事实/新框架/可复用方法论/罕见一手经验）+ veto 为空。
- **低分不报精确值**：<60 只报区间（“<60，落在不合格带”），因为边界样本噪声最大而信息价值最低。

**合成规则**：`门禁 = (veto 空) ∧ (score ≥ 阈值)`；`score = 四维等权求和`。两轴不互相修正（分数不能把 Reject 拉回 Pass，反之亦然）。

**阈值设定（一次，30 篇，冻版）**：见 §3 落地形态；初始建议阈值 60（对应「最低可读」），并明确阈值是**策略参数**而非测量结果。

**防膨胀与防漂移机制（按可执行性排序）**

| 机制 | 具体做法 | 依据 |
|---|---|---|
| 强制证据引用 | 每一处加减分必须附原文片段（≥15 字）；无证据的加减分视为无效并作废该维 | MQM 的 critical error 与证据导向；LLM 判分需 grounded 证据（综述：https://arxiv.org/abs/2411.15594） |
| 逐维独立提问 | 4 个维度分 4 次提问，而不是一次要 4 个分 | 前轮结论「rubric 显式化 + 逐维独立提问」收益最高 |
| 双序成对比较（仅边界/顶档） | 60±5 分与拟给 100/120 的样本，与锚例做 A/B 与 B/A 平均 | 位置偏差缓解：https://arxiv.org/abs/2411.15594 ；CJ 元分析：https://doi.org/10.3758/s13428-025-02744-w |
| 多次采样取中位 | 同一样本 3 次独立判定取中位数；3 次极差 >15 分 → 报告标记「不稳定」 | 前轮结论「多次采样取中位」 |
| 顶档稀缺约束 | S/120 通过硬条件（≥2 条超额证据）触发；若一个批次内 S 档比例 >5% 或 A 档 >30%，强制复核 | 顶端档位一旦可达即膨胀：A 档 43%（https://doi.org/10.1177/016146811211400707 ） |
| 锚例回测 | 固定 30 篇锚例，每会话首次使用或每 50 篇重跑一次；分数漂移 >5 分即报告漂移，不改分 | 评分者严厉度确实会随时间漂移（https://doi.org/10.3758/s13428-022-01997-z ） |
| 独立于作者模型 | 判定者与被判文本的作者模型相同时，报告标记「自偏好风险」 | 自增强偏差：https://arxiv.org/abs/2411.15594 |
| 报告置信度 | 输出低/中/高：低 = 重测不一致或命中边界；高 = 3 次一致且距阈值 >10 分 | 与 NeurIPS 的 confidence 字段同构（https://neurips.cc/Conferences/2024/ReviewerGuidelines ） |

**输出模板（建议）**

```
门禁：Pass | Borderline | Reject     （veto 命中项：无 / 见下）
档位：C(60-79) | B(80-99) | A(100-119) | S(120)
分数：83 / 120       置信度：中
维度：信息增量 3/5 | 论证与证据 4/5 | 结构 3/5 | 表达 4/5
证据引用：①"……"（第 3 段）②"……"（结论）
顶档条件（仅 S）：证据1=…；证据2=…
不稳定标记：3 次判定 78/83/91（中位 83）
```

### 5.2 备选方案 M2：参照集 + 成对比较（Bradley–Terry / Elo）

- 做法：冻结 20–50 篇参考集（人工标定档位），新文章与其中 2–3 篇「相邻锚例」做双序成对比较，用 Bradley–Terry/Elo 估计相对位置，再把相对位置映射回 5 档。
- 收益：跨文本可比性最强（相对判断比绝对打分更稳：https://arxiv.org/abs/2411.15594 ）；天然抗膨胀（位置是相对的）。
- 代价：需要冻结参照集；每篇判定成本上升（+2–3 次成对判定）；Elo 类估计本身不稳定（https://arxiv.org/abs/2505.03475 ）；无法给出「120 分」这类直觉表达；单篇即时筛选场景不适用。
- 适用：批量筛选（一次 10–50 篇）时作为 M1 的**校准通道**，而不是默认通道。

### 5.3 备选方案 M3：单轴 5 档（降级路径）

- 做法：只输出 5 档（拒绝 / 凑合 / 可用 / 好 / 非常好），档位边界由锚例定义，不输出分数。
- 收益：最稳（4–7 档是可靠性平台区，https://doi.org/10.1027/1614-2241.4.2.73 ）；实现成本最低。
- 代价：丢失用户要的粒度；门禁与质量混轴（无法表达「两篇都不合格，但一篇 30 一篇 45」）。
- 触发条件：若 M1 上线后发现「重测中位差 >10 分」的比例 >20%，退到 M3。

### 5.4 取舍一览

| 维度 | M1 串行两轴 | M2 参照集排序 | M3 单轴 5 档 |
|---|---|---|---|
| 表达力 | 高（门禁 + 分数 + 档位） | 中（相对位置） | 低 |
| 跨文本可比性 | 中（靠锚例与阈值维护） | 高 | 中 |
| 抗膨胀 | 中（需硬规则维持） | 高 | 高 |
| 单篇即时判定 | 支持 | 不适用 | 支持 |
| 实现成本 | 中 | 高 | 低 |
| 主要风险 | 分数漂移 | 参照集漂移 / Elo 不稳定 | 粒度不足 |

---

## 6. 问题六：不确定项（明确列出）

1. **Google 质量评分指南的档位体系未取到一手 PDF**（多路代理与直连均失败：522/403/520）。目前只有搜索引擎摘要给出「Page Quality (PQ) rating 与 Needs Met (NM) rating 两轴」的官方原文片段；**档位名称（如 Lowest–Highest、Fails to Meet–Fully Meets）与判定细则【待核实】**。→ https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf
2. **MQM 的具体错误权重数值（minor/major/critical 各计多少罚分）未从官方页面取到【待核实】**；官方页只确认了「错误数 × 错误类型权重」的乘加结构与三档严重度定义。
3. **Germany 15 分制的官方（KMK）来源未取到**，现引用的是一份民间指南站的描述（引文已标注）。「1+ 高于 1」这一点若要写进产品文案，建议再核官方表 **【待核实】**。
4. **美国 A+ / 英国 A\* 的一手来源未取到【待核实】**；本轮未采用的「S 档/游戏评级」等先例同样缺一手来源。
5. **「20–50 篇锚例」是实践建议而非实验结果**：标准设定领域用的是 10–20 名专家与专门流程（Angoff/Bookmark/Hofstee），LLM 判分场景下「多少锚例才够」没有直接实证 **【待核实】**。
6. **两轴并行会造成相互污染的实证未找到**（本文按机制推断给出建议）**【待核实】**。
7. **Einhorn 1970 非补偿决策模型**的经典出处本次 DOI 解析失败（解析结果指向另一篇论文）**【待核实】**；如要在文档里引用，需重新核对 *Psychological Bulletin* 原文。
8. **顶档稀缺阈值（S ≤5%、A ≤30%）是设计参数，不是实证结论**；它们的作用是触发人工复核，而不是修正分数。
9. 任务书提供的前轮结论（MT-Bench κ 缩水 33.8–41.3 pp、重测一致性 >0.95 与位置偏差 >0.10 并存、κ<0.4 维度重写）**本次未复核原始出处**，引用时需注明来自前轮调研。

---

## 附录：证据索引（全部 URL）

**内容/文本评级制式**
- MQM 术语与分值：https://www.themqm.org/guidance/values-and-scores/
- MQM 计分模型：https://www.themqm.org/mqm-pillars/the-mqm-scoring-models/
- MQM Multi-Range 理论（arXiv）：https://arxiv.org/abs/2405.16969 ｜ HTML：https://arxiv.org/html/2405.16969v2
- ISO 2859-2:2020 抽样标准：https://www.iso.org/standard/64505.html
- NeurIPS 2024 审稿指南（评分 + 置信度）：https://neurips.cc/Conferences/2024/ReviewerGuidelines

**尺度、漂移、膨胀**

- Lozano et al. 2008（4–7 档最优）：https://doi.org/10.1027/1614-2241.4.2.73 ｜ PDF：https://pdfs.semanticscholar.org/2ad4/5d4047f00b3c38467119706182e64408f37f.pdf
- Rojstaczer & Healy 2012（A 档 43%）：https://doi.org/10.1177/016146811211400707
- Leckie & Baird 2011（中心化倾向）：https://doi.org/10.1111/j.1745-3984.2011.00152.x
- Bayesian MFRM 与严厉度漂移：https://doi.org/10.3758/s13428-022-01997-z
- 同行评审可靠性（PNAS 2018）：https://doi.org/10.1073/pnas.1714379115
- IRR 的范围内限制陷阱：https://doi.org/10.1111/rssa.12681
- 公开评审的 κ 与 ICC：https://doi.org/10.1087/20100207

**成对比较 / 排序 / LLM 判分**

- Comparative Judgement 元分析（101 数据集）：https://doi.org/10.3758/s13428-025-02744-w
- MT-Bench / LLM-as-a-judge（偏差与人类一致性）：https://arxiv.org/abs/2306.05685
- Chatbot Arena（成对比较 + 众包）：https://arxiv.org/abs/2403.04132
- am-ELO（Elo 不稳定性）：https://arxiv.org/abs/2505.03475
- LLM-as-a-Judge 综述（绝对打分不如相对比较、自偏好、位置偏差缓解）：https://arxiv.org/abs/2411.15594
- Prometheus 2（rubric 逐分描述 + 直接评估/成对排序）：https://arxiv.org/abs/2405.01535
- 代理奖励过优化（Goodhart）：https://arxiv.org/abs/2210.10760

**锚定 / 标准设定**

- King et al. 2004 anchoring vignettes：https://doi.org/10.1017/s000305540400108x
- 「Slipping Anchor?」（两假设被拒）：https://doi.org/10.1353/jhr.2011.0005
- vignette 领域/选择敏感性：https://doi.org/10.1111/j.1467-985x.2011.00704.x
- 青少年场景的 vignette 校正：https://doi.org/10.1027/1015-5759/a000336
- Angoff vs Bookmark 效度比较：https://doi.org/10.1186/s12909-020-02436-3
- 同一材料三种方法切分点差异（62%/71%/65.9%）：https://doi.org/10.3109/0142159x.2013.778395
- Angoff 系统综述与元分析（2025）：https://doi.org/10.1186/s12909-025-08300-6

**多维合成 / 结构先例**

- 论证质量维度与合成难题（Wachsmuth et al. 2017）：https://aclanthology.org/E17-1017.pdf ｜ DOI：https://doi.org/10.18653/v1/E17-1017
- Saaty-ANP 缺陷：https://doi.org/10.1016/j.orp.2022.100244
- 一因/非补偿决策：https://doi.org/10.1007/s11166-008-9042-0
- consider-then-choose（先筛选后排序）：https://doi.org/10.1287/mnsc.2020.3681
- ESI 分诊（5 级）：https://doi.org/10.1111/j.1553-2712.2003.tb00577.x

**其他**

- 德国 15 分制（民间指南）：https://www.lehrerplan.de/ratgeber/abitur-notenschluessel
- Google 搜索质量评分指南（官方 PDF，本轮未能下载）：https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf
