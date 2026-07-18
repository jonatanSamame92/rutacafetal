"use client";

import { useActionState } from "react";
import { createCampaignAction } from "@/app/actions/marketplace";
import { initialActionState } from "@/app/actions/types";
import { FormFeedback, SubmitButton } from "@/components/form-feedback";
import type { Database } from "@/lib/types/database";
import type { LocationOption } from "@/lib/types/domain";

type Farm = Database["public"]["Tables"]["farms"]["Row"];

export function CampaignForm({ farms, locations }: { farms: Farm[]; locations: LocationOption[] }) {
  const [state, action] = useActionState(createCampaignAction, initialActionState);
  return (
    <form action={action} className="surface space-y-6 p-5 sm:p-7">
      <div><h2 className="text-xl font-semibold">Datos de la campaña</h2><p className="mt-1 text-sm text-[var(--muted)]">La campaña quedará en revisión antes de aparecer públicamente.</p></div>
      <label><span className="field-label">Finca</span><select className="select-field" name="farmId" defaultValue="" required><option value="" disabled>Elige una finca</option>{farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</select></label>
      <label><span className="field-label">Título</span><input className="field" name="title" maxLength={120} placeholder="Cosecha de café en Finca Santa Rosa" required /></label>
      <label><span className="field-label">Descripción del trabajo</span><textarea className="textarea-field" name="description" minLength={20} maxLength={2000} placeholder="Explica tareas, horario aproximado y experiencia deseada." required /></label>
      <div className="grid gap-5 sm:grid-cols-2"><label><span className="field-label">Distrito</span><select className="select-field" name="locationId" defaultValue="" required><option value="" disabled>Elige un distrito</option>{locations.map((location) => <option key={location.id} value={location.id}>{location.district}</option>)}</select></label><label><span className="field-label">Personas necesarias</span><input className="field" name="workersNeeded" type="number" inputMode="numeric" min="1" max="500" required /></label></div>
      <div className="grid gap-5 sm:grid-cols-2"><label><span className="field-label">Fecha de inicio</span><input className="field" name="startDate" type="date" required /></label><label><span className="field-label">Fecha de fin</span><input className="field" name="endDate" type="date" required /></label></div>
      <div className="grid gap-5 sm:grid-cols-2"><label><span className="field-label">Tipo de trabajo</span><select className="select-field" name="workType" defaultValue="harvest"><option value="harvest">Cosecha</option><option value="maintenance">Mantenimiento</option><option value="postharvest">Postcosecha</option><option value="mixed">Trabajo mixto</option></select></label><label><span className="field-label">Forma de pago</span><select className="select-field" name="paymentMode" defaultValue="per_day"><option value="per_day">Por día</option><option value="per_week">Por semana</option><option value="per_unit">Por arroba</option></select></label></div>
      <div className="grid gap-5 sm:grid-cols-2"><label><span className="field-label">Monto aproximado (S/)</span><input className="field" name="paymentAmount" type="number" inputMode="decimal" min="1" step="0.5" required /></label><label><span className="field-label">Unidad o detalle, opcional</span><input className="field" name="paymentUnitLabel" maxLength={80} placeholder="Ejemplo: por arroba" /></label></div>
      <fieldset><legend className="field-label">Condiciones incluidas</legend><div className="grid gap-3 sm:grid-cols-3">{[["includesFood", "Comida"], ["includesLodging", "Alojamiento"], ["transportProvided", "Movilidad"]].map(([name, label]) => <label key={name} className="flex min-h-12 items-center gap-3 rounded-lg border border-[var(--border)] p-3"><input className="size-5" type="checkbox" name={name} /><span>{label}</span></label>)}</div></fieldset>
      <label><span className="field-label">Seguridad y normas</span><textarea className="textarea-field" name="safetyNote" minLength={10} maxLength={1000} placeholder="Indica herramientas, ropa necesaria, riesgos y charla de seguridad." required /></label>
      <FormFeedback state={state} />
      <SubmitButton pendingText="Enviando a revisión...">Enviar campaña a revisión</SubmitButton>
    </form>
  );
}
