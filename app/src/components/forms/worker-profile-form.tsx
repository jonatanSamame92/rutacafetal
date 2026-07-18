"use client";

import { useActionState } from "react";
import { updateWorkerProfileAction } from "@/app/actions/marketplace";
import { initialActionState } from "@/app/actions/types";
import { FormFeedback, SubmitButton } from "@/components/form-feedback";
import type { Profile } from "@/lib/auth";
import type { LocationOption } from "@/lib/types/domain";

export function WorkerProfileForm({ profile, locations }: { profile: Profile; locations: LocationOption[] }) {
  const [state, action] = useActionState(updateWorkerProfileAction, initialActionState);
  return (
    <form action={action} className="surface space-y-5 p-5 sm:p-6">
      <div>
        <h2 className="text-xl font-semibold">Tu perfil laboral</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Estos datos ayudan al patrón a decidir. Tu celular permanece oculto.</p>
      </div>
      <label><span className="field-label">Nombre completo</span><input className="field" name="fullName" autoComplete="name" defaultValue={profile.full_name} required /></label>
      <label><span className="field-label">Distrito donde vives</span><select className="select-field" name="locationId" defaultValue={profile.location_id ?? ""} required><option value="" disabled>Elige un distrito</option>{locations.map((location) => <option key={location.id} value={location.id}>{location.district}</option>)}</select></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label><span className="field-label">Experiencia en café</span><select className="select-field" name="experienceLevel" defaultValue={profile.experience_level ?? ""} required><option value="" disabled>Selecciona</option><option value="less_than_1">Menos de 1 año</option><option value="1_to_3">Entre 1 y 3 años</option><option value="3_plus">Más de 3 años</option></select></label>
        <label><span className="field-label">Disponible desde</span><input className="field" name="availableFrom" type="date" defaultValue={profile.available_from ?? ""} required /></label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label><span className="field-label">Disponibilidad</span><select className="select-field" name="availabilityType" defaultValue={profile.availability_type ?? ""} required><option value="" disabled>Selecciona</option><option value="current_campaign">Solo campaña actual</option><option value="rotating_campaigns">Puedo rotar entre campañas</option><option value="occasional">Trabajo ocasional</option></select></label>
        <label><span className="field-label">Preferencia de pago</span><select className="select-field" name="paymentPreference" defaultValue={profile.payment_preference ?? ""} required><option value="" disabled>Selecciona</option><option value="per_day">Por día</option><option value="per_week">Por semana</option><option value="per_unit">Por arroba</option></select></label>
      </div>
      <label><span className="field-label">Experiencia breve</span><textarea className="textarea-field" name="bio" maxLength={500} defaultValue={profile.bio ?? ""} placeholder="Ejemplo: He trabajado dos campañas en cosecha selectiva." /></label>
      <label className="flex min-h-12 items-center gap-3 rounded-lg border border-[var(--border)] p-3"><input className="size-5" type="checkbox" name="acceptsLodging" defaultChecked={Boolean(profile.accepts_lodging)} /><span>Acepto campañas con alojamiento</span></label>
      <FormFeedback state={state} />
      <SubmitButton pendingText="Guardando perfil...">Guardar perfil</SubmitButton>
    </form>
  );
}
