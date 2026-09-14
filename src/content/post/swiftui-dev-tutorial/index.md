---
title: SwiftUI 开发教程：从视图到数据流
titleEn: "SwiftUI Tutorial: Views, State & Navigation"
publishDate: "2026-09-14 20:10:00"
description: 一份面向实践的 SwiftUI 长教程：View、布局、State/Binding、Observation、NavigationStack，并带一个待办示例。
descriptionEn: "A hands-on SwiftUI deep dive: views, layout, State/Binding, Observation, NavigationStack, plus a todo sample app."
tags:
  - SwiftUI
  - iOS
  - 教程
language: 中 / EN
draft: false
heroImage:
  src: ./hero.jpg
  alt: 编程工作区：笔记本与代码（Unsplash）
  color: "#3B4F7A"
---

<div data-post-lang="zh">

## 写在前面

如果你刚从 UIKit 转过来，或者第一次碰 iOS，SwiftUI 会给人一种「写起来像声明式 DSL，跑起来又是真原生」的感觉。不需要先背一整本故事板（Storyboard）操作手册，也能在 Canvas 里把按钮、列表、导航堆起来；可一旦状态和数据流没理顺，界面就会「看起来能跑、改两下就崩」。很多初学者卡关，并不是语法背不全，而是**还在用命令式思维改声明式界面**——想着「找到那个 label 把文字设一下」，却忘了应该先改状态，让 `body` 自己长出新 UI。

这篇长教程按「能动手」的顺序走：环境 → View → 布局 → 列表 → 状态 → 现代 Observation → 导航与弹层 → 图片与符号 → 一个完整待办小 App → 常见坑与下一步。每一节都配可粘贴的 `swift` 代码块；你大可开着 Xcode 跟敲，不必一次读完。文中 API 都来自正式 SwiftUI（`View`、`@State`、`@Binding`、`@Observable`、`@Bindable`、`NavigationStack`、`navigationDestination`、`AsyncImage`、`TabView` 等），不会编造假名字。概念上请对照 Apple 文档里的 *State*、*NavigationStack*、*Managing model data* 等章节——官方说法有时偏短，本文用可运行的例子把缝补上。

读完你应能：独立搭一个带列表、详情、添加 Sheet 的小工具 App，并说清楚「谁拥有状态、谁只是绑定」。若你已有 UIKit 经验，可把本文当「迁移地图」；若是完全新手，按清单从环境节一路勾到待办示例即可。

![编程工作区：笔记本与手机（Unsplash）](./desk-coding.jpg)

*图片来源：[Unsplash](https://unsplash.com/photos/oYzjGQ7LCVE) · Laptop and phone on a desk*

---

## 1. SwiftUI 是什么，和 UIKit 差在哪

**SwiftUI** 是 Apple 的声明式 UI 框架：你描述「界面在当前状态下应该长什么样」，框架负责在状态变化时重新求值 `body`、差分更新屏幕。**UIKit**（以及 macOS 上的 AppKit）是命令式的：你拿到 `UIView` / `UIViewController`，自己改 frame、加 subview、在回调里改属性，还要记得在合适的时机调用 `setNeedsLayout` 一类方法。

用做饭类比：UIKit 像逐步炒菜——火候、下锅顺序全由你掌控；SwiftUI 更像把「成品应该是什么」写进食谱，灶台（运行时）负责根据原料（状态）重做那一盘。两种都能做出好菜，但排错方式不同：UIKit 常查「哪一步漏调用了」，SwiftUI 常查「状态真相在哪、谁在读谁」。

几条对照：

| | SwiftUI | UIKit |
| --- | --- | --- |
| 心智模型 | 状态 → 视图树 | 对象图 + 命令 |
| 布局 | `VStack` / `HStack` / `Grid` 等组合 | Auto Layout / frame |
| 更新 | `@State`、Observation 触发刷新 | 手动赋值、`reloadData` 等 |
| 预览 | Canvas / `#Preview` | Storyboard 或自己跑模拟器 |
| 共存 | 可用 `UIViewRepresentable` 包 UIKit | 可用 `UIHostingController` 嵌 SwiftUI |

现实项目里两者常混用：新界面用 SwiftUI，成熟组件、复杂输入法适配或历史模块继续 UIKit。别把「声明式」理解成「不能写副作用」——`onAppear`、`task`、按钮回调里照样发网络请求；只是**尽量让界面是状态的纯函数**，副作用放在明确边界，方便预览和测试。

还有一点心态：SwiftUI 的「少写代码」不等于「不用懂布局与生命周期」。Spacer 为什么把视图顶开、Sheet 关闭后状态还在不在、List 的 identity 为什么重要——这些坑和 UIKit 时代一样真实，只是表现形式换了。把 SwiftUI 当成「自动布局的糖」会低估它；把它当成「完全不用理解系统」又会高估它。更稳的姿态是：**状态设计要认真，视图拼装要克制，平台惯例要尊重**。

学习路径上，建议先把「单屏可交互」做稳（Toggle、列表增删），再碰导航与弹层，最后才是持久化与网络。顺序反过来，很容易在还没搞清 `@State` 时就被深链和缓存缠住。

---

## 2. 环境：Xcode、模拟器、Canvas

动手前把工具链摆正，能省掉一半「我是不是装错了」的焦虑。

你需要：

1. **Mac** + 较新的 **Xcode**（从 App Store 或 [developer.apple.com](https://developer.apple.com) 安装）。第一次打开会装额外组件，留足磁盘和时间。
2. 新建工程时选 **App**，Interface 选 **SwiftUI**，Language 选 **Swift**。生命周期一般选默认的 SwiftUI App（`@main` + `App` 协议），不必再绕 UIKit AppDelegate，除非你有明确集成需求。
3. 左侧是 Project Navigator，中间是编辑器，右边可开 **Inspectors**；上方有 **Canvas**（预览）开关。若 Canvas 灰掉，点 Resume，或确认当前文件里有 `#Preview` / `PreviewProvider`。
4. **iOS Simulator**：点 Run（▶）选一台模拟器（如 iPhone 16）。调试布局、手势、前后台切换比真机更轻；真机则适合测相机、推送、性能手感。
5. **Canvas**：在源码旁即时看视图；改 `body` 往往几秒内刷新，不必每次全量编译跑模拟器。复杂预览失败时，看报错是「缺环境对象」还是「类型不匹配」，比盲目 Run 更快。

最小可预览结构（现代写法）：

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Hello, SwiftUI")
            .font(.title)
            .padding()
    }
}

