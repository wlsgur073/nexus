---
title: Agent Team 준비 가이드
description: Claude Code Agent Team 구성에 필요한 문서와 설정 정리 (범용 가이드)
version: 0.1.0
---

# Agent Team 준비 가이드

> 이 문서는 Claude Code Agent Team 구성에 앞서 작성해야 할 문서와 설정을 정리한다. 특정 프로젝트에 종속되지 않는 범용 가이드이다.

---

## 목차

1. [개요](#1-개요)
2. [기술 스택 결정](#2-기술-스택-결정)
3. [CLAUDE.md 작성](#3-claudemd-작성)
4. [커스텀 에이전트 정의](#4-커스텀-에이전트-정의)
5. [Skills 정의](#5-skills-정의)
6. [설정 및 Hooks](#6-설정-및-hooks)
7. [검증 기준 구성](#7-검증-기준-구성)
8. [준비 체크리스트](#8-준비-체크리스트)

---

## 1. 개요

### Agent Team이란

Agent Team은 여러 Claude Code 인스턴스가 팀으로 협업하는 방식이다. 하나의 세션이 Team Lead 역할을 하고, 나머지 Teammate들이 독립된 context window에서 병렬로 작업한다.

### 핵심 원칙

- 모든 teammate는 **독립된 context window**에서 실행된다
- Lead의 대화 이력은 teammate에게 전달되지 않는다
- Teammate가 세션 시작 시 로드하는 공유 컨텍스트는 **CLAUDE.md, MCP 서버, Skills** 뿐이다
- 따라서 CLAUDE.md와 Skills의 품질이 teammate 작업 품질을 결정한다

### Agent Team vs Subagent

|                 | Subagent                           | Agent Team                         |
| --------------- | ---------------------------------- | ---------------------------------- |
| **Context**     | 자체 context, 결과만 caller에 반환 | 자체 context, 완전 독립            |
| **통신**        | 메인 에이전트에만 결과 보고        | Teammate 간 직접 메시지            |
| **조율**        | 메인 에이전트가 모든 작업 관리     | 공유 태스크 리스트로 자체 조율     |
| **적합한 경우** | 결과만 필요한 집중 작업            | 토론과 협업이 필요한 복합 작업     |
| **토큰 비용**   | 낮음 (결과 요약)                   | 높음 (각 teammate가 별도 인스턴스) |

### Agent Team이 적합한 프로젝트 유형

- 다중 레이어 아키텍처 → 레이어별 독립 작업 가능
- 프론트엔드/백엔드/DB가 동시 진행 가능한 구조
- 화면 수와 API 수가 많아 병렬화 효과가 큰 경우
- Phase별 단계적 구현 → 태스크 분할이 명확한 경우
- 코드 리뷰, 디버깅 등 다양한 관점이 필요한 작업

---

## 2. 기술 스택 결정

> **이 결정이 모든 후속 문서의 전제 조건이다.** 스택이 확정되지 않으면 CLAUDE.md, 에이전트, Skills를 작성할 수 없다.

### 결정 항목

| 항목                    | 선택지 예시                                   | 결정 | 비고 |
| ----------------------- | --------------------------------------------- | ---- | ---- |
| **Frontend 프레임워크** | React, Vue, Angular, Svelte                   |      |      |
| **Frontend 언어**       | TypeScript, JavaScript                        |      |      |
| **Backend 프레임워크**  | Spring Boot, NestJS, Django, FastAPI, Express |      |      |
| **Backend 언어**        | Java, TypeScript, Python, Go                  |      |      |
| **Database**            | PostgreSQL, Oracle, MySQL, MSSQL, SQLite      |      |      |
| **ORM / DB 접근**       | JPA, TypeORM, Prisma, SQLAlchemy, Drizzle     |      |      |
| **테스트 프레임워크**   | Jest, Vitest, JUnit, pytest, Playwright       |      |      |
| **패키지 매니저**       | npm, yarn, pnpm, gradle, maven                |      |      |
| **빌드 도구**           | Vite, Webpack, Next.js, Turbopack             |      |      |
| **API 문서화**          | Swagger/OpenAPI, 수동 문서                    |      |      |
| **인증 방식**           | JWT, 세션 기반, OAuth, SSO                    |      |      |
| **코드 스타일**         | ESLint + Prettier, Checkstyle, Black          |      |      |
| **모노레포 여부**       | 단일 / 프론트·백 분리 / 모노레포              |      |      |

### 결정 시 고려사항

- **배포 환경**: 클라우드 / 온프레미스 / 하이브리드
- **DB 호환성**: 단일 DB vs 다중 DB 지원
- **인증/인가**: RBAC, ABAC, 역할 수 및 권한 모델
- **확장성**: 향후 기능 확장 고려
- **팀 역량**: 팀원의 기술 숙련도

---

## 3. CLAUDE.md 작성

> Teammate가 로드하는 유일한 공유 컨텍스트. 짧고 핵심만 담아야 한다.

### 작성 원칙

- **짧게**: 각 줄마다 "이걸 빼면 Claude가 실수할까?" 자문. 아니면 삭제
- **구체적으로**: Claude가 코드를 읽으면 알 수 있는 건 적지 않기
- **검증 가능하게**: 빌드/테스트 명령어는 정확히
- **`@` 참조 활용**: 긴 내용은 별도 파일에 두고 `@path` 로 참조

### 템플릿

```markdown
# CLAUDE.md

## Project Overview

[프로젝트 한 줄 설명]
개발 명세: @docs/[개발명세서 파일명]

## Tech Stack

- Frontend: [프레임워크] + [언어]
- Backend: [프레임워크] + [언어]
- Database: [DB] + [ORM]
- Auth: [인증 방식]

## Commands

- Install: `[패키지 설치 명령]`
- Dev server: `[개발 서버 실행 명령]`
- Build: `[빌드 명령]`
- Test: `[테스트 실행 명령]`
- Lint: `[린트 명령]`
- DB migrate: `[마이그레이션 명령]`

## Code Style

- [구체적인 코드 스타일 규칙]
- [프로젝트에만 해당하는 특수 규칙]

## Architecture

- [디렉토리 구조 규칙]
- [레이어 간 의존성 규칙]

## Git Workflow

- Branch: [브랜치 네이밍 규칙]
- Commit: [커밋 메시지 규칙]
- PR: [PR 단위 규칙]

## Key Rules

- [프로젝트 핵심 비즈니스 규칙 1]
- [프로젝트 핵심 비즈니스 규칙 2]
- [프로젝트 핵심 비즈니스 규칙 3]
```

### 포함해야 할 것 vs 포함하지 말 것

| 포함                                   | 제외                                      |
| -------------------------------------- | ----------------------------------------- |
| Claude가 추측할 수 없는 Bash 명령      | 코드를 읽으면 알 수 있는 것               |
| 기본값과 다른 코드 스타일 규칙         | 언어의 표준 관례                          |
| 테스트 실행 방법, 선호하는 테스트 러너 | 상세 API 문서 (링크로 대체)               |
| Git 브랜치/커밋/PR 규칙                | 자주 바뀌는 정보                          |
| 프로젝트 고유 아키텍처 결정            | 파일별 설명                               |
| 개발 환경 quirks (필수 env 변수)       | "깨끗한 코드를 작성하세요" 같은 자명한 것 |

---

## 4. 커스텀 에이전트 정의

> `.claude/agents/` 디렉토리에 역할별 전문 에이전트를 정의한다.

### 권장 에이전트 구성

> 아래는 Nexus 프로젝트에서 실제 사용 중인 에이전트 구성 예시이다. 상세 정의는 `.claude/agents/` 참조.

#### 4.1 frontend-developer.md

```markdown
---
name: frontend-developer
description: 프론트엔드 개발 — Platform 포탈 + 솔루션 웹앱 전체
tools: Read, Edit, Write, Bash, Grep, Glob, Agent, Skill
model: opus
---

당신은 Nexus 프론트엔드 개발자입니다.

## 담당 영역

- apps/platform/ — Command Center
- solutions/\*/web/ — 각 솔루션 프론트엔드

## 기술 컨텍스트

- Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui base-nova
- PlatformShell은 Platform 전용 — 솔루션에서 사용 금지

## 규칙

- packages/ 직접 수정 금지 → package-developer에게 요청
- Server Component 우선, "use client"는 상호작용 필요 시에만
```

#### 4.2 backend-developer.md

```markdown
---
name: backend-developer
description: 백엔드 API 및 비즈니스 로직 구현
tools: Read, Edit, Write, Bash, Grep, Glob, Agent, Skill
model: sonnet
---

당신은 Nexus 백엔드 개발자입니다.

## 담당 영역

- solutions/\*/api/ — 각 솔루션 백엔드

## 규칙

- packages/, web/ 직접 수정 금지
- models/shared 수정 필요 시 → package-developer에게 요청
```

#### 4.3 package-developer.md

```markdown
---
name: package-developer
description: 공유 패키지(ui, shell, config, types) 및 솔루션 공유 레이어(models, shared) 개발
tools: Read, Edit, Write, Bash, Grep, Glob, Agent, Skill
model: sonnet
---

당신은 Nexus 공유 패키지 전담 개발자입니다.

## 담당 영역

- packages/{ui,shell,config,types}/ — 플랫폼 공유 패키지
- solutions/_/models/, solutions/_/shared/ — 솔루션 공유 레이어 (프론트-백 계약)

## 규칙

- packages/ → solutions/ 방향 의존 절대 금지
- 공유 패키지 변경 시 전체 빌드로 하위 호환성 확인
```

#### 4.4 test-engineer.md

```markdown
---
name: test-engineer
description: 테스트 작성 및 품질 검증 (프론트엔드 + 백엔드)
tools: Read, Edit, Write, Bash, Grep, Glob, Agent, Skill
model: sonnet
---

당신은 Nexus 테스트 엔지니어입니다.

## 담당 영역

- 모노레포 전체 테스트 작성 및 유지보수

## 테스트 전략

- 단위: 유틸 함수, 훅, 레지스트리 (Vitest)
- 컴포넌트: 주요 페이지 렌더링 (Vitest + Testing Library)
- E2E: 사용자 네비게이션 흐름 (Playwright)
```

#### 4.5 code-reviewer.md

```markdown
---
name: code-reviewer
description: 코드 리뷰 — 품질, 보안, 접근성, 아키텍처 규칙 통합 검증
tools: Read, Bash, Grep, Glob, Agent, Skill
model: opus
---

당신은 Nexus 시니어 코드 리뷰어입니다. 읽기 전용.

## 리뷰 관점

- 코드 품질: TypeScript strict, 의존성 방향, shadcn/ui 패턴
- 보안: SQL Injection, XSS, 하드코딩된 비밀정보
- 접근성: 시맨틱 HTML, ARIA, 키보드 네비게이션
- 아키텍처: 솔루션 독립성, Internal Packages 패턴
```

---

## 5. Skills 정의

> `.claude/skills/` 디렉토리에 반복 워크플로우를 정의한다. CLAUDE.md와 달리 필요할 때만 로드되어 context를 절약한다.

### 권장 Skills

#### 5.1 API 엔드포인트 생성

```markdown
# .claude/skills/create-api-endpoint/SKILL.md

---

name: create-api-endpoint
description: REST API 엔드포인트 생성 워크플로우
disable-model-invocation: true

---

$ARGUMENTS 기반으로 API 엔드포인트를 생성합니다.

1. 개발 명세서에서 해당 엔드포인트 명세 확인
2. 관련 데이터 모델 확인
3. Controller/Route 파일 생성
4. Service 레이어 비즈니스 로직 구현
5. Repository/DAO 레이어 구현
6. 입력 검증 적용
7. 에러 처리 및 공통 응답 포맷 적용
8. 단위 테스트 작성 및 실행
9. lint 및 타입 체크 실행
```

#### 5.2 엔티티 생성

```markdown
# .claude/skills/create-entity/SKILL.md

---

name: create-entity
description: DB 엔티티 및 마이그레이션 생성
disable-model-invocation: true

---

$ARGUMENTS 엔티티를 생성합니다.

1. 개발 명세서에서 해당 엔티티 필드 정의 확인
2. ER 관계도에서 FK 관계 확인
3. 엔티티/모델 클래스 생성
4. 마이그레이션 스크립트 생성
5. 초기 seed 데이터 작성 (필요한 경우)
6. Repository/DAO 인터페이스 생성
7. 마이그레이션 실행 및 검증
```

#### 5.3 화면 구현

```markdown
# .claude/skills/create-screen/SKILL.md

---

name: create-screen
description: 화면 구현 워크플로우
disable-model-invocation: true

---

$ARGUMENTS 화면을 구현합니다.

1. 개발 명세서에서 해당 화면 명세 확인
2. 와이어프레임/디자인 시안 참조
3. 공통 레이아웃 적용
4. 필터, 테이블, 폼, 모달 등 컴포넌트 구현
5. API 연동 (데이터 요구사항 기반)
6. 역할별 가시성 차이 구현
7. 공통 UI 요소 (배지, 페이지네이션 등) 적용
8. 네비게이션 (진입/이탈) 연결
```

#### 5.4 이슈 수정

```markdown
# .claude/skills/fix-issue/SKILL.md

---

name: fix-issue
description: GitHub 이슈 기반 버그 수정
disable-model-invocation: true

---

GitHub 이슈 $ARGUMENTS 를 분석하고 수정합니다.

1. `gh issue view $ARGUMENTS`로 이슈 상세 확인
2. 관련 코드 탐색 및 원인 분석
3. 실패하는 테스트 작성 (재현)
4. 수정 구현
5. 테스트 통과 확인
6. lint 및 타입 체크 실행
7. 커밋 메시지 작성 (fix: [이슈제목])
8. PR 생성
```

---

## 6. 설정 및 Hooks

### 6.1 settings.json

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "teammateMode": "in-process",
  "permissions": {
    "allow": [
      "명령어 예시: npm run lint",
      "명령어 예시: npm test",
      "명령어 예시: git commit *",
      "명령어 예시: git push origin *"
    ]
  }
}
```

### 6.2 Hooks 설정

> CLAUDE.md 규칙은 권고사항이지만, Hooks는 **강제**된다. 예외 없이 실행되어야 하는 것만 Hook으로.

#### TeammateIdle Hook

Teammate가 유휴 상태가 될 때 실행. exit code 2를 반환하면 피드백과 함께 계속 작업하게 한다.

```json
{
  "hooks": {
    "TeammateIdle": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "검증 스크립트 경로"
          }
        ]
      }
    ]
  }
}
```

#### TaskCompleted Hook

작업 완료 시 실행. exit code 2를 반환하면 완료를 막고 피드백을 보낸다.

```json
{
  "hooks": {
    "TaskCompleted": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "lint 및 테스트 실행 스크립트"
          }
        ]
      }
    ]
  }
}
```

---

## 7. 검증 기준 구성

> Claude는 스스로 검증할 수 있을 때 극적으로 더 잘 작동한다. 이것이 가장 레버리지가 높은 투자이다.

### 7.1 테스트 전략

| 수준        | 대상                             | 도구                     |
| ----------- | -------------------------------- | ------------------------ |
| 단위 테스트 | 서비스 로직, 유틸리티, 검증 규칙 | [테스트 프레임워크]      |
| 통합 테스트 | API 엔드포인트, DB CRUD          | [테스트 프레임워크 + DB] |
| E2E 테스트  | 핵심 워크플로우 전체 경로        | [E2E 도구]               |

### 7.2 핵심 검증 시나리오 (프로젝트별 작성)

비즈니스 워크플로우 관련:

- [ ] [핵심 워크플로우 경로 1 — 정상 흐름]
- [ ] [핵심 워크플로우 경로 2 — 반려/재시도 흐름]
- [ ] [핵심 워크플로우 경로 3 — 예외 흐름]
- [ ] [상태 전이 규칙 위반 차단]
- [ ] [권한 분리 원칙 검증]
- [ ] [필수 전제조건 검증]
- [ ] [보호 데이터 수정/삭제 차단]
- [ ] [감사 로그 자동 기록]

권한 관련:

- [ ] [역할별 메뉴/기능 접근 통제]
- [ ] [제한 사용자의 버튼/기능 숨김]
- [ ] [비인증 사용자 접근 차단]

### 7.3 코드 품질 도구

| 도구         | 용도             | 설정 파일                        |
| ------------ | ---------------- | -------------------------------- |
| Linter       | 코드 스타일 강제 | `.eslintrc` / 해당 설정 파일     |
| Formatter    | 코드 포맷 통일   | `.prettierrc` / 해당 설정 파일   |
| Type checker | 타입 안전성      | `tsconfig.json` / 해당 설정 파일 |

---

## 8. 준비 체크리스트

### Phase 0: 사전 결정 (Agent Team 시작 전 필수)

- [ ] **기술 스택 확정** (섹션 2)
  - [ ] Frontend 프레임워크/언어
  - [ ] Backend 프레임워크/언어
  - [ ] Database + ORM
  - [ ] 테스트 프레임워크
  - [ ] 빌드 도구/패키지 매니저
  - [ ] 인증 방식

### Phase 1: 문서 작성

- [ ] **CLAUDE.md 작성** (섹션 3)
  - [ ] 기술 스택 명시
  - [ ] 빌드/테스트/린트 명령어
  - [ ] 코드 스타일 규칙
  - [ ] Git 워크플로우
  - [ ] 핵심 비즈니스 규칙
  - [ ] 개발 명세서 참조 링크

- [ ] **커스텀 에이전트 정의** (섹션 4)
  - [ ] `.claude/agents/backend-developer.md`
  - [ ] `.claude/agents/frontend-developer.md`
  - [ ] `.claude/agents/db-architect.md`
  - [ ] `.claude/agents/test-engineer.md`
  - [ ] `.claude/agents/security-reviewer.md`

- [ ] **Skills 정의** (섹션 5)
  - [ ] `.claude/skills/create-api-endpoint/SKILL.md`
  - [ ] `.claude/skills/create-entity/SKILL.md`
  - [ ] `.claude/skills/create-screen/SKILL.md`
  - [ ] `.claude/skills/fix-issue/SKILL.md`

### Phase 2: 환경 설정

- [ ] **settings.json 구성** (섹션 6)
  - [ ] Agent team 실험 플래그 활성화
  - [ ] teammate 모드 설정
  - [ ] 권한 allowlist 설정

- [ ] **Hooks 구성** (섹션 6.2)
  - [ ] TeammateIdle hook
  - [ ] TaskCompleted hook

- [ ] **검증 기준 구성** (섹션 7)
  - [ ] 테스트 프레임워크 설정
  - [ ] Linter/Formatter 설정
  - [ ] 핵심 검증 시나리오 목록 작성

### Phase 3: 프로젝트 초기화

- [ ] 프로젝트 리포지토리 생성
- [ ] 디렉토리 구조 스캐폴딩
- [ ] 의존성 설치 및 빌드 확인
- [ ] DB 초기 마이그레이션
- [ ] CI/CD 파이프라인 (선택)

### Phase 4: Agent Team 시작

- [ ] 개발 명세서 준비 확인 (데이터 모델, API, 비즈니스 규칙, 화면 명세)
- [ ] Team Lead에게 첫 번째 Phase 범위 작업 지시
- [ ] 3~5명 teammate로 시작 (teammate당 5~6개 태스크)

---

## 참조

| 문서                     | 위치                                             | 용도                       |
| ------------------------ | ------------------------------------------------ | -------------------------- |
| Agent Team 공식 문서     | <https://code.claude.com/docs/en/agent-teams>    | Agent Team 사용법          |
| Best Practices 공식 문서 | <https://code.claude.com/docs/en/best-practices> | Claude Code 활용 모범 사례 |
| Sub-agents 공식 문서     | <https://code.claude.com/docs/en/sub-agents>     | Subagent 사용법            |
| Skills 공식 문서         | <https://code.claude.com/docs/en/skills>         | Skills 작성법              |
| Hooks 공식 문서          | <https://code.claude.com/docs/en/hooks>          | Hooks 설정법               |
| CLAUDE.md 공식 문서      | <https://code.claude.com/docs/en/memory>         | CLAUDE.md 작성법           |
