import { ImageResponse } from 'next/og';

/**
 * OG / Twitter card, generated at build time by next/og.
 *
 * Generating it beats shipping a hand-made PNG: it stays in sync with the
 * brand tokens, costs no repo weight, and Next wires it into both the
 * openGraph and twitter meta tags automatically via this file convention.
 */

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'IntelSol AI — AI automation and software engineering';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#07090C',
          padding: '72px',
        }}
      >
        {/* Logo lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6.5" fill="#3FDCC0" />
            <g stroke="#07090C" strokeWidth="1.6" strokeLinecap="round">
              <path d="M10.15 12H8.35" />
              <path d="M13.5 10.85l2.6-1.55" />
              <path d="M13.5 13.15l2.6 1.55" />
            </g>
            <g fill="#07090C">
              <circle cx="6.6" cy="12" r="1.85" />
              <circle cx="11.9" cy="12" r="2.05" />
              <circle cx="17.6" cy="8.5" r="1.85" />
              <circle cx="17.6" cy="15.5" r="1.85" />
            </g>
          </svg>
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color: '#F2F5F7' }}>
            IntelSol
            <span style={{ color: '#3FDCC0' }}>AI</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              color: '#F2F5F7',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            Ship AI that pays for itself
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: '#B4BCC5', maxWidth: 900 }}>
            Agentic AI, voice agents, and workflow automation for startups, fintech, and B2B
            SaaS.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 24,
            color: '#79838E',
            borderTop: '1px solid #1B2027',
            paddingTop: 28,
          }}
        >
          intelsolai.com
        </div>
      </div>
    ),
    size,
  );
}
