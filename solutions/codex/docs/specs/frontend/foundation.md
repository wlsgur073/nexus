---
title: "기술 스택 및 패키지 구조"
description: "핵심 기술 스택, 의존성, @nexus/codex-web·models·shared 패키지 구조"
version: "1.0"
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
└─────────────────────────────── ↑
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
