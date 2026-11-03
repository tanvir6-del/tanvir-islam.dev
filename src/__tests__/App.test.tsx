import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

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

  it('allows adding and removing photos in the Photo Manager modal only when Owner Mode is unlocked', () => {
    sessionStorage.setItem('tanvir_portfolio_owner_unlocked_v1', 'true');
    render(<App />);

    fireEvent.click(screen.getByTestId('hero-manage-photos-btn'));

    // Add a new photo via URL
    const titleInput = screen.getByLabelText(/Photo Title \/ Label/i);
    const urlInput = screen.getByTestId('new-photo-url-input');
    fireEvent.change(titleInput, { target: { value: 'Castle McCulloch Suit Portrait' } });
    fireEvent.change(urlInput, { target: { value: '/assets/profile-headshot.jpg' } });
    fireEvent.click(screen.getByTestId('add-photo-url-btn'));

    expect(screen.getAllByText(/Castle McCulloch Suit Portrait/i).length).toBeGreaterThan(0);

    // Remove the default photo
    const removeDefaultBtn = screen.getByTestId('remove-photo-charlotte-executive-suit');
    fireEvent.click(removeDefaultBtn);
    expect(
      screen.queryByTestId('photo-item-charlotte-executive-suit')
    ).not.toBeInTheDocument();
  });

  it('validates Contact Form required fields and submits valid inquiries', async () => {
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
        /Thank you, Alex Mercer!/i
      );
    });
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
