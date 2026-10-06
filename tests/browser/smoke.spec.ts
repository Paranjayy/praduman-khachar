import { expect, test } from "@playwright/test";

const errorsByPage = new WeakMap<object, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  errorsByPage.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});

test.afterEach(async ({ page }) => {
  expect(errorsByPage.get(page)).toEqual([]);
  await expect(page.locator(".recovery-panel")).toHaveCount(0);
});

const routes = ["/", "/books", "/media", "/about", "/explore", "/press", "/labs",
  "/topics", "/reading", "/timeline", "/citations", "/map", "/lineage", "/stats", "/gallery",
  "/legal/privacy", "/legal/terms", "/articles", "/writings"];

for (const route of routes) {
  test(`archive route ${route} renders`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.ok()).toBe(true);
    if (route === "/stats") {
      await expect(page.getByRole("heading", { name: "Local Debug View" })).toBeVisible();
    } else {
      await expect(page.locator("h1").first()).toBeVisible();
    }
    await expect(page.locator("nav").first()).toBeVisible();
    // Data widgets get time to mount; don't require third-party services to be idle.
    await page.waitForTimeout(750);
  });
}

test("contact draft renders and validates without sending a message", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByLabel("Your Name", { exact: false }).fill("Smoke test");
  await page.getByLabel("Email Address", { exact: false }).fill("smoke@example.com");
  await page.getByLabel("Message", { exact: false }).fill("Archive inquiry");
  await expect(page.locator(".contact-form button[type=submit]")).toBeEnabled();
  // Exercise the limit without following mailto links or submitting anything.
  await page.getByLabel("Message", { exact: false }).fill("x".repeat(5001));
  await expect(page.getByLabel("Message", { exact: false })).toHaveValue("Archive inquiry");
});

test("search survives malformed saved data", async ({ page }) => {
  await page.addInitScript(() => {
    if (window.top === window) localStorage.setItem("pk-bookmarks", "null");
  });
  await page.goto("/books");
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
  await page.getByRole("button", { name: /Saved/ }).click();
  await expect(page.getByText("No saved items yet")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Command palette" })).toHaveCount(0);
});

test("a book detail can be opened directly", async ({ page }) => {
  await page.goto("/books/kathi-itihas-ane-sanskriti");
  await expect(page.locator("h1").first()).toBeVisible();
});
