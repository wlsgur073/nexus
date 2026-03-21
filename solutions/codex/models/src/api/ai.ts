import type { TargetType } from "../entities";
import { delay } from "./helpers";

export interface AiSuggestion {
  id: number;
  name: string;
  physicalName: string;
  similarity: number;
  type: TargetType;
  status: string;
}

export interface AiMatchDetail {
  suggestion: AiSuggestion;
  matchReasons: string[];
  relatedTerms: { name: string; physicalName: string }[];
}

export interface QualityScore {
  overall: number;
  naming: number;
  definition: number;
  consistency: number;
  suggestions: string[];
}

export interface AiSynonym {
  word: string;
  similarity: number;
  isStandard: boolean;
}

export interface PhysicalNameResult {
  physicalName: string;
  components: { word: string; abbr: string }[];
}

export interface NamingValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export async function getAiSuggestions(
  targetType: TargetType,
  name: string,
): Promise<AiSuggestion[]> {
  await delay(800);
  if (targetType === "WORD") {
    return [
      {
        id: 1,
        name: "거래",
        physicalName: "TRNS",
        similarity: 92,
        type: "WORD",
        status: "BASELINE",
      },
      {
        id: 2,
        name: "매매",
        physicalName: "TRAD",
        similarity: 78,
        type: "WORD",
        status: "BASELINE",
      },
    ];
  }
  return [
    {
      id: 10,
      name: "고객번호",
      physicalName: "CUST_NO",
      similarity: 85,
      type: "TERM",
      status: "BASELINE",
    },
  ];
}

export async function getAiMatchDetail(
  suggestionId: number,
): Promise<AiMatchDetail> {
  await delay(500);
  return {
    suggestion: {
      id: suggestionId,
      name: "거래",
      physicalName: "TRNS",
      similarity: 92,
      type: "WORD",
      status: "BASELINE",
    },
    matchReasons: [
      "한국어 의미 유사도 92%",
      "동일 도메인유형 (명칭)",
      "사용 빈도 상위 10%",
    ],
    relatedTerms: [
      { name: "거래일자", physicalName: "TRNS_DT" },
      { name: "거래금액", physicalName: "TRNS_AMT" },
    ],
  };
}

export async function getAiAutocomplete(
  input: string,
  targetType: TargetType,
): Promise<string[]> {
  await delay(300);
  if (targetType === "WORD") {
    return ["고객", "계좌", "거래", "상품", "금액"].filter((w) =>
      w.includes(input),
    );
  }
  return ["고객번호", "계좌잔액", "거래일자"].filter((t) => t.includes(input));
}

export async function getQualityScore(
  targetType: TargetType,
  data: Record<string, unknown>,
): Promise<QualityScore> {
  await delay(600);
  return {
    overall: 85,
    naming: 90,
    definition: 80,
    consistency: 85,
    suggestions: [
      "정의에 사용 맥락을 추가하면 품질 점수가 향상됩니다.",
      "유사 표준이 이미 존재하는지 확인해 주세요.",
    ],
  };
}

export async function getAiSynonyms(word: string): Promise<AiSynonym[]> {
  await delay(500);
  return [
    { word: "매매", similarity: 85, isStandard: true },
    { word: "트랜잭션", similarity: 72, isStandard: false },
    { word: "교역", similarity: 60, isStandard: false },
  ];
}

export async function generatePhysicalName(
  words: string[],
): Promise<PhysicalNameResult> {
  await delay(400);
  const components = words.map((w) => {
    const abbrMap: Record<string, string> = {
      고객: "CUST",
      번호: "NO",
      계좌: "ACCT",
      잔액: "BAL",
      거래: "TRNS",
      일자: "DT",
      코드: "CD",
      명칭: "NM",
      금액: "AMT",
      상품: "PROD",
      유형: "TP",
    };
    return { word: w, abbr: abbrMap[w] ?? w.toUpperCase() };
  });
  return {
    physicalName: components.map((c) => c.abbr).join("_"),
    components,
  };
}

export async function validateNaming(
  name: string,
  targetType: TargetType,
): Promise<NamingValidation> {
  await delay(400);
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  if (name.length < 2) {
    errors.push("이름은 최소 2자 이상이어야 합니다.");
  }
  if (/[a-zA-Z]/.test(name) && targetType !== "DOMAIN") {
    warnings.push("한국어 이름에 영문이 포함되어 있습니다.");
  }
  if (name.length > 50) {
    suggestions.push("이름이 길어 축약을 검토해 주세요.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}
