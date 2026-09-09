# ====================================================================
# Stage 1: Build Frontend SPA & Pre-bundle Assets (Bun builder)
# ====================================================================
FROM oven/bun:1.2-slim AS builder
WORKDIR /app

# Copy dependency manifests
COPY package.json bun.lock ./

# Install dependencies with frozen lockfile
RUN bun install --frozen-lockfile

# Copy application sources
COPY . .

# Build production Vite bundle into /app/dist
RUN bun run build

# ====================================================================
# Stage 2: Production Runtime with FFmpeg & Node.js 22 on Debian Slim
# ====================================================================
FROM node:22-bookworm-slim AS runner
WORKDIR /app

# Install system FFmpeg binary and ca-certificates
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg ca-certificates && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=8080

# Copy manifests and built client distribution from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

# Cloud Run default port
EXPOSE 8080

# Run as non-root node user for container security
USER node

# Start Hono server via tsx
CMD ["npx", "tsx", "src/server/index.ts"]
