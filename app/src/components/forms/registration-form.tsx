"use client";

import { useActionState } from "react";
import { submitRegistrationAction } from "@/app/actions/registration";
import { initialActionState } from "@/app/actions/types";
import { FormFeedback, SubmitButton } from "@/components/form-feedback";
import type { LocationOption } from "@/lib/types/domain";

export function RegistrationForm({ locations, defaultRole }: { locations: LocationOption[]; defaultRole: "worker" | "farmer" }) {
  const [state, action] = useActionState(submitRegistrationAction, initialActionState);
  return (
    <form action={action} className="surface space-y-5 p-5 sm:p-7">
      <fieldset>
        <legend className="field-label">Quiero usar Rutacafetal como</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] p-3"><input type="radio" name="role" value="worker" defaultChecked={defaultRole === "worker"} /> <span><strong className="block">Trabajador</strong><span className="text-sm text-[var(--muted)]">Buscar y postular</span></span></label>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] p-3"><input type="radio" name="role" value="farmer" defaultChecked={defaultRole === "farmer"} /> <span><strong className="block">Patrón</strong><span className="text-sm text-[var(--muted)]">Publicar campañas</span></span></label>
        </div>
      </fieldset>
      <label><span className="field-label">Nombre completo *</span><input className="field" name="fullName" autoComplete="name" minLength={3} maxLength={120} required /></label>
      <label><span className="field-label">Celular *</span><input className="field" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="987 654 321" required /><span className="field-help">Debe ser un celular peruano de 9 dígitos.</span></label>
      <label><span className="field-label">Distrito *</span><select className="select-field" name="locationId" defaultValue="" required><option value="" disabled>Elige tu distrito</option>{locations.map((location) => <option key={location.id} value={location.id}>{location.district}</option>)}</select></label>
      <label><span className="field-label">Correo opcional</span><input className="field" name="email" type="email" inputMode="email" autoComplete="email" /></label>
      <label><span className="field-label">Cuéntanos lo necesario</span><textarea className="textarea-field" name="note" maxLength={500} placeholder="Ejemplo: Tengo experiencia en dos campañas de café." /></label>
      <label className="flex items-start gap-3 text-sm leading-6"><input className="mt-1 size-5 shrink-0" type="checkbox" name="consent" required /><span>Acepto que Rutacafetal use estos datos para revisar mi solicitud, contactarme y administrar mi cuenta. Consulta la <a href="/privacidad" className="font-semibold underline">política de privacidad</a>.</span></label>
      <FormFeedback state={state} />
      <SubmitButton pendingText="Enviando solicitud...">Enviar solicitud</SubmitButton>
    </form>
  );
}
