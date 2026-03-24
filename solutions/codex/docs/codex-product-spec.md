---
title: "Codex 제품 스펙"
description: "Codex 제품 비전, 핵심 가치, 전체 개요"
version: "1.0"
---

# Codex 제품 스펙

> **버전**: 1.0
> **작성일**: 2026-03-20
> **상태**: Agent Team으로 작성 완료, 리뷰 통과 (93/100)
> **상세 명세**: [`specs/ux/`](specs/ux/README.md) | [`specs/data/`](specs/data/README.md) | [`specs/frontend/`](specs/frontend/README.md)

---

## 1. 제품 비전 & 핵심 가치

### 1.1 Codex란?

Codex는 Nexus 플랫폼 내의 **데이터 거버넌스 솔루션**이다. 조직의 표준용어·표준도메인·표준단어를 관리하고, 거버넌스 프로세스(신청→승인→반영)를 통해 데이터 품질을 확보한다.

### 1.2 기존 문제

- 27개 화면으로 분산된 CRUD 중심 설계 → 사용자가 원하는 정보를 찾기 어려움
- 표준용어/도메인/단어 각각 별도 검색 화면 → 3번 탐색 필요
- 변경 신청을 위해 별도 화면으로 이동 → 맥락 단절
- AI 기능이 독립 페이지로 분리 → 활용도 저하

### 1.3 핵심 비전 (6대 필러)

| #   | 필러                     | 핵심 변화                                               | 영향 범위          |
| --- | ------------------------ | ------------------------------------------------------- | ------------------ |
| 1   | **통합 표준 탐색기**     | 3개 검색 화면 → 1개 통합 탐색기 (탭 + Sheet 상세)       | UX, Frontend       |
| 2   | **인라인 거버넌스**      | 상세에서 바로 편집 → 자동 신청 건 생성                  | UX, Data, Frontend |
| 3   | **AI Data Butler 2.0**   | 별도 페이지 → 모든 맥락에 통합된 Co-pilot               | UX, Data, Frontend |
| 4   | **역할 적응형 대시보드** | 단일 대시보드 → 신청자/승인자별 완전 분리               | UX, Data, Frontend |
| 5   | **초안 & 협업**          | 즉시 제출만 가능 → Draft 시스템 + 인라인 코멘트         | Data, Frontend     |
| 6   | **시스템 전역 UX**       | 개별 화면 UX → Command Palette + 알림 + Toast + Stepper | UX, Frontend       |

### 1.4 화면 통합 결과

**27개 → 17개 화면** (10개 절감)

| 통합 전                                         | 통합 후             | 방법                                 |
| ----------------------------------------------- | ------------------- | ------------------------------------ |
| 표준용어 목록 + 표준도메인 목록 + 표준단어 목록 | 통합 표준 탐색기    | 3개 → 1개 탭 뷰                      |
| 표준용어 상세 + 도메인 상세 + 단어 상세         | 표준 상세 Sheet     | 3개 → 1개 Sheet (URL param으로 분기) |
| 표준용어 신청 + 도메인 신청 + 단어 신청         | 신규 표준 신청      | 3개 → 1개 (유형 선택 드롭다운)       |
| 변경 신청 화면                                  | 인라인 거버넌스     | 별도 화면 → Sheet 내 편집 모드       |
| AI 표준 관리 페이지                             | AI Data Butler 통합 | 독립 페이지 → 각 화면에 분산         |

---

## 2. 사용자 역할 & 여정

> 상세: [`specs/ux/roles-journeys.md`](specs/ux/roles-journeys.md)

### 2.1 역할 정의

