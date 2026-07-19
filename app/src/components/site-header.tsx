import Link from "next/link";
import { getAuthContext } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export async function SiteHeader() {
  const auth = await getAuthContext();
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_94%,transparent)] backdrop-blur-md">
      <div className="page-shell flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-h-12 items-center gap-2.5 font-semibold tracking-tight text-[var(--primary-strong)]" aria-label="Rutacafetal, inicio">
          <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--primary)] text-base font-bold text-white" aria-hidden="true">R</span>
          <span>Rutacafetal</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium" aria-label="Navegación principal">
          <ThemeToggle />
          <Link className="button-quiet header-campaigns-link" href="/campanas">Campañas</Link>
          {auth ? (
            <Link className="button-primary" href="/panel">Mi panel</Link>
          ) : (
            <>
              <Link className="button-quiet header-login-link" href="/ingresar">Ingresar</Link>
              <Link className="button-primary" href="/registro">Solicitar acceso</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
