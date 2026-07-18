import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rutacafetal",
    short_name: "Rutacafetal",
    description: "Campañas de trabajo cafetalero en Jaén.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8faf7",
    theme_color: "#24513a",
    lang: "es-PE",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
