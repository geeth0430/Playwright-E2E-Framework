import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for /products - listing, search, category/brand filters,
 * and "Add to cart" interactions.
 */
export class ProductsPage {
  readonly page: Page;

  readonly productsNavLink: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;
  readonly productItems: Locator;
  readonly productCards: Locator;
  readonly addToCartButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;
  readonly cartNavLink: Locator;

  readonly categoryPanel: Locator;
  readonly brandPanel: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productsNavLink = page.locator('a[href="/products"]');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.locator('h2.title.text-center');
    this.productItems = page.locator('.product-image-wrapper');
    this.productCards = page.locator('.productinfo');
    this.addToCartButtons = page.locator('a:has-text("Add to cart")');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
    this.viewCartLink = page.locator("a[href='/view_cart']");
    this.cartNavLink = page.locator('a[href="/view_cart"]').first();

    this.categoryPanel = page.locator('.left-sidebar .panel-group');
    this.brandPanel = page.locator('.brands_products');
  }

  async goto() {
    await this.page.goto('/products');
    await expect(this.page.locator('.features_items')).toBeVisible();
  }

  async searchProduct(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await expect(this.searchedProductsHeading).toBeVisible();
    await expect(this.searchedProductsHeading).toContainText('Searched Products');
  }

  async expectResultsContain(keyword: string) {
    const count = await this.productItems.count();
    expect(count).toBeGreaterThan(0);
    // Spot-check the first result's product name contains the keyword (case-insensitive)
    const firstName = await this.productCards.first().locator('p').innerText();
    expect(firstName.toLowerCase()).toContain(keyword.toLowerCase());
  }

  async filterByCategory(categoryLinkText: string) {
    await this.page.locator(`a:has-text("${categoryLinkText}")`).first().click();
  }

  async filterByBrand(brandName: string) {
    await this.brandPanel.locator(`a:has-text("${brandName}")`).click();
  }

  /** Hovers a product card by index and clicks "Add to cart", then dismisses the modal. */
  async addProductToCartByIndex(index: number) {
    const card = this.productItems.nth(index);
    await card.hover();
    await card.locator('a:has-text("Add to cart")').click();
    await expect(this.continueShoppingButton).toBeVisible();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async goToCartFromModal() {
    await this.page.locator('a:has-text("View Cart")').click();
  }
}
