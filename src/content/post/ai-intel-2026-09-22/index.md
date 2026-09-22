---
title: "科技情报简报：Copilot 上的 Grok、终端里的 Devin、开源 Strands harness"
titleEn: "AI Brief: Grok in Copilot, Devin in the Terminal, Strands Harness"
publishDate: 2026-09-22 09:00:00
description: "过去约 24 小时三条可核验的开发者侧动态：Grok 4.7 进入 GitHub Copilot、Devin Cloud 接入终端，以及 Apache 2.0 的 Strands harness。"
descriptionEn: "Three verifiable developer moves from roughly the last day: Grok 4.7 in GitHub Copilot, Devin Cloud in the terminal, and the Apache 2.0 Strands harness."
tags:
  - AI
  - 情报
  - 开发者工具
language: "中 / EN"
draft: false
---

<div data-post-lang="zh">

## 今天记什么

窗口压在约 24 小时内、能落到官方 changelog / 产品博文的开发者工具线。早先的大模型发布（如月初 GPT‑6 Astra）和单源「或将发新模型」传闻不当成今早突发硬写。

## 1. Grok 4.7 进入 GitHub Copilot

GitHub [Changelog（2026-09-21）](https://github.blog/changelog/2026-09-21-grok-4-7-is-now-available-in-github-copilot/)：xAI 的 **Grok 4.7** 开始在 Copilot 里灰度上线，定位偏 agentic coding 与多步工作流；按提供商标价走用量计费。

覆盖面写明包括 VS Code、Visual Studio、Copilot CLI、Cloud Agent、GitHub Copilot App，以及 JetBrains / Xcode / Eclipse 等；面向 Copilot Pro / Pro+ / Max / Business / Enterprise。Business / Enterprise 管理员可在模型策略里开关；默认开启策略下新模型会自动放行，除非关掉全局默认或单独禁用。

**可带走的点：** IDE 内模型池又多了一家推理向选项。选型时除了能力，还要看组织策略默认值——不然成员会先于管理员发现新模型。

## 2. Devin Cloud 进终端：本地 CLI ↔ 云端 VM

Cognition [博文（2026-09-21）](https://devin.ai/blog/devin-cloud-in-your-terminal)：`devin --cloud` / `/cloud` 可在常用终端里创建、续跑、观察云端会话；`/handoff` 把本地任务交给云端独立 VM，也可反向把云端工作拉回本地分支。

同期开放 `devin ssh`：直接进 Devin 的开发环境，转发端口、scp 拷文件。云会话不绑死启动它的那扇终端；`/open web|desktop` 可切到网页或桌面视图。活动期内提供免费 SWE‑2 会话（文中写到 10 月 8 日）。

**可带走的点：** 「本地改得快」和「云端跑得久」正在被收成同一套 CLI 手势，而不是两套产品。

## 3. Strands harness：组装好的通用 Agent 壳

[Strands Agents（2026-09-21）](https://strandsagents.com/blog/introducing-strands-harness/) 发布 **Strands harness**（Apache 2.0）：一行 Python / TypeScript 即可挂 Bedrock、Anthropic、OpenAI、Google、Ollama、LiteLLM；自带 shell / 文件 / 网页工具，以及截断、压缩、会话恢复等默认上下文策略。官方称同模型下相对常见 harness **约 28% 更省 token**，并维持相近准确率（细节以原文基准为准）。

安装：`pip install strands-harness` 或 `npm install @strands-agents/harness`；另有 CLI 用自然语言原型后再 `/export` 成代码。

**可带走的点：** 昨天简报里「比的是脚手架还是模型」仍成立——今天是又多了一个可固定版本、可自托管的对照壳。

## 同日旁听（未展开）

| 候选 | 处理 |
| --- | --- |
| Grok 4.7 × GitHub Copilot | **写进正文**（官方 Changelog） |
| Devin Cloud in terminal | **写进正文**（官方产品博文） |
| Strands harness | **写进正文**（官方博文 + Apache 2.0） |
| Google AX v0.3 / 分布式 Agent Runtime 讨论 | 9/20 发版、9/21 仍有跟进；基础设施向，**本日旁听**（见 [google/ax](https://github.com/google/ax)） |
| 「Anthropic 或将发新模型对冲 Astra」类报道 | 未宣布型号与日期，**单源传闻不硬写** |
| 月初 GPT‑6 Astra 等旧披露 | 超出今早窗口，**跳过** |

—— 科技情报室 · 2026-09-22

</div>

<div data-post-lang="en" hidden>

## What to keep from today

Developer-tooling moves inside roughly a 24-hour window, anchored to official changelogs and product posts. Earlier model launches (for example GPT‑6 Astra earlier this month) and single-source “may ship a new model” rumors are not treated as this morning’s breaking news.

## 1. Grok 4.7 lands in GitHub Copilot

Per GitHub’s [Changelog (21 Sep 2026)](https://github.blog/changelog/2026-09-21-grok-4-7-is-now-available-in-github-copilot/): xAI’s **Grok 4.7** is rolling out in Copilot for agentic coding and multistep workflows, billed at provider list pricing under usage-based billing.

Availability covers VS Code, Visual Studio, Copilot CLI, Cloud Agent, the Copilot app, plus JetBrains / Xcode / Eclipse, for Copilot Pro / Pro+ / Max / Business / Enterprise. Business and Enterprise admins manage access via model policy; under default enablement, new models arrive unless the global default is off or this model is disabled.

**Takeaway:** another reasoning-oriented option in the IDE picker. Watch org policy defaults so members do not discover a model before admins do.

## 2. Devin Cloud in your terminal

Cognition’s [post (21 Sep 2026)](https://devin.ai/blog/devin-cloud-in-your-terminal): `devin --cloud` / `/cloud` create, steer, resume, and watch cloud sessions from the terminal; `/handoff` moves a local task onto a dedicated cloud VM, or pulls cloud work back onto a local branch.

`devin ssh` opens the remote VM for editing, port forwarding, and scp. Cloud sessions outlive the terminal that started them; `/open web|desktop` switches surfaces. Free SWE‑2 sessions are offered until 8 Oct (per the post).

**Takeaway:** fast local iteration and long-running cloud work are collapsing into one CLI gesture set.

## 3. Strands harness: a batteries-included general agent shell

[Strands Agents (21 Sep 2026)](https://strandsagents.com/blog/introducing-strands-harness/) shipped **Strands harness** (Apache 2.0): one line of Python or TypeScript against Bedrock, Anthropic, OpenAI, Google, Ollama, or LiteLLM, with shell / file / web tools plus default truncation, compaction, and session resume. They report about **28% lower token cost** versus common harnesses at similar accuracy on their benchmarks (verify details in the primary post).

Install with `pip install strands-harness` or `npm install @strands-agents/harness`; a CLI prototypes in plain English then `/export`s code.

**Takeaway:** yesterday’s “harness vs model” framing still holds—today adds another versionable, self-hostable shell for bake-offs.

## Held for later

| Candidate | Call |
| --- | --- |
| Grok 4.7 × GitHub Copilot | **In** (official Changelog) |
| Devin Cloud in terminal | **In** (official product post) |
| Strands harness | **In** (official post + Apache 2.0) |
| Google AX v0.3 / distributed agent runtime chatter | Shipped 20 Sep, still discussed 21 Sep; infra-heavy—**held** ([google/ax](https://github.com/google/ax)) |
| “Anthropic may launch a model to blunt Astra” coverage | No model or date announced—**not hard news** |
| Early-month GPT‑6 Astra and similar | Outside this morning’s window—**skipped** |

— Tech Intel Desk · 2026-09-22

</div>
