# Haesim CMS

Haesim CMS는 PayloadCMS 3.0과 PostgreSQL을 사용한 헤드리스 콘텐츠 관리 시스템입니다.

## 개발 환경 설정

### 필수 사전 요구사항

- Node.js 20.x 이상
- pnpm 8.x 이상
- PostgreSQL (또는 Docker로 실행)

### 로컬 개발 환경 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 또는 Docker 개발 환경 사용
docker-compose up -d
```

### 환경 변수 구성

`.env` 파일을 다음과 같이 설정하세요:

```
DATABASE_URI=postgres://postgres:postgres@postgres:5432/cms
PAYLOAD_SECRET=your_secret_key_here
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

## 주요 기능

- 관리자 대시보드 (`/admin`)
- RESTful API (`/api`)
- GraphQL API (`/api/graphql`)
- 미디어 라이브러리 관리
- 사용자 관리 및 권한 제어

## 배포 방법

프로덕션 배포를 위해 다음 단계를 따르세요:

```bash
# 빌드 실행
pnpm build

# 프로덕션 서버 시작
pnpm start

# 또는 Docker Compose로 배포
docker-compose -f docker-compose.production.yml up -d
```

## 커스터마이징

Haesim CMS는 다음과 같은 방법으로 커스터마이징할 수 있습니다:

- `src/collections` 디렉토리에 새로운 컬렉션 추가
- `src/payload.config.ts` 파일에서 PayloadCMS 설정 변경
- 관리자 UI 확장 및 커스터마이징

자세한 내용은 [PayloadCMS 공식 문서](https://payloadcms.com/docs)를 참조하세요.
