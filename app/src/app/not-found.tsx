import Link from "next/link";
import { PublicShell } from "@/components/public-shell";

export default function NotFound() {
  return <PublicShell><div className="page-shell grid min-h-[65dvh] place-items-center py-12 text-center"><div><p className="font-semibold text-[var(--accent)]">Página no encontrada</p><h1 className="mt-2 text-4xl font-semibold text-[var(--primary-strong)]">Aquí no hay una campaña</h1><p className="mt-3 text-[var(--muted)]">El enlace puede haber cambiado o la campaña ya no está disponible.</p><Link className="button-primary mt-6" href="/campanas">Ver campañas</Link></div></div></PublicShell>;
}
