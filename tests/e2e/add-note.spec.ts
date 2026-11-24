import { expect, test } from "@playwright/test";

test("adds a note with title and details through the form", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Title").fill("Buy milk");
  await page.getByLabel("Details").fill("2 litres, semi-skimmed");
  await page.getByRole("button", { name: "Add" }).click();
  const rows = page.locator(".notes-table tbody tr");
  await expect(rows.locator(".note-title")).toHaveText(["Welcome to Notes", "Buy milk"]);
  await expect(rows.locator(".note-body").nth(1)).toHaveText("2 litres, semi-skimmed");
  await expect(page.getByLabel("Title")).toHaveValue("");
  await expect(page.getByLabel("Details")).toHaveValue("");
  await expect(page.getByTestId("note-count")).toHaveText("2 notes");
});

test("shows an inline error and adds nothing for an empty title", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Title").fill("   ");
  await page.getByLabel("Details").fill("orphan details");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByTestId("note-error")).toHaveText("Title must not be empty");
  await expect(page.getByTestId("note-count")).toHaveText("1 note");
  await page.getByLabel("Title").fill("ok");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByTestId("note-error")).toBeHidden();
});
