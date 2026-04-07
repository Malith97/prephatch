import Link from "next/link";

type BrandMarkProps = {
  inverted?: boolean;
};

export function BrandMark({ inverted = false }: BrandMarkProps) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 rounded-full pr-1 transition duration-200 ease-premium hover:opacity-100"
    >
      <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[18px] border border-border/70 bg-surface-elevated shadow-glow">
        <span className="absolute inset-0 bg-aurora opacity-80" />
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(248,250,252,0.18),transparent_60%)]" />
        <span className="absolute inset-px rounded-[17px] border border-white/10" />
        <span className="relative text-[0.78rem] font-semibold tracking-[0.22em] text-text-primary">
          PH
        </span>
      </span>
      <span className="flex flex-col">
        <span
          className={`text-sm font-semibold ${
            inverted ? "text-text-primary" : "text-text-primary"
          }`}
        >
          PrepHatch
        </span>
        <span
          className={`text-xs ${
            inverted ? "text-text-secondary" : "text-text-secondary/80"
          }`}
        >
          Certification readiness
        </span>
      </span>
    </Link>
  );
}
