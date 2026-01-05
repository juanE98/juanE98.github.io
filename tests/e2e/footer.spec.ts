import { test, expect } from '@playwright/test';

test.describe('Footer Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display footer on the page', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should display LinkedIn social link', async ({ page }) => {
    const linkedInLink = page.locator('footer a[href*="linkedin.com"]');
    await expect(linkedInLink).toBeVisible();
    await expect(linkedInLink).toHaveAttribute('href', 'https://www.linkedin.com/in/juan-espares/');
  });

  test('should display GitHub social link', async ({ page }) => {
    const githubLink = page.locator('footer a[href*="github.com"]');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/juanE98');
  });

  test('should have LinkedIn link with target="_blank"', async ({ page }) => {
    const linkedInLink = page.locator('footer a[href*="linkedin.com"]');
    await expect(linkedInLink).toHaveAttribute('target', '_blank');
  });

  test('should have GitHub link with target="_blank"', async ({ page }) => {
    const githubLink = page.locator('footer a[href*="github.com"]');
    await expect(githubLink).toHaveAttribute('target', '_blank');
  });

  test('should have LinkedIn link with rel="noopener noreferrer"', async ({ page }) => {
    const linkedInLink = page.locator('footer a[href*="linkedin.com"]');
    await expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should have GitHub link with rel="noopener noreferrer"', async ({ page }) => {
    const githubLink = page.locator('footer a[href*="github.com"]');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should display copyright text containing "Juan Espares"', async ({ page }) => {
    const copyright = page.locator('footer .copyright');
    await expect(copyright).toBeVisible();
    await expect(copyright).toContainText('Juan Espares');
  });

  test('should display copyright text with year', async ({ page }) => {
    const copyright = page.locator('footer .copyright');
    await expect(copyright).toContainText('2024');
  });

  test('should have both social links and copyright in footer', async ({ page }) => {
    const socialIcons = page.locator('footer .social-icons');
    const copyright = page.locator('footer .copyright');

    await expect(socialIcons).toBeVisible();
    await expect(copyright).toBeVisible();
  });

  test('should display Font Awesome icons for social links', async ({ page }) => {
    const linkedInIcon = page.locator('footer a[href*="linkedin.com"] i.fa-linkedin');
    const githubIcon = page.locator('footer a[href*="github.com"] i.fa-github');

    await expect(linkedInIcon).toBeAttached();
    await expect(githubIcon).toBeAttached();
  });

  test('should have exactly 2 social links', async ({ page }) => {
    const socialLinks = page.locator('footer .social-icons a');
    await expect(socialLinks).toHaveCount(2);
  });
});
