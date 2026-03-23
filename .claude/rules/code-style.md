# 코드 스타일 규칙

## 명명 규칙

- **변수/함수**: camelCase
- **클래스/타입**: PascalCase
- **상수**: UPPER_SNAKE_CASE (모듈 레벨), camelCase (로컬)
- **파일명**: kebab-case (컴포넌트 파일 포함)
- **디렉토리명**: kebab-case

## 포맷팅

- **들여쓰기**: 스페이스 2칸
- **줄 길이 제한**: 권장 100자
- **세미콜론**: 사용
- **따옴표**: 큰따옴표

## 임포트 순서

1. React / Next.js 내장 모듈 (`react`, `next/*`)
2. 외부 서드파티 패키지 (`lucide-react` 등)
3. 모노레포 공유 패키지 (`@nexus/ui`, `@nexus/config`, `@nexus/types`, `@nexus/{id}-models` 등)
4. 내부 컴포넌트 (`@/components/*`)
5. 내부 유틸/설정 (`@/lib/*`, `@/config/*`, `@/types/*`)
6. 상대 경로 모듈
7. 타입 임포트 (`type` 키워드 사용)

## shadcn/ui 규칙

- 스타일: `base-nova` (@base-ui/react 기반)
- 링크 버튼: `<Button render={<Link href="..." />} nativeButton={false}>` 패턴 사용
- `asChild` 패턴 사용 금지 (Radix 전용)
- 새 UI 컴포넌트 필요 시: `pnpm dlx shadcn@latest add <component>`