| 역할         | 코드                | 핵심 업무                          | 주요 화면                    |
| ------------ | ------------------- | ---------------------------------- | ---------------------------- |
| 시스템관리자 | `SYSTEM_ADMIN`      | 전체 시스템 관리, 사용자/권한 설정 | 관리 메뉴 전체               |
| 검토/승인자  | `REVIEWER_APPROVER` | 신청 건 검토 및 승인/반려          | 승인 워크벤치, 거버넌스 포털 |
| 표준 관리자  | `STD_MANAGER`       | 데이터 품질 관리, 검증 실행        | 거버넌스 포털, 검증 대시보드 |
| 신청자       | `REQUESTER`         | 표준 신규/변경/삭제 신청           | 탐색기, 신규 신청            |
| 조회전용     | `READ_ONLY`         | 표준 데이터 조회만                 | 탐색기, 공통코드 조회        |

### 2.2 핵심 사용자 여정

**신청자: 표준 변경 플로우** (가장 빈번한 시나리오)

```markdown
로그인 → 신청자 대시보드 → 탐색기에서 검색 → 행 클릭 → Sheet 열림 (읽기)
→ [편집] 클릭 → Draft 자동 생성 → 필드 수정 (자동저장) → 변경 미리보기 확인
→ [변경 신청 제출] → 확인 Dialog → Toast: "신청 완료 (REQ-2026-XXXX)"
→ 승인자에게 자동 알림 발송
```

**승인자: 승인 처리 플로우**

```markdown
알림 수신 → 승인 워크벤치 → 대기 건 선택 → 우측 패널에서 변경 비교 확인
→ 코멘트 추가 (선택) → [승인/반려/검토요청] 선택 → 처리 사유 입력
→ Toast: "승인 완료" → 원본 데이터 자동 반영
```

---

## 3. 정보 아키텍처 & 네비게이션

> 상세: [`specs/ux/information-architecture.md`](specs/ux/information-architecture.md)

### 3.1 사이드바 메뉴 구조

```markdown
Codex
├── 대시보드 (/solutions/codex) [모든 역할]
├── 표준 관리
│ ├── 표준 탐색기 (/standards) [모든 역할]
│ ├── 신규 신청 (/standards/new) [신청 권한]
│ └── 공통코드 조회 (/common-codes) [모든 역할]
├── 거버넌스
│ ├── 승인 워크벤치 (/approvals) [승인 권한] + 미읽음 Badge
│ ├── 거버넌스 포털 (/governance) [거버넌스 권한]
│ └── 감사 추적 (/audit) [조회전용 제외]
├── 품질 관리
│ └── 검증 대시보드 (/validations) [모든 역할]
└── 관리 (시스템관리자 + 표준 관리자)
├── 공통코드 관리 (/admin/common-codes) [관리자/표준 관리자]
├── 사용자 관리 (/admin/users)
├── 권한 관리 (/admin/permissions)
├── 코드 관리 (/admin/system-codes)
└── DB 연결 설정 (/admin/db-settings)
```

### 3.2 전역 UX 요소

- **Command Palette** (Ctrl+K): 메뉴 이동, 표준 검색, 빠른 액션
- **알림 센터** (헤더 벨 아이콘): SSE 실시간 알림, 역할별 자동 생성
- **Toast** (우측 하단): success/error/warning/info 4종, Sonner 라이브러리
- **Breadcrumb**: 최대 4단계, Sheet 열림 시 마지막 항목 동적 추가

---

## 4. 화면 명세 (17개 화면)

> 상세: [`specs/ux/screens-core.md`](specs/ux/screens-core.md), [`specs/ux/screens-governance.md`](specs/ux/screens-governance.md)

### 4.1 화면 총괄표

