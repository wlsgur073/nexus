# Codex Phase 3 실행 계획

> **상태**: ✅ 완료 (2026-03-25) — 릴리즈: `docs/release/2026-03-25-phase3-admin.md`
> **목표**: 관리자 기능 + 전체 UX 완성도 + 성능 최적화
> **선행 조건**: Phase 2 완료 (2026-03-24)
> **명세 참조**: `specs/ux/screens-governance.md` §5.12~5.17, `specs/frontend/integration.md` §12 Phase 3

---

## 사전 점검 (Pre-flight)

실행 전 아래 항목을 확인한다:

- [ ] `grep -r "TODO\|FIXME\|HACK" solutions/codex/web/src/` — 미완성 코드 식별
  - 현재 발견: `middleware.ts:15` — `TODO: Implement real auth token check` → Step 2a에서 해결
- [ ] `pnpm build && pnpm lint` — 현재 빌드 정상 여부
- [ ] `git status` — 미커밋 변경사항 확인 (현재: `docs/dev-spec.md` modified)

---

## 구현 범위

### A. 관리자 화면 (6개 라우트 + 9개 컴포넌트)

#### 라우트

| #   | 경로                  | 화면명              | 접근 권한                 | 명세 위치                   |
| --- | --------------------- | ------------------- | ------------------------- | --------------------------- |
| 1   | `/admin/layout.tsx`   | Admin 레이아웃 가드 | SYSTEM_ADMIN              | integration.md §9           |
| 2   | `/admin/common-codes` | 공통코드 관리       | SYSTEM_ADMIN, STD_MANAGER | screens-governance.md §5.12 |
| 3   | `/admin/users`        | 사용자 관리         | SYSTEM_ADMIN              | screens-governance.md §5.14 |
| 4   | `/admin/permissions`  | 권한 관리           | SYSTEM_ADMIN              | screens-governance.md §5.15 |
| 5   | `/admin/system-codes` | 코드 관리 (시스템)  | SYSTEM_ADMIN              | screens-governance.md §5.16 |
| 6   | `/admin/db-settings`  | DB 연결 설정        | SYSTEM_ADMIN              | screens-governance.md §5.17 |

#### 컴포넌트

| #   | 파일                                 | 설명                                          | 비고                                                        |
| --- | ------------------------------------ | --------------------------------------------- | ----------------------------------------------------------- |
| 1   | `common-codes/code-group-list.tsx`   | 좌측 코드 그룹 목록 + CRUD                    | 기존 `CommonCodeSearchTable` 좌측 패널 패턴 재사용 (아래 D) |
| 2   | `common-codes/code-detail-table.tsx` | 우측 코드 상세 테이블 + CRUD                  | 기존 `CommonCodeSearchTable` 우측 테이블 패턴 재사용        |
| 3   | `admin/user-table.tsx`               | 사용자 목록 테이블 + 상태 관리                |                                                             |
| 4   | `admin/user-form-dialog.tsx`         | 사용자 생성/수정 Dialog                       |                                                             |
| 5   | `admin/permission-tree.tsx`          | 역할별 메뉴 권한 트리 (5개 역할 탭)           | `@base-ui/react` 커스텀 (아래 E)                            |
| 6   | `admin/system-code-table.tsx`        | 시스템 코드 CRUD + 보호 코드 표시             |                                                             |
| 7   | `admin/db-connection-form.tsx`       | DB 접속정보 Card (호스트, 포트, DB명, 사용자) |                                                             |
| 8   | `admin/ssh-settings-form.tsx`        | SSH 터널 설정 Card                            |                                                             |
| 9   | `ui/date-range-picker.tsx`           | 날짜 범위 선택기 (감사 추적 필터 고도화)      |                                                             |

### B. 패키지 작업

| 패키지                     | 작업                                                       | 담당              |
| -------------------------- | ---------------------------------------------------------- | ----------------- |
| `@nexus/codex-models` api/ | users, permissions, system-codes, settings 모듈 추가 (4개) | package-developer |
| `@nexus/codex-shared`      | admin 라우트 상수, query-keys admin 네임스페이스 확장      | package-developer |
| `@nexus/ui`                | 추가 컴포넌트 불필요 확인 (ScrollArea 이미 존재)           | -                 |

### C. UX 완성도

