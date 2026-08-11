/**
 * Icon set — every icon is hand-authored on a 24×24 grid in ONE visual
 * language: 1.5 stroke, currentColor, round caps and joins, no fills.
 *
 * Don't add an icon here that breaks those rules; the consistency is what
 * makes the set read as designed rather than assembled.
 */

import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement>;

/** Shared wrapper so no individual icon can drift from the house style. */
function Icon({ children, ...props }: IconProps) {
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

/* ===========================================================================
   S4 — Service icons
   =========================================================================== */

/** Agentic AI: a hub delegating to three sub-agents. */
export const AgentIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="5.5" r="2.5" />
    <circle cx="5" cy="18.5" r="2.5" />
    <circle cx="19" cy="18.5" r="2.5" />
    <circle cx="12" cy="18.5" r="2.5" />
    <path d="M12 8v3.5M12 11.5H5.6a.6.6 0 0 0-.6.6V16M12 11.5h6.4a.6.6 0 0 1 .6.6V16M12 11.5V16" />
  </Icon>
);

/** Voice AI: waveform inside a call handset arc. */
export const VoiceIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 0-3-3Z" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
    <path d="M12 17.5V21" />
    <path d="M8.75 21h6.5" />
  </Icon>
);

/** Chatbot: message frame with a reply tail and two dialogue lines. */
export const ChatIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 13.5a2.5 2.5 0 0 1-2.5 2.5H9l-4 3.5V6.5A2.5 2.5 0 0 1 7.5 4h10A2.5 2.5 0 0 1 20 6.5Z" />
    <path d="M8.5 8.5h7M8.5 11.75h4.5" />
  </Icon>
);

/** Workflow: two branches converging into a single output. */
export const WorkflowIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.75" y="3.5" width="6" height="5" rx="1.5" />
    <rect x="2.75" y="15.5" width="6" height="5" rx="1.5" />
    <rect x="15.25" y="9.5" width="6" height="5" rx="1.5" />
    <path d="M8.75 6h2.75a1.5 1.5 0 0 1 1.5 1.5V11a1 1 0 0 0 1 1h1.25" />
    <path d="M8.75 18h2.75a1.5 1.5 0 0 0 1.5-1.5V13a1 1 0 0 1 1-1h1.25" />
  </Icon>
);

/** CRM: a pipeline of stages with a rising trend. */
export const CrmIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 20.25h17" />
    <rect x="4.5" y="14" width="4" height="4" rx="1" />
    <rect x="10" y="10" width="4" height="8" rx="1" />
    <rect x="15.5" y="5.75" width="4" height="12.25" rx="1" />
    <path d="M4.75 9.5 9 6.75l3.25 1.75L19 3.75" />
  </Icon>
);

/** RAG: a document feeding a retrieval index. */
export const RagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 3.75h6.5L16 7.25v5.25" />
    <path d="M6 3.75A1.25 1.25 0 0 0 4.75 5v14A1.25 1.25 0 0 0 6 20.25h4" />
    <path d="M12.25 3.9v3.35H15.6" />
    <circle cx="16.75" cy="16.75" r="3.5" />
    <path d="M19.4 19.4 21.25 21.25" />
  </Icon>
);

/* ===========================================================================
   S9 — Industry icons
   =========================================================================== */

export const RocketIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2.75c3 2 4.5 5.25 4.5 8.75L12 16.5l-4.5-5c0-3.5 1.5-6.75 4.5-8.75Z" />
    <circle cx="12" cy="10" r="1.75" />
    <path d="M7.5 13.5 5 15.25l.75 3.5 3-1.25M16.5 13.5 19 15.25l-.75 3.5-3-1.25" />
    <path d="M10.5 19.5c.75 1 1.5 1.75 1.5 1.75s.75-.75 1.5-1.75" />
  </Icon>
);