| #   | 화면명                      | 라우트                 | 핵심 기능                                      | 구현 Phase |
| --- | --------------------------- | ---------------------- | ---------------------------------------------- | ---------- |
| 1   | 로그인                      | `/login`               | ID/PW 인증, Split-screen 레이아웃              | Phase 1    |
| 2   | 신청자 대시보드             | `/` (역할 분기)        | 내 신청 현황, KPI 카드, 최근 활동              | Phase 1    |
| 3   | 승인자 대시보드             | `/` (역할 분기)        | 대기 건 수, 처리율, 승인 소요일                | Phase 1    |
| 4   | 통합 표준 탐색기            | `/standards`           | 탭(용어/단어/도메인), 검색, 필터, 페이지네이션 | Phase 1    |
| 5   | 표준 상세 & 인라인 거버넌스 | `?detail={id}` (Sheet) | 읽기/편집/삭제 모드, Draft 자동저장, 변경 비교 | Phase 1    |
| 6   | 신규 표준 신청              | `/standards/new`       | 유형별 동적 폼, AI 추천 패널, Draft 저장       | Phase 1    |
| 7   | 승인 워크벤치               | `/approvals`           | 좌우 분할(목록+상세), 일괄 처리, 코멘트        | Phase 1    |
| 8   | 검증 대시보드               | `/validations`         | Stat 카드, 위반 추이 차트, 실행 이력           | Phase 2    |
| 9   | 검증 상세                   | `/validations/[id]`    | 규칙별 탭, 위반 목록, 일괄 시정                | Phase 2    |
| 10  | 거버넌스 포털               | `/governance`          | 준수율 게이지, 부서 랭킹, 미준수 Top 10        | Phase 2    |
| 11  | 감사 추적                   | `/audit`               | 고급 필터, 이력 테이블, 타임라인 확장          | Phase 2    |
| 12  | 공통코드 관리               | `/admin/common-codes`  | 좌우 분할(그룹+코드), CRUD                     | Phase 3    |
| 13  | 공통코드 조회               | `/common-codes`        | 읽기 전용, 검색                                | Phase 2    |
| 14  | 사용자 관리                 | `/admin/users`         | CRUD, 역할 할당, 상태 관리                     | Phase 3    |
| 15  | 권한 관리                   | `/admin/permissions`   | 역할 탭, 메뉴 권한 트리                        | Phase 3    |
| 16  | 코드 관리 (시스템)          | `/admin/system-codes`  | CRUD, 보호 코드 표시                           | Phase 3    |
| 17  | DB 연결 설정                | `/admin/db-settings`   | 접속정보/SSH/스키마 3개 Card                   | Phase 3    |

### 4.2 주요 화면 레이아웃

#### 통합 표준 탐색기 (화면 4)

```markdown
┌──────────────────────────────────────────────────────────┐
│ [검색바: AI 자동완성 드롭다운] [상태 필터] [도메인 필터] │
├──────────────────────────────────────────────────────────┤
│ [표준용어 탭] [표준단어 탭] [표준도메인 탭] │
├──────────────────────────────────────────────────────────┤
│ │
│ 표준명 물리명 도메인 상태 등록일 │
│ ──────────────────────────────────────────── │
│ 고객번호 CUST_NO 번호 BASELINE 2025-12 │
│ 고객명 CUST_NM 명칭 PENDING 2026-01 ← 클릭 │
│ ... │
│ │
│ [< 1 2 3 4 5 >] 총 1,234건 │
└──────────────────────────────────────────────────────────┘
↓ 행 클릭 시
┌─────────────────────────────────────┐ ← 640px Sheet (우측 슬라이드)
│ 고객명 (표준단어) [편집] [X]│
│─────────────────────────────────────│
│ 한글명: 고객명 │
│ 영문약어: CUST_NM │
│ 도메인유형: 명칭 │
│ 상태: BASELINE │
│ 정의: 고객의 이름을 나타내는 ... │
│ │
│ ★ AI 인사이트 │
│ 연관 용어 3건, 사용 시스템 5개 │
│─────────────────────────────────────│
│ [변경 신청] [삭제 신청] │
└─────────────────────────────────────┘
```

#### 승인 워크벤치 (화면 7)

```markdown
┌───────────────────────┬──────────────────────────────────┐
│ 승인 대기 (12건) │ 신청 상세 │
│ ───────────────── │ │
│ [유형 필터] │ REQ-2026-0042 │
│ │ 표준단어 변경 — 고객명 │
│ ☐ REQ-2026-0042 3일 │ ────────────────── │
│ ☐ REQ-2026-0041 5일 │ 변경 비교: │
│ ☑ REQ-2026-0040 7일 !│ 필드 변경전 변경후 │
│ ... │ 정의 고객 이름 고객의 공식.. │
│ │ │
│ [일괄 승인] │ ★ AI: 명명규칙 적합 (92%) │
│ │ │
│ │ 코멘트 (2) │
│ │ ────────────────── │
│ │ [승인] [반려] [검토요청] │
└───────────────────────┴──────────────────────────────────┘
```

