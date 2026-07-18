"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/actions/auth";
import { initialActionState } from "@/app/actions/types";
import { FormFeedback, SubmitButton } from "@/components/form-feedback";

export function PasswordForm() {
  const [state, action] = useActionState(changePasswordAction, initialActionState);
  return <form action={action} className="surface mt-7 space-y-5 p-5 sm:p-7"><label><span className="field-label">Nueva contraseña</span><input className="field" type="password" name="password" minLength={10} autoComplete="new-password" required /><span className="field-help">Mínimo 10 caracteres, con mayúscula, minúscula y número.</span></label><label><span className="field-label">Repite la contraseña</span><input className="field" type="password" name="confirmation" minLength={10} autoComplete="new-password" required /></label><FormFeedback state={state} /><SubmitButton pendingText="Guardando...">Guardar y continuar</SubmitButton></form>;
}
