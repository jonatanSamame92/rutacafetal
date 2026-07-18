import Link from "next/link";

export default function OfflinePage() { return <main id="contenido" className="page-shell grid min-h-dvh place-items-center py-12 text-center"><div><p className="font-semibold text-[var(--accent)]">Sin conexión</p><h1 className="mt-2 text-4xl font-semibold">No pudimos cargar esta página</h1><p className="mt-3 text-[var(--muted)]">Revisa tu señal e intenta nuevamente. Las páginas públicas visitadas pueden estar disponibles sin conexión.</p><Link href="/" className="button-primary mt-6">Volver al inicio</Link></div></main>; }
