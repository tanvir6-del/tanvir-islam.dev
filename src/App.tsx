import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  FileCode2,
  Filter,
  FolderGit2,
  Github,
  GraduationCap,
  ImagePlus,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import {
  COMPETENCY_CATEGORIES,
  EDUCATION_CREDENTIALS,
  EXPERIENCE_TIMELINE,
  FEATURED_PROJECTS,
  PROFILE_DATA,
} from './data/portfolioData';

type ThemeMode = 'dark' | 'light';

export function App() {
  // Theme state (Dark mode by default per requirements, synced with <meta name="color-scheme">)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('color-scheme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore storage errors
    }
    return 'dark';
  });

  // Mobile navigation drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Skills filter & search state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [skillSearch, setSkillSearch] = useState<string>('');

  // Active section tracking for Scrollspy fallback & aria-current
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Copy email feedback state
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Contact form state
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [engagementType, setEngagementType] = useState('Contract');
  const [message, setMessage] = useState('');
  const [botcheck, setBotcheck] = useState('');
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formFeedback, setFormFeedback] = useState('');
  const [directMailtoUrl, setDirectMailtoUrl] = useState<string | null>(null);
  const [directGmailUrl, setDirectGmailUrl] = useState<string | null>(null);

  // Calendar Booking Dialog state
  const [selectedMeetingDuration, setSelectedMeetingDuration] = useState<'15' | '30' | '45'>('30');
  const [bookingSlotConfirmed, setBookingSlotConfirmed] = useState<string | null>(null);

  // Refs for native <dialog> modal and sticky header
  const calendarDialogRef = useRef<HTMLDialogElement | null>(null);
  const stickyContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync theme to documentElement class and <meta name="color-scheme">
  useEffect(() => {
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    if (meta) {
      meta.setAttribute('content', theme);
    }
    try {
      localStorage.setItem('color-scheme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Modern Web Guidance: Scrollspy IntersectionObserver fallback + aria-current sync
  // and Sticky Header .is-stuck fallback
  useEffect(() => {
    const sections = document.querySelectorAll('main section[id]');
    if (typeof IntersectionObserver !== 'undefined') {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              if (id) setActiveSection(id);
            }
          });
        },
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
      );
      sections.forEach((sec) => sectionObserver.observe(sec));

      return () => sectionObserver.disconnect();
    }
  }, []);

  // Modern Web Guidance: Dialog light-dismiss fallback for browsers without native `closedBy`
  useEffect(() => {
    const dialog = calendarDialogRef.current;
    if (!dialog) return;

    const handleDialogClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isDialogContent) {
        dialog.close();
      }
    };

    if (typeof HTMLDialogElement !== 'undefined' && !('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', handleDialogClick);
      return () => dialog.removeEventListener('click', handleDialogClick);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const openCalendarModal = () => {
    setBookingSlotConfirmed(null);
    if (calendarDialogRef.current && typeof calendarDialogRef.current.showModal === 'function') {
      calendarDialogRef.current.showModal();
    } else if (calendarDialogRef.current) {
      calendarDialogRef.current.setAttribute('open', 'true');
    }
  };

  const closeCalendarModal = () => {
    if (calendarDialogRef.current && typeof calendarDialogRef.current.close === 'function') {
      calendarDialogRef.current.close();
    } else if (calendarDialogRef.current) {
      calendarDialogRef.current.removeAttribute('open');
    }
  };

  // Filtered Competencies
  const filteredCompetencies = COMPETENCY_CATEGORIES.filter((cat) => {
    const matchesCategory = selectedCategory === 'all' || cat.id === selectedCategory;
    const query = skillSearch.trim().toLowerCase();
    if (!query) return matchesCategory;
    const matchesText =
      cat.category.toLowerCase().includes(query) ||
      cat.summary.toLowerCase().includes(query) ||
      cat.skills.some((s) => s.toLowerCase().includes(query));
    return matchesCategory && matchesText;
  });

  // Contact form validation helpers (Modern Web Guidance:accessible-error-announcement)
  const isNameInvalid =
    (touchedFields.fullName || submitAttempted) && fullName.trim().length < 2;
  const isCompanyInvalid =
    (touchedFields.company || submitAttempted) && company.trim().length < 2;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailInvalid =
    (touchedFields.workEmail || submitAttempted) && !emailRegex.test(workEmail.trim());
  const isMessageInvalid =
    (touchedFields.message || submitAttempted) && message.trim().length < 10;

  const markTouched = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Spam honeypot check
    if (botcheck.trim() !== '') {
      return;
    }

    const validName = fullName.trim().length >= 2;
    const validCompany = company.trim().length >= 2;
    const validEmail = emailRegex.test(workEmail.trim());
    const validMsg = message.trim().length >= 10;

    if (!validName || !validCompany || !validEmail || !validMsg) {
      setFormStatus('error');
      setFormFeedback('Please complete all required fields with valid information before submitting.');
      return;
    }

    setFormStatus('submitting');
    setFormFeedback('');

    const subjectLine = `[Portfolio Inquiry - ${engagementType}] from ${fullName.trim()} (${company.trim()})`;
    const mailtoBody = `Name: ${fullName.trim()}\nCompany: ${company.trim()}\nWork Email: ${workEmail.trim()}\nEngagement Type: ${engagementType}\n\nMessage:\n${message.trim()}`;
    const mailtoLink = `mailto:${PROFILE_DATA.email}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(mailtoBody)}`;
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PROFILE_DATA.email)}&su=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(mailtoBody)}`;
    setDirectMailtoUrl(mailtoLink);
    setDirectGmailUrl(gmailLink);

    try {
      let deliveredByEdge = true;

      if (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY) {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
            subject: subjectLine,
            from_name: fullName.trim(),
            company: company.trim(),
            email: workEmail.trim(),
            recipient: PROFILE_DATA.email,
            engagement_type: engagementType,
            message: message.trim(),
          }),
        });
        if (!response.ok) throw new Error('Submission endpoint returned non-200');
      } else {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            subject: subjectLine,
            name: fullName.trim(),
            company: company.trim(),
            email: workEmail.trim(),
            engagement_type: engagementType,
            message: message.trim(),
          }),
        });
        if (!response.ok) throw new Error('Edge contact endpoint returned non-200');
        const data = await response.json().catch(() => null);
        if (data && data.delivered === false) {
          deliveredByEdge = false;
        }
      }

      setFormStatus('success');
      setFormFeedback(
        deliveredByEdge
          ? `Thank you, ${fullName.trim()}! Your ${engagementType} inquiry for ${company.trim()} has been sent to ${PROFILE_DATA.email}.`
          : `Thank you, ${fullName.trim()}! Your ${engagementType} inquiry for ${company.trim()} is ready for ${PROFILE_DATA.email} — click "Send in Gmail" below to send right from your browser.`
      );
      setFullName('');
      setCompany('');
      setWorkEmail('');
      setEngagementType('Contract');
      setMessage('');
      setTouchedFields({});
      setSubmitAttempted(false);
    } catch {
      setFormStatus('success');
      setFormFeedback(
        `Thank you, ${fullName.trim()}! Your ${engagementType} inquiry for ${company.trim()} is ready for ${PROFILE_DATA.email}. Click "Send in Gmail" below to send right from your browser.`
      );
      setFullName('');
      setCompany('');
      setWorkEmail('');
      setEngagementType('Contract');
      setMessage('');
      setTouchedFields({});
      setSubmitAttempted(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard?.writeText(PROFILE_DATA.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const navItems = [
    { id: 'hero', label: 'Overview', href: '#hero' },
    { id: 'competencies', label: 'Competencies', href: '#competencies' },
    { id: 'projects', label: 'Case Studies', href: '#projects' },
    { id: 'experience', label: 'Leadership', href: '#experience' },
    { id: 'education', label: 'Credentials', href: '#education' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#070b14] dark:text-slate-100 selection:bg-sky-500/30">
      {/* Skip to Main Content Link for Keyboard & Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-sky-500 focus:text-slate-950 focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* State-Aware Sticky Header (Modern Web Guidance: state-aware-sticky-headers + scrollspy) */}
      <div className="header-anchor-wrapper">
        <header
          ref={stickyContainerRef}
          className="sticky-site-container border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#070b14]/85 backdrop-blur-md"
        >
          <div className="sticky-site-bar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Brand Identity */}
            <a
              href="#hero"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                TI
              </div>
              <div>
                <span className="font-bold tracking-tight text-slate-900 dark:text-white block leading-none">
                  {PROFILE_DATA.name}
                </span>
                <span className="font-mono text-[11px] text-sky-600 dark:text-sky-400 tracking-wider uppercase block mt-1">
                  Principal SDET &bull; Agentic QE
                </span>
              </div>
            </a>

            {/* Desktop Scrollspy Navigation */}
            <nav
              aria-label="Primary Navigation"
              className="scrollspy-nav hidden md:flex items-center gap-1 lg:gap-2"
            >
              {navItems.map((item) => {
                const isCurrent = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={isCurrent ? 'true' : 'false'}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-b-2 transition-colors ${
                      isCurrent
                        ? 'target-current text-sky-600 dark:text-sky-400 border-sky-500 bg-sky-500/10'
                        : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Header Utility Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                data-testid="theme-toggle"
                aria-label={
                  theme === 'dark' ? 'Switch to light color scheme' : 'Switch to dark color scheme'
                }
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              <a
                href="#contact"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sm shadow-sky-500/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Hire / Consult</span>
              </a>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                data-testid="mobile-menu-button"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-drawer"
                aria-label="Toggle navigation menu"
                className="md:hidden p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <nav
              id="mobile-nav-drawer"
              aria-label="Mobile Navigation"
              className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1120] px-4 py-3 space-y-1"
            >
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-2 flex items-center gap-2 border-t border-slate-200 dark:border-slate-800">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-sky-500 text-slate-950"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Get in Touch</span>
                </a>
              </div>
            </nav>
          )}
        </header>
      </div>

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {/* ===================================================================
            1. HERO SECTION
           =================================================================== */}
        <section
          id="hero"
          aria-labelledby="hero-heading"
          className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 border-b border-slate-200/70 dark:border-slate-800/80"
        >
          {/* Ambient radial glow background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-sky-500/15 via-indigo-500/10 to-emerald-500/10 blur-3xl rounded-full"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Positioning, Elevator Pitch, CTAs, Social Badges */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-700 dark:text-sky-300 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available for Principal SDET, Staff QE &amp; Engineering Leadership</span>
                  <span className="text-slate-400 dark:text-slate-600">|</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    {PROFILE_DATA.location}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-sky-600 dark:text-sky-400 font-semibold">
                    Agentic AI Testing &bull; Go Microservices &bull; Enterprise Quality Governance
                  </p>
                  <h1
                    id="hero-heading"
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]"
                  >
                    {PROFILE_DATA.name}
                  </h1>
                  <p className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    {PROFILE_DATA.title}
                  </p>
                </div>

                <p className="pretty-text text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {PROFILE_DATA.subHeadline}
                </p>

                {/* Primary CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <a
                    href="#contact"
                    data-testid="cta-get-in-touch"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm shadow-lg shadow-sky-500/25 hover:-translate-y-0.5 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Get in Touch</span>
                  </a>

                  <a
                    href="#projects"
                    data-testid="cta-view-projects"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white dark:bg-slate-800/90 dark:hover:bg-slate-700/90 border border-slate-700 font-semibold text-sm hover:-translate-y-0.5 transition-all"
                  >
                    <FolderGit2 className="w-4 h-4 text-sky-400" />
                    <span>View Projects</span>
                  </a>

                  <a
                    href={PROFILE_DATA.resumeUrl}
                    download="Tanvir-ul-Islam-Principal-SDET-Resume.html"
                    data-testid="cta-download-resume"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 hover:border-sky-500/60 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:-translate-y-0.5 transition-all"
                  >
                    <Download className="w-4 h-4 text-sky-500" />
                    <span>Download Resume</span>
                  </a>
                </div>

                {/* Professional Social & Contact Badges */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={PROFILE_DATA.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="badge-github"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-200/70 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 hover:border-sky-500/50 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Github className="w-4 h-4 text-slate-900 dark:text-white" />
                    <span>github.com/tanvirislam06</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <a
                    href={PROFILE_DATA.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="badge-linkedin"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-200/70 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 hover:border-sky-500/50 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-sky-500" />
                    <span>linkedin.com/in/tislamsdet</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <a
                    href="#contact"
                    data-testid="badge-email"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-200/70 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 hover:border-sky-500/50 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span>{PROFILE_DATA.email}</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Executive Portrait (Static Codebase Asset) */}
              <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
                <div className="relative group">
                  {/* Subtle animated ring glow */}
                  <div
                    aria-hidden="true"
                    className="-inset-2 bg-gradient-to-tr from-sky-500 via-cyan-400 to-indigo-600 opacity-35 dark:opacity-45 blur-xl group-hover:opacity-65 transition-opacity duration-500 absolute rounded-[2.25rem]"
                  />

                  {/* Portrait Container */}
                  <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[340px] lg:h-[340px] overflow-hidden border-2 border-sky-400/50 dark:border-sky-400/40 bg-slate-950 shadow-2xl shadow-sky-950/50 ring-4 ring-sky-500/15 transition-all duration-300 rounded-[2rem]">
                    <img
                      src={PROFILE_DATA.headshotUrl}
                      alt={`${PROFILE_DATA.name} — ${PROFILE_DATA.title}`}
                      fetchpriority="high"
                      decoding="async"
                      width={440}
                      height={440}
                      data-testid="hero-headshot-img"
                      className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                    />

                    {/* Floating Identity Badge */}
                    <div className="absolute bottom-3 inset-x-3 px-3.5 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 flex items-center justify-between text-xs text-slate-200">
                      <div className="truncate pr-2">
                        <p className="font-semibold text-white truncate">{PROFILE_DATA.name}</p>
                        <p className="font-mono text-[11px] text-sky-400 truncate">
                          {PROFILE_DATA.location}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] shrink-0">
                        <ShieldCheck className="w-3 h-3" />
                        Principal SDET
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Executive Impact Metrics Bar */}
            <div className="mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {PROFILE_DATA.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80"
                >
                  <p className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-600 dark:text-sky-400">
                    {metric.value}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            2. CORE COMPETENCIES & SKILLS MATRIX
           =================================================================== */}
        <section
          id="competencies"
          aria-labelledby="competencies-heading"
          className="py-20 border-b border-slate-200/70 dark:border-slate-800/80"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sky-600 dark:text-sky-400 font-semibold mb-2">
                  <Cpu className="w-4 h-4" />
                  <span>Architecture &amp; Technical Depth</span>
                </div>
                <h2
                  id="competencies-heading"
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
                >
                  Core Competencies &amp; Skills Matrix
                </h2>
                <p className="pretty-text text-slate-600 dark:text-slate-400 mt-2 max-w-2xl text-sm sm:text-base">
                  Filter across autonomous agentic testing, cloud-native Go microservices, full-stack E2E automation, shift-left CI/CD governance, and production observability.
                </p>
              </div>

              {/* Search Input for Skills */}
              <div className="relative w-full md:w-72">
                <label htmlFor="skill-search-input" className="sr-only">
                  Search skills or tools
                </label>
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="skill-search-input"
                  type="search"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder="Filter by skill (e.g. Go, gRPC, MCP)..."
                  data-testid="skill-search-input"
                  className="w-full pl-9 pr-8 py-2 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                {skillSearch && (
                  <button
                    type="button"
                    onClick={() => setSkillSearch('')}
                    aria-label="Clear skill search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Category Filter Pills */}
            <div
              role="group"
              aria-label="Filter competencies by domain"
              className="flex flex-wrap items-center gap-2 mb-8"
            >
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                data-testid="filter-all"
                aria-pressed={selectedCategory === 'all'}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-500/40'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>All Domains ({COMPETENCY_CATEGORIES.length})</span>
              </button>

              {COMPETENCY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  data-testid={`filter-${cat.id}`}
                  aria-pressed={selectedCategory === cat.id}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm shadow-sky-500/30'
                      : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-500/40'
                  }`}
                >
                  {cat.shortLabel}
                </button>
              ))}
            </div>

            {/* Competency Cards Grid */}
            {filteredCompetencies.length === 0 ? (
              <div className="p-8 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  No matching skills found for &ldquo;{skillSearch}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSkillSearch('');
                  }}
                  className="mt-3 px-4 py-1.5 rounded-lg text-xs font-mono bg-sky-500/20 text-sky-400"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompetencies.map((item) => (
                  <article
                    key={item.id}
                    data-testid={`competency-card-${item.id}`}
                    className="group rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/90 hover:border-sky-500/50 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                          {item.badge}
                        </span>
                        <Terminal className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" />
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {item.category}
                      </h3>

                      <p className="pretty-text text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                        {item.summary}
                      </p>

                      {/* Skill Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/70"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===================================================================
            3. FEATURED CASE STUDIES & PROJECTS
           =================================================================== */}
        <section
          id="projects"
          aria-labelledby="projects-heading"
          className="deferred-section py-20 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-100/60 dark:bg-[#090f1d]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sky-600 dark:text-sky-400 font-semibold mb-2">
                <Layers className="w-4 h-4" />
                <span>Production Impact &amp; Open-Source Engineering</span>
              </div>
              <h2
                id="projects-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Featured Case Studies &amp; Projects
              </h2>
              <p className="pretty-text text-slate-600 dark:text-slate-400 mt-2 max-w-3xl text-sm sm:text-base">
                Deep-dive architectural breakdowns of enterprise agentic testing systems, Go core banking microservices harnesses, open-source developer CLI tooling, and multi-squad quality standardization.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {FEATURED_PROJECTS.map((project, idx) => (
                <article
                  key={project.id}
                  data-testid={`project-card-${project.id}`}
                  className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-sky-500/50 transition-all"
                >
                  <div>
                    {/* Top Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          0{idx + 1} &bull; {project.category}
                        </span>
                      </span>
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {project.domain}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {project.title}
                    </h3>

                    <p className="pretty-text text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                      {project.summary}
                    </p>

                    {/* Architectural Breakdown */}
                    <div className="space-y-4 mb-6">
                      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
                        <p className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold mb-1">
                          Engineering Challenge
                        </p>
                        <p className="pretty-text text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          {project.challenge}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-semibold mb-2">
                          Architecture &amp; Implementation
                        </p>
                        <ul className="space-y-1.5">
                          {project.architecture.map((point) => (
                            <li
                              key={point}
                              className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Key Outcomes & Business Impact */}
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <p className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                        Key Outcomes &amp; Impact
                      </p>
                      <ul className="space-y-1.5">
                        {project.outcomes.map((outcome) => (
                          <li
                            key={outcome}
                            className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Tech Stack & Repository Links */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {(project.repoUrl || project.secondaryLinks) && (
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid={`repo-link-${project.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30 hover:bg-sky-500/25 transition-colors"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>View Repository (pom-crawler)</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {project.secondaryLinks?.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-sky-400 transition-colors"
                          >
                            <span>{link.label}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            4. LEADERSHIP & EXPERIENCE TIMELINE + EXECUTIVE EDUCATION
           =================================================================== */}
        <section
          id="experience"
          aria-labelledby="experience-heading"
          className="deferred-section py-20 border-b border-slate-200/70 dark:border-slate-800/80"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sky-600 dark:text-sky-400 font-semibold mb-2">
                <Briefcase className="w-4 h-4" />
                <span>15+ Years Enterprise Track Record</span>
              </div>
              <h2
                id="experience-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Leadership &amp; Experience Timeline
              </h2>
              <p className="pretty-text text-slate-600 dark:text-slate-400 mt-2 max-w-3xl text-sm sm:text-base">
                Proven leadership across tier-1 banking, high-growth fintech, and cloud SaaS organizations—combining hands-on architecture with multi-squad engineering governance.
              </p>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-sky-500/30 dark:border-sky-500/30 space-y-10">
              {EXPERIENCE_TIMELINE.map((exp, index) => (
                <div
                  key={exp.id}
                  data-testid={`experience-item-${exp.id}`}
                  className="relative group"
                >
                  {/* Timeline Node Dot */}
                  <div
                    aria-hidden="true"
                    className={`w-4 h-4 rounded-full border-2 absolute -left-[31px] sm:-left-[39px] top-1.5 transition-transform group-hover:scale-125 ${
                      index === 0
                        ? 'bg-sky-400 border-sky-200 shadow-md shadow-sky-500/50'
                        : 'bg-slate-200 dark:bg-slate-800 border-sky-500/60'
                    }`}
                  />

                  <div className="rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:border-sky-500/40 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                            {exp.role}
                          </h3>
                          <span className="text-sky-600 dark:text-sky-400 font-semibold">
                            &mdash; {exp.company}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                          {exp.domainFocus} &bull; {exp.location}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {exp.period}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2 mt-4 mb-5">
                      {exp.highlights.map((bullet) => (
                        <li
                          key={bullet}
                          className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200/60 dark:border-slate-800/70">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Executive Education & Credentials Sub-section */}
            <div id="education" className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sky-600 dark:text-sky-400 font-semibold mb-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Continuous Executive &amp; Technical Mastery</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Executive Education &amp; Testing Credentials
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {EDUCATION_CREDENTIALS.map((cred) => (
                  <div
                    key={cred.id}
                    data-testid={`credential-${cred.id}`}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                          {cred.category}
                        </span>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          {cred.yearOrNote}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {cred.title}
                      </h4>
                      <p className="text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2">
                        {cred.institution}
                      </p>
                      <p className="pretty-text text-sm text-slate-600 dark:text-slate-400">
                        {cred.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            5. INBOUND CONTACT & CONVERSION HUB
           =================================================================== */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="deferred-section py-20 bg-slate-100/70 dark:bg-[#060911]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Direct Contact Card + Calendar Booking Embed Trigger */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sky-600 dark:text-sky-400 font-semibold mb-2">
                    <Mail className="w-4 h-4" />
                    <span>Inbound Contact &amp; Conversion Hub</span>
                  </div>
                  <h2
                    id="contact-heading"
                    className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
                  >
                    Let&apos;s Architect Resilient Quality Together
                  </h2>
                  <p className="pretty-text text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base">
                    Available for Principal SDET roles, VP/Director of Quality Engineering leadership, and advisory consulting on Agentic AI testing and microservices reliability.
                  </p>
                </div>

                {/* Calendar Booking Card (Cal.com / Calendly Consultation Hub) */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-transparent border border-sky-500/30 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-sky-500 dark:text-sky-300 font-semibold">
                        Instant Scheduling (Cal.com / Calendly)
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                        Book an Introductory Consultation
                      </h3>
                    </div>
                    <Calendar className="w-6 h-6 text-sky-400 shrink-0" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    Schedule a 15-minute recruiter intro, 30-minute Principal SDET architecture review, or 45-minute enterprise quality advisory session directly.
                  </p>
                  <button
                    type="button"
                    onClick={openCalendarModal}
                    data-testid="open-calendar-booking-btn"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm shadow-md shadow-sky-500/20 transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Intro Call (Cal.com / Calendly)</span>
                  </button>
                </div>

                {/* Direct Contact Card */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Direct Executive Contact
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800">
                      <div className="flex items-center gap-2.5 truncate">
                        <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PROFILE_DATA.email)}&su=${encodeURIComponent('Executive / Principal SDET Inquiry — Tanvir-ul Islam')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-sky-400 truncate"
                        >
                          {PROFILE_DATA.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PROFILE_DATA.email)}&su=${encodeURIComponent('Executive / Principal SDET Inquiry — Tanvir-ul Islam')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid="gmail-compose-btn"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30 hover:bg-sky-500/25"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Gmail</span>
                        </a>
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          data-testid="copy-email-btn"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-400"
                        >
                          {copiedEmail ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800">
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                      <a
                        href={`tel:${PROFILE_DATA.phone}`}
                        className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-sky-400"
                      >
                        {PROFILE_DATA.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800">
                      <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                        {PROFILE_DATA.location}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <a
                      href={PROFILE_DATA.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-sky-500/50 text-xs font-mono font-semibold"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={PROFILE_DATA.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-sky-500/50 text-xs font-mono font-semibold"
                    >
                      <Linkedin className="w-4 h-4 text-sky-500" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Accessible Contact Form (Modern Web Guidance compliant) */}
              <div className="lg:col-span-7">
                <form
                  onSubmit={handleContactSubmit}
                  noValidate
                  data-testid="contact-form"
                  aria-label="Contact Tanvir-ul Islam"
                  className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 shadow-lg space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Send a Direct Inquiry
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Routed directly to <span className="font-mono">{PROFILE_DATA.email}</span> with spam protection. Required fields are marked with <span aria-hidden="true">*</span>.
                      </p>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  </div>

                  {/* Honeypot field for spam bots */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="botcheck-field">Do not fill this field</label>
                    <input
                      id="botcheck-field"
                      type="text"
                      name="botcheck"
                      tabIndex={-1}
                      autoComplete="off"
                      value={botcheck}
                      onChange={(e) => setBotcheck(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="contact-full-name"
                        className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
                      >
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <span id="name-hint" className="field-hint text-slate-500 dark:text-slate-400">
                        Your full name (at least 2 characters)
                      </span>
                      <input
                        id="contact-full-name"
                        name="fullName"
                        type="text"
                        required
                        minLength={2}
                        autoComplete="name"
                        value={fullName}
                        onBlur={() => markTouched('fullName')}
                        onChange={(e) => setFullName(e.target.value)}
                        aria-describedby="name-hint"
                        aria-errormessage="name-error"
                        aria-invalid={isNameInvalid ? 'true' : undefined}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          isNameInvalid ? 'user-invalid-fallback' : ''
                        }`}
                        placeholder="Jane Doe"
                      />
                      <div id="name-error" role="alert" className="error-msg">
                        <span aria-hidden="true">❌</span>
                        <span>Please enter your full name (minimum 2 characters).</span>
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label
                        htmlFor="contact-company"
                        className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
                      >
                        Company / Organization <span className="text-rose-500">*</span>
                      </label>
                      <span
                        id="company-hint"
                        className="field-hint text-slate-500 dark:text-slate-400"
                      >
                        Hiring organization or consultancy
                      </span>
                      <input
                        id="contact-company"
                        name="company"
                        type="text"
                        required
                        minLength={2}
                        autoComplete="organization"
                        value={company}
                        onBlur={() => markTouched('company')}
                        onChange={(e) => setCompany(e.target.value)}
                        aria-describedby="company-hint"
                        aria-errormessage="company-error"
                        aria-invalid={isCompanyInvalid ? 'true' : undefined}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          isCompanyInvalid ? 'user-invalid-fallback' : ''
                        }`}
                        placeholder="Enterprise FinTech Corp"
                      />
                      <div id="company-error" role="alert" className="error-msg">
                        <span aria-hidden="true">❌</span>
                        <span>Please enter your company or organization name.</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Work Email (Modern Web Guidance: format hint placed above input) */}
                    <div>
                      <label
                        htmlFor="contact-work-email"
                        className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
                      >
                        Work Email <span className="text-rose-500">*</span>
                      </label>
                      <span id="email-hint" className="field-hint text-slate-500 dark:text-slate-400">
                        Format: name@company.com
                      </span>
                      <input
                        id="contact-work-email"
                        name="workEmail"
                        type="email"
                        required
                        autoComplete="email"
                        value={workEmail}
                        onBlur={() => markTouched('workEmail')}
                        onChange={(e) => setWorkEmail(e.target.value)}
                        aria-describedby="email-hint"
                        aria-errormessage="email-error"
                        aria-invalid={isEmailInvalid ? 'true' : undefined}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          isEmailInvalid ? 'user-invalid-fallback' : ''
                        }`}
                        placeholder="jane.doe@company.com"
                      />
                      <div id="email-error" role="alert" className="error-msg">
                        <span aria-hidden="true">❌</span>
                        <span>Please enter a valid work email address.</span>
                      </div>
                    </div>

                    {/* Engagement Type */}
                    <div>
                      <label
                        htmlFor="contact-engagement-type"
                        className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
                      >
                        Engagement Type <span className="text-rose-500">*</span>
                      </label>
                      <span
                        id="engagement-hint"
                        className="field-hint text-slate-500 dark:text-slate-400"
                      >
                        Select the primary engagement model
                      </span>
                      <select
                        id="contact-engagement-type"
                        name="engagementType"
                        required
                        value={engagementType}
                        onChange={(e) => setEngagementType(e.target.value)}
                        aria-describedby="engagement-hint"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="Contract">Contract (Principal SDET / Lead Architect)</option>
                        <option value="Full-time Leadership">
                          Full-time Leadership (Principal / Director / VP QE)
                        </option>
                        <option value="Consulting/Advisory">
                          Consulting / Advisory (Agentic AI &amp; Test Governance)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
                    >
                      Message &amp; Role / Project Context <span className="text-rose-500">*</span>
                    </label>
                    <span id="message-hint" className="field-hint text-slate-500 dark:text-slate-400">
                      Share key goals, tech stack, timeline, or role details (minimum 10 characters)
                    </span>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      minLength={10}
                      value={message}
                      onBlur={() => markTouched('message')}
                      onChange={(e) => setMessage(e.target.value)}
                      aria-describedby="message-hint"
                      aria-errormessage="message-error"
                      aria-invalid={isMessageInvalid ? 'true' : undefined}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isMessageInvalid ? 'user-invalid-fallback' : ''
                      }`}
                      placeholder="Hi Tanvir, we're scaling our agentic Playwright & Go microservices testing architecture and would love to discuss..."
                    />
                    <div id="message-error" role="alert" className="error-msg">
                      <span aria-hidden="true">❌</span>
                      <span>Please enter a message of at least 10 characters.</span>
                    </div>
                  </div>

                  {/* Form Status Alert */}
                  {formFeedback && (
                    <div
                      role="status"
                      data-testid="contact-form-feedback"
                      className={`p-4 rounded-xl text-sm font-medium flex flex-wrap items-center justify-between gap-3 ${
                        formStatus === 'error'
                          ? 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300'
                          : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {formStatus === 'error' ? (
                          <X className="w-5 h-5 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                        )}
                        <span>{formFeedback}</span>
                      </div>
                      {formStatus === 'success' && (directGmailUrl || directMailtoUrl) && (
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {directGmailUrl && (
                            <a
                              href={directGmailUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-testid="direct-gmail-fallback-link"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Send in Gmail</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {directMailtoUrl && (
                            <a
                              href={directMailtoUrl}
                              data-testid="direct-mailto-fallback-link"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15 font-semibold text-xs transition-colors"
                            >
                              <span>Default Mail App</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Button (Kept enabled per Modern Web Guidance: required-field-feedback) */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="submit"
                      data-testid="contact-submit-btn"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm shadow-lg shadow-sky-500/20 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {formStatus === 'submitting' ? 'Sending Inquiry...' : 'Send Message'}
                      </span>
                    </button>

                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Direct route: {PROFILE_DATA.email}
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===================================================================
          FOOTER
         =================================================================== */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-10 bg-white dark:bg-[#050811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">{PROFILE_DATA.name}</span>
            <span>&bull;</span>
            <span>{PROFILE_DATA.title}</span>
            <span>&bull;</span>
            <span>{PROFILE_DATA.location}</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <a
              href={PROFILE_DATA.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href={PROFILE_DATA.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="#contact"
              className="hover:text-sky-400 transition-colors"
            >
              {PROFILE_DATA.email}
            </a>
          </div>
        </div>
      </footer>

      {/* ===================================================================
          MODAL: CALENDAR BOOKING (<dialog closedby="any">)
         =================================================================== */}
      <dialog
        ref={calendarDialogRef}
        id="calendar-booking-dialog"
        closedby="any"
        aria-labelledby="calendar-dialog-title"
        data-testid="calendar-booking-dialog"
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 p-0 shadow-2xl"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-sky-500">
              Cal.com / Calendly Consultation Scheduler
            </span>
            <h2 id="calendar-dialog-title" className="text-xl font-bold mt-0.5">
              Book Time with {PROFILE_DATA.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCalendarModal}
            data-testid="close-calendar-dialog-btn"
            aria-label="Close consultation scheduler"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { dur: '15', title: '15 Min Intro', desc: 'Recruiter & Role Fit' },
                { dur: '30', title: '30 Min Deep Dive', desc: 'Hiring Manager / SDET' },
                { dur: '45', title: '45 Min Advisory', desc: 'Agentic AI & QE Strategy' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.dur}
                type="button"
                onClick={() => {
                  setSelectedMeetingDuration(opt.dur);
                  setBookingSlotConfirmed(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedMeetingDuration === opt.dur
                    ? 'border-sky-500 bg-sky-500/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <p className="font-mono text-xs font-bold text-sky-500">{opt.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Select a preferred Eastern Time (ET — Charlotte, NC) window to generate a calendar invite with {PROFILE_DATA.email}:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Tomorrow • 10:00 AM ET',
                'Tomorrow • 2:00 PM ET',
                'Thursday • 11:30 AM ET',
                'Friday • 1:00 PM ET',
              ].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setBookingSlotConfirmed(slot)}
                  data-testid={`slot-${slot}`}
                  className={`px-3 py-2 rounded-lg text-xs font-mono border transition-colors ${
                    bookingSlotConfirmed === slot
                      ? 'bg-emerald-500 text-slate-950 font-semibold border-emerald-400'
                      : 'border-slate-300 dark:border-slate-700 hover:border-sky-500'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {bookingSlotConfirmed && (
            <div
              role="status"
              data-testid="booking-confirmed-banner"
              className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 flex flex-wrap items-center justify-between gap-3"
            >
              <span>
                Selected <strong>{selectedMeetingDuration}-min consultation</strong> for{' '}
                <strong>{bookingSlotConfirmed}</strong>.
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    PROFILE_DATA.email
                  )}&su=${encodeURIComponent(
                    `[${selectedMeetingDuration}-Min Consultation Request] ${bookingSlotConfirmed}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-xs"
                >
                  <span>Confirm in Gmail</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`mailto:${PROFILE_DATA.email}?subject=${encodeURIComponent(
                    `[${selectedMeetingDuration}-Min Consultation Request] ${bookingSlotConfirmed}`
                  )}`}
                  className="px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs"
                >
                  Mail App
                </a>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}

export default App;
