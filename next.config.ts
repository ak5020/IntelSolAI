import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Images are hand-authored inline SVG, so the image optimizer is only used
  // for the OG asset. Modern formats first keeps any future raster small.
  images: { formats: ['image/avif', 'image/webp'] },
};

export default nextConfig;
