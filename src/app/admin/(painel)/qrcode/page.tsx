import Link from "next/link";
import QRCode from "qrcode";
import { appUrl, requireStore } from "@/lib/store";
import { Icon } from "@/components/Icon";
import { QrActions } from "@/components/admin/QrActions";

export const dynamic = "force-dynamic";

export default async function QrCodePage() {
  const store = await requireStore();
  const url = (store.publicUrl || appUrl()).replace(/\/$/, "");

  const [svg, png] = await Promise.all([
    QRCode.toString(url, {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#0a0a0b", light: "#ffffff" },
    }),
    QRCode.toDataURL(url, {
      margin: 2,
      width: 1024,
      errorCorrectionLevel: "M",
      color: { dark: "#0a0a0b", light: "#ffffff" },
    }),
  ]);

  return (
    <div className="space-y-5">
      <div className="no-print">
        <h2 className="display text-2xl text-cream">QR Code das mesas</h2>
        <p className="text-sm text-muted">
          Imprima, plastifique e deixe nas mesas. O cliente aponta a câmera e o cardápio abre.
        </p>
      </div>

      <div className="print-card mx-auto w-full max-w-xs rounded-3xl border border-line bg-white p-6 text-center text-black">
        <p className="text-[11px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
          Cardápio digital
        </p>
        <p className="mt-1 text-2xl leading-tight font-black uppercase">{store.name}</p>

        <div
          className="mx-auto mt-4 w-full [&>svg]:h-auto [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />

        <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-bold">
          <Icon name="camera" className="h-4 w-4" />
          Aponte a câmera e veja o cardápio
        </p>
        <p className="mt-1 text-xs text-neutral-600">
          Com as notas de quem já provou — e avalie o seu também
        </p>
        <p className="mt-3 border-t border-neutral-200 pt-2 text-[10px] break-all text-neutral-400">
          {url}
        </p>
      </div>

      <QrActions url={url} pngDataUrl={png} />

      <div className="no-print card rounded-2xl p-4 text-sm text-muted">
        <p className="mb-1 font-semibold text-cream">O QR Code aponta para:</p>
        <p className="break-all text-flame">{url}</p>
        <p className="mt-3 text-xs">
          Está apontando para <code className="text-cream">localhost</code>? Só funciona no seu
          computador. Coloque o endereço público do sistema em{" "}
          <Link href="/admin/configuracoes" className="text-flame underline underline-offset-4">
            Configurações → Endereço do cardápio
          </Link>{" "}
          e gere o QR de novo.
        </p>
      </div>
    </div>
  );
}
