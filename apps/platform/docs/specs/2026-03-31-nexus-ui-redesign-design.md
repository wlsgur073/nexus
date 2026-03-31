---
title: Nexus 플랫폼 UI/UX 전면 리디자인 설계 명세
description: Hub-Centric Layout, Refined Minimal 미학, 몰입형 모션 시스템 설계
version: 2.0.0
---

# Nexus 플랫폼 UI/UX 전면 리디자인 설계 명세

> **Status**: Approved (brainstorming)
> **Date**: 2026-03-31
> **Scope**: apps/platform, packages/shell, packages/ui, packages/config

## 1. 개요

### 배경

현재 Nexus 플랫폼은 기능적으로 완성되어 있으나, 시각적 임팩트 부족("밋밋함")과 인터랙션 결핍이 주요 불만. 플랫폼의 "솔루션 간 데이터/기능을 연결하는 허브" 비전이 UI에 반영되지 않고 있음.

### 목표

- Nexus의 "연결체" 정체성을 UI 자체에 녹인 Hub-Centric 대시보드 구현
- Refined Minimal 미학으로 프로페셔널한 시각적 완성도 달성
- 몰입형 모션 시스템으로 인터랙티브 경험 제공

### 미적 방향

- **Light Mode (디폴트)**: Refined Minimal — 화이트 스페이스, 에디토리얼 타이포, 절제된 컬러 (Apple/Stripe 레퍼런스)
- **Dark Mode**: Premium Dark — 은은한 인디고/퍼플 글로우, 글래스모피즘 카드 (Vercel/Linear 레퍼런스)

### 기술 스택 추가

- `@xyflow/react` (React Flow) — 인터랙티브 노드 그래프
- `motion` (구 framer-motion) — UI 애니메이션 전체
- `Newsreader` (Google Fonts) — 디스플레이 세리프 폰트

---

## 2. 레이아웃 구조 & 내비게이션

### 제거 항목

- `Sidebar` 컴포넌트 완전 제거 (`packages/shell/src/sidebar.tsx`)
- `MobileSidebar` (Sheet 기반) 제거 (`packages/shell/src/mobile-sidebar.tsx`)
- `Breadcrumbs` 제거 (`packages/shell/src/breadcrumbs.tsx`) — 페이지가 3개로 단순하므로 불필요
- Header 내 검색 입력 제거 — Solutions 페이지에서 전용 검색 제공

### 새로운 레이아웃

```
<PlatformShell>
  <Header>
    [Logo 좌측] — [Center Nav: Hub | Solutions | Settings 중앙] — [ThemeToggle + UserAvatar 우측]
  </Header>
  <FadingDivider />  <!-- 양쪽 페이딩 그래디언트 구분선 -->
  <main className="flex-1 w-full">
    {children}  <!-- 전체 너비 콘텐츠 -->
  </main>
</PlatformShell>
```

### Header 변경

- 높이: `h-14` → `h-12` (48px, 더 경량)
- 로고: Waypoints 아이콘 + Geist Sans → 슬레이트 그래디언트 아이콘 + **Newsreader** 세리프 "Nexus"
- 내비게이션: 중앙 정렬, 활성 탭에 하단 1.5px 밑줄
- 구분선: `border-b` → `linear-gradient(90deg, transparent, border 15%, border 85%, transparent)`

### 모바일 대응

- 3개 탭(Hub/Solutions/Settings)을 상단 내비에서 그대로 표시 (공간 충분)
- 극소 화면: 드롭다운 메뉴로 폴백

### 영향받는 파일

- `packages/shell/src/platform-shell.tsx` — 대폭 수정 (사이드바 로직 제거)
- `packages/shell/src/header.tsx` — 센터 내비 구조로 재작성
- `packages/shell/src/sidebar.tsx` — 삭제
- `packages/shell/src/mobile-sidebar.tsx` — 삭제
- `packages/shell/src/breadcrumbs.tsx` — 삭제
- `packages/shell/src/index.ts` — export 정리
- `apps/platform/src/app/layout.tsx` — PlatformShell props 변경 반영

---

## 3. Hub 대시보드 (Command Center)

### 페이지 구조

