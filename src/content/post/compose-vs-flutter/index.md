---
title: "Compose Multiplatform 与 Flutter：怎么选"
titleEn: "Compose Multiplatform vs Flutter: How to Choose"
publishDate: 2026-09-14 16:00:00
description: "从平台覆盖、语言生态、UI 模型到学习路径，对比 Jetpack Compose Multiplatform 与 Flutter，并附官方入门链接与示例代码。"
descriptionEn: "Compare Jetpack Compose Multiplatform and Flutter across platforms, languages, UI models, and learning paths—with official links and sample code."
tags:
  - 跨平台
  - Flutter
  - Compose
  - 移动开发
language: "中 / EN"
draft: false
heroImage:
  src: ./hero.png
  alt: "Compose Multiplatform vs Flutter"
  color: "#659EB9"
---

<div data-post-lang="zh">

## 这篇文章适合谁

如果你正在选「一套代码覆盖 Android / iOS /（可能还有）桌面与 Web」的 UI 方案，十有八九会卡在：

- **Flutter**（Google，Dart）
- **Compose Multiplatform / CMP**（JetBrains，Kotlin，延续 Jetpack Compose）

下面按「是什么 → 优劣 → 代码手感 → 学习指引 → 怎么选」来写。配图来自双方官方 / Wikimedia 品牌资源，文末有来源。

![Compose Multiplatform 官方宣传图（来源：kotlinlang.org）](./compose.png)

*图片来源：[Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/)*

## 一句话定义

| | Compose Multiplatform | Flutter |
| --- | --- | --- |
| 出品 | JetBrains（Android 目标走 Google 的 Jetpack Compose） | Google |
| 语言 | Kotlin | Dart |
| UI 范式 | 声明式 `@Composable` | 声明式 `Widget` |
| 渲染 | 各平台原生控件 + Skia 等路径（随目标而变） | 自绘引擎（Impeller / Skia），UI 一致性强 |
| 典型目标 | Android、iOS、Desktop、Web（成熟度不完全相同） | Android、iOS、Web、Desktop、嵌入式等 |

关系要分清：**Jetpack Compose ≠ Compose Multiplatform**。前者主要是 Android；后者是 JetBrains 把 Compose 模型扩到多平台。Android 目标上，CMP 会直接用到 Google 发布的 Compose 工件。官方说明见：[CMP 与 Jetpack Compose 的关系](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-and-jetpack-compose.html)。

![Flutter 官方标识（来源：Wikimedia / flutter.dev）](./flutter.png)

