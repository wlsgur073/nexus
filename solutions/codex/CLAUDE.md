# Codex

데이터 거버넌스 솔루션 — 표준용어·표준도메인·표준단어를 관리하고, 거버넌스 프로세스(신청→승인→반영)를 통해 데이터 품질을 확보한다.

## 빌드

```bash
pnpm turbo dev --filter=@nexus/codex-web    # 개발 서버 (포트 5001)
pnpm turbo build --filter=@nexus/codex-web   # 빌드
pnpm turbo lint --filter=@nexus/codex-web    # 린트
```

## 명세 문서 (경로는 `solutions/codex/docs/` 기준)

### 문서 구조

```
docs/
├── codex-product-spec.md              제품 비전, 핵심 가치, 전체 개요
└── specs/
    ├── ux/                            UX 설계 명세
    │   ├── README.md                  인덱스 + 에이전트 참조 가이드
    │   ├── roles-journeys.md          사용자 역할 5종, 여정 맵 5개
    │   ├── information-architecture.md 메뉴 구조, 사이드바, Breadcrumb, Command Palette
    │   ├── screens-core.md            로그인, 대시보드, 탐색기, 표준 상세 (5.1-5.5)
    │   ├── screens-governance.md      신규신청, 승인, 검증, 감사, 관리자 (5.6-5.17)
    │   └── patterns.md                AI Data Butler UX, 공유 패턴 9종, 접근성
    │
    ├── data/                          데이터 아키텍처 명세
    │   ├── README.md                  인덱스 + 에이전트 참조 가이드
    │   ├── entities.md                19개 엔티티 상세, ER 다이어그램, 관계
    │   ├── api.md                     상태 전이 3종, API 118개 엔드포인트
    │   └── rules.md                   비즈니스 규칙, 확장·인덱스·마이그레이션 전략
    │
    └── frontend/                      프론트엔드 아키텍처 명세
        ├── README.md                  인덱스 + 에이전트 참조 가이드
        ├── foundation.md              기술 스택, 의존성, 패키지 구조 (web/models/shared)
        ├── components.md              라우트 트리, 컴포넌트 계층, AI Butler·인라인 거버넌스
        ├── state-data.md              TanStack Query, nuqs, Context, API 클라이언트, 캐싱
        └── integration.md             인증·권한, 성능, Shell 통합, Phase 1-3, 오류·보안
```

### 에이전트별 문서 참조 매트릭스

각 에이전트가 작업 전에 읽어야 할 파일 목록. README.md를 거치지 않고 필요한 문서에 직접 접근한다.

| 에이전트               | 읽어야 할 문서 (경로: `docs/specs/`)                                                                                                                                                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **package-developer**  | `data/entities.md` (엔티티 타입·enum), `frontend/foundation.md` (패키지 구조), `ux/patterns.md` (Badge 색상)                                                                                                                                                     |
| **frontend-developer** | `ux/screens-core.md` + `ux/screens-governance.md` (화면 명세), `ux/information-architecture.md` (네비게이션), `frontend/components.md` (라우트·컴포넌트), `frontend/state-data.md` (상태 관리), `frontend/integration.md` (인증·Phase), `data/api.md` (API 사양) |
| **backend-developer**  | `data/api.md` (API 엔드포인트·상태 전이), `data/rules.md` (비즈니스 규칙)                                                                                                                                                                                        |
| **code-reviewer**      | `ux/patterns.md` (UX 일관성·접근성), `data/rules.md` (비즈니스 규칙), `frontend/integration.md` (오류·보안)                                                                                                                                                      |
| **test-engineer**      | 테스트 대상에 따라 위 문서 참조                                                                                                                                                                                                                                  |

## 도메인 핵심 개념

- **표준단어** (StandardWord): 가장 작은 단위 (예: "고객", "번호")
- **표준도메인** (StandardDomain): 데이터 유형 그룹 (예: "명칭", "코드", "금액")
- **표준용어** (StandardTerm): 단어 + 도메인 조합 (예: "고객번호" = 고객 + 번호)
- **거버넌스 프로세스**: 신청(Request) → 검토(Review) → 승인/반려 → 원본 반영
- **Draft**: 편집 중인 초안. 자동저장, 30일 만료, 최대 10건

## 사용자 역할

| 역할         | 코드                | 핵심                     |
| ------------ | ------------------- | ------------------------ |
| 시스템관리자 | `SYSTEM_ADMIN`      | 전체 시스템 관리         |
| 검토/승인자  | `REVIEWER_APPROVER` | 신청 건 승인/반려        |
| 표준 관리자  | `STD_MANAGER`       | 데이터 품질 관리         |
| 신청자       | `REQUESTER`         | 표준 신규/변경/삭제 신청 |
| 조회전용     | `READ_ONLY`         | 조회만                   |

