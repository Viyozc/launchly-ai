# Launchly — 1 页 PRD（产品需求文档）

> 状态：P1（立项已 GO，静态审计站已建）｜ 更新：2026-07-22 ｜ 作者：Agent（无人值守 loop）

## 1. 一句话定位（楔子）

**免费「课程销售页转化就绪度」0–100 综合审计 + 付费 AI 改写。** 帮课程 / 数字产品创作者在 60 秒内知道自己销售页的转化率短板，并一键拿到改写后的高转化文案。

同构于 Listora（Etsy listing 审计）与 Newsletterly（newsletter 增长就绪度审计）——「先审计、再生成」飞轮，占住审计/评分蓝海（Jasper/Copy.ai 只生成不审计）。

## 2. 目标用户

- **核心**：在 Gumroad / Teachable / Kajabi / Thinkific / Skool / Systeme.io 卖课程或数字产品的独立创作者。
- **量级**：Gumroad 15 万+ 产品作者、Whop 18.3 万卖家、Kajabi/Teachable 数十万付费创作者。
- **付费核心画像**：「课做出来了但卖不动」的认真创作者（类比前几站 ~90 万认真 Etsy 卖家）。
- **强交叉**：Etsy 卖家、KDP 作者、Mockup 卖家、Newsletter 创作者 → 他们本质都是「卖自己知识/数字产品」的潜在课程创作者，**五站 footer 互链形成最强交叉漏斗**。

## 3. 市场与付费意愿

- 全球 eLearning $325B→$370–400B(2026)；创作者经济 $250B→$480B(2027)，教育内容增速最快。
- Gumroad 146K 产品：44% 赚 $0、top1% 拿 77% 收入；中位产品仅 28 次终身销售。痛点 = 转化（funnel），非内容质量。
- 创作者已在为营销付费：ChatGPT $20、Jasper $49、Kajabi $149–399、Teachable $39–119/月 → 付费意愿强。
- 关键词商业意图强且结果多为「博客教学」非「工具」：course sales page、sales page copy、landing page optimization、course launch checklist。

## 4. MVP 范围（Next.js + Supabase + LLM，复用 etsy-listing-ai/mvp 骨架）

| 模块 | 内容 |
|---|---|
| 落地页 | 静态审计站（已建 launchly-ai/），接 Formspree 邮件捕获 |
| 审计引擎 | 七维评分 Headline15/Pain13/Proof15/Benefit13/CTA14/Pricing15/SEO15=100（已跑通逻辑） |
| 生成（付费） | /api/rewrite：输入销售页现状 → LLM 输出完整高转化销售页文案 + 3 个 A/B 标题 + 邮件序列草稿 |
| 埋点 | /api/audit-log：匿名记录审计次数（修复「无集中度量」缺口，复用 etsy-listing-ai/mvp/supabase/schema.sql 的 audit_logs 表） |
| 付费墙 | Freemium：$9/月 解锁 AI 改写 + 多版本；免费仅看分数+前 3 修复点 |

## 5. 商业模式

- **Freemium**：$0 审计拿分数 → $9/月 解锁 AI 完整改写 + A/B 文案 + 邮件序列。
- 锚定：低于 Jasper($49)/Kajabi($149)，高于「纯免费」竞品，定价对标 Listora 体系。
- 交叉变现：五站矩阵互链，单用户多工具渗透。

## 6. 验证门槛（进 MVP 开发前必须达）

- 各站（含 Launchly）≥ **200 次审计** + ≥ **50 个邮件订阅** → 触发 MVP 开发。
- 度量：audit_logs 表（匿名审计次数）+ Formspree 订阅数（meeyzkdp）。
- 当前：静态站已建；真实流量需 zc 发 content-plan + 跑 2 周。

## 7. 风险与缓解

| 风险 | 缓解 |
|---|---|
| Jasper/大玩家加「审计」功能挤压 | 极致课程垂直 + 免费钩子 + 矩阵分发，先做透 niche |
| 审计模型需校准 | 上线后用真实提交校准七维权重；弱/强页已实测 32/100 可分化 |
| 流量获取难 | 复用四站已验证的获客内容打法（小红书/YouTube/Reddit/Pinterest）+ 矩阵互链 |
| 合规 | AI 生成内容标注（沿用前站规则） |

## 8. 与既有矩阵关系

第五站，受众高度重叠，footer 互链（Launchly 已含四站；四站待补 Launchly 链接）。形成「Etsy 卖家 → KDP 作者 → Mockup 卖家 → Newsletter 创作者 → 课程创作者」全链路工具矩阵，单流量池多转化。
