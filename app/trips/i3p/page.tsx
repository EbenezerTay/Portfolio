import Image from "next/image";
import { SectionShell } from "@/components/SectionShell";

export default function I3PTripPage() {
  return (
    <div className="min-h-screen bg-ai-bg pb-16 pt-24">
      <SectionShell className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 lg:flex-row lg:px-16">
        <div className="space-y-4 lg:w-2/5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ai-accent-soft">
            Trip
          </p>
          <h1 className="text-lg font-semibold tracking-tight text-slate-50">
            NUS Innovation x Impact Immersion Programme I3P
          </h1>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Dec 2024 · Ho Chi Minh City, Vietnam
          </p>
          <p className="text-sm leading-relaxed text-slate-300/90">
            A 7 day 6 night innovation immersion where I represented Singapore
            Polytechnic, explored the Vietnamese startup ecosystem with
            SnapRent, and gained cross‑border entrepreneurship exposure
            alongside NUS Overseas Colleges.
          </p>
        </div>
        <div className="relative lg:w-3/5">
          <div className="flex h-80 w-full gap-2">
            {[
              { src: "/viet3.png", alt: "I3P trip photo 1" },
              { src: "/viet2.png", alt: "I3P trip photo 2" },
              { src: "/viet1.png", alt: "I3P trip photo 3" },
            ].map((img) => (
              <div
                key={img.src}
                className="relative min-w-0 flex-1 cursor-pointer overflow-hidden rounded-2xl border border-ai-border/70 bg-ai-surface/80 shadow-ai-soft transition-[flex] duration-300 ease-out hover:z-10 hover:flex-[2.5]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="object-contain object-center"
                  priority
                />
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
    </div>
  );
}

