import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Ingresar" };

export default function SignInPage() {
  return <><SiteHeader /><main className="mx-auto max-w-lg px-4 py-12 sm:px-6"><p className="text-sm font-semibold tracking-wide text-[#74502d]">ACCESO SEGURO</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#173624]">Ingresa a tu cuenta</h1><div className="mt-7 rounded-2xl border border-[#dcd7c9] bg-[#fbfaf5] p-6"><p className="leading-7 text-[#526257]">El acceso estará disponible cuando se configure el método de verificación de teléfono o correo para el primer lanzamiento.</p><Link href="/registro" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-[#28533b] px-4 font-semibold text-[#28533b] transition hover:bg-[#eef4e6]">Volver a crear perfil</Link></div></main></>;
}
