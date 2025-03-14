# UI 컴포넌트 라이브러리

이 패키지는 shadcn-ui를 기반으로 한 공유 UI 컴포넌트 라이브러리입니다.

## 설치

```bash
pnpm add ui
```

## 사용 방법

### 스타일 설정

애플리케이션의 진입점에서 스타일을 가져옵니다:

```tsx
// app/layout.tsx 또는 pages/_app.tsx
import 'ui/src/styles.css';
```

### 컴포넌트 사용

```tsx
import { Button } from 'ui';

export default function MyComponent() {
  return <Button variant='default'>버튼</Button>;
}
```

## 사용 가능한 컴포넌트

- Button: 다양한 스타일과 크기를 지원하는 버튼 컴포넌트

## 개발

```bash
# 개발 모드로 실행
pnpm dev

# 빌드
pnpm build
```

## 새 컴포넌트 추가하기

1. shadcn CLI를 사용하여 새 컴포넌트를 추가합니다:

```bash
cd packages/ui
pnpm dlx shadcn@latest add [컴포넌트명]
```

2. 필요한 경우 컴포넌트 파일의 import 경로를 수정합니다:

```tsx
// 예: src/components/ui/[컴포넌트명].tsx
import { cn } from '../../lib/utils'; // 상대 경로로 수정
```

3. src/index.ts 파일에 새 컴포넌트를 내보냅니다:

```tsx
// src/index.ts
export * from './components/ui/[컴포넌트명]';
```

4. 패키지를 다시 빌드합니다:

```bash
pnpm build
```
