---
title: "Phase 4 프론트엔드 보강 설계"
description: "데스크톱 전용 기준 프론트엔드 품질 완성 — 폼 고도화, 접근성, UX 일관성"
version: "1.0"
date: "2026-03-25"
---

## 목표

Phase 1~3에서 구현된 17개 화면의 **품질 완성도**를 높인다. 신규 화면 추가 없이, 기존 화면의 UX 일관성, 접근성, 성능을 개선한다.

**제약**: 데스크톱 전용 (모바일 미지원). 태블릿~와이드 스크린(1024px~1920px+) 범위만 고려.

---

## 1. generateMetadata 동적 타이틀

**현재**: 루트 layout.tsx에 `title: "Codex — Nexus"` 고정.
**목표**: 각 라우트별 동적 타이틀 (예: "표준 탐색기 — Codex — Nexus").

**구현 방법**: 클라이언트 컴포넌트(`"use client"`) 페이지에서는 직접 `metadata` export가 불가하므로, 각 라우트 디렉토리에 `metadata`를 export하는 Server Component wrapper 또는 `generateMetadata` 함수를 활용한다.

**대상 라우트** (16개):

| 라우트                | 타이틀                           |
| --------------------- | -------------------------------- |
| `/`                   | 대시보드 — Codex — Nexus         |
| `/login`              | 로그인 — Codex — Nexus           |
| `/standards`          | 표준 탐색기 — Codex — Nexus      |
| `/standards/new`      | 신규 표준 신청 — Codex — Nexus   |
| `/approvals`          | 승인 워크벤치 — Codex — Nexus    |
| `/governance`         | 거버넌스 포털 — Codex — Nexus    |
| `/validations`        | 검증 대시보드 — Codex — Nexus    |
| `/validations/[id]`   | 검증 상세 — Codex — Nexus        |
| `/audit`              | 감사 추적 — Codex — Nexus        |
| `/common-codes`       | 공통코드 조회 — Codex — Nexus    |
| `/admin/common-codes` | 공통코드 관리 — Codex — Nexus    |
| `/admin/users`        | 사용자 관리 — Codex — Nexus      |
| `/admin/permissions`  | 권한 관리 — Codex — Nexus        |
| `/admin/system-codes` | 시스템 코드 관리 — Codex — Nexus |
| `/admin/db-settings`  | DB 연결 설정 — Codex — Nexus     |

**패턴**: `{페이지명} — Codex — Nexus` (루트 layout의 `title.template` 활용)

---

## 2. 인라인 로딩 → Skeleton 교체

**현재**: 일부 컴포넌트에서 `"로딩 중..."` 텍스트를 사용.
**목표**: Phase 3에서 만든 `page-skeleton.tsx`의 패턴과 `@nexus/ui` Skeleton을 활용하여 인라인 로딩도 통일.

**대상**: `isLoading` 조건부 렌더링에서 텍스트 대신 Skeleton을 표시하는 모든 컴포넌트.

`grep -r "로딩 중" solutions/codex/web/src/components/`로 대상을 식별한다.

---

## 3. Toast/알림 통합

**현재**: admin 컴포넌트에는 Sonner toast가 적용되었으나, Phase 1~2 화면의 뮤테이션(신청 제출, 승인 처리, 초안 저장 등)에는 미적용.
**목표**: 모든 뮤테이션 성공/실패에 `toast.success()` / `toast.error()` 적용.

**대상 화면**:

- `/standards/new` — 신청 제출, 초안 저장
- `/approvals` — 승인/반려/피드백 처리, 일괄 승인
- 인라인 거버넌스 — Draft 편집, 제출
- 코멘트 — 생성/수정/삭제/해결

---

## 4. 다크모드 전체 점검

**현재**: Recharts 차트는 `useChartColors()`로 처리 완료. 하지만 admin 화면과 일부 컴포넌트의 하드코딩 색상이 다크모드에서 부자연스러울 수 있음.
**목표**: 전 화면 다크모드에서 color 일관성 확인 + 수정.

**점검 기준**:

- `bg-white`, `text-gray-*`, `border-gray-*` 등 하드코딩 색상 → Tailwind 시맨틱 토큰 (`bg-background`, `text-foreground` 등)
- Dialog, Card, Table의 다크모드 contrast 확인

