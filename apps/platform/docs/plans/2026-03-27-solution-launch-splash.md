# 솔루션 런치 스플래시 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 솔루션 상세 페이지에 "솔루션 열기" 버튼을 추가하고, 클릭 시 새 탭에서 로고 스플래시 화면(2.5초)을 거쳐 실제 솔루션 앱으로 이동하는 기능 구현

**Architecture:** Server Component(`/launch/[slug]` 페이지)가 솔루션 데이터를 조회하고 유효성을 검증한 뒤, Client Component(`SolutionSplash`)에 데이터를 전달. 스플래시는 `fixed inset-0 z-[100]`으로 PlatformShell 위를 덮는 전체 화면 오버레이. 2.5초 후 `window.location.replace()`로 솔루션 앱으로 이동(히스토리 미잔류).

**Tech Stack:** Next.js 16 App Router, React 19, @nexus/ui (Button, Progress), @nexus/config (DynamicIcon, getSolutionBySlug), @nexus/types (SolutionStatus), lucide-react (ExternalLink)

**Spec:** `docs/superpowers/specs/2026-03-27-solution-launch-splash-design.md`

---

## 파일 구조

| 파일                                                                | 역할                                                            | 유형                    |
| ------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------- |
| `apps/platform/src/components/solutions/solution-launch-button.tsx` | 상세 페이지의 "솔루션 열기" 버튼                                | 신규 (Client Component) |
| `apps/platform/src/components/solutions/solution-splash.tsx`        | 전체 화면 스플래시 (아이콘 + 이름 + 프로그레스 바 + 리다이렉트) | 신규 (Client Component) |
| `apps/platform/src/app/launch/[slug]/page.tsx`                      | 스플래시 라우트 (데이터 조회 + 유효성 검증)                     | 신규 (Server Component) |
| `apps/platform/src/app/solutions/[slug]/page.tsx`                   | 솔루션 상세 페이지 — 버튼 추가                                  | 수정                    |

---

### Task 1: SolutionLaunchButton 컴포넌트 생성

상세 페이지에서 새 탭으로 스플래시를 여는 버튼 컴포넌트.

**Files:**

- Create: `apps/platform/src/components/solutions/solution-launch-button.tsx`

- [ ] **Step 1: SolutionLaunchButton 컴포넌트 작성**

```tsx
// apps/platform/src/components/solutions/solution-launch-button.tsx
"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@nexus/ui";
import type { SolutionStatus } from "@nexus/types";

type SolutionLaunchButtonProps = {
  slug: string;
  status: SolutionStatus;
};

const buttonConfig: Record<
  SolutionStatus,
  {
    label: string;
    variant: "default" | "secondary" | "outline";
    disabled: boolean;
  }
> = {
  active: { label: "솔루션 열기", variant: "default", disabled: false },
  beta: { label: "솔루션 열기 (베타)", variant: "secondary", disabled: false },
  "coming-soon": { label: "준비 중", variant: "outline", disabled: true },
};

export function SolutionLaunchButton({
  slug,
  status,
}: SolutionLaunchButtonProps) {
  const config = buttonConfig[status];

  function handleClick() {
    window.open(`/launch/${slug}`, "_blank");
  }

  return (
    <Button
      variant={config.variant}
      size="sm"
      disabled={config.disabled}
      onClick={handleClick}
    >
      {config.label}
      {!config.disabled && <ExternalLink className="ml-1.5 h-3.5 w-3.5" />}
    </Button>
  );
}
```

- [ ] **Step 2: 린트 확인**

Run: `pnpm turbo lint --filter=@nexus/platform`
Expected: 에러 없이 통과

- [ ] **Step 3: 커밋**

```bash
git add apps/platform/src/components/solutions/solution-launch-button.tsx
git commit -m "feat(platform): add SolutionLaunchButton component"
```

---

### Task 2: SolutionSplash 컴포넌트 생성

전체 화면 스플래시 — 솔루션 아이콘, 이름, 프로그레스 바를 표시하고 2.5초 후 리다이렉트.

**Files:**

- Create: `apps/platform/src/components/solutions/solution-splash.tsx`

**참고 — @nexus/ui Progress 사용법:**
`Progress` 컴포넌트는 `@base-ui/react` 기반. `value` prop(0-100)으로 진행률 제어. 내부의 `ProgressIndicator`에 `transition-all` 클래스가 기본 적용됨 — `duration`만 추가하면 애니메이션 완성.

