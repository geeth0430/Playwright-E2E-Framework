# playwright-e2e-framework

End-to-end test suite for **[automationexercise.com](https://automationexercise.com)** built with
[Playwright Test](https://playwright.dev/) (TypeScript). Combines UI automation with the site's
public REST API for fast, realistic test-data setup, following a Page Object Model.

## Why this stack

- **Auto-wait + web-first assertions** — no manual `waitForTimeout`; every assertion (`toBeVisible`,
  `toContainText`, `toHaveCount`, `toHaveScreenshot`) polls until it passes or times out.
- **API for setup, UI for the thing under test** — account creation goes through
  `POST /api/createAccount` instead of the signup form, so a login test isn't also re-testing signup.
- **Page Object Model** — all selectors live in `/pages`, specs only describe behavior.
- **Multi-browser** — every spec runs against Chromium, Firefox, and WebKit.
- **Traceable failures** — `trace: 'on-first-retry'` captures a full trace (DOM snapshots, network,
  console) only when a test actually fails and retries, keeping CI fast.

## Project structure

```
playwright-e2e-framework/
├── pages/                        # Page Object Model
│   ├── LoginPage.ts               # /login (signup-start + login forms)
│   ├── SignupPage.ts              # account-details step of signup
│   ├── ProductsPage.ts            # /products (search, filter, add-to-cart)
│   ├── CartPage.ts                # /view_cart
│   └── CheckoutPage.ts            # /checkout + /payment + confirmation
├── utils/
│   └── api-helper.ts              # wraps automationexercise.com's REST API for test setup
├── tests/
│   ├── registration-login.spec.ts
│   ├── search-filter.spec.ts
│   ├── cart-checkout.spec.ts
│   ├── form-validation.spec.ts
│   └── visual-regression.spec.ts
├── .github/workflows/playwright.yml   # CI: installs browsers, runs tests, uploads HTML report
├── playwright.config.ts           # 3 browser projects, tracing, screenshots, video
├── package.json
├── tsconfig.json
└── .gitignore
```

## Setup

```bash
npm install
npx playwright install --with-deps   # downloads Chromium, Firefox, WebKit
```

## Running tests

```bash
npx playwright test                  # all specs, all 3 browsers
npm run test:chromium                # single browser
npm run test:headed                  # watch the browser run
npm run test:ui                      # Playwright's interactive UI mode
npm run test:debug                   # step through with the inspector
```

### Updating visual baselines

The visual regression spec has no baseline images checked in yet — generate them once, then commit:

```bash
npx playwright test visual-regression --update-snapshots
```

### Viewing the HTML report

```bash
npx playwright show-report           # opens the last local run's report
```

In CI, the report is uploaded as a workflow artifact (`playwright-report`) on every run — download it
from the Actions tab and open `index.html` to browse results, traces, screenshots, and videos per test.

### Debugging a failed CI run

1. Download the `playwright-traces` artifact from the failed workflow run.
2. `npx playwright show-trace <path-to-trace.zip>`
3. Step through the DOM snapshots, network requests, and console logs at the moment of failure.

## Test coverage

| Spec file | Covers |
|---|---|
| `registration-login.spec.ts` | Full UI signup flow; API-created user logging in through the UI; invalid-password login error; duplicate-email signup rejection. Mixes API setup (`createAccount`/`deleteAccount`) with UI actions. |
| `search-filter.spec.ts` | Keyword product search; cross-checking search results against the live `/api/productsList` catalog; category filter; brand filter. |
| `cart-checkout.spec.ts` | API-created user → UI login → add product to cart → checkout review → payment → order confirmation. Also checks the empty-cart state. |
| `form-validation.spec.ts` | Invalid email format on signup, empty required fields on signup, empty password on login, empty search query. |
| `visual-regression.spec.ts` | `toHaveScreenshot()` baseline comparisons for the homepage and the products grid. |

## API endpoints used for setup

`utils/api-helper.ts` wraps these documented endpoints (see
[automationexercise.com/api_list](https://automationexercise.com/api_list)):

- `POST /api/createAccount` — create a test user without touching the signup UI
- `DELETE /api/deleteAccount` — clean up the test user after each test
- `POST /api/verifyLogin` — validate credentials directly
- `GET /api/productsList` — read the live catalog for data-driven assertions
- `GET /api/brandsList` — read available brands for filter tests

## CI

`.github/workflows/playwright.yml` runs on every push/PR to `main`/`master`:

1. Checks out the repo, installs Node 20 and dependencies (`npm ci`).
2. Installs all three browser engines with OS dependencies.
3. Runs the full suite (`npx playwright test`).
4. Uploads the HTML report as a build artifact (always) and traces on failure.

## Notes

- Test users are generated with a timestamp + random suffix (`generateTestUser()` in
  `utils/api-helper.ts`) so parallel workers never collide, and every test cleans up its own
  account via the API in a final step.
- `trace: 'on-first-retry'` in `playwright.config.ts` means traces are only captured when CI retries
  a failing test — keeps local/CI runs fast while still giving full debuggability for real failures.
- Card number/CVC used in checkout tests are the site's own dummy sandbox values — no real payment
  processing occurs on automationexercise.com.
