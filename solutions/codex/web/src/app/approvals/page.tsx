"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui";

import { ApprovalList } from "@/components/approvals/approval-list";
import { ApprovalDetailPanel } from "@/components/approvals/approval-detail-panel";
import { BatchActionDialog } from "@/components/approvals/batch-action-dialog";
import type { Request } from "@nexus/codex-models";

export default function ApprovalsPage() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeRequest, setActiveRequest] = useState<Request | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelect = (request: Request) => {
    setActiveRequest(request);
  };

  const handleProcessed = () => {
    setActiveRequest(null);
    setSelectedIds(new Set());
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">승인 워크벤치</h1>
          <p className="mt-1 text-muted-foreground">
            대기 중인 신청 건을 검토하고 승인 또는 반려하세요.
          </p>
        </div>
        <BatchActionDialog
          selectedIds={selectedIds}
          onProcessed={handleProcessed}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">신청 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalList
              key={refreshKey}
              onSelect={handleSelect}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              activeRequestId={activeRequest?.requestId ?? null}
            />
          </CardContent>
        </Card>

        {activeRequest ? (
          <ApprovalDetailPanel
            requestId={activeRequest.requestId}
            onProcessed={handleProcessed}
          />
        ) : (
          <Card>
            <CardContent className="flex h-64 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                목록에서 신청 건을 선택하세요.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
