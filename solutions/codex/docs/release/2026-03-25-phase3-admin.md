---
version: 0.3.0
summary: Phase 3 — 관리자 화면 6개 + UX 완성도 (Skeleton, Error Boundary, 차트 다크모드)
---

## 변경 사항

### 신규 화면 (5개 admin 라우트 + 1개 admin 레이아웃)

- **공통코드 관리** (`/admin/common-codes`) — 기존 `CommonCodeSearchTable` 리팩토링(`editable` prop), 그룹 CRUD + 코드 CRUD 지원
- **사용자 관리** (`/admin/users`) — 사용자 목록 테이블, 역할 필터, 상태 토글(활성/비활성), 사용자 추가 Dialog (React Hook Form + Zod 검증)
- **권한 관리** (`/admin/permissions`) — 5개 역할 탭, 커스텀 트리 컴포넌트 (@base-ui/react Checkbox + Collapsible), Tri-state 체크박스(전체/부분/미선택), CRUD 4열 권한 매트릭스
- **시스템 코드 관리** (`/admin/system-codes`) — 카테고리 필터, 보호 코드 표시(Lock 아이콘), 비보호 코드만 삭제 가능
- **DB 연결 설정** (`/admin/db-settings`) — DB 접속정보 Card(4종 DB 타입) + SSH 터널 Card(PASSWORD/SSH_KEY 인증), 연결 테스트 기능

### 패키지 확장

- **@nexus/codex-models**: 4개 API 모듈 추가 — `users.ts`(6 함수), `permissions.ts`(3 함수), `system-codes.ts`(6 함수), `settings.ts`(6 함수)
- **@nexus/codex-shared**: `query-keys.ts`에 admin 네임스페이스 4개 추가 (users, permissions, systemCodes, settings)

### UX 완성도

- **Skeleton 로딩**: 12개 라우트에 `loading.tsx` 추가 (4종 패턴: Dashboard, Table, SplitPane, Form)
- **Error Boundary 강화**: 오류 코드 표시, 대시보드 링크, 콘솔 로깅 추가
- **차트 다크모드**: `useChartColors()` 훅 — 3개 Recharts 차트에 JS 기반 테마 색상 적용 (light/dark 별도 hex 팔레트)
- **Command Palette 최근 방문**: localStorage 기반 최근 5건 기록, "최근 방문" 그룹 표시
- **Admin 접근 가드**: middleware `/admin/*` 역할 체크 + Client-side `AdminGuard` 컴포넌트

### 기존 코드 개선

- **CommonCodeSearchTable**: `editable` prop 추가 — 읽기전용(/common-codes)과 CRUD(/admin/common-codes) 모드 분리
- **Admin layout**: Server/Client 분리 — Server Component에서 metadata export, Client Component에서 역할 가드

## 영향 범위

- `@nexus/codex-models` — 4개 API 모듈 추가
- `@nexus/codex-shared` — query-keys 확장
- `@nexus/codex-web` — 5개 admin 라우트, 7개 admin 컴포넌트, 12개 loading.tsx, 차트 3개, error/command-palette/middleware 수정
- 총 40개 파일 변경, +2,899줄
