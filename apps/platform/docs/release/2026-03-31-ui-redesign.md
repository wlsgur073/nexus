---
version: 2.0.0
summary: Nexus 플랫폼 UI/UX 전면 리디자인 — Hub-Centric Layout + Refined Minimal + 몰입형 모션
---

## 변경 사항

### 레이아웃 구조 전환

- Sidebar + Header 구조 → 미니멀 상단 센터 내비 (Hub / Solutions / Settings)
- Sidebar, MobileSidebar, Breadcrumbs 삭제
- PlatformShell Server Component화, 페이딩 그래디언트 구분선

### Hub 대시보드 (Command Center)

- React Flow 기반 인터랙티브 노드 그래프 (솔루션 간 연결 시각화)
- 커스텀 노드 (NexusHub 중앙 노드, Solution 노드 3가지 상태)
- SVG 파티클 애니메이션 엣지 (활성 연결에 흐르는 파티클)
- 노드 드래그/줌/패닝, 호버 디밍, 클릭 → 우측 사이드 패널
- 하단 5개 메트릭 카드 바 (Active Connections, Solutions, Data Flow, System Status, Last Activity)

### 디자인 시스템

- Refined Minimal (Light Mode, 디폴트): 화이트 스페이스, 에디토리얼 타이포, 절제된 컬러
- Premium Dark (Dark Mode): 깊은 다크 블루-블랙, 인디고/퍼플 글로우
- Newsreader + Geist Sans 듀얼 타이포그래피 시스템
- OKLCH 컬러 전면 교체 (--surface, --canvas, --text-secondary/muted/disabled 신규)
- --radius 0.625rem → 0.75rem

### 애니메이션 시스템

- Motion 기반 3계층: L1 페이지 전환 (300ms), L2 스태거드 진입 (50ms 간격), L3 마이크로인터랙션 (호버/프레스)
- 재사용 래퍼: PageTransition, StaggerContainer/StaggerItem, AnimatedCard

### Solutions 페이지

- 카테고리 필터 pill 스타일 (rounded-full)
- 솔루션 카드 리디자인 (glow 도트, 호버 악센트 바, AnimatedCard)
- 스태거드 카드 진입, 세리프 제목 + 밑줄 악센트

### 기타

- Settings: 세련된 empty state (플레이스홀더 섹션 카드)
- 404: 세리프 "404" + Refined Minimal 스타일

## 영향 범위

- `packages/shell` — PlatformShell, Header 재작성, Sidebar/MobileSidebar/Breadcrumbs 삭제
- `packages/config` — HubConnection 타입 + hubConnections 데이터 추가
- `apps/platform` — 전체 페이지 + 컴포넌트 리디자인 (15개 파일 신규/수정)

## 새 의존성

- `@xyflow/react` ^12.10.2
- `motion` ^12.38.0
- `Newsreader` (Google Fonts, next/font)
