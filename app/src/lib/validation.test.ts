import { describe, expect, it } from "vitest";
import { buildSupportContact, normalizePeruPhone } from "@/lib/phone";
import { campaignSchema, registrationRequestSchema, reportSchema } from "@/lib/validation";

const locationId = "00000000-0000-4000-8000-000000000001";

describe("normalizePeruPhone", () => {
  it("normaliza celulares locales y conserva el prefijo de Perú", () => {
    expect(normalizePeruPhone("987 654 321")).toBe("+51987654321");
    expect(normalizePeruPhone("+51 987-654-321")).toBe("+51987654321");
  });

  it("construye un canal de soporte solo con un celular peruano válido", () => {
    expect(buildSupportContact("987 654 321")).toEqual({
      label: "987 654 321",
      url: "https://wa.me/51987654321?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20Rutacafetal.",
    });
    expect(buildSupportContact("12345")).toBeNull();
  });
});

describe("registrationRequestSchema", () => {
  it("acepta solo los datos mínimos del piloto", () => {
    const parsed = registrationRequestSchema.safeParse({ role: "worker", fullName: "Ana Pérez", phone: "987654321", email: "", locationId, note: "", consent: "on" });
    expect(parsed.success).toBe(true);
  });

  it("rechaza celulares y consentimiento inválidos", () => {
    expect(registrationRequestSchema.safeParse({ role: "worker", fullName: "Ana Pérez", phone: "123", email: "", locationId, note: "" }).success).toBe(false);
  });
});

describe("campaignSchema", () => {
  it("rechaza una campaña que termina antes de comenzar", () => {
    const parsed = campaignSchema.safeParse({ farmId: locationId, title: "Cosecha de café", description: "Trabajo selectivo durante toda la campaña.", locationId, startDate: "2026-09-10", endDate: "2026-09-01", workersNeeded: 4, workType: "harvest", paymentMode: "per_day", paymentAmount: 60, paymentUnitLabel: "", includesFood: true, includesLodging: false, transportProvided: false, safetyNote: "Se brinda charla y herramientas seguras." });
    expect(parsed.success).toBe(false);
  });
});

describe("reportSchema", () => {
  it("acepta evidencia https y rechaza protocolos inseguros", () => {
    const base = { campaignId: locationId, type: "fraud", description: "La información publicada no coincide con el trabajo." };
    expect(reportSchema.safeParse({ ...base, evidencePath: "https://example.com/evidencia" }).success).toBe(true);
    expect(reportSchema.safeParse({ ...base, evidencePath: "javascript:alert(1)" }).success).toBe(false);
  });
});
