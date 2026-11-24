import { expect, test } from "@playwright/test";

test("search filters the visible list case-insensitively", async ({ page }) => {
  await page.goto("/");
  const items = page.locator("#note-list li");
  const search = page.locator("#search");
  await search.fill("WELCOME");
  await expect(items).toHaveText(["Welcome to Notes"]);
  await search.fill("zzz");
  await expect(items).toHaveCount(0);
  await expect(page.getByTestId("note-count")).toHaveText("1 note");
  await search.fill("");
  await expect(items).toHaveCount(1);
});
