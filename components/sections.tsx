"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { MagneticWrapper } from "@/components/MagneticWrapper";
import { SectionShell } from "@/components/SectionShell";

const fadeStaggerParent: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 0.61, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
};

const fadeStaggerChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function HeroSection() {
  return (
    <SectionShell
      id="top"
      className="relative flex min-h-[70vh] sm:min-h-[80vh] items-center justify-center px-4 pb-12 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-10"
      >
        <motion.div
          className="pointer-events-none absolute -left-10 top-4 h-40 w-40 rounded-3xl bg-ai-accent/35 blur-3xl"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -right-6 -top-10 h-48 w-48 rounded-full bg-ai-accent-soft/40 blur-3xl"
          animate={{ y: [6, -10, 6] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="relative grid w-full max-w-5xl items-center gap-8 text-left md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]"
          variants={fadeStaggerParent}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-5">
            <motion.div
              variants={fadeStaggerChild}
              className="inline-flex items-center gap-2 rounded-full border border-ai-border/70 bg-ai-surface/70 px-3 py-1 text-[0.7rem] text-slate-300 shadow-ai-soft"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ai-accent-soft" />
              <span>AI Engineer · UI/UX · Tech Innovator</span>
            </motion.div>
            <motion.h1
              variants={fadeStaggerChild}
              className="max-w-2xl text-[1.9rem] font-semibold leading-tight tracking-tight text-slate-50 sm:text-[2.2rem] lg:text-[2.4rem]"
            >
              Designing and building intelligent, human‑centered digital
              products.
            </motion.h1>
            <motion.p
              variants={fadeStaggerChild}
              className="max-w-xl text-sm leading-relaxed text-slate-300/90"
            >
              I design AI‑driven digital products that balance clarity, craft,
              and real‑world impact.
            </motion.p>
            <motion.div
              variants={fadeStaggerChild}
              className="mt-3 flex flex-wrap items-center gap-3"
            >
              <MagneticWrapper className="ai-glass flex h-11 items-center justify-center rounded-full bg-ai-surface/80 px-6 text-sm text-slate-200 shadow-ai-soft">
                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex items-center justify-center text-sm text-slate-200"
                >
                  Download CV
                </a>
              </MagneticWrapper>
              <a
                href="https://www.linkedin.com/in/ebenezer-tay"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ai-border/70 bg-ai-surface/80 text-slate-300 transition hover:border-ai-accent-soft/60 hover:text-slate-50"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/ee.ebenezer"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ai-border/70 bg-ai-surface/80 text-slate-300 transition hover:border-ai-accent-soft/60 hover:text-slate-50"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.272 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </motion.div>
          </div>
          <motion.div
            variants={fadeStaggerChild}
            className="relative flex justify-center md:justify-end"
          >
            <div className="relative h-56 w-56 overflow-hidden rounded-[2rem] ai-glass shadow-ai-soft">
              <Image
                src="/profile-main.png"
                alt="Portrait photo"
                fill
                sizes="224px"
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}

export function AboutSection() {
  return (
    <SectionShell
      id="about"
      className="relative mx-auto w-full max-w-6xl px-6 pb-12 pt-6 md:pb-20 md:pt-8 lg:pb-24 lg:pt-10 lg:px-16"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.1fr)] lg:items-center">
        <motion.div
          className="relative h-72 w-full rounded-3xl ai-glass shadow-ai-soft overflow-hidden"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <Image
            src="/snaprent-switch.png"
            alt="SnapRent & SWITCH showcase"
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ai-bg/80 via-transparent to-transparent" />
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={fadeStaggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="space-y-4" variants={fadeStaggerChild}>
            <h2 className="text-lg font-semibold tracking-tight text-slate-50">
              Blending design, engineering, and coaching.
            </h2>
            <p className="text-sm leading-relaxed text-slate-300/90">
              I&apos;m a Singapore‑based technologist who moves comfortably
              between UI/UX design, full‑stack web development, and building
              real products like SnapRent. With roots in Information Technology
              and entrepreneurship, I focus on experiences that feel calm,
              deliberate, and deeply considered.
            </p>
            <p className="text-sm leading-relaxed text-slate-300/80">
              Outside of tech, I&apos;m a certified swimming coach and
              lifeguard, it was the disciplines that shaped my mindset around safety,
              trust, and coaching people through meaningful progress.
            </p>
          </motion.div>

        </motion.div>
      </div>
    </SectionShell>
  );
}

export function ProjectsSection() {
  return (
    <SectionShell
      id="projects"
      className="relative mx-auto w-full max-w-6xl px-6 pb-12 pt-6 md:pb-20 md:pt-8 lg:pb-24 lg:pt-10 lg:px-16"
    >
      <motion.div
        className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-ai-accent-soft"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        Selected Work
      </motion.div>
      <motion.h2
        className="mb-8 text-lg font-semibold tracking-tight text-slate-50"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        Showcase projects shaped by real users.
      </motion.h2>
      <motion.div
        className="grid gap-7 md:grid-cols-3"
        variants={fadeStaggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {[
          {
            title: "SnapRent – All‑in‑one rental platform",
            description:
              "All‑in‑one rental platform for gadgets, fashion, and baby gear, with smart pricing and trust‑first flows.",
            tags: ["Product Design", "Next.js", "AI‑assisted UX"],
            image: "/snaprent.png",
            url: "https://snaprent.sg",
          },
          {
            title: "Slackers Club – Movies & games rooms",
            description:
              "Automated private movie and games rooms that make it easy to book, relax, and play with friends.",
            tags: ["Brand", "Product Strategy", "Web Experience"],
            image: "/slackersclub.png",
            url: "https://slackersclub.sg",
          },
          {
            title: "SwimXplorer – Freelance swimming network",
            description:
              "A swimming freelance business that connects customers with trusted coaches in a simple, transparent way.",
            tags: ["UX Design", "Platform", "Families"],
            image: "/swimxplorer.png",
            url: "https://swimxplorer.com",
          },
        ].map((project, index) => (
          <motion.div
            key={index}
            className="relative flex min-h-[22rem] flex-col rounded-3xl border border-ai-border/70 bg-ai-surface/80 p-4 shadow-ai-soft"
            variants={fadeStaggerChild}
          >
            <div className="relative flex h-full flex-col gap-4">
              <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-200/10">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="360px"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <div
                    key={tag}
                    className="rounded-full bg-slate-200/10 px-3 py-1 text-[0.7rem] text-slate-200/90"
                  >
                    {tag}
                  </div>
                ))}
              </div>
              <div className="mt-auto space-y-1">
                <h3 className="text-sm font-medium text-slate-50">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-300/90">
                  {project.description}
                </p>
                <div className="pt-3">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full bg-ai-accent/80 px-4 py-1.5 text-[0.75rem] font-medium text-slate-50 shadow-ai-soft hover:bg-ai-accent transition-colors"
                  >
                    Visit website
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}

export function SkillsSection() {
  return (
    <SectionShell
      id="skills"
      className="relative mx-auto w-full max-w-5xl px-6 pb-12 pt-6 md:pb-20 md:pt-8 lg:pb-24 lg:pt-10 lg:px-16"
    >
      <motion.div
        className="mx-auto mb-2 text-center text-xs font-medium uppercase tracking-[0.16em] text-ai-accent-soft"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        Capabilities
      </motion.div>
      <motion.h2
        className="mx-auto mb-8 max-w-xl text-center text-lg font-semibold tracking-tight text-slate-50"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        A toolkit built around modern product design and engineering.
      </motion.h2>
      <motion.div
        className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 xl:grid-cols-4"
        variants={fadeStaggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {[
          {
            title: "Product & Design",
            items: [
              "Product Strategy",
              "UI UX Design",
              "Design Systems",
              "Prototyping",
              "User Research",
            ],
          },
          {
            title: "Frontend Development",
            items: ["HTML", "CSS", "JavaScript", "Responsive Web Design"],
          },
          {
            title: "Tools & Software",
            items: ["Adobe Photoshop", "Adobe XD", "Adobe Illustrator"],
          },
          {
            title: "Leadership & Entrepreneurship",
            items: [
              "Entrepreneurship",
              "Startup Development",
              "Team Leadership",
              "Coaching & Mentoring",
              "Public Communication",
            ],
          },
        ].map((group, index) => (
          <motion.div
            key={group.title}
            className="relative flex min-h-[11rem] flex-col rounded-3xl border border-ai-border/70 bg-ai-surface/80 px-4 py-5 text-left shadow-ai-soft"
            variants={fadeStaggerChild}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 230, damping: 20 }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-3 w-3 items-center justify-center rounded-full bg-ai-accent-soft/25">
                <div className="h-1.5 w-1.5 rounded-full bg-ai-accent-soft" />
              </div>
              <h3 className="text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-slate-100 leading-snug">
                {group.title}
              </h3>
            </div>
            <ul className="ml-4 space-y-1.5 text-[0.78rem] text-slate-200">
              {group.items.map((skill) => (
                <li key={skill} className="list-disc marker:text-ai-accent-soft">
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}

export function TimelineSection() {
  return (
    <SectionShell
      id="timeline"
      className="relative mx-auto w-full max-w-5xl px-6 pb-12 pt-6 md:pb-20 md:pt-8 lg:pb-24 lg:pt-10 lg:px-16"
    >
      <div className="mb-6 space-y-2 text-left">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-ai-accent-soft">
          Trips i have been
        </div>
        <p className="max-w-md text-xs text-slate-300/90">
          Key roles and experiences that shaped how I design, build, and lead.
        </p>
      </div>
      <div className="relative pl-0 lg:pl-0">
        {/* Mobile: line on left. Desktop: line in center */}
        <motion.div
          className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-ai-accent via-ai-accent-soft/40 to-transparent lg:left-1/2 lg:-translate-x-1/2"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
        />
        <div className="space-y-6 lg:space-y-10">
          {[
            {
              label: "NUS Innovation x Impact Immersion Programme I3P",
              date: "Dec 2024",
              detail:
                "Represented Singapore Polytechnic in Ho Chi Minh City, Vietnam for a 7 day 6 night innovation immersion. Explored the Vietnamese startup ecosystem with SnapRent alongside NUS Overseas Colleges to gain market insights and cross border entrepreneurship exposure.",
              galleryHref: "/trips/i3p",
            },
            {
              label: "Overseas Entrepreneurship Immersion Programme OEIP",
              date: "Apr 2025",
              detail:
                "Participated in a 7 day 6 night entrepreneurship immersion in Hangzhou, China under Singapore Polytechnic. Gained exposure to the Chinese market environment and learned how businesses operate and scale within China’s ecosystem.",
              galleryHref: "/trips/oeip",
            },
            {
              label: "Overseas Sustainable Innovation Programme OSIP",
              date: "Sept 2025",
              detail:
                "Participated in a sustainability immersion in Vietnam for 12 days, where I engaged in community based projects in Binh Duong. Contributed to addressing local sustainability challenges, including improving processes related to lacquer crafting to better support villagers.",
              galleryHref: "/trips/osip",
            },
            {
              label: "Internship Programme",
              date: "Mar 2026 – Present",
              detail:
                "Selected for a 6 month overseas internship in Shenzhen, China. Serving as an AI Engineer Intern, focusing on training and developing artificial intelligence models within a high technology innovation environment.",
              galleryHref: "/trips/internship",
            },
          ].map((item, index) => {
            const alignLeft = index % 2 === 0;
            return (
              <motion.div
                key={index}
                className={`group relative flex items-center justify-start ${
                  alignLeft ? "" : "lg:justify-end"
                }`}
                initial={{ opacity: 0, x: alignLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.08,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                {/* Mobile: full width, pl to clear left line. Desktop: max-w-md, alternating padding */}
                <div
                  className={`w-full pl-10 lg:max-w-md lg:pl-0 ${
                    alignLeft ? "lg:pr-10" : "lg:pl-10 lg:pr-0"
                  }`}
                >
                  <div
                    className={`relative rounded-2xl border border-ai-border/70 bg-ai-surface/80 p-4 text-left shadow-ai-soft ${
                      alignLeft ? "lg:ml-auto" : "lg:mr-auto"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-100">
                        {item.label}
                      </div>
                      {item.date && (
                        <div className="text-[0.7rem] uppercase tracking-wide text-slate-400">
                          {item.date}
                        </div>
                      )}
                      <div className="text-[0.78rem] leading-relaxed text-slate-300/90">
                        {item.detail}
                      </div>
                      {item.galleryHref && (
                        <Link
                          href={item.galleryHref}
                          className="mt-2 inline-flex items-center rounded-full bg-ai-accent/80 px-3 py-1 text-[0.7rem] font-medium text-slate-50 opacity-100 shadow-ai-soft transition sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          See images
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

export function AchievementsSection() {
  return (
    <SectionShell
      id="achievements"
      className="relative mx-auto w-full max-w-6xl px-6 pb-12 pt-6 md:pb-20 md:pt-8 lg:pb-24 lg:pt-10 lg:px-16"
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-ai-accent/20 via-transparent to-transparent blur-3xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4 }}
      />
      <motion.div
        className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-ai-accent-soft"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        Articles & Achievements
      </motion.div>
      <motion.h2
        className="mb-8 text-lg font-semibold tracking-tight text-slate-50"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        Moments where the work, teams, and story were recognised.
      </motion.h2>
      <motion.div
        className="grid gap-6 md:grid-cols-3"
        variants={fadeStaggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {[
          {
            title: "Featured on 89.3 FM",
            detail: "Radio feature on the journey building student‑led products.",
            href: "https://bit.ly/4qsKEDe",
            logo: "/moneyfm.png",
          },
          {
            title: "Featured in The Business Times",
            detail: "Coverage on building and scaling SnapRent.",
            href: "https://bit.ly/ThriveBusinessTimes",
            logo: "/thrive.png",
          },
          {
            title: "2024 Batey Hackathon · Gold Winner",
            detail: "Awarded Gold for brand‑driven innovation with SnapRent.",
            logo: "/sp.png",
          },
          {
            title: "2025 Batey Challenge · Grand Winner",
            detail: "Grand Winner for creative problem‑solving and execution.",
            logo: "/sp.png",
          },
          {
            title: "Gold With Honour - CCA",
            detail: "Awarded Gold with Honours for outstanding contribution.",
            logo: "/sp.png",
          },
          {
            title: "SWITCH 2024 & 2025 Exhibitor",
            detail: "Showcased startup work to founders, investors, and builders.",
            logo: "/switch.png",
          },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            className="group relative rounded-3xl border border-ai-border/70 bg-ai-surface/80 p-5 shadow-ai-soft"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-ai-accent/25 via-transparent to-ai-accent-soft/30 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.45 }}
            />
            <div className="relative space-y-3">
              <div className="flex items-center gap-3">
                {item.logo ? (
                  <div
                    className={`relative shrink-0 overflow-hidden rounded-xl bg-slate-900/20 ${
                      item.logo === "/sp.png" ? "h-16 w-16" : "h-14 w-14"
                    }`}
                  >
                    <Image
                      src={item.logo}
                      alt={item.title}
                      fill
                      sizes={item.logo === "/sp.png" ? "64px" : "56px"}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-slate-200/20" />
                )}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-50">
                    {item.title}
                  </div>
                  <div className="text-[0.78rem] text-slate-300/90">
                    {item.detail}
                  </div>
                </div>
              </div>
              {item.href && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex text-[0.75rem] text-ai-accent-soft underline-offset-4 hover:underline"
                >
                  Open article
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}

// Trip gallery sections live on their own pages under /trips/*

export function CertificatesSection() {
  const certificates = [
    {
      title: "Batey Hackathon 2024 · Gold Winner (SnapRent)",
      image: "/batey-gold.png",
    },
    {
      title: "Batey Challenge 2025 · Grand Winner (SnapRent)",
      image: "/batey-grand.png",
    },
    {
      title: "Young Founders Summit",
      image: "/yfs.png",
    },
    {
      title: "Edusave Merit Bursary 2025",
      image: "/edusave-merit-bursary-2025.png",
    },
    {
      title: "Temasek Foundation SCALE Scholar 2025",
      image: "/tf-scale-2025.png",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeCert =
    activeIndex !== null ? certificates[activeIndex] : null;

  return (
    <>
      <SectionShell
        id="certificates"
        className="relative mx-auto w-full max-w-6xl px-0 pb-12 pt-6 md:pb-20 md:pt-8 lg:pb-24 lg:pt-10"
      >
        <motion.div
          className="mx-6 mb-2 text-xs font-medium uppercase tracking-[0.16em] text-ai-accent-soft"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          Certificates
        </motion.div>
        <motion.h2
          className="mx-6 mb-6 text-lg font-semibold tracking-tight text-slate-50"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          Certificates & Awards.
        </motion.h2>
        <motion.div
          className="flex gap-5 overflow-x-auto px-6 pb-4"
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {certificates.map((item, index) => (
            <motion.button
              type="button"
              key={item.title}
              onClick={() => setActiveIndex(index)}
              className="group relative flex h-72 min-w-[300px] flex-col rounded-3xl border border-ai-border/70 bg-ai-surface/80 p-3 text-left shadow-ai-soft outline-none transition hover:border-ai-accent-soft/80 focus-visible:ring-2 focus-visible:ring-ai-accent-soft/70"
              whileHover={{ boxShadow: "0 0 40px rgba(129,140,248,0.45)" }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-ai-accent/30 via-black/40 to-ai-accent-soft/30">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="320px"
                  className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <div className="mt-3 text-center text-[0.78rem] font-medium text-slate-100">
                {item.title}
              </div>
            </motion.button>
          ))}
        </motion.div>
      </SectionShell>

      {activeCert && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveIndex(null)}
        >
          <motion.div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-3xl border border-ai-border/80 bg-ai-surface/95 shadow-ai-strong"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[80vh] w-[80vw] max-w-3xl">
              <Image
                src={activeCert.image}
                alt={activeCert.title}
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-contain"
                priority
              />
            </div>
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-black/90"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export function TestimonialsSection() {
  return (
    <SectionShell
      id="testimonials"
      className="relative mx-auto w-full max-w-4xl px-6 pb-12 pt-6 md:pb-20 md:pt-8 lg:pb-24 lg:pt-10 lg:px-16"
    >
      <motion.div
        className="mx-auto mb-2 text-center text-xs font-medium uppercase tracking-[0.16em] text-ai-accent-soft"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        Kind words
      </motion.div>
      <motion.h2
        className="mx-auto mb-8 max-w-xl text-center text-lg font-semibold tracking-tight text-slate-50"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        Feedback from teams, clients, and swimmers.
      </motion.h2>
      <motion.div
        className="relative rounded-3xl border border-ai-border/70 bg-ai-surface/85 p-8 shadow-ai-strong"
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <motion.div
          className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-3xl bg-ai-accent-soft/40 blur-2xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex flex-col items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-slate-200/20" />
          <div className="space-y-3 text-center">
            <p className="text-sm leading-relaxed text-slate-200/95">
              I bring a calm, thoughtful energy to every collaboration. I
              listen, reframe problems clearly, and turn ideas into interfaces
              that feel effortless to use.
            </p>
          </div>
        </div>
      </motion.div>
    </SectionShell>
  );
}

export function ContactSection() {
  return (
    <SectionShell
      id="contact"
      className="relative mx-auto w-full max-w-xl px-4 pb-16 pt-6 md:pb-24 md:pt-8 lg:px-0 lg:pb-28 lg:pt-10"
    >
      <motion.div
        className="mx-auto mb-2 text-center text-xs font-medium uppercase tracking-[0.16em] text-ai-accent-soft"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        Contact
      </motion.div>
      <motion.h2
        className="mx-auto mb-6 max-w-md text-center text-lg font-semibold tracking-tight text-slate-50"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        Open to collaborations, product conversations, and coaching‑driven work.
      </motion.h2>
      <motion.div
        className="relative rounded-3xl border border-ai-border/70 bg-ai-surface/85 p-8 shadow-ai-soft"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="space-y-4 text-xs text-slate-300">
          <div className="h-11 w-full rounded-2xl bg-slate-200/10 px-4 py-3 text-[0.75rem] text-slate-400">
            Name
          </div>
          <div className="h-11 w-full rounded-2xl bg-slate-200/10 px-4 py-3 text-[0.75rem] text-slate-400">
            Email or preferred contact
          </div>
          <div className="h-20 w-full rounded-2xl bg-slate-200/10 px-4 py-3 text-[0.75rem] text-slate-400">
            Short message or project summary
          </div>
          <MagneticWrapper className="mt-4">
            <div className="flex h-12 w-full items-center justify-center rounded-2xl bg-ai-accent/70 shadow-ai-strong">
              <span className="text-xs font-semibold tracking-wide text-slate-50">
                Send message
              </span>
            </div>
          </MagneticWrapper>
        </div>
      </motion.div>
    </SectionShell>
  );
}
