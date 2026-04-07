import type { TopicMasteryDatum } from "../exam-dashboard-utils";

type TopicMasteryChartProps = {
  data: TopicMasteryDatum[];
};

export function TopicMasteryChart({ data }: Readonly<TopicMasteryChartProps>) {
  return (
    <section className="ph-surface rounded-[34px] p-6 sm:p-8">
      <p className="ph-eyebrow">
        Topic mastery
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-text-primary">
        Strength by topic cluster
      </h2>

      <div className="mt-6 space-y-5">
        {data.map((topic) => (
          <article key={topic.label} className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-text-primary">
                {topic.label}
              </h3>
              <span className="ph-badge ph-badge-primary">
                {topic.score}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border/70">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(91,140,255,1),rgba(32,211,194,0.95))]"
                style={{ width: `${Math.max(topic.score, 12)}%` }}
              />
            </div>
            <p className="text-sm leading-7 text-text-secondary">
              {topic.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
