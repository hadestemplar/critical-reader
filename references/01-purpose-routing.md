# 01 · 目的路由：这一次执行的是哪种阅读活动

**本文件只做一件事：决定这一次用哪一套判据族。**

判据本身在 `references/03-analysis-w.md`、`references/04-analysis-c.md`、`references/05-analysis-v.md`；档位与状态位在 `templates/screening-card.md` §状态位；红灯触发条件在 `references/07-redlines.md`。本文件不重复上述任何一处的内容。

判定顺序（切主张 → 路由 → 逐轴判 → 红灯 → 聚合）定义在 `references/00-protocol.md` §判定顺序。本文件负责其中的「路由」一步：输入是切好的主张单元（`references/02-claim-split.md`），输出是**一条** `purpose` 取值。

---

## §1 三个不可让步的前提

**1. 目的不是文本属性。**

PIRLS 2016 第一章逐字：

> **"However, the purposes for reading do not align strictly with text types."** "For example, biographies or autobiographies can be primarily informational or literary, but include characteristics of both purposes."

（`docs/research/00-foundations.md:182`；原始材料 `pirls2016-chap1.txt:217-223`）

CEFR Companion Volume 对自己的阅读类目亦逐字承认：

> "The categories for reading are **a mixture** between reading purpose and reading particular genres with specific functions."

（`docs/research/00-foundations.md:184`；原始材料 `cefr-cv.txt:2545`）

**2. 因此本文件不问「这是什么体裁」。**

体裁名、平台、账号、机构、职业、学科、来源是否学术——**一律不参与**目的判定，也一律不参与判据族选择。这一条是 `A2` 裁定的直接后果：用户逐字「我其实并不关心来源是学术出版还是在什么领域。这个属性只是一个现状信息，不会影响文章本身的内容」（`docs/DECISIONS.md:120`）。

**3. 判据族的选择权属于「本次执行的是哪种阅读活动」，不属于「文本属于哪一类」。**

PIRLS 那句已经把「用一个标签选一套判据」这个机制本身否掉；仓库内对该结论的登记见 `docs/research/00-foundations.md:195`（逐字「『用一个标签选一套判据』这个机制本身被否定」）。

---

## §2 四个目的

| id | 名称 | 判定对象 | 判据族 | 出处状态 |
|---|---|---|---|---|
| `P0` | 定位与筛选（**兜底值**） | 这篇要不要读、值不值得花时间 | 可获得性 + 可核事实层（来源可核 / 数字可追 / 时间与主体明确 / 引文与主张对得上） | 目的有出处：CEFR `:2547-2549` 逐字 reading a text "'diagonally' at speed **in order to decide whether to read (parts of) it properly**"（`docs/research/00-foundations.md:208`）；**判据族条目本身【无来源，本文自定】**（`docs/research/00-foundations.md:219`） |
| `P1` | 明辨真伪 | 承重结论站不站得住 | 论证质量族：主张—证据支撑（**跨句关系**）+ `Global relevance` + 所指问题一致性 + 领域内标准 | 目的有出处：NAEP `:745-746` "the ability to **persuade in order to** change the reader's point of view or affect the reader's action"（`docs/research/00-foundations.md:209`）；**判据族有出处**（`docs/research/00-foundations.md:73`、`:77`） |
| `P2` | 获取信息 | 信息与方法能不能取用 | 信息完整性 / 来源层级 / 时效 /（有操作序列时）步骤完整性与前置条件 | 目的有出处：NAEP `:749-750` "the ability to **explain in order to** expand the reader's understanding"、PIRLS `:126` "acquire and use information"（`docs/research/00-foundations.md:210`）；**判据族条目【无来源，本文自定】**（`docs/research/00-foundations.md:219`） |
| `P3` | 体验与欣赏 | 作者的经验、感受、想象本身 | **不建判据族**，只给一段逐字提示串（§6） | 目的有出处：NAEP `:754-756`、PIRLS `:133` "Literary Experience"（`docs/research/00-foundations.md:211`）；不建判据族＝`A1` 用户裁定，逐字「不建。识别出是这个类型的文章给个提示就行」（`docs/DECISIONS.md:120`） |

**`P0` 是兜底值，不是「未声明时的默认取值」。** 旧口径「未声明 → 直接取 `P0`」已被判错，理由是可证的：`P0` 的判据族不含论证质量，一篇有承重缺陷的劝服文章落到 `P0` 就**没有判据可用**（`docs/research/00-foundations.md:199` 逐字「一篇有承重缺陷的文章将无判据可用，验收测试①不可能通过，且正是旧失败案例 4 的形态」）。

