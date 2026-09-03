import { APIRequestContext, expect } from '@playwright/test';

/**
 * Wraps automationexercise.com's public REST API (documented at
 * https://automationexercise.com/api_list) so tests can set up and tear
 * down data quickly instead of driving the UI for every precondition.
 *
 * Example: creating an account via API before a UI login test means the
 * login spec only has to test login, not the whole signup form again.
 */
export interface AccountData {
  name: string;
  email: string;
  password: string;
  title?: 'Mr' | 'Mrs';
  birth_date?: string;
  birth_month?: string;
  birth_year?: string;
  firstname: string;
  lastname: string;
  company?: string;
  address1: string;
  address2?: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

export class ApiHelper {
  constructor(private readonly request: APIRequestContext) {}

  /** POST /api/createAccount - creates a user directly, bypassing the signup UI. */
  async createAccount(data: AccountData) {
    const response = await this.request.post('/api/createAccount', {
      form: {
        name: data.name,
        email: data.email,
        password: data.password,
        title: data.title ?? 'Mr',
        birth_date: data.birth_date ?? '10',
        birth_month: data.birth_month ?? '5',
        birth_year: data.birth_year ?? '1995',
        firstname: data.firstname,
        lastname: data.lastname,
        company: data.company ?? 'QA Corp',
        address1: data.address1,
        address2: data.address2 ?? '',
        country: data.country,
        zipcode: data.zipcode,
        state: data.state,
        city: data.city,
        mobile_number: data.mobile_number,
      },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    // API returns responseCode 201 on successful creation
    expect(body.responseCode).toBe(201);
    return body;
  }

  /** DELETE /api/deleteAccount - cleans up a test user after the test finishes. */
  async deleteAccount(email: string, password: string) {
    const response = await this.request.delete('/api/deleteAccount', {
      form: { email, password },
    });
    const body = await response.json();
    expect([200, 404]).toContain(body.responseCode);
    return body;
  }

  /** POST /api/verifyLogin - confirms credentials are valid without touching the UI. */
  async verifyLogin(email: string, password: string) {
    const response = await this.request.post('/api/verifyLogin', {
      form: { email, password },
    });
    const body = await response.json();
    return body; // { responseCode: 200, message: 'User exists!' } on success
  }

  /** GET /api/productsList - fetches the product catalog for data-driven assertions. */
  async getProductsList() {
    const response = await this.request.get('/api/productsList');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    return body.products as Array<{ id: number; name: string; price: string; brand: string; category: { category: string } }>;
  }

  /** GET /api/brandsList - fetches available brands, useful for data-driven filter tests. */
  async getBrandsList() {
    const response = await this.request.get('/api/brandsList');
    const body = await response.json();
    return body.brands as Array<{ id: number; brand: string }>;
  }
}

/** Generates a unique-enough test user so parallel workers never collide. */
export function generateTestUser(prefix = 'qa') {
  const unique = `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    name: `Test User ${unique}`,
    email: `${unique}@mailinator.com`,
    password: 'P@ssword123!',
    firstname: 'Test',
    lastname: 'User',
    address1: '123 QA Street',
    country: 'United States',
    zipcode: '10001',
    state: 'NY',
    city: 'New York',
    mobile_number: '5551234567',
  };
}
