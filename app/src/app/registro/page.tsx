import type { Metadata } from "next";
import { RegistrationForm } from "@/components/forms/registration-form";
import { PublicShell } from "@/components/public-shell";
import { getLocations } from "@/lib/data/campaigns";

export const metadata: Metadata = { title: "Solicitar acceso", robots: { index: false } };

export default async function RegistrationPage({ searchParams }: { searchParams: Promise<{ rol?: string }> }) {
  const [{ rol }, locations] = await Promise.all([searchParams, getLocations()]);
  const defaultRole = rol === "farmer" ? "farmer" : "worker";
  return (
    <PublicShell>
      <div className="page-shell grid gap-10 py-10 lg:grid-cols-[0.75fr_1.25fr] lg:py-16">
        <div>
          <h1 className="text-4xl font-semibold text-[var(--primary-strong)] sm:text-5xl">Solicita tu acceso</h1>
          <p className="mt-4 max-w-lg leading-7 text-[var(--muted)]">Durante el piloto revisamos cada solicitud. Si la aprobamos, recibirás una contraseña temporal y deberás cambiarla al ingresar.</p>
          <div className="mt-8 border-t border-[var(--border)] pt-6 text-sm leading-6 text-[var(--muted)]">
            <p><strong className="text-[var(--foreground)]">No pedimos DNI.</strong> Tu celular se usa para validar la solicitud y habilitar el contacto protegido.</p>
            <p className="mt-3">La aprobación manual nos ayuda a reducir perfiles falsos y campañas engañosas durante el inicio.</p>
          </div>
        </div>
        <RegistrationForm locations={locations} defaultRole={defaultRole} />
      </div>
    </PublicShell>
  );
}
