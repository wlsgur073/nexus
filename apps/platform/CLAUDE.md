# Platform (@nexus/platform)

Nexus Command Center — 솔루션 포탈 및 런처. 모든 솔루션의 진입점 역할.

## 현재 구현 상태

- **라우트**: `/` (대시보드), `/solutions` (카탈로그), `/solutions/[slug]` (상세+전용 레이아웃), `/settings` (플레이스홀더), `not-found` (커스텀 404)
- **컴포넌트**: solution-card, solution-grid, category-filter, solution-launch-button, solution-splash (5개)
- **레이아웃**: PlatformShell (@nexus/shell) — Header + Sidebar + Main Content
- **테마**: ThemeProvider + ThemeToggle 적용 완료 (라이트/다크 모드)
- **포트**: 5000

## 디렉토리 구조

```
├── docs/                        # 플랫폼 문서 (3단 구조)
│ ├── specs/                     # 명세서 (확정된 설계)
│ ├── plans/                     # 실행 계획 (Phase별 task)
│ └── release/                   # 릴리즈 기록 (완료된 결과)
└── src/
  ├── app/
  │ ├── page.tsx                 # 대시보드 (Command Center 메인)
  │ ├── layout.tsx               # PlatformShell 적용
  │ ├── not-found.tsx            # 커스텀 404
  │ ├── launch/
  │ │ └── [slug]/
  │ │   └── page.tsx             # 솔루션 런치 스플래시
  │ ├── solutions/
  │ │ ├── page.tsx               # 솔루션 카탈로그
  │ │ └── [slug]/
  │ │   ├── layout.tsx           # 솔루션 상세 전용 레이아웃
  │ │   └── page.tsx             # 솔루션 상세 페이지
  │ └── settings/
  │   └── page.tsx               # 설정 (플레이스홀더)
  └── components/
    └── solutions/               # 솔루션 관련 컴포넌트
      ├── solution-card.tsx
      ├── solution-grid.tsx
      ├── category-filter.tsx
      ├── solution-launch-button.tsx  # 솔루션 열기 버튼 (Client)
      └── solution-splash.tsx         # 런치 스플래시 화면 (Client)
```

## 문서 관리

`docs/` 디렉토리는 Codex와 동일한 3단 구조를 따른다. 상세 규칙은 루트 `CLAUDE.md` "문서 관리 체계" 참조.

## 아키텍처

- **PlatformShell은 Platform 전용**: 솔루션 앱에서 절대 사용하지 않음. 각 솔루션은 자체 독립 레이아웃을 소유
- **브랜드**: 플랫폼명 "Nexus", 대시보드 "Command Center"
- **솔루션 카탈로그**: `@nexus/config`의 `solutions` 배열을 읽어 카드/그리드로 렌더링
- **status별 동작**: `active` (진입 가능), `beta` (진입 가능 + 배지), `coming-soon` (진입 불가 + 배지)

## 의존 패키지

- `@nexus/shell` — PlatformShell, Header, Sidebar, Breadcrumbs, ThemeToggle
- `@nexus/ui` — 공유 UI 컴포넌트
- `@nexus/config` — 솔루션 레지스트리, DynamicIcon
- `@nexus/types` — Solution, Category 타입

## 주의사항

- **솔루션 카탈로그 데이터 흐름**: 카탈로그 페이지는 `@nexus/config`의 `solutions` 배열을 직접 읽어 렌더링. 새 솔루션 추가 시 이 파일만 수정하면 카탈로그에 자동 반영됨
- **`[slug]` 라우트**: `getSolutionBySlug()`로 솔루션 메타데이터를 조회. 등록되지 않은 slug 접근 시 not-found 처리 필요

## 빌드

```bash
pnpm turbo dev --filter=@nexus/platform   # 개발 서버
pnpm turbo build --filter=@nexus/platform  # 빌드
pnpm turbo lint --filter=@nexus/platform   # 린트
```
