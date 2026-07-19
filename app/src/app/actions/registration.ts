"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/config";
import { requireAdmin } from "@/lib/auth";
import { phoneToAuthEmail } from "@/lib/phone";
import { firstValidationError, registrationRequestSchema } from "@/lib/validation";
import type { ActionState, ApprovalState } from "@/app/actions/types";
import type { UserRole } from "@/lib/types/database";

export async function submitRegistrationAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  if (!hasSupabaseAdminConfig()) {
    return { ok: false, message: "Las solicitudes abrirán cuando terminemos de conectar la base segura." };
  }

  const parsed = registrationRequestSchema.safeParse({
    role: formData.get("role"),
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    locationId: formData.get("locationId"),
    note: formData.get("note") ?? "",
    consent: formData.get("consent"),
  });
  if (!parsed.success) return { ok: false, message: firstValidationError(parsed.error) };

  const admin = getAdminClient();
  const { error } = await admin.from("registration_requests").insert({
    requested_role: parsed.data.role,
    full_name: parsed.data.fullName,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    location_id: parsed.data.locationId,
    note: parsed.data.note || null,
  });

  if (error?.code === "23505") {
    return { ok: false, message: "Ya existe una solicitud pendiente para ese celular." };
  }
  if (error) return { ok: false, message: "No pudimos enviar la solicitud. Inténtalo nuevamente." };

  await admin.from("analytics_events").insert({
    event_name: "registration_requested",
    actor_id: null,
    entity_id: null,
    metadata: { role: parsed.data.role },
  });

  return { ok: true, message: "Recibimos tu solicitud. Te contactaremos cuando la cuenta esté aprobada." };
}

export async function approveRegistrationAction(_state: ApprovalState, formData: FormData): Promise<ApprovalState> {
  const { userId } = await requireAdmin();
  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) return { ok: false, message: "Falta identificar la solicitud." };

  const admin = getAdminClient();
  const { data: request, error: requestError } = await admin
    .from("registration_requests")
    .select("*")
    .eq("id", requestId)
    .eq("status", "pending")
    .maybeSingle();
  if (requestError || !request) return { ok: false, message: "La solicitud ya no está pendiente." };

  const temporaryPassword = `Ruta!${randomBytes(6).toString("base64url")}7`;
  const { data: created, error: authError } = await admin.auth.admin.createUser({
    email: phoneToAuthEmail(request.phone),
    phone: request.phone,
    password: temporaryPassword,
    email_confirm: true,
    phone_confirm: true,
    app_metadata: { role: request.requested_role },
    user_metadata: { full_name: request.full_name },
  });
  if (authError || !created.user) return { ok: false, message: "No pudimos crear la cuenta. Revisa si el celular ya está registrado." };

  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id,
    role: request.requested_role as UserRole,
    status: "active",
    must_change_password: true,
    full_name: request.full_name,
    email: request.email,
    location_id: request.location_id,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { ok: false, message: "No pudimos completar el perfil. La cuenta no fue creada." };
  }

  const { data: approvedRequest, error: approvalError } = await admin.from("registration_requests").update({
    status: "approved",
    reviewed_by: userId,
    reviewed_at: new Date().toISOString(),
    created_user_id: created.user.id,
  }).eq("id", requestId).eq("status", "pending").select("id").maybeSingle();

  if (approvalError || !approvedRequest) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { ok: false, message: "La solicitud cambió mientras se aprobaba. La cuenta no fue creada." };
  }

  const { error: auditError } = await admin.from("moderation_events").insert({
    admin_id: userId,
    entity_type: "registration_request",
    entity_id: requestId,
    action: "approved",
    note: null,
  });
  if (auditError) {
    await admin.from("registration_requests").update({ status: "pending", reviewed_by: null, reviewed_at: null, created_user_id: null }).eq("id", requestId);
    await admin.auth.admin.deleteUser(created.user.id);
    return { ok: false, message: "No pudimos registrar la auditoría. La cuenta no fue creada." };
  }

  revalidatePath("/panel/admin");
  return {
    ok: true,
    message: "Cuenta creada. Copia las credenciales ahora; la contraseña no volverá a mostrarse.",
    credentials: { fullName: request.full_name, phone: request.phone, temporaryPassword },
  };
}

export async function rejectRegistrationAction(formData: FormData) {
  const { userId } = await requireAdmin();
  const requestId = String(formData.get("requestId") ?? "");
  const note = String(formData.get("note") ?? "").slice(0, 1000);
  if (!requestId) return;
  const admin = getAdminClient();
  const { data } = await admin.from("registration_requests").update({
    status: "rejected",
    reviewed_by: userId,
    reviewed_at: new Date().toISOString(),
    internal_note: note || null,
  }).eq("id", requestId).eq("status", "pending").select("id").maybeSingle();
  if (data) await admin.from("moderation_events").insert({
    admin_id: userId,
    entity_type: "registration_request",
    entity_id: requestId,
    action: "rejected",
    note: note || null,
  });
  revalidatePath("/panel/admin");
}
