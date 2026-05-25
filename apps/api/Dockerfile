FROM node:20-alpine AS base
RUN corepack enable pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --filter @stackx/api...

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
RUN pnpm --filter @stackx/api build

FROM node:20-alpine AS runner
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
WORKDIR /app
COPY --from=build --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=deps --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules
USER nestjs
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
