# Nexus Platform UI/UX Full Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nexus 플랫폼을 Hub-Centric Layout + Refined Minimal 미학 + 몰입형 모션 시스템으로 전면 리디자인

**Architecture:** 사이드바를 제거하고 미니멀 상단 센터 내비로 전환. React Flow 기반 인터랙티브 노드 그래프가 Command Center의 핵심. Motion 라이브러리로 페이지 전환, 스태거드 진입, 마이크로인터랙션 전체 커버.

**Tech Stack:** Next.js 16, React 19, @xyflow/react ^12, motion ^12 (구 framer-motion), Newsreader (serif font), Tailwind CSS v4, shadcn/ui base-nova

**Spec:** `apps/platform/docs/specs/2026-03-31-nexus-ui-redesign-design.md`

---

## Context

현재 Nexus 플랫폼은 기능적으로 완성되었으나, 시각적 임팩트 부족과 인터랙션 결핍이 핵심 불만. "솔루션 간 데이터/기능을 연결하는 허브"라는 Nexus 비전이 UI에 반영되지 않고 있음. 이 리디자인은 Sidebar+Header 구조를 Center Nav + 인터랙티브 노드 그래프 대시보드로 전환하여 플랫폼의 정체성을 시각적으로 구현한다.

---

## File Structure

### 삭제 (3)

- `packages/shell/src/sidebar.tsx`
- `packages/shell/src/mobile-sidebar.tsx`
- `packages/shell/src/breadcrumbs.tsx`

### 신규 (11)

- `packages/config/src/hub-connections.ts` — HubConnection 타입 + 정적 연결 데이터
- `apps/platform/src/components/hub/hub-canvas.tsx` — React Flow 래퍼
- `apps/platform/src/components/hub/nexus-hub-node.tsx` — 중앙 허브 커스텀 노드
- `apps/platform/src/components/hub/solution-node.tsx` — 솔루션 커스텀 노드
- `apps/platform/src/components/hub/flow-edge.tsx` — 파티클 커스텀 엣지
- `apps/platform/src/components/hub/solution-detail-panel.tsx` — 우측 슬라이드 패널
- `apps/platform/src/components/hub/summary-bar.tsx` — 하단 5개 메트릭 바
- `apps/platform/src/components/hub/metric-card.tsx` — 개별 메트릭 카드
- `apps/platform/src/components/motion/page-transition.tsx` — 페이지 전환 래퍼
- `apps/platform/src/components/motion/stagger-container.tsx` — 스태거드 진입 래퍼
- `apps/platform/src/components/motion/animated-card.tsx` — 호버/프레스 카드

### 수정 (12)

- `packages/config/src/index.ts` — hub-connections export 추가
- `packages/shell/src/index.ts` — 삭제된 컴포넌트 export 제거
- `packages/shell/src/platform-shell.tsx` — 사이드바 로직 제거, 단순화
- `packages/shell/src/header.tsx` — 센터 내비 구조로 재작성
- `apps/platform/src/app/layout.tsx` — Newsreader 폰트 추가
- `apps/platform/src/app/globals.css` — 컬러 변수 전면 교체 (Light + Dark)
- `apps/platform/src/app/page.tsx` — Hub 대시보드로 전면 재작성
- `apps/platform/src/app/solutions/page.tsx` — Refined Minimal 스타일 + 모션
- `apps/platform/src/app/solutions/[slug]/page.tsx` — Refined Minimal 스타일
- `apps/platform/src/app/settings/page.tsx` — 세련된 empty state
- `apps/platform/src/app/not-found.tsx` — Refined Minimal 스타일
- `apps/platform/src/components/solutions/category-filter.tsx` — pill 스타일
- `apps/platform/src/components/solutions/solution-card.tsx` — 카드 재디자인 + 모션
- `apps/platform/src/components/solutions/solution-grid.tsx` — StaggerContainer 래퍼

---

## Phase 1: Foundation — Config Data + 의존성 설치

