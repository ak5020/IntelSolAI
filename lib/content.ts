/**
 * ALL marketing copy for the page.
 *
 * Sections import from here and never hardcode strings, so every word on the
 * site is editable in one file without touching a component.
 */

// ---------------------------------------------------------------------------
// Site-wide
// ---------------------------------------------------------------------------

export const site = {
  name: 'IntelSol AI',
  domain: 'intelsolai.com',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://intelsolai.com',
  tagline: 'Intelligent Solutions',
  oneLiner:
    'AI automation and software engineering that turns AI into measurable business results.',
  /* Public-facing address only. The address that actually receives enquiries
     lives in CONTACT_TO_EMAIL, server-side, and never reaches the client. */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hello@intelsolai.com',
  linkedin: 'https://www.linkedin.com/company/intelsolai',
} as const;

// ---------------------------------------------------------------------------
// S1 — Navigation
// ---------------------------------------------------------------------------

export const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'Process', href: '#process' },
  { label: 'Industries', href: '#industries' },
  { label: 'FAQ', href: '#faq' },
] as const;

/** Primary CTA. No booking tool yet, so it scrolls to the contact form. */
export const primaryCta = { label: 'Book a free AI audit', href: '#contact' } as const;

// ---------------------------------------------------------------------------
// S2 — Hero
// ---------------------------------------------------------------------------

export const hero = {
  eyebrow: 'AI automation & software engineering',
  /* Split so each line can reveal on its own stagger step. */
  headingLines: ['Ship AI that', 'pays for itself'],
  sub: 'IntelSol builds agentic AI systems, voice agents, and workflow automation for startups, fintech, and B2B SaaS — engineered around your existing processes and measured against real business outcomes.',
  ctaPrimary: primaryCta,
  ctaSecondary: { label: 'See it working', href: '#products' },
  pills: [
    'Agentic AI',
    'AI Agents',
    'Voice AI',
    'Workflow Automation',
    'RAG',
    'LLM Integrations',
  ],
  trustLine: [
    '6+ years product engineering',
    'Startups, Fintech & B2B SaaS',
    'OpenAI, Claude & Gemini',
  ],
} as const;

// ---------------------------------------------------------------------------
// S3 — Marquee
// ---------------------------------------------------------------------------

export const marquee = {
  tools: [
    'OpenAI',
    'Anthropic Claude',
    'Google Gemini',
    'n8n',
    'Make.com',
    'Zapier',
    'Twilio',
    'HubSpot',
    'Slack',
    'WhatsApp Business API',
    'Pinecone',
    'Supabase',
  ],
  outcomes: [
    'Lower cost per lead',
    '24/7 coverage',
    'Faster response times',
    'Fewer manual handoffs',
    'Higher qualification rates',
    'Cleaner CRM data',
  ],
} as const;

// ---------------------------------------------------------------------------
// S4 — Services
// ---------------------------------------------------------------------------

/** Icon keys map to exports in components/svg/icons.tsx. */
export const services = [
  {
    id: 'agentic',
    icon: 'agent',
    title: 'Agentic AI & Multi-Agent Systems',
    body: 'Autonomous agents that plan, use tools, and complete multi-step work with the right guardrails and human checkpoints.',
  },
  {
    id: 'voice',
    icon: 'voice',
    title: 'Voice AI Agents',
    body: 'Human-sounding agents that call, answer, qualify, and book — with live CRM sync and full call transcripts.',
  },
  {
    id: 'chat',
    icon: 'chat',
    title: 'AI Chatbots & Customer Support',
    body: 'Support across web, WhatsApp, and in-app that resolves real tickets instead of deflecting them.',
  },
  {
    id: 'workflow',
    icon: 'workflow',
    title: 'Workflow & Process Automation',
    body: 'n8n, Make.com, and Zapier pipelines that connect the tools you already run and remove manual handoffs.',
  },
  {
    id: 'crm',
    icon: 'crm',
    title: 'CRM, Sales & Marketing Automation',
    body: 'Lead capture, enrichment, scoring, follow-up sequences, and campaign reporting that maintain themselves.',
  },
  {
    id: 'rag',
    icon: 'rag',
    title: 'RAG & LLM Integrations',
    body: 'Retrieval systems on your own documents and data, integrated with OpenAI, Claude, or Gemini for accurate, grounded answers.',
  },
] as const;

