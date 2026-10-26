import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { get } from "node:http";
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
        const status = await new Promise((resolve) => {
          const request = get(`http://127.0.0.1:${port}/`, (response) => {
            response.resume();
            resolve(response.statusCode);
          });
          request.on("error", () => resolve(0));
        });
        if (status === 200) { ready = true; break; }
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
    assert.equal(await page.locator("#map-select option").count(), 4);
    assert.equal(await page.locator("#stat-alive").textContent(), "04");

    await page.locator("#start").click();
    await page.waitForFunction(() => document.querySelector("#status")?.textContent === "COMBAT EN COURS");
    await delay(250);
    await page.locator("#start").click();
    assert.equal(await page.locator("#status").textContent(), "PAUSE");

    await page.locator("#map-select").selectOption("magma");
    assert.equal(await page.locator("#timer").textContent(), "00:00");
    await page.locator("#map-select").selectOption("orbit");
    assert.equal(await page.locator("#timer").textContent(), "00:00");
    await page.locator("#obstacle-count").evaluate((el) => {
      el.value = "0";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    assert.equal(await page.locator("#obstacle-count-value").textContent(), "0");
    await page.locator("#ball-count").evaluate((el) => {
      el.value = "6";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    assert.equal(await page.locator("#stat-alive").textContent(), "06");

    await page.locator("#random-seed").click();
    assert.match(await page.locator("#seed-display").textContent(), /^SEED: BG-/);
    await page.locator("#powers-enabled").uncheck();
    assert.equal(await page.locator("#powers-enabled").isChecked(), false);
    await page.locator("#powers-enabled").check();
    assert.equal(await page.locator("#powers-enabled").isChecked(), true);

    await page.locator("#record").click();
    await page.waitForFunction(() => document.querySelector("#status")?.textContent.includes("ENREGISTREMENT"));
    assert.equal(await page.locator("#stat-state").textContent(), "RUNNING");
    const downloadPromise = page.waitForEvent("download", { timeout: 10000 });
    await page.locator("#record").click();
    assert.equal(await page.locator("#record").isDisabled(), true, "record button should be locked while the video finalizes");
    await page.waitForFunction(() => document.querySelector("#record")?.textContent.includes("Enregistrer vidéo"), { timeout: 5000 });
    assert.equal(await page.locator("#record").isDisabled(), false, "record button should be re-enabled after export");
    const videoDownload = await downloadPromise;
    assert.match(videoDownload.suggestedFilename(), /\.(mp4|webm)$/i);

    await page.setViewportSize({ width: 390, height: 844 });
    const arenaBox = await page.locator("#arena-frame").boundingBox();
    assert.ok(arenaBox, "arena frame should remain visible on mobile");
    assert.ok(Math.abs(arenaBox.width / arenaBox.height - 9 / 16) < 0.03, "arena keeps a vertical 9:16 ratio");
    assert.deepEqual(errors, [], `Browser errors: ${errors.join(" | ")}`);
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
});
