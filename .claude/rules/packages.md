---
paths:
  - "packages/**"
---

# 공유 패키지 개발 규칙

## 패키지 목록과 역할

| 패키지          | 역할                               | 의존 대상                                                        |
| --------------- | ---------------------------------- | ---------------------------------------------------------------- |
| `@nexus/types`  | Solution, Category 등 공유 타입    | 없음 (최하위)                                                    |
| `@nexus/config` | 솔루션 레지스트리, DynamicIcon     | `@nexus/types`                                                   |
| `@nexus/ui`     | shadcn/ui 공유 컴포넌트, cn()      | 없음 (peer: react, react-dom)                                    |
| `@nexus/shell`  | PlatformShell, Header, ThemeToggle | `@nexus/ui`, `@nexus/config`, `@nexus/types` (peer: react, next) |

## 의존 방향 제한

- `solutions/` 패키지를 의존하면 안 됨
- 위 표의 의존 대상 외 다른 `@nexus/*` 패키지를 임의로 추가하지 않을 것
- 새 의존성 추가 시 순환 의존이 생기지 않는지 확인

## exports 관리

- `"exports": { ".": "./src/index.ts" }` 패턴 유지
- 새 export 경로 추가 시: `"./sub-path": "./src/sub-path/index.ts"` 형식
- 빌드 스크립트 불필요 — 소비 앱의 Turbopack이 트랜스파일

## peerDependencies 패턴

- React 컴포넌트를 포함하는 패키지: `"peerDependencies": { "react": "^19.0.0" }`
- Next.js API를 사용하는 패키지(`@nexus/shell`): `"next": "^16.0.0"` 추가
- `@nexus/types`처럼 순수 타입 패키지는 peerDependencies 불필요

## UI 컴포넌트 추가

- `@nexus/ui`에 새 컴포넌트 추가: `add-ui-component` 스킬을 사용 (내부적으로 `pnpm dlx shadcn@latest add <component>` 실행 + base-nova 검증 + export 확인)
- 스타일: `base-nova` (@base-ui/react 기반)
- `asChild` 패턴 사용 금지 — `render` prop + `nativeButton={false}` 사용

## 하위 호환성

- 공유 패키지의 export 시그니처 변경 시 모든 소비자(apps, solutions)에 영향
- 기존 export 삭제/변경 전 사용처를 grep으로 확인할 것
