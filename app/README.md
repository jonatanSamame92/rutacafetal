# Rutacafetal

Web móvil para conectar trabajadores agrícolas y patrones de fincas cafetaleras en Jaén y zonas cercanas.

## Estado actual

La primera interfaz pública incluye un inicio, un listado de campañas de demostración, detalle de campaña y pantallas preparatorias de registro e ingreso. Todavía no hay usuarios reales, autenticación ni base de datos conectada.

## Antes de habilitar registros

Revisar y decidir el método de autenticación descrito en [`docs/DECISIONES_PENDIENTES.md`](docs/DECISIONES_PENDIENTES.md). Las variables de Supabase se configurarán a partir de `.env.example` cuando exista el proyecto de Supabase.

## Estructura

- `src/app`: rutas públicas de la aplicación.
- `src/components`: componentes reutilizables de interfaz.
- `src/lib/campaigns.ts`: datos ficticios que se reemplazarán por consultas a Supabase.
- `docs`: decisiones de producto y operación pendientes.

## Desarrollo local

Instalar dependencias y ejecutar el servidor de desarrollo:

```bash
npm install
npm run dev
```

Luego abrir `http://localhost:3000`.
