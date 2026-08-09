/**
 * Agent orchestration diagram — the page's signature visual.
 *
 * A central IntelSol Agent core with five capability nodes around it,
 * connected by quadratic paths. Data pulses travel those paths using CSS
 * `offset-path` + `offset-distance` rather than SMIL <animateMotion>, because:
 *
 *   1. it is declarative and needs zero JavaScript,
 *   2. one `prefers-reduced-motion` rule parks every pulse (see globals.css),
 *   3. SMIL on ten above-the-fold paths is a measurable mobile perf cost.
 *
 * Two variants are authored separately, never scaled from one another:
 *   - `hero`    — full five-node mesh, desktop and tablet
 *   - `compact` — deliberate three-node vertical stack for narrow screens
 *
 * `ambient` reuses the hero geometry at low opacity for the closing section,
 * so the page ends where it began.
 */

type Variant = 'hero' | 'ambient';

type Props = {
  variant?: Variant;
  /** Namespaces gradient ids so two instances can coexist on one page. */
  idPrefix?: string;
  className?: string;
};

/* --- Layout constants -------------------------------------------------------
   Everything is snapped to whole units on a 960×620 grid. */

const NODES = [
  { id: 'voice', label: 'Voice', cx: 230, cy: 150, delay: '0s' },
  { id: 'rag', label: 'RAG', cx: 730, cy: 150, delay: '0.8s' },
  { id: 'whatsapp', label: 'WhatsApp', cx: 170, cy: 390, delay: '1.6s' },
  { id: 'workflow', label: 'Workflow', cx: 790, cy: 390, delay: '2.4s' },
  { id: 'crm', label: 'CRM', cx: 480, cy: 560, delay: '3.2s' },
] as const;

/** Core → capability connectors. Pulse timings are deliberately coprime-ish
    so the five dots never fire in unison. */
const LINKS = [
  { d: 'M400 280 Q330 210 285 177', dur: '4.2s', delay: '0s' },
  { d: 'M560 280 Q630 210 675 177', dur: '4.6s', delay: '0.9s' },
  { d: 'M366 310 Q300 320 256 375', dur: '4s', delay: '1.7s' },
  { d: 'M594 310 Q660 320 704 375', dur: '4.4s', delay: '2.6s' },
  { d: 'M480 364 L480 533', dur: '3.8s', delay: '3.4s' },
] as const;

/** Peripheral arcs — they imply a mesh rather than a pure hub-and-spoke. */
const MESH = ['M144 150 Q90 260 150 363', 'M816 150 Q870 260 810 363'] as const;

/** One result travelling back inwards, in the signal colour. */
const RETURN_PATH = 'M480 533 L480 364';

/* --- Node glyphs: 16×16, same stroke language as the icon set ------------- */

function NodeGlyph({ id }: { id: string }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (id) {
    case 'voice':
      return (
        <g {...common}>
          <path d="M8 2.5a2 2 0 0 0-2 2v3a2 2 0 0 0 4 0v-3a2 2 0 0 0-2-2Z" />
          <path d="M3.5 7a4.5 4.5 0 0 0 9 0M8 11.5V14" />
        </g>
      );
    case 'rag':
      return (
        <g {...common}>
          <path d="M3 2.5h5l2.5 2.5v3" />
          <path d="M3 2.5v11h3.5" />
          <circle cx="10.5" cy="11" r="3" />
          <path d="m12.7 13.2 1.8 1.8" />
        </g>
      );
    case 'whatsapp':
      return (
        <g {...common}>
          <path d="M13.5 8.5A5.5 5.5 0 0 1 5 13.2L2.5 14l.8-2.5A5.5 5.5 0 1 1 13.5 8.5Z" />
        </g>
      );
    case 'workflow':
      return (
        <g {...common}>
          <rect x="1.75" y="2" width="4.5" height="3.5" rx="1" />
          <rect x="1.75" y="10.5" width="4.5" height="3.5" rx="1" />
          <rect x="9.75" y="6.25" width="4.5" height="3.5" rx="1" />
          <path d="M6.25 3.75h1.5a1 1 0 0 1 1 1V8M6.25 12.25h1.5a1 1 0 0 0 1-1V8M8.75 8h1" />
        </g>
      );
    default: /* crm */
      return (
        <g {...common}>
          <path d="M2 14h12" />
          <path d="M3.5 14v-3.5M7 14V7.5M10.5 14V9M14 14V4.5" />
        </g>
      );
  }
}

/* --- Full mesh (desktop) --------------------------------------------------- */

