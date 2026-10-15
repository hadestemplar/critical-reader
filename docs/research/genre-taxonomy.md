# 文章体裁分类与适用性判定：调研与设计建议

- 项目：`critical-reader`（给 AI agent 用的文章筛选器，输出「值不值得读」的判定报告）
- 调研日期：2026-10-13
- 结论强度约定：凡标 **【待核实】** 者，或来自搜索引擎摘要而非原文页面，或原文页面未能成功抽取正文；其余论断均附可访问 URL。
- 调研工具与限制：本次调研期间 DSH 的 `web_search` / `read_page` 桥接不可用（下辖 firecrawl 返回 429、本地引擎抓取失败），改用本地 `anysearch` CLI（`C:\Users\hades\.dsh\skills\anysearch\scripts\anysearch_cli.js`，以捆绑 Node 执行）+ Node 原生 `fetch`。部分站点（Wikipedia、MDPI、bmj.com、PMC、libguides、patents 详情页）拒绝抓取，相关条目只能取到搜索摘要，已逐条标注。

---

## 0. 结论摘要

1. **主推方案**：不要做「先硬分类、再决定要不要用本工具」的单标签门控。改为输出**两个正交量**——① 多标签体裁标注（7 类，闭集）② 论证性分数（0–1，含置信度）——再由二者共同决定**三档处置**：A 全量批判性审查 / B 降级审查（只审查文中可被论证化的主张子集）/ C 不进入论证审查，转入非论证型快筛。
2. **对非论证型文章要给第二套判据**，但必须换名字、换判据，不能套用「批判性思维」。理由见 §7.4。
3. 现有证据一致指向：**混合体裁是常态**（Reiss 的 hybrid types、Santini 的 zero-to-multi-genre），硬性互斥分类会系统性误杀。

---

## 1. 现成的体裁 / 文本类型学体系

### 1.1 传统修辞模式（rhetorical modes）

出处：Texas A&M OER《Rhetorical Modes of Writing》
<https://odp.library.tamu.edu/informedarguments/chapter/rhetorical-modes-of-writing/>

原文要点（逐条对应）：
- 「Typically speaking, the four major categories of rhetorical modes are narration, description, exposition, and persuasion.」
- narration：讲故事；description：调用感官细节让读者「如临其境」；
- **exposition**：目的「to explain or inform」，其下再分 classification / evaluation / process / definition / comparison-contrast / cause-effect；
- **persuasion**：通过呈现一种观点对立于另一种并明确站边来说服。

传统五模式的常见第五类是「抒情/抒情性描写」，其系统性出处见 Wikipedia《Modes of discourse》<https://en.wikipedia.org/wiki/Modes_of_discourse>（该页本次未能抓取，分类细节 **【待核实】**）。

**对本项目的意义**：修辞模式是**句子/段落级的表达方式**，不是文档级体裁。教程文里可以有整段说明+若干议论，议论文里可以有叙事开篇。因此它只能作为「篇章单元角色」特征使用（中文自动评阅实践中正是这么用的，见 §5.4），不能直接当文档标签。

### 1.2 功能翻译学的 text typology（Reiss）及其批评

出处：Munday《Introducing Translation Studies》摘录 PDF（含 Reiss 类型学表格）
<https://newuniversityinexileconsortium.org/wp-content/uploads/2022/07/Week-7-Text-types-Munday-2016.pdf>

- 三类：**informative**（传递内容）/ **expressive**（传递审美形式）/ **operative**（引发期望的反应）。对应不同翻译策略，Munday 表格中分别标注为 «Plain prose», «Identifying method, adopt the perspective of the ST author», «Adaptive method, equivalent effect»。
- Reiss 自己提出过第四类，且明确文本类型与体裁（genre）是两个层级的概念（Reiss 1971/2000: 58），并在文中提出「是否能依据……区分 text types 与 genres」的问题（Munday PDF 原文即以此设问）。
- **关键批评一：混合文本**。Munday PDF：「Despite the existence of such hybrid types, Reiss (1977/1989: 109) states…」；FDR 第四次就职演说是被 Reiss 称为 hybrid text 的实例，同时具备 operative 与 expressive 功能 <https://www.easpublisher.com/get-articles/974>。通俗表述见 <https://translationai.app/guide/text-types-reiss-and-why-they-matter.html>：「Real texts blend types. A scientific paper is informative in body and operative in its abstract (it argues that you should accept its results).」
- **关键批评二：切分过粗、边界依赖功能判断**。<https://www.ukessays.com/essays/english-language/scope-and-limitations-of-reiss-text-typology-english-language-essay.php>（学生论文站，证据等级低，仅作观点反映）。

**对本项目的意义**：Reiss 的「同一篇文本可同时属于多类」是**支持多标签**、**反对硬门控**的直接理论依据。

### 1.3 genre theory：Swales / Bhatia

