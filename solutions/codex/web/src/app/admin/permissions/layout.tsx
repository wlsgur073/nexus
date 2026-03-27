import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "권한 관리",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
