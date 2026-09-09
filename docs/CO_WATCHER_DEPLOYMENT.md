# Co-Watcher Infrastructure, Deployment & CI/CD Specification

This document defines the authoritative, reproducible deployment, infrastructure provisioning, and CI/CD specification for the **Co-Watcher** system, strictly grounded in Sections 12, 14, 15, 17, and 18 of [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md) and governed by [`AGENTS.md`](file:///home/alex/github/co-watcher/AGENTS.md).

---

## 1. Architecture & Service Topology

Co-Watcher deploys as a modern, lightweight, serverless application on **Google Cloud Platform (GCP)**. It avoids extraneous abstractions (no Kubernetes, Redis clusters, or SQL monoliths), utilizing dedicated managed services that align with the contest runtime requirements [S1, S8, S9, S11]:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Co-Watcher Cloud Architecture                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Client Browser                                                            │
│   (React + Vite SPA)                                                        │
│           │                                                                 │
│           ▼ HTTPS                                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Google Cloud Run: Web Service (Node.js 22 + Hono)                   │   │
│   │  - Serves static Vite frontend assets                               │   │
│   │  - REST API & Server-Sent Events (SSE) updates                      │   │
│   │  - Agent Tool Execution Orchestration                               │   │
│   └───────┬─────────────────────────────┬───────────────────────────────┘   │
│           │                             │                                   │
│           ▼                             ▼                                   │
│   ┌──────────────────────────┐  ┌───────────────────────────────────────┐   │
│   │ Google Cloud Firestore   │  │ Google Cloud Secret Manager           │   │
│   │ (Native Mode)            │  │  - GEMINI_API_KEY                     │   │
│   │  - /rooms/{id}           │  │  - PARALLEL_API_KEY                   │   │
│   │  - /comments/{id}        │  │  - SESSION_SECRET_SALT                │   │
│   │  - /reactions/{id}       │  └───────────────────────────────────────┘   │
│   │  - /compositions/{id}    │                                              │
│   └──────────────────────────┘                                              │
│           │                                                                 │
│           ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Google Cloud Storage (GCS) Bucket                                   │   │
│   │  - gs://${PROJECT_ID}-cowatcher-media/                              │   │
│   │      ├── rooms/{id}/reactions/{takeId}.webm                         │   │
│   │      ├── rooms/{id}/source/original.{mp4,webm}                      │   │
│   │      └── rooms/{id}/exports/{compositionId}.mp4                     │   │
│   └───────┬─────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Google Cloud Run Job: Video Renderer (FFmpeg Container)             │   │
│   │  - node:22-bookworm-slim + FFmpeg binary                            │   │
│   │  - Dispatched asynchronously for composite MP4 renders              │   │
│   │  - Reads source + reaction takes, outputs MP4 to GCS                │   │
│   │  - Survives HTTP client disconnects & container scale-to-zero [S9]  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown
1. **Frontend Client:** React 19 + Vite + TypeScript SPA built with Bun. Serves responsive Stitch-aligned layouts, native YouTube IFrame API integration, browser `MediaRecorder` audio/video capture, and SSE event streaming.
2. **Backend Web Service (Cloud Run):** Lightweight Node.js 22 service built with Hono. Provides API endpoints, secret-token authentication verification, Firestore data synchronization, and agent tool execution.
3. **Primary Database (Cloud Firestore):** Firestore in Datastore Native mode. Houses authoritative state: room metadata, chronologically indexed commentary, reaction take metadata, and composition state machines.
4. **Media Store (Cloud Storage):** Dedicated regional storage bucket for recorded audio/video Blobs, authorized owner source files, and assembled MP4 video exports.
5. **Secrets & Credentials (Secret Manager):** Secure, centralized storage for external model and search API credentials, mounted at runtime as environment variables.
6. **Video Renderer (Cloud Run Job):** Multi-stage containerized worker with FFmpeg installed. The standard Google Cloud Node buildpack does NOT bundle FFmpeg binaries [S8]; therefore, long-running video assembly is decoupled into a dedicated Cloud Run Job to avoid HTTP timeout limits and surviving container restarts [S9].

---

## 2. Environment Variables & Secret Contracts

All configuration is strictly separated between build-time defaults and runtime secrets. **Secrets must never be printed to application logs, embedded in client-side bundles, or committed to version control.**

### 2.1 Configuration Schema

| Variable Name | Scope | Sensitivity | Purpose & Format | Default / Example |
| :--- | :---: | :---: | :--- | :--- |
| `NODE_ENV` | Build / Runtime | Public | Node execution mode (`development` \| `production`). | `production` |
| `PORT` | Runtime | Public | Server HTTP listen port (Cloud Run sets dynamically). | `8080` |
| `GCP_PROJECT_ID` | Runtime | Public | Target Google Cloud project identifier. | `co-watcher-prod` |
| `GCP_REGION` | Runtime | Public | Deployment region for Cloud Run, Firestore, and GCS. | `us-central1` |
| `FIRESTORE_DATABASE_ID`| Runtime | Public | Firestore database name. | `(default)` |
| `GCS_MEDIA_BUCKET` | Runtime | Public | Name of the GCS bucket for media assets. | `${GCP_PROJECT_ID}-cowatcher-media` |
| `GEMINI_API_KEY` | Runtime | **SECRET** | Google AI Studio API key for `gemini-2.5-flash` [S10]. | Resolved via Secret Manager |
| `PARALLEL_API_KEY` | Runtime | **SECRET** | Parallel Search API key for `/v1/search` endpoint [S3].| Resolved via Secret Manager |
| `SESSION_SECRET_SALT` | Runtime | **SECRET** | Cryptographic salt used for hashing room capability tokens. | Resolved via Secret Manager |
| `YOUTUBE_API_KEY` | Runtime | Semi-Private | Optional YouTube Data API v3 key for duration checks [S4]. | Empty string (falls back to oEmbed) |
| `VITE_API_BASE_URL` | Build (Client) | Public | Base URL for API calls from the browser SPA. | Empty string (relative path) |

---

## 3. Local Development & Smoke Testing (Bun + Node)

Co-Watcher adheres to the repository convention: **Bun is used for fast local development, testing, and linting; standard Node.js 22 is used for production execution.**

### 3.1 Initial Setup
```bash
# 1. Clone and enter repository
git clone https://github.com/alex/co-watcher.git
cd co-watcher

# 2. Install dependencies with frozen lockfile (No npm/yarn/pnpm!)
bun install --frozen-lockfile

# 3. Copy local environment template
cp .env.example .env.local
```

### 3.2 Running the Development Stack
```bash
# Start frontend Vite development server with HMR
bun run dev

# Start local backend API service in watch mode
bun run dev:server
```

### 3.3 Running Mechanical Quality Checks
Before any commit, the full suite of mechanical quality gates must pass cleanly:
```bash
# Run ESLint, design token verification, and arbitrary style checks
bun run lint

# Run TypeScript strict type verification
bun run typecheck

# Run Knip dead-code & unused dependency scan (standard + production strict)
bun run knip
bun run knip:prod

# Run deterministic unit and component tests
bun test

# Run Playwright layout geometry and DOM tests
bunx playwright test tests/e2e
```

### 3.4 Node.js Production Smoke Test
Because Cloud Run runs on standard Node.js, every release candidate must be smoke-tested in a pure Node environment:
```bash
# 1. Build client bundle
bun run build

# 2. Launch production server using Node.js
NODE_ENV=production node dist/server/index.js &
SERVER_PID=$!

# 3. Probe health endpoint
curl --fail http://localhost:8080/health || (kill $SERVER_PID && exit 1)

# 4. Clean up
kill $SERVER_PID
```

---

## 4. Google Cloud Platform (GCP) Provisioning

All cloud infrastructure is provisioned through the official `gcloud` CLI. Ensure you are authenticated with appropriate project-owner or editor permissions:

```bash
export GCP_PROJECT_ID="your-gcp-project-id"
export GCP_REGION="us-central1"
export BUCKET_NAME="${GCP_PROJECT_ID}-cowatcher-media"

gcloud config set project $GCP_PROJECT_ID
```

### 4.1 Enable Required Cloud APIs
```bash
gcloud services enable   run.googleapis.com   firestore.googleapis.com   storage.googleapis.com   secretmanager.googleapis.com   cloudbuild.googleapis.com   artifactregistry.googleapis.com
```

### 4.2 Provision Firestore (Native Mode)
```bash
# Create Firestore database in Native mode (if not already existing)
gcloud firestore databases create   --location=$GCP_REGION   --type=firestore-native
```

### 4.3 Provision Cloud Storage Bucket & Lifecycle
```bash
# 1. Create regional media bucket
gcloud storage buckets create gs://$BUCKET_NAME   --location=$GCP_REGION   --uniform-bucket-level-access

# 2. Apply CORS configuration for browser direct-upload of reaction takes
cat <<EOF > /tmp/gcs-cors.json
[
  {
    "origin": ["*"],
    "method": ["GET", "PUT", "POST", "HEAD"],
    "responseHeader": ["Content-Type", "Content-Length", "ETag"],
    "maxAgeSeconds": 3600
  }
]
EOF
gcloud storage buckets update gs://$BUCKET_NAME --cors-file=/tmp/gcs-cors.json

# 3. Apply 14-day lifecycle rule to auto-purge orphaned reaction takes
cat <<EOF > /tmp/gcs-lifecycle.json
{
  "rule": [
    {
      "action": {"type": "Delete"},
      "condition": {
        "age": 14,
        "matchesPrefix": ["rooms/orphaned-takes/"]
      }
    }
  ]
}
EOF
gcloud storage buckets update gs://$BUCKET_NAME --lifecycle-file=/tmp/gcs-lifecycle.json
rm -f /tmp/gcs-cors.json /tmp/gcs-lifecycle.json
```

### 4.4 Configure Secret Manager
```bash
# 1. Store Gemini API key
printf "%s" "$GEMINI_API_KEY" | gcloud secrets create GEMINI_API_KEY   --data-file=-   --replication-policy="automatic"

# 2. Store Parallel Search API key
printf "%s" "$PARALLEL_API_KEY" | gcloud secrets create PARALLEL_API_KEY   --data-file=-   --replication-policy="automatic"

# 3. Store Session Secret Salt
python3 -c "import secrets; print(secrets.token_hex(32), end="")" |   gcloud secrets create SESSION_SECRET_SALT   --data-file=-   --replication-policy="automatic"
```

### 4.5 Service Account & IAM Roles
Create a dedicated least-privilege service account for the Cloud Run runtime:
```bash
export SA_NAME="cowatcher-runner"
export SA_EMAIL="${SA_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com"

# 1. Create Service Account
gcloud iam service-accounts create $SA_NAME   --display-name="Co-Watcher Cloud Run Execution Account"

# 2. Grant Firestore read/write access
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID   --member="serviceAccount:$SA_EMAIL"   --role="roles/datastore.user"

# 3. Grant Cloud Storage bucket access
gcloud storage buckets add-iam-policy-binding gs://$BUCKET_NAME   --member="serviceAccount:$SA_EMAIL"   --role="roles/storage.objectAdmin"

# 4. Grant Secret Manager access
for SECRET in GEMINI_API_KEY PARALLEL_API_KEY SESSION_SECRET_SALT; do
  gcloud secrets add-iam-policy-binding $SECRET     --member="serviceAccount:$SA_EMAIL"     --role="roles/secretmanager.secretAccessor"
done
```

---

## 5. Video Renderer & Container Requirements (FFmpeg)

Because the Google Cloud Node.js buildpack (`google-22`) lacks FFmpeg binaries [S8], the video rendering worker is containerized using a multi-stage Dockerfile.

### 5.1 Dockerfile for Renderer Container (`Dockerfile.renderer`)
```dockerfile
# Stage 1: Build application assets
FROM oven/bun:1.2-slim AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Stage 2: Production runtime with FFmpeg
FROM node:22-bookworm-slim
WORKDIR /app

# Install system FFmpeg and clean up apt caches to minimize image size
RUN apt-get update &&     apt-get install -y --no-install-recommends ffmpeg ca-certificates &&     rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Non-root security user
USER node

CMD ["node", "dist/server/renderer-worker.js"]
```

### 5.2 Build & Register Container
```bash
# 1. Create Artifact Registry repository
gcloud artifacts repositories create cowatcher-repo   --repository-format=docker   --location=$GCP_REGION   --description="Co-Watcher container images"

# 2. Submit build to Cloud Build
gcloud builds submit   --tag="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/cowatcher-repo/renderer:latest"   -f Dockerfile.renderer .
```

---

## 6. Cloud Run Deployment Pipeline

### 6.1 Deploy Primary Web Service
```bash
gcloud run deploy co-watcher-web   --image="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/cowatcher-repo/renderer:latest"   --region=$GCP_REGION   --platform=managed   --service-account=$SA_EMAIL   --allow-unauthenticated   --port=8080   --memory=1Gi   --cpu=1   --min-instances=0   --max-instances=10   --set-env-vars="GCP_PROJECT_ID=${GCP_PROJECT_ID},GCS_MEDIA_BUCKET=${BUCKET_NAME},FIRESTORE_DATABASE_ID=(default)"   --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest,PARALLEL_API_KEY=PARALLEL_API_KEY:latest,SESSION_SECRET_SALT=SESSION_SECRET_SALT:latest"
```

### 6.2 Deploy Renderer Cloud Run Job
```bash
gcloud run jobs create co-watcher-render-job   --image="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/cowatcher-repo/renderer:latest"   --region=$GCP_REGION   --service-account=$SA_EMAIL   --memory=2Gi   --cpu=2   --tasks=1   --max-retries=1   --task-timeout=600s   --set-env-vars="GCP_PROJECT_ID=${GCP_PROJECT_ID},GCS_MEDIA_BUCKET=${BUCKET_NAME}"   --set-secrets="SESSION_SECRET_SALT=SESSION_SECRET_SALT:latest"
```

---

## 7. CI/CD Quality Gates (GitHub Actions)

Co-Watcher mandates that every pull request and commit to `main` pass through strict mechanical quality gates without bypasses or suppression escapes.

### 7.1 Workflow Configuration (`.github/workflows/quality-and-deploy.yml`)
```yaml
name: Quality Gate & Deployment

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  mechanical-quality-gate:
    name: Mechanical Quality Checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.2.4

      - name: Setup Node.js (for smoke tests)
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Dependencies
        run: bun install --frozen-lockfile

      - name: Lint & Style Standards
        run: bun run lint

      - name: TypeScript Strict Check
        run: bun run typecheck

      - name: Knip Unused Code Scan
        run: |
          bun run knip
          bun run knip:prod

      - name: Unit & Component Tests
        run: bun test

      - name: Install Playwright Browsers
        run: bunx playwright install --with-deps chromium

      - name: DOM Layout Geometry E2E Tests
        run: bunx playwright test tests/e2e

      - name: Node.js Smoke Test
        run: |
          bun run build
          NODE_ENV=production node dist/server/index.js &
          SERVER_PID=$!
          sleep 2
          curl --fail http://localhost:8080/health || (kill $SERVER_PID && exit 1)
          kill $SERVER_PID

  cloud-deploy:
    name: Continuous Deployment to Cloud Run
    needs: mechanical-quality-gate
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WIF_PROVIDER }}
          service_account: ${{ secrets.GCP_DEPLOY_SA }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Build and Deploy to Cloud Run
        run: |
          gcloud builds submit --tag="${{ secrets.GCP_REGION }}-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/cowatcher-repo/renderer:${{ github.sha }}" -f Dockerfile.renderer .
          gcloud run deploy co-watcher-web             --image="${{ secrets.GCP_REGION }}-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/cowatcher-repo/renderer:${{ github.sha }}"             --region=${{ secrets.GCP_REGION }}
```

---

## 8. Rollback, Monitoring & Verification Runbook

### 8.1 Instant Revision Rollback
If a deployment exhibits regressions or runtime faults, roll back traffic immediately to the previous healthy Cloud Run revision:
```bash
# 1. List revisions
gcloud run revisions list --service=co-watcher-web --region=$GCP_REGION

# 2. Redirect 100% of traffic to previous known-good revision
export PREVIOUS_REVISION="co-watcher-web-00012-abc"
gcloud run services update-traffic co-watcher-web   --region=$GCP_REGION   --to-revisions=${PREVIOUS_REVISION}=100
```

### 8.2 Production Health Probes & Monitoring
- **Health Check Endpoint:** `GET https://<deployed-domain>/health` returns `200 OK` with JSON payload `{ status: "healthy", timestamp: "..." }`.
- **Viewing Room Probe:** `GET https://<deployed-domain>/api/rooms/probe` asserts active read connection to Firestore.
- **Log Inspection:**
  ```bash
  # Stream live Cloud Run service logs
  gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=co-watcher-web"
  ```

---
