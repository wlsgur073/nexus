export type SolutionStatus = "active" | "beta" | "coming-soon";

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type Solution = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: SolutionStatus;
  route: string;
};