- **Swales 的 move analysis / CARS 模型**（Create a Research Space，1990）：学术论文引言由三个「move」构成，每个 move 下辖若干 step。来源：USC 写作指南原文「three actions [Swales calls them 'moves'], accompanied by specific steps… development of an effective introduction」 <https://libguides.usc.edu/writingguide/CARS>；概述页 <https://en.wikipedia.org/wiki/CARS_model>（本次未能抓取）。另见 Devitt 论文引用（将 CARS 描述为「typical rhetorical moves in RA introductions」） <https://kuscholarworks.ku.edu/server/api/core/bitstreams/8c20da0b-d48d-4e38-8cdd-94c5ba1874ad/content>
- **Bhatia 的专业体裁分析 / critical genre analysis**：把体裁视为专业社群为实现职业目标而使用的、带规约性的交际事件，强调体裁的内部修辞结构与外部职业语境双向分析。来源（正文未成功抽取，具体表述 **【待核实】**）：<https://tidsskrift.dk/her/article/download/22944/20054>
- **genre 与 text type 的区分**（Paltridge 1996）：genre 依据**外部标准**（交际目的、场合、读者）分类，text type 依据**语言相似性**分类，二者不是一回事 <https://academic.oup.com/eltj/article-abstract/50/3/237/2924374>
- **genre 的定义（现代语料库视角）**：Automatic Genre Identification (AGI) 综述将 genre 定义为「text categories defined by the author's purpose, common function of the text, and the text's conventional form」 <https://dl.acm.org/doi/10.1007/s10579-023-09695-8>
- **genre 作为知识组织范畴**：IEKO《Encyclopedia of Knowledge Organization》"Genre"（Pauline M. Rafferty），其目录含「Genre as classification: from ontological to historical analysis」「Genre, fiction and knowledge organization」「LC Genre/Forms Terms」等节 <https://www.isko.org/cyclo/genre.htm>

**对本项目的意义**：「体裁」= 目的+功能+惯例形式的函数，这正是「成功标准随体裁变化」的理论根源（§2 映射表）。也说明：判定体裁必须读**功能意图**，不能只读语言表面特征。

### 1.4 新闻报道与自媒体内容的常见内容分类

- 新闻/评论二分（图书馆界的实务分类）：CSUSM 新闻素养指南「News content is divided into distinct categories. OPINION / Editorial — An unsigned opinion piece that represents the views of the news [organization]…」 <https://libguides.csusm.edu/news/different_news_types>；另一份图书馆指南直接把该主题命名为「News vs. Editorials and Opinion Pieces」 <https://libguides.greenriver.edu/newsliteracy/opinion>（两页正文均未成功抓取，断言取自搜索结果摘要）
- **硬新闻**：「In journalism, hard news refers to a style and genre that focuses on timely and consequential events.」 <https://www.britannica.com/topic/hard-news>
- **软新闻**：以情感、猎奇、人格化为中心，学界对其定义与测量有系统讨论 <https://journals.sagepub.com/doi/10.1177/1461444820975411>
- **中文语境**：新闻体裁在实务上按「消息 / 通讯 / 评论 / 特写」等划分；中文百科对「评论」的定义为「一种政论性的新闻体裁……通过对新近发生的新闻事件或社会问题进行分析和议论，直接阐明观点」 <https://baike.baidu.com/item/%E8%AF%84%E8%AE%BA/5040426>（摘要级证据）

**对本项目的意义**：新闻体裁内部就存在「报道（低论证性）/ 评论（高论证性）」的强异质性。把「新闻」整体判为不适用，会把评论类文章一起丢弃，这是分类粒度的直接证据。

### 1.5 非形式逻辑：argument / explanation / exposition 的区分标准

- **论证的定义**（Stanford Encyclopedia of Philosophy, "Argument"）：「An argument can be defined as a complex symbolic structure where some parts, known as the premises, offer support to another part, the conclusion.」；「Argumentation can be defined as the communicative activity of producing and exchanging reasons in order to support claims or defend/challenge positions, especially in situations of doubt or disagreement (Lewiński & Mohammed 2016).」 <https://plato.stanford.edu/entries/argument/>
- **语用辩证学（van Eemeren 等）**：论证被视为一种复杂言语行为，带有类似 Searle 的适切性条件；标准分析含四个阶段（confrontation / opening / argumentation / concluding）；独白式论证也被当作「对一场批判性讨论的贡献」来分析。来源：Hitchcock 对 van Eemeren 编《Advances in Pragma-Dialectics》的书评 <https://www.humanities.mcmaster.ca/~hitchckd/advances.htm>
- **论证 vs 解释的关键操作判据**（§1.5 最重要的一段，直接决定自动化难度）：该书第 11 章（Houtlosser）分析汉语/英语中 "because" 一类连词的三种用法——(1) 若引出的是**结果**（"She must be very brave, because she never complains"），则是**辩护**（提出立场）；(2) 若引出的是**原因**，则可能是「因果论证」也可能是「因果解释」：因果论证辩护说话人的行为或心理状态，因果解释不辩护任何立场；(3) 为他人行为/心理给出的理由往往属于**解释**（"Hank did not come to the party, because he does not like large crowds"）。其结论原文：「It is a difficult matter to determine whether a particular use of a particle like 'because' is inferential or causal, and a fortiori a difficult matter to construct an adequate theoretical basis for making this determination.」
- **论证与解释的差别在于是否「回应怀疑」**：Govier 的判据（经 Botting 转述）——论证展示「how doubts could be resolved, were they to occur」 <https://rozenbergquarterly.com/issa-proceedings-2014-reasons-why-arguments-and-explanations-are-different/>；相关新近讨论：<https://www.sciencedirect.com/science/article/pii/S0271530925001338>
- **论证图式（argumentation schemes）**：Walton, Reed & Macagno 2008 归纳的 60+ 种常见论证型式（sign、类比、因果、专家意见……），是「一个论断用哪种方式被支持」的分类表 <https://en.wikipedia.org/wiki/Argumentation_scheme>；工程化清单 <https://www.reasoninglab.com/argumentation-schemes-list/>；批评性评估见 Lumer 2022「Walton's Argumentation Schemes」 <https://informallogic.ca/index.php/informal_logic/article/view/7224/5378>

