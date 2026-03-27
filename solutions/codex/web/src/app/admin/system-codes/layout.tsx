import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "시스템 코드 관리",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
