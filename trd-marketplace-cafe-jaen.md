# TRD – Technical Requirements Document
## Marketplace de Trabajo Agro (MVP Café – Jaén, Cajamarca)

---

## 1. Visión técnica y alcance

Este documento traduce el PRD del marketplace de trabajo agro (MVP centrado en café en Jaén) a especificaciones técnicas concretas: arquitectura, stack, modelo de datos, APIs, seguridad, rendimiento y operaciones.

El objetivo técnico del MVP es:
- Tener una **web app móvil-first (PWA)** accesible desde celulares Android básicos.
- Integrarse con tu stack actual **Next.js + Supabase**.
- Ser extensible a otros cultivos y regiones sin rediseñar la base de datos.

---

## 2. Arquitectura de alto nivel

### 2.1. Vista general

- **Cliente (Frontend)**: Web app en Next.js, con diseño responsive y optimizado para móviles.
- **Backend / BaaS**: Supabase (PostgreSQL, Auth, Storage, Edge Functions opcionales).
- **Comunicación**: API basada en endpoints REST (rutas Next.js + Supabase) o RPC vía Supabase.
- **Infraestructura**: 
  - Hosting de frontend en Vercel (o equivalente).
  - Base de datos y auth gestionados por Supabase.

### 2.2. Componentes principales

1. **Módulo de autenticación y gestión de usuarios**.
2. **Módulo de fincas y campañas de trabajo**.
3. **Módulo de postulaciones y contacto**.
4. **Módulo de reputación (calificaciones y comentarios)**.
5. **Módulo de administración y moderación**.

---

## 3. Stack tecnológico

### 3.1. Frontend

- Framework: **Next.js** (App Router).
- Lenguaje: **TypeScript**.
- UI: TailwindCSS o equivalente para diseño mobile-first.
- PWA: configuración de manifest.json, service worker básico para caching de vistas.

### 3.2. Backend / Base de datos

- **Supabase**:
  - PostgreSQL para modelo de datos relacional.
  - Supabase Auth para autenticación por email y/o teléfono (posible extensión futura a OTP por SMS/WhatsApp mediante proveedor externo).
  - Supabase Storage si se usan imágenes (fotos de usuario, finca).
  - Edge Functions si se requiere lógica de negocio server-side más compleja.

### 3.3. Integraciones externas (futuras)

- API de mensajería (ej. Twilio, WhatsApp Business API) para:
  - Envío de notificaciones a trabajadores y patrones.
- Posible integración con plataformas estatales (AgroDigital, etc.) en fases posteriores.

---

## 4. Modelo de datos (PostgreSQL / Supabase)

### 4.1. Tabla `users`

Representa tanto trabajadores como patrones y administradores.

Campos sugeridos:
- `id` (uuid, PK).
- `role` (enum: 'worker', 'farmer', 'admin').
- `full_name` (text).
- `phone_number` (text, único o indexado).
- `email` (text, opcional).
- `district` (text).
- `experience_years` (integer, opcional).
- `skills` (text, listado simple: "café,cacao,arroz").
- `cooperative_name` (text, opcional).
- `created_at` (timestamp).

### 4.2. Tabla `farms`

Representa fincas o unidades productivas.

Campos:
- `id` (uuid, PK).
- `owner_id` (uuid, FK -> users.id).
- `name` (text).
- `description` (text).
- `district` (text).
- `location_ref` (text, referencia textual tipo "a 20 min de Jaén").
- `main_crop` (enum: 'coffee', 'cacao', 'rice', 'corn', etc.).
- `area_hectares` (numeric, opcional).
- `certifications` (text, opcional).
- `created_at` (timestamp).

### 4.3. Tabla `campaigns`

Representa campañas de trabajo (ej. cosecha café).

Campos:
- `id` (uuid, PK).
- `farm_id` (uuid, FK -> farms.id).
- `title` (text).
- `description` (text).
- `crop_type` (enum: 'coffee', 'cacao', etc.).
- `district` (text).
- `start_date` (date).
- `end_date` (date).
- `workers_needed` (integer).
- `work_type` (enum: 'harvest', 'maintenance', 'postharvest', 'mixed').
- `payment_mode` (enum: 'per_day', 'per_week', 'per_unit').
- `payment_amount` (numeric).
- `includes_food` (boolean).
- `includes_lodging` (boolean).
- `transport_provided` (boolean).
- `status` (enum: 'open', 'closed', 'cancelled').
- `created_at` (timestamp).

### 4.4. Tabla `applications`

Representa postulaciones de trabajadores a campañas.

Campos:
- `id` (uuid, PK).
- `campaign_id` (uuid, FK -> campaigns.id).
- `worker_id` (uuid, FK -> users.id).
- `message` (text, opcional).
- `status` (enum: 'pending', 'accepted', 'rejected', 'withdrawn').
- `created_at` (timestamp).

### 4.5. Tabla `assignments`

Representa contrataciones confirmadas.

Campos:
- `id` (uuid, PK).
- `campaign_id` (uuid, FK -> campaigns.id).
- `worker_id` (uuid, FK -> users.id).
- `start_date` (date, opcional).
- `end_date` (date, opcional).
- `notes` (text, opcional).

### 4.6. Tabla `ratings`

