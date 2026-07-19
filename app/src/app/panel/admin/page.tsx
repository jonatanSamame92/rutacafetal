import {
  createLocationAction,
  moderateCampaignAction,
  moderateRatingAction,
  moderateReportAction,
  reactivateProfileAction,
  suspendProfileAction,
  toggleLocationAction,
} from "@/app/actions/admin";
import { rejectRegistrationAction } from "@/app/actions/registration";
import {
  ApproveRegistrationForm,
  ResetPasswordForm,
} from "@/components/admin/credential-form";
import { requireAdmin } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";
import { daysAgoIso } from "@/lib/time";
import type {
  CampaignStatus,
  RatingStatus,
  ReportStatus,
  UserRole,
} from "@/lib/types/database";

type Registration = {
  id: string;
  full_name: string;
  phone: string;
  requested_role: UserRole;
  email: string | null;
  note: string | null;
  created_at: string;
  locations: { district: string } | null;
};
type PendingCampaign = {
  id: string;
  title: string;
  description: string;
  safety_note: string;
  start_date: string;
  end_date: string;
  workers_needed: number;
  status: CampaignStatus;
  farms: { name: string; profiles: { full_name: string } | null } | null;
  locations: { district: string } | null;
};
type ReportItem = {
  id: string;
  type: string;
  description: string;
  evidence_path: string | null;
  status: ReportStatus;
  created_at: string;
  reporter: { full_name: string } | null;
  reported: { full_name: string } | null;
  campaigns: { title: string } | null;
};
type RatingItem = {
  id: string;
  score: number;
  comment: string | null;
  status: RatingStatus;
  rater: { full_name: string } | null;
  rated: { full_name: string } | null;
};

const reportTypeLabels: Record<string, string> = {
  no_payment: "Falta de pago",
  abuse: "Maltrato o abuso",
  theft: "Robo",
  unsafe_conditions: "Condiciones inseguras",
  fraud: "Información falsa",
  other: "Otro",
};
const analyticsCards = [
  ["registration_requested", "Solicitudes"],
  ["campaign_submitted", "Campañas enviadas"],
  ["campaign_published", "Campañas publicadas"],
  ["application_created", "Postulaciones"],
  ["application_accepted", "Aceptaciones"],
  ["campaign_completed", "Trabajos completados"],
  ["rating_created", "Calificaciones"],
  ["report_created", "Reportes"],
  ["whatsapp_opened", "Contactos abiertos"],
] as const;

