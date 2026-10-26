import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Vercel deploys the browser app as static files without a Node build", async () => {
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.equal(config.framework, null, "framework must be explicitly set to Other");
  assert.equal(config.outputDirectory, ".", "the static app lives at the repository root");
  assert.equal(config.buildCommand, null, "no build step is required");
  assert.equal(config.installCommand, null, "no install step is required");
});

test("Vercel upload excludes development-only files but keeps browser sources", async () => {
  const ignore = await readFile(new URL("../.vercelignore", import.meta.url), "utf8");
  for (const entry of [".github/", "tests/", "node_modules/", "server.mjs", "package.json", "STATE.md"]) {
    assert.ok(ignore.split(/\r?\n/).includes(entry), `expected .vercelignore to exclude ${entry}`);
  }
  assert.ok(!ignore.split(/\r?\n/).includes("src/"), "browser source files must remain deployable");
});
