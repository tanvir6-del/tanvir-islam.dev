import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../App';
import worker from '../worker';

describe('Tanvir-ul Islam Portfolio Website — Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders Hero section with Tanvir-ul Islam branding, title, headshot, and primary CTAs (and hides owner photo controls from public visitors)', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /Tanvir-ul Islam/i, level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Principal SDET & Quality Engineering Leader/i).length
    ).toBeGreaterThan(0);

    const headshot = screen.getByTestId('hero-headshot-img') as HTMLImageElement;
    expect(headshot).toBeInTheDocument();
    expect(headshot.getAttribute('src')).toBe('/assets/profile-headshot.jpg');

    // Public visitors must NOT see owner photo management buttons
    expect(screen.queryByTestId('hero-manage-photos-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('open-photo-manager-header')).not.toBeInTheDocument();

    expect(screen.getByTestId('cta-get-in-touch')).toHaveAttribute('href', '#contact');
    expect(screen.getByTestId('cta-view-projects')).toHaveAttribute('href', '#projects');
    expect(screen.getByTestId('cta-download-resume')).toBeInTheDocument();
    expect(screen.getByTestId('badge-github')).toHaveAttribute(
      'href',
      'https://github.com/tanvirislam06'
    );
    expect(screen.getByTestId('badge-linkedin')).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/tislamsdet/'
    );
    expect(screen.getByTestId('badge-email')).toHaveAttribute(
      'href',
      '#contact'
    );
    expect(screen.getByTestId('badge-email')).toHaveTextContent('contact@tanvir-islam.dev');
  });

  it('filters Core Competencies & Skills Matrix by category and search query', () => {
    render(<App />);

    // Initially all 5 categories are visible
    expect(screen.getByTestId('competency-card-agentic-ai')).toBeInTheDocument();
    expect(screen.getByTestId('competency-card-microservices-backend')).toBeInTheDocument();

    // Filter to Microservices & Backend only
    fireEvent.click(screen.getByTestId('filter-microservices-backend'));
    expect(screen.getByTestId('competency-card-microservices-backend')).toBeInTheDocument();
    expect(screen.queryByTestId('competency-card-agentic-ai')).not.toBeInTheDocument();

    // Reset to All and search for "@playwright/mcp"
    fireEvent.click(screen.getByTestId('filter-all'));
    const searchInput = screen.getByTestId('skill-search-input');
    fireEvent.change(searchInput, { target: { value: '@playwright/mcp' } });
    expect(screen.getByTestId('competency-card-agentic-ai')).toBeInTheDocument();
    expect(screen.queryByTestId('competency-card-microservices-backend')).not.toBeInTheDocument();
  });

  it('renders all 4 Featured Case Studies & Leadership Timeline + Executive Education', () => {
    render(<App />);

    expect(
      screen.getByTestId('project-card-agentic-playwright-framework')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('project-card-core-banking-microservices')
    ).toBeInTheDocument();
    expect(screen.getByTestId('project-card-pom-crawler-open-source')).toBeInTheDocument();
    expect(screen.getByTestId('project-card-enterprise-jsdoc-standardization')).toBeInTheDocument();

    expect(screen.getByTestId('repo-link-pom-crawler-open-source')).toHaveAttribute(
      'href',
      'https://github.com/tanvirislam06/pom-crawler'
    );

    // Experience Timeline & Credentials
    expect(screen.getByTestId('experience-item-bofa-principal-2025')).toBeInTheDocument();
    expect(screen.getByTestId('experience-item-stash-lead-sdet')).toBeInTheDocument();
    expect(screen.getByTestId('credential-stanford-hci')).toBeInTheDocument();
    expect(screen.getByTestId('credential-rst-bach-bolton')).toBeInTheDocument();
  });

  it('renders static profile headshot without any UI for adding or removing photos', () => {
    render(<App />);

    const headshot = screen.getByTestId('hero-headshot-img') as HTMLImageElement;
    expect(headshot).toBeInTheDocument();
    expect(headshot.getAttribute('src')).toBe('/assets/profile-headshot.jpg');

    expect(screen.queryByTestId('hero-manage-photos-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('open-photo-manager-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('photo-manager-dialog')).not.toBeInTheDocument();
  });

  it('validates Contact Form required fields and submits valid inquiries via same-origin /api/contact', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({ ok: true, delivered: true, provider: 'cloudflare-email-routing' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    render(<App />);

    const submitBtn = screen.getByTestId('contact-submit-btn');
    fireEvent.click(submitBtn);

    // Expect accessible validation feedback when submitted empty
    expect(screen.getByTestId('contact-form-feedback')).toHaveTextContent(
      /Please complete all required fields/i
    );

    // Fill out valid fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Alex Mercer' },
    });
    fireEvent.change(screen.getByLabelText(/Company \/ Organization/i), {
      target: { value: 'Charlotte FinTech Labs' },
    });
    fireEvent.change(screen.getByLabelText(/Work Email/i), {
      target: { value: 'alex.mercer@fintechlabs.io' },
    });
    fireEvent.change(screen.getByLabelText(/Engagement Type/i), {
      target: { value: 'Full-time Leadership' },
    });
    fireEvent.change(screen.getByLabelText(/Message & Role/i), {
      target: {
        value: 'We would love to discuss a Principal SDET leadership role on our core platform.',
      },
    });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('contact-form-feedback')).toHaveTextContent(
        /Thank you, Alex Mercer! Your Full-time Leadership inquiry for Charlotte FinTech Labs has been sent to contact@tanvir-islam\.dev\./i
      );
    });

    // Assert same-origin /api/contact endpoint was called (never cross-origin formsubmit.co)
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      })
    );

    // Verify both browser Gmail compose link and mailto fallback link are rendered with pre-filled parameters
    const gmailLink = screen.getByTestId('direct-gmail-fallback-link');
    expect(gmailLink).toHaveAttribute(
      'href',
      expect.stringContaining('https://mail.google.com/mail/?view=cm&fs=1&to=contact%40tanvir-islam.dev')
    );
    expect(gmailLink).toHaveAttribute('href', expect.stringContaining('Alex%20Mercer'));

    const mailtoLink = screen.getByTestId('direct-mailto-fallback-link');
    expect(mailtoLink).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:contact@tanvir-islam.dev?subject=')
    );

    // Verify form fields are cleared and do NOT show post-submission validation errors
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Full Name/i)).not.toHaveAttribute('aria-invalid');
    expect(screen.getByLabelText(/Company \/ Organization/i)).not.toHaveAttribute('aria-invalid');
    expect(screen.getByLabelText(/Work Email/i)).not.toHaveAttribute('aria-invalid');
    expect(screen.getByLabelText(/Message & Role/i)).not.toHaveAttribute('aria-invalid');

    // Verify Direct Executive Contact card Gmail compose button
    expect(screen.getByTestId('gmail-compose-btn')).toHaveAttribute(
      'href',
      expect.stringContaining('https://mail.google.com/mail/?view=cm&fs=1&to=contact%40tanvir-islam.dev')
    );

    fetchSpy.mockRestore();
  });

  it('handles Send Message form fallback gracefully when edge email binding is inactive or offline', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({ ok: true, delivered: false, reason: 'CONTACT_EMAIL binding not active' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    render(<App />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Jordan Taylor' },
    });
    fireEvent.change(screen.getByLabelText(/Company \/ Organization/i), {
      target: { value: 'Apex Digital Banking' },
    });
    fireEvent.change(screen.getByLabelText(/Work Email/i), {
      target: { value: 'jtaylor@apexbank.com' },
    });
    fireEvent.change(screen.getByLabelText(/Engagement Type/i), {
      target: { value: 'Consulting/Advisory' },
    });
    fireEvent.change(screen.getByLabelText(/Message & Role/i), {
      target: {
        value: 'Need advisory support for our Go microservices contract testing architecture.',
      },
    });

    fireEvent.click(screen.getByTestId('contact-submit-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('contact-form-feedback')).toHaveTextContent(
        /Thank you, Jordan Taylor! Your Consulting\/Advisory inquiry for Apex Digital Banking is ready for contact@tanvir-islam\.dev/i
      );
    });

    expect(screen.getByTestId('direct-gmail-fallback-link')).toHaveAttribute(
      'href',
      expect.stringContaining('Jordan%20Taylor')
    );

    fetchSpy.mockRestore();
  });

  it('delivers email via Cloudflare Worker /api/contact handler using CONTACT_EMAIL binding', async () => {
    const sendSpy = vi.fn().mockResolvedValue(undefined);
    const req = new Request('https://tanvir-islam.dev/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: '[Portfolio Inquiry - Contract] from Elena Vance (Vance FinTech)',
        name: 'Elena Vance',
        company: 'Vance FinTech',
        email: 'elena@vancefintech.com',
        engagement_type: 'Contract',
        message: 'Looking for a Principal SDET to lead our Playwright MCP automation platform.',
      }),
    });

    const res = await worker.fetch(req, {
      CONTACT_EMAIL: { send: sendSpy },
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      ok: true,
      delivered: true,
      provider: 'cloudflare-email-routing',
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    const sentMsg = sendSpy.mock.calls[0][0];
    expect(sentMsg.from).toBe('contact@tanvir-islam.dev');
    expect(sentMsg.to).toBe('tanvir6@gmail.com');
    expect(sentMsg.raw).toContain('Reply-To: <elena@vancefintech.com>');
    expect(sentMsg.raw).toContain('Elena Vance');
  });

  it('toggles between dark mode (default) and light mode', () => {
    render(<App />);

    const toggleBtn = screen.getByTestId('theme-toggle');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(toggleBtn);
    expect(document.documentElement.classList.contains('light')).toBe(true);

    fireEvent.click(toggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
