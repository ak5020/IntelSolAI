'use client';

import { useCallback, useRef, useState } from 'react';

import { PosterArt } from '@/components/svg/PosterArt';
import { site } from '@/lib/content';

type Props = {
  title: string;
  posterKind: string;
  sources: { webm: string; mp4: string };
};

/** mm:ss */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Click-to-load video with hand-built controls.
 *
 * Performance shape: nothing is fetched on page load. `preload="none"` plus a
 * vector poster means the section costs zero video bytes until the visitor
 * asks for it. The 16:9 box is reserved by CSS, so loading the real file
 * cannot shift the page.
 *
 * If the media files are missing (they are supplied separately — see
 * HANDOFF.md), the player degrades to a clear message with a contact link
 * rather than a broken element.
 */
export function VideoPlayer({ title, posterKind, sources }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [activated, setActivated] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [unavailable, setUnavailable] = useState(false);

  /** First click: mount the sources and start playback. */
  const activate = useCallback(() => {
    setActivated(true);
    // Wait a tick for <video> to mount before asking it to play.
    requestAnimationFrame(() => {
      const video = videoRef.current;
      if (!video) return;
      video.play().then(
        () => setPlaying(true),
        () => setUnavailable(true),
      );
    });
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(
        () => setPlaying(true),
        () => setUnavailable(true),
      );
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void wrap.requestFullscreen?.();
  }, []);

  const seek = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = (value / 100) * video.duration;
    setProgress(value);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden rounded-card border border-line bg-bg-elev"
      style={{ aspectRatio: '16 / 9' }}
    >
      {/* Poster layer — stays mounted underneath so there is never a blank
          frame while the video buffers. */}
      {!activated && (
        <div className="absolute inset-0">
          <PosterArt kind={posterKind} />
        </div>
      )}

      {activated && !unavailable && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full bg-bg object-cover"
          width={1280}
          height={720}
          preload="none"
          playsInline
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration > 0) setProgress((v.currentTime / v.duration) * 100);
          }}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => setPlaying(false)}
          onError={() => setUnavailable(true)}
        >
          <source src={sources.webm} type="video/webm" />
          <source src={sources.mp4} type="video/mp4" />
          Your browser does not support embedded video.
        </video>
      )}

      {/* Missing-file fallback ------------------------------------------- */}
      {unavailable && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg-elev px-6 text-center">
          <p className="mono text-muted">Demo video coming soon</p>
          <p className="max-w-sm text-sm text-body">
            The recording for {title} isn&apos;t published yet.{' '}
            <a href="#contact" className="text-accent underline underline-offset-4">
              Ask us for a live walkthrough
            </a>{' '}
            or email{' '}
            <a href={`mailto:${site.email}`} className="text-accent underline underline-offset-4">
              {site.email}
            </a>
            .
          </p>
        </div>
      )}

      {/* Play overlay ----------------------------------------------------- */}
      {!activated && (
        <button
          type="button"
          onClick={activate}
          className="group absolute inset-0 flex items-center justify-center bg-bg/35 transition-colors duration-150 hover:bg-bg/20"
        >
          <span className="sr-only">Play the {title} demo</span>
          <svg viewBox="0 0 72 72" className="h-20 w-20" aria-hidden="true" fill="none">
            {/* Ring draws itself on hover via stroke-dashoffset. */}
            <circle
              cx="36"
              cy="36"
              r="33"
              stroke="var(--color-line-strong)"
              strokeWidth="1.5"
            />
            <circle
              cx="36"
              cy="36"
              r="33"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="207.3"
              strokeDashoffset="207.3"
              transform="rotate(-90 36 36)"
              className="transition-[stroke-dashoffset] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]"
            />
            <path d="M30 25.5 47 36 30 46.5Z" fill="var(--color-text)" />
          </svg>
        </button>
      )}

      {/* Controls --------------------------------------------------------- */}
      {activated && !unavailable && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-bg/95 to-transparent px-3 py-3 sm:px-4">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn text-text transition-colors duration-150 hover:bg-bg-elev-2"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
              {playing ? (
                <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
              ) : (
                <path d="M8 5.5 18 12 8 18.5Z" />
              )}
            </svg>
          </button>

          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek"
            className="h-11 min-w-0 flex-1 cursor-pointer accent-[var(--color-accent)]"
          />

          <span className="mono hidden shrink-0 text-muted sm:inline">
            {formatTime((progress / 100) * duration)} / {formatTime(duration)}
          </span>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn text-text transition-colors duration-150 hover:bg-bg-elev-2"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 9.5h3L11.5 6v12L7 14.5H4Z" />
              {muted ? (
                <path d="m15.5 10 4 4m0-4-4 4" />
              ) : (
                <path d="M15 9.25a4 4 0 0 1 0 5.5M17.75 7a7 7 0 0 1 0 10" />
              )}
            </svg>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn text-text transition-colors duration-150 hover:bg-bg-elev-2"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 9V4.5h5M20 9V4.5h-5M4 15v4.5h5M20 15v4.5h-5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
