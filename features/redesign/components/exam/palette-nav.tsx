"use client";

export function PaletteNav({
  total,
  current,
  onJump,
}: {
  total: number;
  current: number;
  onJump?: (index: number) => void;
}) {
  return (
    <nav className="phx-card" aria-label="Question palette">
      <h2 className="phx-heading-sm mb-3">Palette</h2>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-6">
        {Array.from({ length: total }).map((_, index) => {
          const number = index + 1;
          const active = number === current;
          return (
            <button
              key={number}
              type="button"
              className={`phx-palette-item ${active ? "phx-palette-item-active" : ""}`.trim()}
              aria-current={active ? "step" : undefined}
              aria-label={`Go to question ${number}`}
              onClick={() => onJump?.(number)}
            >
              {number}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
