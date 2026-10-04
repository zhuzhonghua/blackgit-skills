# BlackGit CLI Command Reference

Reference for the bundled `blackgitcli.py` (the `git black` command). Keep this file as the authoritative detail source; `SKILL.md` holds the quick view.

## Prerequisites & environment

- **python3** — the CLI uses stdlib only (`subprocess`, `sys`, `os`); no third-party packages.
- **git ≥ 2.54** — required for partial clone (`blob:none` filter).
- **Authentication** — left entirely to git's standard HTTP layer: credential helper, macOS keychain, or `git config http.extraHeader`. BlackGit never parses user info out of the URL, and you should never embed credentials in a URL.
- The `agent` subcommand (natural-language REPL, `blackgitagent.py`) is intentionally **not** bundled in this skill; use the subcommands below directly.

## Invocation

```bash
python3 scripts/blackgitcli.py <command> [<args>…]   # canonical
bash scripts/blackgit <command> [<args>…]            # wrapper (same thing)
```

Run inside a blackgit-cloned repo for all commands except `clone` and `help`.

## Commands

### `clone <url> [<dir>]`

Bootstrap a blackgit repo from any git smart-HTTP remote (GitHub, GitLab, BlackGit server).

1. `git init`, set `origin` to `<url>`
2. Configure partial clone (`blob:none`) and `fetch --depth=1`
3. Point HEAD at the remote tip **without** materializing a worktree
4. Arm an empty sparse-checkout (`!/* !/*/*`) — nothing is checked out yet

After cloning, the worktree is empty until you `follow` paths.

### `follow <path>…`

Add one or more repo-relative paths (files or directories) to your **cared set**, materializing exactly those blobs via sparse-checkout.

- `follow -r|--recursive <dir>…` — add a whole subtree recursively
- `follow -d <path>…` — remove paths from the cared set (and the worktree view)
- `follow -l|--list` — list currently cared files

The cared set is stored in `.git/blackw-add.tsv` inside the repo's gitdir. It is a **purely client-side view** (what lands in your worktree) and is independent of server-side blob authorization, which is the actual security boundary.

Use whitelist semantics: files added on the server later never leak into your view unless you `follow` them.

### `update`

Fast-forward the current branch to the origin tip.

- Fetches commits with `--filter=tree:0` (commits only; trees/blobs fetched on demand)
- Moves the branch and re-applies the cared-file view
- If the branch has diverged or the worktree is dirty, falls back to a standard `git pull`

`update` never merges. Use `pull` (passthrough) when you need merge semantics.

### `ls [<ref>|<path>|<branch>:<path>]`

List the tree contents **without materializing blobs**.

- `ls` — list the current branch's root
- `ls <ref>` — list a ref's root (e.g. `origin/main`)
- `ls <path>` — list a path in the current branch
- `ls <branch>:<path>` — list a path in a specific branch

Against a BlackGit server, paths the caller cannot download are filtered out on the wire (server-side `blackw-authz` blob allowlist).

### `branch`

List local + remote branches, with the current branch marked.

### `lock <path>` / `lock -d <path>` / `locks`

Server-side file locks (requires the BlackGit server's write layer):

- `lock <path>` — lock a file; subsequent pushes touching that file are rejected unless they come from the locker
- `lock -d <path>` — unlock
- `locks` — list locked files
- Locking an already-locked file returns the current locker's identity

Against a plain GitHub/GitLab remote (no BlackGit server) the lock is recorded client-side but **not enforced** — the server rejects nothing.

### Anything else (passthrough)

Every command `blackgit` does not override — `push`, `status`, `log`, `add`, `commit`, `pull`, … — is handed straight to stock git with arguments unchanged (`execvp`), so stdin/stdout/stderr and exit codes pass through and interactive flows (password prompts, merge editor) keep working.

## Client view vs server authorization

| Layer | Scope | Where it lives |
|---|---|---|
| Client cared set | What lands in your worktree | `.git/blackw-add.tsv` (client-side) |
| Server blob allowlist | What blobs you may download | `blackw-authz` file (server-side, SVN authz format) |
| Server write rules | `canPush` check + file-lock enforcement | BlackGit server |

They are independent: following a path never grants server access, and server grants never auto-materialize files.

## Version provenance

`scripts/blackgitcli.py` is copied from the BlackGit project (`github.com/zhuzhonghua/blackgit`, `blackgitcli.py`). To update the bundled script, copy the latest version from that repository and re-run the verification steps.
