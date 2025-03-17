# 개선된 Dockerfile
FROM node:23.7.0-alpine AS development
WORKDIR /usr/src/app
# pnpm 설치
RUN npm install -g pnpm@10.6.3

# 먼저 필수 파일만 복사하여 의존성 설치 (캐시 효율성 향상)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc ./
COPY packages/*/package.json ./packages/
COPY apps/web/package.json ./apps/web/
# 의존성 설치
RUN --mount=type=secret,id=GIT_AUTH_TOKEN \
    export GIT_AUTH_TOKEN=$(cat /run/secrets/GIT_AUTH_TOKEN) && \
    pnpm install

# 소스 코드만 복사 (불필요한 파일 제외)
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/
COPY turbo.json ./
EXPOSE 3000
CMD ["pnpm", "--filter", "web", "dev"]

FROM node:23.7.0-alpine AS build
WORKDIR /usr/src/app
ARG NEXT_PUBLIC_API_URL=/api/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# pnpm 설치
RUN npm install -g pnpm@10.6.3

# 의존성 단계 분리로 캐싱 활용도 향상
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc ./
COPY packages/*/package.json ./packages/
COPY apps/web/package.json ./apps/web/
RUN --mount=type=secret,id=GIT_AUTH_TOKEN \
    export GIT_AUTH_TOKEN=$(cat /run/secrets/GIT_AUTH_TOKEN) && \
    pnpm install

# 실제 소스 코드만 복사
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/
COPY turbo.json ./

# ui 패키지 빌드 - 명시적으로 ui 패키지 먼저 설치하고 빌드
RUN cd packages/ui && pnpm install && npm install -g tsup
RUN cd packages/ui && tsup src/index.ts --format cjs,esm --dts

RUN echo "빌드 과정의 NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
# 병렬 빌드 활성화 및 Telemetry 비활성화
RUN NEXT_TELEMETRY_DISABLED=1 pnpm --filter web build

FROM node:23.7.0-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production
ARG NEXT_PUBLIC_API_URL=/api/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# standalone 모드 결과물만 복사
COPY --from=build /usr/src/app/apps/web/.next/standalone ./
COPY --from=build /usr/src/app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /usr/src/app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD node apps/web/server.js