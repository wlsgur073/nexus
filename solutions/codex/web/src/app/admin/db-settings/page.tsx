"use client";

import { DbConnectionForm } from "@/components/admin/db-connection-form";
import { SshSettingsForm } from "@/components/admin/ssh-settings-form";

export default function AdminDbSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">DB 연결 설정</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          표준관리 데이터베이스 접속 정보와 SSH 터널링을 설정합니다.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <DbConnectionForm />
        <SshSettingsForm />
      </div>
    </div>
  );
}
