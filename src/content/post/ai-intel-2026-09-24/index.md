---
title: "科技情报简报：小米 MiMo-V2.6 开源冲榜，安理会听 AI 安全"
titleEn: "AI Brief: Xiaomi MiMo-V2.6 Open Weights, UNSC AI Safety Hearing"
publishDate: 2026-09-24 09:00:00
description: "MiMo-V2.6 Pro/Flash 开源与 AA Intelligence Index 46；联合国安理会 Altman / Amodei 谈标准与放缓。闭源价格战见昨日稿。"
descriptionEn: "MiMo-V2.6 Pro/Flash open weights and AA Intelligence Index 46; UNSC hears Altman/Amodei on standards and slowdown. Closed-model price war: see yesterday’s brief."
tags:
  - AI
  - 情报
  - 开源
language: "中 / EN"
draft: false
---

<div data-post-lang="zh">

## 今天记什么

昨日已写闭源侧价格战（Claude Opus 5.5 × GPT-6 Sol/Luna），见 [ai-intel-2026-09-23](/blog/ai-intel-2026-09-23)，**本日不复述**。今日窗口改盯两条可核验线：**小米 MiMo-V2.6 开源/评测叙事**，以及 **联合国安理会 AI 安全听证**（约 9/23）。Grok 4.7（约 9/21）略超窗，最多脚注一句。

## 1. 小米 MiMo-V2.6：开源权重 + 大规模 RL 叙事