#Preview {
    ContentView()
}
```

建议工作流：布局与修饰符在 Canvas 里抠；导航栈、键盘避让、权限弹窗到模拟器验证；最后再用真机看字体与触控。三者职责分开，反馈循环最短。

补充几条省时间的习惯：预览失败时先看编译器诊断（类型不匹配、缺少成员），再怀疑 Canvas 本身；模拟器选一台你主力适配的尺寸即可，不必每次换机型；团队协作时统一 Xcode 大版本，避免「我这边 Canvas 好好的、你那边红一片」——往往是 SDK 或预览宏写法差异。工程名、Bundle ID 早期定好，后面改签名与能力开关会轻松很多。

![桌面编程场景（Unsplash）](./workspace-code.jpg)

*图片来源：[Unsplash](https://unsplash.com/photos/41cG8-U74lc) · Laptop with code on desk*

---

## 3. View 协议、`body`、修饰符

几乎所有界面都是实现 `View` 的**结构体**（少用 class 做 View）。核心要求只有一个：计算属性 `body`，返回值类型是 `some View`——这是不透明返回类型：编译器知道具体类型并据此优化，调用方只把它当作「某个 View」。

```swift
struct ProfileHeader: View {
    let name: String

    var body: some View {
        Text(name)
            .font(.headline)
            .foregroundStyle(.primary)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(.thinMaterial, in: Capsule())
    }
}
```

**修饰符（modifiers）** 是返回「包了一层的新视图」的方法链，不是 UIKit 那种原地改对象。因此**顺序有意义**：先 `padding` 再 `background`，背景会包住内边距；先 `background` 再 `padding`，则是透明边距露在色块外。常见修饰符包括：`.font`、`.foregroundStyle`、`.padding`、`.frame`、`.background`、`.clipShape`、`.opacity`、`.disabled`、`.onTapGesture`、`.accessibilityLabel`。

`body` 应保持轻量：复杂分支抽成子视图，重复 UI 抽成小组件，重计算放到模型或 `task`，别在每次刷新时做磁盘或网络 IO。若编译器抱怨 `body` 太复杂，拆视图几乎总是正确方向。

再强调一次：**修饰符不是 CSS 里随便叠的类名**，每一次调用都在构造新的视图值。调试「颜色怎么没包住」时，用 Canvas 临时加 `.border(.red)` 看真实占位，比空想快得多。无障碍方面，尽早给图标按钮补 `.accessibilityLabel`，别等上架前再补课。

---

## 4. 布局：VStack、HStack、ZStack、Spacer、padding、frame

SwiftUI 布局是**组合式**的，而不是先绝对定位再微调约束（当然深层也有布局协议，入门先掌握栈即可）：

- **`VStack`**：垂直堆叠，可设 `alignment` 与 `spacing`
- **`HStack`**：水平排列
- **`ZStack`**：重叠（后写的默认在上，可用 `zIndex` 调整）
- **`Spacer`**：在主轴上吃掉多余空间，把兄弟视图顶开
- **`.padding`**：内边距（可按边分别设）
- **`.frame`**：提议宽高、对齐、最小/最大尺寸

```swift
struct LayoutDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "person.circle.fill")
                    .font(.largeTitle)
                VStack(alignment: .leading) {
                    Text("Ice")
                        .font(.headline)
                    Text("iOS · SwiftUI")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                Text("在线")
                    .font(.caption)
                    .foregroundStyle(.green)
            }
            .padding()
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))

            ZStack {
                RoundedRectangle(cornerRadius: 16)
                    .fill(.blue.gradient)
                    .frame(height: 120)
                Text("叠在中间的标题")
                    .font(.title2.bold())
                    .foregroundStyle(.white)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    }
}
```

实用技巧：

- 默认栈按**固有内容尺寸**排布；要「铺满父视图」常用 `.frame(maxWidth: .infinity)`（或再加 `maxHeight`）。
- 对齐优先用栈的 `alignment:`，少靠硬编码像素猜位置。
- `Spacer` 会参与竞争空间；多个 Spacer 默认均分。想固定空隙，用 `spacing` 或明确 `frame(width:)`。
- 再复杂一点会用到 `LazyVGrid` / `Grid`、`ViewThatFits`、自定义 `Layout`——等栈玩熟再进阶。
- 安全区（safe area）默认会被尊重；只有全屏沉浸（如相机取景、英雄图）才考虑 `.ignoresSafeArea()`，并想清楚主页指示器与刘海。
- 暗黑模式：优先用语义色（`.primary`、`.secondary`、Assets 里的动态色），少写死 `Color(red:…)`，否则夜间模式一片惨白或一团漆黑。

把布局想成「提议与协商」：子视图提出理想尺寸，父视图分配空间，修饰符再改提议。理解这层，就知道为什么有时 `frame(width: 200)` 不生效——上面还有更硬的约束或压缩阻力（compression resistance）在博弈。入门阶段用栈 + padding + frame 能覆盖八成界面；真遇到列表性能与网格，再翻官方 Layout 文档不迟。

![MacBook 与 iPhone（Unsplash）](./mac-iphone.jpg)

*Photo by [Unsplash](https://unsplash.com) — MacBook and iPhone*

---

## 5. List 与 ForEach

`List` 是带系统列表样式的可滚动容器，适合设置页、邮件式时间线、待办清单。它和单纯的 `ScrollView + VStack` 不同：系统会处理分隔线、滑删、编辑模式、侧边栏样式等平台惯例。

`ForEach` 把集合映射成子视图。元素需遵循 `Identifiable`，或你显式提供 `id:`。**稳定的身份（identity）** 决定插入/删除动画、滚动位置保持、选中态是否错乱——这和 UIKit 里 `cellForRow` 复用不是同一套机制，但「别用会变的东西当 id」这条经验通用。

```swift
struct Fruit: Identifiable {
    let id = UUID()
    let name: String
}

struct FruitList: View {
    let fruits = [
        Fruit(name: "苹果"),
        Fruit(name: "香蕉"),
        Fruit(name: "橙子")
    ]

