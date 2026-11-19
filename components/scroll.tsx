"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

// Apple-style "expo out" curve: fast start, long gentle settle.
export const ease = [0.16, 1, 0.3, 1] as const;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Fades and lifts once when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Scales and fades in, tied directly to scroll position (rewinds on scroll up). */
export function ScrollScale({
  children,
  className,
  from = 0.86,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.55"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0.7, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduceMotion ? undefined : { scale, opacity, y }}
    >
      {children}
    </motion.div>
  );
}

/** Number that counts up from 0 the first time it scrolls into view. */
export function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const value = useMotionValue(0);

  useMotionValueEvent(value, "change", (v) => {
    if (ref.current) ref.current.textContent = String(Math.round(v));
  });

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration: 1.8, ease });
    return () => controls.stop();
  }, [inView, reduceMotion, to, value]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}

/**
 * Pins an image to the screen and grows it from a small rounded card
 * to full-bleed as you scroll, then fades in a caption.
 * On portrait screens (phones, upright tablets) the image keeps its own
 * shape at full width so nothing important is cropped, and the caption
 * sits underneath it.
 */
export function PinnedZoom({
  image,
  alt,
  eyebrow,
  caption,
  aspect = 3 / 2,
}: {
  image: ReactNode;
  alt: string;
  eyebrow: string;
  caption: string;
  /** width / height of the image */
  aspect?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const update = () => setPortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const insetY = portrait ? 12 : 20;
  const insetX = portrait ? 12 : 24;
  const grow = useTransform(scrollYProgress, [0, 0.65], [0, 1], { clamp: true });
  const clip = useTransform(grow, (t) => {
    const y = insetY * (1 - t);
    const x = insetX * (1 - t);
    const r = (portrait ? 16 : 24) * (1 - t);
    return `inset(${y}% ${x}% ${y}% ${x}% round ${r}px)`;
  });
  const imgScale = useTransform(scrollYProgress, [0, 0.65], [1.25, 1]);
  const captionOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.55, 0.75], [30, 0]);
  const shade = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);

  const captionBlock = (
    <>
      <div className="font-mono text-xs text-ai-accent-soft">{eyebrow}</div>
      <p className="mt-3 max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
        {caption}
      </p>
    </>
  );

  if (reduceMotion) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ aspectRatio: String(aspect) }}
          aria-label={alt}
        >
          {image}
        </div>
        <div className="mt-6">{captionBlock}</div>
      </section>
    );
  }

  if (portrait) {
    return (
      <section ref={ref} className="relative h-[170svh]">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-16">
          <motion.div
            className="relative w-full overflow-hidden"
            style={{ clipPath: clip, aspectRatio: String(aspect) }}
            aria-label={alt}
          >
            <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
              {image}
            </motion.div>
          </motion.div>
          <motion.div
            className="mx-auto mt-6 w-full max-w-6xl px-4 sm:px-6"
            style={{ opacity: captionOpacity, y: captionY }}
          >
            {captionBlock}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[240vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath: clip }} aria-label={alt}>
          <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
            {image}
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
            style={{ opacity: shade }}
          />
        </motion.div>
        <motion.div
          className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8"
          style={{ opacity: captionOpacity, y: captionY }}
        >
          {captionBlock}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Pins a section and turns vertical scrolling into horizontal movement
 * of a row of cards (Apple-style gallery). Falls back to a normal
 * swipeable row when reduced motion is on.
 */
export function PinnedHorizontal({
  id,
  header,
  children,
}: {
  id?: string;
  header: ReactNode;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const distance = useMotionValue(0);
  const [travel, setTravel] = useState<number | null>(null);
  // Landscape phones are too short to pin a gallery: use a swipeable row instead.
  const [short, setShort] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-height: 519px)");
    const update = () => setShort(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const reduceMotion = prefersReduced || short;

  useIsoLayoutEffect(() => {
    if (reduceMotion) return;
    const track = trackRef.current;
    if (!track) return;
    let lastWidth = -1;
    let lastTrack = -1;
    const measure = () => {
      const w = document.documentElement.clientWidth;
      const tw = track.scrollWidth;
      // Phones fire resize when the address bar slides; ignore height-only changes.
      if (w === lastWidth && tw === lastTrack) return;
      lastWidth = w;
      lastTrack = tw;
      const d = Math.max(0, tw - w);
      distance.set(d);
      setTravel(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance, reduceMotion]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(
    [scrollYProgress, distance],
    ([p, d]: number[]) => -p * d,
  );

  const trackPadding = {
    paddingLeft: "max(1rem, calc((100vw - 72rem) / 2 + 2rem))",
    paddingRight: "max(1rem, calc((100vw - 72rem) / 2 + 2rem))",
  };

  if (reduceMotion) {
    return (
      <section id={id} className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{header}</div>
        <div
          data-lenis-prevent
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-6 [&>*]:snap-start"
          style={trackPadding}
        >
          {children}
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative"
      style={{ height: travel === null ? "200svh" : `calc(${travel}px + 100svh)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pb-4 pt-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{header}</div>
        <motion.div
          ref={trackRef}
          className="flex w-max gap-6"
          style={{ x, ...trackPadding }}
        >
          {children}
        </motion.div>
        <div className="mx-auto mt-4 w-full max-w-6xl px-4 sm:mt-8 sm:px-6 lg:px-8">
          <div className="h-px w-full bg-ai-border">
            <motion.div
              className="h-px origin-left bg-ai-accent-soft"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Vertical line that draws itself as the target scrolls past. */
export function DrawLine({
  targetRef,
  className,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.7", "end 0.6"],
  });
  return (
    <motion.div
      className={className}
      style={reduceMotion ? undefined : { scaleY: scrollYProgress }}
    />
  );
}
