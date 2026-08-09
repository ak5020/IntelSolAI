/**
 * IntelSol AI logo, hand-authored from the supplied mark.
 *
 * The glyph is a three-node network: a hub with two branches to the upper and
 * lower right and one to the left. Everything is drawn on a 24-unit grid so it
 * stays crisp at any size and inherits colour via currentColor.
 */

type MarkProps = {
  /** Renders the rounded mint tile behind the glyph, as in the app icon. */
  tile?: boolean;
  className?: string;
};

/** The network glyph on its own — used inside the tile and as a bare bullet. */
export function LogoMark({ tile = true, className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      {tile && <rect width="24" height="24" rx="6.5" fill="var(--color-accent)" />}
      <g
        stroke={tile ? 'var(--color-accent-ink)' : 'currentColor'}
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        {/* Connectors: hub → left node, hub → upper right, hub → lower right */}
        <path d="M10.15 12H8.35" />
        <path d="M13.5 10.85l2.6-1.55" />
        <path d="M13.5 13.15l2.6 1.55" />
      </g>
      <g fill={tile ? 'var(--color-accent-ink)' : 'currentColor'}>
        <circle cx="6.6" cy="12" r="1.85" />
        <circle cx="11.9" cy="12" r="2.05" />
        <circle cx="17.6" cy="8.5" r="1.85" />
        <circle cx="17.6" cy="15.5" r="1.85" />
      </g>
    </svg>
  );
}

type LogoProps = {
  /** Hides the wordmark, leaving only the tile (used in tight mobile headers). */
  markOnly?: boolean;
  className?: string;
};

/** Full lockup: tile + "IntelSol" in text colour + "AI" in accent. */
export function Logo({ markOnly = false, className }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoMark className="h-8 w-8 shrink-0" />
      {!markOnly && (
        <span className="font-display text-[1.15rem] font-extrabold tracking-[-0.02em] text-text">
          IntelSol<span className="text-accent">AI</span>
        </span>
      )}
    </span>
  );
}
