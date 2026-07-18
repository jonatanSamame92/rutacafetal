"use client";

import { useActionState } from "react";
import { createReportAction } from "@/app/actions/marketplace";
import { initialActionState } from "@/app/actions/types";
import { FormFeedback, SubmitButton } from "@/components/form-feedback";

export function ReportForm({ reportedUserId, campaignId }: { reportedUserId?: string; campaignId?: string }) {
  const [state, action] = useActionState(createReportAction, initialActionState);
  return (
    <form action={action} className="space-y-4">
      {reportedUserId ? <input type="hidden" name="reportedUserId" value={reportedUserId} /> : null}
      {campaignId ? <input type="hidden" name="campaignId" value={campaignId} /> : null}
      <label><span className="field-label">Motivo</span><select className="select-field" name="type" defaultValue="unsafe_conditions"><option value="no_payment">Falta de pago</option><option value="abuse">Maltrato o abuso</option><option value="theft">Robo</option><option value="unsafe_conditions">Condiciones inseguras</option><option value="fraud">Información falsa</option><option value="other">Otro</option></select></label>
      <label><span className="field-label">Describe lo ocurrido</span><textarea className="textarea-field" name="description" minLength={20} maxLength={2000} required /></label>
      <label><span className="field-label">Enlace de evidencia, opcional</span><input className="field" type="url" inputMode="url" name="evidencePath" placeholder="https://..." /><span className="field-help">Puede ser un enlace privado a una foto o documento. Moderación será la única que lo vea.</span></label>
      <FormFeedback state={state} />
      <SubmitButton pendingText="Enviando reporte..." className="button-danger w-full">Enviar reporte privado</SubmitButton>
    </form>
  );
}
