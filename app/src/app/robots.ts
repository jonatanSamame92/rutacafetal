import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rutacafetal.vercel.app";
  return {
    rules: [{ userAgent: "*", allow: ["/", "/campanas", "/seguridad", "/privacidad", "/terminos", "/ayuda"], disallow: ["/panel", "/ingresar", "/registro", "/cambiar-clave"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
