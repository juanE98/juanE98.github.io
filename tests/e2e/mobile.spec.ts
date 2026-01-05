import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hamburger menu icon on mobile', async ({ page }) => {
    const hamburgerMenu = page.locator('.menu-icon-open');
    await expect(hamburgerMenu).toBeVisible();

    // Desktop menu should not be visible on mobile
    const desktopMenu = page.locator('nav.desktop_menu_nav');
    await expect(desktopMenu).not.toBeVisible();
  });

  test('should open mobile menu panel when hamburger is clicked', async ({ page }) => {
    const hamburgerMenu = page.locator('.menu-icon-open');
    const mobileMenuPanel = page.locator('.mobile_menu_panel');

    // Initially, menu panel should not have active class
    await expect(mobileMenuPanel).not.toHaveClass(/active/);

    // Click hamburger menu
    await hamburgerMenu.click();

    // Wait for menu to open
    await page.waitForTimeout(300);

    // Menu panel should now have active class
    await expect(mobileMenuPanel).toHaveClass(/active/);
  });

  test('should lock body scroll when menu is open', async ({ page }) => {
    const hamburgerMenu = page.locator('.menu-icon-open');

    // Open menu
    await hamburgerMenu.click();
    await page.waitForTimeout(300);

    // Check that html element has no-scroll class
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/no-scroll/);

    // Check that body has no-interaction class
    const bodyElement = page.locator('body');
    await expect(bodyElement).toHaveClass(/no-interaction/);
  });

  test('should display close button in open menu', async ({ page }) => {
    const hamburgerMenu = page.locator('.menu-icon-open');
    const mobileMenuPanel = page.locator('.mobile_menu_panel');

    // Open menu
    await hamburgerMenu.click();
    await page.waitForTimeout(300);

    // Verify menu is active
    await expect(mobileMenuPanel).toHaveClass(/active/);

    // Close button should be visible
    const closeButton = page.locator('.menu-icon-close');
    await expect(closeButton).toBeVisible();
  });

  test('should close menu when close button is clicked', async ({ page }) => {
    const hamburgerMenu = page.locator('.menu-icon-open');
    const mobileMenuPanel = page.locator('.mobile_menu_panel');
    const closeButton = page.locator('.menu-icon-close');

    // Open menu
    await hamburgerMenu.click();
    await page.waitForTimeout(300);
    await expect(mobileMenuPanel).toHaveClass(/active/);

    // Click close button
    await closeButton.click();
    await page.waitForTimeout(300);

    // Menu should no longer have active class
    await expect(mobileMenuPanel).not.toHaveClass(/active/);
  });

  test('should unlock body scroll when menu is closed', async ({ page }) => {
    const hamburgerMenu = page.locator('.menu-icon-open');
    const closeButton = page.locator('.menu-icon-close');
    const htmlElement = page.locator('html');
    const bodyElement = page.locator('body');

    // Open menu
    await hamburgerMenu.click();
    await page.waitForTimeout(300);
    await expect(htmlElement).toHaveClass(/no-scroll/);
    await expect(bodyElement).toHaveClass(/no-interaction/);

    // Close menu
    await closeButton.click();
    await page.waitForTimeout(300);

    // Classes should be removed
    await expect(htmlElement).not.toHaveClass(/no-scroll/);
    await expect(bodyElement).not.toHaveClass(/no-interaction/);
  });

  test('should have all navigation items in mobile menu', async ({ page }) => {
    const hamburgerMenu = page.locator('.menu-icon-open');

    // Open menu
    await hamburgerMenu.click();
    await page.waitForTimeout(300);

    const mobileMenuItems = page.locator('.mobile_menu_panel ul li');

    // Should have 4 menu items
    await expect(mobileMenuItems).toHaveCount(4);

    // Verify menu item text
    await expect(mobileMenuItems.nth(0)).toHaveText('Home');
    await expect(mobileMenuItems.nth(1)).toHaveText('Technologies');
    await expect(mobileMenuItems.nth(2)).toHaveText('About Me');
    await expect(mobileMenuItems.nth(3)).toHaveText('Experience');
  });

  test('should close menu and navigate when menu item is clicked', async ({ page }) => {
    const hamburgerMenu = page.locator('.menu-icon-open');
    const mobileMenuPanel = page.locator('.mobile_menu_panel');

    // Open menu
    await hamburgerMenu.click();
    await page.waitForTimeout(300);
    await expect(mobileMenuPanel).toHaveClass(/active/);

    // Click on Technologies menu item
    const technologiesItem = page.locator('.mobile_menu_panel ul li').filter({ hasText: 'Technologies' });
    await technologiesItem.click();

    // Wait for menu to close and navigation to complete
    await page.waitForTimeout(1000);

    // Menu should be closed
    await expect(mobileMenuPanel).not.toHaveClass(/active/);

    // Should navigate to technologies section
    await expect(page).toHaveURL(/#technologies$/);

    // Technologies section should be in viewport
    const technologiesSection = page.locator('#technologies');
    await expect(technologiesSection).toBeInViewport();
  });

  test('should navigate to About Me from mobile menu', async ({ page }) => {
    const hamburgerMenu = page.locator('.menu-icon-open');
    const mobileMenuPanel = page.locator('.mobile_menu_panel');

    // Open menu
    await hamburgerMenu.click();
    await page.waitForTimeout(300);

    // Click About Me
    const aboutItem = page.locator('.mobile_menu_panel ul li').filter({ hasText: 'About Me' });
    await aboutItem.click();

    await page.waitForTimeout(1000);

    // Menu should be closed
    await expect(mobileMenuPanel).not.toHaveClass(/active/);

    // Should navigate to about section
    await expect(page).toHaveURL(/#about$/);
    await expect(page.locator('#about')).toBeInViewport();
  });

  test('should navigate to Experience from mobile menu', async ({ page }) => {
    const hamburgerMenu = page.locator('.menu-icon-open');
    const mobileMenuPanel = page.locator('.mobile_menu_panel');

    // Open menu
    await hamburgerMenu.click();
    await page.waitForTimeout(300);

    // Click Experience
    const experienceItem = page.locator('.mobile_menu_panel ul li').filter({ hasText: 'Experience' });
    await experienceItem.click();

    await page.waitForTimeout(1000);

    // Menu should be closed
    await expect(mobileMenuPanel).not.toHaveClass(/active/);

    // Should navigate to experience section
    await expect(page).toHaveURL(/#experience$/);
    await expect(page.locator('#experience')).toBeInViewport();
  });

  test('should navigate to Home from mobile menu', async ({ page }) => {
    const hamburgerMenu = page.locator('.menu-icon-open');
    const mobileMenuPanel = page.locator('.mobile_menu_panel');

    // First navigate away from home
    await hamburgerMenu.click();
    await page.waitForTimeout(300);
    await page.locator('.mobile_menu_panel ul li').filter({ hasText: 'About Me' }).click();
    await page.waitForTimeout(1000);

    // Open menu again
    await hamburgerMenu.click();
    await page.waitForTimeout(300);

    // Click Home
    const homeItem = page.locator('.mobile_menu_panel ul li').filter({ hasText: 'Home' });
    await homeItem.click();

    await page.waitForTimeout(1000);

    // Menu should be closed
    await expect(mobileMenuPanel).not.toHaveClass(/active/);

    // Should navigate to home section
    await expect(page).toHaveURL(/#home$/);
    await expect(page.locator('#home')).toBeInViewport();
  });

  test('should toggle menu multiple times', async ({ page }) => {
    const hamburgerMenu = page.locator('.menu-icon-open');
    const closeButton = page.locator('.menu-icon-close');
    const mobileMenuPanel = page.locator('.mobile_menu_panel');

    // Open
    await hamburgerMenu.click();
    await page.waitForTimeout(300);
    await expect(mobileMenuPanel).toHaveClass(/active/);

    // Close
    await closeButton.click();
    await page.waitForTimeout(300);
    await expect(mobileMenuPanel).not.toHaveClass(/active/);

    // Open again
    await hamburgerMenu.click();
    await page.waitForTimeout(300);
    await expect(mobileMenuPanel).toHaveClass(/active/);

    // Close again
    await closeButton.click();
    await page.waitForTimeout(300);
    await expect(mobileMenuPanel).not.toHaveClass(/active/);
  });

  test('should maintain scroll lock state correctly during multiple toggles', async ({ page }) => {
    const hamburgerMenu = page.locator('.menu-icon-open');
    const closeButton = page.locator('.menu-icon-close');
    const htmlElement = page.locator('html');

    // Open menu
    await hamburgerMenu.click();
    await page.waitForTimeout(300);
    await expect(htmlElement).toHaveClass(/no-scroll/);

    // Close menu
    await closeButton.click();
    await page.waitForTimeout(300);
    await expect(htmlElement).not.toHaveClass(/no-scroll/);

    // Open again
    await hamburgerMenu.click();
    await page.waitForTimeout(300);
    await expect(htmlElement).toHaveClass(/no-scroll/);

    // Close again
    await closeButton.click();
    await page.waitForTimeout(300);
    await expect(htmlElement).not.toHaveClass(/no-scroll/);
  });
});
