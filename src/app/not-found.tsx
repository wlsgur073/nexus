import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <FileQuestion className="mb-4 h-16 w-16 text-muted-foreground" />
      <h1 className="mb-2 text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="mb-6 text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Button nativeButton={false} render={<Link href="/" />}>
        대시보드로 돌아가기
      </Button>
    </div>
  );
}
