import Link from "next/link";

import { SectionHeading } from "../../../components/section-heading";

type PlatformUtilityPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  actionHref: string;
  actionLabel: string;
};

export function PlatformUtilityPage({
  eyebrow,
  title,
  description,
  bullets,
  actionHref,
  actionLabel,
}: Readonly<PlatformUtilityPageProps>) {
  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="grid gap-4">
            {bullets.map((bullet) => (
              <article
                key={bullet}
                className="rounded-[26px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
              >
                <p className="text-sm leading-7 text-text-secondary">
                  {bullet}
                </p>
              </article>
            ))}
          </div>

          <Link
            href={actionHref}
            className="ph-btn ph-button-primary ph-hover-lift w-full lg:w-auto"
          >
            {actionLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
