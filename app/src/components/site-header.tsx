import Link from "next/link";

export function SiteHeader() {
  return <header className="border-b border-[#dcd7c9] bg-[#fbfaf5]"><div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"><Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-[#173624]"><span className="flex size-8 items-center justify-center rounded-full bg-[#28533b] text-sm text-white" aria-hidden="true">R</span><span>Rutacafetal</span></Link><nav className="flex items-center gap-3 text-sm font-medium" aria-label="Navegación principal"><Link className="hidden text-[#405246] hover:text-[#173624] sm:inline" href="/campanas">Ver campañas</Link><Link className="rounded-full bg-[#28533b] px-4 py-2 text-white transition hover:bg-[#173624]" href="/registro">Crear perfil</Link></nav></div></header>;
}
