"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useOverlay } from "@/components/OverlayContext";

const SECTION_LINKS = [
  { href: "/#about", label: "about" },
  { href: "/#projects", label: "projects" },
  { href: "/#skills", label: "skills" },
  { href: "/#journey", label: "journey" },
  { href: "/#awards", label: "awards" },
  { href: "/#contact", label: "contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isOverlayOpen } = useOverlay();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-opacity duration-300 ${
        isOverlayOpen ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <nav
        className={`border-b transition-colors duration-300 ${
          scrolled || open
            ? "border-ai-border bg-ai-bg/95 [@media(hover:hover)]:bg-ai-bg/85 [@media(hover:hover)]:backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3 font-mono text-sm"
          >
            <span className="relative h-8 w-8 overflow-hidden rounded-lg border border-ai-border">
              <Image
                src="/Ebenezer.png"
                alt="Ebenezer Tay logo"
                fill
                sizes="32px"
                className="object-cover"
              />
            </span>
            <span className="text-slate-300 transition group-hover:text-slate-50">
              <span className="text-ai-accent-soft">~</span>/ebenezer
              <span className="ml-0.5 inline-block h-4 w-2 translate-y-[3px] animate-blink bg-ai-accent-soft/80" />
            </span>
          </Link>

          <div className="hidden items-center gap-1 font-mono text-[0.8rem] lg:flex">
            {SECTION_LINKS.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2.5 py-1.5 text-ai-muted transition hover:bg-white/[0.04] hover:text-slate-100"
              >
                <span className="text-ai-accent-soft/70">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/ask"
              className="inline-flex items-center gap-2 rounded-lg border border-ai-accent-soft/40 bg-ai-accent-soft/10 px-3 py-1.5 font-mono text-[0.8rem] text-ai-accent-soft transition hover:border-ai-accent-soft/70 hover:bg-ai-accent-soft/15"
            >
              <span aria-hidden>&gt;_</span>
              ask_ai
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-ai-border text-slate-300 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                aria-hidden
              >
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-ai-border px-4 pb-4 pt-2 lg:hidden">
            {SECTION_LINKS.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-2 py-2.5 font-mono text-sm text-slate-300 hover:bg-white/[0.04]"
              >
                <span className="text-ai-accent-soft/70">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
