"use client";

import { PermissionTree } from "@/components/admin/permission-tree";

export default function AdminPermissionsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">권한 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          역할별 메뉴 접근 권한과 CRUD 권한을 설정합니다.
        </p>
      </div>
      <PermissionTree />
    </div>
  );
}
