import { hasSupabasePublicConfig } from "@/lib/supabase/config";

export function DemoBanner() {
  if (hasSupabasePublicConfig()) return null;
  return (
    <div className="border-b border-[var(--border)] bg-[var(--surface-strong)] text-sm text-[var(--foreground)]">
      <div className="page-shell py-2.5">
        <strong>Vista demostrativa.</strong> Las campañas son ejemplos y las solicitudes se activarán al conectar Supabase.
      </div>
    </div>
  );
}
