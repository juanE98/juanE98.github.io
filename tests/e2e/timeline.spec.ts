import { test, expect } from '@playwright/test';

test.describe('Timeline Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to the experience section
    await page.click('a[href="#experience"]');
    // Wait for smooth scroll to complete
    await page.waitForTimeout(500);
  });

  test('should display all 7 career events', async ({ page }) => {
    const timelineItems = page.locator('.timeline-item');
    await expect(timelineItems).toHaveCount(7);
  });

  test('should show "Contal Services" as the first (most recent) event', async ({ page }) => {
    const firstEvent = page.locator('.timeline-item').first();
    await expect(firstEvent.locator('h3')).toContainText('Contal Services');
  });

  test('should display all career events in correct order', async ({ page }) => {
    const expectedEvents = [
      'Contal Services',
      'Dye and Durham',
      'Scriptsoft',
      'Bachelor of Computer Science',
      'Pharmacy Assistant',
      'Bachelor of Pharmaceutics and Therapeutic Science',
      'Pharmacy Student'
    ];

    const timelineItems = page.locator('.timeline-item h3');
    const count = await timelineItems.count();

    for (let i = 0; i < count; i++) {
      const eventText = await timelineItems.nth(i).textContent();
      expect(eventText).toContain(expectedEvents[i]);
    }
  });

  test('should trigger scroll animations on desktop (in-view class added)', async ({ page, isMobile }) => {
    // Skip this test on mobile viewports
    test.skip(isMobile, 'Animations are disabled on mobile viewports');

    const timelineItems = page.locator('.timeline-item');
    const firstItem = timelineItems.first();

    // Scroll to top first to ensure items are out of view
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    // Check that item doesn't have in-view class initially (if scrolled away)
    const hasInViewInitially = await firstItem.evaluate((el) => el.classList.contains('in-view'));

    // Scroll to the experience section to trigger animations
    await page.evaluate(() => {
      const experienceSection = document.querySelector('#experience');
      if (experienceSection) {
        experienceSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Wait for scroll and animation to complete
    await page.waitForTimeout(1000);

    // Check that at least one timeline item has the in-view class
    const itemsWithInView = await timelineItems.evaluateAll((items) =>
      items.filter((item) => item.classList.contains('in-view')).length
    );

    expect(itemsWithInView).toBeGreaterThan(0);
  });

  test('should have alternating left and right classes', async ({ page }) => {
    const timelineItems = page.locator('.timeline-item');
    const count = await timelineItems.count();

    for (let i = 0; i < count; i++) {
      const item = timelineItems.nth(i);
      if (i % 2 === 0) {
        await expect(item).toHaveClass(/left/);
      } else {
        await expect(item).toHaveClass(/right/);
      }
    }
  });

  test('should display event details (title, organization, description)', async ({ page }) => {
    const firstEvent = page.locator('.timeline-item').first();

    // Check for title
    await expect(firstEvent.locator('h3')).toBeVisible();

    // Check for organization/dates
    await expect(firstEvent.locator('h4')).toBeVisible();

    // Check for description (p tag exists, even if empty)
    await expect(firstEvent.locator('p')).toBeAttached();
  });
});