export default async function AdminPage() {
  await requireAdmin();
  const admin = getAdminClient();
  const since = daysAgoIso(30);
  const [
    registrationsResult,
    campaignsResult,
    reportsResult,
    ratingsResult,
    profilesResult,
    locationsResult,
    analyticsResult,
  ] = await Promise.all([
    admin
      .from("registration_requests")
      .select(
        "id, full_name, phone, requested_role, email, note, created_at, locations(district)",
      )
      .eq("status", "pending")
      .order("created_at"),
    admin
      .from("campaigns")
      .select(
        "id, title, description, safety_note, start_date, end_date, workers_needed, status, farms(name, profiles!farms_owner_id_fkey(full_name)), locations(district)",
      )
      .eq("status", "pending_review")
      .order("created_at"),
    admin
      .from("reports")
      .select(
        "id, type, description, evidence_path, status, created_at, reporter:profiles!reports_reporter_id_fkey(full_name), reported:profiles!reports_reported_user_id_fkey(full_name), campaigns(title)",
      )
      .in("status", ["open", "reviewing"])
      .order("created_at"),
    admin
      .from("ratings")
      .select(
        "id, score, comment, status, rater:profiles!ratings_rater_id_fkey(full_name), rated:profiles!ratings_rated_user_id_fkey(full_name)",
      )
      .eq("status", "pending")
      .order("created_at"),
    admin
      .from("profiles")
      .select("id, full_name, role, status, must_change_password")
      .neq("role", "admin")
      .order("created_at", { ascending: false })
      .limit(50),
    admin.from("locations").select("*").order("sort_order"),
    admin
      .from("analytics_events")
      .select("event_name")
      .gte("created_at", since),
  ]);
  const registrations = (registrationsResult.data ??
    []) as unknown as Registration[];
  const campaigns = (campaignsResult.data ??
    []) as unknown as PendingCampaign[];
  const reports = (reportsResult.data ?? []) as unknown as ReportItem[];
  const ratings = (ratingsResult.data ?? []) as unknown as RatingItem[];
  const profiles = profilesResult.data ?? [];
  const locations = locationsResult.data ?? [];
  const counts = (analyticsResult.data ?? []).reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.event_name] = (acc[item.event_name] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-9">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
          Administración
        </p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
          Operación de Rutacafetal
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          Aprueba altas y campañas, revisa reputación y atiende incidentes desde
          un solo lugar.
        </p>
      </header>
      <section aria-labelledby="resumen">
        <h2 id="resumen" className="text-2xl font-semibold">
          Últimos 30 días
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {analyticsCards.map(([key, label]) => (
            <article key={key} className="surface p-5">
              <p className="text-sm text-[var(--muted)]">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{counts[key] ?? 0}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">
          Solicitudes de registro{" "}
          <span className="text-[var(--muted)]">({registrations.length})</span>
        </h2>
        <div className="mt-4 grid gap-4">
          {registrations.length ? (
            registrations.map((request) => (
              <article className="surface p-5" key={request.id}>
                <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-sm font-semibold text-[var(--primary)]">
                      {request.requested_role === "worker"
                        ? "Trabajador"
                        : "Patrón"}{" "}
                      · {request.locations?.district ?? "Sin distrito"}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold">
                      {request.full_name}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {request.phone}
                      {request.email ? ` · ${request.email}` : ""} ·{" "}
                      {formatDate(request.created_at.slice(0, 10))}
                    </p>
                    {request.note ? (
                      <p className="mt-3 text-sm">{request.note}</p>
                    ) : null}
                  </div>
                  <div className="flex min-w-56 flex-col gap-3">
                    <ApproveRegistrationForm requestId={request.id} />
                    <form
                      action={rejectRegistrationAction}
                      className="space-y-2"
                    >
                      <input
                        type="hidden"
                        name="requestId"
                        value={request.id}
                      />
                <input
                  className="field"
                  name="note"
                  aria-label={`Motivo para rechazar la solicitud de ${request.full_name}`}
                  placeholder="Motivo interno"
                />
                      <button className="button-danger w-full" type="submit">
                        Rechazar
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="surface p-5 text-sm text-[var(--muted)]">
              No hay solicitudes pendientes.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">
          Campañas por revisar{" "}
          <span className="text-[var(--muted)]">({campaigns.length})</span>
        </h2>
        <div className="mt-4 grid gap-4">
          {campaigns.length ? (
            campaigns.map((campaign) => (
              <article className="surface p-5" key={campaign.id}>
                <p className="text-sm font-semibold text-[var(--primary)]">
                  {campaign.farms?.name} · {campaign.locations?.district}
                </p>
                <h3 className="mt-1 text-xl font-semibold">{campaign.title}</h3>
                <p className="mt-3 text-sm leading-6">{campaign.description}</p>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  <strong>Seguridad:</strong> {campaign.safety_note}
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {formatDate(campaign.start_date)} al{" "}
                  {formatDate(campaign.end_date)} · {campaign.workers_needed}{" "}
                  personas · Responsable: {campaign.farms?.profiles?.full_name}
                </p>
                <form
                  action={moderateCampaignAction}
                  className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]"
                >
                  <input type="hidden" name="campaignId" value={campaign.id} />
            <input
              className="field"
              name="note"
              aria-label={`Observación de moderación para ${campaign.title}`}
              placeholder="Observación, necesaria si rechazas"
            />
                  <button
                    className="button-primary"
                    name="decision"
                    value="published"
                  >
                    Publicar
                  </button>
                  <button
                    className="button-danger"
                    name="decision"
                    value="rejected"
                  >
                    Observar
                  </button>
                </form>
              </article>
            ))
          ) : (
            <p className="surface p-5 text-sm text-[var(--muted)]">
              No hay campañas esperando revisión.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">
          Reportes privados{" "}
          <span className="text-[var(--muted)]">({reports.length})</span>
        </h2>
        <div className="mt-4 grid gap-4">
          {reports.length ? (
            reports.map((report) => (
              <article className="surface p-5" key={report.id}>
                <p className="text-sm font-semibold text-[var(--danger)]">
                  {reportTypeLabels[report.type] ?? report.type} ·{" "}
                  {report.status === "open" ? "Nuevo" : "En revisión"}
                </p>
                <h3 className="mt-1 font-semibold">
                  Reporta {report.reporter?.full_name ?? "Usuario"}
                  {report.reported ? ` sobre ${report.reported.full_name}` : ""}
                </h3>
                {report.campaigns ? (
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Campaña: {report.campaigns.title}
                  </p>
                ) : null}
                <p className="mt-3 text-sm leading-6">{report.description}</p>
                {report.evidence_path ? (
                  <a
                    className="mt-3 inline-block font-semibold text-[var(--primary)] underline"
                    href={report.evidence_path}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir evidencia
                  </a>
                ) : null}
                <form
                  action={moderateReportAction}
                  className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]"
                >
                  <input type="hidden" name="reportId" value={report.id} />
            <input
              className="field"
              name="note"
              aria-label="Resolución o nota interna del reporte"
              placeholder="Resolución o nota interna"
            />
                  <button
                    className="button-quiet"
                    name="status"
                    value="reviewing"
                  >
                    Tomar caso
                  </button>
                  <button
                    className="button-primary"
                    name="status"
                    value="resolved"
                  >
                    Resolver
                  </button>
                  <button
                    className="button-secondary"
                    name="status"
                    value="dismissed"
                  >
                    Descartar
                  </button>
                </form>
              </article>
            ))
          ) : (
            <p className="surface p-5 text-sm text-[var(--muted)]">
              No hay reportes abiertos.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">
          Calificaciones por moderar{" "}
          <span className="text-[var(--muted)]">({ratings.length})</span>
        </h2>
        <div className="mt-4 grid gap-3">
          {ratings.length ? (
            ratings.map((rating) => (
              <article
                className="surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                key={rating.id}
              >
                <div>
                  <p className="font-semibold">
                    {rating.rater?.full_name} calificó a{" "}
                    {rating.rated?.full_name}: {rating.score}/5
                  </p>
                  {rating.comment ? (
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {rating.comment}
                    </p>
                  ) : null}
                </div>
                <form action={moderateRatingAction} className="flex gap-2">
                  <input type="hidden" name="ratingId" value={rating.id} />
                  <button
                    className="button-primary"
                    name="status"
                    value="approved"
                  >
                    Aprobar
                  </button>
                  <button
                    className="button-danger"
                    name="status"
                    value="rejected"
                  >
                    Rechazar
                  </button>
                </form>
              </article>
            ))
          ) : (
            <p className="surface p-5 text-sm text-[var(--muted)]">
              No hay calificaciones pendientes.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Cuentas recientes</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="bg-[var(--surface-muted)]">
              <tr>
                <th className="p-3">Persona</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr
                  className="border-t border-[var(--border)]"
                  key={profile.id}
                >
                  <td className="p-3 font-semibold">{profile.full_name}</td>
                  <td className="p-3">
                    {profile.role === "worker" ? "Trabajador" : "Patrón"}
                  </td>
                  <td className="p-3">
                    {profile.status}
                    {profile.must_change_password ? " · clave temporal" : ""}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <ResetPasswordForm profileId={profile.id} />
                      {profile.status !== "suspended" ? (
                        <form
                          action={suspendProfileAction}
                          className="flex gap-2"
                        >
                          <input
                            type="hidden"
                            name="profileId"
                            value={profile.id}
                          />
                        <input
                          className="field max-w-44"
                          name="reason"
                          aria-label={`Motivo para suspender a ${profile.full_name}`}
                          placeholder="Motivo"
                          required
                        />
                          <button className="button-danger" type="submit">
                            Suspender
                          </button>
                        </form>
                      ) : (
                        <form action={reactivateProfileAction}>
                          <input
                            type="hidden"
                            name="profileId"
                            value={profile.id}
                          />
                          <button className="button-secondary" type="submit">
                            Reactivar
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Distritos y zonas</h2>
        <form
          action={createLocationAction}
          className="mt-4 grid gap-3 surface p-4 sm:grid-cols-[1fr_1fr_auto]"
        >
          <input
            className="field"
            name="province"
            defaultValue="Jaén"
            aria-label="Provincia"
            required
          />
          <input
            className="field"
            name="district"
            placeholder="Nuevo distrito"
            aria-label="Distrito"
            required
          />
          <button className="button-primary" type="submit">
            Añadir zona
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {locations.map((location) => (
            <form action={toggleLocationAction} key={location.id}>
              <input type="hidden" name="locationId" value={location.id} />
              <input
                type="hidden"
                name="active"
                value={location.is_active ? "false" : "true"}
              />
              <button
                className={
                  location.is_active ? "button-quiet" : "button-secondary"
                }
                type="submit"
              >
                {location.district} ·{" "}
                {location.is_active ? "Activa" : "Inactiva"}
              </button>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}
