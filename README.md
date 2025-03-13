# Haesim Bot - Monorepo

Haesim Bot은 NestJS, Next.js, Ollama LLM을 활용한 Webex 통합 챗봇 솔루션입니다. Turborepo 기반 모노레포 구조로 개발과 배포 효율성을 높였으며, 대화형 AI 챗봇과 관리자 대시보드를 제공합니다.

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

| 경로 | 서비스 | 설명 |
|------|--------|------|
| `/` | Next.js | 웹 애플리케이션 기본 경로 |
| `/api/v1/*` | NestJS | API 요청 (리라이팅 적용) |
| `/webhook` | NestJS | Webex Webhook 수신 엔드포인트 |
| `/monitor` | NestJS | 모니터링 대시보드 |
| `/health` | NestJS | 헬스체크 엔드포인트 |
| `/nginx-health` | Nginx | Nginx 헬스체크 |

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

```
bot-haesim-monorepo/
├── apps/
│   ├── api/               # NestJS 백엔드 애플리케이션
│   │   ├── src/
│   │   │   ├── common/    # 공통 유틸리티 및 헬퍼
│   │   │   ├── config/    # 환경 설정
│   │   │   ├── database/  # 데이터베이스 연결 및 모델
│   │   │   ├── messages/  # 메시지 처리 모듈
│   │   │   ├── ollama/    # Ollama LLM 통합
│   │   │   └── webex/     # Webex Bot 통합
│   │   ├── views/         # 서버사이드 렌더링 템플릿
│   │   └── public/        # 정적 파일
│   ├── web/               # Next.js 프론트엔드
│   │   └── src/
│   │       └── app/       # Next.js 페이지 및 컴포넌트
│   └── ollama/            # Ollama LLM 서비스
│       └── model/         # 로컬 LLM 모델 저장소
├── packages/
│   ├── eslint-config/     # 공유 ESLint 설정
│   ├── typescript-config/ # 공유 TypeScript 설정 
│   └── ui/                # 공유 UI 컴포넌트
└── docker-compose.yml     # 전체 서비스 컨테이너 설정
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
- **NestJS**: 확장 가능한 서버 애플리케이션 프레임워크
- **TypeORM**: 객체 관계 매핑 도구
- **Webex Bot Framework**: Webex 통합 봇 개발
- **Handlebars**: 서버사이드 템플릿 엔진

### 프론트엔드
- **Next.js 15**: React 기반 프레임워크
- **React 19**: UI 컴포넌트 라이브러리
- **TailwindCSS**: 유틸리티 기반 CSS 프레임워크
- **TypeScript**: 정적 타입 지원

### LLM 및 AI
- **Ollama**: 로컬 LLM 모델 서비스
- **텍스트 생성 모델**: 대화형 응답 생성

### 인프라 및 배포
- **클라우드 가상 서버**: 클라우드 인프라
- **Cloud-Init**: 인스턴스 자동 초기화
- **Nginx**: 웹 서버 및 리버스 프록시
- **Docker**: 컨테이너화
- **Docker Compose**: 다중 컨테이너 관리

### CI/CD 및 개발
- **GitHub Actions**: 지속적 통합/배포
- **GitHub Container Registry**: 컨테이너 이미지 저장소
- **Turborepo**: 모노레포 빌드 시스템
- **TypeScript**: 정적 타입 지원
- **ESLint**: 코드 품질 도구

## 🛠️ 개발 환경 설정

### 필수 사전 요구사항
- Node.js 18.x 이상
- Yarn 패키지 매니저
- Docker 및 Docker Compose
- Git

### 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/yourusername/bot-haesim-monorepo.git
cd bot-haesim-monorepo

# 의존성 설치
yarn install

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집하여 필요한 환경 변수 설정

# 개발 서버 실행 (모든 앱)
yarn dev

# 또는 특정 앱만 실행
yarn workspace @bot-haesim/api dev
yarn workspace @bot-haesim/web dev
```

