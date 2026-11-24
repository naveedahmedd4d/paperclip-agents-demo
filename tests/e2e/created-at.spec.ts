import { expect, test } from "@playwright/test";

test("shows when each note was created", async ({ page }) => {
  await page.goto("/");
  const row = page.locator(".notes-table tbody tr");
  await expect(row.locator(".note-title")).toHaveText("Welcome to Notes");
  await expect(row.locator("time.note-time")).toHaveText("just now");
});
