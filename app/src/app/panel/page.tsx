import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";

export default async function PanelPage() {
  const { profile } = await requireProfile();
  redirect(profile.role === "worker" ? "/panel/trabajador" : profile.role === "farmer" ? "/panel/patron" : "/panel/admin");
}
