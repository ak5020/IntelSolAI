'use client';

import { useInView } from '@/lib/useInView';

/* ---------------------------------------------------------------------------
   Shared node-editor diagram
   ---------------------------------------------------------------------------
   Both case-study workflows are drawn by this one component rather than
   screenshotted. A screenshot of Zapier or n8n is a light-mode PNG: on this
   page it would need a white card to be legible, which is exactly what made
   the client logos look like stickers before they were redrawn. Drawing them
   means one colour system, crisp at any zoom, animatable, and no image bytes.

   The two diagrams have genuinely different shapes — one is a vertical tree
   that branches, the other a horizontal graph with a loop — so `orientation`
   decides which edge of a node an edge leaves from, and each diagram supplies
   its own coordinates.
--------------------------------------------------------------------------- */

export type FlowNode = {
  id: string;
  /** Top-left corner in viewBox units. */
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  /** Small line under the label — the app or the operation. */
  sub?: string;
  /** `accent` marks the trigger; `strong` marks a terminal/output node. */
  tone?: 'default' | 'accent' | 'strong';
  /** Step number badge, matching how the real editors number steps. */
  step?: string;
};

export type FlowEdge = {
  from: string;
  to: string;
  /** Branch label rendered on the edge, e.g. a path condition. */
  label?: string;
  /** Draw as a dashed return path — used for the loop-back in the SEO graph. */
  dashed?: boolean;
};

type Props = {
  nodes: readonly FlowNode[];
  edges: readonly FlowEdge[];
  /** viewBox dimensions. */
  width: number;
  height: number;
  /** Vertical: edges leave the bottom. Horizontal: edges leave the right. */
  orientation: 'vertical' | 'horizontal';
  /** Accessible description of the whole diagram. */
  title: string;
  desc: string;
  idPrefix: string;
  className?: string;
};

const RADIUS = 12;

/**
 * Orthogonal routing with rounded corners — straight runs and quarter turns,
 * the way a real node editor draws edges. Never diagonals.
 */
function edgePath(a: FlowNode, b: FlowNode, orientation: Props['orientation']): string {
  if (orientation === 'vertical') {
    const x1 = a.x + a.w / 2;
    const y1 = a.y + a.h;
    const x2 = b.x + b.w / 2;
    const y2 = b.y;

    // Straight drop when the two are already aligned.
    if (Math.abs(x1 - x2) < 1) return `M${x1} ${y1} V${y2}`;

    // Otherwise: down to the midpoint, across, then down into the target.
    const midY = y1 + (y2 - y1) / 2;
    const dir = x2 > x1 ? 1 : -1;
    return [
      `M${x1} ${y1}`,
      `V${midY - RADIUS}`,
      `Q${x1} ${midY} ${x1 + dir * RADIUS} ${midY}`,
      `H${x2 - dir * RADIUS}`,
      `Q${x2} ${midY} ${x2} ${midY + RADIUS}`,
      `V${y2}`,
    ].join(' ');
  }

  const x1 = a.x + a.w;
  const y1 = a.y + a.h / 2;
  const x2 = b.x;
  const y2 = b.y + b.h / 2;

  if (Math.abs(y1 - y2) < 1) return `M${x1} ${y1} H${x2}`;

  const midX = x1 + (x2 - x1) / 2;
  const dir = y2 > y1 ? 1 : -1;
  return [
    `M${x1} ${y1}`,
    `H${midX - RADIUS}`,
    `Q${midX} ${y1} ${midX} ${y1 + dir * RADIUS}`,
    `V${y2 - dir * RADIUS}`,
    `Q${midX} ${y2} ${midX + RADIUS} ${y2}`,
    `H${x2}`,
  ].join(' ');
}

/** Midpoint of an edge, for placing its branch label. */
function labelPoint(a: FlowNode, b: FlowNode, orientation: Props['orientation']) {
  if (orientation === 'vertical') {
    return { x: b.x + b.w / 2, y: a.y + a.h + (b.y - (a.y + a.h)) / 2 };
  }
  return { x: a.x + a.w + (b.x - (a.x + a.w)) / 2, y: b.y + b.h / 2 - 14 };
}

