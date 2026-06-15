---
name: deploy
description: >
  Despliega la app. Se invoca manualmente con /deploy. Corre la suite de tests como
  gate sobre main; si pasa, pushea main a la rama prod, que dispara el auto-deploy
  de Vercel. Si algún test falla, NO despliega.
---

# Deploy

El trabajo diario ocurre en `main`. Vercel escucha la rama `prod`: cuando se hace
push a `prod`, Vercel construye y despliega automáticamente.

El "deploy" consiste en validar `main` y promoverla a `prod`.

## Pasos (en orden, parando ante el primer fallo)

1. **Gate de tests:** ejecuta `npm run test:all`.
   - Si **falla**: para, NO sigas, y reporta qué falló. No hagas push.
2. **Verificación de build:** ejecuta `npm run build`.
   - Si falla: para y reporta.
3. **Lint:** ejecuta `npm run lint`.
   - Si falla: para y reporta.
4. **Commit:** si hay cambios sin commitear, haz `git add` de los ficheros relevantes y `git commit` con un mensaje descriptivo. Si no hay cambios, omite este paso.
5. **Push a main remoto:** ejecuta `git push origin main`.
   Sincroniza el estado local con el remoto antes de promocionar.
6. **Push a prod:** ejecuta `git push origin main:prod`.
   Esto promueve el estado actual de `main` a la rama de producción.
7. **Reporta:** confirma que el push se hizo e indica que Vercel está construyendo.
   Recuerda al usuario dónde ver el estado (dashboard de Vercel).

## Reglas
- Nunca hagas push si el gate de tests o el build fallan.
- No despliegues secrets: verifica que `.env.local` está en `.gitignore`.
- El trabajo va siempre en `main`. Nunca commitees directamente en `prod`.
- `prod` es solo el trigger de Vercel — se actualiza exclusivamente via `main:prod`.
