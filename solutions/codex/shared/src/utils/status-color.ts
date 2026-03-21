import type { DraftStatus, RequestStatus, StandardStatus } from "@nexus/codex-models";
import {
  DRAFT_STATUS_COLORS,
  REQUEST_STATUS_COLORS,
  STANDARD_STATUS_COLORS,
} from "../constants/status";

/** 표준 상태값 → Tailwind Badge 색상 클래스 */
export function getStandardStatusColor(status: StandardStatus): string {
  return STANDARD_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700";
}

/** 신청 상태값 → Tailwind Badge 색상 클래스 */
export function getRequestStatusColor(status: RequestStatus): string {
  return REQUEST_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700";
}

/** 초안 상태값 → Tailwind Badge 색상 클래스 */
export function getDraftStatusColor(status: DraftStatus): string {
  return DRAFT_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700";
}
