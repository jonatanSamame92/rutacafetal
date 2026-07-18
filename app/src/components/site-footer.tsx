import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface-muted)]">
      <div className="page-shell grid gap-8 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="font-semibold text-[var(--primary-strong)]">Rutacafetal</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">Conectamos trabajo y confianza en las campañas de café de Jaén.</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm" aria-label="Información legal">
          <Link className="inline-flex min-h-11 min-w-11 items-center justify-center" href="/seguridad">Seguridad</Link>
          <Link className="inline-flex min-h-11 min-w-11 items-center justify-center" href="/privacidad">Privacidad</Link>
          <Link className="inline-flex min-h-11 min-w-11 items-center justify-center" href="/terminos">Términos</Link>
          <Link className="inline-flex min-h-11 min-w-11 items-center justify-center" href="/ayuda">Ayuda</Link>
        </nav>
      </div>
    </footer>
  );
}
