import dynamic from "next/dynamic";
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  SkillsSection,
  TimelineSection,
  AchievementsSection,
  CertificatesSection,
  TestimonialsSection,
  ContactSection,
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
    <div className="relative space-y-4 pb-12 pt-10">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <TimelineSection />
      <AchievementsSection />
      <DynamicCertificates />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}
