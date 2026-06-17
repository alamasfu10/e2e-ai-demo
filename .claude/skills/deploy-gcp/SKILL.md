---
name: deploy-gcp
description: >
  Despliega la app en Google Cloud Run via Docker. Se invoca manualmente con
  /deploy-gcp. Construye la imagen, la sube a Artifact Registry y despliega en
  Cloud Run pasando todas las variables de entorno de producción.
---

# Deploy — Google Cloud Run

La app se empaqueta como imagen Docker (Next.js standalone) y se despliega en
Cloud Run. Las variables de entorno de producción se pasan en el comando de
deploy — nunca se hornean en la imagen.

## Requisitos previos (una sola vez)

Antes de poder usar este skill, el usuario debe tener configurado:
1. `gcloud` CLI instalado y autenticado: `gcloud auth login`
2. Proyecto activo: `gcloud config set project $GCP_PROJECT_ID`
3. APIs habilitadas:
   ```
   gcloud services enable run.googleapis.com artifactregistry.googleapis.com
   ```
4. Repositorio en Artifact Registry creado:
   ```
   gcloud artifacts repositories create $GCP_REPO_NAME \
     --repository-format=docker \
     --location=$GCP_REGION
   ```
5. Docker autenticado contra Artifact Registry:
   ```
   gcloud auth configure-docker $GCP_REGION-docker.pkg.dev
   ```

## Variables de entorno necesarias (en .env.local)

```
GCP_PROJECT_ID      — ID del proyecto GCP (ej: garaje-boost-ai)
GCP_REGION          — Región (ej: europe-west1)
GCP_REPO_NAME       — Nombre del repositorio en Artifact Registry (ej: garaje)
GCP_SERVICE_NAME    — Nombre del servicio en Cloud Run (ej: garaje-boost-ai)
```

La imagen se taguea como:
`$GCP_REGION-docker.pkg.dev/$GCP_PROJECT_ID/$GCP_REPO_NAME/$GCP_SERVICE_NAME:latest`

## Pasos (en orden, parando ante el primer fallo)

1. **Leer variables:** carga `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_REPO_NAME`,
   `GCP_SERVICE_NAME` desde `.env.local`. Si alguna falta o tiene el valor
   `PLACEHOLDER`, para y pide al usuario que las rellene.

2. **Gate de tests:** ejecuta `npm run test:all`.
   - Si falla: para, NO sigas, reporta qué falló.

3. **Build de la imagen Docker:**
   ```bash
   docker build -t $IMAGE_TAG .
   ```
   Donde `IMAGE_TAG=$GCP_REGION-docker.pkg.dev/$GCP_PROJECT_ID/$GCP_REPO_NAME/$GCP_SERVICE_NAME:latest`
   - Si falla: para y reporta.

4. **Push a Artifact Registry:**
   ```bash
   docker push $IMAGE_TAG
   ```

5. **Deploy en Cloud Run:**
   ```bash
   gcloud run deploy $GCP_SERVICE_NAME \
     --image $IMAGE_TAG \
     --platform managed \
     --region $GCP_REGION \
     --allow-unauthenticated \
     --set-env-vars "NEXT_PUBLIC_SUPABASE_URL=...,SUPABASE_SERVICE_ROLE_KEY=...,NEXT_PUBLIC_STORYBLOK_TOKEN=...,NEXT_PUBLIC_GA_ID=...,REVALIDATE_SECRET=..."
   ```
   Las variables de entorno de producción se leen desde `.env.local` y se pasan
   como `--set-env-vars`. Nunca se incluyen en la imagen.

6. **Reporta:** muestra la URL pública del servicio (`Service URL`) que devuelve
   Cloud Run al terminar el deploy.

## Reglas

- Nunca hornear secrets en la imagen Docker.
- Verificar que `.env.local` está en `.gitignore` antes de cualquier push.
- El Dockerfile usa `output: 'standalone'` de Next.js — verificar que
  `next.config.ts` lo tiene habilitado antes de hacer el build.
- `--allow-unauthenticated` hace el servicio público. Si se necesita auth,
  quitar ese flag y gestionar IAM por separado.
