"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  ScrollArea,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@nexus/ui";
import {
  getCommonCodeGroups,
  getCommonCodesByGroup,
} from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

import type { CommonCodeGroupItem } from "@nexus/codex-models";

export function CommonCodeSearchTable() {
  const [selectedGroup, setSelectedGroup] =
    useState<CommonCodeGroupItem | null>(null);
  const [keyword, setKeyword] = useState("");

  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: QUERY_KEYS.commonCodes.groups({ pageSize: 100 }),
    queryFn: () => getCommonCodeGroups({ pageSize: 100 }),
  });

  const groups = groupsData?.items ?? [];

  const { data: codesData } = useQuery({
    queryKey: QUERY_KEYS.commonCodes.codes(selectedGroup?.groupId ?? 0),
    queryFn: () => getCommonCodesByGroup(selectedGroup!.groupId),
    enabled: !!selectedGroup,
  });

  const codes = codesData ?? [];

  const handleGroupSelect = (group: CommonCodeGroupItem) => {
    setSelectedGroup(group);
  };

  const filteredGroups = keyword
    ? groups.filter(
        (g) =>
          g.groupName.includes(keyword) ||
          g.groupCode.toLowerCase().includes(keyword.toLowerCase()),
      )
    : groups;

  if (groups.length === 0 && groupsLoading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Left: Group list */}
      <Card className="w-80 shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">코드그룹</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="그룹명, 그룹코드 검색..."
              className="pl-9"
            />
          </div>
        </CardHeader>
        <Separator />
        <ScrollArea className="h-[500px]">
          <div className="p-2">
            {filteredGroups.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                코드그룹이 없습니다.
              </p>
            ) : (
              filteredGroups.map((group) => (
                <button
                  key={group.groupId}
                  type="button"
                  onClick={() => handleGroupSelect(group)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                    selectedGroup?.groupId === group.groupId &&
                      "bg-accent font-medium",
                  )}
                >
                  <div>
                    <p className="font-medium">{group.groupName}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {group.groupCode}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {group.codeCount}
                  </Badge>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Right: Code detail */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-sm">
            {selectedGroup
              ? `${selectedGroup.groupName} (${selectedGroup.groupCode})`
              : "코드그룹을 선택하세요"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedGroup ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              좌측에서 코드그룹을 선택하세요
            </p>
          ) : codes.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              등록된 코드가 없습니다.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>코드</TableHead>
                  <TableHead>코드명</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>사용</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code, i) => (
                  <TableRow key={code.codeId}>
                    <TableCell className="text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {code.code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {code.codeName}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {code.description ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          code.useYn === "Y"
                            ? "border-green-500 text-green-600"
                            : "border-gray-400 text-gray-500"
                        }
                      >
                        {code.useYn === "Y" ? "사용" : "미사용"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
