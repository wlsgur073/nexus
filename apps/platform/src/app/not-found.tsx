import Link from "next/link";
import { Button } from "@nexus/ui";
import { PageTransition } from "@/components/motion/page-transition";

export default function NotFoundPage() {
  return (
    <PageTransition className="flex flex-1 flex-col items-center justify-center p-10 text-center">
      <h1 className="font-display text-6xl font-light tracking-tight text-foreground">
        404
      </h1>
      <div className="mx-auto mt-2 h-px w-8 bg-foreground" />
      <p className="mt-4 text-sm text-text-muted">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Button className="mt-6" nativeButton={false} render={<Link href="/" />}>
        Hub로 돌아가기
      </Button>
    </PageTransition>
  );
}
