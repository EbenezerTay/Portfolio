"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useOverlay } from "@/components/OverlayContext";
import dynamic from "next/dynamic";

// three.js is heavy: load the 3D robot in the browser only, show the flat robot meanwhile.
const Robot3D = dynamic(() => import("@/components/Robot3D"), {
  ssr: false,
  loading: () => null,
});
import {
  CountUp,
  DrawLine,
  PinnedHorizontal,
  PinnedZoom,
  Reveal,
  ScrollScale,
  ease,
} from "@/components/scroll";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const LINKS = {
  linkedin: "https://www.linkedin.com/in/ebenezer-tay",
  instagram: "https://www.instagram.com/ee.ebenezer",
  resume: "/resume.pdf",
};

const ROLES = [
  "AI Engineer",
  "Full-stack Developer",
  "UI/UX Designer",
  "Founder",
];

const PROJECTS = [
  {
    name: "SnapRent",
    title: "All-in-one rental platform",
    description:
      "Rental platform for gadgets, fashion, and baby gear, with smart pricing and trust-first flows.",
    tags: ["product-design", "nextjs", "ai-ux"],
    image: "/snaprent.png",
    url: "https://snaprent.sg",
  },
  {
    name: "Slackers Club",
    title: "Movies & games rooms",
    description:
      "Automated private movie and games rooms that make it easy to book, relax, and play with friends.",
    tags: ["brand", "product-strategy", "web"],
    image: "/slackersclub.png",
    url: "https://slackersclub.sg",
  },
  {
    name: "SwimXplorer",
    title: "Freelance swimming network",
    description:
      "A swimming freelance business that connects customers with trusted coaches in a simple, transparent way.",
    tags: ["ux-design", "platform", "families"],
    image: "/swimxplorer.png",
    url: "https://swimxplorer.com",
  },
];

const SKILLS = [
  {
    dir: "product_design",
    items: [
      "Product Strategy",
      "UI/UX Design",
      "Design Systems",
      "Prototyping",
      "User Research",
    ],
  },
  {
    dir: "engineering",
    items: [
      "AI Model Training",
      "HTML / CSS",
      "JavaScript / TypeScript",
      "React / Next.js",
      "Responsive Web Design",
    ],
  },
  {
    dir: "tools",
    items: ["Adobe Photoshop", "Adobe XD", "Adobe Illustrator", "Git"],
  },
  {
    dir: "leadership",
    items: [
      "Entrepreneurship",
      "Startup Development",
      "Team Leadership",
      "Coaching & Mentoring",
      "Public Communication",
    ],
  },
];

const JOURNEY = [
  {
    label: "Overseas Internship · AI Engineer Intern",
    place: "Shenzhen, China",
    date: "Mar 2026 – Present",
    detail:
      "Selected for a 6 month overseas internship. Training and developing artificial intelligence models within a high technology innovation environment.",
    href: "/trips/internship",
    current: true,
  },
  {
    label: "Overseas Sustainable Innovation Programme (OSIP)",
    place: "Binh Duong, Vietnam",
    date: "Sep 2025",
    detail:
      "12 day sustainability immersion working on community projects, including improving lacquer crafting processes to better support villagers.",
    href: "/trips/osip",
  },
  {
    label: "Overseas Entrepreneurship Immersion Programme (OEIP)",
    place: "Hangzhou, China",
    date: "Apr 2025",
    detail:
      "7 day entrepreneurship immersion with Singapore Polytechnic. Learned how businesses operate and scale within China’s ecosystem.",
    href: "/trips/oeip",
  },
  {
    label: "NUS Innovation x Impact Immersion Programme (I3P)",
    place: "Ho Chi Minh City, Vietnam",
    date: "Dec 2024",
    detail:
      "Represented Singapore Polytechnic and explored the Vietnamese startup ecosystem with SnapRent alongside NUS Overseas Colleges.",
    href: "/trips/i3p",
  },
];

