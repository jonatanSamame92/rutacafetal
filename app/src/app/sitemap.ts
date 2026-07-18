import type { MetadataRoute } from "next";
import { getPublicCampaigns } from "@/lib/data/campaigns";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rutacafetal.vercel.app";
  const campaigns = await getPublicCampaigns();
  const staticRoutes = ["", "/campanas", "/seguridad", "/privacidad", "/terminos", "/ayuda"];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, changeFrequency: route === "/campanas" ? "daily" as const : "monthly" as const, priority: route === "" ? 1 : 0.6 })),
    ...campaigns.filter((campaign) => !campaign.isDemo).map((campaign) => ({ url: `${base}/campanas/${campaign.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