- [ ] **Step 1: SolutionSplash 컴포넌트 작성**

```tsx
// apps/platform/src/components/solutions/solution-splash.tsx
"use client";

import { useEffect, useState } from "react";
import { DynamicIcon } from "@nexus/config";
import { Progress, ProgressTrack, ProgressIndicator } from "@nexus/ui";

type SolutionSplashProps = {
  name: string;
  icon: string;
  route: string;
};

export function SolutionSplash({ name, icon, route }: SolutionSplashProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // fade-in 트리거
    const fadeIn = requestAnimationFrame(() => setVisible(true));

    // 프로그레스 바 시작 (다음 프레임에서 100%로 전환 → CSS transition이 애니메이션)
    const progressTimer = setTimeout(() => setProgress(100), 100);

    // 2.5초 후 솔루션 앱으로 이동
    const redirectTimer = setTimeout(() => {
      window.location.replace(route);
    }, 2500);

    return () => {
      cancelAnimationFrame(fadeIn);
      clearTimeout(progressTimer);
      clearTimeout(redirectTimer);
    };
  }, [route]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <DynamicIcon name={icon} className="h-10 w-10 text-primary" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {name}
      </h1>

      <div className="w-64">
        <Progress value={progress}>
          <ProgressTrack className="h-1.5">
            <ProgressIndicator className="duration-[2400ms] ease-linear" />
          </ProgressTrack>
        </Progress>
      </div>
    </div>
  );
}
```

**동작 설명:**

- 마운트 직후 `visible`을 `true`로 → `opacity-0` → `opacity-100` (500ms fade-in)
- 100ms 후 `progress`를 100으로 → ProgressIndicator의 CSS transition(2400ms linear)이 0%→100% 애니메이션
- 2500ms 후 `window.location.replace(route)` → 히스토리에 스플래시 미잔류

- [ ] **Step 2: 린트 확인**

Run: `pnpm turbo lint --filter=@nexus/platform`
Expected: 에러 없이 통과

- [ ] **Step 3: 커밋**

```bash
git add apps/platform/src/components/solutions/solution-splash.tsx
git commit -m "feat(platform): add SolutionSplash full-screen component"
```

---

### Task 3: /launch/[slug] 스플래시 페이지 생성

Server Component로 솔루션 데이터를 조회하고, 유효하지 않은 접근은 카탈로그로 리다이렉트. 유효한 경우 SolutionSplash를 렌더링.

**Files:**

- Create: `apps/platform/src/app/launch/[slug]/page.tsx`

**참고 — 기존 패턴:**
`apps/platform/src/app/solutions/[slug]/page.tsx`의 `generateStaticParams` + `params: Promise<{ slug: string }>` 패턴을 따름 (Next.js 16 App Router).

- [ ] **Step 1: 스플래시 페이지 작성**

```tsx
// apps/platform/src/app/launch/[slug]/page.tsx
import { redirect } from "next/navigation";
import { getSolutionBySlug, solutions } from "@nexus/config";
import { SolutionSplash } from "@/components/solutions/solution-splash";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return solutions
    .filter((s) => s.status !== "coming-soon")
    .map((s) => ({ slug: s.slug }));
}

export default async function LaunchPage({ params }: Props) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution || solution.status === "coming-soon") {
    redirect("/solutions");
  }

  return (
    <SolutionSplash
      name={solution.name}
      icon={solution.icon}
      route={solution.route}
    />
  );
}
```

**유효성 검증:**

- slug가 존재하지 않는 솔루션 → `/solutions`로 리다이렉트
- `coming-soon` 솔루션에 직접 접근 → `/solutions`로 리다이렉트
- `active` / `beta` 솔루션 → SolutionSplash 렌더링

**Nginx 호환성:**
`/launch/*` 경로는 Nginx의 `/solutions/codex` 매칭에 해당하지 않으므로, catch-all(`/`)을 통해 platform 앱으로 정상 라우팅됨.

- [ ] **Step 2: 린트 확인**

Run: `pnpm turbo lint --filter=@nexus/platform`
Expected: 에러 없이 통과

- [ ] **Step 3: 커밋**