**对本项目的意义**：判据「前提是否支持结论」只对**论证**成立。对**解释**，批判性追问（前提是否成立？推理是否有效？）不适用，因为解释不承担「消解怀疑」的义务。这是「分类必须前置」的最硬理论依据。

### 1.6 中文语境的体裁体系

- 二分体系：**文章体裁**＝记叙文 / 说明文 / 议论文 / 应用文；**文学体裁**＝诗歌 / 小说 / 戏剧 / 散文 <https://baike.baidu.com/item/%E6%96%87%E7%AB%A0%E4%BD%93%E8%A3%81/10803456>
- **议论文三要素**：论点 / 论据 / 论证——中文教学与自动批改的事实标准框架，已被直接工程化为专利方案：「自动提取论点并对论点评级，自动提取论据并对论据的论证作用评级」 <https://patents.google.com/patent/CN112784878A/zh>
- 中文作文自动评阅实践中，「通过识别记叙、议论、描写、抒情、说明等表达方式作为篇章单元角色」 <https://zhuanlan.zhihu.com/p/193104666>
- 议论文标注规范研究（面向中学生议论文、论辩类型对论据分类、论辩关系从纵向/横向两维划分 15 种关系） <https://www.airitilibrary.com/Article/Detail/0219810X-N202607020010-00002>（题录级证据，正文不可得）

**对本项目的意义**：中文语境已有「议论文 vs 说明文 vs 记叙文」的成熟心智模型，且有可复用的三要素（论点/论据/论证）判据；但中文的「说明文」与外文 rhetorical exposition 并不完全对应，跨语言迁移需谨慎。

---

## 2. 映射表：体裁 → 成功标准 → 典型失败模式 → 是否适用批判性审查

| 体裁 | 该体裁的「成功标准」 | 典型失败模式 | 适用批判性审查？ | 建议处置档 |
|---|---|---|---|---|
| **论证/评论类**（社论、时评、辩论稿、立场文章） | 主张明确、前提成立、推理有效、回应最强反方、结论与前提自洽 | 单一来源、诉诸情绪、稻草人、循环论证、隐含假定未辩护 | **是（核心场景）** | A |
| **学术/技术论证类**（论文、预印本、技术博客中的论辩段） | 问题—方法—证据—结论链条完整、可复现、局限性明示 | 混淆相关与因果、过度外推（非人类研究→人类）、p-hacking、幸存者偏差 | **是**（但对「方法/证据」的审查权重高于「修辞」） | A |
| **教程/操作指南**（how-to、菜谱、配置指南） | 步骤可复现、前提条件与环境写全、结果可验证（Diátaxis：goal-oriented，帮助用户「correctly and safely」完成某事） | 漏掉前提/版本、环境差异、幸存者偏差（只展示成功路径）、把「我这能跑」当「通用可行」 | **否**（论证审查无效） | C＋轻量可操作性核查 |
| **技术参考/说明书**（API 文档、规格、字典式条目） | 描述准确、完整、有序、权威；Diátaxis 明确「The only purpose of a reference guide is to describe…」 | 过期、遗漏边界条件、以描述之名行推荐之实 | **否** | C（只做时效性与权威性核查） |
| **新闻报道（消息类）** | 来源可靠、事实准确、框架不偏、可追溯到一手材料 | 单一来源、事实错误、框架偏斜、**转载放大**（见下） | **否**（但事实核查适用） | C＋事实可信度快筛 |
| **科普/解释类**（explainer、科普长文） | 事实准确、因果机制交代清楚、不确定性如实呈现 | 把「解释」写成「论证」（伪因果）、夸大效应、省略不确定性、以科普之名复制新闻稿夸大 | **部分适用**：只审查其**显式主张** | B |
| **文学/叙事类**（小说、散文、诗歌） | 审美与情感效果、叙事自洽（内部一致性） | 「不真实」不是失败；事实错误通常不构成缺陷 | **否** | C（不审查；明示不适用） |
| **营销/说服文案** | 达成说服效果（Reiss: operative, equivalent effect） | 「效果导向」天然与「真相导向」冲突：夸大承诺、隐藏成本、制造紧迫 | **是，但目标不同**：不是评「推理是否有效」，而是暴露其说服手段与未言明代价 | B（说服手法解剖） |
| **个人随笔/观点帖** | 表达清晰、立场可辨 | 用个人体验冒充普遍结论、以轶事代证据 | **是**（轻量） | B |
| **工具/产品更新说明、公告** | 信息完整、时间/影响范围明确 | 关键影响被埋、破坏性变更未提示 | **否** | C |