| #   | 작업                                                   | 영향 범위          | 우선순위 |
| --- | ------------------------------------------------------ | ------------------ | -------- |
| 1   | 모든 화면 Skeleton 로딩 상태 완성                      | 전체 페이지        | 높음     |
| 2   | Error Boundary (app/error.tsx, app/not-found.tsx) 강화 | 전역               | 높음     |
| 3   | 반응형 레이아웃 (모바일) 최종 점검                     | 전체               | 중간     |
| 4   | generateMetadata 동적 타이틀                           | 전체 라우트        | 중간     |
| 5   | 탐색기 테이블 다음 페이지 prefetch                     | /standards         | 중간     |
| 6   | Toast/알림 센터 통합 마무리                            | 뮤테이션 결과 연동 | 중간     |
| 7   | Command Palette 최근 검색 localStorage                 | Command Palette    | 낮음     |
| 8   | 표준용어 신청 폼 고도화 (구성 단어 선택, 도메인 연결)  | /standards/new     | 중간     |
| 9   | 차트 다크모드 테마 연동 (아래 F 전략 참조)             | Recharts 3개       | 낮음     |
| 10  | Codex 솔루션 ThemeToggle UI 추가                       | 헤더               | 낮음     |

### D. 공통코드 컴포넌트 재사용 전략

기존 `/common-codes` 화면의 `CommonCodeSearchTable` (읽기전용)과 `/admin/common-codes` (CRUD)은 동일한 좌우 분할 레이아웃을 공유한다.

**전략**: 기존 `CommonCodeSearchTable`을 리팩토링하여 공통 base로 활용

```
common-codes/
├── common-code-search-table.tsx   # 기존 — 읽기전용 (리팩토링: props로 editable 제어)
├── code-group-list.tsx            # 신규 — 좌측 그룹 목록 (기존 좌측 패널에서 추출 + CRUD 버튼 추가)
└── code-detail-table.tsx          # 신규 — 우측 상세 테이블 (기존 우측 테이블에서 추출 + CRUD 행 액션 추가)
```

- 좌측 패널: 그룹 검색 + 선택 로직은 동일, admin에서만 [추가/수정/삭제] 버튼 표시
- 우측 테이블: 코드 목록 표시는 동일, admin에서만 행 액션(수정/삭제) + [코드 추가] 버튼 표시
- **공용 props**: `editable?: boolean` — 조회 페이지에서는 false, admin 페이지에서는 true

### E. 권한 트리 컴포넌트 전략

**선택: `@base-ui/react` 기반 커스텀 트리**

기존 프로젝트가 `@base-ui/react` (shadcn base-nova) 기반이므로, 동일 primitive 내에서 트리 컴포넌트를 커스텀 구현한다. 별도 UI primitive 라이브러리 추가를 지양하여 의존성 일관성을 유지.

| 항목        | 내용                                                                                |
| ----------- | ----------------------------------------------------------------------------------- |
| 기반        | `@base-ui/react` Checkbox + Collapsible 조합                                        |
| 접근성      | `role="tree"`, `role="treeitem"`, `aria-expanded`, `aria-checked` 직접 적용         |
| 키보드      | Arrow Up/Down (항목 이동), Arrow Right/Left (펼침/접기), Space (체크 토글)          |
| 트리 깊이   | 2단계 (카테고리 → 메뉴 아이템) — 깊은 트리가 아니므로 가상화 불필요                 |
| 체크박스    | Tri-state: 전체 선택, 부분 선택(indeterminate), 미선택. 상위 선택 시 하위 자동 선택 |
| 추가 의존성 | 없음 (이미 있는 @base-ui/react, Tailwind만 사용)                                    |

**구현 구조**:

```
admin/permission-tree.tsx
├── Tabs (5개 역할: 시스템관리/검토승인/표준 관리자/신청자/조회전용)
├── 좌측: 커스텀 Tree (Collapsible + Checkbox, role="tree")
│   └── 메뉴 항목별 체크박스 (상위 선택 → 하위 자동 선택, tri-state)
└── 우측: Table (메뉴별 CRUD 권한 체크박스 4열)
```

**Tri-state 체크박스 로직**:

```typescript
// 상위 카테고리의 체크 상태 계산
type CheckState = "checked" | "unchecked" | "indeterminate";
function getParentCheckState(children: boolean[]): CheckState {
  if (children.every(Boolean)) return "checked";
  if (children.some(Boolean)) return "indeterminate";
  return "unchecked";
}
```

### F. 차트 다크모드 전략

Recharts SVG는 CSS 변수(`hsl(var(--chart-1))`)를 직접 해석하지 못하는 근본적 제한이 있다.

