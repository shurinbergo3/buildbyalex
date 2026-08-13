# syntax=docker/dockerfile:1

# --- deps: ставим зависимости ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# npm ci is strict about the lockfile, and node:22-alpine ships npm 10 while the
# lockfile is written by npm 11 — npm 10 then reports @emnapi/* and @swc/helpers
# as "missing from lock file" and refuses to install. Pin the same npm the lock
# was generated with; bump this together with the lockfile producer.
RUN npm i -g npm@11.6.2 && npm ci --no-audit --no-fund

# --- builder: собираем Next.js ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- runner: лёгкий образ только для запуска ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# standalone-сборка: сервер + только нужные node_modules
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Каталог для файловой БД (заявки/отзывы). Смонтируй сюда volume в Dokploy.
ENV DATA_DIR=/app/data
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data
VOLUME ["/app/data"]

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