**表中「新闻」一行的重要证据**：Sumner 等 2014 年 BMJ 研究（《The association between exaggeration in health related science news and academic press releases》）<https://pubmed.ncbi.nlm.nih.gov/25498121/> / <https://www.bmj.com/content/349/bmj.g7015>（正文未抓取，结论表述 **【待核实】**）；其 2019 年复制研究摘要（本次已核验原文摘要）明确：新闻中的夸大与新闻稿中的夸大相关联（对因果主张、以及从非人类研究推断到人类两类夸大成立；对「建议类」夸大的关联**未**复制成功），且**夸大的新闻稿并未获得更多报道**。来源：Bratton et al., *Wellcome Open Research*，DOI <https://doi.org/10.12688/wellcomeopenres.15486.2>

→ 对本项目的直接含义：**新闻/科普不是「不需要把关」，而是「需要另一套把关标准」**。若一律判「不适用」，用户将失去本工具在「事实可信度」这一层唯一有价值的部分。

**表中「教程」一行的证据**（Diátaxis 文档体裁框架，对「教程/指南/参考/解释」四类给出各自的成功判据）：
- 总览 <https://diataxis.fr/>
- 教程：「A tutorial is an experience… always learning-oriented」「Its purpose is not to help the user get something done, but to help them learn.」；练习须满足 meaningful / successful / logical / usefully complete <https://diataxis.fr/tutorials/>
- 操作指南：「directions that guide the reader through a problem or towards a result. How-to guides are goal-oriented.」「A how-to guide helps the user get something done, correctly and safely」「How-to guides must be written from the perspective of the user, not of the machinery」 <https://diataxis.fr/how-to-guides/>
- 解释：「Explanation is a discursive treatment of a subject, that permits reflection. Explanation is understanding-oriented.」；写法要求「explain why things are so - design decisions, historical reasons, technical constraints - draw implications」 <https://diataxis.fr/explanation/>
- 参考：「technical descriptions of the machinery… information-oriented」「The only purpose of a reference guide is to describe, as succinctly as possible, and in an orderly way.」「it should be wholly authoritative」「Neutral description is the key imperative of technical reference.」 <https://diataxis.fr/reference/>

---

## 3. 可自动判定的信号

### 3.1 argument mining 的标准任务定义

- 定义：「Argument mining is the automatic identification and extraction of the structure of inference and reasoning expressed as arguments presented in natural language.」 Lawrence & Reed, *Computational Linguistics* 45(4):765 综述 <https://direct.mit.edu/coli/article/45/4/765/93362/Argument-Mining-A-Survey>
- 典型流水线：① 论证成分（argumentative discourse unit, ADU）识别 → ② claim / premise 分类 → ③ 成分间支持/攻击关系抽取 → ④ 论证结构（树/图）。
- ADU 概念的正式化：Peldszus & Stede 2013 <https://www.ling.uni-potsdam.de/~peldszus/ijcini2013-preprint.pdf>
- 工程实现：Stab & Gurevych 2017（token 级序列标注 + 联合结构模型；其摘要称标注方案与指南可引导标注者达到「substantial agreement」） <https://aclanthology.org/J17-3005/>；特征与分类器对比：Aker et al. 2017 <https://aclanthology.org/W17-5112.pdf>
- 关于「句子级 argumentative / non-argumentative 二分类达到 0.774 accuracy」这一常被引用的数字：来源页面为 <https://direct.mit.edu/coli/article/45/4/765/93362/Argument-Mining-A-Survey>，本次仅取到搜索摘要片段、未能定位到原文对应句子 → **【待核实】**，不得直接写进设计文档当作基线。

### 3.2 显式论证指示词与篇章连接词

- 英文：Penn Discourse Treebank（PDTB）为篇章关系标注建立了事实标准 <https://aclanthology.org/W04-2703.pdf>、<https://www.lrec-conf.org/proceedings/lrec2004/pdf/618.pdf>，被描述为「largest manually annotated corpus of discourse relations to date」 <https://direct.mit.edu/coli/article/40/4/921/1485>
- 中文：
  - Xue 2005《Annotating Discourse Connectives in the Chinese Treebank》 <https://aclanthology.org/W05-0312.pdf>
  - **Chinese Discourse Treebank 0.5（LDC2014T21）**：73,000 词中文新闻（新华社）语料，约 5,500 条标注实例，采用 PDTB 体系 <https://catalog.ldc.upenn.edu/LDC2014T21>，DOI <https://doi.org/10.35111/njb6-wb02>
  - 汉语连接成分的系统描写可追溯到廖秋忠《现代汉语篇章中的连接成分》（《中国语文》1986 年第 6 期，413–427 页），见 <https://libguides.nus.edu.sg/chinesestudies/cl3203>
  - 议论文写作文本中，`and` / `because` / `but`（对应中文「并且/因为/但是」类）是最主要的篇章标记 <https://pmc.ncbi.nlm.nih.gov/articles/PMC9886202/>（正文未抓取，结论取自摘要）

