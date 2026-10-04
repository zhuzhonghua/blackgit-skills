import os
from pathlib import Path


def register(ctx):
    """Register the blackgit skill with Hermes' native skill loader.

    Supports both install layouts:
    - git-clone install (`hermes plugins install zhuzhonghua/blackgit-skills`):
      this module resolves `../skills`.
    - flattened install (files copied to the plugin dir root): `skills/` sits
      next to this module.
    """
    here = os.path.dirname(os.path.realpath(__file__))
    candidates = (
        os.path.realpath(os.path.join(here, "..", "skills", "blackgit", "SKILL.md")),
        os.path.realpath(os.path.join(here, "skills", "blackgit", "SKILL.md")),
    )
    skill_md = next((c for c in candidates if os.path.isfile(c)), None)
    if skill_md is None:
        raise RuntimeError(
            "blackgit plugin: cannot find skills/blackgit/SKILL.md "
            f"(looked at {candidates}). Reinstall with "
            "`hermes plugins install zhuzhonghua/blackgit-skills`."
        )

    # register_skill requires a pathlib.Path — a str raises AttributeError and
    # hermes silently disables the whole plugin.
    ctx.register_skill("blackgit", Path(skill_md))