*图片来源：[Wikimedia Commons — Flutter logo](https://commons.wikimedia.org/wiki/File:Google-flutter-logo.svg)*

## 优劣对照（实战向）

### Flutter 更强的地方

1. **跨端成熟度与社区**：生态大、插件多、教程多；招聘与外包市场也更常见。  
2. **像素级一致性**：自绘 UI，少踩「同一套代码在 iOS/Android 长得不一样」的坑。  
3. **热重载体验成熟**：改 UI 反馈快，适合打磨界面。  
4. **产品化配套**：DevTools、发布流水线文档、商店案例都很完整。

### Flutter 要付出的代价

1. **Dart 是新语言税**：若团队已是 Kotlin / Swift 主力，学习与招聘成本会抬高。  
2. **平台感 / 原生互操作**：要做很「原生」的能力时，常走 Platform Channel / FFI，边界代码会变多。  
3. **包体积与引擎**：自带引擎，简单 App 体积往往大于纯原生或共享原生 UI 的方案。

### Compose Multiplatform 更强的地方

1. **Kotlin 一条链路**：Android 原生、KMP 共享逻辑、服务端（Ktor）可共用语言与类型。  
2. **Android 能力「零翻译」**：会 Jetpack Compose 的人上手 CMP 的心理门槛低。  
3. **与原生共存自然**：适合「共享业务 + 关键页面仍用平台 UI」的渐进策略。  
4. **Desktop 对 JetBrains 工具链友好**：IDE、调试、Gradle 心智模型统一。

### Compose Multiplatform 要付出的代价

1. **多端成熟度不齐**：Android 最稳；iOS / Web 要盯版本说明与已知限制。  
2. **生态与示例少于 Flutter**：第三方库、中文社区、「抄作业」成本偏高。  
3. **iOS 工程细节**：仍要懂 Xcode、签名、部分平台 API；不是「完全忘掉原生」。  
4. **品牌与招聘**：岗位上「Flutter」仍比「CMP」好搜。

## 代码手感（同一交互）

下面都是「一个按钮，点一下计数 +1」——看的是心智模型，不是完整工程。

### Compose Multiplatform（Kotlin）

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    Button(onClick = { count++ }) {
        Text("Clicked $count")
    }
}
```

状态用 `remember` / `mutableStateOf`；重组（recomposition）驱动 UI。Android 开发者几乎零迁移成本。

### Flutter（Dart）

```dart
class Counter extends StatefulWidget {
  const Counter({super.key});
  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int count = 0;
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => setState(() => count++),
      child: Text('Clicked $count'),
    );
  }
}
```

或用更常见的状态库（Riverpod / Bloc 等）。`Widget` 树 + `setState` / 外部状态是主流写法。

**共享逻辑**：Flutter 常把逻辑放在 Dart 包；CMP / KMP 则把 `commonMain` 的 Kotlin 逻辑共享到各端，UI 层用 Compose。

## 学习网页指引（官方优先）

### Compose Multiplatform / Kotlin Multiplatform

1. [Compose Multiplatform 官网](https://kotlinlang.org/compose-multiplatform/) — 能力边界与案例  
2. [CMP 快速开始](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html) — 第一份可跑工程  
3. [CMP 与 Jetpack Compose 的关系](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-and-jetpack-compose.html) — 概念纠偏  
4. [Kotlin Multiplatform 文档](https://kotlinlang.org/docs/multiplatform/) — 共享逻辑、期望与实际  
5. [Android Jetpack Compose 路径](https://developer.android.com/courses/pathways/compose) — UI 基本功（强烈建议先走完）

### Flutter

1. [Flutter 官网](https://flutter.dev/)  
2. [安装与第一课](https://docs.flutter.dev/get-started/install)  
3. [写你的第一个 App](https://docs.flutter.dev/get-started/codelab)  
4. [Dart 语言之旅](https://dart.dev/guides/language/language-tour) — 语言税一次性交清  
5. [Flutter 品牌与资源](https://flutter.dev/brand) — 正规 logo 用法（写文章/做演示时有用）

### 建议的学习顺序（省时间版）

- **已会 Android / Compose**：先 CMP 快速开始 → 再补 iOS 目标与签名 → 需要时再扫 Flutter 文档做对比。  
- **从零跨平台 / 要最快出 UI Demo**：Flutter 安装 + Codelab → Dart Tour → 再回头读 CMP，避免两套一起学到糊。  
- **已有 Kotlin 后端 / KMP 业务库**：优先 CMP，把 UI 决策和「共享模块」对齐。

## 怎么选（可执行标准）

选 **Flutter**，如果：

- 产品要强一致 UI，快速覆盖双端（再加 Web/Desktop）  
- 团队能接受 Dart，或本来就以 Flutter 招聘  
- 更依赖插件市场与社区答案

选 **Compose Multiplatform**，如果：

- 团队 Kotlin 深度高，或已有 KMP 共享层  
- Android 体验与 Jetpack 生态权重高  
- 希望和原生工程渐进融合，而不是一次「引擎替换」

也可以 **不站队**：逻辑用 KMP，个别端 UI 仍用 SwiftUI / 原生 View；或内部工具用 Flutter，主 App 用 CMP——按模块边界拆，比宗教战争有用。

## 小结

Flutter 赢在「跨端产品化成熟度」；Compose Multiplatform 赢在「Kotlin 与 Android 原生连续性」。没有绝对赢家，只有和你团队技能栈、目标平台、上市节奏是否对齐。

先把官方文档跑通一个「计数器 + 列表 + 网络请求」最小闭环，再谈架构——比先吵框架三个月更划算。

</div>

<div data-post-lang="en" hidden>

## Who this is for

If you are picking a UI stack that should reach Android / iOS (and maybe desktop or web) from one codebase, the shortlist is usually:

- **Flutter** (Google, Dart)
- **Compose Multiplatform / CMP** (JetBrains, Kotlin—extending Jetpack Compose)

This post covers definitions, trade-offs, code feel, learning links, and a practical decision guide. Images are from official / Wikimedia brand assets (credits below).

![Official Compose Multiplatform artwork (source: kotlinlang.org)](./compose.png)

*Image credit: [Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/)*

## One-line definitions

| | Compose Multiplatform | Flutter |
| --- | --- | --- |
| Steward | JetBrains (Android target uses Google’s Jetpack Compose artifacts) | Google |
| Language | Kotlin | Dart |
| UI model | Declarative `@Composable` | Declarative `Widget` |
| Rendering | Platform-native where applicable + Skia-related paths by target | Self-drawn engine (Impeller / Skia); strong visual consistency |
| Typical targets | Android, iOS, desktop, web (maturity varies) | Android, iOS, web, desktop, embedded, and more |

Important: **Jetpack Compose ≠ Compose Multiplatform**. The former is primarily Android; the latter is JetBrains’ multiplatform expansion of the Compose model. On Android, CMP consumes Google’s Compose artifacts. See [CMP and Jetpack Compose](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-and-jetpack-compose.html).

![Flutter logo (source: Wikimedia / flutter.dev)](./flutter.png)

*Image credit: [Wikimedia Commons — Flutter logo](https://commons.wikimedia.org/wiki/File:Google-flutter-logo.svg)*

## Trade-offs (shipping-oriented)

### Where Flutter shines

1. **Maturity and ecosystem**: large plugin market, tutorials, and hiring pool.  
2. **Pixel consistency**: self-drawn UI reduces “same code, different look” surprises.  
3. **Hot reload**: fast UI iteration.  
4. **Product tooling**: DevTools, store playbooks, and docs are battle-tested.

### Flutter costs

1. **Dart tax**: expensive if your team is Kotlin/Swift-first.  
2. **Native interop**: deep platform features often need channels / FFI.  
3. **Binary size**: the engine adds weight versus thin native shells.

### Where Compose Multiplatform shines

1. **Kotlin everywhere**: shared types with Android and often with Ktor backends.  
2. **Compose skills transfer**: Jetpack Compose experience maps cleanly.  
3. **Native coexistence**: good for gradual adoption beside platform UI.  
4. **Desktop + JetBrains toolchain**: familiar Gradle / IDE mental model.

### CMP costs

1. **Uneven target maturity**: Android is strongest; watch iOS/web caveats.  
2. **Smaller ecosystem** than Flutter for samples and third-party UI kits.  
3. **iOS still needs Xcode fluency**: signing and some platform APIs remain.  
4. **Hiring keyword**: “Flutter” still searches better than “CMP”.

## Code feel (same interaction)

A button that increments a counter—mental model, not a full app.

### Compose Multiplatform (Kotlin)

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    Button(onClick = { count++ }) {
        Text("Clicked $count")
    }
}
```

