"use client";

import type { ExplorerItem } from "@nexus/codex-models";
import type { TargetType } from "@nexus/codex-models";

import { DataTable } from "@/components/ui/data-table";
import type { Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";

interface ExplorerTableProps {
  activeTab: TargetType;
  items: ExplorerItem[];
  isLoading: boolean;
  selectedId: number | null;
  onRowClick: (item: ExplorerItem) => void;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("ko-KR");
}

const TERM_COLUMNS: Column<ExplorerItem>[] = [
  { key: "name", label: "표준용어명", render: (item) => <span className="font-medium">{item.name}</span> },
  { key: "physicalName", label: "물리명", render: (item) => <code className="text-xs">{item.physicalName}</code> },
  { key: "domainType", label: "도메인유형" },
  { key: "infoType", label: "인포타입" },
  { key: "definition", label: "정의", render: (item) => <span className="line-clamp-1 max-w-[200px]">{item.definition}</span> },
  { key: "status", label: "상태", render: (item) => <StatusBadge status={item.status} /> },
  { key: "regDate", label: "등록일", render: (item) => formatDate(item.regDate) },
];

const WORD_COLUMNS: Column<ExplorerItem>[] = [
  { key: "name", label: "표준단어명", render: (item) => <span className="font-medium">{item.name}</span> },
  { key: "abbrName", label: "영문약어", render: (item) => <code className="text-xs">{item.abbrName}</code> },
  { key: "engName", label: "영문명" },
  { key: "definition", label: "정의", render: (item) => <span className="line-clamp-1 max-w-[200px]">{item.definition}</span> },
  { key: "domainType", label: "도메인유형" },
  { key: "status", label: "상태", render: (item) => <StatusBadge status={item.status} /> },
  { key: "regDate", label: "등록일", render: (item) => formatDate(item.regDate) },
];

const DOMAIN_COLUMNS: Column<ExplorerItem>[] = [
  { key: "name", label: "도메인명", render: (item) => <span className="font-medium">{item.name}</span> },
  { key: "domainType", label: "도메인유형" },
  { key: "dataType", label: "데이터타입", render: (item) => <code className="text-xs">{item.dataType}</code> },
  { key: "dataLength", label: "데이터길이", render: (item) => <code className="text-xs">{item.dataLength ?? "-"}</code> },
  { key: "definition", label: "정의", render: (item) => <span className="line-clamp-1 max-w-[200px]">{item.definition}</span> },
  { key: "status", label: "상태", render: (item) => <StatusBadge status={item.status} /> },
  { key: "regDate", label: "등록일", render: (item) => formatDate(item.regDate) },
];

const COLUMNS_MAP: Record<TargetType, Column<ExplorerItem>[]> = {
  TERM: TERM_COLUMNS,
  WORD: WORD_COLUMNS,
  DOMAIN: DOMAIN_COLUMNS,
  COMMON_CODE: TERM_COLUMNS,
};

export function ExplorerTable({
  activeTab,
  items,
  isLoading,
  selectedId,
  onRowClick,
}: ExplorerTableProps) {
  return (
    <DataTable
      columns={COLUMNS_MAP[activeTab]}
      data={items}
      isLoading={isLoading}
      onRowClick={onRowClick}
      getRowId={(item) => item.id}
      activeRowId={selectedId}
      emptyMessage="검색 결과가 없습니다."
    />
  );
}
