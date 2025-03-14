# Haesim Bot - Monorepo

Haesim Bot은 NestJS, Next.js, Ollama LLM을 활용한 Webex 통합 챗봇 솔루션입니다. Turborepo 기반 모노레포 구조로 개발과 배포 효율성을 높였으며, 대화형 AI 챗봇과 관리자 대시보드를 제공합니다.

![GitHub last commit](https://img.shields.io/github/last-commit/haesim/bot-haesim-monorepo)
![License](https://img.shields.io/badge/license-Private-blue)
![Node.js](https://img.shields.io/badge/Node.js-23.x-green)
![Yarn](https://img.shields.io/badge/Yarn-1.22.21-blue)

## 🏗️ 아키텍처 개요

Haesim Bot은 클라우드 호스팅된 마이크로서비스 기반 아키텍처를 사용합니다.

```mermaid
graph TD
    subgraph "클라우드 인프라"
        CLOUD["클라우드 인스턴스"]
        NGINX["Nginx 리버스 프록시"]
        IPTABLES["방화벽 (iptables)"]
        CLOUDINIT["Cloud-Init 자동화"]
    end

    subgraph "Docker 컨테이너"
        WEB["Next.js 애플리케이션\n(3000 포트)"]
        API["NestJS API\n(8080 포트)"]
        OLLAMA["Ollama LLM\n(내부 네트워크 전용)"]
        DB["데이터베이스\n(Oracle)"]
    end

    subgraph "외부 서비스"
        WEBEX["Cisco Webex API"]
        GH["GitHub Actions\n(CI/CD)"]
    end

    CLIENT[("사용자 브라우저")] -->|HTTPS| NGINX
    WEBEX <-->|Webhook 이벤트| API
    GH -->|자동 배포| CLOUD
    CLOUDINIT -->|초기 설정| CLOUD

    NGINX --> WEB
    NGINX --> API
    API <--> DB
    API <--> OLLAMA
    WEB --> API

    IPTABLES -->|포트 보안| NGINX
```

## 🌐 인프라 구성

클라우드 인스턴스에 호스팅되며 Cloud-Init 자동화 및 Nginx 리버스 프록시 설정으로 서비스 접근을 제공합니다.

```mermaid
flowchart TD
    subgraph "네트워크 구성"
        NGINX["Nginx 리버스 프록시\n(80/443 포트)"]
        FIREWALL["IPTables 방화벽"]
        PORT1["3000 포트\n(Next.js)"]
        PORT2["8080 포트\n(NestJS API)"]
        DOCKER_NET["Docker 내부 네트워크"]
    end

    INTERNET["인터넷"] -->|HTTP/HTTPS| NGINX
    NGINX --> PORT1
    NGINX --> PORT2
    PORT2 --> DOCKER_NET

    FIREWALL -->|허용: 80, 443, 3000| NGINX
    FIREWALL -->|Docker 내부 통신| DOCKER_NET
```

### URL 경로 및 프록시 설정

| 경로            | 서비스  | 설명                          |
| --------------- | ------- | ----------------------------- |
| `/`             | Next.js | 웹 애플리케이션 기본 경로     |
| `/api/v1/*`     | NestJS  | API 요청 (리라이팅 적용)      |
| `/webhook`      | NestJS  | Webex Webhook 수신 엔드포인트 |
| `/monitor`      | NestJS  | 모니터링 대시보드             |
| `/health`       | NestJS  | 헬스체크 엔드포인트           |
| `/nginx-health` | Nginx   | Nginx 헬스체크                |

## 📦 프로젝트 구조

프로젝트는 Turborepo 기반 모노레포로 구성되어 앱과 공유 패키지들을 효율적으로 관리합니다.

```mermaid
graph TD
    subgraph "모노레포 구조"
        ROOT["bot-haesim-monorepo"]

        subgraph "apps"
            API["api (NestJS)"]
            WEB["web (Next.js)"]
            OLLAMA["ollama (LLM)"]
        end

        subgraph "packages"
            CONFIG["typescript-config"]
            ESLINT["eslint-config"]
            UI["ui (공유 컴포넌트)"]
        end

        ROOT --> apps
        ROOT --> packages

        apps --> API
        apps --> WEB
        apps --> OLLAMA

        packages --> CONFIG
        packages --> ESLINT
        packages --> UI

        UI -.->|사용| WEB
        CONFIG -.->|사용| API
        CONFIG -.->|사용| WEB
        ESLINT -.->|사용| API
        ESLINT -.->|사용| WEB
    end
```

### 주요 디렉토리 구조

```bash
bot-haesim-monorepo/
├── apps/
│   ├── api/               # NestJS 백엔드 애플리케이션
│   │   ├── Dockerfile     # API 컨테이너 구성
│   │   ├── src/
│   │   │   ├── common/    # 공통 유틸리티 및 헬퍼
│   │   │   │   ├── constants/     # 상수 정의
│   │   │   │   ├── decorators/    # 커스텀 데코레이터
│   │   │   │   ├── filters/       # 예외 필터
│   │   │   │   ├── guards/        # 인증 가드
│   │   │   │   ├── interceptors/  # 로깅 인터셉터
│   │   │   │   ├── middleware/    # 로깅 미들웨어
│   │   │   │   └── utils/         # 유틸리티 함수
│   │   │   ├── config/    # 환경 설정
│   │   │   ├── database/  # 데이터베이스 연결 및 모델
│   │   │   ├── entities/  # 데이터베이스 엔티티
│   │   │   │   ├── messages/      # 메시지 관련 엔티티
│   │   │   │   └── webex/         # Webex 관련 엔티티
│   │   │   ├── health/    # 헬스체크 엔드포인트
│   │   │   ├── messages/  # 메시지 처리 모듈
│   │   │   ├── ollama/    # Ollama LLM 통합
│   │   │   └── webex/     # Webex Bot 통합
│   │   │       ├── bot/           # 봇 로직
│   │   │       ├── commands/      # 봇 명령어 처리
│   │   │       ├── interfaces/    # Webex 타입 정의
│   │   │       ├── monitor/       # 모니터링 대시보드
│   │   │       └── webhook-logs/  # Webhook 로그 처리
│   ├── web/               # Next.js 프론트엔드
│   │   ├── Dockerfile     # Web 컨테이너 구성
│   │   ├── src/
│   │   │   └── app/       # Next.js 페이지 및 컴포넌트
│   │   │       ├── chat/         # 채팅 인터페이스
│   │   │       └── dashboard/    # 관리자 대시보드
│   │   └── public/        # 정적 자산
│   └── ollama/            # Ollama LLM 서비스
│       ├── Dockerfile     # Ollama 컨테이너 구성
│       ├── model/         # 로컬 LLM 모델 저장소
│       ├── download-models.sh    # 모델 다운로드 스크립트
│       └── ollama-entrypoint.sh  # 컨테이너 진입점
├── packages/
│   ├── eslint-config/     # 공유 ESLint 설정
│   │   ├── nestjs.js      # NestJS 앱용 ESLint 규칙
│   │   └── next.js        # Next.js 앱용 ESLint 규칙
│   ├── typescript-config/ # 공유 TypeScript 설정
│   │   ├── nestjs.json    # NestJS 앱용 TypeScript 구성
│   │   └── next.json      # Next.js 앱용 TypeScript 구성
│   └── ui/                # 공유 UI 컴포넌트
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions CI/CD 파이프라인
├── docker-compose.yml     # 전체 서비스 컨테이너 설정
└── turbo.json             # Turborepo 구성
```

## 🚀 애플리케이션 기능

### NestJS API (apps/api)

NestJS 백엔드는 다음과 같은 핵심 기능을 제공합니다:

- **Webex 봇 통합**

  - Webex API를 통한 메시지 송수신
  - 봇 명령어 처리 및 응답 생성
  - 사용자 인증 및 권한 관리

- **Ollama LLM 서비스 연동**

  - 로컬 호스팅된 LLM 모델 활용
  - 텍스트 생성 및 대화 기능
  - 스트리밍 응답 지원

- **Webhook 처리**

  - Webex Webhook 이벤트 수신 및 처리
  - 이벤트 로깅 및 분석
  - 외부 시스템 연동

- **모니터링 및 관리**

  - 봇 활동 모니터링 대시보드
  - 실시간 로그 및 상태 확인
  - 성능 지표 수집

- **API 엔드포인트**
  - REST API를 통한 서비스 접근
  - 헬스체크 및 상태 보고
  - 보안 및 인증 계층

### Next.js 웹앱 (apps/web)

Next.js 프론트엔드는 다음과 같은 기능을 제공합니다:

- **관리자 대시보드**

  - 봇 상태 모니터링 및 관리
  - 사용 통계 및 분석 데이터 시각화
  - 시스템 설정 관리

- **Ollama 채팅 인터페이스**

  - 실시간 대화형 UI
  - 스트리밍 응답 표시
  - 대화 컨텍스트 관리

- **API 연동 서비스**
  - NestJS 백엔드와 통합
  - 데이터 가져오기 및 상태 관리
  - Server-Side Rendering 활용

### Ollama LLM (apps/ollama)

Ollama 컨테이너는 다음과 같은 기능을 제공합니다:

- **로컬 LLM 모델 호스팅**

  - 로컬 환경에서 모델 실행
  - 다양한 모델 지원
  - 추론 최적화

- **텍스트 생성 및 채팅**

  - 텍스트 완성 및 생성
  - 채팅 맥락 처리
  - 프롬프트 엔지니어링

- **API 통합**
  - REST API 인터페이스
  - 스트리밍 응답 지원
  - 백엔드 서비스와 통합

## 🔄 데이터 흐름

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Webex as Webex 플랫폼
    participant API as NestJS API
    participant DB as 데이터베이스
    participant LLM as Ollama LLM
    participant Web as Next.js 웹앱

    User->>Webex: 메시지 전송
    Webex->>API: Webhook 이벤트
    API->>DB: 메시지 저장
    API->>LLM: 컨텍스트와 함께 요청
    LLM-->>API: 응답 생성 (스트리밍)
    API-->>Webex: 봇 응답 전송
    Webex-->>User: 응답 표시

    User->>Web: 웹 대시보드 접속
    Web->>API: 데이터 요청
    API->>DB: 데이터 조회
    DB-->>API: 데이터 반환
    API-->>Web: 데이터 응답
    Web-->>User: 대시보드 표시
```

## 📊 모니터링 및 로깅

```mermaid
graph LR
    API[NestJS API] -->|로그 생성| LOGS[로그 파일]
    API -->|이벤트 기록| DB[데이터베이스]
    LOGS -->|분석| DASHBOARD[모니터링 대시보드]
    DB -->|집계| DASHBOARD
    LOGS -->|알림| ALERT[이상 감지]
```

## 🔧 기술 스택

### 백엔드

- **NestJS v10**: 확장 가능한 서버 애플리케이션 프레임워크
  - 모듈화된 아키텍처로 확장성 높은 API 개발
  - 데코레이터 기반 주입 시스템으로 의존성 관리 단순화
  - Guard, Interceptor, Filter를 활용한 크로스커팅 관심사 분리
- **TypeORM v0.3**: 객체 관계 매핑 도구
  - Oracle 데이터베이스 연동을 위한 드라이버
  - 엔티티 관계 모델링 및 마이그레이션 지원
- **Webex Bot SDK**: Webex 통합 봇 개발
  - Webhook 이벤트 처리 및 봇 명령어 구현
  - 메시지 포맷팅 및 미디어 공유 기능
- **Handlebars**: 서버사이드 템플릿 엔진
  - 모니터링 대시보드 및 관리자 화면 렌더링

### 프론트엔드

- **Next.js 15**: React 기반 프레임워크
  - App Router 아키텍처로 라우팅 최적화
  - Server Components를 활용한 성능 향상
  - Parallel Routes 및 Intercepting Routes 지원
- **React 19**: UI 컴포넌트 라이브러리
  - Hooks API를 활용한 상태 관리
  - 서버/클라이언트 컴포넌트 분리
- **TailwindCSS**: 유틸리티 기반 CSS 프레임워크
  - 일관된 디자인 시스템 구현
  - 반응형 디자인 및 다크모드 지원
- **TypeScript v5**: 정적 타입 지원
  - 타입 안전성 강화 및 개발자 경험 향상
  - 인터페이스 및 타입 정의로 코드 품질 향상

### LLM 및 AI

- **Ollama v0.2.x**: 로컬 LLM 모델 서비스
  - REST API를 통한 텍스트 생성 및 임베딩 생성
  - 다양한 오픈소스 모델 지원 (Llama, Mistral, Gemma 등)
  - 스트리밍 응답 및 컨텍스트 관리
- **Open Source LLM 모델**: 대화형 응답 생성
  - 가벼운 양자화 모델 활용으로 리소스 효율성 확보
  - 한국어 능력이 뛰어난 모델 선별 적용

### 인프라 및 배포

- **Oracle Cloud Infrastructure (OCI)**: ARM64 기반 클라우드 인프라
  - VM.Standard.A1.Flex 인스턴스 (ARM 아키텍처)
  - 비용 효율적인 Always Free 티어 활용
- **Cloud-Init**: 인스턴스 자동 초기화
  - 자동화된 서버 프로비저닝 및 초기 설정
  - 서비스 및 방화벽 자동 구성
- **Nginx**: 웹 서버 및 리버스 프록시
  - 경로 기반 라우팅으로 마이크로서비스 통합
  - HTTPS 및 SSL 인증서 관리
- **Docker & Docker Compose**: 컨테이너화 및 오케스트레이션
  - 멀티 스테이지 빌드로 이미지 최적화
  - 서비스 간 네트워크 격리 및 의존성 관리

### CI/CD 및 개발

- **GitHub Actions**: 지속적 통합/배포
  - 빌드, 테스트, 배포 자동화
  - 변경 감지 기반 선택적 빌드로 효율성 향상
  - SSH 기반 원격 배포 자동화
- **GitHub Container Registry (GHCR)**: 컨테이너 이미지 저장소
  - 프라이빗 레지스트리로 보안 강화
  - 버전 관리 및 이미지 태깅
- **Turborepo**: 모노레포 빌드 시스템
  - 빌드 캐싱으로 개발 속도 향상
  - 작업 간 의존성 그래프 관리
  - 워크스페이스 기반 병렬 빌드 최적화
- **Yarn v1.22**: 패키지 매니저
  - 워크스페이스 기반 모노레포 패키지 관리
  - 의존성 호이스팅 및 중복 제거
- **Husky & lint-staged**: 커밋 전 검증
  - 커밋 시 타입 검사 및 린팅 자동화
  - 코드 품질 강화를 위한 사전 검증

## 🛠️ 개발 환경 설정

### 필수 사전 요구사항

- **Node.js 23.x 이상**: 모든 앱과 패키지 빌드에 필요
- **Yarn 1.22.x**: 워크스페이스 기반 모노레포 관리
- **Docker 및 Docker Compose**: 컨테이너화된 개발 및 배포 환경
- **Git**: 버전 관리 및 GitHub Actions 연동

### 사전 환경 구성

프로젝트는 Turborepo를 활용한 모노레포로 구성되어 있어 단일 명령으로 여러 앱을 관리할 수 있습니다. 엔진 요구사항으로 Node.js 23.x 이상이 필요합니다.

```json
// package.json
{
  "engines": {
    "node": ">=23.0.0"
  },
  "packageManager": "yarn@1.22.21"
}
```

### 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/haesim/bot-haesim-monorepo.git
cd bot-haesim-monorepo

# 의존성 설치
yarn install

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집하여 필요한 환경 변수 설정

# 개발 서버 실행 (모든 앱)
yarn dev

# 또는 특정 앱만 실행
yarn workspace api dev
yarn workspace web dev

# 필요한 경우 개별 빌드
yarn build
yarn workspace api build
```

### Docker 개발 환경

```bash
# Docker 컨테이너로 전체 스택 실행 (개발 모드)
docker-compose up -d

# 특정 서비스만 실행
docker-compose up api web -d

# 로그 확인
docker-compose logs -f api

# 프로덕션 모드로 실행 (최적화된 빌드)
NODE_ENV=production docker-compose up -d

# Ollama 모델 다운로드 (최초 실행 시)
docker-compose exec ollama ollama pull mistral
```

### 환경 변수 및 구성

각 서비스별 주요 환경 변수는 다음과 같습니다:

```bash
# API 서비스
PORT=8080                   # API 서버 포트
NODE_ENV=development        # 환경 설정 (development, production)
API_PREFIX=/api/v1          # API 경로 접두사
BOT_ACCESS_TOKEN=...        # Webex Bot 접근 토큰
DOMAIN_NAME=...             # 서비스 도메인 이름
OLLAMA_API_URL=...          # Ollama API 접근 URL

# Web 서비스
NODE_ENV=development        # 환경 설정
NEXT_PUBLIC_API_URL=/api/v1 # 프론트엔드 API 요청 경로
API_SERVER_URL=...          # 백엔드 API 서버 URL

# Ollama 서비스
OLLAMA_KEEP_ALIVE=-1        # 모델 메모리 유지 설정
```

### 개발 명령어

```bash
# 타입 검사
yarn workspace api tsc --noEmit
yarn workspace web tsc --noEmit

# 린트 검사
yarn lint

# 테스트 실행
yarn test

# 포맷팅
yarn format
```

## 🚢 CI/CD 및 배포 구성

Haesim Bot은 GitHub Actions를 통한 CI/CD 파이프라인과 Docker Compose를 사용한 컨테이너 배포를 지원합니다. 변경 감지 시스템을 통해 필요한 서비스만 선택적으로 재빌드하여 효율성을 극대화합니다.

```mermaid
graph TD
    subgraph "배포 프로세스"
        GH["GitHub Repository"]
        GHA["GitHub Actions"]
        REGISTRY["GitHub Container Registry"]
        SERVER["Oracle Cloud 인스턴스"]
        CLOUDINIT["Cloud-Init 초기화"]
        COMPOSE["Docker Compose"]
        CONTAINERS["Docker 컨테이너"]
    end

    GH -->|코드 변경| GHA
    GHA -->|변경 감지| ANALYZE[변경 분석]
    ANALYZE -->|API 변경| BUILD_API[API 이미지 빌드]
    ANALYZE -->|Web 변경| BUILD_WEB[Web 이미지 빌드]
    ANALYZE -->|Ollama 변경| BUILD_OLLAMA[Ollama 이미지 빌드]
    BUILD_API -->|이미지 푸시| REGISTRY
    BUILD_WEB -->|이미지 푸시| REGISTRY
    BUILD_OLLAMA -->|이미지 푸시| REGISTRY
    GHA -->|SSH 접속| SERVER
    CLOUDINIT -->|인스턴스 초기 설정| SERVER
    SERVER -->|이미지 Pull| REGISTRY
    SERVER -->|docker-compose 실행| COMPOSE
    COMPOSE -->|컨테이너 관리| CONTAINERS
```

### GitHub Actions 워크플로우

`.github/workflows/deploy.yml` 파일에 전체 CI/CD 파이프라인이 정의되어 있으며, 다음과 같은 주요 기능을 포함합니다:

1. **변경 감지 분석 (analyze-changes)**

   - Git diff를 사용하여 이전 커밋과 비교
   - 앱별 변경사항 감지 (api, web, ollama)
   - 공통 파일(docker-compose.yml) 변경 시 전체 빌드 트리거
   - Turborepo 의존성 그래프를 활용한 패키지 변경 영향 분석

2. **컨테이너 이미지 빌드**

   - 각 서비스별 Dockerfile 멀티 스테이지 빌드
   - ARM64 아키텍처 대상 이미지 생성 (OCI VM.Standard.A1.Flex용)
   - 레이어 캐싱을 통한 빌드 속도 최적화
   - GitHub Container Registry (GHCR)에 이미지 푸시

3. **원격 배포**
   - SSH를 통한 클라우드 인스턴스 접속
   - 동적 docker-compose.yml 파일 생성
   - 환경 변수 주입 및 서비스 재시작
   - 빌드/배포 상태 확인 및 로깅

```yaml
# 워크플로우 트리거 설정
name: Deploy to OCI
on:
  push:
    branches: [main]
permissions:
  contents: read
  packages: write

jobs:
  analyze-changes:
    # 변경 감지 로직
  build-api:
    # API 이미지 빌드
  build-web:
    # Web 이미지 빌드
  build-ollama:
    # Ollama 이미지 빌드
  deploy:
    # SSH 연결 및 배포
```

### 증분 빌드 및 최적화

워크플로우는 변경된 서비스만 빌드하여 배포 시간과 리소스를 절약합니다:

```bash
# 변경 감지 예시 (GitHub Actions 워크플로우 내)
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD)

# apps/api 디렉토리 변경 감지
if echo "$CHANGED_FILES" | grep -q "^apps/api/"; then
  CHANGE_API=true
  echo "API 변경 감지됨"
fi

# 패키지 변경 시 의존성 그래프 분석
if echo "$CHANGED_FILES" | grep -q "^packages/"; then
  for package in $CHANGED_PACKAGES; do
    # 패키지가 api에 영향을 미치는지 확인
    if yarn --silent turbo run build --dry=json --filter="api...[packages/$package]" 2>/dev/null | grep -q "api"; then
      echo "패키지 $package는 API에 영향을 줍니다"
      CHANGE_API=true
    fi
  done
fi
```

### 멀티 아키텍처 빌드

Oracle Cloud의 ARM64 인스턴스에 최적화된 이미지 빌드:

```yaml
- name: Build and push API Docker image
  uses: docker/build-push-action@v4
  with:
    context: .
    file: ./apps/api/Dockerfile
    push: true
    tags: ghcr.io/${{ env.OWNER_LOWERCASE }}/${{ env.REPO_LOWERCASE }}-api:latest
    platforms: linux/arm64 # OCI VM.Standard.A1.Flex는 ARM64 아키텍처
    cache-from: type=local,src=/tmp/.buildx-cache-api
    cache-to: type=local,dest=/tmp/.buildx-cache-api-new,mode=max
```

### 자동화된 배포

클라우드 인스턴스에서의 자동화된 컨테이너 배포:

```bash
# GitHub Container Registry에서 이미지 가져오기
docker pull ghcr.io/${OWNER_LOWERCASE}/${REPO_LOWERCASE}-api:latest
docker pull ghcr.io/${OWNER_LOWERCASE}/${REPO_LOWERCASE}-web:latest
docker pull ghcr.io/${OWNER_LOWERCASE}/${REPO_LOWERCASE}-ollama:latest

# 서비스 시작 및 환경 변수 주입
docker-compose up -d
```

### 수동 배포 방법

필요한 경우 서버에서 직접 수동 배포 수행:

```bash
# 클라우드 인스턴스에서 실행
cd /home/ubuntu/app

# GitHub Container Registry 로그인
echo "$GH_PAT" | docker login ghcr.io -u USERNAME --password-stdin

# 이미지 가져오기
docker pull ghcr.io/haesim/bot-haesim-monorepo-api:latest
docker pull ghcr.io/haesim/bot-haesim-monorepo-web:latest
docker pull ghcr.io/haesim/bot-haesim-monorepo-ollama:latest

# 전체 스택 재배포
docker-compose up -d

# 특정 서비스만 재배포
docker-compose up -d api
```

## 🔍 모니터링 및 관리

### 상태 확인

```bash
# 헬스체크 엔드포인트 확인
curl http://your-domain.com/health

# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f
```

### 관리자 대시보드

- 웹 브라우저에서 `http://your-domain.com/dashboard` 접속
- 봇 상태, 메시지 통계, 시스템 성능 모니터링
- 설정 관리 및 이벤트 로그 확인

## 📋 설정 가이드

### 환경 변수

주요 환경 변수 목록:

| 변수명                | 설명                     | 예시                                             |
| --------------------- | ------------------------ | ------------------------------------------------ |
| `WEBEX_ACCESS_TOKEN`  | Webex Bot 접근 토큰      | `Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MA` |
| `WEBEX_WEBHOOK_URL`   | Webhook 엔드포인트 URL   | `https://your-domain.com/webhook`                |
| `DATABASE_URL`        | 데이터베이스 연결 문자열 | `oracle://username:password@host:port/service`   |
| `OLLAMA_API_URL`      | Ollama API 접근 URL      | `http://ollama:11434`                            |
| `API_PREFIX`          | API 경로 접두사          | `/api/v1`                                        |
| `NEXT_PUBLIC_API_URL` | 프론트엔드 API 요청 경로 | `/api/v1`                                        |
| `DOMAIN_NAME`         | 서비스 도메인 이름       | `bot.example.com`                                |
| `LOG_LEVEL`           | 로깅 레벨 설정           | `info`                                           |

### Webex Bot 설정

1. [Webex Developer 포털](https://developer.webex.com)에서 봇 생성
2. 봇 액세스 토큰 발급 및 환경 변수에 설정
3. Webhook URL 등록 및 이벤트 구독 설정

## 📄 라이센스

Private - 모든 권리 보유
