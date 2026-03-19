import Link from "next/link";
import { ArrowRight, Package, Activity, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/lib/icons";
import { solutions } from "@/config/solutions";

const statusLabel: Record<string, string> = {
  active: "활성",
  beta: "베타",
  "coming-soon": "준비 중",
};

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  beta: "secondary",
  "coming-soon": "outline",
};

export default function DashboardPage() {
  return (
    <div className="p-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Nexus Command Center
        </h1>
        <p className="mt-1 text-muted-foreground">
          솔루션을 연결하고 전체 현황을 한눈에 파악하세요.
        </p>
      </div>

      {/* Quick Access Solutions */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">솔루션 빠른 접근</h2>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/solutions" />}
          >
            전체 보기 <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.slice(0, 3).map((solution) => (
            <Link key={solution.id} href={solution.route}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <DynamicIcon
                      name={solution.icon}
                      className="h-5 w-5 text-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{solution.name}</CardTitle>
                  </div>
                  <Badge variant={statusVariant[solution.status]}>
                    {statusLabel[solution.status]}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {solution.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Platform Stats Placeholder */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">플랫폼 현황</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                등록된 솔루션
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{solutions.length}</div>
              <p className="text-xs text-muted-foreground">
                {solutions.filter((s) => s.status === "active").length} 활성
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">시스템 상태</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">정상</div>
              <p className="text-xs text-muted-foreground">
                모든 서비스 가동 중
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API 호출</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">준비 중</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
