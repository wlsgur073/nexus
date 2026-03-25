"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Terminal } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@nexus/ui";
import {
  getSshSettings,
  updateSshSettings,
  testSshConnection,
} from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

import type { SshAuthType } from "@nexus/codex-models";

const schema = z.object({
  sshEnabled: z.boolean(),
  sshHost: z.string().optional(),
  sshPort: z.coerce.number().min(1).max(65535).optional(),
  sshUsername: z.string().optional(),
  sshAuthType: z.string().optional(),
  sshPassword: z.string().optional(),
  sshKeyPath: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function SshSettingsForm() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: QUERY_KEYS.settings.ssh,
    queryFn: getSshSettings,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const sshEnabled = watch("sshEnabled");
  const authType = watch("sshAuthType");

  useEffect(() => {
    if (settings) {
      reset({
        sshEnabled: settings.sshEnabled,
        sshHost: settings.sshHost ?? "",
        sshPort: settings.sshPort ?? 22,
        sshUsername: settings.sshUsername ?? "",
        sshAuthType: settings.sshAuthType ?? "PASSWORD",
        sshPassword: "",
        sshKeyPath: "",
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateSshSettings({
        sshEnabled: data.sshEnabled,
        sshHost: data.sshHost || undefined,
        sshPort: data.sshPort || undefined,
        sshUsername: data.sshUsername || undefined,
        sshAuthType: (data.sshAuthType as SshAuthType) || undefined,
        sshPassword: data.sshPassword || undefined,
        sshKeyPath: data.sshKeyPath || undefined,
      });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.settings.ssh,
      });
      toast.success("SSH 설정이 저장되었습니다.");
    } catch {
      toast.error("SSH 설정 저장에 실패했습니다.");
    }
  };

  const handleTest = async () => {
    try {
      const result = await testSshConnection();
      if (result.success) {
        toast.success(`SSH 터널 연결 성공 (${result.responseTime}ms)`);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("SSH 연결 테스트에 실패했습니다.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Terminal className="h-5 w-5" />
            SSH 터널 설정
          </CardTitle>
          {settings?.sshEnabled && (
            <Badge variant="outline" className="border-blue-500 text-blue-600">
              활성
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={sshEnabled}
              onCheckedChange={(checked) =>
                setValue("sshEnabled", checked === true)
              }
            />
            <Label>SSH 터널링 사용</Label>
          </div>

          {sshEnabled && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="sshHost">SSH 호스트</Label>
                  <Input id="sshHost" {...register("sshHost")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sshPort">SSH 포트</Label>
                  <Input id="sshPort" type="number" {...register("sshPort")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sshUsername">SSH 사용자명</Label>
                <Input id="sshUsername" {...register("sshUsername")} />
              </div>
              <div className="space-y-2">
                <Label>인증 방식</Label>
                <Select
                  value={authType}
                  onValueChange={(v) =>
                    setValue("sshAuthType", (v ?? "") as string)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PASSWORD">비밀번호</SelectItem>
                    <SelectItem value="SSH_KEY">SSH 키</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {authType === "PASSWORD" ? (
                <div className="space-y-2">
                  <Label htmlFor="sshPassword">SSH 비밀번호</Label>
                  <Input
                    id="sshPassword"
                    type="password"
                    {...register("sshPassword")}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="sshKeyPath">SSH 키 경로</Label>
                  <Input
                    id="sshKeyPath"
                    {...register("sshKeyPath")}
                    placeholder="~/.ssh/id_rsa"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              )}
              저장
            </Button>
            {sshEnabled && (
              <Button type="button" variant="outline" onClick={handleTest}>
                연결 테스트
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
