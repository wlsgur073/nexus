import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "거버넌스 포털",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
