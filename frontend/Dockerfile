# Multi-stage Dockerfile for Next.js Application
# Base Node.js image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --only=production; \
  else echo "Lockfile not found." && exit 1; \
  fi

# =============================================================================
# Development Stage
# =============================================================================
FROM base AS development

WORKDIR /app

# Create next.js user FIRST (before copying files)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Install helper to drop privileges at runtime
RUN apk add --no-cache su-exec

# Install dependencies as root (copy without chown to keep bind-mount friendly)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code (when bind-mounted during development, runtime entrypoint will fix ownership)
COPY . .

# Ensure ownership is sane inside image (may be overridden by bind mounts at runtime)
RUN chown -R nextjs:nodejs /app || true

# Add entrypoint which will chown the mounted files and drop privileges to `nextjs`
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# NOTE: we intentionally keep the default user as root in development stage so the entrypoint
# can perform chown on bind-mounted volumes, then it will exec the process as `nextjs`.

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start Next.js in development mode
CMD ["npm", "run", "dev"]

# =============================================================================
# Build Stage
# =============================================================================
FROM base AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# =============================================================================
# Production Stage
# =============================================================================
FROM base AS production

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create next.js user FIRST
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application from builder stage with correct ownership
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy package.json for metadata with correct ownership
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Ensure all permissions are correct and secure
RUN chown -R nextjs:nodejs /app && \
    chmod -R 755 /app && \
    chmod -R 644 /app/.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]

# =============================================================================
# Static Export Stage (for CDN deployment)
# =============================================================================
FROM nginx:alpine AS static

# Copy static files from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom nginx configuration
COPY docker/nginx/static.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]