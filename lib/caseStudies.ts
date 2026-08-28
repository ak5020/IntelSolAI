/* ---------------------------------------------------------------------------
   S6c — Case studies
   ---------------------------------------------------------------------------
   ⚠️  READ BEFORE PUBLISHING — see HANDOFF.md §1.5

   These pages are written to be advertised against, which raises the bar on
   accuracy rather than lowering it. Two rules follow:

     1. NOT ONE INVENTED NUMBER. Every claim below describes what the system
        does, drawn from the demo recordings and the build notes. There is no
        "62% more meetings booked" anywhere, because no such figure has been
        measured. Ad copy that cites an unverifiable result is the fastest way
        to lose an enterprise deal at the point someone asks how it was
        calculated — and in the UK, US and EU it is an advertising compliance
        problem.
     2. `results` is where measured outcomes belong once you have them. The
        entries there now are capability statements, all demonstrable from the
        artefacts on each page. Replace them with real figures the moment a
        client signs off on some, and the page gets considerably stronger.

   The order of this array is the order they render, on the landing page and in
   the "related" rail. It matches the order requested: voice, WhatsApp, CRM,
   SEO.
--------------------------------------------------------------------------- */

/** Which visual sits under the overview — a demo recording or a flow diagram. */
export type CaseStudyMedia =
  | {
      kind: 'video';
      title: string;
      width: number;
      height: number;
      poster: string;
      sources: { mp4: string; webm: string };
      /** Shown under the player as a caption. */
      caption: string;
    }
  | {
      kind: 'diagram';
      /** Selects the hand-authored SVG in components/svg/. */
      diagram: 'demand-iq' | 'seo-automation';
      caption: string;
    };

export type CaseStudySection = {
  body: string;
  points: readonly string[];
};

export type CaseStudy = {
  slug: string;
  /** Eyebrow above the title, on the card and the page. */
  category: string;
  /** H1 on the detail page. */
  title: string;
  /** Shorter form for the landing-page card heading. */
  cardTitle: string;
  /** Card body — two sentences, benefit first. */
  cardSummary: string;
  overview: string;
  media: CaseStudyMedia;
  challenge: CaseStudySection;
  solution: CaseStudySection;
  technical: CaseStudySection;
  technologies: readonly string[];
  /** Capability outcomes. See the warning above before adding figures here. */
  results: readonly string[];
  whyItMatters: string;
  /** Which service lines delivered it — mirrors `services` in content.ts. */
  servicesBehind: readonly { title: string; body: string }[];
  meta: { title: string; description: string };
};

export const caseStudiesCopy = {
  eyebrow: 'Case studies',
  heading: 'What we built, and how it works',
  sub: 'Four systems running in production — an outbound voice agent, a WhatsApp commerce agent, a CRM integration, and a content pipeline. Each one opens in full: the problem, the build, and the stack behind it.',
} as const;

