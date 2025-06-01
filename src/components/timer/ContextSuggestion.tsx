"use client";

import { FocusSessionResponseDto } from "../../types/focusSession";
import { useDailyPlans } from "@/hooks/usePlans";

interface ContextSuggestionProps {
  isRunning?: boolean;
  activeFocusSession?: FocusSessionResponseDto | null;
  onStartPlan?: (planTitle: string, minutes: number, planId: string) => void;
}

export default function ContextSuggestion({
  isRunning = false,
  activeFocusSession = null,
  onStartPlan,
}: ContextSuggestionProps) {
  // Fetch today's plans and suggest the next incomplete one
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const {
    dailyPlans,
    isLoading: loadingPlans,
    error: plansError,
  } = useDailyPlans(todayStr);

  // If still loading, error occurred, or data is absent, do not show suggestion
  if (loadingPlans || plansError || !dailyPlans) {
    return null;
  }

  const incompletePlans = dailyPlans.plans.filter((plan) => !plan.isCompleted);
  if (incompletePlans.length === 0 || isRunning || activeFocusSession) {
    return null;
  }
  const nextPlan = incompletePlans[0];

  const handleStartSuggestion = () => {
    if (onStartPlan) {
      onStartPlan(nextPlan.title, nextPlan.duration, nextPlan.id);
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-full px-4 py-2 flex items-center gap-3 transition-all duration-200 hover:shadow-md hover:scale-105 max-w-[90vw] mx-2">
        <span className="text-lg flex-shrink-0">📋</span>
        <div className="text-sm flex-1 min-w-0">
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {nextPlan.title}
          </span>
          <span className="text-gray-600 dark:text-gray-400 mx-2">•</span>
          <span className="text-gray-600 dark:text-gray-400">
            {nextPlan.duration}dk
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
