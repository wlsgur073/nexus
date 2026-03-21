import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@nexus/ui";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <FileQuestion className="mb-4 h-12 w-12 text-muted-foreground" />
      <h2 className="mb-2 text-xl font-semibold">페이지를 찾을 수 없습니다</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Button render={<Link href="/" />} nativeButton={false}>
        대시보드로 이동
      </Button>
    </div>
  );
}
