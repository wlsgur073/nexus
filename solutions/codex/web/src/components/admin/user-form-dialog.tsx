"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@nexus/ui";
import { createUser } from "@nexus/codex-models";

import type { UserRole } from "@nexus/codex-models";

const schema = z.object({
  loginId: z.string().min(3, "3자 이상 입력해주세요"),
  userName: z.string().min(1, "이름을 입력해주세요"),
  password: z.string().min(6, "6자 이상 입력해주세요"),
  role: z.string().min(1, "역할을 선택해주세요"),
  department: z.string().optional(),
  email: z
    .string()
    .email("유효한 이메일을 입력해주세요")
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const ROLE_OPTIONS: Array<{ value: UserRole; label: string }> = [
  { value: "SYSTEM_ADMIN", label: "시스템관리자" },
  { value: "REVIEWER_APPROVER", label: "검토/승인자" },
  { value: "STD_MANAGER", label: "표준 관리자" },
  { value: "REQUESTER", label: "신청자" },
  { value: "READ_ONLY", label: "조회전용" },
];

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserFormDialog({ open, onOpenChange }: UserFormDialogProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      loginId: "",
      userName: "",
      password: "",
      role: "",
      department: "",
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createUser({
        loginId: data.loginId,
        userName: data.userName,
        password: data.password,
        role: data.role as UserRole,
        department: data.department || undefined,
        email: data.email || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("사용자가 생성되었습니다.");
      reset();
      onOpenChange(false);
    } catch {
      toast.error("사용자 생성에 실패했습니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loginId">로그인 ID</Label>
            <Input id="loginId" {...register("loginId")} />
            {errors.loginId && (
              <p className="text-xs text-destructive">
                {errors.loginId.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="userName">이름</Label>
            <Input id="userName" {...register("userName")} />
            {errors.userName && (
              <p className="text-xs text-destructive">
                {errors.userName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>역할</Label>
            <Select
              onValueChange={(v) => setValue("role", (v ?? "") as string)}
            >
              <SelectTrigger>
                <span className="flex flex-1 text-left">
                  {ROLE_OPTIONS.find((o) => o.value === watch("role"))?.label ??
                    "역할 선택"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">부서</Label>
            <Input id="department" {...register("department")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "생성 중..." : "생성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
