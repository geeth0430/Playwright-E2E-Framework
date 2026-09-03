import { Page, Locator, expect } from '@playwright/test';

/** Page Object for /view_cart */
export class CartPage {
  readonly page: Page;

  readonly cartRows: Locator;
  readonly cartProductNames: Locator;
  readonly cartQuantities: Locator;
  readonly cartPrices: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.cartProductNames = page.locator('.cart_description h4 a');
    this.cartQuantities = page.locator('.cart_quantity button');
    this.cartPrices = page.locator('.cart_price p');
    this.proceedToCheckoutButton = page.locator('a:has-text("Proceed To Checkout")');
    this.emptyCartMessage = page.locator('#empty_cart');
  }

  async goto() {
    await this.page.goto('/view_cart');
  }

  async expectItemCount(count: number) {
    await expect(this.cartRows).toHaveCount(count);
  }

  async expectProductInCart(productName: string) {
    await expect(this.cartProductNames.filter({ hasText: productName })).toBeVisible();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }
}
