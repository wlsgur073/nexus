"use client";

import { Badge, cn } from "@nexus/ui";

import type { AuditTimelineItem } from "@nexus/codex-models";

const ACTION_LABELS: Record<string, string> = {
  REQUEST: "신청",
  REVIEW: "검토",
  APPROVE: "승인",
  REJECT: "반려",
  CANCEL: "취소",
  FEEDBACK: "피드백",
  CREATE: "생성",
  UPDATE: "수정",
  DELETE: "삭제",
};

const ACTION_COLORS: Record<string, string> = {
  APPROVE: "bg-green-500",
  REJECT: "bg-red-500",
  REQUEST: "bg-blue-500",
  REVIEW: "bg-blue-400",
  FEEDBACK: "bg-orange-500",
  CANCEL: "bg-gray-400",
  CREATE: "bg-green-400",
  UPDATE: "bg-blue-500",
  DELETE: "bg-red-400",
};

interface AuditTimelinePanelProps {
  targetName: string;
  timeline: AuditTimelineItem[];
}

export function AuditTimelinePanel({
  targetName,
  timeline,
}: AuditTimelinePanelProps) {
  if (timeline.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        이력이 없습니다.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold">
        &quot;{targetName}&quot; 전체 이력
      </p>
      <div className="relative space-y-4 border-l-2 border-border pl-6">
        {timeline.map((event) => (
          <div key={event.logId} className="relative">
            <div
              className={cn(
                "absolute -left-[27px] h-3 w-3 rounded-full",
                ACTION_COLORS[event.actionType] ?? "bg-gray-400",
              )}
            />
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {new Date(event.logDatetime).toLocaleString("ko-KR")}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {ACTION_LABELS[event.actionType] ?? event.actionType}
              </Badge>
              <span className="text-sm">
                {event.actorName}
                {event.actorRole && (
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    ({event.actorRole})
                  </span>
                )}
              </span>
            </div>
            {(event.stateFrom || event.stateTo) && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {event.stateFrom ?? "—"} → {event.stateTo ?? "—"}
              </p>
            )}
            {event.comment && <p className="mt-0.5 text-xs">{event.comment}</p>}
            {event.requestNo && (
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                {event.requestNo}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
