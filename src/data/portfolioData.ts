export interface PhotoItem {
  id: string;
  title: string;
  location: string;
  url: string;
  isDefault?: boolean;
  caption: string;
}

export interface CompetencyCategory {
  id: string;
  category: string;
  shortLabel: string;
  badge: string;
  summary: string;
  skills: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  domain: string;
  category: string;
  summary: string;
  challenge: string;
  architecture: string[];
  outcomes: string[];
  techStack: string[];
  repoUrl?: string;
  secondaryLinks?: { label: string; url: string }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  domainFocus: string;
  highlights: string[];
  technologies: string[];
}

export interface EducationCredential {
  id: string;
  title: string;
  institution: string;
  yearOrNote: string;
  category: 'Executive Leadership' | 'Testing Methodology' | 'Engineering & Product';
  description: string;
}

export const PROFILE_DATA = {
  name: 'Tanvir-ul Islam',
  title: 'Principal SDET & Quality Engineering Leader',
  subHeadline:
    'Over 15 years architecting enterprise-grade test automation frameworks, resilient cloud-native microservices testing, and next-generation agentic AI test workflows across banking and fintech leaders.',
  location: 'Charlotte / Huntersville, NC',
  phone: '917-639-7964',
  email: 'tanvir6@gmail.com',
  github: 'https://github.com/tanvirislam06',
  linkedin: 'https://www.linkedin.com/in/tislamsdet/',
  resumeUrl: '/assets/Tanvir_Ul_Islam_Resume.html',
  metrics: [
    { value: '15+', label: 'Years in Enterprise QE & FinTech' },
    { value: '10+', label: 'Engineering Squads Standardized' },
    { value: 'Full-Stack', label: 'Agentic UI, API, gRPC & DB Validation' },
    { value: '99.98%', label: 'Production Release Reliability' },
  ],
};

export const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: 'charlotte-executive-suit',
    title: 'Executive Headshot in Suit (Charlotte)',
    location: 'Charlotte, NC',
    url: '/assets/profile-headshot.jpg',
    isDefault: true,
    caption: 'Recent executive portrait in tailored navy suit — Charlotte, NC',
  },
];

export const COMPETENCY_CATEGORIES: CompetencyCategory[] = [
  {
    id: 'agentic-ai',
    category: 'Agentic & AI Testing',
    shortLabel: 'Agentic AI',
    badge: 'Next-Gen Autonomy',
    summary:
      'Autonomous web testing systems utilizing AI decision agents, Model Context Protocol (@playwright/mcp), and self-healing DOM recovery across multi-squad enterprise applications.',
    skills: [
      'Playwright',
      'Model Context Protocol (@playwright/mcp)',
      'Self-Healing Test Patterns',
      'GitHub Copilot Agents & Skills',
      'Claude AI Workflows',
      'Spec-Driven Development',
      'Autonomous DOM Recovery',
    ],
  },
  {
    id: 'microservices-backend',
    category: 'Microservices & Backend',
    shortLabel: 'Microservices & Go',
    badge: 'Cloud-Native Core',
    summary:
      'High-throughput backend integration frameworks validating distributed transactions, payment processing workflows, gRPC streams, and relational/distributed database state integrity.',
    skills: [
      'Go (Ginkgo/Gomega)',
      'REST APIs',
      'gRPC & Protobuf',
      'Contract Testing',
      'CockroachDB',
      'PostgreSQL',
      'MS SQL',
      'MongoDB & Oracle',
      'SuperTest & Mocha',
    ],
  },
  {
    id: 'web-mobile-e2e',
    category: 'Web & Mobile E2E',
    shortLabel: 'Web & Mobile E2E',
    badge: 'Cross-Platform UI',
    summary:
      'Deterministic, parallelized end-to-end UI and API automation architectures with automated Page Object generation and strict accessibility/performance assertions.',
    skills: [
      'Playwright (TypeScript/JavaScript & Python)',
      'Cypress',
      'WebdriverIO',
      'TestCafe',
      'React Native',
      'Cucumber BDD',
      'Sinon.js',
    ],
  },
  {
    id: 'cicd-governance',
    category: 'CI/CD Governance & Shift-Left',
    shortLabel: 'CI/CD & Shift-Left',
    badge: 'Release Quality Gates',
    summary:
      'Zero-trust deployment gates, ephemeral containerized test environments, and automated unit test generation enforcing test pyramid maturity across enterprise pipelines.',
    skills: [
      'Jenkins Pipelines',
      'Bitbucket Pipelines',
      'GitHub Actions',
      'Docker',
      'Kubernetes',
      'Terraform',
      'PowerShell / Pester',
      'Shift-Left Quality Gates',
    ],
  },
  {
    id: 'observability-metrics',
    category: 'Observability & Metrics',
    shortLabel: 'Observability',
    badge: 'Production Telemetry',
    summary:
      'Observability-driven testing connecting synthetic monitors, distributed log analysis, CWV benchmarking, and executive test telemetry to prevent SRE-impacting incidents.',
    skills: [
      'Datadog Synthetic Monitoring',
      'Splunk Log Analysis',
      'Lighthouse Benchmarking',
      'Artillery.js Load Testing',
      'Qase Test Management Integration',
      'ZAP Security Testing',
    ],
  },
];

