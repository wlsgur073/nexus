import type { Metadata } from "next";

import { AdminGuard } from "@/components/admin/admin-guard";

export const metadata: Metadata = {
  title: "관리",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