const PRESS = [
  {
    title: "89.3 Money FM",
    detail: "Radio feature on the journey building student-led products.",
    href: "https://bit.ly/4qsKEDe",
    logo: "/moneyfm.png",
  },
  {
    title: "The Business Times",
    detail: "Coverage on building and scaling SnapRent.",
    href: "https://bit.ly/ThriveBusinessTimes",
    logo: "/thrive.png",
  },
  {
    title: "SP School of Computing",
    detail: "Turning trust into income and waste into opportunity.",
    href: "https://www.sp.edu.sg/courses/schools/sma/happenings/detail/soc-happenings/turning-trust-into-income-and-waste-into-opportunity-through-renting",
    logo: "/SOC.png",
  },
  {
    title: "e27",
    detail: "Backing bold ideas: Singapore Polytechnic funds student ventures.",
    href: "https://e27.co/backing-bold-ideas-singapore-polytechnic-funds-16-student-ventures-20250926/",
    logo: "/E27.png",
  },
  {
    title: "Green In Future",
    detail: "The power of AI to drive innovation.",
    href: "https://greeninfuture.com/wp-content/uploads/2025/11/Green-Pulse_Sep-Oct-2025.pdf#page=26",
    logo: "/GreenInFuture.png",
  },
];

const AWARDS = [
  {
    title: "Batey Challenge 2025 · Grand Winner",
    detail: "Creative problem-solving and execution with SnapRent.",
    year: "2025",
  },
  {
    title: "Batey Hackathon 2024 · Gold",
    detail: "Brand-driven innovation with SnapRent.",
    year: "2024",
  },
  {
    title: "SWITCH Exhibitor",
    detail: "Showcased startup work to founders, investors, and builders.",
    year: "2024–25",
  },
  {
    title: "Gold With Honour · CCA",
    detail: "Outstanding contribution to co-curricular activities.",
    year: "SP",
  },
];

const CERTIFICATES = [
  { title: "Batey Hackathon 2024 · Gold Winner", image: "/batey-gold.png" },
  { title: "Batey Challenge 2025 · Grand Winner", image: "/batey-grand.png" },
  { title: "Young Founders Summit", image: "/yfs.png" },
  { title: "Edusave Merit Bursary 2025", image: "/edusave-merit-bursary-2025.png" },
  { title: "Temasek Foundation SCALE Scholar 2025", image: "/tf-scale-2025.png" },
  {
    title: "Sustainability Hackathon Merit 2026",
    image: "/sustainability-hackathon-merit-2026.png",
  },
  {
    title: "Certificate in Entrepreneurship 2026",
    image: "/certificate-entrepreneurship-sp-2026.png",
  },
];

/* ------------------------------------------------------------------ */
/* Shared building blocks                                              */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Scroll-linked pieces (Apple-style)                                  */
/* ------------------------------------------------------------------ */

const STATEMENT =
  "I turn ideas into products people actually use. Designing the experience, training the models, and shipping the code.";

function StatementWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const y = useTransform(progress, [start, end], [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className="mr-[0.28em] inline-block">
      {word}
    </motion.span>
  );
}