export const FEATURED_PROJECTS: CaseStudy[] = [
  {
    id: 'agentic-playwright-framework',
    title: 'Self-Healing Agentic Testing Framework',
    domain: 'Enterprise Financial Services',
    category: 'Agentic AI & Autonomous E2E',
    summary:
      'Autonomous web testing architecture built on Playwright utilizing AI decision agents to adapt and self-heal test execution against dynamic DOM updates across federated web applications.',
    challenge:
      'Frequent UI refactors across distributed micro-frontends caused brittle selector failures and false-positive CI blockages across multiple engineering teams.',
    architecture: [
      'Integrated Playwright with Model Context Protocol (@playwright/mcp) and AI decision agents that inspect accessibility trees and semantic DOM snapshots at runtime.',
      'Engineered a self-healing locator recovery pipeline that evaluates candidate elements by role, ARIA attributes, and structural proximity when primary selectors drift.',
      'Paired with developer-optimized GitHub Copilot and Claude agent skills to streamline test authoring and maintenance across squads.',
    ],
    outcomes: [
      'Eliminated flaky DOM-drift failures across multi-team regression suites while maintaining strict auditability.',
      'Accelerated authoring velocity with spec-driven agentic workflows integrated into automated CI/CD quality gates.',
    ],
    techStack: [
      'Playwright',
      'TypeScript',
      '@playwright/mcp',
      'AI Decision Agents',
      'GitHub Copilot',
      'Claude Workflows',
      'Jenkins',
    ],
  },
  {
    id: 'core-banking-microservices',
    title: 'Core Banking Microservices Testing Architecture',
    domain: 'Cloud-Native FinTech & Digital Banking',
    category: 'Go Microservices & Distributed Ledgers',
    summary:
      'Backend integration framework built with Go (Ginkgo/Gomega), REST, and gRPC, validating high-volume ACH processing, dispute resolution workflows, and CockroachDB integrity during service migrations.',
    challenge:
      'Distributed financial workflows required deterministic validation across asynchronous ACH file ingestion, money movement, batch settlement jobs, and service-to-service migrations without risking regression or production incidents.',
    architecture: [
      'Architected a modular Go (Ginkgo/Gomega) integration harness communicating over gRPC/Protobuf and REST within ephemeral Kubernetes test environments provisioned via Terraform.',
      'Built deep state verification assertions against distributed SQL transactions (CockroachDB), payment processing pipelines, and dispute resolution state machines.',
      'Integrated Qase automated test management and Datadog synthetic monitors for end-to-end release visibility.',
    ],
    outcomes: [
      'Safeguarded zero-data-loss service migrations and daily production releases across core backend systems.',
      'Established unified automation telemetry in Qase and proactive synthetic failure detection in Datadog.',
    ],
    techStack: [
      'Go',
      'Ginkgo / Gomega',
      'gRPC',
      'REST APIs',
      'CockroachDB',
      'Kubernetes',
      'Terraform',
      'Datadog',
      'Qase',
    ],
  },
  {
    id: 'pom-crawler-open-source',
    title: 'Open-Source CLI & Tooling (pom-crawler)',
    domain: 'Open Source / Developer Tooling',
    category: 'Developer Tooling & Open Source',
    summary:
      'CLI utility that crawls web applications, parses stable DOM selectors (IDs, data-test-id), and auto-generates Page Object Model (POM) classes. Includes go-api-test and DefinitelyTyped contributions.',
    challenge:
      'Teams building WebdriverIO, Playwright, and Cypress suites spend significant manual effort inspecting DOM trees and writing repetitive boilerplate Page Object classes.',
    architecture: [
      'Built a fast Node.js CLI crawler (pom-crawler) that traverses target URLs, extracts interactive DOM nodes prioritized by stability (data-test-id, id, ARIA roles), and emits ready-to-use JavaScript/TypeScript POM classes.',
      'Authored go-api-test for idiomatic Go API contract verification and contributed TypeScript type definitions to DefinitelyTyped.',
    ],
    outcomes: [
      'Reduces Page Object scaffolding time from hours to seconds while enforcing selector stability conventions.',
      'Open-sourced on GitHub with modular CLI flags for custom selector heuristics and framework templates.',
    ],
    techStack: [
      'Node.js',
      'TypeScript',
      'JavaScript',
      'CLI Architecture',
      'DOM Parsing',
      'WebdriverIO / Playwright',
      'Go (go-api-test)',
      'DefinitelyTyped',
    ],
    repoUrl: 'https://github.com/tanvirislam06/pom-crawler',
    secondaryLinks: [
      { label: 'GitHub Profile (@tanvirislam06)', url: 'https://github.com/tanvirislam06' },
    ],
  },
  {
    id: 'enterprise-jsdoc-standardization',
    title: 'Enterprise Test Standardization & Automated JSDoc Parser',
    domain: 'Enterprise Shared Services Platform',
    category: 'Enterprise Governance & Code Generation',
    summary:
      'Standardized testing across 10+ engineering squads by creating a JSDoc parser using Handlebars templates to auto-generate unit tests and enforcing CI/CD quality gates.',
    challenge:
      'Over 10 engineering squads operated at disparate testing maturity levels with inconsistent unit test coverage, fragmented UI/API frameworks, and manual release verification.',
    architecture: [
      'Engineered a JSDoc parser powered by Handlebars templates that reads function annotations to automatically scaffold Mocha and Sinon.js unit test suites.',
      'Created unified E2E and API testing frameworks using Playwright, Cypress, TestCafe, and SuperTest, alongside BDD test workflows.',
      'Embedded automated quality gates and Google Lighthouse performance benchmarks directly into enterprise CI/CD pipelines.',
    ],
    outcomes: [
      'Standardized test pyramid governance across 10+ frontend and shared-services squads.',
      'Automated repetitive unit test scaffolding and upskilled dozens of engineers through structured TDD, Mocha, and Sinon.js workshops.',
    ],
    techStack: [
      'JSDoc Parser',
      'Handlebars.js',
      'Playwright',
      'Cypress',
      'TestCafe',
      'SuperTest & Mocha',
      'Jenkins CI Gates',
      'Lighthouse CWV',
    ],
  },
];

