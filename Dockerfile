# syntax=docker/dockerfile:1

# --- deps: ставим зависимости ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# npm ci is strict — it refuses to install when the lockfile is missing entries
# package.json implies. Regenerate the lock with `npm install`, never by hand,
# and check `npm ci` still passes before pushing.
RUN npm ci --no-audit --no-fund

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
