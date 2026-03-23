---
title: "Codex 프론트엔드 아키텍처 명세"
description: "Codex 데이터 거버넌스 플랫폼의 프론트엔드 구현 청사진"
version: "1.0"
created: "2026-03-20"
---

# Codex 프론트엔드 아키텍처 명세

> **버전**: 1.0
> **작성일**: 2026-03-20
> **기준**: `ux-design.md` (17개 화면), `data-architecture.md` (19개 엔티티, 117개 API 엔드포인트)
> **목적**: Codex 데이터 거버넌스 플랫폼의 프론트엔드 구현 청사진 — 라우트, 컴포넌트, 상태 관리, 데이터 페칭 전략을 일관된 방식으로 정의한다.

### 에이전트별 참조 가이드

| 에이전트               | 참조 섹션                                                                                        | 설명                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| **package-developer**  | [foundation.md](foundation.md)                                                                   | 공유 패키지 의존성, models/shared 구조      |
| **frontend-developer** | [components.md](components.md), [state-data.md](state-data.md), [integration.md](integration.md) | 컴포넌트 계층, 상태 관리, 데이터 페칭, 인증 |
| **code-reviewer**      | [integration.md](integration.md)                                                                 | 에러 핸들링 패턴, 보안 체크리스트           |

## 문서 목차

| 파일                             | 내용                                                                        |
| -------------------------------- | --------------------------------------------------------------------------- |
| [foundation.md](foundation.md)   | 핵심 기술 스택, 의존성, @nexus/codex-web·models·shared 패키지 구조          |
| [components.md](components.md)   | App Router 라우트 트리, 컴포넌트 계층, AI Butler·인라인 거버넌스 프론트엔드 |
| [state-data.md](state-data.md)   | TanStack Query, nuqs, React Context 상태 관리 및 API 클라이언트·캐싱 전략   |
| [integration.md](integration.md) | 인증·권한, 성능 최적화, @nexus/shell 통합, Phase 1-3 구현 순서, 오류·보안   |
