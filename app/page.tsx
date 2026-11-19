import dynamic from "next/dynamic";
import {
  HeroSection,
  StatementSection,
  AboutSection,
  AboutZoomSection,
  ProjectsSection,
  SkillsSection,
  TimelineSection,
  AchievementsSection,
  ContactSection,
  SiteFooter,
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
    <div className="relative">
      <HeroSection />
      <StatementSection />
      <AboutSection />
      <AboutZoomSection />
      <ProjectsSection />
      <SkillsSection />
      <TimelineSection />
      <AchievementsSection />
      <DynamicCertificates />
      <ContactSection />
      <SiteFooter />
    </div>
  );
}
