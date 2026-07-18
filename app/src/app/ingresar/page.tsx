import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { PublicShell } from "@/components/public-shell";

export const metadata: Metadata = { title: "Ingresar", robots: { index: false } };

export default function LoginPage() {
  return (
    <PublicShell>
      <div className="page-shell grid min-h-[70dvh] place-items-center py-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-semibold text-[var(--primary-strong)]">Ingresa a tu cuenta</h1>
          <p className="mt-3 leading-7 text-[var(--muted)]">Usa el celular y la contraseña que recibiste al aprobarse tu solicitud.</p>
          <LoginForm />
          <p className="mt-5 text-center text-sm text-[var(--muted)]">¿Todavía no tienes cuenta? <Link href="/registro" className="font-semibold text-[var(--primary-strong)] underline">Solicita acceso</Link>.</p>
        </div>
      </div>
    </PublicShell>
  );
}
