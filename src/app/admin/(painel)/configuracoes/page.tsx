import { requireStore } from "@/lib/store";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { StoreForm } from "@/components/admin/StoreForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const store = await requireStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="display text-2xl text-cream">Configurações</h2>
        <p className="text-sm text-muted">Dados que aparecem no cardápio e acesso ao painel.</p>
      </div>

      <StoreForm
        store={{
          name: store.name,
          tagline: store.tagline,
          logoUrl: store.logoUrl,
          whatsapp: store.whatsapp,
          instagram: store.instagram,
          address: store.address,
          openingHours: store.openingHours,
          publicUrl: store.publicUrl,
          adminEmail: store.adminEmail,
        }}
      />

      <PasswordForm />
    </div>
  );
}
