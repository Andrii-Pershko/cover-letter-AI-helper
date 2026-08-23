FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat

FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
ENV DATABASE_URL=postgresql://aicl:aicl@db:5432/aicl?schema=public
RUN npm ci

FROM base AS dev
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY docker/entrypoint.sh ./docker/entrypoint.sh
EXPOSE 3401
ENTRYPOINT ["/bin/sh", "./docker/entrypoint.sh"]

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=postgresql://aicl:aicl@db:5432/aicl?schema=public
RUN npx prisma generate && npm run build

FROM deps AS migrate
ENV NODE_ENV=production
CMD ["npx", "prisma", "migrate", "deploy"]

FROM base AS production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3401
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/generated ./src/generated
COPY docker/entrypoint.sh ./docker/entrypoint.sh
EXPOSE 3401
ENTRYPOINT ["/bin/sh", "./docker/entrypoint.sh"]
