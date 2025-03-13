# Dockerfile for NestJS API - Optimized for faster builds
FROM node:23.7.0-alpine AS base

# Oracle Instant Client setup (공통 부분)
RUN mkdir -p /etc/ld.so.conf.d/ && \
    apk --no-cache add libaio libc6-compat curl unzip wget && \
    curl -o /tmp/instantclient.zip https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip && \
    unzip /tmp/instantclient.zip -d /opt && \
    rm /tmp/instantclient.zip && \
    ln -s /opt/instantclient* /opt/instantclient && \
    echo /opt/instantclient > /etc/ld.so.conf.d/oracle-instantclient.conf && \
    ldconfig /opt/instantclient || true

ENV LD_LIBRARY_PATH=/opt/instantclient
WORKDIR /usr/src/app

# Dependencies stage - only for dependency installation
FROM base AS deps
COPY package.json yarn.lock ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/api/package.json ./apps/api/

# 캐시 최적화를 위한 의존성 설치
RUN yarn config set network-timeout 300000 && \
    yarn install --frozen-lockfile --network-concurrency 1

# Development builder stage
FROM base AS development
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Build application with optimized memory settings
ENV PATH="./node_modules/.bin:$PATH"
RUN NODE_OPTIONS="--max-old-space-size=4096" yarn workspace api build

# Make sure dist directory exists and create views directory
RUN ls -la /usr/src/app/dist || echo "dist directory not found" && \
    mkdir -p /usr/src/app/views

# Production dependencies stage - smaller footprint
FROM base AS prod-deps
COPY package.json yarn.lock ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/api/package.json ./apps/api/

# 프로덕션 의존성만 설치하여 이미지 크기 최적화
RUN yarn config set network-timeout 300000 && \
    yarn install --production=true --frozen-lockfile --network-concurrency 1

# Production stage - final optimized image
FROM base AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy only what's needed for production
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/apps/api/dist ./dist
COPY --from=development /usr/src/app/apps/api/views ./views
COPY --from=development /usr/src/app/apps/api/public ./public

EXPOSE 8080

# 최적화된 헬스체크 - 더 짧은 간격으로 확인하여 빠른 실패 감지
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:8080/health || exit 1

CMD ["node", "dist/main"]