---

## 5. AI Data Butler 통합 명세

> 상세: [`specs/ux/patterns.md`](specs/ux/patterns.md), [`specs/frontend/components.md`](specs/frontend/components.md)

### 5.1 통합 형태 (3가지)

| 형태                 | 트리거                               | 적용 화면                                  |
| -------------------- | ------------------------------------ | ------------------------------------------ |
| **인라인 자동완성**  | 검색/입력 필드에서 300ms 디바운스 후 | 탐색기 검색, 신규 신청 폼, Command Palette |
| **사이드 패널 추천** | 표준명 필드 입력 시                  | 신규 신청 (우측 40%), Sheet 편집 모드      |
| **맥락형 인사이트**  | 페이지 로드 시                       | 대시보드, 승인 워크벤치, 검증/거버넌스     |

### 5.2 AI API 엔드포인트

| API                            | 기능                              | 주요 사용처       |
| ------------------------------ | --------------------------------- | ----------------- |
| `GET /api/ai/suggest`          | 유사 표준 추천 (유사도 점수 포함) | 신규 신청, 탐색기 |
| `POST /api/ai/autocomplete`    | 필드 자동완성 (영문약어, 정의)    | 폼 입력           |
| `POST /api/ai/quality-score`   | 데이터 품질 점수 산출             | 승인 워크벤치     |
| `GET /api/ai/synonyms`         | 유사어/대체 표준 검색             | 삭제 영향도 평가  |
| `POST /api/ai/physical-name`   | 물리명 자동 생성                  | 표준용어 신청     |
| `POST /api/ai/validate-naming` | 명명 규칙 실시간 검증             | 영문약어 입력     |

### 5.3 80% 중복 경고

유사도 80% 이상인 기존 표준이 발견되면 Alert로 경고 표시. 신규 신청 전 기존 표준 확인을 유도하여 중복 등록 방지.

---

## 6. 데이터 모델

> 상세: [`specs/data/entities.md`](specs/data/entities.md)

### 6.1 엔티티 총괄 (19개)

| 구분                | 엔티티                                                                                  | 비고 |
| ------------------- | --------------------------------------------------------------------------------------- | ---- |
| **핵심 도메인** (4) | StandardWord, StandardDomain, StandardTerm, StandardTermWord                            | 기존 |
| **거버넌스** (5)    | Request, RequestChange, DeleteImpact, **Draft** (신규), **Comment** (신규)              | +2   |
| **검증** (2)        | ValidationExecution, ValidationResult                                                   | 기존 |
| **공통코드** (2)    | CommonCodeGroup, CommonCode                                                             | 기존 |
| **시스템** (6)      | User, MenuPermission, SystemCode, **Notification** (신규), AuditLog, DatabaseConnection | +1   |

### 6.2 신규 엔티티 요약

#### Draft (초안)

인라인 편집/신규 신청 시 자동 생성되는 작업 초안.

```typescript
interface Draft extends BaseEntity {
  draftId: number;
  targetType: TargetType; // WORD | DOMAIN | TERM | COMMON_CODE
  targetId: number | null; // 변경 시 원본 ID, 신규 시 null
  requestType: RequestType; // CREATE | UPDATE | DELETE
  status: DraftStatus; // EDITING | READY | SUBMITTED | DISCARDED | EXPIRED
  data: Record<string, unknown>; // 편집 중인 데이터 (JSON)
  authorId: number;
  collaboratorIds: number[];
  version: number;
  autoSavedAt: Date;
  expiresAt: Date; // 30일 후 자동 삭제
}
```

#### Comment (코멘트)

승인 프로세스 및 Draft 협업 시 인라인 코멘트.