    var body: some View {
        List {
            ForEach(fruits) { fruit in
                Label(fruit.name, systemImage: "leaf")
            }
        }
        .navigationTitle("水果")
    }
}
```

也可以写成 `List(fruits) { fruit in ... }`。分区用 `Section(header:footer:)`；滑动删除用 `.onDelete`；移动用 `.onMove`。数据会变时，把数组放进 `@State` 或 `@Observable` 模型，而不是每次 `body` 里现场 `map` 出新 UUID。

列表体验上的小心思：短标签用 `Label`；需要副标题时用 `VStack(alignment: .leading)` 包两行文字；行内按钮记得加 `.buttonStyle(.borderless)`，否则整行点击手感会怪。大量数据再考虑懒加载与分页——先保证身份稳定与增删正确，再谈优化。

---

## 6. `@State`、`@Binding`、`$` 投影

本地、属于视图自己的可变状态用 **`@State`**。子视图要读写父视图同一份状态时，传递 **`Binding`**（属性包装器用 `@Binding`）。`$` 叫做投影（projected value）：从 `@State`、`@Bindable` 等取出对应的 `Binding`。

直觉版：

- `@State` ≈「这个开关的电池装在我口袋里」
- `@Binding` ≈「我用的是你口袋里那块电池的导线」
- `$count` ≈「给我连导线，不要只给我当前读数」

```swift
struct ToggleRow: View {
    @Binding var isOn: Bool

    var body: some View {
        Toggle("开启通知", isOn: $isOn)
    }
}

struct ParentWithToggle: View {
    @State private var notify = true

    var body: some View {
        VStack(spacing: 16) {
            ToggleRow(isOn: $notify)
            Text(notify ? "通知已开" : "通知已关")
                .foregroundStyle(.secondary)
        }
        .padding()
    }
}
```

再配一个步进器，强化「单一真相来源」：

```swift
struct CounterView: View {
    @State private var count = 0

    var body: some View {
        VStack(spacing: 16) {
            Text("计数：\(count)")
                .font(.largeTitle.monospacedDigit())
            Stepper("调整", value: $count, in: 0...100)
            Button("归零") { count = 0 }
                .disabled(count == 0)
        }
        .padding()
    }
}
```

Apple 文档对 *State* 的核心约定：`@State` 是视图的**私有**真相来源；不要把它当跨多个无关界面共享的业务模型。共享、可变的领域数据，请看下一节 Observation。

几个容易混的点：

- `@State` 应标 `private`（除非你有意暴露），强调「外人不该直接摸这份存储」。
- 向子视图传只读值用普通参数；要双向改才传 `Binding`。
- 计算属性可以依赖 `@State`，但不要对计算属性本身包 `@State`。
- 动画常写 `withAnimation { count += 1 }`，让状态变化带动隐式动画，而不是先改 UI 再改数。

把这些约定守住，后面上 Observation 和导航时会少一半「为什么子页面改了父页面没反应」的排查时间。

---

## 7. 现代 Observation：`@Observable`、`@Bindable`、`@State`

从 iOS 17 起，推荐用 **Observation** 框架管理模型数据（文档主题常写作 *Managing model data*）：

1. 给模型类加上 **`@Observable`**
2. 在拥有该模型的视图里用 **`@State`** 持有实例（所有权清晰）
3. 子视图若需要 `TextField` 一类的双向绑定，用 **`@Bindable`** 包一层，再写 `$model.field`

```swift
import SwiftUI
import Observation

@Observable
final class ProfileModel {
    var displayName: String = "Ice"
    var bio: String = ""
}

struct ProfileEditor: View {
    @Bindable var model: ProfileModel

    var body: some View {
        Form {
            TextField("昵称", text: $model.displayName)
            TextField("简介", text: $model.bio, axis: .vertical)
        }
    }
}

struct ProfileScreen: View {
    @State private var model = ProfileModel()

    var body: some View {
        NavigationStack {
            ProfileEditor(model: model)
                .navigationTitle("资料")
                .toolbar {
                    ToolbarItem(placement: .status) {
                        Text(model.displayName)
                            .foregroundStyle(.secondary)
                    }
                }
        }
    }
}
```

视图只在**读过的属性**变化时刷新，粒比「整个 `objectWillChange` 广播」更细，样板也比旧的 `ObservableObject` + `@Published` + `@StateObject` / `@ObservedObject` 少。维护老代码时仍会看到 `@EnvironmentObject`；新项目优先 `@Observable`，需要向下注入时可配合 `.environment(model)`（Observation 体系下的环境写法）——具体以你目标 SDK 的文档为准。

选型小结：

| 场景 | 更合适的工具 |
| --- | --- |
| 开关、步进器、临时草稿 | `@State` |
| 子控件改父状态 | `@Binding` / `$` |
| 可复用的领域模型（用户资料、待办库） | `@Observable` + `@State` 持有 |
| 表单绑定模型字段 | `@Bindable` |

文档 *Managing model data* 想强调的，正是「模型与视图的所有权要分清」：视图负责展示与收集输入，模型负责规则与数据。别让 `body` 变成第二个业务层。

---

## 8. NavigationStack、基于值的 NavigationLink、`navigationDestination`

现代导航以 **`NavigationStack`** 为根，用**值（value）**驱动路径，而不是到处写 `NavigationLink(destination: SomeView())`。好处是：路径可编码、可测试、可编程追加/弹出，深链也好接。

```swift
enum Route: Hashable {
    case detail(id: UUID)
    case settings
}

struct RootView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            List {
                NavigationLink("打开设置", value: Route.settings)
                Button("编程式打开详情") {
                    path.append(Route.detail(id: UUID()))
                }
            }
            .navigationTitle("首页")
            .navigationDestination(for: Route.self) { route in
                switch route {
                case .settings:
                    Text("设置页")
                case .detail(let id):
                    Text("详情 \(id.uuidString)")
                        .font(.footnote.monospaced())
                }
            }
        }
    }
}
```

`NavigationPath` 可装异构 `Hashable` 值；也可用强类型 `[Route]` 绑定路径。返回上一页：`path.removeLast()`；回到根：`path = NavigationPath()`。文档里 *NavigationStack* 一节强调的，正是这种「数据驱动」的导航，而不是把整个目标视图塞进 Link。

注意：教程和旧博客里大量 `NavigationView` 示例行为与 `NavigationStack` 并不完全一致（尤其是分栏、栈深度）。新代码请默认 `NavigationStack`。

实战建议：把「能进能出的页面」建模成路由枚举，比在十个文件里散落 `NavigationLink(destination:)` 好维护。详情页需要的数据，尽量用 id 再查模型，而不是把整个大对象深拷贝进路径——路径应轻、应 `Hashable`、应可日志。调试时打印 `path.count`，比猜「我现在在第几层」有效。

---

## 9. Sheets、Alerts、TabView 基础

三类「换场景」方式要分清：

- **导航推入**：还在同一任务流里，用户预期能「返回」
- **Sheet**：临时模态（编辑、筛选、登录），可下滑关闭（视 detent / 交互而定）
- **Alert / confirmationDialog**：短决策，别塞长表单
- **TabView**：并列的顶级分区，不是层级钻取

```swift
struct ShellView: View {
    @State private var showSheet = false
    @State private var showAlert = false
    @State private var tab = 0

