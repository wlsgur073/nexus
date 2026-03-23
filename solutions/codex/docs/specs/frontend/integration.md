---
title: "통합, 인증, 성능 및 구현 단계"
description: "인증·권한, 성능 최적화, @nexus/shell 통합, Phase 1-3 구현 순서, 오류·보안"
version: "1.0"
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