```typescript
interface Comment extends BaseEntity {
  commentId: number;
  targetType: "REQUEST" | "DRAFT";
  targetId: number;
  fieldName: string | null; // null이면 전체, 값이면 특정 필드
  content: string;
  authorId: number;
  parentCommentId: number | null; // 스레드 답글
  isResolved: boolean;
  resolvedBy: number | null;
  resolvedAt: Date | null;
}
```

#### Notification (알림)

역할 기반 실시간 알림 (SSE 구독).

```typescript
interface Notification extends BaseEntity {
  notificationId: number;
  recipientId: number; // 수신자 (FK -> USER)
  type: NotificationType; // REQUEST_STATUS_CHANGED | APPROVAL_REQUIRED | ...
  title: string;
  message: string;
  referenceType: string | null; // 참조 대상 유형 (REQUEST, DRAFT, VALIDATION 등)
  referenceId: number | null; // 참조 대상 ID
  isRead: boolean;
  readAt: Date | null;
  priority: NotificationPriority; // HIGH | NORMAL | LOW
}
```

### 6.3 핵심 상태 전이

#### Request (신청) 상태

```markdown
PENDING → REVIEW → APPROVED → (원본 데이터 반영)
→ REJECTED
→ FEEDBACK → (신청자 수정 후 재제출) → PENDING (새 건)
원본은 FEEDBACK_RESOLVED 상태로 전환
PENDING → CANCELLED (신청자 취소)
```

#### Draft (초안) 상태

```markdown
EDITING → READY (초안 저장)
→ SUBMITTED (신청 제출 → Request 자동 생성)
→ DISCARDED (사용자 수동 폐기)
→ EXPIRED (30일 경과 자동 만료)
READY → EDITING (다시 편집)
→ SUBMITTED (제출)
→ DISCARDED (수동 폐기)
→ EXPIRED (자동 만료)
```

---

## 7. API 명세

> 상세: [`specs/data/api.md`](specs/data/api.md)

### 7.1 API 총괄 (118개 엔드포인트)

| 카테고리        | 엔드포인트 수 | 핵심 기능                                |
| --------------- | ------------- | ---------------------------------------- |
| 인증            | 3             | 로그인, 로그아웃, 세션                   |
| 대시보드        | 6             | 역할별 통계, KPI, 최근 활동              |
| 통합 탐색기     | 3             | 검색, 패싯, 자동완성                     |
| 표준 CRUD       | 12            | 단어/도메인/용어 각 4개                  |
| 표준 관계/이력  | 12            | 연관 항목, 변경 이력                     |
| 신청            | 10            | 유형별 생성, 목록, 상세, 취소            |
| 승인            | 7             | 목록, 상세, 변경비교, 처리, 일괄         |
| 인라인 거버넌스 | 4             | 편집 시작, 필드 업데이트, diff, 제출     |
| 초안 & 협업     | 15            | Draft CRUD, 협업자, 코멘트               |
| 검증            | 7             | 요약, 추이, 실행, 위반 목록, 일괄시정    |
| AI Data Butler  | 7             | 추천, 자동완성, 품질점수, 유사어, 물리명 |
| 공통코드        | 10            | 그룹/코드 CRUD, 통합 검색                |
| 시스템 관리     | 8             | 사용자, 코드 CRUD                        |
| 권한            | 2             | 역할별 권한 조회/저장                    |
| 설정            | 8             | DB/SSH 설정, 테스트, 내보내기/가져오기   |
| 알림            | 6             | 목록, 읽음처리, SSE 구독                 |
| 감사            | 2             | 이력 목록, 항목별 타임라인               |
| 거버넌스        | 6             | 준수율, KPI, 추이, 랭킹, PDF             |

### 7.2 인라인 거버넌스 데이터 플로우

가장 혁신적인 API 흐름 — 편집 → 자동 Draft → 자동 Request:

