"use client";

import { FocusSessionResponseDto } from "../../types/focusSession";

interface TimerControlsProps {
  isRunning: boolean;
  isUIBreakActive: boolean;
  activeFocusSession: FocusSessionResponseDto | null;
  onStartTimer: () => void;
  onResetTimer: () => void;
  notificationPermission: NotificationPermission;
  onRequestNotificationPermission: () => void;
}

export default function TimerControls({
  isRunning,
  isUIBreakActive,
  activeFocusSession,
  onStartTimer,
  onResetTimer,
  notificationPermission,
  onRequestNotificationPermission,
}: TimerControlsProps) {
  const getNotificationIcon = () => {
    switch (notificationPermission) {
      case "granted":
        return "🔔";
      case "denied":
        return "🔕";
      default:
        return "🔔";
    }
  };

  const getNotificationText = () => {
    switch (notificationPermission) {
      case "granted":
        return "Bildirimler Açık";
      case "denied":
        return "Bildirimler Kapalı";
      default:
        return "Bildirimleri Aç";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main Timer Controls */}
      <div className="flex justify-center gap-4">
        {!isRunning && !isUIBreakActive && (
          <button
            onClick={onStartTimer}
            className="px-8 py-4 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:shadow-xl transform hover:scale-105 shadow-lg group relative z-10"
            style={{
              background: "linear-gradient(135deg, #F96943 0%, #E55527 100%)",
            }}
          >
            Başlat
            <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
              Space tuşu ile başlat
            </span>
          </button>
        )}
        {(isRunning || activeFocusSession || isUIBreakActive) && (
          <button
            onClick={onResetTimer}
            className="px-8 py-4 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:shadow-xl transform hover:scale-105 group relative z-10"
          >
            Sıfırla
            <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
              Ctrl+R veya Esc ile sıfırla
            </span>
          </button>
        )}
      </div>

      {/* Notification Permission Button */}
      {notificationPermission !== "granted" && (
        <button
          onClick={onRequestNotificationPermission}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-700"
        >
          <span>{getNotificationIcon()}</span>
          <span>{getNotificationText()}</span>
        </button>
      )}
    </div>
  );
}
