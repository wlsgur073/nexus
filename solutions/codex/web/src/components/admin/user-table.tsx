"use client";

import { useState } from "react";
import { Plus, UserCog } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nexus/ui";
import { getUserList, toggleUserStatus } from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

import { UserFormDialog } from "./user-form-dialog";

import type { UserRole } from "@nexus/codex-models";

const ROLE_LABELS: Record<UserRole, string> = {
  SYSTEM_ADMIN: "시스템관리자",
  REVIEWER_APPROVER: "검토/승인자",
  STD_MANAGER: "표준 관리자",
  REQUESTER: "신청자",
  READ_ONLY: "조회전용",
};

export function UserTable() {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.users.list({ keyword, role: roleFilter }),
    queryFn: () =>
      getUserList({
        keyword: keyword || undefined,
        role: roleFilter !== "all" ? (roleFilter as UserRole) : undefined,
      }),
  });

  const users = data?.items ?? [];

  const handleToggleStatus = async (userId: number) => {
    try {
      await toggleUserStatus(userId);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("사용자 상태가 변경되었습니다.");
    } catch {
      toast.error("상태 변경에 실패했습니다.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCog className="h-5 w-5" />
            사용자 목록
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="mr-1 h-3 w-3" />
            사용자 추가
          </Button>
        </div>
        <div className="mt-4 flex gap-3">
          <Input
            placeholder="이름, 로그인ID, 이메일 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={roleFilter}
            onValueChange={(v) => setRoleFilter(v ?? "all")}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="역할 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 역할</SelectItem>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            로딩 중...
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>로그인ID</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="w-20">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell className="font-mono text-sm">
                    {user.loginId}
                  </TableCell>
                  <TableCell className="font-medium">{user.userName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.department ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.status === "ACTIVE"
                          ? "border-green-500 text-green-600"
                          : "border-gray-400 text-gray-500"
                      }
                    >
                      {user.status === "ACTIVE" ? "활성" : "비활성"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(user.userId)}
                    >
                      {user.status === "ACTIVE" ? "비활성화" : "활성화"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <UserFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </Card>
  );
}
