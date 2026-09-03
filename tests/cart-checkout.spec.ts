import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ApiHelper, generateTestUser } from '../utils/api-helper';

test.describe('Cart → Checkout → Order Confirmation', () => {
  test('add product to cart, check out, and confirm the order', async ({ page }) => {
    // --- API setup: create the account instantly instead of via the signup UI ---
    const api = new ApiHelper(page.request);
    const user = generateTestUser('checkout');
    await api.createAccount(user);

    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // --- UI: log in, browse, add to cart ---
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await loginPage.expectLoggedInAs(user.name);

    await productsPage.goto();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    await cartPage.expectItemCount(1);
    await cartPage.proceedToCheckout();

    // --- Checkout review ---
    await expect(checkoutPage.addressDeliveryBlock).toBeVisible();
    await expect(checkoutPage.reviewOrderTable).toBeVisible();
    await checkoutPage.addOrderComment('Please deliver in the afternoon - E2E test order.');
    await checkoutPage.placeOrder();

    // --- Payment ---
    await checkoutPage.payWithCard({
      nameOnCard: user.name,
      cardNumber: '4111111111111111',
      cvc: '123',
      expiryMonth: '12',
      expiryYear: '2028',
    });

    // --- Confirmation ---
    await checkoutPage.expectOrderConfirmed();

    // --- Cleanup ---
    await api.deleteAccount(user.email, user.password);
  });

  test('cart correctly reflects an empty state before anything is added', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await expect(cartPage.emptyCartMessage).toBeVisible();
  });
});