export const EXPERIENCE_TIMELINE: ExperienceItem[] = [
  {
    id: 'bofa-principal-2025',
    role: 'Principal Automation Engineer (Contractor)',
    company: 'Bank of America',
    location: 'Charlotte, NC',
    period: 'Feb 2025 – Present',
    domainFocus: 'Reliability, Agentic AI Testing & Governance Leadership',
    highlights: [
      'Lead a backend-focused SDET team of 6 engineers responsible for platform tooling reliability and automation architecture.',
      'Architected an autonomous web testing system using Playwright that operates across multiple teams, leverages AI decision agents, and automatically adapts and recovers when DOM selectors change.',
      'Designed a developer-optimized GitHub Copilot and Claude workflow leveraging custom agents and reusable skills.',
      'Built a PowerShell/Pester automation framework to validate automated software package deployments across enterprise pipelines.',
      'Established organization-wide testing standards, quality roadmaps, and release quality gates aligned with Jenkins and Bitbucket CI/CD governance.',
    ],
    technologies: ['Playwright', 'Agentic AI', 'GitHub Copilot', 'PowerShell/Pester', 'Jenkins', 'Bitbucket'],
  },
  {
    id: 'stash-lead-sdet',
    role: 'Lead SDET (SDET IV)',
    company: 'Stash',
    location: 'Remote / Charlotte, NC',
    period: 'June 2022 – Oct 2024',
    domainFocus: 'Core Banking Microservices Testing Strategy & Observability',
    highlights: [
      'Led test architecture strategy for a cloud-native microservices personal finance & core banking platform.',
      'Built a backend integration testing framework using Go (Ginkgo/Gomega), REST, and gRPC validating ACH workflows, money movement, dispute resolution, batch jobs, and CockroachDB state integrity.',
      'Designed risk mitigation strategies during microservice deprecation initiatives to prevent regression, data loss, and SRE-impacting failures.',
      'Led a cross-company initiative to integrate Qase automated test case management with reporting pipelines to capture executive automation metrics.',
      'Managed ephemeral test infrastructure using Terraform and Kubernetes, and utilized Datadog for synthetic monitoring and production incident investigation.',
    ],
    technologies: ['Go', 'Ginkgo/Gomega', 'gRPC', 'REST', 'CockroachDB', 'Terraform', 'Kubernetes', 'Datadog', 'Qase'],
  },
  {
    id: 'bofa-vp-sdet-manager',
    role: 'VP SDET Manager, Shared Services',
    company: 'Bank of America',
    location: 'Charlotte, NC',
    period: 'Sept 2017 – June 2022',
    domainFocus: 'Enterprise Test Standardization Across 10+ Squads',
    highlights: [
      'Led quality strategy and engineering governance across 10+ teams of varying testing maturity levels.',
      'Created an automated JSDoc parser using Handlebars templates to automatically generate unit tests across shared frontend platforms.',
      'Architected unified E2E and API frameworks from scratch using Playwright, Cypress, TestCafe, SuperTest, Mocha, and Cucumber BDD.',
      'Integrated automated test suites and Google Lighthouse performance benchmarks into Jenkins pipelines to enforce strict deployment gates.',
      'Led enterprise test management modernization and conducted organization-wide workshops on the Test Pyramid, TDD, Sinon.js, and Mocha.',
    ],
    technologies: ['Playwright', 'Cypress', 'TestCafe', 'JSDoc/Handlebars', 'SuperTest', 'Mocha', 'Lighthouse', 'Jenkins'],
  },
  {
    id: 'global-edit-lead-qa',
    role: 'Lead QA Engineer',
    company: 'Global Edit / Industrial Color',
    location: 'New York, NY',
    period: 'Nov 2016 – Aug 2017',
    domainFocus: 'Full-Stack UI, API, Performance & Security Automation',
    highlights: [
      'Built comprehensive UI (WebdriverIO), API (SuperTest), performance (Artillery.js), and security (OWASP ZAP) testing frameworks integrated into CI/CD pipelines.',
      'Conducted architecture-level Blackbox and Whitebox quality audits and refactored automation suites for high stability and scalability.',
    ],
    technologies: ['WebdriverIO', 'SuperTest', 'Artillery.js', 'OWASP ZAP', 'CI/CD'],
  },
  {
    id: 'earlier-saas-experience',
    role: 'Senior QA & Automation Engineer',
    company: 'Medidata, Web.com, Watermark Insights',
    location: 'New York, NY',
    period: 'Jan 2011 – Oct 2016',
    domainFocus: 'Cloud SaaS Automation & Quality Strategy',
    highlights: [
      'Built and scaled API, UI (Node.js, Protractor, Telerik), performance, and security automation frameworks for enterprise cloud-based SaaS platforms.',
      'Led QA strategy, CI/CD pipeline integration, mentoring initiatives, and cross-functional engineering collaboration.',
    ],
    technologies: ['Node.js', 'API Automation', 'Protractor', 'Performance & Security Testing', 'CI/CD'],
  },
];

