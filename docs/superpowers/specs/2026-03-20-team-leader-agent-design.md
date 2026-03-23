# Team Leader Agent 설계 스펙

> Agent Team의 리더 역할을 수행하는 `team-leader` 에이전트 설계

---

## 1. 개요

### 목적

현재 5개 worker 에이전트(frontend-developer, backend-developer, package-developer, test-engineer, code-reviewer)는 각각 독립적으로 동작하며, 작업 분해/순서 판단/컨텍스트 전달을 사용자가 직접 수행해야 한다. `team-leader`는 이 조율 역할을 자동화한다.

### 핵심 원칙

1. **계획 승인형** — 작업 분석 후 Phase 계획을 사용자에게 제시, 승인 후 자율 실행
2. **컨텍스트 브릿지** — 이전 Phase worker의 결과물을 읽고, 다음 worker에게 필요한 맥락을 전달
3. **소스 코드 미작성** — `docs/`와 `*.md` 파일만 직접 수정, 그 외 모든 파일은 worker에게 위임
4. **단방향 위임** — team-leader → worker 방향으로만 dispatch. 재귀적/순환적 위임 금지

---

## 2. 에이전트 정의

YAML frontmatter (`.claude/agents/team-leader.md`에 그대로 사용):

```
---
name: team-leader
description: Agent Team 조율 — 작업 분해, Phase 관리, 컨텍스트 전달
model: opus
tools: Read, Edit, Write, Bash, Grep, Glob, Agent, Skill
---
```

### 모델 선택 근거

Opus를 사용하는 이유: Leader는 요구사항 분석, 작업 분해, Phase 간 컨텍스트 연결 등 **추론 능력**이 핵심. Worker(Sonnet)보다 강한 추론으로 전체 작업의 품질을 높인다. 단, Leader 1회 호출 시 Opus(Leader) + Sonnet(Workers) + Opus(Reviewer) 비용이 발생하므로, 단순 작업은 worker를 직접 호출하는 것이 비용 효율적이다.

### 도구 사용 범위

| 도구             | 용도                                   | 제한                                          |
| ---------------- | -------------------------------------- | --------------------------------------------- |
| Read, Grep, Glob | worker 결과물 확인, 코드베이스 탐색    | 제한 없음                                     |
| Edit, Write      | 계획서, 문서 작성                      | `docs/`와 `*.md` 파일만 허용. 그 외 파일 금지 |
| Bash             | 빌드 확인(`pnpm build`), git 상태 확인 | 제한 없음                                     |
| Agent            | worker/reviewer dispatch               | 핵심 역할                                     |
| Skill            | brainstorming, writing-plans 등        | Claude Code 플랫폼 내장 skill                 |

---

## 3. 작업 흐름 (Workflow)

### Phase 0: 분석 & 계획

```
사용자 요구사항 수신
  ↓
1. 코드베이스 탐색 (Read, Grep, Glob)
2. 영향 범위 분석 — 어떤 패키지/앱이 변경되는가
3. Phase 계획 수립:
   - 어떤 worker가 필요한가
   - 순차 vs 병렬 판단 (충돌 매트릭스 참조)
   - 각 worker에게 전달할 구체적 지시사항
4. 계획을 사용자에게 제시 → 승인 대기
```

### Phase 1~N: 실행

```
승인 후
  ↓
각 Phase마다:
  1. worker dispatch (Agent tool, 적절한 subagent_type 지정)
  2. worker 완료 대기
  3. 결과물 읽기 (Read) — 변경된 파일, 새로 생긴 API 등 파악
  4. 다음 Phase worker에게 전달할 컨텍스트 정리
  5. 다음 Phase 실행
```

### Phase Final: 검증 & 보고

```
모든 worker 완료
  ↓
1. pnpm build && pnpm lint 실행
2. 빌드 실패 시 → 해당 worker 재dispatch
3. 빌드 성공 시 → code-reviewer dispatch
4. 리뷰 결과 수령:
   - critical 이슈 → 해당 worker에게 수정 요청
   - warning/suggestion → 사용자에게 보고하여 판단 위임
5. 최종 결과 보고 (변경 요약, 파일 목록, 남은 이슈)
```

---

## 4. Worker 관리 규칙

### Worker 매핑

| 변경 대상                                                  | Worker             | subagent_type        |
| ---------------------------------------------------------- | ------------------ | -------------------- |
| `packages/*`, `solutions/*/models/`, `solutions/*/shared/` | package-developer  | `package-developer`  |
| `apps/platform/`, `solutions/*/web/`                       | frontend-developer | `frontend-developer` |
| `solutions/*/api/`                                         | backend-developer  | `backend-developer`  |
| 테스트 파일 (`*.test.*`, `*.spec.*`)                       | test-engineer      | `test-engineer`      |
| 리뷰 요청                                                  | code-reviewer      | `code-reviewer`      |

### Dispatch 프롬프트 구조

```
## 작업
[구체적 작업 내용]

## 컨텍스트 (이전 Phase 결과)
- [이전 worker가 변경한 파일과 내용 요약]
- [새로 생긴 API/타입/컴포넌트 목록]

## 제약 조건
- [지켜야 할 규칙, 참고할 기존 패턴]

## 완료 기준
- [빌드 통과, 특정 기능 동작 등]
```

### 순차 vs 병렬 판단 기준

| 조건                          | 판단                                  |
| ----------------------------- | ------------------------------------- |
| packages/ 변경 포함           | 순차: package-developer 먼저 → 나머지 |
| platform + solution 동시 변경 | 병렬 가능 (충돌 낮음)                 |
| 같은 패키지 내 다수 변경      | 순차 또는 worktree 격리               |
| test + 개발 에이전트          | 순차: 개발 완료 후 테스트             |

