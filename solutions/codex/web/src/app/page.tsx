"use client";

import { useRole } from "@/hooks/use-auth";
import { RequesterDashboard } from "@/components/dashboard/requester-dashboard";
import { ApproverDashboard } from "@/components/dashboard/approver-dashboard";

export default function DashboardPage() {
  const { canApprove } = useRole();

  return (
    <div className="p-6">
      {canApprove ? <ApproverDashboard /> : <RequesterDashboard />}
    </div>
  );
}
