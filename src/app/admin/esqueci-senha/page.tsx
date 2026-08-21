import { getStore } from "@/lib/store";
import { ForgotForm } from "./ForgotForm";

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage() {
  const store = await getStore();
  return <ForgotForm storeName={store?.name} />;
}
