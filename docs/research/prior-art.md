# 先例与可复用件对标调研（prior-art）

> 项目：critical-reader —— 面向 AI Agent 的「文章批判性阅读协议包」（判定流程 + rubric + 报告模板）+ 无 LLM 输入解析薄壳。
> 调研日：**2026-10-13**（Asia/Shanghai）。GitHub 数据一律为 **2026-10-13 抓取**（api.github.com，匿名配额）。
> 检索通道：本机 `anysearch` CLI（`web_search` / `read_page` 桥接当日整体 429 不可用）。
> 本文件只回答一件事：**哪些先例/构件已经存在，哪些可以直接抄，哪些只能参考。**

---

## 0. 结论先行

1. **读者侧「这篇文章值不值得读」的开源协议包，没有现成实现。** 最接近的两个是 `SerhiiKorniienko/bullshit-detector`（MIT，claim 级五档判定 + 0–10 分 + 无密钥抓取）与 `superwesleyhys-ux/factcircuit`（MIT，证据锚定 + 不可变溯源）。二者可直接借用结构。
2. **最接近的行业先例是 NewsGuard 的 9 条加权 pass/fail 评分（22/18/12.5/12.5/10/7.5/7.5/5/5，合计 100）**，且它明确把「讽刺站 / 平台站」排除出打分体系——与本项目 `genre-taxonomy.md` 的体裁分档同构。但它是**站点级**不是文章级，且文案专有，只能重写不能抄。
3. **能安全抄/译的权威 rubric 只有两类**：CC BY 4.0 的 **PLOS《Ten simple rules for reading a scientific paper》**，以及 MIT/Apache 的开源技能与代码（bullshit-detector、factcircuit、FActScore、MiniCheck、LettuceDetect）。CASP 与 AAC&U 是 **BY-NC-SA**，JBI 是**明令禁止复制**，Wikipedia 是 **BY-SA**（传染）——这四类都不能进商用协议包。
4. **rubric 工程学已有系统综述**：`RUC-NLPIR/Rubrics_Survey`（论文《The Rules of the Game: A Survey of Rubrics for LLMs》，2026-05-18 首版）；rubric 演化机制看 `rlresearch/dr-tulu`（Apache-2.0）。可作方法论依据，不可抄条目。
5. **中文侧空档明确**：「AI 味」特征库（MIT，最高 1.7 万星）与公众号**发布前**质量门禁技能（MIT，★0–1）都比**读者侧**批判工具成熟；读者侧中文批判性阅读打分工具本轮未发现任何开源实现。

---

## 1. 检索边界：本报告刻意不重复的部分

同目录已有两份调研，另有本轮期间落地的 `methodology.md`。分工如下，**本报告不重复其结论**：

| 文件 | 已覆盖内容 | 本报告的处理 |
|---|---|---|
| `genre-taxonomy.md` | 体裁分类（5+1 类）+ 论证性分数 + 三档处置；已引用 CRAAP / SIFT / Diátaxis | 不再罗列这些框架，只在与先例对照时引用结论 |
| `rating-design.md` | 门禁 + 质量分制式；已引用 Wachsmuth 论证质量维度、MQM/Lozano 档位、Prometheus 2、MT-Bench、Chatbot Arena、NeurIPS 2024 审稿指南 | 不重复；本报告补的是**产品/项目先例**与**许可可抄性** |
| `methodology.md`（本轮新出现，503 行） | 思维质量评估**框架全景**：Toulmin / Paul-Elder / Bloom / 情报分析 SATs / 法律医学 / 新闻核实（SIFT、CRAAP）/ 论证挖掘；中文文本特殊问题；对输入指南的批判 | 不重复框架评述；本报告只做**产品与开源先例**、**rubric 许可矩阵** |

已评估过、本报告不再展开（任务书给定）：输入侧 `wechat-article-exporter`、`wewe-rss`、`Wechat2RSS`、`freshrss-filter`；评判侧 `FastChat llm_judge`、`deepeval`、`Prometheus-Eval`、`haizelabs/verdict`、`brexhq/CrabTrap`、`eval-kit`。