export const caseStudies: readonly CaseStudy[] = [
  /* ----------------------------------------------------------------------- */
  {
    slug: 'lead-qualification',
    category: 'Voice AI · Outbound sales',
    title: 'AI Lead Qualification & Cold Calling Voice Agent',
    cardTitle: 'AI Lead Qualification & Cold Calling',
    cardSummary:
      'An outbound voice agent that works a call list end to end — dialling, qualifying against your criteria, handling objections, and booking the meeting while the prospect is still on the line. Every call is written back to the CRM with its transcript.',
    overview:
      'Outbound calling is the most expensive hour in a sales day and the one with the lowest hit rate. We built a voice agent that takes the list instead: it dials, opens the conversation, qualifies against the criteria the team already uses, handles the objections that actually come up, and books straight into the calendar when someone is interested. The call is logged to the CRM before the agent moves to the next number.',
    media: {
      kind: 'video',
      title: 'AI Lead Qualification & Cold Calling Platform',
      width: 1280,
      height: 552,
      poster: '/videos/lead-qualification-poster.webp',
      sources: {
        mp4: '/videos/lead-qualification.mp4',
        webm: '/videos/lead-qualification.webm',
      },
      caption:
        'The build console: assistant configuration, model presets with their measured latency and cost, voice selection, and a live call with the transcript streaming alongside it.',
    },
    challenge: {
      body: 'A rep working a cold list spends most of the day on calls that will never qualify. The work is necessary and almost entirely mechanical until the moment someone says yes — and the moment after that, the part that decides whether the lead survives, depends on a tired person remembering to write it down.',
      points: [
        'Work a large list without hiring proportionally more reps',
        'Apply the same qualification criteria on every call, not a version of them',
        'Handle objections in conversation rather than reading from a script',
        'Book the meeting during the call, not in a follow-up email thread',
        'Keep CRM records complete without relying on manual logging',
      ],
    },
    solution: {
      body: 'A voice agent that holds a real conversation rather than playing a recording. It listens, responds in under a second on the fast configurations, and follows the qualification logic the sales team defined — including what to do when the answer is no.',
      points: [
        'Dials the list and opens the conversation unattended',
        'Qualifies against the client’s own criteria, applied identically every time',
        'Handles objections in real time, built from patterns in actual call transcripts',
        'Books into the calendar during the call while intent is live',
        'Writes the outcome and the full transcript back to the CRM',
        'Streams a live transcript so a human can supervise or take over',
      ],
    },
    technical: {
      body: 'Speech-to-text, reasoning and speech synthesis are three separate, swappable layers rather than one fixed vendor stack. That is what makes the trade-off tunable: the same assistant can be configured for the lowest possible latency, the strongest reasoning, or the lowest cost per minute, and the console reports the measured latency for each combination so the choice is made on numbers rather than intuition.',
      points: [
        'Streaming speech-to-text for low-latency turn detection',
        'Swappable LLM reasoning layer across multiple providers',
        'Neural text-to-speech with selectable voices',
        'Named presets — balanced, high-intelligence, ultra-fast, cost-saver — each with its latency and per-minute cost surfaced',
        'Live transcript and post-call analysis',
        'CRM write-back and calendar booking via API',
      ],
    },
    technologies: [
      'Voice AI',
      'Speech-to-Text',
      'LLM Orchestration',
      'Text-to-Speech',
      'Real-Time Streaming',
      'CRM Integration',
      'Calendar API',
      'Webhooks',
    ],
    results: [
      'The whole list gets worked — the agent does not tire, skip, or quietly deprioritise the bottom of the sheet',
      'Qualification is consistent by construction: the same criteria are applied on call one and call four hundred',
      'Meetings arrive in the calendar already booked, rather than as a follow-up task someone still has to do',
      'Every call reaches the CRM with its transcript attached, so pipeline reporting is complete by default',
      'Latency and cost per minute are tunable per deployment by switching model tier, without rebuilding the agent',
    ],
    whyItMatters:
      'Most outbound teams are limited by how many conversations they can physically have, not by how good their pitch is. Moving the mechanical part of that to an agent does not replace the sales team — it changes what reps spend their day on, from dialling numbers to talking to people who already said they were interested.',
    servicesBehind: [
      { title: 'Voice AI Agents', body: 'Real-time speech agents for inbound and outbound calling' },
      { title: 'CRM, Sales & Marketing Automation', body: 'Pipeline sync, enrichment and hand-off logic' },
      { title: 'Agentic AI & Multi-Agent Systems', body: 'Tool use, decision logic and escalation paths' },
    ],
    meta: {
      title: 'AI Lead Qualification & Cold Calling Voice Agent — Case Study | IntelSol AI',
      description:
        'How we built an outbound AI voice agent that dials, qualifies, handles objections, books meetings and syncs every call to the CRM. Architecture, stack and demo.',
    },
  },

  /* ----------------------------------------------------------------------- */
  {
    slug: 'whatsapp-commerce',
    category: 'Conversational AI · Commerce & support',
    title: 'AI WhatsApp Commerce & Customer Support Agent',
    cardTitle: 'AI WhatsApp Commerce & Support',
    cardSummary:
      'A support and commerce agent living inside WhatsApp: it answers product and policy questions, looks up live order status with courier and tracking, and hands off to a human the moment the conversation needs one.',
    overview:
      'Customers already message businesses on WhatsApp; most of what they ask is answerable from data the business already holds. We built an agent that lives in that thread — handling product discovery, order status, returns and refunds against live systems rather than canned replies — with an operations dashboard behind it for the queue, escalations and COD verification.',
    media: {
      kind: 'video',
      title: 'AI WhatsApp Commerce Platform',
      width: 1280,
      height: 572,
      poster: '/videos/whatsapp-commerce-poster.webp',
      sources: {
        mp4: '/videos/whatsapp-commerce.mp4',
        webm: '/videos/whatsapp-commerce.webm',
      },
      caption:
        'A full session: order lookups returning status, courier and tracking, a returns-policy answer, a refund and cancellation flow, and the operations dashboard behind it.',
    },
    challenge: {
      body: 'Support queues fill with questions that have a definite answer sitting in an order system — where is it, can I return it, what did I pay. Answering them by hand is slow for the customer and expensive for the business, but answering them badly with a scripted bot is worse than not answering at all.',
      points: [
        'Answer product, order and returns questions directly in WhatsApp',
        'Read live order state rather than replying from a script',
        'Escalate to a human with the conversation attached, not a ticket number',
        'Verify cash-on-delivery orders before anything ships',
        'Stay reliable when a user deliberately tries to break the agent',
      ],
    },
    solution: {
      body: 'A conversational agent on the WhatsApp Business API, grounded in the store’s own catalogue, policies and order data. It resolves what it can resolve, and routes the rest to a person with the full thread attached.',
      points: [
        'Product discovery and support inside the customer’s existing WhatsApp thread',
        'Live order lookup returning status, items, total, courier and tracking number',
        'Returns and refund answers grounded in the store’s actual published policy',
        'Cancellation and refund flows handled in-conversation with confirmation steps',
        'Human hand-off carrying the full conversation context',
        'Operations dashboard: message queue, escalations, COD verification, security log',
      ],
    },
    technical: {
      body: 'The agent is grounded rather than free-associating: order and policy answers are retrieved from the client’s systems and passed to the model as context, so a wrong answer requires wrong data rather than a hallucination. Guardrails are enforced independently of the prompt, which is what holds up when the model is attacked directly.',
      points: [
        'WhatsApp Business API for messaging and delivery receipts',
        'Retrieval grounded in the store catalogue, policy documents and live order records',
        'Order-system integration for status, courier and tracking lookups',
        'Guardrails constraining the agent to support scope, independent of user input',
        'Escalation routing with conversation context preserved',
        'Operations dashboard for queue state, escalations and COD verification',
      ],
    },
    technologies: [
      'WhatsApp Business API',
      'Conversational AI',
      'RAG',
      'LLM Guardrails',
      'Order Management Integration',
      'Human-in-the-Loop',
      'Operations Dashboard',
    ],
    results: [
      'Order, returns and refund questions resolve inside the chat, without a queue position or a ticket number',
      'Answers carry real detail — order number, items, total, courier and tracking — because they are read from the order system',
      'Escalation hands a human the whole conversation, so the customer never repeats themselves',
      'Prompt-injection resistance is demonstrable, not asserted: in the recorded demo the agent is told to adopt an “unrestricted” persona and ignore its rules, and it declines and returns the conversation to support',
      'COD orders are verified through a defined queue before dispatch rather than by ad-hoc phone calls',
    ],
    whyItMatters:
      'The interesting question about a support agent is not what it does on a cooperative customer — it is what it does on a hostile one, and on the edge cases where being confidently wrong is expensive. Grounding answers in live systems and enforcing scope outside the prompt is what makes the difference between a demo and something you can leave pointed at real customers.',
    servicesBehind: [
      { title: 'AI Chatbots & Customer Support', body: 'Support agents across chat, email and messaging' },
      { title: 'RAG & LLM Integrations', body: 'Retrieval grounding against real business data' },
      { title: 'Workflow & Process Automation', body: 'Escalation, verification and ops tooling' },
    ],
    meta: {
      title: 'AI WhatsApp Commerce & Customer Support Agent — Case Study | IntelSol AI',
      description:
        'How we built a WhatsApp commerce and support agent with live order lookups, grounded policy answers, human escalation and prompt-injection resistance. Full demo.',
    },
  },

  /* ----------------------------------------------------------------------- */
  {
    slug: 'demand-iq-hubspot',
    category: 'Workflow automation · CRM integration',
    title: 'Demand IQ → HubSpot CRM Automation',
    cardTitle: 'Demand IQ → HubSpot Automation',
    cardSummary:
      'A multi-step Zapier integration that moves prospects out of Demand IQ and into HubSpot — enriched with their full report before they land, and routed down a different branch depending on what the prospect actually did.',
    overview:
      'Prospect data was being generated in Demand IQ while the sales team worked entirely in HubSpot, which meant either re-keying records by hand or losing them. We built a multi-step Zap that fires on every new contact, pulls the full prospect record and report, then routes it through a nested path tree so that each type of prospect and each outcome creates the right kind of HubSpot record.',
    media: {
      kind: 'diagram',
      diagram: 'demand-iq',
      caption:
        'The Zap as built: a Demand IQ trigger, two enrichment lookups, then a nested path tree branching first on prospect type and then on call outcome, with a HubSpot write at each leaf.',
    },
    challenge: {
      body: 'The trigger payload from a new contact is thin — enough to know someone exists, not enough to work them. The useful information lives in the prospect record and the generated report, which have to be fetched separately. And not every prospect should be treated the same way once it arrives.',
      points: [
        'Prospects are created in Demand IQ; the sales team works only in HubSpot',
        'The trigger alone lacks the report and custom fields the team needs',
        'Different prospect types and call outcomes need different CRM treatment',
        'Manual re-keying is slow and silently drops records',
        'Contacts already in HubSpot must be updated, not duplicated',
      ],
    },
    solution: {
      body: 'One Zap, six logical steps and a nested branch. The enrichment happens before the branch, so every path downstream is working with a complete record rather than re-fetching.',
      points: [
        'Triggers on New Contact in Demand IQ',
        'Fetches the full prospect by ID',
        'Fetches the prospect report and custom fields',
        'Splits on prospect type — Hero and Journey take separate routes',
        'Nests a second split under Hero for the call outcome: not home, or spoke to customer',
        'Creates or updates the HubSpot contact at each leaf with the fields that branch needs',
      ],
    },
    technical: {
      body: 'The work is in the path conditions and the field mapping, not the connection. Each branch has its own condition set and its own mapping into HubSpot, so a Hero prospect who was not home lands with different properties from a Journey prospect — without duplicating the enrichment steps that precede them.',
      points: [
        'Multi-step Zap with nested Paths and per-branch conditions',
        'Demand IQ V2 app: one trigger plus two lookup actions',
        'HubSpot CRUD — create and update contacts and leads',
        'Field mapping from the prospect report and custom fields into HubSpot properties',
        'Enrichment placed ahead of the branch so no path repeats an API call',
        'Configured and tested against both systems’ live sandboxes',
      ],
    },
    technologies: [
      'Zapier',
      'Demand IQ',
      'HubSpot CRM',
      'REST APIs',
      'Webhooks',
      'Field Mapping',
      'Conditional Routing',
    ],
    results: [
      'Prospects reach HubSpot without anyone re-keying a record',
      'Each contact arrives already enriched with its report and custom fields',
      'Routing is decided by the automation, not by a person reading the record and choosing',
      'Three distinct outcomes — Journey, Hero/not home, Hero/spoke to customer — each land with their own field mapping',
      'Existing contacts update in place instead of creating duplicates',
    ],
    whyItMatters:
      'Most CRM integrations fail not at the connection but at the branch: everything works until the data needs to be treated differently depending on what it says. Doing the enrichment once, up front, and then branching on a complete record is what keeps a path tree like this maintainable as the conditions grow.',
    servicesBehind: [
      { title: 'Workflow & Process Automation', body: 'Multi-step, conditional automation across tools' },
      { title: 'CRM, Sales & Marketing Automation', body: 'HubSpot configuration, sync and field mapping' },
    ],
    meta: {
      title: 'Demand IQ to HubSpot CRM Automation — Case Study | IntelSol AI',
      description:
        'How we integrated Demand IQ with HubSpot using a multi-step Zapier workflow: enrichment lookups, nested conditional paths and per-branch CRM field mapping.',
    },
  },

  /* ----------------------------------------------------------------------- */
  {
    slug: 'seo-automation',
    category: 'Workflow automation · Content operations',
    title: 'AI-Powered SEO FAQ Automation',
    cardTitle: 'AI-Based SEO Automation',
    cardSummary:
      'A keyword goes in and a publish-ready FAQ document comes out in Google Docs. Built end to end in n8n with OpenAI — no custom backend to maintain and no additional monthly SaaS subscription.',
    overview:
      'FAQ content is one of the most reliable ways to earn search visibility and one of the most tedious things to research by hand. We built a pipeline that takes a keyword from a form, pulls the questions people actually ask around it, summarises them with an LLM, and writes the finished FAQ set straight into a Google Doc — running in the background with no manual step in the middle.',
    media: {
      kind: 'diagram',
      diagram: 'seo-automation',
      caption:
        'The n8n workflow: a form trigger, the AlsoAsked API call, formatting and chunking, a batched summarisation loop through OpenAI, and a merge that writes the finished FAQs into a Google Doc.',
    },
    challenge: {
      body: 'Researching the questions that cluster around a keyword means working through a long tail of near-duplicates, then compressing them into something a reader would actually want to read. It is genuinely useful work and almost entirely mechanical — and the client did not want to solve it by adding another subscription and a backend to keep running.',
      points: [
        'Related-question research is high-volume and highly repetitive',
        'Raw question lists are far too long and duplicative to publish as-is',
        'Summarising into publishable FAQs is a manual editing pass',
        'No appetite for another recurring SaaS bill',
        'No appetite for a bespoke backend that becomes someone’s maintenance burden',
      ],
    },
    solution: {
      body: 'The entire pipeline is a single n8n workflow. A keyword submitted through a form starts a run; everything from research to a finished document happens without anyone watching it.',
      points: [
        'A form submission provides the keyword and starts the run',
        'The AlsoAsked API returns the questions people actually search around it',
        'Results are formatted, converted to Markdown and written to a working sheet',
        'The set is chunked and the top questions selected for summarisation',
        'A loop batches those chunks through OpenAI, staying inside token limits',
        'Summaries are merged and placed into a Google Doc, ready to publish',
      ],
    },
    technical: {
      body: 'The constraint that shaped the build was doing it with API calls and a workflow engine rather than an application. There is no framework, no database and no deployment — the state lives in the workflow run and the output lives in Google Docs, where the content team already works.',
      points: [
        'n8n as the orchestrator — no bespoke backend framework',
        'AlsoAsked REST API for related-question research',
        'Custom JavaScript nodes for formatting, Markdown conversion and chunking',
        'A loop node batching items so each request stays within model token limits',
        'OpenAI for summarisation and de-duplication across chunks',
        'Google Docs API to create the document and write the finished FAQs into it',
        'A merge step combining the document and the summaries into the final output',
      ],
    },
    technologies: [
      'n8n',
      'OpenAI API',
      'AlsoAsked API',
      'Google Docs API',
      'JavaScript',
      'REST APIs',
      'Markdown',
    ],
    results: [
      'A keyword becomes a publish-ready FAQ document with no manual step in between',
      'Built with no custom backend framework and no additional monthly SaaS subscription — a workflow engine and a small set of API calls',
      'Runs unattended in the background rather than occupying someone’s afternoon',
      'Output lands in Google Docs, where the content team already reviews and publishes',
      'Batching through the loop keeps each request inside model token limits, so long question sets do not break the run',
    ],
    whyItMatters:
      'A great deal of "we need an AI tool for this" turns out to be a workflow engine, two APIs and about forty lines of data manipulation. Recognising when that is the right answer saves a client a build, a deployment, and a subscription they would have paid for indefinitely.',
    servicesBehind: [
      { title: 'Workflow & Process Automation', body: 'Pipelines built on workflow engines, not bespoke apps' },
      { title: 'RAG & LLM Integrations', body: 'LLM summarisation inside a production pipeline' },
    ],
    meta: {
      title: 'AI-Powered SEO FAQ Automation with n8n & OpenAI — Case Study | IntelSol AI',
      description:
        'How we automated SEO FAQ research and writing with n8n, the AlsoAsked API, OpenAI and Google Docs — no custom backend and no extra SaaS subscription.',
    },
  },
] as const;

/** Lookup used by the dynamic route and the related-studies rail. */
export function caseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
