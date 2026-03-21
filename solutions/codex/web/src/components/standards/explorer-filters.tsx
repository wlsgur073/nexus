"use client";

import { Search } from "lucide-react";

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nexus/ui";

import type { TargetType } from "@nexus/codex-models";

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
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 상태</SelectItem>
          <SelectItem value="BASELINE">기존</SelectItem>
          <SelectItem value="PENDING">신청</SelectItem>
          <SelectItem value="APPROVED">승인</SelectItem>
          <SelectItem value="REJECTED">반려</SelectItem>
        </SelectContent>
      </Select>
      <Select value={domainType} onValueChange={(v) => onDomainTypeChange(v ?? "all")}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="도메인유형" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 유형</SelectItem>
          <SelectItem value="명칭">명칭</SelectItem>
          <SelectItem value="금액">금액</SelectItem>
          <SelectItem value="번호">번호</SelectItem>
          <SelectItem value="코드">코드</SelectItem>
          <SelectItem value="일자">일자</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
