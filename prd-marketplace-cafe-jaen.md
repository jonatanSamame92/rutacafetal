# PRD – Marketplace de Trabajo Agro (MVP Café – Jaén, Cajamarca)

## 1. Contexto y objetivo del producto

En Jaén y la zona norte de Cajamarca la economía local depende fuertemente del café, con decenas de miles de caficultores y decenas de miles de hectáreas cultivadas, y campañas de cosecha estacionales que concentran movimiento económico y alta demanda de mano de obra en meses específicos del año.[web:35][web:36][web:43][web:40]
Sin embargo, la contratación de jornaleros se hace principalmente de forma informal: reuniones en la plaza principal, boca a boca y grupos de Facebook/WhatsApp, sin una plataforma estructurada que conecte patrones de finca con trabajadores, gestione reputación, calendario de campañas y condiciones mínimas de seguridad.[web:39][web:6]

El objetivo del producto es crear un marketplace digital que conecte trabajadores agrícolas (jornales) con dueños/administradores de fincas cafetaleras, empezando por Jaén (MVP enfocado en café) pero diseñado para extenderse después a otros cultivos y regiones.

## 2. Usuarios y comportamiento esperado

### 2.1. Perfil y comportamiento de trabajadores (jornales)

- Personas de zonas rurales y periurbanas que buscan trabajo temporal en cosecha de café, muchas veces jóvenes que se desplazan entre fincas o incluso entre actividades como café, cacao, arroz o minería informal.[web:44][web:36][web:37]
- Se concentran en la plaza o puntos de encuentro durante los meses de cosecha (agosto–setiembre u otros, según variedad y clima) cuando la demanda es alta y se negocian condiciones de pago y alojamiento.[web:39][web:40]
- Motivaciones principales: ingreso rápido por campaña, posibilidad de alojamiento y comida en la finca, jornadas de trabajo claras, pago seguro (diario, semanal o por arroba/bulto), trato respetuoso y evitar riesgos de delincuencia o estafas.[web:39][web:45]
- Limitaciones: bajo acceso a información confiable previa sobre el patrón (reputación), poca claridad sobre tarifas de mercado y condiciones de seguridad, dependencia de intermediarios informales.
- Nivel digital: muchos usan celular Android con acceso a WhatsApp y redes sociales; no todos tienen correo electrónico, pero sí número de teléfono y cuentas de Facebook.

### 2.2. Perfil y comportamiento de patrones/dueños de fincas

- Pequeños y medianos productores de café que necesitan cuadrillas de trabajadores para cosecha, mantenimiento (desmalezado, abonado, poda) y labores postcosecha.[web:35][web:42][web:36]
- Cooperativas y empresas cafetaleras que agrupan a cientos o miles de productores y coordinan campañas cafetaleras, con preocupación por escasez de mano de obra y envejecimiento de plantaciones.[web:36][web:37][web:43]
- Motivaciones: asegurar suficiente mano de obra en fechas críticas, controlar costos de cosecha, minimizar robos o actos delictivos en campañas, cumplir estándares de calidad para mercados internacionales.
- Problemas actuales: escasez de mano de obra en ciertas zonas porque jóvenes migran a otras actividades (por ejemplo minería ilegal), desorden logístico en la contratación, poca trazabilidad de quién trabajó y cómo, riesgos de seguridad durante la campaña.[web:44][web:39][web:36]
- Nivel digital: algunos ya usan apps como AgroDigital para registrar parcelas y consultar precios, y redes sociales para coordinar con compradores o técnicos, pero no existe una plataforma focalizada en contratación de mano de obra.

### 2.3. Otros actores relevantes

- Cooperativas cafetaleras y organizaciones como la Junta Nacional del Café (JNC), que pueden usar la plataforma para coordinar campañas y recomendar fincas confiables.[web:36][web:18][web:19]
- Entidades públicas (Agencias Agrarias, INIA, MIDAGRI) interesadas en mejorar trazabilidad, condiciones de trabajo y seguridad en las campañas.[web:35][web:42][web:10]

## 3. Alcance del MVP

### 3.1. Enfoque geográfico y de cultivo

- Región objetivo inicial: Jaén (Cajamarca) y distritos aledaños donde la campaña cafetalera es decisiva para la economía local.
- Cultivo objetivo inicial: café (cosecha, mantenimiento y labores postcosecha).
- Diseño de datos y UI pensando en extensión futura a otros cultivos (cacao, arroz, maíz) y otras provincias.

### 3.2. Plataforma: web, móvil o híbrida

- MVP como **web app móvil-first** (PWA) accesible desde cualquier Android básico, con diseño responsive y opción de añadir al inicio.
- Backend y API que permitan luego desarrollar aplicación móvil nativa si la adopción lo requiere.
- Criterios para elegir web app: reducción de fricción (no depender de Play Store), despliegue rápido y actualizaciones inmediatas, compatibilidad con tu stack actual (Next.js + Supabase).

## 4. Historias de usuario principales

### 4.1. Trabajador – búsqueda y postulación a campañas

1. Como trabajador, quiero crear un perfil con mi nombre, experiencia en café y número de teléfono para que los patrones me puedan contactar.
2. Como trabajador, quiero filtrar campañas por distrito, fecha de inicio, duración y tipo de trabajo (solo cosecha, cosecha + alojamiento, mantenimiento) para encontrar las que se ajusten a mi disponibilidad.
3. Como trabajador, quiero ver claramente el pago ofrecido (por día, por semana o por arroba/bulto) y si incluye comida y alojamiento para poder decidir si me conviene.
4. Como trabajador, quiero enviar una postulación simple (“Estoy disponible”) que llegue al patrón por la plataforma y por WhatsApp para aumentar chances de respuesta.
5. Como trabajador, quiero ver comentarios y calificaciones de otros trabajadores sobre un patrón (trato, pago, seguridad) para reducir el riesgo de ir a una finca problemática.

