import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import { getStore } from "@/lib/store";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStore().catch(() => null);
  const name = store?.name ?? "Cardápio Digital";
  return {
    title: `${name} — Cardápio`,
    description: store?.tagline ?? "Cardápio digital com avaliações dos clientes.",
    openGraph: { title: name, description: store?.tagline ?? "" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
