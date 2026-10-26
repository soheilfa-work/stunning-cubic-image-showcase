"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Showcase.module.css";

const TILES_X = 12;
const TILES_Y = 9;
const TILE_SIZE = 60;
const PREVIEW_WIDTH = TILES_X * TILE_SIZE;
const PREVIEW_HEIGHT = TILES_Y * TILE_SIZE;

const TILE_FACES = ["font", "rear", "right", "left", "top", "bottom"] as const;

const ITEMS = [
  {
    src: "/showcase/1.webp",
    title: "DESERT APPROACH",
    description:
      "A pilot in a white flight suit walks the salt flats toward the Roadster, helmet in hand under a clear desert sky.",
  },
  {
    src: "/showcase/2.webp",
    title: "ACTIVE AERO",
    description:
      "Raised rear wing and a continuous red light bar cut through black space — pure roadster silhouette.",
  },
  {
    src: "/showcase/3.webp",
    title: "GEOMETRY",
    description:
      "Sharp body panels meet in hard lines — minimalist surfaces that read like spacecraft skin.",
  },
  {
    src: "/showcase/4.webp",
    title: "SPACEX PACKAGE",
    description:
      "Four cold-gas thruster nozzles sit behind the RDSTR plate, turning the bumper into a launch system.",
  },
  {
    src: "/showcase/5.webp",
    title: "HOVER DEMO",
    description:
      "Thruster plumes lift the Roadster off a glowing ramp — the flying car moment, mid-air.",
  },
  {
    src: "/showcase/6.webp",
    title: "STAR TRAILS",
    description:
      "Falcon-wing doors open on a cracked playa at night, mist at the nose and stars streaked overhead.",
  },
  {
    src: "/showcase/7.webp",
    title: "COCKPIT",
    description:
      "White bucket seats, a yoke wheel, and a tall center screen — cabin as clean as the exterior.",
  },
  {
    src: "/showcase/8.webp",
    title: "INBOARD SUSPENSION",
    description:
      "Gold coil spring and precision linkages beside the tire — engineering under the skin.",
  },
  {
    src: "/showcase/9.webp",
    title: "REAR CABIN",
    description:
      "Looking forward from the back seats: twin white chairs, dark dash, and the central command display.",
  },
  {
    src: "/showcase/10.webp",
    title: "PRESSURE VESSEL",
    description:
      "Carbon-wrapped thruster tank nested in the rear chassis — SpaceX hardware in the trunk.",
  },
  {
    src: "/showcase/11.webp",
    title: "TRACK CURVE",
    description:
      "Bird’s-eye view of the Roadster carving a red-edged track suspended in black void.",
  },
  {
    src: "/showcase/12.webp",
    title: "YOKE & MARK",
    description:
      "Driver’s yoke against Alcantara, with ROADSTER glowing red on the white headrest.",
  },
  {
    src: "/showcase/13.webp",
    title: "MARS WALK",
    description:
      "Overhead on cracked earth: the white Roadster and a suited figure walking the dry lake bed.",
  },
  {
    src: "/showcase/14.webp",
    title: "GOLD CANOPY",
    description:
      "Same desert from above — gold-tinted glass roof catching the sun beside the astronaut.",
  },
  {
    src: "/showcase/15.webp",
    title: "THE LINEUP",
    description:
      "Roadster inverted on thrusters above Semi and the fleet — the full electric stage show.",
  },
];

const IMAGES = ITEMS.map((item) => item.src);

type StaggerFrom = "start" | "end" | "center" | "edges" | "random";

type RevealPreset = {
  duration: number;
  ease: string;
  each: number;
  from: StaggerFrom | number;
  axis?: "x" | "y";
  /** Custom per-tile delay added on top of stagger (seconds) */
  delayFor?: (row: number, col: number) => number;
};

const GRID = [TILES_Y, TILES_X] as [number, number];

