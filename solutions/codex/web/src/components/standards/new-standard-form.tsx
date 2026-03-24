"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Textarea,
} from "@nexus/ui";
import {
  createWordRequest,
  createDomainRequest,
  createTermRequest,
} from "@nexus/codex-models";
import type { TargetType } from "@nexus/codex-models";

import {
  newWordSchema,
  newDomainSchema,
  newTermSchema,
} from "@/lib/validators";
import type {
  NewWordFormData,
  NewDomainFormData,
  NewTermFormData,
} from "@/lib/validators";
import { AiSuggestionPanel } from "./ai-suggestion-panel";

const TARGET_TYPE_LABELS: Record<string, string> = {
  WORD: "표준단어",
  DOMAIN: "표준도메인",
  TERM: "표준용어",
};

const DOMAIN_TYPES = [
  { value: "명칭", label: "명칭" },
  { value: "코드", label: "코드" },
  { value: "금액", label: "금액" },
  { value: "번호", label: "번호" },
  { value: "일자", label: "일자" },
];

const DATA_TYPES = [
  { value: "VARCHAR", label: "VARCHAR" },
  { value: "NUMBER", label: "NUMBER" },
  { value: "DATE", label: "DATE" },
  { value: "TIMESTAMP", label: "TIMESTAMP" },
  { value: "CLOB", label: "CLOB" },
];

const INFO_TYPES = [
  { value: "기본", label: "기본" },
  { value: "파생", label: "파생" },
  { value: "집계", label: "집계" },
];

interface NewStandardFormProps {
  onSubmitted: (requestNo: string) => void;
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

export function NewStandardForm({ onSubmitted }: NewStandardFormProps) {
  const [targetType, setTargetType] = useState<TargetType>("WORD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wordForm = useForm<NewWordFormData>({
    resolver: zodResolver(newWordSchema),
  });

  const domainForm = useForm<NewDomainFormData>({
    resolver: zodResolver(newDomainSchema),
  });

  const termForm = useForm<NewTermFormData>({
    resolver: zodResolver(newTermSchema),
    defaultValues: { wordIds: [], domainId: undefined },
  });

  const watchedName =
    targetType === "WORD"
      ? (wordForm.watch("wordName") ?? "")
      : targetType === "DOMAIN"
        ? (domainForm.watch("domainName") ?? "")
        : (termForm.watch("termName") ?? "");