```markdown
1. POST /api/inline-governance/edit
   → Draft(EDITING) 생성, 원본 데이터 스냅샷 포함

2. PATCH /api/inline-governance/{draftId}/field (반복)
   → 필드별 자동저장 (300ms 디바운스 + blur 이벤트)

3. GET /api/inline-governance/{draftId}/diff
   → 변경 전/후 3-column 비교 데이터 반환

4. POST /api/inline-governance/{draftId}/submit
   → Draft: EDITING → SUBMITTED
   → Request 자동 생성 (변경 필드만 RequestChange로 기록)
   → AuditLog 자동 기록
   → Notification 자동 생성 (승인자에게)
```

---

## 8. 공유 UX 패턴

> 상세: [`specs/ux/patterns.md`](specs/ux/patterns.md)

### 8.1 패턴 요약

| 패턴                | 구현                                                | 사용처                       |
| ------------------- | --------------------------------------------------- | ---------------------------- |
| **Toast**           | Sonner, 우측 하단, 4종 (success/error/warning/info) | 모든 뮤테이션 결과           |
| **Stepper**         | 커스텀 컴포넌트, 완료(녹색)/현재(파랑)/미진행(회색) | 삭제 영향도(4단계)           |
| **Sheet**           | @nexus/ui Sheet, 640px 우측 슬라이드                | 표준 상세, 편집, 삭제        |
| **Command Palette** | shadcn/ui Command, Ctrl+K                           | 전역 검색, 빠른 이동, 액션   |
| **알림 센터**       | 헤더 Popover, SSE 실시간                            | 승인요청, 처리결과, 검증완료 |
| **Empty State**     | 커스텀 컴포넌트 (아이콘 + 메시지 + CTA)             | 테이블 빈 결과, 필터 무결과  |
| **Loading**         | Skeleton 컴포넌트, 실제 레이아웃 반영               | 모든 데이터 로드 영역        |
| **Error**           | Alert + 재시도 버튼 (영역 내) / error.tsx (페이지)  | 모든 API 오류                |

### 8.2 Badge 색상 체계

| 색상 | 용도                     |
| ---- | ------------------------ |
| 녹색 | BASELINE, APPROVED, 활성 |
| 노랑 | PENDING, BETA            |
| 빨강 | REJECTED, 위반, 긴급     |
| 파랑 | REVIEW, 진행중           |
| 회색 | CANCELLED, 비활성        |
| 보라 | FEEDBACK                 |

---

## 9. 비즈니스 규칙

> 상세: [`specs/data/rules.md`](specs/data/rules.md)

### 9.1 규칙 요약

| 카테고리        | 규칙 ID      | 주요 규칙                                                                   |
| --------------- | ------------ | --------------------------------------------------------------------------- |
| 표준 관리 (STD) | STD-001~010  | 물리명 자동 생성, 영문약어 대문자, 중복 검사, 상태별 편집 제한              |
| 거버넌스 (GOV)  | GOV-001~010  | 본인 신청 본인 승인 금지, 승인 시 원본 자동 반영, 검토요청 시 Feedback 루프 |
| 검증 (VLD)      | VLD-001~005  | 수동 실행만 허용, 위반 항목 일괄 시정                                       |
| 권한 (AUTH)     | AUTH-001~009 | 역할별 메뉴 접근, 데이터 CRUD 권한, 관리 기능 시스템관리자 전용             |
| 무결성 (INT)    | INT-001~010  | 표준용어-단어 필수 관계, 삭제 시 영향도 필수, Draft 30일 자동 만료          |

### 9.2 핵심 거버넌스 규칙

- **GOV-002**: 본인이 신청한 건은 본인이 승인할 수 없음
- **GOV-005**: 승인/반려/검토요청 시 처리사유 입력 필수
- **GOV-006**: 모든 상태 전환은 AUDIT_LOG에 자동 기록
- **GOV-007**: 검토요청(FEEDBACK) 시 신청자가 수정 후 재제출하면 새 Request 건으로 생성
- **INT-004**: 표준단어 삭제 시 참조하는 표준용어가 있으면 삭제 불가 (영향도 필수 제출)
- **INT-009**: Draft는 최대 10건, 30일 경과 시 자동 EXPIRED

---

