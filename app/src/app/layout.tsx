import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PwaRegistration } from "@/components/pwa-registration";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rutacafetal | Trabajo cafetalero cerca de ti",
    template: "%s | Rutacafetal",
  },
  description: "Encuentra campañas de café con pago y condiciones claras en Jaén, o publica una campaña para formar tu cuadrilla.",
  applicationName: "Rutacafetal",
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "Rutacafetal",
    title: "Trabajo cafetalero claro y confiable en Jaén",
    description: "Campañas, postulaciones y contacto protegido por WhatsApp.",
    images: [{ url: "/images/hero-cafetal.png", width: 1536, height: 1024, alt: "Dos caficultores coordinan una jornada en un cafetal de Jaén" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8faf7" },
    { media: "(prefers-color-scheme: dark)", color: "#101712" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh antialiased">
        <a href="#contenido" className="skip-link">Saltar al contenido</a>
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
