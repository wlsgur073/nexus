import type { Category, Solution } from "@/types/solution";

export const categories: Category[] = [
  { id: "ai-ml", name: "AI / ML", icon: "Brain" },
  { id: "data", name: "Data", icon: "Database" },
  { id: "devops", name: "DevOps", icon: "GitBranch" },
  { id: "analytics", name: "Analytics", icon: "BarChart3" },
];

export const solutions: Solution[] = [
  {
    id: "ai-factory",
    slug: "ai-factory",
    name: "AI Factory",
    description: "ML 모델 학습, 배포, 모니터링을 위한 엔드투엔드 MLOps 플랫폼",
    icon: "Brain",
    category: "ai-ml",
    status: "coming-soon",
    route: "/solutions/ai-factory",
  },
  {
    id: "data-pipeline",
    slug: "data-pipeline",
    name: "Data Pipeline",
    description: "실시간 및 배치 데이터 파이프라인 구축·관리 솔루션",
    icon: "Database",
    category: "data",
    status: "coming-soon",
    route: "/solutions/data-pipeline",
  },
  {
    id: "ci-cd-hub",
    slug: "ci-cd-hub",
    name: "CI/CD Hub",
    description: "빌드, 테스트, 배포 자동화를 위한 통합 파이프라인",
    icon: "GitBranch",
    category: "devops",
    status: "coming-soon",
    route: "/solutions/ci-cd-hub",
  },
  {
    id: "insight-dashboard",
    slug: "insight-dashboard",
    name: "Insight Dashboard",
    description: "비즈니스 지표 시각화 및 실시간 모니터링 대시보드",
    icon: "BarChart3",
    category: "analytics",
    status: "coming-soon",
    route: "/solutions/insight-dashboard",
  },
  {
    id: "codex",
    slug: "codex",
    name: "Codex",
    description:
      "데이터 표준용어, 도메인, 단어 사전을 등록·관리하는 데이터 거버넌스 솔루션",
    icon: "BookOpen",
    category: "data",
    status: "active",
    route: "/solutions/codex",
  },
  {
    id: "llm-gateway",
    slug: "llm-gateway",
    name: "LLM Gateway",
    description: "대규모 언어 모델 API 관리 및 프롬프트 엔지니어링 허브",
    icon: "MessageSquare",
    category: "ai-ml",
    status: "beta",
    route: "/solutions/llm-gateway",
  },
];

export function getSolutionBySlug(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug);
}

export function getSolutionsByCategory(categoryId: string): Solution[] {
  return solutions.filter((s) => s.category === categoryId);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find((c) => c.id === categoryId);
}
