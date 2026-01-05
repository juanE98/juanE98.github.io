# E2E Tests for Angular Portfolio Website

This directory contains Playwright end-to-end tests for the Angular portfolio website.

## Test Files

### timeline.spec.ts
Tests for the timeline/experience section:
- Verifies all 7 career events are displayed
- Confirms "Contal Services" is the first (most recent) event
- Tests scroll animations trigger on desktop (in-view class)
- Skips animation tests on mobile viewports
- Validates alternating left/right layout classes

### carousel.spec.ts
Tests for the technology icons carousel:
- Validates 48 icons are displayed (16 icons × 3 copies)
- Verifies icon src patterns (assets/icons/5-20.svg)
- Checks all images load successfully
- Confirms carousel structure and visibility

### footer.spec.ts
Tests for the footer component:
- Validates LinkedIn and GitHub social links are present
- Confirms links have target="_blank"
- Verifies links have rel="noopener noreferrer" security attributes
- Checks copyright text contains "Juan Espares"
- Validates Font Awesome icons are present

### accessibility.spec.ts
Tests for WCAG compliance and accessibility:
- Scans for critical WCAG violations using @axe-core/playwright
- Tests all sections (home, about, experience, technologies)
- Validates all images have alt attributes
- Confirms external links have security attributes (rel="noopener")
- Checks heading hierarchy
- Tests color contrast compliance
- Verifies keyboard accessibility
- Validates lang attribute on html element

## Running Tests

```bash
# Run all tests
npm run e2e

# Run tests in UI mode (interactive)
npm run e2e:ui

# Run tests in headed mode (see browser)
npm run e2e:headed

# View test report
npm run e2e:report
```

## Test Configuration

Tests are configured in `/home/juan/dev/website-portfolio/playwright.config.ts`:
- Base URL: http://localhost:4200
- Test browsers: Chrome, Firefox, Safari (desktop and mobile)
- Automatic dev server startup
- Screenshots on failure
- Trace on first retry

## Prerequisites

Make sure you have installed Playwright and its dependencies:

```bash
npm install
npx playwright install
```

## Mobile Testing

Some tests (like timeline animations) automatically skip on mobile viewports since animations are disabled on mobile devices (max-width: 768px) except for the carousel.

## Accessibility Testing

The accessibility tests use @axe-core/playwright to scan for WCAG 2.0 AA and WCAG 2.1 AA compliance. They focus on critical and serious violations while allowing for minor issues that don't significantly impact accessibility.
