import Link from "next/link";

type BrandMarkProps = {
  inverted?: boolean;
};

export function BrandMark({ inverted = false }: BrandMarkProps) {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.7),transparent_55%)]" />
        <span className="absolute inset-px rounded-2xl border border-white/20" />
        <span className="relative text-sm font-semibold tracking-[0.18em] text-white">
          PH
        </span>
      </span>
      <span className="flex flex-col">
        <span
          className={`text-sm font-semibold ${
            inverted ? "text-white" : "text-slate-950"
          }`}
        >
          PrepHatch
        </span>
        <span
          className={`text-xs ${inverted ? "text-slate-300" : "text-slate-500"}`}
        >
          Certification readiness
        </span>
      </span>
    </Link>
  );
}
