FROM node:23.7.0-alpine AS base
# Oracle Instant Client 설치
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

# 의존성 관리를 위한 별도 단계 - 캐시 최적화
FROM base AS deps
# 의존성 관련 파일 복사
COPY package.json yarn.lock ./
COPY turbo.json ./
COPY packages/*/package.json ./packages/
COPY apps/api/package.json ./apps/api/
# 필요한 디렉토리 구조 생성
RUN mkdir -p packages/shared packages/database packages/ui apps/api
# 네트워크 동시성 설정 및 의존성 설치
RUN yarn config set network-timeout 300000 && \
    yarn install --frozen-lockfile --network-concurrency 4

# 개발 빌드 단계
FROM base AS build
WORKDIR /usr/src/app
# 의존성 복사
COPY --from=deps /usr/src/app/node_modules ./node_modules
# 루트 package.json 복사 - 워크스페이스 설정에 필요
COPY package.json yarn.lock ./
# 소스코드 복사
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
COPY turbo.json ./
# 빌드 환경 설정
ENV PATH="./node_modules/.bin:$PATH"
ENV NODE_OPTIONS="--max-old-space-size=4096 --no-warnings"
# 빌드 실행
RUN yarn workspace api build

# 프로덕션 의존성 단계
FROM base AS prod-deps
COPY package.json yarn.lock ./
COPY turbo.json ./
COPY packages/*/package.json ./packages/
COPY apps/api/package.json ./apps/api/
# 프로덕션 의존성만 설치
RUN yarn config set network-timeout 300000 && \
    yarn install --production=true --frozen-lockfile --network-concurrency 4

# 최종 프로덕션 이미지
FROM base AS production
ENV NODE_ENV=production
# 비 루트 사용자 추가
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /usr/src/app
# 캐시 디렉토리 설정
RUN mkdir -p /usr/src/app/.cache && \
    chown -R appuser:appgroup /usr/src/app/.cache
# 필요한 파일만 복사
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/apps/api/dist ./dist/
# 환경 변수 설정 파일 복사
RUN if [ -f apps/api/.env.production ]; then cp apps/api/.env.production ./dist/; fi
EXPOSE 8080
# 헬스체크 설정
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
CMD wget -q --spider http://localhost:8080/health || exit 1
# 사용자 권한 변경
USER appuser
CMD ["node", "dist/main"]