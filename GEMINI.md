# BlackGit for Gemini

This extension installs the BlackGit skill.

The skill lives at `skills/blackgit/SKILL.md`. When a task involves large
monorepos, partial clone / sparse-checkout workflows, or BlackGit commands
(`clone`, `follow`, `update`, `ls`, `branch`, `lock`, `locks`), read
`skills/blackgit/SKILL.md` and follow its instructions.

- Bundled CLI: `skills/blackgit/scripts/blackgitcli.py` — run through the
  interpreter: `python3 skills/blackgit/scripts/blackgitcli.py <command>`
- Detail reference: `skills/blackgit/references/commands.md`
- Requirements: git ≥ 2.54, python3 (stdlib only)
