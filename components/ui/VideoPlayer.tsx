'use client';

import { useCallback, useRef, useState } from 'react';

import { site } from '@/lib/content';

type Props = {
  title: string;
  /** Native pixel dimensions. Drive the reserved box, so CLS stays at zero. */
  width: number;
  height: number;
  poster: string;
  sources: { mp4: string; webm: string };
};

/** Portrait demos are phone recordings; full column width would be absurdly tall. */
const PORTRAIT_MAX_WIDTH = 330;

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
 * poster image means the section costs no video bytes until the visitor asks
 * for it.
 *
 * The container is sized from the video's own dimensions rather than a fixed
 * 16:9 — the two demos are 1280×552 (ultrawide) and 424×758 (portrait), and
 * forcing either into 16:9 would crop away most of the content.
 */
export function VideoPlayer({ title, width, height, poster, sources }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [activated, setActivated] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [unavailable, setUnavailable] = useState(false);

  const isPortrait = height > width;

  /**
   * Starts playback.
   *
   * Called synchronously from the click handler — deferring it (into rAF, or
   * until after a re-render) breaks the user-gesture chain and Safari and
   * mobile browsers reject the play() promise.
   *
   * A rejected play() is NOT treated as a broken video. It usually means
   * autoplay was blocked, so the element stays mounted and paused with its
   * controls visible; pressing play again is a fresh gesture and succeeds.
   * Only a real media error (the `error` event) marks the demo unavailable.
   */
  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, []);

  const activate = useCallback(() => {
    setActivated(true);
    startPlayback();
  }, [startPlayback]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      startPlayback();
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [startPlayback]);

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
      className="relative mx-auto w-full overflow-hidden rounded-card border border-line bg-bg-elev"
      style={{
        aspectRatio: `${width} / ${height}`,
        maxWidth: isPortrait ? PORTRAIT_MAX_WIDTH : undefined,
      }}
    >
      {/*
        Plain <img>, not next/image: the poster is already an optimally sized
        WebP, so running it through the image optimizer would add runtime cost
        for no gain. Explicit width/height plus the container's aspect-ratio
        means the box is reserved before anything loads.
      */}
      {!activated && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt={`${title} demo — preview frame`}
          width={width}
          height={height}
          /* Well below the fold — eager loading here competes with the hero
             for bandwidth and measurably delays LCP. */
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/*
        Always mounted, never conditionally rendered: preload="none" means the
        browser downloads nothing until play() is called, so keeping it in the
        DOM is free and means the click handler has a real element to act on.
      */}
      {!unavailable && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full bg-bg object-contain ${
            activated ? '' : 'invisible'
          }`}
          width={width}
          height={height}
          poster={poster}
          preload="none"
          playsInline
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration > 0) setProgress((v.currentTime / v.duration) * 100);
          }}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => setPlaying(false)}
          onError={(e) => {
            /*
              A <source> that the browser cannot decode also surfaces here,
              because React delegates error events from child elements. That is
              NOT fatal — it just means the browser is about to try the next
              source. Bailing out on it would unmount the element and destroy
              the fallback chain.

              The video element only sets its own `error` property once every
              source has failed, so that is the real signal.
            */
            if (e.currentTarget.error) setUnavailable(true);
          }}
        >
          {/* MP4 first: it is the smaller file, so anything that can decode
              H.264 takes it. WebM catches Chromium builds that cannot. */}
          <source src={sources.mp4} type="video/mp4" />
          <source src={sources.webm} type="video/webm" />
          Your browser does not support embedded video.
        </video>
      )}

      {/* Playback failure fallback — never a broken element. */}
      {unavailable && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg-elev px-6 text-center">
          <p className="mono text-muted">Demo unavailable</p>
          <p className="max-w-sm text-sm text-body">
            We couldn&apos;t play the {title} demo here.{' '}
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
          className="group absolute inset-0 flex items-center justify-center bg-bg/40 transition-colors duration-150 hover:bg-bg/25"
        >
          <span className="sr-only">Play the {title} demo</span>
          <svg viewBox="0 0 72 72" className="h-20 w-20" aria-hidden="true" fill="none">
            {/* Ring draws itself on hover via stroke-dashoffset. */}
            <circle cx="36" cy="36" r="33" stroke="var(--color-line-strong)" strokeWidth="1.5" />
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
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-bg/95 to-transparent px-2 py-2 sm:gap-3 sm:px-4 sm:py-3">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn text-text transition-colors duration-150 hover:bg-bg-elev-2"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
              {playing ? <path d="M8 5h3v14H8zM13 5h3v14h-3z" /> : <path d="M8 5.5 18 12 8 18.5Z" />}
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

          {/* Hidden on the narrow portrait player, where there is no room. */}
          {!isPortrait && (
            <span className="mono hidden shrink-0 text-muted sm:inline">
              {formatTime((progress / 100) * duration)} / {formatTime(duration)}
            </span>
          )}

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
              {muted ? <path d="m15.5 10 4 4m0-4-4 4" /> : <path d="M15 9.25a4 4 0 0 1 0 5.5M17.75 7a7 7 0 0 1 0 10" />}
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
