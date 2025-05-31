"use client";

import { FocusSessionResponseDto } from "../../types/focusSession";

interface ContextSuggestionProps {
  isRunning?: boolean;
  activeFocusSession?: FocusSessionResponseDto | null;
  onStartPlan?: (planTitle: string, minutes: number) => void;
}

export default function ContextSuggestion({
  isRunning = false,
  activeFocusSession = null,
  onStartPlan,
}: ContextSuggestionProps) {
  // Mock: En yakın planı getir (gerçekte API'den gelecek)
  const getNextPlan = () => {
    const currentHour = new Date().getHours();

    // Saate göre smart suggestion
    if (currentHour >= 8 && currentHour < 12) {
      return {
        title: "Matematik Çalışması",
        minutes: 45,
        emoji: "📐",
        reason: "sabah odaklanma zamanı",
      };
    } else if (currentHour >= 12 && currentHour < 17) {
      return {
        title: "Proje Hazırlığı",
        minutes: 60,
        emoji: "💼",
        reason: "öğleden sonra prodüktivite",
      };
    } else if (currentHour >= 17 && currentHour < 21) {
      return {
        title: "Kitap Okuma",
        minutes: 30,
        emoji: "📚",
        reason: "akşam dinlendirici aktivite",
      };
    } else {
      return null; // Gece geç saatlerde öneri yok
    }
  };

  const nextPlan = getNextPlan();

  if (!nextPlan || isRunning || activeFocusSession) {
    return null;
  }

  const handleStartSuggestion = () => {
    if (onStartPlan) {
      onStartPlan(nextPlan.title, nextPlan.minutes);
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-full px-4 py-2 flex items-center gap-3 transition-all duration-200 hover:shadow-md hover:scale-105 max-w-[90vw] mx-2">
        <span className="text-lg flex-shrink-0">{nextPlan.emoji}</span>
        <div className="text-sm flex-1 min-w-0">
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {nextPlan.title}
          </span>
          <span className="text-gray-600 dark:text-gray-400 mx-2">•</span>
          <span className="text-gray-600 dark:text-gray-400">
            {nextPlan.minutes}dk • {nextPlan.reason}
          </span>
        </div>
        <button
          onClick={handleStartSuggestion}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 flex-shrink-0"
        >
          Başlat
        </button>
      </div>
    </div>
  );
}
