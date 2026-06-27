import { test, expect } from "@playwright/test";

test.describe("GreenCityHome Page Guest Role", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/greenCity");
  });

  test.describe("Header", () => {
    test("1. should display the home page", async ({ page }) => {
      await expect(page).toHaveTitle(/GreenCity/i);
    });
    test("2. should display correct url", async ({ page }) => {
      await expect(page).toHaveURL("https://www.greencity.cx.ua/#/greenCity");
    });
    test("3. should display correct logo", async ({ page }) => {
      await expect(page.getByAltText(/greencity-logo/i).first()).toBeVisible();
    });
    test("4. should display navigation menu", async ({ page }) => {
      const navigationMenu = page.getByRole("tablist");
      await expect(navigationMenu).toBeVisible();
      await expect(navigationMenu.getByRole('link')).toHaveCount(6);
      await expect(navigationMenu.getByRole("link", { name: "Eco news" })).toBeVisible();
      await expect(navigationMenu.getByRole("link", { name: "Events" })).toBeVisible();
      await expect(navigationMenu.getByRole("link", { name: "Places" })).toBeVisible();
      await expect(navigationMenu.getByRole("link", { name: "About us" })).toBeVisible();
      await expect(navigationMenu.getByRole("link", { name: "My space" })).toBeVisible();
      await expect(navigationMenu.getByRole("link", { name: "UBS courier" })).toBeVisible();
    });
    test("5. should display search button", async ({ page }) => {
      await expect(page.getByAltText("Internal search button")).toBeVisible();
    });
    test('6. should display language switcher', async ({ page }) => {
      const languageSwitcher = page.getByRole('option', { name: 'english' });
      await expect(languageSwitcher).toBeVisible();
      await languageSwitcher.click();
      await expect(page.getByRole('menuitem', { name: 'Uk' })).toBeVisible();
    });
    test('7. should display login button', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'sing in button' })).toBeVisible();
    });
    test('8. should display register button', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
    });

    test('9. should display second nav menu', async ({ page }) => {
      const secondNavMenu = page.locator('.header_navigation-menu-right-list');
      await expect(secondNavMenu.locator('> [role]')).toHaveCount(5);
    });
    test('10. should home page has search input', async ({ page }) => {
      await expect(page.getByRole('search', { name: 'site search' })).toBeVisible();
      await expect(page.getByPlaceholder(/search/i)).toBeVisible();
    });
  });
  test.describe('Main Content Section', () => {
    test('1. should display home page text', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /A new way to grow habits/i }),
      ).toBeVisible();
    });
    test('2. Hero CTA button "Start forming a habit!" is visible', async ({ page }) => {
      const button = page.getByRole('button', { name: /start forming a habit/i }).first();
      await expect(button).toBeVisible();
      await expect(button).not.toHaveAttribute('disabled');
    });

    test('3. Eco bags habit tracking card is visible', async ({ page }) => {
      await expect(page.getByText(/did not take/i)).toBeVisible();
    });
    test('4. Newsletter subscription form accepts email input and Subscribe button is clickable', async ({ page }) => {
      const emailInput = page.getByRole('textbox', { name: /email/i });
      const subscribeButton = page.getByRole('button', { name: /subscribe/i });

      await expect(emailInput).toBeVisible();
      await expect(subscribeButton).toBeVisible();
      await expect(subscribeButton).toBeEnabled();

      await emailInput.fill('test123@example.com');
      await expect(emailInput).toHaveValue('test@example.com');
      await subscribeButton.click();
    });
  });
  test.describe('Footer Section', () => {

    test('1. Footer navigation links are visible', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      await expect(footer.locator('ul').first().getByRole('link')).toHaveText([
        'Eco news',
        'Events',
        'About Us',
        'My Space',
        'UBS Courier',
      ]);
    });

    test('2. Footer "Follow us" social links are visible', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer.getByRole('link', { name: /twitter/i })).toBeVisible();
      await expect(footer.getByRole('link', { name: /leenkedin/i })).toBeVisible();
      await expect(footer.getByRole('link', { name: /facebook/i })).toBeVisible();
      await expect(footer.getByRole('link', { name: /instagram/i })).toBeVisible();
      await expect(footer.getByRole('link', { name: /youtube/i })).toBeVisible();
    });

  });
});
