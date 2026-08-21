"use client";

const LABELS: Record<number, string> = {
  0: "Não gostei",
  1: "Ruim",
  2: "Ruim",
  3: "Fraco",
  4: "Fraco",
  5: "Mediano",
  6: "Ok",
  7: "Bom",
  8: "Muito bom",
  9: "Excelente",
  10: "Perfeito",
};

type Props = {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
};

/** Seletor de nota de 0 a 10 — pensado para o polegar, em uma linha só. */
export function RatingPicker({ value, onChange, disabled }: Props) {
  return (
    <div>
      <div className="mb-3 flex h-8 items-center justify-center gap-2.5">
        {value === null ? (
          <span className="text-sm text-faint">Toque em uma nota de 0 a 10</span>
        ) : (
          <span key={value} className="animate-pop flex items-baseline gap-2.5">
            <span className="display text-2xl text-flame">{value}</span>
            <span className="font-semibold text-cream">{LABELS[value]}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-11 gap-1">
        {Array.from({ length: 11 }, (_, note) => {
          const selected = value === note;
          return (
            <button
              key={note}
              type="button"
              disabled={disabled}
              onClick={() => onChange(note)}
              aria-label={`Nota ${note}`}
              aria-pressed={selected}
              className={`flex aspect-square items-center justify-center rounded-lg text-sm font-bold tabular-nums transition-all duration-150 disabled:opacity-40 ${
                selected
                  ? "glow scale-110 bg-flame text-ink"
                  : "border border-line bg-surface-2 text-muted active:scale-95 active:bg-surface"
              }`}
            >
              {note}
            </button>
          );
        })}
      </div>
    </div>
  );
}