export const servicesCopy = {
  eyebrow: 'What we build',
  heading: 'Systems, not experiments',
  sub: "Every build starts with your workflows — where the bottleneck is, what it costs you, and what an agent can take off your team's plate.",
} as const;

// ---------------------------------------------------------------------------
// S5 — Statistics
//
// TODO: CONFIRM REAL METRIC — every figure below is a realistic placeholder
// supplied at the client's request, not a measured IntelSol result. Replace
// with audited numbers before launch. Tracked in HANDOFF.md.
// ---------------------------------------------------------------------------

export const stats = [
  {
    id: 'followup',
    value: 60,
    suffix: '%',
    label: 'Reduction in manual follow-up time',
    animated: true,
  },
  {
    id: 'leads',
    value: 3,
    suffix: 'x',
    label: 'Increase in qualified leads per rep',
    animated: true,
  },
  {
    id: 'coverage',
    value: 0,
    suffix: '',
    staticValue: '24/7',
    label: 'Coverage across voice, chat, and WhatsApp',
    animated: false,
  },
  {
    id: 'response',
    value: 2,
    suffix: ' min',
    label: 'Average response time after automation',
    animated: true,
  },
] as const;

export const statsCopy = {
  eyebrow: 'Quantifiable impact',
  heading: 'Measured against the business, not the model',
} as const;

// ---------------------------------------------------------------------------
// S6 — Products
//
// Two formats, and the ORDER MATTERS.
//
// Measured on these exact files: the H.264 MP4 is ~40% smaller than the VP9
// WebM at the same quality (SSIM 0.9957 vs 0.9958 — indistinguishable). So MP4
// is listed first and every browser that can decode H.264 gets the smaller
// download.
//
// WebM is kept purely as a fallback: codec-stripped Chromium builds ship on
// several Linux distributions and cannot decode H.264 at all. Without the
// second source those visitors get no demo. The browser only ever downloads
// the first source it can play, so the fallback costs returning visitors
// nothing.
// ---------------------------------------------------------------------------

export const products = [
  {
    id: 'whatsapp-commerce',
    title: 'AI WhatsApp Commerce Platform',
    body: 'Customers browse, ask questions, and check out inside WhatsApp. The agent handles product discovery, order status, and support, and hands off to a human the moment it should.',
    tags: ['WhatsApp Business API', 'Conversational Commerce', 'Order Automation'],
    /* Native dimensions — a portrait phone recording. The player reserves the
       box from these, so there is no layout shift and no cropping. */
    width: 424,
    height: 758,
    poster: '/videos/whatsapp-commerce-poster.webp',
    sources: {
      mp4: '/videos/whatsapp-commerce.mp4',
      webm: '/videos/whatsapp-commerce.webm',
    },
    /* JSON-LD VideoObject fields. */
    description:
      'Demo of the IntelSol AI WhatsApp Commerce Platform: conversational product discovery, cart, checkout and order support handled by an AI agent inside WhatsApp.',
    uploadDate: '2026-08-09',
  },
  {
    id: 'lead-qualification',
    title: 'AI Lead Qualification & Cold Calling Platform',
    body: 'An outbound voice agent that dials your list, qualifies against your criteria, handles objections, books meetings straight into the calendar, and writes every call back to the CRM.',
    tags: ['Voice AI', 'Outbound Sales', 'CRM Sync'],
    /* Native dimensions — an ultrawide desktop screen recording. */
    width: 1280,
    height: 552,
    poster: '/videos/lead-qualification-poster.webp',
    sources: {
      mp4: '/videos/lead-qualification.mp4',
      webm: '/videos/lead-qualification.webm',
    },
    description:
      'Demo of the IntelSol AI Lead Qualification and Cold Calling Platform: an outbound voice agent that dials, qualifies, handles objections, books meetings and syncs to CRM.',
    uploadDate: '2026-08-09',
  },
] as const;

