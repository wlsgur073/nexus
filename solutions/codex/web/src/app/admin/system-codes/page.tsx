"use client";

import { SystemCodeTable } from "@/components/admin/system-code-table";

export default function AdminSystemCodesPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">시스템 코드 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          시스템 기준 코드를 관리합니다. 보호 코드는 수정/삭제할 수 없습니다.
        </p>
      </div>
      <SystemCodeTable />
    </div>
  );
}
