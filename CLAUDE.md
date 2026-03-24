# Nexus

## 프로젝트 개요

- **프로젝트명**: Nexus
- **설명**: 멀티 솔루션 클라우드 플랫폼. "Nexus"는 여러 솔루션을 연결하는 플랫폼 셸이며, 그 안의 "Command Center"는 솔루션 현황을 확인하는 대시보드 허브. 각 솔루션(Codex 등)은 독립적으로 명명
- **기술 스택**: Next.js 16 (App Router), React 19, TypeScript 5.x, Tailwind CSS v4, shadcn/ui (base-nova)
- **주요 의존성**: lucide-react (아이콘), @base-ui/react (UI 프리미티브), class-variance-authority, tailwind-merge
- **아키텍처**: Turborepo 모노레포 — 플랫폼 셸 + 솔루션 플러그인 구조
- **개발 명세**: docs/dev-spec.md

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

# Docker 개발 환경 (Nginx 리버스 프록시 포함, 포트 5090)
docker compose -f docker-compose.dev.yml up --build

# Docker 프로덕션 환경 (포트 5080)
docker compose up --build
```

## 테스트

```bash
# (테스트 프레임워크 미설정 — 추후 추가)
```

## 코드 스타일

- TypeScript strict 모드 사용
- ESLint (eslint-config-next) 준수
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
│ ├── shared/ # Codex 내부 공유 유틸 (@nexus/codex-shared)
│ └── docs/ # 솔루션 문서
│ ├── specs/ # 명세서 (확정된 설계)
│ ├── plans/ # 실행 계획 (Phase별 task)
│ └── release/ # 릴리즈 기록 (완료된 결과)
│
├── packages/
│ ├── ui/ # shadcn/ui 공유 컴포넌트 + cn() (@nexus/ui)
│ ├── shell/ # PlatformShell, Header, Sidebar, Breadcrumbs (@nexus/shell)
│ ├── types/ # Solution, Category 등 공유 타입 (@nexus/types)
│ └── config/ # 솔루션 레지스트리, DynamicIcon (@nexus/config)
│
├── docker/ # Nginx 설정, Dockerfile
├── docker-compose.yml # 프로덕션 (Nginx 포트 5080)
├── docker-compose.dev.yml # 개발 (Nginx 포트 5090, HMR 볼륨 마운트)
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json # 공유 컴파일러 옵션
├── package.json # 루트 (workspace scripts, devDependencies)
└── tsconfig.json # IDE용 (extends base)
```

## 하위 CLAUDE.md

각 앱/패키지/솔루션에 개별 CLAUDE.md가 존재하며, 해당 디렉토리 고유의 상세 컨텍스트를 담고 있다.

| 위치                        | 내용                                        |
| --------------------------- | ------------------------------------------- |
| `apps/platform/CLAUDE.md`   | Platform 포탈 + Command Center              |
| `packages/CLAUDE.md`        | 공유 패키지 전체 (types, config, ui, shell) |
| `solutions/codex/CLAUDE.md` | Codex 데이터 거버넌스 솔루션                |

## 중요 컨텍스트

- **Nexus 비전**: Nexus는 통일된 UI 셸이 아니라 **솔루션 간 데이터/기능을 연결하는 허브(연결체)**. 각 솔루션은 고유한 로고, 헤더, 사이드바, 레이아웃을 가짐
- **PlatformShell**: Platform 앱 전용. 솔루션은 자체 독립 레이아웃을 소유 (상세: `apps/platform/CLAUDE.md`)
- **브랜드**: 플랫폼명 "Nexus", 대시보드 "Command Center"
- **솔루션 추가 방법**: `packages/config/src/solutions.ts`의 `solutions` 배열에 항목 추가 → 카탈로그 자동 반영 (등록 솔루션 목록: `packages/CLAUDE.md`)
- **인증**: 미구현 (플레이스홀더만 존재)
- **경로 별칭**: 앱 내부에서만 `@/*` → `./src/*` (tsconfig paths). 패키지 간 참조는 `@nexus/*`
- **패키지 의존성, 아키텍처 규칙**: `.claude/rules/architecture.md` 참조
- **향후 구조**: 각 솔루션을 별도 GitHub repo로 분리 (polyrepo). 공유 패키지는 npm 레지스트리 발행

## Git 워크플로우

- 구현 작업은 main 브랜치에서 직접 하지 말 것 — `feat/<작업명>` 브랜치 생성 후 작업
- main 브랜치 merge/push: 사용자 승인 필요

## Claude 워크플로우

- **구현 작업 요청 시**: 반드시 `.claude/rules/pre-development-checklist.md` 체크리스트를 수행한 후 사용자 승인을 받고 시작할 것. 문서 확인을 건너뛰지 말 것
- **다중 Phase 구현 시**: Agent Teams(TeamCreate)로 팀을 구성하여 실행. 현재 세션이 team-lead 역할. Subagent 패턴 사용 금지
- **에이전트 팀**: frontend-developer, backend-developer, package-developer, test-engineer, code-reviewer (5명)
- **team-lead 규칙**: `.claude/rules/team-lead-workflow.md` 참조 (dispatch 프롬프트 구조, 순차/병렬 판단, 실패 처리, 재시도 상한)
- **구현 완료 시**: 해당 솔루션/패키지의 CLAUDE.md "현재 구현 상태" 섹션을 갱신할 것
- **작업 착수 전**: `superpowers:brainstorming` 스킬 실행
- **프론트엔드 UI 컴포넌트/페이지 생성·수정 시**: `frontend-design:frontend-design` 스킬 실행
- **세션 종료 전**: 반드시 `/compound` 스킬을 실행하여 세션에서 배운 것을 memory에 축적할 것. 사용자가 대화를 마무리하려 할 때 자동으로 실행한다
