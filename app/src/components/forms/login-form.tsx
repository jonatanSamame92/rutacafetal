"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { initialActionState } from "@/app/actions/types";
import { FormFeedback, SubmitButton } from "@/components/form-feedback";

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialActionState);
  return (
    <form action={action} className="surface mt-7 space-y-5 p-5 sm:p-7">
      <label><span className="field-label">Celular</span><input className="field" type="tel" name="phone" inputMode="tel" autoComplete="tel" placeholder="987 654 321" required /></label>
      <label><span className="field-label">Contraseña</span><input className="field" type="password" name="password" autoComplete="current-password" minLength={8} required /></label>
      <FormFeedback state={state} />
      <SubmitButton pendingText="Ingresando...">Ingresar</SubmitButton>
      <p className="text-sm leading-6 text-[var(--muted)]">Si olvidaste tu contraseña, solicita ayuda al administrador. La recuperación es manual durante el piloto.</p>
    </form>
  );
}
