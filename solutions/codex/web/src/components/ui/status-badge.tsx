"use client";

import { Badge } from "@nexus/ui";

import type { DraftStatus, RequestStatus, StandardStatus } from "@nexus/codex-models";
import {
  DRAFT_STATUS_LABELS,
  REQUEST_STATUS_LABELS,
  STANDARD_STATUS_LABELS,
  getDraftStatusColor,
  getRequestStatusColor,
  getStandardStatusColor,
} from "@nexus/codex-shared";

interface StatusBadgeProps {
  status: StandardStatus | RequestStatus | DraftStatus;
  variant?: "standard" | "request" | "draft";
}

export function StatusBadge({ status, variant = "standard" }: StatusBadgeProps) {
  let label: string;
  let colorClass: string;

  switch (variant) {
    case "request":
      label = REQUEST_STATUS_LABELS[status as RequestStatus] ?? status;
      colorClass = getRequestStatusColor(status as RequestStatus);
      break;
    case "draft":
      label = DRAFT_STATUS_LABELS[status as DraftStatus] ?? status;
      colorClass = getDraftStatusColor(status as DraftStatus);
      break;
    default:
      label = STANDARD_STATUS_LABELS[status as StandardStatus] ?? status;
      colorClass = getStandardStatusColor(status as StandardStatus);
  }

  return (
    <Badge variant="outline" className={`text-xs font-medium ${colorClass}`}>
      {label}
    </Badge>
  );
}
