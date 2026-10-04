/**
 * BlackGit plugin for OpenCode.ai — dual-compatible with OpenCode V1 and V2.
 *
 * V1 (opencode): loaded via named export BlackGitPlugin — config hook
 * registers the skills path for discovery.
 *
 * V2 (opencode2): loaded via default export { id, setup } by
 * PluginSupervisor. setup() registers each skills/<name>/SKILL.md as a
 * native Skill.Info via ctx.skill.transform().
 *
 * No external dependencies — pure JavaScript works in both V1 and V2.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Skills directory shared by V1 (config hook) and V2 (setup/ctx.skill.transform)
const skillsDir = path.resolve(__dirname, '../../skills');

// Minimal frontmatter extraction (name/description only).
const extractFrontmatter = (content) => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };
  const frontmatter = {};
  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && !/^\s/.test(line)) {
      const key = line.slice(0, colonIdx).trim();
      frontmatter[key] = line.slice(colonIdx + 1).trim();
    }
  }
  return { frontmatter, content: match[2] };
};

/**
 * V1 Plugin Function (named export + default.server)
 */
export const BlackGitPlugin = async () => {
  return {
    // Inject the skills path into live config so OpenCode discovers blackgit
    // skills without manual symlinks or config file edits.
    config: async (config) => {
      // V2: skills is a flat array — skip, setup() handles V2 registration.
      if (Array.isArray(config.skills)) return;

      // V1: skills is { paths: [...] }
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    },
  };
};

/**
 * V2 Setup Function (default.setup)
 */
async function setup(ctx) {
  if (!ctx || !ctx.skill || typeof ctx.skill.transform !== 'function') {
    return; // V1 also invokes default.setup with a V1-shaped ctx; serve V1 via the named export
  }

  try {
    const skills = [];
    if (fs.existsSync(skillsDir)) {
      for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
        const skillPath = path.join(skillsDir, entry.name, 'SKILL.md');
        if (!fs.existsSync(skillPath)) continue;
        const { frontmatter, content } = extractFrontmatter(fs.readFileSync(skillPath, 'utf8'));
        skills.push({
          id: entry.name,
          name: frontmatter.name || entry.name,
          ...(frontmatter.description ? { description: frontmatter.description } : {}),
          path: skillPath,
          content,
        });
      }
    }
    await ctx.skill.transform((draft) => {
      for (const skill of skills) {
        try {
          draft.add(skill);
        } catch (err) {
          console.error(`[blackgit] skill "${skill.id}" rejected by host, skipping:`, err);
        }
      }
    });
  } catch (err) {
    console.error('[blackgit] skill registration failed:', err);
  }
}

/**
 * Default Export: { id, server, setup }
 */
export default {
  id: 'blackgit',
  server: BlackGitPlugin,
  setup,
};
