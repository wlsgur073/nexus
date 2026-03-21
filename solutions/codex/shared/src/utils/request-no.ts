/** REQ-yyyy-NNNN 형식의 신청번호 파싱 결과 */
export interface ParsedRequestNo {
  year: number;
  seq: number;
}

/**
 * 신청번호 파싱: "REQ-2026-0001" → { year: 2026, seq: 1 }
 * 유효하지 않은 형식이면 null 반환
 */
export function parseRequestNo(requestNo: string): ParsedRequestNo | null {
  const match = requestNo.match(/^REQ-(\d{4})-(\d{4})$/);
  if (!match) return null;
  return {
    year: parseInt(match[1], 10),
    seq: parseInt(match[2], 10),
  };
}

/**
 * 신청번호 생성: (2026, 1) → "REQ-2026-0001"
 */
export function formatRequestNo(year: number, seq: number): string {
  return `REQ-${year}-${String(seq).padStart(4, "0")}`;
}

/**
 * 다음 신청번호 생성: "REQ-2026-0005" → "REQ-2026-0006"
 * 연도가 바뀌면 새 시퀀스 시작
 */
export function nextRequestNo(
  lastRequestNo: string | null,
  currentYear?: number,
): string {
  const year = currentYear ?? new Date().getFullYear();

  if (!lastRequestNo) {
    return formatRequestNo(year, 1);
  }

  const parsed = parseRequestNo(lastRequestNo);
  if (!parsed || parsed.year !== year) {
    return formatRequestNo(year, 1);
  }

  return formatRequestNo(year, parsed.seq + 1);
}
