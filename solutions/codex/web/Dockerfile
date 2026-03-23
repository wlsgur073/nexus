FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache libc6-compat

FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@latest
COPY . .
RUN turbo prune @nexus/codex-web --docker

FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json
RUN pnpm turbo build --filter=@nexus/codex-web

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/solutions/codex/web/.next/standalone ./
COPY --from=builder /app/solutions/codex/web/.next/static ./solutions/codex/web/.next/static
USER nextjs
EXPOSE 3001
ENV PORT=3001 HOSTNAME="0.0.0.0"
CMD ["node", "solutions/codex/web/server.js"]
