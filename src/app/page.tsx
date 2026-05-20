import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { FilterSection } from '@/components/sections/FilterSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { CtaSection } from '@/components/sections/CtaSection';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col w-full">
        <Hero />
        <FilterSection />
        <ServicesSection />
        <TrustSection />
        <ProcessSection />
        <CtaSection />
      </main>
      {/* Footer kommt in einem späteren Modul */}
    </>
  );
}
