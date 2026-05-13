import { LandingNav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import {
  TrustStrip,
  HowItWorks,
  SampleReport,
  ForWho,
  Pricing,
  FAQ,
  FinalCTA,
  Footer,
} from "@/components/landing/Sections";

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main>
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <SampleReport />
        <ForWho />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