**해결 전략**: JS 기반 테마 감지 → hex 매핑

```typescript
// lib/chart-theme.ts
const CHART_COLORS = {
  light: { chart1: "#2563eb", chart2: "#16a34a", ... },
  dark:  { chart1: "#60a5fa", chart2: "#4ade80", ... },
};

export function useChartColors() {
  const { resolvedTheme } = useTheme(); // next-themes
  return CHART_COLORS[resolvedTheme === "dark" ? "dark" : "light"];
}
```

- 영향 대상: 대시보드 2개 차트 + 거버넌스 포털 1개 차트
- `useChartColors()` 훅으로 Recharts `fill`/`stroke`에 hex 값 주입

---

## Agent Teams 실행 전략

### Step 1: package-developer (순차, 선행)

**codex-models**:

- API 4개 모듈 추가: `users.ts`, `permissions.ts`, `system-codes.ts`, `settings.ts`
- 각 모듈의 Mock 핸들러 + 타입 export
- 참조: `specs/data/api.md` §5.11 (18개 엔드포인트)

**codex-shared**:

- `constants/routes.ts` — admin 라우트 상수 추가 (`/admin/common-codes`, `/admin/users`, `/admin/permissions`, `/admin/system-codes`, `/admin/db-settings`)
- `constants/menu.ts` — admin 메뉴 항목 추가 (사이드바 "관리" 그룹)
- `constants/query-keys.ts` — admin 네임스페이스 4개 추가:
  ```typescript
  users: {
    list: (params: object) => ["users", params] as const,
    detail: (id: number) => ["users", id] as const,
  },
  permissions: {
    byRole: (role: UserRole) => ["permissions", role] as const,
  },
  systemCodes: {
    list: (params: object) => ["system-codes", params] as const,
    detail: (id: number) => ["system-codes", id] as const,
  },
  settings: {
    db: ["settings", "db"] as const,
    ssh: ["settings", "ssh"] as const,
    testResult: ["settings", "test-result"] as const,
  },
  ```

**@nexus/ui**:

- 추가 컴포넌트 불필요 확인 (ScrollArea, Checkbox 이미 존재)
- 권한 트리는 `@base-ui/react` Checkbox + Collapsible 기반 커스텀 구현 (Step 2a에서 처리)

**완료 기준**: `pnpm build && pnpm lint` 통과

### Step 2a: frontend-developer — Admin 화면 (Step 1 완료 후)

**middleware.ts 업데이트**:

- `/admin/*` 경로에 대해 `SYSTEM_ADMIN` 역할 체크 로직 추가
- 현재 `TODO: Implement real auth token check` → mock 수준의 역할 체크로 교체
  ```typescript
  // Mock: 쿠키/헤더에서 역할 읽기 (실제 인증 미구현이므로 mock user 가정)
  if (pathname.startsWith("/admin")) {
    // TODO: Replace with real auth when backend is ready
    const userRole = getMockUserRole(request);
    if (userRole !== "SYSTEM_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  ```

**admin/ 라우트 구현** (6개):

1. `admin/layout.tsx` — 클라이언트 사이드 가드 + admin 전용 레이아웃
2. `admin/common-codes/page.tsx` — 기존 `CommonCodeSearchTable` 리팩토링 (editable 모드)
3. `admin/users/page.tsx` — 사용자 CRUD 테이블
4. `admin/permissions/page.tsx` — 역할별 권한 트리
5. `admin/system-codes/page.tsx` — 시스템 코드 CRUD (보호 코드 readonly)
6. `admin/db-settings/page.tsx` — DB 접속 + SSH 설정 카드

**컴포넌트 구현** (9개):