Sistema de reputación.

Campos:
- `id` (uuid, PK).
- `rater_id` (uuid, FK -> users.id).
- `rated_user_id` (uuid, FK -> users.id).
- `campaign_id` (uuid, FK -> campaigns.id).
- `score` (integer, rango 1–5).
- `comment` (text, corto).
- `created_at` (timestamp).

### 4.7. Tabla `reports`

Reportes de problemas.

Campos:
- `id` (uuid, PK).
- `reporter_id` (uuid, FK -> users.id).
- `reported_user_id` (uuid, FK -> users.id, opcional).
- `campaign_id` (uuid, FK -> campaigns.id, opcional).
- `type` (enum: 'no_payment', 'abuse', 'theft', 'other').
- `description` (text).
- `status` (enum: 'open', 'reviewing', 'closed').
- `created_at` (timestamp).

---

## 5. APIs y endpoints

### 5.1. Autenticación y usuarios

- `POST /api/auth/register`
  - Registra usuario con rol ('worker' o 'farmer'), nombre y teléfono/email.
- `POST /api/auth/login`
  - Inicio de sesión (según método de auth implementado con Supabase).
- `GET /api/users/me`
  - Devuelve perfil del usuario autenticado.
- `PUT /api/users/me`
  - Actualiza perfil (distrito, experiencia, skills, etc.).

### 5.2. Fincas

- `POST /api/farms`
  - Crea nueva finca asociada al usuario patrón autenticado.
- `GET /api/farms`
  - Lista fincas del patrón autenticado.
- `GET /api/farms/:id`
  - Obtiene detalles de una finca.

### 5.3. Campañas

- `POST /api/campaigns`
  - Crea campaña ligada a una finca.
- `GET /api/campaigns`
  - Lista campañas filtrables por distrito, crop_type, status, etc.
- `GET /api/campaigns/:id`
  - Detalle de campaña.
- `PUT /api/campaigns/:id`
  - Actualiza campaña (solo dueño).
- `PATCH /api/campaigns/:id/status`
  - Cambia estado (open/closed/cancelled).

### 5.4. Aplicaciones y asignaciones

- `POST /api/campaigns/:id/applications`
  - Trabajador postula a campaña.
- `GET /api/campaigns/:id/applications`
  - Patrón ve postulaciones.
- `PATCH /api/applications/:id`
  - Cambia estado (accepted/rejected).
- `POST /api/campaigns/:id/assignments`
  - Crea asignación directa (trabajador confirmado).

### 5.5. Reputación

- `POST /api/ratings`
  - Crea calificación de un usuario.
- `GET /api/users/:id/ratings`
  - Obtiene calificaciones de un usuario.

### 5.6. Reportes y moderación

- `POST /api/reports`
  - Crea reporte.
- `GET /api/reports` (solo admin)
  - Lista reportes.
- `PATCH /api/reports/:id`
  - Actualiza estado del reporte.

---

## 6. Requerimientos de seguridad

### 6.1. Autenticación y autorización

- Uso de Supabase Auth para gestionar sesiones seguras.
- Protección de rutas API con middleware que verifique JWT o sesión.
- Control de acceso por rol:
  - Sólo patrones pueden crear campañas y fincas.
  - Sólo trabajadores pueden postular.
  - Sólo admin puede ver y gestionar reportes globales.

### 6.2. Protección de datos personales

- No exponer documentos de identidad en la UI pública.
- Teléfonos visibles sólo para usuarios autenticados y en contexto de campañas.
- Encriptar conexiones (HTTPS obligatorio).

### 6.3. Moderación de contenido

- Limitar longitud de comentarios.
- Filtros básicos de lenguaje ofensivo.
- Mecanismo para bloquear usuarios problemáticos.

---

## 7. Rendimiento y escalabilidad

### 7.1. Performance

- Páginas estáticas o SSR ligeras, con datos cargados vía client-side fetch o server actions.
- Indexación en base de datos por campos de filtro clave (district, crop_type, status).
- Uso de paginación en listados de campañas y usuarios.

### 7.2. Escalabilidad

- Modelo de datos preparado para múltiples cultivos y regiones, sin cambiar estructura.
- Despliegue en infraestructura escalable (Vercel + Supabase). 

---

## 8. Operaciones, DevOps y entorno

### 8.1. Entornos

- `development`: entorno local conectado a instancia de Supabase de pruebas.
- `staging`: entorno de pruebas en la nube.
- `production`: entorno público.

### 8.2. CI/CD

- Uso de GitHub Actions o similar para:
  - Ejecutar pruebas básicas (lint, unit tests) en cada push.
  - Desplegar automáticamente a Vercel en ramas específicas.

### 8.3. Observabilidad

- Logs básicos de errores en backend.
- Integración futura con herramientas de monitoreo (Sentry, LogRocket, etc.).

---

## 9. Roadmap técnico

- Fase 1:
  - Implementar modelo de datos mínimo.
  - Autenticación básica.
  - CRUD de campañas y postulaciones.
- Fase 2:
  - Reputación (ratings) y reportes.
  - PWA con capacidades offline ligeras.
- Fase 3:
  - Integraciones externas (WhatsApp, AgroDigital, etc.).
  - Mejoras de seguridad y monitoreo.

