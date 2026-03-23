---
name: compound
description: 세션에서 배운 것을 분석하여 memory에 축적합니다 (Compound Engineering 패턴)
---

# Compound

세션 대화를 분석하여 학습할 만한 내용을 추출하고, 사용자 확인 후 memory에 저장합니다.
"각 작업이 다음 작업을 더 쉽게 만든다"는 Compound Engineering 원칙을 적용합니다.

## 사용법

```
/compound
```

세션 종료 전 또는 주요 작업 완료 후 호출합니다.

## 워크플로우

### Step 1: 기존 memory 읽기

memory 디렉토리의 `MEMORY.md`와 모든 memory 파일을 읽어 현재 축적된 학습을 파악합니다.
중복 저장을 방지하기 위해 반드시 먼저 수행합니다.

### Step 2: 세션 대화 분석

현재 세션의 대화 흐름에서 다음 5가지 유형의 학습을 식별합니다:

| 유형                            | 식별 신호                                                               | 예시                                              |
| ------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------- |
| **피드백 (feedback)**           | 사용자가 접근 방식을 수정한 경우 ("아니", "그게 아니라", "이렇게 해줘") | "문서 분리 시 frontmatter를 추가해줘"             |
| **사용자 프로필 (user)**        | 사용자 역할, 선호, 지식 수준이 드러난 경우                              | "한국어 문서 선호, 모노레포 아키텍처에 익숙"      |
| **프로젝트 컨텍스트 (project)** | 아키텍처 결정, 일정, 진행 상황 변화                                     | "Phase 2 착수 예정, merge freeze 계획"            |
| **외부 참조 (reference)**       | 유용한 외부 리소스가 언급된 경우                                        | "awesome-claude-code 리포에서 compound 패턴 참조" |
| **실수에서 배운 것 (feedback)** | 오류 → 수정 사이클이 발생한 경우                                        | "basePath와 route가 불일치하면 빌드 실패"         |

### Step 3: 학습 항목 목록 제시

식별된 항목을 다음 형식으로 사용자에게 제시합니다:

```
## 이번 세션에서 발견한 학습 항목

1. [feedback] "문서 분리 시 모든 파일에 frontmatter 추가 필요"
   → 기존 memory와 중복 없음. 새로 저장 권장.

2. [project] "Codex Phase 2 착수 예정 — 거버넌스 포털, 검증 대시보드"
   → 기존 memory 없음. 새로 저장 권장.

3. [user] "한국어 문서 작성 선호"
   → 기존 memory에 유사 항목 없음. 새로 저장 권장.

저장할 항목을 선택해주세요.
```

학습 항목이 없으면 "이번 세션에서 새롭게 축적할 학습이 없습니다." 로 종료합니다.

### Step 4: 사용자 확인

AskUserQuestion 도구로 저장할 항목을 사용자에게 확인합니다. multiSelect를 활용합니다.

### Step 5: memory 저장

승인된 항목을 memory 파일로 저장합니다. 기존 memory 시스템 규격을 준수합니다:

**파일 형식**:

```markdown
---
name: { { memory name } }
description: { { 한 줄 설명 } }
type: { { user | feedback | project | reference } }
---

{{내용}}

**Why:** {{이유 — 왜 이것이 중요한지}}

**How to apply:** {{적용 방법 — 언제/어디서 이 학습을 활용해야 하는지}}
```

**저장 규칙**:

- 파일명: `{type}_{주제}.md` (예: `feedback_frontmatter_convention.md`)
- 기존 memory와 의미적으로 중복되면 기존 파일을 **갱신** (Edit)
- 새로운 내용이면 파일 **생성** (Write) + `MEMORY.md` 인덱스에 추가
- `MEMORY.md`는 200줄 이하 유지
- 상대 날짜를 절대 날짜로 변환 ("목요일" → "2026-03-26")

### Step 6: rules 추가 제안 (선택)

반복적으로 나타나는 패턴이 발견되면, `.claude/rules/`에 추가할 만한 규칙을 **텍스트로 제안**합니다.
rules 파일을 직접 수정하지는 않습니다 — 사용자가 판단하여 수동으로 추가합니다.

```
## 규칙 추가 제안 (선택사항)

다음 패턴이 반복적으로 나타났습니다. `.claude/rules/`에 추가를 고려해보세요:

- [ ] `code-style.md`에 추가: "모든 명세 문서에 YAML frontmatter(title, description, version) 포함"
```

### Step 7: 요약

저장된 항목과 제안된 규칙을 한 줄씩 요약하고 종료합니다.

## 분석하지 않는 것

- 코드 패턴, 파일 구조 — 코드에서 직접 확인 가능
- git 히스토리 — `git log`로 확인 가능
- 디버깅 해결책 — 수정 내용이 코드에 반영됨
- CLAUDE.md에 이미 문서화된 내용
- 현재 대화 내에서만 유효한 임시 정보

## 참조

- memory 시스템 규칙: 시스템 프롬프트의 "auto memory" 섹션
- `.claude/rules/team-lead-workflow.md` — Phase Final에서 호출
