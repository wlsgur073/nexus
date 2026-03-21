import { z } from "zod";

export const loginSchema = z.object({
  loginId: z.string().min(1, "사용자 ID를 입력하세요"),
  password: z.string().min(1, "비밀번호를 입력하세요"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const newWordSchema = z.object({
  wordName: z.string().min(1, "표준단어명을 입력하세요").max(100),
  abbrName: z
    .string()
    .min(1, "영문약어를 입력하세요")
    .max(50)
    .regex(/^[A-Z_]+$/, "대문자와 언더스코어만 허용됩니다"),
  engName: z.string().min(1, "영문명을 입력하세요").max(200),
  definition: z.string().min(1, "정의를 입력하세요"),
  domainType: z.string().optional(),
  requestReason: z.string().optional(),
});

export type NewWordFormData = z.infer<typeof newWordSchema>;

export const newDomainSchema = z.object({
  domainName: z.string().min(1, "도메인명을 입력하세요").max(100),
  domainType: z.string().min(1, "도메인유형을 선택하세요"),
  dataType: z.string().min(1, "데이터타입을 선택하세요"),
  dataLength: z.string().optional(),
  definition: z.string().min(1, "정의를 입력하세요"),
  requestReason: z.string().optional(),
});

export type NewDomainFormData = z.infer<typeof newDomainSchema>;

export const newTermSchema = z.object({
  termName: z.string().min(1, "표준용어명을 입력하세요").max(200),
  wordIds: z.array(z.number()).min(1, "구성 단어를 선택하세요"),
  domainId: z.number({ required_error: "도메인을 선택하세요" }),
  infoType: z.string().min(1, "인포타입을 선택하세요"),
  definition: z.string().min(1, "정의를 입력하세요"),
  requestReason: z.string().optional(),
});

export type NewTermFormData = z.infer<typeof newTermSchema>;

export const approvalActionSchema = z.object({
  action: z.enum(["APPROVE", "REJECT", "FEEDBACK"]),
  comment: z.string().min(1, "처리 사유를 입력하세요"),
});

export type ApprovalActionFormData = z.infer<typeof approvalActionSchema>;
