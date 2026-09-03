import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object covering the checkout review (/checkout) and the
 * payment step (/payment) that follows placing an order.
 */
export class CheckoutPage {
  readonly page: Page;

  // /checkout
  readonly addressDeliveryBlock: Locator;
  readonly reviewOrderTable: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderLink: Locator;

  // /payment
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payAndConfirmButton: Locator;

  // /payment_done confirmation
  readonly orderConfirmationHeading: Locator;
  readonly orderConfirmationText: Locator;

  constructor(page: Page) {
    this.page = page;

    this.addressDeliveryBlock = page.locator('#address_delivery');
    this.reviewOrderTable = page.locator('#cart_info');
    this.commentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderLink = page.locator('a:has-text("Place Order")');

    this.nameOnCardInput = page.locator('input[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('input[data-qa="card-number"]');
    this.cvcInput = page.locator('input[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('input[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('input[data-qa="expiry-year"]');
    this.payAndConfirmButton = page.locator('button[data-qa="pay-button"]');

    this.orderConfirmationHeading = page.locator('h2[data-qa="order-placed"]');
    this.orderConfirmationText = page.locator('.orderc h2');
  }

  async addOrderComment(comment: string) {
    await this.commentTextarea.fill(comment);
  }

  async placeOrder() {
    await this.placeOrderLink.click();
  }

  async payWithCard(card: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }) {
    await this.nameOnCardInput.fill(card.nameOnCard);
    await this.cardNumberInput.fill(card.cardNumber);
    await this.cvcInput.fill(card.cvc);
    await this.expiryMonthInput.fill(card.expiryMonth);
    await this.expiryYearInput.fill(card.expiryYear);
    await this.payAndConfirmButton.click();
  }

  async expectOrderConfirmed() {
    await expect(this.orderConfirmationHeading).toBeVisible();
    await expect(this.orderConfirmationHeading).toContainText('Order Placed!');
  }
}
