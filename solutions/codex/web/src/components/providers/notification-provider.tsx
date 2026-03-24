"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getUnreadCount,
  getNotificationList,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationStreamUrl,
} from "@nexus/codex-models";

import type { NotificationItem } from "@nexus/codex-models";

interface NotificationContextValue {
  unreadCount: number;
  notifications: NotificationItem[];
  isLoading: boolean;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  refresh: () => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  unreadCount: 0,
  notifications: [],
  isLoading: true,
  markAsRead: () => {},
  markAllAsRead: () => {},
  refresh: () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        getNotificationList({ pageSize: 20 }),
        getUnreadCount(),
      ]);
      setNotifications(listRes.items);
      setUnreadCount(countRes.count);
    } catch {
      // Silently handle — notifications are non-critical
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // SSE connection for real-time updates
  useEffect(() => {
    const enableSSE = process.env.NEXT_PUBLIC_ENABLE_SSE === "true";
    if (!enableSSE) return;

    const url = getNotificationStreamUrl();
    let eventSource: EventSource | null = null;
    let retryTimeout: ReturnType<typeof setTimeout>;
    let retryCount = 0;

    function connect() {
      try {
        eventSource = new EventSource(url);

        eventSource.onmessage = () => {
          // Refresh notifications on any SSE message
          fetchNotifications();
        };

        eventSource.onopen = () => {
          retryCount = 0;
        };

        eventSource.onerror = () => {
          eventSource?.close();
          // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
          const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
          retryCount++;
          retryTimeout = setTimeout(connect, delay);
        };
      } catch {
        // EventSource not available (SSR or mock environment)
      }
    }

    connect();

    return () => {
      eventSource?.close();
      clearTimeout(retryTimeout);
    };
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: number) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  const value = useMemo(
    () => ({
      unreadCount,
      notifications,
      isLoading,
      markAsRead,
      markAllAsRead,
      refresh: fetchNotifications,
    }),
    [
      unreadCount,
      notifications,
      isLoading,
      markAsRead,
      markAllAsRead,
      fetchNotifications,
    ],
  );

  return <NotificationContext value={value}>{children}</NotificationContext>;
}