### 3.3 轻量可复现的预筛特征（设计建议）

| 特征 | 计算方式（可复现） | 支持证据 | 已知风险 |
|---|---|---|---|
| 论证指示词密度 | 「因为/由于/所以/因此/然而/但是/显然/由此可见/研究表明/数据显示/综上」等词表命中数 ÷ 句数 | 中文连接成分标注资源（LDC2014T21）、PDTB 体系 | 指示词在解释文中同样高频；"because" 的论证/因果/解释歧义无法靠词表消解（§1.5 Houtlosser） |
| 论断句比例 | 含情态/评价/因果谓词的句子占比 + 句法上「主语+断言谓语」模板匹配 | argument mining 的 claim 识别任务设定 | 中文零主语、流水句多，模板鲁棒性 **【待核实】** |
| 可见对立结构 | 是否存在「有人认为…但我认为…」「反方观点」类标记 | 语用辩证学的 confrontation 阶段概念 | 大量论证文并不显式反驳 |
| 数字/引文/来源标记密度 | 引用、链接、图表标注、数据源提及计数 | CRAAP / SIFT 的来源权威性维度 <https://guides.lib.uchicago.edu/c.php?g=1241077&p=9082343> | 只测「有来源」，不测「来源是否可靠」 |
| 步骤/命令/代码块占比 | 有序列表项、代码块、命令行片段占比 | Diátaxis 的操作性体裁判据 | 只对技术类教程有效 |
| 人称与时态分布 | 第一人称叙述/过去时叙事密度 | 修辞模式理论 | 仅作辅助 |

**原则**：以上特征只用于**降低误判的旁证**与**给 LLM 判定提供可解释依据**，不作为硬门控（理由见 §6.1、§6.3）。

### 3.4 中文可迁移性评估

**可迁移**：
1. 体裁体系（议论文/说明文/记叙文/应用文）在中文教育体系内高度共识，可直接映射到本文 §2 的分类（来源见 §1.6）。
2. 中文篇章连接词的标注资源与体系已存在（CDTB/PDTB 体系、廖秋忠的连接成分描写）。
3. 议论文三要素（论点/论据/论证）已被工程化为自动批改方案，说明中文论证成分抽取在工程上可行。

**需谨慎**：
1. 中文论证常以**零形式衔接**推进（无显式连接词），指示词密度阈值不能照搬英文（**该断言为领域常识推断，未在本轮调研中取得直接实证 → 【待核实】**）。
2. 中文新闻/自媒体体裁边界比英文更模糊（「消息」「通讯」「特写」「评论」「软文」混用），中文实务分类的来源多为百科级，权威性有限。
3. 中文「说明文」覆盖范围比英文 exposition 更宽（既可指「解释原理」也可指「介绍对象」），直接映射到 B/C 档需人工校准样例。

---

## 4. 分类粒度取舍

### 4.1 三种粒度的边界互斥性与判定成本

| 粒度 | 边界互斥性 | 判定成本 | 关键问题 |
|---|---|---|---|
| **二分类**（论证型 / 非论证型） | 差。多数真实文本两侧都有成分 | 低 | 把「含论证段的科普」误判为论证型 → 用错判据；或误判为非论证型 → 漏掉真正该读的批评 |
| **三分类**（论证 / 说明 / 叙事） | 中。仍需处理「说明带论证」 | 中 | 中文教学体系天然是这一类，可解释性好 |
| **多分类 / 多标签** | 好（允许「主体裁+副体裁」） | 高（需标注体系与一致性验证） | 依赖标注规范质量；LLM 逐类判定会放大成本，可先多分类后多标签 |

**支持多标签而非单一标签的证据**：
- Reiss 的 hybrid text：同一文本同时承担 operative 与 expressive 功能（FDR 第四次就职演说实例）<https://www.easpublisher.com/get-articles/974>；技术论文「正文 informative、摘要 operative」<https://translationai.app/guide/text-types-reiss-and-why-they-matter.html>。
- Santini 的网页体裁研究结论：网页需要 **zero-to-multi-genre** 分类方案，即允许「零个体裁」或「多个体裁」 <https://www.semanticscholar.org/paper/Characterizing-Genres-of-Web-Pages-Santini>（该文题录级证据）
- 另有综述转述 Santini 提出的自动体裁识别五大挑战，其首条即「the lack of an established genre list」 <https://www.euppublishing.com/doi/pdf/10.3366/cor.2012.0020?download=true>（PDF 仅取到片段，其余四条 **【待核实】**）

### 4.2 LLM 做体裁/文本分类的稳定性证据