## 10. 컴포넌트 설계 & 기술 아키텍처

> 상세: [`specs/frontend/`](specs/frontend/README.md) (foundation, components, state-data, integration)

### 10.1 기술 스택

| 구분       | 기술                                            |
| ---------- | ----------------------------------------------- |
| 프레임워크 | Next.js 16 (App Router, Turbopack)              |
| UI         | React 19, shadcn/ui (base-nova), @base-ui/react |
| 스타일     | Tailwind CSS v4 (@theme inline)                 |
| 서버 상태  | TanStack Query v5                               |
| 폼         | React Hook Form + Zod                           |
| URL 상태   | nuqs                                            |
| 차트       | Recharts                                        |
| Toast      | Sonner                                          |

### 10.2 패키지 구조

```markdown
solutions/codex/
├── web/ # @nexus/codex-web — Next.js 앱 (16 page.tsx + 2 layout.tsx)
│ └── src/
│ ├── app/ # App Router 라우트
│ ├── components/ # 60+ 컴포넌트 (providers, layout, domain, ui)
│ ├── hooks/ # 8개 커스텀 훅
│ ├── lib/ # API 클라이언트, 인증, 유틸
│ └── middleware.ts # 인증 + 역할 가드
│
├── models/ # @nexus/codex-models — 순수 데이터 레이어 (UI 의존 없음)
│ └── src/
│ ├── entities/ # 19개 엔티티 TypeScript 타입 (6파일)
│ └── api/ # 118개 API 클라이언트 함수 (19파일)
│
└── shared/ # @nexus/codex-shared — 내부 공유 유틸
└── src/
├── constants/ # 라우트, 메뉴코드, 상태 레이블, 쿼리키
└── utils/ # 물리명 생성, 상태 색상, 권한 체크
```

### 10.3 컴포넌트 계층

```markdown
Page Layer (Server Component 우선)
│ 데이터 패칭, 레이아웃, URL 파라미터 파싱
│
├── Feature Layer ("use client")
│ 비즈니스 로직, 상호작용, 도메인 훅
│
└── UI Layer (순수 표현)
props만으로 동작, API 호출 없음
```

### 10.4 상태 관리 전략

| 상태 유형 | 관리 방법                         | 예시                                         |
| --------- | --------------------------------- | -------------------------------------------- |
| 서버 상태 | TanStack Query (staleTime별 캐시) | 탐색기 목록, 대시보드 통계                   |
| URL 상태  | nuqs (searchParams 동기화)        | 탭, 필터, 페이지네이션, Sheet ID             |
| 전역 상태 | React Context (4개 Provider)      | Auth, Notification, AIButler, CommandPalette |
| 폼 상태   | React Hook Form + Zod             | 신규 신청, 승인 처리                         |
| 로컬 상태 | useState                          | 선택 ID, 모드 전환                           |

### 10.5 @nexus/ui 신규 필요 컴포넌트 (13개)

Phase 1: Tabs, Select, Textarea, Dialog, Alert, Checkbox, Table, Label, Skeleton
Phase 2: Command, Popover, Switch, Progress

모두 `pnpm dlx shadcn@latest add <component>` → `packages/ui/src/index.ts` re-export.

---

## 11. 구현 단계 (Phase 1~3)

> 상세: [`specs/frontend/integration.md`](specs/frontend/integration.md)

### Phase 1: 핵심 거버넌스 (MVP)

**목표**: 표준 검색 → 신청 → 승인 핵심 워크플로우 완성

| 항목           | 수량                                                                           |
| -------------- | ------------------------------------------------------------------------------ |
| 라우트         | 5개 (대시보드, 로그인, 탐색기, 신규신청, 승인워크벤치)                         |
| 컴포넌트       | 23개                                                                           |
| @nexus/ui 추가 | 9개 (Tabs, Select, Textarea, Dialog, Alert, Checkbox, Table, Label, Skeleton)  |
| 신규 의존성    | @tanstack/react-query, react-hook-form, zod, @hookform/resolvers, sonner, nuqs |

