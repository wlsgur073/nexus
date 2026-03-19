import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">설정</h1>
        <p className="mt-1 text-muted-foreground">플랫폼 설정을 관리합니다.</p>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-5 w-5 text-muted-foreground" />
            준비 중
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            설정 기능은 추후 제공될 예정입니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
