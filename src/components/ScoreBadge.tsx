import { formatRating, ratingTone } from "@/lib/format";
import { Icon } from "@/components/Icon";

const TONE_CLASS = {
  high: "text-score-high border-score-high/30 bg-score-high/10",
  mid: "text-score-mid border-score-mid/30 bg-score-mid/10",
  low: "text-score-low border-score-low/30 bg-score-low/10",
} as const;

type Props = {
  average: number | null;
  count: number;
  size?: "sm" | "lg";
};

/** Nota média do lanche (0 a 10). Sem avaliações ainda, mostra "Novo". */
export function ScoreBadge({ average, count, size = "sm" }: Props) {
  const big = size === "lg";

  if (average === null || count === 0) {
    return (
      <span
        className={`inline-flex shrink-0 items-center rounded-full border border-line bg-surface-2 font-semibold tracking-wide text-muted uppercase ${
          big ? "px-3 py-1.5 text-xs" : "px-2 py-1 text-[10px]"
        }`}
      >
        Novo
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border font-bold tabular-nums ${
        TONE_CLASS[ratingTone(average)]
      } ${big ? "px-3.5 py-1.5 text-base" : "px-2 py-1 text-xs"}`}
      title={`${count} ${count === 1 ? "avaliação" : "avaliações"}`}
    >
      <Icon name="star" filled className={big ? "h-4 w-4" : "h-3 w-3"} />
      {formatRating(average)}
      <span className={`font-medium text-muted ${big ? "text-sm" : "text-[10px]"}`}>({count})</span>
    </span>
  );
}