## 현재 구현 상태

### Phase 1 (MVP) — 완료 (2026-03-21)

- **models**: 19개 엔티티 타입 + 14개 API 모듈 (Mock 데이터) 구현 완료
  - entities/: base, enums(19종), standard, governance, validation, common-code, system, db-connection
  - api/: auth, dashboard, explorer, standard-words/domains/terms, requests, approvals, inline-governance, drafts, comments, ai
- **shared**: 상수 4개 + 유틸 4개 구현 완료
  - constants/: routes, menu(역할별 접근 매트릭스), status(3종 라벨+색상), query-keys
  - utils/: physical-name, status-color, role-check, request-no
- **web**: Phase 1 화면 전체 구현 완료 (44개 파일)
  - 기반: providers(Query, Auth), hooks(useAuth, useDebounce, useDraftAutosave), lib(api, validators), middleware
  - 컴포넌트: dashboard(5), standards(8), approvals(4), ui(7), layout(3) = 27개
  - 라우트: login, dashboard(역할분기), standards(탐색기+Sheet), standards/new, approvals, error, not-found = 7개
  - 신규 의존성: @tanstack/react-query, react-hook-form, zod, @hookform/resolvers, sonner, nuqs
  - 테마: ThemeProvider(@nexus/ui) 적용 완료 (라이트/다크 모드 지원, ThemeToggle UI는 Phase 2)

### Phase 2 (AI & 협업 + 거버넌스) — 완료 (2026-03-24)

- **models**: 5개 API 모듈 추가 (Mock 데이터)
  - api/: governance, validations, audit, notifications, common-codes
  - ViolationListParams에 executionId 필드 추가
- **shared**: query-keys 확장 (audit, commonCodes 네임스페이스 추가)
- **web**: Phase 2 화면 전체 구현 완료
  - 신규 providers: NotificationProvider(SSE), AIButlerProvider = 2개
  - 신규 layout: command-palette(Ctrl+K), notification-center = 2개
  - 신규 컴포넌트: governance(4), validations(5), audit(3), common-codes(1), standards(2), ui(2), dashboard(1) = 18개
  - 수정: codex-layout, codex-header, codex-sidebar, layout.tsx, use-auth(useRole 확장)
  - 신규 라우트: governance, validations, validations/[executionId], audit, common-codes = 5개
  - 신규 의존성: recharts
  - 데이터 패칭: 전체 페이지 TanStack Query(useQuery) 패턴 적용
  - 접근성: 아이콘 버튼 sr-only 레이블 적용
  - SSE: NEXT_PUBLIC_ENABLE_SSE 환경 변수로 조건부 활성화
- **@nexus/ui**: Command, Popover, Switch, Progress, InputGroup 5개 컴포넌트 추가

### Phase 3 (관리자 기능 + UX 완성도) — 완료 (2026-03-25)

- **models**: 4개 API 모듈 추가 (Mock 데이터)
  - api/: users(6함수), permissions(3함수), system-codes(7함수), settings(6함수)
  - common-codes: updateCommonCode, deleteCommonCode 추가
- **shared**: query-keys 확장 (users, permissions, systemCodes, settings 네임스페이스 추가)
- **web**: Phase 3 관리자 화면 구현 완료
  - 신규 라우트: admin/common-codes, admin/users, admin/permissions, admin/system-codes, admin/db-settings = 5개
  - 신규 컴포넌트: admin(admin-guard, user-table, user-form-dialog, permission-tree, system-code-table, db-connection-form, ssh-settings-form) = 7개
  - 리팩토링: CommonCodeSearchTable editable prop 추가 (읽기전용/CRUD 모드 분리), CRUD Dialog 패턴 적용
  - middleware: /admin/\* 역할 가드 (SYSTEM_ADMIN, STD_MANAGER)
  - AdminGuard: 라우트별 세분화 (STD_MANAGER는 /admin/common-codes만 접근)
  - Skeleton: 12개 라우트 loading.tsx 추가 (4종 패턴: Dashboard, Table, SplitPane, Form)
  - Error Boundary 강화: 오류 코드, 대시보드 링크, 콘솔 로깅
  - 차트 다크모드: useChartColors() 훅 — 3개 Recharts 차트에 JS 테마 색상 적용
  - Command Palette: localStorage 최근 방문 5건 기록
  - 시스템 코드 보호 토글: Switch UI + toggleSystemCodeProtection API