**四个目的不声称穷尽。** 四份官方框架自己都不说穷尽：NAEP `:757-758` 逐字 "do not intend to discount the importance of other common purposes for writing"（`docs/research/00-foundations.md:213`）。

**「对照可比性」四个字已从 §2 的 `P1` 判据族里删掉，且不另立判据。** 删的理由：它在全仓只作清单里的一项，**无定义、无判据**，`03` 的七步判序也没有引用它——一个没有判据的词放进判据族，等于给判定者一个可以自由解释的空位。它要拦的事只有一件：**两组对照在关键属性上不属同一总体 ⇒ 论据证的是另一个命题 ⇒ 这已经是「换题」**。所以它并入 `references/03-analysis-w.md` §2「换题」那一条（引用节标题，不引编号），由那一条单独承担；本文件不再出现这四个字。

---

## §3 判定步骤

### Step 0 —— 先抽描述性字段，不判目的

按 §7 取字段。**这些字段一律不参与 Step 1–3 的判定。**

### Step 1 —— 找「承重结论」

- **可判定短句**：「存在一句（或一个判断）`S`：**把 `S` 删除后，全文其余部分不再指向同一个结论。**」
- **至少核什么**：① `S` 能被逐字引用，并给出它在原文的位置；② 删除测试能被复述（写清删掉哪一句、剩下指向什么）；③ 若**找不到**这样的 `S`，直接进 Step 3 落 `P0`。
- **找不到 `S` 的典型形态**：通篇自述、纯图、纯清单、残篇。这类文本有判断句不等于有承重结论——自我叙述不承担对世界的断言（`_scratch/source-audit/stage2/s2-routing.md:49` 的实测样本说明）。

### Step 2 —— 三分判，按 `A` → `B` → `C` 顺序取第一条命中

| 判 | 可判定短句 | 至少核什么 | 归 |
|---|---|---|---|
| **A** | 承重结论是**一条关于世界的断言**，它成立与否取决于理由是否支持它，而**不**取决于查一个数、照着做一次、或作者是否真有那种体验 | ① 承重结论能写成「P 成立」；② 文中有理由链（≥1 条可引原文的依据）；③ 该断言**不能**只靠一次查找定真假（只靠查数 → 归 B） | `P1` 明辨真伪 |
| **B** | 承重结论是**一条可取出即用的信息**，或**一套可执行的步骤**；它成立与否取决于信息完不完整、来源可不可核、步骤能不能照着做 | ① 有可列出的信息单元（数据 / 事实 / 方法）或有序步骤；② 断言形态是「是什么 / 怎么发生 / 怎么做」，**不是**「应该 / 必须」；③ 若为步骤，核前置条件与依赖 | `P2` 获取信息 |
| **C** | 承重结论**就是作者的经验、感受或想象本身**；它不主张任何可被反驳的外界事实，也不提供可取出即用的信息 | ① 第一人称经验叙述是主体；② 断言以「我感到 / 我那时觉得 / 我看见」形式出现，或为虚构；③ **没有**要求读者接受一个关于世界的断言 | `P3` 体验与欣赏（只出提示串） |

**顺序 `A` → `B` → `C` 没有出处**【本报告工程约定】。理由：判据族要选一套，而「要你同意什么」比「给你信息」更吃论证质量；两目的并存时先判前者，能把承重性的工作交给 `P1` 族。代价见 §9。

### Step 3 —— 兜底

三条都不命中（纯图片、纯清单、残篇）→ **`P0` 定位与筛选**。

---

## §4 多目的并存

1. **`purpose` 只取一个**——判据族只选一套。
2. 另记 `purpose_secondary[]`，**只作描述性信息，不选判据**。
3. 取值＝「承重结论的成立条件」，不是「文中出现最多的东西」。
4. 判据是 `A`→`B`→`C` 的第一条命中，不是加权、不是投票。

---

## §5 披露义务（三种措辞，逐字进报告）

`purpose` 的取值**必须逐字出现在报告里**，三选一：

- **声明**：`purpose=P1（用户声明）`
- **推断**：`purpose=P1（未声明；按 §3 判 A 推断；承重结论原文＝「…」+ 位置）`
- **兜底**：`purpose=P0（未声明；§3 Step 1 未找到承重结论，落兜底 P0）`