**本轮检索降级（影响结论强度，必须声明）**：`en.wikipedia.org`、`openai.com`、`developers.google.com`、`huggingface.co`、`foundation.wikimedia.org`、`blog.kagi.com`、`bmj.com`、`university.open.ac.uk` 的正文提取均失败（len 0 / 403 / fetch 异常）。凡只拿到标题级证据的结论，正文中一律标 **【待核实】**。

---

## 2. 横向对比表

### 表 A｜直接对标：给「内容好不好」下判断的产品 / 项目 / 技能

| # | 名称 | 类型 | 怎么定义「好/差」（判据） | 输出形态 | 许可 | 最后更新 / 抓取日 | 能不能直接抄 |
|---|---|---|---|---|---|---|---|
| 1 | **NewsGuard** | 商业（订阅/浏览器插件） | 9 条**站点级**标准，逐条 pass/fail 加权，满分 100：不发布虚假或严重误导内容(22)、负责任地采集与呈现信息(18)、有效纠错机制(12.5)、区分新闻与观点(12.5)、不做欺骗性标题(10)、披露所有权与资金来源(7.5)、明确标注广告(7.5)、披露负责人与利益冲突(5)、公开内容作者姓名与联系方式/履历(5)。讽刺站与平台站**不打分**，另给 satire/platform 标记 | 0–100 分 + 评级档 + "Nutrition Label" 逐条解释与证据、历史评级 | 专有（无公开再许可） | 页内标注 *Last updated April 14, 2026*；抓取 2026-10-13 | ❌ 不可抄文案/权重表；✅ 可作**维度启发**（权重结构与「体裁豁免」设计） |
| 2 | **Ad Fontes Media**（Media Bias Chart®） | 商业 | **文章/单集级**打分后聚合为来源级；每篇由 ≥3 名分析师组成的**政治倾向平衡小组**（右/中/左各一）实时打分：先独立评、再比对、分歧讨论后调整，取三人均值；分析师入职 30 小时培训 + 每年 40 小时；opinion/analysis 也纳入，分类由方法论自行判定而非采信来源标签 | 每篇得分 → 来源在「可靠性 × 政治倾向」二维图上的位置 | 专有 | 页面未标更新日；抓取 2026-10-13 | ❌ 不可抄；✅ 「文章级→来源级聚合」与「三人小组仲裁」是可借的先例（= 多模型投票 + 仲裁） |
| 3 | **Kagi SlopStop** | 商业搜索的公开功能 | **域名/频道级**：某域名页面多数（typically **>80%**）为 AI 生成 → 标记 AI slop 并降权（网页、图片、视频分别判定）；社区可举报，被误标者可 "Report as not AI slop" 触发复核 | 域名标记（Under review / AI slop / Not AI slop）+ 搜索排名降权 | 专有（文档公开） | 页面未标最后更新 **【待核实】**；抓取 2026-10-13 | ❌ 不可抄；✅ 「多数阈值 + 申诉回路」的设计可借 |
| 4 | **BestBlogs**（`ginobefun/BestBlogs`） | 开源仓库 + 商业阅读平台（中文） | **AI Screening 四维**：technical depth / information value / readability / practical guidance → 0–100 质量分 + 摘要 + 标签；再由专家编辑复核、标 Featured；RSS 支持 `minScore` 阈值（如 `minScore=90`） | 质量分 + 摘要 + 标签 + 精选 + Daily Brief；对外提供 CLI 与 Agent Skills（README 称 25 个稳定原语） | **NO-LICENSE**（仓库无 LICENSE 文件；README 仅声明 `cli/` 为 MIT） | push 2026-07-08；抓取 2026-10-13 | ⚠️ 只能**参考流程与维度**，无可用许可；且是「平台侧批处理」，不是「单篇读者侧协议」 |
| 5 | **Slop Evader**（`tegacodes/slop-evader`） | 浏览器扩展（开源仓库） | 不做质量判断——**限制搜索引擎只在 ChatGPT 之前的时间窗内检索**，从源头规避 AI 生成内容 | 搜索结果集变化 | **NO-LICENSE**（★32） | push 2026-05-23；抓取 2026-10-13 | ❌ 与「文章打分」无关，仅为「slop 规避」相邻方向（媒体侧报道：The Register 2025-12-01，标题级证据） |
| 6 | **bullshit-detector**（`SerhiiKorniienko/bullshit-detector`） | Agent Skills（markdown + 自足 Python） | claim-by-claim 核查：**五档 verdict**（✅confirmed / 🟡plausible / 🟠misleading / ❌false / ❓unverifiable）+ hype-signal 分数 + **BS score 0–10**；每条 claim 附来源 | 「BS REPORT」逐条 claim 判定 + 分数 + 出处；输入可为视频/文章/推文/PDF | **MIT**（★155） | push 2026-09-29；抓取 2026-10-13 | ✅ **可抄**：verdict 分类法、报告结构、"ingestion 与分析分离（脚本做确定性工作、agent 做推理）"的架构 |
| 7 | **factcircuit**（`superwesleyhys-ux/factcircuit`） | 开源 Python 评测框架 | 把 claim 验证做成**可重放的证据回路**：不可变来源版本、精确证据 span、分阶段检查、claim+evidence 冻结截止点；**"证据是否支持"与"现实是否为真"分开判定**；缺失信息显式产出为待办项 | 证据图 + 分阶段判定记录 + 未决项清单 | **MIT**（★643） | push 2026-10-09；抓取 2026-10-13 | ✅ **可抄**：证据锚定与溯源模型（正是本项目「引用原文证据」要的机制） |
| 8 | **claude-skills-journalism**（`jamditis/claude-skills-journalism`） | Agent Skills 集合（记者向） | 以新闻核实（verification）、FOIA、数据新闻等**专业工作流**为判据载体；仓库含 `INFLUENCES.md` / `THIRD_PARTY_NOTICES.md`，skills 目录由 `skills-catalog.yaml` 登记；文档站含多代理对抗式验证（adversarial-verify）指南，标注参考 ICIJ / The Markup / Full Fact / Elicit 实践 | Skills + 插件（含 `/autocontext` 跨会话知识沉淀插件） | **MIT**（★418） | push 2026-10-04；抓取 2026-10-13 | ✅ 可抄技能结构（注意 `THIRD_PARTY_NOTICES.md` 中的第三方资产另有条款） |
| 9 | **wechat-article-quality-gate**（`binbingoes`） | Agent Skill（中文） | 微信公众号文章**审查 / 改写 / 移动端排版 / 发布前质量门禁** | 发布前检查与改写结果 | **MIT**（★1） | push 2026-08-03；抓取 2026-10-13 | ⚠️ 可抄技能骨架，但它是**创作者侧发布门禁**，不是读者侧筛选；同类另有 `lihongyu5432-ux/wechat-draft-guard`（★0, MIT）、`renault-wei/wechat-mp-pipeline`（★0, MIT） |
| 10 | **academic-research-skills**（`Imbad0202`） | Agent Skills 套件 | research → write → review → revise → finalize 全流程（含评审环节） | Skills 套件（另有 Codex 版本 ★12736） | **NOASSERTION**（有 LICENSE 但 GitHub 无法识别为常见 SPDX）**【待核实】** | push 2026-10-13；抓取 2026-10-13 | ⚠️ 许可未确认前只能参考 |
| 11 | **codex-claude-academic-skills**（`zLanqing`） | Agent Skills 套件（中文） | 文献阅读 → 论文写作 → 科学计算；含**论文阅读报告**生成 | 阅读报告 + 文档产物 | **MIT**（★4828） | push 2026-05-14；抓取 2026-10-13 | ✅ 可抄「阅读报告」模板结构 |
| 12 | **sandbase-skills**（`sandbaseai`） | Agent Skills 集合 | 研究 / 社会情报 / 营销等 88 个可安装技能 | Skills 集合 | **Apache-2.0**（★204） | push 2026-09-26；抓取 2026-10-13 | ✅ 可抄工程组织方式 |
| 13 | **deepdive**（`Socialpranker/deepdive`） | Agent Skill | 12 阶段研究流水线：**plan-review gate** → 并行子代理 → 对抗式验证 | 研究流水线 + 阶段化产物 | **MIT**（★372） | push 2026-10-11；抓取 2026-10-13 | ✅ 可抄「先过 gate 再展开」的流程骨架 |
| 14 | **cheat-on-money**（`XBuilderLAB`） | Agent Skill（中文） | 反诈验证：需求信号反推 + 实时时效核查 + **反诈 rubric** + **个性化校准环** | rubric 判定 + 校准记录 | **NO-LICENSE**（★771） | push 2026-06-12；抓取 2026-10-13 | ⚠️ 无许可；但它是中文语境下「rubric + 校准环」的现成设计先例（与 `rating-design.md` 的锚例校准同思路） |
| 15 | **Rubrics_Survey**（`RUC-NLPIR`） | 论文仓库（综述） | 《The Rules of the Game: A Survey of Rubrics for Large Language Models》，含 **Rubrics Construction** 分类：Direct Generation / Contrastive Generation / Iterative Refinement / **Verification-Driven Refinement** / Structural Decomposition / De-duplication and Compression / Online & Co-evolving | 论文 PDF + 文献列表 | **NO-LICENSE**（★272） | 论文首版 2026-05-18；push 2026-08-10；抓取 2026-10-13 | ⚠️ 参考（**rubric 怎么造/怎么演化**的系统方法论） |
| 16 | **dr-tulu**（`rlresearch/dr-tulu`） | 开源研究代码 | Reinforcement Learning with **Evolving Rubrics**（深度研究场景的 rubric 演化） | 训练/评测代码 | **Apache-2.0**（★718） | push 2026-10-09；抓取 2026-10-13 | ✅ 可抄 rubric 演化机制思路 |
| 17 | **k12-teacher-skills**（`anthropics`） | Agent Skills + 评测 rubric | 面向 K-12 教师的官方示例技能与**评测 rubric** | Skills + rubrics | **Apache-2.0**（★562） | push 2026-09-01；抓取 2026-10-13 | ✅ 可抄「rubric 与技能同仓发布」的组织方式 |

