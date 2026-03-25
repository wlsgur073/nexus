---
version: 0.3.0
summary: Phase 3 — 관리자 화면 5개 + UX 완성도 (Skeleton, Error Boundary, 차트 다크모드)
---

## 변경 사항

### 신규 화면 (5개 admin 라우트 + 1개 admin 레이아웃)

- **공통코드 관리** (`/admin/common-codes`) — 기존 `CommonCodeSearchTable` 리팩토링(`editable` prop), 그룹 CRUD + 코드 CRUD(설명, 사용여부 포함), Dialog 기반 폼, 삭제 확인 Dialog
- **사용자 관리** (`/admin/users`) — 사용자 목록 테이블, 역할 필터(Select), 상태 토글(활성/비활성), 사용자 추가 Dialog (React Hook Form + Zod 검증)
- **권한 관리** (`/admin/permissions`) — 5개 역할 탭(전 역할 Mock 데이터), treegrid 패턴 커스텀 트리 (@base-ui/react Checkbox), Tri-state 체크박스, CRUD 4열 권한 매트릭스, 권한 저장
- **시스템 코드 관리** (`/admin/system-codes`) — 카테고리 필터, 보호 토글(Switch), 비보호 코드 수정/삭제 Dialog, 추가 시 form validation, 보호 코드 수정/삭제 차단
- **DB 연결 설정** (`/admin/db-settings`) — DB 접속정보 Card(4종 DB 타입) + SSH 터널 Card(PASSWORD/SSH_KEY 인증), 연결 테스트

### 패키지 확장

- **@nexus/codex-models**: 4개 API 모듈 추가 — `users.ts`(6함수), `permissions.ts`(3함수), `system-codes.ts`(7함수, 보호 토글 포함), `settings.ts`(6함수). `common-codes.ts`에 updateCommonCode, deleteCommonCode 추가
- **@nexus/codex-shared**: `query-keys.ts`에 admin 네임스페이스 4개 추가 (users, permissions, systemCodes, settings)
- **@nexus/ui**: SelectContent `alignItemWithTrigger` 기본값 `false`로 변경

### UX 완성도

- **Skeleton 로딩**: 12개 라우트에 `loading.tsx` 추가 (4종 패턴: Dashboard, Table, SplitPane, Form)
- **Error Boundary 강화**: 오류 코드 표시, 대시보드 링크, 콘솔 로깅
- **차트 다크모드**: `useChartColors()` 훅 — 3개 Recharts 차트에 JS 기반 테마 색상 적용
- **Command Palette 최근 방문**: localStorage 기반 최근 5건 기록, "최근 방문" 그룹 표시
- **Admin 접근 가드**: middleware `/admin/*` 역할 체크 + Client-side `AdminGuard` 라우트별 세분화

### 코드 리뷰 반영

- permission-tree: useEffect 내 setState → useMemo 파생 패턴 전환 (lint 오류 해결)
- command-palette: RecentItem 별도 타입 분리 (타입 안전성)
- treegrid 접근성: role="treegrid" + aria-level 적용
- middleware 인증 우회 차단: 쿠키 미설정 시 접근 거부
- Select 패턴: SelectValue → `<span>` 직접 렌더링 (base-nova 호환)
- base-ui controlled/uncontrolled 에러 수정 (Select, Switch)
- Mock API 객체 교체 패턴 적용 (TanStack Query 캐시 감지)

## 영향 범위

- `@nexus/ui` — SelectContent 기본값 변경 (전역)
- `@nexus/codex-models` — 4개 API 모듈 추가 + common-codes 2함수 추가
- `@nexus/codex-shared` — query-keys 확장
- `@nexus/codex-web` — 5개 admin 라우트, 7개 admin 컴포넌트, 12개 loading.tsx, 차트 3개, 기타 다수 수정

## 잔여 항목 (향후 보강)

- 반응형 레이아웃 모바일 최종 점검
- generateMetadata 동적 타이틀
- 탐색기 prefetch 최적화
- Toast/알림 센터 통합 마무리
- 표준용어 신청 폼 고도화
- 권한 트리 키보드 내비게이션
