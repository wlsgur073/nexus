"use client";

import { useEffect, useState, useTransition } from "react";

import {
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@nexus/ui";
import {
  getWordById,
  getDomainById,
  getTermById,
} from "@nexus/codex-models";
import type { StandardWord, StandardDomain, StandardTerm, TargetType } from "@nexus/codex-models";
import { StatusBadge } from "@/components/ui/status-badge";
import { TargetTypeBadge } from "@/components/ui/target-type-badge";

interface StandardDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: TargetType;
  targetId: number;
}

type DetailData = StandardWord | StandardDomain | StandardTerm | null;

export function StandardDetailSheet({
  open,
  onOpenChange,
  targetType,
  targetId,
}: StandardDetailSheetProps) {
  const [data, setData] = useState<DetailData>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open || !targetId) return;
    startTransition(async () => {
      const fetcher =
        targetType === "WORD"
          ? getWordById(targetId)
          : targetType === "DOMAIN"
            ? getDomainById(targetId)
            : getTermById(targetId);
      const result = await fetcher;
      setData(result);
    });
  }, [open, targetType, targetId]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[640px] overflow-y-auto sm:max-w-[640px]">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <TargetTypeBadge type={targetType} />
            <SheetTitle>
              {isPending ? "로딩 중..." : getTitle(data, targetType)}
            </SheetTitle>
          </div>
        </SheetHeader>

        {data && !isPending && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-2">
              <StatusBadge status={getStatus(data)} />
              <span className="text-sm text-muted-foreground">
                등록일: {new Date(getRegDate(data, targetType)).toLocaleDateString("ko-KR")}
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              {renderFields(data, targetType)}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function getTitle(data: DetailData, type: TargetType): string {
  if (!data) return "";
  if (type === "WORD") return (data as StandardWord).wordName;
  if (type === "DOMAIN") return (data as StandardDomain).domainName;
  return (data as StandardTerm).termName;
}

function getStatus(data: DetailData) {
  if (!data) return "BASELINE" as const;
  return data.status;
}

function getRegDate(data: DetailData, type: TargetType): Date {
  if (!data) return new Date();
  if (type === "WORD") return (data as StandardWord).regDate;
  if (type === "DOMAIN") return (data as StandardDomain).regDate;
  return (data as StandardTerm).regDate;
}

function renderFields(data: DetailData, type: TargetType) {
  if (!data) return null;

  const fields: { label: string; value: React.ReactNode }[] = [];

  if (type === "WORD") {
    const word = data as StandardWord;
    fields.push(
      { label: "표준단어명", value: word.wordName },
      { label: "영문약어", value: <code>{word.abbrName}</code> },
      { label: "영문명", value: word.engName },
      { label: "도메인유형", value: word.domainType ?? "-" },
      { label: "정의", value: word.definition },
    );
  } else if (type === "DOMAIN") {
    const domain = data as StandardDomain;
    fields.push(
      { label: "도메인명", value: domain.domainName },
      { label: "도메인유형", value: domain.domainType },
      { label: "데이터타입", value: <code>{domain.dataType}</code> },
      { label: "데이터길이", value: <code>{domain.dataLength ?? "-"}</code> },
      { label: "정의", value: domain.definition },
    );
  } else {
    const term = data as StandardTerm;
    fields.push(
      { label: "표준용어명", value: term.termName },
      { label: "물리명", value: <code>{term.physicalName}</code> },
      { label: "도메인유형", value: term.domainType },
      { label: "인포타입", value: term.infoType },
      { label: "정의", value: term.definition },
    );
  }

  return fields.map((field) => (
    <div key={field.label}>
      <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
      <p className="mt-1">{field.value}</p>
    </div>
  ));
}