export function StatementSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Leave a little dwell time at the end once every word is lit.
  const progress = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const words = STATEMENT.split(" ");

  if (reduceMotion) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
        <p className="text-3xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-5xl">
          {STATEMENT}
        </p>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[160svh] sm:h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 font-mono text-xs text-ai-accent-soft">
            {"// what i do"}
          </div>
          <p className="text-3xl font-semibold leading-[1.15] tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
            {words.map((word, i) => (
              <StatementWord
                key={i}
                word={word}
                index={i}
                total={words.length}
                progress={progress}
              />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}

function SectionHeader({
  index,
  name,
  title,
  description,
  compact = false,
}: {
  index: string;
  name: string;
  title: string;
  description?: string;
  compact?: boolean;
}) {
  const inner = (
    <>
      <div className="flex items-center gap-3 font-mono text-xs text-ai-accent-soft">
        <span>
          {index}. {name}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-ai-border to-transparent" />
      </div>
      <h2
        className={`mt-3 font-semibold leading-[1.05] tracking-tight text-slate-50 sm:mt-4 ${
          compact
            ? "text-2xl sm:text-4xl lg:text-5xl"
            : "text-3xl sm:text-5xl lg:text-6xl"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ai-muted sm:text-lg">
          {description}
        </p>
      )}
    </>
  );

  return compact ? (
    <Reveal className="mb-4 sm:mb-8 [&_p]:[@media(max-height:760px)]:hidden">{inner}</Reveal>
  ) : (
    <ScrollScale from={0.94} className="mb-8 origin-left sm:mb-14">
      {inner}
    </ScrollScale>
  );
}

function WindowFrame({
  title,
  children,
  className = "",
  bodyClassName = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-ai-border bg-ai-panel shadow-ai-strong ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-ai-border bg-ai-surface px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        </div>
        <span className="truncate font-mono text-[0.72rem] text-ai-muted">
          {title}
        </span>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

const sectionClass =
  "relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-24 md:py-36 lg:px-8";

function shortHash(input: string) {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = (h * 33) ^ input.charCodeAt(i);
  return (h >>> 0).toString(16).padStart(7, "0").slice(0, 7);
}

function LinkedInIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.272 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function useTypewriter(words: string[]) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const word = words[index];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(
        () =>
          setText(
            deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1),
          ),
        deleting ? 35 : 70,
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words]);

  return text;
}

export function HeroSection() {
  const role = useTypewriter(ROLES);
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0.2, 0.8], [0, 6]);
  const heroFilter = useTransform(heroBlur, (b) => `blur(${b}px)`);
  const windowY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <section id="top" ref={ref} className="relative">
      <motion.div
        style={
          reduceMotion
            ? undefined
            : { scale: heroScale, opacity: heroOpacity, filter: heroFilter }
        }
        className="relative mx-auto grid w-full max-w-6xl origin-top items-center gap-4 px-4 pb-6 pt-8 sm:gap-12 sm:px-6 sm:pb-16 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:pb-24"
      >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="min-w-0 space-y-7"
      >
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-ai-border">
            <Image
              src="/profile-main.png"
              alt="Portrait of Ebenezer Tay"
              fill
              sizes="56px"
              className="object-cover"
              priority
            />
          </div>
          <div className="font-mono text-xs leading-relaxed text-ai-muted">
            <div>
              <span className="text-ai-accent-soft">$</span> whoami
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ai-accent-soft opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ai-accent-soft" />
              </span>
              Based in Singapore
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
            Ebenezer Tay
          </h1>
          <p className="h-8 font-mono text-lg text-slate-300 sm:text-xl">
            <span className="text-syn-kw">&gt;</span>{" "}
            <span className="text-ai-accent-soft">{role}</span>
            <span className="ml-0.5 inline-block h-5 w-2.5 translate-y-1 animate-blink bg-ai-accent-soft/80" />
          </p>
          <p className="max-w-xl text-[0.98rem] leading-relaxed text-ai-muted">
            I design and build AI-driven digital products that balance clarity,
            craft, and real-world impact, from training models to shipping the
            interfaces people actually use.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={LINKS.resume}
            download
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-ai-accent-soft px-5 font-mono text-sm font-medium text-slate-950 transition hover:bg-emerald-300"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
            </svg>
            download_cv
          </a>
          <Link
            href="/#projects"
            className="inline-flex h-11 items-center rounded-lg border border-ai-border bg-ai-surface px-5 font-mono text-sm text-slate-200 transition hover:border-slate-500"
          >
            ./view_work
          </Link>
          <div className="flex items-center gap-2 pl-1">
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-ai-border text-ai-muted transition hover:border-slate-500 hover:text-slate-100"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-ai-border text-ai-muted transition hover:border-slate-500 hover:text-slate-100"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease }}
        className="relative min-w-0"
      >
        <motion.div
          style={reduceMotion ? undefined : { y: windowY }}
          className="relative mx-auto h-[min(440px,78svh)] w-full max-w-[520px] sm:h-[min(540px,82svh)] lg:h-[min(620px,82svh)]"
        >
          {/* Rotating halo behind the robot */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="aspect-square w-[75%] animate-[spin_30s_linear_infinite] rounded-full opacity-25 blur-3xl motion-reduce:animate-none"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(52,211,153,0.45), rgba(130,170,255,0.25), transparent 40%, rgba(52,211,153,0.35) 60%, rgba(199,146,234,0.2), rgba(52,211,153,0.45))",
              }}
            />
          </div>
          <Robot3D />
        </motion.div>
      </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export function AboutSection() {
  const stats = [
    { k: "products_built", v: PROJECTS.length },
    { k: "press_features", v: PRESS.length },
    { k: "overseas_programmes", v: JOURNEY.length },
    { k: "certificates", v: CERTIFICATES.length },
  ];

  return (
    <Section id="about" className={sectionClass}>
      <SectionHeader
        index="01"
        name="about"
        title="Blending design, engineering, and coaching."
      />
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start [&>*]:min-w-0">
        <Reveal className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p>
            I&apos;m a Singapore-based technologist who moves comfortably
            between UI/UX design, full-stack web development, and building real
            products like <span className="text-slate-50">SnapRent</span>. With
            roots in Information Technology and entrepreneurship, I focus on
            experiences that feel calm, deliberate, and deeply considered.
          </p>
          <p className="text-ai-muted">
            Outside of tech, I&apos;m a certified swimming coach and lifeguard.
            Those disciplines shaped my mindset around safety, trust, and
            coaching people through meaningful progress.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ai-border bg-ai-border font-mono">
          {stats.map((s, i) => (
            <Reveal key={s.k} delay={i * 0.08} className="bg-ai-panel px-5 py-7">
              <CountUp
                to={s.v}
                className="text-5xl font-semibold tracking-tight text-slate-50 sm:text-6xl"
              />
              <div className="mt-2 text-xs text-ai-muted">{s.k}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function AboutZoomSection() {
  return (
    <PinnedZoom
      alt="SnapRent at the SWITCH showcase"
      aspect={1280 / 853}
      eyebrow="// snaprent @ switch"
      caption="Building real products, in front of real users."
      image={
        <Image
          src="/snaprent-switch.png"
          alt="SnapRent at the SWITCH showcase"
          fill
          sizes="100vw"
          className="object-cover"
        />
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Projects (pinned horizontal gallery)                                */
/* ------------------------------------------------------------------ */

export function ProjectsSection() {
  return (
    <PinnedHorizontal
      id="projects"
      header={
        <SectionHeader
          compact
          index="02"
          name="projects"
          title="Selected work, shaped by real users."
          description="Keep scrolling. Products I've designed, built, and launched."
        />
      }
    >
      {PROJECTS.map((project, index) => (
        <a
          key={project.name}
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="group flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-2xl border border-ai-border bg-ai-panel transition hover:border-ai-accent-soft/50 sm:w-[460px] lg:w-[560px]"
        >
          <div className="flex items-center gap-2 border-b border-ai-border bg-ai-surface px-3 py-2 font-mono text-[0.7rem] text-ai-muted">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 018 0v4" />
            </svg>
            <span className="truncate">{project.url.replace("https://", "")}</span>
          </div>
          <div className="relative h-[clamp(110px,24svh,320px)] w-full overflow-hidden bg-ai-surface">
            <Image
              src={project.image}
              alt={project.name}
              fill
              sizes="(min-width: 1024px) 560px, (min-width: 640px) 460px, 82vw"
              className="object-cover transition duration-700 group-hover:scale-[1.04]"
              priority={index === 0}
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-xl font-semibold text-slate-50">{project.name}</h3>
              <span className="shrink-0 font-mono text-xs text-slate-300 transition group-hover:text-ai-accent-soft">
                visit ↗
              </span>
            </div>
            <p className="font-mono text-xs text-ai-accent-soft">{project.title}</p>
            <p className="line-clamp-3 text-sm leading-relaxed text-ai-muted [@media(max-height:700px)]:line-clamp-2">{project.description}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-ai-border px-2 py-0.5 font-mono text-[0.68rem] text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </a>
      ))}
      <Link
        href="/ask"
        className="group flex w-[70vw] shrink-0 flex-col justify-between rounded-2xl border border-dashed border-ai-border p-6 transition hover:border-ai-accent-soft/60 sm:w-[320px]"
      >
        <span className="font-mono text-xs text-ai-muted">{"// more"}</span>
        <span>
          <span className="block text-2xl font-semibold leading-tight text-slate-50">
            Want the full story behind each build?
          </span>
          <span className="mt-4 inline-flex font-mono text-sm text-ai-accent-soft">
            &gt;_ ask_ai →
          </span>
        </span>
      </Link>
    </PinnedHorizontal>
  );
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export function SkillsSection() {
  return (
    <Section id="skills" className={sectionClass}>
      <SectionHeader
        index="03"
        name="skills"
        title="A toolkit for modern product design and engineering."
      />
      <ScrollScale from={0.9}>
        <WindowFrame
          title="~/ebenezer $ tree skills/"
          bodyClassName="grid gap-px bg-ai-border sm:grid-cols-2 lg:grid-cols-4"
        >
          {SKILLS.map((group) => (
            <div key={group.dir} className="bg-ai-panel p-5 font-mono text-[0.82rem]">
              <div className="mb-3 flex items-center gap-2 text-syn-fn">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" opacity="0.85" />
                </svg>
                {group.dir}/
              </div>
              <ul className="space-y-1.5">
                {group.items.map((skill, i) => (
                  <li key={skill} className="flex gap-2 text-slate-300">
                    <span className="select-none text-slate-600">
                      {i === group.items.length - 1 ? "└─" : "├─"}
                    </span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </WindowFrame>
      </ScrollScale>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Journey (git log)                                                   */
/* ------------------------------------------------------------------ */

export function TimelineSection() {
  const listRef = useRef<HTMLDivElement | null>(null);
  return (
    <Section id="journey" className={sectionClass}>
      <SectionHeader
        index="04"
        name="journey"
        title="Overseas programmes and roles."
        description="Key experiences that shaped how I design, build, and lead."
      />
      <div className="relative" ref={listRef}>
        <div className="absolute bottom-2 left-[7px] top-2 w-px bg-ai-border" />
        <DrawLine
          targetRef={listRef}
          className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-ai-accent-soft"
        />
        <ol className="space-y-8">
          {JOURNEY.map((item, index) => (
            <li key={item.label} className="relative pl-9">
              {/* Dot sits outside the Reveal: its transform would otherwise re-anchor the dot */}
              <span
                className={`absolute left-0 top-[3px] z-10 h-[15px] w-[15px] rounded-full border-2 ${
                  item.current
                    ? "border-ai-accent-soft bg-ai-bg shadow-[0_0_0_4px_rgba(52,211,153,0.15)]"
                    : "border-ai-border bg-ai-bg"
                }`}
              />
              <Reveal delay={index * 0.06}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
                  <span className="text-syn-str">commit {shortHash(item.label)}</span>
                  {item.current && (
                    <span className="rounded border border-ai-accent-soft/40 px-1.5 text-ai-accent-soft">
                      HEAD → now
                    </span>
                  )}
                  <span className="text-ai-muted">{item.date}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-ai-muted">{item.place}</span>
                </div>
                <div className="mt-2 rounded-xl border border-ai-border bg-ai-panel p-5 transition hover:border-slate-600">
                  <h3 className="text-base font-semibold text-slate-50">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ai-muted">
                    {item.detail}
                  </p>
                  <Link
                    href={item.href}
                    className="-my-1 mt-2 inline-flex min-h-[36px] items-center font-mono text-xs text-ai-accent-soft hover:underline"
                  >
                    view photos →
                  </Link>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Awards & press                                                      */
/* ------------------------------------------------------------------ */

export function AchievementsSection() {
  return (
    <Section id="awards" className={sectionClass}>
      <SectionHeader
        index="05"
        name="awards"
        title="Press, awards, and recognition."
      />
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <Reveal>
          <h3 className="mb-4 font-mono text-xs text-ai-muted">
            <span className="text-syn-kw">import</span> press{" "}
            <span className="text-syn-kw">from</span>{" "}
            <span className="text-syn-str">&quot;./media&quot;</span>
          </h3>
          <ul className="divide-y divide-ai-border overflow-hidden rounded-xl border border-ai-border bg-ai-panel">
            {PRESS.map((item) => (
              <li key={item.title}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 px-4 py-4 transition hover:bg-white/[0.02]"
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-ai-border bg-white/[0.03]">
                    <Image
                      src={item.logo}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-100">
                      {item.title}
                    </div>
                    <div className="text-xs text-ai-muted sm:truncate">
                      {item.detail}
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-slate-500 transition group-hover:text-ai-accent-soft">
                    read ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <h3 className="mb-4 font-mono text-xs text-ai-muted">
            <span className="text-syn-kw">import</span> awards{" "}
            <span className="text-syn-kw">from</span>{" "}
            <span className="text-syn-str">&quot;./wins&quot;</span>
          </h3>
          <ul className="space-y-3">
            {AWARDS.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-xl border border-ai-border bg-ai-panel p-4"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-ai-border bg-white/[0.03]">
                  <Image
                    src={item.title.startsWith("SWITCH") ? "/switch.png" : "/sp.png"}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium text-slate-100">
                      {item.title}
                    </div>
                    <span className="shrink-0 font-mono text-[0.7rem] text-syn-num">
                      {item.year}
                    </span>
                  </div>
                  <div className="text-xs text-ai-muted">{item.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Certificates                                                        */
/* ------------------------------------------------------------------ */

export function CertificatesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { setOverlayOpen } = useOverlay();
  const activeCert = activeIndex !== null ? CERTIFICATES[activeIndex] : null;

  const close = () => {
    setActiveIndex(null);
    setOverlayOpen(false);
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <>
      <PinnedHorizontal
        id="certificates"
        header={
          <SectionHeader
            compact
            index="06"
            name="certificates"
            title="Certificates & scholarships."
            description="Keep scrolling. Click any certificate to view it full size."
          />
        }
      >
        {CERTIFICATES.map((item, index) => (
          <button
            type="button"
            key={item.title}
            onClick={() => {
              setActiveIndex(index);
              setOverlayOpen(true);
            }}
            className="group flex w-[70vw] shrink-0 flex-col overflow-hidden rounded-2xl border border-ai-border bg-ai-panel text-left outline-none transition hover:border-ai-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ai-accent-soft/60 sm:w-[300px]"
          >
            <div className="relative h-[clamp(140px,34svh,320px)] w-full bg-ai-surface">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="300px"
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="border-t border-ai-border px-4 py-3 font-mono text-[0.75rem] text-slate-300">
              {item.title}
            </div>
          </button>
        ))}
      </PinnedHorizontal>

      <AnimatePresence>
        {activeCert && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="w-full max-w-3xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <WindowFrame title={activeCert.title}>
                <div className="relative h-[75vh] w-full bg-ai-bg">
                  <Image
                    src={activeCert.image}
                    alt={activeCert.title}
                    fill
                    sizes="(min-width: 1024px) 900px, 100vw"
                    className="object-contain"
                    priority
                  />
                  <button
                    type="button"
                    onClick={close}
                    className="absolute right-3 top-3 rounded-md border border-ai-border bg-ai-surface px-2.5 py-1 font-mono text-xs text-slate-200 hover:border-slate-500"
                  >
                    esc
                  </button>
                </div>
              </WindowFrame>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export function ContactSection() {
  const rows = [
    { key: "linkedin", value: "in/ebenezer-tay", href: LINKS.linkedin, external: true },
    { key: "instagram", value: "@ee.ebenezer", href: LINKS.instagram, external: true },
    { key: "resume", value: "resume.pdf", href: LINKS.resume, external: false },
    { key: "ask_ai", value: "chat with my AI twin", href: "/ask", external: false },
  ];

  return (
    <Section id="contact" className={sectionClass}>
      <ScrollScale from={0.8} className="mb-10 text-center sm:mb-16">
        <div className="font-mono text-xs text-ai-accent-soft">07. contact</div>
        <h2 className="mt-5 bg-gradient-to-b from-white to-slate-500 bg-clip-text pb-2 text-5xl font-semibold leading-[1.02] tracking-tight text-transparent sm:text-7xl lg:text-8xl">
          Let&apos;s build something together.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-ai-muted sm:text-lg">
          Open to collaborations, internships, and interesting problems. The
          fastest way to reach me is LinkedIn.
        </p>
      </ScrollScale>
      <Reveal>
        <WindowFrame
          title="bash — contact"
          className="mx-auto max-w-3xl"
          bodyClassName="p-5 font-mono text-[0.85rem] leading-7"
        >
          <div>
            <span className="text-ai-accent-soft">ebenezer@portfolio</span>
            <span className="text-slate-500">:</span>
            <span className="text-syn-fn">~</span>
            <span className="text-slate-500">$</span> cat contact.json
          </div>
          <div className="text-slate-400">{"{"}</div>
          {rows.map((row, i) => (
            <div key={row.key} className="pl-5">
              <span className="text-syn-prop">&quot;{row.key}&quot;</span>
              <span className="text-slate-400">: </span>
              {row.external ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-1.5 text-syn-str underline-offset-4 hover:underline"
                >
                  &quot;{row.value}&quot;
                </a>
              ) : row.key === "resume" ? (
                <a
                  href={row.href}
                  download
                  className="inline-block py-1.5 text-syn-str underline-offset-4 hover:underline"
                >
                  &quot;{row.value}&quot;
                </a>
              ) : (
                <Link
                  href={row.href}
                  className="inline-block py-1.5 text-syn-str underline-offset-4 hover:underline"
                >
                  &quot;{row.value}&quot;
                </Link>
              )}
              {i < rows.length - 1 && <span className="text-slate-400">,</span>}
            </div>
          ))}
          <div className="text-slate-400">{"}"}</div>
          <div>
            <span className="text-ai-accent-soft">ebenezer@portfolio</span>
            <span className="text-slate-500">:</span>
            <span className="text-syn-fn">~</span>
            <span className="text-slate-500">$</span>{" "}
            <span className="inline-block h-4 w-2 translate-y-[3px] animate-blink bg-slate-300" />
          </div>
        </WindowFrame>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-ai-border bg-ai-panel/80">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 font-mono text-[0.7rem] text-ai-muted sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <circle cx="6" cy="6" r="2" />
              <circle cx="6" cy="18" r="2" />
              <circle cx="18" cy="8" r="2" />
              <path d="M6 8v8M18 10c0 4-6 3-12 6" />
            </svg>
            main
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ai-accent-soft" />
            all systems normal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Next.js · TypeScript · Tailwind</span>
          <span>© {new Date().getFullYear()} Ebenezer Tay</span>
        </div>
      </div>
    </footer>
  );
}
