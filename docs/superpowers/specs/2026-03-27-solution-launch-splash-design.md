# 솔루션 런치 스플래시 디자인

## 개요

솔루션 상세 페이지에 "솔루션 열기" 버튼을 추가하고, 클릭 시 새 탭에서 솔루션 로고 스플래시 화면을 2-3초간 표시한 뒤 실제 솔루션 앱으로 이동하는 기능.

## 사용자 흐름

```
[상세 페이지]              [새 탭: /launch/codex]              [새 탭: /solutions/codex]
  "솔루션 열기" 클릭  ──→  스플래시(아이콘 + 이름 + 로딩바)  ──→  솔루션 메인 페이지
                   new tab          2.5초 후 replace            히스토리에 스플래시 안 남음
```

1. 솔루션 상세 페이지에서 "솔루션 열기" 버튼 클릭
2. 새 탭이 열리며 `/launch/[slug]` 스플래시 페이지 표시
3. 스플래시 페이지에서 솔루션 아이콘 + 이름 + 프로그레스 바를 2.5초간 표시
4. `window.location.replace(solution.route)`로 실제 솔루션 앱으로 전환 (히스토리에 스플래시 미잔류)

## 변경 파일

### 신규 파일

| 파일                                                                | 역할                                                      |
| ------------------------------------------------------------------- | --------------------------------------------------------- |
| `apps/platform/src/components/solutions/solution-launch-button.tsx` | Client Component — 새 탭으로 `/launch/[slug]` 열기        |
| `apps/platform/src/app/launch/[slug]/page.tsx`                      | 스플래시 페이지 — 아이콘, 이름, 프로그레스 바, 리다이렉트 |

### 수정 파일

| 파일                                              | 변경 내용                            |
| ------------------------------------------------- | ------------------------------------ |
| `apps/platform/src/app/solutions/[slug]/page.tsx` | `SolutionLaunchButton` 컴포넌트 추가 |

## 컴포넌트 설계

### SolutionLaunchButton

- **위치**: `apps/platform/src/components/solutions/solution-launch-button.tsx`
- **타입**: Client Component (`"use client"`)
- **Props**: `slug: string`, `status: SolutionStatus`
- **동작**:
  - `active` / `beta`: 클릭 시 `window.open(\`/launch/${slug}\`, '\_blank')`
  - `coming-soon`: `disabled` 상태, 클릭 불가
- **UI**:
  - `active`: primary variant 버튼, "솔루션 열기" + ExternalLink 아이콘
  - `beta`: secondary variant 버튼, "솔루션 열기 (베타)" + ExternalLink 아이콘
  - `coming-soon`: disabled 버튼, "준비 중"

### 상세 페이지 버튼 배치

솔루션 제목 영역(이름 + 배지)의 우측에 배치:

```
┌─────────────────────────────────────────────────┐
│  [아이콘]  Codex  [활성]       [솔루션 열기 →]  │
│           데이터 표준용어, 도메인...              │
│           카테고리: Data                          │
└─────────────────────────────────────────────────┘
```

### 스플래시 페이지 (`/launch/[slug]`)

- **위치**: `apps/platform/src/app/launch/[slug]/page.tsx`
- **타입**: Client Component (`"use client"`)
- **레이아웃**: 전체 화면(100vh, 100vw), 중앙 정렬, flex column
- **요소**:
  - `DynamicIcon`: 64px 크기, 원형 컬러 배경 (`bg-primary/10`)
  - 솔루션 이름: `text-2xl font-bold`
  - 프로그레스 바: 2.5초간 0% → 100% 애니메이션 (CSS transition 또는 `@nexus/ui`의 `Progress` 컴포넌트)
- **애니메이션**: 마운트 시 fade-in (opacity 0→1)
- **테마**: 라이트/다크 모드 자동 대응 (`bg-background`, `text-foreground`)

### 스플래시 페이지 동작

1. 마운트 시 `getSolutionBySlug(slug)`로 솔루션 조회
2. 솔루션 미존재 또는 `coming-soon` → `window.location.replace('/solutions')` (즉시 리다이렉트)
3. 유효한 솔루션 → fade-in 애니메이션 시작 + 프로그레스 바 진행
4. 2.5초 후 `window.location.replace(solution.route)`로 솔루션 앱 이동

### Nginx 라우팅 호환성

- `/launch/*` 경로는 Nginx의 `/solutions/codex` 매칭 규칙에 해당하지 않으므로, catch-all(`/`)을 통해 platform 앱으로 정상 라우팅됨
- Docker 없는 단독 개발 시에도 platform 앱(port 5000) 내에서 스플래시 페이지는 정상 동작. 단, 솔루션 앱으로의 리다이렉트는 Nginx 리버스 프록시 필요

## 에러 처리

| 상황                           | 처리                                                              |
| ------------------------------ | ----------------------------------------------------------------- |
| 잘못된 slug                    | `/solutions`로 즉시 리다이렉트                                    |
| `coming-soon` 솔루션 직접 접근 | `/solutions`로 즉시 리다이렉트                                    |
| 솔루션 앱 미실행               | 브라우저의 기본 에러 표시 (스플래시 이후 발생, 플랫폼 앱 범위 밖) |

## 의존성

- 기존 패키지만 사용: `@nexus/ui` (Button, Progress), `@nexus/config` (DynamicIcon, getSolutionBySlug), `@nexus/types` (SolutionStatus)
- 새 패키지 설치 불필요
