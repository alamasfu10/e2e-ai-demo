# Landing de captación de leads — Garaje

App de captación de leads que replica el sistema de diseño de *Garaje Boost AI*.
Claude Code actúa como **orquestador**: a partir de un HTML de diseño construye una app full-stack y la hace evolucionar en iteraciones.

## Stack (fijo — no cambiar versiones sin avisar)
- **Next.js 15** (App Router) + React + **TypeScript** + Tailwind CSS.
- **Supabase** (Postgres) para persistencia.
- **Storyblok** como headless CMS (`@storyblok/react`).
- **GA4** vía `@next/third-parties/google` para analítica.
- Deploy en **Vercel** (auto-deploy en push a `main`).

> Mantén Next.js en la rama 15.x. (Compatibilidad con el anexo de despliegue en AWS Amplify.)

## Modelo de datos (`leads`)
nombre, apellido, email_empresa, empresa, cargo, tamano_equipo,
acepta_comunicaciones (bool), utm_source/medium/campaign, session_id, created_at.
Ver `supabase/schema.sql`.

## CMS - Storyblok
El content type `landing` (entrada `home`) expone un bloque de evento con: evento_etiqueta, evento_nombre, evento_descripcion, evento_fecha, evento_lugar, evento_duracion, evento_plazas.

## Reglas de implementación
- El **submit del formulario pasa SIEMPRE por un route handler server-side**  que valida e inserta en Supabase. Nunca insertar desde el cliente.
- Secrets en `.env.local` (local) y en variables de entorno de Vercel (prod). Nunca commitear secrets.
- Validación de entrada antes de insertar. Sanea y normaliza el email.

## Nota didáctica — equivalente "clásico" React + Node separados
En esta app el route handler de Next.js ES el backend. Una arquitectura separada equivalente sería:

```ts
// Backend Node/Express independiente (NO se usa aquí, solo referencia)
app.post('/api/leads', async (req, res) => {
  const lead = validate(req.body);
  const { error } = await supabase.from('leads').insert(lead);
  if (error) return res.status(500).json({ ok: false });
  res.json({ ok: true });
});
```

Next.js fusiona front y back en el mismo proyecto: el `route.ts` cumple ese rol sin servidor aparte.

## Testing
- Unitarias con **Vitest**, E2E con **Playwright**. Ver skill `testing`.
- Las pruebas de integración/E2E escriben SIEMPRE contra el proyecto Supabase **de test** (`SUPABASE_TEST_URL` / `SUPABASE_TEST_SERVICE_KEY`), nunca contra prod.

## Despliegue
- Flujo: tests en local como gate → si pasan, push a `main` → Vercel construye solo. Ver skill `deploy`.

## Variables de entorno
SUPABASE_URL, SUPABASE_SECRET, SUPABASE_PUBLISHABLE,
STORYBLOK_TOKEN, STORYBLOK_LOCATION,
GA_MEASUREMENT_ID, SUPABASE_TEST_URL,
SUPABASE_TEST_SECRET, SUPABASE_TEST_PUBLISHABLE
