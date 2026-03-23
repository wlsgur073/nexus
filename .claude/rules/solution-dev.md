---
paths:
  - "solutions/**"
---

# 솔루션 개발 규칙

## 참조 문서

새 솔루션 추가 시 `docs/solution-development-guide.md`의 Step 1~7을 따릅니다.

## 디렉토리 구조

각 솔루션은 반드시 아래 구조를 따릅니다:

```
solutions/{id}/
├── web/          # Next.js 앱 (@nexus/{id}-web)
├── models/       # 데이터 모델 (@nexus/{id}-models)
├── shared/       # 내부 공유 유틸 (@nexus/{id}-shared)
└── docs/
    └── release/  # 릴리즈 노트 (yyyy-MM-dd-topic.md)
```

## 솔루션 등록

- 솔루션 메타데이터는 `packages/config/src/solutions.ts`의 `solutions` 배열에 등록
- `route` 값과 `web/next.config.ts`의 `basePath` 일치 필수
- `category`는 같은 파일의 `categories` 배열에 정의된 ID 사용

## 레이아웃 패턴

- 각 솔루션은 자체 레이아웃을 소유 — PlatformShell은 Platform 앱 전용이므로 사용하지 않음
- 최소 구조: `TooltipProvider > {children}` (필요 시 자체 Header/Sidebar 추가)
- metadata의 title 형식: `"{name} — Nexus"`

## 의존성 규칙

- 플랫폼 패키지: `@nexus/ui`, `@nexus/config`, `@nexus/types`
- `@nexus/shell`은 Platform 앱 전용 — 솔루션에서는 사용하지 않음
- 솔루션 내부 패키지: `@nexus/{id}-models`, `@nexus/{id}-shared`
- 다른 솔루션 패키지 의존 금지

## 포트 할당

- platform: 3000, codex: 3001, 이후 솔루션: 3002~
- `web/package.json`의 `dev` 스크립트에 `--port {port}` 지정

## 릴리즈 노트

기능 추가, 버그 수정 등 의미 있는 변경을 완료하면 릴리즈 노트를 작성한다.

- **위치**: `solutions/{id}/docs/release/yyyy-MM-dd-topic.md`
- **파일명 예시**: `2026-03-20-standard-term-crud.md`
- **형식**:

```markdown
---
version: 0.1.0
summary: 한 줄 요약
---

## 변경 사항

- 추가된 기능, 수정된 버그, 개선 사항을 항목별로 기술

## 영향 범위

- 변경에 영향받는 패키지 또는 페이지 목록
```

- 한 커밋에 여러 주제가 포함되어도 릴리즈 노트는 **주제별로 1개 파일**
- 사소한 변경(오타, 포맷팅)은 릴리즈 노트 불필요
