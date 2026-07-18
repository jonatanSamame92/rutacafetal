"use client";

import { useActionState } from "react";
import { createFarmAction } from "@/app/actions/marketplace";
import { initialActionState } from "@/app/actions/types";
import { FormFeedback, SubmitButton } from "@/components/form-feedback";
import type { LocationOption } from "@/lib/types/domain";

export function FarmForm({ locations }: { locations: LocationOption[] }) {
  const [state, action] = useActionState(createFarmAction, initialActionState);
  return (
    <form action={action} className="surface space-y-5 p-5 sm:p-6">
      <div><h2 className="text-xl font-semibold">Registrar una finca</h2><p className="mt-1 text-sm text-[var(--muted)]">La registrarás una sola vez y podrás reutilizarla.</p></div>
      <label><span className="field-label">Nombre de la finca</span><input className="field" name="name" placeholder="Finca Santa Rosa" required /></label>
      <label><span className="field-label">Distrito</span><select className="select-field" name="locationId" defaultValue="" required><option value="" disabled>Elige un distrito</option>{locations.map((location) => <option key={location.id} value={location.id}>{location.district}</option>)}</select></label>
      <label><span className="field-label">Referencia para llegar</span><input className="field" name="locationReference" maxLength={300} placeholder="A 30 minutos de Jaén, por la ruta a..." required /></label>
      <label><span className="field-label">Área en hectáreas, opcional</span><input className="field" name="areaHectares" type="number" inputMode="decimal" min="0.1" step="0.1" /></label>
      <label><span className="field-label">Descripción, opcional</span><textarea className="textarea-field" name="description" maxLength={1000} /></label>
      <FormFeedback state={state} />
      <SubmitButton pendingText="Registrando finca...">Registrar finca</SubmitButton>
    </form>
  );
}
