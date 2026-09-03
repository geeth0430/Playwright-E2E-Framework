import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the /login page (Signup / Login) on automationexercise.com
 * Handles both the "New User Signup" form and the "Login to your account" form.
 */
export class LoginPage {
  readonly page: Page;

  readonly signupLoginLink: Locator;

  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly signupErrorText: Locator;

  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorText: Locator;

  readonly loggedInAsText: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signupLoginLink = page.locator('a[href="/login"]');

    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');
    this.signupErrorText = page.locator('.signup-form p');

    this.loginEmailInput = page.locator('input[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
    this.loginErrorText = page.locator('.login-form p');

    this.loggedInAsText = page.locator('a:has-text("Logged in as")');
    this.logoutLink = page.locator('a[href="/logout"]');
  }

  async goto() {
    await this.page.goto('/login');
    await expect(this.page.locator('.login-form')).toBeVisible();
  }

  /** Kicks off signup - fills name/email and submits, landing on the account details page. */
  async startSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async login(email: string, password: string) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoggedInAs(name: string) {
    await expect(this.loggedInAsText).toContainText(name);
  }

  async expectLoginError(message = 'Your email or password is incorrect!') {
    await expect(this.loginErrorText).toBeVisible();
    await expect(this.loginErrorText).toContainText(message);
  }

  async expectSignupEmailExistsError(message = 'Email Address already exist!') {
    await expect(this.signupErrorText).toBeVisible();
    await expect(this.signupErrorText).toContainText(message);
  }

  async logout() {
    await this.logoutLink.click();
  }
}