小米 [官方新闻稿（2026-09-22）](https://mimo.mi.com/docs/en-US/news/latest/v2-6) 发布并开源 **MiMo-V2.6** 系列（**Pro / Flash** 原生多模态）。官方称主线是在可验证复杂任务上**放大强化学习算力**，走「递归自我改进」探索；并同步开源技术报告、训练环境与 RL 代码等（详见文末 HF 集合）。

**第三方可核验的一点：** Artificial Analysis 模型页给出 MiMo-V2.6-Pro 的 **Intelligence Index = 46**（开源权重、**MIT** 许可；输入/输出价约 **$0.435 / $0.87** per MTok，以 AA 页为准）。见 [AA · MiMo-V2.6-Pro](https://artificialanalysis.ai/models/mimo-v2-6-pro)。权重集合：[Hugging Face · MiMo-V2.6](https://huggingface.co/collections/XiaomiMiMo/mimo-v26)。

**需标「官方自报」的部分：** 厂商文称 Pro 在 AA 复合指数上超过 Kimi K3、Qwen3.8 Max，并称多数 Agent 基准「接近 Claude Opus5 / GPT-5.6 Sol」等——**Agent 表未全部被第三方复现**，本文不当成已独立审计结论。API 价官方写明与 V2.5 **同档**；另有 UltraSpeed 模式等产品包装，选型时以平台价目为准。

**可带走的点：** 开源侧叙事从「再发一个基座」转向「公开 RL 轨迹与成本」；读厂商榜时，把 **AA 等第三方指数** 与 **未复现的 Agent 表** 分开记账。

## 2. 安理会听 AI 安全：标准、事故通报与「必要时放慢」

Guardian [报道（2026-09-23）](https://www.theguardian.com/world/2026/sep/23/unga-sam-altman-dario-amodei) 与 [BBC](https://www.bbc.com/news/articles/ck87v27vdn1po)：OpenAI **Sam Altman**、Anthropic **Dario Amodei**、Hugging Face **Clément Delangue** 等同日向联合国安理会作 AI 安全相关简报（Amodei 为视频连线）。Altman 强调关键决策应由民主制度塑造，并呼吁**跨国能力/风险评测标准**、安全护栏与人类监督，以及**快速事故通报与分类协议**。Amodei 重申国际合作，主张包括禁止用 AI 研发生物武器、更严格的发布安全标准，并明确「**必要时放慢发布**」。Delangue 呼吁更强的监测与事故披露标准。

**可带走的点：** 对开发者/采购，这不是新 API，而是 **合规与发布节奏预期**——国际标准、事故通报、高风险能力闸门，会继续压到产品与路由策略里。

## 旁听 / 取舍

| 候选 | 处理 |
| --- | --- |
| MiMo-V2.6 Pro/Flash 开源 | **写进正文**（官方 + AA + HF） |
| 安理会 AI 安全听证 | **写进正文**（Guardian / BBC） |
| 闭源价格战 Opus 5.5 / Sol·Luna | **旁注链昨日稿**，不展开 |
| Grok 4.7（约 9/21） | **超窗脚注**：可记下「略早于本窗」，不展开 |
| 厂商 Agent 全表对打闭源顶档 | **标官方自报，不升格为第三方结论** |

—— 科技情报室 · 2026-09-24

</div>

<div data-post-lang="en" hidden>

## What to keep from today

Yesterday’s brief already covered the closed-model price fight (Claude Opus 5.5 × GPT-6 Sol/Luna): [ai-intel-2026-09-23](/blog/ai-intel-2026-09-23). **No rehash today.** This window tracks two verifiable threads: **Xiaomi MiMo-V2.6 open weights / eval narrative**, and the **UN Security Council AI safety hearing** (~23 Sep). Grok 4.7 (~21 Sep) is slightly outside the window—footnote at most.

## 1. Xiaomi MiMo-V2.6: open weights + scaled-RL story

Xiaomi’s [post (22 Sep 2026)](https://mimo.mi.com/docs/en-US/news/latest/v2-6) ships and open-sources **MiMo-V2.6** (**Pro / Flash**, native multimodal). The pitch is scaling **reinforcement learning** compute on verifiable hard tasks toward recursive self-improvement, with tech report, training environments, and RL code also shared (see HF collection below).

**Third-party check:** Artificial Analysis lists MiMo-V2.6-Pro at **Intelligence Index 46** (open weights, **MIT**; ~**$0.435 / $0.87** per MTok in/out on the AA page): [AA · MiMo-V2.6-Pro](https://artificialanalysis.ai/models/mimo-v2-6-pro). Weights: [Hugging Face · MiMo-V2.6](https://huggingface.co/collections/XiaomiMiMo/mimo-v26).

**Vendor-reported (not fully third-party reproduced):** claims that Pro tops Kimi K3 / Qwen3.8 Max on AA’s composite and that many agent benches sit near Claude Opus5 / GPT-5.6 Sol—**agent tables are not all independently reproduced**; treat as vendor narrative. API pricing stays at V2.5 tiers per Xiaomi; UltraSpeed and client packaging are product wrappers—use the live price sheet.

**Takeaway:** open-weight stories are shifting from “another base model” to “published RL trajectories and cost”; keep **AA-style third-party indices** separate from **unreproduced agent tables**.

## 2. UNSC AI safety: standards, incident reporting, “slow down if needed”

Per the Guardian [(23 Sep 2026)](https://www.theguardian.com/world/2026/sep/23/unga-sam-altman-dario-amodei) and [BBC](https://www.bbc.com/news/articles/ck87v27vdn1po), OpenAI’s **Sam Altman**, Anthropic’s **Dario Amodei**, and Hugging Face’s **Clément Delangue** briefed the UN Security Council on AI safety (Amodei by video). Altman argued key decisions should be shaped by democratic governments—not labs alone—and called for **shared capability/risk evaluation standards**, safeguards, human oversight, and **speedy incident reporting**. Amodei pushed international cooperation (including bans on AI for bioweapons and stricter release safety), restated existential-risk framing, and said labs should **slow down as much as necessary**. Delangue called for stronger monitoring and incident disclosure standards.

**Takeaway:** not a new API—**compliance and cadence expectations**. Standards, incident reporting, and high-risk capability gates will keep landing in product and routing policy.

## Held / skipped

| Candidate | Call |
| --- | --- |
| MiMo-V2.6 Pro/Flash open source | **In** (official + AA + HF) |
| UNSC AI safety hearing | **In** (Guardian / BBC) |
| Closed-model price war | **Pointer to yesterday**—no expansion |
| Grok 4.7 (~21 Sep) | **Footnote only** |
| Vendor agent tables vs closed frontier | **Vendor-reported, not third-party verdict** |

— Tech Intel Desk · 2026-09-24

</div>