### 격리 판단 규칙

| 상황                             | 판단                         |
| -------------------------------- | ---------------------------- |
| 단일 worker만 실행               | `isolation` 불필요           |
| 병렬 worker가 서로 다른 디렉토리 | `isolation` 불필요           |
| 병렬 worker 중 `pnpm add` 포함   | `isolation: "worktree"` 필수 |
| 같은 공유 파일 수정 가능성       | `isolation: "worktree"` 필수 |

### 실패 처리

| 상황                             | Leader 행동                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Worker 빌드 실패                 | 에러 로그 읽고, 같은 worker 재dispatch (에러 컨텍스트 포함)                                                               |
| Worker 재실패 (2회)              | 사용자에게 보고, 판단 위임                                                                                                |
| code-reviewer critical 이슈      | 해당 worker에게 수정 지시 재dispatch                                                                                      |
| review-fix 사이클 2회 초과       | 사용자에게 양쪽 의견 제시, 판단 위임                                                                                      |
| code-reviewer 결과에 이견        | 사용자에게 양쪽 의견 제시, 판단 위임                                                                                      |
| 병렬 Phase 중 일부 worker만 실패 | 성공한 worker의 변경은 유지, 실패한 worker만 재시도. 재시도도 실패 시 사용자에게 보고 후 성공 브랜치 merge 여부 판단 위임 |

### 위임 규칙

- **단방향만 허용**: team-leader → worker 방향으로만 dispatch
- **재귀 금지**: team-leader가 team-leader를 dispatch하지 않는다
- **역방향 금지**: worker가 team-leader를 dispatch하지 않는다
- **위임 경로**: `사용자 → team-leader → {worker, code-reviewer}` 고정

---

## 5. Skill 활용

### 사용하는 Skills

| 상황                      | Skill                                        | 사용법                              |
| ------------------------- | -------------------------------------------- | ----------------------------------- |
| 새로운 기능 요구사항 수신 | `superpowers:brainstorming`                  | 요구사항 분석, 설계 방향 탐색       |
| 다단계 구현 계획 수립     | `superpowers:writing-plans`                  | Phase 계획 작성 후 사용자 승인      |
| 병렬 worker dispatch      | `superpowers:dispatching-parallel-agents`    | 독립 작업 병렬 실행                 |
| 구현 계획 실행            | `superpowers:subagent-driven-development`    | 현재 세션에서 worker 관리           |
| 최종 완료 전              | `superpowers:verification-before-completion` | `pnpm build && pnpm lint` 통과 확인 |
| 작업 완료 후 통합         | `superpowers:finishing-a-development-branch` | merge, PR, cleanup 판단             |

### 사용하지 않는 Skills

| Skill                                 | 이유                             |
| ------------------------------------- | -------------------------------- |
| `frontend-design:frontend-design`     | UI 구현은 worker 역할            |
| `superpowers:test-driven-development` | 테스트 작성은 test-engineer 역할 |
| `superpowers:systematic-debugging`    | 디버깅은 해당 worker가 처리      |
| `code-review:code-review`             | 리뷰는 code-reviewer가 처리      |

> **참고**: 위 Skills는 모두 Claude Code 플랫폼 내장 skill이다. 프로젝트 로컬 skill이 아님.

### CLAUDE.md 규칙 적용

team-leader는 CLAUDE.md의 글로벌 규칙을 따르되, 에이전트 정의에서 재정의하는 부분이 우선:

- `superpowers:brainstorming` — 적용 (Leader가 직접 실행)
- `frontend-design:frontend-design` — Leader는 실행하지 않음 (worker에게 위임)

---

## 6. Git 브랜치 전략

### 브랜치 생성

- 단일 Phase 작업: Leader가 feature 브랜치 생성 불필요 — worker가 직접 main에서 작업
- 다중 Phase 작업: Leader가 `feat/<작업명>` 브랜치 생성 후 worker들이 해당 브랜치에서 작업
- worktree 격리 시: 각 worker가 자동으로 별도 브랜치 생성

### Merge 책임

- worktree 브랜치 merge: **Leader가 수행** (하위 의존성부터 순차 merge)
- main 브랜치 merge/PR 생성: **사용자 승인 필요** — Leader는 `superpowers:finishing-a-development-branch` skill로 옵션 제시

---

## 7. 팀 구조 변경

### Before

```
사용자 ──→ worker (직접 dispatch)
사용자 ──→ worker
사용자 ──→ code-reviewer
```

### After

```
사용자 ──→ team-leader ──→ worker(s) ──→ code-reviewer
              ↑                              │
              └──────── 결과 보고 ────────────┘
```

### worktree-isolation.md 업데이트

`team-leader`를 에이전트별 파일 담당 영역 테이블에 추가:

| 에이전트      | 주 작업 디렉토리        | 참조하는 공유 파일               |
| ------------- | ----------------------- | -------------------------------- |
| `team-leader` | 전체 (읽기 + 문서 쓰기) | 모든 파일 (읽기), `docs/` (쓰기) |

충돌 매트릭스에 추가:

| 조합                          | 충돌 위험 | 이유                                                            |
| ----------------------------- | --------- | --------------------------------------------------------------- |
| `team-leader` + 모든 에이전트 | **낮음**  | 소스 코드 수정 안 함. 단, `docs/` 동시 수정 시 충돌 가능성 있음 |