---

## 5. 탐색기 prefetch

**현재**: `/standards` 페이지에서 페이지네이션 시 다음 페이지 데이터를 클릭 후에야 fetch.
**목표**: TanStack Query `prefetchQuery`로 다음 페이지 데이터를 미리 로딩.

**구현**:

```typescript
// 현재 페이지 데이터 로드 완료 시 다음 페이지 prefetch
const queryClient = useQueryClient();
useEffect(() => {
  if (page < totalPages) {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.explorer.search({ ...params, page: page + 1 }),
      queryFn: () => searchExplorer({ ...params, page: page + 1 }),
    });
  }
}, [page, totalPages]);
```

---

## 6. 표준용어 신청 폼 고도화

**현재**: 표준용어 탭에서 텍스트 필드로 직접 입력 (용어명, 도메인유형, 인포타입, 정의).
**목표**: 명세서 §5.6 + data/rules.md STD-004/STD-006 준수.

### 구성 단어 선택 UI

```
┌─────────────────────────────────────────────┐
│ 구성 단어*                                   │
│ ┌─────────────────────────────────────────┐ │
│ │ [고객(CUST)] [번호(NO)]  [검색...]___│ │
│ └─────────────────────────────────────────┘ │
│   ↓ 검색 시 드롭다운                        │
│   ┌───────────────────────────────────┐     │
│   │ 유형   CUST_TP     고객유형  ● 기존│     │
│   │ 코드   CD          코드     ● 기존│     │
│   │ 명칭   NM          명칭     ● 기존│     │
│   └───────────────────────────────────┘     │
│                                              │
│ 도메인유형*  [코드 ▾]                        │
│ 인포타입*    [코드 ▾]                        │
│ 물리명       CUST_NO_CD (자동 생성, readonly)│
│ 정의*        [___________________________]   │
│ 신청사유     [___________________________]   │
└─────────────────────────────────────────────┘
```

**동작**:

1. "검색..." 입력 시 디바운스(300ms) → 기존 표준단어 검색 API 호출
2. 결과를 드롭다운으로 표시 (영문약어, 한국어명, 상태)
3. 클릭 시 태그로 추가, 여러 단어 조합 가능
4. 태그 순서가 물리명 생성 순서 결정
5. 태그에 X 버튼으로 제거
6. 구성 단어 변경 시 → 물리명 자동 재생성 (`buildPhysicalName` 유틸 활용)
7. **비즈니스 규칙**: 최소 1개 단어 필수 (STD-006), 물리명 수동 입력 불가 (STD-004)

**의존성**: `@nexus/codex-models`의 `getWordList` API + `@nexus/codex-shared`의 `buildPhysicalName` 유틸 (이미 존재)

---

## 7. 권한 트리 키보드 내비게이션

**현재**: 마우스로만 조작 가능.
**목표**: WCAG 2.1.1 Keyboard 준수.

**키보드 패턴** (WAI-ARIA treegrid):
| 키 | 동작 |
|----|------|
| Arrow Up/Down | 행 이동 (포커스 이동) |
| Arrow Right | 카테고리 펼침 |
| Arrow Left | 카테고리 접기 / 부모로 이동 |
| Space | 포커스된 체크박스 토글 |
| Tab | 트리 → 저장 버튼으로 이동 |

**구현**: `permission-tree.tsx`에 `onKeyDown` 핸들러 추가 + `tabIndex`, `aria-activedescendant` 관리.

---

## 8. 접근성 감사

**목표**: 전체 17개 화면의 접근성 점검.

**점검 항목** (WCAG 2.1 AA):

- 시맨틱 HTML (heading 계층, landmark)
- ARIA 속성 (role, aria-label, aria-describedby)
- 색상 대비 (4.5:1 텍스트, 3:1 UI 요소)
- 포커스 표시 (focus-visible ring)
- 아이콘 버튼 sr-only 라벨 (Phase 2에서 일부 적용, 전체 확인)

**도구**: Chrome DevTools Lighthouse a11y audit + 수동 키보드 탐색 테스트.
