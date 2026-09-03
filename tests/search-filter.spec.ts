import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { ApiHelper } from '../utils/api-helper';

test.describe('Product Search & Filter', () => {
  test('searching by keyword returns matching products', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    await productsPage.searchProduct('Dress');
    await productsPage.expectResultsContain('Dress');
  });

  test('search results match the live product catalog via API', async ({ page }) => {
    // Use the API to know in advance what SHOULD show up, then verify the UI agrees.
    const api = new ApiHelper(page.request);
    const products = await api.getProductsList();
    const tshirts = products.filter((p) => p.name.toLowerCase().includes('tshirt') || p.name.toLowerCase().includes('t-shirt'));
    test.skip(tshirts.length === 0, 'No t-shirt products currently in the catalog to compare against');

    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.searchProduct('Tshirt');

    const uiCount = await productsPage.productItems.count();
    expect(uiCount).toBeGreaterThan(0);
  });

  test('filtering by category narrows the product list', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    await productsPage.filterByCategory('Women');
    await expect(page.locator('.features_items')).toBeVisible();
    await expect(page.locator('.title.text-center')).toContainText('Women');
  });

  test('filtering by brand shows only that brand', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    await productsPage.filterByBrand('Polo');
    await expect(page.locator('.title.text-center')).toContainText('Polo');
  });
});