```
<PageTitle>Command Center</PageTitle>      <!-- 세리프 제목 + 밑줄 악센트 + uppercase 서브타이틀 -->
<HubCanvas>                                 <!-- React Flow 노드 그래프 -->
  <NexusHubNode />                          <!-- 중앙 허브 노드 -->
  <SolutionNode />                          <!-- 솔루션별 노드 (6개) -->
  <FlowEdge />                              <!-- 연결 엣지 + 파티클 -->
  <CanvasControls />                        <!-- 줌 +/- 컨트롤 -->
  <Legend />                                <!-- 좌하단 범례 -->
</HubCanvas>
<SolutionDetailPanel />                     <!-- 노드 클릭 시 우측 슬라이드 패널 -->
<SummaryBar>                                <!-- 하단 5개 메트릭 카드 -->
  <MetricCard title="Active Connections" />
  <MetricCard title="Solutions" />
  <MetricCard title="Data Flow" />
  <MetricCard title="System Status" />
  <MetricCard title="Last Activity" />
</SummaryBar>
```

### 연결 데이터 모델

현재 `Solution` 타입에는 연결 정보가 없으므로, 허브 그래프 전용 연결 데이터를 별도 정의한다. 현재 모든 데이터가 Mock이므로 config 레벨에서 정적 정의.

```typescript
// packages/config/src/hub-connections.ts
export type HubConnection = {
  id: string;
  source: string; // solution slug (또는 "nexus-hub")
  target: string; // solution slug (또는 "nexus-hub")
  label?: string; // "Data sync", "Registry" 등
  status: "active" | "pending"; // active = 파티클 애니메이션, pending = dashed 정적
};

export const hubConnections: HubConnection[] = [
  {
    id: "nexus-codex",
    source: "nexus-hub",
    target: "codex",
    label: "Registry",
    status: "active",
  },
  {
    id: "nexus-llm",
    source: "nexus-hub",
    target: "llm-gateway",
    label: "Registry",
    status: "active",
  },
  {
    id: "codex-llm",
    source: "codex",
    target: "llm-gateway",
    label: "Data sync",
    status: "active",
  },
  {
    id: "nexus-ai",
    source: "nexus-hub",
    target: "ai-factory",
    status: "pending",
  },
  {
    id: "nexus-dp",
    source: "nexus-hub",
    target: "data-pipeline",
    status: "pending",
  },
  // ... 나머지 coming-soon 솔루션
];
```

이 데이터는 향후 API 기반으로 전환 가능. 현재는 `@nexus/config`에서 static export.

### 노드 그래프 (React Flow)

- **캔버스 배경**: 도트 그리드 (`radial-gradient` 20px 간격, opacity 0.35)
- **중앙 허브 노드**: 64px 원형, 로고 아이콘 + "NEXUS" 텍스트, 8px 반투명 링
- **솔루션 노드**: 커스텀 React Flow 노드
  - Active: 흰 배경, 컬러 보더 (indigo), 아이콘 + 이름 + 카테고리 + 녹색 상태 도트
  - Beta: 흰 배경, 그린 보더, 노란 상태 도트
  - Coming-soon: 회색 배경, dashed 보더, 반투명(opacity 0.6), 그레이스케일 아이콘
- **엣지**: 커스텀 React Flow 엣지
  - Active 연결: 실선 2px + 컬러 파티클 (SVG animateMotion 또는 Motion 기반)
  - Coming-soon 연결: dashed 1px, 파티클 없음
  - 크로스 솔루션 연결: 가는 dashed, 반투명 파티클
- **줌 컨트롤**: 우하단 +/- 버튼 (React Flow MiniMap/Controls 커스텀)
- **범례**: 좌하단, Active 도트 + Beta 도트 + Coming Soon dashed

### 노드 인터랙션

1. **클릭** → 우측 `SolutionDetailPanel` 슬라이드인 (250ms easeOut). 패널에 솔루션 정보, 연결 목록, "솔루션 열기" 버튼 표시. Active/Beta만 클릭 가능.
2. **드래그** → React Flow 내장 드래그. 노드 위치를 `localStorage`에 저장/복원.
3. **줌/패닝** → 마우스 휠 줌, 빈 캔버스 드래그 패닝. React Flow 내장 기능.
4. **호버** → 해당 노드 + 연결 엣지 하이라이트, 나머지 디밍 (opacity 감소). 노드에 글로우 링 펄스.

### 하단 요약 바 (5개 메트릭 카드)

| 카드               | 값                          | 비고                |
| ------------------ | --------------------------- | ------------------- |
| Active Connections | 숫자 (세리프)               | 활성 엣지 수        |
| Solutions          | "2 / 6" (세리프 + 산세리프) | active+beta / total |
| Data Flow          | "12.4K req/day"             | Mock 데이터         |
| System Status      | "Operational" + 녹색 도트   | Mock 상태           |
| Last Activity      | "2m ago"                    | Mock 타임스탬프     |

