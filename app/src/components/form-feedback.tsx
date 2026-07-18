"use client";

import { useFormStatus } from "react-dom";
import type { ActionState } from "@/app/actions/types";

export function SubmitButton({ children, pendingText = "Guardando...", className = "button-primary w-full" }: { children: React.ReactNode; pendingText?: string; className?: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={className}>{pending ? pendingText : children}</button>;
}

export function FormFeedback({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return <p className="status-message" data-state={state.ok ? "success" : "error"} role={state.ok ? "status" : "alert"}>{state.message}</p>;
}
