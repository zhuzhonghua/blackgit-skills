# Installing BlackGit for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed

## Installation

OpenCode V2 requires version 2.0.4 or later.

### OpenCode V1

Use the V1 plugin configuration:

```json
{
  "plugin": ["blackgit@git+https://github.com/zhuzhonghua/blackgit-skills.git"]
}
```

### OpenCode V2 (2.0.4 or later)

Use the V2 plugin configuration:

```json
{
  "plugins": ["blackgit@git+https://github.com/zhuzhonghua/blackgit-skills.git"]
}
```

For a local V2 installation, configure the repository directory containing
`index.js` (or the plugin entry). Discovered plugin symlinks remain supported.

Restart OpenCode. The plugin registers the `blackgit` skill.

Verify by asking: "List the blackgit skills you have installed"

## Usage

Use OpenCode's native `skill` tool:

```
use skill tool to list skills
use skill tool to load blackgit
```

The skill drives `python3 scripts/blackgitcli.py <command>` inside
`skills/blackgit/`. Requirements: git ≥ 2.54, python3.

## Updating

OpenCode installs the plugin through a git-backed package spec; a restart may
not pick up the newest commit if the resolved dependency is pinned in a
lockfile or cache. Clear OpenCode's package cache or reinstall to update.

To pin a version, append a tag/commit to the spec (same form for V1 `plugin`
and V2 `plugins`):

```json
{
  "plugin": ["blackgit@git+https://github.com/zhuzhonghua/blackgit-skills.git#v0.1.0"]
}
```
