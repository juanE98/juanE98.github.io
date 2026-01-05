import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load home page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/website-portfolio/);
  });

  test('should navigate to Technologies section via header link', async ({ page }) => {
    // Click Technologies link in header
    await page.locator('nav.desktop_menu_nav li').filter({ hasText: 'Technologies' }).click();

    // Wait for smooth scroll to complete
    await page.waitForTimeout(1000);

    // Check URL fragment
    await expect(page).toHaveURL(/#technologies$/);

    // Verify Technologies section is in viewport
    const technologiesSection = page.locator('#technologies');
    await expect(technologiesSection).toBeInViewport();
  });

  test('should navigate to About section via header link', async ({ page }) => {
    // Click About Me link in header
    await page.locator('nav.desktop_menu_nav li').filter({ hasText: 'About Me' }).click();

    // Wait for smooth scroll to complete
    await page.waitForTimeout(1000);

    // Check URL fragment
    await expect(page).toHaveURL(/#about$/);

    // Verify About section is in viewport
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('should navigate to Experience section via header link', async ({ page }) => {
    // Click Experience link in header
    await page.locator('nav.desktop_menu_nav li').filter({ hasText: 'Experience' }).click();

    // Wait for smooth scroll to complete
    await page.waitForTimeout(1000);

    // Check URL fragment
    await expect(page).toHaveURL(/#experience$/);

    // Verify Experience section is in viewport
    const experienceSection = page.locator('#experience');
    await expect(experienceSection).toBeInViewport();
  });

  test('should navigate to Home section via header link', async ({ page }) => {
    // First navigate away from home
    await page.locator('nav.desktop_menu_nav li').filter({ hasText: 'About Me' }).click();
    await page.waitForTimeout(1000);

    // Then navigate back to home
    await page.locator('nav.desktop_menu_nav li').filter({ hasText: 'Home' }).click();
    await page.waitForTimeout(1000);

    // Check URL fragment
    await expect(page).toHaveURL(/#home$/);

    // Verify Home section is in viewport
    const homeSection = page.locator('#home');
    await expect(homeSection).toBeInViewport();
  });

  test('should have smooth scrolling behavior', async ({ page }) => {
    const technologiesLink = page.locator('nav.desktop_menu_nav li').filter({ hasText: 'Technologies' });

    // Record initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);

    // Click navigation link
    await technologiesLink.click();

    // Wait a bit to allow scroll to start
    await page.waitForTimeout(300);

    // Check that scroll position has changed
    const midScrollY = await page.evaluate(() => window.scrollY);
    expect(midScrollY).toBeGreaterThan(initialScrollY);

    // Wait for scroll to complete
    await page.waitForTimeout(1000);

    // Verify we're at the technologies section
    const technologiesSection = page.locator('#technologies');
    await expect(technologiesSection).toBeInViewport();
  });

  test('should navigate through all sections sequentially', async ({ page }) => {
    const sections = ['technologies', 'about', 'experience'];

    for (const section of sections) {
      // Click the section link
      await page.locator('nav.desktop_menu_nav li').filter({ hasText: new RegExp(section, 'i') }).click();

      // Wait for smooth scroll
      await page.waitForTimeout(1000);

      // Verify URL and viewport
      await expect(page).toHaveURL(new RegExp(`#${section}$`));
      await expect(page.locator(`#${section}`)).toBeInViewport();
    }
  });
});