**Agent:** package-developer (Task 1) → team-lead (Task 2)

### Task 1: HubConnection 타입 및 정적 데이터

**Files:**

- Create: `packages/config/src/hub-connections.ts`
- Modify: `packages/config/src/index.ts`

- [ ] **Step 1:** `hub-connections.ts` 생성 — `HubConnection` 타입 정의 (`id`, `source`, `target`, `label?`, `status: "active" | "pending"`)
- [ ] **Step 2:** `hubConnections` 배열 정의 (7개: nexus→codex active, nexus→llm active, codex↔llm active, nexus→나머지 4개 pending)
- [ ] **Step 3:** 유틸 함수 2개: `getConnectionsByNode(nodeId)`, `getActiveConnections()`
- [ ] **Step 4:** `index.ts`에 export 추가 (`type HubConnection`, `hubConnections`, `getConnectionsByNode`, `getActiveConnections`)
- [ ] **Step 5:** `pnpm build` 전체 통과 확인
- [ ] **Step 6:** 커밋 — `feat(config): 허브 연결 데이터 모델 추가`

**패턴:** 기존 `solutions.ts` 스타일 (named exports, typed arrays, filter 함수). `type` 키워드 사용.

---

### Task 2: 새 의존성 설치

**Files:**

- Modify: `apps/platform/package.json` (pnpm 자동)
- Modify: `pnpm-lock.yaml` (pnpm 자동)

- [ ] **Step 1:** `cd apps/platform && pnpm add @xyflow/react motion`
- [ ] **Step 2:** `pnpm build` 전체 통과 확인
- [ ] **Step 3:** 커밋 — `chore(platform): @xyflow/react, motion 의존성 추가`

---

## Phase 2: Shell 구조 변경 — 사이드바 제거 + 헤더 재작성

**Agent:** package-developer
**의존:** Phase 1 완료

### Task 3: Sidebar/MobileSidebar/Breadcrumbs 삭제 + Shell 재작성

**Files:**

- Delete: `packages/shell/src/sidebar.tsx`
- Delete: `packages/shell/src/mobile-sidebar.tsx`
- Delete: `packages/shell/src/breadcrumbs.tsx`
- Modify: `packages/shell/src/index.ts`
- Modify: `packages/shell/src/platform-shell.tsx`
- Modify: `packages/shell/src/header.tsx`

- [ ] **Step 1:** 3개 파일 삭제 (sidebar, mobile-sidebar, breadcrumbs)
- [ ] **Step 2:** `index.ts`에서 삭제된 3개 export 제거. 남는 export: `PlatformShell`, `Header`, `ThemeToggle`
- [ ] **Step 3:** `platform-shell.tsx` 재작성 — `"use client"` 제거 가능 (useState 없어짐). 구조: `<Header />` + 페이딩 구분선 `<div>` (gradient: transparent→border→transparent) + `<main className="flex-1 w-full overflow-auto">{children}</main>`
- [ ] **Step 4:** `header.tsx` 재작성:
  - `"use client"` 유지 (usePathname 필요)
  - Props 제거 (onToggleSidebar 불필요)
  - Import 변경: Menu/Search/Input 제거, `usePathname` from `next/navigation` 추가
  - 높이: `h-14` → `h-12`, `border-b` 제거 (PlatformShell이 페이딩 구분선 담당)
  - 좌측: Waypoints 아이콘 + "Nexus" 텍스트 (추후 Phase 3에서 font-display 클래스 적용)
  - 중앙: navItems 배열 (`[{href:"/",label:"Hub"}, {href:"/solutions",label:"Solutions"}, {href:"/settings",label:"Settings"}]`). `usePathname()`으로 활성 탭 감지. 활성 탭에 1.5px 하단 밑줄.
  - 우측: ThemeToggle + User 아이콘 버튼 유지
- [ ] **Step 5:** `pnpm build && pnpm lint` 전체 통과 확인
- [ ] **Step 6:** 커밋 — `refactor(shell): 사이드바 제거, 센터 내비 헤더로 전환`

