import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PasswordForm } from "@/components/forms/password-form";
import { PublicShell } from "@/components/public-shell";
import { getAuthContext } from "@/lib/auth";

export const metadata: Metadata = { title: "Cambiar contraseña", robots: { index: false } };
export default async function ChangePasswordPage() {
  const auth = await getAuthContext();
  if (!auth) redirect("/ingresar");
  if (!auth.profile.must_change_password) redirect("/panel");
  return <PublicShell><div className="page-shell grid min-h-[70dvh] place-items-center py-12"><div className="w-full max-w-md"><h1 className="text-4xl font-semibold text-[var(--primary-strong)]">Crea tu contraseña</h1><p className="mt-3 leading-7 text-[var(--muted)]">La contraseña temporal solo sirve para el primer ingreso. Elige una nueva que no uses en otros servicios.</p><PasswordForm /></div></div></PublicShell>;
}
