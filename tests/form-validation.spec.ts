import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Form Validation', () => {
  test('signup rejects an invalid email format', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.signupNameInput.fill('Invalid Email User');
    await loginPage.signupEmailInput.fill('not-an-email');
    // Rely on the browser's native HTML5 validation for type="email"
    const validationMessage = await loginPage.signupEmailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).not.toBe('');
  });

  test('signup blocks submission when required fields are empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.signupButton.click();
    // HTML5 "required" keeps the browser on the same page - login form should still be visible
    await expect(page.locator('.login-form')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('login blocks submission when password is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginEmailInput.fill('someone@example.com');
    await loginPage.loginButton.click();

    const validationMessage = await loginPage.loginPasswordInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).not.toBe('');
  });

  test('product search with an empty query keeps the user on the products page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    await productsPage.searchInput.fill('');
    await productsPage.searchButton.click();

    await expect(page).toHaveURL(/\/products/);
  });
});