### 영향받는 파일

- `apps/platform/src/app/page.tsx` — 전면 재작성
- `apps/platform/src/components/hub/` — 새 디렉토리
  - `hub-canvas.tsx` — React Flow 래퍼
  - `nexus-hub-node.tsx` — 중앙 허브 커스텀 노드
  - `solution-node.tsx` — 솔루션 커스텀 노드
  - `flow-edge.tsx` — 커스텀 엣지 (파티클 포함)
  - `solution-detail-panel.tsx` — 우측 슬라이드 패널
  - `summary-bar.tsx` — 하단 메트릭 카드 바
  - `metric-card.tsx` — 개별 메트릭 카드

---

## 4. Solutions 카탈로그 & 디테일

### 카탈로그 페이지 (`/solutions`)

- **제목**: 세리프 "Solutions" + 밑줄 악센트 바 + 우측 검색 입력
- **카테고리 필터**: pill 형태 라운드 탭 (`rounded-full`). 선택 시 슬레이트900 배경, 미선택 시 오프화이트+보더
- **카드 그리드**: `grid-cols-3` 유지, 간격 14px
- **카드 디자인**:
  - 40px 아이콘 (그래디언트 배경, 라운드 12px)
  - 제목 (14px, 600 weight) + 카테고리 (10px uppercase) + 설명 (12px)
  - Active: 우상단 녹색 도트, Coming-soon: dashed 보더 + 반투명 + "Coming Soon" 뱃지
  - 호버 시 하단에 그래디언트 악센트 바 페이드인
- **카드 인터랙션**:
  - Hover: translateY(-2px) + shadow 증가 + 악센트 바 페이드인 (200ms)
  - Click: Active/Beta → 디테일 페이지 이동 (Motion 페이지 전환). Coming-soon → 비활성
  - Entrance: 스태거드 페이드-업 (50ms 간격, 400ms duration)
  - 필터 변경: Motion `layoutAnimation`으로 카드 재배치 (300ms)

### 디테일 페이지 (`/solutions/[slug]`)

- 기존 구조를 유지하되 Refined Minimal 스타일링 적용
- 세리프 제목, 더 넓은 여백, 페이딩 구분선
- Motion 페이지 전환 효과 추가
- "솔루션 열기" 버튼 → 기존 Launch Splash 흐름 유지

### 영향받는 파일

- `apps/platform/src/app/solutions/page.tsx` — 스타일 재작성
- `apps/platform/src/components/solutions/solution-card.tsx` — 카드 재디자인
- `apps/platform/src/components/solutions/solution-grid.tsx` — Motion 래퍼 추가
- `apps/platform/src/components/solutions/category-filter.tsx` — pill 스타일로 변경
- `apps/platform/src/app/solutions/[slug]/page.tsx` — Refined Minimal 스타일 적용

---

## 5. 비주얼 디자인 시스템

### 타이포그래피 — 세리프/산세리프 듀얼 시스템

| 용도               | 폰트               | 스타일                                  |
| ------------------ | ------------------ | --------------------------------------- |
| Display 제목       | Newsreader (serif) | 22-28px, weight 400, tracking -0.02em   |
| 로고               | Newsreader (serif) | 15px, weight 500, tracking -0.03em      |
| 숫자 메트릭        | Newsreader (serif) | 18-26px, weight 400, tracking -0.02em   |
| Label / 서브타이틀 | Geist Sans         | 9-10px, uppercase, tracking 0.06-0.08em |
| Body 본문          | Geist Sans         | 12-14px, weight 400, normal tracking    |
| UI / 버튼          | Geist Sans         | 11-12px, weight 500, tracking -0.01em   |

**구현**: `apps/platform/src/app/layout.tsx`에 Newsreader 폰트 추가. CSS 변수 `--font-display`로 매핑.

### 컬러 시스템

#### Light Mode (Refined Minimal)

```
Background:
  --background:       #ffffff    (Base)
  --surface:          #fafbfd    (Surface — 카드, 캔버스)
  --canvas:           #f5f7fa    (Canvas — 노드 그래프 배경)
  --border:           #f0f1f5    (Border)

Text:
  --foreground:       #0f172a    (Primary — slate-900)
  --text-secondary:   #475569    (Secondary — slate-600)
  --text-muted:       #94a3b8    (Muted — slate-400)
  --text-disabled:    #cbd5e1    (Disabled — slate-300)

Accent:
  --cta:              #0f172a    (CTA 버튼 — slate-900)
  --node-active:      #eef2ff → #e0e7ff  (노드 배경 그래디언트)
  --node-border:      #c7d2fe    (Indigo-200)
  --status-ok:        #22c55e    (Green-500)
  --status-beta:      #eab308    (Yellow-500)
```