### 表 B｜可借用的构件（事实核查 / 接地检测 / rubric 工程 / AI 味特征库）

| # | 名称 | 用途 | 许可 / 星数（2026-10-13 抓取） | 可抄性 |
|---|---|---|---|---|
| 18 | `shmsw25/FActScore` | 长文事实精度：拆**原子事实**逐条验证 | MIT，★460，push 2025-04-13 | ✅ 可抄判定单元设计 |
| 19 | `Liyan06/MiniCheck` | 高效 grounding 事实核查（EMNLP 2024） | Apache-2.0，★228，push 2025-08-27 | ✅ |
| 20 | `KRLabsOrg/LettuceDetect` | **span 级** grounding 校验（RAG/代码/工具接地） | MIT，★615，push 2026-10-09 | ✅（定位「哪一句没证据」） |
| 21 | `GAIR-NLP/factool` | 生成式 AI 的事实性检测流水线 | Apache-2.0，★936，push 2024-08-19 | ✅ |
| 22 | `Cartus/Automated-Fact-Checking-Resources` | 自动事实核查文献/资源总表（TACL22/EMNLP 教程配套） | MIT，★579，push 2025-02-23 | ✅ 用于继续深挖 |
| 23 | `Imalwayshere/Open-Detector` | BERT 学术文本 AI 生成检测 | MIT，★247，push 2026-03-31 | ✅ |
| 24 | `ai-detected/ai-content-detectors` | AI 检测器 awesome list | NO-LICENSE，★167，push 2024-11-28 | ⚠️ 仅线索 |
| 25 | `hardikpandya/stop-slop` | 「AI tells」特征清单（写作侧去 AI 味） | MIT，★17966，push 2026-03-17 | ✅ **反向可作 slop 检测规则库** |
| 26 | `petergyang/no-ai-slop` | 20+ 种 AI slop 模式清单 | MIT，★12271，push 2026-09-02 | ✅ 同上 |
| 27 | `Aboudjem/humanizer-skill` | 55 种模式 + 0–100 打分 | MIT，★274，push 2026-09-06 | ✅ 同上（含打分设计） |
| 28 | `NulightJens/humanizer-stack` | 两遍式去 AI 味流水线 | NOASSERTION，★360，push 2026-07-24 | ⚠️ 许可待核 |
| 29 | `MohamedAbdallah-14/unslop` | 剥离 AI-isms（sycophancy / stock vocab / hedging） | MIT，★157，push 2026-10-05 | ✅ |
| 30 | `devswha/patina` / `epoko77-ai/im-not-ai` | 多语种去 AI 味技能（后者韩文，★5967） | MIT，push 2026-09-29 / 2026-10-12 | ✅ |

