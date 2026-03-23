# Worktree 격리 규칙

Agent Team으로 병렬 작업 시 충돌을 방지하기 위한 규칙.

## 에이전트별 파일 담당 영역

| 에이전트             | 주 작업 디렉토리                                           | 참조하는 공유 파일                                                  |
| -------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------- |
| `frontend-developer` | `apps/platform/`, `solutions/*/web/`                       | `packages/*` (import), `solutions/*/models/`, `solutions/*/shared/` |
| `backend-developer`  | `solutions/*/api/` (현재 미존재, 향후 도입 예정)           | `solutions/*/models/`, `solutions/*/shared/`                        |
| `package-developer`  | `packages/*`, `solutions/*/models/`, `solutions/*/shared/` | 없음 (최하위)                                                       |
| `test-engineer`      | 전체 (테스트 파일)                                         | 테스트 대상 소스 파일                                               |
| `code-reviewer`      | 전체 (읽기 전용)                                           | 없음                                                                |

## 충돌 매트릭스

| 조합                                                             | 충돌 위험 | 이유                                                                      |
| ---------------------------------------------------------------- | --------- | ------------------------------------------------------------------------- |
| `frontend-developer` + `backend-developer`                       | **낮음**  | web/ vs api/ 서로 다른 디렉토리, 독립적 (api/ 현재 미존재)                |
| `frontend-developer` + `package-developer`                       | **높음**  | frontend가 packages/models/shared를 import — 인터페이스 변경 시 빌드 실패 |
| `backend-developer` + `package-developer`                        | **높음**  | backend가 models/shared를 import — 동일한 이유                            |
| `frontend-developer` + `backend-developer` + `package-developer` | **높음**  | 3자 동시 — worktree 격리 필수                                             |
| `test-engineer` + 다른 에이전트                                  | **중간**  | 테스트 대상 파일이 동시에 수정되면 테스트가 깨질 수 있음                  |
| `code-reviewer` + 다른 에이전트                                  | **없음**  | 읽기 전용 — 파일 수정 안 함                                               |

## 공유 충돌 파일 (동시 수정 금지)

다음 파일은 여러 에이전트가 동시에 수정하면 반드시 충돌한다:

- **`pnpm-lock.yaml`** — 의존성 변경 시 자동 갱신. 두 에이전트가 동시에 `pnpm add`를 실행하면 충돌
- **`packages/config/src/solutions.ts`** — 솔루션 등록. 동시에 두 솔루션을 등록하면 충돌
- **`packages/ui/src/index.ts`** — 컴포넌트 export 추가 시 충돌
- **`packages/shell/src/index.ts`** — 동일
- **`solutions/*/models/src/index.ts`** — 엔티티/API 타입 export 추가 시 충돌
- **각 앱의 `layout.tsx`** — Provider 추가 등 구조 변경 시 충돌

## Worktree 격리 사용 기준

### 반드시 격리해야 하는 경우

- `package-developer`와 다른 개발 에이전트가 동시에 작업할 때
- 두 에이전트가 같은 패키지 내 파일을 수정할 때
- 의존성 설치(`pnpm add`)가 포함된 작업이 2개 이상 병렬로 진행될 때
- 새 솔루션 등록이 2건 이상 동시에 진행될 때

### 격리 없이 안전한 경우

- `frontend-developer` + `backend-developer` (web/ vs api/, 서로 다른 디렉토리)
- `code-reviewer` + 모든 에이전트 (읽기 전용)
- 같은 솔루션 내에서 `web/` + `api/` 각각 다른 에이전트가 작업 (파일 중복 없음)

## 권장 작업 순서

### 패턴 1: packages/models/shared 변경이 있는 경우

```
Phase 1: package-developer (packages/, models/, shared/ 수정)
  ↓ 완료 후
Phase 2: frontend-developer + backend-developer (병렬, worktree 격리 불필요)
  ↓ 완료 후
Phase 3: test-engineer (테스트 작성)
  ↓ 완료 후
Phase 4: code-reviewer (리뷰)
```

### 패턴 2: 공유 레이어 변경이 없는 경우

```
Phase 1: frontend-developer + backend-developer (병렬, 격리 불필요)
  ↓ 완료 후
Phase 2: test-engineer + code-reviewer (병렬)
```

### 패턴 3: 독립적인 작업이 여러 개인 경우

```
모든 에이전트를 isolation: "worktree"로 병렬 실행
각자 별도 브랜치에서 작업 → 완료 후 순차 merge
```

## Worktree 사용 방법

Agent Teams에서 teammate를 생성할 때 `isolation: "worktree"` 파라미터를 설정한다:

```
Agent(
  prompt: "...",
  isolation: "worktree",
  subagent_type: "frontend-developer",
  team_name: "project-name"
)
```

- 각 에이전트는 독립된 레포 복사본과 별도 브랜치에서 작업
- 작업 완료 후 worktree 경로와 브랜치명이 반환됨
- 변경사항이 없으면 worktree는 자동 정리됨

## Merge 순서 원칙

Worktree에서 작업한 브랜치를 merge할 때:

1. **하위 의존성부터 merge**: `packages/types` → `packages/config` → `packages/ui` → `packages/shell` → `solutions/*/models/` → `solutions/*/shared/` → `solutions/*/web/` / `solutions/*/api/`
2. **각 merge 후 빌드 확인**: `pnpm build` 통과 후 다음 merge
3. **`pnpm-lock.yaml` 충돌 시**: `pnpm install`을 다시 실행하여 재생성
4. **같은 파일 충돌 시**: 수동 해결 후 `pnpm build && pnpm lint` 확인
