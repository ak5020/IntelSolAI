'use client';

import {
  AgentIcon,
  CalendarIcon,
  ChatIcon,
  CheckIcon,
  CrmIcon,
  type IconProps,
  MailIcon,
  SyncIcon,
  UserIcon,
} from '@/components/svg/icons';
import { FallbackGlyph, integrationGlyphs } from '@/components/svg/IntegrationGlyphs';
import { workflowCopy, workflowNodes, workflowStack } from '@/lib/content';
import { useInView } from '@/lib/useInView';

/* ---------------------------------------------------------------------------
   Geometry
   ---------------------------------------------------------------------------
   The viewBox is 1000 wide against a ~1144px content column, so the canvas
   renders at roughly 1:1 and the labels stay at their intended size. Designing
   it wider would shrink the type at exactly the moment it needs to be read.
--------------------------------------------------------------------------- */

/* 186 rather than a snug 170: the longest label needs ~101 units and this
   leaves ~27 to spare, so renaming a node in content.ts does not silently push
   its text out of the box. SVG text cannot wrap or shrink to fit. */
const NODE_W = 186;
const NODE_H = 60;
const AGENT_W = 200;
const AGENT_H = 76;

type Placed = { id: string; x: number; y: number; w: number; h: number };

const PLACED: Placed[] = [
  { id: 'trigger', x: 110, y: 140, w: NODE_W, h: NODE_H },
  { id: 'enrich', x: 320, y: 140, w: NODE_W, h: NODE_H },
  { id: 'agent', x: 530, y: 132, w: AGENT_W, h: AGENT_H },
  { id: 'reply', x: 790, y: 140, w: NODE_W, h: NODE_H },
  { id: 'qualify', x: 320, y: 290, w: NODE_W, h: NODE_H },
  /* Centred on the agent (x 630) so the trunk edge runs dead straight. */
  { id: 'book', x: 537, y: 290, w: NODE_W, h: NODE_H },
  { id: 'sync', x: 790, y: 290, w: NODE_W, h: NODE_H },
  { id: 'escalate', x: 537, y: 430, w: NODE_W, h: NODE_H },
];

/**
 * Orthogonal routing with rounded corners, the way a real node editor draws
 * edges — straight runs with quarter-turns, never diagonals.
 *
 * `len` seeds strokeDasharray for the draw-on animation and MUST be at least
 * the path's real length. Set it short and the dash pattern repeats, so the
 * edge renders as a broken line instead of a solid one once drawn.
 */
const EDGES = [
  { d: 'M296 170 H320', len: 30, delay: 0.35 },
  { d: 'M506 170 H530', len: 30, delay: 0.55 },
  { d: 'M730 170 H790', len: 60, delay: 0.75 },
  // Agent fans out to the three parallel branches.
  { d: 'M630 208 V236 Q630 250 616 250 H427 Q413 250 413 264 V290', len: 330, delay: 0.95 },
  { d: 'M630 208 V290', len: 82, delay: 1.05 },
  { d: 'M630 208 V236 Q630 250 644 250 H869 Q883 250 883 264 V290', len: 330, delay: 1.15 },
  /* The human handoff is the "else" branch of the qualification decision, not
     something that happens after a meeting is booked. Routed from Qualify and
     across so the graph stays balanced. */
  { d: 'M413 350 V386 Q413 400 427 400 H616 Q630 400 630 414 V430', len: 330, delay: 1.35 },
];

/** Pulses reuse the edge paths, staggered so they never fire together. */
const PULSES = [
  { path: EDGES[0]!.d, dur: '2.4s', delay: '0s' },
  { path: EDGES[2]!.d, dur: '2.8s', delay: '0.7s' },
  { path: EDGES[3]!.d, dur: '4.2s', delay: '1.3s' },
  { path: EDGES[5]!.d, dur: '4.2s', delay: '2.1s' },
];

const ICONS: Record<string, (p: IconProps) => React.JSX.Element> = {
  mail: MailIcon,
  crm: CrmIcon,
  agent: AgentIcon,
  chat: ChatIcon,
  check: CheckIcon,
  calendar: CalendarIcon,
  sync: SyncIcon,
  user: UserIcon,
};