> 表 B 的定位：它们**不是**文章评分器，但「AI 味模式表」「原子事实拆分」「span 级接地」三件东西正好补上 rating-design 之外的执行细节——且许可宽松，可直接引用。

**媒体侧报道（标题级证据，正文未读）**：The Register 2025-12-01 报道 Slop Evader 扩展 —— https://www.theregister.com/software/2025/12/01/this-extension-limits-google-searches-to-the-pre-chatgpt-era/2385611 【待核实：正文未读取】

---

## 3. 现成 rubric / 评分表 / 评判清单：逐个标注能不能抄

### 3.1 ✅ 可直接抄 / 翻译 / 商用（只需署名）

| 来源 | 内容 | 许可（原文证据） | 怎么用 |
|---|---|---|---|
| **PLOS Comput Biol — Ten simple rules for reading a scientific paper**（Carey, Steiner, Petri 2020, doi:10.1371/journal.pcbi.1008032）<br>https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1008032 | 读科研论文的 10 条规则（阅读顺序、找论点、看证据） | 版权页原文：**CC BY 4.0**，"permits unrestricted use, distribution, and reproduction in any medium, provided the original author and source are credited" | 直接翻译成中文写进协议包的「阅读判定顺序」一节，注意署名与许可证声明 |
| **HealthBench**（arXiv 2505.08775）<br>https://arxiv.org/abs/2505.08775 | 用 rubric 而非选择题评测开放性输出：5,000 段多轮对话、**262 名医生撰写 rubric**、**48,562 条 rubric 判据**；HealthBench Consensus 含 **34 个经医生共识验证的行为维度**；HealthBench Hard | arXiv abs 页显示 **view license = CC BY 4.0**（论文本身）；**数据集/代码许可是独立的，未核**：代码 `openai/simple-evals`、数据 HF `openai/healthbench` 【待核实】 | 抄的是**结构**：把 rubric 判据按「场景维度 × 行为维度（accuracy / instruction following / communication）」组织，并挑一组做「共识维度」子集——与本项目「门禁 + 质量分 + 锚例」天然契合 |
| **MIT / Apache-2.0 开源技能与代码**（表 A/B 中标 ✅ 者） | bullshit-detector 的五档 verdict 与分数；factcircuit 的证据回路；FActScore / MiniCheck / LettuceDetect 的抽取与校验；stop-slop / no-ai-slop 的 AI 味模式表 | MIT / Apache-2.0 | 抄代码或文案结构，**保留版权与许可声明**（Apache-2.0 还需带 NOTICE 变更说明） |

