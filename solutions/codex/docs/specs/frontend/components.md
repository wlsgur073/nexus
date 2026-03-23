---
title: "라우트 및 컴포넌트 아키텍처"
description: "App Router 라우트 트리, 컴포넌트 계층, AI Butler·인라인 거버넌스 프론트엔드"
version: "1.0"
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
