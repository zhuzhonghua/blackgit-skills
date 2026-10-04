# BlackGit Skills

**English** | **简体中文**

[BlackGit](https://github.com/zhuzhonghua/blackgit)（稀疏/按需拉取 git 客户端，专为 monorepo 设计）的 Agent Skill：部分克隆（`blob:none`）+ 稀疏检出，只物化**你 follow 的文件**。无需 LFS，无需下载多 GB 仓库的完整历史。

Skill 本体位于 [`skills/blackgit/`](skills/blackgit/SKILL.md)（SKILL.md + 捆绑的 `blackgitcli.py` + 命令参考）。为每个主流 Agent 工具都提供了插件清单（manifest）。

## 安装

按工具分别安装——如果你同时使用多个 Agent，请为每个工具单独安装。

### Claude Code

先注册 marketplace，再安装插件：

```bash
claude plugin marketplace add zhuzhonghua/blackgit-skills
claude plugin install blackgit@blackgit-skills
```

或者在 Claude Code 会话内：`/plugin marketplace add zhuzhonghua/blackgit-skills` 然后 `/plugin install blackgit@blackgit-skills`。

### Codex CLI

```bash
codex plugin marketplace add zhuzhonghua/blackgit-skills
codex plugin add blackgit@blackgit-skills
```

### Cursor

在 Agent 聊天中：

```text
/add-plugin blackgit
```

或手动注册 marketplace（已提供 `.cursor-plugin/plugin.json`）。

### Devin CLI

```bash
devin plugins install zhuzhonghua/blackgit-skills
```

更新：

```bash
devin plugins update blackgit
```

### Kimi Code

Kimi Code 直接安装来自 marketplace 的插件：

```text
/plugins install https://github.com/zhuzhonghua/blackgit-skills
```

或打开插件管理器（`/plugins`），在 `Marketplace` 中选择 BlackGit。

### Hermes Agent

```bash
hermes plugins install zhuzhonghua/blackgit-skills --enable
```

安装后重启活动的 Hermes 会话。插件会把 `blackgit` skill 注册到 Hermes 的原生 skill 加载器。

### Muse

从本地检出安装：

```bash
git clone https://github.com/zhuzhonghua/blackgit-skills.git
muse plugins install ./blackgit-skills
muse plugins approve blackgit
```

更新：

```bash
muse plugins update blackgit
```

### OpenCode

OpenCode 使用自己的插件安装方式（见 [.opencode/INSTALL.md](.opencode/INSTALL.md)）：

```json
{
  "plugins": ["blackgit@git+https://github.com/zhuzhonghua/blackgit-skills.git"]
}
```

重启 OpenCode，然后使用其原生 `skill` 工具加载 `blackgit`。

### Pi

作为 Pi 包从此仓库安装：

```bash
pi install git:github.com/zhuzhonghua/blackgit-skills
```

本地开发时，让 Pi 将此检出作为临时包加载：

```bash
pi -e /path/to/blackgit-skills
```

该包会把 `skills/` 注册到 Pi 的原生 skill 发现机制。

### Gemini CLI

安装扩展：

```bash
gemini extensions install https://github.com/zhuzhonghua/blackgit-skills
```

更新：

```bash
gemini extensions update blackgit
```

### Qwen Code

Qwen Code 直接安装 Claude Code marketplace 中的插件：

```bash
qwen extensions install zhuzhonghua/blackgit-skills
```

按提示选择 `blackgit`。

### Agents（.agents/plugins marketplace）

仓库在 `.agents/plugins/marketplace.json` 提供了跨运行时 marketplace 清单，供消费它的 Agent 运行时使用。请使用你的运行时提供的 marketplace 添加 / 插件安装流程，指向本仓库。

### skills.sh（支持数十种 Agent）

```bash
npx skills add zhuzhonghua/blackgit-skills --skill blackgit
```

按提示选择你的 Agent。默认项目级安装；加 `-g` 为全局安装。

### 手动安装（任意 Agent — 豆包、opencode、Cursor、Gemini 等）

克隆后把 skill 文件夹复制到你的 Agent 的 skills 目录：

```bash
git clone https://github.com/zhuzhonghua/blackgit-skills
cp -r blackgit-skills/skills/blackgit <your-agent-skills-dir>/blackgit
```

常见 skills 目录：`~/.claude/skills/`（Claude Code）、`~/.codex/skills/`（Codex）、`~/.config/opencode/skills/`（opencode）、`.cursor/skills/`（Cursor，项目级）、`~/.agents/skills/`（跨运行时别名）。

## 使用

例如可以这样对你的 Agent 说：

- "克隆这个 monorepo，只 follow `src/engine` 和 `assets/levels/level1`"
- "不检出工作区，看看 `origin/main` 上 `assets` 里有什么"
- "把仓库快进到最新提交"
- "锁定 `map.bin`，让别人无法 push 它的改动"

Agent 读取 `SKILL.md` 后，通过 `scripts/blackgitcli.py` 执行（`python3 scripts/blackgitcli.py <command>`）。要求：git ≥ 2.54、python3。

## 插件清单

| 工具 | 清单文件 |
|---|---|
| Claude Code | `.claude-plugin/marketplace.json`、`.claude-plugin/plugin.json` |
| Codex | `.codex-plugin/plugin.json` |
| Cursor | `.cursor-plugin/plugin.json` |
| Devin | `.devin-plugin/plugin.json` |
| Kimi Code | `.kimi-plugin/plugin.json` |
| Hermes | `.hermes-plugin/plugin.yaml`、`.hermes-plugin/__init__.py` |
| Muse | `.muse-plugin/marketplace.json`、`.muse-plugin/plugin.json` |
| OpenCode | `.opencode/plugins/blackgit.js`、`.opencode/INSTALL.md` |
| Pi | `.pi/extensions/blackgit.ts` |
| Gemini | `gemini-extension.json`、`GEMINI.md` |
| Agents | `.agents/plugins/marketplace.json` |

## 许可

MIT。`scripts/blackgitcli.py` 拷贝自 BlackGit 项目（`github.com/zhuzhonghua/blackgit` 的 `blackgitcli.py`）；客户端源码的许可请参阅该仓库的 LICENSE。
