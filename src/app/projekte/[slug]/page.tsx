import { notFound } from "next/navigation";
import type { Metadata } from "next";
import React from "react";
import { Header } from "@/components/layout/Header";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { CaseStudyMetrics } from "@/components/case-study/CaseStudyMetrics";
import { CaseStudyNarrative } from "@/components/case-study/CaseStudyNarrative";
import { CaseStudyGallery } from "@/components/case-study/CaseStudyGallery";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { CASE_STUDIES, getCaseStudyBySlug } from "@/config/case-studies";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) {
    return { title: "Case Study nicht gefunden" };
  }
  return {
    title: `${cs.client} · Case Study`,
    description: cs.summary,
    openGraph: {
      images: [cs.hero.src],
    },
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy || caseStudy.status !== "active") {
    notFound();
  }

  return (
    <>
      <Header />
      <CaseStudyHero caseStudy={caseStudy} />

      {caseStudy.metrics && caseStudy.metrics.length > 0 && (
        <CaseStudyMetrics metrics={caseStudy.metrics} />
      )}

      <CaseStudyNarrative caseStudy={caseStudy} />

      {caseStudy.gallery && caseStudy.gallery.length > 0 && (
        <CaseStudyGallery images={caseStudy.gallery} />
      )}

      <ContactFormSection
        pageType={`case_study_${caseStudy.slug}`}
        contactLocation="kontakt"
        kicker="Ihr Projekt"
        title="Ein ähnliches Vorhaben? Lassen Sie uns reden."
        description="Wir prüfen, ob Ihr Projekt zu unserem Profil passt – ohne Verkaufsdruck, mit konkreter Ersteinschätzung."
        withStandards={false}
        withAvailabilityNote={false}
      />
    </>
  );
}
