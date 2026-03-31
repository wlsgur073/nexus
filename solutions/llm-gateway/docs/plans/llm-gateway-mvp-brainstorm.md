---
title: LLM Gateway MVP 브레인스토밍
description: Gateway Core + Observatory MVP 방향, 기술 결정사항, Codex 시너지 정리
version: 0.1.0
---

# LLM Gateway — MVP 브레인스토밍 정리

> **Status**: 초기 브레인스토밍 완료 (2026-03-31). 상세 설계 미진행.
> **다음 단계**: 상세 UX 설계 → 데이터 아키텍처 → 프론트엔드/백엔드 스펙 → 구현 계획

---

## 솔루션 비전

단순 API 프록시가 아닌 **기업이 LLM을 안전하고 효율적으로 사용하기 위한 통합 관제 플랫폼**.

---

## 4개 서비스 영역 (전체 로드맵)

### 1. Gateway Core — 통합 API 게이트웨이 (MVP)

| 기능           | 설명                                              |
| -------------- | ------------------------------------------------- |
| Unified API    | OpenAI, Anthropic, Google을 단일 REST API로 통합  |
| Smart Routing  | 요청 특성에 따라 최적 모델 자동 선택              |
| Fallback Chain | 1순위 모델 실패 시 자동 폴백                      |
| Rate Limiting  | 팀/프로젝트별 토큰 할당량, 분당 호출 제한         |
| Response Cache | 동일 프롬프트 캐싱으로 비용 절감 + 응답 속도 향상 |

### 2. Observatory — 모니터링·최적화 (MVP)

| 기능                 | 설명                                                  |
| -------------------- | ----------------------------------------------------- |
| Cost Dashboard       | 모델별/팀별/프로젝트별 토큰 사용량 + 비용 실시간 추적 |
| Latency Monitor      | 응답 시간 추이, P50/P95/P99 모니터링, SLA 알림        |
| Quality Metrics      | 응답 만족도, 할루시네이션 비율, 프롬프트 성공률       |
| Optimization Suggest | 비용 최적화 제안 ("이 프롬프트는 Haiku로 충분합니다") |

### 3. Prompt Studio — 프롬프트 엔지니어링 (Phase 2)

| 기능               | 설명                                                 |
| ------------------ | ---------------------------------------------------- |
| Prompt Registry    | 프롬프트 템플릿 등록·버전 관리 (diff/rollback)       |
| Variable Injection | 변수를 런타임에 주입. Codex 표준 용어 사전 연동 가능 |
| A/B Testing        | 프롬프트 변형 간 성능 비교                           |
| Playground         | 웹 UI에서 실시간 테스트 + 모델 간 비교               |

### 4. Guard & Compliance — 보안·거버넌스 (Phase 3)

| 기능          | 설명                                |
| ------------- | ----------------------------------- |
| Input Filter  | PII 자동 마스킹, 금칙어 필터링      |
| Output Filter | 할루시네이션 감지, 부적절 응답 차단 |
| Audit Log     | 모든 LLM 호출 기록                  |
| Policy Engine | 부서별/프로젝트별 사용 정책         |

---

## 확정된 결정사항

| 항목           | 결정                            | 근거                                                        |
| -------------- | ------------------------------- | ----------------------------------------------------------- |
| MVP 범위       | Gateway Core + Observatory      | 기본 기능 + 즉각적 비즈니스 가치(비용 가시성)               |
| 사용 대상      | 사내용 먼저 → SaaS 확장         | 내부 검증 후 외부 제공                                      |
| LLM 프로바이더 | 빅3 (OpenAI, Anthropic, Google) | 가장 수요 높은 3개로 MVP                                    |
| 데이터 수집    | Gateway 경유 전수 집계          | 100% 정확한 데이터. SPOF는 인프라(다중 인스턴스, LB)로 해결 |

---

## Codex 시너지

- Codex 표준 용어는 변동성 낮음 → 실시간 플로우 불필요, **초기 세팅 시 일괄 주입** 패턴
- Phase 2 (Prompt Studio)에서 Codex 변수 주입 연동
- Phase 3 (Guard)에서 Codex 거버넌스 규칙 연동

---

## 시중 유사 제품 (참고)

- LiteLLM: 오픈소스 LLM 프록시
- Portkey: AI Gateway + Observability
- Helicone: LLM 모니터링
- Azure AI Gateway: 엔터프라이즈 게이트웨이

**차별화 포인트**: Nexus 생태계 통합 (Codex 용어 사전 → 프롬프트 자동 주입)

---

## 이어서 진행할 때 참고

이 문서를 기반으로 다음 순서로 설계를 이어감:

1. **상세 UX 설계** — `/brainstorming` 으로 화면 구성, 사용자 흐름 정의
2. **데이터 아키텍처** — API 로그 스키마, 프로바이더 커넥터 인터페이스
3. **프론트엔드 스펙** — solutions/llm-gateway/docs/specs/ 에 저장
4. **구현 계획** — solutions/llm-gateway/docs/plans/ 에 Phase별 plan 작성
5. **구현** — solutions/llm-gateway/web/, models/, shared/ 디렉토리 생성
