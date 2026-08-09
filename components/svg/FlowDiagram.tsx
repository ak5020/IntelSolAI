/**
 * Per-tab workflow diagram (S8).
 *
 * Same visual language as the hero graphic: rounded-rect nodes, hairline
 * borders, curved connectors. The connectors carry a moving dash so the
 * diagram reads as a live flow rather than a static chart.
 *
 * Four steps, stacked vertically — the sequence trigger → agent → action →
 * outcome reads more naturally top-to-bottom at the panel's width.
 */

type Props = {
  steps: readonly string[];
  /** Namespaces nothing today, but keeps keys stable across tab switches. */
  id: string;
};

const NODE_W = 300;
const NODE_H = 62;
const GAP = 34;
const X = 30;

export function FlowDiagram({ steps, id }: Props) {
  const height = steps.length * NODE_H + (steps.length - 1) * GAP;

  return (
    <svg
      viewBox={`0 0 360 ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Workflow: ${steps.join(', then ')}`}
      fill="none"
    >
      {/* Connectors, drawn first so nodes sit on top. */}
      <g stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round">
        {steps.slice(0, -1).map((step, i) => {
          const y = i * (NODE_H + GAP) + NODE_H;
          return (
            <path
              key={`${id}-c${step}`}
              d={`M180 ${y} C 180 ${y + 12}, 180 ${y + GAP - 12}, 180 ${y + GAP}`}
              strokeDasharray="4 8"
              style={{ animation: `dash-move 1.2s linear ${i * 0.15}s infinite` }}
            />
          );
        })}
      </g>

      {steps.map((step, i) => {
        const y = i * (NODE_H + GAP);
        /* The agent node is the one live element, so it carries the accent. */
        const isAgent = i === 1;

        return (
          <g key={`${id}-n${step}`}>
            <rect
              x={X}
              y={y}
              width={NODE_W}
              height={NODE_H}
              rx="12"
              fill={isAgent ? 'var(--color-bg-elev-2)' : 'var(--color-bg-elev)'}
              stroke={isAgent ? 'var(--color-accent)' : 'var(--color-line)'}
              strokeWidth={isAgent ? 1.5 : 1.25}
            />
            <text
              x={X + 20}
              y={y + NODE_H / 2 + 5}
              fill={isAgent ? 'var(--color-text)' : 'var(--color-body)'}
              fontFamily="var(--font-mono)"
              fontSize="13"
              letterSpacing="0.08em"
            >
              {step.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
