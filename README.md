# Nexus

멀티 솔루션 클라우드 플랫폼. 여러 솔루션을 연결하는 허브로, Command Center 대시보드를 통해 솔루션 현황을 확인합니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5.x
- **Styling**: Tailwind CSS v4, shadcn/ui (base-nova)
- **Build**: Turborepo + pnpm workspace
- **Deployment**: Docker + Nginx 리버스 프록시

## Quick Start

```bash
# 의존성 설치
pnpm install

# 전체 개발 서버 실행
pnpm dev

# 플랫폼만 실행 (포트 5000)
pnpm turbo dev --filter=@nexus/platform

# 전체 빌드
pnpm build

# 전체 린트
pnpm lint
```

## 프로젝트 구조

```
factory-ai-team/
├── apps/
│   └── platform/          # 플랫폼 셸 + Command Center (@nexus/platform, 포트 5000)
├── solutions/
│   └── codex/             # 데이터 거버넌스 솔루션
│       ├── web/           # Codex 프론트엔드 (@nexus/codex-web, 포트 5001)
│       ├── models/        # Codex 데이터 모델 (@nexus/codex-models)
│       └── shared/        # Codex 내부 공유 유틸 (@nexus/codex-shared)
├── packages/
│   ├── ui/                # shadcn/ui 공유 컴포넌트 (@nexus/ui)
│   ├── shell/             # PlatformShell 레이아웃 (@nexus/shell)
│   ├── config/            # 솔루션 레지스트리 (@nexus/config)
│   └── types/             # 공유 타입 정의 (@nexus/types)
├── docs/                  # 개발 명세, 가이드
└── docker/                # Nginx 설정, Dockerfile
```

## 솔루션 목록

| 솔루션            | 상태        | 설명                |
| ----------------- | ----------- | ------------------- |
| Codex             | active      | 데이터 거버넌스     |
| LLM Gateway       | beta        | LLM 통합 게이트웨이 |
| AI Factory        | coming-soon | AI 모델 관리        |
| Data Pipeline     | coming-soon | 데이터 파이프라인   |
| CI/CD Hub         | coming-soon | CI/CD 자동화        |
| Insight Dashboard | coming-soon | 분석 대시보드       |

## Docker

```bash
# 개발 환경 (포트 5090, HMR 지원)
docker compose -f docker-compose.dev.yml up --build

# 프로덕션 환경 (포트 5080)
docker compose up --build
```

## 문서

- `docs/dev-spec.md` — 개발 명세서
- `docs/solution-development-guide.md` — 솔루션 추가 가이드
- `docs/agent-team-guide.md` — Agent Team 설정 가이드
- `solutions/codex/docs/` — Codex 제품/기술 스펙