function HeroMesh({ variant, idPrefix }: { variant: Variant; idPrefix: string }) {
  const ambient = variant === 'ambient';
  /* The ambient copy runs at ~2.4× the hero duration so it reads as a slow
     background texture rather than competing with the form beside it. */
  const scale = ambient ? 2.4 : 1;
  const dur = (v: string) => `${parseFloat(v) * scale}s`;

  return (
    <svg
      viewBox="0 0 960 620"
      className="h-auto w-full"
      role={ambient ? undefined : 'img'}
      aria-hidden={ambient ? true : undefined}
      aria-labelledby={ambient ? undefined : `${idPrefix}-title`}
    >
      {!ambient && (
        <title id={`${idPrefix}-title`}>
          The IntelSol agent core connected to Voice, RAG, WhatsApp, Workflow and CRM
          capabilities, with data flowing between them
        </title>
      )}

      <defs>
        {/* Single subtle wash behind the core — no glow filters anywhere. */}
        <radialGradient id={`${idPrefix}-wash`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="480" cy="320" rx="340" ry="240" fill={`url(#${idPrefix}-wash)`} />

      {/* Connectors ------------------------------------------------------- */}
      <g stroke="var(--color-line-strong)" strokeWidth="1.25" fill="none">
        {LINKS.map((link) => (
          <path key={link.d} d={link.d} />
        ))}
        {MESH.map((d) => (
          <path key={d} d={d} strokeDasharray="3 6" opacity="0.65" />
        ))}
      </g>

      {/* Travelling data pulses ------------------------------------------- */}
      <g fill="var(--color-accent)">
        {LINKS.map((link) => (
          <circle
            key={`p-${link.d}`}
            data-pulse
            r="4.5"
            style={{
              offsetPath: `path("${link.d}")`,
              animation: `pulse-travel ${dur(link.dur)} linear ${link.delay} infinite`,
            }}
          />
        ))}
      </g>

      {/* A single result returning inwards, in the signal colour. */}
      <circle
        data-pulse
        r="4"
        fill="var(--color-signal)"
        style={{
          offsetPath: `path("${RETURN_PATH}")`,
          animation: `pulse-travel ${dur('5s')} linear 2.2s infinite`,
        }}
      />

      {/* Capability nodes -------------------------------------------------- */}
      {NODES.map((node) => (
        <g
          key={node.id}
          style={{ animation: `breathe ${scale * 4}s ease-in-out ${node.delay} infinite` }}
        >
          <rect
            x={node.cx - 95}
            y={node.cy - 32}
            width="190"
            height="64"
            rx="14"
            fill="var(--color-bg-elev)"
            stroke="var(--color-line)"
            strokeWidth="1.25"
          />
          {!ambient && (
            <g
              transform={`translate(${node.cx - 76} ${node.cy - 11}) scale(1.35)`}
              color="var(--color-muted)"
            >
              <NodeGlyph id={node.id} />
            </g>
          )}
          {/* Labels are omitted in the ambient copy: at 6% opacity, text
              reads as a rendering fault rather than as texture. */}
          {!ambient && (
            <text
              x={node.cx - 44}
              y={node.cy + 6}
              fill="var(--color-body)"
              fontFamily="var(--font-mono)"
              fontSize="18"
              letterSpacing="0.08em"
            >
              {node.label.toUpperCase()}
            </text>
          )}
        </g>
      ))}

      {/* Core -------------------------------------------------------------- */}
      <g>
        <rect
          x="364"
          y="276"
          width="232"
          height="88"
          rx="16"
          fill="var(--color-bg-elev-2)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        {!ambient && (
          <>
            <text
              x="480"
              y="312"
              textAnchor="middle"
              fill="var(--color-text)"
              fontFamily="var(--font-mono)"
              fontSize="19"
              letterSpacing="0.08em"
            >
              INTELSOL
            </text>
            <text
              x="480"
              y="338"
              textAnchor="middle"
              fill="var(--color-accent)"
              fontFamily="var(--font-mono)"
              fontSize="19"
              letterSpacing="0.08em"
            >
              AGENT
            </text>
          </>
        )}
      </g>
    </svg>
  );
}

/* --- Compact stack (mobile) — authored separately, not a scaled-down mesh --- */

function CompactStack({ idPrefix }: { idPrefix: string }) {
  const rows = [
    { y: 40, label: 'TRIGGER', accent: false },
    { y: 150, label: 'INTELSOL AGENT', accent: true },
    { y: 260, label: 'OUTCOME', accent: false },
  ];

  return (
    <svg viewBox="0 0 320 340" className="h-auto w-full" aria-hidden="true">
      <defs>
        <radialGradient id={`${idPrefix}-wash-sm`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="170" rx="150" ry="140" fill={`url(#${idPrefix}-wash-sm)`} />

      <g stroke="var(--color-line-strong)" strokeWidth="1.25">
        <path d="M160 104 L160 150" />
        <path d="M160 214 L160 260" />
      </g>

      <g fill="var(--color-accent)">
        <circle
          data-pulse
          r="3.5"
          style={{
            offsetPath: 'path("M160 104 L160 150")',
            animation: 'pulse-travel 2.6s linear 0s infinite',
          }}
        />
        <circle
          data-pulse
          r="3.5"
          style={{
            offsetPath: 'path("M160 214 L160 260")',
            animation: 'pulse-travel 2.6s linear 1.3s infinite',
          }}
        />
      </g>

      {rows.map((row, i) => (
        <g key={row.label} style={{ animation: `breathe 4s ease-in-out ${i * 0.9}s infinite` }}>
          <rect
            x="50"
            y={row.y}
            width="220"
            height="64"
            rx="14"
            fill={row.accent ? 'var(--color-bg-elev-2)' : 'var(--color-bg-elev)'}
            stroke={row.accent ? 'var(--color-accent)' : 'var(--color-line)'}
            strokeWidth={row.accent ? 1.5 : 1.25}
          />
          <text
            x="160"
            y={row.y + 38}
            textAnchor="middle"
            fill={row.accent ? 'var(--color-text)' : 'var(--color-body)'}
            fontFamily="var(--font-mono)"
            fontSize="13"
            letterSpacing="0.08em"
          >
            {row.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function OrbitGraphic({ variant = 'hero', idPrefix = 'orbit', className }: Props) {
  /* The ambient instance is background texture; it never needs the mobile
     rewrite, so it renders the mesh at every size. */
  if (variant === 'ambient') {
    return (
      <div className={className}>
        <HeroMesh variant="ambient" idPrefix={idPrefix} />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="hidden md:block">
        <HeroMesh variant="hero" idPrefix={idPrefix} />
      </div>
      <div className="mx-auto max-w-[320px] md:hidden">
        <CompactStack idPrefix={idPrefix} />
      </div>
    </div>
  );
}
