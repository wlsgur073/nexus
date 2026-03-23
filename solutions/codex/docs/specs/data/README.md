---
title: "Codex 데이터 아키텍처 명세"
description: "Codex 데이터 거버넌스 플랫폼의 데이터 모델, API, 비즈니스 규칙 문서 인덱스"
version: "1.0"
created: "2026-03-20"
---

# Codex 데이터 아키텍처 명세

> **버전**: 1.0
> **작성일**: 2026-03-20
> **기준**: 6 Pillars 비전 기반 데이터 거버넌스 아키텍처
> **목적**: Codex 데이터 거버넌스 플랫폼의 데이터 모델, API, 비즈니스 규칙을 정의한다.

### 에이전트별 참조 가이드

| 에이전트               | 참조 섹션                              | 설명                                           |
| ---------------------- | -------------------------------------- | ---------------------------------------------- |
| **package-developer**  | [entities.md](entities.md)             | 엔티티 타입, enum, TypeScript 인터페이스 정의  |
| **backend-developer**  | [api.md](api.md), [rules.md](rules.md) | 118개 API 엔드포인트, 상태 머신, 비즈니스 규칙 |
| **frontend-developer** | [api.md](api.md)                       | API 클라이언트 구현 시 엔드포인트 사양 참조    |
| **code-reviewer**      | [rules.md](rules.md)                   | 규칙 준수 검증, 무결성 제약 확인               |

### 문서 목차

| 파일                       | 내용                                                          |
| -------------------------- | ------------------------------------------------------------- |
| [entities.md](entities.md) | 19개 엔티티 정의, ER 다이어그램, 관계 설명                    |
| [api.md](api.md)           | Request/Draft/Validation 상태 전이, 118개 API 엔드포인트 상세 |
| [rules.md](rules.md)       | 표준 관리, 거버넌스, 검증, 권한, 무결성 규칙 및 확장 고려사항 |
