import { expect, test } from "@playwright/test";

test("saved tab retains arrow navigation and native Enter activation", async ({ page }) => {
  test.skip(!!process.env.PLAYWRIGHT_BASE_URL, "Candidate feature check.");
  await page.addInitScript(() => {
    if (window.top !== window) return;
    localStorage.setItem("pk-bookmarks", JSON.stringify([
      { id: "first-video", title: "First saved video", type: "video" },
      { id: "second-video", title: "Second saved video", type: "video" },
    ]));
  });
  await page.goto("/books");
  await page.keyboard.press("Control+k");
  const savedTab = page.getByRole("button", { name: /Saved/ });
  await savedTab.focus();
  await page.keyboard.press("Enter");
  await expect(savedTab).toBeFocused();
  await page.keyboard.press("ArrowDown");
  const second = page.getByRole("button", { name: /Second saved video/ });
  await expect(second).toHaveClass(/selected/);
  await expect(second).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(page.getByRole("button", { name: /First saved video/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/articles\/first-video$/);
});

test("video search can save an item and retain it after reload", async ({ page }) => {
  test.skip(!!process.env.PLAYWRIGHT_BASE_URL, "Candidate feature check.");
  const response = await page.request.get("/data/videos.json");
  const { videos } = await response.json();
  const video = videos.find((v: { id: string; title: string }) => v.id && v.title);
  await page.goto("/books");
  await page.keyboard.press("Control+k");
  await page.locator(".cmd-input").fill(video.title);
  await page.getByRole("button", { name: `Save ${video.title}`, exact: true }).click();
  await page.reload();
  await page.keyboard.press("Control+k");
  await page.getByRole("button", { name: /Saved/ }).click();
  await expect(page.getByRole("button", { name: new RegExp(video.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) })).toBeVisible();
});

test("saved video exports a portable canonical link", async ({ page }) => {
  test.skip(!!process.env.PLAYWRIGHT_BASE_URL, "Feature checks run on the candidate build, production probes stay read-only.");
  await page.addInitScript(() => {
    if (window.top !== window) return;
    localStorage.setItem("pk-bookmarks", JSON.stringify([
    { id: "archive-video", title: "સૌરાષ્ટ્રનો ઇતિહાસ", type: "video" },
    ]));
  });
  await page.goto("/books");
  await page.keyboard.press("Control+k");
  await page.getByRole("button", { name: /Saved/ }).click();
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export saved items" }).focus();
  await expect(page.getByRole("button", { name: "Export saved items" })).toBeFocused();
  await page.keyboard.press("Enter");
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe("khachar-saved-items.md");
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream!) chunks.push(chunk);
  expect(Buffer.concat(chunks).toString("utf8")).toContain("https://www.praduman.com/articles/archive-video");
});
