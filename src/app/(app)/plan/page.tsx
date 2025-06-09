"use client";

import { useState, useMemo } from "react";
import { usePlans, useWeeklyProgress } from "@/hooks/usePlans";
import { useTags } from "@/hooks/useTags";
import { usePlanCalendar } from "@/hooks/usePlanCalendar";
import { format, startOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import { CreatePlanRequest } from "@/types/plan";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/Modal";

// Components
import AddPlanModal from "@/components/plan/AddPlanModal";
import PlanCalendar from "@/components/plan/PlanCalendar";
import QuickPlanTemplates from "@/components/plan/QuickPlanTemplates";
import WeeklyProgress from "@/components/plan/WeeklyProgress";
import PlansList from "@/components/plan/PlansList";

export default function PlanPage() {
  const [activeTab, setActiveTab] = useState("daily");
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  // Modal hook for alerts
  const { modal, showAlert, handleConfirm, handleCancel } = useModal();

  // Use custom calendar hook
  const { selectedDate, selectedDay, setSelectedDay, navigateMonth } =
    usePlanCalendar();

  // Format dates for API calls
  const monthStartString = format(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    "yyyy-MM-dd"
  );
  const monthEndString = format(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0),
    "yyyy-MM-dd"
  );
  const weekStartString = format(
    startOfWeek(selectedDate, { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );

  // API Hooks
  const { plans, createPlan, deletePlan, markComplete } = usePlans({
    startDate: monthStartString,
    endDate: monthEndString,
  });

  const { tags } = useTags();

  const { weeklyProgress: apiWeeklyProgress } = useWeeklyProgress(
    activeTab === "weekly" ? weekStartString : ""
  );

  // Process weekly progress data for chart
  const processedWeeklyProgress = useMemo(() => {
    if (!apiWeeklyProgress?.days || activeTab !== "weekly") {
      return Array.from({ length: 7 }, (_, i) => ({
        day: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"][i],
        value: 0,
      }));
    }

    return apiWeeklyProgress.days.map((day) => ({
      day: format(new Date(day.date), "EEE", { locale: tr }).substring(0, 3),
      value: day.completedMinutes,
    }));
  }, [apiWeeklyProgress, activeTab]);

  // Handle plan creation
  const handleCreatePlan = async (
    planData: CreatePlanRequest
  ): Promise<void> => {
    try {
      const newPlan = await createPlan(planData);
      console.log("Plan oluşturuldu:", newPlan);
    } catch (error) {
      console.error("Plan oluşturulurken hata:", error);
      throw error;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Add Plan Modal */}
      <AddPlanModal
        isOpen={showAddPlanModal}
        onClose={() => setShowAddPlanModal(false)}
        onSubmit={handleCreatePlan}
        selectedDate={selectedDate}
        selectedDay={selectedDay}
      />

      {/* Header with tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 md:mb-0">
          Çalışma Planlarım
        </h1>
        <div className="p-1 rounded-full shadow-sm bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                activeTab === "daily"
                  ? "text-white shadow-lg bg-orange-600 dark:bg-orange-500"
                  : "text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30"
              }`}
            >
              Günlük
            </button>
            <button
              onClick={() => setActiveTab("weekly")}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                activeTab === "weekly"
                  ? "text-white shadow-lg bg-orange-600 dark:bg-orange-500"
                  : "text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30"
              }`}
            >
              Haftalık
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                activeTab === "monthly"
                  ? "text-white shadow-lg bg-orange-600 dark:bg-orange-500"
                  : "text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30"
              }`}
            >
              Aylık
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar Section */}
        <div className="xl:col-span-3">
          <PlanCalendar
            selectedDate={selectedDate}
            selectedDay={selectedDay}
            plans={plans}
            onDateNavigation={navigateMonth}
            onDaySelect={setSelectedDay}
          />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Plan Templates */}
          <QuickPlanTemplates
            tags={tags || null}
            onShowAddModal={() => setShowAddPlanModal(true)}
          />

          {/* Weekly Progress */}
          <WeeklyProgress weeklyProgress={processedWeeklyProgress} />
        </div>
      </div>

      {/* Selected Day Plans */}
      <div className="mt-6">
        <PlansList
          selectedDate={selectedDate}
          selectedDay={selectedDay}
          plans={plans}
          showCompleted={showCompleted}
          onToggleCompleted={() => setShowCompleted(!showCompleted)}
          onShowAddModal={() => setShowAddPlanModal(true)}
          onMarkComplete={(planId: number, isCompleted: boolean) =>
            markComplete(planId.toString(), isCompleted, showAlert)
          }
          onDeletePlan={(planId: number) =>
            deletePlan(planId.toString(), showAlert)
          }
        />
      </div>

      {/* Modal for alerts */}
      <Modal modal={modal} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
}
