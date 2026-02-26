"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ai-bg/95">
      <div className="relative h-24 w-24">
        <motion.div
          className="absolute inset-3 rounded-full border-2 border-ai-accent-soft/40"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-ai-accent/20 blur-xl"
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-5 rounded-full border border-ai-accent/60 shadow-ai-soft"
          animate={{ scale: [0.96, 1.03, 0.96] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
