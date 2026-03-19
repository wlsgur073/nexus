import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui";

export default function CodexHomePage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Codex</h1>
        <p className="mt-1 text-muted-foreground">
          데이터 표준용어, 도메인, 단어 사전을 등록·관리하는 데이터 거버넌스
          솔루션
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-5 w-5 text-primary" />
            Codex 솔루션
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Codex 솔루션의 기능이 여기에 구현됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
