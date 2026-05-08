import Link from "next/link";

type BrandMarkProps = {
  inverted?: boolean;
};

export function BrandMark({ inverted = false }: BrandMarkProps) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3 rounded-xl px-1 py-1 transition duration-200 ease-premium"
      aria-label="PrepHatch home"
    >
      <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-surface-elevated shadow-glow">
        <span className="absolute inset-0 bg-aurora opacity-85" />
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(244,247,251,0.26),transparent_62%)]" />
        <span className="absolute inset-px rounded-[10px] border border-white/10" />
        <span className="relative text-[0.76rem] font-bold tracking-[0.22em] text-text-primary">
          PH
        </span>
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-text-primary">PrepHatch</span>
        <span className={inverted ? "text-xs text-text-secondary" : "text-xs text-text-secondary/80"}>
          Exam Intelligence Suite
        </span>
      </span>
    </Link>
  );
}
