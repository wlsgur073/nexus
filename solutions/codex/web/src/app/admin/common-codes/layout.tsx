import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "공통코드 관리",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
