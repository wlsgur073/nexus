"use client";

import { Bell, Check, Trash2 } from "lucide-react";

import {
  Badge,
  Button,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Separator,
} from "@nexus/ui";
import { deleteNotification } from "@nexus/codex-models";

import { useNotifications } from "@/components/providers/notification-provider";

import type { NotificationItem } from "@nexus/codex-models";

const TYPE_LABELS: Record<string, string> = {
  APPROVAL_REQUIRED: "승인",
  REQUEST_STATUS_CHANGED: "상태변경",
  FEEDBACK_RECEIVED: "피드백",
  COMMENT_ADDED: "코멘트",
  DRAFT_SHARED: "공유",
  VALIDATION_COMPLETED: "검증",
  SYSTEM_ANNOUNCEMENT: "공지",
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "방금 전";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return `${Math.floor(days / 7)}주 전`;
}

function NotificationRow({
  item,
  onRead,
  onDelete,
}: {
  item: NotificationItem;
  onRead: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent",
        !item.isRead && "bg-primary/5",
      )}
    >
      <div
        className={cn(
          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
          item.isRead ? "bg-transparent" : "bg-primary",
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {TYPE_LABELS[item.type] ?? item.type}
          </Badge>
          <span className="text-[11px] text-muted-foreground">
            {timeAgo(item.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 text-sm font-medium leading-snug">{item.title}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {item.message}
        </p>
      </div>
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!item.isRead && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onRead(item.id);
            }}
          >
            <Check className="h-3 w-3" />
            <span className="sr-only">읽음 처리</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
        >
          <Trash2 className="h-3 w-3" />
          <span className="sr-only">삭제</span>
        </Button>
      </div>
    </div>
  );
}

export function NotificationCenter() {
  const { unreadCount, notifications, markAsRead, markAllAsRead, refresh } =
    useNotifications();

  const handleDelete = async (id: number) => {
    await deleteNotification(id);
    refresh();
  };

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="ghost" size="icon" className="relative" />}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        <span className="sr-only">알림</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-sm font-semibold">알림</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={markAllAsRead}
            >
              모두 읽음
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
              알림이 없습니다.
            </div>
          ) : (
            <div className="py-1">
              {notifications.map((item) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  onRead={markAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
