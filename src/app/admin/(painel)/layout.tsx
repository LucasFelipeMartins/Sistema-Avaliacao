import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { requireSession } from "@/lib/auth";
import { requireStore } from "@/lib/store";
import { Icon } from "@/components/Icon";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await requireSession();
  const store = await requireStore();

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line/60 bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-widest text-flame uppercase">
                Painel do dono
              </p>
              <h1 className="display truncate text-2xl text-cream">{store.name}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted"
              >
                <Icon name="external" className="h-3.5 w-3.5" />
                Ver cardápio
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted hover:border-score-low/50 hover:text-score-low"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
          <AdminNav />
        </div>
      </header>

      <main className="safe-bottom mx-auto w-full max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
