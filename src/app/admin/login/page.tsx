import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redefinida?: string }>;
}) {
  if (await getSession()) redirect("/admin");

  const [store, params] = await Promise.all([getStore(), searchParams]);
  return <LoginForm storeName={store?.name} justReset={params.redefinida === "1"} />;
}