#### Dark Mode (Premium Dark)

```
Background:
  --background:       #0a0a12    (Base — 깊은 다크 블루-블랙)
  --surface:          #12121e    (Surface)
  --canvas:           #1a1a2e    (Canvas)
  --border:           #252540    (Border)

Text:
  --foreground:       #e2e8f0    (Primary)
  --text-secondary:   #94a3b8    (Secondary)
  --text-muted:       #64748b    (Muted)
  --text-disabled:    #334155    (Disabled)

Glow & Accent:
  --glow-indigo:      rgba(99,102,241,0.2) → rgba(168,85,247,0.15)  (글로우 그래디언트)
  --glass-card-bg:    rgba(255,255,255,0.06)  (글래스모피즘)
  --glass-card-border: rgba(255,255,255,0.1)
  --cta:              linear-gradient(135deg, #e2e8f0, #cbd5e1)  (CTA — 라이트 그래디언트)
  --status-ok:        #22c55e + box-shadow glow
  --status-beta:      #eab308 + box-shadow glow
```

### Spacing & Radius 변경

- 콘텐츠 패딩: `p-6` → `px-10 py-7`
- 섹션 간격: `mb-8` → `mb-10`
- 카드 내부: `p-4` → `p-5`
- 기본 radius: `0.625rem` → `0.75rem` (12px)
- 카드: `rounded-xl` → `rounded-2xl` (14px)
- 노드 그래프 캔버스: `rounded-2xl` (16px)
- 카테고리 pill: `rounded-full`

### 시그니처 디테일 패턴

1. **세리프 제목 + 밑줄 악센트**: 제목 아래 24-32px 너비의 1px 짧은 줄
2. **페이딩 구분선**: `linear-gradient(90deg, transparent, border 15%, border 85%, transparent)`
3. **글로우 도트 상태 인디케이터**: 6px 원 + `box-shadow: 0 0 6px rgba(color, 0.4)`

### 영향받는 파일

- `apps/platform/src/app/globals.css` — 컬러 변수 전면 재정의
- `apps/platform/src/app/layout.tsx` — Newsreader 폰트 추가
- `packages/ui/src/` — 기존 컴포넌트 스타일 미세 조정 (radius, spacing)

---

## 6. 애니메이션 & 인터랙션 시스템

### 3계층 구조

| Layer                  | 역할           | Duration            | Easing              | 구현                          |
| ---------------------- | -------------- | ------------------- | ------------------- | ----------------------------- |
| L1 — Page Transition   | 페이지 간 전환 | 300ms               | easeOut             | `AnimatePresence` mode="wait" |
| L2 — Element Entrance  | 요소 순차 등장 | 400ms, stagger 50ms | [0.25,0.1,0.25,1]   | `staggerChildren`             |
| L3 — Micro-interaction | 즉각 피드백    | 100-200ms           | easeOut / easeInOut | `whileHover`, `whileTap`      |

### 페이지 전환 (L1)

- 진입: `opacity: 0→1, y: 12→0` (300ms easeOut)
- 퇴장: `opacity: 1→0, y: 0→-8` (300ms easeOut)
- `AnimatePresence` mode="wait" — 퇴장 완료 후 진입 시작
- `apps/platform/src/app/layout.tsx`에 `<AnimatePresence>` 래퍼 추가

### 스태거드 진입 (L2)

- 카드, 메트릭 등 리스트 요소에 적용
- 부모: `staggerChildren: 0.05` (50ms 간격)
- 자식: `opacity: 0→1, y: 12→0` (400ms, cubic-bezier [0.25, 0.1, 0.25, 1])
- 필터 변경 시: `layout` prop으로 자동 레이아웃 애니메이션 (300ms easeInOut)

### 마이크로인터랙션 (L3)

- **카드 호버**: `whileHover={{ y: -2 }}` + CSS shadow 증가 + 악센트 바 opacity 0→1
- **버튼 프레스**: `whileTap={{ scale: 0.98 }}` (100ms)
- **내비 탭**: 활성 탭 밑줄이 `layoutId`로 슬라이딩 이동

