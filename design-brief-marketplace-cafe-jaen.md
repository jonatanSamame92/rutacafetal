# DESIGN BRIEF – Marketplace de Trabajo Agro (MVP Café – Jaén, Cajamarca)

## 1. Propósito del producto

Crear una plataforma digital que conecte de forma clara y confiable a trabajadores agrícolas (jornales) con dueños y administradores de fincas cafetaleras en Jaén, empezando por campañas de cosecha de café y con capacidad de extenderse a otros cultivos y regiones.

La experiencia debe reemplazar, o al menos complementar, el modelo actual de contratación en la plaza principal y grupos informales de redes sociales, ofreciendo más orden, transparencia y seguridad.[web:6][web:39][web:44][web:43]

---

## 2. Usuarios clave y necesidades

### 2.1. Trabajadores (jornales)

**Perfil:**
- Personas jóvenes y adultas de zonas rurales o periurbanas.
- Uso frecuente de celulares Android básicos y WhatsApp.

**Necesidades principales:**
- Ver rápidamente qué campañas de trabajo hay cerca (distrito, fechas, tipo de trabajo).
- Entender con claridad el pago ofrecido, si incluye alojamiento y comida.
- Poder postular con pocos pasos y recibir respuesta.
- Reducir riesgos de estafa, maltrato o falta de pago mediante reputación y comentarios.

### 2.2. Patrones / dueños de fincas

**Perfil:**
- Pequeños y medianos cafetaleros, cooperativas, empresas agrícolas.

**Necesidades principales:**
- Publicar campañas de cosecha con información clara y atractiva para los trabajadores.
- Recibir postulaciones ordenadas y poder elegir candidatos.
- Llevar un registro básico de quién trabajó en cada campaña.
- Construir reputación positiva para atraer más y mejores trabajadores.

### 2.3. Administrador / ecosistema

- Moderar contenido, reportes y reputación.
- Preparar el producto para integrarse a actores como cooperativas y programas públicos (Agencias Agrarias, AgroDigital, etc.).[web:35][web:42][web:21][web:24]

---

## 3. Objetivos de diseño

1. **Claridad:** Que cualquier usuario pueda entender en segundos qué ofrece cada campaña y qué debe hacer para participar.
2. **Confianza:** Transmitir seriedad y seguridad mediante reputación, lenguaje visual y flujos transparentes.
3. **Velocidad:** Permitir publicar campañas y postular desde el celular en muy pocos pasos.
4. **Escalabilidad:** Diseñar patrones de UI que funcionen para café hoy, pero que soporten cacao, arroz, maíz y otros cultivos mañana.

---

## 4. Tono visual y de comunicación

- **Lenguaje:** Español sencillo, cercano, directo, evitando tecnicismos.
- **Tono:** Respetuoso, trabajador, confiable; más parecido a una cooperativa seria que a una app corporativa fría.
- **Identidad:**
  - Colores inspirados en café y campo: verdes, marrones, tonos crema.
  - Iconografía simple (mano, hoja, saco de café, finca, calendario).
- **Mensajes clave:**
  - "Encuentra trabajo en cosecha de café cerca de ti".
  - "Publica tu campaña y encuentra mano de obra confiable".
  - "Reputación y comentarios para decidir mejor".

---

## 5. Principales pantallas del MVP

### 5.1. Home / listado de campañas

**Objetivo:** Visión rápida de oportunidades de trabajo disponibles.

Elementos:
- Barra superior con logo y selector de distrito.
- Lista de campañas en tarjetas, cada una mostrando:
  - Título (ej. "Cosecha café – Finca Santa Rosa").
  - Distrito.
  - Fechas.
  - Tipo de trabajo (solo cosecha / cosecha + alojamiento).
  - Indicador de pago (por día / semana / arroba).
- Filtros visibles (distrito, fechas, incluye alojamiento, tipo de pago).

### 5.2. Detalle de campaña

**Objetivo:** Dar toda la información necesaria para decidir si postular.

Elementos:
- Nombre de la finca y campaña.
- Mapa simplificado o referencia geográfica textual.
- Descripción del trabajo diario.
- Condiciones de pago y beneficios.
- Información de seguridad y normas básicas.
- Botón principal: "Me interesa / Postular".
- Sección de reputación del patrón (estrellas, comentarios cortos).

### 5.3. Perfil de trabajador

**Objetivo:** Que el patrón entienda rápidamente la experiencia del jornal.

Elementos:
- Nombre, foto opcional.
- Distrito de residencia.
- Años de experiencia.
- Cultivos en los que ha trabajado (chips: café, cacao, arroz, maíz, etc.).
- Historial de campañas completadas.
- Calificaciones recibidas.

### 5.4. Panel del patrón (mis campañas)

**Objetivo:** Gestionar campañas y postulaciones.

Elementos:
- Lista de campañas propias (estado: abiertas, cerradas).
- Botón "Crear nueva campaña".
- Vista de postulaciones con datos claves (nombre, experiencia, distrito).
- Acciones: aceptar / rechazar / ver perfil.

### 5.5. Pantalla de reportes y ayuda

**Objetivo:** Dar una vía clara para denunciar problemas.

Elementos:
- Formulario sencillo de reporte (tipo de problema, descripción).
- Mensajes sobre cómo se usarán los reportes.
- Enlaces a recomendaciones de seguridad en campañas.

---

## 6. Principios de UX para usuarios de campo

- **Pocos pasos:** No más de 3–4 pantallas para completar tareas clave (registrarse, postular, crear campaña).
- **Textos grandes y claros:** Tipografía legible, contraste alto, evitando bloques de texto extensos.
- **Acciones evidentes:** Botones grandes, etiquetas claras ("Postular", "Crear campaña", "Ver comentarios").
- **Feedback inmediato:** Confirmaciones visibles al postular o crear campañas.
- **Compatibilidad con conexiones débiles:** Evitar imágenes pesadas, estructurar layouts simples.

---

## 7. Limitaciones y supuestos de diseño

- El MVP asume que la mayoría de usuarios ya utilizan WhatsApp y Facebook, por lo que la plataforma puede complementar estos hábitos (por ejemplo, enviando mensajes preconfigurados al patrón).
- No se buscará reemplazar completamente las negociaciones presenciales en plaza, sino ofrecer una capa digital que las ordene y documente.
- No se incluirán contratos formales ni gestión de nóminas en el MVP; el foco estará en la conexión y reputación.

---

## 8. Entregables de diseño para el MVP

1. **Mapa de flujo de usuarios** (trabajador, patrón, admin) con los principales recorridos.
2. **Wireframes de baja fidelidad** para las pantallas clave descritas arriba.
3. **Sistema de diseño mínimo**:
   - Paleta de colores.
   - Tipografía base.
   - Componentes reutilizables (botones, tarjetas de campaña, chips de cultivo, banners de alerta).
4. **Prototipo navegable** (Figma u otra herramienta) para testear con usuarios locales.

---

## 9. Próximos pasos

- Validar el brief con 2–3 cafetaleros y algunos trabajadores de la zona (entrevistas cortas).
- Ajustar textos y prioridades de pantallas a partir de su feedback.
- Pasar de este brief a wireframes y prototipo navegable.