```bash
git add apps/platform/src/app/launch/[slug]/page.tsx
git commit -m "feat(platform): add /launch/[slug] splash page route"
```

---

### Task 4: 솔루션 상세 페이지에 버튼 추가

기존 상세 페이지의 솔루션 제목 영역에 SolutionLaunchButton을 배치.

**Files:**

- Modify: `apps/platform/src/app/solutions/[slug]/page.tsx:1-131`

- [ ] **Step 1: SolutionLaunchButton import 추가 및 버튼 배치**

`apps/platform/src/app/solutions/[slug]/page.tsx`에서:

1. import 추가 (기존 import 블록 뒤):

```tsx
import { SolutionLaunchButton } from "@/components/solutions/solution-launch-button";
```

2. 솔루션 제목 영역(line 67)의 `<div className="flex items-center gap-3">`을 수정하여 버튼 추가:

기존:

```tsx
<div className="flex items-center gap-3">
  <h1 className="text-2xl font-bold tracking-tight">{solution.name}</h1>
  <Badge variant={statusVariant[solution.status]}>
    {statusLabel[solution.status]}
  </Badge>
</div>
```

변경:

```tsx
<div className="flex items-center gap-3">
  <h1 className="text-2xl font-bold tracking-tight">{solution.name}</h1>
  <Badge variant={statusVariant[solution.status]}>
    {statusLabel[solution.status]}
  </Badge>
  <SolutionLaunchButton slug={solution.slug} status={solution.status} />
</div>
```

- [ ] **Step 2: 빌드 확인**

Run: `pnpm turbo build --filter=@nexus/platform`
Expected: 빌드 성공

- [ ] **Step 3: 린트 확인**

Run: `pnpm turbo lint --filter=@nexus/platform`
Expected: 에러 없이 통과

- [ ] **Step 4: 커밋**

```bash
git add apps/platform/src/app/solutions/[slug]/page.tsx
git commit -m "feat(platform): wire SolutionLaunchButton into solution detail page"
```

---

### Task 5: 수동 테스트 및 최종 검증

**Files:** (변경 없음 — 테스트만)

- [ ] **Step 1: 개발 서버 실행**

Run: `pnpm turbo dev --filter=@nexus/platform`
Expected: `http://localhost:5000` 접속 가능

- [ ] **Step 2: active 솔루션 테스트 (Codex)**

1. `http://localhost:5000/solutions/codex` 접속
2. "솔루션 열기" 버튼이 primary variant로 표시되는지 확인
3. 버튼 클릭 → 새 탭이 `http://localhost:5000/launch/codex`로 열리는지 확인
4. 스플래시 화면: BookOpen 아이콘 + "Codex" 텍스트 + 프로그레스 바 애니메이션 확인
5. 약 2.5초 후 `/solutions/codex`로 리다이렉트 확인
6. 뒤로가기 시 스플래시로 돌아가지 않는지 확인 (`replace` 동작)

- [ ] **Step 3: beta 솔루션 테스트 (LLM Gateway)**

1. `http://localhost:5000/solutions/llm-gateway` 접속
2. "솔루션 열기 (베타)" 버튼이 secondary variant로 표시되는지 확인
3. 버튼 클릭 → 새 탭 스플래시 → MessageSquare 아이콘 + "LLM Gateway" 확인

- [ ] **Step 4: coming-soon 솔루션 테스트 (AI Factory)**

1. `http://localhost:5000/solutions/ai-factory` 접속
2. "준비 중" 버튼이 disabled 상태인지 확인
3. 클릭이 동작하지 않는지 확인

- [ ] **Step 5: 직접 접근 방어 테스트**

1. `http://localhost:5000/launch/ai-factory` 직접 접속 → `/solutions`로 리다이렉트 확인
2. `http://localhost:5000/launch/nonexistent` 접속 → `/solutions`로 리다이렉트 확인

- [ ] **Step 6: 다크 모드 테스트**

1. 테마 토글로 다크 모드 전환
2. 스플래시 페이지가 다크 배경 + 적절한 텍스트 색상으로 표시되는지 확인

- [ ] **Step 7: 전체 빌드 + 린트 최종 확인**

Run: `pnpm build && pnpm lint`
Expected: 전체 통과

- [ ] **Step 8: 최종 커밋 (필요 시)**

수동 테스트 중 수정사항이 있었다면 추가 커밋.
