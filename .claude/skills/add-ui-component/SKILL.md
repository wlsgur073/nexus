---
name: add-ui-component
description: shadcn/ui 컴포넌트를 @nexus/ui 패키지에 추가하고 export를 설정합니다
---

# Add UI Component

shadcn/ui 컴포넌트를 `@nexus/ui` 패키지에 추가합니다.

## 사용법

```
/add-ui-component <component-name> [component-name-2 ...]
```

## 워크플로우

### Step 1: 컴포넌트 설치

`packages/ui/` 디렉토리에서 shadcn CLI를 실행합니다:

```bash
cd packages/ui && pnpm dlx shadcn@latest add <component-name>
```

여러 컴포넌트를 한 번에 설치할 수 있습니다:

```bash
cd packages/ui && pnpm dlx shadcn@latest add button card dialog
```

### Step 2: base-nova 패턴 검증

설치된 컴포넌트 파일을 읽고 다음을 확인합니다:

1. **`asChild` 패턴 금지**: `asChild` prop이 사용되었으면 `render` prop으로 변환합니다.

   ```tsx
   // 금지 (Radix 전용)
   <Button asChild><Link href="/">Home</Link></Button>

   // 올바른 패턴 (base-nova)
   <Button render={<Link href="/" />} nativeButton={false}>Home</Button>
   ```

2. **`@base-ui/react` 임포트 확인**: base-nova 스타일은 `@base-ui/react`를 UI 프리미티브로 사용합니다.

### Step 3: Export 확인

`packages/ui/src/index.ts`에 새 컴포넌트의 export가 추가되었는지 확인합니다.
shadcn CLI가 자동으로 추가하지만, 누락된 경우 수동으로 추가합니다:

```ts
export { Button } from "./components/button";
```

### Step 4: 빌드 검증

```bash
pnpm build
```

공유 패키지 변경이므로 전체 빌드로 하위 호환성을 확인합니다.

## 규칙 리마인더

- **스타일**: `base-nova` (@base-ui/react 기반)
- **링크 버튼**: `<Button render={<Link href="..." />} nativeButton={false}>` 패턴
- **`asChild` 금지**: Radix 전용이므로 사용하지 않음
- **파일명**: kebab-case (`button.tsx`, `card.tsx`)
- **의존 방향**: `@nexus/ui`는 `solutions/` 패키지를 의존할 수 없음

## 참조

- `.claude/rules/packages.md` — UI 컴포넌트 추가 규칙
- `.claude/rules/code-style.md` — shadcn/ui 규칙