**正面**：
- Gilardi, Alizadeh & Kubli 2023, *PNAS* 120(30): e2305016120 / arXiv:2303.15056。已核验原文摘要：2,382 条推文；「the zero-shot accuracy of ChatGPT exceeds that of crowd-workers for four out of five tasks, while ChatGPT's intercoder agreement exceeds that of both crowd-workers and trained annotators for all tasks. Moreover, the per-annotation cost of ChatGPT is less than $0.003 — about twenty times cheaper than MTurk.」 <https://arxiv.org/abs/2303.15056>
  （注：检索到的 PNAS 版本摘要另有「exceeds that of crowd workers by about 25 percentage points on average」表述，与 arXiv v2 措辞不一致 → 引用时以 arXiv 版本为准，PNAS 版数字 **【待核实】**。）
- 「Text Classification in the LLM Era — Where do we stand?」：少样本微调相对零样本在四类任务中的三类上可带来最高约 10% 的提升 <https://arxiv.org/html/2502.11830v1>
- 文学风格研究显示 LLM 能在一定程度上区分作者与体裁，但部分能力可能来自对文本的记忆而非文体理解 <https://arxiv.org/html/2502.03647v1>

**反面（必须同等权重对待）**：
- Mizumoto 2025《Large language models fall short in classifying learners' responses》：在教育场景的分类任务上 LLM 表现不足 <https://www.sciencedirect.com/science/article/pii/S277276612500031X>
- ACL Findings 2025《Is LLM an Overconfident Judge?》：二分类判定中模型的置信度与人类分歧存在系统性偏差 <https://aclanthology.org/2025.findings-acl.293/>
- 检索到但**未能取得全文数字**的针对性研究：《Automatic Genre Identification for Robust Enrichment of Massive Text Collections: Investigation of Classification Methods in the Era of Large Language Models》(MAKE, 2023) <https://www.mdpi.com/2504-4990/5/3/59> → 该文应当给出 LLM 时代自动体裁识别的准确率对比，本次因站点拒绝抓取（HTTP 403，Akamai）未能取到具体数字，列为**首要待核实项**。

**综合判断**：LLM 在「体裁判定」上的**排序能力**（哪类更像）可靠度高于其**绝对置信度**；因此设计上应使用「多标签 + 分数」而非「单标签 + 高置信断言」，并在报告中显式给出判定理由，让用户可复核（与 Gilardi 的 intercoder agreement 结论一致：LLM 可作为标注器，但仍需一致性验证）。

---

## 5. 建议方案（可直接落地）

### 5.1 输出结构

对每篇文章输出三个字段：

```
genre_labels:   [{label, score}]         # 多标签，7 类（闭集）
argumentativeness: {score: 0..1, signals: [...]}   # 论证性分数 + 依据
disposition:    A | B | C                # 处置档
rationale:      "……"                     # 一句话可复核理由
```

**7 个类别**（兼顾中文心智模型与英文类型学；闭集，不得自造）：
1. `argument` 论证/评论类（社论、时评、立场文）
2. `academic` 学术/技术论证类（论文、研究报告）
3. `tutorial` 教程/操作指南类（含技术参考）
4. `news` 新闻报道类（消息、通讯、短讯、公告）
5. `exposition` 科普/解释类（explainer、原理讲解）
6. `narrative` 叙事/文学类（小说、散文、个人叙事、体验帖）
7. `persuasion` 营销/说服类（软文、产品推销、募资文）

（调研原文曾建议「如需压缩，可把 6 与 7 合并为 `other`」；**本协议不采用该压缩**——`references/01-genre-routing.md` 按 7 类闭集执行，见 `DECISIONS.md` #8 与 #26。）

### 5.2 三档处置

| 档 | 触发条件 | 做什么 | 不做什么 |
|---|---|---|---|
| **A · 全量批判性审查** | `argument`/`academic` 分数高，且论证性 ≥ 阈值 | 现有批判性思维判据全套：论题完整性、前提成立性、推理有效性、隐含假定、自洽闭环 | — |
| **B · 降级审查** | 说明/科普/评论混合，论证性中等 | 只抽取文中**可被论证化的显式主张**（≤3 条）逐条审查；其余部分不做推理有效性判断 | 不对描述段、步骤段、叙事段做「推理是否有效」判定 |
| **C · 非论证型快筛** | 论证性低且落 tutorial / news / narrative / reference | 换判据：可操作性（步骤完整性、前提条件）、事实可信度（来源、引用链、时效）、信息密度与冗余度；报告须显式声明「未做论证审查」 | 不使用「前提/结论/推理有效性」这类词，避免用户误解为已做批判性审查 |

**关键工程约束**：`disposition` 必须是**带理由的判定**而非静默门控；C 档报告里要写明「为什么这篇不适合用批判性思维审查」——这恰好把用户的原始诉求（「先判断适不适合用这个工具」）做成了可解释输出。

### 5.3 判定顺序（建议流水线）

