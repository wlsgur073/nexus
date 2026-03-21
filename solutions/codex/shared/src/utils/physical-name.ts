/**
 * 표준단어 약어 배열 → 물리명 자동 생성
 * 예: ["CUST", "NO"] → "CUST_NO"
 */
export function buildPhysicalName(abbreviations: string[]): string {
  return abbreviations
    .map((abbr) => abbr.toUpperCase().trim())
    .filter(Boolean)
    .join("_");
}

/**
 * 물리명 → 약어 배열로 분해
 * 예: "CUST_NO" → ["CUST", "NO"]
 */
export function parsePhysicalName(physicalName: string): string[] {
  return physicalName.split("_").filter(Boolean);
}
