# Video assets

Drop the product demo files here. Paths are wired up in `lib/content.ts`.

```
whatsapp-commerce.webm    VP9,   1280×720
whatsapp-commerce.mp4     H.264, 1280×720
lead-qualification.webm   VP9,   1280×720
lead-qualification.mp4    H.264, 1280×720
```

Until these exist the player shows a "Demo video coming soon" panel — nothing
404s and the layout does not shift.

If either file exceeds ~10 MB, host it on Cloudflare Stream or Mux instead of
self-hosting, and point the `sources` URLs in `lib/content.ts` at the CDN.

Posters are hand-authored inline SVG (`components/svg/PosterArt.tsx`), so no
poster images are required here.
