# Codex

데이터 거버넌스 솔루션 — 표준용어·표준도메인·표준단어를 관리하고, 거버넌스 프로세스(신청→승인→반영)를 통해 데이터 품질을 확보한다.

## 빌드

```bash
pnpm turbo dev --filter=@nexus/codex-web    # 개발 서버 (포트 5001)
pnpm turbo build --filter=@nexus/codex-web   # 빌드
pnpm turbo lint --filter=@nexus/codex-web    # 린트
```

## 명세 문서 (경로는 `solutions/codex/` 기준)

| 문서                | 경로                            | 내용                                     |
| ------------------- | ------------------------------- | ---------------------------------------- |
| 제품 스펙           | `docs/codex-product-spec.md`    | 비전, 화면 명세, API, 비즈니스 규칙 전체 |
| UX 설계             | `docs/specs/ux/README.md`       | 역할별 여정, 사이드바 메뉴, 공유 UX 패턴 |
| 데이터 아키텍처     | `docs/specs/data/README.md`     | 19개 엔티티, 118개 API, 비즈니스 규칙    |
| 프론트엔드 아키텍처 | `docs/specs/frontend/README.md` | 컴포넌트 계층, 상태 관리, 구현 순서      |

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

### 미구현 (Phase 2~3)

- Phase 2: 거버넌스 포털, 검증 대시보드/상세, 감사 추적, 공통코드 조회, Command Palette, 알림 센터, AI Data Butler 고도화
- Phase 3: admin/\* (공통코드 관리, 사용자/권한/코드 관리, DB 연결 설정), Skeleton/Error Boundary 완성도, 반응형, prefetch

## 구현 Phase

| Phase   | 목표                                       | 핵심 화면                                          |
| ------- | ------------------------------------------ | -------------------------------------------------- |
| 1 (MVP) | 표준 검색→신청→승인 워크플로우             | 대시보드, 로그인, 탐색기, 신규신청, 승인워크벤치   |
| 2       | AI Data Butler, 실시간 알림, 거버넌스/검증 | 거버넌스포털, 검증대시보드, 감사추적, 공통코드조회 |
| 3       | 관리자 기능, 성능 최적화                   | admin/\* 전체                                      |

## 구현 순서 (의존성 방향)

```
1. @nexus/ui 신규 컴포넌트 추가
2. @nexus/codex-models 엔티티 타입 + API 클라이언트
3. @nexus/codex-shared 상수 + 유틸
4. @nexus/codex-web 라우트 + 컴포넌트
```

## Claude 워크플로우

- **구현 시작 전**: `.claude/rules/` 디렉토리의 모든 규칙 문서를 확인하고 따를 것
- **구현 완료 시**: 이 파일의 "현재 구현 상태" 섹션을 갱신할 것

## Codex 기술 스택 (플랫폼 공통 외)

- **서버 상태**: TanStack Query v5
- **폼**: React Hook Form + Zod
- **URL 상태**: nuqs
- **차트**: Recharts
- **Toast**: Sonner
