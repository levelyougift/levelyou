# LEVEL YOU V3 — Auditoría de reutilización del backend (2026-10-14)

## Evidencia verificada en Supabase (solo lectura)
- Proyecto existente `levelyou` activo, región eu-west-1.
- Tablas públicas `orders` y `stripe_webhook_config` con RLS habilitada, sin políticas públicas detectadas por advisor (no equivale a auditoría completa).
- Edge functions `get-game` y `get-game-sprint3` activas, acceso HTTP sin JWT, autorizan por token UUID `share_token` y estado `paid`.
- `get-game-sprint3` consulta Stripe en servidor si el pedido aún no consta pagado; devuelve cinco preguntas/fotos, dedicatoria y recuerdos adicionales, firmando URL de fotos por 3600 segundos.
- No se ha verificado con pruebas reales si el token expira, si existe revocación, limitación de peticiones o eliminación automática de fotos/datos.
- Un UUID de enlace es una credencial portadora; cualquiera que posea el enlace puede consultar el regalo. Evitar incluirlo en logs o analítica; definir caducidad y revocación.
- El esquema de V3 premium actual (recuerdo libre, detalle íntimo, dedicatoria y foto opcional) no coincide con el contrato del backend actual (exactamente 5 fotos y 5 preguntas).

## Decisión de arquitectura
NO conectar la V3 al endpoint de V2 ni modificar funciones productivas sin pruebas. Construir en entorno aislado contrato V3, autorización de acceso, caducidad/revocación, controles de tamaño y borrado. Mantener pagos desactivados en V3 hasta completar pruebas y consentimiento.

## Puertas obligatorias
1. Especificar formato V3 y ciclo de vida del regalo; consentimiento, retención y borrado.
2. Implementar backend V3 separado con token aleatorio robusto, comprobación de caducidad y revocación, rate limiting y logs sin datos personales.
3. Confirmar fotos en bucket privado, URLs firmadas breves, límites MIME/tamaño y procesamiento seguro.
4. Prueba de dos dispositivos, acceso sin token, token incorrecto, expirado, revocado y reintentos.
5. Pruebas de Stripe en modo test y verificación de webhooks, sin cobro real.
6. QA móvil, accesibilidad y validación emocional con usuarios.

Estado: NO APTO PARA COMERCIALIZAR. No se han hecho cambios al backend ni incurrido en gastos.
