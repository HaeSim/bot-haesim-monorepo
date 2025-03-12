# Bot Haesim Monorepo

Webex 봇과 웹 애플리케이션을 포함한 모노레포 프로젝트입니다.

## 프로젝트 구조

```
bot-haesim-monorepo/
├── apps/
│   ├── api/        # NestJS 애플리케이션 (Webex Bot)
│   └── web/        # NextJS 애플리케이션 (웹 인터페이스)
├── packages/
│   ├── eslint-config/    # 공유 ESLint 설정
│   ├── typescript-config/ # 공유 TypeScript 설정
│   └── ui/        # 공유 UI 컴포넌트 (옵션)
├── docker-compose.yml
├── turbo.json
└── package.json
```

## 시작하기

### 개발 환경 설정

```bash
# 의존성 설치
yarn install

# 로컬 개발
yarn dev

# 빌드
yarn build
```

### Docker로 실행하기

```bash
# Docker 컨테이너 실행
docker-compose up -d

# Docker 컨테이너 중지
docker-compose down
```

## 애플리케이션 접속

- NestJS API: http://localhost:3000
- NextJS 웹: http://localhost:3001

## 주요 기능

### NestJS API (Webex Bot)

- Webex 봇 통합
- Webhook 처리
- 명령어 처리
- 모니터링 대시보드
- Oracle DB 연동

### NextJS 웹

- 향상된 관리자 인터페이스
- 봇 상태 및 통계 대시보드
- API와 Docker 네트워크 통신