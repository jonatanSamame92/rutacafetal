import Link from "next/link";
import { CampaignForm } from "@/components/forms/campaign-form";
import { requireRole } from "@/lib/auth";
import { getLocations } from "@/lib/data/campaigns";

export default async function NewCampaignPage() {
  const { userId, supabase } = await requireRole("farmer");
  const [locations, farmsResult] = await Promise.all([getLocations(), supabase.from("farms").select("*").eq("owner_id", userId).eq("is_active", true).order("name")]);
  const farms = farmsResult.data ?? [];
  return <div className="mx-auto max-w-3xl"><Link href="/panel/patron" className="text-sm font-semibold text-[var(--primary)] underline">Volver a mis campañas</Link><h1 className="mt-5 text-3xl font-semibold sm:text-4xl">Nueva campaña</h1><p className="mt-2 mb-6 text-[var(--muted)]">Completa condiciones, pago y seguridad. El administrador la revisará antes de publicarla.</p>{farms.length ? <CampaignForm farms={farms} locations={locations} /> : <div className="surface p-6"><h2 className="text-xl font-semibold">Primero registra una finca</h2><p className="mt-2 text-[var(--muted)]">Vuelve al panel para crear la ficha reutilizable de tu finca.</p><Link href="/panel/patron" className="button-primary mt-5">Ir a registrar finca</Link></div>}</div>;
}