- **@nexus/ui**: SelectContent alignItemWithTrigger 기본값 false 변경

### Phase 4 (프론트엔드 품질 완성) — 완료 (2026-03-27)

- **web**: Phase 4 전체 구현 완료 (신규 화면 없음, 기존 17개 화면 품질 보강)
  - generateMetadata: 루트 layout에 title.template 적용, 13개 라우트에 metadata layout 추가 → 브라우저 탭 동적 타이틀
  - Skeleton: 8개 파일의 "로딩 중..." 텍스트를 Skeleton UI로 교체 (인라인 로딩 일관성)
  - Toast: Phase 1-2 mutation에 toast.success/error 추가 (new-standard-form 3건, approval-action-form, batch-action-dialog)
  - 다크모드: dark: variant 누락 색상 수정 (violation-list, audit-table, user-table, common-code-search-table)
  - Explorer 프리페치: standards/page.tsx를 useTransition → useQuery + prefetchQuery로 전환 (다음 페이지 미리 로드)
  - 표준 용어 폼 강화: WordTagInput 신규 컴포넌트 (debounce 검색 + 태그 선택), 물리명 자동생성 (buildPhysicalName), 도메인유형 Select, 인포타입 6종 Select
  - 권한 트리 키보드: permission-tree.tsx에 Arrow Up/Down/Left/Right + Space 내비게이션, aria-activedescendant, 포커스 링
  - 접근성: pagination.tsx prev/next aria-label, permission-tree expand 버튼 라벨, word-tag-input aria-controls
  - 신규 파일: word-tag-input.tsx (1개), metadata layout.tsx (13개)

### 미구현 (향후 보강)

- 데스크톱 반응형(1024px~1920px+) 점검

## 구현 Phase

| Phase   | 목표                                       | 핵심 화면                                          |
| ------- | ------------------------------------------ | -------------------------------------------------- |
| 1 (MVP) | 표준 검색→신청→승인 워크플로우             | 대시보드, 로그인, 탐색기, 신규신청, 승인워크벤치   |
| 2       | AI Data Butler, 실시간 알림, 거버넌스/검증 | 거버넌스포털, 검증대시보드, 감사추적, 공통코드조회 |
| 3       | 관리자 기능, 성능 최적화                   | admin/\* 전체                                      |
| 4       | 프론트엔드 품질 완성                       | 폼 고도화, 접근성, UX 일관성 (신규 화면 없음)      |

## 구현 순서 (의존성 방향)

```
1. @nexus/ui 신규 컴포넌트 추가
2. @nexus/codex-models 엔티티 타입 + API 클라이언트
3. @nexus/codex-shared 상수 + 유틸
4. @nexus/codex-web 라우트 + 컴포넌트
```

## 문서 관리 체계

| 디렉토리        | 용도        | 설명                                                                                                            |
| --------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| `docs/specs/`   | 명세서      | 확정된 설계 사항을 문서화. UX(`ux/`), 데이터(`data/`), 프론트엔드(`frontend/`) 명세. 변경 시 해당 섹션 업데이트 |
| `docs/plans/`   | 실행 계획   | Phase별 task 리스트와 실행 전략을 보관. 무엇을 할지, 어떤 순서로 진행할지를 정의 (`phase{N}-plan.md`)           |
| `docs/release/` | 릴리즈 기록 | 실제 개발 완료 후 릴리즈한 사항을 문서화. plans의 task를 수행하고 릴리즈된 결과만 기록 (`yyyy-MM-dd-topic.md`)  |

## Claude 워크플로우

- **구현 시작 전**:
  1. `.claude/rules/` 디렉토리의 모든 규칙 문서를 확인하고 따를 것
  2. 위 "에이전트별 문서 참조 매트릭스"에서 담당 에이전트에 해당하는 명세 문서를 모두 읽을 것
  3. 작업 대상 Phase에 해당하는 실행 계획(`docs/plans/`)과 화면 명세(`screens-core.md` 또는 `screens-governance.md`)를 확인할 것
- **구현 완료 시**: 이 파일의 "현재 구현 상태" 섹션을 갱신하고, 릴리즈 노트(`docs/release/`)를 작성할 것

## Codex 기술 스택 (플랫폼 공통 외)

- **서버 상태**: TanStack Query v5
- **폼**: React Hook Form + Zod
- **URL 상태**: nuqs
- **차트**: Recharts
- **Toast**: Sonner
