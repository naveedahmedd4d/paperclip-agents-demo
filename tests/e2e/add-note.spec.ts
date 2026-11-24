import { expect, test, type Page } from "@playwright/test";

async function openDialog(page: Page) {
  await page.getByRole("button", { name: "Add Note", exact: true }).click();
}

test("adds a note with title and details through the form", async ({ page }) => {
  await page.goto("/");
  await openDialog(page);
  await page.getByLabel("Title").fill("Buy milk");
  await page.getByLabel("Details").fill("2 litres, semi-skimmed");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  const rows = page.locator(".notes-table tbody tr");
  await expect(rows.locator(".note-title")).toHaveText(["Welcome to Notes", "Buy milk"]);
  await expect(rows.locator(".note-body").nth(1)).toHaveText("2 litres, semi-skimmed");
  await expect(page.locator("#note-dialog")).toBeHidden();
  await expect(page.getByTestId("note-count")).toHaveText("2 notes");
});

test("shows an inline error and adds nothing for an empty title", async ({ page }) => {
  await page.goto("/");
  await openDialog(page);
  await page.getByLabel("Title").fill("   ");
  await page.getByLabel("Details").fill("orphan details");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByTestId("note-error")).toHaveText("Title must not be empty");
  await expect(page.getByTestId("note-count")).toHaveText("1 note");
  await page.getByLabel("Title").fill("ok");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByTestId("note-error")).toBeHidden();
});

test("form is hidden on load and opens with focus in Title", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#note-dialog")).toBeHidden();
  await openDialog(page);
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByLabel("Title")).toBeFocused();
});

test("Cancel and Esc close the popup without adding and reset it", async ({ page }) => {
  await page.goto("/");
  await openDialog(page);
  await page.getByLabel("Title").fill("   ");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByTestId("note-error")).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.locator("#note-dialog")).toBeHidden();
  await openDialog(page);
  await expect(page.getByTestId("note-error")).toBeHidden();
  await page.getByLabel("Title").fill("discard me");
  await page.keyboard.press("Escape");
  await expect(page.locator("#note-dialog")).toBeHidden();
  await expect(page.getByTestId("note-count")).toHaveText("1 note");
  await openDialog(page);
  await expect(page.getByLabel("Title")).toHaveValue("");
});

test("header shows brand left and Add Note right at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  const brand = await page.locator(".app-brand").boundingBox();
  const btn = await page.getByRole("button", { name: "Add Note", exact: true }).boundingBox();
  expect(brand!.x).toBeLessThan(btn!.x);
  expect(btn!.x + btn!.width).toBeLessThanOrEqual(320);
});
