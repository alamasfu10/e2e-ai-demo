---
name: testing
description: >
  Convenciones y procedimiento de testing del proyecto: herramientas, estructura,
  cómo correr las pruebas y qué mockear. Aplica al escribir o modificar tests.
---

# Testing — convenciones del proyecto

## Herramientas
- **Vitest** para unitarias y de integración.
- **Playwright** para E2E.

## Estructura
- Unitarias/integración: `tests/**/*.test.ts`
- E2E: `e2e/**/*.spec.ts`
- Fixtures y helpers: `tests/helpers/`

## Comandos
- Unitarias/integración: `npm run test`
- E2E: `npm run test:e2e`
- Todo (lo que usa el gate de deploy): `npm run test:all`

## Qué mockear y qué no
- **Storyblok:** mockea las respuestas del CMS (no dependas de la red en los tests).
- **Supabase:** en integración/E2E usa el **proyecto de test real** (no mock), para validar
  el insert de verdad. Variables: `SUPABASE_TEST_URL`, `SUPABASE_TEST_SERVICE_KEY`.
- **GA4/analítica:** mockea/espía las funciones de tracking; comprueba que se llaman con
  el evento y payload correctos. No envíes eventos reales en los tests.

## Buenas prácticas
- Cada test de integración/E2E limpia sus datos (teardown).
- Nombres descriptivos, consistentes.
- Un test = una aserción de comportamiento clara.
