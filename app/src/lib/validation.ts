import { z } from "zod";
import { normalizePeruPhone } from "@/lib/phone";

const phoneSchema = z
  .string()
  .trim()
  .transform(normalizePeruPhone)
  .refine((value) => /^\+51[0-9]{9}$/.test(value), "Ingresa un celular peruano de 9 dígitos.");

export const registrationRequestSchema = z.object({
  role: z.enum(["worker", "farmer"]),
  fullName: z.string().trim().min(3, "Escribe tu nombre completo.").max(120),
  phone: phoneSchema,
  email: z.string().trim().email("El correo no es válido.").or(z.literal("")).optional(),
  locationId: z.string().uuid("Elige un distrito."),
  note: z.string().trim().max(500).optional(),
  consent: z.literal("on", { message: "Debes aceptar el uso de tus datos para enviar la solicitud." }),
});

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(10, "Usa al menos 10 caracteres.")
      .regex(/[A-Z]/, "Incluye una mayúscula.")
      .regex(/[a-z]/, "Incluye una minúscula.")
      .regex(/[0-9]/, "Incluye un número."),
    confirmation: z.string(),
  })
  .refine((data) => data.password === data.confirmation, {
    path: ["confirmation"],
    message: "Las contraseñas no coinciden.",
  });

export const workerProfileSchema = z.object({
  fullName: z.string().trim().min(3).max(120),
  locationId: z.string().uuid(),
  experienceLevel: z.enum(["less_than_1", "1_to_3", "3_plus"]),
  availableFrom: z.string().date(),
  availabilityType: z.enum(["current_campaign", "rotating_campaigns", "occasional"]),
  paymentPreference: z.enum(["per_day", "per_week", "per_unit"]),
  acceptsLodging: z.boolean(),
  bio: z.string().trim().max(500),
});

export const farmerProfileSchema = z.object({
  fullName: z.string().trim().min(3).max(120),
  locationId: z.string().uuid(),
  operationZone: z.string().trim().min(3).max(150),
  cooperativeName: z.string().trim().max(150),
  bio: z.string().trim().max(500),
});

export const farmSchema = z.object({
  name: z.string().trim().min(2).max(120),
  locationId: z.string().uuid(),
  locationReference: z.string().trim().min(5).max(300),
  description: z.string().trim().max(1000),
  areaHectares: z.coerce.number().positive().max(100000).optional(),
});

export const campaignSchema = z
  .object({
    farmId: z.string().uuid(),
    title: z.string().trim().min(5).max(120),
    description: z.string().trim().min(20).max(2000),
    locationId: z.string().uuid(),
    startDate: z.string().date(),
    endDate: z.string().date(),
    workersNeeded: z.coerce.number().int().min(1).max(500),
    workType: z.enum(["harvest", "maintenance", "postharvest", "mixed"]),
    paymentMode: z.enum(["per_day", "per_week", "per_unit"]),
    paymentAmount: z.coerce.number().positive().max(100000),
    paymentUnitLabel: z.string().trim().max(80),
    includesFood: z.boolean(),
    includesLodging: z.boolean(),
    transportProvided: z.boolean(),
    safetyNote: z.string().trim().min(10).max(1000),
  })
  .refine((data) => data.endDate >= data.startDate, {
    path: ["endDate"],
    message: "La fecha final debe ser igual o posterior al inicio.",
  });

export const applicationSchema = z.object({
  campaignId: z.string().uuid(),
  message: z.string().trim().max(500),
});

export const reportSchema = z.object({
  reportedUserId: z.string().uuid().optional(),
  campaignId: z.string().uuid().optional(),
  type: z.enum(["no_payment", "abuse", "theft", "unsafe_conditions", "fraud", "other"]),
  description: z.string().trim().min(20).max(2000),
  evidencePath: z.string().trim().url("La evidencia debe ser un enlace válido.").refine((value) => /^https?:\/\//i.test(value), "Usa un enlace que empiece con http o https.").or(z.literal("")).optional(),
}).refine((value) => value.reportedUserId || value.campaignId, {
  message: "El reporte debe estar asociado a una persona o campaña.",
});

export const ratingSchema = z.object({
  assignmentId: z.string().uuid(),
  campaignId: z.string().uuid(),
  ratedUserId: z.string().uuid(),
  score: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(500),
});

export function firstValidationError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Revisa los datos ingresados.";
}

export function formBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
