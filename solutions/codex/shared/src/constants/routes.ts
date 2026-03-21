/** Codex 사이드바 라우트 정의 (basePath 제외 상대 경로) */
export const CODEX_ROUTES = {
  dashboard: "/",
  standards: "/standards",
  standardsNew: "/standards/new",
  commonCodes: "/common-codes",
  approvals: "/approvals",
  governance: "/governance",
  audit: "/audit",
  validations: "/validations",
  validationDetail: (id: number | string) => `/validations/${id}`,
  login: "/login",
  admin: {
    commonCodes: "/admin/common-codes",
    users: "/admin/users",
    permissions: "/admin/permissions",
    systemCodes: "/admin/system-codes",
    dbSettings: "/admin/db-settings",
  },
} as const;
