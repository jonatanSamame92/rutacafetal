"use client";

import { useActionState } from "react";
import { createApplicationAction } from "@/app/actions/marketplace";
import { initialActionState } from "@/app/actions/types";
import { FormFeedback, SubmitButton } from "@/components/form-feedback";

export function ApplicationForm({ campaignId }: { campaignId: string }) {
  const [state, action] = useActionState(createApplicationAction, initialActionState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="campaignId" value={campaignId} />
      <label><span className="field-label">Mensaje opcional</span><textarea className="textarea-field min-h-24" name="message" maxLength={500} placeholder="Ejemplo: Estoy disponible desde el inicio y tengo experiencia en cosecha." /></label>
      <FormFeedback state={state} />
      <SubmitButton pendingText="Enviando...">Postular a esta campaña</SubmitButton>
    </form>
  );
}
