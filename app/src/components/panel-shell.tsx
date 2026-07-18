import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import type { Profile } from "@/lib/auth";

export function PanelShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const links = profile.role === "worker"
    ? [{ href: "/panel/trabajador", label: "Mi trabajo" }, { href: "/campanas", label: "Buscar campañas" }]
    : profile.role === "farmer"
      ? [{ href: "/panel/patron", label: "Mis campañas" }, { href: "/panel/patron/campanas/nueva", label: "Crear campaña" }]
      : [{ href: "/panel/admin", label: "Moderación" }, { href: "/campanas", label: "Vista pública" }];

  return (
    <div className="min-h-dvh bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="page-shell flex min-h-16 items-center justify-between gap-4">
          <Link href="/panel" className="flex min-h-12 items-center gap-2.5 font-semibold text-[var(--primary-strong)]"><span className="flex size-9 items-center justify-center rounded-lg bg-[var(--primary)] text-white" aria-hidden="true">R</span><span>Rutacafetal</span></Link>
          <form action={logoutAction}><button type="submit" className="button-quiet">Salir</button></form>
        </div>
      </header>
      <div className="page-shell grid gap-6 py-6 lg:grid-cols-[13rem_1fr] lg:py-10">
        <aside>
          <p className="text-sm font-semibold">{profile.full_name}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{profile.role === "worker" ? "Trabajador" : profile.role === "farmer" ? "Patrón de finca" : "Administrador"}</p>
          <nav className="mt-4 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Navegación del panel">
            {links.map((link) => <Link key={link.href} href={link.href} className="button-quiet shrink-0 justify-start">{link.label}</Link>)}
          </nav>
        </aside>
        <main id="contenido" className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
