import {
  Brain,
  Database,
  GitBranch,
  BarChart3,
  MessageSquare,
  BookOpen,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

const iconMap: Record<string, ComponentType<LucideProps>> = {
  Brain,
  Database,
  GitBranch,
  BarChart3,
  MessageSquare,
  BookOpen,
};

export function DynamicIcon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
