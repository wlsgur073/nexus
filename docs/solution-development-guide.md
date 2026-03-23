# 솔루션 개발 가이드

> 이 문서는 Nexus 플랫폼에 새 솔루션을 추가하기 위한 단계별 가이드입니다.
> AI 에이전트가 새 솔루션을 스캐폴딩할 때 참조합니다.

## 전제 조건

- Node.js 20+
- pnpm 설치 완료
- Nexus 모노레포 클론 완료

---

## Step 1: 사전 준비

새 솔루션을 만들기 전에 아래 정보를 정의합니다.

| 필드        | 형식                                  | 예시          | 설명               |
| ----------- | ------------------------------------- | ------------- | ------------------ |
| id          | kebab-case                            | `my-solution` | 솔루션 고유 식별자 |
| slug        | kebab-case (보통 id와 동일)           | `my-solution` | URL 경로용 식별자  |
| name        | 자유 형식                             | `My Solution` | 솔루션 표시 이름   |
| description | 한 줄 설명                            | `솔루션 설명` | 솔루션 설명        |
| icon        | lucide-react 아이콘 이름 (PascalCase) | `BookOpen`    | 아이콘             |
| category    | 기존 카테고리 ID                      | `data`        | 카테고리 참조      |
| status      | `active` / `beta` / `coming-soon`     | `active`      | 솔루션 상태        |
| port        | 숫자                                  | `3002`        | 개발 서버 포트     |

### 사용 가능한 카테고리

| ID          | 이름      | 아이콘      |
| ----------- | --------- | ----------- |
| `ai-ml`     | AI / ML   | `Brain`     |
| `data`      | Data      | `Database`  |
| `devops`    | DevOps    | `GitBranch` |
| `analytics` | Analytics | `BarChart3` |

> 새 카테고리가 필요하면 `packages/config/src/solutions.ts`의 `categories` 배열에 먼저 추가합니다.

### 아이콘

`lucide-react`에서 제공하는 아이콘 이름을 PascalCase로 사용합니다.
예: `BookOpen`, `Brain`, `Database`, `GitBranch`, `BarChart3`, `MessageSquare`

### 포트 할당 규칙

| 앱        | 포트  |
| --------- | ----- |
| platform  | 5000  |
| codex     | 5001  |
| 새 솔루션 | 5002~ |

---

## Step 2: 디렉토리 구조 생성

아래 구조를 생성합니다. `{id}`를 솔루션 ID로 치환합니다.

```
solutions/{id}/
├── web/
│   └── src/
│       └── app/
├── models/
│   └── src/
├── shared/
│   └── src/
└── docs/
    └── release/
```

> `pnpm-workspace.yaml`에 `solutions/*/web`, `solutions/*/models`, `solutions/*/shared` 패턴이 이미 등록되어 있으므로 디렉토리 구조만 맞추면 워크스페이스에 자동 인식됩니다.

---

## Step 3: Internal 패키지 설정 (models, shared)

Internal Packages 패턴: `exports` 필드가 TypeScript 소스를 직접 가리킵니다. 별도 빌드가 필요 없으며 소비하는 앱의 번들러가 트랜스파일합니다.

### 3-1. models 패키지

**`solutions/{id}/models/package.json`**

```json
{
  "name": "@nexus/{id}-models",
  "version": "0.0.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "@nexus/types": "workspace:*"
  }
}
```

**`solutions/{id}/models/tsconfig.json`**

```json
{
  "extends": "../../../tsconfig.base.json",
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

**`solutions/{id}/models/src/index.ts`**

```ts
// {name} data models
// Add {name}-specific types and data models here
export {};
```

### 3-2. shared 패키지

**`solutions/{id}/shared/package.json`**

```json
{
  "name": "@nexus/{id}-shared",
  "version": "0.0.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "@nexus/types": "workspace:*",
    "@nexus/{id}-models": "workspace:*"
  }
}
```

**`solutions/{id}/shared/tsconfig.json`**

```json
{
  "extends": "../../../tsconfig.base.json",
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

**`solutions/{id}/shared/src/index.ts`**

```ts
// {name} shared utilities
// Add {name}-internal shared utilities here
export {};
```

---

## Step 4: Web 앱 설정

### 4-1. package.json

**`solutions/{id}/web/package.json`**

```json
{
  "name": "@nexus/{id}-web",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port {port}",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@nexus/ui": "workspace:*",
    "@nexus/config": "workspace:*",
    "@nexus/types": "workspace:*",
    "@nexus/{id}-models": "workspace:*",
    "@nexus/{id}-shared": "workspace:*",
    "@base-ui/react": "^1.3.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.577.0",
    "next": "16.2.0",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "shadcn": "^4.0.8",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### 4-2. next.config.ts

**`solutions/{id}/web/next.config.ts`**

```ts
import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  basePath: "/solutions/{id}",
  turbopack: {
    root: resolve(__dirname, "../../.."),
  },
};

export default nextConfig;
```

> **중요**: `basePath` 값은 Step 6에서 등록하는 `route` 값과 반드시 일치해야 합니다.

### 4-3. tsconfig.json

**`solutions/{id}/web/tsconfig.json`**

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### 4-4. eslint.config.mjs

**`solutions/{id}/web/eslint.config.mjs`**

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
```

---

## Step 5: 앱 진입점 작성

### 5-1. globals.css

**`solutions/{id}/web/src/app/globals.css`**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.45 0.2 260);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.65 0.18 260);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
```

### 5-2. layout.tsx

**`solutions/{id}/web/src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@nexus/ui";
import "./globals.css";

// PlatformShell은 Platform 앱 전용입니다.
// 솔루션은 자체 레이아웃(Header, Sidebar 등)을 구현합니다.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "{name} — Nexus",
  description: "{description}",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
