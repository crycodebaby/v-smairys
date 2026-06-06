/**
 * Removes the Next.js build cache (.next) safely.
 * Cross-platform (Node fs.rmSync). Retries help on Windows file locks.
 */
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const nextDir = resolve(root, ".next");

if (!existsSync(nextDir)) {
  console.log("[clean:next] .next not present — nothing to remove.");
  process.exit(0);
}

try {
  rmSync(nextDir, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 300,
  });
  console.log("[clean:next] Removed .next");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    "[clean:next] Failed to remove .next. Stop `next dev` / `next build` first, then retry.\n",
    message
  );
  process.exit(1);
}
