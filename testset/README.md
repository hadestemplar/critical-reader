# testset：样本采集与标注规范

本目录存放 critical-reader 的**真实中文文章样本**。共 30 篇，全部为公开可访问的微信公众号文章（`mp.weixin.qq.com/s/<id>` 分享短链）：第 1–12 篇为第一批检索所得，第 13 篇由用户提供的已知短链入库，第 14–15 篇为第二批检索所得，第 16–30 篇为**第三批**检索所得（按 `docs/PLAN.md` §五.1 的体裁缺口定向补采，详见第 8 节）。

采集范围、通道、产出率、失败分布与缺口，全部记录在本文第 5–8 节——凡未实测的结论不得写进本目录。

> **v1 声明（2026-10-14，`docs/DECISIONS.md` #55）——本目录已不再用作校准真源。**
> 用户对其中 7 篇的逐行标注显示我方判定 **6 篇偏高、0 篇一致**（见 `docs/calibration-30.md` §5）；且这批样本是按体裁缺口**定向检索**采来的，用户明言「这一批文章，很大一部分都是我平时不会读的文章……这些样本偏差太大」。
> **后续样本改为用户真实投喂的文章。** 本目录降级为「一次有偏运行的存档」，其采集与标注规范（第 1–10 节）仍然有效，可继续用于新增样本。

---

## 1. 目录与文件约定

```
testset/
  README.md                     # 本文：采集与标注规范
  samples/<slug>.md             # 正文（YAML front-matter + Markdown 正文）
  samples/<slug>.meta.json      # 与 front-matter 同字段的 JSON（机器读取用）
```

- `slug`：小写英文 + 连字符，全目录唯一。语义取自文章主题，不取自标题原文。
- 两文件**一次生成、同源**（生成脚本见第 10 节），字段必须一致；不一致即为缺陷。
- **正文唯一真源是 `.md` 的 front-matter 之后部分**；`.meta.json` 只是同字段的结构化副本，外加若干采集过程字段。

## 2. 元数据字段

### 2.1 必填字段（9 项）

| 字段 | 口径 |
|---|---|
| `title` | 页面 `var msg_title` 或 `#activity-name` 解析所得标题原文，不改写 |
| `source_url` | 抓取时**重定向后的最终 URL**，即 `https://mp.weixin.qq.com/s/<id>` 分享短链；不使用 `?__biz=…&mid=…` 长链（见 `docs/DECISIONS.md` #3） |
| `account` | 页面 `var nickname` / `#js_name` 解析所得**公众号名**；可能与该号发文时的历史名称不同，勿当作"作者署名" |
| `publish_date` | 页面 `var ct`（unix 秒）转 `Asia/Shanghai`，格式 `YYYY-MM-DD`；原始值另存 `publish_date_raw` |
| `word_count` | 见 2.3 字数口径 |
| `images` | 正文中原 `<img>` 数量，即 `![图N]` 占位符个数 |
| `collected_at` | 抓取落盘时间，带本地偏移（`+08:00`） |
| `collect_method` | 采集通道描述（检索式形态 → 短链 → fetch → 解析容器） |
| `fetch_status` | 见 2.4 |

### 2.2 扩展字段（采集方补记，判定环节可忽略）

`slug`、`platform`（本批恒为 `weixin`）、`category`、`tier`、`category_note`、`length_band`、`char_count`、`word_count_method`、`image_placeholders`、`sample_url_id`（短链 ID）、`http_status`、`final_url`、`html_bytes`、`publish_date_raw`、`body_source`、`discovered_via`（发现该文的检索式）、`license_note`、`collected_by`、`built_at`。

### 2.3 字数口径（重要）

```
word_count = 正则 /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/g 的匹配数
```

即**只数汉字**：不含标点、数字、拉丁字母、空白与 `![图N]` 占位符。`char_count` 另给「去空白后的全部字符数」，用于对照。

⇒ 本目录的 `word_count` 与微信页面/编辑器自报的"字数"**不是同一口径**，彼此不可直接比较。判定时请统一用本口径。

**实测口径校准（2026-10-13，第 13–15 篇采集时逐篇核对）：**

- `scripts/input-wechat.mjs` 打印的 `cjk` 与本目录 `word_count` **同口径、同正则、可直接相等**。首个闭环验证点：`social-security-sustainability`（常识Prologue）——脚本侧 `cjk = 2637`，样本侧 `word_count = 2637`，两边完全吻合。
- **跨工具比较只用 `cjk` ↔ `word_count`。不要用脚本的 `chars` 去比对**：`chars = cjk + latinWords`，恒大于 `word_count`，直接比对会得到"样本被截断/字数不符"的假阳性（实测第 13 篇：`cjk = 19499`、`latinWords = 362`、`chars = 19861`，而 `word_count = 19499`）。
- 本目录的 `char_count` 与脚本的 `nonSpaceChars` **同口径**（去空白后的全部字符数，含 `![图N]` 占位符），即 `char_count` **既不等于** `chars` 也**不等于** `cjk + latinWords`。

