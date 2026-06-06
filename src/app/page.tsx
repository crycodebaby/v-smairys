import type { Metadata } from "next";
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { FilterSection } from '@/components/sections/FilterSection';
import { IndustriesSection } from '@/components/sections/IndustriesSection';
import { MethodSection } from '@/components/sections/MethodSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { SocialProofSection } from '@/components/socialproof/SocialProofSection';
import { ContactFormSection } from '@/components/contact/ContactFormSection';
import {
  HOMEPAGE_CTA,
  HOMEPAGE_FINAL_CTA,
  HOMEPAGE_METADATA,
} from '@/content/homepage';

export const metadata: Metadata = {
  title: HOMEPAGE_METADATA.title,
  description: HOMEPAGE_METADATA.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex w-full flex-col">
        <Hero />
        <SocialProofSection />
        <FilterSection />
        <IndustriesSection />
        <MethodSection />
        <TrustSection />
        <ProcessSection />
        <PricingSection />
        <ContactFormSection
          pageType="homepage_invert_cta"
          contactLocation="homepage"
          kicker={HOMEPAGE_FINAL_CTA.kicker}
          title={HOMEPAGE_FINAL_CTA.headline}
          description={HOMEPAGE_FINAL_CTA.description}
          showBookingCard
          primaryBookingLabel={HOMEPAGE_CTA.primary}
        />
      </main>
    </>
  );
}