**推断必须逐字披露**：未声明时先推断，推断得出就用推断值并披露依据；推断不出才落 `P0` 兜底并披露原因。**不得**把推断写成声明，**不得**不写依据（`docs/research/00-foundations.md:199`）。

---

## §6 `P3` 的逐字提示串

命中 `P3` 时，**不产出三轴档位**，只输出下面这段，原文照抄：

> 体裁提示：本文属体验与欣赏类（判定依据：承重结论是作者的经验 / 感受 / 想象本身，未主张任何可被反驳的外界事实，也不提供可取出即用的信息）。按用户裁定 `A1`，本工具不为该类目建判据族，因此本次不产出三轴档位。

与之配套的卡面取值见 `templates/screening-card.md` §状态位 中 `未评估` 一行（「按规则**不该跑**（命中 `P3`，三栏全不出，只给体裁提示）」）；本文件不复述状态位闭集。

**提示串所依赖的判 C 三条判据无出处**【本报告工程约定】——`A1` 只要求「给个提示」，没有定义提示的判据，这三条是操作化时补的（`_scratch/source-audit/stage2/s2-routing.md:85`）。

---

## §7 描述性字段清单

总则（`A2` 逐字）：「我其实并不关心来源是学术出版还是在什么领域。这个属性只是一个**现状信息**，**不会影响文章本身的内容**」（`docs/DECISIONS.md:120`）⇒ **下列字段不影响任何一条轴，也不参与目的判定**；**只有 `purpose` 参与判据族选择**（`docs/research/00-foundations.md:202`、`:384`）。

| 字段 | 取值闭集 | 从哪里取 | 影响什么 |
|---|---|---|---|
| `text_type[]`（多选、可空） | `description` / `narration` / `exposition` / `argumentation` / `instruction` / `transaction`（PISA Box 2.3 六值，`docs/research/00-foundations.md:197`） | 承重结构与段落功能；**不得**由体裁名反推 | 不影响任何轴；只进报告元数据与筛选卡 |
| `medium` | `print` / `electronic`（同上出处） | 投递形态（PDF / Markdown / 链接） | 不影响任何轴 |
| `environment` | `authored` / `message-based`（同上出处） | 是否单一署名作者；机构通稿 / 聚合 / 匿名 → `message-based` | 不影响任何轴。**诱因提示**：`message-based` 会让人想加「可信度折扣」——`A2` 禁止，只记录 |
| `text_format[]` | `continuous` / `non-continuous` / `mixed` / `multiple`（同上出处） | 是否含图表、列表、附件、多文档拼贴 | 不影响任何轴。**唯一例外是范围声明**：`multiple` 时报告必须写「本次只审主文档，另 N 件未审」 |
| `communicative_scene` | 社会交往类 / 新闻传媒类 / 知识性读物类 | 正文自述与投递场景 | 不影响任何轴。**出处是局部的**：原文是课标学习任务群 7 的内部子分类，提升为全局字段是推广（`docs/research/00-foundations.md:192`） |
| `domain` | **开放文本，不设闭集** | 正文自述（刊名 / 机构 / 术语 / 参考文献） | **不影响任何轴、不做路由**（`A2`）。**无出处**：PISA 四维、NAEP 三目的、PIRLS 两目的、课标三任务群都没有这一维（`docs/research/00-foundations.md:193`） |

**「什么都不影响」为什么还留**：报告元数据的可读性；`text_format=multiple` 有范围后果；它们是旧描述性覆盖规则里唯一值得留下的东西（`_scratch/source-audit/stage2/s2-routing.md:135`）。

**若必须削减**：**只保留 `text_type[]` 即够**，其余五个字段删掉不损失任何判定能力（同上出处）。

---

## §8 替代关系声明

**本条替代旧链里那张「体裁标签 → 处理方式」的实体映射表（该表已退役，旧链整体已移出 `references/`），以及为那张表服务的打分与仲裁规则。**

**替代依据（三条，均可打开）**：

1. **机制被明文否掉**：PIRLS 2016 Ch.1 逐字 "However, the purposes for reading do not align strictly with text types."（`docs/research/00-foundations.md:182`）⇒ 「先用体裁贴标签、再按标签选判据族」不成立。
2. **旧标签集是混维分类**：同一张表里的值分别属于文本类型维、目的维、交际场景维、领域维四个不同维度，逐一对号见 `docs/research/00-foundations.md:186-193`；其中「领域」维在四份框架内**无落点**。
3. **打分类规则没有可用的校准**：旧机制的权重、饱和点与边界全部是工程约定，且实测过单字两读即可跨越边界（`_scratch/source-audit/stage2/s2-routing.md:150` 记「单字『但』的两读可使分数由 0.4408 变为 0.6408、跨越 0.60 硬边界」）。

