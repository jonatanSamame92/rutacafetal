import "server-only";

import { buildSupportContact } from "@/lib/phone";

export function getSupportContact() {
  return buildSupportContact(process.env.RUTACAFETAL_ADMIN_PHONE);
}
