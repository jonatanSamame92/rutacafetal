import Link from "next/link";
import { FarmForm } from "@/components/forms/farm-form";
import { FarmerProfileForm } from "@/components/forms/farmer-profile-form";
import { requireRole } from "@/lib/auth";
import { getLocations } from "@/lib/data/campaigns";
import { campaignStatusLabels, formatDate, formatMoney } from "@/lib/format";
import type { CampaignStatus, PaymentMode } from "@/lib/types/database";

type CampaignItem = { id: string; title: string; status: CampaignStatus; start_date: string; payment_amount: number; payment_mode: PaymentMode; farms: { name: string } | null; applications: { count: number }[] };

export default async function FarmerPanelPage() {
  const { userId, profile, supabase } = await requireRole("farmer");
  const [locations, farmsResult, campaignsResult] = await Promise.all([
    getLocations(),
    supabase.from("farms").select("*").eq("owner_id", userId).order("created_at"),
    supabase.from("campaigns").select("id, title, status, start_date, payment_amount, payment_mode, farms!inner(name, owner_id), applications(count)").eq("farms.owner_id", userId).order("created_at", { ascending: false }),
  ]);
  const farms = farmsResult.data ?? [];
  const campaigns = (campaignsResult.data ?? []) as unknown as CampaignItem[];
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Panel del patrón</p><h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Organiza tus campañas</h1><p className="mt-2 max-w-2xl text-[var(--muted)]">Publica condiciones claras y revisa postulantes sin exponer celulares.</p></div>{farms.length ? <Link href="/panel/patron/campanas/nueva" className="button-primary">Crear campaña</Link> : null}</header>
      <section><h2 className="text-2xl font-semibold">Campañas</h2><div className="mt-4 grid gap-3">{campaigns.length ? campaigns.map((campaign) => <Link href={`/panel/patron/campanas/${campaign.id}`} key={campaign.id} className="surface block p-5 transition-[border-color,transform] duration-150 hover:border-[var(--primary)] active:scale-[0.99]"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-semibold text-[var(--primary)]">{campaignStatusLabels[campaign.status]}</span><span className="text-sm text-[var(--muted)]">{campaign.applications?.[0]?.count ?? 0} postulaciones</span></div><h3 className="mt-2 text-xl font-semibold">{campaign.title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{campaign.farms?.name} · {formatDate(campaign.start_date)} · {formatMoney(Number(campaign.payment_amount))}</p></Link>) : <div className="surface p-6"><h3 className="font-semibold">Aún no tienes campañas</h3><p className="mt-2 text-sm text-[var(--muted)]">Primero registra una finca y luego crea la oferta de trabajo.</p></div>}</div></section>
      <div className="grid gap-6 xl:grid-cols-2"><FarmerProfileForm profile={profile} locations={locations} />{farms.length ? <section className="surface p-5 sm:p-6"><h2 className="text-xl font-semibold">Tus fincas</h2><div className="mt-4 grid gap-3">{farms.map((farm) => <article className="rounded-lg border border-[var(--border)] p-4" key={farm.id}><h3 className="font-semibold">{farm.name}</h3><p className="mt-1 text-sm text-[var(--muted)]">{farm.location_reference}</p></article>)}</div></section> : <FarmForm locations={locations} />}</div>
      {farms.length ? <FarmForm locations={locations} /> : null}
    </div>
  );
}
