---
title: "정보 아키텍처 및 네비게이션"
description: "메뉴 구조, 사이드바, Breadcrumb, Command Palette 설계"
version: "1.0"
---

## 3. 정보 아키텍처 (IA)

### 3.1 전체 메뉴 구조

```markdown
Codex
├── 대시보드 (/solutions/codex)
│ ├── [신청자 뷰] — 역할에 따라 자동 전환
│ └── [승인자 뷰] — 역할에 따라 자동 전환
│
├── 표준 관리
│ ├── 통합 표준 탐색기 (/solutions/codex/standards)
│ │ ├── [표준용어 탭]
│ │ ├── [표준단어 탭]
│ │ └── [표준도메인 탭]
│ ├── 신규 표준 신청 (/solutions/codex/standards/new)
│ └── 공통코드 조회 (/solutions/codex/common-codes)
│
├── 거버넌스
│ ├── 승인 워크벤치 (/solutions/codex/approvals)
│ ├── 거버넌스 포털 (/solutions/codex/governance)
│ └── 감사 추적 (/solutions/codex/audit)
│
├── 품질 관리
│ ├── 검증 대시보드 (/solutions/codex/validations)
│ └── 검증 상세 (/solutions/codex/validations/[executionId])
│
├── 관리 (시스템관리자 전용)
│ ├── 공통코드 관리 (/solutions/codex/admin/common-codes)
│ ├── 사용자 관리 (/solutions/codex/admin/users)
│ ├── 권한 관리 (/solutions/codex/admin/permissions)
│ ├── 코드 관리 (/solutions/codex/admin/system-codes)
│ └── DB 연결 설정 (/solutions/codex/admin/db-settings)
│
└── [전역 요소]
├── Command Palette (Ctrl+K)
├── 알림 센터 (헤더 벨 아이콘)
└── AI Data Butler (각 화면 통합)
```

### 3.2 메뉴 깊이

| 깊이  | 예시                                            | 비고                                 |
| ----- | ----------------------------------------------- | ------------------------------------ |
| 1단계 | 대시보드, 표준 관리, 거버넌스, 품질 관리, 관리  | 사이드바 섹션 헤딩                   |
| 2단계 | 통합 표준 탐색기, 승인 워크벤치, 사용자 관리 등 | 사이드바 링크                        |
| 3단계 | 표준 상세 Sheet, 검증 상세, 신규 신청           | 2단계 내 진입 (Sheet 또는 별도 경로) |

최대 깊이 3단계로 제한. 3단계 이상의 중첩 네비게이션은 Sheet 또는 Dialog로 처리하여 사용자의 컨텍스트 이탈을 방지한다.

### 3.3 역할별 접근 권한

| 메뉴             | 시스템관리자 | 검토/승인자 | 표준 관리자 | 신청자 | 조회전용 |
| ---------------- | :----------: | :---------: | :---------: | :----: | :------: |
| 대시보드         |      O       |      O      |      O      |   O    |    O     |
| 통합 표준 탐색기 |      O       |      O      |      O      |   O    |    O     |
| 신규 표준 신청   |      O       |      -      |      O      |   O    |    -     |
| 공통코드 조회    |      O       |      O      |      O      |   O    |    O     |
| 승인 워크벤치    |      O       |      O      |      -      |   -    |    -     |
| 거버넌스 포털    |      O       |      O      |      O      |   -    |    -     |
| 감사 추적        |      O       |      O      |      O      |   O    |    -     |
| 검증 대시보드    |      O       |      O      |      O      |   O    |    O     |
| 검증 상세        |      O       |      O      |      O      |   O    |    -     |
| 공통코드 관리    |      O       |      -      |      O      |   -    |    -     |
| 사용자 관리      |      O       |      -      |      -      |   -    |    -     |
| 권한 관리        |      O       |      -      |      -      |   -    |    -     |
| 코드 관리        |      O       |      -      |      -      |   -    |    -     |
| DB 연결 설정     |      O       |      -      |      -      |   -    |    -     |

---

## 4. 네비게이션 설계

### 4.1 사이드바 구조

Nexus PlatformShell의 Sidebar를 활용한다. Codex 진입 시 사이드바가 Codex 전용 메뉴로 전환된다.

