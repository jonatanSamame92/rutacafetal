import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicConfig } from "@/lib/supabase/config";
import type { Database, UserRole } from "@/lib/types/database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const getAuthContext = cache(async () => {
  if (!hasSupabasePublicConfig()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) return null;
  return { userId, profile: profile as Profile, supabase };
});

export async function requireProfile() {
  const auth = await getAuthContext();
  if (!auth) redirect("/ingresar?mensaje=Inicia sesión para continuar.");
  if (auth.profile.status === "suspended") redirect("/cuenta-suspendida");
  if (auth.profile.must_change_password) redirect("/cambiar-clave");
  return auth;
}

export async function requireRole(role: UserRole) {
  const auth = await requireProfile();
  if (auth.profile.role !== role && auth.profile.role !== "admin") redirect("/panel");
  return auth;
}

export async function requireAdmin() {
  const auth = await requireProfile();
  if (auth.profile.role !== "admin") redirect("/panel");
  return auth;
}
