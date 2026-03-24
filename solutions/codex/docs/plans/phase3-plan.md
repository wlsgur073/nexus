# Codex Phase 3 실행 계획

> **목표**: 관리자 기능 + 전체 UX 완성도 + 성능 최적화
> **선행 조건**: Phase 2 완료 (2026-03-24)
> **명세 참조**: `specs/ux/screens-governance.md` §5.12~5.17, `specs/frontend/integration.md` §12 Phase 3

---

## 구현 범위

### A. 관리자 화면 (6개 라우트 + 9개 컴포넌트)

#### 라우트

| #   | 경로                  | 화면명              | 접근 권한                 | 명세 위치                   |
| --- | --------------------- | ------------------- | ------------------------- | --------------------------- |
| 1   | `/admin/layout.tsx`   | Admin 레이아웃 가드 | SYSTEM_ADMIN              | integration.md §9           |
| 2   | `/admin/common-codes` | 공통코드 관리       | SYSTEM_ADMIN, STD_MANAGER | screens-governance.md §5.12 |
| 3   | `/admin/users`        | 사용자 관리         | SYSTEM_ADMIN              | screens-governance.md §5.14 |
| 4   | `/admin/permissions`  | 권한 관리           | SYSTEM_ADMIN              | screens-governance.md §5.15 |
| 5   | `/admin/system-codes` | 코드 관리 (시스템)  | SYSTEM_ADMIN              | screens-governance.md §5.16 |
| 6   | `/admin/db-settings`  | DB 연결 설정        | SYSTEM_ADMIN              | screens-governance.md §5.17 |

#### 컴포넌트

| #   | 파일                                 | 설명                                          |
| --- | ------------------------------------ | --------------------------------------------- |
| 1   | `common-codes/code-group-list.tsx`   | 좌측 코드 그룹 목록 + CRUD                    |
| 2   | `common-codes/code-detail-table.tsx` | 우측 코드 상세 테이블 + CRUD                  |
| 3   | `admin/user-table.tsx`               | 사용자 목록 테이블 + 상태 관리                |
| 4   | `admin/user-form-dialog.tsx`         | 사용자 생성/수정 Dialog                       |
| 5   | `admin/permission-tree.tsx`          | 역할별 메뉴 권한 트리 (5개 역할 탭)           |
| 6   | `admin/system-code-table.tsx`        | 시스템 코드 CRUD + 보호 코드 표시             |
| 7   | `admin/db-connection-form.tsx`       | DB 접속정보 Card (호스트, 포트, DB명, 사용자) |
| 8   | `admin/ssh-settings-form.tsx`        | SSH 터널 설정 Card                            |
| 9   | `ui/date-range-picker.tsx`           | 날짜 범위 선택기 (감사 추적 필터 고도화)      |

### B. 패키지 작업

| 패키지                     | 작업                                                       | 담당              |
| -------------------------- | ---------------------------------------------------------- | ----------------- |
| `@nexus/codex-models` api/ | users, permissions, system-codes, settings 모듈 추가 (4개) | package-developer |
| `@nexus/codex-shared`      | request-no.ts 완성, admin 라우트 상수                      | package-developer |

### C. UX 완성도

| #   | 작업                                                   | 영향 범위          | 우선순위 |
| --- | ------------------------------------------------------ | ------------------ | -------- |
| 1   | 모든 화면 Skeleton 로딩 상태 완성                      | 전체 페이지        | 높음     |
| 2   | Error Boundary (app/error.tsx, app/not-found.tsx) 강화 | 전역               | 높음     |
| 3   | 반응형 레이아웃 (모바일) 최종 점검                     | 전체               | 중간     |
| 4   | generateMetadata 동적 타이틀                           | 전체 라우트        | 중간     |
| 5   | 탐색기 테이블 다음 페이지 prefetch                     | /standards         | 중간     |
| 6   | Toast/알림 센터 통합 마무리                            | 뮤테이션 결과 연동 | 중간     |
| 7   | Command Palette 최근 검색 localStorage                 | Command Palette    | 낮음     |
| 8   | 표준용어 신청 폼 고도화 (구성 단어 선택, 도메인 연결)  | /standards/new     | 중간     |
| 9   | 차트 다크모드 테마 연동                                | Recharts 3개       | 낮음     |
| 10  | Codex 솔루션 ThemeToggle UI 추가                       | 헤더               | 낮음     |

---

## Agent Teams 실행 전략

### Step 1: package-developer (순차, 선행)

- codex-models API 4개 모듈 (users, permissions, system-codes, settings)
- codex-shared admin 라우트 상수 + request-no.ts 완성
- `pnpm build && pnpm lint` 통과

### Step 2: frontend-developer (Step 1 완료 후)

- admin/ 레이아웃 + 6개 라우트 + 9개 컴포넌트
- UX 완성도 작업 (Skeleton, Error Boundary, generateMetadata 등)
- `pnpm build && pnpm lint` 통과

### Step 3: code-reviewer

- 품질/보안/접근성/아키텍처 리뷰
- critical 이슈 수정 사이클 (최대 2회)

### Step 4: 완료 작업

- CLAUDE.md "Phase 3 완료" 갱신
- 릴리즈 노트: `docs/release/yyyy-MM-dd-phase3-admin.md`
- 커밋 + PR + main merge

---

## 참조 명세

| 문서                                        | 내용                                                 |
| ------------------------------------------- | ---------------------------------------------------- |
| `specs/ux/screens-governance.md` §5.12~5.17 | 관리자 화면 UX 설계                                  |
| `specs/data/api.md` §5.11                   | System Admin API (15+ 엔드포인트)                    |
| `specs/data/entities.md`                    | User, MenuPermission, SystemCode, DatabaseConnection |
| `specs/data/rules.md`                       | AUTH-001~009 (권한 규칙)                             |
| `specs/frontend/integration.md` §12 Phase 3 | 구현 체크리스트                                      |
| `specs/frontend/components.md`              | admin 컴포넌트 계층 설계                             |
| `specs/frontend/state-data.md`              | 상태 관리 패턴                                       |

---

## 예상 산출물

- 6개 신규 라우트 (admin/\*)
- 9개 신규 컴포넌트
- 4개 API 모듈 (Mock)
- UX 완성도 10개 항목
- Phase 3 완료 시 Codex 프론트엔드 100% (17개 화면 전체)
