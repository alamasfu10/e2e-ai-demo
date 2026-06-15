# Garaje Boost AI — Landing Page · Resumen del proyecto

> Sesión de desarrollo con Claude Code · Junio 2026

---

## 1. Resumen ejecutivo

Se implementó una landing page full-stack de captación de leads para el evento presencial "Garaje Boost AI" (Madrid, 17 de junio de 2026). La app integra diseño fiel al sistema de Garaje de Ideas, CMS headless, base de datos en la nube y analítica, y se despliega automáticamente en producción.

**Resultado final:**

- Landing page publicada en Vercel con auto-deploy desde rama `prod`
- Formulario de captación conectado a Supabase (server-side, `service_role`)
- Contenido gestionable desde Storyblok CMS sin tocar código
- Google Analytics 4 con eventos personalizados: `form_start`, `button_click`, `generate_lead`, `view_item`
- Suite de tests completa: 22 unitarios + 6 E2E — todos en verde
- E2E nunca escribe en prod: usa mock de `/api/leads` vía `page.route()`
- Tests de integración contra proyecto Supabase independiente (garaje-test)

---

## 2. Stack técnico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | Next.js App Router + React + TypeScript | 15.3.x |
| Estilos | Tailwind CSS + sistema de diseño Garaje | 3.x |
| Backend | Route Handler Next.js (`/api/leads`) | incluido en Next.js |
| Base de datos | Supabase Postgres (`service_role`) | cloud |
| CMS | Storyblok (headless) | v2 API |
| Analítica | Google Analytics 4 (`@next/third-parties`) | 15.3.x |
| Tests unitarios | Vitest | 2.x |
| Tests E2E | Playwright | 1.x |
| Deploy | Vercel (auto-deploy rama `prod`) | cloud |

---

## 3. Arquitectura y ficheros clave

```
app/
  layout.tsx          — Root layout: fuente Inter, GoogleAnalytics
  page.tsx            — Server component: fetch Storyblok + render
  globals.css         — CSS vars DS, field-underline, btn-pill
  api/leads/route.ts  — POST: Zod → Supabase insert (service_role)

components/
  Header.tsx          — Wordmark + pill "Garaje de Ideas"
  Hero.tsx            — H1, eyebrow, descripción, CTA, decorativos
  DetailStrip.tsx     — 4 celdas: Fecha · Lugar · Duración · Plazas
  LeadForm.tsx        — 'use client': estado form, GA4, fetch POST
  FormSection.tsx     — Sección inverse (fondo negro)
  PageAnalytics.tsx   — 'use client': dispara view_item on mount
  CtaButton.tsx       — 'use client': dispara select_content on click

lib/
  supabase.ts         — getSupabaseServer() / getSupabaseTest()
  storyblok.ts        — fetchLandingContent() con fallback hardcoded

types/lead.ts         — LeadSchema Zod + tipo Lead
tests/                — Vitest: schema, API, GA4, Storyblok, integración
e2e/                  — Playwright: landing, form-validation
```

### Flujo de un submit

1. Usuario rellena el formulario (cliente)
2. `LeadForm.tsx` llama `POST /api/leads` con `fetch`
3. `route.ts` valida con Zod (trim, lowercase email)
4. `route.ts` inserta en Supabase con `service_role` (nunca llega al cliente)
5. Respuesta `{ ok: true }` → LeadForm muestra mensaje de éxito
6. `sendGAEvent("generate_lead")` con atributos sin PII

### Modelo de datos — tabla `leads`

- `nombre`, `apellido`, `email_empresa`, `empresa`, `cargo`, `tamano_equipo`
- `acepta_comunicaciones` (bool)
- `utm_source`, `utm_medium`, `utm_campaign`, `session_id`
- `created_at` (auto)

---

## 4. Integraciones

### Storyblok CMS

Content type `landing`, entrada `home`. Campos mapeados:

- `evento_nombre` → `hero_title` (título H1)
- `evento_etiqueta` → `eyebrow_label` (pill verde)
- `evento_descripcion` → `hero_description` (richtext → texto plano)
- `evento_fecha` / `evento_lugar` / `evento_duracion` / `evento_plazas` → DetailStrip

En desarrollo: `cache: 'no-store'` para ver cambios al instante.  
En producción: ISR `revalidate: 3600` (1 hora).

### Google Analytics 4

- `GoogleAnalytics` en `layout.tsx` (`NEXT_PUBLIC_GA_ID`)
- `form_start` — primer foco en cualquier campo (dispara una sola vez)
- `button_click` — clic en "Reservar plaza" con `{ button_id, button_text, form_id }`
- `generate_lead` — submit exitoso con atributos del form sin PII
- `view_item` — PageAnalytics on mount con `{ item_name, item_category, item_variant, location_id }`
- `select_content` — CtaButton Hero con `{ content_type, content_id }`

### Supabase

