import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "감사 추적",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
