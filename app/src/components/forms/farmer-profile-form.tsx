"use client";

import { useActionState } from "react";
import { updateFarmerProfileAction } from "@/app/actions/marketplace";
import { initialActionState } from "@/app/actions/types";
import { FormFeedback, SubmitButton } from "@/components/form-feedback";
import type { Profile } from "@/lib/auth";
import type { LocationOption } from "@/lib/types/domain";

export function FarmerProfileForm({ profile, locations }: { profile: Profile; locations: LocationOption[] }) {
  const [state, action] = useActionState(updateFarmerProfileAction, initialActionState);
  return (
    <form action={action} className="surface space-y-5 p-5 sm:p-6">
      <div><h2 className="text-xl font-semibold">Perfil del patrón</h2><p className="mt-1 text-sm text-[var(--muted)]">Presenta quién contrata y en qué zona trabaja.</p></div>
      <label><span className="field-label">Nombre o razón social</span><input className="field" name="fullName" defaultValue={profile.full_name} required /></label>
      <label><span className="field-label">Distrito principal</span><select className="select-field" name="locationId" defaultValue={profile.location_id ?? ""} required><option value="" disabled>Elige un distrito</option>{locations.map((location) => <option key={location.id} value={location.id}>{location.district}</option>)}</select></label>
      <label><span className="field-label">Zona de operación</span><input className="field" name="operationZone" defaultValue={profile.operation_zone ?? ""} placeholder="Ejemplo: Jaén, Chontalí y Huabal" required /></label>
      <label><span className="field-label">Cooperativa o empresa, opcional</span><input className="field" name="cooperativeName" defaultValue={profile.cooperative_name ?? ""} /></label>
      <label><span className="field-label">Descripción breve</span><textarea className="textarea-field" name="bio" maxLength={500} defaultValue={profile.bio ?? ""} placeholder="Cuenta cómo organizas tus campañas y el trabajo en finca." /></label>
      <FormFeedback state={state} />
      <SubmitButton pendingText="Guardando perfil...">Guardar perfil</SubmitButton>
    </form>
  );
}
