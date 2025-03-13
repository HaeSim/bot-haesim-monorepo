# Dockerfile for NextJS Web
FROM node:23.7.0-alpine AS development

WORKDIR /usr/src/app

# Copy workspace files for monorepo
COPY package.json yarn.lock ./
COPY packages/ ./packages/
COPY apps/web/package.json ./apps/web/

RUN yarn config set network-timeout 300000 && \
    yarn install --network-timeout 300000 --frozen-lockfile --network-concurrency 1

COPY . .

EXPOSE 3000

CMD ["yarn", "workspace", "web", "dev"]

# Production build stage
FROM node:23.7.0-alpine AS build

WORKDIR /usr/src/app

# 환경 변수 ARG로 정의하여 빌드 시 전달
ARG NEXT_PUBLIC_API_URL=/api/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy workspace files for monorepo
COPY package.json yarn.lock ./
COPY packages/ ./packages/
COPY apps/web/package.json ./apps/web/

RUN yarn config set network-timeout 300000 && \
    yarn install --network-timeout 300000 --frozen-lockfile --network-concurrency 1

COPY . .

# 환경 변수 확인
RUN echo "빌드 과정의 NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"

RUN yarn workspace web build

# Production runtime stage
FROM node:23.7.0-alpine AS production

# 모노레포 구조 유지를 위해 기존 작업 디렉토리 경로 유지
WORKDIR /usr/src/app

ENV NODE_ENV=production
# 빌드 시점의 환경 변수를 런타임까지 전달
ARG NEXT_PUBLIC_API_URL=/api/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Next.js의 standalone 모드 사용시 이점:
# 1. 불필요한 의존성 설치 과정 제거 (의존성이 이미 번들링되어 있음)
# 2. 이미지 크기와 빌드 시간 단축
# 3. 실행 성능 향상

# 모노레포 구조를 고려한 standalone 출력 복사
# .next/standalone 디렉토리에는 서버와 필요한 의존성이 모두 포함됨
COPY --from=build /usr/src/app/apps/web/.next/standalone ./
# 정적 파일은 별도로 복사 필요 (standalone에 포함되지 않음)
COPY --from=build /usr/src/app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /usr/src/app/apps/web/public ./apps/web/public

EXPOSE 3000

# 시작 시 환경 변수 확인
# standalone 모드에서는 node로 직접 서버 실행 (yarn workspace 대신)
# docker-compose.yml의 command 설정과 일치시킴
CMD echo "컨테이너 시작 시 NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL" && node apps/web/server.js