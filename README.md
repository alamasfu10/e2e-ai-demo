# Artefactos de Claude Code — Sesión End-to-End (Garaje)

Estos archivos son el "andamiaje" de Claude Code para la sesión: contexto del proyecto,
un subagente de QA y dos skills (testing y deploy). Con ellos, al abrir Claude Code en el
repo, el "equipo" ya está montado y solo hay que generar código en vivo.

## Contenido

```
claude-code-artefactos/
├── README.md                         ← este archivo
├── CLAUDE.md                         ← contexto del proyecto (siempre cargado)
├── design/
│   └── landing.html                  ← placeholder; pega aquí el export de Claude Design
├── .claude/                          ← CARPETA OCULTA (empieza por punto)
│   ├── agents/
│   │   └── qa-tester.md              ← subagente de QA (contexto y permisos propios)
│   └── skills/
│       ├── testing/
│       │   └── SKILL.md              ← convenciones de testing
│       └── deploy/
│           └── SKILL.md              ← skill /deploy (gate de tests → push → Vercel)
└── supabase/
    └── schema.sql                    ← tabla `leads` + RLS (ejecutar en prod y test)
```

> Nota: `.claude/` es una carpeta oculta. Si tu explorador de archivos no la muestra,
> activa "ver archivos ocultos" (en macOS Finder: `Cmd + Shift + .`).

## Requisitos previos
- **Node.js 20+** y **Claude Code** instalado.
- Cuentas (todas free tier): GitHub, Vercel (Hobby), Supabase, Storyblok, GA4 y PostHog.
- Dos proyectos Supabase: `garaje-prod` y `garaje-test`.

## Puesta en marcha (antes de la sesión)
1. Crea un repo vacío y copia dentro **todo el contenido de esta carpeta** (incluida `.claude/`).
2. En la raíz del repo, abre Claude Code y verifica que el andamiaje está cargado:
   - `/agents` → debe listar **qa-tester**.
   - Las skills **deploy** y **testing** deben aparecer disponibles (`/deploy`, `/testing`).
3. Ejecuta el SQL de `supabase/schema.sql` en **ambos** proyectos Supabase (prod y test).
4. En Storyblok, crea el content type `landing` y la entrada `home` con el copy de la landing.
5. Crea la propiedad de GA4 y anota el Measurement ID (`G-XXXXXXX`).
6. Ten a mano todas las keys para dárselas a Claude Code cuando las pida (NO las commitees).

## Variables de entorno
Crea un `.env.local` (Claude Code lo generará en vivo cuando integre Supabase) y replica
las mismas variables en Vercel (Project → Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STORYBLOK_TOKEN=
NEXT_PUBLIC_GA_ID=
# Solo para tests (proyecto Supabase de test):
SUPABASE_TEST_URL=
SUPABASE_TEST_SERVICE_KEY=
```

Asegúrate de que `.env.local` está en `.gitignore`.

## Cómo se usan en la sesión
- **CLAUDE.md** se carga solo: define stack, design tokens, modelo de datos y reglas.
- **Subagente qa-tester:** invócalo por nombre cuando quieras pruebas, p. ej.:
  > `qa-tester, escribe y ejecuta la suite de pruebas de la landing (unitarias, integración contra el Supabase de test y un E2E de Playwright).`
  Trabaja en su propio contexto y devuelve un resumen, sin contaminar la conversación principal.
- **Skill deploy:** se invoca con `/deploy`. Corre los tests como gate; si pasan, hace push a
  `main` y Vercel construye automáticamente.
- **Skill testing:** material de referencia de convenciones; el qa-tester la usa al escribir tests.

## Orden de la demo (resumen)
1. Pega el HTML en `design/landing.html`.
2. Handoff: pide la app Next.js (Plan Mode + Explore).
3. Iteración 1: + Supabase (route handler server-side + secrets).
4. Iteración 2: + Storyblok.
5. Iteración 3: + GA4.
6. QA: `qa-tester`.
7. Deploy: `/deploy`.

El guion completo minuto a minuto está en el documento `guia-sesion-e2e-claude.docx`.
