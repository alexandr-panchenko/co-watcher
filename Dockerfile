# Use official lightweight Bun image
FROM oven/bun:1.2-slim AS builder

WORKDIR /app

# Copy dependency specifications
COPY package.json bun.lock* ./

# Install all dependencies including devDependencies for build
RUN bun install --frozen-lockfile

# Copy source code and config files
COPY . .

# Build client production bundle (Vite)
RUN bun run build

# Production runner stage
FROM oven/bun:1.2-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy node_modules and built assets
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

EXPOSE 8080

CMD ["bun", "src/server/index.ts"]
