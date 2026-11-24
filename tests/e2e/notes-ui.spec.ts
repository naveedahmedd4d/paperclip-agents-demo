import { expect, test, type Page } from "@playwright/test";

// Until the ADR-0008 markup is on main, inject a fixture of the class contract.
async function ensureNotesMarkup(page: Page) {
  await page.goto("/");
  if (await page.locator("#notes-app").count()) return;
  await page.evaluate(() => {
    const rows = Array.from({ length: 4 }, (_, i) =>
      `<tr><td class="note-title">Averyveryveryverylongunbrokentitle${"x".repeat(40)} ${i}</td>
       <td class="note-body">${"Some details ".repeat(8)}</td>
       <td class="note-time">2 minutes ago</td>
       <td class="note-actions"><button type="button">Delete</button></td></tr>`).join("");
    document.body.insertAdjacentHTML("beforeend", `<section id="notes-app">
      <form class="notes-form"><div><label for="t">Title</label><input id="t"></div>
      <div><label for="d">Details</label><input id="d"></div>
      <button type="submit">Add</button><p role="alert">Title must not be empty</p></form>
      <table class="notes-table"><thead><tr><th>Title</th><th>Details</th><th>Created</th><th>Actions</th></tr></thead>
      <tbody>${rows}</tbody></table></section>`);
  });
}

for (const width of [320, 1024]) {
  test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await ensureNotesMarkup(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("table styling applies the accent header and sticky position", async ({ page }) => {
  await ensureNotesMarkup(page);
  const th = page.locator(".notes-table thead th").first();
  await expect(th).toHaveCSS("position", "sticky");
  await expect(th).toHaveCSS("border-bottom-color", "rgb(140, 158, 255)");
});
