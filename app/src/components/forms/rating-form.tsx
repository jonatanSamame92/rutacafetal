"use client";

import { useActionState } from "react";
import { createRatingAction } from "@/app/actions/marketplace";
import { initialActionState } from "@/app/actions/types";
import { FormFeedback, SubmitButton } from "@/components/form-feedback";

export function RatingForm({ assignmentId, campaignId, ratedUserId }: { assignmentId: string; campaignId: string; ratedUserId: string }) {
  const [state, action] = useActionState(createRatingAction, initialActionState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="assignmentId" value={assignmentId} /><input type="hidden" name="campaignId" value={campaignId} /><input type="hidden" name="ratedUserId" value={ratedUserId} />
      <label><span className="field-label">Calificación</span><select className="select-field" name="score" defaultValue="5"><option value="5">5, excelente</option><option value="4">4, buena</option><option value="3">3, regular</option><option value="2">2, mala</option><option value="1">1, muy mala</option></select></label>
      <label><span className="field-label">Comentario, opcional</span><textarea className="textarea-field" name="comment" maxLength={500} /></label>
      <FormFeedback state={state} />
      <SubmitButton pendingText="Enviando calificación...">Enviar a moderación</SubmitButton>
    </form>
  );
}
