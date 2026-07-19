# Operación del piloto

## Entornos

Usa proyectos Supabase separados para desarrollo y producción. En Vercel configura `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` y `NEXT_PUBLIC_SITE_URL`. La clave secreta solo puede existir en el servidor.

## Primer administrador

1. Deshabilita el registro abierto en Supabase Auth.
2. Crea manualmente un usuario con celular confirmado en Auth.
3. Inserta una fila en `public.profiles` usando su UUID, `role = 'admin'`, `status = 'active'` y `must_change_password = false`.
4. Ingresa por `/ingresar` y verifica acceso a `/panel/admin`.

## Rutina diaria

1. Revisa solicitudes y entrega las credenciales temporales por un canal confiable. No guardes capturas de las contraseñas.
2. Revisa pago, fechas, zona, seguridad y coherencia antes de publicar campañas.
3. Atiende primero reportes de seguridad, abuso y falta de pago. Documenta la resolución en la nota interna.
4. Modera calificaciones y suspende cuentas cuando exista evidencia suficiente.
5. Revisa el resumen de registros, publicaciones, postulaciones y aperturas de WhatsApp.

## Privacidad y recuperación

Los teléfonos viven en Supabase Auth y no en `public.profiles`. El patrón obtiene el enlace de WhatsApp únicamente para una postulación aceptada de una campaña propia. Para recuperar acceso, genera una nueva clave temporal desde Administración; la persona deberá cambiarla al ingresar.

El formulario continúa pidiendo celular y contraseña. Como el piloto no usa OTP ni proveedor SMS, el servidor deriva un correo técnico no entregable desde el celular para autenticar la contraseña; el teléfono real permanece en Supabase Auth y se usa únicamente en el flujo protegido de WhatsApp.

## Lanzamiento

Mantén las campañas de ejemplo marcadas hasta contar con campañas reales aprobadas. Prueba primero en Jaén y un distrito cercano, publica enlaces con parámetros UTM y revisa semanalmente el embudo antes de ampliar zonas.
