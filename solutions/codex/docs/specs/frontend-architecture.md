# Codex 프론트엔드 아키텍처 명세

> **버전**: 1.0
> **작성일**: 2026-03-20
> **기준**: `ux-design.md` (17개 화면), `data-architecture.md` (19개 엔티티, 117개 API 엔드포인트)
> **목적**: Codex 데이터 거버넌스 플랫폼의 프론트엔드 구현 청사진 — 라우트, 컴포넌트, 상태 관리, 데이터 페칭 전략을 일관된 방식으로 정의한다.

### 에이전트별 참조 가이드

| 에이전트               | 참조 섹션                             | 설명                                        |
| ---------------------- | ------------------------------------- | ------------------------------------------- |
| **package-developer**  | 1. 기술 스택, 2. 패키지 구조          | 공유 패키지 의존성, models/shared 구조      |
| **frontend-developer** | 3. 라우트 설계 ~ 12. 구현 단계 (전체) | 컴포넌트 계층, 상태 관리, 데이터 페칭, 인증 |
| **code-reviewer**      | 13. 오류 처리, 14. 보안 고려사항      | 에러 핸들링 패턴, 보안 체크리스트           |

---

## 1. 기술 스택 & 의존성

### 1.1 핵심 기술 스택

| 구분          | 기술                         | 버전     | 비고                                           |
| ------------- | ---------------------------- | -------- | ---------------------------------------------- |
| 프레임워크    | Next.js                      | 16.2.0   | App Router, Turbopack                          |
| UI 라이브러리 | React                        | 19.2.4   | Server/Client Components 혼용                  |
| 언어          | TypeScript                   | 5.x      | strict 모드 필수                               |
| 스타일링      | Tailwind CSS                 | v4       | `@theme inline` 블록 (tailwind.config.ts 없음) |
| UI 컴포넌트   | shadcn/ui (base-nova)        | latest   | @base-ui/react 기반, `asChild` 사용 금지       |
| UI 프리미티브 | @base-ui/react               | ^1.3.0   | Dialog, Sheet, Select 등                       |
| 아이콘        | lucide-react                 | ^0.577.0 |                                                |
| 유틸리티      | class-variance-authority     | ^0.7.1   | variant 정의                                   |
| 유틸리티      | tailwind-merge               | ^3.5.0   | 클래스 병합                                    |
| 서버 상태     | TanStack Query (React Query) | v5       | 신규 추가 필요                                 |
| 폼            | React Hook Form + Zod        | latest   | 신규 추가 필요                                 |
| 차트          | Recharts                     | ^2.x     | 대시보드/거버넌스 차트                         |
| Toast         | Sonner                       | latest   | 전역 Toast 시스템                              |
| URL 상태      | nuqs                         | ^2.0.0   | 필터/탭/페이지네이션 URL 동기화                |

### 1.2 Nexus 모노레포 내 패키지 의존성

```markdown
@nexus/types
↑
@nexus/config
↑ @nexus/types
@nexus/ui ↑
↑ @nexus/codex-models
@nexus/shell ↑
↑ @nexus/codex-shared
└─────────────────────────────────── ↑
@nexus/codex-web (최종 소비자)
```

**의존 방향 규칙 (위반 금지)**:

- `@nexus/codex-models`은 `@nexus/ui`, `@nexus/shell` 의존 불가 (순수 데이터 레이어)
- `@nexus/codex-shared`는 `@nexus/ui`, `@nexus/shell` 의존 불가
- 다른 솔루션 패키지(`@nexus/llm-gateway-*` 등)와 교차 의존 금지

