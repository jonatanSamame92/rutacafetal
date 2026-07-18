import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { hasSupabaseAdminConfig, requirePublicConfig } from "@/lib/supabase/config";

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function getAdminClient() {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("La clave secreta de Supabase no está configurada.");
  }

  const { url } = requirePublicConfig();
  adminClient ??= createClient<Database>(url, process.env.SUPABASE_SECRET_KEY as string, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return adminClient;
}
