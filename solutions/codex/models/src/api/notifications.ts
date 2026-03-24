import type { NotificationPriority, NotificationType } from "../entities";
import { delay } from "./helpers";
import type { PaginatedResponse, PaginationParams } from "./helpers";

export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  referenceId: number | null;
  referenceType: string | null;
  priority: NotificationPriority;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationListParams extends PaginationParams {
  type?: NotificationType;
  isRead?: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: "APPROVAL_REQUIRED",
    title: "신규 신청 건 검토 필요",
    message: "박신청님이 '거래' 표준단어 신규 등록을 신청했습니다.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    referenceId: 6,
    referenceType: "REQUEST",
    priority: "HIGH",
  },
  {
    id: 2,
    type: "REQUEST_STATUS_CHANGED",
    title: "신청 승인 완료",
    message: "신청하신 '고객번호' 표준용어가 승인되었습니다.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    referenceId: 5,
    referenceType: "REQUEST",
    priority: "NORMAL",
  },
  {
    id: 3,
    type: "FEEDBACK_RECEIVED",
    title: "검토 요청 수신",
    message: "승인자가 '이자율' 신청 건에 대해 추가 정보를 요청했습니다.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    referenceId: 4,
    referenceType: "REQUEST",
    priority: "HIGH",
  },
  {
    id: 4,
    type: "COMMENT_ADDED",
    title: "코멘트가 추가되었습니다",
    message: "초안 '잔액 도메인 수정안'에 새 코멘트가 달렸습니다.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    referenceId: 3,
    referenceType: "DRAFT",
    priority: "NORMAL",
  },
  {
    id: 5,
    type: "VALIDATION_COMPLETED",
    title: "데이터 검증 완료",
    message:
      "전체 검증 실행이 완료되었습니다. 총 656건의 위반이 발견되었습니다.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    referenceId: 10,
    referenceType: "VALIDATION_EXECUTION",
    priority: "NORMAL",
  },
];

export async function getNotificationList(
  params: NotificationListParams = {},
): Promise<PaginatedResponse<NotificationItem>> {
  await delay();
  let filtered = [...MOCK_NOTIFICATIONS];
  if (params.type) {
    filtered = filtered.filter((n) => n.type === params.type);
  }
  if (params.isRead !== undefined) {
    filtered = filtered.filter((n) => n.isRead === params.isRead);
  }
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  await delay();
  const count = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
  return { count };
}

export async function markNotificationRead(id: number): Promise<void> {
  await delay(200);
  const item = MOCK_NOTIFICATIONS.find((n) => n.id === id);
  if (item) {
    item.isRead = true;
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  await delay(300);
  MOCK_NOTIFICATIONS.forEach((n) => {
    n.isRead = true;
  });
}

export async function deleteNotification(id: number): Promise<void> {
  await delay(200);
  const idx = MOCK_NOTIFICATIONS.findIndex((n) => n.id === id);
  if (idx !== -1) {
    MOCK_NOTIFICATIONS.splice(idx, 1);
  }
}

/** SSE 스트림 URL 반환 (실제 구현 시 EventSource로 연결) */
export function getNotificationStreamUrl(): string {
  return "/api/notifications/subscribe";
}
