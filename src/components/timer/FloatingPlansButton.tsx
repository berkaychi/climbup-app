"use client";

import { useState } from "react";
import { FocusSessionResponseDto } from "../../types/focusSession";

interface PlanItem {
  id: number;
  title: string;
  minutes: number;
  emoji: string;
  priority: "high" | "medium" | "low";
  isCompleted: boolean;
}

interface FloatingPlansButtonProps {
  isRunning?: boolean;
  activeFocusSession?: FocusSessionResponseDto | null;
  onStartPlan?: (title: string, minutes: number) => void;
}

export default function FloatingPlansButton({
  isRunning = false,
  activeFocusSession = null,
  onStartPlan,
}: FloatingPlansButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Mock plans
  const plans: PlanItem[] = [
    {
      id: 1,
      title: "Matematik Çalışması",
      minutes: 45,
      emoji: "📐",
      priority: "high",
      isCompleted: false,
    },
    {
      id: 2,
      title: "Proje Hazırlığı",
      minutes: 60,
      emoji: "💼",
      priority: "high",
      isCompleted: false,
    },
    {
      id: 3,
      title: "İngilizce Kelime",
      minutes: 25,
      emoji: "🇬🇧",
      priority: "medium",
      isCompleted: true,
    },
    {
      id: 4,
      title: "Kitap Okuma",
      minutes: 30,
      emoji: "📚",
      priority: "low",
      isCompleted: false,
    },
  ];

  const activePlans = plans.filter((p) => !p.isCompleted);
  const priorityColor = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    medium:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  };

  const handlePlanStart = (plan: PlanItem) => {
    if (onStartPlan) {
      onStartPlan(plan.title, plan.minutes);
    }
    setIsOpen(false);
  };

  if (activePlans.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isRunning || activeFocusSession !== null}
        className={`fixed bottom-32 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-30 ${
          isRunning || activeFocusSession !== null
            ? "opacity-50 cursor-not-allowed bg-gray-400"
            : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
        }`}
        title="Bugünkü Planlar"
      >
        <div className="flex items-center justify-center text-white relative">
          <span className="text-xl">📅</span>
          {activePlans.length > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {activePlans.length}
            </div>
          )}
        </div>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-40 md:items-center md:justify-end md:pr-20 md:pb-20">
          <div
            className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-t-2xl md:rounded-2xl shadow-2xl transform transition-all duration-300 max-h-96 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Bugünkü Planlar
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activePlans.length} kalan
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Plans List */}
            <div className="max-h-64 overflow-y-auto">
              {activePlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-lg">{plan.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                            {plan.title}
                          </h4>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              priorityColor[plan.priority]
                            }`}
                          >
                            {plan.priority}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {plan.minutes} dakika
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePlanStart(plan)}
                      className="ml-2 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-full transition-colors"
                    >
                      Başlat
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                📋 Tüm Planları Görüntüle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-35" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