### Docker 개발 환경

```bash
# Docker 컨테이너로 전체 스택 실행
docker-compose up -d

# 특정 서비스만 실행
docker-compose up api web -d

# 로그 확인
docker-compose logs -f api
```

## 🚢 배포 구성

Haesim Bot은 GitHub Actions를 통한 CI/CD 파이프라인과 Docker Compose를 사용한 컨테이너 배포를 지원합니다. Cloud-Init을 통해 초기 인스턴스 설정이 자동화됩니다.

```mermaid
graph TD
    subgraph "배포 프로세스"
        GH["GitHub Repository"]
        GHA["GitHub Actions"]
        REGISTRY["GitHub Container Registry"]
        SERVER["클라우드 인스턴스"]
        CLOUDINIT["Cloud-Init 초기화"]
        COMPOSE["Docker Compose"]
        CONTAINERS["Docker 컨테이너"]
    end
    
    GH -->|코드 변경| GHA
    GHA -->|이미지 빌드 및 푸시| REGISTRY
    GHA -->|배포 명령| SERVER
    CLOUDINIT -->|인스턴스 초기 설정| SERVER
    SERVER -->|이미지 Pull| REGISTRY
    SERVER -->|docker-compose 실행| COMPOSE
    COMPOSE -->|컨테이너 관리| CONTAINERS
```

### CI/CD 워크플로우

1. GitHub 저장소에 변경사항 푸시
2. GitHub Actions 워크플로우 트리거
3. 변경 감지 및 필요한 서비스 이미지만 빌드
4. 빌드된 이미지를 GitHub Container Registry에 푸시
5. SSH를 통해 클라우드 인스턴스에 배포 명령 실행
6. Docker Compose로 컨테이너 업데이트

### 인스턴스 초기화

Cloud-Init을 통해 다음과 같은 초기 설정이 자동화됩니다:

1. 필요한 패키지 설치 (Docker, Docker Compose, Nginx 등)
2. Nginx 리버스 프록시 설정
3. 배포 디렉토리 및 권한 구성
4. 방화벽 규칙 설정
5. GitHub 배포 키 설정

### 배포 방법

GitHub Actions를 통한 자동 배포가 구성되어 있습니다. `main` 브랜치에 변경사항이 푸시되면 자동으로 배포가 진행됩니다.

수동 배포도 가능합니다:

```bash
# 클라우드 인스턴스에서 실행
cd /home/ubuntu/app

# GitHub Container Registry 로그인 (토큰 필요)
echo "$GH_PAT" | docker login ghcr.io -u USERNAME --password-stdin

# 이미지 가져오기
docker pull ghcr.io/username/repo-api:latest
docker pull ghcr.io/username/repo-web:latest
docker pull ghcr.io/username/repo-ollama:latest

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

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `WEBEX_ACCESS_TOKEN` | Webex Bot 접근 토큰 | `Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MA` |
| `WEBEX_WEBHOOK_URL` | Webhook 엔드포인트 URL | `https://your-domain.com/webhook` |
| `DATABASE_URL` | 데이터베이스 연결 문자열 | `oracle://username:password@host:port/service` |
| `OLLAMA_API_URL` | Ollama API 접근 URL | `http://ollama:11434` |
| `API_PREFIX` | API 경로 접두사 | `/api/v1` |
| `NEXT_PUBLIC_API_URL` | 프론트엔드 API 요청 경로 | `/api/v1` |
| `DOMAIN_NAME` | 서비스 도메인 이름 | `bot.example.com` |
| `LOG_LEVEL` | 로깅 레벨 설정 | `info` |

### Webex Bot 설정

1. [Webex Developer 포털](https://developer.webex.com)에서 봇 생성
2. 봇 액세스 토큰 발급 및 환경 변수에 설정
3. Webhook URL 등록 및 이벤트 구독 설정

## 📄 라이센스

Private - 모든 권리 보유