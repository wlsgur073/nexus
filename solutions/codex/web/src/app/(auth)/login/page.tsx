"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@nexus/ui";
import { loginApi } from "@nexus/codex-models";

import { loginSchema } from "@/lib/validators";
import type { LoginFormData } from "@/lib/validators";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await loginApi({ loginId: data.loginId, password: data.password });
      router.push("/");
    } catch {
      setError("로그인에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Codex 로그인</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="loginId">사용자 ID</Label>
            <Input
              id="loginId"
              {...register("loginId")}
              className="mt-1.5"
              placeholder="admin"
            />
            {errors.loginId && (
              <p className="mt-1 text-xs text-destructive">
                {errors.loginId.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className="mt-1.5"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Mock 모드: 아무 값으로 로그인 가능
        </p>
      </CardContent>
    </Card>
  );
}