### 2.4 `fetch_status` 取值

| 值 | 含义 |
|---|---|
| `ok` | HTTP 200，解析出 `id="js_content"` 容器且正文长度 > 200 字符 |
| `no_js_content` | HTTP 200，页面有 `js_content` 但正文近乎为空（图片/海报/视频卡片型推送） |
| `content_bad_param` | 页面标记「参数错误」（短链 ID 被搜索结果摘要截断或链接失效） |
| `content_deleted` | 页面标记「该内容已被发布者删除」 |
| `captcha_redirect` | 302 到 `mp/wappoc_appmsgcaptcha` |
| `fetch_error` | 网络层异常（本批未出现） |

**失败篇目一律不进入 `samples/`。**

## 3. 正文抽取规范

1. 容器：`id="js_content"`。以该属性定位后，向前回退到最近的 `<div`，再按 **div 深度配对**切片。
2. 交叉校验：同一容器另按「首个 `var first_sceen__time` 之前最后一个 `</div>`」切片，两法在本批 5 篇抽样中字符数**完全一致**（见第 10 节命令），故认为抽取未截断。
3. 去标签；`<img>` → `![图N]` 占位符（N 为正文内出现序号）；`p` / `div` / `section` / `li` / `br` → 换行；HTML 实体解码（`&nbsp;` `&amp;` `&#x…;` 等）。
4. **不做任何后期清洗**：公众号文末的推广、往期链接、二维码引导、招聘启事等一律**原样保留**。判定环节若需纯正文，请自行处理，不要回改样本。
5. **不补字、不删段、不改错别字、不合并图片说明**。抓不下来就换一篇（见第 6 节），严禁编造正文或元数据。

## 4. 分类口径

- `category`（采集分类；**只分类，不评分、不判定质量**——质量与档位判定属另一环节）。全目录存在两套命名，按入库批次区分：
  - **第一、二批（第 1–15 篇）**：`论证型` / `教程型` / `报道型` / `叙事散文型`（历史取值，未回改）。
  - **第三批（第 16–30 篇）**：改用 `references/01-genre-routing.md` §42 的七标签闭集中文名——`argument` 论证/评论、`academic` 学术/技术论证、`tutorial` 教程/操作指南、`news` 新闻报道、`exposition` 科普/解释、`narrative` 叙事/文学、`persuasion` 营销/说服；论证性分数落在 0.30–0.60 的边界篇用该文档 §30 的判定值 `混合/不确定`。
  - 映射：`论证型` ≈ `论证/评论` ＋ `学术/技术论证`；`教程型` ≈ `教程/操作指南`；`报道型` ≈ `新闻报道`；`叙事散文型` ≈ `叙事/文学`。
- `tier`：映射到 `docs/research/genre-taxonomy.md` 的 A/B/C 档，供判定环节直接使用：
  - **A** = 论证/评论 + 学术与技术论证（全量批判性审查）
  - **B** = 科普/解释、营销说服、个人随笔观点帖（降级审查，只审显式主张）
  - **C** = 教程/参考、新闻报道、文学叙事（换判据：可操作性 + 事实可信度 + 信息密度，须声明未做论证审查）
- `length_band`：`短` < 5000 汉字 ≤ `中` ≤ 15000 汉字 < `长`。
- 边界篇一律在 `category_note` 里写明判定理由与保留意见（例：`beyondcorp-managed-device-access` 是技术讲解/参考而非步骤式 how-to，归 B 档解释类；`howtolivebetter-site-retrospective` 是过程复盘，教程属性中等）。
- 注意：D5 要求的 `labels.jsonl`（每题期望档位，用户复核）**不在本批采集产出内**，由判定环节另行写入。

## 5. 采集通道与实测产出率（2026-10-13，Windows / Node 24）

**唯一有效通道**：通用检索把 `mp.weixin.qq.com`（或 `/s`）本身当查询词 → 从结果中抽 `mp.weixin.qq.com/s/<id>` 短链 → Node 原生 `fetch`（Chrome UA + `Accept-Language: zh-CN`，走 OpenSSL 栈）→ 解析 `id="js_content"`。

**第 2 批补采（同为 2026-10-13，目标＝找 >15000 汉字长文）追加 21 条查询**，全部使用 `"mp.weixin.qq.com/s" <主题>` 的**引号精确短语**形态（含叠加 `人物` / `三联生活周刊` / `南方周末` / `GQ报道` / `人间theLivings` / `正午故事` / `真实故事计划` / `谷雨` 等长篇账号名）：结果位 116、抽到短链 115、唯一新短链 96、成功抓取 89（失败 7：`no_js_content` 6、`captcha` 1）。这一批单查询产出 7–11 条短链，显著高于形态 B 的 1.26 条/查询。

