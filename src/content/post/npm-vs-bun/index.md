---
title: "npm 与 Bun：包管理与运行时怎么选"
titleEn: "npm vs Bun: Package Manager and Runtime Trade-offs"
publishDate: "2026-09-26 17:00:00"
description: "从安装、锁文件、运行时角色、速度与 DX、Node 兼容性到选型建议，对照 npm 与 Bun 的实用差异，并标明常见坑。"
descriptionEn: "A practical npm vs Bun comparison: install and lockfiles, runtime vs package manager, speed and DX, Node compatibility, when to pick which, and caveats."
tags:
  - JavaScript
  - 工具链
  - npm
  - Bun
language: "中 / EN"
draft: false
---

<div data-post-lang="zh">

## 先分清：npm 和 Bun 不是同类东西

最容易犯的错是把它们当成「两个 npm」。其实对比的是两个不同层面的工具：

| | npm | Bun |
| --- | --- | --- |
| 本质 | **包管理器 + 注册表客户端**，随 Node.js 一起分发 | **JS 运行时**，同时内置打包器、测试运行器和包管理器 |
| 是否能跑 JS 程序 | 不能，`npm start` 只是执行 `package.json` 里的脚本 | 能，`bun run index.ts` 直接执行代码 |
| 默认生态 | Node.js / CommonJS 起家，覆盖面最广 | 以 Node 兼容为目标，兼容层持续补齐 |
| 锁文件 | `package-lock.json` | `bun.lock`（文本格式，旧版为二进制 `bun.lockb`） |
| 出现时间 | 2010 年起，随 Node 演进 | 2022 年底开源，迭代快 |

一句话：**npm 只负责「装依赖、跑脚本」；Bun 既装依赖，又能当 Node 的替代运行时。** 所以「npm vs Bun」真正的选型题其实是两道：包管理器选谁，运行时选谁——这两道题可以分开答。

## 安装与日常工作流

两者的日常命令几乎是平行的，迁移成本主要在习惯和脚本里写死的命令：

```bash
# 安装依赖
npm install            # 生成/更新 package-lock.json
bun install            # 生成/更新 bun.lock

# 只装生产依赖
npm ci                 # CI 场景，严格按锁文件安装
bun install --production

# 新增依赖
npm install lodash     # 默认写入 dependencies
bun add lodash
bun add -d vitest      # 等价 npm install -D

# 跑 package.json 里的脚本
npm run dev            # npm 需要显式 run（npm start / npm test 除外）
bun run dev            # bun 可以省略 run：bun dev
```

几个实用差异：

- **`npm install` vs `bun install`**：Bun 的安装通常明显更快，它并行下载、复用全局缓存，且默认会把依赖提升的方式和 npm 略有不同，极少数依赖解析顺序敏感的老包可能表现不一致。
- **`npm ci` 的对应物**：CI 里 npm 用 `npm ci` 保证「严格按锁文件、干净安装」。Bun 没有完全同名的命令，一般用 `bun install --frozen-lockfile` 达到类似效果——锁文件有未提交改动时直接失败，适合 CI。
- **脚本执行**：Bun 把 `bun <script>` 当作 `bun run <script>` 的简写，还能直接 `bun dev`、`bun test`；npm 必须 `npm run`（少数内置命令除外）。
- **npx / bunx**：`npx create-vite` 对应 `bunx create-vite`，用于临时拉起 CLI 工具，行为基本一致。

## 锁文件：混用是最常见的坑

| | `package-lock.json` | `bun.lock` / `bun.lockb` |
| --- | --- | --- |
| 格式 | JSON，可读、可 diff | `bun.lock` 是 JSONC 风格文本；`bun.lockb` 是旧版二进制 |
| 谁生成 | npm | Bun |
| 谁信任它 | `npm ci` | `bun install --frozen-lockfile` |
| 版本库友好度 | 高（文本） | `bun.lock` 高；`bun.lockb` 差（二进制不好 review） |

**最大的坑：一个仓库里同时留两份锁文件。** npm 不认识 `bun.lock`，Bun 也会读取 `package-lock.json`——两边各按各的解析，依赖树可能悄悄分叉，出现「本地是 Bun 装的、CI 是 npm 装的，结果不一致」这类幽灵问题。

