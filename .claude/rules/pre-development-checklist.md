# 개발 착수 전 체크리스트

구현 작업 요청을 받으면, 코드 작성이나 에이전트 dispatch **전에** 아래 체크리스트를 반드시 수행한다.
"이미 알고 있다"고 생각해도 건너뛰지 않는다. 이 체크리스트의 결과를 사용자에게 보고하고 승인을 받은 후에만 구현을 시작한다.

## Phase 0: 문서 확인 (구현 전 필수)

### 1. 프로젝트 규칙 확인

- [ ] `.claude/rules/` 디렉토리의 **모든 규칙 파일**을 읽는다
  - architecture.md, code-style.md, packages.md, solution-dev.md
  - testing.md, worktree-isolation.md, team-lead-workflow.md
  - 기타 추가된 규칙 파일
- [ ] 루트 `CLAUDE.md`를 읽고 중요 컨텍스트를 파악한다

### 2. 대상 솔루션/패키지 문서 확인

- [ ] 해당 솔루션의 `CLAUDE.md`를 읽는다 (예: `solutions/codex/CLAUDE.md`)
- [ ] 해당 솔루션의 **명세 문서 전체**를 읽는다 (예: `solutions/codex/docs/specs/`)
  - 제품 스펙, UX 설계, 데이터 아키텍처, 프론트엔드 아키텍처
- [ ] 해당 Phase의 **실행 계획**을 읽는다 (예: `solutions/codex/docs/plans/phase3-plan.md`)
- [ ] `docs/` 디렉토리의 관련 가이드를 읽는다
  - dev-spec.md, solution-development-guide.md 등

### 3. 에이전트 팀 확인

- [ ] `.claude/agents/` 디렉토리의 **모든 에이전트 정의**를 읽는다
  - 각 에이전트의 담당 영역, 제약 조건, 스킬 목록 확인
- [ ] 작업에 필요한 에이전트를 식별한다
  - 어떤 에이전트가 어떤 파일을 수정하는지 매핑
- [ ] `worktree-isolation.md`의 충돌 매트릭스를 확인한다
  - 병렬 실행 가능 여부, 격리 필요 여부 판단

### 4. 현재 구현 상태 확인

- [ ] 대상 코드의 현재 상태를 파악한다 (기존 구현, 디렉토리 구조)
- [ ] `git status`로 미커밋 변경사항 확인
- [ ] 현재 브랜치 확인 (main에서 직접 작업 금지)

## Phase 1: 계획 수립 & 승인

### 5. 실행 계획 작성

- [ ] 의존성 방향에 따른 구현 순서를 정한다 (하위 패키지부터)
- [ ] 각 Step별 담당 에이전트를 배정한다
- [ ] 순차 vs 병렬 판단을 한다 (team-lead-workflow.md 기준)
- [ ] 완료 기준을 명확히 정의한다

### 6. 사용자 승인

- [ ] 체크리스트 결과와 실행 계획을 사용자에게 보고한다
- [ ] **사용자 승인 후에만** 구현을 시작한다

## Phase 2: 실행

### 7. 실행 방식

- [ ] **Agent Teams(TeamCreate)**를 사용한다 (Subagent 패턴 금지)
- [ ] `feat/<작업명>` 브랜치를 생성한다 (main 직접 작업 금지)
- [ ] 각 teammate에게 dispatch 프롬프트를 team-lead-workflow.md 형식으로 전달한다
- [ ] 각 Step 완료 시 컨텍스트 브릿지를 수행한다 (결과 확인 → 다음 teammate에 전달)

## Phase 3: 완료

### 8. 검증 & 문서

- [ ] `pnpm build && pnpm lint` 전체 통과 확인
- [ ] code-reviewer dispatch (코드 리뷰)
- [ ] 해당 솔루션/패키지의 CLAUDE.md "현재 구현 상태" 갱신
- [ ] 릴리즈 노트 작성 (`solutions/{id}/docs/release/`, 형식: `.claude/rules/solution-dev.md` 릴리즈 노트 섹션 참조)
- [ ] 커밋 + PR + main merge (사용자 승인)