**주의:** Header의 `onToggleSidebar` prop 제거 시 `platform-shell.tsx`에서도 해당 prop 전달 코드 제거 필요. 원자적 변경이므로 한 커밋으로 묶음.

---

## Phase 3: 디자인 토큰 + 폰트 기초

**Agent:** frontend-developer
**의존:** Phase 2 완료

### Task 4: globals.css 컬러 시스템 전면 교체

**Files:**

- Modify: `apps/platform/src/app/globals.css`

- [ ] **Step 1:** `@theme inline` 블록 수정:
  - sidebar 관련 8개 항목 제거
  - 추가: `--color-surface`, `--color-canvas`, `--color-text-secondary`, `--color-text-muted`, `--color-text-disabled`
  - 추가: `--font-display: var(--font-newsreader)`
- [ ] **Step 2:** `:root` 블록 — Light Mode (Refined Minimal) 값으로 교체:
  - `--background: oklch(1 0 0)` (white)
  - `--surface: oklch(0.985 0.003 260)` (#fafbfd)
  - `--canvas: oklch(0.975 0.005 250)` (#f5f7fa)
  - `--foreground: oklch(0.15 0.02 260)` (slate-900)
  - `--text-secondary: oklch(0.37 0.015 260)` (slate-600)
  - `--text-muted: oklch(0.556 0.01 260)` (slate-400)
  - `--text-disabled: oklch(0.75 0.01 260)` (slate-300)
  - `--primary: oklch(0.15 0.02 260)` (CTA = slate-900)
  - `--border: oklch(0.955 0.005 260)` (#f0f1f5)
  - `--radius: 0.75rem` (12px, was 0.625rem)
  - sidebar 변수 모두 제거
- [ ] **Step 3:** `.dark` 블록 — Premium Dark 값으로 교체:
  - `--background: oklch(0.12 0.015 275)` (#0a0a12)
  - `--surface: oklch(0.15 0.015 275)` (#12121e)
  - `--canvas: oklch(0.18 0.02 275)` (#1a1a2e)
  - `--border: oklch(0.25 0.02 275)` (#252540)
  - `--foreground: oklch(0.9 0.01 260)` (#e2e8f0)
  - sidebar 변수 모두 제거
- [ ] **Step 4:** `pnpm turbo build --filter=@nexus/platform` 통과 확인
- [ ] **Step 5:** 커밋 — `style(platform): Refined Minimal + Premium Dark 디자인 토큰 적용`

---

### Task 5: Newsreader 폰트 + Layout 업데이트

**Files:**

- Modify: `apps/platform/src/app/layout.tsx`

- [ ] **Step 1:** `Newsreader` import 추가 (`next/font/google`)
- [ ] **Step 2:** 인스턴스 생성: `const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], display: "swap" })`
- [ ] **Step 3:** `<html>` className에 `newsreader.variable` 추가
- [ ] **Step 4:** Header 로고 텍스트에 `font-display` 클래스 적용 (header.tsx 수정 — `className="font-display text-[15px] font-medium tracking-tight"`)
- [ ] **Step 5:** `pnpm turbo build --filter=@nexus/platform && pnpm turbo lint --filter=@nexus/platform`
- [ ] **Step 6:** 커밋 — `feat(platform): Newsreader 세리프 폰트 도입 (듀얼 타이포 시스템)`

**중요:** `layout.tsx`는 Server Component. `AnimatePresence`는 Client Component가 필요하므로 layout.tsx에 직접 추가하지 않음. 각 페이지에서 `PageTransition` 래퍼 사용 (Phase 4).

---

## Phase 4: Motion 유틸리티 컴포넌트

**Agent:** frontend-developer
**의존:** Phase 3 완료

### Task 6: Motion 래퍼 컴포넌트 3개 생성

**Files:**

- Create: `apps/platform/src/components/motion/page-transition.tsx`
- Create: `apps/platform/src/components/motion/stagger-container.tsx`
- Create: `apps/platform/src/components/motion/animated-card.tsx`

- [ ] **Step 1:** `page-transition.tsx` — `"use client"`, `motion.div` from `"motion/react"` (v12 import path). 진입: `opacity 0→1, y 12→0` (300ms easeOut). 퇴장: `opacity 1→0, y 0→-8`. Props: `{ children, className? }`
- [ ] **Step 2:** `stagger-container.tsx` — 2개 named export.
  - `StaggerContainer`: `motion.div`, variants `{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }`, initial="hidden" animate="show". Props: `{ children, className?, delay? }`
  - `StaggerItem`: `motion.div`, variants `{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } }`. Props: `{ children, className? }`
- [ ] **Step 3:** `animated-card.tsx` — `motion.div`, `whileHover={{ y: -2 }}`, `whileTap={{ scale: 0.98 }}`. Props: `{ children, className?, onClick? }`
- [ ] **Step 4:** `pnpm turbo build --filter=@nexus/platform && pnpm turbo lint --filter=@nexus/platform`
- [ ] **Step 5:** 커밋 — `feat(platform): Motion 유틸리티 컴포넌트 추가 (페이지 전환, 스태거, 카드)`

**주의:** `motion` v12는 `"motion/react"` import path 사용. `"framer-motion"` 아님.

---

## Phase 5: Hub 대시보드 (Command Center)

**Agent:** frontend-developer
**의존:** Phase 4 완료
**Phase 6과 병렬 가능** (hub/ vs solutions/ 디렉토리 충돌 없음)

### Task 7: React Flow 캔버스 + 커스텀 노드

**Files:**

- Create: `apps/platform/src/components/hub/hub-canvas.tsx`
- Create: `apps/platform/src/components/hub/nexus-hub-node.tsx`
- Create: `apps/platform/src/components/hub/solution-node.tsx`

- [ ] **Step 1:** `nexus-hub-node.tsx` — React Flow `NodeProps` 커스텀 노드. 64px 원형 (`rounded-full`), Waypoints 아이콘, "NEXUS" 텍스트 (font-display uppercase tracking-widest), 8px 반투명 링 (box-shadow). `Handle` 컴포넌트 (source + target, 시각적으로 숨김).
- [ ] **Step 2:** `solution-node.tsx` — `node.data`에서 `Solution` + `dimmed: boolean` 수신. 3가지 상태별 스타일:
  - Active: bg-surface, border-indigo-200, 녹색 glow 도트
  - Beta: bg-surface, border-green-200, 노란 glow 도트
  - Coming-soon: bg-canvas, dashed border, opacity-60, grayscale 아이콘
  - `dimmed` 시 opacity 0.3. 호버 시 glow 펄스 (CSS `@keyframes`).
- [ ] **Step 3:** `hub-canvas.tsx` — `"use client"`. **필수:** `import "@xyflow/react/dist/style.css"`.
  - `nodeTypes`와 `edgeTypes`를 컴포넌트 **외부**에 정의 (React Flow 리렌더 방지).
  - `useNodesState`, `useEdgesState` 훅 사용.
  - 초기 노드: 중앙 허브 `{x:400, y:300}` + 6개 솔루션 원형 배치 (radius ~250, `Math.cos/sin`).
  - `Background` variant="dots", gap=20, color 투명도 0.35.
  - `Controls` 우하단.
  - 좌하단 Legend (Active/Beta/Coming Soon).
  - `hoveredNode` state로 연결되지 않은 노드/엣지 디밍.
  - Props: `{ onNodeClick: (slug: string) => void }`.
- [ ] **Step 4:** `pnpm turbo build --filter=@nexus/platform`
- [ ] **Step 5:** 커밋 — `feat(platform): Hub 노드 그래프 캔버스 + 커스텀 노드 구현`

---

### Task 8: 커스텀 엣지 (파티클 애니메이션)

**Files:**

- Create: `apps/platform/src/components/hub/flow-edge.tsx`

- [ ] **Step 1:** React Flow 커스텀 엣지. `getBezierPath()` from `@xyflow/react`로 경로 계산.
  - Active: 실선 2px + SVG `<circle>` with `<animateMotion>` (dur="2.5s", repeatCount="indefinite"). 파티클 색상은 엣지 데이터의 status로 결정.
  - Pending: dashed 1px, 파티클 없음.
  - `dimmed` prop: opacity 0.15, 파티클 숨김.
  - Optional label at midpoint.
- [ ] **Step 2:** `pnpm turbo build --filter=@nexus/platform`
- [ ] **Step 3:** 커밋 — `feat(platform): 플로우 엣지 파티클 애니메이션 구현`

**성능 노트:** SVG `animateMotion`은 GPU 가속. JS 애니메이션보다 성능 우수.

---

### Task 9: 사이드 패널 + 요약 바

**Files:**

- Create: `apps/platform/src/components/hub/solution-detail-panel.tsx`
- Create: `apps/platform/src/components/hub/metric-card.tsx`
- Create: `apps/platform/src/components/hub/summary-bar.tsx`

- [ ] **Step 1:** `solution-detail-panel.tsx` — `"use client"`, `motion.div` from `"motion/react"`.
  - 슬라이드: `initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}` (250ms easeOut).
  - 너비 w-80, bg-surface, border-l, p-6.
  - 내용: 닫기 버튼 (X), DynamicIcon 48px, 세리프 이름, 카테고리, 설명, Badge, 구분선, 연결 목록 (`getConnectionsByNode()`), "솔루션 열기" 버튼.
  - Props: `{ solution: Solution | null, onClose: () => void }`.
- [ ] **Step 2:** `metric-card.tsx` — Props: `{ title, value, subtitle? }`. bg-surface, rounded-xl, p-5. Title: text-xs uppercase. Value: text-xl font-display. Subtitle: text-xs text-muted.
- [ ] **Step 3:** `summary-bar.tsx` — 5개 MetricCard (Active Connections, Solutions "2/6", Data Flow mock, System Status mock, Last Activity mock). Grid: `grid-cols-2 lg:grid-cols-5 gap-3`. StaggerContainer/StaggerItem 래핑.
- [ ] **Step 4:** `pnpm turbo build --filter=@nexus/platform`
- [ ] **Step 5:** 커밋 — `feat(platform): 솔루션 디테일 패널 + 요약 바 구현`

---

### Task 10: Hub 대시보드 페이지 조립

**Files:**

- Modify: `apps/platform/src/app/page.tsx` (전면 재작성)

- [ ] **Step 1:** `"use client"` 페이지. PageTransition 래퍼.
  - 세리프 "Command Center" 제목 + 밑줄 악센트 + uppercase "Solution Hub Overview".
  - 메인: rounded-2xl bg-canvas 컨테이너 안에 HubCanvas. `selectedSolution` state.
  - AnimatePresence 래핑된 SolutionDetailPanel (조건부 렌더).
  - 하단: SummaryBar.
  - 패딩: px-10 py-7.
- [ ] **Step 2:** 초기 로딩 시퀀스 구현 (5단계 오케스트레이션):
  - ① 캔버스 페이드인 (0-200ms)
  - ② 허브 노드 scale 0.8→1 (200-400ms)
  - ③ 엣지 draw-in (400-700ms)
  - ④ 솔루션 노드 스태거드 등장 (700-1000ms)
  - ⑤ 파티클 시작 (1000-1200ms)
  - `useState` + `useEffect` + `setTimeout` 체인으로 단계별 visible state 관리.
- [ ] **Step 3:** `pnpm turbo build --filter=@nexus/platform && pnpm turbo lint --filter=@nexus/platform`
- [ ] **Step 4:** 개발 서버 시각 확인: 노드 그래프 렌더링, 드래그/줌/패닝, 노드 클릭 → 패널, 메트릭 표시
- [ ] **Step 5:** 커밋 — `feat(platform): Hub 대시보드 페이지 조립 + 초기 로딩 시퀀스`

---

## Phase 6: Solutions 페이지 리디자인

**Agent:** frontend-developer
**의존:** Phase 4 완료
**Phase 5와 병렬 가능**

### Task 11: 카테고리 필터 pill + 솔루션 카드 재디자인

**Files:**

- Modify: `apps/platform/src/components/solutions/category-filter.tsx`
- Modify: `apps/platform/src/components/solutions/solution-card.tsx`
- Modify: `apps/platform/src/components/solutions/solution-grid.tsx`

- [ ] **Step 1:** `category-filter.tsx` — Button variant 대신 `cn()` 직접 스타일. `rounded-full`. 선택: slate-900 bg + white text. 미선택: bg-surface + border. transition 200ms.
- [ ] **Step 2:** `solution-card.tsx` — AnimatedCard 래핑.
  - 40px 아이콘 (gradient bg, rounded-xl).
  - Active: 우상단 녹색 glow 도트. Coming-soon: dashed border + opacity-60 + "Coming Soon" 뱃지.
  - 호버 악센트 바: absolute bottom, gradient indigo→light, opacity 0→1.
  - 패딩 p-5, rounded-2xl.
- [ ] **Step 3:** `solution-grid.tsx` — `"use client"` 유지. StaggerContainer + StaggerItem 래핑. `layout` prop 추가 (필터 변경 시 layoutAnimation).
- [ ] **Step 4:** `pnpm turbo build --filter=@nexus/platform`
- [ ] **Step 5:** 커밋 — `style(platform): 솔루션 카드/필터 Refined Minimal 리디자인 + 모션`

---

### Task 12: Solutions 카탈로그 + 디테일 페이지

**Files:**

- Modify: `apps/platform/src/app/solutions/page.tsx`
- Modify: `apps/platform/src/app/solutions/[slug]/page.tsx`

- [ ] **Step 1:** `solutions/page.tsx` — PageTransition 래퍼. 패딩 px-10 py-7. 세리프 "Solutions" 제목 + 밑줄 악센트 + uppercase 서브타이틀. 기존 검색/필터 기능 유지.
- [ ] **Step 2:** `solutions/[slug]/page.tsx` — PageTransition 래핑 (Server Component이므로 반환 JSX만 래핑). 패딩 px-10 py-7. 세리프 제목. 페이딩 구분선. 기존 launch 흐름 유지.
- [ ] **Step 3:** `pnpm turbo build --filter=@nexus/platform && pnpm turbo lint --filter=@nexus/platform`
- [ ] **Step 4:** 커밋 — `style(platform): Solutions 카탈로그/디테일 Refined Minimal 적용`

---

## Phase 7: 나머지 페이지 + 다크 모드 폴리시

**Agent:** frontend-developer
**의존:** Phase 5 + 6 완료

### Task 13: Settings + 404 + 다크 모드 미세 조정

**Files:**

- Modify: `apps/platform/src/app/settings/page.tsx`
- Modify: `apps/platform/src/app/not-found.tsx`
- Possibly: `apps/platform/src/app/globals.css` (OKLCH 미세 조정)
- Possibly: hub 컴포넌트 (dark 전용 Tailwind 클래스)

- [ ] **Step 1:** `settings/page.tsx` — PageTransition + 세리프 제목 + 밑줄 악센트. 세련된 empty state (큰 Settings 아이콘, 세리프 "준비 중" 메시지, 설명, 페이딩 dashed border).
- [ ] **Step 2:** `not-found.tsx` — PageTransition. 세리프 "404". 밑줄 악센트. 정제된 텍스트 + 홈 버튼.
- [ ] **Step 3:** 다크 모드 시각 확인 (모든 페이지):
  - 노드 글래스모피즘 (`dark:bg-white/5 dark:border-white/10`)
  - Glow 이펙트 가시성
  - 텍스트 대비
  - 파티클 가시성
  - 필요 시 OKLCH 값 미세 조정
- [ ] **Step 4:** `pnpm build && pnpm lint` 전체 통과
- [ ] **Step 5:** 커밋 — `style(platform): Settings/404 리디자인 + 다크 모드 폴리시`

---

## Phase 8: 통합 검증 + 문서

**Agent:** team-lead + code-reviewer

### Task 14: 빌드 + 코드 리뷰

- [ ] **Step 1:** `pnpm build && pnpm lint` 전체 통과 확인. 실패 시 해당 에이전트에 수정 dispatch (최대 2회).
- [ ] **Step 2:** code-reviewer dispatch — 전체 변경 파일 리뷰. 의존 방향, TypeScript strict, 접근성 (키보드 내비게이션, aria-label), 성능 (SVG 애니메이션).
- [ ] **Step 3:** 리뷰 이슈 수정 (critical만, max 2 사이클).

### Task 15: 문서 갱신

- [ ] **Step 1:** `apps/platform/CLAUDE.md` "현재 구현 상태" 섹션 갱신 (셸 구조, 새 컴포넌트 목록, 의존성 변경)
- [ ] **Step 2:** `packages/CLAUDE.md` "@nexus/shell", "@nexus/config" 섹션 갱신
- [ ] **Step 3:** 릴리즈 노트: `apps/platform/docs/release/2026-03-31-ui-redesign.md`
- [ ] **Step 4:** 최종 커밋 + PR

---

## 실행 요약

| Phase                 | Agent                     | Tasks | 의존      | 병렬           |
| --------------------- | ------------------------- | ----- | --------- | -------------- |
| 1: Foundation         | package-dev + team-lead   | 1-2   | 없음      | —              |
| 2: Shell 구조 변경    | package-dev               | 3     | Phase 1   | —              |
| 3: 디자인 토큰        | frontend-dev              | 4-5   | Phase 2   | —              |
| 4: Motion 유틸        | frontend-dev              | 6     | Phase 3   | —              |
| 5: Hub 대시보드       | frontend-dev              | 7-10  | Phase 4   | Phase 6과 병렬 |
| 6: Solutions 리디자인 | frontend-dev              | 11-12 | Phase 4   | Phase 5와 병렬 |
| 7: 나머지 + 다크 모드 | frontend-dev              | 13    | Phase 5+6 | —              |
| 8: 검증 + 문서        | team-lead + code-reviewer | 14-15 | Phase 7   | —              |

## 리스크

1. **React Flow CSS**: `@xyflow/react/dist/style.css` import 순서가 Tailwind v4와 충돌 가능 — globals.css 이후에 import 필요할 수 있음
2. **OKLCH 근사값**: HEX 타겟의 OKLCH 변환 값이 시각적으로 미세하게 다를 수 있음 — 다크 모드 폴리시 단계에서 조정
3. **motion v12 import**: `"motion/react"` 경로 사용 필수 (`"framer-motion"` 아님)
4. **Server Component + Motion**: layout.tsx는 Server Component이므로 AnimatePresence 직접 사용 불가 — 각 페이지의 PageTransition 래퍼로 해결

## Verification

1. `pnpm build && pnpm lint` — 전체 빌드/린트 통과
2. 개발 서버 (`pnpm turbo dev --filter=@nexus/platform`):
   - `/`: 노드 그래프 렌더링, 드래그/줌/패닝, 노드 클릭 → 사이드 패널, 5개 메트릭
   - `/solutions`: 스태거드 카드 진입, 호버 리프트, 필터 layoutAnimation
   - `/solutions/codex`: 페이지 전환 모션, Refined Minimal 스타일
   - `/settings`: 세련된 empty state
   - 라이트/다크 모드 전환: 양쪽 디자인 시스템 일관성
3. Docker: `docker compose -f docker-compose.dev.yml up --build` — Nginx 프록시 환경 정상 동작
