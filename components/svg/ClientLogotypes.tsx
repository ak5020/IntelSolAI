/**
 * Client logotypes — hand-drawn marks plus typeset names.
 *
 * These replace the scanned PNG logos. A raster logo on a dark page has to sit
 * on a white tile to stay legible, which is what made the strip look like a
 * sheet of stickers rather than a client list. Drawing the marks instead means:
 *
 *   - one colour, inherited via `currentColor`, so dimming a logo is just a
 *     text-colour change and the whole strip reads as one system
 *   - genuinely transparent, at any size, on any background
 *   - crisp at every DPR, with no image requests at all (the five PNGs were
 *     ~150KB between them)
 *
 * IMPORTANT — these are typographic interpretations, not the companies'
 * official trademarks. Each mark is a simplified redraw of the real one and the
 * names are set in this site's typeface. See HANDOFF §1.4: this still needs the
 * same client sign-off the original logos did, and any client who wants their
 * exact brand asset used should be given that option.
 *
 * Every lockup renders inside a fixed 190×112 slot, so they are drawn to a
 * common optical weight rather than a common bounding box — a wide wordmark and
 * a tall stacked one look aligned even though their outlines differ.
 */

/** Shared mark sizing, so no lockup drifts out of step with the others. */
const MARK = 'h-7 w-7 shrink-0';

/**
 * Customer Support Leaders — a community brand whose logo is a hand-brushed
 * ring. Two offset open arcs stand in for the sketched double circle.
 */
function CustomerSupportLeadersMark() {
  return (
    <svg viewBox="0 0 32 32" className={MARK} aria-hidden="true" fill="none">
      {/* Outer sketch ring, opened at the top-right like the brushed original. */}
      <path
        d="M25.5 8.2a12 12 0 1 0 2.4 5.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Inner ring, offset so the two never sit concentric — that offset is
          what makes a drawn circle read as drawn rather than geometric. */}
      <path
        d="M9.6 24.4a9 9 0 1 1 12.6-1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

/**
 * NextGen Healthcare — the angular "N" bolt from their app icon, redrawn as a
 * single mitred stroke.
 */
function NextGenMark() {
  return (
    <svg viewBox="0 0 32 32" className={MARK} aria-hidden="true" fill="none">
      <path
        d="M3 22.5 10.5 12l6 7.5L27 7.5"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
    </svg>
  );
}

/**
 * LeadLaya — the stacked "b" monogram. The two square counters in the original
 * are cut out with evenodd rather than painted, so the mark stays a single
 * colour and works on any background.
 */
function LeadLayaMark() {
  return (
    <svg viewBox="0 0 32 32" className={MARK} aria-hidden="true" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4h5.5v18.5H15V28H8a4 4 0 0 1-4-4V4Zm11.5 6.5H20a8.75 8.75 0 0 1 0 17.5h-4.5v-5.5H20a3.25 3.25 0 0 0 0-6.5h-4.5v-5.5ZM11 11h4v5h-4v-5Zm0 12h4v5h-4v-5Z"
      />
    </svg>
  );
}

/**
 * Finance House — the pointed arch that sits above their wordmark, as an
 * outline so it holds up at 28px.
 */
function FinanceHouseMark() {
  return (
    <svg viewBox="0 0 32 32" className={MARK} aria-hidden="true" fill="none">
      {/* Arch: two curved shoulders meeting at a point, on a flat base. */}
      <path
        d="M6 28V16.5C6 10.7 10.4 5.6 16 3c5.6 2.6 10 7.7 10 13.5V28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M6 28h20" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    </svg>
  );
}

/**
 * Wow Customer Support — the segmented "C" dial. Six wedges around an open
 * ring; the gaps between them are what make it read as segmented.
 */
function WowMark() {
  return (
    <svg viewBox="0 0 32 32" className={MARK} aria-hidden="true" fill="none">
      {/*
        One circle, segmented by its dash pattern rather than by five separate
        paths. Circumference at r=11 is 2πr ≈ 69.1, and the pattern is built to
        add up to exactly that so it closes cleanly instead of repeating:

          4 segments × 11  = 44
          3 gaps     × 3.5 = 10.5
          mouth of the C   = 14.6
                             ----
                             69.1

        A circle's dash pattern starts at 3 o'clock, so the mouth would land at
        1–3 o'clock; rotating by 38° centres it on 3 o'clock, where the original
        C opens.
      */}
      <circle
        cx="16"
        cy="16"
        r="11"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="butt"
        strokeDasharray="11 3.5 11 3.5 11 3.5 11 14.6"
        transform="rotate(38 16 16)"
      />
    </svg>
  );
}

/**
 * The five lockups.
 *
 * Type treatment carries most of the identity here, so each one is set the way
 * the real logo is set — stacked where the original stacks, weight-contrasted
 * where the original contrasts two words.
 */
export const clientLogotypes: Record<string, () => React.ReactElement> = {
  'customer-support-leaders': () => (
    <span className="flex items-center gap-2.5">
      <CustomerSupportLeadersMark />
      <span className="flex flex-col leading-none">
        <span className="text-[0.62rem] font-semibold tracking-[0.16em] uppercase">
          Customer Support
        </span>
        <span className="mt-1 font-display text-[1.05rem] font-extrabold tracking-[0.02em]">
          Leaders
        </span>
      </span>
    </span>
  ),

  'nextgen-healthcare': () => (
    <span className="flex items-center gap-2.5">
      <NextGenMark />
      {/* Stacked on purpose rather than by wrapping — the two words are set at
          different weights and a line break landing wherever the box happens to
          run out would put them on one line at some widths and not others. */}
      <span className="flex flex-col font-display leading-none">
        <span className="text-[1.05rem] font-extrabold tracking-[-0.01em]">NextGen</span>
        <span className="mt-1 text-[0.95rem] font-normal tracking-[-0.01em]">Healthcare</span>
      </span>
    </span>
  ),

  leadlaya: () => (
    <span className="flex items-center gap-2.5">
      <LeadLayaMark />
      <span className="font-display text-[1.25rem] leading-none tracking-[-0.02em]">
        <span className="font-extrabold">Lead</span>
        <span className="font-light">Laya</span>
      </span>
    </span>
  ),

  'finance-house': () => (
    <span className="flex flex-col items-center gap-1.5">
      <FinanceHouseMark />
      {/* The real wordmark is widely letterspaced caps — that spacing is the
          most recognisable thing about it, so it is kept even though it costs
          width. */}
      <span className="text-[0.7rem] font-medium tracking-[0.22em] uppercase leading-none">
        Finance House
      </span>
    </span>
  ),

  'wow-customer-support': () => (
    <span className="flex items-center gap-2.5">
      <WowMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.15rem] font-extrabold tracking-[-0.01em]">
          WOW
        </span>
        <span className="mt-1 text-[0.6rem] font-semibold tracking-[0.04em]">
          Customer Support
        </span>
      </span>
    </span>
  ),
};

/**
 * Renders a client's logotype, or their plain name if an id ever arrives
 * without a drawing — the strip is never allowed to render an empty chip.
 */
export function ClientLogotype({ id, name }: { id: string; name: string }) {
  const Logotype = clientLogotypes[id];
  if (!Logotype) {
    return <span className="text-center text-[0.8rem] font-semibold">{name}</span>;
  }
  return <Logotype />;
}
