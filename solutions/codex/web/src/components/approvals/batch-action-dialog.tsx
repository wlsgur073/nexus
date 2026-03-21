"use client";

import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Textarea,
} from "@nexus/ui";
import { batchApprove } from "@nexus/codex-models";

interface BatchActionDialogProps {
  selectedIds: Set<number>;
  onProcessed: () => void;
}

export function BatchActionDialog({ selectedIds, onProcessed }: BatchActionDialogProps) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBatchApprove = async () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      await batchApprove({
        requestIds: Array.from(selectedIds),
        comment,
      });
      setOpen(false);
      setComment("");
      onProcessed();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button disabled={selectedIds.size === 0} />}>
        일괄 승인 ({selectedIds.size}건)
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>일괄 승인</DialogTitle>
          <DialogDescription>
            선택한 {selectedIds.size}건의 신청을 일괄 승인합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <Label htmlFor="batch-comment">승인 사유</Label>
          <Textarea
            id="batch-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="일괄 승인 사유를 입력하세요."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button
            onClick={handleBatchApprove}
            disabled={isSubmitting || !comment.trim()}
          >
            {isSubmitting ? "처리 중..." : "일괄 승인"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
