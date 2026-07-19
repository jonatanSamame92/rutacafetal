import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { PublicShell } from "@/components/public-shell";

export default function SuspendedPage() {
  return (
    <PublicShell>
      <div className="page-shell grid min-h-[70dvh] place-items-center py-12 text-center">
        <div className="max-w-lg">
          <p className="font-semibold text-[var(--danger)]">Cuenta suspendida</p>
          <h1 className="mt-2 text-4xl font-semibold">No puedes realizar acciones por ahora</h1>
          <p className="mt-3 leading-7 text-[var(--muted)]">Contacta al administrador para conocer el motivo y solicitar una revisión. Tus datos privados siguen protegidos.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link className="button-primary" href="/ayuda">Solicitar revisión</Link>
            <form action={logoutAction}><button className="button-secondary" type="submit">Salir de la cuenta</button></form>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
