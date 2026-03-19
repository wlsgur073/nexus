# Codex 개발 지시서

> **버전**: 1.0
> **작성일**: 2026-03-19
> **기준**: 27개 UI 와이어프레임 프로토타입 (HTML/CSS)
> **목적**: 와이어프레임에서 역설계한 데이터 모델, API, 비즈니스 규칙을 개발팀에 전달하여 실제 애플리케이션 구현을 지원한다.

---

## 목차

1. [문서 정보](#1-문서-정보)
2. [제품 개요 및 비전](#2-제품-개요-및-비전)
3. [시스템 아키텍처](#3-시스템-아키텍처)
4. [데이터 모델](#4-데이터-모델)
5. [사용자 역할 및 권한](#5-사용자-역할-및-권한)
6. [거버넌스 워크플로우](#6-거버넌스-워크플로우)
7. [화면 명세서](#7-화면-명세서)
8. [API 명세 개요](#8-api-명세-개요)
9. [비즈니스 규칙](#9-비즈니스-규칙)
10. [비기능 요구사항](#10-비기능-요구사항)
11. [개발 단계](#11-개발-단계)
12. [부록](#12-부록)

---

## 1. 문서 정보

### 1.1 문서 목적

본 문서는 Codex 데이터 표준관리 솔루션의 **27개 UI 와이어프레임**을 분석하여 도출한 개발 명세서이다. 와이어프레임의 테이블 컬럼, 폼 필드, 상태 배지, 모달, 어노테이션에서 데이터 모델, RESTful API, 비즈니스 규칙을 역설계하여 문서화한다.

### 1.2 대상 독자

- 백엔드 개발자 (API, 데이터 모델 구현)
- 프론트엔드 개발자 (화면 구현, 디자인 시스템 적용)
- QA 엔지니어 (비즈니스 규칙 검증)
- 프로젝트 매니저 (개발 범위 및 단계 확인)

### 1.3 참조 문서

| 문서 | 위치 | 용도 |
| ------ | ------ | ------ |
| 제품 정의 요약 | `docs/Codex-solution-summary.md` | 제품 비전, 핵심 엔티티, 요구사항 |
| 화면 목록 | `docs/feature-list.md` | 27개 화면 목록, 카테고리, 우선순위 |
| 디자인 시스템 | `shared-styles.css` | 디자인 토큰, 컴포넌트 클래스 |
| 제품 정의서 | `docs/superpowers/specs/2026-03-16-metaforge-product-definition.md` | 3-Layer 아키텍처, MVP 스코프, 역할 정의 |
| Phase 1 설계서 | `docs/superpowers/specs/2026-03-18-phase1-wisemeta-gap-design.md` | 검증/AI/거버넌스 상세 설계 |

### 1.4 용어 정의

| 한국어 | 영문 | 설명 |
| -------- | ------ | ------ |
| 표준단어 | Standard Word | 조직 내 데이터 명칭의 최소 단위 |
| 표준도메인 | Standard Domain | 데이터 타입과 길이를 정의하는 단위 |
| 표준용어 | Standard Term | 표준단어 + 표준도메인으로 구성된 비즈니스 용어 |
| 공통코드 | Common Code | 조직 공유 참조 코드값 |
| 거버넌스 파이프라인 | Governance Pipeline | 신청 → 검토 → 승인 → 발행 워크플로우 |
| 인포타입 | Info Type | 표준용어의 의미 분류 (사용자명, 금액, 일자 등) |

---

## 2. 제품 개요 및 비전

### 2.1 제품 정의

Codex는 **엔터프라이즈 데이터 표준 거버넌스 플랫폼**이다. 조직의 데이터 표준(단어, 도메인, 용어, 공통코드)을 중앙에서 정의, 신청, 검토, 승인, 감사하는 통합 솔루션이다.

**한 줄 정의:** 표준단어, 표준도메인, 표준용어, 공통코드를 조직 차원에서 통제하고, 권한 기반 승인 프로세스로 데이터 일관성과 재사용성을 관리하는 메타데이터 표준관리 제품

### 2.2 해결 문제

| 문제 | 결과 |
| ------ | ------ |
| **비통제 표준 변경** | 승인 없이 표준이 수정·생성되어 감사 추적 불가, 컴플라이언스 리스크 발생 |
| **부서 간 명명 불일치** | 동일 데이터를 다른 이름·형식으로 사용하여 통합 실패, 보고서 오류 |
| **분산 코드 관리** | 시스템별로 공통코드가 개별 관리되어 코드 드리프트·충돌 발생 |
| **승인 프로세스 부재** | 이메일·스프레드시트로 승인 처리하여 추적 불가, 수동 조율 오버헤드 |

### 2.3 핵심 가치 제안

- **통제된 거버넌스 생명주기**: 모든 표준 변경이 요청-검토-승인-감사 과정을 거친다
- **감사 추적**: 누가, 언제, 왜 변경했는지 영구 기록
- **역할 기반 접근 통제**: 신청자, 승인자, 관리자 분리
- **중앙 집중 관리**: 단일 시스템으로 버전 드리프트 제거

### 2.4 배포 형태

- **온프레미스 웹 애플리케이션** (대규모 엔터프라이즈, 1000+ 직원 대상)
- 중앙 서버 배포, 브라우저 기반 접근
- 모든 사용자가 동일 버전, 동일 규칙으로 운영

---

## 3. 시스템 아키텍처

### 3.1 시스템 요구사항

| 계층 | 요구사항 | 비고 |
| ------ | ---------- | ------ |
| **Frontend** | SPA (Single Page Application) | 특정 프레임워크 미지정 |
| **Backend** | REST API 서버 | 특정 언어/프레임워크 미지정 |
| **Database** | RDBMS (Oracle, PostgreSQL, MySQL, MSSQL 호환) | `db-settings.html` 기반 |
| **AI Module** | 유사도 분석 엔진 | 음절/의미/약어 패턴 매칭 |

### 3.2 3-Layer 아키텍처

```text
┌─────────────────────────────────────────────────────────┐
│                   Core Layer                             │
│        표준 거버넌스 생명주기 (검색/신청/승인/감사)           │
│  표준단어 · 표준도메인 · 표준용어 · 공통코드                  │
├─────────────────────────────────────────────────────────┤
│                Operational Layer                         │
│           조직 통제 구조 (역할/권한/정책/코드)               │
│  RBAC · 사용자 관리 · 시스템 코드 · 정책 설정               │
├─────────────────────────────────────────────────────────┤
│                 Platform Layer                           │
│          엔터프라이즈 기반 (인증/연결/운영)                   │
│  웹 배포 · 인증/세션 · DB 연결 · SSH 터널링                 │
└─────────────────────────────────────────────────────────┘
```

Core Layer (표준 거버넌스 생명주기)

- 표준 검색 및 브라우징
- 신규/변경/삭제 신청
- 검토/승인/반려 처리
- 거버넌스 기준선(Baseline) 관리
- 감사 추적

Operational Layer (조직 통제 구조)

- 역할 기반 접근 통제 (RBAC)
- 사용자 계정 관리
- 시스템 코드 및 참조 데이터
- 메뉴별 CRUD 권한

Platform Layer (엔터프라이즈 기반)

- 중앙 집중 웹 배포
- 인증 및 세션 관리
- 표준관리 DB 연결
- SSH 터널링 지원
- 접속정보 백업/복원 (XML 내보내기/가져오기)

### 3.3 배포 아키텍처

```text
[브라우저] ──HTTPS──▸ [Codex 웹 서버]
                            │
                            ├── [Codex DB] (표준, 워크플로우, 감사)
                            │
                            └── [고객 DB] ──(SSH 터널링 옵션)──▸ [원격 DB]
```

- **Codex DB**: 제품 자체 데이터베이스 — 표준, 워크플로우 상태, 승인 이력, 감사 기록 저장
- **고객 DB**: 참조 및 영향도 확인 용도 연결. Codex가 거버넌스 권한 유지, 고객 시스템은 데이터 소스
- **SSH 터널링**: `db-settings.html`에서 SSH 호스트/포트/인증방식 설정 가능
- **지원 DB**: Oracle, PostgreSQL, MySQL, MSSQL (`db-settings.html` DB 유형 드롭다운)

### 3.4 프론트엔드 레이아웃

```text
┌──────────────────────────────────────────────┐
│ sidebar (260px)  │        main               │
│                  │  ┌─────────────────────┐  │
│  ┌─ logo ──┐    │  │ topbar (56px)       │  │
│  │Codex│    │  │ 제목 · 브레드크럼     │  │
│  └─────────┘    │  ├─────────────────────┤  │
│                  │  │                     │  │
│  nav-section     │  │ content             │  │
│  ├ nav-item      │  │ (스크롤 가능)        │  │
│  ├ nav-item      │  │                     │  │
│  └ nav-item      │  │                     │  │
│                  │  │                     │  │
│  ┌─ user ──┐    │  │                     │  │
│  │avatar   │    │  │                     │  │
│  │이름/역할 │    │  │                     │  │
│  └─────────┘    │  └─────────────────────┘  │
└──────────────────────────────────────────────┘
```

예외 화면:

- `login.html`: 사이드바 없음. Split-screen (좌 55% 브랜딩 / 우 45% 폼)
- `index.html`: 사이드바 없음. 카드형 인덱스 허브 (설계서 프레젠테이션용)

---

## 4. 데이터 모델

### 4.1 엔티티 목록

| # | 엔티티 | 테이블명 | 도출 소스 |
| --- | -------- | ---------- | ----------- |
| 1 | 표준단어 | STD_WORD | `standard-word-search/detail/apply.html` |
| 2 | 표준도메인 | STD_DOMAIN | `standard-domain-search/detail/apply.html` |
| 3 | 표준용어 | STD_TERM | `standard-term-search/detail/apply.html` |
| 4 | 공통코드그룹 | COMMON_CODE_GROUP | `common-code.html` |
| 5 | 공통코드 | COMMON_CODE | `common-code.html`, `common-code-search.html` |
| 6 | 신청 | REQUEST | `application-list.html`, `approval-detail.html` |
| 7 | 신청변경이력 | REQUEST_CHANGE | `approval-detail.html` (변경 비교 테이블) |
| 8 | 감사이력 | AUDIT_LOG | `audit-trail.html` |
| 9 | 삭제영향도 | DELETE_IMPACT | `request-delete-impact.html` |
| 10 | 검증결과 | VALIDATION_RESULT | `standard-validation.html`, `standard-validation-detail.html` |
| 11 | 사용자 | USER | `user-management.html` |
| 12 | 메뉴권한 | MENU_PERMISSION | `menu-permission.html` |
| 13 | 시스템코드 | SYSTEM_CODE | `system-code.html` |

### 4.2 엔티티 상세

#### 4.2.1 STD_WORD (표준단어)

> 도출 소스: `standard-word-search.html` 테이블 컬럼, `standard-word-detail.html` 상세 필드, `standard-word-apply.html` 폼 필드

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| WORD_ID | BIGINT | Y | PK, 자동 생성 | (시스템) |
| WORD_NAME | VARCHAR(100) | Y | 표준단어명 (한국어) | 검색 테이블 "표준단어", 신청 폼 "표준단어*" |
| ABBR_NAME | VARCHAR(50) | Y | 영문약어 (대문자) | 검색 테이블 "영문약어", 신청 폼 "영문약어*", 힌트: "영문 대문자 약어 (예: CUST, AMT, DT)" |
| ENG_NAME | VARCHAR(200) | Y | 영문명 | 검색 테이블 "영문명", 신청 폼 "영문명*" |
| DEFINITION | TEXT | Y | 정의 | 검색 테이블 "정의", 신청 폼 textarea "정의*" |
| DOMAIN_TYPE | VARCHAR(20) | N | 도메인유형 코드 (FK → SYSTEM_CODE) | 검색 테이블 "도메인유형", 신청 폼 드롭다운 (문자열, 숫자, 일자, 코드) |
| STATUS | VARCHAR(20) | Y | 상태 코드 (FK → SYSTEM_CODE) | 검색 테이블 배지: 기존/신청/삭제 |
| REG_DATE | DATE | Y | 등록일 | 검색 테이블 "등록일", 상세 "등록일" |
| MOD_DATE | DATE | N | 최종수정일 | 상세 "최종수정일" |
| REG_USER_ID | BIGINT | Y | 등록자 (FK → USER) | (시스템) |

#### 4.2.2 STD_DOMAIN (표준도메인)

> 도출 소스: `standard-domain-search.html` 테이블 컬럼, `standard-domain-detail.html` 상세 필드, `standard-domain-apply.html` 폼 필드

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| DOMAIN_ID | BIGINT | Y | PK, 자동 생성 | (시스템) |
| DOMAIN_NAME | VARCHAR(100) | Y | 도메인명 | 검색 테이블 "도메인명", 신청 폼 "도메인명*" |
| DOMAIN_TYPE | VARCHAR(20) | Y | 도메인유형 (FK → SYSTEM_CODE) | 검색 테이블 "도메인유형", 필터 드롭다운 (문자열, 숫자, 일자, 코드(공통코드)) |
| DATA_TYPE | VARCHAR(20) | Y | 데이터타입 | 검색 테이블 "데이터타입", 신청 폼 드롭다운 (VARCHAR, CHAR, NUMBER, DATE, CLOB, BLOB) |
| DATA_LENGTH | VARCHAR(20) | N | 데이터길이 | 검색 테이블 "데이터길이", 신청 폼 힌트: "예: 100 또는 15,2" |
| DEFINITION | TEXT | Y | 정의 | 검색 테이블 "정의", 신청 폼 textarea "정의*" |
| STATUS | VARCHAR(20) | Y | 상태 코드 | 검색 테이블 배지: 기존/신청 |
| REG_DATE | DATE | Y | 등록일 | 검색 테이블 "등록일", 상세 "등록일" |
| MOD_DATE | DATE | N | 최종수정일 | 상세 "최종수정일" |
| REG_USER_ID | BIGINT | Y | 등록자 (FK → USER) | (시스템) |

#### 4.2.3 STD_TERM (표준용어)

> 도출 소스: `standard-term-search.html` 테이블 컬럼, `standard-term-detail.html` 상세 필드, `standard-term-apply.html` 폼 필드

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| TERM_ID | BIGINT | Y | PK, 자동 생성 | (시스템) |
| TERM_NAME | VARCHAR(200) | Y | 표준용어명 (한국어) | 검색 테이블 "표준용어", 신청 폼 "표준용어*" |
| PHYSICAL_NAME | VARCHAR(200) | Y | 물리명 (영문, 자동 생성) | 검색 테이블 "물리명", 신청 폼 readonly "물리명" — 힌트: "영문약어 조합으로 자동 생성됩니다" |
| DOMAIN_TYPE | VARCHAR(20) | Y | 도메인유형 (FK → SYSTEM_CODE) | 검색 테이블 "도메인유형", 신청 폼 드롭다운 |
| INFO_TYPE | VARCHAR(50) | Y | 인포타입 | 검색 테이블 "인포타입", 신청 폼 드롭다운 (사용자명, 금액, 일자, 코드, 설명, 여부) |
| DEFINITION | TEXT | Y | 정의 | 검색 테이블 "정의", 신청 폼 textarea "정의*" |
| STATUS | VARCHAR(20) | Y | 상태 코드 | 검색 테이블 배지: 기존/신청 |
| REG_DATE | DATE | Y | 등록일 | 검색 테이블 "등록일" |
| MOD_DATE | DATE | N | 최종수정일 | 상세 "최종수정일" |
| REG_USER_ID | BIGINT | Y | 등록자 (FK → USER) | (시스템) |

표준용어-표준단어 관계 테이블: STD_TERM_WORD

> 도출 소스: `standard-term-detail.html` "구성 단어" 테이블

| 컬럼명 | 데이터타입 | 필수 | 설명 |
| -------- | ----------- | ------ | ------ |
| TERM_ID | BIGINT | Y | FK → STD_TERM |
| WORD_ID | BIGINT | Y | FK → STD_WORD |
| SEQ | INT | Y | 단어 순서 |

#### 4.2.4 COMMON_CODE_GROUP (공통코드그룹)

> 도출 소스: `common-code.html` 좌측 코드그룹 목록, `common-code-search.html` 테이블

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| GROUP_ID | BIGINT | Y | PK, 자동 생성 | (시스템) |
| GROUP_CODE | VARCHAR(50) | Y | 그룹코드 (영문) | 검색 테이블 "그룹코드" (예: TRADE_TYPE, PAY_METHOD) |
| GROUP_NAME | VARCHAR(100) | Y | 코드그룹명 | 좌측 목록 (거래유형, 결제방법 등), 검색 테이블 "코드그룹명" |
| CODE_COUNT | INT | N | 소속 코드 건수 | 좌측 목록 "N건" 표시 |
| STATUS | VARCHAR(20) | Y | 상태 코드 | 검색 배지 |
| REG_DATE | DATE | Y | 등록일 | (시스템) |

#### 4.2.5 COMMON_CODE (공통코드)

> 도출 소스: `common-code.html` 우측 상세 코드 테이블, `common-code-search.html` 전체 검색 테이블

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| CODE_ID | BIGINT | Y | PK, 자동 생성 | (시스템) |
| GROUP_ID | BIGINT | Y | FK → COMMON_CODE_GROUP | 코드그룹 선택 |
| CODE | VARCHAR(50) | Y | 코드값 | 관리 테이블 "코드" (예: TRD001), 검색 테이블 "코드" |
| CODE_NAME | VARCHAR(100) | Y | 코드명 | 관리 테이블 "코드명" (예: 매매), 검색 테이블 "코드명" |
| DESCRIPTION | TEXT | N | 설명 | 관리 테이블 "설명", 검색 테이블 "설명" |
| USE_YN | CHAR(1) | Y | 사용여부 (Y/N) | 검색 테이블 "사용여부" 배지 |
| STATUS | VARCHAR(20) | Y | 상태 코드 | 관리 테이블 배지: 기존/신청 |
| REG_DATE | DATE | Y | 등록일 | 관리 테이블 "등록일" |

#### 4.2.6 REQUEST (신청)

> 도출 소스: `application-list.html` 테이블, `my-requests.html` 테이블, `approval.html` 테이블, `approval-detail.html` 신청 개요

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| REQUEST_ID | BIGINT | Y | PK, 자동 생성 | 신청 ID (REQ-2026-0342 형태 display) |
| REQUEST_NO | VARCHAR(20) | Y | 신청번호 (표시용) | 테이블 "신청번호" (REQ-001 등) |
| TARGET_TYPE | VARCHAR(20) | Y | 대상 유형 (표준단어/표준도메인/표준용어/공통코드) | 테이블 "구분" 배지 |
| TARGET_ID | BIGINT | N | 대상 엔티티 FK (변경/삭제 시) | 변경 대상 참조 |
| TARGET_NAME | VARCHAR(200) | Y | 항목명 | 테이블 "항목명", 승인 테이블 "항목명" |
| REQUEST_TYPE | VARCHAR(20) | Y | 요청구분 (신규/변경/삭제) | 테이블 "요청구분" |
| STATUS | VARCHAR(20) | Y | 상태 (신청/검토/승인/반려/취소/피드백대기) | 테이블 "상태" 배지 |
| REQUESTER_ID | BIGINT | Y | 신청자 (FK → USER) | 테이블 "신청자" |
| REQUEST_DATE | DATE | Y | 신청일 | 테이블 "신청일" |
| PROCESS_DATE | DATE | N | 처리일 | 테이블 "처리일" |
| REQUEST_REASON | TEXT | N | 신청사유 | 승인상세 "신청 사유" 카드, 신청 폼 "신청사유" |
| PARENT_REQUEST_ID | BIGINT | N | 원본 신청 ID (재신청 시) | 피드백 후 재신청 추적 |

#### 4.2.7 REQUEST_CHANGE (신청변경이력)

> 도출 소스: `approval-detail.html` "변경 내용 비교" 테이블 (항목 / 현재값 / 변경요청값)

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| CHANGE_ID | BIGINT | Y | PK, 자동 생성 | (시스템) |
| REQUEST_ID | BIGINT | Y | FK → REQUEST | 연결 신청 |
| FIELD_NAME | VARCHAR(50) | Y | 변경 필드명 | 비교 테이블 "항목" (단어명, 영문약어, 영문명, 정의) |
| OLD_VALUE | TEXT | N | 현재값 | 비교 테이블 "현재값" |
| NEW_VALUE | TEXT | N | 변경요청값 | 비교 테이블 "변경요청값" (변경된 항목 강조 표시) |

#### 4.2.8 AUDIT_LOG (감사이력)

> 도출 소스: `audit-trail.html` 감사 추적 테이블, 상세 타임라인

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| LOG_ID | BIGINT | Y | PK, 자동 생성 | (시스템) |
| LOG_DATETIME | TIMESTAMP | Y | 이벤트 일시 | 테이블 "일시" (mono 표시) |
| TARGET_TYPE | VARCHAR(20) | Y | 대상 유형 | 테이블 "대상" 배지 (표준단어/표준도메인/표준용어/공통코드) |
| TARGET_NAME | VARCHAR(200) | Y | 대상명 | 테이블 "대상" 텍스트 |
| TARGET_ID | BIGINT | N | 대상 엔티티 FK | 상세 이력 링크 |
| ACTION_TYPE | VARCHAR(20) | Y | 작업 유형 | 테이블 "작업" 배지 (신청/검토/승인/반려/취소) |
| STATE_FROM | VARCHAR(20) | N | 이전 상태 | 테이블 "상태 변경" (미등록 → 신청 형태) |
| STATE_TO | VARCHAR(20) | N | 이후 상태 | 테이블 "상태 변경" |
| ACTOR_ID | BIGINT | Y | 처리자 (FK → USER) | 테이블 "처리자" |
| ACTOR_ROLE | VARCHAR(50) | N | 처리자 역할 | 테이블 "(검토자)" 부가 표시 |
| COMMENT | TEXT | N | 사유/코멘트 | 테이블 "사유/코멘트" |
| REQUEST_ID | BIGINT | N | 관련 신청 FK | 상세 타임라인 "신청 ID" 메타데이터 |

#### 4.2.9 DELETE_IMPACT (삭제영향도)

> 도출 소스: `request-delete-impact.html` 전체 폼

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| IMPACT_ID | BIGINT | Y | PK, 자동 생성 | (시스템) |
| REQUEST_ID | BIGINT | Y | FK → REQUEST | 연결 삭제 신청 |
| TARGET_TYPE | VARCHAR(20) | Y | 대상 표준 유형 | 상단 "유형" (표준단어) |
| TARGET_ID | BIGINT | Y | 대상 표준 FK | 삭제 대상 참조 |
| AFFECTED_SYSTEMS | VARCHAR(500) | N | 영향 받는 시스템 (복수 선택, 콤마 구분) | 체크박스: 운영DB, DW, 보고서/대시보드, API/인터페이스, 외부연동, 기타 |
| AFFECTED_OTHER | TEXT | N | 기타 영향 영역 | textarea "기타 영향 영역 직접 입력" |
| IMPACT_LEVEL | VARCHAR(10) | Y | 영향도 수준 (높음/중간/낮음) | 라디오 버튼 3개 |
| IMPACT_DESC | TEXT | Y | 영향도 설명 | textarea "영향도 설명" (필수) |
| ALT_STANDARD | VARCHAR(200) | N | 대체 표준 제안 | 검색 입력 "대체할 표준단어를 검색하세요" |
| MIGRATION_PLAN | TEXT | N | 마이그레이션 계획 | textarea "삭제 후 영향 받는 시스템의 전환 계획" |
| DELETE_REASON | TEXT | Y | 삭제 사유 | textarea "삭제 사유*" (필수, 승인자에게 전달) |

#### 4.2.10 VALIDATION_RESULT (검증결과)

> 도출 소스: `standard-validation.html` 통계/이력, `standard-validation-detail.html` 위반 목록 테이블

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| RESULT_ID | BIGINT | Y | PK, 자동 생성 | (시스템) |
| EXECUTION_ID | BIGINT | Y | 검증 실행 ID | 이력 테이블의 실행 단위 |
| EXEC_DATETIME | TIMESTAMP | Y | 실행 일시 | 이력 테이블 "실행 일시" (mono) |
| TARGET_TYPE | VARCHAR(20) | Y | 대상 유형 (단어/도메인/용어) | 위반 테이블 "대상" 배지 |
| TARGET_ID | BIGINT | Y | 위반 항목 FK | 위반 테이블 → 상세 링크 |
| TARGET_NAME | VARCHAR(200) | Y | 항목명 | 위반 테이블 "항목명" |
| RULE_TYPE | VARCHAR(30) | Y | 위반 규칙 (명명규칙/금칙어/중복/필수항목/길이제한) | 탭/위반 테이블 "위반 규칙" |
| VIOLATION_DESC | TEXT | Y | 위반 내용 | 위반 테이블 "위반 내용" (예: "payAmt → PAY_AMT 권장") |
| SEVERITY | VARCHAR(10) | Y | 심각도 (높음/중간/낮음) | 위반 테이블 "심각도" 배지 |
| RESOLVE_STATUS | VARCHAR(20) | Y | 처리 상태 (미처리/시정중/완료) | 위반 테이블 "상태" 배지 |
| EXECUTOR_ID | BIGINT | N | 실행자 (FK → USER, NULL=시스템) | 이력 테이블 "실행자" |

VALIDATION_EXECUTION (검증 실행 이력)

> 도출 소스: `standard-validation.html` "최근 검증 이력" 테이블

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| EXECUTION_ID | BIGINT | Y | PK | (시스템) |
| EXEC_DATETIME | TIMESTAMP | Y | 실행 일시 | 이력 "실행 일시" |
| TARGET_SCOPE | VARCHAR(50) | Y | 대상 범위 | 이력 "대상 범위" (전체, 표준단어 등) |
| RULE_COUNT | INT | Y | 검증 규칙 수 | 이력 "검증 규칙" (5개 규칙) |
| CHECK_COUNT | INT | Y | 검사 항목 수 | 이력 "검사 항목" (7,524건) |
| VIOLATION_COUNT | INT | Y | 위반 건수 | 이력 "위반 건수" (127건) |
| RESULT_STATUS | VARCHAR(20) | Y | 결과 상태 | 이력 "결과" 배지 (위반 발견/일부 위반) |
| EXECUTOR_ID | BIGINT | N | 실행자 | 이력 "실행자" (시스템(자동)/사용자명) |

#### 4.2.11 USER (사용자)

> 도출 소스: `user-management.html` 테이블 및 추가 모달

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| USER_ID | BIGINT | Y | PK, 자동 생성 | (시스템) |
| LOGIN_ID | VARCHAR(50) | Y | 사용자ID (로그인용) | 테이블 "사용자ID", 모달 "사용자ID*" |
| USER_NAME | VARCHAR(100) | Y | 이름 | 테이블 "이름", 모달 "이름*" |
| PASSWORD | VARCHAR(256) | Y | 비밀번호 (암호화 저장) | 모달 "비밀번호*" (password 타입) |
| ROLE | VARCHAR(20) | Y | 역할 (관리자/일반사용자) | 테이블 "역할", 모달 드롭다운 |
| DEPARTMENT | VARCHAR(100) | N | 부서 | 테이블 "부서", 모달 "부서" |
| EMAIL | VARCHAR(200) | N | 이메일 | 테이블 "이메일", 모달 "이메일" (email 타입) |
| LAST_LOGIN | TIMESTAMP | N | 최종로그인 | 테이블 "최종로그인" |
| STATUS | VARCHAR(10) | Y | 상태 (활성/비활성) | 테이블 "상태" 배지 (활성=approved, 비활성=draft) |

#### 4.2.12 MENU_PERMISSION (메뉴권한)

> 도출 소스: `menu-permission.html` 권한 상세 테이블

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| PERM_ID | BIGINT | Y | PK, 자동 생성 | (시스템) |
| ROLE | VARCHAR(20) | Y | 역할명 | 탭: 관리자/일반사용자/게스트 |
| MENU_CODE | VARCHAR(50) | Y | 메뉴 코드 | 트리 구조 + 테이블 "메뉴" |
| CAN_READ | BOOLEAN | Y | 조회 권한 | 테이블 "조회" 체크박스 |
| CAN_CREATE | BOOLEAN | Y | 등록 권한 | 테이블 "등록" 체크박스 |
| CAN_UPDATE | BOOLEAN | Y | 수정 권한 | 테이블 "수정" 체크박스 |
| CAN_DELETE | BOOLEAN | Y | 삭제 권한 | 테이블 "삭제" 체크박스 |

#### 4.2.13 SYSTEM_CODE (시스템코드)

> 도출 소스: `system-code.html` 탭별 코드 테이블

| 컬럼명 | 데이터타입 | 필수 | 설명 | UI 소스 |
| -------- | ----------- | ------ | ------ | --------- |
| SYS_CODE_ID | BIGINT | Y | PK, 자동 생성 | (시스템) |
| CATEGORY | VARCHAR(30) | Y | 카테고리 (도메인유형/표준상태코드/요청구분코드) | 탭 |
| CODE | VARCHAR(20) | Y | 코드 | 테이블 "코드" (STR, NUM, DT, CD 등) |
| CODE_NAME | VARCHAR(100) | Y | 코드명 | 테이블 "코드명" (문자열, 숫자, 일자 등) |
| DESCRIPTION | TEXT | N | 설명 | 테이블 "설명" |
| IS_PROTECTED | BOOLEAN | Y | 보호 여부 | 테이블 "보호" 배지, "변경가능" (불가/가능) |
| REG_DATE | DATE | Y | 등록일 | 테이블 "등록일" |

### 4.3 ER 관계도

```text
STD_WORD ──────┐
  │             │ (구성 단어)
  │          STD_TERM_WORD ───── STD_TERM
  │                                 │
  │                                 │ (도메인유형 참조)
  ├─── SYSTEM_CODE ─────────── STD_DOMAIN
  │      (도메인유형,                    │
  │       상태코드,                      │ (코드 도메인 → 공통코드)
  │       요청구분코드)                    │
  │                              COMMON_CODE_GROUP
  │                                 │
  │                              COMMON_CODE
  │
REQUEST ─────── REQUEST_CHANGE
  │
  ├─── DELETE_IMPACT
  │
  ├─── AUDIT_LOG
  │
  └─── USER ──── MENU_PERMISSION

VALIDATION_EXECUTION ──── VALIDATION_RESULT
```

주요 관계:

| 관계 | 설명 |
| ------ | ------ |
| STD_TERM → STD_WORD | 용어는 1개 이상의 단어로 구성 (다대다, STD_TERM_WORD 통해) |
| STD_TERM → STD_DOMAIN | 용어는 1개 도메인유형을 참조 (다대일) |
| STD_DOMAIN → COMMON_CODE_GROUP | 도메인유형이 '코드(공통코드)'인 경우 코드그룹 연결 |
| REQUEST → STD_WORD/DOMAIN/TERM | 신청은 하나의 표준 엔티티를 대상으로 함 (다형성 FK) |
| REQUEST → REQUEST_CHANGE | 변경 신청은 필드별 변경 이력 보유 (1:N) |
| REQUEST → DELETE_IMPACT | 삭제 신청은 영향도 평가 필수 (1:1) |
| REQUEST → AUDIT_LOG | 모든 신청 상태 변경이 감사 기록 (1:N) |
| USER → REQUEST | 사용자가 신청 생성 (1:N) |
| USER → MENU_PERMISSION | 역할 기반 메뉴 권한 (역할별 N개 메뉴) |

---

## 5. 사용자 역할 및 권한

### 5.1 역할 정의

> 도출 소스: `user-management.html`, `menu-permission.html`, `approval.html` 어노테이션, 제품 정의서

| 역할 | 대상 | 주요 권한 |
| ------ | ------ | ---------- |
| **시스템관리자** (System Administrator) | IT 운영, 플랫폼 관리자 | 사용자 계정 CRUD, 역할 할당, 메뉴 권한 설정, 시스템 코드 관리, DB 연결 설정 |
| **검토/승인자** (Reviewer/Approver) | 표준 관리자, 데이터 거버넌스 리더 | 신청 검토, 승인/반려/검토요청 처리, 처리사유 입력, 승인 큐 관리 |
| **데이터스튜어드** (Data Steward) | 거버넌스 매니저, 데이터 품질 리더 | 표준 품질 관리, 교차 도메인 일관성, 공통코드 거버넌스 |
| **신청자** (Requester) | 비즈니스 분석가, 개발자, 데이터 엔지니어 | 표준 검색, 신규/변경/삭제 신청, 신청 상태 추적, 피드백 후 재신청 |
| **조회전용** (Read-only User) | 인증된 제한 권한 사용자 | 표준 검색/브라우징만 가능 — 신청/승인 불가 |

### 5.2 메뉴별 CRUD 권한 매트릭스

> 도출 소스: `menu-permission.html` 권한 상세 테이블 (관리자 탭 기준 + 역할별 추론)

| 메뉴 | 시스템관리자 | 검토/승인자 | 데이터스튜어드 | 신청자 | 조회전용 |
| ------ | :----------: | :---------: | :----------: | :-----: | :------: |
| 대시보드 | CRUD | R | R | R | R |
| 표준단어 조회 | CRUD | R | R | R | R |
| 표준도메인 조회 | CRUD | R | R | R | R |
| 표준용어 조회 | CRUD | R | R | R | R |
| 표준단어 신청 | CRUD | R | CR | CR | - |
| 표준도메인 신청 | CRUD | R | CR | CR | - |
| 표준용어 신청 | CRUD | R | CR | CR | - |
| 신청 목록 | CRUD | R | R | R | - |
| 내 신청 목록 | CRUD | R | R | R | - |
| 삭제 영향도 | CRUD | R | CR | CR | - |
| 승인 처리 | CRUD | CRUD | R | - | - |
| 신청 상세 | CRUD | CRUD | R | R | - |
| 검증 대시보드 | CRUD | R | R | R | R |
| 검증 실행/상세 | CRUD | R | R | R | - |
| AI 표준용어 추천 | CRUD | R | R | R | R |
| 거버넌스 포털 | CRUD | R | R | - | - |
| 감사 추적 | CRUD | R | R | R | - |
| 공통코드 관리 | CRUD | R | CRUD | - | - |
| 공통코드 조회 | R | R | R | R | R |
| 사용자 관리 | CRUD | - | - | - | - |
| 메뉴 권한 | CRUD | - | - | - | - |
| 시스템 코드 | CRUD | - | - | - | - |
| DB 설정 | CRUD | - | - | - | - |

> R=조회, C=등록, U=수정, D=삭제, -=접근불가

### 5.3 역할별 대시보드 뷰 차이

> 도출 소스: `dashboard.html` 어노테이션 — "[역할별 대시보드 안내]"

| 역할 | 대시보드 표시 내용 |
| ------ | ------------------ |
| 시스템관리자 | 전체 시스템 현황 (모든 stat 카드, 전체 타임라인, 전체 차트) |
| 검토/승인자 | 승인 대기 건수 강조, 미처리 큐 요약, 처리 실적 |
| 신청자 | 본인 신청 현황, 승인/반려 알림, 피드백대기 건 |
| 조회전용 | 표준 현황 요약만 표시 (신청/승인 관련 제외) |

### 5.4 신청자/승인자 분리 원칙

> 도출 소스: `approval.html` 어노테이션

**규칙**: 로그인한 사용자가 직접 신청한 건은 승인 대기 목록에서 **자동으로 제외**된다.

- 자신이 신청한 건에 대해 승인/반려/검토요청 처리 불가
- `approval-detail.html` 하단 안내: "자신이 신청한 건은 승인할 수 없습니다. 해당 건은 승인함에 표시되지 않습니다."
- 거버넌스 무결성을 위해 v1에서 기본 적용

---

## 6. 거버넌스 워크플로우

### 6.1 상태 정의

> 도출 소스: `application-list.html` 배지, `audit-trail.html` 상태 전이, `approval-detail.html` 타임라인

| 상태 | 코드 | 배지 클래스 | 색상 | 설명 |
| ------ | ------ | ----------- | ------ | ------ |
| 미등록 | UNREGISTERED | - | - | 초기 상태, 표준으로 등록되지 않은 상태 |
| 신청 | PENDING | `badge-pending` | 주황 | 사용자가 신청을 제출한 상태 |
| 검토 | REVIEW | `badge-review` | 청색 | 승인자가 검토를 시작한 상태 |
| 승인 | APPROVED | `badge-approved` | 녹색 | 승인자가 승인 처리한 상태 |
| 반려 | REJECTED | `badge-rejected` | 적색 | 승인자가 반려 처리한 상태 |
| 피드백대기 | FEEDBACK | `badge-feedback` | 청색 | 승인자가 수정 요청을 보낸 상태 |
| 취소 | CANCELLED | `badge-cancelled` | 회색 | 신청자가 직접 취소한 상태 |
| 기존 | BASELINE | `badge-approved` | 녹색 | 승인되어 표준 원장에 등록된 상태 |
| 삭제 | DELETED | `badge-rejected` | 적색 | 삭제 승인되어 원장에서 제거된 상태 |

### 6.2 상태 전이 다이어그램

```text
                         [신청자 취소]
                    ┌──────────────────┐
                    ▼                  │
              ┌──────────┐        ┌────┴─────┐
              │  취소     │        │  신청     │◀──────────────────┐
              │(CANCELLED)│        │(PENDING) │                   │
              └──────────┘        └────┬─────┘                   │
                    ▲                  │                          │
                    │            [승인자 검토 시작]                 │
                    │                  │                          │
                    │                  ▼                          │
                    │            ┌──────────┐                    │
                    │            │  검토     │                    │
                    │            │(REVIEW)  │                    │
                    │            └──┬──┬──┬─┘                    │
                    │               │  │  │                      │
              [피드백 후 취소]    ┌──┘  │  └──┐                   │
                    │           │     │     │                    │
                    │           ▼     │     ▼                    │
              ┌─────┴────┐  ┌──────┐ │  ┌──────────┐           │
              │ 피드백대기 │  │ 승인  │ │  │  반려     │           │
              │(FEEDBACK)│  │(APPR)│ │  │(REJECTED)│           │
              └─────┬────┘  └──┬───┘ │  └────┬─────┘           │
                    │          │     │       │                   │
            [수정 후 재신청]     │     │  [재신청]                 │
                    │          │     │       │                   │
                    └──────────│─────│───────┘───────────────────┘
                               │     │
                               ▼     │
                          ┌────────┐ │
                          │ 발행    │ │
                          │(기존)  │ │
                          └────────┘ │
                                     │
                                [삭제 승인]
                                     │
                                     ▼
                               ┌──────────┐
                               │  삭제     │
                               │(DELETED) │
                               └──────────┘
```

### 6.3 신규 신청 프로세스

> 도출 소스: `standard-word-apply.html` (신규 탭), `application-list.html`, `audit-trail.html`

1. 신청자가 신청 폼에서 필수 필드를 입력한다
   - 표준단어: 단어명*, 영문약어*, 영문명*, 정의* + (도메인유형, 신청사유)
   - 표준도메인: 도메인명*, 도메인유형*, 데이터타입*, 정의* + (데이터길이, 신청사유)
   - 표준용어: 용어명*, 도메인유형*, 인포타입*, 정의* + (물리명=자동, 신청사유)
2. AI Data Butler가 유사 표준 3건을 실시간 추천한다 (미니 패널)
3. 중복 경고 시 신청자가 판단하여 진행/중단한다
4. "신청" 버튼 클릭 → 신청(PENDING) 상태로 생성
5. 감사 로그 자동 기록: `미등록 → 신청`
6. 승인 처리 화면(`approval.html`)에 신청 건 표시 (신청자 본인 건은 제외)

### 6.4 변경 신청 프로세스

> 도출 소스: `standard-word-apply.html` (변경 탭), `approval-detail.html` 변경 비교

1. 신청자가 상세 화면에서 "변경 신청" 버튼을 클릭한다
2. 기존 데이터가 사전 입력된 신청 폼으로 이동한다
3. 변경할 필드를 수정한다
4. "신청" 버튼 클릭 → 변경 전/후 비교 데이터가 자동 생성 (REQUEST_CHANGE 테이블)
5. 승인자는 `approval-detail.html`에서 항목별 현재값/변경요청값을 비교 확인한다

### 6.5 삭제 신청 프로세스

> 도출 소스: `standard-word-apply.html` (삭제 탭), `request-delete-impact.html`

1. 신청자가 상세 화면에서 "삭제 신청" 버튼을 클릭한다
2. **영향도 평가 필수**: `request-delete-impact.html`로 이동
3. 영향도 평가 폼 작성:
   - 영향 받는 시스템/영역 선택 (체크박스 6개)
   - 영향도 수준 선택 (높음/중간/낮음 라디오)
   - 영향도 설명 작성 (필수)
   - 대체 표준 제안 (선택)
   - 마이그레이션 계획 (선택)
   - 삭제 사유 작성 (필수)
4. "삭제 신청" 버튼 → 영향도 평가 내용이 승인자에게 전달

### 6.6 승인 처리 프로세스

> 도출 소스: `approval.html`, `approval-detail.html`

승인자가 수행 가능한 3가지 액션:

| 액션 | 결과 상태 | 설명 |
| ------ | ---------- | ------ |
| **승인** | APPROVED → 기존(BASELINE) | 표준 원장에 반영, 발행 완료 |
| **반려** | REJECTED | 신청자가 사유 확인 후 재신청 가능 |
| **검토요청** | FEEDBACK | 신청자에게 수정 요청, 재신청 대기 |

- 모든 처리에 **처리사유 입력 필수** (`approval-detail.html` textarea)
- 일괄 처리 지원: 체크박스 선택 → "일괄 승인" 또는 "일괄 반려" (`approval.html`)

### 6.7 취소 및 재신청 규칙

> 도출 소스: `application-list.html` 어노테이션, `my-requests.html` 어노테이션

취소 규칙:

- '신청' 상태(승인자 검토 시작 전)인 건에만 취소 가능
- 검토 시작 후에는 취소 불가
- 취소 시 확인 모달 표시
- 취소된 건은 감사 추적에 기록, 복구 불가능

재신청 규칙:

- '피드백대기' 상태: "수정/재신청" 버튼 → 기존 내용 사전 입력된 폼으로 이동 → 수정 후 새 신청 건 생성, 원본 건은 '피드백반영' 상태로 변경
- '반려' 상태: "재신청" 버튼 → 동일하게 새 신청 건 생성

---

## 7. 화면 명세서

### 7.1 인증

#### 7.1.1 로그인 (login.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-AUTH-001 |
| **파일** | `login.html` |
| **레이아웃** | Split-screen (좌 55% 브랜딩 / 우 45% 폼), 사이드바 없음 |

주요 컴포넌트:

- 좌측 패널: 브랜딩 (Codex 로고, "Enterprise Standard Platform", 3-column feature 카드)
- 우측 패널: 로그인 폼

폼 필드:

| 필드 | 타입 | 필수 | 설명 |
| ------ | ------ | ------ | ------ |
| 사용자 아이디 | text | Y | placeholder: "사용자 아이디를 입력하세요" |
| 비밀번호 | password | Y | placeholder: "비밀번호를 입력하세요" |

비즈니스 로직:

- 웹 버전은 모든 사용자에게 인증 필수 (비인증 브라우징 불가)
- 서버사이드 세션 관리, 비활성 시 자동 로그아웃
- 로그인 후 사이드바 footer에 사용자명, 역할, 로그아웃 버튼 표시

데이터 요구사항:

- `POST /api/auth/login` — 인증 처리
- `POST /api/auth/logout` — 로그아웃
- `GET /api/auth/session` — 세션 확인

네비게이션:

- 로그인 성공 → `dashboard.html`
- 하단 링크: 환경설정(`db-settings.html`), 지원 요청, 접속 관리

---

### 7.2 대시보드

#### 7.2.1 메인 대시보드 (dashboard.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-DASH-001 |
| **파일** | `dashboard.html` |
| **레이아웃** | sidebar + main (표준 레이아웃) |

주요 컴포넌트:

1. **Stat 카드 (4개 그리드)**
   - 표준단어: 2,847건 (↑+124 월대비)
   - 표준도메인: 156건 (↑+8 월대비)
   - 표준용어: 4,521건 (↑+203 월대비)
   - 승인대기: 12건 (표준단어 5, 표준도메인 2, 표준용어 3, 공통코드 2 / 최장 12일)

2. **최근 활동 타임라인** (좌측 카드)
   - 5건 표시, 시간순 정렬
   - 각 항목: 타임스탬프 + 액션 배지(신청/승인/반려) + 사용자명 + 설명
   - "전체 이력 보기 →" 링크 → `audit-trail.html`

3. **표준 등록 추이 차트** (우측 카드)
   - 6개월 바 차트 (10월~3월)

데이터 요구사항:

- `GET /api/dashboard/stats` — 표준 건수 통계
- `GET /api/dashboard/pending` — 승인 대기 건수
- `GET /api/dashboard/recent-activity` — 최근 활동 목록
- `GET /api/dashboard/trend` — 월별 등록 추이

역할별 가시성:

- 관리자: 전체 시스템 현황
- 승인자: 승인 대기 강조
- 신청자: 본인 신청 현황
- 조회전용: 표준 현황 요약만

---

### 7.3 표준 검색

#### 7.3.1 표준단어 조회 (standard-word-search.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-SEARCH-001 |
| **파일** | `standard-word-search.html` |
| **진입** | 사이드바 "표준 검색 > 표준단어 조회" |

필터:

| 필드 | 타입 | 옵션 |
| ------ | ------ | ------ |
| 키워드 | search | "단어, 영문약어, 영문명으로 검색" |
| 상태 | select | 전체, 기존, 신청, 삭제 |

테이블 컬럼:

| 컬럼 | 데이터 소스 | 표시 형태 |
| ------ | ----------- | ---------- |
| No | 행 번호 | 숫자 |
| 표준단어 | STD_WORD.WORD_NAME | 텍스트 |
| 영문약어 | STD_WORD.ABBR_NAME | `td-mono` |
| 영문명 | STD_WORD.ENG_NAME | 텍스트 |
| 정의 | STD_WORD.DEFINITION | 텍스트 (말줄임) |
| 도메인유형 | STD_WORD.DOMAIN_TYPE | 텍스트 |
| 상태 | STD_WORD.STATUS | 배지 (기존=녹, 신청=주황, 삭제=적) |
| 등록일 | STD_WORD.REG_DATE | 날짜 |
| 상세 | - | 링크 → `standard-word-detail.html` |

**페이지네이션:** 10건/페이지, 총 2,847건

데이터 요구사항:

- `GET /api/standards/words?keyword=&status=&page=&size=10`

#### 7.3.2 표준단어 상세 (standard-word-detail.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-SEARCH-002 |
| **파일** | `standard-word-detail.html` |
| **진입** | 검색 결과 테이블 "상세" 링크 |

주요 컴포넌트:

1. **기본 정보 카드**: 단어명, 영문약어, 영문명, 정의, 도메인유형, 상태, 등록일, 최종수정일
2. **관련 용어 테이블**: 이 단어를 사용하는 용어 목록 (용어명, 물리명, 상태)
3. **변경 이력 타임라인**: 시간순 이력 (타임스탬프, 액션배지, 수행자, 설명)

액션 버튼:

- "변경 신청" (btn-primary) → `standard-word-apply.html` (변경 탭)
- "삭제 신청" (btn-cancel) → `request-delete-impact.html`

역할별 가시성:

- 조회전용: 기본 정보 + 관련 용어 + 변경 이력만 표시, 액션 버튼 숨김

데이터 요구사항:

- `GET /api/standards/words/{id}` — 상세 정보
- `GET /api/standards/words/{id}/terms` — 관련 용어
- `GET /api/standards/words/{id}/history` — 변경 이력

#### 7.3.3 표준도메인 조회 (standard-domain-search.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-SEARCH-003 |
| **파일** | `standard-domain-search.html` |

필터:

| 필드 | 타입 | 옵션 |
| ------ | ------ | ------ |
| 키워드 | search | "도메인명으로 검색" |
| 도메인유형 | select | 전체, 문자열, 숫자, 일자, 코드(공통코드) |

테이블 컬럼:

| 컬럼 | 데이터 소스 | 표시 형태 |
| ------ | ----------- | ---------- |
| No | 행 번호 | 숫자 |
| 도메인명 | STD_DOMAIN.DOMAIN_NAME | 텍스트 |
| 도메인유형 | STD_DOMAIN.DOMAIN_TYPE | 텍스트 |
| 데이터타입 | STD_DOMAIN.DATA_TYPE | `td-mono` |
| 데이터길이 | STD_DOMAIN.DATA_LENGTH | `td-mono` |
| 정의 | STD_DOMAIN.DEFINITION | 텍스트 |
| 상태 | STD_DOMAIN.STATUS | 배지 |
| 등록일 | STD_DOMAIN.REG_DATE | 날짜 |
| 상세 | - | 링크 → `standard-domain-detail.html` |

**페이지네이션:** 10건/페이지, 총 156건

데이터 요구사항:

- `GET /api/standards/domains?keyword=&domainType=&page=&size=10`

#### 7.3.4 표준도메인 상세 (standard-domain-detail.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-SEARCH-004 |
| **파일** | `standard-domain-detail.html` |

주요 컴포넌트:

1. **기본 정보 카드**: 도메인명, 도메인유형, 데이터타입, 데이터길이, 정의, 상태, 등록일, 최종수정일
2. **관련 용어 테이블**: 이 도메인을 사용하는 용어 (용어명, 물리명, 상태)
3. **변경 이력 타임라인**

**액션 버튼:** "변경 신청" + "삭제 신청"

데이터 요구사항:

- `GET /api/standards/domains/{id}`
- `GET /api/standards/domains/{id}/terms`
- `GET /api/standards/domains/{id}/history`

#### 7.3.5 표준용어 조회 (standard-term-search.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-SEARCH-005 |
| **파일** | `standard-term-search.html` |

필터:

| 필드 | 타입 | 옵션 |
| ------ | ------ | ------ |
| 키워드 | search | "용어명, 물리명으로 검색" |
| 도메인유형 | select | 전체, 문자열, 숫자, 일자, 코드 |
| 상태 | select | 전체, 기존, 신청, 삭제 |

테이블 컬럼:

| 컬럼 | 데이터 소스 | 표시 형태 |
| ------ | ----------- | ---------- |
| No | 행 번호 | 숫자 |
| 표준용어 | STD_TERM.TERM_NAME | 텍스트 |
| 물리명 | STD_TERM.PHYSICAL_NAME | `td-mono` |
| 도메인유형 | STD_TERM.DOMAIN_TYPE | 텍스트 |
| 인포타입 | STD_TERM.INFO_TYPE | 텍스트 |
| 정의 | STD_TERM.DEFINITION | 텍스트 |
| 상태 | STD_TERM.STATUS | 배지 |
| 등록일 | STD_TERM.REG_DATE | 날짜 |
| 상세 | - | 링크 → `standard-term-detail.html` |

**페이지네이션:** 10건/페이지, 총 4,521건

데이터 요구사항:

- `GET /api/standards/terms?keyword=&domainType=&status=&page=&size=10`

#### 7.3.6 표준용어 상세 (standard-term-detail.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-SEARCH-006 |
| **파일** | `standard-term-detail.html` |

주요 컴포넌트:

1. **기본 정보 카드**: 용어명, 물리명, 도메인유형, 인포타입, 정의, 상태, 등록일, 최종수정일
2. **관련 표준 카드**:
   - "구성 단어" 테이블: 단어명, 영문약어, 상태 (예: 고객/CUST, 번호/NO)
   - "사용 도메인" 정보: 도메인명, 데이터타입 (예: 문자열 / VARCHAR(20))
3. **변경 이력 타임라인**

**액션 버튼:** "변경 신청" + "삭제 신청"

데이터 요구사항:

- `GET /api/standards/terms/{id}`
- `GET /api/standards/terms/{id}/words` — 구성 단어
- `GET /api/standards/terms/{id}/domain` — 사용 도메인
- `GET /api/standards/terms/{id}/history`

---

### 7.4 표준 신청

#### 7.4.1 표준단어 신청 (standard-word-apply.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-APPLY-001 |
| **파일** | `standard-word-apply.html` |

**탭 구조:** 신규 신청 / 변경 신청 / 삭제 신청

폼 필드 (신규 신청):

| 필드 | 타입 | 필수 | 검증 | 비고 |
| ------ | ------ | ------ | ------ | ------ |
| 표준단어 | text | Y | - | AI 추천 미니패널 트리거 |
| 영문약어 | text | Y | 영문 대문자 | 힌트: "영문 대문자 약어 (예: CUST, AMT, DT)" |
| 영문명 | text | Y | - | |
| 도메인유형 | select | N | - | 옵션: 문자열/숫자/일자/코드 |
| 정의 | textarea | Y | - | rows: 4 |
| 신청사유 | textarea | N | - | rows: 3 |

AI Data Butler 미니패널:

- 표준단어 입력 필드 아래에 삽입
- 최대 3건 추천 (유사도 %, 상태 배지)
- "AI 추천 전체 보기 →" 링크 → `ai-term-suggest.html`

어노테이션:

- [변경 신청 안내]: 기존 표준단어를 검색·선택한 후 변경 가능. 변경 전/후 비교가 자동 제공됨
- [삭제 신청 안내]: 영향도 평가 완료 필수. 미완료 시 신청 불가. `request-delete-impact.html` 이동

데이터 요구사항:

- `POST /api/requests/words` — 단어 신청
- `GET /api/ai/suggest?keyword=&type=word` — AI 추천

#### 7.4.2 표준도메인 신청 (standard-domain-apply.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-APPLY-002 |
| **파일** | `standard-domain-apply.html` |

폼 필드:

| 필드 | 타입 | 필수 | 비고 |
| ------ | ------ | ------ | ------ |
| 도메인명 | text | Y | AI 추천 미니패널 트리거 |
| 도메인유형 | select | Y | 문자열/숫자/일자/코드(공통코드) |
| 데이터타입 | select | Y | VARCHAR/CHAR/NUMBER/DATE/CLOB/BLOB |
| 데이터길이 | text | N | 힌트: "예: 100 또는 15,2" |
| 정의 | textarea | Y | |
| 신청사유 | textarea | N | |

특수 비즈니스 로직:

- 도메인유형이 '코드(공통코드)'인 경우, 공통코드 관리 화면에서 코드값 등록 가능 (어노테이션 안내)

데이터 요구사항:

- `POST /api/requests/domains`
- `GET /api/ai/suggest?keyword=&type=domain`

#### 7.4.3 표준용어 신청 (standard-term-apply.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-APPLY-003 |
| **파일** | `standard-term-apply.html` |

폼 필드:

| 필드 | 타입 | 필수 | 비고 |
| ------ | ------ | ------ | ------ |
| 표준용어 | text | Y | AI 추천 미니패널 트리거 |
| 물리명 | text (readonly) | - | 영문약어 조합으로 자동 생성 (배경: #f5f7fa) |
| 도메인유형 | select | Y | 문자열/숫자/일자/코드 |
| 인포타입 | select | Y | 사용자명/금액/일자/코드/설명/여부 |
| 정의 | textarea | Y | |
| 신청사유 | textarea | N | |

특수 비즈니스 로직:

- 물리명은 구성 표준단어의 영문약어 + 도메인 인포타입 별칭으로 **자동 생성**

데이터 요구사항:

- `POST /api/requests/terms`
- `GET /api/ai/suggest?keyword=&type=term`
- `GET /api/standards/words/resolve-physical-name` — 물리명 자동 생성

#### 7.4.4 신청 목록 (application-list.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-APPLY-004 |
| **파일** | `application-list.html` |

필터:

| 필드 | 타입 | 옵션 |
| ------ | ------ | ------ |
| 키워드 | search | "신청 항목명으로 검색" |
| 구분 | select | 전체/표준단어/표준도메인/표준용어/공통코드 |
| 요청구분 | select | 전체/신규/변경/삭제 |
| 상태 | select | 전체/신청/검토/승인/반려/취소 |

테이블 컬럼:

| 컬럼 | 설명 |
| ------ | ------ |
| No | 신청번호 (링크 → 역할별 분기: 승인자→승인처리, 신청자→읽기전용 상세) |
| 구분 | 대상 유형 배지 |
| 항목명 | 대상명 |
| 요청구분 | 신규/변경/삭제 |
| 신청자 | 사용자명 |
| 신청일 | 날짜 |
| 상태 | 6종 배지 (신청/검토/승인/반려/취소/피드백대기) |
| 처리일 | 날짜 또는 "-" |
| 액션 | "취소" 버튼 ('신청' 상태에만) |

모달 — 신청 상세:

- 구분, 항목명, 영문약어, 요청구분, 정의, 신청자, 신청일

데이터 요구사항:

- `GET /api/requests?keyword=&targetType=&requestType=&status=&page=&size=10`
- `PATCH /api/requests/{id}/cancel` — 취소 처리

#### 7.4.5 내 신청 목록 (my-requests.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-APPLY-005 |
| **파일** | `my-requests.html` |

Stat 카드 (5개):

- 전체 신청: N건
- 승인 대기: N건
- 피드백대기: N건
- 승인 완료: N건
- 반려: N건

테이블 컬럼:

| 컬럼 | 설명 |
| ------ | ------ |
| 신청번호 | REQ-ID (링크) |
| 구분 | 대상 유형 |
| 대상명 | 항목명 |
| 요청구분 | 신규/변경/삭제 |
| 상태 | 배지 |
| 신청일 | 날짜 |
| 작업 | 상태별 버튼: 신청→취소+상세, 피드백→수정/재신청+상세, 반려→재신청+상세, 승인→상세 |

피드백 상세 카드:

- 검토자, 검토일시, 피드백 내용 표시

데이터 요구사항:

- `GET /api/requests/my?page=&size=10` — 본인 신청 목록
- `GET /api/requests/my/stats` — 상태별 건수
- `GET /api/requests/{id}/feedback` — 피드백 상세

#### 7.4.6 삭제 영향도 평가 (request-delete-impact.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-APPLY-006 |
| **파일** | `request-delete-impact.html` |

폼 섹션:

| 섹션 | 내용 |
| ------ | ------ |
| 1. 삭제 대상 표준 | 읽기전용: 유형, 표준명, 영문약어, 도메인유형, 등록일, 정의 + 경고 메시지 |
| 2. 영향 받는 시스템 | 체크박스 6개 (운영DB, DW, 보고서, API, 외부연동, 기타) + 기타 textarea |
| 3. 영향도 수준 | 라디오 3개 (높음/중간/낮음) + 설명 textarea (필수) |
| 4. 대체 표준 제안 | 검색 입력 + 마이그레이션 계획 textarea |
| 5. 삭제 신청 | 삭제 사유 textarea (필수) + 취소/삭제신청 버튼 |

데이터 요구사항:

- `GET /api/standards/{type}/{id}` — 삭제 대상 정보
- `POST /api/requests/{type}/delete` — 삭제 신청 + 영향도 데이터

---

### 7.5 승인

#### 7.5.1 승인 처리 (approval.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-APPR-001 |
| **파일** | `approval.html` |

Stat 카드 (4개):

- 신청 대기: 5건
- 검토 중: 2건
- 금일 처리: 3건
- 검토요청: 3건

필터:

| 필드 | 타입 | 옵션 |
| ------ | ------ | ------ |
| 키워드 | search | "항목명으로 검색" |
| 구분 | select | 전체/표준단어/표준도메인/표준용어/공통코드 |
| 요청구분 | select | 전체/신규/변경/삭제 |

**테이블 컬럼:** 체크박스 + No + 구분 + 항목명(링크) + 요청구분 + 신청자 + 신청일 + 상태 + 액션(승인/반려/검토)

**일괄 처리:** 선택 항목 일괄 승인/일괄 반려

처리 모달:

- 항목 정보: 항목명, 요청구분, 신청자
- 처리 옵션: 승인/반려/검토 (라디오 카드)
- 처리사유 (textarea, 필수)
- 취소/처리 버튼

핵심 규칙:

- 자신이 신청한 건은 목록에서 자동 제외 (신청자/승인자 분리)
- '검토' 상태인 건은 검토 버튼 미표시 (이미 검토 중)

데이터 요구사항:

- `GET /api/approvals?keyword=&targetType=&requestType=&page=&size=10`
- `GET /api/approvals/stats`
- `POST /api/approvals/{id}/process` — body: { action, reason }
- `POST /api/approvals/batch` — body: { ids[], action, reason }

#### 7.5.2 신청 상세 (approval-detail.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-APPR-002 |
| **파일** | `approval-detail.html` |

카드 구성:

1. **신청 개요**: 신청ID(mono), 요청구분 배지, 대상유형, 항목명, 신청자, 신청일
2. **변경 내용 비교** (변경 신청 시): 항목 / 현재값 / 변경요청값 (변경 셀 강조)
3. **신청 사유**: 텍스트 블록
4. **처리 이력 타임라인**: 시간순 상태 전환 기록

액션 바:

- 처리사유 textarea (필수)
- 승인 버튼 (primary) + 반려 버튼 (btn-cancel) + 검토요청 버튼 (secondary)
- 안내: "자신이 신청한 건은 승인할 수 없습니다"

데이터 요구사항:

- `GET /api/approvals/{id}` — 신청 상세
- `GET /api/approvals/{id}/changes` — 변경 비교
- `GET /api/approvals/{id}/history` — 처리 이력
- `POST /api/approvals/{id}/process` — 승인/반려/검토요청

---

### 7.6 표준 검증

#### 7.6.1 검증 대시보드 (standard-validation.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-VALID-001 |
| **파일** | `standard-validation.html` |

Stat 카드 (4개):

- 총 위반: 127건 (적색, ↓-23건 월대비)
- 명명규칙 위반: 54건 (주황, 42.5%)
- 금칙어 사용: 31건 (청색, 24.4%)
- 중복 등록: 42건 (보라, 33.1%)

차트/테이블:

1. 월별 위반 추이 (바 차트, 6개월)
2. 검증 규칙별 위반 현황 (테이블: 규칙명, 위반수, 심각도배지, 상세링크)
3. 최근 검증 이력 (테이블: 실행일시, 대상범위, 규칙수, 검사항목수, 위반건수, 결과배지, 실행자)

검증 규칙:

| 규칙 | 설명 | 심각도 |
| ------ | ------ | -------- |
| 영문약어 대문자 규칙 | 약어가 대문자 규칙을 위반 | 높음 |
| 중복 표준단어 검출 | 유사도 높은 기존 표준 존재 | 중간 |
| 금칙어 사용 검출 | 사용 금지 단어 포함 | 중간 |
| 필수 항목 미입력 | 필수 메타데이터 누락 | 낮음 |
| 길이 제한 초과 | 데이터 길이 규격 초과 | 낮음 |

**Topbar 액션:** "전체 검증 실행" (primary) + "엑셀 다운로드" (secondary)

데이터 요구사항:

- `GET /api/validations/summary` — 위반 통계
- `GET /api/validations/trend` — 월별 추이
- `GET /api/validations/rules` — 규칙별 현황
- `GET /api/validations/history` — 검증 이력
- `POST /api/validations/execute` — 전체 검증 실행

#### 7.6.2 검증 실행/상세 (standard-validation-detail.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-VALID-002 |
| **파일** | `standard-validation-detail.html` |

**탭:** 전체(127) / 명명규칙(54) / 금칙어(31) / 중복(42) / 필수항목(16) / 길이제한(8)

필터:

| 필드 | 타입 | 옵션 |
| ------ | ------ | ------ |
| 대상 유형 | select | 전체/표준단어/표준도메인/표준용어 |
| 심각도 | select | 전체/높음/중간/낮음 |
| 키워드 | search | 검색 |

위반 목록 테이블:

| 컬럼 | 설명 |
| ------ | ------ |
| 체크박스 | 일괄 시정 선택 |
| 대상 | 유형 배지 (단어/도메인/용어) |
| 항목명 | 표준명 |
| 위반 규칙 | 규칙명 |
| 위반 내용 | 상세 설명 (예: "payAmt → PAY_AMT 권장") |
| 심각도 | 배지 (높음=적/중간=주황/낮음=청) |
| 상태 | 배지 (미처리=회/시정중=청/완료=녹) |
| 상세 | 링크 → 해당 표준 상세 화면 |

**일괄 시정 신청:** 체크박스 선택 → "일괄 시정 신청" → 변경 신청 자동 생성

데이터 요구사항:

- `GET /api/validations/violations?ruleType=&targetType=&severity=&keyword=&page=&size=10`
- `POST /api/validations/violations/batch-correct` — 일괄 시정

---

### 7.7 AI 추천

#### 7.7.1 AI 표준용어 추천 (ai-term-suggest.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-AI-001 |
| **파일** | `ai-term-suggest.html` |

히어로 검색 영역:

- 그라디언트 배경 (#e8f0fe → #f3e8ff)
- "Data Butler" 라벨 (보라색 #7c3aed)
- 검색 입력 + 유형 드롭다운 (전체/단어/도메인/용어) + "추천 검색" 버튼

좌측 패널 — 추천 결과:

- 유사도 순 정렬, 각 항목: 표준명 + 영문약어(mono) + 유사도% 배지 + 상태배지 + 유형배지
- 유사도 색상: 80%↑ 파랑, 50-80% 주황, 50%↓ 회색
- 선택 시 좌측 border-left accent + 배경색

우측 패널 — 선택 상세:

- 기본 정보: 표준명, 영문약어, 영문명, 정의
- AI 매칭 근거 (보라색 카드): 음절 유사도 %, 의미 유사도 %, 약어 패턴 매칭 %
- 액션: "상세 보기" (→ detail) + "그래도 신규 신청" (→ apply)
- 중복 경고: 승인됨 표준과 유사 시 주황 경고 박스

데이터 요구사항:

- `GET /api/ai/suggest?keyword=&type=&limit=5` — AI 추천 검색
- `GET /api/ai/suggest/{id}/match-detail` — 매칭 근거 상세

---

### 7.8 거버넌스

#### 7.8.1 거버넌스 포털 (governance-portal.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-GOV-001 |
| **파일** | `governance-portal.html` |

주요 컴포넌트:

1. **게이지 차트 (3개 SVG 원형)**
   - 표준단어 준수율: 87% (파랑 #3574f0), 2,478/2,847, ▲2.3%
   - 표준도메인 준수율: 92% (녹색 #1e8e3e), 184/200, ▲1.1%
   - 표준용어 준수율: 79% (주황 #e37400), 1,264/1,600, ▼0.4%

2. **KPI 카드 (4개)**
   - 신청 처리율: 94.2% (파랑)
   - 평균 승인 소요: 2.3일 (녹, 목표: 3일 이내)
   - 반려율: 8.7% (주황, 전월 대비 -1.2%p)
   - 검증 위반: 127건 (보라, 검증 대시보드 링크)

3. **월별 표준화율 추이** (3색 그룹 바 차트, 6개월)
4. **부서별 준수율 랭킹** (프로그레스 바, 90%↑녹, 80-90%파랑, 70-80%주황, 70%↓적)
5. **미준수 항목 Top 10 테이블**: 순위, 항목명, 유형배지, 위반사유, 소속부서, 미준수기간(mono)

**Topbar 액션:** 기준일 표시 + "PDF 리포트" (secondary)

**표준화율 계산:** (승인된 표준 수 / 전체 등록 표준 수) × 100

데이터 요구사항:

- `GET /api/governance/compliance` — 준수율 게이지
- `GET /api/governance/kpi` — KPI 카드
- `GET /api/governance/trend` — 월별 추이
- `GET /api/governance/department-ranking` — 부서별 랭킹
- `GET /api/governance/non-compliant?limit=10` — 미준수 Top 10
- `GET /api/governance/report/pdf` — PDF 리포트 생성

---

### 7.9 감사

#### 7.9.1 감사 추적 (audit-trail.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-AUDIT-001 |
| **파일** | `audit-trail.html` |

고급 필터:

| 필드 | 타입 | 옵션 |
| ------ | ------ | ------ |
| 대상 유형 | select | 전체/표준단어/표준도메인/표준용어/공통코드 |
| 키워드 | search | "표준명 또는 ID 입력" |
| 기간 | date-range | from~to |
| 작업 유형 | select | 전체/신청/검토/승인/반려/취소 |
| 처리자 | text | "사용자명" |

감사 결과 테이블:

| 컬럼 | 설명 |
| ------ | ------ |
| 일시 | TIMESTAMP (mono) |
| 대상 | 표준명 + 유형 배지 |
| 작업 | 액션 배지 (신청/검토/승인/반려/취소) |
| 상태 변경 | "이전상태 → 이후상태" 형태 |
| 처리자 | 사용자명 + (역할) |
| 사유/코멘트 | 텍스트 |

상세 이력 패널:

- 행 클릭 → 해당 표준의 전체 타임라인 표시
- 각 이력: 액션배지, 수행자, 일시, 상태변경, 사유, 메타데이터(신청ID, 약어 등)

**페이지네이션:** 10건/페이지, 총 48건

데이터 요구사항:

- `GET /api/audit?targetType=&keyword=&from=&to=&actionType=&actor=&page=&size=10`
- `GET /api/audit/item/{targetType}/{targetId}` — 항목별 전체 이력

---

### 7.10 공통코드

#### 7.10.1 공통코드 관리 (common-code.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-CODE-001 |
| **파일** | `common-code.html` |

**레이아웃:** 좌우 분할 (좌 320px 코드그룹 / 우 상세코드)

좌측 — 코드그룹 목록:

- 검색 입력 ("코드그룹 검색")
- 그룹 리스트: 그룹명 + 코드 건수
- "코드그룹 추가" 버튼

우측 — 상세 코드 테이블:

| 컬럼 | 설명 |
| ------ | ------ |
| No | 행 번호 |
| 코드 | 코드값 (예: TRD001) |
| 코드명 | 코드 표시명 (예: 매매) |
| 설명 | 코드 설명 |
| 상태 | 배지 (기존/신청) |
| 등록일 | 날짜 |

핵심 비즈니스 로직:

- 공통코드는 '코드(공통코드)' 도메인유형에 기반, 해당 도메인이 먼저 승인되어야 함
- CRUD 버튼은 직접 수정이 아닌 **거버넌스 요청 생성** (신청→검토→승인→발행)
- Data Steward 역할이 관리 담당

데이터 요구사항:

- `GET /api/common-codes/groups` — 그룹 목록
- `GET /api/common-codes/groups/{groupId}/codes` — 그룹 내 코드
- `POST /api/requests/common-codes` — 코드 등록 신청

#### 7.10.2 공통코드 조회 (common-code-search.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-CODE-002 |
| **파일** | `common-code-search.html` |

**읽기전용 화면** — 모든 사용자 접근 가능

필터:

| 필드 | 타입 | 옵션 |
| ------ | ------ | ------ |
| 키워드 | search | "코드그룹명, 그룹코드, 코드명, 코드로 검색" |
| 도메인유형 | select | 전체 도메인유형/코드(공통코드)/번호/문자열 |

테이블 컬럼:

| 컬럼 | 설명 |
| ------ | ------ |
| No | 행 번호 |
| 코드그룹명 | 그룹명 |
| 그룹코드 | 영문 그룹코드 (예: TRADE_TYPE) |
| 코드 | 코드값 (예: TRD001) |
| 코드명 | 표시명 |
| 설명 | 코드 설명 |
| 사용여부 | Y(녹색) / N(회색) 배지 |

**페이지네이션:** 10건/페이지, 총 76건

데이터 요구사항:

- `GET /api/common-codes/search?keyword=&domainType=&page=&size=10`

---

### 7.11 시스템 관리

#### 7.11.1 사용자 관리 (user-management.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-ADMIN-001 |
| **파일** | `user-management.html` |

Stat 카드 (3개):

- 전체 사용자: 24명
- 관리자: 3명
- 일반 사용자: 21명

**필터:** 키워드 검색 + 역할 드롭다운 (전체/관리자/일반사용자)

**테이블 컬럼:** No, 사용자ID, 이름, 역할, 부서, 이메일, 최종로그인, 상태(활성/비활성), 액션(수정/삭제)

사용자 추가 모달:

| 필드 | 타입 | 필수 |
| ------ | ------ | ------ |
| 사용자ID | text | Y |
| 이름 | text | Y |
| 비밀번호 | password | Y |
| 역할 | select (일반사용자/관리자) | N |
| 부서 | text | N |
| 이메일 | email | N |

데이터 요구사항:

- `GET /api/users?keyword=&role=&page=&size=10`
- `POST /api/users` — 사용자 생성
- `PUT /api/users/{id}` — 사용자 수정
- `DELETE /api/users/{id}` — 사용자 삭제

#### 7.11.2 메뉴 권한 관리 (menu-permission.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-ADMIN-002 |
| **파일** | `menu-permission.html` |

**레이아웃:** 좌우 분할 (좌: 메뉴 트리 / 우: 권한 상세)

**역할 탭:** 관리자 / 일반사용자 / 게스트

좌측 — 메뉴 트리:

- 계층 구조 체크박스 (상위 선택 시 하위 자동 선택)
- 메뉴: 대시보드, 표준검색(3), 표준신청(4), 승인(1), 관리(4), 설정(1) = 15개

우측 — 권한 상세 테이블:

- 접근 가능 메뉴 N/15개 표시
- 메뉴별 CRUD 체크박스 (조회/등록/수정/삭제)

데이터 요구사항:

- `GET /api/permissions/{role}` — 역할별 권한
- `PUT /api/permissions/{role}` — 권한 저장

#### 7.11.3 시스템 코드 관리 (system-code.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-ADMIN-003 |
| **파일** | `system-code.html` |

**탭:** 도메인유형 / 표준상태코드 / 요청구분코드

**테이블 컬럼:** No, 보호(배지), 코드, 코드명, 설명, 변경가능(불가=적/가능=녹), 등록일

도메인유형 코드:

| 코드 | 코드명 | 보호 |
| ------ | -------- | ------ |
| STR | 문자열 | Y |
| NUM | 숫자 | Y |
| DT | 일자 | Y |
| CD | 코드(공통코드) | Y |
| LOB | 대용량 | N |

보호 코드 정책:

- 도메인유형, 표준상태코드, 요청구분코드는 보호 상태
- 보호 코드는 수정/삭제 불가 — 워크플로우 무결성 보장

데이터 요구사항:

- `GET /api/system-codes?category={tab}`
- `POST /api/system-codes` — 코드 추가
- `PUT /api/system-codes/{id}` — 코드 수정 (비보호만)
- `DELETE /api/system-codes/{id}` — 코드 삭제 (비보호만)

---

### 7.12 설정

#### 7.12.1 DB 접속/SSH 터널링 설정 (db-settings.html)

| 항목 | 내용 |
| ------ | ------ |
| **화면 ID** | SCR-SET-001 |
| **파일** | `db-settings.html` |

카드 1 — 표준관리 DB 접속 정보:

| 필드 | 타입 | 값 예시 |
| ------ | ------ | --------- |
| DB 유형 | select | Oracle, PostgreSQL, MySQL, MSSQL |
| 호스트 | text | 192.168.1.100 |
| 포트 | text | 1521 |
| 데이터베이스/SID | text | METAFORGE |
| 사용자명 | text | meta_admin |
| 비밀번호 | password | (암호화) |
| 스키마 | text | META_STD |
| 문자셋 | select | UTF-8, EUC-KR, ASCII |

- "접속 테스트" 버튼 → 성공 시 녹색 어노테이션 ("Oracle 19c, 응답시간 23ms")
- "저장" 버튼

카드 2 — SSH 터널링:

- SSH 터널링 사용 토글
- SSH 호스트, SSH 포트, SSH 사용자명, 인증방식 (비밀번호/SSH 키), SSH 비밀번호
- "터널링 테스트" + "저장" 버튼

카드 3 — 접속정보 관리:

- XML 내보내기 / XML 가져오기 버튼

데이터 요구사항:

- `GET /api/settings/db` — 현재 접속 정보
- `PUT /api/settings/db` — 접속 정보 저장
- `POST /api/settings/db/test` — 접속 테스트
- `GET /api/settings/ssh` — SSH 설정
- `PUT /api/settings/ssh` — SSH 설정 저장
- `POST /api/settings/ssh/test` — 터널링 테스트
- `GET /api/settings/export` — XML 내보내기
- `POST /api/settings/import` — XML 가져오기

---

## 8. API 명세 개요

### 8.1 공통 규격

- **Base URL**: `/api`
- **인증**: 세션 기반 (로그인 후 쿠키/토큰)
- **응답 포맷**: JSON
- **페이지네이션**: `?page=1&size=10` → `{ items: [], total: N, page: N, totalPages: N }`
- **에러 응답**: `{ error: { code: "ERR_CODE", message: "설명" } }`

### 8.2 인증 API

| Method | Path | 설명 | 요청 | 응답 |
| -------- | ------ | ------ | ------ | ------ |
| POST | `/api/auth/login` | 로그인 | `{ loginId, password }` | `{ user, token }` |
| POST | `/api/auth/logout` | 로그아웃 | - | `{ success }` |
| GET | `/api/auth/session` | 세션 확인 | - | `{ user, role }` |

### 8.3 대시보드 API

| Method | Path | 설명 |
| -------- | ------ | ------ |
| GET | `/api/dashboard/stats` | 표준 건수 통계 (단어/도메인/용어 수, 월대비 증감) |
| GET | `/api/dashboard/pending` | 승인 대기 건수 (유형별 내역) |
| GET | `/api/dashboard/recent-activity` | 최근 활동 5건 |
| GET | `/api/dashboard/trend` | 월별 등록 추이 (6개월) |

### 8.4 표준 검색 API

| Method | Path | 설명 | 파라미터 |
| -------- | ------ | ------ | --------- |
| GET | `/api/standards/words` | 표준단어 목록 | `keyword, status, page, size` |
| GET | `/api/standards/words/{id}` | 표준단어 상세 | - |
| GET | `/api/standards/words/{id}/terms` | 관련 용어 | - |
| GET | `/api/standards/words/{id}/history` | 변경 이력 | - |
| GET | `/api/standards/domains` | 표준도메인 목록 | `keyword, domainType, page, size` |
| GET | `/api/standards/domains/{id}` | 표준도메인 상세 | - |
| GET | `/api/standards/domains/{id}/terms` | 관련 용어 | - |
| GET | `/api/standards/domains/{id}/history` | 변경 이력 | - |
| GET | `/api/standards/terms` | 표준용어 목록 | `keyword, domainType, status, page, size` |
| GET | `/api/standards/terms/{id}` | 표준용어 상세 | - |
| GET | `/api/standards/terms/{id}/words` | 구성 단어 | - |
| GET | `/api/standards/terms/{id}/domain` | 사용 도메인 | - |
| GET | `/api/standards/terms/{id}/history` | 변경 이력 | - |

### 8.5 표준 신청 API

| Method | Path | 설명 | 요청 Body |
| -------- | ------ | ------ | ---------- |
| POST | `/api/requests/words` | 표준단어 신청 | `{ wordName, abbrName, engName, definition, domainType, requestType, reason }` |
| POST | `/api/requests/domains` | 표준도메인 신청 | `{ domainName, domainType, dataType, dataLength, definition, requestType, reason }` |
| POST | `/api/requests/terms` | 표준용어 신청 | `{ termName, domainType, infoType, definition, requestType, reason }` |
| POST | `/api/requests/common-codes` | 공통코드 신청 | `{ groupId, code, codeName, description, requestType, reason }` |
| GET | `/api/requests` | 전체 신청 목록 | 파라미터: `keyword, targetType, requestType, status, page, size` |
| GET | `/api/requests/my` | 내 신청 목록 | 파라미터: `page, size` |
| GET | `/api/requests/my/stats` | 내 신청 상태별 통계 | - |
| GET | `/api/requests/{id}` | 신청 상세 | - |
| GET | `/api/requests/{id}/feedback` | 피드백 상세 | - |
| PATCH | `/api/requests/{id}/cancel` | 신청 취소 | - (상태=신청일 때만) |

### 8.6 삭제 영향도 API

| Method | Path | 설명 | 요청 Body |
| -------- | ------ | ------ | ---------- |
| GET | `/api/standards/{type}/{id}` | 삭제 대상 정보 | - |
| POST | `/api/requests/{type}/delete` | 삭제 신청 + 영향도 | `{ targetId, affectedSystems[], impactLevel, impactDesc, altStandard, migrationPlan, deleteReason }` |

### 8.7 승인 처리 API

| Method | Path | 설명 | 요청 Body |
| -------- | ------ | ------ | ---------- |
| GET | `/api/approvals` | 승인 대기 목록 | 파라미터: `keyword, targetType, requestType, page, size` |
| GET | `/api/approvals/stats` | 승인 통계 (대기/검토/처리/요청) | - |
| GET | `/api/approvals/{id}` | 신청 상세 (승인 뷰) | - |
| GET | `/api/approvals/{id}/changes` | 변경 전후 비교 | - |
| GET | `/api/approvals/{id}/history` | 처리 이력 | - |
| POST | `/api/approvals/{id}/process` | 승인/반려/검토요청 | `{ action: one of "approve", "reject", "review", reason }` |
| POST | `/api/approvals/batch` | 일괄 처리 | `{ ids[], action, reason }` |

### 8.8 감사 추적 API

| Method | Path | 설명 | 파라미터 |
| -------- | ------ | ------ | --------- |
| GET | `/api/audit` | 감사 이력 조회 | `targetType, keyword, from, to, actionType, actor, page, size` |
| GET | `/api/audit/item/{targetType}/{targetId}` | 항목별 전체 이력 타임라인 | - |

### 8.9 표준 검증 API

| Method | Path | 설명 |
| -------- | ------ | ------ |
| GET | `/api/validations/summary` | 위반 통계 (유형별 건수) |
| GET | `/api/validations/trend` | 월별 위반 추이 |
| GET | `/api/validations/rules` | 규칙별 위반 현황 |
| GET | `/api/validations/history` | 검증 실행 이력 |
| POST | `/api/validations/execute` | 전체/유형별 검증 실행 |
| GET | `/api/validations/violations` | 위반 항목 목록 (파라미터: `ruleType, targetType, severity, keyword, page, size`) |
| POST | `/api/validations/violations/batch-correct` | 일괄 시정 신청 (`{ violationIds[] }`) |

### 8.10 AI 추천 API

| Method | Path | 설명 | 파라미터/Body |
| -------- | ------ | ------ | ------------- |
| GET | `/api/ai/suggest` | AI 유사 표준 추천 | `keyword, type(word/domain/term), limit` |
| GET | `/api/ai/suggest/{id}/match-detail` | 매칭 근거 상세 | - |

AI 추천 응답 구조:

```json
{
  "results": [
    {
      "id": 847,
      "name": "고객번호",
      "abbrName": "CUST_NO",
      "type": "word",
      "status": "APPROVED",
      "similarity": 92,
      "matchReasons": {
        "syllable": 100,
        "semantic": 95,
        "pattern": 88
      }
    }
  ]
}
```

### 8.11 거버넌스 API

| Method | Path | 설명 |
| -------- | ------ | ------ |
| GET | `/api/governance/compliance` | 유형별 준수율 게이지 (단어/도메인/용어 %) |
| GET | `/api/governance/kpi` | KPI 지표 (처리율, 승인소요, 반려율, 위반건수) |
| GET | `/api/governance/trend` | 월별 표준화율 추이 (3색) |
| GET | `/api/governance/department-ranking` | 부서별 준수율 랭킹 |
| GET | `/api/governance/non-compliant` | 미준수 항목 Top N (`limit` 파라미터) |
| GET | `/api/governance/report/pdf` | PDF 리포트 생성 |

### 8.12 공통코드 API

| Method | Path | 설명 |
| -------- | ------ | ------ |
| GET | `/api/common-codes/groups` | 코드그룹 목록 |
| GET | `/api/common-codes/groups/{id}/codes` | 그룹 내 코드 목록 |
| GET | `/api/common-codes/search` | 공통코드 통합 검색 (`keyword, domainType, page, size`) |

### 8.13 사용자 관리 API

| Method | Path | 설명 |
| -------- | ------ | ------ |
| GET | `/api/users` | 사용자 목록 (`keyword, role, page, size`) |
| POST | `/api/users` | 사용자 생성 |
| PUT | `/api/users/{id}` | 사용자 수정 |
| DELETE | `/api/users/{id}` | 사용자 삭제 |

### 8.14 권한 관리 API

| Method | Path | 설명 |
| -------- | ------ | ------ |
| GET | `/api/permissions/{role}` | 역할별 메뉴 권한 조회 |
| PUT | `/api/permissions/{role}` | 역할별 메뉴 권한 저장 |

### 8.15 시스템 코드 API

| Method | Path | 설명 |
| -------- | ------ | ------ |
| GET | `/api/system-codes` | 시스템 코드 조회 (`category` 파라미터) |
| POST | `/api/system-codes` | 코드 추가 (비보호만) |
| PUT | `/api/system-codes/{id}` | 코드 수정 (비보호만) |
| DELETE | `/api/system-codes/{id}` | 코드 삭제 (비보호만) |

### 8.16 DB 설정 API

| Method | Path | 설명 |
| -------- | ------ | ------ |
| GET | `/api/settings/db` | DB 접속 정보 조회 |
| PUT | `/api/settings/db` | DB 접속 정보 저장 |
| POST | `/api/settings/db/test` | 접속 테스트 |
| GET | `/api/settings/ssh` | SSH 설정 조회 |
| PUT | `/api/settings/ssh` | SSH 설정 저장 |
| POST | `/api/settings/ssh/test` | SSH 터널링 테스트 |
| GET | `/api/settings/export` | 접속정보 XML 내보내기 |
| POST | `/api/settings/import` | 접속정보 XML 가져오기 |

### 8.17 API 엔드포인트 총괄

| 카테고리 | 엔드포인트 수 |
| --------- | :----------: |
| 인증 | 3 |
| 대시보드 | 4 |
| 표준 검색 (단어) | 4 |
| 표준 검색 (도메인) | 4 |
| 표준 검색 (용어) | 5 |
| 표준 신청 | 10 |
| 삭제 영향도 | 2 |
| 승인 처리 | 7 |
| 감사 추적 | 2 |
| 표준 검증 | 7 |
| AI 추천 | 2 |
| 거버넌스 | 6 |
| 공통코드 | 3 |
| 사용자 관리 | 4 |
| 권한 관리 | 2 |
| 시스템 코드 | 4 |
| DB 설정 | 8 |
| **합계** | **77** |

---

## 9. 비즈니스 규칙

### 9.1 거버넌스 규칙

| 규칙 ID | 규칙 | 설명 | 소스 |
| --------- | ------ | ------ | ------ |
| GOV-001 | 거버넌스 파이프라인 필수 | 모든 표준(단어/도메인/용어/공통코드) 변경은 신청→검토→승인→발행 파이프라인을 거친다. 직접 수정 불가 | `common-code.html` 어노테이션 |
| GOV-002 | 신청자/승인자 분리 | 신청자가 자신의 신청 건을 승인할 수 없다. 승인 대기 목록에서 자동 제외 | `approval.html` 어노테이션 |
| GOV-003 | 취소 시점 제한 | 취소는 '신청' 상태(검토 시작 전)에만 가능. 검토 시작 후 취소 불가 | `application-list.html` 어노테이션 |
| GOV-004 | 취소 비가역성 | 취소된 건은 복구 불가능. 감사 추적에 기록됨 | `my-requests.html` 어노테이션 |
| GOV-005 | 처리사유 필수 | 승인/반려/검토요청 시 처리사유 입력 필수 | `approval-detail.html` 어노테이션, textarea required |
| GOV-006 | 감사 추적 자동 기록 | 모든 상태 전환(신청/검토/승인/반려/취소)은 감사 추적에 자동 기록 | `audit-trail.html` 어노테이션 |
| GOV-007 | 재신청 새 건 생성 | 피드백 후 수정/재신청 시 새 신청 건 생성. 원본은 '피드백반영' 상태로 변경 | `my-requests.html` 어노테이션 |
| GOV-008 | 공통코드 도메인 의존 | 공통코드 등록 시 '코드(공통코드)' 도메인유형이 먼저 승인되어 있어야 함 | `common-code.html` 어노테이션 |

### 9.2 입력 검증 규칙

| 규칙 ID | 규칙 | 적용 대상 | 소스 |
| --------- | ------ | ---------- | ------ |
| VAL-001 | 영문약어 대문자 | 표준단어 영문약어 필드 | `standard-word-apply.html` 힌트, 검증 규칙 |
| VAL-002 | 필수 필드 검증 | 각 신청 폼의 * 표시 필드 | 신청 폼 required 마커 |
| VAL-003 | 삭제 영향도 필수 | 삭제 신청 시 영향도 평가 완료 필수 | `standard-word-apply.html` 삭제 탭 어노테이션 |
| VAL-004 | 삭제 사유 필수 | 삭제 신청 시 사유 입력 필수 | `request-delete-impact.html` textarea required |
| VAL-005 | 물리명 자동 생성 | 표준용어 물리명은 구성 단어 약어 + 인포타입 별칭으로 자동 생성 (수동 입력 불가) | `standard-term-apply.html` readonly 필드 |

### 9.3 시스템 코드 보호 정책

> 도출 소스: `system-code.html` 어노테이션

| 보호 대상 | 코드 예시 | 보호 이유 |
| ---------- | ---------- | ---------- |
| 도메인유형 | STR, NUM, DT, CD | 표준 엔티티의 데이터타입 분류 기반 |
| 표준상태코드 | (미등록, 신청, 검토, 승인 등) | 거버넌스 워크플로우 상태 머신 기반 |
| 요청구분코드 | (신규, 변경, 삭제) | 신청 프로세스 분류 기반 |

- 보호 코드는 수정/삭제 **불가** — 워크플로우 무결성 보장
- 비보호 코드(예: LOB)만 추가/수정/삭제 가능

### 9.4 검증 규칙 상세

> 도출 소스: `standard-validation.html`, `standard-validation-detail.html`

| 규칙명 | 심각도 | 검증 내용 | 시정 방법 |
| -------- | -------- | ---------- | ---------- |
| 영문약어 대문자 규칙 | 높음 | 영문약어가 대문자_언더스코어 규칙 위반 | 약어 변경 신청 (예: payAmt → PAY_AMT) |
| 중복 표준단어 검출 | 중간 | 유사도 높은(70%↑) 기존 표준 존재 | 기존 표준 사용 또는 정의 차별화 |
| 금칙어 사용 검출 | 중간 | 사용 금지 단어 포함 (예: "코드" → "유형" 권장) | 명칭 변경 신청 |
| 필수 항목 미입력 | 낮음 | 인포타입 등 필수 메타데이터 누락 | 변경 신청으로 보완 |
| 길이 제한 초과 | 낮음 | 데이터 길이 규격 초과 | 도메인 재설정 |

### 9.5 AI 추천 비즈니스 로직

> 도출 소스: `ai-term-suggest.html`

| 매칭 유형 | 설명 | 가중치 |
| ---------- | ------ | -------- |
| 음절 유사도 | 한국어 이름의 음절 레벨 비교 | 높음 |
| 의미 유사도 | 동일/유사 개념 판별 | 높음 |
| 약어 패턴 | 영문약어 패턴 매칭 | 중간 |

- **중복 경고**: 승인된 표준과 80%↑ 유사 시 주황 경고 박스 표시
- **미니 패널**: 신청 폼에서 최대 3건 추천, 전체 보기 링크 제공
- **결과 정렬**: 유사도 내림차순

---

## 10. 비기능 요구사항

### 10.1 보안

| 요구사항 | 상세 | 소스 |
| --------- | ------ | ------ |
| 인증 필수 | 모든 사용자 인증 후 접근 (비인증 브라우징 불가) | `login.html` 어노테이션 |
| 세션 관리 | 서버사이드 세션, 비활성 시 자동 로그아웃 | `login.html` 어노테이션 |
| 비밀번호 암호화 | DB에 평문 저장 금지 | `user-management.html` password 타입 |
| RBAC | 역할 기반 접근 통제, 메뉴/기능별 권한 분리 | `menu-permission.html` |
| 감사 귀속성 | 모든 의미 있는 액션은 인증된 사용자에게 귀속 | `audit-trail.html`, 제품 정의서 |
| 신청자/승인자 분리 | 자신의 신청 건 승인 불가 | `approval.html` 어노테이션 |

### 10.2 성능

| 요구사항 | 기준 |
| --------- | ------ |
| 목록 페이지네이션 | 기본 10건/페이지 |
| 검색 응답 | 일반 검색 3초 이내 |
| 접속 테스트 | DB/SSH 접속 테스트 응답 표시 (예: "23ms") |
| AI 추천 | 실시간 추천 (입력 시 미니패널 갱신) |

### 10.3 호환성

| 항목 | 지원 범위 |
| ------ | --------- |
| DB | Oracle, PostgreSQL, MySQL, MSSQL |
| 연결 | 직접 연결 + SSH 터널링 |
| 인증 방식 | 비밀번호, SSH 키 |
| 문자셋 | UTF-8, EUC-KR, ASCII |
| 설정 이관 | XML 내보내기/가져오기 |

---

## 11. 개발 단계

### Phase 1 — Core (1순위)

> 목표: 완전한 거버넌스 루프 — 검색, 신청, 승인, 감사

| 화면 | 파일 | 핵심 기능 |
| ------ | ------ | ---------- |
| 로그인 | `login.html` | 인증, 세션 관리 |
| 대시보드 | `dashboard.html` | 현황 요약, 알림 |
| 표준단어 조회/상세 | `standard-word-search/detail.html` | 검색, 상세 보기 |
| 표준도메인 조회/상세 | `standard-domain-search/detail.html` | 검색, 상세 보기 |
| 표준용어 조회/상세 | `standard-term-search/detail.html` | 검색, 상세 보기 |
| 표준단어 신청 | `standard-word-apply.html` | 신규/변경/삭제 신청 |
| 신청 목록 | `application-list.html` | 전체 신청 현황 |
| 내 신청 목록 | `my-requests.html` | 개인 신청 추적 |
| 삭제 영향도 | `request-delete-impact.html` | 삭제 사전 평가 |
| 승인 처리 | `approval.html` | 승인/반려/검토 |
| 신청 상세 | `approval-detail.html` | 변경 비교, 처리 |
| 감사 추적 | `audit-trail.html` | 이력 조회 |
| 표준 검증 대시보드 | `standard-validation.html` | 검증 현황 |
| 표준 검증 상세 | `standard-validation-detail.html` | 위반 목록, 시정 |
| AI 표준용어 추천 | `ai-term-suggest.html` | 유사 표준 검색 |
| 거버넌스 포털 | `governance-portal.html` | 준수율, KPI |

**필요 엔티티**: STD_WORD, STD_DOMAIN, STD_TERM, STD_TERM_WORD, REQUEST, REQUEST_CHANGE, AUDIT_LOG, DELETE_IMPACT, VALIDATION_RESULT, VALIDATION_EXECUTION, USER (기본)

**필요 API**: 인증, 대시보드, 표준 검색, 표준 신청, 승인, 감사, 검증, AI 추천, 거버넌스

### Phase 2 — Extended (2순위)

> 목표: 공통코드 거버넌스, 추가 신청 폼

| 화면 | 파일 | 핵심 기능 |
| ------ | ------ | ---------- |
| 공통코드 관리 | `common-code.html` | 코드그룹/코드 CRUD (거버넌스 파이프라인) |
| 공통코드 조회 | `common-code-search.html` | 읽기전용 검색 |
| 표준도메인 신청 | `standard-domain-apply.html` | 도메인 신규/변경/삭제 |
| 표준용어 신청 | `standard-term-apply.html` | 용어 신규/변경/삭제 |

**추가 엔티티**: COMMON_CODE_GROUP, COMMON_CODE

### Phase 3 — Admin (3순위)

> 목표: 시스템 관리, 운영 설정

| 화면 | 파일 | 핵심 기능 |
| ------ | ------ | ---------- |
| 사용자 관리 | `user-management.html` | 계정 CRUD, 역할 할당 |
| 메뉴 권한 | `menu-permission.html` | 역할별 CRUD 권한 |
| 시스템 코드 | `system-code.html` | 기준값 관리, 보호 정책 |
| DB 설정 | `db-settings.html` | DB 연결, SSH, XML |

**추가 엔티티**: MENU_PERMISSION, SYSTEM_CODE (확장)

---

## 12. 부록

### 12.1 27개 와이어프레임 파일 목록

| # | 카테고리 | 화면명 | 파일명 | Phase |
| --- | --------- | -------- | -------- | ------- |
| 1 | 인증 | 로그인 | `login.html` | 1 |
| 2 | 대시보드 | 메인 대시보드 | `dashboard.html` | 1 |
| 3 | 표준 검색 | 표준단어 조회 | `standard-word-search.html` | 1 |
| 4 | 표준 검색 | 표준단어 상세 | `standard-word-detail.html` | 1 |
| 5 | 표준 검색 | 표준도메인 조회 | `standard-domain-search.html` | 1 |
| 6 | 표준 검색 | 표준도메인 상세 | `standard-domain-detail.html` | 1 |
| 7 | 표준 검색 | 표준용어 조회 | `standard-term-search.html` | 1 |
| 8 | 표준 검색 | 표준용어 상세 | `standard-term-detail.html` | 1 |
| 9 | 표준 신청 | 표준단어 신청 | `standard-word-apply.html` | 1 |
| 10 | 표준 신청 | 표준도메인 신청 | `standard-domain-apply.html` | 2 |
| 11 | 표준 신청 | 표준용어 신청 | `standard-term-apply.html` | 2 |
| 12 | 표준 신청 | 신청 목록 | `application-list.html` | 1 |
| 13 | 표준 신청 | 내 신청 목록 | `my-requests.html` | 1 |
| 14 | 표준 신청 | 삭제 영향도 평가 | `request-delete-impact.html` | 1 |
| 15 | 승인 | 승인 처리 | `approval.html` | 1 |
| 16 | 승인 | 신청 상세 | `approval-detail.html` | 1 |
| 17 | 표준 검증 | 검증 대시보드 | `standard-validation.html` | 1 |
| 18 | 표준 검증 | 검증 실행/상세 | `standard-validation-detail.html` | 1 |
| 19 | AI 추천 | AI 표준용어 추천 | `ai-term-suggest.html` | 1 |
| 20 | 거버넌스 | 거버넌스 포털 | `governance-portal.html` | 1 |
| 21 | 감사 | 감사 추적 | `audit-trail.html` | 1 |
| 22 | 공통코드 | 공통코드 관리 | `common-code.html` | 2 |
| 23 | 공통코드 | 공통코드 조회 | `common-code-search.html` | 2 |
| 24 | 시스템 관리 | 사용자 관리 | `user-management.html` | 3 |
| 25 | 시스템 관리 | 메뉴 권한 관리 | `menu-permission.html` | 3 |
| 26 | 시스템 관리 | 시스템 코드 관리 | `system-code.html` | 3 |
| 27 | 설정 | DB 접속/SSH 설정 | `db-settings.html` | 3 |

### 12.2 용어 사전

| 한국어 | 영문 | 설명 |
| -------- | ------ | ------ |
| 표준단어 | Standard Word | 데이터 명칭의 최소 단위 (단어명, 영문약어, 영문명, 정의) |
| 표준도메인 | Standard Domain | 데이터 타입과 길이 정의 (도메인명, 데이터타입, 데이터길이) |
| 표준용어 | Standard Term | 비즈니스 용어 (표준단어 조합 + 도메인 매핑) |
| 공통코드 | Common Code | 조직 공유 참조 코드값 (코드그룹 → 코드) |
| 공통코드그룹 | Common Code Group | 공통코드를 분류하는 상위 그룹 |
| 영문약어 | English Abbreviation | 표준단어의 영문 축약형 (대문자, 예: CUST, AMT) |
| 물리명 | Physical Name | 표준용어의 DB 컬럼명 (영문약어 조합, 예: CUST_NO) |
| 인포타입 | Info Type | 표준용어의 의미 분류 (사용자명, 금액, 일자 등) |
| 도메인유형 | Domain Type | 도메인의 데이터 분류 (문자열, 숫자, 일자, 코드) |
| 거버넌스 파이프라인 | Governance Pipeline | 신청→검토→승인→발행 워크플로우 |
| 거버넌스 기준선 | Governance Baseline | 승인되어 표준 원장에 등록된 현행 표준 상태 |
| 감사 추적 | Audit Trail | 모든 상태 변경의 영구 기록 |
| 영향도 평가 | Impact Assessment | 삭제 전 참조 시스템/컬럼 영향 범위 분석 |
| 표준화율 | Standardization Rate | (승인 표준 수 / 전체 등록 표준 수) × 100 |
| 시정 신청 | Correction Request | 검증 위반 항목에 대한 변경 신청 |
| Data Butler | Data Butler | AI 유사 표준 추천 기능의 브랜드명 |
| 보호 코드 | Protected Code | 수정/삭제 불가한 시스템 코드 (워크플로우 기반) |
| RBAC | Role-Based Access Control | 역할 기반 접근 통제 |
| 피드백대기 | Feedback Pending | 승인자가 수정 요청을 보낸 상태 |
| 피드백반영 | Feedback Applied | 신청자가 재신청하여 원본이 닫힌 상태 |

### 12.3 상태 코드 정의

| 상태 (한국어) | 코드 | 용도 |
| ------------- | ------ | ------ |
| 기존 | BASELINE | 승인되어 표준 원장에 등록된 현행 표준 |
| 신청 | PENDING | 사용자가 신청을 제출한 상태 |
| 검토 | REVIEW | 승인자가 검토를 시작한 상태 |
| 승인 | APPROVED | 승인 처리 완료 |
| 반려 | REJECTED | 반려 처리 완료 |
| 피드백대기 | FEEDBACK | 승인자가 수정 요청을 보낸 상태 |
| 취소 | CANCELLED | 신청자가 직접 취소 |
| 활성 | ACTIVE | 사용자 계정 활성 상태 |
| 비활성 | INACTIVE | 사용자 계정 비활성 상태 |
| 보호 | PROTECTED | 수정/삭제 불가한 시스템 코드 |
| 미처리 | UNRESOLVED | 검증 위반 미처리 |
| 시정중 | CORRECTING | 검증 위반 시정 진행 중 |
| 완료 | RESOLVED | 검증 위반 시정 완료 |
