"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

const secondary =
  "flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface py-3 text-center font-semibold text-cream";

/** Ações do cartão de mesa: imprimir, baixar e copiar o endereço do cardápio. */
export function QrActions({ url, pngDataUrl }: { url: string; pngDataUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="no-print flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => window.print()}
        className="glow flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-flame py-3 text-center font-bold text-ink transition active:scale-[0.98]"
      >
        <Icon name="printer" className="h-4 w-4" />
        Imprimir
      </button>

      <a href={pngDataUrl} download="qrcode-cardapio.png" className={secondary}>
        <Icon name="download" className="h-4 w-4" />
        Baixar PNG
      </a>

      <button type="button" onClick={copy} className={secondary}>
        <Icon name={copied ? "check" : "link"} className="h-4 w-4" />
        {copied ? "Copiado" : "Copiar link"}
      </button>
    </div>
  );
}