| 查询式形态 | 查询数 | 检索结果位 | 抽到短链 | 链接/结果位 | 链接/查询 | 有产出查询占比 |
|---|---|---|---|---|---|---|
| A `mp.weixin.qq.com <主题>` | 7 | 70 | 8 | 0.114 | 1.14 | 6/7 |
| B `mp.weixin.qq.com/s <主题>` | 76 | 754 | 96 | 0.127 | 1.26 | 45/76 |
| C `site:mp.weixin.qq.com/s <主题>` | 5 | 32 | 6 | 0.188 | 1.20 | 4/5 |
| **合计** | **89** | **857** | **111 次命中 / 119 条唯一短链** | — | — | **56/89** |

**第三批补采（2026-10-13，目标＝按 `docs/PLAN.md` §五.1 的体裁缺口定向补齐 19 篇）追加 40 条查询**，仍全部采用 `"mp.weixin.qq.com/s" <账号名或主题词>` 的**引号精确短语**形态（分 8 批提交；其中 1 条 smoke 查询无产出、1 条因查询文件格式写错而作废——把 JSON 数组当纯文本查询文件，整份数组被当成 1 条查询）：抽到**唯一短链 292 条**，另复用第 2 批记录的 3 条备选长链，逐条抓取 **295 条**——成功（`ok`）**240 条**、`no_js_content` **55 条**、`content_bad_param` / `content_deleted` / `captcha_redirect` 均 **0 条**（无网络层失败）。

`ok` 240 条的字数结构（第 2.3 节口径）：< 1500 汉字 **90 条**、1500–5000 汉字 **105 条**、5000–15000 汉字 **43 条**、> 15000 汉字 **2 条**。

- 「长篇账号名」形态在本批继续有效（单查询仍可抽到 7–11 条短链，命中 `文化纵横` / `正午故事` / `看理想` / `单读` / `上海书评` / `果壳` 等账号），但**长尾里大量是高校 / 研究院的招生简章与会议通知**（`中山大学教务部` / `澳門大學` / `人大马院` 等），按体裁筛选的有效率低。
- 3 条备选长链（`fqJ0NYpumVKPQhkOMQd8Hg` 21502 / `MP0qdATwm9qmo537llZiSg` 15561 / `rimxzdpn1LY1c6ofF6I11Q` 15444）复抓**全部 `no_js_content`**（HTTP 200 但正文近乎为空）——第 2 批记录的长文备选已失效。
- 第 3 批入库的 15 篇选自上述 240 条 `ok`，逐篇核验见 8.1 与 8.2 第 7 条。

**实测最有效形态：给域名加引号的精确短语 + 双主题词。** 单查询产出是形态 B 平均值的 6 倍：

| 查询式 | 抽到短链 |
|---|---|
| `"mp.weixin.qq.com/s" 科技 趋势` | 8 |
| `"mp.weixin.qq.com/s" 教育 思考` | 8 |
| `"mp.weixin.qq.com/s" 健康 科普` | 8 |
| `"mp.weixin.qq.com/s" 文化 评论` | 7 |
| `mp.weixin.qq.com/s 一万五千字 长文` | 5 |
| `mp.weixin.qq.com/s 年度 演讲 全文` | 4 |

**引号精确短语形态的第 2 批实测（16 条查询逐条产出，结果位 10）**：

| 查询式 | 结果位 | 抽到短链 |
|---|---|---|
| `"mp.weixin.qq.com/s" 科技 趋势` | 10 | 10 |
| `"mp.weixin.qq.com/s" 教育 思考` | 10 | 10 |
| `"mp.weixin.qq.com/s" 健康 科普` | 8 | 8 |
| `"mp.weixin.qq.com/s" 文化 评论` | 8 | 7 |
| `"mp.weixin.qq.com/s" 人物 特稿` | 6 | 6 |
| `"mp.weixin.qq.com/s" 南方周末 深度报道` | 10 | 9 |
| `"mp.weixin.qq.com/s" 三联生活周刊 封面故事` | 6 | 5 |
| `"mp.weixin.qq.com/s" 人物 长报道` | 8 | 8 |
| `"mp.weixin.qq.com/s" GQ报道` | 8 | 8 |
| `"mp.weixin.qq.com/s" 谷雨实验室` | 8 | 7 |
| `"mp.weixin.qq.com/s" 三联生活周刊 深度调查` | 9 | 9 |
| `"mp.weixin.qq.com/s" 南方周末 特稿` | 8 | 8 |
| `"mp.weixin.qq.com/s" 万字长文` | 6 | 5 |
| `"mp.weixin.qq.com/s" 万字 长文 报告` | 6 | 5 |
| `"mp.weixin.qq.com/s" 非虚构 写作` | 8 | 8 |
| `"mp.weixin.qq.com/s" 真实故事计划` | 11 | 10 |
| `"mp.weixin.qq.com/s" 正午故事` | 9 | 7 |
| `"mp.weixin.qq.com/s" 人间theLivings` | 11 | 11 |
| `"mp.weixin.qq.com/s" 中国新闻周刊 调查` | 10 | 10 |
| `"mp.weixin.qq.com/s" 谷雨 非虚构 长报道` | 9 | 9 |
| `"mp.weixin.qq.com/s" 人物 深度报道` | 8 | 7 |

