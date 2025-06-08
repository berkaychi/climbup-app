"use client";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Plan } from "@/types/plan";

interface PlansListProps {
  selectedDate: Date;
  selectedDay: number;
  plans: Plan[];
  showCompleted: boolean;
  onToggleCompleted: () => void;
  onShowAddModal: () => void;
  onMarkComplete: (planId: number, isCompleted: boolean) => void;
  onDeletePlan: (planId: number) => void;
}

export default function PlansList({
  selectedDate,
  selectedDay,
  plans,
  showCompleted,
  onToggleCompleted,
  onShowAddModal,
  onMarkComplete,
  onDeletePlan,
}: PlansListProps) {
  // Get plans for selected day
  const dayDate = format(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDay),
    "yyyy-MM-dd"
  );

  const dayPlans = plans.filter(
    (plan) => format(new Date(plan.startTime), "yyyy-MM-dd") === dayDate
  );

  // Filter based on completion status
  const filteredPlans = showCompleted
    ? dayPlans
    : dayPlans.filter((plan) => !plan.isCompleted);

  // Count stats
  const totalPlans = dayPlans.length;
  const completedPlans = dayPlans.filter((plan) => plan.isCompleted).length;

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {format(
              new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDay
              ),
              "d MMMM yyyy",
              { locale: tr }
            )}{" "}
            Planları
          </h3>

          {/* Plan count info */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>
              ({totalPlans} toplam, {completedPlans} tamamlandı)
            </span>
          </div>

          <button
            onClick={onToggleCompleted}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              showCompleted
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              {showCompleted ? "Tamamlananları Gizle" : "Tamamlananları Göster"}
            </span>
          </button>
        </div>
        <button
          onClick={onShowAddModal}
          className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-500 dark:to-orange-600 hover:from-orange-700 hover:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 transition-all duration-300 hover:shadow-lg text-sm transform hover:scale-105"
        >
          + Yeni Plan Ekle
        </button>
      </div>

      <div className="space-y-3">
        {filteredPlans.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>
              {showCompleted
                ? "Bu gün için henüz plan eklenmemiş."
                : "Bu gün için tamamlanmamış plan yok."}
            </p>
          </div>
        ) : (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                plan.isCompleted
                  ? "bg-green-50/80 dark:bg-green-900/20 border-gray-200 dark:border-gray-600 hover:bg-green-100/80 dark:hover:bg-green-900/30 border-l-green-400 dark:border-l-green-500 opacity-90"
                  : plan.isOverdue
                  ? "bg-red-50/80 dark:bg-red-900/20 border-gray-200 dark:border-gray-600 hover:bg-red-100/80 dark:hover:bg-red-900/30 border-l-red-400 dark:border-l-red-500"
                  : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/70 border-l-orange-500 dark:border-l-orange-400"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span
                      className={`font-bold mr-4 px-2 py-1 rounded text-sm ${
                        plan.isCompleted
                          ? "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-800/50"
                          : plan.isOverdue
                          ? "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800/50"
                          : "text-gray-800 dark:text-gray-100 bg-orange-100 dark:bg-orange-900/30"
                      }`}
                    >
                      {format(new Date(plan.startTime), "HH:mm")}
                    </span>
                    <h4
                      className={`font-medium ${
                        plan.isCompleted
                          ? "text-green-700 dark:text-green-300 line-through"
                          : plan.isOverdue
                          ? "text-red-700 dark:text-red-300"
                          : "text-gray-800 dark:text-gray-100"
                      }`}
                    >
                      {plan.title}
                    </h4>
                    <span
                      className={`ml-auto px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                        plan.isCompleted
                          ? "bg-green-200 dark:bg-green-800/50 text-green-700 dark:text-green-300"
                          : plan.isOverdue
                          ? "bg-red-200 dark:bg-red-800/50 text-red-700 dark:text-red-300"
                          : "bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200"
                      }`}
                    >
                      {plan.tagName || "Kategori Yok"}
                    </span>
                  </div>
                  <p
                    className={`text-sm mb-2 leading-relaxed ${
                      plan.isCompleted
                        ? "text-green-600 dark:text-green-400 line-through"
                        : plan.isOverdue
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {plan.description || "Açıklama yok"}
                  </p>
                  <div
                    className={`flex items-center text-xs ${
                      plan.isCompleted
                        ? "text-green-600 dark:text-green-400"
                        : plan.isOverdue
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <svg
                      className="w-3 h-3 mr-1"
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
                    <span>{plan.duration} dakika</span>
                    {plan.isCompleted && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          ✓ Tamamlandı
                        </span>
                      </>
                    )}
                    {plan.isOverdue && !plan.isCompleted && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          ⚠️ Süresi Geçmiş
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  {!plan.isCompleted && (
                    <button
                      onClick={() => onMarkComplete(Number(plan.id), true)}
                      className="text-gray-400 hover:text-green-500 transition-colors p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/30"
                      title="Tamamla"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  )}
                  {plan.isCompleted && (
                    <div
                      className="text-green-500 p-1 rounded bg-green-50 dark:bg-green-900/30 cursor-not-allowed"
                      title="Tamamlanan planlar tekrar açılamaz"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                  <button
                    onClick={() => onDeletePlan(Number(plan.id))}
                    disabled={plan.isCompleted || plan.isOverdue}
                    className={`transition-colors p-1 rounded ${
                      plan.isCompleted || plan.isOverdue
                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    }`}
                    title={
                      plan.isCompleted
                        ? "Tamamlanan planlar silinemez"
                        : plan.isOverdue
                        ? "Süresi geçmiş planlar silinemez"
                        : "Sil"
                    }
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
