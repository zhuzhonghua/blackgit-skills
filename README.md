# BlackGit Skills

Agent skills for [BlackGit](https://github.com/zhuzhonghua/blackgit) — the sparse/promisor git client for monorepos: partial clone (`blob:none`) + sparse-checkout, materializing **only the files you follow**. No LFS, no full history of a multi-GB repo.

The skill lives in [`skills/blackgit/`](skills/blackgit/SKILL.md) (SKILL.md + bundled `blackgitcli.py` + command reference).

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

## License

MIT. `scripts/blackgitcli.py` is copied from the BlackGit project (`github.com/zhuzhonghua/blackgit`, `blackgitcli.py`); see that repository's LICENSE for the client source.
