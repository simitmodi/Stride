"use client";

import { useEffect, useRef, useState } from "react";
import {
  enablePushNotifications,
  registerStrideServiceWorker,
  sendWebPushNotification,
  type StrideNotificationPayload,
} from "@/lib/notifications/client";

const ALERT_FAVICON = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#4f46e5"/><circle cx="48" cy="16" r="10" fill="#ef4444" stroke="#fff" stroke-width="4"/></svg>`
)}`;

export default function NotificationManager() {
  const [unreadCount, setUnreadCount] = useState(0);
  const baseTitleRef = useRef("Stride");
  const baseFaviconRef = useRef("/icon.png");

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    baseTitleRef.current = document.title || "Stride";

    const iconLink = document.querySelector<HTMLLinkElement>("link[rel='icon'], link[rel='shortcut icon']");
    if (iconLink?.href) {
      baseFaviconRef.current = iconLink.href;
    }
  }, []);

  useEffect(() => {
    const initPush = async () => {
      const registration = await registerStrideServiceWorker();
      if (!registration) {
        console.warn("Service worker registration failed on notification manager init.");
        return;
      }

      if (typeof window !== "undefined" && Notification.permission === "granted") {
        try {
          await enablePushNotifications();
        } catch (error) {
          console.error("Push init failed", error);
        }
      }
    };

    initPush();
  }, []);

  useEffect(() => {
    const setFavicon = (href: string) => {
      let iconLink = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      if (!iconLink) {
        iconLink = document.createElement("link");
        iconLink.rel = "icon";
        document.head.appendChild(iconLink);
      }
      iconLink.href = href;
    };

    if (document.hidden && unreadCount > 0) {
      document.title = `(${unreadCount}) ${baseTitleRef.current}`;
      setFavicon(ALERT_FAVICON);
      return;
    }

    document.title = baseTitleRef.current;
    setFavicon(baseFaviconRef.current);
  }, [unreadCount]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (!document.hidden) {
        setUnreadCount(0);
      }
    };

    const onEnable = async () => {
      try {
        await enablePushNotifications();
      } catch (error) {
        console.error("Failed to enable push notifications", error);
      }
    };

    const onNotify = async (event: Event) => {
      const customEvent = event as CustomEvent<StrideNotificationPayload>;
      const payload = customEvent.detail;
      if (!payload?.title || !payload?.body) {
        return;
      }

      if (document.hidden) {
        setUnreadCount((prev) => prev + 1);
      }

      if (Notification.permission !== "granted") {
        return;
      }

      try {
        if (document.hidden) {
          await enablePushNotifications();
          await sendWebPushNotification(payload);
        }
      } catch (error) {
        console.error("Web push send failed", error);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("stride:enable-notifications", onEnable as EventListener);
    window.addEventListener("stride:notify", onNotify as EventListener);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("stride:enable-notifications", onEnable as EventListener);
      window.removeEventListener("stride:notify", onNotify as EventListener);
    };
  }, []);

  return null;
}
