"use client";

import { SessionTypeResponseDto } from "../../../hooks/useSessionTypes";
import { FocusSessionResponseDto } from "../../../types/focusSession";

interface OngoingSessionModalProps {
  isOpen: boolean;
  sessionData: FocusSessionResponseDto | null;
  sessionTypes: SessionTypeResponseDto[] | null;
  onContinue: () => void;
  onCancel: () => void;
}

export default function OngoingSessionModal({
  isOpen,
  sessionData,
  sessionTypes,
  onContinue,
  onCancel,
}: OngoingSessionModalProps) {
  if (!isOpen || !sessionData) return null;

  const getRemainingTime = () => {
    const endTime = new Date(sessionData.currentStateEndTime).getTime();
    const now = Date.now();
    const remainingSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
    const remainingMinutes = Math.floor(remainingSeconds / 60);
    const remainingSecondsDisplay = remainingSeconds % 60;
    return `${remainingMinutes
      .toString()
      .padStart(2, "0")}:${remainingSecondsDisplay
      .toString()
      .padStart(2, "0")}`;
  };

  const getSessionTypeName = () => {
    if (sessionData.sessionTypeId && sessionTypes) {
      return (
        sessionTypes.find((st) => st.id === sessionData.sessionTypeId)?.name ||
        "Bilinmeyen Mod"
      );
    }
    return "Özel Süre";
  };

  const getStatusText = () => {
    switch (sessionData.status) {
      case "Working":
        return "Çalışma";
      case "Break":
        return "Mola";
      default:
        return sessionData.status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Devam Eden Oturum
          </h3>
          <svg
            className="w-6 h-6 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {getSessionTypeName()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Durum: <span className="font-medium">{getStatusText()}</span>
              </div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {getRemainingTime()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Kalan Süre
              </div>
            </div>
          </div>

          <div className="text-center text-gray-700 dark:text-gray-300">
            <p className="mb-2">Bu oturuma devam etmek istiyor musunuz?</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Devam ederseniz timer otomatik olarak başlayacak.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Oturumu Sonlandır
          </button>
          <button
            onClick={onContinue}
            className="flex-1 px-6 py-3 text-white rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105"
            style={{ backgroundColor: "#F96943" }}
          >
            Devam Et
          </button>
        </div>
      </div>
    </div>
  );
}