### 3.2 ⚠️ 只能参考，不能进商用交付物（NC 限制 / SA 传染）

| 来源 | 许可（原文证据） | 风险点 |
|---|---|---|
| **CASP Checklists**<br>https://casp-uk.net/referencing/ | 页内原文：**©CASP this work is licensed under the Creative Commons Attribution – Non-Commercial – Share Alike**（CC BY-NC-SA 4.0） | 非商用 + 改作必须以**同许可**发布（ShareAlike 传染）。个人/内部使用风险低；一旦商业化或闭源分发即不成立 |
| **AAC&U VALUE Rubrics**（含 Critical Thinking VALUE Rubric）<br>https://www.aacu.org/value/how-to-cite | 页内原文：**CC BY-NC-SA 4.0**；"The materials may not be used for commercial purposes … without prior permission"；并给出改作必须标注 "Adapted from …" 的示范句 | 同上；且 AAC&U 明确要求**商用需另行申请许可** |

> 若 critical-reader 只做个人/团队内部工具，NC 条款不构成障碍；作为**可分发协议包**（尤其带商业意图）则不可接受。安全做法：只看维度、自己重写表述与分级描述。

### 3.3 ❌ 版权明确禁止复制

| 来源 | 条款（原文证据） |
|---|---|
| **JBI Critical Appraisal Checklists**<br>https://jbilibrary.org/site/terms-of-use （清单本体：https://jbi.global/sites/default/files/2020-08/Checklist_for_RCTs.pdf） | Terms of Use 原文："All content on the Website … is the property of JBI Library or its licensors and is protected by copyright … **You may not reproduce, distribute, modify, or create derivative works of any content without express written permission.**" |

