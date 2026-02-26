"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function BackgroundFX() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();

  const gradientY = useTransform(scrollY, [0, 800], [0, -80]);
  const particlesY = useTransform(scrollY, [0, 800], [0, 60]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ai-bg"
    >
      <motion.div
        className="absolute inset-[-20%] bg-ai-gradient opacity-70"
        style={{ y: gradientY }}
      />

      <motion.div
        className="ai-grid-mask absolute inset-0 opacity-[0.45]"
        style={{ y: particlesY }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.4)_0,transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.85)_1px,transparent_1px)] bg-[size:0.75rem_0.75rem]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.85)_1px,transparent_1px)] bg-[size:0.75rem_0.75rem]" />
      </motion.div>

      <div className="absolute inset-0">
        {Array.from({ length: 18 }).map((_, index) => (
          <motion.div
            key={index}
            className="ai-hide-on-touch absolute h-2 w-2 rounded-full bg-ai-accent-soft/90 blur-[1px]"
            style={{
              top: `${15 + (index * 7) % 70}%`,
              left: `${10 + (index * 13) % 80}%`,
            }}
            animate={{
              opacity: [0.2, 0.9, 0.15],
              scale: [0.7, 1.08, 0.8],
            }}
            transition={{
              duration: 10 + index * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute -right-40 top-1/4 h-96 w-96 rounded-[3rem] bg-gradient-to-br from-ai-accent/50 via-ai-accent-soft/40 to-transparent blur-3xl"
        animate={{ y: [-30, 10, -30] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-40 bottom-0 h-[26rem] w-[28rem] rounded-[4rem] bg-gradient-to-tr from-ai-accent-soft/40 via-ai-accent/40 to-transparent blur-3xl"
        animate={{ y: [10, -25, 10] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
