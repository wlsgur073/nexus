# Nexus Command Center

## 프로젝트 개요

- **프로젝트명**: nexus-command-center
- **설명**: 멀티 솔루션 클라우드 플랫폼 (Azure/AWS/GCP 스타일). "Nexus"라는 이름으로 여러 솔루션을 연결하는 플랫폼 셸 위에 솔루션을 추가하는 구조. "Command Center"는 대시보드 허브 역할
- **기술 스택**: Next.js 16 (App Router), React 19, TypeScript 5.x, Tailwind CSS v4, shadcn/ui (base-nova)
- **주요 의존성**: lucide-react (아이콘), @base-ui/react (UI 프리미티브), class-variance-authority, tailwind-merge
- **아키텍처**: Turborepo 모노레포 — 플랫폼 셸 + 솔루션 플러그인 구조 (Backstage 참고)

## 빌드 및 실행

- **Node.js**: 20+
- **패키지 매니저**: pnpm
- **빌드 오케스트레이터**: Turborepo

```bash
# 의존성 설치
pnpm install

# 전체 개발 서버 실행
pnpm dev

# 플랫폼만 개발 서버
pnpm turbo dev --filter=@nexus/platform

# Codex만 개발 서버
pnpm turbo dev --filter=@nexus/codex-web

# 전체 빌드
pnpm build

# 전체 린트
pnpm lint
```

## 테스트

```bash
# (테스트 프레임워크 미설정 — 추후 추가)
```

## 코드 스타일

- TypeScript strict 모드 사용
- ESLint (eslint-config-next) 준수
- shadcn/ui 컴포넌트는 `@base-ui/react` 기반 — `asChild` 대신 `render` prop + `nativeButton={false}` 사용
- Tailwind CSS v4: `@theme inline` 블록으로 테마 정의 (tailwind.config.ts 없음)
- 상세 규칙은 `.claude/rules/code-style.md` 참조

## 프로젝트 구조

```markdown
factory-ai-team/
├── apps/
│ └── platform/ # 플랫폼 셸 + Command Center (@nexus/platform)
│ ├── src/app/ # 대시보드(/), 카탈로그(/solutions), 설정
│ └── src/components/ # 플랫폼 전용 컴포넌트 (솔루션 카드 등)
│
├── solutions/
│ └── codex/ # Codex 솔루션 그룹
│ ├── web/ # Codex 프론트엔드 (@nexus/codex-web, basePath: /solutions/codex)
│ ├── models/ # Codex 데이터 모델 (@nexus/codex-models)
│ └── shared/ # Codex 내부 공유 유틸 (@nexus/codex-shared)
│
├── packages/
│ ├── ui/ # shadcn/ui 공유 컴포넌트 + cn() (@nexus/ui)
│ ├── shell/ # PlatformShell, Header, Sidebar, Breadcrumbs (@nexus/shell)
│ ├── types/ # Solution, Category 등 공유 타입 (@nexus/types)
│ └── config/ # 솔루션 레지스트리, DynamicIcon (@nexus/config)
│
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json # 공유 컴파일러 옵션
├── package.json # 루트 (workspace scripts, devDependencies)
└── tsconfig.json # IDE용 (extends base)
```

## 패키지 의존성 방향

```
@nexus/types ← @nexus/config ← @nexus/shell ← @nexus/platform
                    ↑              ↑
@nexus/ui ──────────┘         @nexus/codex-web
```

규칙: `packages/` → `solutions/` 방향 의존 금지.

## 중요 컨텍스트

- **브랜드**: 플랫폼명 "Nexus", 대시보드 "Command Center"
- **솔루션 추가 방법**: `packages/config/src/solutions.ts`의 `solutions` 배열에 항목을 추가하면 카탈로그, 사이드바, 상세 페이지에 자동 반영
- **등록 솔루션**: Codex (active, 데이터 거버넌스), AI Factory, Data Pipeline, CI/CD Hub, Insight Dashboard, LLM Gateway
- **인증**: 미구현 (플레이스홀더만 존재)
- **shadcn/ui 스타일**: `base-nova` (Radix가 아닌 @base-ui/react 기반)
- **경로 별칭**: 앱 내부에서만 `@/*` → `./src/*` (tsconfig paths). 패키지 간 참조는 `@nexus/*`
- **Internal Packages 패턴**: 공유 패키지는 TypeScript 소스를 직접 export (`"exports": { ".": "./src/index.ts" }`). 소비하는 앱의 번들러가 트랜스파일
- **Turbopack**: 각 앱의 `next.config.ts`에서 turbopack 사용 (`root`를 모노레포 루트로 설정)
- **ESLint**: flat config 형식 — 각 앱에 `eslint.config.mjs` 배치

## Claude 워크플로우

- Before each task: run `superpowers:brainstorming`
- When creating or modifying frontend UI components/pages: run `frontend-design:frontend-design` skill