/** Soft easings + modest stagger — keeps uniqueness without snap/elastic glitches */
const REVEAL_PRESETS: RevealPreset[] = [
  { duration: 0.7, ease: "power2.inOut", each: 0.028, from: "center" },
  { duration: 0.7, ease: "power2.inOut", each: 0.028, from: "edges" },
  { duration: 0.7, ease: "power2.inOut", each: 0.028, from: "random" },
  {
    duration: 0.7,
    ease: "power2.inOut",
    each: 0.028,
    from: "start",
    axis: "x",
  },
  { duration: 0.7, ease: "power2.inOut", each: 0.028, from: "end", axis: "x" },
  {
    duration: 0.7,
    ease: "power2.inOut",
    each: 0.028,
    from: "start",
    axis: "y",
  },
  { duration: 0.7, ease: "power2.inOut", each: 0.028, from: "end", axis: "y" },
  {
    duration: 0.7,
    ease: "power2.inOut",
    each: 0.028,
    from: "start",
    delayFor: (row, col) => (row + col) * 0.012,
  },
  {
    duration: 0.7,
    ease: "power2.inOut",
    each: 0.028,
    from: "start",
    delayFor: (row, col) => (row + (TILES_X - 1 - col)) * 0.012,
  },
  {
    duration: 0.7,
    ease: "power2.inOut",
    each: 0.028,
    from: "start",
    delayFor: (row, col) => {
      const cy = (TILES_Y - 1) / 2;
      const cx = (TILES_X - 1) / 2;
      return Math.hypot(row - cy, col - cx) * 0.028;
    },
  },
  {
    duration: 0.68,
    ease: "power2.inOut",
    each: 0.028,
    from: "start",
    delayFor: (row, col) => ((row + col) % 2) * 0.1,
  },
  {
    duration: 0.7,
    ease: "power2.inOut",
    each: 0.028,
    from: "start",
    delayFor: (row, col) =>
      col * 0.028 + (col % 2 === 0 ? row : TILES_Y - 1 - row) * 0.012,
  },
  { duration: 0.62, ease: "power2.inOut", each: 0.028, from: "center" },
  { duration: 0.78, ease: "power2.inOut", each: 0.028, from: "edges" },
  { duration: 0.72, ease: "power2.inOut", each: 0.028, from: "end" },
];

type Tile = {
  element: HTMLDivElement;
  row: number;
  col: number;
};

type FaceName = "font" | "rear";

