import { test, expect } from '@playwright/test';

test.describe('Home Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display name badge', async ({ page }) => {
    const nameBadge = page.locator('.name-badge');
    await expect(nameBadge).toBeVisible();
    await expect(nameBadge).toHaveText('Juan Espares');
  });

  test('should display greeting heading', async ({ page }) => {
    const greeting = page.locator('h1.greeting');
    await expect(greeting).toBeVisible();
    await expect(greeting).toHaveText("Hi, I'm Juan");
  });

  test('should display profile photo', async ({ page }) => {
    const profilePhoto = page.locator('.profile-photo');
    await expect(profilePhoto).toBeVisible();
    await expect(profilePhoto).toHaveAttribute('alt', 'Juan Espares');
    await expect(profilePhoto).toHaveAttribute('src', /homeJuan\.jpg/);
  });

  test('should display typewriter animation container', async ({ page }) => {
    const typingContainer = page.locator('.typing-container');
    await expect(typingContainer).toBeVisible();

    const typedText = page.locator('.typed-text');
    await expect(typedText).toBeVisible();

    const cursor = page.locator('.cursor');
    await expect(cursor).toBeVisible();
    await expect(cursor).toHaveText('|');
  });

  test('should animate typewriter text', async ({ page }) => {
    const typedText = page.locator('.typed-text');

    // Wait for initial text to start appearing
    await page.waitForTimeout(500);

    // Get initial text
    const initialText = await typedText.textContent();

    // Wait for text to change
    await page.waitForTimeout(2000);

    // Get new text
    const newText = await typedText.textContent();

    // Text should have changed (either typed more or deleted)
    expect(initialText).not.toBe(newText);
  });

  test('should typewriter text contain expected phrases', async ({ page }) => {
    const typedText = page.locator('.typed-text');
    const expectedPhrases = [
      'I write code',
      'I build software',
      'I fix software',
      'I optimise systems',
      'I design system architecture',
      'I solve problems',
      'I secure systems'
    ];

    // Wait for typing to complete at least one phrase
    await page.waitForTimeout(2000);

    // Get the current text
    const currentText = await typedText.textContent() || '';

    // Check if current text matches start of any expected phrase
    const matchesExpectedPhrase = expectedPhrases.some(phrase =>
      phrase.startsWith(currentText) || currentText.startsWith(phrase.substring(0, Math.min(phrase.length, currentText.length)))
    );

    expect(matchesExpectedPhrase).toBeTruthy();
  });

  test('should display arrow button at top of page', async ({ page }) => {
    // Ensure we're at the top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(100);

    const arrowButton = page.locator('.arrow-button');
    await expect(arrowButton).toBeVisible();
    await expect(arrowButton).not.toHaveClass(/hidden/);
  });

  test('should hide arrow button when scrolled down', async ({ page }) => {
    const arrowButton = page.locator('.arrow-button');

    // Initially visible at top
    await expect(arrowButton).toBeVisible();

    // Scroll down
    await page.evaluate(() => {
      window.scrollTo({ top: 100, behavior: 'instant' });
    });

    // Wait for scroll event to be processed
    await page.waitForTimeout(200);

    // Arrow button should have hidden class
    await expect(arrowButton).toHaveClass(/hidden/);
  });

  test('should show arrow button when scrolled back to top', async ({ page }) => {
    const arrowButton = page.locator('.arrow-button');

    // Scroll down first
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'instant' });
    });
    await page.waitForTimeout(200);

    // Verify it's hidden
    await expect(arrowButton).toHaveClass(/hidden/);

    // Scroll back to top
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(200);

    // Arrow button should be visible again
    await expect(arrowButton).not.toHaveClass(/hidden/);
  });

  test('should scroll to technologies section when arrow button is clicked', async ({ page }) => {
    // Ensure we're at the top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(100);

    const arrowButton = page.locator('.arrow-button');

    // Click the arrow button
    await arrowButton.click();

    // Wait for smooth scroll
    await page.waitForTimeout(1000);

    // Verify technologies section is in viewport
    const technologiesSection = page.locator('#technologies');
    await expect(technologiesSection).toBeInViewport();

    // Arrow button should now be hidden
    await expect(arrowButton).toHaveClass(/hidden/);
  });

  test('should display all hero content elements', async ({ page }) => {
    const heroContent = page.locator('.hero-content');
    await expect(heroContent).toBeVisible();

    const textContent = page.locator('.text-content');
    await expect(textContent).toBeVisible();

    const profileImage = page.locator('.profile-image');
    await expect(profileImage).toBeVisible();
  });

  test('should have container with all sections', async ({ page }) => {
    const container = page.locator('#home .container');
    await expect(container).toBeVisible();

    // Verify all main components are present
    await expect(page.locator('.hero-content')).toBeVisible();
    await expect(page.locator('.arrow-button')).toBeVisible();
  });
});
