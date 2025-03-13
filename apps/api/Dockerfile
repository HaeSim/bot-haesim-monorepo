FROM node:23.7.0-alpine AS base
# Oracle Instant Client 설치 최적화
RUN mkdir -p /etc/ld.so.conf.d/ && \
    apk --no-cache add libaio libc6-compat curl unzip && \
    wget -q https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip -O /tmp/instantclient.zip && \
    unzip -q /tmp/instantclient.zip -d /opt && \
    rm /tmp/instantclient.zip && \
    ln -s /opt/instantclient* /opt/instantclient && \
    echo /opt/instantclient > /etc/ld.so.conf.d/oracle-instantclient.conf && \
    ldconfig /opt/instantclient || true
ENV LD_LIBRARY_PATH=/opt/instantclient
WORKDIR /usr/src/app

# 의존성 관리를 위한 별도 단계 - 캐시 최적화
FROM base AS deps
# package.json 파일들 복사 시 더 세분화된 방식 적용
COPY package.json yarn.lock ./
COPY turbo.json ./
# 패키지 복사 방식 개선 - 디렉토리 구조 유지
COPY packages/*/package.json ./packages/
# 더 명확한 디렉토리 구조 생성
RUN mkdir -p packages/shared packages/database packages/ui
# 네트워크 동시성 값 높여 속도 향상
RUN yarn config set network-timeout 300000 && \
    yarn install --frozen-lockfile --network-concurrency 4

# 개발 빌드 단계
FROM base AS build
WORKDIR /usr/src/app
# 전체 node_modules 복사
COPY --from=deps /usr/src/app/node_modules ./node_modules
# 이제 필요한 소스코드만 복사
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
COPY turbo.json ./
# 빌드 프로세스에 충분한 메모리 할당 및 디버그 정보 추가
ENV PATH="./node_modules/.bin:$PATH"
ENV NODE_OPTIONS="--max-old-space-size=4096 --no-warnings"
# TypeScript 컴파일 오류 해결을 위한 인터페이스 정의 확인
RUN echo "// 빌드 전 TypeScript 파일 구조 확인" && \
    find ./apps/api/src -name "*.ts" | grep -i bot
# 에러 상세 정보와 함께 빌드 실행
RUN yarn workspace api build --parallel || (echo "빌드 실패 원인: BotInfo 인터페이스 누락" && exit 1)

# 프로덕션 의존성만 위한 단계 - 최종 이미지 크기 최적화
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
# 비 루트 사용자 추가하여 보안 강화
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /usr/src/app
# 필요한 파일만 복사하여 크기 최소화
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/apps/api/dist ./dist/
# 런타임 환경변수 설정 파일 복사 (있다면)
RUN if [ -f apps/api/.env.production ]; then cp apps/api/.env.production ./dist/; fi
EXPOSE 8080
# 헬스체크 구성
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
CMD wget -q --spider http://localhost:8080/health || exit 1
# 사용자 변경
USER appuser
CMD ["node", "dist/main"]