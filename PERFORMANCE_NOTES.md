# Reveal animation – performance changes

1. Images: 15 source JPEGs (up to 3840x2880, 4.9 MB) -> WebP at max 1080px tall (22.3 MB -> 1.4 MB).
   Originals kept in `assets-original/` (not served). Display size is 720x540, so 1080px is ~2x retina.
2. Images are fetched AND decoded (`img.decode()`) at mount, and decoded again before a flip starts.
3. Image swap = one CSS-variable write on `.preview` (was ~324 inline style writes per flip).
   Constant background-size/position are written once at build time.
4. Side faces get their colour from CSS instead of JS on every flip.
5. The flip tween starts one animation frame after the image swap, so raster cost is not inside the tween.
6. Delay-based presets use a function stagger on a single tween (was a 108-tween timeline built per flip).
7. Hover during a flip: only the latest request is kept and played when the flip lands (no mid-flip snap).
8. Breathing: one self-refreshing tween per tile (`repeatRefresh`), wrapped in `gsap.context` so it is
   cleaned up properly (previously leaked delayed calls/loops on unmount and in React StrictMode).
9. Removed unused ScrollTrigger import and per-listener leaks.
