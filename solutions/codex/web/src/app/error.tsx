"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@nexus/ui";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
      <h2 className="mb-2 text-xl font-semibold">오류가 발생했습니다</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        {error.message || "예상하지 못한 오류가 발생했습니다."}
      </p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
