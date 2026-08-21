/** Iniciais do estabelecimento — substitui o logo enquanto o dono não sobe o dele. */
export function Monogram({ name, className = "h-12 w-12 text-xl" }: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter((word) => word.length > 2 || /^[A-Za-zÀ-ÿ]/.test(word))
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span
      aria-hidden="true"
      className={`display flex items-center justify-center rounded-2xl bg-linear-to-br from-flame to-char text-ink ${className}`}
    >
      {initials || "?"}
    </span>
  );
}
