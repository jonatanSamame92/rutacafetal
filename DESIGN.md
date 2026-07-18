---
name: Rutacafetal
description: Trabajo cafetalero claro y confiable en Jaén
colors:
  primary: "#24513A"
  primary-strong: "#173624"
  primary-soft: "#E7F0E5"
  accent: "#B85C38"
  background: "#F8FAF7"
  surface: "#FFFFFF"
  surface-muted: "#EFF3EE"
  foreground: "#17251C"
  muted: "#53645A"
  border: "#CBD5CC"
  danger: "#A63535"
  warning: "#8A5A12"
typography:
  display:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 5rem)"
    fontWeight: 650
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    height: "48px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
    height: "48px"
---

## Overview

**Creative North Star: “La libreta clara de la campaña”.** Rutacafetal debe sentirse tan directo como una conversación útil antes de viajar a una finca: lugar, fecha, pago, beneficios y siguiente paso aparecen sin rodeos. La superficie es luminosa para uso exterior y la densidad es media para aprovechar pantallas pequeñas.

**The Field Clarity Rule.** Cada pantalla tiene una acción principal y muestra primero la información necesaria para decidir.

## Colors

El verde cafetal identifica navegación, confianza y acciones primarias. El terracota se reserva para acentos editoriales puntuales, nunca para competir con la acción principal. Los estados de error, alerta y éxito siempre incluyen texto además del color.

**The One Green Rule.** El verde primario es el único color de acción. No se introducen gradientes morados, neones ni secciones con temas desconectados.

## Typography

Geist mantiene letras abiertas y una carga pequeña mediante `next/font`. El cuerpo nunca baja de 16 px; encabezados usan balance de texto y los párrafos se limitan a 70 caracteres por línea.

## Elevation

La jerarquía se construye con espacio, superficies y bordes. Las tarjetas usan borde o una sombra corta teñida, nunca ambos con una sombra amplia. Controles y tarjetas no superan 16 px de radio.

## Components

Botones e inputs miden al menos 48 px de alto, muestran foco visible y responden al toque en menos de 160 ms. Campañas usan una ficha escaneable con pago, zona, fecha y condiciones. Los estados de carga preservan la forma final; los estados vacíos explican la próxima acción.

## Do's and Don'ts

- Usar español simple, datos realistas de Jaén y etiquetas explícitas.
- Mantener una única acción primaria por pantalla.
- Respetar reducción de movimiento y contraste AA.
- No usar emojis como iconos, tarjetas dentro de tarjetas ni teléfonos en vistas públicas.
- No usar animaciones decorativas, texto en degradado o afirmaciones sin datos reales.
