"use client";

import { useEffect, useState } from "react";

export const useNotification = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" ? Notification.permission : "default"
  );

  // Request notification permission
  const requestPermission = async (): Promise<NotificationPermission> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied";
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  // Show notification
  const showNotification = (
    title: string,
    options?: NotificationOptions
  ): Notification | null => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return null;
    }

    if (permission === "granted") {
      return new Notification(title, {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        ...options,
      });
    }

    return null;
  };

  // Play notification sound
  const playNotificationSound = (
    soundPath: string = "/sounds/notification.mp3"
  ) => {
    if (typeof window !== "undefined") {
      try {
        const audio = new Audio(soundPath);
        audio.volume = 0.5;
        audio.play().catch((error) => {
          console.warn("Notification sound could not be played:", error);
        });
      } catch (error) {
        console.warn("Audio creation failed:", error);
      }
    }
  };

  // Show timer complete notification
  const showTimerCompleteNotification = (
    type: "work" | "break" | "session" = "work",
    customMessage?: string
  ) => {
    const messages = {
      work: "Çalışma süresi tamamlandı! 🎉",
      break: "Mola süresi doldu! ⏰",
      session: "Oturum tamamlandı! 🏆",
    };

    const title = customMessage || messages[type];
    const body =
      type === "work"
        ? "Harika! Molaya geçme zamanı."
        : type === "break"
        ? "Mola bittiğinde çalışmaya devam edebilirsiniz."
        : "Tebrikler! Başarıyla tamamladınız.";

    // Play sound first
    playNotificationSound();

    // Show notification if permission is granted
    const notification = showNotification(title, {
      body,
      requireInteraction: true, // Notification won't auto-dismiss
    });

    if (notification) {
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);
    }

    return notification;
  };

  // Vibrate device (mobile)
  const vibrate = (pattern: number | number[] = 200) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Show timer complete with all effects
  const notifyTimerComplete = (
    type: "work" | "break" | "session" = "work",
    customMessage?: string
  ) => {
    // Play sound
    playNotificationSound();

    // Vibrate on mobile
    vibrate([200, 100, 200]);

    // Show notification
    return showTimerCompleteNotification(type, customMessage);
  };

  // Initialize permission check
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  return {
    permission,
    requestPermission,
    showNotification,
    playNotificationSound,
    showTimerCompleteNotification,
    notifyTimerComplete,
    vibrate,
  };
};
