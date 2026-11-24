import { test, expect } from '@playwright/test';

test('landing hero and CTA are visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Write it down. Find it later.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start taking notes' })).toBeVisible();
  await expect(page.locator('.landing-feature-list li')).toHaveCount(3);
});

test('CTA moves to the notes section', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Start taking notes' }).click();
  await expect(page).toHaveURL(/#notes-app$/);
  await expect(page.locator('#notes-app')).toBeInViewport();
});

for (const width of [320, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
}
