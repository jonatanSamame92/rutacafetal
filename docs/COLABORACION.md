# Guía de Colaboración y Flujo de Trabajo — Rutacafetal

Esta guía establece el flujo de trabajo, la organización técnica y la asignación de tareas para que dos programadores puedan colaborar en el proyecto **Rutacafetal** sin conflictos de código, errores de base de datos ni confusiones desde el primer día.

---

## 1. Reglas de Git y Flujo de Trabajo (Evitar Conflictos)

Para evitar sobrescribir el trabajo del otro o generar conflictos complejos al fusionar código, seguiremos estas reglas estrictas de control de versiones:

### Ramas y Commits
* **Rama Principal (`main`):** Es sagrada y debe contener siempre código estable que compile y pase las pruebas. **Nadie sube código directamente a `main`**.
* **Ramas de Funcionalidad:** Cada tarea o característica se trabaja en una rama corta que nace de `main`.
  * Formato: `feat/nombre-tarea` (para características nuevas), `fix/nombre-bug` (para corrección de errores), o `chore/tarea-soporte` (para configuración/limpieza).
  * *Ejemplo:* `feat/perfil-trabajador` o `fix/validacion-telefono`.
* **Estilo de Commits:** Usar commits descriptivos en minúsculas siguiendo la convención acordada en [AGENTS.md](file:///c:/Users/jsama/OneDrive/Escritorio/rutacafetal/AGENTS.md):
  * `feat: agregar registro de trabajador`
  * `fix: corregir espaciado en tarjeta de campaña`
  * `chore: actualizar dependencias de desarrollo`

### Ciclo de Integración y Pull Requests (PR)
1. Antes de iniciar cualquier tarea, haz un pull de `main` para asegurarte de tener lo último:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Crea tu rama y trabaja localmente.
3. **Control de Calidad Local:** Antes de enviar tu código a GitHub, ejecuta las puertas de calidad en tu máquina para asegurarte de que nada esté roto:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```
4. Sube tu rama a GitHub y abre un **Pull Request (PR)** hacia `main`.
5. **Revisión Obligatoria:** El otro programador debe revisar el PR, verificar que el código cumpla con los estándares visuales de la app (optimizado para móvil a **375px** y accesible) y aprobarlo antes de fusionar. **No te auto-apruebes tus propios PRs**.

---

## 2. Gestión de la Base de Datos (Supabase)

El error más común al trabajar en equipo con Supabase es realizar cambios en las tablas o políticas RLS directamente en el panel web de un entorno compartido sin avisar al compañero. Para evitar esto:

### Entornos de Base de Datos Separados
* **Cada programador debe tener su propio proyecto de desarrollo en Supabase Cloud** (ej. `rutacafetal-dev-juan` y `rutacafetal-dev-pedro`), o usar el emulador local de Supabase.
* Configura tus credenciales personales en el archivo local `app/.env.local` (este archivo está en el `.gitignore` y nunca debe subirse al repositorio).

### Control de Cambios mediante Migraciones (`supabase/migrations`)
* Cualquier cambio en la base de datos (creación de tablas, columnas nuevas, triggers, políticas de seguridad RLS) **debe hacerse mediante archivos SQL en la carpeta `supabase/migrations/`**.
* Cuando agregues una tabla o modifiques una columna:
  1. Escribe la migración en un nuevo archivo `.sql` dentro de `supabase/migrations/` o usa el CLI de Supabase para generarlo.
  2. Aplica la migración en tu base de datos de desarrollo.
  3. Sube el archivo de migración al repositorio junto con tu código.
* Cuando tu compañero descargue tus cambios (`git pull`), verá el nuevo archivo de migración en la carpeta y podrá aplicarlo a su base de datos personal. Así, ambos tendrán exactamente la misma estructura de base de datos.

---

## 3. Distribución de Tareas (Día 1)

Para evitar colisionar editando los mismos archivos al mismo tiempo, dividiremos el desarrollo del MVP en dos grandes flujos independientes. Uno se enfocará en el **Trabajador (la demanda)** y el otro en el **Patrón / Administrador (la oferta y moderación)**.

### Desarrollador A: Flujo del Trabajador (Demanda del Marketplace)
*Este flujo abarca las vistas públicas y el registro/postulación de quienes buscan empleo.*
* **Tarea A.1: Búsqueda y Filtros de Campañas:**
  * Implementar la página `/campanas` donde se listan todas las campañas activas.
  * Habilitar filtros por distrito (ubicación controlada), tipo de labor, alojamiento y rango de pago.
  * Mantener los filtros sincronizados con la URL para que las búsquedas se puedan compartir fácilmente.
* **Tarea A.2: Registro y Perfil del Trabajador:**
  * Implementar el formulario de onboarding para trabajadores (`/registro?rol=worker` y `/app/registro`).
  * Campos obligatorios: nombre completo, teléfono, distrito, cultivos de café con los que trabaja, nivel de experiencia y disponibilidad.
  * Guardar los datos en el perfil del usuario utilizando la sesión activa.
* **Tarea A.3: Postulaciones y "Mis Postulaciones":**
  * Habilitar el botón de "Postular" en el detalle de cada campaña.
  * Prevenir postulaciones duplicadas del mismo trabajador.
  * Diseñar la vista privada de "Mis postulaciones" donde el trabajador ve el estado de sus solicitudes (Pendiente, Aceptada, Rechazada).

### Desarrollador B: Flujo del Patrón y Consola del Administrador (Oferta y Moderación)
*Este flujo abarca el registro de patrones, la publicación de campañas y las herramientas de gestión.*
* **Tarea B.1: Registro de Patrón y CRUD de Fincas:**
  * Formulario de onboarding del patrón (`/registro?rol=farmer`) solicitando nombre, zona y teléfono.
  * Implementar la sección de "Mis Fincas" (creación, edición y listado) para que el patrón registre sus terrenos (Nombre, distrito, coordenadas o referencia de acceso).
* **Tarea B.2: Gestión de Campañas del Patrón:**
  * Formulario para crear o editar campañas asociadas a una finca (fechas, cupos, pago, si incluye comida/alojamiento).
  * El estado inicial de la campaña creada debe ser `pendiente de revision` (no pública).
  * Panel de control del patrón para ver sus campañas y listar a los postulantes de cada una.
* **Tarea B.3: Aceptación y Acción de WhatsApp:**
  * Flujo de Selección: El patrón acepta o rechaza candidatos.
  * **Acción de WhatsApp:** Al aceptar una postulación, el sistema genera el enlace protegido de WhatsApp con el número del trabajador para que coordinen directamente.
* **Tarea B.4: Consola de Administración:**
  * Ruta protegida `/panel/admin` para que el administrador apruebe/rechace campañas pendientes y atienda reportes o solicitudes de usuarios.

---

## 4. Tareas de Coordinación Inicial (Día 1)
Antes de programar los flujos de forma independiente, ambos deben reunirse o coordinar brevemente para definir estos 3 puntos (Fase 0):
1. **Ruta de Autenticación:** Decidir si en este piloto usaremos autenticación por correo electrónico y contraseña (gratuita y sencilla de implementar al inicio, haciendo el teléfono obligatorio en el perfil) o si implementaremos OTP por SMS directamente (con un costo asociado por SMS).
2. **Listado de Ubicaciones:** Crear y sembrar en la base de datos la lista de provincias y distritos permitidos de Jaén (ej. Jaén, Bellavista, Chontalí, Sallique, etc.) para que las búsquedas y formularios usen opciones cerradas en lugar de texto libre.
3. **Configuración de Supabase Compartida:** Crear un proyecto "Staging" o "Production" en común para pruebas integradas cuando ya tengan sus ramas aprobadas.

---

## 5. Checklist del Día 1 (Para Ambos)

- [ ] **GitHub:** El creador del repositorio invita al otro desarrollador como colaborador con permisos de escritura.
- [ ] **Clonar y Descargar:** Ambos clonan el repositorio localmente.
- [ ] **Instalar Dependencias:** Ejecutar `npm install` en la raíz del proyecto y `npm --prefix app install`.
- [ ] **Configurar Base de Datos:** Ambos crean su proyecto de desarrollo en Supabase y aplican las migraciones iniciales de la carpeta `supabase/migrations/` usando el CLI de Supabase o copiando el SQL de `20260718173000_initial_marketplace_schema.sql` en el editor SQL de Supabase.
- [ ] **Variables de Entorno:** Copiar `app/.env.example` a `app/.env.local` y llenar los datos de su respectiva base de datos personal.
- [ ] **Prueba Inicial:** Ejecutar `npm run dev` y comprobar que la página de inicio cargue en `http://localhost:3000`.
- [ ] **Pruebas Unitarias:** Ejecutar `npm test` para asegurar que el entorno de desarrollo y los tests locales funcionen correctamente.
- [ ] **Decidir y Asignar:** Repartirse los flujos (Desarrollador A y Desarrollador B) e iniciar la primera rama de funcionalidad.
