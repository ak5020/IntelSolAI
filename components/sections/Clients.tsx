'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ClientLogotype } from '@/components/svg/ClientLogotypes';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Tag } from '@/components/ui/Tag';
import { clients, clientsCopy } from '@/lib/content';

/* useLayoutEffect warns when React renders on the server. The measurement it
   guards has to happen before paint, so keep it in the browser and fall back to
   the (never-run) effect version during SSR. */
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * S6b — client strip.
 *
 * The logos drift continuously. Pointing at one stops the strip, dims the
 * others, draws a workflow edge downward and expands a panel describing what
 * we built for them. Leaving the section closes the panel and the strip picks
 * up where it left off.
 *
 * Interaction rules, in order of who they serve:
 *   - pointer: hover opens, leaving the section closes
 *   - keyboard: focus opens, Escape closes
 *   - touch: tap toggles, because there is no hover to leave
 *
 * Without JavaScript the strip still scrolls and every panel renders open and
 * stacked, so nothing is trapped behind a control that cannot run.
 */
export function Clients() {
  const [active, setActive] = useState<number | null>(null);
  /* Horizontal position of the connector, in px from the left of the strip.
     null until a chip has been measured. */
  const [edgeX, setEdgeX] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  /*
    How many times the five logos are repeated across the track.

    Two is the intuitive answer and it is wrong on wide screens. The animation
    slides the track left by exactly one copy; whatever is left has to fill the
    viewport for the whole cycle. With two copies of a 1030px run on a 1440px
    viewport, only 1046px remains — so the last ~380px sits empty until the
    loop restarts, which is the blank right edge that shows up a few seconds in
    and only refills once the run wraps around.

    The rule is (copies − 1) × copyWidth ≥ stripWidth. Measured rather than
    hard-coded because copyWidth depends on the rendered width of the
    logotypes, which depends on the font actually being loaded.
  */
  const [copies, setCopies] = useState(2);

  useIsomorphicLayoutEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const measure = () => {
      const firstCopy = strip.querySelector<HTMLElement>('[data-marquee-copy="0"]');
      const copyWidth = firstCopy?.getBoundingClientRect().width ?? 0;
      const stripWidth = strip.clientWidth;
      if (copyWidth <= 0 || stripWidth <= 0) return;
      // +1 so a full copy is always queued up behind the visible run.
      setCopies(Math.max(2, Math.ceil(stripWidth / copyWidth) + 1));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    /* Web fonts land after first paint and change how wide the wordmarks are,
       which changes the answer. */
    void document.fonts?.ready.then(measure);

    return () => observer.disconnect();
  }, []);

  /* Pending close, so moving between chips does not flicker the panel shut
     and open again. */
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  /** True on devices with no real hover — phones, tablets, most touchscreens. */
  const isCoarsePointer = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  /**
   * Closes shortly after the pointer leaves a logo.
   *
   * The delay exists so travelling from one chip to the next, or down onto the
   * panel to actually read it, does not slam it shut mid-movement — whatever
   * the pointer lands on next cancels the timer.
   *
   * Skipped entirely on touch. Chrome synthesises a mouse sequence around every
   * tap that ends in mouseleave, so without this guard a tap opened the panel
   * and the phantom leave shut it again 140ms later.
   */
  const closeSoon = useCallback(() => {
    if (isCoarsePointer()) return;
    cancelClose();
    closeTimer.current = setTimeout(() => setActive(null), 140);
  }, [cancelClose]);

  /* Never leave a timer running behind an unmounted component. */
  useEffect(() => cancelClose, [cancelClose]);

  /**
   * Opens a client and anchors the connector under the chip that was actually
   * pointed at — including the marquee's second copy, which sits somewhere
   * completely different on screen. Measuring is safe here because entering
   * the strip has already stopped it, so the chip is not moving.
   */
  const open = useCallback((index: number, el: HTMLElement) => {
    cancelClose();
    setActive(index);
    const wrap = sectionRef.current;
    if (!wrap) return;
    const chip = el.getBoundingClientRect();
    const bounds = wrap.getBoundingClientRect();
    const centre = chip.left + chip.width / 2 - bounds.left;
    // Keep the edge inside the strip even when the chip is half off-screen.
    setEdgeX(Math.min(Math.max(centre, 24), bounds.width - 24));
  }, [cancelClose]);

  const close = useCallback(() => {
    cancelClose();
    setActive(null);
  }, [cancelClose]);

  /**
   * Pointer-leave close, but only on devices that genuinely hover.
   *
   * After a tap, Chrome synthesises a mouse sequence that ends in mouseleave,
   * so binding close() to it directly made the panel open and shut again
   * instantly on every phone.
   */
  const closeOnPointerLeave = useCallback(() => {
    if (isCoarsePointer()) return;
    close();
  }, [close]);

  useEffect(() => {
    if (active === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    /* On touch there is no "moving away", so tapping anywhere outside the
       section is the way to dismiss it. */
    const onPointerDown = (e: PointerEvent) => {
      if (!sectionRef.current?.contains(e.target as Node)) close();
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [active, close]);

  const activeClient = active === null ? null : clients[active];

  /* One chip. Rendered twice by the marquee, so the second copy is hidden from
     assistive tech and taken out of the tab order to avoid duplicate stops. */
  const Chip = ({ index, duplicate }: { index: number; duplicate: boolean }) => {
    const client = clients[index]!;
    const isActive = active === index;
    const dimmed = active !== null && !isActive;

    return (
      <button
        type="button"
        aria-hidden={duplicate ? true : undefined}
        tabIndex={duplicate ? -1 : 0}
        aria-expanded={duplicate ? undefined : isActive}
        aria-controls={duplicate ? undefined : 'client-detail'}
        onMouseEnter={(e) => open(index, e.currentTarget)}
        onMouseLeave={closeSoon}
        onFocus={(e) => open(index, e.currentTarget)}
        onClick={(e) => (isActive ? close() : open(index, e.currentTarget))}
        /*
          A uniform box so the five align, but no tile and no fill at rest —
          the logotypes are single-colour line art, so they sit straight on the
          page background the way a client row should. The chip only becomes
          visible furniture once it is the one being inspected.
        */
        className={`group relative flex h-[112px] w-[190px] shrink-0 items-center justify-center rounded-card border px-3 transition-[opacity,border-color,background-color,color] duration-300 ${
          isActive
            ? 'border-accent bg-bg-elev-2 text-text'
            : 'border-transparent text-muted hover:border-line-strong hover:text-text'
        } ${dimmed ? 'opacity-40' : 'opacity-100'}`}
      >
        {/* The lockup is split across several spans for typographic reasons, so
            it is hidden from assistive tech and the name announced once. */}
        <span aria-hidden="true">
          <ClientLogotype id={client.id} name={client.name} />
        </span>
        <span className="sr-only">{client.name}</span>
      </button>
    );
  };

  return (
    <section
      id="clients"
      aria-labelledby="clients-heading"
      className="defer-paint border-t border-line"
      style={{ paddingBlock: 'var(--section-y)' }}
    >
      <div className="shell">
        <header className="mb-12 max-w-3xl md:mb-14">
          <Eyebrow>{clientsCopy.eyebrow}</Eyebrow>
          <h2 id="clients-heading" className="mt-4">
            {clientsCopy.heading}
          </h2>
          <p className="mt-5 max-w-2xl text-body">{clientsCopy.sub}</p>
        </header>
      </div>

      {/* Leaving this wrapper closes the panel — it spans the strip AND the
          panel, so travelling between them does not dismiss it. */}
      <div ref={sectionRef} onMouseLeave={closeOnPointerLeave}>
        <div ref={stripRef} className="marquee client-strip overflow-hidden">
          <div
            /* py-2 is load-bearing, not decoration: the strip clips with
               overflow:hidden, and without it a chip's bottom edge lands on
               exactly the clip boundary at a fractional y (measured 352.13px),
               so the 1px active border was shaved off along the bottom. */
            className="marquee-track gap-4 px-2 py-2"
            style={{
              animationName: 'marquee-left',
              /* Per copy, not per lap: the track always travels exactly one
                 copy, so adding copies keeps the logos moving at the same
                 speed instead of speeding them up. */
              animationDuration: '46s',
              /* One copy, as a share of the whole track — see the keyframes. */
              ['--marquee-shift' as string]: `-${(100 / copies).toFixed(4)}%`,
              /*
                Left undefined while nothing is open so the shared
                `.marquee:hover` / `:focus-within` rule in globals.css can stop
                the strip the moment the cursor or focus enters it — an inline
                value here would override that rule.

                Pausing on strip-enter rather than chip-enter matters: a chip
                that is still sliding is a moving target, which is awkward with
                a mouse and genuinely hard with a motor impairment. Stopping
                first means the logo is stationary before anyone has to hit it.

                The explicit pause covers touch, where a tap sets the active
                client without any hover ever occurring.
              */
              animationPlayState: active !== null ? 'paused' : undefined,
            }}
          >
            {Array.from({ length: copies }, (_, copy) => (
              <div key={copy} data-marquee-copy={copy} className="flex shrink-0 gap-4 pr-4">
                {clients.map((client, i) => (
                  <Chip key={`${copy}-${client.id}`} index={i} duplicate={copy > 0} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* --- Connector: full-bleed so it can sit under any chip --------- */}
        <div className="relative h-11">
          {activeClient && edgeX !== null && (
            <svg
              viewBox="0 0 24 44"
              className="absolute top-0 h-11 w-6 -translate-x-1/2"
              style={{ left: edgeX }}
              aria-hidden="true"
              fill="none"
            >
              <path
                d="M12 0 V36"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeDasharray="36"
                style={{ animation: 'draw 320ms var(--ease-out-expo) both' }}
              />
              <circle cx="12" cy="39" r="3.5" fill="var(--color-accent)" />
            </svg>
          )}
        </div>

        {/* --- Detail panel ----------------------------------------------- */}
        <div className="shell">
          <div
            className="client-panel"
            onMouseEnter={cancelClose}
            onMouseLeave={closeSoon}
            data-open={activeClient ? 'true' : 'false'}
            id="client-detail"
            aria-live="polite"
          >
            <div>

              {activeClient && (
                <article className="rounded-card border border-accent bg-bg-elev p-6 sm:p-8">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="text-[1.25rem]">{activeClient.name}</h3>
                    <span className="mono text-muted">{activeClient.sector}</span>
                  </div>

                  {activeClient.quote ? (
                    <blockquote className="mt-5 max-w-3xl border-l-2 border-accent pl-5 text-body">
                      “{activeClient.quote}”
                      {activeClient.attribution && (
                        <footer className="mono mt-3 text-muted">
                          {activeClient.attribution}
                        </footer>
                      )}
                    </blockquote>
                  ) : (
                    <p className="mt-5 max-w-3xl text-body">{activeClient.summary}</p>
                  )}

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {activeClient.tags.map((tag) => (
                      <li key={tag}>
                        <Tag>{tag}</Tag>
                      </li>
                    ))}
                  </ul>
                </article>
              )}
            </div>
          </div>

          {/* Resting hint, swapped out once a panel is open. */}
          {!activeClient && (
            <p className="mono mt-6 text-center text-muted">
              Hover or tap a logo to see the build
            </p>
          )}
        </div>
      </div>

      {/* --- No-JS fallback: every client, plainly ---------------------- */}
      <noscript>
        <div className="shell mt-10 grid gap-4 sm:grid-cols-2">
          {clients.map((client) => (
            <article key={client.id} className="rounded-card border border-line bg-bg-elev p-6">
              <h3 className="text-[1.05rem]">{client.name}</h3>
              <p className="mono mt-1 text-muted">{client.sector}</p>
              <p className="mt-4 text-[0.95rem] text-body">{client.summary}</p>
            </article>
          ))}
        </div>
      </noscript>
    </section>
  );
}