```markdown
┌─────────────────────────┐
│ ← Nexus Codex │ ← 상단: Nexus 복귀 링크 + 솔루션명
├─────────────────────────┤
│ │
│ 📊 대시보드 │ ← 단일 링크 (역할별 뷰 자동 전환)
│ │
│ ── 표준 관리 ── │ ← 섹션 헤딩 (nav-section)
│ 🔍 표준 탐색기 │
│ ➕ 신규 신청 │ ← 신청 권한 없는 역할에게 숨김
│ 📋 공통코드 조회 │
│ │
│ ── 거버넌스 ── │ ← 섹션 헤딩
│ ✅ 승인 워크벤치 (5) │ ← 미처리 건수 Badge
│ 📈 거버넌스 포털 │
│ 📜 감사 추적 │
│ │
│ ── 품질 관리 ── │ ← 섹션 헤딩
│ 🔬 검증 대시보드 │
│ │
│ ── 관리 ── │ ← 시스템관리자에게만 표시
│ ⚙️ 공통코드 관리 │
│ 👥 사용자 관리 │
│ 🔑 권한 관리 │
│ 📝 코드 관리 │
│ 🔌 DB 연결 설정 │
│ │
├─────────────────────────┤
│ 👤 김데이터 │ ← 하단: 사용자 정보
│ 표준 관리자 │ 역할 표시
│ [로그아웃] │
└─────────────────────────┘
```

**사이드바 규칙**:

- `active`/`beta` 상태 메뉴만 표시
- 역할 기반 메뉴 필터링 (접근 권한 없는 메뉴 숨김)
- 승인 워크벤치에 미처리 건수 Badge 실시간 표시
- 현재 활성 메뉴 하이라이트 (좌측 accent border + 배경색)
- 섹션 헤딩은 클릭 불가, 시각적 구분자 역할

### 4.2 Breadcrumb 규칙

Nexus PlatformShell의 Breadcrumbs 컴포넌트를 활용한다.

| 경로                                      | Breadcrumb                                  |
| ----------------------------------------- | ------------------------------------------- |
| `/solutions/codex`                        | Nexus > Codex > 대시보드                    |
| `/solutions/codex/standards`              | Nexus > Codex > 통합 표준 탐색기            |
| `/solutions/codex/standards` + Sheet 열림 | Nexus > Codex > 통합 표준 탐색기 > {표준명} |
| `/solutions/codex/standards/new`          | Nexus > Codex > 신규 표준 신청              |
| `/solutions/codex/approvals`              | Nexus > Codex > 승인 워크벤치               |
| `/solutions/codex/governance`             | Nexus > Codex > 거버넌스 포털               |
| `/solutions/codex/audit`                  | Nexus > Codex > 감사 추적                   |
| `/solutions/codex/validations`            | Nexus > Codex > 검증 대시보드               |
| `/solutions/codex/validations/[id]`       | Nexus > Codex > 검증 대시보드 > 검증 상세   |
| `/solutions/codex/admin/users`            | Nexus > Codex > 관리 > 사용자 관리          |
| `/solutions/codex/admin/db-settings`      | Nexus > Codex > 관리 > DB 연결 설정         |

**규칙**:

- "Nexus"는 항상 첫 번째 (클릭 시 Nexus Command Center로 이동)
- "Codex"는 항상 두 번째 (클릭 시 Codex 대시보드로 이동)
- Sheet가 열린 경우 Sheet 대상명을 마지막 항목으로 추가 (클릭 불가, 현재 위치 표시)
- 최대 4단계까지만 표시

### 4.3 Command Palette (Ctrl+K)

shadcn/ui의 `Command` 컴포넌트를 활용한 전역 단축키 기반 네비게이션.

**트리거**: `Ctrl+K` (Windows) / `Cmd+K` (Mac), 또는 헤더의 검색 아이콘 클릭

**구성**:

```markdown
┌──────────────────────────────────────────┐
│ 🔍 명령어를 입력하세요... Ctrl+K │
├──────────────────────────────────────────┤
│ │
│ 최근 검색 │
│ 고객번호 (표준용어) │
│ CUST_NO (표준단어) │
│ │
│ 빠른 이동 │
│ 대시보드 │
│ 표준 탐색기 │
│ 승인 워크벤치 │
│ 거버넌스 포털 │
│ │
│ 액션 │
│ 신규 표준 신청 │
│ 검증 실행 │
│ │
│ 표준 검색 (입력 시 실시간) │
│ "고객" 입력 → 고객번호, 고객명, ... │
│ │
└──────────────────────────────────────────┘
```

**기능**:

- **빠른 이동**: 메뉴명 입력으로 즉시 이동 (fuzzy matching)
- **표준 검색**: 표준명/영문약어/물리명으로 실시간 검색 → 클릭 시 상세 Sheet 열림
- **액션**: "신규 신청", "검증 실행" 등 직접 액션 실행
- **최근 검색**: 최근 검색한 표준 5건 표시
- **AI 통합**: 검색어 입력 시 AI Data Butler가 유사 표준 추천 인라인 표시
