type Props = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

export function Field({ label, hint, children }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-cream">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-faint">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-surface-2 px-3.5 py-3 text-[15px] text-cream placeholder:text-faint focus:border-flame focus:outline-none";

export function Alert({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  const styles =
    tone === "error"
      ? "border-score-low/40 bg-score-low/10 text-score-low"
      : "border-score-high/40 bg-score-high/10 text-score-high";
  return (
    <p className={`animate-pop rounded-xl border px-3.5 py-2.5 text-sm ${styles}`}>{children}</p>
  );
}

export function SubmitButton({
  pending,
  children,
  label = "Salvando...",
}: {
  pending: boolean;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-flame py-3.5 font-bold text-ink transition active:scale-[0.98] disabled:bg-surface-2 disabled:text-faint"
    >
      {pending ? label : children}
    </button>
  );
}
