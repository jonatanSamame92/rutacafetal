import type { Metadata } from "next";
import Link from "next/link";
import { CampaignCard } from "@/components/campaign-card";
import { PublicShell } from "@/components/public-shell";
import { getLocations, getPublicCampaigns } from "@/lib/data/campaigns";

export const metadata: Metadata = { title: "Campañas de café", description: "Campañas de cosecha, mantenimiento y postcosecha en Jaén y sus distritos." };

export default async function CampaignsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const value = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
  const filters = { district: value("district"), workType: value("workType"), paymentMode: value("paymentMode"), lodging: value("lodging"), from: value("from") };
  const [campaigns, locations] = await Promise.all([getPublicCampaigns(filters), getLocations()]);

  return (
    <PublicShell>
      <div className="page-shell py-10 sm:py-14">
        <h1 className="text-4xl font-semibold text-[var(--primary-strong)] sm:text-5xl">Campañas de café disponibles</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">Filtra por la zona y las condiciones que necesitas. Los datos marcados como ejemplo no representan ofertas reales.</p>

        <form className="surface mt-8 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-6" aria-label="Filtros de campañas">
          <label><span className="field-label">Distrito</span><select className="select-field" name="district" defaultValue={filters.district}><option value="">Todos</option>{locations.map((location) => <option key={location.id}>{location.district}</option>)}</select></label>
          <label><span className="field-label">Trabajo</span><select className="select-field" name="workType" defaultValue={filters.workType}><option value="">Todos</option><option value="harvest">Cosecha</option><option value="maintenance">Mantenimiento</option><option value="postharvest">Postcosecha</option><option value="mixed">Mixto</option></select></label>
          <label><span className="field-label">Pago</span><select className="select-field" name="paymentMode" defaultValue={filters.paymentMode}><option value="">Cualquier modalidad</option><option value="per_day">Por día</option><option value="per_week">Por semana</option><option value="per_unit">Por arroba</option></select></label>
          <label><span className="field-label">Alojamiento</span><select className="select-field" name="lodging" defaultValue={filters.lodging}><option value="">Indistinto</option><option value="yes">Incluido</option></select></label>
          <label><span className="field-label">Desde la fecha</span><input className="field" type="date" name="from" defaultValue={filters.from} /></label>
          <div className="self-end"><button className="button-primary w-full" type="submit">Aplicar filtros</button></div>
        </form>

        <p className="mt-7 text-sm text-[var(--muted)]" role="status">{campaigns.length} {campaigns.length === 1 ? "campaña encontrada" : "campañas encontradas"}</p>
        {campaigns.length ? (
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}</div>
        ) : (
          <div className="surface mt-4 p-7"><h2 className="text-xl font-semibold">No encontramos campañas con esos filtros</h2><p className="mt-2 text-[var(--muted)]">Prueba con otro distrito o quita una condición para ampliar la búsqueda.</p><Link className="button-secondary mt-5" href="/campanas">Limpiar filtros</Link></div>
        )}
      </div>
    </PublicShell>
  );
}