### Phase 2: AI & 협업 + 거버넌스

**목표**: AI Data Butler, 실시간 알림, Command Palette, 거버넌스/검증/감사 화면

| 항목           | 수량                                                           |
| -------------- | -------------------------------------------------------------- |
| 라우트         | 5개 (거버넌스, 검증대시보드, 검증상세, 감사추적, 공통코드조회) |
| 컴포넌트       | 25+                                                            |
| @nexus/ui 추가 | 4개 (Command, Popover, Switch, Progress)                       |
| 신규 의존성    | recharts                                                       |

### Phase 3: 관리자 기능 & 완성도

**목표**: 시스템 관리, 전체 UX 완성, 성능 최적화

| 항목     | 수량                                                   |
| -------- | ------------------------------------------------------ |
| 라우트   | 6개 (admin/\* 전체)                                    |
| 컴포넌트 | 8+                                                     |
| 완성도   | Skeleton, Error Boundary, 반응형, prefetch, 메타데이터 |

### 의존성 방향에 따른 구현 순서

```markdown
1. @nexus/ui 신규 컴포넌트 추가 (Phase별)
2. @nexus/codex-models 엔티티 타입 + API 클라이언트
3. @nexus/codex-shared 상수 + 유틸
4. @nexus/codex-web 라우트 + 컴포넌트
5. @nexus/shell sidebarContent prop 확장 (Phase 1)
```

---

## 부록: 스펙 리뷰 결과 요약

| 항목                 | 점수       |
| -------------------- | ---------- |
| 핵심 비전 준수       | 98/100     |
| 문서간 일관성        | 88/100     |
| 화면-라우트-API 매핑 | 97/100     |
| 구현 가능성          | 93/100     |
| 완성도               | 90/100     |
| **종합**             | **93/100** |

2차례 리뷰에서 발견된 모든 이슈 수정 반영 완료:

**1차 리뷰 (Agent Team Spec Reviewer)** — 5개 Major:

1. ~~Draft 자동저장 간격 불일치~~ → 300ms 디바운스로 통일
2. ~~감사 추적 사이드바 권한~~ → `show: !isReadOnly`로 수정
3. ~~거버넌스 API 권한 범위~~ → 거버넌스 권한으로 제한, 대시보드 요약은 별도 API
4. ~~approval-kpi-panel 체크리스트 누락~~ → Phase 1에 추가
5. ~~코드그룹 삭제 API 누락~~ → `DELETE /api/common-codes/groups/{id}` 추가

**2차 리뷰 (Code Reviewer)** — 7개 Important + 6개 Suggestion:

1. ~~API 엔드포인트 수 불일치~~ → 118개로 통일 (공통코드 그룹 삭제 반영)
2. ~~Draft 상태 enum 불일치~~ → DISCARDED(수동) + EXPIRED(자동) 양쪽 모두 추가
3. ~~Notification 엔티티 필드 불일치~~ → recipientId/referenceType/priority로 통일
4. ~~FEEDBACK_RESOLVED 누락~~ → Request 상태 전이도에 추가
5. ~~generateMetadata async params~~ → Next.js 16 Promise 패턴 적용
6. ~~STD_MANAGER 거버넌스 API 접근~~ → 모든 거버넌스 API에 거버넌스 권한 적용
7. ~~GOV 규칙 ID 불일치~~ → specs/data/rules.md 기준으로 정렬
8. ~~AI API HTTP 메서드~~ → suggest/synonyms를 GET으로 변경
9. ~~Draft 10건 제한~~ → POST /api/drafts에 422 에러 명시
10. ~~STD_MANAGER 대시보드 라우팅~~ → isApproverView 플래그 추가
11. ~~권한 관리 탭~~ → 5개 역할(시스템관리/검토승인/표준 관리자/신청자/조회전용)으로 수정
12. ~~STD_MANAGER 공통코드 관리 접근~~ → canManageCommonCodes 권한 + 사이드바 분리
13. ~~codex-models API 클라이언트 의존성~~ → DI 패턴 문서화
