import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@nexus/ui";
import {
  DynamicIcon,
  getSolutionBySlug,
  getCategoryById,
  solutions,
} from "@nexus/config";
import { SolutionLaunchButton } from "@/components/solutions/solution-launch-button";
import { PageTransition } from "@/components/motion/page-transition";

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

  return (
    <PageTransition className="px-10 py-7">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        nativeButton={false}
        render={<Link href="/solutions" />}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Solutions
      </Button>

      <div className="mb-8 flex items-start gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-500/20 dark:to-indigo-500/10">
          <DynamicIcon name={solution.icon} className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl tracking-tight">
              {solution.name}
            </h1>
            <SolutionLaunchButton
              slug={solution.slug}
              status={solution.status}
            />
          </div>
          <p className="mt-1 text-text-secondary">{solution.description}</p>
          {category && (
            <p className="mt-2 text-[10px] uppercase tracking-widest text-text-muted">
              {category.name}
            </p>
          )}
        </div>
      </div>

      <div
        className="mb-8 h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--border) 15%, var(--border) 85%, transparent)",
        }}
      />

      {solution.status === "coming-soon" && (
        <Card className="border-dashed border-border bg-canvas">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-text-muted" />
              준비 중입니다
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">
              이 솔루션은 현재 개발 중입니다. 곧 출시될 예정이니 기대해 주세요!
            </p>
          </CardContent>
        </Card>
      )}

      {solution.status === "active" && (
        <Card className="border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              운영 중
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">
              이 솔루션은 현재 정상 운영 중입니다.
            </p>
          </CardContent>
        </Card>
      )}

      {solution.status === "beta" && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-500/30 dark:bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-base">베타 버전</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">
              이 솔루션은 베타 단계입니다. 일부 기능이 변경될 수 있습니다.
            </p>
          </CardContent>
        </Card>
      )}
    </PageTransition>
  );
}
