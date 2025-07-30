import { HeroSection } from "@/sections/HeroSection";
import { FeaturesSection } from "@/sections/FeaturesSection";
import { PricingSection } from "@/sections/PricingSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-fuchsia-500 to-cyan-500">
      {/* Hero Section */}
      <HeroSection />
      {/* Features Section */}
      <FeaturesSection />
      {/* Pricing Section */}
      <PricingSection />
    </div>
  );
}
