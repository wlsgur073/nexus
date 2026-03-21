"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui";

import type { RecentActivity } from "@nexus/codex-models";

import { TargetTypeBadge } from "@/components/ui/target-type-badge";

interface ActivityTimelineProps {
  activities: RecentActivity[];
}

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

const ACTION_LABELS: Record<string, string> = {
  REQUEST: "신청",
  REVIEW: "검토",
  APPROVE: "승인",
  REJECT: "반려",
  CREATE: "생성",
  UPDATE: "수정",
  DELETE: "삭제",
  CANCEL: "취소",
  FEEDBACK: "검토요청",
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div className="flex-1 text-sm">
                <div className="flex items-center gap-2">
                  <TargetTypeBadge type={activity.targetType} />
                  <span className="font-medium">{activity.targetName}</span>
                </div>
                <p className="mt-0.5 text-muted-foreground">
                  {activity.actorName}님이{" "}
                  {ACTION_LABELS[activity.actionType] ?? activity.actionType}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatRelativeTime(activity.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
