---
title: "상태 관리 및 데이터 페칭"
description: "TanStack Query, nuqs, React Context 상태 관리 및 API 클라이언트·캐싱 전략"
version: "1.0"
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
