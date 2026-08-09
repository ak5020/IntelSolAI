/**
 * Integration glyphs.
 *
 * These are deliberately NOT the vendors' trademarked logos — tracing those
 * badly looks worse than not using them, and redistributing them raises
 * licensing questions. Each is a clean geometric mark in the same 24×24,
 * 1.5-stroke language as the rest of the icon set, and the product name is
 * always shown in mono type beside it so there is no ambiguity.
 */

import type { IconProps } from './icons';

function G({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* Hexagon — OpenAI */
const Hexagon = (p: IconProps) => (
  <G {...p}>
    <path d="m12 3 7.5 4.5v9L12 21l-7.5-4.5v-9Z" />
  </G>
);

/* Radiating burst — Anthropic Claude */
const Burst = (p: IconProps) => (
  <G {...p}>
    <path d="M12 3.5v17M4.75 7.75l14.5 8.5M19.25 7.75l-14.5 8.5" />
  </G>
);

/* Four-point sparkle — Google Gemini */
const Sparkle = (p: IconProps) => (
  <G {...p}>
    <path d="M12 3c0 4.5 3 7.5 7.5 7.5C15 10.5 12 13.5 12 18c0-4.5-3-7.5-7.5-7.5C9 10.5 12 7.5 12 3Z" />
  </G>
);

/* Linked nodes — n8n */
const Nodes = (p: IconProps) => (
  <G {...p}>
    <circle cx="5" cy="12" r="2.25" />
    <circle cx="12" cy="7" r="2.25" />
    <circle cx="19" cy="12" r="2.25" />
    <path d="m6.85 10.7 3.3-2.35M13.85 8.35l3.3 2.35" />
  </G>
);

/* Interlocking rings — Make.com */
const Rings = (p: IconProps) => (
  <G {...p}>
    <circle cx="9" cy="12" r="5.25" />
    <circle cx="15" cy="12" r="5.25" />
  </G>
);

/* Eight-spoke asterisk — Zapier */
const Asterisk = (p: IconProps) => (
  <G {...p}>
    <path d="M12 4v16M4 12h16M6.35 6.35l11.3 11.3M17.65 6.35 6.35 17.65" />
  </G>
);

/* Hub with spokes — HubSpot */
const Hub = (p: IconProps) => (
  <G {...p}>
    <circle cx="12" cy="14" r="3.5" />
    <path d="M12 10.5V5M12 5h4.5" />
    <circle cx="18" cy="5" r="1.75" />
  </G>
);

/* Cloud — Salesforce */
const Cloud = (p: IconProps) => (
  <G {...p}>
    <path d="M7.5 18.5a3.75 3.75 0 0 1-.4-7.48A4.75 4.75 0 0 1 16 9.6a3.45 3.45 0 0 1 .5 8.9Z" />
  </G>
);

/* Woven bars — Slack */
const Weave = (p: IconProps) => (
  <G {...p}>
    <path d="M9 3.5v17M15 3.5v17M3.5 9h17M3.5 15h17" />
  </G>
);

/* Chat bubble — WhatsApp */
const Bubble = (p: IconProps) => (
  <G {...p}>
    <path d="M20.5 11.75a8 8 0 0 1-12.3 6.77L3.5 20l1.5-4.6a8 8 0 1 1 15.5-3.65Z" />
  </G>
);

/* Ring of dots — Twilio */
const DotRing = (p: IconProps) => (
  <G {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="9.25" cy="9.25" r="1.15" fill="currentColor" stroke="none" />
    <circle cx="14.75" cy="9.25" r="1.15" fill="currentColor" stroke="none" />
    <circle cx="9.25" cy="14.75" r="1.15" fill="currentColor" stroke="none" />
    <circle cx="14.75" cy="14.75" r="1.15" fill="currentColor" stroke="none" />
  </G>
);

/* Calendar — Google Calendar */
const Calendar = (p: IconProps) => (
  <G {...p}>
    <rect x="3.75" y="5" width="16.5" height="15.25" rx="2.5" />
    <path d="M3.75 9.75h16.5M8.5 3.5v3M15.5 3.5v3" />
  </G>
);

/* Offset bars — Stripe */
const Bars = (p: IconProps) => (
  <G {...p}>
    <path d="M5.5 8.25h11M7.5 12h11M5.5 15.75h11" />
  </G>
);

/* Page with fold — Notion */
const Page = (p: IconProps) => (
  <G {...p}>
    <rect x="4.5" y="3.75" width="15" height="16.5" rx="2.5" />
    <path d="M8.75 8.5v7l6.5-7v7" />
  </G>
);

/* Bolt — Supabase */
const Bolt = (p: IconProps) => (
  <G {...p}>
    <path d="M13.25 3 5.5 13.25h5.5L10.75 21l7.75-10.25H13Z" />
  </G>
);

/* Grid — Airtable */
const Grid = (p: IconProps) => (
  <G {...p}>
    <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="2.5" />
    <path d="M3.75 9.5h16.5M9.5 9.5v10.75" />
  </G>
);

/** Name → glyph. Anything missing falls back to the neutral hexagon. */
export const integrationGlyphs: Record<string, (p: IconProps) => React.JSX.Element> = {
  OpenAI: Hexagon,
  'Anthropic Claude': Burst,
  'Google Gemini': Sparkle,
  n8n: Nodes,
  'Make.com': Rings,
  Zapier: Asterisk,
  HubSpot: Hub,
  Salesforce: Cloud,
  Slack: Weave,
  WhatsApp: Bubble,
  Twilio: DotRing,
  'Google Calendar': Calendar,
  Stripe: Bars,
  Notion: Page,
  Supabase: Bolt,
  Airtable: Grid,
};

export const FallbackGlyph = Hexagon;
