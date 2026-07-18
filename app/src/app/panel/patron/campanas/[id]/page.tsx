import { notFound } from "next/navigation";
import Link from "next/link";
import { completeAssignmentAction, decideApplicationAction } from "@/app/actions/marketplace";
import { RatingForm } from "@/components/forms/rating-form";
import { ReportForm } from "@/components/forms/report-form";
import { requireRole } from "@/lib/auth";
import { applicationStatusLabels, campaignStatusLabels, formatDate, formatMoney, paymentModeLabels } from "@/lib/format";
import type { ApplicationStatus, AssignmentStatus, CampaignStatus, PaymentMode } from "@/lib/types/database";

type CampaignDetail = {
  id: string; title: string; status: CampaignStatus; description: string; start_date: string; end_date: string;
  workers_needed: number; payment_amount: number; payment_mode: PaymentMode; moderation_note: string | null;
  farms: { name: string; owner_id: string } | null; locations: { district: string } | null;
};
type Applicant = { id: string; worker_id: string; status: ApplicationStatus; message: string | null; created_at: string; profiles: { full_name: string; experience_level: string | null; available_from: string | null; availability_type: string | null; bio: string | null; rating_average: number; rating_count: number } | null };
type Assignment = { id: string; worker_id: string; status: AssignmentStatus; completed_at: string | null };

const experienceLabels: Record<string, string> = { less_than_1: "Menos de 1 año", "1_to_3": "Entre 1 y 3 años", "3_plus": "Más de 3 años" };

export default async function FarmerCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId, supabase } = await requireRole("farmer");
  const campaignResult = await supabase.from("campaigns").select("id, title, status, description, start_date, end_date, workers_needed, payment_amount, payment_mode, moderation_note, farms!inner(name, owner_id), locations(district)").eq("id", id).eq("farms.owner_id", userId).maybeSingle();
  if (!campaignResult.data) notFound();
  const campaign = campaignResult.data as unknown as CampaignDetail;
  const [applicationsResult, assignmentsResult, ratingsResult] = await Promise.all([
    supabase.from("applications").select("id, worker_id, status, message, created_at, profiles!applications_worker_id_fkey(full_name, experience_level, available_from, availability_type, bio, rating_average, rating_count)").eq("campaign_id", id).order("created_at"),
    supabase.from("assignments").select("id, worker_id, status, completed_at").eq("campaign_id", id),
    supabase.from("ratings").select("assignment_id, rater_id").eq("rater_id", userId),
  ]);
  const applications = (applicationsResult.data ?? []) as unknown as Applicant[];
  const assignments = (assignmentsResult.data ?? []) as Assignment[];
  const assignmentByWorker = new Map(assignments.map((item) => [item.worker_id, item]));
  const ratedAssignments = new Set((ratingsResult.data ?? []).map((rating) => rating.assignment_id));
  const acceptedCount = applications.filter((item) => item.status === "accepted").length;

  return (
    <div className="space-y-7">
      <Link href="/panel/patron" className="text-sm font-semibold text-[var(--primary)] underline">Volver a mis campañas</Link>
      <header className="surface p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm font-semibold text-[var(--primary)]">{campaignStatusLabels[campaign.status]}</span><span className="text-sm text-[var(--muted)]">{acceptedCount} de {campaign.workers_needed} cupos aceptados</span></div><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{campaign.title}</h1><p className="mt-3 max-w-3xl text-[var(--muted)]">{campaign.description}</p><dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3"><div><dt className="text-[var(--muted)]">Finca y zona</dt><dd className="mt-1 font-semibold">{campaign.farms?.name} · {campaign.locations?.district}</dd></div><div><dt className="text-[var(--muted)]">Fechas</dt><dd className="mt-1 font-semibold">{formatDate(campaign.start_date)} al {formatDate(campaign.end_date)}</dd></div><div><dt className="text-[var(--muted)]">Pago</dt><dd className="mt-1 font-semibold">{formatMoney(Number(campaign.payment_amount))} {paymentModeLabels[campaign.payment_mode]}</dd></div></dl>{campaign.moderation_note ? <p className="status-message mt-5" data-state="error"><strong>Observación de moderación:</strong> {campaign.moderation_note}</p> : null}</header>
      <section><h2 className="text-2xl font-semibold">Postulantes</h2><p className="mt-1 text-sm text-[var(--muted)]">El celular solo se abre mediante WhatsApp después de aceptar.</p><div className="mt-4 grid gap-4">
        {applications.length ? applications.map((application) => {
          const assignment = assignmentByWorker.get(application.worker_id);
          return <article key={application.id} className="surface p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold text-[var(--primary)]">{applicationStatusLabels[application.status]}</p><h3 className="mt-1 text-xl font-semibold">{application.profiles?.full_name ?? "Trabajador"}</h3><p className="mt-1 text-sm text-[var(--muted)]">{application.profiles?.experience_level ? experienceLabels[application.profiles.experience_level] : "Experiencia por completar"}{application.profiles?.rating_count ? ` · ${Number(application.profiles.rating_average).toFixed(1)} de 5` : " · Sin calificaciones"}</p></div>{application.profiles?.available_from ? <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-sm font-semibold text-[var(--primary-strong)]">Disponible {formatDate(application.profiles.available_from)}</span> : null}</div>{application.profiles?.bio ? <p className="mt-4 text-sm leading-6">{application.profiles.bio}</p> : null}{application.message ? <blockquote className="mt-4 rounded-lg bg-[var(--surface-muted)] p-4 text-sm text-[var(--muted)]">{application.message}</blockquote> : null}
            <div className="mt-5 flex flex-wrap gap-2">{application.status === "pending" && campaign.status === "published" ? <form action={decideApplicationAction} className="contents"><input type="hidden" name="applicationId" value={application.id} /><button className="button-primary" type="submit" name="decision" value="accept">Aceptar</button><button className="button-quiet" type="submit" name="decision" value="reject">No seleccionar</button></form> : null}{application.status === "accepted" ? <a className="button-primary" href={`/api/contacto/${application.id}`}>Abrir WhatsApp</a> : null}{assignment?.status === "active" ? <form action={completeAssignmentAction}><input type="hidden" name="assignmentId" value={assignment.id} /><button className="button-secondary" type="submit">Marcar trabajo completado</button></form> : null}</div>
            {assignment?.status === "completed" ? <div className="mt-5 grid gap-4 border-t border-[var(--border)] pt-5 lg:grid-cols-2">{ratedAssignments.has(assignment.id) ? <p className="text-sm text-[var(--muted)]">Ya enviaste tu calificación.</p> : <details><summary className="button-secondary list-none">Calificar al trabajador</summary><div className="mt-4"><RatingForm assignmentId={assignment.id} campaignId={campaign.id} ratedUserId={application.worker_id} /></div></details>}<details><summary className="button-danger list-none">Reportar un problema</summary><div className="mt-4"><ReportForm reportedUserId={application.worker_id} campaignId={campaign.id} /></div></details></div> : null}
          </article>;
        }) : <div className="surface p-6 text-center"><h3 className="font-semibold">Aún no hay postulantes</h3><p className="mt-2 text-sm text-[var(--muted)]">Cuando la campaña esté publicada, las solicitudes aparecerán aquí.</p></div>}
      </div></section>
    </div>
  );
}
