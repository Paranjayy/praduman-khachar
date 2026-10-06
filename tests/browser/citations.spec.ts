import { expect, test, type Download } from "@playwright/test";

async function contents(download: Download) {
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream!) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

test.beforeEach(async ({ page }) => {
  test.skip(!!process.env.PLAYWRIGHT_BASE_URL, "Citation feature checks run on candidate builds.");
  await page.goto("/citations");
});

test("bibliography and single-book RIS downloads contain complete records", async ({ page }) => {
  const count = await page.locator(".citation-card").count();
  const allDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download bibliography (.ris)", exact: true }).click();
  const all = await allDownload;
  expect(all.suggestedFilename()).toBe("khachar-bibliography.ris");
  const exported = await contents(all);
  expect(exported.match(/^TY  - BOOK$/gm)).toHaveLength(count);
  expect(exported.match(/^ER  - /gm)).toHaveLength(count);
  expect(exported).toContain("UR  - https://www.praduman.com/books/");

  const card = page.locator(".citation-card").first();
  const title = await card.locator(".citation-title").innerText();
  const singleDownload = page.waitForEvent("download");
  const button = card.getByRole("button", { name: `Download RIS for ${title}`, exact: true });
  await button.focus();
  await page.keyboard.press("Enter");
  const single = await contents(await singleDownload);
  expect(single.match(/^TY  - BOOK$/gm)).toHaveLength(1);
  expect(single).toContain(`TI  - ${title}`);
  await expect(page.locator(".recovery-panel")).toHaveCount(0);
});

test("a book detail downloads its citation rather than opening print", async ({ page }) => {
  await page.goto("/books/kathi-itihas-ane-sanskriti");
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download citation (.ris)", exact: true }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe("kathi-itihas-ane-sanskriti.ris");
  expect(await contents(download)).toContain("UR  - https://www.praduman.com/books/kathi-itihas-ane-sanskriti");
});

test("clipboard success and denial produce honest accessible feedback", async ({ page }) => {
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", {
    configurable: true, value: { writeText: async () => {} },
  }));
  const card = page.locator(".citation-card").first();
  const copy = card.getByRole("button", { name: /^Copy APA citation/ });
  await copy.click();
  await expect(page.getByRole("status").filter({ hasText: "Citation copied." })).toBeVisible();
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", {
    configurable: true, value: { writeText: async () => { throw new Error("Permission denied"); } },
  }));
  await copy.click();
  await expect(page.getByRole("status").filter({ hasText: "Could not copy." })).toBeVisible();
  await expect(copy.locator(".lucide-circle-check")).toHaveCount(0);
  const download = page.waitForEvent("download");
  await card.getByRole("button", { name: /^Download RIS for/ }).click();
  expect((await download).suggestedFilename()).toMatch(/\.ris$/);
});