export const EDUCATION_CREDENTIALS: EducationCredential[] = [
  {
    id: 'rst-bach-bolton',
    title: 'Rapid Software Testing (RST)',
    institution: 'James Bach & Michael Bolton',
    yearOrNote: 'Advanced Heuristic & Context-Driven Testing',
    category: 'Testing Methodology',
    description:
      'Intensive methodology workshop mastering heuristic test design, risk-based investigation, mental models, and rapid exploratory engineering.',
  },
  {
    id: 'stanford-hci',
    title: 'Human Computer Interaction (HCI)',
    institution: 'Stanford University (via Coursera)',
    yearOrNote: '2012',
    category: 'Engineering & Product',
    description:
      'User-centered design, cognitive walkthroughs, accessibility ergonomics, and empirical interface evaluation.',
  },
  {
    id: 'lean-product-management',
    title: 'Lean Product Management',
    institution: 'SkillShare Professional Training',
    yearOrNote: '2013',
    category: 'Engineering & Product',
    description:
      'Outcome-driven product strategy, iterative hypothesis validation, and aligning quality engineering roadmaps with customer value.',
  },
  {
    id: 'automation-guild-founder',
    title: 'Founding Member — Test Automation Guild',
    institution: 'Led by Joe Colantonio',
    yearOrNote: 'Founding Member & Continuous Practitioner',
    category: 'Testing Methodology',
    description:
      'Founding community member shaping modern test automation patterns and continuous quality practices.',
  },
];
