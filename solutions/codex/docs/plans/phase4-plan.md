# Codex Phase 4 실행 계획

> **목표**: 프론트엔드 품질 완성 — 폼 고도화, UX 일관성, 접근성
> **선행 조건**: Phase 3 완료 (2026-03-25)
> **명세 참조**: `specs/frontend/phase4-enhancement.md`
> **제약**: 데스크톱 전용 (모바일 미지원)

---

## 사전 점검 (Pre-flight)

- [ ] `grep -r "TODO\|FIXME\|HACK" solutions/codex/web/src/` — 미완성 코드 식별
- [ ] `pnpm build && pnpm lint` — 현재 빌드 정상 여부
- [ ] `git status` — 미커밋 변경사항 확인

---

## 실행 순서

### Step 1: generateMetadata 동적 타이틀

**작업**:

1. 루트 `layout.tsx`의 metadata에 `title.template` 추가:
   ```typescript
   export const metadata: Metadata = {
     title: { default: "Codex — Nexus", template: "%s — Codex — Nexus" },
   };
   ```
2. 각 라우트 디렉토리에 metadata export 추가 (16개):
   - `"use client"` 페이지: 해당 디렉토리에 별도 `layout.tsx` 생성하여 metadata export
   - Server Component 페이지: 직접 `metadata` export
3. admin layout에 이미 metadata가 있으므로 admin 하위만 추가

**영향 파일**: `layout.tsx` (수정) + 각 라우트 디렉토리 (약 10개 layout 추가/수정)

**완료 기준**: 브라우저 탭에 페이지별 타이틀 표시 + `pnpm build` 통과

---

### Step 2: 인라인 로딩 → Skeleton 교체

**작업**:

1. `grep -r "로딩 중" solutions/codex/web/src/components/`로 대상 식별
2. 각 컴포넌트의 `isLoading` 조건부 렌더링을 `@nexus/ui` Skeleton으로 교체
3. 테이블 컴포넌트: 행 높이에 맞는 Skeleton 적용
4. 카드/통계 컴포넌트: CardContent 내 Skeleton 적용

**완료 기준**: "로딩 중" 텍스트가 코드베이스에서 제거 + Skeleton으로 대체

---

### Step 3: Toast/알림 통합

**작업**:

1. Phase 1~2 뮤테이션 함수 호출 위치 식별:
   - `/standards/new` → createWordRequest, createDomainRequest, createTermRequest
   - `/approvals` → processApproval, batchApprove
   - 인라인 거버넌스 → startInlineEdit, submitInlineDraft
   - 코멘트 → createComment, updateComment, deleteComment, resolveComment
2. 각 뮤테이션 성공/실패에 `toast.success()` / `toast.error()` 추가
3. 기존 알림 센터(NotificationProvider)와의 중복 여부 확인 — Toast는 즉시 피드백, 알림 센터는 비동기 알림으로 역할 분리

**완료 기준**: 모든 뮤테이션에 Toast 피드백 + `pnpm build` 통과

---

### Step 4: 다크모드 전체 점검

**작업**:

1. `grep -r "bg-white\|text-gray\|border-gray\|bg-\[#\|text-\[#\|border-\[#" solutions/codex/web/src/`로 하드코딩 색상 식별
2. Tailwind 시맨틱 토큰으로 교체:
   - `bg-white` → `bg-background`
   - `text-gray-*` → `text-muted-foreground` 또는 `text-foreground`
   - `border-gray-*` → `border` 또는 `border-border`
3. 다크모드에서 전체 화면 시각적 확인 (Chrome DevTools MCP 활용)

**완료 기준**: 하드코딩 색상 제거 + 다크모드 시각적 정상

---

### Step 5: 탐색기 prefetch

**작업**:

1. `/standards` 페이지(`standards/page.tsx`)에 TanStack Query prefetch 로직 추가
2. 현재 페이지 데이터 로드 완료 시 `queryClient.prefetchQuery`로 다음 페이지 미리 로딩
3. 기존 `useTransition` 기반 데이터 로딩 → `useQuery` 패턴으로 전환 검토 (prefetch 호환)

