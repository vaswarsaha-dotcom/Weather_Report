// app/page.tsx
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}