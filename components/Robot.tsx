"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/**
 * Small robot that peeks over the top edge of whatever it sits on.
 * Eyes follow the pointer, it blinks, and clicking it opens the AI chat.
 * Place it inside a `relative` wrapper; it anchors to the wrapper's top edge.
 */
export function Robot({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const springX = useSpring(eyeX, { stiffness: 220, damping: 20 });
  const springY = useSpring(eyeY, { stiffness: 220, damping: 20 });

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      const el = svgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.45;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(dist / 120, 1);
      eyeX.set((dx / dist) * 4 * reach);
      eyeY.set((dy / dist) * 3 * reach);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [eyeX, eyeY, reduceMotion]);

  return (
    <div className={`absolute bottom-full z-20 translate-y-[12px] ${className}`}>
      {/* Speech bubble */}
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none absolute bottom-[88%] right-[70%] w-max max-w-[14rem] rounded-lg border border-ai-border bg-ai-surface px-3 py-2 font-mono text-[0.72rem] leading-snug text-slate-200 shadow-ai-strong"
        aria-hidden
      >
        <span className="text-ai-accent-soft">beep boop.</span> ask me anything
        about Ebenezer →
      </motion.div>

      <Link
        href="/ask"
        aria-label="Open the AI chat about Ebenezer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ai-accent-soft/60"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 120 104"
          className="h-[92px] w-[106px] sm:h-[118px] sm:w-[136px]"
          aria-hidden
        >
          <defs>
            <linearGradient id="robot-head" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#243041" />
              <stop offset="1" stopColor="#18212c" />
            </linearGradient>
            <filter id="robot-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Head, antenna and face bob gently; hands stay gripping the edge */}
          <motion.g
            animate={reduceMotion ? undefined : { y: [0, -2.5, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Antenna */}
            <line x1="60" y1="10" x2="60" y2="22" stroke="#3d4b5c" strokeWidth="2.5" strokeLinecap="round" />
            <motion.circle
              cx="60"
              cy="8"
              r="4.5"
              fill="#34d399"
              filter="url(#robot-glow)"
              animate={reduceMotion ? undefined : { opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Ears */}
            <rect x="13" y="40" width="9" height="18" rx="3" fill="#243041" stroke="#3d4b5c" strokeWidth="1.5" />
            <rect x="98" y="40" width="9" height="18" rx="3" fill="#243041" stroke="#3d4b5c" strokeWidth="1.5" />

            {/* Head */}
            <rect x="22" y="22" width="76" height="56" rx="15" fill="url(#robot-head)" stroke="#3d4b5c" strokeWidth="2" />

            {/* Face screen */}
            <rect x="31" y="32" width="58" height="34" rx="9" fill="#05080c" stroke="#1f2a37" strokeWidth="1" />

            {/* Eyes */}
            <motion.g style={{ x: springX, y: springY }}>
              <motion.g
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                animate={reduceMotion ? undefined : { scaleY: [1, 1, 0.1, 1] }}
                transition={{
                  duration: 4,
                  times: [0, 0.92, 0.96, 1],
                  repeat: Infinity,
                }}
              >
                <rect
                  x="42"
                  y="42"
                  width="9"
                  height={hovered ? 7 : 12}
                  rx="3.5"
                  fill="#34d399"
                  filter="url(#robot-glow)"
                />
                <rect
                  x="69"
                  y="42"
                  width="9"
                  height={hovered ? 7 : 12}
                  rx="3.5"
                  fill="#34d399"
                  filter="url(#robot-glow)"
                />
              </motion.g>
            </motion.g>

            {/* Mouth: flat line, smile on hover */}
            <path
              d={hovered ? "M52 59 Q60 64 68 59" : "M54 60 L66 60"}
              stroke="#34d399"
              strokeOpacity="0.7"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Neck */}
            <rect x="50" y="78" width="20" height="12" rx="3" fill="#243041" stroke="#3d4b5c" strokeWidth="1.5" />
          </motion.g>

          {/* Hands gripping the window edge */}
          <rect x="24" y="88" width="20" height="12" rx="5" fill="#243041" stroke="#3d4b5c" strokeWidth="1.5" />
          <rect x="76" y="88" width="20" height="12" rx="5" fill="#243041" stroke="#3d4b5c" strokeWidth="1.5" />
          <line x1="30" y1="91" x2="30" y2="97" stroke="#3d4b5c" strokeWidth="1.2" />
          <line x1="35" y1="91" x2="35" y2="97" stroke="#3d4b5c" strokeWidth="1.2" />
          <line x1="85" y1="91" x2="85" y2="97" stroke="#3d4b5c" strokeWidth="1.2" />
          <line x1="90" y1="91" x2="90" y2="97" stroke="#3d4b5c" strokeWidth="1.2" />
        </svg>
      </Link>
    </div>
  );
}