### 3.4 🔒 专有 / 公开但未授权：只能当判据启发

| 来源 | 公开到什么程度 | 边界 |
|---|---|---|
| **NewsGuard 9 criteria**<br>https://www.newsguardtech.com/ratings/rating-process-criteria/ | 9 条标准名、权重、通过/失败示例全部公开；页内标注 *Last updated April 14, 2026* | 无任何再许可声明 → 可读、可启发，**不可复制文案与权重表**；且它是站点级而非文章级 |
| **Ad Fontes Media methodology**<br>https://adfontesmedia.com/methodology/ | 方法（三人平衡小组、文章级打分、聚合）公开 | 专有；不可复制 |
| **Google Search Quality Rater Guidelines** + Helpful Content 自评问题<br>https://developers.google.com/search/blog/2023/11/search-quality-rater-guidelines-update<br>https://developers.google.com/search/docs/fundamentals/creating-helpful-content | PDF 与文档公开可下载 | 版权归 Google，无再许可；**页面正文提取失败【待核实】**（含是否有"不得再分发"字样、最新版本号） |
| **Trust Project 8 Trust Indicators**<br>https://thetrustproject.org/faq/ | 8 项指标、Trust Mark 合规机制、schema.org 机器可读标注、被 Google/Facebook/Bing 采用，均已公开描述 | 页面**未声明许可**【待核实】；可借鉴「透明度披露」维度（作者身份、所有权、更正政策） |
| **Wikipedia:Signs of AI writing**<br>https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing | 页面存在（搜索结果确认标题） | 正文提取失败【待核实】其条目清单；Wikipedia 正文许可为 **CC BY-SA 4.0**（依据 Wikimedia 官方博客 2023-06-29 迁移公告：https://diff.wikimedia.org/2023/06/29/stepping-into-the-future-wikimedia-projects-transition-to-creative-commons-4-0-license/ ）→ **ShareAlike 传染，不适合闭源商用交付** |
| **Kagi SlopStop**<br>https://help.kagi.com/kagi/features/slopstop.html | 判定阈值（>80% 页面为 AI 生成）、举报与复核流程公开 | 专有；最后更新日未标【待核实】 |

### 3.5 ⏳ 许可待核实（有价值但本轮未确认条款）

| 来源 | 链接 | 备注 |
|---|---|---|
| AMSTAR 2（系统综述质量评价） | https://www.bmj.com/content/358/bmj.j4008 ；https://amstar.ca/Publications.php | BMJ 页面正文提取失败【待核实】 |
| Cochrane Risk of Bias 2 (RoB 2) | https://www.cochrane.org/learn/courses-and-resources/cochrane-methodology/risk-bias | 工具通常要求引用，条款未核【待核实】 |
| HealthNewsReview 10 条报道标准 | https://journalofethics.ama-assn.org/article/healthnewsrevieworg-criteria-excellence-health-and-medical-journalism/2007-03 ；回顾文 https://healthjournalism.org/blog/2024/07/writing-about-health-care-interventions-the-healthnewsreview-criteria-are-as-relevant-as-ever/ | 标题级证据，正文与许可未核【待核实】 |
| Open University "PROMPT" 评估框架 | https://university.open.ac.uk/library/finding-resources-for-your-assignment/evaluation-using-prompt | Presentation/Relevance/Objectivity/Method/Provenance/Timeliness 六维；页面提取失败【待核实】 |
| HealthBench 数据集与代码 | HF `openai/healthbench`；https://github.com/openai/simple-evals | 与论文许可分离【待核实】 |
| 中国《人工智能生成合成内容标识办法》 | https://www.cac.gov.cn/2025-03/14/c_1743654684782215.htm | 2025-03-14 发布（CAC 官网）；**施行日期【待核实】**。这是**法规义务**（AI 内容标识）而非质量 rubric，仅作「AI 生成内容」判定与报告披露的合规基线 |

