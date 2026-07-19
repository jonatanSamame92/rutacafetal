import Image from "next/image";
import Link from "next/link";
import { CampaignCard } from "@/components/campaign-card";
import { PublicShell } from "@/components/public-shell";
import { getLocations, getPublicCampaigns } from "@/lib/data/campaigns";

export default async function HomePage() {
  const [campaigns, locations] = await Promise.all([getPublicCampaigns(), getLocations()]);
  return (
    <PublicShell>
      <section className="border-b border-[var(--border)] bg-[var(--primary-soft)]">
        <div className="page-shell grid min-h-[calc(100dvh-6.5rem)] items-center gap-9 py-10 md:grid-cols-[1.03fr_0.97fr] md:py-14">
          <div className="max-w-2xl">
            <p className="font-semibold text-[var(--accent)]">Trabajo cafetalero en Jaén</p>
            <h1 className="mt-4 max-w-[13ch] text-5xl font-semibold leading-[1.02] text-[var(--primary-strong)] sm:text-6xl lg:text-7xl">Encuentra una campaña que te convenga.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">Compara pago, fechas, comida y alojamiento antes de postular. El contacto se comparte solo después de una aceptación.</p>
            <form action="/campanas" className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row" aria-label="Buscar campañas por distrito">
              <label className="sr-only" htmlFor="district">Distrito</label>
              <select className="select-field sm:flex-1" id="district" name="district" defaultValue="">
                <option value="">Todos los distritos</option>
                {locations.map((location) => <option key={location.id} value={location.district}>{location.district}</option>)}
              </select>
              <button className="button-primary whitespace-nowrap" type="submit">Buscar campañas</button>
            </form>
          </div>
          <div className="relative min-h-[22rem] overflow-hidden rounded-2xl md:min-h-[34rem]">
            <Image src="/images/hero-cafetal.webp" alt="Dos caficultores coordinan una jornada de cosecha en un cafetal de Jaén" fill priority sizes="(max-width: 768px) 100vw, 48vw" className="object-cover object-[62%_center]" />
          </div>
        </div>
      </section>

      <section className="page-shell py-16 sm:py-20">
        <h2 className="text-3xl font-semibold text-[var(--primary-strong)] sm:text-4xl">Campañas disponibles</h2>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">Cada ficha muestra las condiciones principales para que puedas comparar sin llamar finca por finca.</p>
        {campaigns.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.slice(0, 3).map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}
          </div>
        ) : (
          <div className="surface mt-8 p-6"><h3 className="text-lg font-semibold">Aún no hay campañas publicadas</h3><p className="mt-2 text-[var(--muted)]">Estamos revisando las primeras oportunidades. Vuelve pronto o solicita acceso como patrón.</p></div>
        )}
        <Link href="/campanas" className="button-secondary mt-8">Ver todas las campañas</Link>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="page-shell grid gap-10 py-16 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="text-3xl font-semibold text-[var(--primary-strong)]">Decide con condiciones claras</h2>
            <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">Rutacafetal muestra pago, duración, ubicación aproximada y beneficios antes de que alguien se comprometa.</p>
          </div>
          <ol className="space-y-6">
            <li className="grid grid-cols-[2rem_1fr] gap-3"><span className="font-mono font-semibold text-[var(--accent)]">1</span><div><h3 className="font-semibold">Revisa la campaña</h3><p className="mt-1 text-sm leading-6 text-[var(--muted)]">Compara trabajo, fechas, pago y condiciones.</p></div></li>
            <li className="grid grid-cols-[2rem_1fr] gap-3"><span className="font-mono font-semibold text-[var(--accent)]">2</span><div><h3 className="font-semibold">Postula con tu perfil</h3><p className="mt-1 text-sm leading-6 text-[var(--muted)]">El patrón ve tu experiencia, distrito y disponibilidad.</p></div></li>
            <li className="grid grid-cols-[2rem_1fr] gap-3"><span className="font-mono font-semibold text-[var(--accent)]">3</span><div><h3 className="font-semibold">Coordina por WhatsApp</h3><p className="mt-1 text-sm leading-6 text-[var(--muted)]">El botón aparece al patrón después de aceptar la postulación.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="page-shell grid gap-8 py-16 sm:py-20 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-3xl font-semibold text-[var(--primary-strong)]">¿Buscas trabajadores para tu finca?</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">Registra una finca, envía la campaña a revisión y recibe postulaciones ordenadas en un solo lugar.</p>
        </div>
        <Link href="/registro?rol=farmer" className="button-primary">Solicitar acceso como patrón</Link>
      </section>
    </PublicShell>
  );
}