export const productsCopy = {
  eyebrow: 'Built & shipped',
  heading: 'Two products already doing the work',
} as const;

// ---------------------------------------------------------------------------
// S7 — Process
// ---------------------------------------------------------------------------

export const processSteps = [
  {
    n: '01',
    title: 'Audit',
    body: 'We map your current workflows, customer interactions, and sales process, and identify where time and money are actually leaking.',
  },
  {
    n: '02',
    title: 'Design',
    body: 'We scope the smallest system that fixes the largest bottleneck, define success metrics, and agree what "working" means before we build.',
  },
  {
    n: '03',
    title: 'Build',
    body: 'Engineering, integrations, evals, and guardrails. Deployed into your real stack, not a sandbox demo.',
  },
  {
    n: '04',
    title: 'Scale',
    body: 'We monitor accuracy and cost, tune against production data, and expand into adjacent workflows once the ROI is proven.',
  },
] as const;

export const processCopy = {
  eyebrow: 'How we work',
  heading: 'Business first, model second',
} as const;

// ---------------------------------------------------------------------------
// S8 — Use cases
// ---------------------------------------------------------------------------

export const useCases = [
  {
    id: 'sales',
    label: 'Sales',
    items: [
      'AI lead generation',
      'Cold calling agents',
      'Lead qualification',
      'Follow-up automation',
      'CRM automation',
    ],
    flow: ['New lead', 'Qualifier agent', 'Book meeting', 'CRM updated'],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    items: ['Creative pipelines', 'Content calendars', 'Campaign reporting'],
    flow: ['Brief', 'Creative agent', 'Schedule', 'Performance report'],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: ['Workflow automation', 'Employee onboarding', 'Cross-platform integrations'],
    flow: ['Trigger event', 'Ops agent', 'Sync systems', 'Task closed'],
  },
  {
    id: 'cx',
    label: 'Customer Experience',
    items: ['24/7 support chatbots', 'Voice assistants', 'Appointment booking'],
    flow: ['Customer message', 'Support agent', 'Resolve or route', 'Ticket closed'],
  },
] as const;

export const useCasesCopy = {
  eyebrow: 'Where it pays off',
  heading: 'Pick a team, see the system',
} as const;

// ---------------------------------------------------------------------------
// S9 — Industries
// ---------------------------------------------------------------------------

export const industries = [
  {
    id: 'startups',
    icon: 'rocket',
    title: 'Startups',
    body: 'Ship the operational headcount you cannot afford to hire yet.',
  },
  {
    id: 'fintech',
    icon: 'shield',
    title: 'Fintech',
    body: 'Onboarding checks, document review, and support that survive an audit.',
  },
  {
    id: 'saas',
    icon: 'layers',
    title: 'B2B SaaS',
    body: 'Trial-to-paid follow-up and in-product support that scale past the CS team.',
  },
  {
    id: 'ecommerce',
    icon: 'cart',
    title: 'E-commerce',
    body: 'Pre-sale questions, order status, and returns handled before a human sees them.',
  },
  {
    id: 'healthcare',
    icon: 'pulse',
    title: 'Healthcare',
    body: 'Scheduling, reminders, and intake triage with clear consent and access rules.',
  },
  {
    id: 'realestate',
    icon: 'building',
    title: 'Real Estate',
    body: 'Enquiry response and viewing bookings answered in seconds, not next morning.',
  },
] as const;