建议：

1. 团队定一个标准包管理器，**只提交对应的一份锁文件**。  
2. 在 `package.json` 里用 [`engines`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#engines) 或 `packageManager` 字段声明工具（npm 从 v7 起支持 `packageManager`，corepack 也认它），并用 `.npmrc` 的 `engine-strict=true` 在安装时硬性校验。  
3. 换工具时**删掉旧锁文件、删掉 `node_modules`、重装一次**，不要「并存过渡」。

## 运行时 vs 包管理器：角色完全不同

这是概念上最值得说清的一点。

- **npm 不是运行时。** 它不能执行你的 `.js` / `.ts` 文件，只能解析依赖图、把包放进 `node_modules`、以及执行 `package.json` 里的脚本——而脚本里的 `node server.js` 仍然是 Node 在跑。
- **Bun 是运行时。** 它内置了 JS/TS 执行引擎（基于 JavaScriptCore，而非 Vite/Node 用的 V8）、Bundler、测试运行器（`bun test`）、打包与转译能力，同时**也**附带一个包管理器。所以 Bun 可以在很多场景里整体替代 Node：

```bash
bun init               # 交互式建项目
bun run src/index.ts   # 直接跑 TS，无需 ts-node / tsx
bun test               # 内置测试运行器，兼容大部分 Jest 风格 API
bun build ./src --outdir=dist   # 内置打包
```

但注意：**用 Bun 跑程序 ≠ 用 Bun 装依赖**。常见组合有三种：

| 组合 | 含义 | 适用 |
| --- | --- | --- |
| npm 装 + Node 跑 | 最保守、最通用 | 生产要求严格 Node、团队标准 |
| Bun 装 + Node 跑 | 只吃安装速度红利 | 生产仍必须 Node，想加速 CI |
| Bun 装 + Bun 跑 | 本地开发全面提速 | 新项目、脚本、工具链 |

第二种是很多团队最务实的起点：**风险最小，收益（安装时间）拿得最直接。**

## 速度与 DX：方向明确，数字别当真

以下都是社区普遍认可的**定性**结论，不是实验室数据：

- **安装速度**：Bun 安装通常显著快于 npm，尤其是冷缓存、大依赖树、CI 流水线里。Bun 官方和第三方对比都指向同一方向，但具体倍数随网络、磁盘、包数量波动很大，**不要引用某个精确到小数点的倍数当依据**。
- **启动与运行**：Bun 跑 TS 的启动开销通常低于 `node + ts-node` 这类方案；和原生 `node`（尤其带启动缓存）比，差距要小得多，某些场景 Node 反而更稳。
- **DX 细节**：
  - Bun 原生执行 TypeScript / JSX，省掉一层编译工具链；
  - `bun test` 免配置，启动快；
  - `bun --watch` 热重载对脚本友好；
  - 内置 `.env` 加载、`fetch`、SQLite 等，减少对第三方小包的依赖；
  - npm 的优势是**稳定与普遍**：文档、教程、企业规范、报错资料几乎都以它为默认。

**结论**：速度上 Bun 的优势真实存在且方向稳定；但「快多少」取决于场景，选型时把它当趋势，不当硬指标。

## Node 兼容性：目标是兼容，现实是有缝

Bun 的公开目标是尽可能兼容 Node.js API 与常见生态，实际表现分层看：

| 层级 | 兼容情况 | 典型例子 |
| --- | --- | --- |
| 常见 Web / 脚本场景 | 通常良好 | `fs`、`path`、`http`、`fetch`、`process` 等高频 API |
| 主流框架与工具 | 多数可跑 | React/Vue/Svelte 生态、多数 CLI、测试框架兼容层 |
| 原生扩展（N-API / node-gyp） | **最大的缝** | 依赖 C++ 原生模块的老包、部分数据库/加密驱动 |
| 边缘 / 特定 Node 行为 | 部分缺失或语义不同 | 某些 `vm`、`worker_threads` 细节、冷启动路径、调试协议 |
| Node 独占工具链 | 不适用 | 依赖 Node 特有内部行为的工具、部分 CI 镜像约定 |

实用判断：

- 如果项目**只依赖纯 JS 包**（绝大多数前端工具链），Bun 跑通的概率很高；
- 如果碰到**原生 addon**（node-gyp 编译、`bcrypt`、老版本 `sqlite3`、某些图像/压缩库），就要预期要回退到 Node，或寻找维护中的替代品；
- 生产环境若公司规范写明「必须 Node LTS」，**运行时就不要换**——但包管理器仍可以用 Bun 加速本地与 CI。

## 真实使用场景：什么时候用谁

把前面几节的结论落到具体项目上，几类常见场景的默认选择通常如下：

| 场景 | 倾向选择 | 说明 |
| --- | --- | --- |
| Monorepo / 大型 Node 应用，生产明确要求 Node LTS | **npm**（或 `bun install` + Node 运行） | 规范约束优先于安装速度；若只想要安装提速，可保留 Node 运行时，仅换包管理器 |
| 绿地 TypeScript 工具、脚本、CLI | **`bun install` + `bun run`** | 工具链由你定义，原生执行 TS、内置测试与打包能减少一层编译工具链 |
| 发布到 npm 注册表、供他人使用的库 | **npm** | 下游多为 npm/pnpm 用户，锁文件与工具选择尽量保守，避免给使用者增加额外假设 |
| CI 安装耗时成为瓶颈 | **`bun install --frozen-lockfile`** | 只换安装环节即可拿到收益；运行时若受部署规范限制，仍可继续用 Node |
| 依赖原生扩展（node-gyp、`bcrypt` 等） | **Node 运行时** | 原生 addon 是兼容层最大的缝，应尽早验证，别等到上线前才发现编译不过 |
| Vite / Next 一类前端应用，依赖基本是纯 JS | **本地开发多可用 Bun** | 主要改善本地开发体验；构建产物与部署阶段仍按团队既有流程走 |

有两点值得强调：其一，**「装依赖」和「跑代码」可以分开决策**——上表里多数「选 npm」的场景，都不排斥在本地或 CI 用 Bun 安装；其二，**原生依赖与公司规范属于硬约束**，出现冲突时以约束为准，速度收益排在后面。

具体怎么权衡，下面按约束展开。

## 怎么选：按约束，不按热度

**选 npm（或继续 Node 标准链路），如果：**

- 团队 / 公司有既定规范，生产明确要求 Node LTS；
- 你维护的是**给别人用的库**——发布到 npm 的库要考虑下游全是 npm/pnpm 用户，锁文件与工具选择尽量保守；
- CI 镜像、安全审计、合规工具都围绕 npm 生态建好（如 `npm audit` 流程）；
- 想要「最不容易被坑」的默认答案。

**选 Bun（至少在本地 / CI 试起来），如果：**

- 新的绿地项目，工具链你自己定；
- `bun install` 的等待时间已经影响开发体验或 CI 时长；
- 项目大量是 TS 脚本、测试、小型服务，想要 `bun run` / `bun test` 一体的 DX；
- 你能接受碰到不兼容时**局部回退 Node**。

**常见可行的混合策略：**

```text
本地开发：bun install + bun run     ← 求快
CI 安装：bun install --frozen-lockfile，或直接 npm ci ← 求稳
生产运行：node server.js（Node LTS） ← 求稳
```

关键不是「谁替代谁」，而是**把「装依赖」和「跑代码」当成两个独立决策**。

## 几个短提醒（坑清单）

1. **别混锁文件**：一个仓库只认一个包管理器；切换时删干净 `node_modules` 与旧锁文件再重装。  
2. **生产要 Node 就别硬换运行时**：可以用 Bun 加速安装，但运行时遵循部署规范与镜像基线。  
3. **原生依赖先验证**：引入依赖前跑一遍 `bun install && bun run build/test`，别等到上线前才发现 addon 编译不过。  
4. **Bun 迭代快**：版本之间行为可能变化，锁定具体版本（尤其在 CI 镜像里），不要用漂移的 `latest`。  
5. **生态成熟度不对等**：npm 的「无聊的稳定」本身就是价值；Bun 的速度是溢价，不是免费午餐。  
6. **审计与安全流程要跟着换**：换包管理器后，确认 `audit`、许可证扫描、镜像缓存等 CI 步骤仍然有效。

## 小结

npm 和 Bun 的关系，更像「**标准件**」与「**新锐全栈工具**」：npm 是 Node 世界的默认包管理器，稳、通用、到处都能对上；Bun 是一个以 Node 兼容为目标的运行时，顺便把包管理、打包、测试一起做了，安装与开发体验的提速是它最实在的卖点。

选型的最短路径：

- **只想要更快的安装** → 本地/CI 用 Bun 装，运行时仍用 Node；  
- **想要一体化 DX 的新项目** → Bun 装 + Bun 跑，先验证原生依赖；  
- **团队规范 / 生产强约束 / 发库** → 留在 npm（或团队既定工具），别为了快引入不确定性。

先把「谁装依赖」和「谁跑代码」拆开回答，问题会立刻小一半。

</div>

<div data-post-lang="en" hidden>

## First, they are not the same kind of tool

The most common mistake is treating Bun as “a faster npm”. The comparison actually spans two layers:

| | npm | Bun |
| --- | --- | --- |
| What it is | **Package manager + registry client**, shipped with Node.js | **JS runtime** with a built-in bundler, test runner, and package manager |
| Can it execute JS/TS? | No — `npm start` only runs a script from `package.json` | Yes — `bun run index.ts` executes code directly |
| Ecosystem baseline | Node.js / CommonJS roots, the widest default support | Aims for Node compatibility; gaps are being closed over time |
| Lockfile | `package-lock.json` | `bun.lock` (text; older binary form: `bun.lockb`) |
| Age | Since 2010, evolves with Node | Open-sourced in late 2022, fast-moving |

In one line: **npm installs dependencies and runs scripts; Bun does that too, and can also replace Node as the runtime.** So “npm vs Bun” is really two separate questions — which package manager, and which runtime — and you can answer them independently.

## Install and everyday workflows

Day-to-day commands are nearly parallel; the migration cost is mostly habit and hardcoded commands in scripts:

```bash
# Install dependencies
npm install            # writes/updates package-lock.json
bun install            # writes/updates bun.lock

# Production-only install
npm ci                 # CI: clean install strictly from the lockfile
bun install --production

# Add a dependency
npm install lodash     # defaults to dependencies
bun add lodash
bun add -d vitest      # same as npm install -D

# Run package.json scripts
npm run dev            # npm generally needs an explicit `run`
bun run dev            # bun allows dropping `run`: `bun dev`
```

Practical differences worth knowing:

- **`npm install` vs `bun install`**: Bun is usually noticeably faster — parallel downloads and a shared cache. Hoisting and resolution details differ slightly, so a few old packages that are sensitive to install order can behave differently.
- **The `npm ci` equivalent**: CI relies on `npm ci` for a clean, lockfile-exact install. Bun has no identically named command; `bun install --frozen-lockfile` is the usual stand-in — it fails if the lockfile has uncommitted changes.
- **Script execution**: `bun <script>` is shorthand for `bun run <script>`, plus shortcuts like `bun dev` and `bun test`. npm requires `npm run` for most scripts (`start` and `test` being the usual exceptions).
- **npx vs bunx**: `bunx create-vite` is the Bun counterpart of `npx create-vite` for one-off CLI tools, and behaves largely the same.

## Lockfiles: mixing them is the classic footgun

| | `package-lock.json` | `bun.lock` / `bun.lockb` |
| --- | --- | --- |
| Format | JSON — readable, diffable | `bun.lock` is JSONC-style text; `bun.lockb` is an older binary format |
| Produced by | npm | Bun |
| Trusted by | `npm ci` | `bun install --frozen-lockfile` |
| VCS friendliness | High (text) | `bun.lock` high; `bun.lockb` poor (binary, hard to review) |

**The biggest trap: keeping both lockfiles in one repo.** npm ignores `bun.lock`, and Bun will also read `package-lock.json`. Each tool resolves its own way, dependency trees can silently diverge, and you end up with “works on my machine because I installed with Bun, CI installs with npm, and nothing matches.”

Recommendations:

1. Pick one package manager per repo and **commit only its lockfile**.  
2. Declare the tool via [`engines`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#engines) or the `packageManager` field in `package.json` (npm v7+ understands `packageManager`, and corepack does too), plus `engine-strict=true` in `.npmrc` to fail fast.  
3. When switching tools, **delete the old lockfile and `node_modules`, then reinstall once** — never “run both during transition.”

## Runtime vs package manager: different roles

This is the conceptual point worth getting right.

- **npm is not a runtime.** It cannot execute your `.js` / `.ts` files. It resolves the dependency graph, writes `node_modules`, and runs scripts from `package.json` — but inside those scripts, `node server.js` is still Node doing the work.
- **Bun is a runtime.** It ships a JS/TS engine (JavaScriptCore, not the V8 that Node uses), a bundler, a test runner (`bun test`), and transpilation — and it *also* bundles a package manager. That means Bun can replace Node for many workloads:

```bash
bun init               # interactive project setup
bun run src/index.ts   # run TypeScript directly, no ts-node / tsx
bun test               # built-in runner, largely Jest-compatible
bun build ./src --outdir=dist   # built-in bundling
```

But **running code with Bun ≠ installing dependencies with Bun**. The common combinations:

| Combination | Meaning | When it fits |
| --- | --- | --- |
| npm install + Node run | Most conservative, most portable | Strict production Node requirements, team standards |
| Bun install + Node run | Harvest install speed only | Production must stay Node; you still want faster CI |
| Bun install + Bun run | Full local DX speedup | Greenfield projects, scripts, toolchains |

The middle row is often the most pragmatic starting point: **lowest risk, clearest payoff (install time).**

## Speed and DX: direction is clear, numbers are not

These are **qualitative**, widely observed claims — not lab results:

- **Install speed**: Bun is usually much faster than npm, especially on cold caches, large trees, and CI jobs. Official and third-party comparisons point the same way, but the multiple varies with network, disk, and package count — **don’t cite a precise multiplier as a decision input**.
- **Startup and run**: Bun typically starts TS faster than `node + ts-node`. Against plain `node` (especially with warm caches) the gap is much smaller, and Node can even win in some cases.
- **DX details**:
  - Native TypeScript / JSX execution removes a whole compile layer;
  - `bun test` is zero-config and quick to start;
  - `bun --watch` is handy for scripts;
  - Built-in `.env` loading, `fetch`, and SQLite reduce the need for tiny helper packages;
  - npm’s advantage is **boring stability**: docs, tutorials, enterprise policies, and Stack Overflow answers assume it by default.

**Verdict**: Bun’s speed advantage is real and directionally consistent; the magnitude is workload-dependent. Treat it as a trend, not a hard benchmark.

## Node compatibility: aiming for parity, with seams

Bun’s stated goal is broad Node.js API compatibility. In practice it layers out like this:

| Layer | Compatibility | Typical examples |
| --- | --- | --- |
| Common web/script surface | Usually good | `fs`, `path`, `http`, `fetch`, `process` |
| Major frameworks and tools | Mostly runs | React/Vue/Svelte toolchains, most CLIs, test framework shims |
| Native addons (N-API / node-gyp) | **The main seam** | C++ addons, some database/crypto drivers |
| Edge cases / Node-specific behavior | Partial or subtly different | Some `vm` / `worker_threads` details, cold-start paths, debug protocol |
| Node-only tooling | Not applicable | Tools depending on Node internals, some CI image conventions |

Practical heuristics:

- If the project is **pure JS packages only** (most front-end toolchains), Bun will very likely run it;
- If you hit **native addons** (node-gyp builds, `bcrypt`, older `sqlite3`, some image/compression libs), expect to fall back to Node or swap in a maintained alternative;
- If company policy says “production must be Node LTS”, **don’t swap the runtime** — but you can still use Bun as the package manager to speed up local installs and CI.

## Real-world use cases: when each fits

Applying the previous sections to concrete projects, the default choice for common scenarios usually looks like this:

| Scenario | Lean toward | Rationale |
| --- | --- | --- |
| Monorepo / large Node app with a strict production Node LTS requirement | **npm** (or `bun install` + Node runtime) | Policy outranks install speed; if you only want faster installs, keep Node as the runtime and swap the package manager |
| Greenfield TypeScript tooling, scripts, and CLIs | **`bun install` + `bun run`** | You own the toolchain; native TS execution plus the built-in test runner and bundler remove a compile layer |
| A library published to the npm registry for others to consume | **npm** | Downstream users are mostly npm/pnpm consumers — stay conservative with lockfiles and tooling so you don’t add assumptions for them |
| CI install time is the bottleneck | **`bun install --frozen-lockfile`** | Swapping only the install step captures the gain; if deployment policy fixes the runtime, keep running on Node |
| Dependencies on native addons (node-gyp, `bcrypt`, and similar) | **Node runtime** | Native addons are the main compatibility seam — verify early rather than the night before release |
| Frontend apps in the Vite / Next style with mostly pure JS dependencies | **Bun is often fine for local development** | It mainly improves local DX; builds and deployment stay on your team’s existing pipeline |

Two points deserve emphasis. First, **installing dependencies and running code can be decided independently** — most of the “stay on npm” rows above still leave room for Bun installs locally or in CI. Second, **native dependencies and company policy are hard constraints**; when they conflict with speed, the constraints win.

With that framing, here is how to weigh the trade-offs.

## How to choose: by constraints, not hype

**Stay on npm (the Node standard path) if:**

- Your team or company already standardizes on it, and production requires Node LTS;
- You maintain a **library for others** — anything published to npm will be consumed by npm/pnpm users, so stay conservative with tooling and lockfiles;
- CI images, security audits, and compliance tooling are built around npm (`npm audit` flows, license scans);
- You want the default that is hardest to get wrong.

**Adopt Bun (at least locally / in CI) if:**

- It’s a greenfield project and you own the toolchain;
- Waiting on `bun install` is already hurting dev experience or CI duration;
- The work is mostly TS scripts, tests, and small services where `bun run` / `bun test` pay off together;
- You’re fine falling back to Node **locally** when something doesn’t match.

**A common hybrid that works:**

```text
Local dev:  bun install + bun run          ← speed
CI install: bun install --frozen-lockfile, or plain npm ci ← stability
Production: node server.js (Node LTS)      ← stability
```

The point isn’t “which replaces which” — it’s treating **installing dependencies** and **running code** as two independent decisions.

## Short caveats (footgun list)

1. **Never mix lockfiles**: one repo, one package manager. On a switch, wipe `node_modules` and the old lockfile, then reinstall.  
2. **If production demands Node, don’t swap the runtime** — use Bun for install speed while the runtime follows deployment policy and image baselines.  
3. **Verify native deps early**: run `bun install && bun run build/test` before you commit, not the night before release.  
4. **Bun moves fast**: behavior can change between versions. Pin the version (especially in CI images); don’t float on `latest`.  
5. **Maturity is not equal**: npm’s “boring stability” is a feature. Bun’s speed is a bonus, not a free lunch.  
6. **Audit workflows must follow**: after switching package managers, confirm `audit`, license scanning, and cache steps in CI still actually run.

## Takeaway

npm and Bun are closer to a **standard part** versus a **new all-in-one toolbox**: npm is Node’s default package manager — stable, universal, and assumed everywhere; Bun is a Node-compatible runtime that also bundles the package manager, bundler, and test runner, with install and DX speedups as its most concrete selling point.

The shortest decision path:

- **Just want faster installs** → use Bun locally/in CI, keep Node as the runtime;  
- **Greenfield project wanting one toolchain** → Bun install + Bun run, after validating native deps;  
- **Team standards / hard production rules / publishing libraries** → stay on npm (or your team’s tool) and don’t trade certainty for speed.

Split “who installs” from “who runs,” and the question gets much smaller.

</div>