/** Preload AND decode an image so the first flip never waits on the decoder. */
const decodeCache = new Map<string, Promise<void>>();
const preloadImage = (src: string) => {
  let pending = decodeCache.get(src);
  if (!pending) {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    pending = img.decode().catch(() => undefined);
    decodeCache.set(src, pending);
  }
  return pending;
};

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const Showcase = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preview = previewRef.current;
    const list = listRef.current;
    const descriptionEl = descriptionRef.current;
    const captionEl = captionRef.current;
    if (!preview || !list || !descriptionEl || !captionEl) return;

    let disposed = false;
    const tiles: Tile[] = [];
    const elements: HTMLDivElement[] = [];

    // Build all tiles off-DOM, attach once (single layout/style pass)
    const fragment = document.createDocumentFragment();
    for (let row = 0; row < TILES_Y; row++) {
      for (let col = 0; col < TILES_X; col++) {
        const tile = document.createElement("div");
        tile.classList.add(styles.tile);

        TILE_FACES.forEach((side) => {
          const face = document.createElement("div");
          face.classList.add(styles["tile-face"], styles[`face-${side}`]);
          if (side === "font" || side === "rear") {
            // Constant for the lifetime of the tile — written exactly once.
            face.style.backgroundSize = `${PREVIEW_WIDTH}px ${PREVIEW_HEIGHT}px`;
            face.style.backgroundPosition = `${-(col * TILE_SIZE)}px ${-(row * TILE_SIZE)}px`;
          }
          tile.appendChild(face);
        });

        fragment.appendChild(tile);
        tiles.push({ element: tile, row, col });
        elements.push(tile);
      }
    }

    // Images are driven by two CSS variables on the preview root. Swapping an
    // image is ONE style write instead of ~324 per-face writes.
    const setFaceImage = (face: FaceName, src: string) => {
      preview.style.setProperty(`--img-${face}`, `url(${src})`);
    };
    setFaceImage("font", IMAGES[0]);
    setFaceImage("rear", IMAGES[0]);

    const ctx = gsap.context(() => {
      preview.replaceChildren(fragment);

      // Breathing: one self-refreshing tween per tile (no JS callback per cycle)
      tiles.forEach((tile, i) => {
        gsap.to(tile.element, {
          z: "random(-110, 110)",
          x: "random(-6, 6)",
          y: "random(-6, 6)",
          duration: gsap.utils.random(1.1, 2.4),
          ease: "sine.inOut",
          repeat: -1,
          repeatRefresh: true,
          delay: i * 0.028 + gsap.utils.random(0, 0.5),
        });
      });
    }, preview);

    let activeProject = 0;
    let revealCount = 0;
    let isRevealing = false;
    let pendingProject: number | null = null;
    let hoverDelay: ReturnType<typeof setTimeout> | null = null;
    let revealTween: gsap.core.Tween | gsap.core.Timeline | null = null;

    // Warm every image (fetch + decode) up front; they're small now.
    IMAGES.forEach(preloadImage);

    const showDescription = (index: number) => {
      const text = ITEMS[index]?.description ?? "";
      captionEl.dataset.visible = "true";
      gsap.killTweensOf(descriptionEl);
      gsap.fromTo(
        descriptionEl,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          onStart: () => {
            descriptionEl.textContent = text;
          },
        },
      );
    };

    const getHiddenFace = (): FaceName =>
      revealCount % 2 === 0 ? "rear" : "font";

    const runPending = () => {
      if (disposed || pendingProject === null) return;
      const next = pendingProject;
      pendingProject = null;
      void revealProject(next);
    };

    const revealProject = async (projectIndex: number) => {
      if (projectIndex === activeProject) return;

      // A flip is in flight: remember only the latest request and play it when
      // the current flip lands. No mid-flight snapping, no stacked tweens.
      if (isRevealing) {
        pendingProject = projectIndex;
        return;
      }
      isRevealing = true;

      // 1. Make sure the target image is decoded (instant after warm-up).
      await preloadImage(IMAGES[projectIndex]);
      if (disposed) return;

      // 2. Swap the hidden face image with a single style write...
      const hiddenFace = getHiddenFace();
      setFaceImage(hiddenFace, IMAGES[projectIndex]);

      // 3. ...and let the browser rasterize it BEFORE the tween starts, so the
      //    expensive first frame is not part of the animation's timeline.
      await nextFrame();
      if (disposed) return;

      revealCount++;
      activeProject = projectIndex;
      showDescription(projectIndex);

      const preset = REVEAL_PRESETS[projectIndex % REVEAL_PRESETS.length];
      const rotateY = revealCount * 180;

      const onFlipDone = () => {
        isRevealing = false;
        revealTween = null;
        runPending();
      };

      revealTween = gsap.to(elements, {
        rotateY,
        duration: preset.duration,
        ease: preset.ease,
        force3D: true,
        overwrite: false,
        stagger: preset.delayFor
          ? (index: number) => preset.delayFor!(tiles[index].row, tiles[index].col)
          : {
              each: preset.each,
              from: preset.from,
              grid: GRID,
              ...(preset.axis ? { axis: preset.axis } : {}),
            },
        onComplete: onFlipDone,
      });
    };

    const projectLinks = list.querySelectorAll<HTMLElement>("li");
    const cleanups: Array<() => void> = [];

    projectLinks.forEach((link) => {
      const onEnter = () => {
        projectLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        const projectIndex = parseInt(link.dataset.index ?? "1", 10) - 1;

        if (hoverDelay) clearTimeout(hoverDelay);
        hoverDelay = setTimeout(() => void revealProject(projectIndex), 80);
      };
      link.addEventListener("mouseenter", onEnter);
      cleanups.push(() => link.removeEventListener("mouseenter", onEnter));
    });

    projectLinks[0]?.classList.add("active");
    showDescription(0);

    const onListLeave = () => {
      projectLinks.forEach((link) => link.classList.remove("active"));
      projectLinks[0]?.classList.add("active");

      if (hoverDelay) clearTimeout(hoverDelay);
      hoverDelay = setTimeout(() => void revealProject(0), 80);
    };
    list.addEventListener("mouseleave", onListLeave);
    cleanups.push(() => list.removeEventListener("mouseleave", onListLeave));

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
      if (hoverDelay) clearTimeout(hoverDelay);
      revealTween?.kill();
      gsap.killTweensOf(descriptionEl);
      ctx.revert(); // kills every breathing tween + pending delay
      preview.replaceChildren();
    };
  }, []);

  return (
    <section className={styles.spotlight}>
      <div ref={previewRef} className={styles.preview} />
      <div ref={captionRef} className={styles.caption} data-visible="false">
        <p ref={descriptionRef} className={styles.description} />
      </div>
      <ul ref={listRef} className={styles.list}>
        {ITEMS.map((item, i) => (
          <li key={item.src} data-index={String(i + 1)}>
            {item.title}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Showcase;
