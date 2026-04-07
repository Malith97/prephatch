import Link from "next/link";

import type { ExamWorkspaceMock } from "../mock-exam-workspace";
import { ExamSectionHeading } from "./exam-section-heading";

type ExamMockListProps = {
  mocks: ExamWorkspaceMock[];
};

export function ExamMockList({ mocks }: Readonly<ExamMockListProps>) {
  return (
    <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
      <ExamSectionHeading
        eyebrow="Mock exam list"
        title="Choose where to start, continue, or stage the next attempt."
      />

      <div className="mt-6 grid gap-4">
        {mocks.map((mock) => (
          <article
            key={mock.id}
            className="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-5 transition duration-200 hover:border-slate-300 hover:bg-white"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-950">
                  {mock.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{mock.note}</p>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                {mock.access}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Mode
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {mock.mode}
                </p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Status
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {mock.status}
                </p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Questions
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {mock.questions}
                </p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Duration
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {mock.duration}
                </p>
              </div>
            </div>

            <Link
              href={mock.href}
              className="mt-5 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,23,42,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
            >
              {mock.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