### Flutter (Dart)

```dart
class Counter extends StatefulWidget {
  const Counter({super.key});
  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int count = 0;
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => setState(() => count++),
      child: Text('Clicked $count'),
    );
  }
}
```

Shared logic tends to live in Dart packages for Flutter, versus `commonMain` Kotlin for KMP/CMP.

## Learning links (official first)

### Compose Multiplatform / KMP

1. [Compose Multiplatform site](https://kotlinlang.org/compose-multiplatform/)  
2. [Create your first CMP app](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)  
3. [CMP vs Jetpack Compose](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-and-jetpack-compose.html)  
4. [Kotlin Multiplatform docs](https://kotlinlang.org/docs/multiplatform/)  
5. [Android Compose pathway](https://developer.android.com/courses/pathways/compose)

### Flutter

1. [flutter.dev](https://flutter.dev/)  
2. [Install](https://docs.flutter.dev/get-started/install)  
3. [Write your first app](https://docs.flutter.dev/get-started/codelab)  
4. [Dart language tour](https://dart.dev/guides/language/language-tour)  
5. [Flutter brand](https://flutter.dev/brand)

### Suggested order

- **Already on Android/Compose**: CMP first app → iOS target/signing → skim Flutter for contrast.  
- **Greenfield cross-platform demo**: Flutter install + codelab → Dart tour → then CMP.  
- **Existing Kotlin/KMP core**: prefer CMP so UI and shared modules stay aligned.

## How to choose

Choose **Flutter** when you need consistent multi-surface UI fast, can invest in Dart, and want the largest plugin/community surface.

Choose **Compose Multiplatform** when Kotlin depth (and Android Compose) matters more, you already share KMP logic, or you want progressive native coexistence.

You can also **split**: KMP for domain logic with platform UI, or Flutter for internal tools and CMP for the main app—boundaries beat ideology.

## Takeaway

Flutter wins on cross-platform product maturity; CMP wins on Kotlin/Android continuity. Ship a tiny “counter + list + network” slice on your top candidate before arguing architecture for months.

</div>
