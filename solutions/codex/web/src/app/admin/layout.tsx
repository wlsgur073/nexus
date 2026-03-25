"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui";

import { useRole } from "@/hooks/use-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, canManageCommonCodes } = useRole();
  const router = useRouter();

  const hasAccess = isAdmin || canManageCommonCodes;

  useEffect(() => {
    if (!hasAccess) {
      const timer = setTimeout(() => router.replace("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasAccess, router]);

  if (!hasAccess) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <ShieldAlert className="mx-auto mb-2 h-12 w-12 text-destructive" />
            <CardTitle>접근 권한이 없습니다</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            이 페이지는 시스템 관리자만 접근할 수 있습니다.
            <br />
            3초 후 대시보드로 이동합니다.
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
