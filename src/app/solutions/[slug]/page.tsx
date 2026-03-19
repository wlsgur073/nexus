import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/lib/icons";
import {
  getSolutionBySlug,
  getCategoryById,
  solutions,
} from "@/config/solutions";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  const category = getCategoryById(solution.category);

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

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        nativeButton={false}
        render={<Link href="/solutions" />}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        솔루션 목록
      </Button>

      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <DynamicIcon name={solution.icon} className="h-7 w-7 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {solution.name}
            </h1>
            <Badge variant={statusVariant[solution.status]}>
              {statusLabel[solution.status]}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">{solution.description}</p>
          {category && (
            <p className="mt-2 text-sm text-muted-foreground">
              카테고리: {category.name}
            </p>
          )}
        </div>
      </div>

      {solution.status === "coming-soon" && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-muted-foreground" />
              준비 중입니다
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              이 솔루션은 현재 개발 중입니다. 곧 출시될 예정이니 기대해 주세요!
            </p>
          </CardContent>
        </Card>
      )}

      {solution.status === "active" && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              운영 중
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              이 솔루션은 현재 정상 운영 중입니다. 아래에서 기능을 사용할 수
              있습니다.
            </p>
          </CardContent>
        </Card>
      )}

      {solution.status === "beta" && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="text-base">베타 버전</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              이 솔루션은 베타 단계입니다. 일부 기능이 변경될 수 있습니다.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
