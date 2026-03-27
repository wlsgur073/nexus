# 공유 패키지 (packages/)

여러 앱/솔루션이 공통으로 사용하는 라이브러리. 단독 실행 불가 — 소비 앱이 import하여 사용.

## Internal Packages 패턴

모든 패키지는 TypeScript 소스를 직접 export. 별도 빌드 불필요 — 소비 앱의 Turbopack이 트랜스파일.

```json
"exports": { ".": "./src/index.ts" }
```

## 빌드

```bash
# 전체 린트 (루트에서)
pnpm lint

# UI 컴포넌트 수동 추가
pnpm dlx shadcn@latest add <component> --cwd packages/ui
```

## 패키지 목록

### @nexus/types

Nexus 전체 공유 타입 정의. 의존성 계층의 최하위.

- `SolutionStatus`: `"active" | "beta" | "coming-soon"`
- `Category`: `{ id, name, icon }`
- `Solution`: `{ id, slug, name, description, icon, category, status, route }`
- **의존성 없음** — 다른 `@nexus/*` 패키지를 의존하지 않음

### @nexus/config

솔루션 레지스트리 및 아이콘 유틸리티. 솔루션 메타데이터의 Single Source of Truth.

- 등록 솔루션: Codex (active), LLM Gateway (beta), AI Factory, Data Pipeline, CI/CD Hub, Insight Dashboard (coming-soon)
- 카테고리: AI/ML, Data, DevOps, Analytics
- 유틸: `getSolutionBySlug()`, `getSolutionsByCategory()`, `getCategoryById()`, `DynamicIcon`
- 솔루션 추가: `src/solutions.ts`의 `solutions` 배열에 항목 추가. `route`와 `basePath` 일치 필수
- 의존성: `@nexus/types`, `lucide-react`

### @nexus/ui

shadcn/ui 기반 공유 컴포넌트 라이브러리. **모든 앱과 솔루션이 참조.**

- 23개 컴포넌트 + cn() 유틸: Button, Input, Badge, Card, Label, Separator, Skeleton, Textarea, Dialog, Sheet, Tooltip, Select, Table, Tabs, Checkbox, ScrollArea, Alert, ThemeProvider, Command, Popover, Switch, Progress, InputGroup
- 스타일: `base-nova` (@base-ui/react 기반)
- `asChild` 사용 금지 → `render` prop + `nativeButton={false}` 패턴
- 컴포넌트 추가: `add-ui-component` 스킬 사용
- 의존성: `@base-ui/react`, `class-variance-authority`, `clsx`, `cmdk`, `lucide-react`, `next-themes`, `tailwind-merge`

### @nexus/shell

Platform 앱 전용 레이아웃. **솔루션 앱에서 사용 금지.**

- 6개 컴포넌트: PlatformShell, Header, Sidebar, MobileSidebar, Breadcrumbs, ThemeToggle
- 사용처: `apps/platform/` 만 허용
- 의존성: `@nexus/ui`, `@nexus/config`, `@nexus/types`, `lucide-react`, `next-themes`
