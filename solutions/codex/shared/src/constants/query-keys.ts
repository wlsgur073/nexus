import type { UserRole } from "@nexus/codex-models";

/** TanStack Query 키 네임스페이스 */
export const QUERY_KEYS = {
  dashboard: {
    stats: ["dashboard", "stats"] as const,
    pending: ["dashboard", "pending"] as const,
    recentActivity: ["dashboard", "recent-activity"] as const,
    mySummary: ["dashboard", "my-summary"] as const,
    roleKpi: (role: UserRole) => ["dashboard", "role-kpi", role] as const,
    trend: ["dashboard", "trend"] as const,
  },
  explorer: {
    search: (params: object) => ["explorer", "search", params] as const,
    facets: ["explorer", "facets"] as const,
    autocomplete: (q: string) => ["explorer", "autocomplete", q] as const,
  },
  standards: {
    word: (id: number) => ["standards", "word", id] as const,
    wordList: (params: object) => ["standards", "words", params] as const,
    wordHistory: (id: number) => ["standards", "word", id, "history"] as const,
    wordTerms: (id: number) => ["standards", "word", id, "terms"] as const,
    domain: (id: number) => ["standards", "domain", id] as const,
    domainList: (params: object) => ["standards", "domains", params] as const,
    domainHistory: (id: number) =>
      ["standards", "domain", id, "history"] as const,
    domainTerms: (id: number) => ["standards", "domain", id, "terms"] as const,
    term: (id: number) => ["standards", "term", id] as const,
    termList: (params: object) => ["standards", "terms", params] as const,
    termHistory: (id: number) => ["standards", "term", id, "history"] as const,
    termWords: (id: number) => ["standards", "term", id, "words"] as const,
    termDomain: (id: number) => ["standards", "term", id, "domain"] as const,
  },
  requests: {
    list: (params: object) => ["requests", params] as const,
    my: (params: object) => ["requests", "my", params] as const,
    myStats: ["requests", "my-stats"] as const,
    detail: (id: number) => ["requests", id] as const,
    feedback: (id: number) => ["requests", id, "feedback"] as const,
  },
  approvals: {
    list: (params: object) => ["approvals", params] as const,
    stats: ["approvals", "stats"] as const,
    detail: (id: number) => ["approvals", id] as const,
    changes: (id: number) => ["approvals", id, "changes"] as const,
    history: (id: number) => ["approvals", id, "history"] as const,
  },
  drafts: {
    list: (params: object) => ["drafts", params] as const,
    detail: (id: number) => ["drafts", id] as const,
  },
  comments: {
    list: (targetType: string, targetId: number) =>
      ["comments", targetType, targetId] as const,
  },
  inlineGovernance: {
    diff: (draftId: number) => ["inline-governance", draftId, "diff"] as const,
  },
  notifications: {
    list: ["notifications"] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },
  ai: {
    suggestions: (targetType: string, name: string) =>
      ["ai", "suggestions", targetType, name] as const,
    matchDetail: (id: number) => ["ai", "match-detail", id] as const,
    qualityScore: (targetType: string, data: object) =>
      ["ai", "quality-score", targetType, data] as const,
    synonyms: (word: string) => ["ai", "synonyms", word] as const,
  },
  validations: {
    summary: ["validations", "summary"] as const,
    trend: ["validations", "trend"] as const,
    rules: ["validations", "rules"] as const,
    history: (params: object) => ["validations", "history", params] as const,
    violations: (params: object) =>
      ["validations", "violations", params] as const,
  },
  governance: {
    compliance: ["governance", "compliance"] as const,
    kpi: ["governance", "kpi"] as const,
    trend: ["governance", "trend"] as const,
    deptRanking: ["governance", "dept-ranking"] as const,
    nonCompliant: ["governance", "non-compliant"] as const,
  },
  audit: {
    list: (params: object) => ["audit", params] as const,
    timeline: (targetType: string, targetId: number) =>
      ["audit", "timeline", targetType, targetId] as const,
  },
  commonCodes: {
    groups: (params: object) => ["common-codes", "groups", params] as const,
    groupDetail: (groupId: number) =>
      ["common-codes", "groups", groupId] as const,
    codes: (groupId: number) =>
      ["common-codes", "groups", groupId, "codes"] as const,
    search: (keyword: string) => ["common-codes", "search", keyword] as const,
  },
  users: {
    list: (params: object) => ["users", params] as const,
    detail: (id: number) => ["users", id] as const,
  },
  permissions: {
    byRole: (role: string) => ["permissions", role] as const,
    menuTree: ["permissions", "menu-tree"] as const,
  },
  systemCodes: {
    list: (params: object) => ["system-codes", params] as const,
    detail: (id: number) => ["system-codes", id] as const,
    categories: ["system-codes", "categories"] as const,
  },
  settings: {
    db: ["settings", "db"] as const,
    ssh: ["settings", "ssh"] as const,
    testResult: ["settings", "test-result"] as const,
  },
} as const;
