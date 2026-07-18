import Link from "next/link";
import { formatDate, formatMoney, paymentModeLabels, workTypeLabels } from "@/lib/format";
import type { PublicCampaign } from "@/lib/types/domain";

export function CampaignCard({ campaign }: { campaign: PublicCampaign }) {
  return (
    <article className="surface flex h-full flex-col p-5 transition-[border-color,box-shadow] duration-200 ease-out hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-short)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--accent)]">{workTypeLabels[campaign.workType]}</p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--primary-strong)]">{campaign.title}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{campaign.farmName}</p>
        </div>
        {campaign.rating > 0 && (
          <span className="shrink-0 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--primary-strong)]" aria-label={`Calificación ${campaign.rating} de 5`}>
            {campaign.rating.toFixed(1)} / 5
          </span>
        )}
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
        <div><dt className="text-[var(--muted)]">Distrito</dt><dd className="mt-0.5 font-semibold">{campaign.district}</dd></div>
        <div><dt className="text-[var(--muted)]">Empieza</dt><dd className="mt-0.5 font-semibold">{formatDate(campaign.startDate)}</dd></div>
        <div><dt className="text-[var(--muted)]">Pago</dt><dd className="mt-0.5 font-semibold">{formatMoney(campaign.paymentAmount)} {paymentModeLabels[campaign.paymentMode]}</dd></div>
        <div><dt className="text-[var(--muted)]">Cupos</dt><dd className="mt-0.5 font-semibold">{campaign.workersNeeded} personas</dd></div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
        {campaign.includesFood && <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1">Comida incluida</span>}
        {campaign.includesLodging && <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1">Alojamiento</span>}
        {campaign.transportProvided && <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1">Movilidad</span>}
        {campaign.isDemo && <span className="rounded-full border border-[var(--border)] px-2.5 py-1">Ejemplo</span>}
      </div>
      <Link href={`/campanas/${campaign.slug}`} className="button-secondary mt-6 w-full">Ver condiciones</Link>
    </article>
  );
}
