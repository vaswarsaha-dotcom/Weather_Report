// app/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        <HeroSection />
        <FeaturesSection />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
