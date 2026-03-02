import dynamic from "next/dynamic";
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  SkillsSection,
  TimelineSection,
  AchievementsSection,
  CertificatesSection,
} from "@/components/sections";

const DynamicCertificates = dynamic(
  () =>
    import("@/components/sections").then((mod) => mod.CertificatesSection),
  {
    ssr: false,
  },
);

export default function Home() {
  return (
    <div className="relative space-y-2 pb-8 pt-4 sm:space-y-4 sm:pb-12 sm:pt-10">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <TimelineSection />
      <AchievementsSection />
      <DynamicCertificates />
      <footer className="mt-6 px-6 pt-4 text-center text-[0.7rem] text-slate-400">
        © 2026 Ebenezer. All Rights Reserved.
      </footer>
    </div>
  );
}
