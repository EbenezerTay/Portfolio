"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Customize the right-side nav items here. Add or remove links as needed.
 * Each item appears as a glowing pill in the navbar.
 */
const NAV_ITEMS = [
  { href: "/ask", label: "Ask AI" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <motion.nav
        className="relative flex w-full max-w-4xl items-center justify-between gap-4 overflow-hidden rounded-2xl border border-ai-border/50 bg-ai-surface/90 px-5 py-3 backdrop-blur-xl"
        style={{
          boxShadow: scrolled
            ? "0 0 0 1px rgba(34, 211, 238, 0.15), 0 0 40px rgba(34, 211, 238, 0.08), 0 0 80px rgba(79, 70, 229, 0.05)"
            : "0 0 0 1px rgba(34, 211, 238, 0.2), 0 0 50px rgba(34, 211, 238, 0.12), 0 0 100px rgba(79, 70, 229, 0.06)",
        }}
        animate={{
          backgroundColor: scrolled ? "rgba(15, 23, 42, 0.92)" : "rgba(15, 23, 42, 0.85)",
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Inner glow line */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.06) 20%, rgba(34, 211, 238, 0.12) 50%, rgba(34, 211, 238, 0.06) 80%, transparent 100%)",
            maskImage: "linear-gradient(transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage: "linear-gradient(transparent, black 20%, black 80%, transparent)",
          }}
        />
        <div className="absolute -left-20 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-ai-accent-soft/20 blur-3xl" />
        <div className="absolute -right-20 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-ai-accent/20 blur-3xl" />

        <Link
          href="/"
          className="relative z-10 flex items-center gap-3 transition opacity-90 hover:opacity-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ai-accent/90 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <span className="text-sm font-semibold tracking-widest text-slate-50">ET</span>
          </div>
          <div className="hidden flex-col text-xs leading-tight text-slate-300 sm:flex">
            <span className="font-medium text-slate-100">Ebenezer Tay</span>
            <span className="text-[0.65rem] text-slate-400">AI Engineer · UI/UX · Founder</span>
          </div>
        </Link>

        <div className="relative z-10 flex items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-ai-accent-soft/30 bg-ai-accent-soft/10 px-4 py-2 text-[0.8rem] font-medium text-slate-200 transition hover:border-ai-accent-soft/50 hover:bg-ai-accent-soft/20 hover:text-slate-50 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </motion.nav>
    </motion.header>
  );
}
