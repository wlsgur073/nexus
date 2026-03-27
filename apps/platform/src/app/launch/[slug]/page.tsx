import { redirect } from "next/navigation";
import { getSolutionBySlug, solutions } from "@nexus/config";
import { SolutionSplash } from "@/components/solutions/solution-splash";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return solutions
    .filter((s) => s.status !== "coming-soon")
    .map((s) => ({ slug: s.slug }));
}

export default async function LaunchPage({ params }: Props) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution || solution.status === "coming-soon") {
    redirect("/solutions");
  }

  const targetUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:${solution.port}${solution.route}`
      : solution.route;

  return (
    <SolutionSplash
      name={solution.name}
      icon={solution.icon}
      route={targetUrl}
    />
  );
}
