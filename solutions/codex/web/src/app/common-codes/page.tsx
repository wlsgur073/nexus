"use client";

import { CommonCodeSearchTable } from "@/components/common-codes/common-code-search-table";

export default function CommonCodesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">공통코드 조회</h1>
        <p className="mt-1 text-muted-foreground">
          시스템에 등록된 공통코드 그룹과 코드를 조회하세요.
        </p>
      </div>

      <CommonCodeSearchTable />
    </div>
  );
}
