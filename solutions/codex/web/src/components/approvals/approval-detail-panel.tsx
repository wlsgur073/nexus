"use client";

import { useEffect, useState, useTransition } from "react";
import { Clock, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, Separator } from "@nexus/ui";
import {
  getApprovalDetail,
  getApprovalChanges,
  getApprovalHistory,
} from "@nexus/codex-models";
import type { Request, RequestChange, AuditLog } from "@nexus/codex-models";
import { REQUEST_STATUS_LABELS } from "@nexus/codex-shared";

import { StatusBadge } from "@/components/ui/status-badge";
import { TargetTypeBadge } from "@/components/ui/target-type-badge";
import { ChangeDiffTable } from "@/components/standards/change-diff-table";
import { ApprovalActionForm } from "./approval-action-form";

interface ApprovalDetailPanelProps {
  requestId: number;
  onProcessed: () => void;
}

export function ApprovalDetailPanel({ requestId, onProcessed }: ApprovalDetailPanelProps) {
  const [request, setRequest] = useState<Request | null>(null);
  const [changes, setChanges] = useState<RequestChange[]>([]);
  const [history, setHistory] = useState<AuditLog[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const [req, ch, hist] = await Promise.all([
        getApprovalDetail(requestId),
        getApprovalChanges(requestId),
        getApprovalHistory(requestId),
      ]);
      setRequest(req);
      setChanges(ch);
      setHistory(hist);
    });
  }, [requestId]);

  if (isPending) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">로딩 중...</p>
        </CardContent>
      </Card>
    );
  }

  if (!request) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">신청 정보를 찾을 수 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{request.requestNo}</CardTitle>
            <StatusBadge status={request.status} variant="request" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">유형</span>
              <div className="mt-1">
                <TargetTypeBadge type={request.targetType} />
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">대상명</span>
              <p className="mt-1 font-medium">{request.targetName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">신청 유형</span>
              <p className="mt-1 font-medium">{request.requestType}</p>
            </div>
            <div>
              <span className="text-muted-foreground">신청일</span>
              <p className="mt-1 font-medium">
                {request.requestDate.toLocaleDateString("ko-KR")}
              </p>
            </div>
          </div>
          {request.requestReason && (
            <div className="text-sm">
              <span className="text-muted-foreground">사유</span>
              <p className="mt-1">{request.requestReason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {changes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">변경 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <ChangeDiffTable changes={changes} />
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">처리 이력</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((log) => (
                <div
                  key={log.logId}
                  className="flex items-start gap-3 text-sm"
                >
                  <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p>
                      <span className="font-medium">{log.actionType}</span>
                      {log.stateFrom && log.stateTo && (
                        <span className="text-muted-foreground">
                          {" "}
                          {REQUEST_STATUS_LABELS[log.stateFrom as keyof typeof REQUEST_STATUS_LABELS] ?? log.stateFrom}
                          {" → "}
                          {REQUEST_STATUS_LABELS[log.stateTo as keyof typeof REQUEST_STATUS_LABELS] ?? log.stateTo}
                        </span>
                      )}
                    </p>
                    {log.comment && (
                      <p className="mt-0.5 text-muted-foreground">
                        {log.comment}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{log.actorRole}</span>
                      <span>·</span>
                      <span>
                        {log.logDatetime.toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      <ApprovalActionForm requestId={requestId} onProcessed={onProcessed} />
    </div>
  );
}
