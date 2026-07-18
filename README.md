# Rutacafetal

Marketplace móvil para conectar trabajadores cafetaleros y patrones de finca en Jaén. El MVP publica condiciones claras, administra postulaciones y abre WhatsApp solo después de una aceptación.

## Desarrollo local

1. Instala dependencias: `npm --prefix app install`.
2. Copia `app/.env.example` a `app/.env.local` y completa las claves.
3. Aplica `supabase/migrations/20260718173000_initial_marketplace_schema.sql` en un proyecto Supabase propio.
4. Ejecuta `npm run dev` y abre `http://localhost:3000`.

Sin variables de Supabase, la parte pública usa campañas demostrativas claramente identificadas. El registro y el panel permanecen deshabilitados.

## Verificación

- `npm run lint`: reglas de Next.js y TypeScript.
- `npm run typecheck`: tipos estrictos sin emitir archivos.
- `npm test`: validación de formularios y controles estáticos de RLS.
- `npm run build`: compilación de producción.

Consulta [OPERATIONS.md](./docs/OPERATIONS.md) para configurar al primer administrador, desplegar y operar el piloto.
