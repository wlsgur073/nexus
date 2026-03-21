"use client";

import { useEffect, useState, useTransition } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nexus/ui";
import { searchExplorer } from "@nexus/codex-models";
import type { ExplorerItem, StandardStatus, TargetType } from "@nexus/codex-models";

import { ExplorerFilters } from "@/components/standards/explorer-filters";
import { ExplorerTable } from "@/components/standards/explorer-table";
import { StandardDetailSheet } from "@/components/standards/standard-detail-sheet";
import { Pagination } from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/use-debounce";

export default function StandardsPage() {
  const [activeTab, setActiveTab] = useState<TargetType>("TERM");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [domainType, setDomainType] = useState("all");
  const [items, setItems] = useState<ExplorerItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExplorerItem | null>(null);

  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    startTransition(async () => {
      const res = await searchExplorer({
        type: activeTab,
        keyword: debouncedKeyword || undefined,
        status: status === "all" ? undefined : (status as StandardStatus),
        domainType: domainType === "all" ? undefined : domainType,
        page,
        pageSize: 20,
      });
      setItems(res.items);
      setTotalPages(res.totalPages);
    });
  }, [activeTab, debouncedKeyword, status, domainType, page]);

  const handleRowClick = (item: ExplorerItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">표준 탐색기</h1>
        <p className="mt-1 text-muted-foreground">
          표준용어, 표준단어, 표준도메인을 검색하고 상세 정보를 확인하세요.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as TargetType);
          setPage(1);
        }}
      >
        <TabsList>
          <TabsTrigger value="TERM">표준용어</TabsTrigger>
          <TabsTrigger value="WORD">표준단어</TabsTrigger>
          <TabsTrigger value="DOMAIN">표준도메인</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <ExplorerFilters
            keyword={keyword}
            onKeywordChange={(v) => {
              setKeyword(v);
              setPage(1);
            }}
            status={status}
            onStatusChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            domainType={domainType}
            onDomainTypeChange={(v) => {
              setDomainType(v);
              setPage(1);
            }}
            activeTab={activeTab}
          />
        </div>

        <TabsContent value={activeTab} className="mt-4">
          <ExplorerTable
            activeTab={activeTab}
            items={items}
            isLoading={isPending}
            selectedId={selectedItem?.id ?? null}
            onRowClick={handleRowClick}
          />
        </TabsContent>
      </Tabs>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {selectedItem && (
        <StandardDetailSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          targetType={selectedItem.type}
          targetId={selectedItem.id}
        />
      )}
    </div>
  );
}
