"use client";

import { useActionState } from "react";
import { approveRegistrationAction } from "@/app/actions/registration";
import { resetPasswordAction } from "@/app/actions/admin";
import type { ApprovalState } from "@/app/actions/types";
import { SubmitButton } from "@/components/form-feedback";

const initialState: ApprovalState = { ok: false, message: "" };

function CredentialResult({ state }: { state: ApprovalState }) {
  if (!state.message) return null;
  return <div className="status-message mt-3" data-state={state.ok ? "success" : "error"} role={state.ok ? "status" : "alert"}><p>{state.message}</p>{state.credentials ? <dl className="mt-3 grid gap-2 rounded-lg bg-[var(--surface)] p-3 text-sm"><div><dt className="text-[var(--muted)]">Persona</dt><dd className="font-semibold">{state.credentials.fullName}</dd></div><div><dt className="text-[var(--muted)]">Celular</dt><dd className="font-mono font-semibold">{state.credentials.phone}</dd></div><div><dt className="text-[var(--muted)]">Contraseña temporal</dt><dd className="break-all font-mono font-semibold">{state.credentials.temporaryPassword}</dd></div></dl> : null}</div>;
}

export function ApproveRegistrationForm({ requestId }: { requestId: string }) {
  const [state, action] = useActionState(approveRegistrationAction, initialState);
  return <form action={action}><input type="hidden" name="requestId" value={requestId} /><SubmitButton className="button-primary" pendingText="Creando cuenta...">Aprobar y crear cuenta</SubmitButton><CredentialResult state={state} /></form>;
}

export function ResetPasswordForm({ profileId }: { profileId: string }) {
  const [state, action] = useActionState(resetPasswordAction, initialState);
  return <form action={action}><input type="hidden" name="profileId" value={profileId} /><SubmitButton className="button-quiet" pendingText="Restableciendo...">Crear clave temporal</SubmitButton><CredentialResult state={state} /></form>;
}
