import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "승인 워크벤치",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
