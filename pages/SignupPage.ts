import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the "Enter Account Information" page shown after
 * starting signup on automationexercise.com (/signup flow, second step).
 */
export class SignupPage {
  readonly page: Page;

  readonly titleMrRadio: Locator;
  readonly titleMrsRadio: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly optinCheckbox: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;

  readonly accountCreatedHeading: Locator;
  readonly continueButton: Locator;
  readonly accountDeletedHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.titleMrRadio = page.locator('#id_gender1');
    this.titleMrsRadio = page.locator('#id_gender2');
    this.passwordInput = page.locator('#password');
    this.daysSelect = page.locator('#days');
    this.monthsSelect = page.locator('#months');
    this.yearsSelect = page.locator('#years');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.optinCheckbox = page.locator('#optin');
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.companyInput = page.locator('#company');
    this.addressInput = page.locator('#address1');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.locator('#mobile_number');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');

    this.accountCreatedHeading = page.locator('h2[data-qa="account-created"]');
    this.continueButton = page.locator('a[data-qa="continue-button"]');
    this.accountDeletedHeading = page.locator('h2[data-qa="account-deleted"]');
  }

  async fillAccountDetails(details: {
    password: string;
    day: string;
    month: string;
    year: string;
    firstName: string;
    lastName: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
  }) {
    await this.titleMrRadio.check();
    await this.passwordInput.fill(details.password);
    await this.daysSelect.selectOption(details.day);
    await this.monthsSelect.selectOption(details.month);
    await this.yearsSelect.selectOption(details.year);
    await this.newsletterCheckbox.check();
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.addressInput.fill(details.address);
    await this.countrySelect.selectOption(details.country);
    await this.stateInput.fill(details.state);
    await this.cityInput.fill(details.city);
    await this.zipcodeInput.fill(details.zipcode);
    await this.mobileNumberInput.fill(details.mobileNumber);
  }

  async submit() {
    await this.createAccountButton.click();
  }

  async expectAccountCreated() {
    await expect(this.accountCreatedHeading).toBeVisible();
    await expect(this.accountCreatedHeading).toContainText('Account Created!');
  }

  async continueAfterCreation() {
    await this.continueButton.click();
  }
}