    var body: some View {
        TabView(selection: $tab) {
            NavigationStack {
                VStack(spacing: 20) {
                    Button("打开表单 Sheet") { showSheet = true }
                    Button("弹出确认", role: .destructive) { showAlert = true }
                }
                .navigationTitle("主页")
                .sheet(isPresented: $showSheet) {
                    NavigationStack {
                        Text("这是 Sheet 内容")
                            .toolbar {
                                ToolbarItem(placement: .cancellationAction) {
                                    Button("关闭") { showSheet = false }
                                }
                            }
                    }
                    .presentationDetents([.medium, .large])
                }
                .alert("确认删除？", isPresented: $showAlert) {
                    Button("删除", role: .destructive) { }
                    Button("取消", role: .cancel) { }
                } message: {
                    Text("此操作不可撤销。")
                }
            }
            .tabItem { Label("主页", systemImage: "house") }
            .tag(0)

            Text("第二页：探索")
                .tabItem { Label("探索", systemImage: "safari") }
                .tag(1)
        }
    }
}
```

编辑「某一项」时，优先 `.sheet(item: $optionalItem)`：item 非空就呈现，关闭时置 `nil`，避免 `isPresented` 与数据不同步。Alert 的 `role: .destructive / .cancel` 既影响样式，也影响 VoiceOver 语义，别图省事全写成普通按钮。

Tab 数量宜少而稳（常见 3–5 个）；每个 Tab 根上再挂自己的 `NavigationStack`，这样钻取返回不会串台。需要「切换 Tab 并跳到某页」时，用共享状态驱动 `tab` 选择与对应栈路径，而不是硬用通知乱跳。Sheet 与键盘同时出现时，先在模拟器里试一遍 detent（`.medium` / `.large`），避免输入框被挡还不知道。

---

## 10. AsyncImage 与 SF Symbols

**SF Symbols** 是系统图标库：`Image(systemName:)` 即可。和文字搭配时用 `Label`，能更好跟随动态字体与旁白。符号名可在 SF Symbols App 里搜（Apple 单独提供该 Mac 应用）。

**AsyncImage** 负责异步拉远程图，并用 `phase` 区分空、成功、失败——生产环境你多半会再包缓存层，但入门务必先把三态 UI 写完整，避免白屏或布局跳动。

```swift
struct MediaRow: View {
    let title: String
    let url: URL

    var body: some View {
        HStack(spacing: 12) {
            AsyncImage(url: url) { phase in
                switch phase {
                case .empty:
                    ProgressView()
                        .frame(width: 56, height: 56)
                case .success(let image):
                    image
                        .resizable()
                        .scaledToFill()
                        .frame(width: 56, height: 56)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                case .failure:
                    Image(systemName: "photo")
                        .frame(width: 56, height: 56)
                        .foregroundStyle(.secondary)
                @unknown default:
                    EmptyView()
                }
            }
            Label(title, systemImage: "link")
            Spacer(minLength: 0)
        }
        .padding(.vertical, 4)
    }
}
```

本地资源仍用 `Image("assetName")`（Assets.xcassets）。远程 URL 注意 ATS（App Transport Security）与占位尺寸，避免列表滚动时高度坍塌。

符号与图片的产品细节：同一列表里图标视觉重量尽量一致；失败态不要只留空白，给可识别的 `photo` 或重试入口；若图片是内容核心（商品、头像），考虑渐进加载与缓存策略，但那是进阶话题——本文示例以阶段处理完整为先。

---

## 11. 迷你实战：待办 App（模型 + 列表 + 详情 + 添加 Sheet）

把前面章节串成一条可运行竖切：`@Observable` 存储、`List` + 绑定、`NavigationStack` 详情、Sheet 添加。你可以新建工程后，把下列类型放进同一文件先跑通，再拆文件。

```swift
import SwiftUI
import Observation

@Observable
final class TodoStore {
    var items: [TodoItem] = [
        TodoItem(title: "读完 SwiftUI 教程", isDone: false),
        TodoItem(title: "在模拟器里跑一遍", isDone: true)
    ]

    func add(title: String) {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        items.append(TodoItem(title: trimmed, isDone: false))
    }
}

struct TodoItem: Identifiable, Hashable {
    let id: UUID
    var title: String
    var isDone: Bool
    var note: String

    init(title: String, isDone: Bool, note: String = "") {
        self.id = UUID()
        self.title = title
        self.isDone = isDone
        self.note = note
    }
}

struct TodoApp: View {
    @State private var store = TodoStore()
    @State private var showAdd = false

    var body: some View {
        NavigationStack {
            List {
                ForEach($store.items) { $item in
                    NavigationLink(value: item.id) {
                        HStack {
                            Image(systemName: item.isDone ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(item.isDone ? .green : .secondary)
                                .onTapGesture { item.isDone.toggle() }
                            Text(item.title)
                                .strikethrough(item.isDone)
                        }
                    }
                }
                .onDelete { indexSet in
                    store.items.remove(atOffsets: indexSet)
                }
            }
            .navigationTitle("待办")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showAdd = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .navigationDestination(for: UUID.self) { id in
                if let index = store.items.firstIndex(where: { $0.id == id }) {
                    TodoDetailView(item: $store.items[index])
                } else {
                    ContentUnavailableView("已删除", systemImage: "trash")
                }
            }
            .sheet(isPresented: $showAdd) {
                AddTodoSheet { title in
                    store.add(title: title)
                }
            }
        }
    }
}

struct TodoDetailView: View {
    @Binding var item: TodoItem

    var body: some View {
        Form {
            TextField("标题", text: $item.title)
            Toggle("完成", isOn: $item.isDone)
            TextField("备注", text: $item.note, axis: .vertical)
                .lineLimit(3...8)
        }
        .navigationTitle("详情")
    }
}

struct AddTodoSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var title = ""
    var onAdd: (String) -> Void

