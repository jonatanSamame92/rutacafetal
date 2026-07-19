"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireProfile, requireRole } from "@/lib/auth";
import { recordAnalyticsEvent } from "@/lib/analytics";
import {
  applicationSchema,
  campaignSchema,
  farmSchema,
  farmerProfileSchema,
  firstValidationError,
  formBoolean,
  ratingSchema,
  reportSchema,
  slugify,
  workerProfileSchema,
} from "@/lib/validation";
import type { ActionState } from "@/app/actions/types";

export async function updateWorkerProfileAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const { userId, supabase } = await requireRole("worker");
  const parsed = workerProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    locationId: formData.get("locationId"),
    experienceLevel: formData.get("experienceLevel"),
    availableFrom: formData.get("availableFrom"),
    availabilityType: formData.get("availabilityType"),
    paymentPreference: formData.get("paymentPreference"),
    acceptsLodging: formBoolean(formData, "acceptsLodging"),
    bio: formData.get("bio") ?? "",
  });
  if (!parsed.success) return { ok: false, message: firstValidationError(parsed.error) };

  const { error } = await supabase.from("profiles").update({
    full_name: parsed.data.fullName,
    location_id: parsed.data.locationId,
    experience_level: parsed.data.experienceLevel,
    available_from: parsed.data.availableFrom,
    availability_type: parsed.data.availabilityType,
    payment_preference: parsed.data.paymentPreference,
    accepts_lodging: parsed.data.acceptsLodging,
    bio: parsed.data.bio || null,
    crops: ["coffee"],
  }).eq("id", userId);
  if (error) return { ok: false, message: "No pudimos guardar tu perfil." };
  revalidatePath("/panel/trabajador");
  return { ok: true, message: "Perfil actualizado." };
}

export async function updateFarmerProfileAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const { userId, supabase } = await requireRole("farmer");
  const parsed = farmerProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    locationId: formData.get("locationId"),
    operationZone: formData.get("operationZone"),
    cooperativeName: formData.get("cooperativeName") ?? "",
    bio: formData.get("bio") ?? "",
  });
  if (!parsed.success) return { ok: false, message: firstValidationError(parsed.error) };

  const { error } = await supabase.from("profiles").update({
    full_name: parsed.data.fullName,
    location_id: parsed.data.locationId,
    operation_zone: parsed.data.operationZone,
    cooperative_name: parsed.data.cooperativeName || null,
    bio: parsed.data.bio || null,
  }).eq("id", userId);
  if (error) return { ok: false, message: "No pudimos guardar el perfil." };
  revalidatePath("/panel/patron");
  return { ok: true, message: "Perfil actualizado." };
}

export async function createFarmAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const { userId, supabase } = await requireRole("farmer");
  const parsed = farmSchema.safeParse({
    name: formData.get("name"),
    locationId: formData.get("locationId"),
    locationReference: formData.get("locationReference"),
    description: formData.get("description") ?? "",
    areaHectares: formData.get("areaHectares") || undefined,
  });
  if (!parsed.success) return { ok: false, message: firstValidationError(parsed.error) };

  const { error } = await supabase.from("farms").insert({
    owner_id: userId,
    name: parsed.data.name,
    location_id: parsed.data.locationId,
    location_reference: parsed.data.locationReference,
    description: parsed.data.description || null,
    area_hectares: parsed.data.areaHectares ?? null,
    main_crop: "coffee",
  });
  if (error) return { ok: false, message: "No pudimos registrar la finca." };
  revalidatePath("/panel/patron");
  return { ok: true, message: "Finca registrada. Ya puedes crear una campaña." };
}

export async function createCampaignAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const { userId, supabase } = await requireRole("farmer");
  const parsed = campaignSchema.safeParse({
    farmId: formData.get("farmId"),
    title: formData.get("title"),
    description: formData.get("description"),
    locationId: formData.get("locationId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    workersNeeded: formData.get("workersNeeded"),
    workType: formData.get("workType"),
    paymentMode: formData.get("paymentMode"),
    paymentAmount: formData.get("paymentAmount"),
    paymentUnitLabel: formData.get("paymentUnitLabel") ?? "",
    includesFood: formBoolean(formData, "includesFood"),
    includesLodging: formBoolean(formData, "includesLodging"),
    transportProvided: formBoolean(formData, "transportProvided"),
    safetyNote: formData.get("safetyNote"),
  });
  if (!parsed.success) return { ok: false, message: firstValidationError(parsed.error) };

  const campaignId = randomUUID();
  const slug = `${slugify(parsed.data.title)}-${campaignId.slice(0, 8)}`;
  const { error } = await supabase.from("campaigns").insert({
    id: campaignId,
    farm_id: parsed.data.farmId,
    slug,
    title: parsed.data.title,
    description: parsed.data.description,
    location_id: parsed.data.locationId,
    start_date: parsed.data.startDate,
    end_date: parsed.data.endDate,
    workers_needed: parsed.data.workersNeeded,
    work_type: parsed.data.workType,
    payment_mode: parsed.data.paymentMode,
    payment_amount: parsed.data.paymentAmount,
    payment_unit_label: parsed.data.paymentUnitLabel || null,
    includes_food: parsed.data.includesFood,
    includes_lodging: parsed.data.includesLodging,
    transport_provided: parsed.data.transportProvided,
    safety_note: parsed.data.safetyNote,
    status: "pending_review",
  });
  if (error) return { ok: false, message: "No pudimos enviar la campaña a revisión." };

  await recordAnalyticsEvent("campaign_submitted", userId, campaignId);
  revalidatePath("/panel/patron");
  return { ok: true, message: "Campaña enviada. La revisaremos antes de publicarla." };
}

