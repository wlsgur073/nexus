import type { DraftStatus, RequestStatus, StandardStatus } from "@nexus/codex-models";

/** 표준 상태 → 한국어 라벨 */
export const STANDARD_STATUS_LABELS: Record<StandardStatus, string> = {
  UNREGISTERED: "미등록",
  PENDING: "신청",
  REVIEW: "검토",
  APPROVED: "승인",
  REJECTED: "반려",
  FEEDBACK: "피드백대기",
  CANCELLED: "취소",
  BASELINE: "기존",
  DELETED: "삭제",
};

/** 신청 상태 → 한국어 라벨 */
export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  PENDING: "신청",
  REVIEW: "검토",
  APPROVED: "승인",
  REJECTED: "반려",
  FEEDBACK: "피드백대기",
  CANCELLED: "취소",
  FEEDBACK_RESOLVED: "피드백반영",
};

/** 초안 상태 → 한국어 라벨 */
export const DRAFT_STATUS_LABELS: Record<DraftStatus, string> = {
  EDITING: "편집 중",
  READY: "준비 완료",
  SUBMITTED: "신청 전환",
  DISCARDED: "폐기",
  EXPIRED: "만료",
};

/** 표준 상태 → Tailwind 색상 클래스 */
export const STANDARD_STATUS_COLORS: Record<StandardStatus, string> = {
  UNREGISTERED: "bg-gray-100 text-gray-700",
  PENDING: "bg-yellow-100 text-yellow-800",
  REVIEW: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  FEEDBACK: "bg-orange-100 text-orange-800",
  CANCELLED: "bg-gray-100 text-gray-500",
  BASELINE: "bg-emerald-100 text-emerald-800",
  DELETED: "bg-red-100 text-red-500",
};

/** 신청 상태 → Tailwind 색상 클래스 */
export const REQUEST_STATUS_COLORS: Record<RequestStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  REVIEW: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  FEEDBACK: "bg-orange-100 text-orange-800",
  CANCELLED: "bg-gray-100 text-gray-500",
  FEEDBACK_RESOLVED: "bg-teal-100 text-teal-800",
};

/** 초안 상태 → Tailwind 색상 클래스 */
export const DRAFT_STATUS_COLORS: Record<DraftStatus, string> = {
  EDITING: "bg-blue-100 text-blue-800",
  READY: "bg-green-100 text-green-800",
  SUBMITTED: "bg-purple-100 text-purple-800",
  DISCARDED: "bg-gray-100 text-gray-500",
  EXPIRED: "bg-red-100 text-red-500",
};
