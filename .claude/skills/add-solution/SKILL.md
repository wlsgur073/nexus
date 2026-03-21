---
name: add-solution
description: Nexus 플랫폼에 새 솔루션을 스캐폴딩합니다 (디렉토리 구조, 패키지 설정, 레지스트리 등록)
disable-model-invocation: true
---

# Add Solution

새 솔루션을 Nexus 플랫폼에 추가합니다. `docs/solution-development-guide.md`의 Step 1~7을 자동으로 수행합니다.

## 사용법

```
/add-solution <solution-id>
```

## 워크플로우

### Phase 1: 정보 수집

인자로 받은 `<solution-id>`를 기반으로 아래 정보를 사용자에게 확인합니다.
AskUserQuestion 도구를 사용하여 한 번에 수집합니다.

| 필드        | 기본값                          | 설명               |
| ----------- | ------------------------------- | ------------------ |
| id          | 인자에서 가져옴                 | 솔루션 고유 식별자 |
| name        | id를 Title Case로 변환          | 솔루션 표시 이름   |
| description | 사용자 입력 필수                | 솔루션 설명        |
| icon        | `BookOpen`                      | lucide-react 아이콘 (PascalCase) |
| category    | 기존 카테고리 중 선택           | 카테고리 ID        |
| status      | `active`                        | 솔루션 상태        |
| port        | 기존 최대 포트 + 1              | 개발 서버 포트     |

**사용 가능한 카테고리**: `packages/config/src/solutions.ts`의 `categories` 배열을 읽어서 옵션으로 제공합니다.

**포트 결정**: 기존 솔루션의 `web/package.json` dev 스크립트에서 포트를 파싱하여 최대값 + 1을 기본값으로 제안합니다.

### Phase 2: 디렉토리 구조 생성

`docs/solution-development-guide.md` Step 2에 따라 생성합니다:

```
solutions/{id}/
├── web/src/app/
├── models/src/
├── shared/src/
└── docs/release/
```

### Phase 3: Internal Packages 설정

`docs/solution-development-guide.md` Step 3에 따라 생성합니다:

- `solutions/{id}/models/package.json` — `@nexus/{id}-models`
- `solutions/{id}/models/tsconfig.json`
- `solutions/{id}/models/src/index.ts`
- `solutions/{id}/shared/package.json` — `@nexus/{id}-shared`
- `solutions/{id}/shared/tsconfig.json`
- `solutions/{id}/shared/src/index.ts`

**핵심 패턴**: Internal Packages — `"exports": { ".": "./src/index.ts" }`, 빌드 스크립트 없음.

### Phase 4: Web 앱 설정

`docs/solution-development-guide.md` Step 4에 따라 생성합니다:

- `solutions/{id}/web/package.json` — `@nexus/{id}-web`, port 지정
- `solutions/{id}/web/next.config.ts` — `basePath: "/solutions/{id}"`, `turbopack.root` 설정
- `solutions/{id}/web/tsconfig.json`
- `solutions/{id}/web/eslint.config.mjs`

### Phase 5: 앱 진입점 작성

`docs/solution-development-guide.md` Step 5에 따라 생성합니다:

- `solutions/{id}/web/src/app/globals.css` — 기존 codex의 globals.css를 참조하여 동일한 테마 변수 사용
- `solutions/{id}/web/src/app/layout.tsx` — `TooltipProvider > PlatformShell > {children}`
- `solutions/{id}/web/src/app/page.tsx` — 기본 홈페이지

### Phase 6: 솔루션 레지스트리 등록

`packages/config/src/solutions.ts`의 `solutions` 배열에 항목 추가:

```ts
{
  id: "{id}",
  slug: "{id}",
  name: "{name}",
  description: "{description}",
  icon: "{icon}",
  category: "{category}",
  status: "{status}",
  route: "/solutions/{id}",
}
```

**주의**: `route`와 `basePath`가 반드시 일치해야 합니다.

### Phase 7: 검증

```bash
pnpm install
pnpm build
pnpm lint
```

모든 명령이 성공해야 합니다. 실패 시 에러를 분석하고 수정합니다.

## 참조 문서

- `docs/solution-development-guide.md` — 전체 가이드 (이 스킬의 원본)
- `.claude/rules/solution-dev.md` — 솔루션 개발 규칙
- `.claude/rules/architecture.md` — 패키지 의존 방향