- 위 컴포넌트 테이블 (#1~#9) 참조
- `CommonCodeSearchTable` 리팩토링: `code-group-list.tsx` + `code-detail-table.tsx`로 분리, `editable` prop 추가
- `permission-tree.tsx`: `@base-ui/react` Checkbox + Collapsible 커스텀 트리, 5개 역할 탭 + tri-state 체크박스 + CRUD 권한 테이블

**사이드바 메뉴 추가**:

- "관리" 그룹 하위에 admin 5개 메뉴 항목 추가 (역할 조건부 표시)

**완료 기준**: `pnpm build && pnpm lint` 통과

### Step 2b: frontend-developer — UX 완성도 (Step 2a 완료 후, 동일 에이전트)

> Step 2a와 2b는 같은 frontend-developer가 순차 수행. 작업량이 크므로 별도 Step으로 관리.

**높음 우선순위** (먼저):

1. 모든 화면 Skeleton 로딩 상태 완성 — 기존 12개 화면 + 신규 6개 admin 화면
2. Error Boundary 강화 — `app/error.tsx`, `app/not-found.tsx` 개선

**중간 우선순위**: 3. 반응형 레이아웃 최종 점검 — 특히 admin 좌우 분할 패널의 모바일 대응 4. `generateMetadata` 동적 타이틀 — 전체 라우트에 적용 5. 탐색기 테이블 prefetch — `/standards` 다음 페이지 6. Toast/알림 센터 통합 마무리 — 뮤테이션 결과 연동 7. 표준용어 신청 폼 고도화

**낮음 우선순위** (시간 허용 시): 8. Command Palette 최근 검색 localStorage 9. 차트 다크모드 테마 연동 — `useChartColors()` 훅 구현 (Section F 전략) 10. ThemeToggle UI 추가

**완료 기준**: `pnpm build && pnpm lint` 통과

### Step 3: code-reviewer

- 품질/보안/접근성/아키텍처 리뷰
- **특히 점검**: middleware admin 가드, 공통코드 컴포넌트 재사용 품질, 권한 트리 접근성
- critical 이슈 수정 사이클 (최대 2회)

### Step 4: 완료 작업

- CLAUDE.md "Phase 3 완료" 갱신
- 릴리즈 노트: `docs/release/yyyy-MM-dd-phase3-admin.md`
- 커밋 + PR + main merge

---

## 참조 명세

| 문서                                        | 내용                                                 |
| ------------------------------------------- | ---------------------------------------------------- |
| `specs/ux/screens-governance.md` §5.12~5.17 | 관리자 화면 UX 설계                                  |
| `specs/data/api.md` §5.11                   | System Admin API (18개 엔드포인트)                   |
| `specs/data/entities.md`                    | User, MenuPermission, SystemCode, DatabaseConnection |
| `specs/data/rules.md`                       | AUTH-001~009 (권한 규칙)                             |
| `specs/frontend/integration.md` §12 Phase 3 | 구현 체크리스트                                      |
| `specs/frontend/components.md`              | admin 컴포넌트 계층 설계                             |
| `specs/frontend/state-data.md`              | 상태 관리 패턴                                       |

---

## 변경 이력

| 날짜       | 내용                                                                     |
| ---------- | ------------------------------------------------------------------------ |
| 2026-03-25 | Phase 3 리뷰 후 보완: 누락 항목 추가, 재사용 전략 명시, Tree 전략 결정   |
| 2026-03-25 | Tree 전략 변경: shadcn-tree-view → @base-ui/react 커스텀 (의존성 일관성) |

### 보완된 항목 (2026-03-25)

1. **추가**: `middleware.ts` admin 가드 (Step 2a) — 기존 TODO mock 교체
2. **추가**: `query-keys.ts` admin 네임스페이스 4개 (Step 1) — users, permissions, systemCodes, settings
3. **변경**: 권한 트리 → `@base-ui/react` Checkbox + Collapsible 커스텀 (외부 primitive 추가 지양)
4. **추가**: 공통코드 컴포넌트 재사용 전략 (Section D) — `CommonCodeSearchTable` 리팩토링
5. **추가**: 차트 다크모드 해결 전략 (Section F) — `useChartColors()` 훅
6. **추가**: 사전 점검 섹션 (Pre-flight) — TODO grep, 빌드 확인
7. **삭제**: `request-no.ts 완성` — 이미 완전 구현됨 (3개 함수 모두 존재)
8. **분리**: Step 2를 2a (Admin 화면) + 2b (UX 완성도)로 분리 — 작업량 관리
9. **보강**: Step 1 package-developer 작업 상세화 — query-keys 구체 구조, menu 상수

---

## 예상 산출물

- 6개 신규 라우트 (admin/\*)
- 9개 신규 컴포넌트
- 1개 리팩토링 (`CommonCodeSearchTable` → 공용 base + editable prop)
- 1개 미들웨어 업데이트 (admin 가드)
- 4개 API 모듈 (Mock)
- 4개 query-key 네임스페이스
- 1개 커스텀 Tree 컴포넌트 (@base-ui/react 기반, tri-state 체크박스)
- 1개 유틸 훅 (`useChartColors`)
- UX 완성도 10개 항목
- Phase 3 완료 시 Codex 프론트엔드 100% (17개 화면 전체)
