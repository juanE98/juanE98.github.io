import { test, expect } from '@playwright/test';

test.describe('Image Carousel Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to the technologies section
    await page.click('a[href="#technologies"]');
    // Wait for smooth scroll to complete
    await page.waitForTimeout(500);
  });

  test('should display 48 technology icons (16 icons * 3 copies)', async ({ page }) => {
    // Wait for carousel to be visible
    await page.waitForSelector('app-image-carousel');

    // The component creates 3 copies of 16 icons (5-20 inclusive)
    const carouselImages = page.locator('app-image-carousel img');
    await expect(carouselImages).toHaveCount(48);
  });

  test('should have icon images with correct src pattern (assets/icons/[5-20].svg)', async ({ page }) => {
    const carouselImages = page.locator('app-image-carousel img');
    const count = await carouselImages.count();

    // Since there are 3 copies, we'll check the pattern repeats correctly
    const expectedIcons = Array.from({ length: 16 }, (_, i) => `assets/icons/${i + 5}.svg`);
    const expectedPattern = [...expectedIcons, ...expectedIcons, ...expectedIcons];

    for (let i = 0; i < count; i++) {
      const src = await carouselImages.nth(i).getAttribute('src');
      expect(src).toContain(expectedPattern[i]);
    }
  });

  test('should load all icon images successfully', async ({ page }) => {
    const carouselImages = page.locator('app-image-carousel img');
    const count = await carouselImages.count();

    // Check that images are loaded (naturalWidth > 0 indicates loaded)
    for (let i = 0; i < count; i++) {
      const isLoaded = await carouselImages.nth(i).evaluate((img: HTMLImageElement) => {
        return img.complete && img.naturalWidth > 0;
      });
      expect(isLoaded).toBeTruthy();
    }
  });

  test('should have icons numbered from 5 to 20', async ({ page }) => {
    const carouselImages = page.locator('app-image-carousel img');

    // Check first 16 images (first copy of the icons)
    for (let i = 5; i <= 20; i++) {
      const iconPath = `assets/icons/${i}.svg`;
      const iconExists = await carouselImages.filter({ has: page.locator(`[src*="${iconPath}"]`) }).count();

      // Each icon should appear 3 times (3 copies)
      expect(iconExists).toBeGreaterThanOrEqual(3);
    }
  });

  test('should be visible in the technologies section', async ({ page }) => {
    const carousel = page.locator('app-image-carousel');
    await expect(carousel).toBeVisible();
  });

  test('should have carousel container with proper structure', async ({ page }) => {
    // Check that the carousel component exists
    const carousel = page.locator('app-image-carousel');
    await expect(carousel).toBeAttached();

    // Verify images are inside the carousel
    const imagesInCarousel = carousel.locator('img');
    const count = await imagesInCarousel.count();
    expect(count).toBe(48);
  });
});
