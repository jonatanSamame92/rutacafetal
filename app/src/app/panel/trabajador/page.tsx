import Link from "next/link";
import { withdrawApplicationAction } from "@/app/actions/marketplace";
import { RatingForm } from "@/components/forms/rating-form";
import { ReportForm } from "@/components/forms/report-form";
import { WorkerProfileForm } from "@/components/forms/worker-profile-form";
import { requireRole } from "@/lib/auth";
import { getLocations } from "@/lib/data/campaigns";
import { applicationStatusLabels, formatDate } from "@/lib/format";
import type { ApplicationStatus, AssignmentStatus } from "@/lib/types/database";

type ApplicationItem = {
  id: string; status: ApplicationStatus; created_at: string;
  campaigns: { id: string; slug: string; title: string; start_date: string; farms: { name: string } | null } | null;
};
type AssignmentItem = {
  id: string; campaign_id: string; status: AssignmentStatus;
  campaigns: { title: string; farms: { owner_id: string } | null } | null;
};

export default async function WorkerPanelPage() {
  const { userId, profile, supabase } = await requireRole("worker");
  const [locations, applicationsResult, assignmentsResult, ratingsResult] = await Promise.all([
    getLocations(),
    supabase.from("applications").select("id, status, created_at, campaigns(id, slug, title, start_date, farms(name))").eq("worker_id", userId).order("created_at", { ascending: false }),
    supabase.from("assignments").select("id, campaign_id, status, campaigns(title, farms(owner_id))").eq("worker_id", userId).order("created_at", { ascending: false }),
    supabase.from("ratings").select("assignment_id, rater_id").eq("rater_id", userId),
  ]);
  const applications = (applicationsResult.data ?? []) as unknown as ApplicationItem[];
  const assignments = (assignmentsResult.data ?? []) as unknown as AssignmentItem[];
  const ratedAssignments = new Set((ratingsResult.data ?? []).map((rating) => rating.assignment_id));

  return (
    <div className="space-y-8">
      <header><p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Panel de trabajador</p><h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Encuentra tu próxima campaña</h1><p className="mt-2 max-w-2xl text-[var(--muted)]">Completa tu experiencia, revisa tus postulaciones y coordina cuando te acepten.</p></header>
      <section aria-labelledby="postulaciones"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 id="postulaciones" className="text-2xl font-semibold">Tus postulaciones</h2><p className="mt-1 text-sm text-[var(--muted)]">Cada campaña acepta una sola postulación por persona.</p></div><Link href="/campanas" className="button-primary">Buscar campañas</Link></div>
        <div className="mt-4 grid gap-3">
          {applications.length ? applications.map((application) => <article key={application.id} className="surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-[var(--primary)]">{applicationStatusLabels[application.status]}</p><h3 className="mt-1 text-lg font-semibold">{application.campaigns?.title ?? "Campaña"}</h3><p className="mt-1 text-sm text-[var(--muted)]">{application.campaigns?.farms?.name} · Inicio {application.campaigns?.start_date ? formatDate(application.campaigns.start_date) : "por confirmar"}</p></div><div className="flex flex-wrap gap-2">{application.campaigns?.slug ? <Link className="button-secondary" href={`/campanas/${application.campaigns.slug}`}>Ver campaña</Link> : null}{application.status === "pending" ? <form action={withdrawApplicationAction}><input type="hidden" name="applicationId" value={application.id} /><button className="button-quiet" type="submit">Retirar</button></form> : null}</div></article>) : <div className="surface p-6 text-center"><h3 className="font-semibold">Aún no has postulado</h3><p className="mt-2 text-sm text-[var(--muted)]">Revisa pago, fechas y condiciones antes de elegir.</p></div>}
        </div>
      </section>
      {assignments.some((item) => item.status === "completed") ? <section><h2 className="text-2xl font-semibold">Campañas completadas</h2><div className="mt-4 grid gap-4">{assignments.filter((item) => item.status === "completed").map((assignment) => <article className="surface p-5" key={assignment.id}><h3 className="font-semibold">{assignment.campaigns?.title ?? "Campaña completada"}</h3>{ratedAssignments.has(assignment.id) ? <p className="mt-2 text-sm text-[var(--muted)]">Ya enviaste tu calificación.</p> : assignment.campaigns?.farms?.owner_id ? <details className="mt-4"><summary className="button-secondary list-none">Calificar al patrón</summary><div className="mt-4"><RatingForm assignmentId={assignment.id} campaignId={assignment.campaign_id} ratedUserId={assignment.campaigns.farms.owner_id} /></div></details> : null}<details className="mt-3"><summary className="button-danger list-none">Reportar un problema</summary><div className="mt-4"><ReportForm reportedUserId={assignment.campaigns?.farms?.owner_id} campaignId={assignment.campaign_id} /></div></details></article>)}</div></section> : null}
      <WorkerProfileForm profile={profile} locations={locations} />
    </div>
  );
}
