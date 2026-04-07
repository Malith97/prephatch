import Link from "next/link";

import type { ExamCatalogItem } from "../mock-exam-catalog";

type ExamCardProps = {
  exam: ExamCatalogItem;
};

const ownershipToneClasses = {
  owned: "border-emerald-200 bg-emerald-50 text-emerald-700",
  active: "border-sky-200 bg-sky-50 text-sky-800",
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
  comingSoon: "border-amber-200 bg-amber-50 text-amber-700",
} as const;

export function ExamCard({ exam }: ExamCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]">
      <div className="flex h-full flex-col space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
            {exam.provider}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {exam.category}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${ownershipToneClasses[exam.ownershipTone]}`}
          >
            {exam.ownershipLabel}
          </span>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            {exam.certificationCode}
          </p>
          <h2 className="text-2xl font-semibold text-slate-950">{exam.title}</h2>
          <p className="text-sm leading-7 text-slate-600">{exam.description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200/80 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Price
            </p>
            <p className="mt-2 text-base font-semibold text-slate-950">
              {exam.priceLabel}
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200/80 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Progress
            </p>
            <p className="mt-2 text-base font-semibold text-slate-950">
              {exam.progressLabel}
            </p>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200/80 bg-white/90 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            State detail
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {exam.progressDetail}
          </p>
        </div>

        <Link
          href={exam.detailCtaHref}
          className="mt-auto inline-flex w-fit rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(15,23,42,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
        >
          View exam details
        </Link>
      </div>
    </article>
  );
}
