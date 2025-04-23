# Haesim CMS - Monorepo

Haesim CMS는 PayloadCMS 3.0(Next.js 15)과 PostgreSQL을 활용한 셀프호스팅 콘텐츠 관리 시스템입니다. Turborepo 기반 모노레포 구조로 개발과 배포 효율성을 높였으며, 직관적인 관리 인터페이스를 제공합니다.

![GitHub last commit](https://img.shields.io/github/last-commit/haesim/bot-haesim-monorepo)
![License](https://img.shields.io/badge/license-Private-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![pnpm](https://img.shields.io/badge/pnpm-10.6.3-blue)

## 🏗️ 아키텍처 개요

Haesim CMS는 PayloadCMS 기반의 헤드리스 CMS로, Next.js와 PostgreSQL을 사용합니다.

```mermaid
graph TD
    subgraph "클라우드 인프라"
        CLOUD["클라우드 인스턴스"]
        NGINX["Nginx 리버스 프록시"]
        IPTABLES["방화벽 (iptables)"]
        CLOUDINIT["Cloud-Init 자동화"]
    end

    subgraph "Docker 컨테이너"
        PAYLOAD["PayloadCMS\n(3000 포트)"]
        POSTGRES["PostgreSQL\n(5432 포트)"]
    end

    subgraph "외부 서비스"
        GH["GitHub Actions\n(CI/CD)"]
    end

    CLIENT[("사용자 브라우저")] -->|HTTPS| NGINX
    GH -->|자동 배포| CLOUD
    CLOUDINIT -->|초기 설정| CLOUD

    NGINX --> PAYLOAD
    PAYLOAD <--> POSTGRES

    IPTABLES -->|포트 보안| NGINX
```

## 🌐 인프라 구성

클라우드 인스턴스에 호스팅되며 Nginx 리버스 프록시 설정으로 서비스 접근을 제공합니다.

```mermaid
flowchart TD
    subgraph "네트워크 구성"
        NGINX["Nginx 리버스 프록시\n(80/443 포트)"]
        FIREWALL["IPTables 방화벽"]
        PORT1["3000 포트\n(PayloadCMS)"]
        DOCKER_NET["Docker 내부 네트워크"]
    end

    INTERNET["인터넷"] -->|HTTP/HTTPS| NGINX
    NGINX --> PORT1
    PORT1 --> DOCKER_NET

    FIREWALL -->|허용: 80, 443, 3000| NGINX
    FIREWALL -->|Docker 내부 통신| DOCKER_NET
```

### URL 경로 및 프록시 설정

| 경로            | 서비스     | 설명                 |
| --------------- | ---------- | -------------------- |
| `/`             | PayloadCMS | 프론트엔드 기본 경로 |
| `/admin`        | PayloadCMS | 관리자 대시보드      |
| `/api`          | PayloadCMS | REST API             |
| `/health`       | PayloadCMS | 헬스체크 엔드포인트  |
| `/nginx-health` | Nginx      | Nginx 헬스체크       |

## 📦 프로젝트 구조

프로젝트는 Turborepo 기반 모노레포로 구성되어 앱과 공유 패키지들을 효율적으로 관리합니다.

```mermaid
graph TD
    subgraph "모노레포 구조"
        ROOT["bot-haesim-monorepo"]

        subgraph "apps"
            CMS["cms (PayloadCMS)"]
        end

        subgraph "packages"
            CONFIG["typescript-config"]
            ESLINT["eslint-config"]
            UI["ui (공유 컴포넌트)"]
        end

        ROOT --> apps
        ROOT --> packages

        apps --> CMS

        packages --> CONFIG
        packages --> ESLINT
        packages --> UI

        CONFIG -.->|사용| CMS
        ESLINT -.->|사용| CMS
        UI -.->|사용| CMS
    end
```

### 주요 디렉토리 구조

```bash
bot-haesim-monorepo/
├── apps/
│   └── cms/              # PayloadCMS 애플리케이션
│       ├── src/
│       │   ├── app/      # Next.js 앱 디렉토리
│       │   ├── collections/ # 콘텐츠 컬렉션 정의
│       │   └── payload.config.ts # PayloadCMS 설정
│       ├── Dockerfile    # 컨테이너 구성
│       └── docker-compose.yml # 컨테이너 설정
├── packages/
│   ├── eslint-config/    # 공유 ESLint 설정
│   │   ├── nextjs.js     # Next.js 앱용 ESLint 규칙
│   │   └── payload.js    # PayloadCMS 앱용 ESLint 규칙
│   ├── typescript-config/ # 공유 TypeScript 설정
│   │   ├── base.json     # 기본 TypeScript 구성
│   │   ├── nextjs.json   # Next.js 앱용 TypeScript 구성
│   │   └── payload.json  # PayloadCMS 앱용 TypeScript 구성
│   └── ui/               # 공유 UI 컴포넌트
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions CI/CD 파이프라인
├── turbo.json            # Turborepo 구성
└── package.json          # 루트 패키지 설정
```

## 🚀 애플리케이션 기능

### PayloadCMS (apps/cms)

PayloadCMS는 다음과 같은 핵심 기능을 제공합니다:

- **관리자 대시보드**

  - 콘텐츠 관리 및 편집
  - 사용자 관리 및 권한 제어
  - 미디어 라이브러리 관리

- **콘텐츠 모델링**

  - 유연한 데이터 구조 정의
  - 관계형 데이터 모델링
  - 커스텀 필드 및 검증

- **API 액세스**

  - RESTful API 제공
  - GraphQL API 지원
  - 인증 및 권한 관리

- **미디어 처리**
  - 이미지 업로드 및 최적화
  - 미디어 트랜스코딩
  - 이미지 크롭 및 리사이징

## 🛠️ 기술 스택

### 프레임워크 및 라이브러리

- **PayloadCMS v3.0**: 헤드리스 CMS 프레임워크
  - TypeScript 기반 콘텐츠 모델링
  - 관리자 대시보드 제공
  - RESTful 및 GraphQL API 지원
- **Next.js 15**: React 기반 프레임워크
  - App Router 아키텍처
  - Server Components 지원
  - API 라우트 제공
- **React 19**: UI 컴포넌트 라이브러리
  - Hooks API 활용
  - 서버/클라이언트 컴포넌트
- **Lexical Rich Text Editor**: 텍스트 편집기
  - 확장 가능한 구조
  - 협업 기능 지원
  - 커스텀 노드 및 플러그인

### 데이터베이스 및 스토리지

- **PostgreSQL 15**: 관계형 데이터베이스
  - 트랜잭션 및 ACID 지원
  - JSON 데이터 타입 지원
  - 강력한 쿼리 최적화
- **Node.js 20.x**: 서버 런타임
  - 비동기 I/O 처리
  - 고성능 JavaScript 실행

### 인프라 및 배포

- **Docker & Docker Compose**: 컨테이너화 및 오케스트레이션
  - 멀티 스테이지 빌드
  - 서비스 간 네트워크 격리
- **Nginx**: 웹 서버 및 리버스 프록시
  - 경로 기반 라우팅
  - HTTPS 및 SSL 관리
- **GitHub Actions**: 지속적 통합/배포
  - 빌드, 테스트, 배포 자동화
  - SSH 기반 원격 배포
- **Turborepo**: 모노레포 빌드 시스템
  - 빌드 캐싱으로 개발 속도 향상
  - 작업 간 의존성 그래프 관리
  - 워크스페이스 기반 병렬 빌드 최적화
- **pnpm v10.x**: 패키지 매니저
  - 효율적인 디스크 공간 사용 (하드 링크 활용)
  - 워크스페이스 기반 모노레포 패키지 관리
  - 의존성 호이스팅 및 중복 제거

## 🔧 개발 환경 설정

### 필수 사전 요구사항

- **Node.js 20.x 이상**: 애플리케이션 빌드 및 실행에 필요
- **pnpm 8.x 이상**: 패키지 관리 및 스크립트 실행
- **Docker 및 Docker Compose**: 개발 환경 구성
- **PostgreSQL**: 데이터베이스 서버 (Docker로 실행 가능)

### 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/haesim/bot-haesim-monorepo.git
cd bot-haesim-monorepo

# 의존성 설치
pnpm install

# 환경 변수 설정
cd apps/cms
cp .env.example .env
# .env 파일 편집하여 필요한 환경 변수 설정

# 개발 서버 실행 (모든 앱)
pnpm dev

# 또는 특정 앱만 실행
pnpm --filter cms dev

# 또는 Docker 개발 환경 사용
cd apps/cms && docker-compose up -d
```

### 환경 변수 및 구성

주요 환경 변수는 다음과 같습니다:

```bash
# 데이터베이스 연결 문자열
DATABASE_URI=postgres://postgres:postgres@postgres:5432/cms

# PayloadCMS 보안 키
PAYLOAD_SECRET=your_secret_key_here

# 서버 URL (로컬 개발 및 프로덕션)
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

### 개발 명령어

```bash
# 타입 검사
pnpm --filter cms tsc --noEmit

# 린트 검사
pnpm lint

# 테스트 실행
pnpm test

# 포맷팅
pnpm format
```

## 🚢 CI/CD 및 배포 구성

GitHub Actions를 통한 CI/CD 파이프라인과 Docker Compose를 사용한 컨테이너 배포를 지원합니다.

```mermaid
graph TD
    subgraph "배포 프로세스"
        GH["GitHub Repository"]
        GHA["GitHub Actions"]
        SERVER["클라우드 인스턴스"]
        CLOUDINIT["Cloud-Init 초기화"]
        COMPOSE["Docker Compose"]
        CONTAINERS["Docker 컨테이너"]
    end

    GH -->|코드 변경| GHA
    GHA -->|SSH 접속| SERVER
    CLOUDINIT -->|인스턴스 초기 설정| SERVER
    SERVER -->|docker-compose 실행| COMPOSE
    COMPOSE -->|컨테이너 관리| CONTAINERS
```

### GitHub Actions 워크플로우

`.github/workflows/deploy.yml` 파일에 전체 CI/CD 파이프라인이 정의되어 있으며, 다음과 같은 주요 기능을 포함합니다:

1. **코드 체크아웃 및 의존성 설치**

   - GitHub 저장소에서 최신 코드 가져오기
   - Node.js 및 pnpm 설정
   - 애플리케이션 의존성 설치

2. **빌드 및 테스트**

   - 애플리케이션 빌드
   - 타입 검사 및 린트 검사
   - 테스트 실행 (구성된 경우)

3. **배포**
   - SSH를 통한 클라우드 인스턴스 접속
   - 최신 코드 가져오기
   - 컨테이너 빌드 및 배포
   - 서비스 재시작

### 자동화된 배포

클라우드 인스턴스에서의 자동화된 컨테이너 배포:

```bash
# GitHub 저장소에서 최신 코드 가져오기
git pull

# 애플리케이션 빌드 및 배포
cd apps/cms
pnpm install
pnpm build

# Docker Compose로 서비스 시작
docker-compose up -d
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

- 웹 브라우저에서 `http://your-domain.com/admin` 접속
- 콘텐츠 관리, 사용자 관리, 미디어 라이브러리 관리
- 설정 관리 및 API 문서 확인

## 📄 라이센스

Private - 모든 권리 보유
