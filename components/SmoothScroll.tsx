"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Apple-style momentum scrolling for the whole site.
 * Scroll still happens on the window, so framer-motion's useScroll keeps working.
 * Add `data-lenis-prevent` to any element that has its own scroll area.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch devices have their own momentum scrolling; Lenis only adds work there.
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
      anchors: { offset: -64 },
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
