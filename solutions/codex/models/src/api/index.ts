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