export function FlowChart({
  nodes,
  edges,
  width,
  height,
  orientation,
  title,
  desc,
  idPrefix,
  className,
}: Props) {
  /* Animation is gated on the diagram actually being on screen, so nothing
     animates in a part of the page nobody has scrolled to. */
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const byId = (id: string) => nodes.find((n) => n.id === id);

  /*
    Scroll rather than shrink. A 1370-unit diagram squeezed into a 360px phone
    column renders its 13px labels at about 3px — technically present, actually
    unreadable. Holding a minimum width and letting the container scroll keeps
    the type legible and matches how the site treats every other wide element.

    The scroller is focusable and labelled because a keyboard user needs to be
    able to pan it; a scrollable region with no way to reach it fails WCAG 2.1.1.
  */
  const minWidth = Math.min(width, 1040);

  return (
    <div
      ref={ref}
      className={`overflow-x-auto ${className ?? ''}`}
      tabIndex={0}
      role="group"
      aria-label={`${title} — scrollable diagram`}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby={`${idPrefix}-title ${idPrefix}-desc`}
        className="h-auto w-full"
        style={{ minWidth }}
      >
        <title id={`${idPrefix}-title`}>{title}</title>
        <desc id={`${idPrefix}-desc`}>{desc}</desc>

        <defs>
          <pattern id={`${idPrefix}-dots`} width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="var(--color-line)" />
          </pattern>
          <radialGradient id={`${idPrefix}-wash`}>
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.07" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Canvas: the dotted grid is what makes it read as a node editor. */}
        <rect width={width} height={height} fill="var(--color-bg)" rx="14" />
        <rect width={width} height={height} fill={`url(#${idPrefix}-dots)`} rx="14" />
        <ellipse
          cx={width / 2}
          cy={height / 2}
          rx={width * 0.42}
          ry={height * 0.42}
          fill={`url(#${idPrefix}-wash)`}
        />

        {/* --- Edges, drawn under the nodes --------------------------------- */}
        <g fill="none">
          {edges.map((edge, i) => {
            const a = byId(edge.from);
            const b = byId(edge.to);
            if (!a || !b) return null;
            const d = edgePath(a, b, orientation);
            const point = edge.label ? labelPoint(a, b, orientation) : null;

            return (
              <g key={`${edge.from}-${edge.to}-${i}`}>
                <path
                  d={d}
                  stroke="var(--color-line-strong)"
                  strokeWidth="1.5"
                  strokeDasharray={edge.dashed ? '5 5' : undefined}
                  /* 2000 is comfortably longer than any path here, so the
                     dash never repeats and the draw runs exactly once. */
                  style={
                    inView && !edge.dashed
                      ? {
                          strokeDasharray: 2000,
                          animation: `draw 900ms var(--ease-out-expo) ${i * 60}ms both`,
                        }
                      : undefined
                  }
                />
                {point && (
                  <>
                    <rect
                      x={point.x - edge.label!.length * 3.4 - 8}
                      y={point.y - 10}
                      width={edge.label!.length * 6.8 + 16}
                      height="20"
                      rx="10"
                      fill="var(--color-bg-elev)"
                      stroke="var(--color-line)"
                    />
                    <text
                      x={point.x}
                      y={point.y + 4}
                      textAnchor="middle"
                      fill="var(--color-muted)"
                      style={{ font: '500 11px var(--font-sans)' }}
                    >
                      {edge.label}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </g>

        {/* --- Nodes -------------------------------------------------------- */}
        {nodes.map((node, i) => {
          const accent = node.tone === 'accent';
          const strong = node.tone === 'strong';

          return (
            <g
              key={node.id}
              style={
                inView
                  ? { animation: `node-in 420ms var(--ease-out-expo) ${120 + i * 70}ms both` }
                  : { opacity: 0 }
              }
            >
              <rect
                x={node.x}
                y={node.y}
                width={node.w}
                height={node.h}
                rx="10"
                fill={strong ? 'var(--color-bg-elev-2)' : 'var(--color-bg-elev)'}
                stroke={accent ? 'var(--color-accent)' : 'var(--color-line-strong)'}
                strokeWidth={accent ? 1.5 : 1}
              />

              {/* Step badge, mirroring how Zapier and n8n number their steps. */}
              {node.step && (
                <>
                  <rect
                    x={node.x + 10}
                    y={node.y + 10}
                    width="20"
                    height="18"
                    rx="5"
                    fill={accent ? 'var(--color-accent)' : 'var(--color-bg)'}
                    stroke={accent ? 'var(--color-accent)' : 'var(--color-line-strong)'}
                  />
                  <text
                    x={node.x + 20}
                    y={node.y + 23}
                    textAnchor="middle"
                    fill={accent ? 'var(--color-accent-ink)' : 'var(--color-muted)'}
                    style={{ font: '500 11px var(--font-mono)' }}
                  >
                    {node.step}
                  </text>
                </>
              )}

              <text
                x={node.step ? node.x + 38 : node.x + 14}
                y={node.y + (node.sub ? 24 : node.h / 2 + 4)}
                fill="var(--color-text)"
                style={{ font: '600 13px var(--font-sans)' }}
              >
                {node.label}
              </text>

              {node.sub && (
                <text
                  x={node.step ? node.x + 38 : node.x + 14}
                  y={node.y + 42}
                  fill="var(--color-muted)"
                  style={{ font: '400 11.5px var(--font-mono)' }}
                >
                  {node.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
