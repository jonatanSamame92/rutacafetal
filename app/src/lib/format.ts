import type { PaymentMode, WorkType } from "@/lib/types/database";

const dateFormatter = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`));
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export const workTypeLabels: Record<WorkType, string> = {
  harvest: "Cosecha",
  maintenance: "Mantenimiento",
  postharvest: "Postcosecha",
  mixed: "Trabajo mixto",
};

export const paymentModeLabels: Record<PaymentMode, string> = {
  per_day: "por día",
  per_week: "por semana",
  per_unit: "por arroba",
};

export const campaignStatusLabels = {
  draft: "Borrador",
  pending_review: "En revisión",
  published: "Publicada",
  closed: "Cerrada",
  rejected: "Observada",
  cancelled: "Cancelada",
} as const;

export const applicationStatusLabels = {
  pending: "Pendiente",
  accepted: "Aceptada",
  rejected: "No seleccionada",
  withdrawn: "Retirada",
} as const;