    var body: some View {
        NavigationStack {
            Form {
                TextField("新待办", text: $title)
                    .submitLabel(.done)
                    .onSubmit {
                        guard !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
                        onAdd(title)
                        dismiss()
                    }
            }
            .navigationTitle("添加")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("取消") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("添加") {
                        onAdd(title)
                        dismiss()
                    }
                    .disabled(title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
    }
}

#Preview {
    TodoApp()
}
```

要点回顾：

- `ForEach($store.items)` 在 Observation 下可拿到元素级 `Binding`，列表里直接改 `isDone`
- 详情用 `navigationDestination(for: UUID.self)`，用下标绑定 `$store.items[index]`，保证改的是同一份数据
- 添加流：Sheet + `@Environment(\.dismiss)`；空标题禁用按钮
- 删除用 `.onDelete`；目标不存在时给 `ContentUnavailableView`，避免白屏

这已经是许多中小型工具 App 的骨架。下一步你可以加：按完成状态过滤、SwiftData 持久化、或把 `TodoStore` 注入 `.environment`。

若你想自行扩展，推荐三个小练习（由易到难）：（1）工具栏加分段控件，过滤「全部 / 未完成 / 已完成」；（2）详情里用 `DatePicker` 加截止日期并在列表显示相对时间；（3）把 `TodoStore` 换到 SwiftData 的 `@Model`，体会持久化后进程杀掉再进仍在。每做完一项，回头对照本文的「所有权」原则：过滤状态属于界面，待办条目属于模型。

---

## 12. 常见坑与下一步

**常见坑**

1. 在 `body` 里每次生成新的 `UUID()` 或临时对象当 `id` → 列表疯狂重建、动画诡异。  
2. 把本该共享的模型复制进多个无关的 `@State` → 改 A 屏 B 屏不更新。  
3. 修饰符顺序反了（`background` / `padding` / `clipShape`），预览「怎么调都不对」。  
4. 继续照抄 `NavigationView` 老教程，却期望 `NavigationStack` 的路径 API。  
5. 预览没注入初始数据或缺少 `NavigationStack` 包裹，Canvas 空白就以为组件坏了。  
6. 在 `body` 里直接发起网络请求（无 `task`/`onAppear` 边界）→ 刷新次数难料。  
7. Sheet 用 `isPresented` 却忘记在关闭时清理编辑缓冲，下次打开残留旧文案。

**预览与 traits**

```swift
#Preview("暗色 · 大字") {
    TodoApp()
        .preferredColorScheme(.dark)
}

#Preview(traits: .sizeThatFitsLayout) {
    ProfileHeader(name: "Ice")
}
```

按需切换色模式、动态字体、设备尺寸；这是无障碍意识的最低成本训练。

**测试心态**：先把 `TodoStore.add`、过滤函数等纯逻辑测绿；UI 用 XCTest UI 测试点「添加 → 出现在列表 → 进详情」关键路径。像素级快照可以后补，**数据流正确**优先。

**下一步学习**：`withAnimation` 与 `matchedGeometryEffect`、SwiftData、`task` + 结构化并发、Accessibility、多 `Scene` / 桌面与 iPad 分栏。官方持续跟踪 *State and Data Flow*、*Navigation*、*Managing model data* 即可，版本升级时以 Release Notes 为准。

### 动手清单

- [ ] 用 Xcode 建 SwiftUI App，在 Canvas 里改 `Text` 的字体与 padding  
- [ ] 手写一张 `VStack` + `HStack` + `Spacer` + `frame` 名片卡  
- [ ] 用 `@State` / `@Binding` 做 Toggle 与 Stepper  
- [ ] 给模型加 `@Observable`，列表可增删改完成态  
- [ ] `NavigationStack` + `navigationDestination` 打开详情并回写  
- [ ] Sheet 添加一项；Alert 确认删除  
- [ ] 把本文待办示例跑通，再加「备注关键词过滤」或 SF Symbol 分类  
- [ ] 为预览加暗色模式与 `sizeThatFitsLayout`，养成提交前扫一眼的习惯  

</div>

<div data-post-lang="en" hidden>

## Before we start

If you are coming from UIKit—or brand new to iOS—SwiftUI feels like a declarative DSL that still ships as real native UI. You can stack buttons, lists, and navigation in Canvas without memorizing a Storyboard manual first. The catch: once state and data flow are fuzzy, the UI “runs” until a small change makes it fall apart.

This long-form guide follows a hands-on path: environment → View → layout → lists → state → modern Observation → navigation & presentations → images & symbols → a complete todo mini-app → pitfalls & next steps. Every API named here is real SwiftUI (`View`, `@State`, `@Binding`, `@Observable`, `@Bindable`, `NavigationStack`, `navigationDestination`, `AsyncImage`, `TabView`, and friends). Conceptually, mirror Apple’s docs on *State*, *NavigationStack*, and *Managing model data*—official pages are sometimes terse; the samples below fill the seams.

By the end you should be able to ship a small tool app with list, detail, and an add sheet—and explain **who owns state vs who only holds a binding**. If you already know UIKit, treat this as a migration map; if you are brand new, follow the checklist from the environment section through the todo sample. Many beginners stall not on syntax, but on still thinking imperatively—“find that label and set its text”—instead of changing state and letting `body` rebuild the UI.

![Coding workspace: laptop and phone (Unsplash)](./desk-coding.jpg)

*图片来源：[Unsplash](https://unsplash.com/photos/oYzjGQ7LCVE) · Laptop and phone on a desk*

---

## 1. What SwiftUI is (vs UIKit)

**SwiftUI** is Apple’s declarative UI framework: you describe what the UI should look like for the current state; the runtime re-evaluates `body` and updates the screen. **UIKit** (and AppKit on the Mac) are imperative: you hold `UIView` / `UIViewController` instances, mutate frames, add subviews, and poke properties in callbacks—remembering when to call things like `setNeedsLayout`.

Cooking analogy: UIKit is stir-frying step by step; SwiftUI is writing the finished plate into a recipe and letting the stove (runtime) remake it from ingredients (state). Both can taste great; debugging differs—UIKit asks “which call did I miss?”, SwiftUI asks “where is the source of truth, and who reads it?”.

| | SwiftUI | UIKit |
| --- | --- | --- |
| Mental model | State → view tree | Object graph + commands |
| Layout | `VStack` / `HStack` / `Grid`, composition | Auto Layout / frames |
| Updates | `@State`, Observation | Manual sets, `reloadData`, etc. |
| Preview | Canvas / `#Preview` | Storyboards or full simulator runs |
| Interop | `UIViewRepresentable` | `UIHostingController` |