**⇒ 结论修订：引号精确短语 + 长篇账号名这一形态在长文上有产出**（第 2 批一次捞出 8 篇 >15000 汉字，见 8.2 第 1 条），原先「体量词捞不到长文」的结论只适用于 `一万五千字 / 万字 / 年度演讲全文` 这类**体量词/体裁词**查询式，不适用于**账号名**查询式。

**口径提示**：本节的产出率以「抽到短链」计，与正文长度无关；判断是否长文必须抓回正文后按第 2.3 节口径数汉字（`cjk` ↔ `word_count`）。

小结（按实测排序）：**引号精确短语 + 双主题词 > `site:` 限定 > 裸域名加主题 > 长尾体量词（产出链接不少，但无长文）**。

## 6. 抓取失败分布（第二批 119 条短链；第三批 295 条另计）

| fetch_status | 计数 | 判定依据 |
|---|---|---|
| `ok` | 89 | 正文 > 200 字符 |
| `no_js_content` | 19 | HTTP 200 且存在 `id="js_content"`，但正文极短：重抓复核为 **0–122 汉字**（招聘海报、图片通知、视频卡片型推送），不达正文门槛 |
| `content_bad_param` | 7 | 页面标记「参数错误」；主因是搜索结果摘要把短链 ID 截断（< 20 字符） |
| `content_deleted` | 3 | 页面标记「该内容已被发布者删除」 |
| `captcha_redirect` | 1 | 302 到 `mp/wappoc_appmsgcaptcha` |

- **全部失败都在内容层，119 条请求 HTTP 状态码均为 200（无网络层失败）**，说明封禁/验证码不是主要噪声源，链接可用性才是。
- 失败篇目不入库；`no_js_content` 一类属"非文章"，不是抓取缺陷。

**第三批实测（295 条逐条抓取，全部为 `mp.weixin.qq.com/s/<id>` 分享短链）**：`ok` **240**、`no_js_content` **55**（18.6%；全部为机构通知 / 招聘海报 / 视频卡片型推送）、`content_bad_param` **0**、`content_deleted` **0**、`captcha_redirect` **0**、网络层失败 **0**。与第二批（`no_js_content` 16.0%、`content_bad_param` 5.9%、`captcha` 0.8%）相比，本批**无链接失效、无验证码**：只用分享短链、且抽链正则要求 ID ≥ 10 字符，避开了第二批 `content_bad_param` 的成因（搜索结果摘要把短链 ID 截断）。

## 7. 已验证不可用的通道（勿重试）

| 通道 | 实测结果 |
|---|---|
| 公众号长链 `?__biz=…&mid=…` | 302 → 验证码页（`docs/DECISIONS.md` #3） |
| 搜狗微信搜索 | 列表页能列出标题，点入 302 到 `/antispider/` |
| 传送门 chuansongme.com / 爱微帮 aiweibang.com | 域名不通 |
| 微口网 vccoo.com | HTTP 530 |
| `web_search` / `read_page` 检索桥接 | 整体 429 |
| 沙箱内 `curl.exe` 直连 HTTPS | `SEC_E_NO_CREDENTIALS`（Windows 原生 TLS 栈不可用）→ 必须用 Node `fetch` |

## 8. 本批覆盖矩阵与缺口

### 8.1 覆盖矩阵（30 篇）

