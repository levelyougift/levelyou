# E1 — Instrumentación y captación (BORRADOR NO PUBLICADO)
Estado: requiere autorización para activación. Fecha: 2026-10-19.

## Objetivo
Medir intención cualificada para el juego de 5 recuerdos a 14,90 € (IVA incluido). No recoger fotografías ni información de menores.

## Eventos propuestos (sin identificar usuarios)
- page_view: variante A/B, campaña UTM, timestamp redondeado a día.
- offer_interest: clic explícito "Me interesa a 14,90 €".
- qualified_intent: declaración voluntaria de ocasión en próximos 30 días y aceptación del precio.
No registrar IP, user-agent, cookies de terceros ni identificadores persistentes. No activar eventos sin autorización.

## Diseño de captura (pendiente de aprobación)
Formulario voluntario: (1) ¿Vas a regalar en los próximos 30 días? Sí/No; (2) ¿Pagarías 14,90 € por este juego? Sí/No; (3) Quiero aviso por email (opcional, consentimiento independiente). 
Alternativa preferida para primera fase: recoger únicamente las dos respuestas sin correo; publicar política de privacidad y responsable de tratamiento antes de activación. No hacer seguimiento comercial sin consentimiento.

## A/B
A: /validacion/
B: /validacion/?variant=b
Distribuir tráfico comparable con URLs explícitas. No asignar automáticamente identificadores persistentes.
Revisar funcionamiento público de ambas páginas desde navegador real antes de difusión.

## Métricas
Visitas únicas estimadas con limitaciones de privacidad; respuestas cualificadas / visitas; declaración de intención a precio; coste por respuesta si posteriormente se autoriza presupuesto.
100 visitas relevantes por variante orientativas. GO: 10 o más intenciones cualificadas sobre 200 visitas relevantes y entrega técnica verificada; ITERATE 3–9; PIVOT 0–2. No extrapolar a ventas.

## Requisitos de lanzamiento
[ ] Responsable de tratamiento, contacto y privacidad válidos
[ ] Consentimiento voluntario y textos legales aprobados
[ ] Destino seguro de datos y política de conservación definida
[ ] Verificación de URL pública
[ ] Autorización expresa para activar captura de respuestas
[ ] Autorización adicional para cualquier campaña, outreach o gasto

## Seguridad
Mantener Stripe inactivo en esta landing. No conectar el formulario a tablas orders. Aplicar controles anti-spam y límites de volumen antes de cualquier endpoint público. Probar con datos ficticios en entorno no público.
