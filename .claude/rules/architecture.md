# 아키텍처 규칙

## 패키지 의존 방향

### 플랫폼 패키지

```
@nexus/types ← @nexus/config ← @nexus/shell ← @nexus/platform
                                    ↑              ↑
@nexus/ui ──────────────────────────┘         @nexus/{id}-web
```

### 솔루션 내부 패키지

```
@nexus/types ← @nexus/{id}-models ← @nexus/{id}-shared ← @nexus/{id}-web
                                                         ← @nexus/{id}-api (향후)
```

- 솔루션 web/api는 자신의 models와 shared를 의존
- models는 @nexus/types만 의존 (최하위)
- shared는 models + @nexus/types를 의존

### 규칙

- `packages/` → `solutions/` 방향 의존 금지
- 솔루션 패키지(`@nexus/{id}-*`)는 플랫폼 패키지(`@nexus/ui`, `@nexus/config`, `@nexus/types`)를 의존할 수 있음
- `@nexus/shell`은 Platform 앱 전용 — 솔루션에서 의존 금지
- 솔루션 간 교차 의존 금지 (예: `@nexus/codex-web` → `@nexus/llm-gateway-models` 금지)

## Internal Packages 패턴

- 모든 공유 패키지의 `exports` 필드는 TypeScript 소스를 직접 가리킴: `"exports": { ".": "./src/index.ts" }`
- 별도 빌드 스크립트 불필요 — 소비하는 앱의 Turbopack이 트랜스파일
- 새 패키지 생성 시 이 패턴을 반드시 따를 것

## Turbopack 설정

- 각 Next.js 앱의 `next.config.ts`에서 `turbopack.root`를 모노레포 루트로 설정: `resolve(__dirname, "../../..")`
- 이 설정이 없으면 Turbopack이 workspace 패키지를 resolve하지 못함

## basePath와 route 일치

- 솔루션 앱의 `next.config.ts` `basePath`와 `packages/config/src/solutions.ts`의 `route` 값은 반드시 일치해야 함
- 형식: `/solutions/{id}`

## 워크스페이스 구조

- `pnpm-workspace.yaml`에 `solutions/*/web`, `solutions/*/models`, `solutions/*/shared` 패턴이 등록됨
- 이 구조에 맞추면 별도 등록 없이 워크스페이스에 자동 인식
