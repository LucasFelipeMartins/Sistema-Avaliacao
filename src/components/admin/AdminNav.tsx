"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";

const LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Resumo", icon: "dashboard" },
  { href: "/admin/lanches", label: "Lanches", icon: "burger" },
  { href: "/admin/categorias", label: "Categorias", icon: "folder" },
  { href: "/admin/avaliacoes", label: "Avaliações", icon: "star" },
  { href: "/admin/qrcode", label: "QR Code", icon: "qr" },
  { href: "/admin/configuracoes", label: "Configurações", icon: "settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap transition ${
              active
                ? "border-flame bg-flame text-ink"
                : "border-line bg-surface text-muted hover:border-flame/50"
            }`}
          >
            <Icon name={link.icon} className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