**완료 기준**: 다음 페이지 클릭 시 즉시 데이터 표시 + `pnpm build` 통과

---

### Step 6: 표준용어 신청 폼 고도화

> 이 Step이 Phase 4의 가장 큰 작업

**작업**:

1. **태그 입력 컴포넌트 구현** (`components/standards/word-tag-input.tsx`):
   - 검색 Input + 드롭다운 (디바운스 300ms)
   - `getWordList` API로 표준단어 검색
   - 선택 시 태그 추가 (단어명 + 영문약어 표시)
   - 태그 X 버튼으로 제거, 드래그 순서 변경 (선택)
   - 최소 1개 필수 검증 (STD-006)

2. **물리명 자동 생성** (`lib/physical-name.ts` 기존 유틸 활용):
   - 선택된 단어의 영문약어를 `_`로 조합
   - 도메인유형 약어를 마지막에 추가
   - readonly Input으로 표시 (STD-004)

3. **인포타입 Select** 추가:
   - 값: 사용자명, 금액, 일자, 코드, 설명, 여부
   - 기존 Select 패턴(`<span>` 직접 렌더링) 사용

4. **기존 new-standard-form.tsx 수정**:
   - 표준용어 탭 폼 필드를 새 컴포넌트로 교체
   - 기존 텍스트 입력 → 태그 선택 + Select + readonly 물리명

**영향 파일**:

- `components/standards/word-tag-input.tsx` (신규)
- `components/standards/new-standard-form.tsx` (수정)
- `lib/validators.ts` (수정 — 용어 스키마에 wordIds 추가)

**완료 기준**: 표준용어 신청 시 단어 검색→태그 선택→물리명 자동 생성 동작 + `pnpm build` 통과

---

### Step 7: 권한 트리 키보드 내비게이션

**작업**:

1. `permission-tree.tsx`에 `onKeyDown` 핸들러 추가
2. 포커스 추적: `activeRow` state + `aria-activedescendant`
3. Arrow Up/Down: 행 이동, Arrow Right/Left: 카테고리 펼침/접기, Space: 체크박스 토글
4. `tabIndex={0}` → 트리 컨테이너 포커스 가능
5. 포커스 시각적 표시 (focus ring)

**완료 기준**: 키보드만으로 권한 트리 전체 조작 가능

---

### Step 8: 접근성 감사

**작업**:

1. Chrome DevTools Lighthouse a11y 감사 실행 (주요 화면 5개: 대시보드, 탐색기, 승인, 거버넌스, admin)
2. 자동 감지 이슈 수정 (heading 계층, alt 텍스트, color contrast 등)
3. 수동 키보드 탐색: Tab 순서, 포커스 트랩, 모달 이스케이프
4. 아이콘 버튼 `sr-only` 라벨 전수 확인

**완료 기준**: Lighthouse a11y 90+ 점수 + 키보드 탐색 정상

---

### Step 9: 코드 리뷰 + 완료

1. code-reviewer 에이전트 dispatch
2. critical 이슈 수정 (최대 2 사이클)
3. `solutions/codex/CLAUDE.md` "Phase 4 완료" 갱신
4. `solutions/codex/docs/release/yyyy-MM-dd-phase4-enhancement.md` 릴리즈 노트 작성
5. 커밋 + PR + main merge (사용자 승인)

---

## 참조 명세

| 문서                                   | 내용                              |
| -------------------------------------- | --------------------------------- |
| `specs/frontend/phase4-enhancement.md` | Phase 4 설계 스펙                 |
| `specs/ux/screens-governance.md` §5.6  | 신규 표준 신청 폼 UX              |
| `specs/data/api.md` §5.9               | 표준 API (단어 검색, 물리명 생성) |
| `specs/data/rules.md` STD-004, STD-006 | 물리명/구성단어 비즈니스 규칙     |
| `specs/ux/patterns.md`                 | 접근성, 공유 패턴                 |

---

## 변경 이력

| 날짜       | 내용                             |
| ---------- | -------------------------------- |
| 2026-03-25 | 초안 작성 — 8개 항목 + 실행 순서 |