1. **轻量信号层**（§3.3）：算指示词密度、步骤/代码块占比、引用密度、叙事密度——成本近零，用于识别明显单边样本（纯教程、纯叙事）。命中明显单边 → 直接进 C 档，但保留置信度。
2. **LLM 判定层**：给定 7 类定义 + 每类的成功标准与失败模式（即本文 §2 表），要求输出多标签与论证性分数，并**强制给出证据片段**。
3. **一致性校验**：对分数处于阈值带的样本，用第二次独立判定（不同提示/顺序打乱）做一致性检查；不一致则降级为 B 档并标注低置信（依据：LLM 置信度不可靠，见 §4.2）。
4. **分档执行**：A/B/C 各按 §5.2 执行。

### 5.4 非论证型文章：第二套判据 vs 判「不适用」——必须做的正面回答

**结论：要给第二套判据，但必须换名、换判据、换报告口径。**

| 方案 | 增量成本 | 收益 | 风险 |
|---|---|---|---|
| **甲：一律判「不适用」** | 最低：判据、标注、评测都不需要 | 结果诚实；不会被质疑用错判据 | 用户多数输入被拒，工具「省时」价值被削弱（这正是用户已识别的风险）；且把「不需要论证审查」误报成「没有质量风险」——与 §2 中新闻夸大证据矛盾 |
| **乙：加第二套判据（信息价值/可操作性/事实可信度），但沿用「批判性审查」名义** | 中：需新判据 + 新评测 | 覆盖面最大 | **判据混淆**：用户会以为事实可信度审查等同于论证审查；LLM 也容易把两套标准混用 |
| **丙（推荐）：加第二套判据，且显式分档命名（C 档＝非论证型快筛，明确声明未做论证审查）** | 中：新判据（可直接复用成熟清单，降低自研成本）+ 分档报告模板 | 覆盖长尾输入，同时保住判据纯度；用户能一眼看出「这篇被用什么标准筛过」 | 需要维护两套判据的失败模式与样例库 |

**第二套判据建议直接复用成熟清单的子集**，不要自研：
- **来源可信度**：CRAAP（Currency / Relevance / Authority / Accuracy / Purpose） <https://guides.lib.uchicago.edu/c.php?g=1241077&p=9082343>、<https://researchguides.ben.edu/source-evaluation>
- **横向核实（lateral reading / SIFT）**：不看页面自证，而是离开该页面去核对其主张 <https://guides.lib.uchicago.edu/c.php?g=1241077&p=9082322>；教学实证 <https://misinforeview.hks.harvard.edu/article/lateral-reading-college-students-learn-to-critically-evaluate-internet-sources-in-an-online-course/>；综述 <https://www.sciencedirect.com/science/article/abs/pii/S2352250X23001823>；新闻可信度测量 <https://crl.acrl.org/index.php/crl/article/view/24514/32348>
- **可操作性**（教程类专用）：Diátaxis 的成功判据（前提条件、可复现性、safety）见 §2 表。

**代价的量化前提（尚缺）**：两种方案的取舍最终取决于**用户实际输入分布**——如果非论证型占比 80%，方案甲几乎等于「工具不可用」；若只占 20%，方案甲更省成本。该分布是**必须先测的经验事实，目前未知**（见 §6）。建议：先取 20–50 篇真实输入做体裁标注，得到分布后再决定是否投入方案丙的第二套判据。

---

## 6. 不确定项与待核实清单

1. **《Automatic Genre Identification … in the Era of Large Language Models》(MAKE 2023) 的具体准确率数字**：站点拒绝抓取（HTTP 403），本文未能取得任何数值。<https://www.mdpi.com/2504-4990/5/3/59> —— 这是本报告最重要的缺口，直接关系到 §4.2「LLM 能否稳定做体裁分类」的强度。
2. **「句子级论证性二分类 0.774 accuracy」**：仅见于搜索摘要，未在原文定位 → 不可作为基线引用。<https://direct.mit.edu/coli/article/45/4/765/93362/Argument-Mining-A-Survey>
3. **Sumner 2014（BMJ）的原始百分比数字**（如夸大比例、新闻与新闻稿对应率）：正文未抓取，仅使用 2019 年复制研究的摘要结论。原始论文：<https://www.bmj.com/content/349/bmj.g7015>
4. **中文论证文的「表述手段」**：哪些中文句式最可靠地表征「提出主张」与「给出理由」，本轮未找到可引用的实证研究（只有专利与标注规范题录）。
5. **用户真实输入分布**：非论证型文章的占比未知。这是决定 §5.4 选择甲/丙方案的关键前提，需实测。
6. **Wikipedia《Modes of discourse》的第五模式（抒情）的系统出处**：页面未能抓取。
7. **Bhatia 的体裁定义原文**：出处页面正文未成功抽取，本文仅以概述方式引用，未逐字引用。
8. **中文新闻体裁的权威分类来源**：本次只能取到百科与新闻培训网站级来源，缺学术或行业标准（如国标/新闻行业规范）——**待核实是否存在权威标准**。
9. **「中文论证更多依赖零形式衔接」**：属领域推断，本轮无直接实证。
10. **Santini 五项挑战的完整列表**：仅取到第 1 条（缺公认体裁清单），其余 4 条待核实。

---

