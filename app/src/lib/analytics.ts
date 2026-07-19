import "server-only";

import { getAdminClient } from "@/lib/supabase/admin";
import type { AnalyticsEventName, Json } from "@/lib/types/database";

export async function recordAnalyticsEvent(
  eventName: AnalyticsEventName,
  actorId: string | null,
  entityId: string | null,
  metadata: Json = {},
) {
  const admin = getAdminClient();
  const { error } = await admin.from("analytics_events").insert({
    event_name: eventName,
    actor_id: actorId,
    entity_id: entityId,
    metadata,
  });
  return !error;
}