**功能接管**：旧表的功能是「从体裁名直接选判据族」。接管者是 §3 的 `purpose` 判定（声明 > 推断 > `P0` 兜底）⇒ **判据族的选择权从「文本属于哪一类」移到「本次执行哪种阅读活动」**（`docs/research/00-foundations.md:383`）。

**被保留的旧信息只有三样，且全部降为描述**：操作块特征 → `text_type=[instruction]` 的取值依据；第一人称段落占比 → 记一个数值；导流词表 → `communicative_scene` 的提示。**三条都不再决定判据族。**

**本条不引入任何「体裁 → 处置」的映射。** 若读者在本文件里找到可执行的「看到 X 体裁就做 Y」，那是缺陷，不是特性。

---

## §9 代价与边界

**推断会引入一个新的不可复现源。** 同一篇文章，两个判定者可能推出不同 `purpose`，从而**走不同的判据族**——这与旧的「标签翻转」是同类风险（`docs/research/00-foundations.md:382`）。

**同类实证（借来的是类比，不是实测）**：Prague Discourse Treebank 的捷克语新闻体裁标注，total 61% / Cohen's κ = 0.52，最差一对 33% / κ = 0.26（Poláková, Jínová & Mírovský 2014, LREC 2014, DOI `10.63317/2vhdvip6apdg`；`docs/research/00-foundations.md:382`）。**这是体裁标注的一致率，`purpose` 推断是同类但不同的判断**。

**配套验收项（必须可测）**：`purpose` 的一致率**单独统计**；不一致的样本**必须标 `purpose_unstable`**，**不得静默取其一**（`docs/research/00-foundations.md:382`）。

**本文件做不到的四条**：

1. 推断出的 `purpose` **不等于用户的真实目的**——文献直说目的不是文本属性，因此本设计的 `purpose` 严格说是**文本承重结构的代理**。用户声明与推断不符时以声明为准；但这意味着**同一篇文章在不同 `purpose` 下的判定结果不可比**。
2. 多目的并存的优先级顺序 `A` > `B` > `C` **无出处**（本文件的工程约定）。
3. `P2` / `P0` 的判据族**条目无来源**（只有方向性出处）。
4. **没有中文语料实测**：`purpose` 在中文长文上的可判性、两个独立判定者的一致率，均未测（`A4` 下 v1 只声称重测稳定性）。

---

## §10 出处清单

| 论断 | 类型 | 出处 |
|---|---|---|
| 目的与文本类型不对齐 | 学理 | PIRLS 2016 Ch.1，`docs/research/00-foundations.md:182` |
| 阅读类目是目的与体裁的混合物 | 学理 | CEFR Companion Volume `:2545`，`docs/research/00-foundations.md:184` |
| 「一个标签选一套判据」被否定 | 学理推论 | PIRLS 上引 + `docs/research/00-foundations.md:195` |
| 四个目的及各自出处 | 学理 | `docs/research/00-foundations.md:208-211` |
| 四目的不声称穷尽 | 学理 | NAEP `:757-758`，`docs/research/00-foundations.md:213` |
| `P0` 是兜底值而非默认取值 | 工程约定（理由可证） | `docs/research/00-foundations.md:199` |
| `P3` 不建判据族、只给提示串 | 用户裁定 `A1` | `docs/DECISIONS.md:120` |
| 描述性字段不影响任何轴 | 用户裁定 `A2` | `docs/DECISIONS.md:120`；`docs/research/00-foundations.md:202` |
| 判定步骤（Step 1–3 与三分判短句） | 方案底本 | `_scratch/source-audit/stage2/s2-routing.md` §1.3–1.5（`docs/research/00-foundations.md:380` 有收口摘要） |
| `A` > `B` > `C` 的取值顺序 | **【本报告工程约定】** | 本文件 §3 自述，无外部出处 |
| `P3` 提示串的三条判据 | **【本报告工程约定】** | `_scratch/source-audit/stage2/s2-routing.md:85` |
| `P0` / `P2` 判据族条目 | **【无来源，本文自定】** | `docs/research/00-foundations.md:219` |