export const ShieldIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2.75 4.75 5.75v5.5c0 4.25 3 8.25 7.25 10 4.25-1.75 7.25-5.75 7.25-10v-5.5Z" />
    <path d="m9.25 11.75 2 2 3.5-3.75" />
  </Icon>
);

export const LayersIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 2.75 8.25 4.5L12 11.75 3.75 7.25Z" />
    <path d="m3.75 12 8.25 4.5L20.25 12" />
    <path d="m3.75 16.75 8.25 4.5 8.25-4.5" />
  </Icon>
);

export const CartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.75 3.75h2.4l2.1 10.5h9.6l2.4-7.75H6.1" />
    <circle cx="9" cy="19" r="1.5" />
    <circle cx="17" cy="19" r="1.5" />
  </Icon>
);

export const PulseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.75 12h4l2-5.25L12 17l2.25-7.25L16 12h5.25" />
  </Icon>
);

export const BuildingIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.25 20.25V5.5a1.25 1.25 0 0 1 1.25-1.25h6a1.25 1.25 0 0 1 1.25 1.25v14.75" />
    <path d="M12.75 20.25V10h5.5a1.25 1.25 0 0 1 1.25 1.25v9" />
    <path d="M2.75 20.25h18.5" />
    <path d="M7 8h2.5M7 11.75h2.5M7 15.5h2.5M15.75 13.5h1M15.75 16.75h1" />
  </Icon>
);

/* ===========================================================================
   UI icons
   =========================================================================== */

export const ChevronIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6.5 9.25 5.5 5.5 5.5-5.5" />
  </Icon>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.75 12h14.5" />
    <path d="m13.5 6.25 5.75 5.75-5.75 5.75" />
  </Icon>
);

export const ArrowUpIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 19.25V4.75" />
    <path d="m6.25 10.5 5.75-5.75 5.75 5.75" />
  </Icon>
);

export const MailIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.75" y="5" width="18.5" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </Icon>
);

export const LinkedInIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="3" />
    <path d="M7.5 10.5v6.25" />
    <circle cx="7.5" cy="7.75" r="0.9" />
    <path d="M11.5 16.75V10.5m0 1.75a2.5 2.5 0 0 1 5 0v4.5" />
  </Icon>
);

export const CalendarIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.75" y="5" width="16.5" height="15.25" rx="2.5" />
    <path d="M3.75 9.75h16.5M8.5 3.5v3M15.5 3.5v3" />
    <path d="m9.75 14.5 1.75 1.75 3.25-3.5" />
  </Icon>
);

export const SyncIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.75 12a7.25 7.25 0 0 1 12.4-5.1" />
    <path d="M19.25 12a7.25 7.25 0 0 1-12.4 5.1" />
    <path d="M17.25 3.5v3.5h-3.5M6.75 20.5V17h3.5" />
  </Icon>
);

export const UserIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8.25" r="3.5" />
    <path d="M4.75 20.25a7.25 7.25 0 0 1 14.5 0" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m4.75 12.5 4.5 4.5 10-10" />
  </Icon>
);

export const AlertIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9.25" />
    <path d="M12 7.5v5.25" />
    <path d="M12 16.25h.01" />
  </Icon>
);

/** Loading spinner — the ring is drawn as a partial arc and rotated by CSS. */
export const SpinnerIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2.75a9.25 9.25 0 1 1-9.25 9.25" />
  </Icon>
);

/* ===========================================================================
   Lookup maps — content.ts stores icon names as strings, and sections resolve
   them here so copy never imports components.
   =========================================================================== */

export const serviceIcons = {
  agent: AgentIcon,
  voice: VoiceIcon,
  chat: ChatIcon,
  workflow: WorkflowIcon,
  crm: CrmIcon,
  rag: RagIcon,
} as const;

export const industryIcons = {
  rocket: RocketIcon,
  shield: ShieldIcon,
  layers: LayersIcon,
  cart: CartIcon,
  pulse: PulseIcon,
  building: BuildingIcon,
} as const;
