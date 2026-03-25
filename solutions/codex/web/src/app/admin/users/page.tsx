"use client";

import { UserTable } from "@/components/admin/user-table";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">사용자 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          시스템 사용자 계정을 생성, 수정하고 역할과 상태를 관리합니다.
        </p>
      </div>
      <UserTable />
    </div>
  );
}
