# BlackGit Skills

Agent skills for [BlackGit](https://github.com/zhuzhonghua/blackgit) — the sparse/promisor git client for monorepos: partial clone (`blob:none`) + sparse-checkout, materializing **only the files you follow**. No LFS, no full history of a multi-GB repo.

The skill lives in [`skills/blackgit/`](skills/blackgit/SKILL.md) (SKILL.md + bundled `blackgitcli.py` + command reference). Plugin manifests are provided for every major agent harness.

## Install

Install per harness — if you use more than one agent, install for each separately.

### Claude Code

Register the marketplace, then install the plugin:

```bash
claude plugin marketplace add zhuzhonghua/blackgit-skills
claude plugin install blackgit@blackgit-skills
```

Or, inside a Claude Code session: `/plugin marketplace add zhuzhonghua/blackgit-skills` then `/plugin install blackgit@blackgit-skills`.

### Codex CLI

```bash
codex plugin marketplace add zhuzhonghua/blackgit-skills
codex plugin add blackgit@blackgit-skills
```

### Cursor

In the agent chat:

```text
/add-plugin blackgit
```

or register the marketplace manually (`.cursor-plugin/plugin.json` is provided).

### Devin CLI

```bash
devin plugins install zhuzhonghua/blackgit-skills
```

Update later:

```bash
devin plugins update blackgit
```

### Kimi Code

Kimi Code installs plugins from marketplaces directly:

```text
/plugins install https://github.com/zhuzhonghua/blackgit-skills
```

or open the plugin manager (`/plugins`), go to `Marketplace` and pick BlackGit.

### Hermes Agent

```bash
hermes plugins install zhuzhonghua/blackgit-skills --enable
```

Restart any active Hermes sessions after installing. The plugin registers the `blackgit` skill with Hermes' native skill loader.

### Muse

Install from a local checkout:

```bash
git clone https://github.com/zhuzhonghua/blackgit-skills.git
muse plugins install ./blackgit-skills
muse plugins approve blackgit
```

Update later:

```bash
muse plugins update blackgit
```

### OpenCode

OpenCode uses its own plugin install (see [.opencode/INSTALL.md](.opencode/INSTALL.md)):

```json
{
  "plugins": ["blackgit@git+https://github.com/zhuzhonghua/blackgit-skills.git"]
}
```

Restart OpenCode, then use its native `skill` tool to load `blackgit`.

### Pi

Install as a Pi package from this repository:

```bash
pi install git:github.com/zhuzhonghua/blackgit-skills
```

For local development, run Pi with this checkout loaded as a temporary package:

```bash
pi -e /path/to/blackgit-skills
```

The package registers `skills/` with Pi's native skill discovery.

### Gemini CLI

Install the extension:

```bash
gemini extensions install https://github.com/zhuzhonghua/blackgit-skills
```

Update later:

```bash
gemini extensions update blackgit
```

### Qwen Code

Qwen Code installs plugins from Claude Code marketplaces directly:

```bash
qwen extensions install zhuzhonghua/blackgit-skills
```

Pick `blackgit` when prompted.

### Agents (.agents/plugins marketplace)

A cross-runtime marketplace manifest is provided at `.agents/plugins/marketplace.json` for agent runtimes that consume it. Use your runtime's marketplace add / plugin install flow pointing at this repository.

### skills.sh (many agents)

```bash
npx skills add zhuzhonghua/blackgit-skills --skill blackgit
```

Select your agent when prompted. Project-local by default; add `-g` for global.

### Manual (any agent — Doubao, opencode, Cursor, Gemini, …)

Clone and copy the skill folder into your agent's skills directory:

```bash
git clone https://github.com/zhuzhonghua/blackgit-skills
cp -r blackgit-skills/skills/blackgit <your-agent-skills-dir>/blackgit
```

Common skills directories: `~/.claude/skills/` (Claude Code), `~/.codex/skills/` (Codex), `~/.config/opencode/skills/` (opencode), `.cursor/skills/` (Cursor, project-local), `~/.agents/skills/` (cross-runtime alias).

## Use

Ask your agent, for example:

- "Clone this monorepo and follow only `src/engine` and `assets/levels/level1`"
- "What's in `assets` on `origin/main` without checking it out?"
- "Fast-forward the repo to the latest commits"
- "Lock `map.bin` so nobody else can push changes to it"

The agent reads `SKILL.md`, which drives `scripts/blackgitcli.py` (`python3 scripts/blackgitcli.py <command>`). Requirements: git ≥ 2.54, python3.

## Plugin manifests

| Harness | Manifest |
|---|---|
| Claude Code | `.claude-plugin/marketplace.json`, `.claude-plugin/plugin.json` |
| Codex | `.codex-plugin/plugin.json` |
| Cursor | `.cursor-plugin/plugin.json` |
| Devin | `.devin-plugin/plugin.json` |
| Kimi Code | `.kimi-plugin/plugin.json` |
| Hermes | `.hermes-plugin/plugin.yaml`, `.hermes-plugin/__init__.py` |
| Muse | `.muse-plugin/marketplace.json`, `.muse-plugin/plugin.json` |
| OpenCode | `.opencode/plugins/blackgit.js`, `.opencode/INSTALL.md` |
| Pi | `.pi/extensions/blackgit.ts` |
| Gemini | `gemini-extension.json`, `GEMINI.md` |
| Agents | `.agents/plugins/marketplace.json` |

## License

MIT. `scripts/blackgitcli.py` is copied from the BlackGit project (`github.com/zhuzhonghua/blackgit`, `blackgitcli.py`); see that repository's LICENSE for the client source.
