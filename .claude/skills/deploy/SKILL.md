---
name: deploy
description: >
  Despliega la app. Se invoca manualmente con /deploy. Corre la suite de tests como
  gate; si pasa, hace push a main y Vercel construye automáticamente. Si algún test
  falla, NO despliega.
---

# Deploy

Procedimiento de despliegue. Vercel está conectado al repo por git y auto-despliega en
cada push a `main`, así que el "deploy" real es un push controlado por un gate de calidad.

## Pasos (en orden, parando ante el primer fallo)
1. **Gate de tests:** ejecuta `npm run test:all`.
   - Si **falla**: para, NO sigas, y reporta qué falló. No hagas push.
2. **Verificación de build:** ejecuta `npm run build`.
   - Si falla: para y reporta.
3. **Lint:** ejecuta `npm run lint` (si existe).
4. **Commit:** `git add -A` y `git commit` con un mensaje descriptivo del cambio.
5. **Push:** `git push origin main`.
6. **Reporta:** confirma que el push se hizo y recuerda que Vercel construye automáticamente.
   Indica dónde ver el estado del deploy (dashboard de Vercel) y la URL de producción.

## Reglas
- Nunca hagas push si el gate de tests o el build fallan.
- No despliegues secrets: verifica que `.env.local` está en `.gitignore`.
- Usa la rama `main` salvo que se indique otra.
