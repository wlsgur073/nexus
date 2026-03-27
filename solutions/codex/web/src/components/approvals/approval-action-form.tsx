"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MessageSquare, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button, Label, Textarea } from "@nexus/ui";
import { processApproval } from "@nexus/codex-models";

import { approvalActionSchema } from "@/lib/validators";
import type { ApprovalActionFormData } from "@/lib/validators";

const ACTION_LABELS: Record<string, string> = {
  APPROVE: "승인",
  REJECT: "반려",
  FEEDBACK: "피드백 전달",
};

interface ApprovalActionFormProps {
  requestId: number;
  onProcessed: () => void;
}

export function ApprovalActionForm({
  requestId,
  onProcessed,
}: ApprovalActionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApprovalActionFormData>({
    resolver: zodResolver(approvalActionSchema),
    defaultValues: { action: "APPROVE", comment: "" },
  });

  const selectedAction = watch("action");

  const onSubmit = async (data: ApprovalActionFormData) => {
    setIsSubmitting(true);
    try {
      await processApproval(requestId, data);
      toast.success(`${ACTION_LABELS[data.action]}이(가) 완료되었습니다.`);
      onProcessed();
    } catch {
      toast.error("처리에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Label>처리 유형</Label>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={selectedAction === "APPROVE" ? "default" : "outline"}
          onClick={() => setValue("action", "APPROVE")}
          className="flex-1"
        >
          <CheckCircle2 className="mr-1.5 h-4 w-4" />
          승인
        </Button>
        <Button
          type="button"
          variant={selectedAction === "REJECT" ? "default" : "outline"}
          onClick={() => setValue("action", "REJECT")}
          className="flex-1"
        >
          <XCircle className="mr-1.5 h-4 w-4" />
          반려
        </Button>
        <Button
          type="button"
          variant={selectedAction === "FEEDBACK" ? "default" : "outline"}
          onClick={() => setValue("action", "FEEDBACK")}
          className="flex-1"
        >
          <MessageSquare className="mr-1.5 h-4 w-4" />
          피드백
        </Button>
      </div>

      <div>
        <Label htmlFor="comment">처리 사유</Label>
        <Textarea
          id="comment"
          {...register("comment")}
          className="mt-1.5"
          rows={3}
          placeholder={
            selectedAction === "APPROVE"
              ? "승인 사유를 입력하세요."
              : selectedAction === "REJECT"
                ? "반려 사유를 입력하세요."
                : "피드백 내용을 입력하세요."
          }
        />
        {errors.comment && (
          <p className="mt-1 text-xs text-destructive">
            {errors.comment.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "처리 중..." : "처리하기"}
      </Button>
    </form>
  );
}