  const handleWordSubmit = async (data: NewWordFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createWordRequest(data);
      onSubmitted(result.requestNo);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDomainSubmit = async (data: NewDomainFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createDomainRequest(data);
      onSubmitted(result.requestNo);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTermSubmit = async (data: NewTermFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createTermRequest(data);
      onSubmitted(result.requestNo);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">신규 표준 신청</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label>유형 선택</Label>
            <Select
              value={targetType}
              onValueChange={(v) => setTargetType((v ?? "WORD") as TargetType)}
            >
              <SelectTrigger className="mt-1.5">
                <span className="flex flex-1 text-left">
                  {TARGET_TYPE_LABELS[targetType]}
                </span>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {Object.entries(TARGET_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 표준단어 폼 */}
          {targetType === "WORD" && (
            <form
              onSubmit={wordForm.handleSubmit(handleWordSubmit)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="wordName">표준단어명</Label>
                <Input
                  id="wordName"
                  {...wordForm.register("wordName")}
                  className="mt-1.5"
                  placeholder="예: 고객"
                />
                <ErrorMessage
                  message={wordForm.formState.errors.wordName?.message}
                />
              </div>
              <div>
                <Label htmlFor="abbrName">영문약어</Label>
                <Input
                  id="abbrName"
                  {...wordForm.register("abbrName")}
                  className="mt-1.5"
                  placeholder="예: CUST"
                />
                <ErrorMessage
                  message={wordForm.formState.errors.abbrName?.message}
                />
              </div>
              <div>
                <Label htmlFor="engName">영문명</Label>
                <Input
                  id="engName"
                  {...wordForm.register("engName")}
                  className="mt-1.5"
                  placeholder="예: Customer"
                />
                <ErrorMessage
                  message={wordForm.formState.errors.engName?.message}
                />
              </div>
              <div>
                <Label htmlFor="w-definition">정의</Label>
                <Textarea
                  id="w-definition"
                  {...wordForm.register("definition")}
                  className="mt-1.5"
                  placeholder="표준단어의 정의를 입력하세요."
                  rows={3}
                />
                <ErrorMessage
                  message={wordForm.formState.errors.definition?.message}
                />
              </div>
              <div>
                <Label htmlFor="w-reason">신청 사유 (선택)</Label>
                <Textarea
                  id="w-reason"
                  {...wordForm.register("requestReason")}
                  className="mt-1.5"
                  placeholder="신청 사유를 입력하세요."
                  rows={2}
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "신청 중..." : "신청하기"}
              </Button>
            </form>
          )}

          {/* 표준도메인 폼 */}
          {targetType === "DOMAIN" && (
            <form
              onSubmit={domainForm.handleSubmit(handleDomainSubmit)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="domainName">도메인명</Label>
                <Input
                  id="domainName"
                  {...domainForm.register("domainName")}
                  className="mt-1.5"
                  placeholder="예: 금액"
                />
                <ErrorMessage
                  message={domainForm.formState.errors.domainName?.message}
                />
              </div>
              <div>
                <Label>도메인유형</Label>
                <Select
                  value={domainForm.watch("domainType") ?? ""}
                  onValueChange={(v) =>
                    domainForm.setValue("domainType", v ?? "", {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <span className="flex flex-1 text-left">
                      {DOMAIN_TYPES.find(
                        (d) => d.value === domainForm.watch("domainType"),
                      )?.label ?? "도메인유형 선택"}
                    </span>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {DOMAIN_TYPES.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  message={domainForm.formState.errors.domainType?.message}
                />
              </div>
              <div>
                <Label>데이터타입</Label>
                <Select
                  value={domainForm.watch("dataType") ?? ""}
                  onValueChange={(v) =>
                    domainForm.setValue("dataType", v ?? "", {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <span className="flex flex-1 text-left">
                      {DATA_TYPES.find(
                        (d) => d.value === domainForm.watch("dataType"),
                      )?.label ?? "데이터타입 선택"}
                    </span>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {DATA_TYPES.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  message={domainForm.formState.errors.dataType?.message}
                />
              </div>
              <div>
                <Label htmlFor="dataLength">데이터 길이 (선택)</Label>
                <Input
                  id="dataLength"
                  {...domainForm.register("dataLength")}
                  className="mt-1.5"
                  placeholder="예: 100"
                />
              </div>
              <div>
                <Label htmlFor="d-definition">정의</Label>
                <Textarea
                  id="d-definition"
                  {...domainForm.register("definition")}
                  className="mt-1.5"
                  placeholder="표준도메인의 정의를 입력하세요."
                  rows={3}
                />
                <ErrorMessage
                  message={domainForm.formState.errors.definition?.message}
                />
              </div>
              <div>
                <Label htmlFor="d-reason">신청 사유 (선택)</Label>
                <Textarea
                  id="d-reason"
                  {...domainForm.register("requestReason")}
                  className="mt-1.5"
                  placeholder="신청 사유를 입력하세요."
                  rows={2}
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "신청 중..." : "신청하기"}
              </Button>
            </form>
          )}

          {/* 표준용어 폼 */}
          {targetType === "TERM" && (
            <form
              onSubmit={termForm.handleSubmit(handleTermSubmit)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="termName">표준용어명</Label>
                <Input
                  id="termName"
                  {...termForm.register("termName")}
                  className="mt-1.5"
                  placeholder="예: 고객번호"
                />
                <ErrorMessage
                  message={termForm.formState.errors.termName?.message}
                />
              </div>
              <div>
                <Label>인포타입</Label>
                <Select
                  value={termForm.watch("infoType") ?? ""}
                  onValueChange={(v) =>
                    termForm.setValue("infoType", v ?? "", {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <span className="flex flex-1 text-left">
                      {INFO_TYPES.find(
                        (d) => d.value === termForm.watch("infoType"),
                      )?.label ?? "인포타입 선택"}
                    </span>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {INFO_TYPES.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  message={termForm.formState.errors.infoType?.message}
                />
              </div>
              <div>
                <Label htmlFor="t-definition">정의</Label>
                <Textarea
                  id="t-definition"
                  {...termForm.register("definition")}
                  className="mt-1.5"
                  placeholder="표준용어의 정의를 입력하세요."
                  rows={3}
                />
                <ErrorMessage
                  message={termForm.formState.errors.definition?.message}
                />
              </div>
              <div>
                <Label htmlFor="t-reason">신청 사유 (선택)</Label>
                <Textarea
                  id="t-reason"
                  {...termForm.register("requestReason")}
                  className="mt-1.5"
                  placeholder="신청 사유를 입력하세요."
                  rows={2}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                구성 단어와 도메인 연결은 AI 추천 패널에서 자동으로 매칭됩니다.
              </p>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "신청 중..." : "신청하기"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <AiSuggestionPanel targetType={targetType} name={watchedName} />
    </div>
  );
}
