import Image from "next/image";
import { SectionShell } from "@/components/SectionShell";

export default function OeipTripPage() {
  return (
    <div className="min-h-screen bg-ai-bg pb-16 pt-24">
      <SectionShell className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 lg:flex-row lg:px-16">
        <div className="space-y-4 lg:w-2/5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ai-accent-soft">
            Trip
          </p>
          <h1 className="text-lg font-semibold tracking-tight text-slate-50">
            Overseas Entrepreneurship Immersion Programme OEIP
          </h1>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Apr 2025 · Hangzhou, China
          </p>
          <p className="text-sm leading-relaxed text-slate-300/90">
            A 7 day 6 night entrepreneurship immersion where I explored the
            Hangzhou startup ecosystem, visited companies, and learned how
            founders build, scale, and operate within China&apos;s highly
            competitive market.
          </p>
        </div>
        <div className="relative lg:w-3/5">
          <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-ai-border/70 bg-ai-surface/80 shadow-ai-soft">
            <Image
              src="/switch.png"
              alt="OEIP trip gallery"
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </SectionShell>
    </div>
  );
}

