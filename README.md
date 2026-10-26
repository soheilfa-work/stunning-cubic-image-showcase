# Stunning Cubic Image Showcase

An interactive, full-screen image showcase built from a 12 × 9 grid of 3D cubes. Hover a title in the list and the whole wall flips to reveal the next image, using a different staggered pattern for each one (center-out, edges-in, random, sweeps, diagonals, ripples and more). Between flips the cubes gently "breathe" in 3D space.

## Live Demo

**[View the live demo](https://YOUR-DEMO-URL-HERE)**

> Replace the link above with your deployed URL (for example, your Vercel deployment).

<!-- Optional: add a screenshot or GIF -->
<!-- ![Showcase preview](./docs/preview.gif) -->

## Features

- 108 CSS 3D cubes (12 × 9) that together form one image
- 15 images, each with its own flip pattern and caption
- Smooth GSAP-driven staggered reveals
- Continuous ambient "breathing" motion on every cube
- Hover-driven navigation, with the latest hover queued so flips never stack or snap
- Responsive caption and list layout for mobile
- Deep-space background built purely with CSS gradients

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) and [React](https://react.dev/)
- [GSAP](https://gsap.com/) for animation
- CSS Modules and Tailwind CSS
- TypeScript

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

## Project Structure

```
app/                         Next.js app (layout, page, global styles)
components/showcase/
  Showcase.tsx               Tile grid, reveal presets, GSAP logic
  Showcase.module.css        Cube faces, 3D setup, layout
public/showcase/             Optimized WebP images (served)
assets-original/             Original full-size JPEGs (not served)
PERFORMANCE_NOTES.md         Details of the performance work
```

## Customizing

**Change images and captions:** edit the `ITEMS` array in `components/showcase/Showcase.tsx` (`src`, `title`, `description`). Put new images in `public/showcase/`.

**Image sizing tip:** images are displayed at 720 × 540 px. Export them at about 1080 px tall (WebP or JPEG) for sharp results on retina screens without heavy decoding.

**Change the grid:** adjust `TILES_X`, `TILES_Y` and `TILE_SIZE` at the top of `Showcase.tsx`, and keep the matching sizes in `Showcase.module.css` in sync.

**Tweak reveal patterns:** edit `REVEAL_PRESETS` (duration, ease, stagger, origin, or a custom `delayFor(row, col)`).

## Performance Notes

- Images are preloaded and decoded at startup, and again right before each flip
- Swapping an image is a single CSS-variable write instead of hundreds of inline style writes
- The flip starts one frame after the image swap so rasterization is not part of the animation
- All GSAP tweens are scoped with `gsap.context` and cleaned up on unmount

See [PERFORMANCE_NOTES.md](./PERFORMANCE_NOTES.md) for the full list.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Lint the project |

## License

Add your license here (for example, MIT).

## Credits

Image captions and theme are inspired by the Tesla Roadster / SpaceX concept. Make sure you have the rights to any images you publish.
