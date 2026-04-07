type ExamLogoBadgeProps = {
  provider: string;
  certificationCode: string;
  size?: "sm" | "md";
};

const providerToneClasses: Record<string, string> = {
  AWS:
    "border-amber-300/20 bg-[linear-gradient(145deg,rgba(251,191,36,0.2),rgba(251,146,60,0.14))]",
  Azure:
    "border-sky-300/20 bg-[linear-gradient(145deg,rgba(56,189,248,0.18),rgba(59,130,246,0.14))]",
  "Google Cloud":
    "border-emerald-300/20 bg-[linear-gradient(145deg,rgba(74,222,128,0.16),rgba(59,130,246,0.12))]",
};

const sizeClasses = {
  sm: "h-12 w-12 rounded-[18px]",
  md: "h-14 w-14 rounded-[20px]",
} as const;

export function ExamLogoBadge({
  provider,
  certificationCode,
  size = "md",
}: Readonly<ExamLogoBadgeProps>) {
  const displayCode = certificationCode.replace(/[^A-Z0-9]/gi, "").slice(0, 6);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border shadow-subtle ${
        providerToneClasses[provider] ??
        "border-primary/20 bg-[linear-gradient(145deg,rgba(91,140,255,0.2),rgba(32,211,194,0.12))]"
      } ${sizeClasses[size]}`}
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(248,250,252,0.16),transparent_58%)]" />
      <span className="absolute inset-px rounded-[inherit] border border-white/10" />
      <span className="relative text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-text-primary">
        {displayCode}
      </span>
    </div>
  );
}