---

## 4. 没查到的东西与不确定项（诚实清单）

1. **没有找到「浏览器里判断这篇值不值得读」的具名开源实现。** 仅见 Reddit r/SideProject 的讨论帖（据搜索结果为 2025 年 5 月）——**帖子链接与插件名均未取得【待核实】**。已找到的 Slop Evader 属「搜索侧规避」，不做文章评分。
2. **西方媒体评级产品的文章级 API/判据文档全部没拿到**：The Factual、Ground News、AllSides、Refind、Feedly Leo、Readwise Reader、Inoreader AI —— 本轮检索未产出可引用的官方判据页，**故一律未写入对比表【待核实】**（避免凭印象编造判据）。
3. **中文「AI 帮我读文章/打分」读者侧开源方案：未发现。** 检索到的中文材料集中在两处：① 创作者侧的公众号数据指标（打开率、阅读完成率等运营指标，如 https://data.xiguaji.com/help/detail/192.html 、https://yiban.io/geo/31780 ）；② 发布前质量门禁技能（`binbingoes/wechat-article-quality-gate` ★1 MIT 等，见上表）。**这是空档，不是遗漏。**
4. **学术侧论证质量 rubric 的仓库未定位**：一次检索 `argument quality dataset` 返回 403，IBM "argument quality ranking" 仓库未找到（此前一次 404）【待核实】；ArgQuality 语料许可未核。
5. **HealthBench 的 HF 数据集页与 openai.com 博客均未能读取**（空/403），文中 rubric 数量全部来自 arXiv 摘要（可引用），但**数据集许可仍未确认**。
6. **若干权威页正文提取失败**：en.wikipedia.org、openai.com、developers.google.com、huggingface.co、foundation.wikimedia.org、blog.kagi.com、bmj.com、university.open.ac.uk。相关结论均降级为标题级证据并标注。
7. **SlopStop 的最后更新日期**页内无标注【待核实】。
8. **Google Search Quality Rater Guidelines 是否限制再分发**【待核实】。
9. **微信公众号质量分的官方算法**：无公开文档，检索到的均为第三方运营文章，未采信。
10. **BestBlogs 的 AI 打分 prompt 与工作流**：README 与 about 页确认「已开源 RSS 清单、AI 打分工作流与核心 prompt」，但仓库无 LICENSE，且本轮未逐条读取其 prompt 内容 → **不确定其具体维度权重与判据细节【待核实】**。

---

## 5. 对 critical-reader 的可执行结论

1. **对标物稀少 = 窗口期。** 读者侧「值不值得读」的**协议包**没有先例；最接近的两个都是 MIT：bullshit-detector（claim 级五档 + BS 0–10 + 无密钥抓取，★155）与 factcircuit（证据回路 + 冻结截止点，★643）。建议直接借用二者的**判定单元与证据锚定机制**，补齐 `rating-design.md` 尚未覆盖的「每一条判定必须落到原文证据 span」这一层。
2. **NewsGuard 是最接近的行业先例，可直接映射为文章级维度**：9 条 pass/fail + 加权 100 分（22/18/12.5/12.5/10/7.5/7.5/5/5），其中「区分新闻与观点」「披露作者与所有权」可平移到单篇文章；它的「讽刺站/平台站不打分」与 `genre-taxonomy.md` 的体裁分档**完全同构**，可作为该设计的独立佐证。但文案专有 → 必须重写，且**站点级 ≠ 文章级**。
3. **许可红线（决定交付形态）**：能进商用协议包的是 **CC BY 4.0（PLOS）** 与 **MIT/Apache-2.0 代码**；**CASP 与 AAC&U 是 BY-NC-SA、JBI 明令禁止复制、Wikipedia 是 BY-SA** —— 这四类只能读维度、重写表述，不得搬原文或改作分发。
4. **rubric 怎么写有系统依据**：`Rubrics_Survey`（NO-LICENSE，仅参考）+ `dr-tulu`（Apache-2.0，演化 rubric）；`anthropics/k12-teacher-skills` 提供了「技能与 rubric 同仓发布」的工程先例。
5. **中文侧没有对手，但有可抄的先例**：AI 味特征库（stop-slop ★17966 / no-ai-slop ★12271，均 MIT）与中文发布前门禁技能（MIT）可以直接支撑「低质信号检测」与「中式表达」两层；中文读者侧批判性阅读协议是空白。

