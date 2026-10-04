---
name: blackgit
description: Use when working with large monorepos or repos with many binary files (game projects, asset-heavy repos) where a full clone is too slow or too large, and only some files or directories are actually needed. Also use for sparse-checkout/partial-clone workflows: materializing only cared files, fast-forward updates without downloading blobs, listing remote trees without checking out, locking files against concurrent pushes, or when a clone would pull gigabytes for a few paths. Not for ordinary small repos where plain git suffices.
---

# BlackGit

## Overview

BlackGit is a sparse/promisor git client for monorepos: it wraps stock git to clone with `blob:none` + an empty sparse-checkout, then materializes **only the files you care about** (`follow`). No LFS, no full history of a multi-GB repo. Requires git ≥ 2.54 and python3 (stdlib only).

The bundled CLI is `blackgitcli.py` (the `git black` command). It talks ordinary git smart-HTTP and works against any remote (GitHub, GitLab, or a BlackGit server). Auth is handled by git's standard HTTP layer (credential helper, keychain, `http.extraHeader`) — never put credentials in URLs.

## When to Use

- Repo is huge (multi-GB binaries, game assets) and a full clone is impractical
- Only a few files/dirs are needed — `follow` them, nothing else materializes
- Listing the tree or branches without materializing the worktree
- Locking files so only the locker can push changes to them (enforced server-side)
- Updating to the latest commits without re-downloading blobs

**When NOT to use**: ordinary full-size repos — plain git is simpler.

## Quick Reference

All commands are `blackgitcli.py` subcommands (see Implementation for invocation):

| Command | What it does |
|---|---|
| `clone <url> [<dir>]` | init + partial clone (`blob:none`), sparse-checkout armed, no worktree materialized |
| `follow <path>…` | add files/dirs to the cared set, materialize them |
| `follow -r <dir>…` | add whole subtrees recursively |
| `follow -d <path>…` | remove paths from the cared set |
| `follow -l` | list cared files |
| `update` | fast-forward to origin tip (commits only, blobs on demand) |
| `ls [<ref>|<path>|<branch>:<path>]` | list the tree without materializing blobs |
| `branch` | list local + remote branches |
| `lock <path>` / `lock -d <path>` / `locks` | lock a file / unlock / list locks |
| anything else | passed straight through to stock git (push, status, log, …) |

Full semantics and edge cases: [references/commands.md](references/commands.md).

## Implementation

Run commands through the interpreter, never by bare path:

```bash
python3 scripts/blackgitcli.py <command> [<args>…]
# or the bundled wrapper:
bash scripts/blackgit <command> [<args>…]
```

### Typical workflow

```bash
python3 scripts/blackgitcli.py clone https://github.com/org/game-repo.git
cd game-repo
python3 scripts/blackgitcli.py follow -r src/engine assets/levels/level1
python3 scripts/blackgitcli.py update
python3 scripts/blackgitcli.py ls origin/main:assets
python3 scripts/blackgitcli.py lock assets/levels/level1/map.bin
```

Key semantics:

- The cared-file set lives in `.git/blackw-add.tsv` — purely a client-side view, independent of server-side authorization.
- `update` is fast-forward only; a diverged or dirty worktree falls back to plain `git pull`.
- `lock` is enforced only against a BlackGit server; against a plain GitHub/GitLab it records the lock locally and the server rejects nothing.

## Common Mistakes

- Running bare `scripts/blackgit` — always `bash scripts/blackgit` or `python3 scripts/blackgitcli.py`
- Putting credentials in the URL — use git's credential helper instead
- Expecting `update` to merge — it fast-forwards only
- Using `follow -r` on a giant directory when only a few files are needed (defeats the purpose)
- Forgetting git ≥ 2.54 is required for partial clone (`blob:none`)
