"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nexus/ui";
import { getViolationList } from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

import { useRole } from "@/hooks/use-auth";
import { ViolationList } from "@/components/validations/violation-list";

export default function ValidationDetailPage() {
  const params = useParams<{ executionId: string }>();
  const router = useRouter();
  const { canManage } = useRole();

  const [page, setPage] = useState(1);
  const executionId = params.executionId;

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.validations.violations({ page, executionId }),
    queryFn: () => getViolationList({ page, executionId }),
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          검증 대시보드로 돌아가기
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          검증 실행 #{executionId}
        </h1>
        <p className="mt-1 text-muted-foreground">
          해당 검증 실행에서 발견된 위반 항목입니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            위반 목록 ({(data?.total ?? 0).toLocaleString()}건)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ViolationList
            data={data?.items ?? []}
            page={page}
            totalPages={data?.totalPages ?? 1}
            isLoading={isLoading}
            canCorrect={canManage}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
