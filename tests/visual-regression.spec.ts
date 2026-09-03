import { test, expect } from '@playwright/test';

/**
 * Visual regression check for the homepage.
 *
 * First run: `npx playwright test visual-regression --update-snapshots`
 * to generate the baseline images (stored under tests/visual-regression.spec.ts-snapshots/).
 * Commit the baselines to the repo; every subsequent run diffs against them.
 */
test.describe('Visual Regression', () => {
  test('homepage hero/nav layout matches the baseline snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.features_items, #slider')).toBeVisible();

    // Mask elements that legitimately change between runs (ads, carousels, etc.)
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: false,
      mask: [page.locator('#slider-carousel')],
    });
  });

  test('products page grid matches the baseline snapshot', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('.features_items')).toBeVisible();

    await expect(page.locator('.features_items')).toHaveScreenshot('products-grid.png');
  });
});
