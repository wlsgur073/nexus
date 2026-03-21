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
  SelectValue,
  Textarea,
} from "@nexus/ui";
import { createWordRequest } from "@nexus/codex-models";
import type { TargetType } from "@nexus/codex-models";

import { newWordSchema } from "@/lib/validators";
import type { NewWordFormData } from "@/lib/validators";
import { AiSuggestionPanel } from "./ai-suggestion-panel";

interface NewStandardFormProps {
  onSubmitted: (requestNo: string) => void;
}

export function NewStandardForm({ onSubmitted }: NewStandardFormProps) {
  const [targetType, setTargetType] = useState<TargetType>("WORD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewWordFormData>({
    resolver: zodResolver(newWordSchema),
  });

  const watchedName = watch("wordName") ?? "";

  const onSubmit = async (data: NewWordFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createWordRequest(data);
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WORD">표준단어</SelectItem>
                <SelectItem value="DOMAIN">표준도메인</SelectItem>
                <SelectItem value="TERM">표준용어</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {targetType === "WORD" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="wordName">표준단어명</Label>
                <Input
                  id="wordName"
                  {...register("wordName")}
                  className="mt-1.5"
                  placeholder="예: 고객"
                />
                {errors.wordName && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.wordName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="abbrName">영문약어</Label>
                <Input
                  id="abbrName"
                  {...register("abbrName")}
                  className="mt-1.5"
                  placeholder="예: CUST"
                />
                {errors.abbrName && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.abbrName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="engName">영문명</Label>
                <Input
                  id="engName"
                  {...register("engName")}
                  className="mt-1.5"
                  placeholder="예: Customer"
                />
                {errors.engName && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.engName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="definition">정의</Label>
                <Textarea
                  id="definition"
                  {...register("definition")}
                  className="mt-1.5"
                  placeholder="표준단어의 정의를 입력하세요."
                  rows={3}
                />
                {errors.definition && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.definition.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="requestReason">신청 사유 (선택)</Label>
                <Textarea
                  id="requestReason"
                  {...register("requestReason")}
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

          {targetType !== "WORD" && (
            <p className="text-sm text-muted-foreground">
              {targetType === "DOMAIN" ? "표준도메인" : "표준용어"} 신청 폼은
              Phase 1에서 동일한 구조로 구현됩니다.
            </p>
          )}
        </CardContent>
      </Card>

      <AiSuggestionPanel targetType={targetType} name={watchedName} />
    </div>
  );
}
