# Nexus 개발 명세서

> 이 문서는 Agent Team의 공유 컨텍스트로, 각 에이전트가 참조하는 비즈니스/기술 명세입니다.
> CLAUDE.md에서 `@docs/dev-spec.md`로 참조됩니다.

---

## 1. 데이터 모델

### 1.1 Solution (솔루션)

> `packages/types/`에 정의된 핵심 타입

| 필드        | 타입                                | 설명                            |
| ----------- | ----------------------------------- | ------------------------------- |
| id          | string                              | 솔루션 고유 식별자 (kebab-case) |
| slug        | string                              | URL 경로용 식별자               |
| name        | string                              | 솔루션 표시 이름                |
| description | string                              | 솔루션 설명                     |
| icon        | string                              | lucide-react 아이콘 이름        |
| category    | string                              | 카테고리 ID 참조                |
| status      | "active" \| "beta" \| "coming-soon" | 솔루션 상태                     |
| route       | string                              | 솔루션 진입 경로                |

### 1.2 Category (카테고리)

| 필드 | 타입   | 설명                     |
| ---- | ------ | ------------------------ |
| id   | string | 카테고리 고유 식별자     |
| name | string | 카테고리 표시 이름       |
| icon | string | lucide-react 아이콘 이름 |

### 1.3 Codex 도메인 모델

> 상세 도메인 모델은 `solutions/codex/docs/codex-product-spec.md` 참조

---

## 2. 페이지 명세

### 2.1 Platform (apps/platform)

| 경로              | 페이지명         | 설명                                   | 상태         |
| ----------------- | ---------------- | -------------------------------------- | ------------ |
| `/`               | Command Center   | 대시보드 — 솔루션 현황 요약, 최근 활동 | 구현됨       |
| `/solutions`      | Solution Catalog | 솔루션 목록 — 카테고리별 필터, 검색    | 구현됨       |
| `/solutions/[id]` | Solution Detail  | 솔루션 상세 — 설명, 상태, 진입         | 구현됨       |
| `/settings`       | Settings         | 플랫폼 설정                            | 플레이스홀더 |

### 2.2 Codex (solutions/codex/web)

| 경로                             | 페이지명           | 설명                      | 상태   |
| -------------------------------- | ------------------ | ------------------------- | ------ |
| `/solutions/codex`               | Dashboard          | 역할별 대시보드           | 구현됨 |
| `/solutions/codex/login`         | Login              | 로그인 (플레이스홀더)     | 구현됨 |
| `/solutions/codex/standards`     | Standards Explorer | 표준용어/도메인/단어 탐색 | 구현됨 |
| `/solutions/codex/standards/new` | New Standard       | 표준 신규 신청 폼         | 구현됨 |
| `/solutions/codex/approvals`     | Approval Workbench | 승인 워크벤치             | 구현됨 |

> 상세 페이지 명세: `solutions/codex/docs/codex-product-spec.md` 참조

---

## 3. API 명세

> 현재 Nexus는 프론트엔드 전용 프로젝트로 별도 백엔드 API가 없습니다.
> 향후 API가 추가될 경우 아래 형식으로 문서화합니다.

> Codex API 명세: `solutions/codex/docs/specs/data-architecture.md` 참조 (118개 API 엔드포인트 정의)

---

## 4. 비즈니스 규칙

### 4.1 솔루션 관리

- 솔루션 등록은 `packages/config/src/solutions.ts`의 `solutions` 배열에 항목을 추가하면 카탈로그, 사이드바, 상세 페이지에 자동 반영
- 솔루션 status별 동작:
  - `active`: 진입 가능, 정상 표시
  - `beta`: 진입 가능, "베타" 배지 표시
  - `coming-soon`: 진입 불가, "예정" 배지 표시

### 4.2 등록 솔루션 목록

| 솔루션            | 상태        | 카테고리  |
| ----------------- | ----------- | --------- |
| Codex             | active      | Data      |
| AI Factory        | coming-soon | AI / ML   |
| Data Pipeline     | coming-soon | Data      |
| CI/CD Hub         | coming-soon | DevOps    |
| Insight Dashboard | coming-soon | Analytics |
| LLM Gateway       | beta        | AI / ML   |

### 4.3 네비게이션

- 사이드바: active/beta 솔루션만 표시
- 브레드크럼: 플랫폼 > [솔루션명] > [페이지명]
- 인증: 미구현 (향후 추가 예정)

---

## 5. 디자인 가이드라인

### 5.1 테마

- 시스템 모드 기본 (OS 설정 따름), 사용자가 라이트/다크 모드 전환 가능
- Tailwind CSS v4 `@theme inline` 블록으로 커스텀 색상 정의
- shadcn/ui `base-nova` 스타일 사용

### 5.2 레이아웃

- PlatformShell: Platform 앱(Command Center) 전용 레이아웃 — Header + Sidebar + Main Content 구조
- 각 솔루션은 독립 레이아웃을 소유 — PlatformShell을 사용하지 않으며, 자체 Header/Sidebar/네비게이션을 구현

### 5.3 테마 전환 (Provider 구현 완료, ThemeToggle UI 미구현)

> 설계서: `docs/superpowers/specs/2026-03-20-theme-switching-design.md`

- `next-themes` 기반 라이트/다크 모드 전환
- 시스템 기본값, 사용자 전환 가능, localStorage 지속
- 적용 범위: Platform + 전체 솔루션

---

## 6. 향후 계획

| 설계서               | 상태                                      | 대상                                 |
| -------------------- | ----------------------------------------- | ------------------------------------ |
| 테마 전환            | Provider 구현 완료, ThemeToggle UI 미구현 | Platform + 전체 솔루션               |
| Team Leader 에이전트 | 설계 완료, 미구현                         | `.claude/agents/` 에이전트 구조 개편 |
