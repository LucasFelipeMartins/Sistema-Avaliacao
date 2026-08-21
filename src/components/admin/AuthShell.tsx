import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Monogram } from "@/components/Monogram";

type Props = {
  title: string;
  subtitle: string;
  storeName?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/** Moldura das telas de acesso (login, esqueci a senha, nova senha). */
export function AuthShell({ title, subtitle, storeName, children, footer }: Props) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          {storeName ? (
            <Monogram name={storeName} className="mx-auto h-14 w-14 text-xl" />
          ) : (
            <Icon name="burger" className="mx-auto h-10 w-10 text-flame" strokeWidth={1.5} />
          )}
          {storeName && (
            <p className="mt-3 text-xs font-semibold tracking-widest text-flame uppercase">
              {storeName}
            </p>
          )}
          <h1 className="display mt-1 text-3xl text-cream">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>

        <div className="card rounded-2xl p-5">{children}</div>

        <div className="mt-5 text-center text-xs text-faint">
          {footer}
          <p className="mt-3">
            <Link href="/" className="underline-offset-4 hover:underline">
              Voltar ao cardápio
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
