import { PanelShell } from "@/components/panel-shell";
import { requireProfile } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireProfile();
  return <PanelShell profile={profile}>{children}</PanelShell>;
}
