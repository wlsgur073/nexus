"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Database, Loader2 } from "lucide-react";
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
} from "@nexus/ui";
import {
  getDbConnection,
  updateDbConnection,
  testDbConnection,
} from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

import type { DbType } from "@nexus/codex-models";

const DB_TYPES: Array<{ value: DbType; label: string }> = [
  { value: "POSTGRESQL", label: "PostgreSQL" },
  { value: "MYSQL", label: "MySQL" },
  { value: "ORACLE", label: "Oracle" },
  { value: "MSSQL", label: "MS SQL Server" },
];

const schema = z.object({
  dbType: z.string().min(1),
  host: z.string().min(1, "호스트를 입력해주세요"),
  port: z.coerce.number().min(1).max(65535),
  databaseName: z.string().min(1, "데이터베이스명을 입력해주세요"),
  username: z.string().min(1, "사용자명을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
  schema: z.string().optional(),
  charset: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function DbConnectionForm() {
  const queryClient = useQueryClient();
  const { data: conn } = useQuery({
    queryKey: QUERY_KEYS.settings.db,
    queryFn: getDbConnection,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (conn) {
      reset({
        dbType: conn.dbType,
        host: conn.host,
        port: conn.port,
        databaseName: conn.databaseName,
        username: conn.username,
        password: "",
        schema: conn.schema ?? "",
        charset: conn.charset,
      });
    }
  }, [conn, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateDbConnection({
        dbType: data.dbType as DbType,
        host: data.host,
        port: data.port,
        databaseName: data.databaseName,
        username: data.username,
        password: data.password,
        schema: data.schema || undefined,
        charset: data.charset || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings.db });
      toast.success("DB 접속 정보가 저장되었습니다.");
    } catch {
      toast.error("저장에 실패했습니다.");
    }
  };

  const handleTest = async () => {
    try {
      const result = await testDbConnection();
      if (result.success) {
        toast.success(
          `연결 성공 (${result.responseTime}ms) — ${result.serverVersion}`,
        );
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("연결 테스트에 실패했습니다.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-5 w-5" />
            DB 접속 정보
          </CardTitle>
          {conn?.isActive && (
            <Badge
              variant="outline"
              className="border-green-500 text-green-600"
            >
              연결됨
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>DB 유형</Label>
            <Select
              defaultValue={conn?.dbType}
              onValueChange={(v) => setValue("dbType", (v ?? "") as string)}
            >
              <SelectTrigger>
                <SelectValue placeholder="DB 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {DB_TYPES.map((db) => (
                  <SelectItem key={db.value} value={db.value}>
                    {db.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="host">호스트</Label>
              <Input id="host" {...register("host")} />
              {errors.host && (
                <p className="text-xs text-destructive">
                  {errors.host.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">포트</Label>
              <Input id="port" type="number" {...register("port")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="databaseName">데이터베이스명</Label>
            <Input id="databaseName" {...register("databaseName")} />
            {errors.databaseName && (
              <p className="text-xs text-destructive">
                {errors.databaseName.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="db-username">사용자명</Label>
              <Input id="db-username" {...register("username")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-password">비밀번호</Label>
              <Input
                id="db-password"
                type="password"
                {...register("password")}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="db-schema">스키마</Label>
              <Input
                id="db-schema"
                {...register("schema")}
                placeholder="public"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="charset">문자셋</Label>
              <Input
                id="charset"
                {...register("charset")}
                placeholder="UTF-8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              )}
              저장
            </Button>
            <Button type="button" variant="outline" onClick={handleTest}>
              연결 테스트
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