export async function createApplicationAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const { userId, profile, supabase } = await requireRole("worker");
  if (!profile.location_id || !profile.experience_level || !profile.available_from || !profile.availability_type) {
    return { ok: false, message: "Completa tu perfil laboral antes de postular." };
  }
  const parsed = applicationSchema.safeParse({
    campaignId: formData.get("campaignId"),
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) return { ok: false, message: firstValidationError(parsed.error) };

  const { data, error } = await supabase.from("applications").insert({
    campaign_id: parsed.data.campaignId,
    worker_id: userId,
    message: parsed.data.message || null,
    status: "pending",
  }).select("id").single();
  if (error?.code === "23505") return { ok: false, message: "Ya postulaste a esta campaña." };
  if (error || !data) return { ok: false, message: "No pudimos enviar tu postulación." };

  await recordAnalyticsEvent("application_created", userId, data.id);
  revalidatePath("/panel/trabajador");
  return { ok: true, message: "Postulación enviada. El patrón verá tu experiencia y disponibilidad." };
}

export async function withdrawApplicationAction(formData: FormData) {
  const { supabase } = await requireRole("worker");
  const applicationId = String(formData.get("applicationId") ?? "");
  if (applicationId) await supabase.rpc("withdraw_application", { target_application_id: applicationId });
  revalidatePath("/panel/trabajador");
}

export async function decideApplicationAction(formData: FormData) {
  const { supabase } = await requireRole("farmer");
  const applicationId = String(formData.get("applicationId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!applicationId) return;
  if (decision === "accept") await supabase.rpc("accept_application", { target_application_id: applicationId });
  if (decision === "reject") await supabase.rpc("reject_application", { target_application_id: applicationId });
  revalidatePath("/panel/patron", "layout");
}

export async function completeAssignmentAction(formData: FormData) {
  const { supabase } = await requireRole("farmer");
  const assignmentId = String(formData.get("assignmentId") ?? "");
  if (assignmentId) await supabase.rpc("complete_assignment", { target_assignment_id: assignmentId });
  revalidatePath("/panel/patron", "layout");
}

export async function createReportAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const { userId, supabase } = await requireProfile();
  const parsed = reportSchema.safeParse({
    reportedUserId: formData.get("reportedUserId") || undefined,
    campaignId: formData.get("campaignId") || undefined,
    type: formData.get("type"),
    description: formData.get("description"),
    evidencePath: formData.get("evidencePath") ?? "",
  });
  if (!parsed.success) return { ok: false, message: firstValidationError(parsed.error) };

  const { data, error } = await supabase.from("reports").insert({
    reporter_id: userId,
    reported_user_id: parsed.data.reportedUserId ?? null,
    campaign_id: parsed.data.campaignId ?? null,
    type: parsed.data.type,
    description: parsed.data.description,
    evidence_path: parsed.data.evidencePath || null,
    status: "open",
  }).select("id").single();
  if (error || !data) return { ok: false, message: "No pudimos recibir el reporte." };
  await recordAnalyticsEvent("report_created", userId, data.id);
  return { ok: true, message: "Reporte recibido. Solo el equipo de moderación podrá verlo." };
}

export async function createRatingAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const { userId, supabase } = await requireProfile();
  const parsed = ratingSchema.safeParse({
    assignmentId: formData.get("assignmentId"),
    campaignId: formData.get("campaignId"),
    ratedUserId: formData.get("ratedUserId"),
    score: formData.get("score"),
    comment: formData.get("comment") ?? "",
  });
  if (!parsed.success) return { ok: false, message: firstValidationError(parsed.error) };
  const { data, error } = await supabase.from("ratings").insert({
    assignment_id: parsed.data.assignmentId,
    campaign_id: parsed.data.campaignId,
    rater_id: userId,
    rated_user_id: parsed.data.ratedUserId,
    score: parsed.data.score,
    comment: parsed.data.comment || null,
    status: "pending",
  }).select("id").single();
  if (error?.code === "23505") return { ok: false, message: "Ya calificaste esta campaña." };
  if (error || !data) return { ok: false, message: "No pudimos guardar la calificación." };
  await recordAnalyticsEvent("rating_created", userId, data.id);
  return { ok: true, message: "Calificación enviada a moderación." };
}
