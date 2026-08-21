import Link from "next/link";
import { isResetTokenValid } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { AuthShell } from "@/components/admin/AuthShell";
import { ResetForm } from "./ResetForm";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ token }, store] = await Promise.all([searchParams, getStore()]);
  const valid = token ? await isResetTokenValid(token) : false;

  if (!valid) {
    return (
      <AuthShell
        title="Link inválido"
        subtitle="Este link já foi usado ou passou de 1 hora"
        storeName={store?.name}
      >
        <Link
          href="/admin/esqueci-senha"
          className="block w-full rounded-xl bg-flame py-3.5 text-center font-bold text-ink"
        >
          Pedir um novo link
        </Link>
      </AuthShell>
    );
  }

  return <ResetForm token={token!} storeName={store?.name} />;
}
