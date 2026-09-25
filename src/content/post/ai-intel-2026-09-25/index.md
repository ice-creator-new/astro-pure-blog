---
title: "科技情报简报：Gemini Live Avatar 给人脸，Call for Me 代打电话"
titleEn: "AI Brief: Gemini Live Avatar Gets a Face, Call for Me Dials Out"
publishDate: 2026-09-25 09:00:00
description: "企业向 Gemini 3.8 Live Avatar（口型/表情、97 语种、SynthID）；美 Pixel 11「Call for Me」代打商家电话；旁听 Meta Horizon Create。"
descriptionEn: "Enterprise Gemini 3.8 Live Avatar (lip-sync, 97 languages, SynthID); US Pixel 11 “Call for Me” business calls; side note on Meta Horizon Create."
tags:
  - AI
  - 情报
  - Gemini
language: "中 / EN"
draft: false
---

<div data-post-lang="zh">

## 今天记什么

09-23 闭源价格战、09-24 MiMo / 安理会已成稿，**本日不复述**。今日窗口主线是 Google 两条「对话外化」产品：**实时人脸化身**与**代打电话**；Meta Horizon Create 作短第三节。

## 1. Gemini 3.8 Live with Live Avatar：企业实时对话化身

Google [官方博客（2026-09-24）](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-with-live-avatar/) 发布 **Gemini 3.8 Live with Live Avatar**：在近实时语音对话上叠加低延迟流式视频，口型同步、表情与轮转更自然。面向 **Gemini Enterprise**（非消费端默认功能）。

可核验要点：原生多语语音到语音同步，官方称可跨 **97** 种语言切换且不明显掉画质/漂移；支持异步工具调用（对话不中断时后台取数）；可选用预设形象，也可用高质量参考图定制（定制目前需企业 allowlist）。输出带 **SynthID** 水印（音视频）。媒体侧见 [The Verge](https://www.theverge.com/tech/1000328/google-gemini-ai-live-avatar-face)。

**可带走的点：** 企业客服/讲解类 Agent 从「只听声音」进到「看得见说话的人」；选型时先问清是否在 Enterprise 权限与 allowlist 内，以及 SynthID/身份护栏是否满足合规。

## 2. Call for Me：Gemini 代打商家电话（美 Pixel 实验）

TechCrunch [报道（2026-09-24）](https://techcrunch.com/2026/09/24/google-tests-letting-gemini-make-phone-calls-initially-for-us-pixel-owners/)：Google 试验 **Call for Me**——让 Gemini **替用户给商家打电话**。首发范围：**美国**、**Pixel 11**、付费 **Gemini 订阅**，并需 Android **Phone 应用 beta**（仍标实验）。

行为边界（报道归纳）：用**本机号码**外呼；可处理询库存、订位、改预约、预留商品等；能过语音菜单、排队；用户可看**实时转写**并随时**接管**；经用户批准可在通话中分享个人信息。Google 称因真实对话复杂，先小范围试。

**可带走的点：** 这是「Agent 动手碰真实世界电话网」的产品化切口；隐私与授权（本机号、可分享字段、接管路径）比模型分数更值得先记账。

## 3. Meta Horizon Create / Studio（短节）

The Verge [报道（2026-09-24）](https://www.theverge.com/games/999972/meta-horizon-create-studio-ai-games)：Meta 推 **Horizon Create**（手机）与 **Horizon Studio**（浏览器），用自然语言生成可发布的 2D/3D 手游，早鸟 **waitlist**；成品可走 Facebook / Instagram 推荐与站内可玩。作旁听即可，不展开评测。

## 旁听 / 取舍

| 候选 | 处理 |
| --- | --- |
| Gemini Live Avatar | **写进正文**（官方 + Verge） |
| Call for Me | **写进正文**（TechCrunch） |
| Horizon Create / Studio | **短第三节**（Verge） |
| Opus 5.5 / MiMo / 安理会 | **链往期稿，不复述** |
| Meta 侧实时化身研究报道 | **不单开**（避免与 Live Avatar 抢主线） |

—— 科技情报室 · 2026-09-25

</div>

<div data-post-lang="en" hidden>

## What to keep from today

The 09-23 closed-model price fight and 09-24 MiMo / UNSC briefs are already live—**no rehash**. This window tracks Google’s two “conversation made physical” ships: a **real-time face** and **outbound phone calls**, plus a short Meta Horizon Create note.

## 1. Gemini 3.8 Live with Live Avatar

Google’s [blog (24 Sep 2026)](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-with-live-avatar/) ships **Gemini 3.8 Live with Live Avatar**: near-real-time speech plus low-latency streaming video—lip-sync, expressions, fluid turn-taking—for **Gemini Enterprise** (not a consumer default).

Checkable bits: native multilingual speech-to-speech sync across **97** languages without obvious fidelity loss; async tool calls while talk continues; preset library plus custom avatars from a reference image (custom via enterprise allowlist for now). Outputs carry **SynthID** watermarks on audio/video. Coverage: [The Verge](https://www.theverge.com/tech/1000328/google-gemini-ai-live-avatar-face).

**Takeaway:** enterprise agents move from voice-only to a visible talking persona; ask about Enterprise access, allowlists, and SynthID/identity guards before you route traffic.

## 2. Call for Me (US Pixel experiment)

Per TechCrunch [(24 Sep 2026)](https://techcrunch.com/2026/09/24/google-tests-letting-gemini-make-phone-calls-initially-for-us-pixel-owners/), Google is testing **Call for Me**—Gemini **calls businesses for you**. First cut: **US**, **Pixel 11**, paid **Gemini** subscription, plus Android **Phone app beta** (still labeled experiment).

Reported behavior: dials from **your own number**; stock checks, reservations, reschedules, holds; navigates menus and hold; live **transcript** with **takeover** anytime; can share user-approved personal info on the call. Google says real-world talk is messy, so the rollout stays small.

**Takeaway:** agents touching the real phone network; privacy/authorization (own number, shareable fields, takeover) matter more than benchmark tables here.

## 3. Meta Horizon Create / Studio (short)

The Verge [(24 Sep 2026)](https://www.theverge.com/games/999972/meta-horizon-create-studio-ai-games): **Horizon Create** (mobile) and **Horizon Studio** (browser) turn natural-language prompts into publishable 2D/3D mobile games; early **waitlist**; distribution via Facebook/Instagram recommendations and in-feed play. Side note only.

## Held / skipped

| Candidate | Call |
| --- | --- |
| Gemini Live Avatar | **In** (official + Verge) |
| Call for Me | **In** (TechCrunch) |
| Horizon Create / Studio | **Short §3** (Verge) |
| Opus 5.5 / MiMo / UNSC | **Pointers only**—no rehash |
| Meta realtime-avatar research chatter | **Not a section** |

— Tech Intel Desk · 2026-09-25

</div>
