import type { TargetType } from "../entities";
import { delay } from "./helpers";

export interface ComplianceByType {
  type: TargetType;
  rate: number;
  total: number;
  compliant: number;
  nonCompliant: number;
}

export interface ComplianceData {
  overall: number;
  byType: ComplianceByType[];
}

export interface GovernanceKpi {
  processingRate: number;
  avgApprovalDays: number;
  rejectionRate: number;
  violationCount: number;
  monthOverMonth: {
    processingRate: number;
    avgApprovalDays: number;
    rejectionRate: number;
    violationCount: number;
  };
}

export interface GovernanceTrendItem {
  month: string;
  newCount: number;
  updateCount: number;
  deleteCount: number;
}

export interface DeptRankingItem {
  deptName: string;
  complianceRate: number;
  totalCount: number;
}

export interface NonCompliantItem {
  itemName: string;
  itemType: TargetType;
  violationReason: string;
  registeredDate: Date;
}

export async function getGovernanceCompliance(): Promise<ComplianceData> {
  await delay();
  return {
    overall: 87.3,
    byType: [
      {
        type: "WORD",
        rate: 92.1,
        total: 1247,
        compliant: 1149,
        nonCompliant: 98,
      },
      {
        type: "DOMAIN",
        rate: 88.8,
        total: 89,
        compliant: 79,
        nonCompliant: 10,
      },
      {
        type: "TERM",
        rate: 84.6,
        total: 3562,
        compliant: 3014,
        nonCompliant: 548,
      },
    ],
  };
}

export async function getGovernanceKpi(): Promise<GovernanceKpi> {
  await delay();
  return {
    processingRate: 94.2,
    avgApprovalDays: 2.3,
    rejectionRate: 5.8,
    violationCount: 656,
    monthOverMonth: {
      processingRate: 2.1,
      avgApprovalDays: -0.4,
      rejectionRate: -0.9,
      violationCount: -42,
    },
  };
}

export async function getGovernanceTrend(): Promise<GovernanceTrendItem[]> {
  await delay();
  return [
    { month: "2025-10", newCount: 42, updateCount: 18, deleteCount: 5 },
    { month: "2025-11", newCount: 38, updateCount: 22, deleteCount: 3 },
    { month: "2025-12", newCount: 55, updateCount: 15, deleteCount: 8 },
    { month: "2026-01", newCount: 61, updateCount: 27, deleteCount: 4 },
    { month: "2026-02", newCount: 47, updateCount: 19, deleteCount: 6 },
    { month: "2026-03", newCount: 33, updateCount: 14, deleteCount: 2 },
  ];
}

export async function getGovernanceDeptRanking(): Promise<DeptRankingItem[]> {
  await delay();
  return [
    { deptName: "IT기획팀", complianceRate: 98.2, totalCount: 312 },
    { deptName: "데이터분석팀", complianceRate: 95.7, totalCount: 228 },
    { deptName: "개발1팀", complianceRate: 91.3, totalCount: 445 },
    { deptName: "개발2팀", complianceRate: 88.9, totalCount: 387 },
    { deptName: "DBA팀", complianceRate: 86.4, totalCount: 156 },
    { deptName: "마케팅팀", complianceRate: 79.2, totalCount: 98 },
    { deptName: "영업팀", complianceRate: 72.1, totalCount: 67 },
  ];
}

export async function getGovernanceNonCompliant(): Promise<NonCompliantItem[]> {
  await delay();
  return [
    {
      itemName: "고객ID",
      itemType: "TERM",
      violationReason: "영문약어 미입력",
      registeredDate: new Date("2026-02-15"),
    },
    {
      itemName: "거래코드",
      itemType: "TERM",
      violationReason: "정의 50자 미만",
      registeredDate: new Date("2026-02-20"),
    },
    {
      itemName: "계좌번호",
      itemType: "TERM",
      violationReason: "물리명 미생성",
      registeredDate: new Date("2026-02-22"),
    },
    {
      itemName: "잔액",
      itemType: "WORD",
      violationReason: "영문명 미입력",
      registeredDate: new Date("2026-03-01"),
    },
    {
      itemName: "이자율",
      itemType: "TERM",
      violationReason: "구성 단어 미연결",
      registeredDate: new Date("2026-03-05"),
    },
    {
      itemName: "만기일",
      itemType: "TERM",
      violationReason: "도메인유형 미설정",
      registeredDate: new Date("2026-03-08"),
    },
    {
      itemName: "금액",
      itemType: "DOMAIN",
      violationReason: "설명 미입력",
      registeredDate: new Date("2026-03-10"),
    },
    {
      itemName: "채널코드",
      itemType: "TERM",
      violationReason: "중복 의심 항목",
      registeredDate: new Date("2026-03-12"),
    },
    {
      itemName: "부서명",
      itemType: "WORD",
      violationReason: "영문약어 규칙 위반",
      registeredDate: new Date("2026-03-15"),
    },
    {
      itemName: "승인번호",
      itemType: "TERM",
      violationReason: "물리명 패턴 불일치",
      registeredDate: new Date("2026-03-18"),
    },
  ];
}

export async function downloadGovernanceReportPdf(): Promise<Blob> {
  await delay(800);

  // 최소 유효 PDF 구조 (1페이지, "Governance Report" 텍스트 포함)
  const content = `BT /F1 24 Tf 100 700 Td (Governance Report - Mock) Tj ET`;
  const stream = `4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj`;

  const pdf = [
    "%PDF-1.4",
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
    stream,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    "xref",
    "0 6",
    "0000000000 65535 f ",
    "0000000009 00000 n ",
    "0000000058 00000 n ",
    "0000000115 00000 n ",
    "0000000266 00000 n ",
    "0000000380 00000 n ",
    "trailer << /Size 6 /Root 1 0 R >>",
    "startxref",
    "450",
    "%%EOF",
  ].join("\n");

  return new Blob([pdf], { type: "application/pdf" });
}
