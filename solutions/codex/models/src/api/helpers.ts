/** 비동기 지연 시뮬레이션 */
export function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 페이지네이션 응답 공통 타입 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 페이지네이션 요청 공통 파라미터 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/** 목 데이터에 대한 페이지네이션 처리 */
export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 10,
): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    total,
    page,
    pageSize,
    totalPages,
  };
}

/** 공통 감사 필드 생성 */
export function baseFields(userId = "admin") {
  const now = new Date();
  return {
    createdAt: now,
    createdBy: userId,
    updatedAt: now,
    updatedBy: userId,
  };
}