export function WorkflowCanvas() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  /* Animations are only attached once the canvas is on screen. Running seven
     path draws and five travelling pulses from page load would cost main-thread
     time for something nobody has scrolled to yet. */
  const anim = (value: string) => (inView ? { animation: value } : undefined);

  return (
    <div ref={ref}>
      {/* --- Canvas: large screens only. Below lg the viewBox would scale the
              labels down to single digits, so the stack below is used instead. */}
      <div className="hidden overflow-hidden rounded-card border border-line bg-bg-elev lg:block">
        <svg
          viewBox="0 0 1000 530"
          className="h-auto w-full"
          role="img"
          aria-labelledby="workflow-canvas-title"
        >
          <title id="workflow-canvas-title">
            A workflow graph: a new enquiry is enriched and scored, passed to the IntelSol
            agent, which drafts a reply and branches into qualifying the lead, booking a
            meeting and syncing the CRM, with an escalation path to a human.
          </title>

          <defs>
            {/* Dot grid — a pattern costs one definition instead of hundreds of
                elements, and the browser tiles it on the GPU. */}
            <pattern id="wf-dots" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="var(--color-line)" />
            </pattern>
            <radialGradient id="wf-wash" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.09" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1000" height="530" fill="var(--color-bg)" />
          <rect y="82" width="1000" height="448" fill="url(#wf-dots)" />
          <ellipse cx="620" cy="230" rx="420" ry="200" fill="url(#wf-wash)" />

          {/* --- Chrome: toolbar ------------------------------------------- */}
          <g>
            <rect y="0" width="1000" height="56" fill="var(--color-bg-elev)" />
            <line x1="0" y1="56" x2="1000" y2="56" stroke="var(--color-line)" strokeWidth="1" />

            <rect
              x="24"
              y="14"
              width="196"
              height="28"
              rx="6"
              fill="var(--color-bg)"
              stroke="var(--color-line)"
            />
            <text
              x="38"
              y="33"
              fill="var(--color-body)"
              fontFamily="var(--font-mono)"
              fontSize="13"
              letterSpacing="0.08em"
            >
              {workflowCopy.fileName}
            </text>

            <rect
              x="236"
              y="14"
              width="150"
              height="28"
              rx="6"
              fill="var(--color-bg)"
              stroke="var(--color-line)"
            />
            <text
              x="250"
              y="33"
              fill="var(--color-muted)"
              fontFamily="var(--font-mono)"
              fontSize="13"
              letterSpacing="0.08em"
            >
              AGENT MODE
            </text>

            {/* Live status, far right. */}
            {/* CSS, not SMIL: <animate> runs on the main thread, and the rest
                of this codebase deliberately avoids it for that reason. */}
            <circle
              cx="906"
              cy="28"
              r="4"
              fill="var(--color-accent)"
              style={anim('breathe 2.2s ease-in-out infinite')}
            />
            <text
              x="920"
              y="33"
              fill="var(--color-accent)"
              fontFamily="var(--font-mono)"
              fontSize="13"
              letterSpacing="0.08em"
            >
              {workflowCopy.status.toUpperCase()}
            </text>
          </g>

          {/* --- Chrome: model rail ---------------------------------------- */}
          <g>
            <text
              x="24"
              y="112"
              fill="var(--color-muted)"
              fontFamily="var(--font-mono)"
              fontSize="11"
              letterSpacing="0.08em"
            >
              STACK
            </text>
            {workflowStack.map((name, i) => {
              const Glyph = integrationGlyphs[name] ?? FallbackGlyph;
              const y = 128 + i * 52;
              return (
                <g key={name} style={anim(`node-in 420ms var(--ease-out-expo) ${i * 90}ms both`)}>
                  <rect
                    x="24"
                    y={y}
                    width="44"
                    height="44"
                    rx="10"
                    fill="var(--color-bg-elev)"
                    stroke="var(--color-line)"
                  />
                  <Glyph
                    x={36}
                    y={y + 12}
                    width={20}
                    height={20}
                    style={{ color: 'var(--color-muted)' }}
                  />
                </g>
              );
            })}
          </g>

          {/* --- Edges, drawn before nodes so the nodes sit on top ---------- */}
          <g fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5">
            {EDGES.map((edge) => (
              <path
                key={edge.d}
                d={edge.d}
                strokeDasharray={edge.len}
                strokeDashoffset={inView ? edge.len : 0}
                style={anim(`draw 600ms var(--ease-out-expo) ${edge.delay}s both`)}
              />
            ))}
          </g>

          {/* Edge label — makes the decision legible without a legend. */}
          <text
            x="424"
            y="380"
            fill="var(--color-muted)"
            fontFamily="var(--font-mono)"
            fontSize="11"
            letterSpacing="0.08em"
            style={anim('node-in 400ms var(--ease-out-expo) 1.5s both')}
          >
            ELSE
          </text>

          {/* --- Travelling data ------------------------------------------- */}
          <g fill="var(--color-accent)">
            {PULSES.map((pulse, i) => (
              <circle
                key={i}
                data-pulse
                r="3.5"
                style={
                  inView
                    ? {
                        offsetPath: `path("${pulse.path}")`,
                        animation: `pulse-travel ${pulse.dur} linear ${pulse.delay} infinite`,
                      }
                    : { opacity: 0 }
                }
              />
            ))}
          </g>

          {/* --- Nodes ------------------------------------------------------ */}
          {PLACED.map((slot, i) => {
            const node = workflowNodes.find((n) => n.id === slot.id);
            if (!node) return null;
            const Icon = ICONS[node.icon] ?? AgentIcon;
            const isAgent = node.id === 'agent';
            const cy = slot.y + slot.h / 2;

            return (
              <g
                key={node.id}
                style={anim(`node-in 500ms var(--ease-out-expo) ${0.2 + i * 0.09}s both`)}
              >
                <rect
                  x={slot.x}
                  y={slot.y}
                  width={slot.w}
                  height={slot.h}
                  rx="12"
                  fill={isAgent ? 'var(--color-bg-elev-2)' : 'var(--color-bg-elev)'}
                  stroke={isAgent ? 'var(--color-accent)' : 'var(--color-line-strong)'}
                  strokeWidth={isAgent ? 1.5 : 1.25}
                />
                <Icon
                  x={slot.x + 16}
                  y={cy - 10}
                  width={20}
                  height={20}
                  style={{ color: isAgent ? 'var(--color-accent)' : 'var(--color-muted)' }}
                />
                <text
                  x={slot.x + 46}
                  y={cy - 1}
                  fill="var(--color-text)"
                  fontFamily="var(--font-sans)"
                  fontSize="15"
                  fontWeight="500"
                >
                  {node.title}
                </text>
                <text
                  x={slot.x + 46}
                  y={cy + 15}
                  fill="var(--color-muted)"
                  fontFamily="var(--font-sans)"
                  fontSize="12"
                >
                  {node.meta}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* --- Below lg: the same graph as a readable vertical stack --------- */}
      <ol className="flex flex-col lg:hidden">
        {workflowNodes.map((node, i) => {
          const Icon = ICONS[node.icon] ?? AgentIcon;
          const isAgent = node.id === 'agent';
          return (
            <li key={node.id}>
              <div
                className={`flex items-center gap-4 rounded-card border p-4 ${
                  isAgent
                    ? 'border-accent bg-bg-elev-2'
                    : 'border-line-strong bg-bg-elev'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isAgent ? 'text-accent' : 'text-muted'}`} />
                <div>
                  <p className="font-medium text-text">{node.title}</p>
                  <p className="text-sm text-muted">{node.meta}</p>
                </div>
              </div>
              {/* Connector between cards, omitted after the last one. */}
              {i < workflowNodes.length - 1 && (
                <div aria-hidden="true" className="ml-8 h-5 w-px bg-line-strong" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
