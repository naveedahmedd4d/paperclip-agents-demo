import { expect, test } from "@playwright/test";

test("shows when each note was created", async ({ page }) => {
  await page.goto("/");
  const item = page.getByRole("list", { name: "Notes" }).getByRole("listitem");
  await expect(item.locator(".note-text")).toHaveText("Welcome to Notes");
  await expect(item.locator("time")).toHaveText("just now");
});