Mixed apps are normal: new screens in SwiftUI, battle-tested controls in UIKit. Declarative does **not** mean “no side effects”—use `onAppear`, `task`, and actions for networking. Keep the UI a **pure function of state** where you can; park side effects at clear boundaries for previews and tests.

Also: fewer lines ≠ no need to understand layout and lifecycle. Why `Spacer` pushes siblings, whether sheet state survives dismiss, why `List` identity matters—these pits are as real as in the UIKit era; only the shape changed. Treat SwiftUI neither as “just Auto Layout sugar” nor as “magic that absolves you from platform rules.” A steadier stance: **design state carefully, compose views modestly, respect system conventions**.

Learn single-screen interactivity first (toggles, list edits), then navigation and sheets, then persistence and networking. Reverse that order and you will fight deep links before `@State` makes sense.

---

## 2. Environment: Xcode, Simulator, Canvas

1. A **Mac** and a recent **Xcode** (App Store or developer.apple.com). First launch installs extra components—budget disk and time.
2. New project → **App**, Interface **SwiftUI**, Language **Swift**. Prefer the default SwiftUI App lifecycle (`@main` + `App`) unless you must integrate a UIKit app delegate.
3. Project Navigator, editor, Inspectors; toggle **Canvas**. If it stays gray, hit Resume or confirm a `#Preview` exists.
4. **iOS Simulator** via Run (▶)—layout, gestures, backgrounding without a device. Use hardware for camera, push, and performance feel.
5. **Canvas** for fast modifier feedback; use the simulator for navigation, keyboard avoidance, and permission prompts.

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Hello, SwiftUI")
            .font(.title)
            .padding()
    }
}

#Preview {
    ContentView()
}
```

Workflow tip: polish layout in Canvas, validate stacks/keyboard in Simulator, finish on device for type and touch. When a preview fails, read the compiler diagnostic before blaming Canvas. Pick one primary simulator size for day-to-day work. Align Xcode major versions on a team so `#Preview` behavior stays predictable. Settle Bundle IDs early—signing and capability toggles get cheaper later.

![Desktop coding scene (Unsplash)](./workspace-code.jpg)

