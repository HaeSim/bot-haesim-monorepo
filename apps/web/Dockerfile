# 개선된 Dockerfile
FROM node:23.7.0-alpine AS development
WORKDIR /usr/src/app
# 먼저 필수 파일만 복사하여 의존성 설치 (캐시 효율성 향상)
COPY package.json yarn.lock ./
COPY packages/*/package.json ./packages/
COPY apps/web/package.json ./apps/web/
# 네트워크 동시성을 더 높게 설정
RUN yarn config set network-timeout 300000 && \
    yarn install --frozen-lockfile --network-concurrency 4

# 소스 코드만 복사 (불필요한 파일 제외)
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/
COPY turbo.json ./
EXPOSE 3000
CMD ["yarn", "workspace", "web", "dev"]

FROM node:23.7.0-alpine AS build
WORKDIR /usr/src/app
ARG NEXT_PUBLIC_API_URL=/api/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# 의존성 단계 분리로 캐싱 활용도 향상
COPY package.json yarn.lock ./
COPY packages/*/package.json ./packages/
COPY apps/web/package.json ./apps/web/
RUN yarn config set network-timeout 300000 && \
    yarn install --frozen-lockfile --network-concurrency 4

# 실제 소스 코드만 복사
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/
COPY turbo.json ./
RUN echo "빌드 과정의 NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
# 병렬 빌드 활성화 및 Telemetry 비활성화
RUN NEXT_TELEMETRY_DISABLED=1 yarn workspace web build

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