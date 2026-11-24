import { expect, test } from "@playwright/test";

test("adds a note through the form", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("New note").fill("Buy milk");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByRole("list", { name: "Notes" }).locator(".note-text")).toHaveText(["Welcome to Notes", "Buy milk"]);
  await expect(page.getByLabel("New note")).toHaveValue("");
  await expect(page.getByTestId("note-count")).toHaveText("2 notes");
});

test("shows an inline error and adds nothing for empty input", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("New note").fill("   ");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByTestId("note-error")).toHaveText("Note text must not be empty");
  await expect(page.getByTestId("note-count")).toHaveText("1 note");
  await page.getByLabel("New note").fill("ok");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByTestId("note-error")).toBeHidden();
});
