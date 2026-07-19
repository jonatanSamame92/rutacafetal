import { NextResponse } from "next/server";
import { recordAnalyticsEvent } from "@/lib/analytics";
import { getAuthContext } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";

type ContactApplication = {
  id: string;
  status: string;
  worker_id: string;
  campaigns: { title: string; farms: { owner_id: string } | null } | null;
};

export async function GET(request: Request, { params }: { params: Promise<{ applicationId: string }> }) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.redirect(new URL("/ingresar?mensaje=Inicia sesión para continuar.", request.url));
  if (auth.profile.status !== "active") return NextResponse.redirect(new URL("/cuenta-suspendida", request.url));
  if (auth.profile.must_change_password) return NextResponse.redirect(new URL("/cambiar-clave", request.url));
  if (auth.profile.role !== "farmer" && auth.profile.role !== "admin") return NextResponse.redirect(new URL("/panel", request.url));
  const { applicationId } = await params;
  const { data } = await auth.supabase
    .from("applications")
    .select("id, status, worker_id, campaigns(title, farms(owner_id))")
    .eq("id", applicationId)
    .maybeSingle();
  const application = data as unknown as ContactApplication | null;
  if (!application || application.status !== "accepted" || application.campaigns?.farms?.owner_id !== auth.userId) {
    return NextResponse.redirect(new URL("/panel/patron?mensaje=El contacto todavía no está habilitado.", request.url));
  }

  const admin = getAdminClient();
  const { data: worker, error } = await admin.auth.admin.getUserById(application.worker_id);
  if (error || !worker.user?.phone) return NextResponse.redirect(new URL("/panel/patron?mensaje=No encontramos el celular del trabajador.", request.url));
  const { error: contactError } = await auth.supabase.from("contact_events").insert({ application_id: application.id, actor_id: auth.userId, channel: "whatsapp" });
  if (contactError) return NextResponse.redirect(new URL("/panel/patron?mensaje=No pudimos habilitar el contacto de forma segura.", request.url));
  await recordAnalyticsEvent("whatsapp_opened", auth.userId, application.id);
  const phone = worker.user.phone.replace(/[^0-9]/g, "");
  const message = encodeURIComponent(`Hola, te contacto desde Rutacafetal por la campaña ${application.campaigns.title}. Tu postulación fue aceptada.`);
  return NextResponse.redirect(`https://wa.me/${phone}?text=${message}`);
}