### 1.3 신규 추가 의존성 (`solutions/codex/web/package.json`)

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0",
    "@hookform/resolvers": "^3.0.0",
    "recharts": "^2.0.0",
    "sonner": "^1.0.0",
    "nuqs": "^2.0.0"
  }
}
```

---

## 2. 패키지 구조

### 2.1 solutions/codex/web (@nexus/codex-web)

Next.js App Router 기반 Codex 프론트엔드 앱. `basePath: /solutions/codex`.

```markdown
solutions/codex/web/src/
├── app/
│ ├── layout.tsx # 루트 레이아웃: ThemeProvider + TooltipProvider + Providers + PlatformShell
│ ├── globals.css # Tailwind CSS v4 @theme 블록
│ ├── page.tsx # 대시보드 (역할에 따라 신청자/승인자 뷰 분기)
│ ├── error.tsx # 전역 에러 경계
│ ├── not-found.tsx # 404 페이지
│ │
│ ├── (auth)/ # 라우트 그룹: PlatformShell 미적용
│ │ ├── layout.tsx # ThemeProvider만 포함
│ │ └── login/
│ │ └── page.tsx # 로그인 화면 (Split-screen)
│ │
│ ├── standards/
│ │ ├── page.tsx # 통합 표준 탐색기 (탭 + 테이블 + 상세 Sheet)
│ │ └── new/
│ │ └── page.tsx # 신규 표준 신청 (좌: 폼, 우: AI 추천)
│ │
│ ├── approvals/
│ │ └── page.tsx # 승인 워크벤치 (좌: 목록, 우: 상세 패널)
│ │
│ ├── governance/
│ │ └── page.tsx # 거버넌스 포털 (준수율 게이지 + KPI + 차트)
│ │
│ ├── audit/
│ │ └── page.tsx # 감사 추적 (고급 필터 + 테이블 + 타임라인)
│ │
│ ├── common-codes/
│ │ └── page.tsx # 공통코드 조회 (읽기 전용)
│ │
│ ├── validations/
│ │ ├── page.tsx # 검증 대시보드 (Stat 카드 + 차트 + 이력)
│ │ └── [executionId]/
│ │ └── page.tsx # 검증 상세 (규칙 탭 + 위반 목록)
│ │
│ └── admin/
│ ├── layout.tsx # SYSTEM_ADMIN 역할 가드
│ ├── common-codes/page.tsx # 공통코드 관리 (좌: 그룹, 우: 코드)
│ ├── users/page.tsx # 사용자 관리
│ ├── permissions/page.tsx # 권한 관리 (역할 탭 + 메뉴 트리)
│ ├── system-codes/page.tsx # 코드 관리 (시스템)
│ └── db-settings/page.tsx # DB 연결 설정 (카드 3개)
│
├── components/
│ ├── providers/
│ │ ├── query-provider.tsx # TanStack Query QueryClientProvider
│ │ ├── auth-provider.tsx # 세션/인증 Context
│ │ ├── notification-provider.tsx # SSE 알림 구독 Context
│ │ └── ai-butler-provider.tsx # AI Data Butler 전역 Context
│ │
│ ├── layout/
│ │ ├── codex-sidebar.tsx # Codex 전용 사이드바 메뉴 (역할 기반 필터링)
│ │ ├── command-palette.tsx # Ctrl+K 전역 Command Palette
│ │ └── notification-center.tsx # 헤더 알림 센터 (벨 아이콘 + Popover)
│ │
│ ├── dashboard/
│ │ ├── requester-dashboard.tsx # 신청자 대시보드 컨테이너
│ │ ├── approver-dashboard.tsx # 승인자 대시보드 컨테이너
│ │ ├── stat-card.tsx # 재사용 KPI 카드 (수치 + 증감)
│ │ ├── activity-timeline.tsx # 최근 활동 타임라인
│ │ ├── standard-trend-chart.tsx # 등록 추이 바 차트 (Recharts, lazy)
│ │ └── approval-kpi-panel.tsx # 승인 KPI 패널 (처리율, 소요일 등)
│ │
│ ├── standards/
│ │ ├── explorer-table.tsx # 탐색기 테이블 (탭별 컬럼 동적 구성)
│ │ ├── explorer-filters.tsx # 검색 바 + 필터 드롭다운
│ │ ├── standard-detail-sheet.tsx # 표준 상세 Sheet (읽기/편집/삭제영향도 모드)
│ │ ├── inline-edit-form.tsx # Sheet 내 인라인 편집 폼
│ │ ├── change-diff-table.tsx # 변경 전/후 3컬럼 비교 테이블
│ │ ├── delete-impact-stepper.tsx # 삭제 영향도 평가 4단계 Stepper
│ │ ├── new-standard-form.tsx # 신규 표준 신청 폼 (유형별 동적 필드)
│ │ └── ai-suggestion-panel.tsx # AI 추천 패널 (유사도 바 + 상세/사용하기)
│ │
│ ├── approvals/
│ │ ├── approval-list.tsx # 승인 대기 목록 (체크박스, 경과일 강조)
│ │ ├── approval-detail-panel.tsx # 신청 상세 패널 (변경비교 + 코멘트 + 이력)
│ │ ├── approval-action-form.tsx # 승인/반려/검토요청 처리 폼
│ │ └── batch-action-dialog.tsx # 일괄 처리 Dialog
│ │
│ ├── governance/
│ │ ├── compliance-gauge.tsx # 준수율 원형 게이지 (커스텀 SVG)
│ │ ├── dept-ranking-list.tsx # 부서별 준수율 Progress 목록
│ │ ├── non-compliant-table.tsx # 미준수 Top 10 테이블
│ │ └── governance-trend-chart.tsx # 월별 표준화율 3색 그룹 바 차트 (Recharts, lazy)
│ │
│ ├── validations/
│ │ ├── validation-stat-cards.tsx # 위반 유형별 4개 Stat 카드
│ │ ├── violation-trend-chart.tsx # 월별 위반 추이 차트 (Recharts, lazy)
│ │ ├── rule-summary-table.tsx # 규칙별 위반 현황 테이블
│ │ ├── validation-history-table.tsx # 검증 실행 이력 테이블
│ │ └── violation-list.tsx # 위반 항목 목록 (규칙 탭 + 일괄시정)
│ │
│ ├── audit/
│ │ ├── audit-filter-bar.tsx # 고급 필터 바 (유형/키워드/기간/작업유형/처리자)
│ │ ├── audit-table.tsx # 감사 이력 테이블 (행 클릭 확장)
│ │ └── audit-timeline-panel.tsx # 행 확장 시 타임라인 패널
│ │
│ ├── common-codes/
│ │ ├── code-group-list.tsx # 코드그룹 좌측 스크롤 목록 (관리 화면용)
│ │ ├── code-detail-table.tsx # 코드 상세 우측 테이블 (관리 화면용)
│ │ └── common-code-search-table.tsx # 공통코드 조회 테이블 (읽기 전용)
│ │
│ ├── admin/
│ │ ├── user-table.tsx # 사용자 목록 테이블
│ │ ├── user-form-dialog.tsx # 사용자 추가/수정 Dialog
│ │ ├── permission-tree.tsx # 메뉴 권한 트리 (계층 체크박스)
│ │ ├── system-code-table.tsx # 시스템 코드 테이블 (보호 코드 Badge)
│ │ ├── db-connection-form.tsx # DB 접속 정보 Card 폼
│ │ └── ssh-settings-form.tsx # SSH 터널링 설정 Card 폼
│ │
│ └── ui/ # Codex 전용 UI (재사용 가능, 외부 의존성 없음)
│ ├── status-badge.tsx # StandardStatus/RequestStatus → 한국어 + 색상 Badge
│ ├── target-type-badge.tsx # WORD/DOMAIN/TERM → "단어/도메인/용어" Badge
│ ├── pagination.tsx # 페이지 번호 + 이전/다음 (nuqs 연동)
│ ├── data-table.tsx # 기본 데이터 테이블 (정렬, 체크박스, Skeleton)
│ ├── inline-comment.tsx # 필드 옆 말풍선 아이콘 + Popover 코멘트
│ ├── similarity-bar.tsx # AI 유사도 % Progress Bar (색상 코딩)
│ ├── collapsible-row.tsx # 테이블 행 클릭 확장 패널
│ ├── stepper.tsx # 단계 진행 (완료/현재/미진행 상태)
│ ├── date-range-picker.tsx # 날짜 범위 선택 (from~to)
│ └── empty-state.tsx # Empty State 일러스트 + 메시지 + CTA
│
├── hooks/
│ ├── use-auth.ts # 인증 상태 및 세션 정보
│ ├── use-role.ts # 역할 기반 권한 확인 (canRequest, canApprove 등)
│ ├── use-notifications.ts # 알림 상태 관리 (SSE 구독 포함)
│ ├── use-ai-butler.ts # AI Data Butler 요청 훅
│ ├── use-draft-autosave.ts # Draft 디바운스 300ms 자동저장
│ ├── use-command-palette.ts # Command Palette 전역 열기/닫기
│ ├── use-standard-detail.ts # 표준 상세 Sheet 상태 (URL query param)
│ └── use-debounce.ts # 입력 디바운스 유틸 훅 (기본 300ms)
│
├── lib/
│ ├── api.ts # fetch 기반 API 클라이언트 (base URL, 에러 처리, 토큰)
│ ├── auth.ts # 인증 토큰 관리 유틸 (쿠키 기반)
│ ├── format.ts # 날짜/숫자/상태 포맷 유틸
│ └── validators.ts # Zod 스키마 정의 (폼별 유효성)
│
└── middleware.ts # 인증 미들웨어: 비인증 → /login 리다이렉트, admin 역할 가드
```

### 2.2 solutions/codex/models (@nexus/codex-models)

Codex 도메인 TypeScript 타입 정의 + 타입 안전 API 클라이언트 함수. UI 의존성이 없는 순수 데이터 레이어.

> **API 클라이언트 의존성 주입**: `@nexus/codex-models`의 API 함수들은 `web/src/lib/api.ts`의 `apiClient`에 직접 의존하지 않는다. 대신 `createApiClient(baseUrl, getToken)` 팩토리를 export하고, `@nexus/codex-web`의 Provider에서 초기화하여 주입한다. 이로써 models 패키지는 웹 전용 코드(쿠키, fetch 설정)에 의존하지 않으며, 테스트 시 mock 클라이언트를 주입할 수 있다.

```markdown
solutions/codex/models/src/
├── entities/
│ ├── standard.ts # StandardWord, StandardDomain, StandardTerm, StandardTermWord, StandardStatus, DataType
│ ├── governance.ts # Request, RequestChange, DeleteImpact, Draft, Comment, TargetType, RequestType, RequestStatus, DraftStatus
│ ├── validation.ts # ValidationExecution, ValidationResult, ValidationRuleType, Severity, ResolveStatus
│ ├── common-code.ts # CommonCodeGroup, CommonCode
│ ├── system.ts # User, MenuPermission, SystemCode, AuditLog, Notification, UserRole, UserStatus, NotificationType
│ └── db-connection.ts # DatabaseConnection, DbType, SshAuthType
│
├── api/
│ ├── auth.ts # loginApi, logoutApi, getSession
│ ├── dashboard.ts # getDashboardStats, getPendingCount, getRecentActivity, getTrend, getMySummary, getRoleKpi
│ ├── explorer.ts # searchExplorer, getExplorerFacets, getAutocomplete
│ ├── standards.ts # getWordList, getWordDetail, getWordTerms, getWordHistory,
│ │ # getDomainList, getDomainDetail, getDomainTerms, getDomainHistory,
│ │ # getTermList, getTermDetail, getTermWords, getTermDomain, getTermHistory
│ ├── requests.ts # createWordRequest, createDomainRequest, createTermRequest, createCommonCodeRequest,
│ │ # getRequestList, getMyRequests, getMyRequestStats, getRequestDetail,
│ │ # getRequestFeedback, cancelRequest, createDeleteRequest
│ ├── approvals.ts # getApprovalList, getApprovalStats, getApprovalDetail,
│ │ # getApprovalChanges, getApprovalHistory, processApproval, batchApprove
│ ├── inline-governance.ts # startInlineEdit, updateDraftField, submitInlineDraft, getInlineDiff
│ ├── drafts.ts # getDraftList, createDraft, getDraftDetail, updateDraft, changeDraftStatus,
│ │ # deleteDraft, addCollaborator, removeCollaborator, submitDraftAsRequest
│ ├── comments.ts # getComments, createComment, updateComment, deleteComment, resolveComment
│ ├── validations.ts # getValidationSummary, getValidationTrend, getValidationRules,
│ │ # getValidationHistory, executeValidation, getViolationList, batchCorrect
│ ├── ai.ts # getAiSuggestions, getAiMatchDetail, getAiAutocomplete, getQualityScore,
│ │ # getAiSynonyms, generatePhysicalName, validateNaming
│ ├── common-codes.ts # getCodeGroupList, getCodeGroupDetail, getGroupCodes, createCodeGroup,
│ │ # updateCodeGroup, addCode, updateCode, deleteCode, searchCommonCodes
│ ├── users.ts # getUserList, createUser, updateUser, deleteUser
│ ├── permissions.ts # getRolePermissions, saveRolePermissions
│ ├── system-codes.ts # getSystemCodes, createSystemCode, updateSystemCode, deleteSystemCode
│ ├── settings.ts # getDbSettings, saveDbSettings, testDbConnection, getSshSettings,
│ │ # saveSshSettings, testSshTunnel, exportSettings, importSettings
│ ├── notifications.ts # getNotificationList, getUnreadCount, markAsRead, markAllAsRead,
│ │ # deleteNotification, subscribeNotifications (SSE)
│ ├── audit.ts # getAuditList, getAuditTimeline
│ └── governance.ts # getComplianceRate, getGovernanceKpi, getGovernanceTrend,
│ # getDeptRanking, getNonCompliantTop, generatePdfReport
│
└── index.ts # 모든 엔티티 타입 + API 함수 re-export
```

### 2.3 solutions/codex/shared (@nexus/codex-shared)

Codex 내부 공유 유틸, 상수, 비UI 로직.

```markdown
solutions/codex/shared/src/
├── constants/
│ ├── routes.ts # CODEX_ROUTES: 경로 문자열 상수 (하드코딩 방지)
│ ├── menu.ts # CODEX_MENU_CODES: 권한 관리용 메뉴 코드 목록
│ └── status.ts # STATUS_LABELS: StandardStatus/RequestStatus → 한국어 레이블 맵
│
├── utils/
│ ├── physical-name.ts # buildPhysicalName: 단어 약어 배열 → 물리명 (CUST + NO → CUST_NO)
│ ├── status-color.ts # getStatusColor: 상태값 → Tailwind 색상 클래스
│ ├── request-no.ts # parseRequestNo / formatRequestNo: REQ-yyyy-NNNN 파싱/생성
│ └── role-check.ts # hasPermission: UserRole + menuCode → boolean
│
└── index.ts # 전체 re-export
```

---

## 3. 라우트 설계

### 3.1 App Router 라우트 트리 (basePath: /solutions/codex)

`next.config.ts`의 `basePath: "/solutions/codex"` 적용. 파일 경로는 basePath를 제외한 상대 경로.

| 파일 경로 (`app/` 기준)              | 실제 URL                              | UX 화면                                               |
| ------------------------------------ | ------------------------------------- | ----------------------------------------------------- |
| `page.tsx`                           | `/solutions/codex`                    | 5.2 신청자 대시보드 / 5.3 승인자 대시보드 (역할 분기) |
| `(auth)/login/page.tsx`              | `/solutions/codex/login`              | 5.1 로그인                                            |
| `standards/page.tsx`                 | `/solutions/codex/standards`          | 5.4 통합 표준 탐색기 + 5.5 표준 상세 Sheet            |
| `standards/new/page.tsx`             | `/solutions/codex/standards/new`      | 5.6 신규 표준 신청                                    |
| `approvals/page.tsx`                 | `/solutions/codex/approvals`          | 5.7 승인 워크벤치                                     |
| `governance/page.tsx`                | `/solutions/codex/governance`         | 5.10 거버넌스 포털                                    |
| `audit/page.tsx`                     | `/solutions/codex/audit`              | 5.11 감사 추적                                        |
| `common-codes/page.tsx`              | `/solutions/codex/common-codes`       | 5.13 공통코드 조회                                    |
| `validations/page.tsx`               | `/solutions/codex/validations`        | 5.8 검증 대시보드                                     |
| `validations/[executionId]/page.tsx` | `/solutions/codex/validations/{id}`   | 5.9 검증 상세                                         |
| `admin/layout.tsx`                   | `/solutions/codex/admin/*`            | SYSTEM_ADMIN 가드 레이아웃                            |
| `admin/common-codes/page.tsx`        | `/solutions/codex/admin/common-codes` | 5.12 공통코드 관리                                    |
| `admin/users/page.tsx`               | `/solutions/codex/admin/users`        | 5.14 사용자 관리                                      |
| `admin/permissions/page.tsx`         | `/solutions/codex/admin/permissions`  | 5.15 권한 관리                                        |
| `admin/system-codes/page.tsx`        | `/solutions/codex/admin/system-codes` | 5.16 코드 관리 (시스템)                               |
| `admin/db-settings/page.tsx`         | `/solutions/codex/admin/db-settings`  | 5.17 DB 연결 설정                                     |

총 16개 `page.tsx` + 2개 `layout.tsx` = 17개 UX 화면 완전 매핑.

### 3.2 라우트 그룹 & 특수 패턴

#### `(auth)` 라우트 그룹 — PlatformShell 우회

로그인 화면은 PlatformShell(Header + Sidebar)이 없는 독립 레이아웃이다.

```typescript
// app/(auth)/layout.tsx
import { ThemeProvider } from "@nexus/ui";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
```

#### `admin` 레이아웃 — SYSTEM_ADMIN 가드

```typescript
// app/admin/layout.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session || session.user.role !== "SYSTEM_ADMIN") {
    redirect("/");
  }
  return <>{children}</>;
}
```

#### 표준 상세 Sheet — URL Query Param 패턴

표준 상세는 별도 라우트가 아니라 `nuqs`를 통한 URL searchParams로 Sheet 열림 상태를 관리한다.

```markdown
/solutions/codex/standards → 탐색기, Sheet 닫힘
/solutions/codex/standards?type=TERM → 표준용어 탭 활성
/solutions/codex/standards?type=TERM&detail=1234 → 용어 ID 1234 상세 Sheet 열림
/solutions/codex/standards?type=WORD&detail=567 → 단어 ID 567 상세 Sheet 열림
```

이로써:

- Sheet가 열린 상태를 URL로 공유 가능
- 브라우저 뒤로가기로 Sheet 닫기 가능
- Breadcrumb에 표준명을 마지막 항목으로 동적 추가 가능

#### `[executionId]` 동적 세그먼트

```typescript
// app/validations/[executionId]/page.tsx
// Next.js 16: params는 Promise — 반드시 await 필요
export async function generateMetadata({
  params,
}: {
  params: Promise<{ executionId: string }>;
}) {
  const { executionId } = await params;
  return { title: `검증 상세 #${executionId} — Codex — Nexus` };
}
```

---

## 4. 컴포넌트 아키텍처

### 4.1 컴포넌트 계층 구조

```markdown
Page Layer (app/\*_/_.tsx)
│ 역할: 데이터 패칭 조율, 레이아웃 구성, URL 파라미터 파싱
│ 원칙: Server Component 우선. 초기 데이터를 서버에서 패칭 후 Feature에 prop으로 전달
│
├── Feature Layer (components/{domain}/_.tsx)
│ 역할: 비즈니스 로직, 사용자 상호작용, 도메인 훅 사용, 상태 관리
│ 원칙: "use client" 명시. 개별 기능 단위 분리로 테스트 가능성 확보
│
└── UI Layer (components/ui/_.tsx + @nexus/ui)
역할: 순수 표현 컴포넌트, props만으로 동작
원칙: 외부 의존성(훅, API 호출) 없음. 비즈니스 로직 없음
```

### 4.2 주요 Feature 컴포넌트 인터페이스

#### StandardDetailSheet

표준 상세 + 인라인 거버넌스의 핵심 컴포넌트. `@nexus/ui` `Sheet` 기반 640px 우측 슬라이드.

```typescript
// components/standards/standard-detail-sheet.tsx
"use client";

type SheetMode = "read" | "edit" | "delete-impact";

interface StandardDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: "WORD" | "DOMAIN" | "TERM";
  targetId: number;
  onRequestSubmitted?: (requestNo: string) => void;
}

// 내부 상태
// mode: SheetMode          — 읽기 / 편집 / 삭제영향도 Stepper 모드
// draftId: number | null   — POST /api/inline-governance/edit로 생성된 Draft ID
// deleteStep: 1 | 2 | 3 | 4
```

#### ExplorerTable

활성 탭에 따라 컬럼 구성이 달라지는 반응형 테이블.

```typescript
// components/standards/explorer-table.tsx
"use client";

interface ExplorerTableProps {
  activeTab: "TERM" | "WORD" | "DOMAIN";
  items: ExplorerItem[];
  isLoading: boolean;
  selectedId: number | null;
  onRowClick: (item: ExplorerItem) => void;
}
```

탭별 컬럼 구성:

| TERM (표준용어) | WORD (표준단어) | DOMAIN (표준도메인) |
| --------------- | --------------- | ------------------- |
| 표준용어명      | 표준단어명      | 도메인명            |
| 물리명 (mono)   | 영문약어 (mono) | 도메인유형          |
| 도메인유형      | 영문명          | 데이터타입 (mono)   |
| 인포타입        | 정의 (말줄임)   | 데이터길이 (mono)   |
| 정의 (말줄임)   | 도메인유형      | 정의 (말줄임)       |
| 상태 Badge      | 상태 Badge      | 상태 Badge          |
| 등록일          | 등록일          | 등록일              |

#### ApprovalList + ApprovalDetailPanel (워크벤치 조합)

부모 `app/approvals/page.tsx`에서 `selectedId` 상태를 관리하고 두 컴포넌트에 전달.

```typescript
// components/approvals/approval-list.tsx
interface ApprovalListProps {
  items: ApprovalRequest[];
  selectedId: number | null;
  isLoading: boolean;
  onSelect: (id: number) => void;
}

// components/approvals/approval-detail-panel.tsx
interface ApprovalDetailPanelProps {
  requestId: number | null;
  onProcessed: (result: ProcessApprovalResponse) => void;
}
```

#### DeleteImpactStepper

삭제 영향도 평가 4단계 Stepper. `StandardDetailSheet` 내부에서 `mode === "delete-impact"`일 때 렌더링.

```typescript
// components/standards/delete-impact-stepper.tsx
interface DeleteImpactStepperProps {
  targetType: TargetType;
  targetId: number;
  draftId: number;
  onComplete: (data: DeleteImpactFormData) => Promise<void>;
  onCancel: () => void;
}

interface DeleteImpactFormData {
  affectedSystems: string[];
  affectedOther: string;
  impactLevel: "HIGH" | "MEDIUM" | "LOW";
  impactDesc: string;
  altStandard: string;
  migrationPlan: string;
  deleteReason: string;
}
```

#### NewStandardForm

유형 선택(WORD/DOMAIN/TERM)에 따라 폼 필드가 동적으로 변경.

```typescript
// components/standards/new-standard-form.tsx
interface NewStandardFormProps {
  initialType?: TargetType;
  initialDraftId?: number; // 저장된 초안에서 이어서 작성 시
  onSubmitted: (requestNo: string) => void;
  onDraftSaved: (draftId: number) => void;
}
```

#### CommandPalette

전역 Command Palette. `app/layout.tsx`에서 Provider로 마운트. Ctrl+K로 열림.

```typescript
// components/layout/command-palette.tsx
interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 섹션 구성
// 1. 최근 검색 — localStorage에서 최근 5건
// 2. 빠른 이동 — 메뉴명 fuzzy matching
// 3. 액션 — "신규 표준 신청", "검증 실행"
// 4. 표준 검색 — GET /api/explorer/autocomplete 실시간
```

### 4.3 Codex 전용 UI 컴포넌트

`components/ui/`에 위치. 외부 API/훅 의존성 없음.

| 컴포넌트          | 파일                    | 설명                                                      |
| ----------------- | ----------------------- | --------------------------------------------------------- |
| `StatusBadge`     | `status-badge.tsx`      | StandardStatus/RequestStatus → 한국어 + 색상 Badge        |
| `TargetTypeBadge` | `target-type-badge.tsx` | WORD/DOMAIN/TERM → "단어/도메인/용어" 색상 Badge          |
| `Pagination`      | `pagination.tsx`        | 페이지 번호 + 이전/다음 (nuqs 연동, 10건/페이지 기본)     |
| `DataTable`       | `data-table.tsx`        | 정렬 헤더, 체크박스 선택, 로딩 Skeleton 내장              |
| `InlineComment`   | `inline-comment.tsx`    | 필드 옆 말풍선 아이콘 + Popover 코멘트 입력 (필드명 기반) |
| `SimilarityBar`   | `similarity-bar.tsx`    | 0-100% Progress Bar (80%+ 파랑, 50-80% 주황, 50%- 회색)   |
| `CollapsibleRow`  | `collapsible-row.tsx`   | 테이블 행 클릭 시 하단 확장 패널 (감사 추적 타임라인)     |
| `Stepper`         | `stepper.tsx`           | 단계 표시 + 완료(녹색 체크)/현재(파랑)/미진행(회색)       |
| `DateRangePicker` | `date-range-picker.tsx` | from~to 날짜 범위 선택                                    |
| `EmptyState`      | `empty-state.tsx`       | 빈 상태 메시지 + 선택적 CTA Button                        |

### 4.4 @nexus/ui 재사용 컴포넌트 매핑

현재 `@nexus/ui`에 존재하는 컴포넌트와 Codex 사용 화면:

| @nexus/ui 컴포넌트                                                  | Codex 적용 화면                                                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `Button`                                                            | 모든 화면의 액션 버튼. 링크 버튼은 `render={<Link href="..." />} nativeButton={false}` 패턴 사용 |
| `Card`, `CardHeader`, `CardContent`                                 | 대시보드 위젯, 폼 컨테이너, KPI 카드, DB 설정 섹션                                               |
| `Badge`                                                             | `StatusBadge`/`TargetTypeBadge`의 베이스 컴포넌트                                                |
| `Input`                                                             | 검색 바, 폼 입력 필드 전반                                                                       |
| `ScrollArea`                                                        | 코드그룹 좌측 목록, 승인 대기 목록                                                               |
| `Separator`                                                         | 사이드바 섹션 구분, Sheet 내부 섹션 구분                                                         |
| `Sheet`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle` | 표준 상세 Sheet (side="right", 640px)                                                            |
| `Tooltip`, `TooltipProvider`                                        | 아이콘 버튼 설명                                                                                 |

### 4.5 신규 필요 공유 컴포넌트 (@nexus/ui 추가)

Codex에서 필요하고 다른 솔루션에서도 공용 가능한 컴포넌트. `@nexus/ui`에 추가 권장.

| 컴포넌트                                                     | 설치 명령                             | 주요 사용처                                     |
| ------------------------------------------------------------ | ------------------------------------- | ----------------------------------------------- |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`             | `pnpm dlx shadcn@latest add tabs`     | 탐색기, 검증상세, 코드관리, 권한관리            |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`     | `pnpm dlx shadcn@latest add select`   | 필터 드롭다운, 폼 선택 필드                     |
| `Textarea`                                                   | `pnpm dlx shadcn@latest add textarea` | 정의 입력, 신청사유, 처리사유                   |
| `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter`    | `pnpm dlx shadcn@latest add dialog`   | 확인 Dialog, 사용자 추가/수정, 일괄처리         |
| `Alert`, `AlertDescription`                                  | `pnpm dlx shadcn@latest add alert`    | 오류/경고/AI 중복 경고                          |
| `Progress`                                                   | `pnpm dlx shadcn@latest add progress` | AI 유사도 바, 승인 KPI 게이지                   |
| `Checkbox`                                                   | `pnpm dlx shadcn@latest add checkbox` | 테이블 행 선택, 권한 체크박스, 영향 시스템 선택 |
| `Command`, `CommandInput`, `CommandList`, `CommandItem`      | `pnpm dlx shadcn@latest add command`  | Command Palette, 자동완성 드롭다운              |
| `Popover`, `PopoverTrigger`, `PopoverContent`                | `pnpm dlx shadcn@latest add popover`  | 인라인 코멘트, 초안 목록, 알림 센터             |
| `Switch`                                                     | `pnpm dlx shadcn@latest add switch`   | SSH 터널링 ON/OFF                               |
| `Skeleton`                                                   | `pnpm dlx shadcn@latest add skeleton` | 로딩 상태 플레이스홀더                          |
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` | `pnpm dlx shadcn@latest add table`    | 모든 데이터 테이블                              |
| `Label`                                                      | `pnpm dlx shadcn@latest add label`    | 폼 레이블                                       |

추가 후 `packages/ui/src/index.ts`에 re-export 추가 필수.

---

## 5. 상태 관리 전략

### 5.1 서버 상태 (TanStack Query)

모든 API 데이터는 TanStack Query로 관리한다. `components/providers/query-provider.tsx`에서 `QueryClient` 설정.

**쿼리 키 규칙** (`@nexus/codex-shared/src/constants/`에서 정의):

```typescript
// solutions/codex/shared/src/constants/query-keys.ts
export const QUERY_KEYS = {
  dashboard: {
    stats: ["dashboard", "stats"] as const,
    myRequests: ["dashboard", "my-requests"] as const,
    roleKpi: (role: UserRole) => ["dashboard", "role-kpi", role] as const,
    trend: ["dashboard", "trend"] as const,
  },
  explorer: {
    search: (params: ExplorerSearchParams) =>
      ["explorer", "search", params] as const,
    autocomplete: (q: string) => ["explorer", "autocomplete", q] as const,
  },
  standards: {
    word: (id: number) => ["standards", "word", id] as const,
    domain: (id: number) => ["standards", "domain", id] as const,
    term: (id: number) => ["standards", "term", id] as const,
  },
  requests: {
    list: (params: object) => ["requests", params] as const,
    my: ["requests", "my"] as const,
    detail: (id: number) => ["requests", id] as const,
  },
  approvals: {
    list: (params: object) => ["approvals", params] as const,
    stats: ["approvals", "stats"] as const,
    detail: (id: number) => ["approvals", id] as const,
    changes: (id: number) => ["approvals", id, "changes"] as const,
  },
  drafts: {
    list: ["drafts"] as const,
    detail: (id: number) => ["drafts", id] as const,
  },
  notifications: {
    list: ["notifications"] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },
  ai: {
    suggest: (params: AiSuggestParams) => ["ai", "suggest", params] as const,
  },
  validations: {
    summary: ["validations", "summary"] as const,
    violations: (params: object) =>
      ["validations", "violations", params] as const,
  },
  governance: {
    compliance: ["governance", "compliance"] as const,
    kpi: ["governance", "kpi"] as const,
  },
} as const;
```

**캐시 정책 (staleTime)**:

| 데이터           | staleTime     | 이유                   |
| ---------------- | ------------- | ---------------------- |
| 대시보드 통계    | 60초          | 자주 변경되지 않음     |
| 탐색기 검색 결과 | 30초          | 검색어별 캐시          |
| 표준 상세        | 300초         | 안정적 데이터          |
| 승인 대기 목록   | 0 (항상 최신) | 처리 후 즉시 갱신 필요 |
| 알림 미읽음 수   | 0             | SSE로 실시간 갱신      |
| AI 추천          | 30초          | 같은 키워드 재사용     |
| 거버넌스 통계    | 300초         | 주기적 갱신으로 충분   |

### 5.2 클라이언트 상태

**Draft 자동저장 패턴** (`hooks/use-draft-autosave.ts`):

```typescript
export function useDraftAutosave(draftId: number | null) {
  const { mutate: updateField } = useMutation({
    mutationFn: ({ fieldName, value }: { fieldName: string; value: unknown }) =>
      updateDraftField(draftId!, { fieldName, value }),
  });

  // 300ms 디바운스: 타이핑 중 불필요한 API 호출 방지
  const debouncedSave = useDebouncedCallback(updateField, 300);

  // blur 이벤트: 포커스 이탈 시 즉시 저장
  const saveOnBlur = useCallback(
    (fieldName: string, value: unknown) => {
      if (!draftId) return;
      updateField({ fieldName, value });
    },
    [draftId, updateField],
  );

  // beforeunload: 브라우저 닫힘 시 navigator.sendBeacon으로 비동기 보장 저장
  useEffect(() => {
    const handler = () => {
      if (!draftId) return;
      navigator.sendBeacon(
        `/api/inline-governance/${draftId}/field`,
        new Blob([JSON.stringify({ fieldName: "_flush", value: true })], {
          type: "application/json",
        }),
      );
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [draftId]);

  return { debouncedSave, saveOnBlur };
}
```

**폼 상태**: React Hook Form + Zod. 각 폼 컴포넌트 로컬 상태로 관리. Draft 저장 시 `form.getValues()`로 스냅샷 생성.

**승인 워크벤치 선택 상태**: `app/approvals/page.tsx`의 `useState<number | null>(null)`. `ApprovalList`와 `ApprovalDetailPanel` 공유.

### 5.3 URL 상태 (nuqs)

URL searchParams로 동기화하여 새로고침/공유 후에도 UI 상태 복원.

```typescript
// app/standards/page.tsx
const [tab, setTab] = useQueryState("type", { defaultValue: "TERM" });
const [detailId, setDetailId] = useQueryState("detail", parseAsInteger);
const [keyword, setKeyword] = useQueryState("q", { defaultValue: "" });
const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
const [status, setStatus] = useQueryState("status");
const [domainType, setDomainType] = useQueryState("domain");
const [infoType, setInfoType] = useQueryState("info");

// app/approvals/page.tsx
const [targetTypeFilter, setTargetTypeFilter] = useQueryState("target");
const [requestTypeFilter, setRequestTypeFilter] = useQueryState("req");

// app/audit/page.tsx
const [from, setFrom] = useQueryState("from");
const [to, setTo] = useQueryState("to");
const [actionType, setActionType] = useQueryState("action");
const [actor, setActor] = useQueryState("actor");

// app/validations/[executionId]/page.tsx
const [ruleTab, setRuleTab] = useQueryState("rule", { defaultValue: "ALL" });
const [severity, setSeverity] = useQueryState("severity");
const [targetType, setTargetType] = useQueryState("target");
```

### 5.4 전역 상태 (React Context)

**AuthContext** (`components/providers/auth-provider.tsx`):

```typescript
interface AuthContextValue {
  user: SessionUser | null;
  permissions: MenuPermission[];
  isLoading: boolean;
  login: (loginId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
```

**NotificationContext** (`components/providers/notification-provider.tsx`):

```typescript
interface NotificationContextValue {
  unreadCount: number;
  notifications: Notification[];
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}
// Provider 내부 useEffect에서 GET /api/notifications/subscribe (SSE) 연결 관리
// EventSource 재연결 로직 포함 (네트워크 오류 시 지수적 백오프)
```

**CommandPaletteContext** (`hooks/use-command-palette.ts`):

```typescript
interface CommandPaletteContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
// app/layout.tsx 레벨에서 Ctrl+K / Cmd+K keydown 이벤트 등록
```

**AIButlerContext** (`components/providers/ai-butler-provider.tsx`):

```typescript
interface AIButlerContextValue {
  contextInsights: AiInsight[];
  isLoading: boolean;
  setContext: (context: AIButlerContext) => void;
}
// 각 페이지 진입 시 setContext 호출 → 맥락 기반 인사이트 자동 갱신
```

---

## 6. 데이터 페칭 패턴

### 6.1 API 클라이언트 설계 (@nexus/codex-models)

**기반 클라이언트** (`solutions/codex/web/src/lib/api.ts`):

```typescript
class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function apiClient<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new ApiError(error.error.code, error.error.message, response.status);
  }

  return response.json() as Promise<T>;
}
```

**모델 함수 패턴** (`models/src/api/explorer.ts` 예시):

```typescript
export async function searchExplorer(
  params: ExplorerSearchParams,
): Promise<ExplorerSearchResponse> {
  const sp = new URLSearchParams();
  if (params.keyword) sp.set("keyword", params.keyword);
  if (params.types?.length) sp.set("types", params.types.join(","));
  if (params.status?.length) sp.set("status", params.status.join(","));
  if (params.page) sp.set("page", String(params.page));
  if (params.size) sp.set("size", String(params.size));
  return apiClient<ExplorerSearchResponse>(`/api/explorer/search?${sp}`);
}
```

### 6.2 Server Components vs Client Components 전략

**Server Component에서 초기 데이터 패칭** (SEO + 빠른 첫 렌더링):

| 라우트                                   | 서버에서 패칭하는 데이터                               | Next.js cache 설정     |
| ---------------------------------------- | ------------------------------------------------------ | ---------------------- |
| `app/page.tsx`                           | `/api/dashboard/stats`, `/api/dashboard/my-summary`    | `revalidate: 60`       |
| `app/standards/page.tsx`                 | `/api/explorer/search` (초기 목록, 기본 필터)          | `no-store` (필터 가변) |
| `app/governance/page.tsx`                | `/api/governance/compliance`, `/api/governance/kpi`    | `revalidate: 300`      |
| `app/validations/page.tsx`               | `/api/validations/summary`, `/api/validations/history` | `revalidate: 60`       |
| `app/validations/[executionId]/page.tsx` | `/api/validations/violations?executionId={id}`         | `revalidate: 60`       |
| `app/audit/page.tsx`                     | `/api/audit` (기본 필터 결과)                          | `no-store`             |

**Client Component로 처리** (상호작용 필요):

| 컴포넌트                                         | Client Component 이유                           |
| ------------------------------------------------ | ----------------------------------------------- |
| `explorer-filters.tsx`                           | 검색 입력, 필터 변경 실시간 반응                |
| `standard-detail-sheet.tsx`                      | Sheet 열기/닫기, 편집 모드 전환, Draft API 호출 |
| `approval-list.tsx`, `approval-detail-panel.tsx` | 선택 상태 동기화, 처리 액션                     |
| `new-standard-form.tsx`                          | 폼 유효성, Draft 자동저장, AI 추천 실시간       |
| `command-palette.tsx`                            | 키보드 이벤트, 실시간 검색                      |
| `notification-center.tsx`                        | SSE 실시간 업데이트                             |
| `compliance-gauge.tsx`                           | SVG 애니메이션                                  |
| 모든 차트 컴포넌트                               | Recharts는 클라이언트 전용                      |

### 6.3 캐싱 전략

Server Component에서 `fetch`의 `next.revalidate` 또는 `cache: "no-store"` 옵션으로 캐싱 제어. Client Component에서는 TanStack Query의 `staleTime`으로 캐시 수명 제어 (5.1 표 참조).

Server Action을 사용하는 뮤테이션(폼 제출)은 `revalidatePath`를 호출하여 관련 Server Component 캐시를 즉시 무효화한다.

### 6.4 낙관적 업데이트 패턴

승인 처리, 신청 취소 등 즉각적 피드백이 중요한 뮤테이션에 적용.

```typescript
// components/approvals/approval-action-form.tsx
const processMutation = useMutation({
  mutationFn: (req: ProcessApprovalRequest) => processApproval(requestId, req),
  onMutate: async () => {
    await queryClient.cancelQueries({
      queryKey: QUERY_KEYS.approvals.list({}),
    });
    const previousList = queryClient.getQueryData(
      QUERY_KEYS.approvals.list({}),
    );
    queryClient.setQueryData(QUERY_KEYS.approvals.list({}), (old: any) => ({
      ...old,
      items: old.items.filter((item: any) => item.requestId !== requestId),
    }));
    return { previousList };
  },
  onError: (_, __, context) => {
    queryClient.setQueryData(
      QUERY_KEYS.approvals.list({}),
      context?.previousList,
    );
    toast.error("처리에 실패했습니다. 다시 시도해주세요.");
  },
  onSuccess: (result, variables) => {
    const actionLabel =
      variables.action === "approve"
        ? "승인"
        : variables.action === "reject"
          ? "반려"
          : "검토요청";
    toast.success(`${actionLabel} 처리되었습니다.`);
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.approvals.stats });
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.dashboard.roleKpi(user.role),
    });
  },
});
```

---

## 7. AI Data Butler 프론트엔드 아키텍처

### 7.1 통합 형태

AI Data Butler는 독립 페이지 없이 각 화면에 3가지 형태로 분산 통합된다.

| 형태                 | 구현 컴포넌트                  | 적용 화면                                             | 트리거              |
| -------------------- | ------------------------------ | ----------------------------------------------------- | ------------------- |
| **인라인 자동완성**  | `Command` 기반 드롭다운        | 통합 탐색기 검색, 신규 신청 폼, Command Palette       | 입력 디바운스 300ms |
| **사이드 패널 추천** | `ai-suggestion-panel.tsx`      | 신규 표준 신청 (우측 40%), 상세 Sheet 편집 모드       | 표준명 필드 입력    |
| **맥락형 인사이트**  | `AiInsightCard` (화면 내 삽입) | 승인 워크벤치, 검증 대시보드, 거버넌스 포털, 대시보드 | 페이지 로드         |

### 7.2 useAiButler 훅 패턴

```typescript
// hooks/use-ai-butler.ts

// 1. 유사 표준 추천 (신규 신청, 탐색기 검색)
export function useAiSuggest(keyword: string, type: TargetType) {
  return useQuery({
    queryKey: QUERY_KEYS.ai.suggest({ keyword, type, limit: 3 }),
    queryFn: () => getAiSuggestions({ keyword, type, limit: 3 }),
    enabled: keyword.length >= 2,
    staleTime: 30_000,
  });
}

// 2. AI 자동완성 (영문약어, 정의 필드)
export function useAiAutocomplete() {
  return useMutation({
    mutationFn: (req: AiAutocompleteRequest) => getAiAutocomplete(req),
  });
}

// 3. 물리명 자동 생성 (표준용어 신청 시)
export function useGeneratePhysicalName() {
  return useMutation({
    mutationFn: (req: GeneratePhysicalNameRequest) => generatePhysicalName(req),
  });
}

// 4. 명명 규칙 실시간 검증 (영문약어 입력 시)
export function useValidateNaming() {
  return useMutation({
    mutationFn: (data: { abbrName: string }) => validateNaming(data),
  });
}
```

### 7.3 인라인 자동완성 데이터 흐름

```markdown
사용자 입력
│
▼ useDebounce(keyword, 300)
GET /api/explorer/autocomplete?q={keyword}&limit=5
│
├── 결과 있음 → Command 드롭다운 표시
│ 클릭 시 → URL: ?type={type}&detail={id} → Sheet 열림
│
└── 결과 없음 → "결과 없음" + "신규 신청하기" CTA
```

### 7.4 80% 중복 경고 처리

```typescript
// components/standards/new-standard-form.tsx
const { data: suggestions } = useAiSuggest(watchedTermName, selectedType);
const hasDuplicateWarning = suggestions?.duplicateWarning ?? false;

{hasDuplicateWarning && (
  <Alert variant="warning" className="mb-4">
    <AlertDescription>
      유사한 표준이 이미 존재합니다. 신규 신청 전 기존 표준을 확인해주세요.
    </AlertDescription>
  </Alert>
)}
```

---

## 8. 인라인 거버넌스 프론트엔드 플로우

### 8.1 변경 신청 플로우

```markdown
탐색기에서 행 클릭
│
▼ URL: ?type=TERM&detail={id} 설정
StandardDetailSheet 열림 (읽기 모드)
│
▼ [편집] 버튼 클릭
POST /api/inline-governance/edit → { draftId, originalData }
Sheet → 편집 모드 전환, draftId 상태 저장
│
▼ 사용자 필드 수정 (디바운스 300ms)
PATCH /api/inline-governance/{draftId}/field
Draft.data 업데이트, autoSavedAt 갱신
│
▼ 변경 미리보기 섹션 자동 갱신
GET /api/inline-governance/{draftId}/diff
변경된 필드만 3-column diff 테이블 표시
│
├── [초안 저장]
│ PATCH /api/drafts/{draftId}/status → READY
│ Sheet 닫힘
│ Toast (info): "초안이 저장되었습니다"
│
└── [변경 신청 제출]
확인 Dialog 표시
│
▼ 확인
POST /api/inline-governance/{draftId}/submit
→ Draft: EDITING → SUBMITTED
→ Request 자동 생성 (UPDATE)
→ RequestChange 레코드 자동 생성 (변경 필드만)
→ AuditLog 기록
→ Notification 생성 (승인자에게: APPROVAL_REQUIRED)
│
▼
Sheet 닫힘, URL query param 초기화
Toast (success): "변경 신청이 제출되었습니다 (REQ-2026-XXXX)"
탐색기 테이블 invalidateQueries
```

### 8.2 삭제 신청 플로우 (Stepper)

```markdown
Sheet 읽기 모드 → [삭제 신청] 버튼 클릭
│
▼
POST /api/inline-governance/edit → draftId
Sheet → delete-impact 모드 전환
DeleteImpactStepper 렌더링 (4단계)
│
▼ Step 1/4: 영향 받는 시스템 (체크박스)
▼ Step 2/4: 영향도 수준 + 설명
▼ Step 3/4: 대체 표준 + 마이그레이션 계획
│ AI: 대체 표준 자동 추천 (GET /api/ai/synonyms)
▼ Step 4/4: 삭제 사유
│
▼ [삭제 신청 제출]
POST /api/requests/{type}/delete (DeleteImpact 포함)
│
▼
Toast (success): "삭제 신청이 제출되었습니다 (REQ-2026-XXXX)"
Sheet 닫힘
```

---

## 9. 인증 & 권한 프론트엔드

### 9.1 미들웨어 라우트 보호

`solutions/codex/web/src/middleware.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getTokenRole(token: string): UserRole | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("codex-token")?.value;

  if (pathname === "/login") {
    if (token) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin/")) {
    const role = getTokenRole(token);
    if (role !== "SYSTEM_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
```

### 9.2 역할 기반 컴포넌트 권한

```typescript
// hooks/use-role.ts
export function useRole() {
  const { user } = useAuth();
  const role = user?.role;

  return {
    canRequest: ["SYSTEM_ADMIN", "STD_MANAGER", "REQUESTER"].includes(
      role ?? "",
    ),
    canApprove: ["SYSTEM_ADMIN", "REVIEWER_APPROVER"].includes(role ?? ""),
    canManage: role === "SYSTEM_ADMIN",
    // STD_MANAGER도 공통코드 관리 접근 가능
    canManageCommonCodes: ["SYSTEM_ADMIN", "STD_MANAGER"].includes(role ?? ""),
    canViewGovernance: [
      "SYSTEM_ADMIN",
      "REVIEWER_APPROVER",
      "STD_MANAGER",
    ].includes(role ?? ""),
    canExecuteValidation: ["SYSTEM_ADMIN", "STD_MANAGER"].includes(role ?? ""),
    isReadOnly: role === "READ_ONLY",
    // 대시보드 뷰 분기: 승인자/관리자 → approver, 그 외 → requester
    isApproverView: ["SYSTEM_ADMIN", "REVIEWER_APPROVER"].includes(role ?? ""),
    role,
  };
}
```

### 9.3 역할 기반 사이드바 메뉴 필터링

```typescript
// components/layout/codex-sidebar.tsx
const {
  canApprove,
  canManage,
  canRequest,
  canViewGovernance,
  canExecuteValidation,
} = useRole();
const { unreadCount } = useNotifications();

const menuConfig = [
  {
    items: [
      { href: "/", label: "대시보드", icon: LayoutDashboard, show: true },
    ],
  },
  {
    label: "표준 관리",
    items: [
      { href: "/standards", label: "표준 탐색기", icon: Search, show: true },
      {
        href: "/standards/new",
        label: "신규 신청",
        icon: Plus,
        show: canRequest,
      },
      {
        href: "/common-codes",
        label: "공통코드 조회",
        icon: BookOpen,
        show: true,
      },
    ],
  },
  {
    label: "거버넌스",
    items: [
      {
        href: "/approvals",
        label: "승인 워크벤치",
        icon: CheckSquare,
        show: canApprove,
        badge: unreadCount > 0 ? unreadCount : undefined,
      },
      {
        href: "/governance",
        label: "거버넌스 포털",
        icon: BarChart2,
        show: canViewGovernance,
      },
      { href: "/audit", label: "감사 추적", icon: FileText, show: !isReadOnly },
    ],
  },
  {
    label: "품질 관리",
    items: [
      {
        href: "/validations",
        label: "검증 대시보드",
        icon: Shield,
        show: true,
      },
    ],
  },
  {
    label: "관리",
    show: canManage || canManageCommonCodes,
    items: [
      {
        href: "/admin/common-codes",
        label: "공통코드 관리",
        icon: Settings2,
        show: canManageCommonCodes, // STD_MANAGER도 접근 가능
      },
      {
        href: "/admin/users",
        label: "사용자 관리",
        icon: Users,
        show: canManage,
      },
      {
        href: "/admin/permissions",
        label: "권한 관리",
        icon: Key,
        show: canManage,
      },
      {
        href: "/admin/system-codes",
        label: "코드 관리",
        icon: Tag,
        show: canManage,
      },
      {
        href: "/admin/db-settings",
        label: "DB 연결 설정",
        icon: Database,
        show: canManage,
      },
    ],
  },
];
```

---

## 10. 성능 최적화

### 10.1 코드 스플리팅 & Lazy Loading

무거운 라이브러리는 `next/dynamic`으로 지연 로드.

```typescript
const StandardTrendChart = dynamic(
  () => import("@/components/dashboard/standard-trend-chart"),
  { loading: () => <Skeleton className="h-48 w-full" />, ssr: false }
);

const GovernanceTrendChart = dynamic(
  () => import("@/components/governance/governance-trend-chart"),
  { loading: () => <Skeleton className="h-56 w-full" />, ssr: false }
);

const CommandPalette = dynamic(
  () => import("@/components/layout/command-palette"),
  { ssr: false }
);

const ComplianceGauge = dynamic(
  () => import("@/components/governance/compliance-gauge"),
  { loading: () => <Skeleton className="h-32 w-32 rounded-full" />, ssr: false }
);
```

### 10.2 Suspense 스트리밍

Page 레벨에서 독립적인 데이터 섹션을 `Suspense`로 분리하여 병렬 스트리밍.

```typescript
// app/governance/page.tsx
import { Suspense } from "react";

export default function GovernancePage() {
  return (
    <div className="space-y-6 p-6">
      <Suspense fallback={<ComplianceGaugeSkeleton />}>
        <ComplianceSection />
      </Suspense>
      <Suspense fallback={<KpiCardsSkeleton />}>
        <KpiSection />
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <TrendChartSection />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <NonCompliantSection />
      </Suspense>
    </div>
  );
}
```

### 10.3 검색 최적화

- 탐색기 검색: `useDebounce(keyword, 300)` 적용 후 API 호출
- AI 자동완성: 최소 2자 이상 입력 조건 (`enabled: keyword.length >= 2`)
- 탐색기 다음 페이지 prefetch: 현재 페이지 로드 완료 시 `queryClient.prefetchQuery`로 다음 페이지 미리 가져오기

### 10.4 메모이제이션

테이블 행 컴포넌트는 `React.memo`로 불필요한 리렌더 방지. 특히 체크박스 상태 변경 시 전체 목록 리렌더를 방지하기 위해 `selectedIds` 집합을 `useMemo`로 계산.

---

## 11. @nexus/shell 통합

### 11.1 PlatformShell 래핑

현재 `solutions/codex/web/src/app/layout.tsx`의 구조를 유지하며 Codex 전용 Provider들을 추가한다.

```typescript
// app/layout.tsx (최종 구조)
export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <QueryProvider>
              <AuthProvider>
                <NotificationProvider>
                  <AIButlerProvider>
                    <CommandPaletteProvider>
                      <PlatformShell>
                        {children}
                        <CommandPalette />
                        <Toaster richColors position="bottom-right" />
                      </PlatformShell>
                    </CommandPaletteProvider>
                  </AIButlerProvider>
                </NotificationProvider>
              </AuthProvider>
            </QueryProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 11.2 Codex 전용 사이드바 통합 전략

`@nexus/shell`의 `PlatformShell`에 `sidebarContent` prop을 추가하여 Codex 사이드바를 주입.

```typescript
// solutions/codex/web/src/app/layout.tsx
<PlatformShell sidebarContent={<CodexSidebar />}>
  {children}
</PlatformShell>
```

### 11.3 Breadcrumb 레이블 확장

Codex 경로 레이블 맵:

```typescript
const codexRouteLabels: Record<string, string> = {
  standards: "통합 표준 탐색기",
  new: "신규 표준 신청",
  approvals: "승인 워크벤치",
  governance: "거버넌스 포털",
  audit: "감사 추적",
  "common-codes": "공통코드 조회",
  validations: "검증 대시보드",
  admin: "관리",
  users: "사용자 관리",
  permissions: "권한 관리",
  "system-codes": "코드 관리",
  "db-settings": "DB 연결 설정",
};
```

---

## 12. 구현 단계 (Phase 1~3)

### Phase 1: 핵심 거버넌스 (MVP)

**목표**: 신청자와 승인자가 핵심 워크플로우(표준 검색 → 신청 → 승인)를 완수할 수 있는 최소 기능.

#### 구현 라우트

- [ ] `app/page.tsx` — 역할별 대시보드 (신청자/승인자 뷰)
- [ ] `app/(auth)/login/page.tsx` — 로그인 화면
- [ ] `app/standards/page.tsx` — 통합 표준 탐색기 (탭, 검색, 테이블, 상세 Sheet 읽기 모드)
- [ ] `app/standards/new/page.tsx` — 신규 표준 신청 폼 (초안 저장 포함)
- [ ] `app/approvals/page.tsx` — 승인 워크벤치 (좌우 분할)

#### 구현 컴포넌트

- [ ] `components/providers/query-provider.tsx`
- [ ] `components/providers/auth-provider.tsx`
- [ ] `components/layout/codex-sidebar.tsx`
- [ ] `components/dashboard/requester-dashboard.tsx`
- [ ] `components/dashboard/approver-dashboard.tsx`
- [ ] `components/dashboard/stat-card.tsx`
- [ ] `components/dashboard/activity-timeline.tsx`
- [ ] `components/dashboard/approval-kpi-panel.tsx`
- [ ] `components/standards/explorer-table.tsx`
- [ ] `components/standards/explorer-filters.tsx`
- [ ] `components/standards/standard-detail-sheet.tsx` (읽기 모드, 편집 모드)
- [ ] `components/standards/inline-edit-form.tsx`
- [ ] `components/standards/change-diff-table.tsx`
- [ ] `components/standards/new-standard-form.tsx`
- [ ] `components/approvals/approval-list.tsx`
- [ ] `components/approvals/approval-detail-panel.tsx`
- [ ] `components/approvals/approval-action-form.tsx`
- [ ] `components/approvals/batch-action-dialog.tsx`
- [ ] `components/ui/status-badge.tsx`
- [ ] `components/ui/target-type-badge.tsx`
- [ ] `components/ui/pagination.tsx`
- [ ] `components/ui/data-table.tsx`
- [ ] `components/ui/empty-state.tsx`
- [ ] `middleware.ts`

#### 의존 패키지 작업

- [ ] `@nexus/ui` 추가 컴포넌트: Tabs, Select, Textarea, Dialog, Alert, Checkbox, Table, Label, Skeleton
- [ ] `@nexus/codex-models/src/entities/`: StandardWord, StandardTerm, StandardDomain, Request, Draft 타입 완성
- [ ] `@nexus/codex-models/src/api/`: auth, dashboard, explorer, standards, requests, approvals, inline-governance, drafts
- [ ] `@nexus/codex-shared/src/constants/`: routes, status, query-keys
- [ ] `@nexus/codex-shared/src/utils/`: role-check, status-color

#### 신규 의존성 설치

```bash
cd solutions/codex/web
pnpm add @tanstack/react-query react-hook-form zod @hookform/resolvers sonner nuqs
```

---

### Phase 2: AI & 협업 + 거버넌스 화면

**목표**: AI Data Butler 통합, 초안 협업, 실시간 알림, Command Palette, 거버넌스/검증/감사 화면.

#### 구현 라우트

- [ ] `app/governance/page.tsx` — 거버넌스 포털
- [ ] `app/validations/page.tsx` — 검증 대시보드
- [ ] `app/validations/[executionId]/page.tsx` — 검증 상세
- [ ] `app/audit/page.tsx` — 감사 추적
- [ ] `app/common-codes/page.tsx` — 공통코드 조회

#### 구현 컴포넌트

- [ ] `components/providers/ai-butler-provider.tsx`
- [ ] `components/providers/notification-provider.tsx` (SSE 포함)
- [ ] `components/layout/command-palette.tsx` (Ctrl+K)
- [ ] `components/layout/notification-center.tsx`
- [ ] `components/standards/ai-suggestion-panel.tsx`
- [ ] `components/standards/delete-impact-stepper.tsx`
- [ ] `components/ui/stepper.tsx`
- [ ] `components/ui/inline-comment.tsx`
- [ ] `components/ui/similarity-bar.tsx`
- [ ] `components/ui/collapsible-row.tsx`
- [ ] `components/governance/compliance-gauge.tsx` (SVG)
- [ ] `components/governance/dept-ranking-list.tsx`
- [ ] `components/governance/non-compliant-table.tsx`
- [ ] `components/governance/governance-trend-chart.tsx` (Recharts, lazy)
- [ ] `components/validations/validation-stat-cards.tsx`
- [ ] `components/validations/violation-trend-chart.tsx` (Recharts, lazy)
- [ ] `components/validations/rule-summary-table.tsx`
- [ ] `components/validations/validation-history-table.tsx`
- [ ] `components/validations/violation-list.tsx`
- [ ] `components/audit/audit-filter-bar.tsx`
- [ ] `components/audit/audit-table.tsx`
- [ ] `components/audit/audit-timeline-panel.tsx`
- [ ] `components/common-codes/common-code-search-table.tsx`
- [ ] `components/dashboard/standard-trend-chart.tsx` (Recharts, lazy)

#### 의존 패키지 작업

- [ ] `@nexus/ui` 추가 컴포넌트: Command, Popover, Switch, Progress
- [ ] `@nexus/codex-models/src/entities/`: Comment, Notification, AuditLog, ValidationExecution, ValidationResult
- [ ] `@nexus/codex-models/src/api/`: ai, comments, notifications, audit, governance, validations, common-codes
- [ ] `@nexus/codex-shared/src/utils/`: physical-name, request-no

#### 신규 의존성 설치

```bash
cd solutions/codex/web
pnpm add recharts
```

---

### Phase 3: 관리자 기능 & 완성도

**목표**: 시스템 관리자 전용 기능, 전체 UX 완성도, 성능 최적화.

#### 구현 라우트

- [ ] `app/admin/layout.tsx` — SYSTEM_ADMIN 가드
- [ ] `app/admin/common-codes/page.tsx` — 공통코드 관리
- [ ] `app/admin/users/page.tsx` — 사용자 관리
- [ ] `app/admin/permissions/page.tsx` — 권한 관리
- [ ] `app/admin/system-codes/page.tsx` — 코드 관리 (시스템)
- [ ] `app/admin/db-settings/page.tsx` — DB 연결 설정

#### 구현 컴포넌트

- [ ] `components/common-codes/code-group-list.tsx`
- [ ] `components/common-codes/code-detail-table.tsx`
- [ ] `components/admin/user-table.tsx`
- [ ] `components/admin/user-form-dialog.tsx`
- [ ] `components/admin/permission-tree.tsx`
- [ ] `components/admin/system-code-table.tsx`
- [ ] `components/admin/db-connection-form.tsx`
- [ ] `components/admin/ssh-settings-form.tsx`
- [ ] `components/ui/date-range-picker.tsx`

#### 완성도 작업

- [ ] 모든 화면 Skeleton 로딩 상태 완성
- [ ] Error Boundary (`app/error.tsx`, `app/not-found.tsx`)
- [ ] 반응형 레이아웃 (모바일) 최종 점검
- [ ] `generateMetadata` 동적 타이틀 설정
- [ ] 차트 컴포넌트 `dynamic import` (ssr: false) 전환
- [ ] 탐색기 테이블 다음 페이지 prefetch
- [ ] Toast/알림 센터 통합 마무리
- [ ] Command Palette 최근 검색 localStorage 영속성

#### 의존 패키지 작업

- [ ] `@nexus/codex-models/src/api/`: users, permissions, system-codes, settings
- [ ] `@nexus/codex-shared/src/utils/request-no.ts`

---

## 13. 오류 처리 전략

### 13.1 API 에러 처리

```typescript
class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// 401 응답 시 자동 로그인 페이지 리다이렉트
// 403 응답 시 화면 내 접근 거부 Alert 표시
// 5xx 응답 시 전역 Toast 오류 메시지
```

### 13.2 화면별 오류 UI 패턴

| 오류 유형                | UI 처리                                                      |
| ------------------------ | ------------------------------------------------------------ |
| 페이지 초기 로드 실패    | `app/error.tsx` Next.js 에러 경계                            |
| 테이블/목록 조회 실패    | 해당 영역 내 `Alert` + "다시 시도" 버튼                      |
| 뮤테이션(저장/제출) 실패 | Toast (error, 수동 닫기)                                     |
| 401 Unauthorized         | 로그인 페이지 리다이렉트                                     |
| 403 Forbidden            | 화면 내 "접근 권한이 없습니다" Alert                         |
| 네트워크 오류            | Toast: "서버에 연결할 수 없습니다. 네트워크를 확인해주세요." |

---

## 14. 보안 고려사항

| 항목                      | 처리 방법                                                              |
| ------------------------- | ---------------------------------------------------------------------- |
| 토큰 저장                 | HttpOnly 쿠키 사용 (XSS 방어)                                          |
| CSRF 보호                 | SameSite=Strict 쿠키 + Next.js 내장 CSRF 토큰                          |
| XSS 방어                  | React 기본 이스케이프, `dangerouslySetInnerHTML` 사용 금지             |
| 민감 정보 마스킹          | DB/SSH 비밀번호는 응답에 `"••••••"` 마스킹 반환                        |
| 클라이언트 권한 우회 방지 | 미들웨어 + 서버 컴포넌트 서버 측 권한 확인 (클라이언트 단독 의존 금지) |

---

> 이 문서는 Codex 프론트엔드 구현의 단일 진실 공급원(Single Source of Truth)이다.
> 구현 진행 중 결정 사항이 변경되면 해당 섹션을 업데이트하고 변경 이유를 주석으로 남긴다.
