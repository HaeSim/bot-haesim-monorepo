# 패키지 매니저 마이그레이션 단계

## Yarn Classic에서 pnpm으로 전환

이 프로젝트는 Yarn Classic(1.22.21)에서 pnpm(8.15.5)으로 패키지 매니저를 전환했습니다. 이 변경은 다음과 같은 이점을 제공합니다:

- **디스크 공간 효율성**: pnpm은 하드 링크를 사용해 중복 패키지 설치를 방지하여 디스크 공간을 절약합니다.
- **Turborepo 호환성**: pnpm은 Turborepo와 가장 잘 작동하는 패키지 매니저로 권장됩니다.
- **의존성 관리 개선**: 더 빠른 설치 및 정확한 의존성 해결을 제공합니다.

## 마이그레이션 방법

1. yarn.lock 파일 삭제
```
rm yarn.lock
```

2. pnpm 설치 (글로벌에 아직 없는 경우)
```
npm install -g pnpm@8.15.5
```

3. pnpm으로 의존성 설치
```
pnpm install
```

## 주요 변경사항

1. 워크스페이스 설정:
   - `package.json`의 `workspaces` 항목 대신 `pnpm-workspace.yaml` 파일 사용

2. 명령어 변경:
   - `yarn workspace <name> <command>` → `pnpm --filter <name> <command>`
   - `yarn <command>` → `pnpm <command>`

3. 설정 파일 추가:
   - `.npmrc` 파일 추가 (node-linker 및 의존성 설정)

## 개발 환경 시작하기

```bash
# 개발 모드 실행
pnpm dev

# 특정 워크스페이스 실행
pnpm --filter api dev
pnpm --filter web dev

# 빌드
pnpm build
```

이제 pnpm으로 모노레포를 효율적으로 관리할 수 있습니다.