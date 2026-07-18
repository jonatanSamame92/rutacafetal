"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/validation";
import type { ApprovalState } from "@/app/actions/types";

export async function moderateCampaignAction(formData: FormData) {
  const { userId } = await requireAdmin();
  const campaignId = String(formData.get("campaignId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const note = String(formData.get("note") ?? "").slice(0, 1000);
  if (!campaignId || !["published", "rejected"].includes(decision)) return;

  const admin = getAdminClient();
  await Promise.all([
    admin.from("campaigns").update({
      status: decision as "published" | "rejected",
      moderation_note: note || null,
      published_at: decision === "published" ? new Date().toISOString() : null,
    }).eq("id", campaignId).eq("status", "pending_review"),
    admin.from("moderation_events").insert({
      admin_id: userId,
      entity_type: "campaign",
      entity_id: campaignId,
      action: decision,
      note: note || null,
    }),
  ]);
  if (decision === "published") {
    await admin.from("analytics_events").insert({ event_name: "campaign_published", actor_id: userId, entity_id: campaignId, metadata: {} });
  }
  revalidatePath("/panel/admin");
  revalidatePath("/campanas");
}

export async function moderateReportAction(formData: FormData) {
  const { userId } = await requireAdmin();
  const reportId = String(formData.get("reportId") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").slice(0, 2000);
  if (!reportId || !["reviewing", "resolved", "dismissed"].includes(status)) return;
  const admin = getAdminClient();
  await Promise.all([
    admin.from("reports").update({
      status: status as "reviewing" | "resolved" | "dismissed",
      assigned_to: userId,
      resolution_note: note || null,
      resolved_at: ["resolved", "dismissed"].includes(status) ? new Date().toISOString() : null,
    }).eq("id", reportId),
    admin.from("moderation_events").insert({ admin_id: userId, entity_type: "report", entity_id: reportId, action: status, note: note || null }),
  ]);
  revalidatePath("/panel/admin");
}

export async function moderateRatingAction(formData: FormData) {
  const { userId } = await requireAdmin();
  const ratingId = String(formData.get("ratingId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!ratingId || !["approved", "rejected"].includes(status)) return;
  const admin = getAdminClient();
  await Promise.all([
    admin.from("ratings").update({
      status: status as "approved" | "rejected",
      moderated_by: userId,
      moderated_at: new Date().toISOString(),
    }).eq("id", ratingId).eq("status", "pending"),
    admin.from("moderation_events").insert({ admin_id: userId, entity_type: "rating", entity_id: ratingId, action: status, note: null }),
  ]);
  revalidatePath("/panel/admin");
}

export async function resetPasswordAction(_state: ApprovalState, formData: FormData): Promise<ApprovalState> {
  const { userId } = await requireAdmin();
  const profileId = String(formData.get("profileId") ?? "");
  if (!profileId || profileId === userId) return { ok: false, message: "No se puede restablecer esa cuenta." };
  const admin = getAdminClient();
  const [{ data: profile }, { data: authUser, error: authError }] = await Promise.all([
    admin.from("profiles").select("full_name").eq("id", profileId).maybeSingle(),
    admin.auth.admin.getUserById(profileId),
  ]);
  if (authError || !authUser.user?.phone || !profile) return { ok: false, message: "No encontramos una cuenta con celular." };
  const temporaryPassword = `Ruta!${randomBytes(6).toString("base64url")}8`;
  const { error } = await admin.auth.admin.updateUserById(profileId, { password: temporaryPassword });
  if (error) return { ok: false, message: "No pudimos restablecer la contraseña." };
  await Promise.all([
    admin.from("profiles").update({ must_change_password: true }).eq("id", profileId),
    admin.from("moderation_events").insert({ admin_id: userId, entity_type: "profile", entity_id: profileId, action: "password_reset", note: null }),
  ]);
  return { ok: true, message: "Contraseña temporal creada. Cópiala ahora.", credentials: { fullName: profile.full_name, phone: authUser.user.phone, temporaryPassword } };
}

export async function createLocationAction(formData: FormData) {
  const { userId } = await requireAdmin();
  const province = String(formData.get("province") ?? "Jaén").trim().slice(0, 100);
  const district = String(formData.get("district") ?? "").trim().slice(0, 100);
  if (district.length < 2) return;
  const admin = getAdminClient();
  const { data } = await admin.from("locations").insert({ province, district, slug: slugify(`${province}-${district}`), is_active: true }).select("id").single();
  if (data) await admin.from("moderation_events").insert({ admin_id: userId, entity_type: "location", entity_id: data.id, action: "created", note: `${province}, ${district}` });
  revalidatePath("/panel/admin");
}

export async function toggleLocationAction(formData: FormData) {
  const { userId } = await requireAdmin();
  const locationId = String(formData.get("locationId") ?? "");
  const active = String(formData.get("active") ?? "") === "true";
  if (!locationId) return;
  const admin = getAdminClient();
  await Promise.all([
    admin.from("locations").update({ is_active: active }).eq("id", locationId),
    admin.from("moderation_events").insert({ admin_id: userId, entity_type: "location", entity_id: locationId, action: active ? "activated" : "deactivated", note: null }),
  ]);
  revalidatePath("/panel/admin");
}

export async function suspendProfileAction(formData: FormData) {
  const { userId } = await requireAdmin();
  const profileId = String(formData.get("profileId") ?? "");
  const reason = String(formData.get("reason") ?? "").slice(0, 1000);
  if (!profileId || profileId === userId) return;
  const admin = getAdminClient();
  await Promise.all([
    admin.from("profiles").update({ status: "suspended" }).eq("id", profileId),
    admin.from("moderation_events").insert({ admin_id: userId, entity_type: "profile", entity_id: profileId, action: "suspended", note: reason || null }),
  ]);
  revalidatePath("/panel/admin");
}

export async function reactivateProfileAction(formData: FormData) {
  const { userId } = await requireAdmin();
  const profileId = String(formData.get("profileId") ?? "");
  if (!profileId) return;
  const admin = getAdminClient();
  await Promise.all([
    admin.from("profiles").update({ status: "active" }).eq("id", profileId).eq("status", "suspended"),
    admin.from("moderation_events").insert({ admin_id: userId, entity_type: "profile", entity_id: profileId, action: "reactivated", note: null }),
  ]);
  revalidatePath("/panel/admin");
}
