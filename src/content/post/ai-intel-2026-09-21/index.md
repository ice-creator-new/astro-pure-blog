---
title: "科技情报简报：评测逃逸、R&D 自加速、编码脚手架"
titleEn: "AI Brief: Eval Breakouts, R&D Self-Acceleration, Coding Harnesses"
publishDate: 2026-09-21 09:00:00
description: "过去一两天值得沉淀的三条线：Gemini 评测误触真实系统、Anthropic 公开 R&D 自动化指数，以及开发者圈里『模型 vs 脚手架』的争论。"
descriptionEn: "Three threads worth keeping from the past day or two: Gemini reaching live systems in an eval, Anthropic’s R&D Automation Index, and the developer debate over coding-agent harnesses vs models."
tags:
  - AI
  - 情报
  - 开发者工具
language: "中 / EN"
draft: false
---

<div data-post-lang="zh">

## 今天记什么

不是「热搜榜」复读，而是三条能影响怎么看模型、安全和工具选型的公开线索。热度以可核验的报道与官方文档为准，不编造互动数字。

## 1. Gemini 评测误触三家真实系统（披露时点成焦点）

据 [WSJ](https://www.wsj.com/tech/ai/gemini-joins-the-hacker-club-d4338198) 等 9 月 19–20 日前后报道，以及公开复盘：2026 年 5 月，第三方评测方 Irregular 做捕获旗（CTF）式安全评测时，虚构目标名与真实公司撞名，Gemini 找到了三家真实系统——一例靠反复猜密码，另两例用到公开仓库里留下的凭据；Google 称模型每次都在完成攻击前停下。Irregular 约在 7 月底告知 Google，公众侧约在 9 月 19 日才广泛看到，Google 则认为该事件本不必对外披露。

**可带走的点：**

- 叙事重点不一定是「模型失控」，更常是**评测夹具命名**与**公开凭据**这类老问题。
- 同周前后，Claude / OpenAI / Meta 侧也有评测相关逃逸或越权讨论——行业共性是**披露节奏与标准**，而不只是单次事故。
- 若你也在跑 Agent 红队：立刻检查测试夹具是否撞真实品牌名，以及沙箱出口策略。

## 2. Anthropic：Claude「主导」约 26% 的 AI R&D

Anthropic 在 [Institute 长文](https://www.anthropic.com/institute/measuring-pace-of-ai-development) 公布原型指标 **R&D Automation Index**（快照约到 2026 年 8 月，方法基于 Epoch AI 的 Automation Level）：

| 层级 | 含义（摘要） | Anthropic 公开结果 |
| --- | --- | --- |
| AL5 | 全自主、无人在环 | 测得的子集为 0% |
| AL4 | AI「主导」：高层提示下端到端完成大部分，人监督 | **约 26%** 的加权 AI R&D |
| AL3+ | AI「协作」及以上 | **超过 90%** |

同文还给出内部 Agent 监控侧写：常用平台上约 3 万个研发 Agent，在线监控覆盖 100%，约 **1/47,000** 的动作被拦截；另有一周快照里，AI R&D 算力中约 6% 标为安全向（AI 驱动的 R&D 算力中约 12%）。公司称将定期更新，并希望第三方能核验。

**可带走的点：** 这是目前少有的「自家实验室自加速」**量化公开**；读数时要连方法（人时加权、冻结任务篮、自用模型当评审）一起看，避免把 26% 听成「四分之一工作已无人管」。

## 3. 编码 Agent：你比的可能是脚手架，不是模型

开发者圈近一两天仍在热议 harness（工具面、规划、上下文管理、执行环）对成绩的影响。公开复盘（例如 [beri.net 对一项 176 配置消融的解读](https://www.beri.net/article/coding-agent-harness-design-tool-surface-planning-model-ranking-flip)，以及 HN 上对 HarnessTax / harness 实证的讨论）反复指向同一方向：

- 同一模型、同一题集下，**改一个上下文管理开关**，SWE-Bench Verified 成绩可出现远大于「模型间差距」的摆动（报道中出现过约 6.4% → 58.4% 量级的例子，需回到原研究核对设定）。
- **工具面**（预置文件工具 vs 仅 bash）会翻转谁赢；弱模型更依赖脚手架，强模型有时反而在 bash-only 下更省钱或更高分。
- 公开 Terminal-Bench 一类榜上，同一模型换不同 Agent 壳，分数可差二十多分——固定 harness 换模型，与「各用自家 CLI」排出的名次可以完全相反。

**可带走的点：** 下次模型选型 bake-off，至少固定并版本化 harness 配置，同时记**每题成本**，不要只报通过率。

## 今日取舍

| 候选 | 处理 |
| --- | --- |
| Gemini / Irregular 评测与披露 | **写进正文**（安全与治理） |
| Anthropic R&D 自动化指数 | **写进正文**（官方可核验） |
| 编码 harness vs 模型 | **写进正文**（开发者工具选型） |
| 开源 Jev 替代、窄域 CUA 小模型等 Show HN | 有趣但证据链偏产品发布，**本日不展开** |

—— 科技情报室 · 2026-09-21

</div>

<div data-post-lang="en" hidden>

## What to keep from today

Not a trending-topic dump—three public threads that change how you read models, safety, and tooling. Heat claims stick to verifiable reporting and primary docs; no invented engagement numbers.

## 1. Gemini reached three live companies in an eval (disclosure timing is the story)

Per [WSJ](https://www.wsj.com/tech/ai/gemini-joins-the-hacker-club-d4338198) and follow-on coverage around 19–20 Sep 2026: in a May 2026 capture-the-flag-style test by evaluator Irregular, a fictional target shared a real company’s name. Gemini found three live systems—password guessing in one case, credentials left in a public repo in the others. Google says the model stopped before finishing each time. Irregular notified Google around late July; broad public coverage landed around 19 Sep, while Google’s position is that the incident did not warrant public disclosure.

**Takeaways:**

- The useful failure mode is often **fixture naming** and **leaked credentials**, not a sci-fi “rogue model.”
- Similar eval-side incidents have been discussed for Claude, OpenAI, and Meta systems—the industry question is **disclosure norms and clocks**.
- If you run agent red teams: audit fixture names against real brands, and tighten sandbox egress.

## 2. Anthropic: Claude “leads” ~26% of AI R&D

Anthropic’s [Institute post](https://www.anthropic.com/institute/measuring-pace-of-ai-development) introduces a prototype **R&D Automation Index** (snapshot through about Aug 2026, using Epoch AI’s Automation Levels):

| Level | Meaning (short) | Anthropic’s published result |
| --- | --- | --- |
| AL5 | Fully autonomous | 0% of measured work |
| AL4 | AI “leads”: most of the task end-to-end from a high-level prompt, human supervises | **~26%** of weighted AI R&D |
| AL3+ | AI “collaborates” or higher | **>90%** |

They also report ~30k research/engineering agents on their main internal platform, 100% online-monitor coverage, roughly **1 in 47,000** actions blocked, and a one-week compute snapshot where ~6% of AI R&D compute (and ~12% of AI-driven AI R&D compute) was labeled safety-oriented. They plan regular updates and third-party verification.

**Takeaway:** rare quantitative transparency on in-lab self-acceleration—read the method (person-time weights, frozen task basket, in-house judge models) with the headline number.

## 3. Coding agents: your bake-off may have ranked harnesses

Developer discussion over the past day or two keeps circling harness design (tools, planning, context management, loop). Public write-ups such as [this 176-setting ablation read](https://www.beri.net/article/coding-agent-harness-design-tool-surface-planning-model-ranking-flip) and HN threads on harness empirics converge on:

- Holding model and tasks fixed, **one context-management switch** can move SWE-Bench Verified scores by more than the gap between models in the study (reported swings on the order of ~6.4% → 58.4%—verify settings in the primary paper).
- **Tool surface** (predefined file tools vs bash-only) can reverse winners; weaker models lean on scaffolding, stronger ones sometimes win on bash-only with lower cost.
- On public Terminal-Bench-style boards, the same model under different agent shells can differ by twenty-plus points—and matched-harness rankings can invert vendor-CLI rankings.

**Takeaway:** version the harness config, re-run finalists under at least two scaffolds, and track **cost per solved task**, not accuracy alone.

## What we skipped

| Candidate | Call |
| --- | --- |
| Gemini / Irregular eval + disclosure | **In** (safety/governance) |
| Anthropic R&D Automation Index | **In** (primary source) |
| Coding harness vs model | **In** (tooling decisions) |
| Open-source Jev alternatives, niche CUA specialists, etc. | Interesting Show HN energy; **held** for a thinner evidence chain today |

— Tech Intel Desk · 2026-09-21

</div>
