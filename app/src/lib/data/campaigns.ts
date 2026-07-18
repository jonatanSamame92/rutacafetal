import { demoCampaigns, demoLocations } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicConfig } from "@/lib/supabase/config";
import type { CampaignFilters, LocationOption, PublicCampaign } from "@/lib/types/domain";

type CampaignQueryRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  workers_needed: number;
  work_type: PublicCampaign["workType"];
  payment_mode: PublicCampaign["paymentMode"];
  payment_amount: number;
  payment_unit_label: string | null;
  includes_food: boolean;
  includes_lodging: boolean;
  transport_provided: boolean;
  safety_note: string;
  status: PublicCampaign["status"];
  farms: { name: string; location_reference: string; owner_id: string } | null;
  locations: { district: string; province: string } | null;
};

type RatingStats = { average: number; count: number };

function toPublicCampaign(row: CampaignQueryRow, rating: RatingStats = { average: 0, count: 0 }): PublicCampaign {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    farmName: row.farms?.name ?? "Finca cafetalera",
    district: row.locations?.district ?? "Jaén",
    province: row.locations?.province ?? "Jaén",
    startDate: row.start_date,
    endDate: row.end_date,
    workType: row.work_type,
    paymentMode: row.payment_mode,
    paymentAmount: Number(row.payment_amount),
    paymentUnitLabel: row.payment_unit_label,
    workersNeeded: row.workers_needed,
    includesFood: row.includes_food,
    includesLodging: row.includes_lodging,
    transportProvided: row.transport_provided,
    description: row.description,
    locationReference: row.farms?.location_reference ?? "Referencia disponible al postular.",
    safetyNote: row.safety_note,
    rating: rating.average,
    completedCampaigns: rating.count,
    status: row.status,
  };
}

export async function getLocations(): Promise<LocationOption[]> {
  if (!hasSupabasePublicConfig()) return demoLocations;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("id, province, district, slug")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return data as LocationOption[];
}

export async function getPublicCampaigns(filters: CampaignFilters = {}): Promise<PublicCampaign[]> {
  if (!hasSupabasePublicConfig()) {
    return demoCampaigns.filter((campaign) => {
      if (filters.district && campaign.district !== filters.district) return false;
      if (filters.workType && campaign.workType !== filters.workType) return false;
      if (filters.paymentMode && campaign.paymentMode !== filters.paymentMode) return false;
      if (filters.lodging === "yes" && !campaign.includesLodging) return false;
      if (filters.from && campaign.startDate < filters.from) return false;
      return true;
    });
  }

  const supabase = await createClient();
  let query = supabase
    .from("campaigns")
    .select("id, slug, title, description, start_date, end_date, workers_needed, work_type, payment_mode, payment_amount, payment_unit_label, includes_food, includes_lodging, transport_provided, safety_note, status, farms(name, location_reference, owner_id), locations(district, province)")
    .eq("status", "published")
    .order("start_date")
    .limit(30);

  if (filters.workType) query = query.eq("work_type", filters.workType as PublicCampaign["workType"]);
  if (filters.paymentMode) query = query.eq("payment_mode", filters.paymentMode as PublicCampaign["paymentMode"]);
  if (filters.lodging === "yes") query = query.eq("includes_lodging", true);
  if (filters.from) query = query.gte("start_date", filters.from);

  const { data, error } = await query;
  if (error || !data) return [];
  const rows = data as unknown as CampaignQueryRow[];
  const ownerIds = [...new Set(rows.flatMap((row) => row.farms?.owner_id ? [row.farms.owner_id] : []))];
  const ratingMap = new Map<string, RatingStats>();
  if (ownerIds.length) {
    const { data: ratings } = await supabase.from("ratings").select("rated_user_id, score").eq("status", "approved").in("rated_user_id", ownerIds);
    for (const rating of ratings ?? []) {
      const current = ratingMap.get(rating.rated_user_id) ?? { average: 0, count: 0 };
      const nextCount = current.count + 1;
      ratingMap.set(rating.rated_user_id, { average: ((current.average * current.count) + rating.score) / nextCount, count: nextCount });
    }
  }
  const campaigns = rows.map((row) => toPublicCampaign(row, row.farms?.owner_id ? ratingMap.get(row.farms.owner_id) : undefined));
  return filters.district ? campaigns.filter((item) => item.district === filters.district) : campaigns;
}

export async function getPublicCampaign(slug: string) {
  if (!hasSupabasePublicConfig()) return demoCampaigns.find((item) => item.slug === slug) ?? null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("id, slug, title, description, start_date, end_date, workers_needed, work_type, payment_mode, payment_amount, payment_unit_label, includes_food, includes_lodging, transport_provided, safety_note, status, farms(name, location_reference, owner_id), locations(district, province)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  const row = data as unknown as CampaignQueryRow;
  let stats: RatingStats | undefined;
  if (row.farms?.owner_id) {
    const { data: ratings } = await supabase.from("ratings").select("score").eq("status", "approved").eq("rated_user_id", row.farms.owner_id);
    if (ratings?.length) stats = { average: ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length, count: ratings.length };
  }
  return toPublicCampaign(row, stats);
}