| # | slug | 类别 | tier | 字数 | 篇幅档 | 发布日 | 公众号 |
|---|---|---|---|---|---|---|---|
| 1 | `social-security-sustainability` | 论证型 | A | 2637 | 短 | 2026-08-18 | 常识Prologue |
| 2 | `token-ai-sociotechnical-imagination` | 论证型 | A | 12083 | 中 | 2026-08-17 | 传媒观察杂志 |
| 3 | `tubatu-platform-liability` | 论证型 | A | 3898 | 短 | 2018-09-12 | 经济观察报 |
| 4 | `pika-video-generation-tutorial` | 教程型 | C | 2843 | 短 | 2023-12-13 | 知识共享计划 |
| 5 | `python-progress-bar-methods` | 教程型 | C | 647 | 短 | 2021-02-21 | AI实力派 |
| 6 | `beyondcorp-managed-device-access` | 教程型 | B | 4584 | 短 | 2018-10-28 | 掮客酒馆 |
| 7 | `howtolivebetter-site-retrospective` | 教程型 | B | 2174 | 短 | 2026-10-04 | AI工具进化论 |
| 8 | `xinjiang-flood-report` | 报道型 | C | 4494 | 短 | 2026-06-28 | 三联生活周刊 |
| 9 | `wang-chuan-forty-years` | 报道型 | C | 5361 | 中 | 2026-06-08 | Hi艺术 |
| 10 | `boris-mitic-documentary-interview` | 报道型 | C | 6980 | 中 | 2022-01-26 | 纪录公社 Jilu Commune |
| 11 | `a-prose-piece-midlife` | 叙事散文型 | B | 4106 | 短 | 2026-01-09 | 猫助广播 |
| 12 | `liaoyuan-garden-travelogue` | 叙事散文型 | C | 8280 | 中 | 2024-03-13 | V中文版 |
| 13 | `waimai-riders-trapped-in-the-system` | 报道型 | C | 19499 | 长 | 2020-09-08 | 人物 |
| 14 | `suicide-rescue-eighteen-days` | 报道型 | C | 20670 | 长 | 2018-08-20 | 人间theLivings |
| 15 | `hengshui-high-school-2557-days` | 报道型 | C | 19774 | 长 | 2021-09-01 | 正面连接 |
| 16 | `over-modelization-critique-economics` | 学术/技术论证 | A | 6973 | 中 | 2026-04-15 | 中国学派 |
| 17 | `causal-inference-yipay-risk-model` | 学术/技术论证 | A | 3420 | 短 | 2023-05-30 | DataFunSummit |
| 18 | `breaking-five-onlys-academic-thresholds` | 学术/技术论证 | A | 5357 | 中 | 2021-10-08 | 探索与争鸣杂志 |
| 19 | `strawberry-pesticide-residue-explained` | 科普/解释 | B | 2497 | 短 | 2026-03-18 | 中国科学报 |
| 20 | `indebtedness-and-help-avoidance` | 科普/解释 | B | 2664 | 短 | 2018-08-15 | 果壳 |
| 21 | `gut-microbiota-ribosomal-peptides` | 科普/解释 | B | 2085 | 短 | 2021-12-17 | 中科院之声 |
| 22 | `chatgpt-as-my-best-friend` | 论证/评论 | B | 5595 | 中 | 2025-11-19 | 单读 |
| 23 | `wang-hong-prize-education-trauma` | 论证/评论 | B | 5815 | 中 | 2026-07-29 | 看理想 |
| 24 | `comedy-variety-show-review` | 论证/评论 | B | 4994 | 短 | 2024-09-09 | 看理想 |
| 25 | `direct-phd-admission-debate` | 论证/评论 | B | 4577 | 短 | 2021-09-14 | 中国科学报 |
| 26 | `reading-club-invitation-soft-launch` | 营销/说服 | B | 3469 | 短 | 2026-08-23 | 携隐Melody |
| 27 | `qigong-training-enrollment-notice` | 营销/说服 | B | 1765 | 短 | 2026-04-08 | 中国医学气功学会 |
| 28 | `influencer-seeding-industry-pitch` | 营销/说服 | B | 3200 | 短 | 2022-01-18 | TopKlout克劳锐 |
| 29 | `three-hundred-years-ago-sex-and-marriage` | 混合/不确定 | B | 12887 | 中 | 2023-09-15 | 青年志Youthology |
| 30 | `liang-hong-china-in-liangzhuang` | 混合/不确定 | B | 10655 | 中 | 2021-04-04 | 搜神记SoShine |

统计（30 篇）：
- 类别——**第一、二批 15 篇**：论证型 3 / 教程型 4 / 报道型 6 / 叙事散文型 2；**第三批 15 篇**：学术/技术论证 3 / 科普/解释 3 / 论证/评论 4 / 营销/说服 3 / 混合/不确定 2。（两套 `category` 命名的映射见第 4 节。）
- tier：A 3＋3＝**6** / B 3＋12＝**15** / C 9＋0＝**9**。
- 篇幅档：短 8＋9＝**17** / 中 4＋6＝**10** / **长 3**（第 13、14、15 行，全为报道型）。

第 13–15 行入库路径不同：第 13 篇由**用户提供的已知分享短链**直接入库（非检索所得）；第 14、15 篇由**第 2 批引号精确短语检索**所得（见 8.2 第 1 条）；第 16–30 篇由**第 3 批引号精确短语检索**所得（见 8.2 第 7 条），采集口径与前两批一致（同一 `id="js_content"` 容器切片逻辑，`collect_method` 逐篇记录）。

`类别` 一列混用两套命名：第 1–15 行为第一批取值（`论证型` / `教程型` / `报道型` / `叙事散文型`），第 16–30 行为第三批取值（七标签闭集中文名 ＋ `混合/不确定`），映射见第 4 节。

### 8.2 缺口（必须如实交接）

