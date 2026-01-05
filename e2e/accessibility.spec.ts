import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should not have any critical WCAG violations on home page', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Filter for critical and serious violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious'
    );

    expect(criticalViolations).toEqual([]);
  });

  test('should not have WCAG violations on about section', async ({ page }) => {
    await page.click('a[href="#about"]');
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious'
    );

    expect(criticalViolations).toEqual([]);
  });

  test('should not have WCAG violations on experience section', async ({ page }) => {
    await page.click('a[href="#experience"]');
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious'
    );

    expect(criticalViolations).toEqual([]);
  });

  test('should not have WCAG violations on technologies section', async ({ page }) => {
    await page.click('a[href="#technologies"]');
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious'
    );

    expect(criticalViolations).toEqual([]);
  });

  test('all images should have alt text', async ({ page }) => {
    // Wait for all images to load
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // Alt attribute should exist (can be empty for decorative images, but should be present)
      expect(alt).not.toBeNull();
    }
  });

  test('all images in carousel should have alt attributes', async ({ page }) => {
    await page.click('a[href="#technologies"]');
    await page.waitForTimeout(500);

    const carouselImages = page.locator('app-image-carousel img');
    const count = await carouselImages.count();

    for (let i = 0; i < count; i++) {
      const img = carouselImages.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('external links should have security attributes (rel includes "noopener")', async ({ page }) => {
    // Get all external links (links with target="_blank")
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();

    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      const rel = await link.getAttribute('rel');

      // rel attribute should exist and include "noopener"
      expect(rel).not.toBeNull();
      expect(rel).toContain('noopener');
    }
  });

  test('footer social links should have proper security attributes', async ({ page }) => {
    const socialLinks = page.locator('footer .social-icons a');
    const count = await socialLinks.count();

    for (let i = 0; i < count; i++) {
      const link = socialLinks.nth(i);
      const rel = await link.getAttribute('rel');
      const target = await link.getAttribute('target');

      expect(target).toBe('_blank');
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['best-practice'])
      .analyze();

    // Check for heading order violations
    const headingViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === 'heading-order'
    );

    expect(headingViolations).toEqual([]);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();

    // Check for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === 'color-contrast'
    );

    // Allow minor contrast issues but no critical ones
    const criticalContrastViolations = contrastViolations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical'
    );

    expect(criticalContrastViolations).toEqual([]);
  });

  test('interactive elements should be keyboard accessible', async ({ page }) => {
    // Test navigation links
    const navLinks = page.locator('header a');
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      await link.focus();

      // Verify the element is focused
      const isFocused = await link.evaluate((el) => el === document.activeElement);
      expect(isFocused).toBeTruthy();
    }
  });

  test('should have lang attribute on html element', async ({ page }) => {
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).not.toBeNull();
    expect(htmlLang).toBeTruthy();
  });
});
