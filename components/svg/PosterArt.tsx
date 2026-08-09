/**
 * Video poster frames, hand-authored as inline SVG.
 *
 * These stand in for the WebP posters listed in the asset handoff. Vector
 * costs no network request, scales to any density, and holds the exact 16:9
 * box so swapping in a real poster later causes zero layout shift.
 */

type Props = { kind: string };

/* --- Product 1: conversational commerce inside a chat thread -------------- */

function WhatsAppPoster() {
  return (
    <>
      {/* Phone frame */}
      <rect
        x="392"
        y="60"
        width="216"
        height="420"
        rx="26"
        fill="var(--color-bg-elev-2)"
        stroke="var(--color-line-strong)"
        strokeWidth="1.5"
      />
      <rect x="466" y="76" width="68" height="7" rx="3.5" fill="var(--color-line-strong)" />

      {/* Inbound message */}
      <g>
        <rect x="410" y="104" width="132" height="40" rx="12" fill="var(--color-bg)" />
        <rect x="422" y="118" width="86" height="5" rx="2.5" fill="var(--color-muted)" />
        <rect x="422" y="130" width="58" height="5" rx="2.5" fill="var(--color-line-strong)" />
      </g>

      {/* Agent reply — product card */}
      <g>
        <rect
          x="428"
          y="158"
          width="164"
          height="96"
          rx="12"
          fill="var(--color-accent-soft)"
          stroke="var(--color-accent)"
          strokeWidth="1.25"
        />
        <rect x="440" y="170" width="48" height="48" rx="8" fill="var(--color-bg-elev)" />
        <rect x="498" y="176" width="80" height="6" rx="3" fill="var(--color-text)" />
        <rect x="498" y="190" width="52" height="5" rx="2.5" fill="var(--color-body)" />
        <rect x="498" y="203" width="34" height="5" rx="2.5" fill="var(--color-accent)" />
        <rect x="440" y="228" width="140" height="14" rx="7" fill="var(--color-accent)" />
      </g>

      {/* Confirmation */}
      <g>
        <rect x="410" y="268" width="118" height="34" rx="12" fill="var(--color-bg)" />
        <rect x="422" y="280" width="72" height="5" rx="2.5" fill="var(--color-muted)" />
        <rect x="422" y="291" width="44" height="4" rx="2" fill="var(--color-line-strong)" />
      </g>

      {/* Composer */}
      <rect
        x="410"
        y="432"
        width="180"
        height="32"
        rx="16"
        fill="var(--color-bg)"
        stroke="var(--color-line)"
        strokeWidth="1"
      />
      <circle cx="570" cy="448" r="11" fill="var(--color-accent)" />

      {/* Side annotation */}
      <g fontFamily="var(--font-mono)" fontSize="13" letterSpacing="0.08em">
        <text x="96" y="196" fill="var(--color-muted)">
          DISCOVERY
        </text>
        <text x="96" y="244" fill="var(--color-muted)">
          CART
        </text>
        <text x="96" y="292" fill="var(--color-accent)">
          CHECKOUT
        </text>
      </g>
      <g stroke="var(--color-line-strong)" strokeWidth="1.25" fill="none">
        <path d="M232 190 L360 190" strokeDasharray="3 6" />
        <path d="M232 238 L360 238" strokeDasharray="3 6" />
        <path d="M232 286 L360 286" strokeDasharray="3 6" />
      </g>
      <g fill="var(--color-line-strong)">
        <circle cx="364" cy="190" r="3.5" />
        <circle cx="364" cy="238" r="3.5" />
      </g>
      <circle cx="364" cy="286" r="3.5" fill="var(--color-accent)" />
    </>
  );
}

/* --- Product 2: an outbound call in progress ----------------------------- */

function VoicePoster() {
  return (
    <>
      {/* Call panel */}
      <rect
        x="150"
        y="120"
        width="700"
        height="300"
        rx="16"
        fill="var(--color-bg-elev-2)"
        stroke="var(--color-line-strong)"
        strokeWidth="1.5"
      />

      <g fontFamily="var(--font-mono)" fontSize="14" letterSpacing="0.08em">
        <text x="182" y="166" fill="var(--color-accent)">
          LIVE CALL
        </text>
        <text x="722" y="166" fill="var(--color-muted)">
          02:14
        </text>
      </g>
      <circle cx="170" cy="161" r="4" fill="var(--color-accent)" />

      {/* Waveform — the number of bars and their heights are fixed so the
          poster renders identically every time. */}
      <g fill="var(--color-accent)">
        {[
          18, 34, 52, 30, 66, 88, 54, 40, 72, 96, 62, 28, 44, 80, 58, 36, 68, 92, 48, 24, 56,
          84, 40, 30, 64, 46, 22, 38,
        ].map((h, i) => (
          <rect
            key={i}
            x={186 + i * 22}
            y={270 - h / 2}
            width="8"
            height={h}
            rx="4"
            opacity={i % 3 === 0 ? 1 : 0.45}
          />
        ))}
      </g>

      {/* Transcript line */}
      <rect x="182" y="330" width="330" height="7" rx="3.5" fill="var(--color-body)" />
      <rect x="182" y="348" width="210" height="7" rx="3.5" fill="var(--color-line-strong)" />

      {/* Outcome chips */}
      <g>
        <rect
          x="566"
          y="322"
          width="118"
          height="30"
          rx="6"
          fill="var(--color-bg-elev)"
          stroke="var(--color-line)"
          strokeWidth="1"
        />
        <text
          x="625"
          y="342"
          textAnchor="middle"
          fill="var(--color-muted)"
          fontFamily="var(--font-mono)"
          fontSize="12"
          letterSpacing="0.08em"
        >
          QUALIFIED
        </text>
        <rect
          x="696"
          y="322"
          width="122"
          height="30"
          rx="6"
          fill="var(--color-accent-soft)"
          stroke="var(--color-accent)"
          strokeWidth="1"
        />
        <text
          x="757"
          y="342"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontFamily="var(--font-mono)"
          fontSize="12"
          letterSpacing="0.08em"
        >
          CRM SYNCED
        </text>
      </g>
    </>
  );
}

export function PosterArt({ kind }: Props) {
  return (
    /* The viewBox is exactly 16:9 so it matches the player's reserved box —
       otherwise the poster letterboxes inside its own card. */
    <svg viewBox="0 0 1000 562" className="h-full w-full" aria-hidden="true" role="presentation">
      <rect width="1000" height="562" fill="var(--color-bg-elev)" />
      {/* Artwork is authored on a 540-tall grid; centre it in the 562 box. */}
      <g transform="translate(0 11)">
        {kind === 'whatsapp' ? <WhatsAppPoster /> : <VoicePoster />}
      </g>
    </svg>
  );
}
