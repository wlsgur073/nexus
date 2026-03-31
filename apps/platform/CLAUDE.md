# Platform (@nexus/platform)

Nexus Command Center — 솔루션 포탈 및 런처. 모든 솔루션의 진입점 역할.

## 현재 구현 상태

- **라우트**: `/` (Hub 대시보드), `/solutions` (카탈로그), `/solutions/[slug]` (상세), `/settings` (플레이스홀더), `not-found` (커스텀 404)
- **Hub 대시보드**: React Flow 기반 인터랙티브 노드 그래프 (솔루션 간 연결 시각화, 드래그/줌/패닝, 사이드 패널, 5개 메트릭 카드)
- **컴포넌트**: hub/ (7개: hub-canvas, nexus-hub-node, solution-node, flow-edge, solution-detail-panel, summary-bar, metric-card), motion/ (3개: page-transition, stagger-container, animated-card), solutions/ (5개: solution-card, solution-grid, category-filter, solution-launch-button, solution-splash)
- **레이아웃**: PlatformShell (@nexus/shell) — Center Nav Header + 페이딩 구분선 + Full-width Main (사이드바 없음)
- **디자인 시스템**: Refined Minimal (Light) + Premium Dark (Dark), Newsreader 세리프 + Geist Sans 듀얼 타이포, OKLCH 컬러
- **애니메이션**: Motion 기반 3계층 (페이지 전환, 스태거드 진입, 마이크로인터랙션) + SVG 파티클
- **테마**: ThemeProvider + ThemeToggle 적용 완료 (라이트 디폴트, 다크 지원)
- **포트**: 5000

## 디렉토리 구조

```
├── docs/                        # 플랫폼 문서 (3단 구조)
│ ├── specs/                     # 명세서 (확정된 설계)
│ ├── plans/                     # 실행 계획 (Phase별 task)
│ └── release/                   # 릴리즈 기록 (완료된 결과)
└── src/
  ├── app/
  │ ├── page.tsx                 # Hub 대시보드 (Command Center, React Flow)
  │ ├── layout.tsx               # PlatformShell + Newsreader 폰트
  │ ├── globals.css              # OKLCH 디자인 토큰 (Light + Dark)
  │ ├── not-found.tsx            # 커스텀 404 (Refined Minimal)
  │ ├── launch/
  │ │ └── [slug]/
  │ │   └── page.tsx             # 솔루션 런치 스플래시
  │ ├── solutions/
  │ │ ├── page.tsx               # 솔루션 카탈로그 (스태거드 진입, pill 필터)
  │ │ └── [slug]/
  │ │   ├── layout.tsx           # 솔루션 상세 전용 레이아웃
  │ │   └── page.tsx             # 솔루션 상세 페이지 (Refined Minimal)
  │ └── settings/
  │   └── page.tsx               # 설정 (세련된 empty state)
  └── components/
    ├── hub/                     # Hub 대시보드 컴포넌트 (7개)
    │ ├── hub-canvas.tsx         # React Flow 래퍼 (줌/패닝/호버 디밍)
    │ ├── nexus-hub-node.tsx     # 중앙 허브 커스텀 노드
    │ ├── solution-node.tsx      # 솔루션 커스텀 노드 (3가지 상태)
    │ ├── flow-edge.tsx          # 커스텀 엣지 + SVG 파티클 애니메이션
    │ ├── solution-detail-panel.tsx # 우측 슬라이드 패널 (Motion)
    │ ├── summary-bar.tsx        # 하단 5개 메트릭 카드 바
    │ └── metric-card.tsx        # 개별 메트릭 카드
    ├── motion/                  # 애니메이션 유틸 컴포넌트 (3개)
    │ ├── page-transition.tsx    # 페이지 전환 래퍼 (fade + slide)
    │ ├── stagger-container.tsx  # 스태거드 진입 래퍼 + StaggerItem
    │ └── animated-card.tsx      # 호버 리프트 + 프레스 스케일 카드
    └── solutions/               # 솔루션 관련 컴포넌트 (5개)
      ├── solution-card.tsx      # 솔루션 카드 (AnimatedCard, glow 도트)
      ├── solution-grid.tsx      # 카드 그리드 (StaggerContainer)
      ├── category-filter.tsx    # 카테고리 pill 필터
      ├── solution-launch-button.tsx  # 솔루션 열기 버튼 (Client)
      └── solution-splash.tsx         # 런치 스플래시 화면 (Client)
```

## 문서 관리

`docs/` 디렉토리는 Codex와 동일한 3단 구조를 따른다. 상세 규칙은 루트 `CLAUDE.md` "문서 관리 체계" 참조.

## 아키텍처

- **PlatformShell은 Platform 전용**: 솔루션 앱에서 절대 사용하지 않음. 각 솔루션은 자체 독립 레이아웃을 소유
- **Hub-Centric Layout**: 사이드바 없음. 미니멀 상단 센터 내비 (Hub / Solutions / Settings) + 전체 너비 콘텐츠
- **브랜드**: 플랫폼명 "Nexus", 대시보드 "Command Center"
- **솔루션 카탈로그**: `@nexus/config`의 `solutions` 배열을 읽어 카드/그리드로 렌더링
- **허브 그래프**: `@nexus/config`의 `hubConnections` 배열을 React Flow 노드/엣지로 변환
- **status별 동작**: `active` (진입 가능, 녹색 도트), `beta` (진입 가능, 노란 도트), `coming-soon` (진입 불가, dashed)

## 의존 패키지

- `@nexus/shell` — PlatformShell, Header, ThemeToggle
- `@nexus/ui` — 공유 UI 컴포넌트
- `@nexus/config` — 솔루션 레지스트리, HubConnection, DynamicIcon
- `@nexus/types` — Solution, Category 타입
- `@xyflow/react` — 인터랙티브 노드 그래프
- `motion` — UI 애니메이션 (페이지 전환, 스태거드 진입, 마이크로인터랙션)

## 주의사항

- **Motion import**: `"motion/react"` 경로 사용 (v12). `"framer-motion"` 아님
- **React Flow**: `@xyflow/react/dist/style.css` import 필수. `nodeTypes`/`edgeTypes`는 컴포넌트 외부 정의
- **솔루션 카탈로그 데이터 흐름**: `@nexus/config`의 `solutions` 배열 직접 참조. 새 솔루션 추가 시 자동 반영
- **허브 연결 데이터**: `@nexus/config`의 `hubConnections` 배열. 향후 API 전환 가능
- **`[slug]` 라우트**: `getSolutionBySlug()`로 메타데이터 조회. 미등록 slug → not-found

## 빌드

```bash
pnpm turbo dev --filter=@nexus/platform   # 개발 서버
pnpm turbo build --filter=@nexus/platform  # 빌드
pnpm turbo lint --filter=@nexus/platform   # 린트
```
