// Helpers
export type { PaginatedResponse, PaginationParams } from "./helpers";

// Auth
export { loginApi, logoutApi, getSession } from "./auth";
export type { LoginRequest, Session } from "./auth";

// Dashboard
export {
  getDashboardStats,
  getPendingCount,
  getRecentActivity,
  getTrend,
  getMySummary,
  getRoleKpi,
} from "./dashboard";
export type {
  DashboardStats,
  PendingCount,
  RecentActivity,
  TrendItem,
  MySummary,
  RoleKpi,
} from "./dashboard";

// Explorer
export { searchExplorer, getExplorerFacets, getAutocomplete } from "./explorer";
export type {
  ExplorerItem,
  ExplorerSearchParams,
  FacetItem,
  ExplorerFacets,
  AutocompleteItem,
} from "./explorer";

// Standard Words
export {
  getWordList,
  getWordById,
  getWordRelatedTerms,
  getWordHistory,
} from "./standard-words";
export type { StandardWordListParams, WordHistoryItem } from "./standard-words";

// Standard Domains
export {
  getDomainList,
  getDomainById,
  getDomainRelatedTerms,
  getDomainHistory,
} from "./standard-domains";
export type {
  StandardDomainListParams,
  DomainHistoryItem,
} from "./standard-domains";

// Standard Terms
export {
  getTermList,
  getTermById,
  getTermWords,
  getTermDomain,
  getTermHistory,
} from "./standard-terms";
export type { StandardTermListParams, TermHistoryItem } from "./standard-terms";

// Requests
export {
  createWordRequest,
  createDomainRequest,
  createTermRequest,
  createCommonCodeRequest,
  createDeleteRequest,
  getRequestList,
  getMyRequests,
  getMyRequestStats,
  getRequestDetail,
  getRequestFeedback,
  cancelRequest,
} from "./requests";
export type {
  CreateWordRequestInput,
  CreateDomainRequestInput,
  CreateTermRequestInput,
  CreateCommonCodeRequestInput,
  CreateDeleteRequestInput,
  RequestListParams,
  RequestStats,
} from "./requests";

// Approvals
export {
  getApprovalList,
  getApprovalStats,
  getApprovalDetail,
  getApprovalChanges,
  getApprovalHistory,
  processApproval,
  batchApprove,
} from "./approvals";
export type {
  ApprovalListParams,
  ApprovalStats,
  ProcessApprovalInput,
  ProcessApprovalResponse,
  BatchApproveInput,
} from "./approvals";

// Inline Governance
export {
  startInlineEdit,
  updateDraftField,
  submitInlineDraft,
  getInlineDiff,
} from "./inline-governance";
export type {
  StartInlineEditInput,
  UpdateDraftFieldInput,
  InlineDiffItem,
} from "./inline-governance";

// Drafts
export {
  getDraftList,
  createDraft,
  getDraftDetail,
  updateDraft,
  changeDraftStatus,
  deleteDraft,
  addCollaborator,
  removeCollaborator,
  submitDraftAsRequest,
} from "./drafts";
export type {
  DraftListParams,
  CreateDraftInput,
  UpdateDraftInput,
} from "./drafts";

// Comments
export {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  resolveComment,
} from "./comments";
export type { CreateCommentInput, UpdateCommentInput } from "./comments";

// AI
export {
  getAiSuggestions,
  getAiMatchDetail,
  getAiAutocomplete,
  getQualityScore,
  getAiSynonyms,
  generatePhysicalName,
  validateNaming,
} from "./ai";
export type {
  AiSuggestion,
  AiMatchDetail,
  QualityScore,
  AiSynonym,
  PhysicalNameResult,
  NamingValidation,
} from "./ai";

// Governance
export {
  getGovernanceCompliance,
  getGovernanceKpi,
  getGovernanceTrend,
  getGovernanceDeptRanking,
  getGovernanceNonCompliant,
  downloadGovernanceReportPdf,
} from "./governance";
export type {
  ComplianceByType,
  ComplianceData,
  GovernanceKpi,
  GovernanceTrendItem,
  DeptRankingItem,
  NonCompliantItem,
} from "./governance";

// Validations
export {
  getValidationSummary,
  getValidationTrend,
  getValidationRules,
  getValidationHistory,
  executeValidation,
  getViolationList,
  batchCorrectViolations,
} from "./validations";
export type {
  ValidationSummary,
  ValidationTrendItem,
  ValidationRule,
  ValidationHistoryItem,
  ExecuteValidationInput,
  ExecuteValidationResponse,
  ViolationItem,
  ViolationListParams,
  BatchCorrectInput,
  BatchCorrectResponse,
} from "./validations";

// Audit
export { getAuditList, getAuditTimeline } from "./audit";
export type {
  AuditListParams,
  AuditLogItem,
  AuditTimelineItem,
  AuditTimelineResponse,
} from "./audit";

// Notifications
export {
  getNotificationList,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getNotificationStreamUrl,
} from "./notifications";
export type {
  NotificationItem,
  UnreadCountResponse,
  NotificationListParams,
} from "./notifications";

// Common Codes
export {
  getCommonCodeGroups,
  getCommonCodeGroupDetail,
  getCommonCodesByGroup,
  createCommonCodeGroup,
  updateCommonCodeGroup,
  addCommonCode,
  searchCommonCodes,
} from "./common-codes";
export type {
  CommonCodeGroupItem,
  CommonCodeItem,
  CommonCodeSearchResult,
  CommonCodeGroupListParams,
  CreateCommonCodeGroupInput,
  UpdateCommonCodeGroupInput,
  CreateCommonCodeInput,
} from "./common-codes";

// Users
export {
  getUserList,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
} from "./users";
export type {
  UserItem,
  UserListParams,
  CreateUserInput,
  UpdateUserInput,
} from "./users";

// Permissions
export {
  getPermissionsByRole,
  updatePermissions,
  getMenuTree,
} from "./permissions";
export type {
  MenuPermissionItem,
  MenuTreeNode,
  UpdatePermissionsInput,
} from "./permissions";

// System Codes
export {
  getSystemCodeList,
  getSystemCodeById,
  createSystemCode,
  updateSystemCode,
  deleteSystemCode,
  getSystemCodeCategories,
} from "./system-codes";
export type {
  SystemCodeItem,
  SystemCodeListParams,
  CreateSystemCodeInput,
  UpdateSystemCodeInput,
} from "./system-codes";

// Settings
export {
  getDbConnection,
  updateDbConnection,
  testDbConnection,
  getSshSettings,
  updateSshSettings,
  testSshConnection,
} from "./settings";
export type {
  DbConnectionInfo,
  UpdateDbConnectionInput,
  DbTestResult,
  SshSettingsInfo,
  UpdateSshSettingsInput,
  SshTestResult,
} from "./settings";
