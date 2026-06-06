import React from 'react';
import Image from 'next/image';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Kicker } from '../ui/Kicker';
import { Reveal } from '../motion/Reveal';
import { SITE } from '@/config/site';
import { HOMEPAGE_TRUST } from '@/content/homepage';

const OWNER_PORTRAIT_ALT = `${SITE.owner.name}, Inhaber der ${SITE.legalName}`;

export function TrustSection() {
  const { kicker, headline, paragraphs, stats } = HOMEPAGE_TRUST;

  return (
    <Section className="relative border-y border-border/60 bg-background ambient-glow-amber">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal as="div" className="order-2 flex flex-col gap-8 lg:order-1">
            <div>
              <Kicker accent="brand">{kicker}</Kicker>
              <h2 className="mt-4 text-fluid-h2 font-bold leading-[1.12] tracking-tight text-foreground">
                {headline}
              </h2>
            </div>

            <div className="max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.65]">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-1 gap-6 border-t border-border/40 pt-8 sm:grid-cols-3 sm:gap-8">
              {stats.map((stat) => (
                <Stat key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </Reveal>

          <Reveal as="div" delay={140} className="order-1 lg:order-2">
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(50% 60% at 30% 20%, hsl(var(--brand-glow) / 0.16), transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-card/40">
                <Image
                  src="/ceo-pictures/robin_smairys_portrait.webp"
                  alt={OWNER_PORTRAIT_ALT}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover object-top"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  const textOnly = !value;

  return (
    <div className="relative pl-4">
      <span
        aria-hidden="true"
        className="brand-line-vertical absolute left-0 top-1 bottom-1"
      />
      {textOnly ? (
        <div className="text-sm font-semibold leading-snug text-foreground sm:text-[15px]">
          {label}
        </div>
      ) : (
        <>
          <div className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {value}
          </div>
          <div className="mt-1 text-xs font-medium leading-snug text-muted-foreground sm:text-[13px]">
            {label}
          </div>
        </>
      )}
    </div>
  );
}
