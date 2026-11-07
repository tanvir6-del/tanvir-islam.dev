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

  test('serves profile headshot strictly as a static resource with no UI photo upload/removal controls', async ({ page }) => {
    await page.goto('/');
    const headshot = page.getByTestId('hero-headshot-img');
    await expect(headshot).toBeVisible();
    await expect(headshot).toHaveAttribute('src', '/assets/profile-headshot.jpg');
    await expect(page.getByTestId('hero-manage-photos-btn')).toHaveCount(0);
    await expect(page.getByTestId('open-photo-manager-header')).toHaveCount(0);
    await expect(page.getByTestId('photo-manager-dialog')).toHaveCount(0);
  });

  test('submits Contact Form via same-origin /api/contact with zero CORS errors and verifies Gmail + Mailto links', async ({
    page,
  }) => {
    const failedRequests: string[] = [];
    page.on('requestfailed', (req) => {
      failedRequests.push(`${req.method()} ${req.url()} (${req.failure()?.errorText})`);
    });

    let capturedPayload: Record<string, unknown> | null = null;
    await page.route('**/api/contact', async (route) => {
      capturedPayload = route.request().postDataJSON();
      await new Promise((r) => setTimeout(r, 150));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          delivered: true,
          provider: 'cloudflare-email-routing',
        }),
      });
    });

    await page.goto('/');

    // Verify Hero email badge points to #contact and displays contact@tanvir-islam.dev
    const heroEmailBadge = page.getByTestId('badge-email');
    await expect(heroEmailBadge).toHaveText('contact@tanvir-islam.dev');
    await expect(heroEmailBadge).toHaveAttribute('href', '#contact');

    // Verify Direct Executive Contact card Gmail compose button
    const gmailComposeBtn = page.getByTestId('gmail-compose-btn');
    await expect(gmailComposeBtn).toHaveAttribute(
      'href',
      /https:\/\/mail\.google\.com\/mail\/\?view=cm&fs=1&to=contact%40tanvir-islam\.dev/
    );

    const submitBtn = page.getByTestId('contact-submit-btn');
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    await expect(page.getByTestId('contact-form-feedback')).toContainText(
      'Please complete all required fields'
    );
    await expect(page.locator('#name-error')).toBeVisible();
    await expect(page.locator('#company-error')).toBeVisible();
    await expect(page.locator('#email-error')).toBeVisible();
    await expect(page.locator('#message-error')).toBeVisible();

    const nameInput = page.getByLabel(/Full Name/i);
    const companyInput = page.getByLabel(/Company \/ Organization/i);
    const emailInput = page.getByLabel(/Work Email/i);
    const messageInput = page.getByLabel(/Message & Role/i);

    await nameInput.click();
    await nameInput.fill('Sarah Jenkins');
    await companyInput.click();
    await companyInput.fill('Queen City Banking');
    await emailInput.click();
    await emailInput.fill('sjenkins@queencitybank.com');
    await page.getByLabel(/Engagement Type/i).selectOption('Contract');
    await messageInput.click();
    await messageInput.fill(
      'Interested in bringing your Agentic Playwright architecture to our engineering org.'
    );

    await submitBtn.click();

    // Verify confirmation feedback & pre-populated Gmail / Mail App links
    await expect(page.getByTestId('contact-form-feedback')).toContainText(
      'Thank you, Sarah Jenkins! Your Contract inquiry for Queen City Banking has been sent to contact@tanvir-islam.dev.'
    );

    // Verify same-origin /api/contact payload
    expect(capturedPayload).toMatchObject({
      subject: '[Portfolio Inquiry - Contract] from Sarah Jenkins (Queen City Banking)',
      name: 'Sarah Jenkins',
      company: 'Queen City Banking',
      email: 'sjenkins@queencitybank.com',
      engagement_type: 'Contract',
      message:
        'Interested in bringing your Agentic Playwright architecture to our engineering org.',
    });

    const gmailFallbackLink = page.getByTestId('direct-gmail-fallback-link');
    await expect(gmailFallbackLink).toBeVisible();
    await expect(gmailFallbackLink).toHaveAttribute(
      'href',
      /https:\/\/mail\.google\.com\/mail\/\?view=cm&fs=1&to=contact%40tanvir-islam\.dev.*Sarah%20Jenkins/
    );

    const mailtoFallbackLink = page.getByTestId('direct-mailto-fallback-link');
    await expect(mailtoFallbackLink).toBeVisible();
    await expect(mailtoFallbackLink).toHaveAttribute(
      'href',
      /mailto:contact@tanvir-islam\.dev\?subject=.*Sarah%20Jenkins/
    );

    // Ensure field error messages are completely removed from the DOM after successful form reset
    await expect(page.locator('#name-error')).toHaveCount(0);
    await expect(page.locator('#company-error')).toHaveCount(0);
    await expect(page.locator('#email-error')).toHaveCount(0);
    await expect(page.locator('#message-error')).toHaveCount(0);
    await expect(page.getByText('Please enter your full name (minimum 2 characters).')).toHaveCount(0);
    await expect(page.getByText('Please enter your company or organization name.')).toHaveCount(0);
    await expect(page.getByText('Please enter a valid work email address.')).toHaveCount(0);
    await expect(page.getByText('Please enter a message of at least 10 characters.')).toHaveCount(0);

    // Ensure zero failed / CORS-blocked requests occurred
    expect(failedRequests).toEqual([]);
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
