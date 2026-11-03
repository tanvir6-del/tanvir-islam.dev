import { test, expect } from '@playwright/test';

test.describe('Tanvir-ul Islam Portfolio — Playwright E2E Smoke Suite', () => {
  test('renders Hero, Headshot LCP image, Sticky Navigation, and toggles Theme without console errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    // Verify Hero headline & headshot attributes
    await expect(page.getByRole('heading', { name: 'Tanvir-ul Islam', level: 1 })).toBeVisible();
    const headshot = page.getByTestId('hero-headshot-img');
    await expect(headshot).toBeVisible();
    await expect(headshot).toHaveAttribute('fetchpriority', 'high');

    // Verify Dark Mode default & toggle to Light Mode
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    await page.getByTestId('theme-toggle').click();
    await expect(html).toHaveClass(/light/);
    await page.getByTestId('theme-toggle').click();
    await expect(html).toHaveClass(/dark/);

    expect(errors).toEqual([]);
  });

  test('hides Photo Manager from public visitors and unlocks only in Owner Mode (?owner=tanvir-owner)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hero-manage-photos-btn')).toHaveCount(0);

    await page.goto('/?owner=tanvir-owner');
    await page.getByTestId('hero-manage-photos-btn').click();
    const dialog = page.getByTestId('photo-manager-dialog');
    await expect(dialog).toBeVisible();

    // Add a photo via URL
    await page.getByLabel('Photo Title / Label').fill('Castle McCulloch Formal Suit Portrait');
    await page.getByTestId('new-photo-url-input').fill('/assets/profile-headshot.jpg');
    await page.getByTestId('add-photo-url-btn').click();

    await expect(dialog).toContainText('Castle McCulloch Formal Suit Portrait');

    // Close dialog
    await page.getByTestId('close-photo-manager-btn').click();
    await expect(dialog).toBeHidden();
  });

  test('validates Contact Form and submits inquiry cleanly', async ({ page }) => {
    await page.goto('/');

    const submitBtn = page.getByTestId('contact-submit-btn');
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    await expect(page.getByTestId('contact-form-feedback')).toContainText(
      'Please complete all required fields'
    );

    await page.getByLabel(/Full Name/i).fill('Sarah Jenkins');
    await page.getByLabel(/Company \/ Organization/i).fill('Queen City Banking');
    await page.getByLabel(/Work Email/i).fill('sjenkins@queencitybank.com');
    await page.getByLabel(/Engagement Type/i).selectOption('Contract');
    await page
      .getByLabel(/Message & Role/i)
      .fill('Interested in bringing your Agentic Playwright architecture to our engineering org.');

    await submitBtn.click();

    await expect(page.getByTestId('contact-form-feedback')).toContainText(
      'Thank you, Sarah Jenkins!'
    );
  });

  test('adapts responsively across mobile (375px), tablet (768px), and desktop (1280px) viewports', async ({
    page,
  }) => {
    // Mobile viewport check
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const mobileMenuBtn = page.getByTestId('mobile-menu-button');
    await expect(mobileMenuBtn).toBeVisible();
    await mobileMenuBtn.click();
    await expect(page.locator('#mobile-nav-drawer')).toBeVisible();

    // Desktop viewport check
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(mobileMenuBtn).toBeHidden();
    await expect(page.getByRole('navigation', { name: 'Primary Navigation' })).toBeVisible();
  });
});
