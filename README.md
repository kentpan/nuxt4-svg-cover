# SVG Cover - Free SVG Converter

A free, privacy-friendly online SVG converter built with Nuxt 3 and Tailwind CSS. All conversion happens client-side in the browser — your files never leave your device.

## Features

- **SVG to PNG** — High-quality transparent PNG export
- **SVG to JPG** — JPEG export with quality control
- **SVG to WebP** — Modern web image format
- **SVG to PDF** — PDF document export
- **SVG to ICO** — Multi-size favicon creation (16/32/48/64px)
- **SVG to DXF** — AutoCAD-compatible DXF export
- **Image to SVG** — Coming soon
- **DXF to SVG** — Coming soon

## Tech Stack

- [Nuxt 3](https://nuxt.com/) (Vue 3)
- [Tailwind CSS](https://tailwindcss.com/) 3.4
- [lucide-vue-next](https://lucide.dev/) icons
- [jsPDF](https://github.com/parallax/jsPDF) for PDF export
- 100% client-side conversion — no server needed

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Generate static site
bun run generate
```

## Deployment on Cloudflare Pages

This project is configured for Cloudflare Pages with the `cloudflare-pages` Nitro preset.

### Via GitHub (recommended)

1. Push this repo to GitHub
2. In Cloudflare Dashboard → Pages → Create a project → Connect to Git
3. Select the repository
4. Set build settings:
   - **Framework preset**: None
   - **Build command**: `npx nuxt build`
   - **Build output directory**: `dist`
   - **Node.js version**: `20`
5. Deploy!

### Via CLI

```bash
npx wrangler pages deploy dist --project-name=svg-cover
```

## Privacy

All file processing happens in your browser. No files are uploaded to any server. No cookies, no tracking, no analytics.

## License

MIT