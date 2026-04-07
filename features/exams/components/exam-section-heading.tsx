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
      <p className={inverted ? "ph-eyebrow-inverse" : "ph-eyebrow"}>
        {eyebrow}
      </p>
      <h2 className="ph-section-title">
        {title}
      </h2>
      {description ? (
        <p
          className={`max-w-3xl text-sm leading-7 ${
            inverted ? "text-text-secondary/90" : "text-text-secondary"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