```

### 5-3. page.tsx

**`solutions/{id}/web/src/app/page.tsx`**

```tsx
import { {icon} } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui";

export default function {PascalName}HomePage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
        <p className="mt-1 text-muted-foreground">
          {description}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <{icon} className="h-5 w-5 text-primary" />
            {name} 솔루션
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {name} 솔루션의 기능이 여기에 구현됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

> `{PascalName}`은 솔루션 이름을 PascalCase로 변환한 값입니다 (예: `My Solution` → `MySolution`).

---

## Step 6: 솔루션 등록

`packages/config/src/solutions.ts`의 `solutions` 배열에 항목을 추가합니다.

```ts
// packages/config/src/solutions.ts
export const solutions: Solution[] = [
  // ... 기존 솔루션들 ...
  {
    id: "{id}",
    slug: "{slug}",
    name: "{name}",
    description: "{description}",
    icon: "{icon}",
    category: "{category}",
    status: "{status}",
    route: "/solutions/{id}",
  },
];
```

### 필드 규칙

| 필드     | 규칙                                                                  |
| -------- | --------------------------------------------------------------------- |
| id       | kebab-case, 고유해야 함                                               |
| slug     | kebab-case, 보통 id와 동일                                            |
| route    | `/solutions/{id}` 형식, `web/next.config.ts`의 `basePath`와 일치 필수 |
| icon     | `lucide-react`에서 export하는 컴포넌트 이름 (PascalCase)              |
| category | `categories` 배열에 정의된 ID 중 하나                                 |

### status별 동작

| 상태          | 진입 가능 | 사이드바 표시 | 카탈로그 배지 |
| ------------- | --------- | ------------- | ------------- |
| `active`      | O         | O             | 없음          |
| `beta`        | O         | O             | "베타"        |
| `coming-soon` | X         | X             | "예정"        |

---

## Step 7: 의존성 설치 & 실행

```bash
# 1. 의존성 설치 (루트에서 실행)
pnpm install

# 2. 솔루션 개발 서버 실행
pnpm turbo dev --filter=@nexus/{id}-web

# 3. 전체 빌드 확인
pnpm build

# 4. 전체 린트 확인
pnpm lint
```

---

## 검증 체크리스트

- [ ] `pnpm install` 에러 없이 완료
- [ ] `pnpm turbo dev --filter=@nexus/{id}-web` 서버 정상 기동
- [ ] `pnpm build` 전체 빌드 성공
- [ ] `pnpm lint` 린트 에러 없음
- [ ] 브라우저에서 `/solutions/{id}` 접근 시 페이지 렌더링
- [ ] 솔루션 자체 레이아웃 정상 렌더링 (PlatformShell 미사용 확인)
- [ ] 카탈로그 페이지(`/solutions`)에 솔루션 카드 표시

---

## 부록: 주의사항

### basePath와 route 일치

`web/next.config.ts`의 `basePath`와 `packages/config/src/solutions.ts`의 `route` 값이 반드시 일치해야 합니다. 불일치 시 사이드바 링크가 깨집니다.

```
basePath: "/solutions/{id}"  ←→  route: "/solutions/{id}"
```

### Internal Packages 패턴

공유 패키지(`models`, `shared`)의 `exports` 필드는 TypeScript 소스(`.ts`)를 직접 가리킵니다. 이 패키지들은 자체 빌드 스크립트가 없으며, 소비하는 앱(web)의 Turbopack이 트랜스파일합니다.

```json
"exports": {
  ".": "./src/index.ts"
}
```

### 패키지 의존 방향

```
packages/ → solutions/ 방향 의존 금지
```

`@nexus/ui`, `@nexus/shell`, `@nexus/config`, `@nexus/types`는 어떤 솔루션 패키지도 의존하면 안 됩니다. 솔루션 패키지만 플랫폼 패키지를 의존할 수 있습니다.

### 카테고리 관리

카테고리 ID는 `packages/config/src/solutions.ts`의 `categories` 배열에 정의된 값을 사용합니다. 새 카테고리가 필요하면 `categories` 배열에 먼저 추가합니다.

```ts
export const categories: Category[] = [
  { id: "ai-ml", name: "AI / ML", icon: "Brain" },
  { id: "data", name: "Data", icon: "Database" },
  { id: "devops", name: "DevOps", icon: "GitBranch" },
  { id: "analytics", name: "Analytics", icon: "BarChart3" },
  // 새 카테고리 추가 시 여기에 추가
];
```

### 워크스페이스 인식

`pnpm-workspace.yaml`에 다음 패턴이 등록되어 있어, 규칙에 맞는 디렉토리 구조만 만들면 자동 인식됩니다.

```yaml
packages:
  - "solutions/*/web"
  - "solutions/*/models"
  - "solutions/*/shared"
```

### 플레이스홀더 정리

이 가이드에서 사용하는 플레이스홀더 목록:

| 플레이스홀더    | 설명                                  | 예시          |
| --------------- | ------------------------------------- | ------------- |
| `{id}`          | 솔루션 ID (kebab-case)                | `my-solution` |
| `{slug}`        | URL 경로용 식별자 (보통 id와 동일)    | `my-solution` |
| `{name}`        | 솔루션 표시 이름                      | `My Solution` |
| `{PascalName}`  | 솔루션 이름의 PascalCase              | `MySolution`  |
| `{description}` | 솔루션 설명                           | `솔루션 설명` |
| `{icon}`        | lucide-react 아이콘 이름 (PascalCase) | `BookOpen`    |
| `{category}`    | 카테고리 ID                           | `data`        |
| `{status}`      | 솔루션 상태                           | `active`      |
| `{port}`        | 개발 서버 포트 번호                   | `3002`        |
