"use client";

import { FocusSessionResponseDto } from "../../types/focusSession";
import { useDailyPlans } from "@/hooks/usePlans";
import { useState, useEffect } from "react";

export interface ContextSuggestionProps {
  isRunning?: boolean;
  activeFocusSession?: FocusSessionResponseDto | null;
  onStartPlan?: (
    planTitle: string,
    minutes: number,
    planId: string,
    tagName?: string
  ) => void;
  selectedPlanId?: string | null;
  onCancelPlan?: () => void;
}

export default function ContextSuggestion({
  isRunning = false,
  activeFocusSession = null,
  onStartPlan,
  selectedPlanId,
  onCancelPlan,
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
  // Dynamic plan switching state must be unconditionally declared
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  useEffect(() => {
    setCurrentPlanIndex(0);
  }, [dailyPlans]);

  // If still loading, error occurred, or data is absent, do not show suggestion
  if (loadingPlans || plansError || !dailyPlans) {
    return null;
  }

  // If a plan is selected but not started, show selected plan with cancel option
  if (selectedPlanId && !isRunning && !activeFocusSession) {
    const selectedPlan = dailyPlans.plans.find(
      (plan) => plan.id === selectedPlanId
    );
    if (selectedPlan) {
      return (
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-full px-4 py-2 flex items-center gap-3 transition-all duration-200 hover:shadow-md hover:scale-105 max-w-[90vw] mx-2">
            <span className="text-lg flex-shrink-0">📋</span>
            <div className="text-sm flex-1 min-w-0">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {selectedPlan.title}
              </span>
              <span className="text-gray-600 dark:text-gray-400 mx-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">
                {selectedPlan.duration}dk
              </span>
            </div>
            <button
              onClick={() => onCancelPlan && onCancelPlan()}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 flex-shrink-0"
            >
              İptal Et
            </button>
          </div>
        </div>
      );
    }
  }

  const incompletePlans = dailyPlans.plans.filter((plan) => !plan.isCompleted);
  if (incompletePlans.length === 0 || isRunning || activeFocusSession) {
    return null;
  }

  const planToShow = incompletePlans[currentPlanIndex];

  const handlePrevPlan = () => {
    setCurrentPlanIndex(
      (currentPlanIndex + incompletePlans.length - 1) % incompletePlans.length
    );
  };

  const handleNextPlan = () => {
    setCurrentPlanIndex((currentPlanIndex + 1) % incompletePlans.length);
  };

  const handleStartSuggestion = () => {
    if (onStartPlan) {
      onStartPlan(
        planToShow.title,
        planToShow.duration,
        planToShow.id,
        planToShow.tagName
      );
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-full px-4 py-2 flex items-center gap-3 transition-all duration-200 hover:shadow-md hover:scale-105 max-w-[90vw] mx-2">
        {incompletePlans.length > 1 && (
          <button
            onClick={handlePrevPlan}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-1 flex-shrink-0"
          >
            ◀
          </button>
        )}
        <span className="text-lg flex-shrink-0">📋</span>
        <div className="text-sm flex-1 min-w-0">
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {planToShow.title}
          </span>
          <span className="text-gray-600 dark:text-gray-400 mx-2">•</span>
          <span className="text-gray-600 dark:text-gray-400">
            {planToShow.duration}dk
          </span>
        </div>
        {incompletePlans.length > 1 && (
          <button
            onClick={handleNextPlan}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-1 flex-shrink-0"
          >
            ▶
          </button>
        )}
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
