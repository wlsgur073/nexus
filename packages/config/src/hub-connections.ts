export type HubConnection = {
  id: string;
  source: string;
  target: string;
  label?: string;
  status: "active" | "pending";
};

export const hubConnections: HubConnection[] = [
  {
    id: "nexus-codex",
    source: "nexus-hub",
    target: "codex",
    label: "Registry",
    status: "active",
  },
  {
    id: "nexus-llm",
    source: "nexus-hub",
    target: "llm-gateway",
    label: "Registry",
    status: "active",
  },
  {
    id: "codex-llm",
    source: "codex",
    target: "llm-gateway",
    label: "Data sync",
    status: "active",
  },
  {
    id: "nexus-ai",
    source: "nexus-hub",
    target: "ai-factory",
    status: "pending",
  },
  {
    id: "nexus-dp",
    source: "nexus-hub",
    target: "data-pipeline",
    status: "pending",
  },
  {
    id: "nexus-cicd",
    source: "nexus-hub",
    target: "ci-cd-hub",
    status: "pending",
  },
  {
    id: "nexus-insight",
    source: "nexus-hub",
    target: "insight-dashboard",
    status: "pending",
  },
];

export function getConnectionsByNode(nodeId: string): HubConnection[] {
  return hubConnections.filter(
    (c) => c.source === nodeId || c.target === nodeId,
  );
}

export function getActiveConnections(): HubConnection[] {
  return hubConnections.filter((c) => c.status === "active");
}
