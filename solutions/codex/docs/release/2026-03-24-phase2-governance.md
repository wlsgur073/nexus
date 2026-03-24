---
version: 0.2.0
summary: Phase 2 — 거버넌스/검증/감사/공통코드 화면 + Command Palette + 알림 센터 + AI Butler
---

## 변경 사항

### 신규 화면 (5개 라우트 + 1개 동적 라우트)

- **거버넌스 포털** (`/governance`) — 준수율 게이지(SVG), KPI 카드 4종, 월별 표준화 추이 차트(Recharts), 부서별 랭킹, 미준수 Top 10 테이블, PDF 보고서 다운로드
- **검증 대시보드** (`/validations`) — Stat 카드 4종(총 위반, 해결률, 마지막 실행일, 심각도별), 위반 추이 차트(Recharts), 규칙 요약 테이블, 실행 이력 테이블, 전체 검증 실행 버튼
- **검증 상세** (`/validations/[executionId]`) — 특정 실행의 위반 목록, 체크박스 선택 + 일괄 시정 기능, Tabs 기반 규칙별 분류
- **감사 추적** (`/audit`) — 고급 필터 4종(유형/작업/키워드/처리자), 이력 테이블(페이지네이션), 행 클릭 시 확장형 타임라인 패널(상태 전이 시각화)
- **공통코드 조회** (`/common-codes`) — 좌우 분할 레이아웃(그룹 목록 + 코드 상세), 그룹 내 코드 목록, 통합 검색

### 크로스컷팅 기능

- **Command Palette** (Ctrl+K / ⌘+K) — @nexus/ui Command 컴포넌트 기반, 빠른 이동(7개 메뉴) + 빠른 액션(3개), 키보드 내비게이션
- **Notification Center** — 헤더 벨 아이콘 + 미읽음 Badge(빨강 배경 흰색 텍스트), Popover 알림 목록, 읽음/전체읽음/삭제 처리
- **SSE 실시간 알림** — EventSource 기반 구독, `NEXT_PUBLIC_ENABLE_SSE=true` 환경 변수로 조건부 활성화 (mock 환경에서 무한 재시도 방지)
- **AI Butler Provider** — AI 추천 컨텍스트 관리, useAIButler() 훅

### 기존 화면 개선

- **표준 탐색기** — Select 드롭박스 한국어 라벨 적용 (영문 value 유지 + 한국어 표시 텍스트)
- **신규 표준 신청** — 표준도메인 폼(도메인명, 도메인유형, 데이터타입, 데이터길이, 정의), 표준용어 폼(용어명, 인포타입, 정의) 추가
- **승인 워크벤치** — Select 드롭박스 한국어 라벨 적용
- **Codex 헤더** — 로고 클릭 시 대시보드 이동 링크 추가
- **사이드바** — Phase 2 메뉴 항목 추가 (거버넌스 포털, 감사 추적, 검증 대시보드, 공통코드 조회), 역할별 접근 권한 적용
- **사이드바 알림 배지** — 가독성 개선 (text-white)

### 패키지 확장

- **@nexus/ui** — Command, Popover, Switch, Progress, InputGroup 5개 컴포넌트 추가 (cmdk 의존성 포함)
- **@nexus/codex-models** — governance(6), validations(7), audit(2), notifications(6), common-codes(7) API 모듈 5개 추가 (총 28 엔드포인트, Mock 데이터)
- **@nexus/codex-models** — ViolationListParams에 executionId 필드 추가
- **@nexus/codex-shared** — audit, commonCodes 쿼리 키 네임스페이스 추가
- **@nexus/codex-web** — recharts ^3.8.0 의존성 추가

### 인프라 / 설정

- **next.config.ts** — 루트 `/` → `/solutions/codex` 리다이렉트 추가 (basePath 외부 요청 처리)
- **layout.tsx** — NotificationProvider, AIButlerProvider 추가 (Provider 중첩 순서 적용)
- **codex-layout.tsx** — CommandPalette dynamic import (Client Component에서 로드)

### 품질 개선

- Phase 2 전체 페이지에 **TanStack Query** (`useQuery`) 패턴 적용 — Phase 1과의 아키텍처 일관성 유지
- 아이콘 버튼 **접근성 레이블** (`sr-only`) 3곳 추가 (읽음 처리, 삭제, 필터 초기화)
- Recharts 차트 컴포넌트 **dynamic import** (`ssr: false`) 적용 — ComplianceGauge, GovernanceTrendChart, ViolationTrendChart
- 차트 색상 **CSS 변수 → hex 직접 색상** 변환 — SVG fill 속성에서 CSS 변수 미해석 문제 해결
- Select 컴포넌트 **한국어 라벨 패턴** — 영문 value 유지 + label 맵으로 한국어 표시 (5개 컴포넌트 적용)
- **CommandDialog 내 Command 래퍼** 추가 — cmdk 라이브러리 컨텍스트 오류 해결
- **PopoverTrigger nativeButton** 경고 수정 — Button render 시 nativeButton 제거
- **PDF 다운로드** — 유효한 PDF 1.4 구조 반환 (깨진 파일 문제 해결)
- **공통코드 mock 데이터** — codeCount 불일치 수정 + 누락 그룹(신청유형, 대상유형, 부서코드) 코드 추가
- **Fragment key** 수정 (audit-table.tsx) — React DOM 재조정 오류 방지

## 영향 범위

| 패키지                    | 변경 유형                                 | 파일 수 |
| ------------------------- | ----------------------------------------- | ------- |
| `packages/ui/`            | 5개 신규 컴포넌트, index.ts, package.json | 7       |
| `solutions/codex/models/` | 5개 API 모듈, 엔티티 보완, index.ts       | 8       |
| `solutions/codex/shared/` | query-keys 확장                           | 1       |
| `solutions/codex/web/`    | 5 라우트, 24 컴포넌트, 10 기존 파일 수정  | 30      |
| 문서                      | CLAUDE.md 2개, 릴리즈 노트 1개            | 3       |
| **합계**                  |                                           | **~49** |

## 알려진 제한 사항

- 표준용어 신청 폼의 "구성 단어 선택" 및 "도메인 연결"은 검색/자동완성 UI가 필요하여 Phase 3에서 고도화 예정
- SSE 실시간 알림은 mock 환경에서 비활성 (NEXT_PUBLIC_ENABLE_SSE=true로 활성화)
- 차트 색상이 고정 hex 값으로 설정되어 다크모드에서도 동일 색상 사용 (테마 연동은 Phase 3)
