import Image from "next/image";
import Link from "next/link";
import { getMenu } from "@/lib/menu";
import { getStore } from "@/lib/store";
import { Icon } from "@/components/Icon";
import { MenuClient } from "@/components/MenuClient";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [store, menu] = await Promise.all([getStore(), getMenu()]);

  if (!store) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
        <Icon name="burger" className="h-10 w-10 text-flame" strokeWidth={1.5} />
        <h1 className="display mt-4 text-2xl text-cream">Instalação não configurada</h1>
        <p className="mt-2 text-sm text-muted">
          Rode <code className="rounded bg-surface-2 px-1.5 py-0.5 text-flame">npm run db:seed</code>{" "}
          para criar o estabelecimento e o acesso do painel.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh">
      <header className="mx-auto w-full max-w-lg px-4 pt-8 pb-5 text-center">
        {store.logoUrl ? (
          <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-2xl border border-line">
            <Image src={store.logoUrl} alt={store.name} fill sizes="80px" className="object-cover" />
          </div>
        ) : (
          // marca da casa: mantido de propósito, é o único emoji da interface
          <span className="animate-float mb-2 block text-5xl">🍔</span>
        )}

        <h1 className="display text-4xl text-cream sm:text-5xl">{store.name}</h1>
        <p className="mt-2 text-sm text-muted">{store.tagline}</p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          {store.openingHours && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-muted">
              <Icon name="clock" className="h-3.5 w-3.5" />
              {store.openingHours}
            </span>
          )}
          {store.whatsapp && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-muted">
              <Icon name="phone" className="h-3.5 w-3.5" />
              {store.whatsapp}
            </span>
          )}
        </div>

        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-flame/30 bg-flame/10 px-4 py-2 text-[13px] font-medium text-ember">
          <Icon name="star" filled className="h-4 w-4" />
          As notas são de quem já comeu aqui — avalie você também
        </p>
      </header>

      {menu.length === 0 ? (
        <p className="mx-auto max-w-lg px-4 py-20 text-center text-muted">
          O cardápio ainda está vazio. Cadastre os lanches no painel administrativo.
        </p>
      ) : (
        <MenuClient menu={menu} />
      )}

      <footer className="safe-bottom mx-auto w-full max-w-lg px-4 pb-6 text-center">
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-faint">
          {store.address && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="pin" className="h-3.5 w-3.5" />
              {store.address}
            </span>
          )}
          {store.instagram && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="instagram" className="h-3.5 w-3.5" />
              {store.instagram}
            </span>
          )}
          <span>Cardápio digital</span>
        </p>
        <Link
          href="/admin"
          className="mt-3 inline-block text-[11px] text-faint/70 underline-offset-4 hover:underline"
        >
          Área do estabelecimento
        </Link>
      </footer>
    </main>
  );
}
