import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const extensionDir = dirname(fileURLToPath(import.meta.url));
const skillsDir = resolve(extensionDir, "../..", "skills");

export default function blackgitPiExtension(pi: ExtensionAPI) {
	// Register the whole skills/ tree with Pi's native skill discovery.
	pi.on("resources_discover", async () => ({
		skillPaths: [skillsDir],
	}));
}
