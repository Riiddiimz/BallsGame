import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

test("site loads and core combat controls work without browser errors", { timeout: 60000 }, async () => {
  const port = 4174;
  const server = spawn(process.execPath, ["server.mjs"], {
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let serverOutput = "";
  server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
  server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });
  let browser;
  try {
    let ready = false;
    for (let attempt = 0; attempt < 50; attempt++) {
      if (server.exitCode !== null) throw new Error(`Server exited early: ${serverOutput}`);
      try {
        const response = await fetch(`http://127.0.0.1:${port}/`);
        if (response.ok) { ready = true; break; }
      } catch {}
      await delay(100);
    }
    assert.equal(ready, true, `Server did not become ready: ${serverOutput}`);

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().includes("fonts.google")) errors.push(message.text());
    });

    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "domcontentloaded" });
    assert.match(await page.title(), /BallsGame/);
    assert.equal(await page.locator("#map-select option").count(), 3);
    assert.equal(await page.locator("#stat-alive").textContent(), "04");

    await page.locator("#start").click();
    await page.waitForFunction(() => document.querySelector("#status")?.textContent === "COMBAT EN COURS");
    await delay(250);
    await page.locator("#start").click();
    assert.equal(await page.locator("#status").textContent(), "PAUSE");

    await page.locator("#map-select").selectOption("orbit");
    assert.equal(await page.locator("#timer").textContent(), "00:00");
    await page.locator("#ball-count").evaluate((el) => {
      el.value = "6";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    assert.equal(await page.locator("#stat-alive").textContent(), "06");

    await page.locator("#random-seed").click();
    assert.match(await page.locator("#seed-display").textContent(), /^SEED: BG-/);

    await page.locator("#record").click();
    await page.waitForFunction(() => document.querySelector("#status")?.textContent.includes("ENREGISTREMENT"));
    assert.equal(await page.locator("#stat-state").textContent(), "RUNNING");
    await page.locator("#record").click();
    await page.waitForFunction(() => document.querySelector("#record")?.textContent.includes("Enregistrer WebM"), { timeout: 5000 });
    assert.deepEqual(errors, [], `Browser errors: ${errors.join(" | ")}`);
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
});