---

## 6. 来源清单（抓取日均为 2026-10-13）

**GitHub 仓库（数据来源 api.github.com，2026-10-13 抓取）**
- https://github.com/SerhiiKorniienko/bullshit-detector （MIT，★155）
- https://github.com/superwesleyhys-ux/factcircuit （MIT，★643）
- https://github.com/jamditis/claude-skills-journalism （MIT，★418）
- https://github.com/ginobefun/BestBlogs （NO-LICENSE，★4051）
- https://github.com/tegacodes/slop-evader （NO-LICENSE，★32）
- https://github.com/binbingoes/wechat-article-quality-gate （MIT，★1）
- https://github.com/Imbad0202/academic-research-skills （NOASSERTION，★51717）
- https://github.com/zLanqing/codex-claude-academic-skills （MIT，★4828）
- https://github.com/sandbaseai/sandbase-skills （Apache-2.0，★204）
- https://github.com/Socialpranker/deepdive （MIT，★372）
- https://github.com/XBuilderLAB/cheat-on-money （NO-LICENSE，★771）
- https://github.com/RUC-NLPIR/Rubrics_Survey （NO-LICENSE，★272）
- https://github.com/rlresearch/dr-tulu （Apache-2.0，★718）
- https://github.com/anthropics/k12-teacher-skills （Apache-2.0，★562）
- https://github.com/shmsw25/FActScore （MIT，★460）｜https://github.com/Liyan06/MiniCheck （Apache-2.0，★228）｜https://github.com/KRLabsOrg/LettuceDetect （MIT，★615）｜https://github.com/GAIR-NLP/factool （Apache-2.0，★936）｜https://github.com/Cartus/Automated-Fact-Checking-Resources （MIT，★579）
- https://github.com/hardikpandya/stop-slop （MIT，★17966）｜https://github.com/petergyang/no-ai-slop （MIT，★12271）｜https://github.com/Aboudjem/humanizer-skill （MIT，★274）｜https://github.com/NulightJens/humanizer-stack （NOASSERTION，★360）｜https://github.com/MohamedAbdallah-14/unslop （MIT，★157）｜https://github.com/Imalwayshere/Open-Detector （MIT，★247）｜https://github.com/ai-detected/ai-content-detectors （NO-LICENSE，★167）

**产品 / 机构页面**
- https://www.newsguardtech.com/ratings/rating-process-criteria/ （页内 *Last updated April 14, 2026*）
- https://adfontesmedia.com/methodology/
- https://help.kagi.com/kagi/features/slopstop.html ｜公告 https://blog.kagi.com/slopstop （正文未取得）
- https://www.bestblogs.dev/about ｜https://github.com/ginobefun/bestblogs （README 已读）
- https://thetrustproject.org/faq/
- https://tegabrain.com/Slop-Evader

**Rubric / 清单许可**
- https://casp-uk.net/referencing/ （CC BY-NC-SA 4.0，©CASP）
- https://www.aacu.org/value/how-to-cite （CC BY-NC-SA 4.0）
- https://jbilibrary.org/site/terms-of-use （保留所有权利，禁止复制/改作）
- https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1008032 （CC BY 4.0）
- https://arxiv.org/abs/2505.08775 （论文 CC BY 4.0；数据集/代码许可未核）
- https://www.cac.gov.cn/2025-03/14/c_1743654684782215.htm
- https://diff.wikimedia.org/2023/06/29/stepping-into-the-future-wikimedia-projects-transition-to-creative-commons-4-0-license/ （Wikipedia 正文 CC BY-SA 4.0 依据）