1. **~~长文（> 15000 汉字）0 篇——未达标。~~ 已闭合（2026-10-13）。**
   - **闭合方式：用户提供的已知分享短链，非检索所得。** 第 13 篇 `waimai-riders-trapped-in-the-system`（《外卖骑手，困在系统里》/ 人物 / 19499 汉字）由**用户直接给出** `https://mp.weixin.qq.com/s/Mes1RqIOdp48CMw4pXTwXw` 入库，本批检索侧未产出该链接（其 `discovered_via` 如实记为「用户提供的分享短链, user-provided; 非检索所得」）。
   - **原检索结论保留（真实发现，未被推翻）**：已用 20 条针对「一万五千字 / 万字 / 两万字 / 论文全文 / 白皮书 / 长篇连载 / 年度演讲全文」的查询专门打捞，均无产出；微信生态内该体量的文章在通用检索下基本捞不到。本批最长样本为 12083 汉字（第 2 行学术论文），距 15000 门槛仍有约 3000 字。
   - **第 2 批复检（2026-10-13，共 21 条查询，全部为 `"mp.weixin.qq.com/s" <主题>` 引号精确短语形态；10 条首批 ＋ 11 条补采）修正了上述结论的适用范围**：**用「长篇账号名」而非「体量词」做查询词时，长文是可以捞到的**。第 2 批捞出 >15000 汉字 **8 篇**（去重后），其中 3 篇已入库：
     - 第 14 篇 `suicide-rescue-eighteen-days`（《自杀式营救的十八天丨人间》/ 人间theLivings / 2018-08-20 / 20670 汉字，全目录最长）
     - 第 15 篇 `hengshui-high-school-2557-days`（《和衡水中学在一起的2557天》/ 正面连接 / 2021-09-01 / 19774 汉字）
     - 其余 5 篇 >15000 未入库（备选）：`fqJ0NYpumVKPQhkOMQd8Hg`《流感下的北京中年》21502 / `oVSnzEfdGmeraBRbSuTdpw`《画了这么多珍稀植物，他自己也是濒危物种啊》17504 / `MP0qdATwm9qmo537llZiSg`《正午 | 社会主义女子图鉴》15561 / `rimxzdpn1LY1c6ofF6I11Q`《罗永浩 锤下那个理想主义者》15444。
   - 仍未闭合的部分：>15000 的**论证/评论、教程/操作指南、叙事/文学**长文各 0 篇（现有 3 篇长文全属报道型）。
   - **第三批复检（2026-10-13，40 条查询用尽）**：第三批专门用 8 条查询（`"mp.weixin.qq.com/s" <长篇账号名或体裁词>`，含 `文化纵横` / `正午故事` / `腾讯技术工程` / `学术 长文 万字` / `深度 调查 长篇` 等）打捞 >15000 的论证 / 教程 / 叙事长文，结果 **0 篇**。池内 240 条 `ok` 中 >15000 汉字仅 2 条，且都不是缺口体裁：`CC_0Mk_vabW4FR0ehRhV-g`（人间theLivings，20670 汉字，＝已入库第 14 篇报道型）、`oVSnzEfdGmeraBRbSuTdpw`（人物，17547 汉字，报道型人物特稿；因本批禁用报道型长文未采用）。
   - 池内**非报道型**最长三篇均未过门槛：`9X0BXh2MHZKvX8Zgk6J34A` 14165（中国科学院院刊，悼念周光召）、`ad6y-pCe1_PV7iNA7Uh1bg` 13786（大淘宝技术，Prompt 教程）、`U2SIrCCHHt3K0YX2xrt9sA` 13749（人工智能前沿讲习，网络优化与正则化）。第 2 批记录的三条备选长链复抓**全部 `no_js_content`**（见第 5 节），已无法取用。
   - ⇒ 保留为**未闭合缺口：长文追加 3 篇**（论证/评论 1、教程 1、叙事散文 1）。闭合路径只剩两条：由用户提供已知分享短链（同第 13 篇），或启用 `docs/PLAN.md` §五.1 的「2 万字档代替 >3 万字档」裁定。
