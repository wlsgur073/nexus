---
title: "Codex UX 설계 명세"
description: "기존 27개 와이어프레임을 17개 화면으로 통합/재설계한 UX 명세 개요"
version: "1.0"
created: "2026-03-20"
---

# Codex UX 설계 명세

> **버전**: 1.0
> **작성일**: 2026-03-20
> **목적**: 기존 27개 와이어프레임을 6대 비전 원칙에 따라 17개 화면으로 통합/재설계한 UX 명세
> **기반**: Nexus 독립 솔루션 레이아웃, 6대 비전 원칙

### 에이전트별 참조 가이드

| 에이전트               | 참조 섹션                                                                                                                                                                                                          | 설명                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| **frontend-developer** | [roles-journeys.md](roles-journeys.md), [information-architecture.md](information-architecture.md), [screens-core.md](screens-core.md), [screens-governance.md](screens-governance.md), [patterns.md](patterns.md) | 17개 화면 레이아웃, 컴포넌트, 인터랙션 설계 |
| **code-reviewer**      | [roles-journeys.md](roles-journeys.md), [patterns.md](patterns.md)                                                                                                                                                 | UX 일관성 검증, 접근성 규칙, WCAG 기준      |
| **package-developer**  | [patterns.md](patterns.md)                                                                                                                                                                                         | 공유 컴포넌트의 시각적 규격 참조            |

---

## 화면 통합 요약 (27개 → 17개)

| #   | 신규 화면                        | 통합된 기존 화면                                                                                                                                                                                                  | 통합 이유                                                                                                               |
| --- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | 로그인                           | `login.html`                                                                                                                                                                                                      | 유지 (독립 화면)                                                                                                        |
| 2   | 신청자 대시보드                  | `dashboard.html` + `my-requests.html`                                                                                                                                                                             | 역할 적응형 대시보드로 신청자 전용 뷰 통합. 내 신청 목록을 대시보드 위젯으로 흡수하여 별도 화면 제거                    |
| 3   | 승인자 대시보드                  | `dashboard.html` + `approval.html` (stat 카드)                                                                                                                                                                    | 승인자 전용 KPI와 승인 대기 큐를 대시보드에 통합. 승인 처리 진입점 역할                                                 |
| 4   | 통합 표준 탐색기                 | `standard-word-search.html` + `standard-domain-search.html` + `standard-term-search.html`                                                                                                                         | **핵심 통합**: 3개 검색 화면을 탭 기반 1개 화면으로 통합. 동일한 검색/필터 패턴을 공유하므로 분리 불필요                |
| 5   | 표준 상세 보기 & 인라인 거버넌스 | `standard-word-detail.html` + `standard-domain-detail.html` + `standard-term-detail.html` + `standard-word-apply.html` + `standard-domain-apply.html` + `standard-term-apply.html` + `request-delete-impact.html` | **핵심 통합**: 상세 보기 Sheet에서 바로 편집/신청. 6개 상세+신청 화면과 영향도 평가를 Sheet 내 인라인 워크플로우로 흡수 |
| 6   | 신규 표준 신청                   | `standard-word-apply.html` (신규 탭) + `standard-domain-apply.html` (신규 탭) + `standard-term-apply.html` (신규 탭)                                                                                              | 완전히 새로운 표준을 등록할 때만 사용. 변경/삭제 신청은 상세 Sheet의 인라인 거버넌스로 이동                             |
| 7   | 승인 워크벤치                    | `approval.html` + `approval-detail.html` + `application-list.html`                                                                                                                                                | 승인 처리 목록과 신청 상세를 하나의 워크벤치로 통합. 목록 선택 시 사이드 패널에서 상세 확인/처리                        |
| 8   | 검증 대시보드                    | `standard-validation.html`                                                                                                                                                                                        | 유지 (독립 화면)                                                                                                        |
| 9   | 검증 상세                        | `standard-validation-detail.html`                                                                                                                                                                                 | 유지 (독립 화면)                                                                                                        |
| 10  | 거버넌스 포털                    | `governance-portal.html`                                                                                                                                                                                          | 유지 (독립 화면)                                                                                                        |
| 11  | 감사 추적                        | `audit-trail.html`                                                                                                                                                                                                | 유지 (독립 화면)                                                                                                        |
| 12  | 공통코드 관리                    | `common-code.html`                                                                                                                                                                                                | 유지 (독립 화면)                                                                                                        |
| 13  | 공통코드 조회                    | `common-code-search.html`                                                                                                                                                                                         | 유지 (독립 화면)                                                                                                        |
| 14  | 사용자 관리                      | `user-management.html`                                                                                                                                                                                            | 유지 (독립 화면)                                                                                                        |
| 15  | 권한 관리                        | `menu-permission.html`                                                                                                                                                                                            | 유지 (독립 화면)                                                                                                        |
| 16  | 코드 관리 (시스템)               | `system-code.html`                                                                                                                                                                                                | 유지 (독립 화면)                                                                                                        |
| 17  | DB 연결 설정                     | `db-settings.html`                                                                                                                                                                                                | 유지 (독립 화면)                                                                                                        |

**제거된 화면**: `my-requests.html` (대시보드 흡수), `application-list.html` (승인 워크벤치 흡수), `index.html` (프레젠테이션용, 제품 불필요)

---

## 문서 목차

| 파일                                                       | 내용                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------- |
| [roles-journeys.md](roles-journeys.md)                     | 사용자 역할 정의 (5개 역할)와 역할별 사용자 여정 플로우 |
| [information-architecture.md](information-architecture.md) | 메뉴 구조, 사이드바, Breadcrumb, Command Palette 설계   |
| [screens-core.md](screens-core.md)                         | 로그인, 대시보드, 탐색기, 표준 상세 화면 UX 설계        |
| [screens-governance.md](screens-governance.md)             | 거버넌스, 검증, 감사, 관리자 화면 UX 설계               |
| [patterns.md](patterns.md)                                 | AI Data Butler UX, 공유 UI 패턴, 접근성, 반응형 설계    |
