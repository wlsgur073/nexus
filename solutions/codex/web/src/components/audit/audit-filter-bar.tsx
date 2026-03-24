"use client";

import { RotateCcw, Search } from "lucide-react";

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@nexus/ui";

interface AuditFilters {
  targetType: string;
  keyword: string;
  actionType: string;
  actor: string;
}

interface AuditFilterBarProps {
  filters: AuditFilters;
  onChange: (filters: AuditFilters) => void;
  onReset: () => void;
}

const TARGET_TYPES = [
  { value: "", label: "전체 유형" },
  { value: "WORD", label: "표준단어" },
  { value: "DOMAIN", label: "표준도메인" },
  { value: "TERM", label: "표준용어" },
  { value: "COMMON_CODE", label: "공통코드" },
];

const ACTION_TYPES = [
  { value: "", label: "전체 작업" },
  { value: "CREATE", label: "생성" },
  { value: "UPDATE", label: "수정" },
  { value: "DELETE", label: "삭제" },
  { value: "REQUEST", label: "신청" },
  { value: "APPROVE", label: "승인" },
  { value: "REJECT", label: "반려" },
  { value: "REVIEW", label: "검토" },
  { value: "FEEDBACK", label: "피드백" },
  { value: "CANCEL", label: "취소" },
];

export function AuditFilterBar({
  filters,
  onChange,
  onReset,
}: AuditFilterBarProps) {
  const update = (key: keyof AuditFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={filters.targetType}
        onValueChange={(v) => update("targetType", v ?? "")}
      >
        <SelectTrigger className="w-36">
          <span className="flex flex-1 text-left">
            {TARGET_TYPES.find((t) => t.value === filters.targetType)?.label ??
              "전체 유형"}
          </span>
        </SelectTrigger>
        <SelectContent>
          {TARGET_TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.actionType}
        onValueChange={(v) => update("actionType", v ?? "")}
      >
        <SelectTrigger className="w-32">
          <span className="flex flex-1 text-left">
            {ACTION_TYPES.find((t) => t.value === filters.actionType)?.label ??
              "전체 작업"}
          </span>
        </SelectTrigger>
        <SelectContent>
          {ACTION_TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.keyword}
          onChange={(e) => update("keyword", e.target.value)}
          placeholder="키워드 검색..."
          className="pl-9"
        />
      </div>

      <Input
        value={filters.actor}
        onChange={(e) => update("actor", e.target.value)}
        placeholder="처리자"
        className="w-28"
      />

      <Button variant="outline" size="icon" onClick={onReset}>
        <RotateCcw className="h-4 w-4" />
        <span className="sr-only">필터 초기화</span>
      </Button>
    </div>
  );
}
