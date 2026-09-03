import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { ApiHelper, generateTestUser } from '../utils/api-helper';

test.describe('Registration & Login', () => {
  test('full UI signup flow creates a working account', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const signupPage = new SignupPage(page);
    const user = generateTestUser('uisignup');

    await loginPage.goto();
    await loginPage.startSignup(user.name, user.email);

    await signupPage.fillAccountDetails({
      password: user.password,
      day: '10',
      month: '5',
      year: '1995',
      firstName: user.firstname,
      lastName: user.lastname,
      address: user.address1,
      country: user.country,
      state: user.state,
      city: user.city,
      zipcode: user.zipcode,
      mobileNumber: user.mobile_number,
    });
    await signupPage.submit();
    await signupPage.expectAccountCreated();
    await signupPage.continueAfterCreation();

    await loginPage.expectLoggedInAs(user.name);

    // Cleanup via API - faster and doesn't depend on the UI's delete-account flow
    const api = new ApiHelper(page.request);
    await api.deleteAccount(user.email, user.password);
  });

  test('user created via API can log in through the UI', async ({ page }) => {
    // API-first setup: this test is only testing LOGIN, so we don't
    // re-walk the whole signup form - we just create the fixture via API.
    const api = new ApiHelper(page.request);
    const user = generateTestUser('apisetup');
    await api.createAccount(user);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.email, user.password);

    await loginPage.expectLoggedInAs(user.name);

    await api.deleteAccount(user.email, user.password);
  });

  test('login fails with incorrect password', async ({ page }) => {
    const api = new ApiHelper(page.request);
    const user = generateTestUser('badlogin');
    await api.createAccount(user);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.email, 'WrongPassword123');
    await loginPage.expectLoginError();

    await api.deleteAccount(user.email, user.password);
  });

  test('signup is rejected for an email that already exists', async ({ page }) => {
    const api = new ApiHelper(page.request);
    const user = generateTestUser('dupe');
    await api.createAccount(user);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.startSignup('Another Name', user.email);
    await loginPage.expectSignupEmailExistsError();

    await api.deleteAccount(user.email, user.password);
  });
});