2. **叙事散文型（第 11、12 行）仍仅 2 篇**，为「每类 ≥2」的下限，无冗余；第三批任务书限定的缺口清单中不含该簇，**本批未新增**。
3. **教程型 4 篇中有 2 篇（第 6、7 行）教程属性中等**（技术讲解 / 过程复盘），已在 `category_note` 标注；若判定环节要求严格 how-to，可视为教程型实际 2 篇。第三批**未新增教程篇**（任务书限定）；`docs/PLAN.md` §五.1 列出的教程/操作指南四个专项情形（缺前提不可复现 / 版本过期 / 优质 how-to 的 C 档上限 / 仅目录页 V5）**仍全部未覆盖**。
4. 30 篇**全部为微信公众号来源**（满足"公众号 ≥8 篇"）。澎湃 / 知乎专栏 / 人人都是产品经理等非公众号平台三批均**未采用**。
5. `account` 为账号**现用名**，可能与发文时名称不同（例：第 5 行正文页眉仍写"Python学习与数据挖掘"，页面解析所得账号名为 `AI实力派`）。
6. 30 篇中 29 篇为**图文稿**（图片已替换为 `![图N]` 占位符，图像本身未下载存档）：第 11 行原文无图（`images = 0`）；第 3 批 15 篇每篇 1–70 张图，无 0 图篇目。
7. **第三批按 `docs/PLAN.md` §五.1 缺口定向补采 15 篇：5 簇里 4 簇达标、1 簇差 1 篇，另 3 个长文名额全缺**（任务书要求 19 篇、下限「完成 15 篇以上」，实交 15 篇，样本总数 15＋15＝30 篇）：
   - ✅ **学术/技术论证 3/3**（第 16–18 行；含「相关当因果」1 篇＝第 17 行 `causal-inference-yipay-risk-model`，正文 2 处「关联 → 导致 / 说明」式误推）。
   - ✅ **科普/解释 3/3**（第 19–21 行；含「实为解释却被当论证」1 篇＝第 20 行 `indebtedness-and-help-avoidance`（果壳，心理学科普，短断言句占比 P≈0.31，明显高于同批两篇对照科普的 0.14–0.16）、疑似伪引用 1 篇＝第 21 行 `gut-microbiota-ribosomal-peptides`（中科院之声，含「研究表明 / 研究者发现」式引用 2 处，而全文文献样式串仅 1 处、且只是「期刊」二字，无可核查的文献条目）、正常科普 1 篇＝第 19 行）。
   - ✅ **个人随笔/评论 4/4**（第 22–25 行；含「显然/众所周知」预设装载 1 篇＝第 25 行 `direct-phd-admission-debate`（中国科学报，`显然`/`众所周知` 类预设触发词 2 处））。
   - ✅ **营销/说服 3/3**（第 26–28 行；含导流软文 1 篇＝第 26 行 `reading-club-invitation-soft-launch`（携隐Melody，读书会招募＋导流触发词 7 处：扫码 / 二维码 / 微信 / 优惠 / 留言 等）、健康类 1 篇＝第 27 行 `qigong-training-enrollment-notice`（中国医学气功学会，培训班招生通知，养生/调理/疗效类触发词 26 处、推广触发词 23 处，其中「报名」7 处）、行业推销稿 1 篇＝第 28 行 `influencer-seeding-industry-pitch`（TopKlout克劳锐，种草行业方法论＋榜单推销））。
   - ❌ **混合/不确定 2/3：差 1 篇**。论证性分数落在 0.4–0.6 且「一半叙事一半论证」的合格候选，池内只找到 2 篇（第 29、30 行，近似分 0.51 / 0.48）；其余同分段候选（`tJNzvlrm1o6qT1ac7XOMxw` 溪言嬉语 0.45、`rGP0WFnT1RBdY6GDtSkP2A` 界面文化 0.45、`Zj9ctgGc-6jbM3oCiRaFew` 上海书评 0.45）经通读判定为「单一文体＋少量反例句」，不构成真正的半叙事半论证，**故未凑数**。
   - ❌ **长文追加 3 篇（论证/评论 1、教程 1、叙事散文 1）：0/3**，原因见本条第 1 项（>15000 汉字候选在池内仅 2 篇，且均非缺口体裁；备选长链全部失效）。
   - 判定口径：本批 `category` 用 `references/01-genre-routing.md` §42 的七标签闭集；论证性分数用该文档 §L0-R4 公式的**近似实现**（指示词密度 D、断言句占比 P、对立标记 O 可计，**S 项无结构统计故恒取 1.0**）——仅用于选篇，不作为判定结论。计数口径（可复核）：**预设触发词**＝`显然`/`众所周知`/`不言而喻`/`毋庸置疑`/`毫无疑问`/`自不必说`/`显而易见`；**推广触发词**＝`扫码`/`二维码`/`购买`/`下单`/`优惠`/`限时`/`加群`/`课程`/`报名`/`训练营`/`阅读原文`/`点赞`/`在看`/`转发`/`关注`/`点击`/`咨询`/`客服`/`微信`/`私信`/`留言`/`回复`；**健康触发词**＝`养生`/`气血`/`排毒`/`免疫力`/`调理`/`中医`/`食疗`/`体质`/`经络`/`祛湿`/`补肾`/`保健`/`亚健康`/`痊愈`/`疗效`/`功效`；**相关当因果**＝正则 `(相关性|关联|越…越|成正比|随之升高)[^。；]{0,40}(导致|造成|引起|说明|意味着|证明|就是因为)`；**引用式表述**＝`研究表明`/`研究显示`/`科学家发现`/`数据显示`/`据统计`/`专家表示`/`有研究称`/`调查显示`。
8. **第 1 批 2 篇正文含零宽字符、3 篇 `discovered_via` 为空数组——按第 3.4 节「不做任何后期清洗」保持原样未清洗**，已在 `testset/selfcheck.mjs` 中登记为**受控遗留例外**（每次运行报 WARN，非清单文件命中则硬失败）：`pika-video-generation-tutorial`（U+200D×84 ＋ U+FEFF×1，段尾填充与 `核心﻿是训练GPT4.0`）、`python-progress-bar-methods`（U+200D×1，正文首行）；空 `discovered_via`：`python-progress-bar-methods` / `token-ai-sociotechnical-imagination` / `wang-chuan-forty-years`。第 3 批 15 篇零宽字符 **0 处**、`discovered_via` 全部非空。

## 9. 合规

- 只用公开可访问的页面；**不绕过任何登录、验证码或付费墙**。
- 版权归原作者与原公众号所有，本目录仅作内部测试集使用、不再分发（逐篇记于 `license_note`）。
- 正文未做删改；不编造、不补全、不影响原意。

## 10. 复现

