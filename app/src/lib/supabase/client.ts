"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";
import { requirePublicConfig } from "@/lib/supabase/config";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  const { url, publishableKey } = requirePublicConfig();
  browserClient ??= createBrowserClient<Database>(url, publishableKey);
  return browserClient;
}