### 4.2. Patrón – publicación y gestión de campañas

1. Como patrón, quiero registrar mi finca (ubicación, tamaño, tipo de cultivo, pertenencia a cooperativa) para usarla como base en distintas campañas.
2. Como patrón, quiero crear una campaña de cosecha con fechas, número de trabajadores requeridos, tipo de trabajo, forma de pago y condiciones de alojamiento para organizar la contratación.
3. Como patrón, quiero ver una lista de postulantes con su experiencia y datos de contacto para seleccionar quienes contrataré.
4. Como patrón, quiero confirmar contrataciones y generar una lista de trabajadores para la campaña, que luego pueda exportar o imprimir.
5. Como patrón, quiero calificar a los trabajadores al final de la campaña (responsabilidad, calidad del trabajo) para construir reputación y facilitar futuras contrataciones.

### 4.3. Moderación, seguridad y reputación

1. Como administrador de la plataforma, quiero poder marcar campañas o perfiles como sospechosos o bloqueados si hay reportes de estafas o delitos.
2. Como usuario (trabajador o patrón), quiero poder reportar problemas (no pago, maltrato, robos) para alertar a otros y al administrador.
3. Como cooperativa, quiero poder identificar las fincas asociadas y usar la reputación de la plataforma como insumo para certificaciones y auditorías.

## 5. Funcionalidades del MVP

### 5.1. Registro y autenticación básica

- Registro por número de celular y nombre, con verificación vía código SMS o WhatsApp (idealmente en versiones futuras).
- Roles de usuario: trabajador, patrón (dueño/administrador de finca), administrador.
- Perfil de usuario con datos mínimos: nombre, foto opcional, distrito, años de experiencia, cultivos en los que ha trabajado, pertenencia a cooperativa (si aplica).

### 5.2. Módulo de campañas de trabajo

- CRUD de campañas (crear, ver, editar, cerrar) con campos:
  - Título de campaña (ej. “Cosecha café – Finca Santa Rosa”)
  - Finca asociada
  - Distrito y referencia geográfica
  - Fechas de inicio y fin estimadas
  - Número de trabajadores requeridos
  - Tipo de trabajo (solo cosecha, cosecha + mantenimiento, postcosecha)
  - Modalidad de pago (por día, semana, arroba/bulto)
  - Monto aproximado y beneficios (alimentación, alojamiento, transporte)
  - Notas sobre condiciones de seguridad y normas internas.

### 5.3. Búsqueda y filtro de campañas

- Listado de campañas abierto a cualquier usuario.
- Filtros por: distrito, fechas, tipo de trabajo, si incluye alojamiento, tipo de pago.
- Vista móvil sencilla con tarjetas, mostrando información clave (título, fechas, pago, ubicación).

### 5.4. Postulación y contacto

- Botón de “Me interesa / Postular” desde la campaña.
- Registro de postulaciones asociadas a cada campaña.
- Envío opcional de mensaje predefinido por WhatsApp al patrón, usando el número registrado.

### 5.5. Reputación y calificaciones

- Sistema inicial de calificación por estrellas y comentarios cortos para patrones y trabajadores.
- Moderación básica para evitar insultos o acusaciones graves sin evidencia.
- Métricas visibles simples: número de campañas completadas, promedio de calificaciones.

### 5.6. Administración y moderación

- Panel sencillo para administrador (tú) con:
  - Lista de usuarios y campañas.
  - Marcar usuarios/campañas como “verificados” (por cooperativa o documentación).
  - Bloquear usuarios/campañas con problemas graves.

## 6. Requerimientos no funcionales

### 6.1. Tecnología y arquitectura

- Frontend: Next.js con enfoque mobile-first, usando tu stack actual.
- Backend: Supabase (PostgreSQL + auth) para gestión de usuarios, campañas y reputación.
- API: endpoints REST o RPC para crear y listar campañas, manejar postulaciones y calificaciones.
- Escalabilidad: diseño de tablas listo para soportar extensión a otros cultivos y regiones.

### 6.2. Usabilidad y accesibilidad

- UI sencilla, con textos breves y grandes, pensando en usuarios con baja alfabetización digital.
- Flujos claros: máximo 3–4 pasos para registrar un perfil o postular a una campaña.
- Compatible con conexiones inestables: minimizar peso de imágenes, precargar solo lo necesario.

### 6.3. Seguridad y riesgos

- Manejo cuidadoso de datos personales (no exponer números de documento públicamente).
- Claridad en términos y condiciones: la plataforma es un intermediario de contacto, no garantiza el cumplimiento de contratos, pero facilita reputación y reportes.
- Considerar coordinación futura con autoridades locales para temas de seguridad en campañas (por ejemplo, en meses con alto movimiento económico se reportan más actos delictivos).[web:39][web:44]

## 7. Métricas de éxito del MVP

- Número de campañas publicadas en la primera temporada de cosecha.
- Número de trabajadores registrados y postulaciones realizadas.
- Tasa de campañas que declaran haber cubierto su necesidad de mano de obra usando la plataforma.
- Calificación promedio de satisfacción de trabajadores y patrones.
- Participación de al menos una cooperativa local o agencia agraria como usuario activo.

## 8. Roadmap de evolución

- Fase 1 (MVP): Jaén, sólo café, funcionalidades básicas descritas arriba.
- Fase 2: extensión a San Ignacio y otras provincias, incorporación de otros cultivos (cacao, arroz), mejoras en reputación y verificación.
- Fase 3: integración con AgroDigital u otras soluciones estatales para cruzar datos de parcelas y campañas, y posibles módulos de formación (microcursos de seguridad, buenas prácticas en cosecha).

