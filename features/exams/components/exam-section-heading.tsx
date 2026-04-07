type ExamSectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  inverted?: boolean;
};

export function ExamSectionHeading({
  eyebrow,
  title,
  description,
  inverted = false,
}: Readonly<ExamSectionHeadingProps>) {
  return (
    <div className="space-y-2.5">
      <p
        className={`text-sm font-semibold uppercase tracking-[0.18em] ${
          inverted ? "text-sky-200" : "text-sky-700"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`text-2xl font-semibold leading-tight sm:text-[1.9rem] ${
          inverted ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`max-w-3xl text-sm leading-7 ${
            inverted ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
