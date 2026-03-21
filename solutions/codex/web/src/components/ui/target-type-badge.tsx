"use client";

import { Badge } from "@nexus/ui";

import type { TargetType } from "@nexus/codex-models";

const TARGET_TYPE_CONFIG: Record<
  TargetType,
  { label: string; className: string }
> = {
  WORD: { label: "단어", className: "bg-blue-100 text-blue-800" },
  DOMAIN: { label: "도메인", className: "bg-purple-100 text-purple-800" },
  TERM: { label: "용어", className: "bg-emerald-100 text-emerald-800" },
  COMMON_CODE: { label: "공통코드", className: "bg-orange-100 text-orange-800" },
};

interface TargetTypeBadgeProps {
  type: TargetType;
}

export function TargetTypeBadge({ type }: TargetTypeBadgeProps) {
  const config = TARGET_TYPE_CONFIG[type];
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}