*图片来源：[Unsplash](https://unsplash.com/photos/41cG8-U74lc) · Laptop with code on desk*

---

## 3. The View protocol, `body`, and modifiers

Almost every screen is a `View`-conforming **struct**. Implement `body` returning `some View` (opaque result type: the compiler knows the concrete type; callers only see “a View”).

```swift
struct ProfileHeader: View {
    let name: String

    var body: some View {
        Text(name)
            .font(.headline)
            .foregroundStyle(.primary)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(.thinMaterial, in: Capsule())
    }
}
```

**Modifiers** return wrapped views; they are not in-place UIKit mutations. **Order matters**: `padding` then `background` wraps the padding; reverse that and you get transparent margins outside the fill. Common ones: `.font`, `.foregroundStyle`, `.padding`, `.frame`, `.background`, `.clipShape`, `.opacity`, `.disabled`, `.onTapGesture`, `.accessibilityLabel`.

Keep `body` light—extract subviews, move heavy work to the model or `task`. If the compiler complains that `body` is too complex, splitting views is almost always the right move. Modifiers are not CSS class names you sprinkle freely—each call constructs a new view value. When color “doesn’t wrap,” temporarily add `.border(.red)` in Canvas. Add `.accessibilityLabel` to icon-only buttons early.

---

## 4. Layout: VStack, HStack, ZStack, Spacer, padding, frame

- **`VStack`**: vertical stack (`alignment`, `spacing`)
- **`HStack`**: horizontal row
- **`ZStack`**: overlays (`zIndex` when needed)
- **`Spacer`**: flexible space on the stack’s axis
- **`.padding` / `.frame`**: insets and size proposals

```swift
struct LayoutDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "person.circle.fill")
                    .font(.largeTitle)
                VStack(alignment: .leading) {
                    Text("Ice")
                        .font(.headline)
                    Text("iOS · SwiftUI")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                Text("Online")
                    .font(.caption)
                    .foregroundStyle(.green)
            }
            .padding()
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))

            ZStack {
                RoundedRectangle(cornerRadius: 16)
                    .fill(.blue.gradient)
                    .frame(height: 120)
                Text("Centered title")
                    .font(.title2.bold())
                    .foregroundStyle(.white)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    }
}
```

Stacks size to intrinsic content by default; expand with `.frame(maxWidth: .infinity)`. Prefer stack `alignment:` over magic numbers. Multiple `Spacer`s share leftover space. Respect the safe area by default; reach for `.ignoresSafeArea()` only for immersive chrome, and mind the home indicator. Prefer semantic colors (`.primary`, dynamic asset colors) over hard-coded RGB so Dark Mode does not surprise you. Think of layout as propose-and-negotiate: children propose sizes, parents allocate, modifiers adjust proposals—that is why a lonely `frame(width:)` sometimes “does nothing.” Stacks + padding + frame cover most UIs; open the Layout docs when grids and performance show up.

![MacBook and iPhone (Unsplash)](./mac-iphone.jpg)

*Photo by [Unsplash](https://unsplash.com) — MacBook and iPhone*

---

## 5. Lists & ForEach

`List` provides system list chrome—separators, swipe actions, edit mode—unlike a bare `ScrollView + VStack`. `ForEach` maps collections; elements should be `Identifiable` (or pass `id:`). **Stable identity** drives insert/delete animation, scroll preservation, and selection correctness. Don’t mint a new `UUID()` on every `body` evaluation.

```swift
struct Fruit: Identifiable {
    let id = UUID()
    let name: String
}

struct FruitList: View {
    let fruits = [
        Fruit(name: "Apple"),
        Fruit(name: "Banana"),
        Fruit(name: "Orange")
    ]

    var body: some View {
        List {
            ForEach(fruits) { fruit in
                Label(fruit.name, systemImage: "leaf")
            }
        }
        .navigationTitle("Fruit")
    }
}
```

Also valid: `List(fruits) { ... }`. Use `Section`, `.onDelete`, `.onMove`. Keep mutating arrays in `@State` or an `@Observable` store.

---

## 6. `@State`, `@Binding`, and `$` projection

**`@State`** owns view-local mutable state. **`@Binding`** lets a child read/write the parent’s storage. **`$`** projects a `Binding`.

Intuition:

- `@State` ≈ the battery in *my* pocket  
- `@Binding` ≈ a wire into *your* battery  
- `$count` ≈ “give me the wire, not only the current reading”

```swift
struct ToggleRow: View {
    @Binding var isOn: Bool

    var body: some View {
        Toggle("Enable notifications", isOn: $isOn)
    }
}

struct ParentWithToggle: View {
    @State private var notify = true

    var body: some View {
        VStack(spacing: 16) {
            ToggleRow(isOn: $notify)
            Text(notify ? "On" : "Off")
                .foregroundStyle(.secondary)
        }
        .padding()
    }
}
```

```swift
struct CounterView: View {
    @State private var count = 0

    var body: some View {
        VStack(spacing: 16) {
            Text("Count: \(count)")
                .font(.largeTitle.monospacedDigit())
            Stepper("Adjust", value: $count, in: 0...100)
            Button("Reset") { count = 0 }
                .disabled(count == 0)
        }
        .padding()
    }
}
```

Per Apple’s *State* guidance: `@State` is a **private** source of truth—not your cross-screen domain model. Shared mutable data belongs in Observation (next section).

Quick guardrails: keep `@State` `private` when you can; pass read-only values as plain properties and bindings only when mutation is required; don’t wrap computed properties in `@State`; prefer `withAnimation { count += 1 }` so state changes drive implicit animation. Hold these and you will spend less time asking why a child edit never reached the parent.

---

## 7. Modern Observation: `@Observable`, `@Bindable`, `@State`

From iOS 17 onward, prefer the **Observation** framework (*Managing model data*):

1. Mark the model **`@Observable`**
2. Own the instance with **`@State`** in a parent
3. Use **`@Bindable`** in children that need `TextField`-style bindings (`$model.field`)

```swift
import SwiftUI
import Observation

@Observable
final class ProfileModel {
    var displayName: String = "Ice"
    var bio: String = ""
}

struct ProfileEditor: View {
    @Bindable var model: ProfileModel

    var body: some View {
        Form {
            TextField("Name", text: $model.displayName)
            TextField("Bio", text: $model.bio, axis: .vertical)
        }
    }
}

struct ProfileScreen: View {
    @State private var model = ProfileModel()

    var body: some View {
        NavigationStack {
            ProfileEditor(model: model)
                .navigationTitle("Profile")
                .toolbar {
                    ToolbarItem(placement: .status) {
                        Text(model.displayName)
                            .foregroundStyle(.secondary)
                    }
                }
        }
    }
}
```

Views refresh when **read** properties change—finer than a blanket `objectWillChange`, with less boilerplate than `ObservableObject` / `@Published` / `@StateObject`. Legacy `@ObservedObject` / `@EnvironmentObject` still appear in older code; new work should start with `@Observable` (and environment injection APIs documented for your SDK).

| Scenario | Prefer |
| --- | --- |
| Toggle, stepper, draft text | `@State` |
| Child edits parent storage | `@Binding` / `$` |
| Reusable domain model | `@Observable` owned by `@State` |
| Form fields on a model | `@Bindable` |

*Managing model data* is really about ownership: views present and collect input; models hold rules and data. Don’t let `body` become a second business layer.

---

## 8. NavigationStack, value-based NavigationLink, navigationDestination

Prefer **`NavigationStack`** and **value-driven** links over nesting full view destinations in every `NavigationLink`. Paths become encodable, testable, and easy to append/pop for deep links.

```swift
enum Route: Hashable {
    case detail(id: UUID)
    case settings
}

struct RootView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            List {
                NavigationLink("Settings", value: Route.settings)
                Button("Push detail programmatically") {
                    path.append(Route.detail(id: UUID()))
                }
            }
            .navigationTitle("Home")
            .navigationDestination(for: Route.self) { route in
                switch route {
                case .settings:
                    Text("Settings")
                case .detail(let id):
                    Text("Detail \(id.uuidString)")
                        .font(.footnote.monospaced())
                }
            }
        }
    }
}
```

Use `NavigationPath` or a typed `[Route]`. Pop with `removeLast()`; reset with a fresh path. Apple’s *NavigationStack* docs emphasize this data-driven style. Avoid pasting old `NavigationView` samples when you expect stack-path APIs. Model navigable screens as a route enum instead of scattering `NavigationLink(destination:)` across files. Prefer pushing an id and looking up the model over stuffing heavy value copies into the path—keep paths light, `Hashable`, and loggable. Printing `path.count` beats guessing stack depth.

---

## 9. Sheets, alerts, TabView basics

- **Push navigation**: same task flow; user expects Back  
- **Sheet**: temporary modal (edit, filter, sign-in)  
- **Alert / confirmationDialog**: short decisions—not long forms  
- **TabView**: peer top-level sections, not hierarchy  

```swift
struct ShellView: View {
    @State private var showSheet = false
    @State private var showAlert = false
    @State private var tab = 0

    var body: some View {
        TabView(selection: $tab) {
            NavigationStack {
                VStack(spacing: 20) {
                    Button("Open sheet") { showSheet = true }
                    Button("Confirm", role: .destructive) { showAlert = true }
                }
                .navigationTitle("Home")
                .sheet(isPresented: $showSheet) {
                    NavigationStack {
                        Text("Sheet content")
                            .toolbar {
                                ToolbarItem(placement: .cancellationAction) {
                                    Button("Close") { showSheet = false }
                                }
                            }
                    }
                    .presentationDetents([.medium, .large])
                }
                .alert("Delete item?", isPresented: $showAlert) {
                    Button("Delete", role: .destructive) { }
                    Button("Cancel", role: .cancel) { }
                } message: {
                    Text("This cannot be undone.")
                }
            }
            .tabItem { Label("Home", systemImage: "house") }
            .tag(0)

            Text("Explore")
                .tabItem { Label("Explore", systemImage: "safari") }
                .tag(1)
        }
    }
}
```

Prefer `.sheet(item:)` when editing a specific `Identifiable` value so presentation stays in sync with data. Button `role`s matter for styling and VoiceOver—don’t make every action a plain button. Keep tab counts small (often 3–5); give each tab its own root `NavigationStack` so drills don’t collide. To switch tabs and deep-link, drive shared state rather than posting ad-hoc notifications. When a sheet and the keyboard share the screen, try detents (`.medium` / `.large`) on the simulator before users report covered fields.

---

## 10. AsyncImage & SF Symbols

SF Symbols: `Image(systemName:)` and `Label` for dynamic type / accessibility. Browse names in Apple’s SF Symbols Mac app.

`AsyncImage` loads remote images with explicit phases—add caching later, but always handle empty / success / failure to avoid blank cells and layout jump.

```swift
struct MediaRow: View {
    let title: String
    let url: URL

    var body: some View {
        HStack(spacing: 12) {
            AsyncImage(url: url) { phase in
                switch phase {
                case .empty:
                    ProgressView()
                        .frame(width: 56, height: 56)
                case .success(let image):
                    image
                        .resizable()
                        .scaledToFill()
                        .frame(width: 56, height: 56)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                case .failure:
                    Image(systemName: "photo")
                        .frame(width: 56, height: 56)
                        .foregroundStyle(.secondary)
                @unknown default:
                    EmptyView()
                }
            }
            Label(title, systemImage: "link")
            Spacer(minLength: 0)
        }
        .padding(.vertical, 4)
    }
}
```

Local assets still use `Image("assetName")`. Mind ATS and fixed placeholder frames in lists.

---

## 11. Mini end-to-end sample: Todo list

Wire Observation, `List` bindings, `NavigationStack` detail, and an add sheet into one vertical slice. Drop the types into one file first; split later.

```swift
import SwiftUI
import Observation

@Observable
final class TodoStore {
    var items: [TodoItem] = [
        TodoItem(title: "Finish the SwiftUI tutorial", isDone: false),
        TodoItem(title: "Run it in the simulator", isDone: true)
    ]

    func add(title: String) {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        items.append(TodoItem(title: trimmed, isDone: false))
    }
}

struct TodoItem: Identifiable, Hashable {
    let id: UUID
    var title: String
    var isDone: Bool
    var note: String

    init(title: String, isDone: Bool, note: String = "") {
        self.id = UUID()
        self.title = title
        self.isDone = isDone
        self.note = note
    }
}

struct TodoApp: View {
    @State private var store = TodoStore()
    @State private var showAdd = false

    var body: some View {
        NavigationStack {
            List {
                ForEach($store.items) { $item in
                    NavigationLink(value: item.id) {
                        HStack {
                            Image(systemName: item.isDone ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(item.isDone ? .green : .secondary)
                                .onTapGesture { item.isDone.toggle() }
                            Text(item.title)
                                .strikethrough(item.isDone)
                        }
                    }
                }
                .onDelete { indexSet in
                    store.items.remove(atOffsets: indexSet)
                }
            }
            .navigationTitle("Todos")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showAdd = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .navigationDestination(for: UUID.self) { id in
                if let index = store.items.firstIndex(where: { $0.id == id }) {
                    TodoDetailView(item: $store.items[index])
                } else {
                    ContentUnavailableView("Deleted", systemImage: "trash")
                }
            }
            .sheet(isPresented: $showAdd) {
                AddTodoSheet { title in
                    store.add(title: title)
                }
            }
        }
    }
}

struct TodoDetailView: View {
    @Binding var item: TodoItem

    var body: some View {
        Form {
            TextField("Title", text: $item.title)
            Toggle("Done", isOn: $item.isDone)
            TextField("Notes", text: $item.note, axis: .vertical)
                .lineLimit(3...8)
        }
        .navigationTitle("Detail")
    }
}

struct AddTodoSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var title = ""
    var onAdd: (String) -> Void

    var body: some View {
        NavigationStack {
            Form {
                TextField("New todo", text: $title)
                    .submitLabel(.done)
                    .onSubmit {
                        guard !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
                        onAdd(title)
                        dismiss()
                    }
            }
            .navigationTitle("Add")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        onAdd(title)
                        dismiss()
                    }
                    .disabled(title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
    }
}

#Preview {
    TodoApp()
}
```

Takeaways: `ForEach($store.items)` yields element bindings; detail uses `navigationDestination(for:)` with `$store.items[index]`; add flow uses a sheet + `dismiss`; missing items get `ContentUnavailableView`. Extend with filters, SwiftData, or `.environment` injection.

Three practice ladders: (1) a toolbar segmented control filtering All / Open / Done; (2) a `DatePicker` due date shown as relative time in the list; (3) move `TodoStore` onto SwiftData `@Model` so data survives process death. After each step, re-check ownership: filter UI state belongs to the view; todo entities belong to the model.

---

## 12. Common pitfalls & next steps

**Pitfalls**

1. Fresh `UUID()` inside `body` as an `id` → thrashing lists.  
2. Duplicating shared models across unrelated `@State` copies.  
3. Wrong modifier order (`background` / `padding` / `clipShape`).  
4. Copy-pasting `NavigationView` samples into a `NavigationStack` world.  
5. Empty Canvas because the preview never seeded state or wrapped a stack.  
6. Firing network calls directly in `body` without `task` / `onAppear`.  
7. `isPresented` sheets that leave stale draft text after dismiss.

**Previews & traits**

```swift
#Preview("Dark · large type") {
    TodoApp()
        .preferredColorScheme(.dark)
}

#Preview(traits: .sizeThatFitsLayout) {
    ProfileHeader(name: "Ice")
}
```

**Testing mindset**: unit-test store methods and pure helpers first; UI-test the critical path (add → appears → open detail). Correct data flow beats pixel snapshots early on.

**Next**: `withAnimation` / `matchedGeometryEffect`, SwiftData, `task` + structured concurrency, Accessibility, multi-`Scene` / iPad columns. Keep Apple’s *State and Data Flow*, *Navigation*, and *Managing model data* docs nearby; trust Release Notes when APIs shift.

### Checklist

- [ ] Create a SwiftUI App; tweak `Text` modifiers in Canvas  
- [ ] Build a card with `VStack` + `HStack` + `Spacer` + `frame`  
- [ ] Wire `Toggle` / `Stepper` with `@State` & `@Binding`  
- [ ] Mark a model `@Observable`; add/delete/toggle in a `List`  
- [ ] Push detail via `NavigationStack` + `navigationDestination` and write back  
- [ ] Add via sheet; confirm delete with `alert`  
- [ ] Run the todo sample; extend with note search or SF Symbol tags  
- [ ] Add dark-mode and `sizeThatFitsLayout` previews before you commit  

</div>