采集脚本（检索 / 抽链 / 抓取 / 解析，第 1–3 步）**不随本批入库**，逻辑已完整描述于第 3、5 节；随目录入库的唯一脚本是第 6 步的 `testset/selfcheck.mjs`。等价复现步骤：

```powershell
$node = "C:\Users\hades\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"
$cli  = "C:\Users\hades\.dsh\skills\anysearch\scripts\anysearch_cli.js"

# 1) 检索：批量查询用 @file 形式（JSON 数组，无 BOM UTF-8；batch_search 不认顶层 --zone/--language）
& $node $cli batch_search --queries "@queries.json" | Out-File -Encoding utf8 search-01.md

# 2) 抽短链：正则 /mp\.weixin\.qq\.com\/s\/([A-Za-z0-9_-]{10,})/g 去重
# 3) 抓取：Node fetch（Chrome UA + Accept-Language: zh-CN，redirect: follow）
# 4) 解析：id="js_content" → div 深度配对切片 → 去标签 → img→![图N] → 汉字计数
# 5) 校验：同一容器按「首个 var first_sceen__time 前最后一个 </div>」二次切片，字符数应一致
# 6) 自检：全目录样本结构校验（配对 / 键序 / 口径 / 占位符 / 编码），只读、可复跑、可加 --quiet
& $node testset\selfcheck.mjs
```

抽取交叉校验抽样（两法字符数一致，证明未截断）：`KWt-zIV7MdXJ18LOVQ7C2Q` 22063/22063、`iX5OtBPy-QUj5FMzHxtdTw` 96912/96912、`LOBPuax8XLEwWgDZvYTV0g` 121919/121919、`2mNvuaXUKtBr-Vsk0e5hGA` 146502/146502、`na95StPdnaZ3xsJTEpLxcQ` 696523/696523。

**`testset/selfcheck.mjs`（第 3 批新增、随目录入库）**：纯 ASCII 源码、只读、不修改任何样本，一条命令跑完全部结构自检——`.md` / `.meta.json` 一一配对与 slug 唯一性、`meta` 28 键**键序**、front-matter 15 字段**键序**、两文件字段互相一致、`word_count` ＝ 正文重算 CJK 汉字数、`char_count` ＝ 正文去空白字符数、`![图N]` 计数与编号连续性（＝ 1..N 且首现顺序递增）与 `images` 一致、无 CRLF、无零宽字符、无 HTML 残留、`tier` / `length_band` 取值合法、`discovered_via` 非空、`http_status` / `fetch_status` 常量。

```powershell
& $node testset\selfcheck.mjs          # 全量输出；成功时打印 samples=/checks=/passed=/failed=/warnings= 与 SELFCHECK OK，退出码 0
& $node testset\selfcheck.mjs --quiet  # 只打印汇总行
```

当前结果：**30 篇 × 42 项 ＝ 1260 项检查、0 失败、5 条受控遗留告警**（告警内容与豁免理由见 8.2 第 8 条）。

第 3 批（第 16–30 篇）的抽取口径与前两批一致，并**逐篇做了首/尾段落核验**（读正文首 2 段 ＋ 末 3 段，确认开头正常、结尾为正常段落末尾，非半句、非「点击查看原文」式尾巴）；但**未重跑**上文「二次切片字符数一致」这一交叉校验。

---

采集：delegated collection-agent，2026-10-13（第一批 12 篇 ＋ 当日补采 3 篇长文 ＝ 15 篇；第三批按缺口定向补采 15 篇 → 共 30 篇）。字段口径若变更，请同时更新本节与全部 `.meta.json`（不要只改 README）。

**本次补采（第 13–15 篇）对本文的修订点**：第 2.3 节追加 `cjk` ↔ `word_count` 同口径实测校准与「不要用 `chars` 比对」；第 5 节追加第 2 批 21 条引号精确短语查询的逐查询产出一览，并修订「体量词捞不到长文」这一结论的适用范围；第 1、8.1、8.2 节的篇数、类别/篇幅分布与长文缺口状态同步更新。第 10 节的**复现命令与抽样校验值仍为第一批原样，未重新验证**——第 13–15 篇的抽取口径与第一批一致（同一 `id="js_content"` 容器切片逻辑），但未再做「二次切片字符数一致」这一交叉校验。

**第三批补采（第 16–30 篇，2026-10-13）对本文的修订点**：第 1、8.1 节篇数与类别 / 篇幅分布同步更新至 30 篇（覆盖矩阵新增第 16–30 行）；第 4 节新增第三批 `category` 取值口径（改用 `references/01-genre-routing.md` 七标签闭集中文名）与两套命名的映射；第 5 节追加第三批 40 条查询的产出结构；第 6 节追加第三批 295 条抓取的失败分布；第 8.2 节新增第 7、8 条并标注「长文追加 3 篇」「混合/不确定 1 篇」仍未闭合；第 10 节新增 `testset/selfcheck.mjs` 用法、当前自检结果与第三批首尾段落核验说明。**第 1、2 批的历史结论与缺口记录一律保留，未删除任何条目**（已闭合的标注闭合，未闭合的照旧保留）。