export const industriesCopy = {
  eyebrow: 'Who we build for',
  heading: 'Six industries, one method',
} as const;

// ---------------------------------------------------------------------------
// S10 — Integrations
// ---------------------------------------------------------------------------

export const integrations = [
  'OpenAI',
  'Anthropic Claude',
  'Google Gemini',
  'n8n',
  'Make.com',
  'Zapier',
  'HubSpot',
  'Salesforce',
  'Slack',
  'WhatsApp',
  'Twilio',
  'Google Calendar',
  'Stripe',
  'Notion',
  'Supabase',
  'Airtable',
] as const;

export const integrationsCopy = {
  eyebrow: 'Fits your stack',
  heading: 'Agents that live where your team already works',
} as const;

// ---------------------------------------------------------------------------
// S11 — FAQ
// ---------------------------------------------------------------------------

export const faqs = [
  {
    q: 'What does an engagement typically look like?',
    a: 'We start with a paid or free audit of your workflows, deliver a scoped plan with expected impact, then build in short cycles. Most first systems ship in 3–6 weeks.',
  },
  {
    q: 'Do you work with our existing tools?',
    a: 'Yes. We integrate with your CRM, helpdesk, calendar, and data sources rather than asking you to migrate.',
  },
  {
    q: 'Which models do you use?',
    a: 'Whichever fits the task and budget: OpenAI, Anthropic Claude, or Google Gemini. We benchmark on your data before committing.',
  },
  {
    q: 'How do you handle data privacy?',
    a: 'Your data stays in your infrastructure wherever possible. We scope retention, access, and logging before a single line of code is written.',
  },
  {
    q: 'Can you build voice agents for non-English markets?',
    a: 'Yes. We deploy multilingual voice and chat agents, including regional accents and mixed-language conversations.',
  },
  {
    q: "What if AI isn't the right answer?",
    a: "We'll say so. Some bottlenecks are process or data problems, and we'd rather fix the workflow than sell you an agent that papers over it.",
  },
] as const;

export const faqCopy = {
  eyebrow: 'Before you ask',
  heading: 'Common questions',
} as const;

// ---------------------------------------------------------------------------
// S12 — Contact
// ---------------------------------------------------------------------------

export const contact = {
  eyebrow: 'Start here',
  heading: "Let's find the bottleneck worth automating",
  sub: "Tell us what your team is doing manually. We'll map one workflow, estimate the impact, and tell you honestly whether it's worth building.",
  formTitle: 'Tell us what to look at',
  privacyNote: "We'll only use this to reply. No lists, no sharing.",
  successTitle: 'Thanks — we’ve got it.',
  successBody: "You'll hear back within one business day.",
} as const;

/** Select options — shared by the form UI and the Zod schema. */
export const serviceOptions = [
  'Agentic AI & Multi-Agent Systems',
  'Voice AI Agents',
  'AI Chatbots & Customer Support',
  'Workflow & Process Automation',
  'CRM, Sales & Marketing Automation',
  'RAG & LLM Integrations',
  'Not sure yet',
] as const;

export const budgetOptions = [
  'Under $5k',
  '$5k–15k',
  '$15k–50k',
  '$50k+',
  'Not sure yet',
] as const;

// ---------------------------------------------------------------------------
// S13 — Footer
// ---------------------------------------------------------------------------

export const footer = {
  description:
    'AI automation and software engineering that turns AI into measurable business results.',
  serviceLinks: [
    'Agentic AI',
    'Voice AI Agents',
    'AI Chatbots',
    'Workflow Automation',
    'CRM & Sales Automation',
    'RAG & LLM Integrations',
  ],
  copyright: `© ${new Date().getFullYear()} IntelSol AI`,
  /*
    Privacy and Terms are hidden until the real pages exist — a footer link
    that goes nowhere is worse than no link. Add the entries back here once
    the pages are written and the footer renders them automatically.
  */
  legal: [] as { label: string; href: string }[],
} as const;
