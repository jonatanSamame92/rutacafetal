import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/forms/application-form";
import { PublicShell } from "@/components/public-shell";
import { getAuthContext } from "@/lib/auth";
import { getPublicCampaign } from "@/lib/data/campaigns";
import { formatDate, formatMoney, paymentModeLabels, workTypeLabels } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const campaign = await getPublicCampaign((await params).slug);
  return campaign ? { title: campaign.title, description: `${campaign.farmName}, ${campaign.district}. ${formatMoney(campaign.paymentAmount)} ${paymentModeLabels[campaign.paymentMode]}.` } : { title: "Campaña no encontrada" };
}

export default async function CampaignDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const campaign = await getPublicCampaign((await params).slug);
  if (!campaign) notFound();
  const auth = await getAuthContext();

  return (
    <PublicShell>
      <div className="page-shell py-8 sm:py-12">
        <Link href="/campanas" className="inline-flex min-h-11 items-center font-semibold text-[var(--primary-strong)] underline decoration-[var(--border-strong)] underline-offset-4">Volver a campañas</Link>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_21rem]">
          <article>
            <p className="font-semibold text-[var(--accent)]">{workTypeLabels[campaign.workType]} en {campaign.district}</p>
            <h1 className="mt-2 text-4xl font-semibold text-[var(--primary-strong)] sm:text-5xl">{campaign.title}</h1>
            <p className="mt-3 text-lg text-[var(--muted)]">{campaign.farmName}, provincia de {campaign.province}</p>
            {campaign.isDemo && <p className="status-message mt-6">Esta es una campaña de ejemplo. No representa una oferta de trabajo activa.</p>}

            <section className="mt-8 border-t border-[var(--border)] pt-7"><h2 className="text-2xl font-semibold">El trabajo</h2><p className="mt-3 max-w-[70ch] leading-7 text-[var(--muted)]">{campaign.description}</p></section>
            <div className="mt-8 grid gap-8 border-t border-[var(--border)] pt-7 sm:grid-cols-2">
              <section><h2 className="text-xl font-semibold">Ubicación aproximada</h2><p className="mt-3 leading-7 text-[var(--muted)]">{campaign.locationReference}</p></section>
              <section><h2 className="text-xl font-semibold">Seguridad y normas</h2><p className="mt-3 leading-7 text-[var(--muted)]">{campaign.safetyNote}</p></section>
            </div>
            <section className="mt-8 border-t border-[var(--border)] pt-7">
              <h2 className="text-xl font-semibold">Confianza de la finca</h2>
              <p className="mt-3 text-[var(--muted)]">{campaign.rating > 0 ? `${campaign.rating.toFixed(1)} de 5, basada en ${campaign.completedCampaigns} calificaciones moderadas.` : "La finca aún no tiene calificaciones públicas."}</p>
              {campaign.ratingComments?.length ? <div className="mt-5 grid gap-3">{campaign.ratingComments.map((comment, index) => <blockquote className="rounded-lg bg-[var(--surface-muted)] p-4 text-sm leading-6 text-[var(--muted)]" key={`${campaign.id}-${index}`}>{comment}</blockquote>)}</div> : null}
            </section>
          </article>

          <aside className="surface h-fit p-5 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-[var(--primary-strong)]">Condiciones</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div><dt className="text-[var(--muted)]">Fechas estimadas</dt><dd className="mt-1 font-semibold">{formatDate(campaign.startDate)} al {formatDate(campaign.endDate)}</dd></div>
              <div><dt className="text-[var(--muted)]">Pago</dt><dd className="mt-1 font-semibold">{formatMoney(campaign.paymentAmount)} {paymentModeLabels[campaign.paymentMode]}</dd></div>
              <div><dt className="text-[var(--muted)]">Beneficios</dt><dd className="mt-1 font-semibold">{campaign.includesFood ? "Comida incluida" : "Sin comida"}. {campaign.includesLodging ? "Alojamiento incluido" : "Sin alojamiento"}.</dd></div>
              <div><dt className="text-[var(--muted)]">Cupos</dt><dd className="mt-1 font-semibold">{campaign.workersNeeded} personas</dd></div>
            </dl>
            <div className="mt-6 border-t border-[var(--border)] pt-5">
              {campaign.isDemo ? <Link href="/registro?rol=worker" className="button-primary w-full">Solicitar acceso</Link> : auth?.profile.role === "worker" ? <ApplicationForm campaignId={campaign.id} /> : <Link href={auth ? "/panel" : "/ingresar"} className="button-primary w-full">{auth ? "Ir a mi panel" : "Ingresar para postular"}</Link>}
              <p className="mt-3 text-center text-xs leading-5 text-[var(--muted)]">Tu teléfono no se publica. El patrón puede abrir WhatsApp después de aceptar.</p>
            </div>
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}
