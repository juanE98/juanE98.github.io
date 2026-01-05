import { test, expect } from '@playwright/test';

test.describe('Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be visible on page load', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should hide header when scrolling down', async ({ page }) => {
    const header = page.locator('header');

    // Ensure header is initially visible
    await expect(header).toBeVisible();
    await expect(header).not.toHaveClass(/hidden/);

    // Get header height to scroll past it
    const headerHeight = await header.boundingBox().then(box => box?.height || 0);

    // Scroll down significantly past the header
    await page.evaluate((scrollAmount) => {
      window.scrollTo({ top: scrollAmount, behavior: 'instant' });
    }, headerHeight + 200);

    // Wait for scroll event to be processed
    await page.waitForTimeout(100);

    // Check that header has 'hidden' class
    await expect(header).toHaveClass(/hidden/);
  });

  test('should show header when scrolling up', async ({ page }) => {
    const header = page.locator('header');

    // First scroll down
    await page.evaluate(() => {
      window.scrollTo({ top: 1000, behavior: 'instant' });
    });
    await page.waitForTimeout(100);

    // Verify header is hidden
    await expect(header).toHaveClass(/hidden/);

    // Now scroll up
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'instant' });
    });
    await page.waitForTimeout(100);

    // Header should now be visible (no 'hidden' class)
    await expect(header).not.toHaveClass(/hidden/);
  });

  test('should not hide header when at top of page', async ({ page }) => {
    const header = page.locator('header');

    // Ensure we're at the top
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(100);

    // Header should not have hidden class
    await expect(header).not.toHaveClass(/hidden/);
  });

  test('should navigate to home when logo is clicked', async ({ page }) => {
    // First navigate to another section
    await page.locator('nav.desktop_menu_nav li').filter({ hasText: 'About Me' }).click();
    await page.waitForTimeout(1000);

    // Verify we're at about section
    await expect(page).toHaveURL(/#about$/);

    // Click the logo
    await page.locator('header img.logo').click();

    // Wait for smooth scroll
    await page.waitForTimeout(1000);

    // Should navigate to home
    await expect(page).toHaveURL(/#home$/);

    // Home section should be in viewport
    const homeSection = page.locator('#home');
    await expect(homeSection).toBeInViewport();
  });

  test('should maintain visibility state during rapid scroll changes', async ({ page }) => {
    const header = page.locator('header');

    // Scroll down
    await page.evaluate(() => {
      window.scrollTo({ top: 800, behavior: 'instant' });
    });
    await page.waitForTimeout(100);
    await expect(header).toHaveClass(/hidden/);

    // Scroll up
    await page.evaluate(() => {
      window.scrollTo({ top: 400, behavior: 'instant' });
    });
    await page.waitForTimeout(100);
    await expect(header).not.toHaveClass(/hidden/);

    // Scroll down again
    await page.evaluate(() => {
      window.scrollTo({ top: 1000, behavior: 'instant' });
    });
    await page.waitForTimeout(100);
    await expect(header).toHaveClass(/hidden/);
  });

  test('should have all navigation items visible', async ({ page }) => {
    const navItems = page.locator('nav.desktop_menu_nav li');

    await expect(navItems).toHaveCount(4);

    // Verify each navigation item
    await expect(navItems.nth(0)).toHaveText('Home');
    await expect(navItems.nth(1)).toHaveText('Technologies');
    await expect(navItems.nth(2)).toHaveText('About Me');
    await expect(navItems.nth(3)).toHaveText('Experience');
  });
});
