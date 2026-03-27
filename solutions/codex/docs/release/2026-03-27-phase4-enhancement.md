---
version: 0.4.0
summary: 프론트엔드 품질 완성 — UX 일관성, 접근성, 성능 보강 (신규 화면 없음)
---

## 변경 사항

### 동적 페이지 타이틀

- 루트 layout에 `title.template: "%s — Codex — Nexus"` 적용
- 13개 라우트에 metadata layout 추가 → 브라우저 탭에 라우트별 제목 표시

### Skeleton 로딩 통합

- 8개 컴포넌트의 "로딩 중..." 텍스트를 Skeleton UI로 교체
- 대상: governance, validations, audit-table, user-table, system-code-table, common-code-search-table, standard-detail-sheet, approval-detail-panel

### Toast 알림 통합

- Phase 1-2 mutation에 toast.success/error 추가
- 대상: 표준 신청 폼(3건), 승인 처리, 일괄 승인

### 다크모드 색상 수정

- `dark:` variant 누락된 Badge 색상에 다크모드 대응 추가
- 대상: violation-list, audit-table, user-table, common-code-search-table

### Standards Explorer 프리페치

- `useTransition` → `useQuery` + `keepPreviousData` 전환
- `prefetchQuery`로 다음 페이지 데이터 미리 로드

### 표준 용어 요청 폼 강화

- `WordTagInput` 신규 컴포넌트: debounce 검색 + 태그 선택 UI
- 물리명 자동생성: `buildPhysicalName` 유틸 연동 (readonly)
- 도메인유형 Select, 인포타입 6종 Select 추가
- 비즈니스 규칙 적용: STD-004 (물리명 자동생성), STD-006 (최소 1개 단어)

### 권한 트리 키보드 내비게이션

- Arrow Up/Down (행 이동), Left/Right (접기/펼치기), Space (체크박스 토글)
- `aria-activedescendant`, 포커스 링 시각 표시

### 접근성 개선

- Pagination prev/next 버튼 `aria-label` 추가
- Permission tree expand 버튼 라벨 추가
- WordTagInput `aria-controls` 추가

## 영향 범위

- `@nexus/codex-web` (solutions/codex/web)
