import Image from "next/image";
import { SectionShell } from "@/components/SectionShell";

export default function OsipTripPage() {
  return (
    <div className="min-h-screen bg-ai-bg pb-16 pt-24">
      <SectionShell className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 lg:flex-row lg:px-16">
        <div className="space-y-4 lg:w-2/5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ai-accent-soft">
            Trip
          </p>
          <h1 className="text-lg font-semibold tracking-tight text-slate-50">
            Overseas Sustainable Innovation Programme OSIP
          </h1>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Sept 2025 · Binh Duong, Vietnam
          </p>
          <p className="text-sm leading-relaxed text-slate-300/90">
            A 12‑day sustainability immersion focused on community‑based
            projects, including improving lacquer crafting processes to better
            support local villagers and address real sustainability challenges.
          </p>
        </div>
        <div className="relative lg:w-3/5">
          <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-ai-border/70 bg-ai-surface/80 shadow-ai-soft">
            <Image
              src="/SWITCH.jpg"
              alt="OSIP trip gallery"
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </SectionShell>
    </div>
  );
}

