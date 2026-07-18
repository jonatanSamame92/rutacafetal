import type { Metadata } from "next";
import { CampaignCard } from "@/components/campaign-card";
import { SiteHeader } from "@/components/site-header";
import { campaigns } from "@/lib/campaigns";

export const metadata: Metadata = { title: "Campañas disponibles" };

export default function CampaignsPage() {
  return <><SiteHeader /><main className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><p className="text-sm font-semibold tracking-wide text-[#74502d]">MERCADO DE TRABAJO</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#173624]">Campañas de café disponibles</h1><p className="mt-3 max-w-2xl text-[#526257]">Estos datos son de demostración mientras abrimos las primeras campañas verificadas.</p><div className="mt-8 rounded-2xl border border-[#dcd7c9] bg-[#fbfaf5] p-4"><p className="text-sm font-medium text-[#405246]">Próximamente podrás filtrar por distrito, fechas, alojamiento y forma de pago.</p></div><div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{campaigns.map((campaign) => <CampaignCard key={campaign.slug} campaign={campaign} />)}</div></main></>;
}