### Hub 전용 애니메이션

1. **엣지 플로우 파티클**: SVG `<animateMotion>` 기반, 2-3초 주기 무한 반복. 엣지마다 고유 색상+속도. CSS가 아닌 SVG 네이티브 애니메이션 사용 (성능).
2. **노드 호버**: 글로우 링 펄스 (`box-shadow` 0→6px, 2초 주기) + 관련 엣지 하이라이트 + 나머지 디밍
3. **사이드 패널**: `x: "100%"→0` 슬라이드인 (250ms easeOut). 캔버스가 `layout` prop으로 자연스럽게 리사이즈
4. **초기 로딩 시퀀스** (총 ~1.2초):
   - ① 캔버스 페이드인 (0-200ms)
   - ② 중앙 허브 노드 scale 0.8→1 + opacity (200-400ms)
   - ③ 엣지 draw-in (400-700ms)
   - ④ 솔루션 노드 스태거드 등장 (700-1000ms)
   - ⑤ 파티클 시작 (1000-1200ms)

### 영향받는 파일

- `apps/platform/src/app/layout.tsx` — AnimatePresence 래퍼
- `apps/platform/src/components/motion/` — 새 디렉토리
  - `page-transition.tsx` — 페이지 전환 래퍼 컴포넌트
  - `stagger-container.tsx` — 스태거드 진입 래퍼
  - `animated-card.tsx` — 호버/프레스 인터랙션 카드

---

## 7. Settings 페이지

현재 stub 상태. 이번 리디자인에서 Refined Minimal 스타일만 적용하고, 기능 구현은 별도 작업.

- 세리프 제목 + 밑줄 악센트
- "Coming Soon" 메시지를 더 세련된 empty state로 교체 (아이콘 + 설명 + 페이딩 보더)
- 테마 설정, 프로필 설정 등 향후 섹션 플레이스홀더

---

## 8. 새 의존성

| 패키지          | 버전 | 용도                   | 설치 위치                | 번들 영향      |
| --------------- | ---- | ---------------------- | ------------------------ | -------------- |
| `@xyflow/react` | ^12  | 인터랙티브 노드 그래프 | `apps/platform`          | ~150KB gzipped |
| `motion`        | ^12  | UI 애니메이션 전체     | `apps/platform`          | ~100KB gzipped |
| `Newsreader`    | -    | 디스플레이 세리프 폰트 | Google Fonts (next/font) | ~15KB          |

---

## 9. 변경 요약

### 삭제 파일

- `packages/shell/src/sidebar.tsx`
- `packages/shell/src/mobile-sidebar.tsx`
- `packages/shell/src/breadcrumbs.tsx`

### 대폭 수정 파일

- `packages/shell/src/platform-shell.tsx`
- `packages/shell/src/header.tsx`
- `packages/shell/src/index.ts`
- `apps/platform/src/app/layout.tsx`
- `apps/platform/src/app/globals.css`
- `apps/platform/src/app/page.tsx`
- `apps/platform/src/app/solutions/page.tsx`
- `apps/platform/src/app/settings/page.tsx`

### 신규 파일

- `apps/platform/src/components/hub/` (7개 컴포넌트)
- `apps/platform/src/components/motion/` (3개 유틸 컴포넌트)

### 스타일 수정 파일

- `apps/platform/src/components/solutions/solution-card.tsx`
- `apps/platform/src/components/solutions/solution-grid.tsx`
- `apps/platform/src/components/solutions/category-filter.tsx`
- `apps/platform/src/app/solutions/[slug]/page.tsx`
- `apps/platform/src/app/not-found.tsx`

---

## 10. 검증 방법

1. `pnpm build && pnpm lint` — 전체 빌드 및 린트 통과
2. `pnpm turbo dev --filter=@nexus/platform` — 개발 서버 실행 후:
   - `/` (Hub 대시보드): 노드 그래프 렌더링, 드래그/줌/패닝 동작, 노드 클릭 → 사이드 패널
   - `/solutions` (카탈로그): 카드 스태거드 진입, 호버 리프트, 필터 레이아웃 애니메이션
   - `/solutions/codex` (디테일): Refined Minimal 스타일 적용, 페이지 전환 모션
   - `/settings`: 세련된 empty state
   - 라이트/다크 모드 전환: 양쪽 모두 디자인 시스템 일관성 확인
3. Docker 확인: `docker compose -f docker-compose.dev.yml up --build` — Nginx 프록시 환경에서 정상 동작