## 7. 主要来源清单（全 URL）

**类型学与体裁理论**
- https://odp.library.tamu.edu/informedarguments/chapter/rhetorical-modes-of-writing/
- https://en.wikipedia.org/wiki/Modes_of_discourse
- https://newuniversityinexileconsortium.org/wp-content/uploads/2022/07/Week-7-Text-types-Munday-2016.pdf
- https://translationai.app/guide/text-types-reiss-and-why-they-matter.html
- https://www.easpublisher.com/get-articles/974
- https://www.ukessays.com/essays/english-language/scope-and-limitations-of-reiss-text-typology-english-language-essay.php
- https://libguides.usc.edu/writingguide/CARS
- https://en.wikipedia.org/wiki/CARS_model
- https://kuscholarworks.ku.edu/server/api/core/bitstreams/8c20da0b-d48d-4e38-8cdd-94c5ba1874ad/content
- https://tidsskrift.dk/her/article/download/22944/20054
- https://academic.oup.com/eltj/article-abstract/50/3/237/2924374
- https://dl.acm.org/doi/10.1007/s10579-023-09695-8
- https://www.isko.org/cyclo/genre.htm

**论证 / 解释 / 非形式逻辑**
- https://plato.stanford.edu/entries/argument/
- https://www.humanities.mcmaster.ca/~hitchckd/advances.htm
- https://rozenbergquarterly.com/issa-proceedings-2014-reasons-why-arguments-and-explanations-are-different/
- https://www.sciencedirect.com/science/article/pii/S0271530925001338
- https://en.wikipedia.org/wiki/Argumentation_scheme
- https://www.reasoninglab.com/argumentation-schemes-list/
- https://informallogic.ca/index.php/informal_logic/article/view/7224/5378

**argument mining 与篇章连接词**
- https://direct.mit.edu/coli/article/45/4/765/93362/Argument-Mining-A-Survey
- https://www.ling.uni-potsdam.de/~peldszus/ijcini2013-preprint.pdf
- https://aclanthology.org/J17-3005/
- https://aclanthology.org/W17-5112.pdf
- https://aclanthology.org/W04-2703.pdf
- https://www.lrec-conf.org/proceedings/lrec2004/pdf/618.pdf
- https://direct.mit.edu/coli/article/40/4/921/1485
- https://aclanthology.org/W05-0312.pdf
- https://catalog.ldc.upenn.edu/LDC2014T21
- https://doi.org/10.35111/njb6-wb02
- https://libguides.nus.edu.sg/chinesestudies/cl3203
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9886202/

**新闻与传播**
- https://libguides.csusm.edu/news/different_news_types
- https://libguides.greenriver.edu/newsliteracy/opinion
- https://www.britannica.com/topic/hard-news
- https://journals.sagepub.com/doi/10.1177/1461444820975411
- https://pubmed.ncbi.nlm.nih.gov/25498121/
- https://www.bmj.com/content/349/bmj.g7015
- https://doi.org/10.12688/wellcomeopenres.15486.2
- https://baike.baidu.com/item/%E8%AF%84%E8%AE%BA/5040426

**文档体裁（教程/指南/参考/解释）**
- https://diataxis.fr/
- https://diataxis.fr/tutorials/
- https://diataxis.fr/how-to-guides/
- https://diataxis.fr/explanation/
- https://diataxis.fr/reference/

**LLM 标注可靠性**
- https://arxiv.org/abs/2303.15056
- https://www.mdpi.com/2504-4990/5/3/59
- https://www.sciencedirect.com/science/article/pii/S277276612500031X
- https://aclanthology.org/2025.findings-acl.293/
- https://arxiv.org/html/2502.03647v1
- https://arxiv.org/html/2502.11830v1

**非论证型内容的替代判据**
- https://guides.lib.uchicago.edu/c.php?g=1241077&p=9082343
- https://researchguides.ben.edu/source-evaluation
- https://guides.lib.uchicago.edu/c.php?g=1241077&p=9082322
- https://misinforeview.hks.harvard.edu/article/lateral-reading-college-students-learn-to-critically-evaluate-internet-sources-in-an-online-course/
- https://www.sciencedirect.com/science/article/abs/pii/S2352250X23001823
- https://crl.acrl.org/index.php/crl/article/view/24514/32348

**中文体裁与自动批改**
- https://baike.baidu.com/item/%E6%96%87%E7%AB%A0%E4%BD%93%E8%A3%81/10803456
- https://patents.google.com/patent/CN112784878A/zh
- https://patents.google.com/patent/CN112527968A/zh
- https://www.airitilibrary.com/Article/Detail/0219810X-N202607020010-00002
- https://zhuanlan.zhihu.com/p/193104666
- https://www.ce-jeme.org/cgi/viewcontent.cgi?article=1062&context=journal

**分类粒度**
- https://www.semanticscholar.org/paper/Characterizing-Genres-of-Web-Pages-Santini
- https://www.euppublishing.com/doi/pdf/10.3366/cor.2012.0020?download=true
- https://aclanthology.org/2006.jeptalnrecital-long.28.pdf
