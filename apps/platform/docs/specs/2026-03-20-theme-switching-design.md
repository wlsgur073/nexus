---
title: 테마 전환 기능 설계
description: next-themes 기반 라이트/다크 모드 토글 설계
version: 0.1.0
---

# 테마 전환 기능 설계

> 날짜: 2026-03-20
> 상태: 승인됨

## 목적

Nexus 플랫폼에 라이트/다크 모드 전환 기능을 추가한다. 기본값은 시스템 설정을 따르며, 사용자가 토글 버튼으로 전환할 수 있다.

## 접근 방식

`next-themes` 라이브러리를 사용한다. SSR 환경에서의 테마 깜빡임(FOUC) 방지가 내장되어 있고, Next.js App Router와 호환된다.

## 변경 파일

| 파일                                     | 변경 내용                                         |
| ---------------------------------------- | ------------------------------------------------- |
| `packages/ui/package.json`               | `next-themes` 의존성 추가                         |
| `packages/ui/src/theme-provider.tsx`     | ThemeProvider 래핑 컴포넌트 생성                  |
| `packages/ui/src/index.ts`               | ThemeProvider export 추가                         |
| `packages/shell/src/theme-toggle.tsx`    | Sun/Moon 토글 버튼 컴포넌트 생성                  |
| `packages/shell/src/header.tsx`          | ThemeToggle 배치 (사용자 메뉴 왼쪽)               |
| `packages/shell/src/index.ts`            | ThemeToggle export 추가                           |
| `apps/platform/src/app/layout.tsx`       | ThemeProvider 래핑, suppressHydrationWarning 추가 |
| `solutions/codex/web/src/app/layout.tsx` | 동일                                              |

## 동작 명세

- **초기값**: OS 시스템 설정 (`defaultTheme="system"`)
- **토글**: 현재 라이트 → 다크, 다크 → 라이트 (아이콘 버튼)
- **저장**: `localStorage`에 자동 저장 (next-themes 내장)
- **적용 방식**: `<html>`에 `class="dark"` 자동 추가/제거 (`attribute="class"`)
- **SSR**: `suppressHydrationWarning`으로 hydration mismatch 방지

## 토글 UI

- 위치: 헤더 우측, 사용자 메뉴 버튼 왼쪽
- 라이트 모드일 때: Sun 아이콘 표시
- 다크 모드일 때: Moon 아이콘 표시
- `variant="ghost" size="icon"` (기존 헤더 버튼과 동일 스타일)

## 의존성 방향

```
next-themes → @nexus/ui (ThemeProvider) → @nexus/shell (ThemeToggle) → apps
```

`next-themes`를 `@nexus/ui`의 dependency로 추가하고, `@nexus/shell`은 `useTheme` hook을 `next-themes`에서 직접 import한다 (`@nexus/shell`은 이미 `next` peerDependency가 있으므로 next-themes 호환).
