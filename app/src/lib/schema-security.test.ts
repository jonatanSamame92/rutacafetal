import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationsDirectory = resolve(process.cwd(), "..", "supabase", "migrations");
const migration = readdirSync(migrationsDirectory)
  .filter((file) => file.endsWith(".sql"))
  .sort()
  .map((file) => readFileSync(resolve(migrationsDirectory, file), "utf8"))
  .join("\n");

describe("marketplace database security", () => {
  it("habilita RLS en todas las tablas privadas del producto", () => {
    for (const table of ["profiles", "farms", "campaigns", "applications", "assignments", "ratings", "reports", "contact_events", "analytics_events"]) {
      expect(migration).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("no almacena teléfonos en perfiles públicos", () => {
    const profilesBlock = migration.split("create table public.profiles (")[1]?.split("create table public.farms")[0] ?? "";
    expect(profilesBlock).not.toMatch(/\bphone\b/);
  });

  it("no concede actualización directa de postulaciones o asignaciones", () => {
    expect(migration).not.toContain("grant insert, update on public.applications");
    expect(migration).not.toContain("grant insert, update on public.assignments");
    expect(migration).toContain("security definer");
  });

  it("bloquea acciones sensibles hasta activar la cuenta y cambiar la clave temporal", () => {
    expect(migration).toContain("create or replace function private.is_active_role");
    expect(migration).toContain("and status = 'active'");
    expect(migration).toContain("and not must_change_password");
    expect(migration).toContain("private.is_active_role('worker')");
    expect(migration).toContain("private.is_active_role('farmer')");
    const withdrawFunction = migration.split("create or replace function public.withdraw_application")[1]?.split("create or replace function public.complete_assignment")[0] ?? "";
    expect(withdrawFunction).toContain("private.is_active_role('worker')");
  });

  it("reserva la escritura de analítica para operaciones de servidor", () => {
    expect(migration).not.toContain("create policy analytics_authenticated_insert");
    expect(migration).not.toMatch(/grant insert on [^;]*public\.analytics_events[^;]*to authenticated/);
    expect(migration).toContain("'rating_created'");
  });

  it("retira el acceso a la función auxiliar de bootstrap", () => {
    expect(migration).toContain("revoke execute on function public.rls_auto_enable() from public, anon, authenticated");
  });

  it("protege WhatsApp con aceptación y propiedad de campaña", () => {
    const contactPolicy = migration.split("create policy contact_farmer_insert")[1]?.split("create policy analytics_admin_read")[0] ?? "";
    expect(contactPolicy).toContain("private.is_active_role('farmer')");
    expect(contactPolicy).toContain("a.status = 'accepted'");
    expect(contactPolicy).toContain("private.owns_campaign(a.campaign_id)");
  });
});
