import Link from "next/link";

export default function NotFound() {
  return <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6"><p className="text-sm font-semibold tracking-wide text-[#74502d]">404</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#173624]">No encontramos esta campaña.</h1><p className="mt-4 leading-7 text-[#526257]">Puede que ya haya cerrado o que la dirección no sea correcta.</p><Link className="mt-7 font-semibold text-[#28533b] underline underline-offset-4" href="/campanas">Ver campañas disponibles</Link></main>;
}
