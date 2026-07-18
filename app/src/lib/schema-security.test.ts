import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve(process.cwd(), "..", "supabase", "migrations", "20260718173000_initial_marketplace_schema.sql"), "utf8");

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
});
