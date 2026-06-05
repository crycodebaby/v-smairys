import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { FilterSection } from '@/components/sections/FilterSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { SocialProofSection } from '@/components/socialproof/SocialProofSection';
import { ContactFormSection } from '@/components/contact/ContactFormSection';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex w-full flex-col">
        <Hero />
        <SocialProofSection />
        <TeamSection />
        <FilterSection />
        <ServicesSection />
        <TrustSection />
        <ProcessSection />
        <ContactFormSection
          pageType="homepage_invert_cta"
          contactLocation="homepage"
        />
      </main>
    </>
  );
}
