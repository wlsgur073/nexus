"use client";

import { Search } from "lucide-react";

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@nexus/ui";

import type { TargetType } from "@nexus/codex-models";

const STATUS_OPTIONS = [
  { value: "all", label: "전체 상태" },
  { value: "BASELINE", label: "기존" },
  { value: "PENDING", label: "신청" },
  { value: "APPROVED", label: "승인" },
  { value: "REJECTED", label: "반려" },
];

const DOMAIN_TYPE_OPTIONS = [
  { value: "all", label: "전체 유형" },
  { value: "명칭", label: "명칭" },
  { value: "금액", label: "금액" },
  { value: "번호", label: "번호" },
  { value: "코드", label: "코드" },
  { value: "일자", label: "일자" },
];

interface ExplorerFiltersProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  domainType: string;
  onDomainTypeChange: (value: string) => void;
  activeTab: TargetType;
}

export function ExplorerFilters({
  keyword,
  onKeywordChange,
  status,
  onStatusChange,
  domainType,
  onDomainTypeChange,
}: ExplorerFiltersProps) {
  const statusLabel =
    STATUS_OPTIONS.find((o) => o.value === status)?.label ?? "상태";
  const domainTypeLabel =
    DOMAIN_TYPE_OPTIONS.find((o) => o.value === domainType)?.label ??
    "도메인유형";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="이름, 약어, 정의로 검색..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={status} onValueChange={(v) => onStatusChange(v ?? "all")}>
        <SelectTrigger className="w-[140px]">
          <span className="flex flex-1 text-left">{statusLabel}</span>
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={domainType}
        onValueChange={(v) => onDomainTypeChange(v ?? "all")}
      >
        <SelectTrigger className="w-[140px]">
          <span className="flex flex-1 text-left">{domainTypeLabel}</span>
        </SelectTrigger>
        <SelectContent>
          {DOMAIN_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
