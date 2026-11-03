import { test, expect } from "@playwright/test";
const snapshot = (p) => p.evaluate(() => window.__gameSnapshot());
async function start(page) {
  await page.goto("./");
  await page.locator("#start").click();
  await expect.poll(async () => (await snapshot(page)).mode).toBe("play");
}
async function advance(page, x) {
  if ((await snapshot(page)).player.x >= x) return;
  await page.keyboard.down("d");
  for (let i = 0; i < 160; i++) {
    const s = await snapshot(page);
    if (s.player.x >= x) break;
    if (s.player.ground && s.player.x > 470 && s.player.x < 870)
      await page.keyboard.press("Space");
    await page.waitForTimeout(90);
  }
  await page.keyboard.up("d");
  expect((await snapshot(page)).player.x).toBeGreaterThanOrEqual(x - 5);
}
async function clearFence(page) {
  await advance(page, 900);
  await expect
    .poll(async () => (await snapshot(page)).target)
    .toBe("barricade");
  await page.keyboard.press("k");
  await expect
    .poll(async () => (await snapshot(page)).barricadeHP, { timeout: 10000 })
    .toBe(0);
}
async function approachGuard(page) {
  await clearFence(page);
  await advance(page, 2087);
  await expect.poll(async () => (await snapshot(page)).target).toBe("guard");
}

test("parcours complet, bouclier, rappel immédiat, victoire et redémarrage", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const failed = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(r.url());
  });
  await page.goto("./");
  await page.screenshot({ path: "test-results/titre.png" });
  await page.locator("#start").click();
  await approachGuard(page);
  await page.keyboard.press("j");
  await expect
    .poll(async () => (await snapshot(page)).stats.blocks)
    .toBeGreaterThan(0);
  expect((await snapshot(page)).guard.hp).toBe(10);
  await page.screenshot({ path: "test-results/garde.png" });
  // Execute real input over several shield/telegraph cycles; no state injection.
  let recalled = false;
  for (let cycle = 0; cycle < 7; cycle++) {
    let s = await snapshot(page);
    if (s.guard.hp <= 0) break;
    if (s.guard.state === "windup" || s.guard.state === "smash")
      await page.waitForTimeout(2400);
    await advance(page, 2087);
    await page.keyboard.press("k");
    await expect
      .poll(async () => (await snapshot(page)).guard.state, { timeout: 5000 })
      .toBe("pinned");
    for (let n = 0; n < 4; n++) {
      await page.keyboard.press("j");
      await page.waitForTimeout(420);
      if ((await snapshot(page)).guard.hp <= 0) break;
    }
    s = await snapshot(page);
    if (s.guard.hp <= 0) break;
    await expect
      .poll(async () => (await snapshot(page)).guard.state, { timeout: 4000 })
      .toBe("windup");
    await page.keyboard.press("l");
    await page.waitForTimeout(50);
    expect(
      (await snapshot(page)).imps.every(
        (m) => m.mode !== "attached" && m.mode !== "guard",
      ),
    ).toBeTruthy();
    recalled = true;
    await page.keyboard.down("q");
    await page.waitForTimeout(700);
    await page.keyboard.up("q");
    await page.waitForTimeout(2500);
    expect((await snapshot(page)).imps.filter((m) => m.alive)).toHaveLength(3);
  }
  await expect
    .poll(async () => (await snapshot(page)).mode, { timeout: 5000 })
    .toBe("victory");
  expect(recalled).toBeTruthy();
  await expect(page.locator("#result-title")).toHaveText(
    "Le bail est renouvelé.",
  );
  await page.screenshot({ path: "test-results/victoire.png" });
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
  await page.locator("#result .restart").click();
  await expect.poll(async () => (await snapshot(page)).mode).toBe("play");
  expect((await snapshot(page)).barricadeHP).toBe(12);
  expect((await snapshot(page)).player.hp).toBe(5);
  expect((await snapshot(page)).imps.every((m) => m.alive)).toBeTruthy();
});

test("écrasement fatal des larbins, défaite claire et nouvelle partie", async ({
  page,
}) => {
  await start(page);
  await approachGuard(page);
  await page.keyboard.press("k");
  await expect
    .poll(async () => (await snapshot(page)).guard.state, { timeout: 5000 })
    .toBe("pinned");
  await expect
    .poll(async () => (await snapshot(page)).mode, { timeout: 8000 })
    .toBe("defeat");
  await expect(page.locator("#result-title")).toHaveText(
    "Retour à la case cachot.",
  );
  await page.locator("#result .restart").click();
  await expect.poll(async () => (await snapshot(page)).mode).toBe("play");
  expect((await snapshot(page)).imps.filter((m) => m.alive)).toHaveLength(3);
});

test("pause et reprise sans déplacement résiduel", async ({ page }) => {
  await start(page);
  await page.keyboard.press("Escape");
  await expect.poll(async () => (await snapshot(page)).mode).toBe("pause");
  const x = (await snapshot(page)).player.x;
  await page.keyboard.down("d");
  await page.waitForTimeout(200);
  expect((await snapshot(page)).player.x).toBe(x);
  await page.keyboard.up("d");
  await page.locator("#resume").click();
  await expect.poll(async () => (await snapshot(page)).mode).toBe("play");
});

test("Android paysage : multitouch courir+sauter, commandes et rotation", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 851, height: 393 },
    deviceScaleFactor: 2.75,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/Overlord-2d/");
  await page.locator("#start").tap();
  await expect(page.locator("#touch")).toBeVisible();
  const cdp = await context.newCDPSession(page);
  const point = async (sel, id) => {
    const r = await page.locator(sel).boundingBox();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, id };
  };
  const right = await point('[data-control="right"]', 1),
    jump = await point('[data-control="jump"]', 2);
  const initial = await snapshot(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [right],
  });
  await page.waitForTimeout(150);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [right, jump],
  });
  await page.waitForTimeout(200);
  const airborne = await snapshot(page);
  expect(airborne.player.x).toBeGreaterThan(initial.player.x + 25);
  expect(airborne.player.y).toBeLessThan(390);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await page.waitForTimeout(500);
  const stopped = (await snapshot(page)).player.x;
  await page.waitForTimeout(200);
  expect((await snapshot(page)).player.x).toBe(stopped);
  for (const button of await page.locator("[data-control]").all()) {
    const box = await button.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.y + box.height).toBeLessThanOrEqual(393);
  }
  await page.screenshot({ path: "test-results/android-paysage.png" });
  await page.setViewportSize({ width: 393, height: 851 });
  await expect(page.locator("#rotate")).toBeVisible();
  await context.close();
});

test("rappel pendant la démolition : arrêt immédiat puis nouvel ordre", async ({
  page,
}) => {
  await start(page);
  await advance(page, 900);
  await page.keyboard.press("k");
  await expect
    .poll(async () => (await snapshot(page)).barricadeHP, {
      timeout: 6000,
      intervals: [50],
    })
    .toBeLessThan(12);
  await page.keyboard.press("l");
  await expect.poll(async () => (await snapshot(page)).stats.recalls).toBe(1);
  const hp = (await snapshot(page)).barricadeHP;
  expect(hp).toBeGreaterThan(0);
  await page.waitForTimeout(650);
  expect((await snapshot(page)).barricadeHP).toBe(hp);
  await page.keyboard.press("k");
  await expect
    .poll(async () => (await snapshot(page)).barricadeHP, { timeout: 6000 })
    .toBe(0);
});