- Prod: `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- Test: `SUPABASE_TEST_URL` + `SUPABASE_TEST_SERVICE_KEY` (proyecto separado)
- `service_role` bypasa RLS — nunca se usa anon key en el servidor

---

## 5. Estrategia de tests

### Tests unitarios / integración (Vitest) — 22 tests

| Fichero | Qué cubre |
|---|---|
| `tests/lead-schema.test.ts` | Validación Zod: campos requeridos, email trim+lowercase, longitudes |
| `tests/api-leads.test.ts` | Route handler mockeado: 201 éxito, 422 validación, 400 JSON inválido, 500 DB |
| `tests/ga-events.test.ts` | `form_start` dispara una vez, `button_click` params, `generate_lead` params |
| `tests/storyblok.test.ts` | Sin token→fallback, fetch OK→campos mapeados, error→fallback |
| `tests/integration/leads-insert.test.ts` | Insert real en garaje-test + teardown automático |

### Tests E2E (Playwright) — 6 tests

| Fichero | Qué cubre |
|---|---|
| `e2e/landing.spec.ts` | H1 visible, form visible, botón existe, submit con API mockeada→success |
| `e2e/form-validation.spec.ts` | Form vacío bloqueado (HTML5 required), email inválido bloqueado |

Los E2E usan `page.route()` para interceptar `/api/leads` → nunca escriben en base de datos real.  
Playwright arranca el servidor dev automáticamente (`webServer` en `playwright.config.ts`).

---

## 6. Flujo de despliegue

### Rama `prod` como trigger de Vercel

- Todo el trabajo diario va en `main`
- Vercel escucha la rama `prod` (no `main`)
- El skill `/deploy` ejecuta el gate y promociona `main → prod`

### Gate de calidad (`/deploy`)

1. `npm run test:all` (22 unit + 6 E2E)
2. `npm run build` (Next.js production build)
3. `npm run lint` (ESLint `next/core-web-vitals`)
4. `git commit` si hay cambios pendientes
5. `git push origin main` → actualiza remote
6. `git push origin main:prod` → Vercel despliega

### Variables de entorno en Vercel

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STORYBLOK_TOKEN`
- `NEXT_PUBLIC_GA_ID`

Las variables de test (`SUPABASE_TEST_*`) solo se usan en local, no en Vercel.

---

## 7. Problemas encontrados y soluciones

| # | Problema | Solución |
|---|---|---|
| 1 | `@next/third-parties` versión `^14.2.0` incompatible con Next.js 15 | Actualizar a `15.3.3` |
| 2 | Zod validaba email antes de `trim` — rechazaba `" HOLA@EMPRESA.COM "` | `.trim().toLowerCase().email()` — trim ANTES de email() |
| 3 | Storyblok no mostraba cambios en dev (cache retenía 3600s) | `cache: 'no-store'` en dev, `revalidate: 3600` en prod |
| 4 | Vercel no detectaba Next.js ("No Output Directory named public") | Crear `vercel.json` con `{ "framework": "nextjs" }` |
| 5 | Variables de entorno con nombres distintos en Vercel | Renombrar en dashboard de Vercel y redesplegar |
| 6 | E2E fallaban por falta de servidor (`ERR_CONNECTION_REFUSED`) | Añadir `webServer` en `playwright.config.ts` |
| 7 | E2E escribían en Supabase prod al hacer submit | `page.route("**/api/leads")` para interceptar y devolver `{ ok: true }` |
| 8 | Slug de Storyblok incorrecto (asumido `landing`, real `home`) | Corregir URL de fetch a `/stories/home` |

---

## 8. Prompts de la sesión

**Prompt 1 — Arranque del proyecto**
> Fetch this design file, read its readme, and implement the relevant aspects of the design. Genera una aplicación Next.js (App Router, TypeScript, Tailwind) que replique exactamente este diseño como landing de captación de leads. Entra primero en Plan Mode y propón la estructura antes de escribir código. Respeta la integración con el CMS y con la base de datos para la captación de leads.

**Prompt 2 — Variables de entorno**
> Puedes generar el env.local a partir de secrets.txt

**Prompt 3 — Prueba manual del API**
> Haz una prueba con curl

**Prompt 4 — Mensaje de éxito + CMS**
> Al enviar el formulario, cambia el texto por: ¡Gracias por registrarte! Recibirás los detalles y el material previo por email. Conecta la landing page con el CMS de Storyblok para gestionar el contenido desde ahí

**Prompt 5 — Error 500 en refresh**
> Al refrescar me da un RuntimeError 500

**Prompt 6 — Cambios CMS no aparecen**
> Aparece si hago cmd + shift + r, no con un cmd + r solo

**Prompt 7 — Despliegue**
> Ahora quiero probar el despliegue. Me ayudas paso a paso a ver cómo lo hago?

**Prompt 8 — Google Analytics**
> Añade Google Analytics para medir submit button, clicks, session start, session content, page_view y pasar los atributos correspondientes en el formulario del submit

**Prompt 9 — Rama de deploy**
> Vercel debería hacer deployment automatico cuando se haga un push a una rama que se llame prod en github, no a master. El skill de deploy debera coger main, hacer todo lo que haga y pushearlo a deploy

**Prompt 10 — Tests con qa-tester**
> Escribe los tests del formulario. Pasa el qa-tester sobre la integración con Supabase. Antes de desplegar, quiero una cobertura E2E completa

**Prompt 11 — Deploy gate**
> /deploy

**Prompt 12 — Tests contra garaje-test**
> Los tests deberían ir contra garaje-test, no contra garaje-prod. Actualmente veo que los leads se guardan en garaje-prod

**Prompt 13 — Verificación visual de garaje-test**
> Todavia no veo ningun test en garaje-test

**Prompt 14 — Deploy final + documento**
> Vale, ahora si lo veo · /deploy · Crea un .md con resumen de lo que hemos hecho y acciones y prompts

---

*Generado con Claude Code · Junio 2026*
