"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const trailX = useSpring(cursorX, {
    stiffness: 90,
    damping: 16,
    mass: 0.4,
  });
  const trailY = useSpring(cursorY, {
    stiffness: 90,
    damping: 16,
    mass: 0.4,
  });

  useEffect(() => {
    const move = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  return (
    <div className="ai-hide-on-touch pointer-events-none fixed inset-0 z-[60] mix-blend-screen">
      <motion.div
        className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ai-accent-soft/60 bg-ai-accent-soft/10 shadow-ai-soft"
        style={{ x: cursorX, y: cursorY }}
      />
      <motion.div
        className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ai-accent/20 blur-2xl"
        style={{ x: trailX, y: trailY }}
      />
    </div>
  );
}
