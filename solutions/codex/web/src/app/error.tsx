"use client";

import { useEffect } from "react";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nexus/ui";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Codex Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <Card className="max-w-lg">
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto mb-2 h-12 w-12 text-destructive" />
          <CardTitle>오류가 발생했습니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            {error.message || "예상하지 못한 오류가 발생했습니다."}
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-muted-foreground">
              오류 코드: {error.digest}
            </p>
          )}
          <div className="flex justify-center gap-3">
            <Button onClick={reset} variant="outline">
              <RefreshCcw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
            <Button render={<Link href="/" />} nativeButton={false}>
              <Home className="mr-2 h-4 w-4" />
              대시보드
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
