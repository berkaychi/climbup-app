"use client";

import { useState, useMemo, useEffect } from "react";
import { usePlans, useWeeklyProgress } from "@/hooks/usePlans";
import { useTags } from "@/hooks/useTags";
import { format, startOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import { CreatePlanRequest } from "@/types/plan";

// Plan Modal Component
function AddPlanModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
  selectedDay,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planData: CreatePlanRequest) => Promise<void>;
  selectedDate: Date;
  selectedDay: number;
}) {
  const { tags } = useTags();

  // Calculate default date (the day user clicked on)
  const defaultDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDay,
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    forDate: format(defaultDate, "yyyy-MM-dd"),
    startTime: "09:00", // Default start time
    duration: 60, // Default 1 hour
    hasStartTime: true, // Default enabled
    hasDuration: true, // Default enabled
    tagId: "",
    color: "#F96943",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date for min date validation
  const today = format(new Date(), "yyyy-MM-dd");

  // Update form date when modal opens or selected day changes
  useEffect(() => {
    if (isOpen) {
      const newDefaultDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDay,
      );

      // If selected date is in the past, use today's date instead
      const todayDate = new Date();
      const useDate = newDefaultDate < todayDate ? todayDate : newDefaultDate;

      setFormData((prev) => ({
        ...prev,
        forDate: format(useDate, "yyyy-MM-dd"),
      }));
    }
  }, [isOpen, selectedDate, selectedDay]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const planDate = new Date(formData.forDate);
      let startDateTime: Date;
      let endDateTime: Date;

      if (formData.hasStartTime && formData.startTime) {
        // Use specified start time
        const [hours, minutes] = formData.startTime.split(":").map(Number);
        startDateTime = new Date(planDate);
        startDateTime.setHours(hours, minutes, 0, 0);
      } else {
        // Use start of day if no specific time
        startDateTime = new Date(planDate);
        startDateTime.setHours(9, 0, 0, 0); // Default to 9 AM
      }

      if (formData.hasDuration) {
        endDateTime = new Date(
          startDateTime.getTime() + formData.duration * 60000,
        );
      } else {
        // If no duration specified, don't set endTime (it will be calculated by API)
        endDateTime = startDateTime;
      }

      await onSubmit({
        title: formData.title,
        description: formData.description || undefined,
        startTime: startDateTime.toISOString(),
        endTime: formData.hasDuration ? endDateTime.toISOString() : undefined,
        tagId: formData.tagId || undefined,
        color: formData.color,
      });

      onClose();
      // Reset form
      setFormData({
        title: "",
        description: "",
        forDate: format(defaultDate, "yyyy-MM-dd"),
        startTime: "09:00",
        duration: 60,
        hasStartTime: true,
        hasDuration: true,
        tagId: "",
        color: "#F96943",
      });
    } catch (error) {
      console.error("Plan oluşturulurken hata:", error);
      alert("Plan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-oid="-a2nlhs"
    >
      <div
        role="dialog"
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        data-oid="rvl41m1"
      >
        <div
          className="flex justify-between items-center mb-4"
          data-oid="zu25u7w"
        >
          <h2
            className="text-xl font-semibold text-gray-800 dark:text-gray-100"
            data-oid=".rh2398"
          >
            Yeni Plan Ekle
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            data-oid="otwtwt-"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="bdapnqy"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
                data-oid="cr486ia"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" data-oid="ofuug0f">
          <div data-oid="151iy6s">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              data-oid="ihpknoy"
            >
              Plan Başlığı *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Örn: Matematik Çalışması"
              data-oid="t2.w_v."
            />
          </div>

          <div data-oid="oxn1mb.">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              data-oid=".irfdjp"
            >
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={3}
              placeholder="Plan detayları..."
              data-oid="8f58ban"
            />
          </div>

          <div data-oid="7l3mxa8">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              data-oid="d4c_7d8"
            >
              Tarih *
            </label>
            <input
              type="date"
              required
              min={today}
              value={formData.forDate}
              onChange={(e) =>
                setFormData({ ...formData, forDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              data-oid="eg26i5p"
            />
          </div>

          <div data-oid="cy-y.i:">
            <div
              className="flex items-center justify-between mb-3"
              data-oid="j:ow5yk"
            >
              <div className="flex items-center" data-oid="7e12xly">
                <span
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  data-oid="zw7e.1:"
                >
                  Başlangıç saati
                </span>
                <span
                  className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full font-medium"
                  data-oid="_5ng7m5"
                >
                  Önerilen
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    hasStartTime: !formData.hasStartTime,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  formData.hasStartTime
                    ? "bg-orange-600 dark:bg-orange-500"
                    : "bg-gray-200 dark:bg-gray-600"
                }`}
                data-oid="akx0ybk"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.hasStartTime ? "translate-x-6" : "translate-x-1"
                  }`}
                  data-oid="72l11nj"
                />
              </button>
            </div>
            {formData.hasStartTime && (
              <div className="relative" data-oid="_o6958s">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  data-oid="pdlow5b"
                >
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="zs82-4j"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      data-oid="1p1v8z_"
                    />
                  </svg>
                </div>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  data-oid="7qbjcsg"
                />

                <p
                  className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1"
                  data-oid="m:xtzf0"
                >
                  📅 Planlı çalışma için daha etkili
                </p>
              </div>
            )}
            {!formData.hasStartTime && (
              <p
                className="text-xs text-gray-500 dark:text-gray-400 italic"
                data-oid="dr4qyt_"
              >
                Saat belirtmezseniz varsayılan olarak 09:00&apos;da başlayacak
              </p>
            )}
          </div>

          <div data-oid="5r:m.33">
            <div
              className="flex items-center justify-between mb-3"
              data-oid="xjdym.3"
            >
              <div className="flex items-center" data-oid="yqj6cwb">
                <span
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  data-oid="_6wp0q."
                >
                  Hedef çalışma süresi
                </span>
                <span
                  className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-medium"
                  data-oid="5ul7gxe"
                >
                  Motivasyon
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    hasDuration: !formData.hasDuration,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  formData.hasDuration
                    ? "bg-orange-600 dark:bg-orange-500"
                    : "bg-gray-200 dark:bg-gray-600"
                }`}
                data-oid="ji3p90:"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.hasDuration ? "translate-x-6" : "translate-x-1"
                  }`}
                  data-oid="gibavog"
                />
              </button>
            </div>
            {formData.hasDuration && (
              <div data-oid="ak.c6a5">
                <div className="flex items-center space-x-3" data-oid="w-ad1h9">
                  <div className="relative flex-1" data-oid="k-12bcm">
                    <div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      data-oid="xy10swp"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="4:syh4m"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                          data-oid="no3rdfp"
                        />
                      </svg>
                    </div>
                    <input
                      type="number"
                      min="5"
                      max="480"
                      step="5"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: parseInt(e.target.value),
                        })
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      data-oid="zn_t341"
                    />
                  </div>
                  <span
                    className="text-sm text-gray-600 dark:text-gray-400 font-medium"
                    data-oid="gn:p4ln"
                  >
                    dakika
                  </span>
                </div>
                <div
                  className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2"
                  data-oid=":77bl4w"
                >
                  <span data-oid=".k4jzsb">⚡ Odaklanma süresi</span>
                  <span data-oid="5-z0faq">
                    {Math.floor(formData.duration / 60)}s{" "}
                    {formData.duration % 60}dk
                  </span>
                </div>
              </div>
            )}
            {!formData.hasDuration && (
              <p
                className="text-xs text-gray-500 dark:text-gray-400 italic"
                data-oid="9rmfa5k"
              >
                Süre hedefi motivasyonunuzu artırır ve ilerlemenizi takip
                etmenizi sağlar
              </p>
            )}
          </div>

          {tags && tags.length > 0 && (
            <div data-oid="u8zxjah">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                data-oid="iif809j"
              >
                Etiket
              </label>
              <select
                value={formData.tagId}
                onChange={(e) =>
                  setFormData({ ...formData, tagId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                data-oid="6ygjx0m"
              >
                <option value="" data-oid="c8etdsj">
                  Etiket seçiniz
                </option>
                {tags.map((tag) => (
                  <option
                    key={tag.id}
                    value={tag.id.toString()}
                    data-oid="bdekctx"
                  >
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div data-oid="q36s0km">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              data-oid="eh.dvh6"
            >
              Renk
            </label>
            <div className="flex space-x-2" data-oid="g0564.v">
              {[
                "#F96943",
                "#3B82F6",
                "#10B981",
                "#8B5CF6",
                "#F59E0B",
                "#EF4444",
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color
                      ? "border-gray-800 dark:border-gray-200"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  style={{ backgroundColor: color }}
                  data-oid="f2q6_q."
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4" data-oid="_bm631v">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              data-oid="akxd8tq"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-oid="y:-72c."
            >
              {isSubmitting ? "Ekleniyor..." : "Plan Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PlanPage() {
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate()); // Use actual current day
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true); // Toggle for completed plans

  // Format dates for API calls
  const monthStartString = format(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    "yyyy-MM-dd",
  );
  const monthEndString = format(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0),
    "yyyy-MM-dd",
  );
  const weekStartString = format(
    startOfWeek(selectedDate, { weekStartsOn: 1 }),
    "yyyy-MM-dd",
  );

  // API Hooks - Fetch data for the entire month to show all days' events
  const { plans, createPlan, deletePlan, markComplete } = usePlans({
    startDate: monthStartString,
    endDate: monthEndString,
  });

  // Get tags for quick plan creation
  const { tags } = useTags();

  // Only fetch weekly progress when weekly tab is active
  const { weeklyProgress: apiWeeklyProgress } = useWeeklyProgress(
    activeTab === "weekly" ? weekStartString : "",
  );

  // Process weekly progress data for chart
  const processedWeeklyProgress = useMemo(() => {
    if (!apiWeeklyProgress?.days || activeTab !== "weekly") {
      // Return default empty data to prevent chart errors
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

  const maxProgress = useMemo(() => {
    return Math.max(...processedWeeklyProgress.map((p) => p.value), 1);
  }, [processedWeeklyProgress]);

  // Calendar calculation functions
  const getCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();
    const calendarDays = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push({ day: null, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      // Check if there are plans for this day
      const dayDate = format(new Date(year, month, day), "yyyy-MM-dd");
      const hasEvent = plans.some(
        (plan) => format(new Date(plan.startTime), "yyyy-MM-dd") === dayDate,
      );
      const isToday = day === selectedDay;

      calendarDays.push({
        day,
        isCurrentMonth: true,
        hasEvent,
        isToday,
      });
    }

    const totalCells = 42;
    while (calendarDays.length < totalCells) {
      calendarDays.push({ day: null, isCurrentMonth: false });
    }

    return calendarDays;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }

      // Adjust selected day if it's beyond the new month's days
      const daysInNewMonth = new Date(
        newDate.getFullYear(),
        newDate.getMonth() + 1,
        0,
      ).getDate();
      if (selectedDay > daysInNewMonth) {
        setSelectedDay(daysInNewMonth);
      }

      return newDate;
    });
  };

  // Get plans for selected day
  const selectedDayPlans = useMemo(() => {
    const dayDate = format(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDay,
      ),
      "yyyy-MM-dd",
    );
    const dayPlans = plans.filter(
      (plan) => format(new Date(plan.startTime), "yyyy-MM-dd") === dayDate,
    );

    // Filter based on completion status
    if (showCompleted) {
      return dayPlans; // Show all plans
    } else {
      return dayPlans.filter((plan) => !plan.isCompleted); // Show only incomplete plans
    }
  }, [plans, selectedDate, selectedDay, showCompleted]);

  // Handle plan creation
  const handleCreatePlan = async (
    planData: CreatePlanRequest,
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
    <div className="max-w-7xl mx-auto" data-oid="cn3l98v">
      {/* Add Plan Modal */}
      <AddPlanModal
        isOpen={showAddPlanModal}
        onClose={() => setShowAddPlanModal(false)}
        onSubmit={handleCreatePlan}
        selectedDate={selectedDate}
        selectedDay={selectedDay}
        data-oid="1:-sg5i"
      />

      {/* Header with tabs */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
        data-oid="0i9p4.j"
      >
        <h1
          className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 md:mb-0"
          data-oid=".t1613e"
        >
          Çalışma Planlarım
        </h1>
        <div
          className="p-1 rounded-full shadow-sm bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/20 dark:border-gray-700/30"
          data-oid=".kcb1l4"
        >
          <div className="flex space-x-1" data-oid="1p6a_5o">
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                activeTab === "daily"
                  ? "text-white shadow-lg bg-orange-600 dark:bg-orange-500"
                  : "text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30"
              }`}
              data-oid=":_x9pn4"
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
              data-oid="hxf1e5x"
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
              data-oid="v4vl8mw"
            >
              Aylık
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6" data-oid="m0:prje">
        {/* Calendar Section */}
        <div className="xl:col-span-3" data-oid="ucc2t95">
          <div
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6"
            data-oid="4w5ui8k"
          >
            <div
              className="flex justify-between items-center mb-6"
              data-oid="evn867n"
            >
              <button
                onClick={() => navigateMonth("prev")}
                className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-full transition-colors"
                data-oid="g:g-s4d"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  data-oid="nc2u_45"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                    data-oid="1soilb5"
                  />
                </svg>
              </button>
              <h2
                className="text-xl font-semibold text-gray-700 dark:text-gray-200"
                data-oid="wn24tgu"
              >
                {selectedDate.toLocaleDateString("tr-TR", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button
                onClick={() => navigateMonth("next")}
                className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-full transition-colors"
                data-oid="7d6l1g5"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  data-oid="g.4lup-"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                    data-oid="03arbbk"
                  />
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4" data-oid="n4o.1ha">
              {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
                <div
                  key={day}
                  className="text-center text-gray-500 dark:text-gray-400 font-medium py-2 text-sm"
                  data-oid="vvuicwl"
                >
                  {day}
                </div>
              ))}

              {getCalendarDays().map((day, index) => {
                const { day: dayNum, isCurrentMonth, hasEvent, isToday } = day;

                return (
                  <div
                    key={index}
                    onClick={() =>
                      isCurrentMonth && dayNum && setSelectedDay(dayNum)
                    }
                    className={`h-12 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 text-sm relative ${
                      isCurrentMonth
                        ? "hover:bg-orange-50 dark:hover:bg-orange-900/30 text-gray-700 dark:text-gray-200"
                        : "text-gray-300 dark:text-gray-600"
                    } ${
                      isToday
                        ? "bg-orange-500 dark:bg-orange-600 text-white font-bold shadow-lg"
                        : ""
                    }`}
                    data-oid="ab9:oq7"
                  >
                    {dayNum && (
                      <>
                        <span className="font-medium" data-oid="8ng367.">
                          {dayNum}
                        </span>
                        {hasEvent && !isToday && (
                          <div
                            className="w-1.5 h-1.5 bg-orange-500 dark:bg-orange-400 rounded-full absolute bottom-1"
                            data-oid=":rr-3zv"
                          ></div>
                        )}
                        {hasEvent && isToday && (
                          <div
                            className="w-1.5 h-1.5 bg-white rounded-full absolute bottom-1"
                            data-oid="c:hry_1"
                          ></div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6" data-oid="s:bk853">
          {/* Quick Plan Templates */}
          <div
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-3"
            data-oid="hj:6mho"
          >
            <div
              className="flex justify-between items-center mb-3"
              data-oid="eu2xzk5"
            >
              <h3
                className="font-semibold text-gray-800 dark:text-gray-100 text-sm"
                data-oid="mhigle5"
              >
                Hızlı Plan Oluştur
              </h3>
              <span
                className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full font-medium"
                data-oid="93k9-zf"
              >
                Yeni
              </span>
            </div>

            {/* Popular Templates */}
            <div className="space-y-2 mb-3" data-oid="k-lg224">
              <h4
                className="text-xs font-medium text-gray-600 dark:text-gray-400"
                data-oid="9rofx5v"
              >
                🔥 Popüler Şablonlar
              </h4>
              {[
                {
                  name: "🍅 Pomodoro",
                  duration: 25,
                  color: "#EF4444",
                },
                {
                  name: "📚 Derin Çalışma",
                  duration: 120,
                  color: "#3B82F6",
                },
                {
                  name: "⚡ Hızlı Review",
                  duration: 30,
                  color: "#F59E0B",
                },
                {
                  name: "🏃 Egzersiz",
                  duration: 60,
                  color: "#10B981",
                },
              ].map((template, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setShowAddPlanModal(true);
                    // Pre-fill the modal with template data
                    setTimeout(() => {
                      const modal = document.querySelector('[role="dialog"]');
                      if (modal) {
                        const titleInput = modal.querySelector(
                          'input[placeholder*="Örn"]',
                        ) as HTMLInputElement;
                        const durationInput = modal.querySelector(
                          'input[type="number"]',
                        ) as HTMLInputElement;

                        if (titleInput) titleInput.value = template.name;
                        if (durationInput)
                          durationInput.value = template.duration.toString();

                        // Trigger change events
                        titleInput?.dispatchEvent(
                          new Event("input", { bubbles: true }),
                        );
                        durationInput?.dispatchEvent(
                          new Event("input", { bubbles: true }),
                        );
                      }
                    }, 100);
                  }}
                  className="w-full p-2 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600 text-left"
                  data-oid="8m:zxad"
                >
                  <div
                    className="flex items-center justify-between"
                    data-oid="_ddsibp"
                  >
                    <span
                      className="font-medium text-gray-800 dark:text-gray-100 text-xs"
                      data-oid="rsy4srw"
                    >
                      {template.name}
                    </span>
                    <div
                      className="flex items-center space-x-1"
                      data-oid="n_5tw__"
                    >
                      <span
                        className="text-xs text-gray-500 dark:text-gray-400"
                        data-oid="bb_oef1"
                      >
                        {template.duration}dk
                      </span>
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: template.color }}
                        data-oid="cy3a7sz"
                      ></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Tag-based Quick Plans */}
            {tags && tags.length > 0 && (
              <div
                className="border-t border-gray-200 dark:border-gray-600 pt-3"
                data-oid="xnmgtft"
              >
                <h4
                  className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2"
                  data-oid="0uv9:qf"
                >
                  🏷️ Etiketlerden Hızlı Plan
                </h4>
                <div className="grid grid-cols-2 gap-1" data-oid="rw4lwv-">
                  {tags.slice(0, 4).map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => {
                        setShowAddPlanModal(true);
                        // Pre-fill with tag
                        setTimeout(() => {
                          const modal =
                            document.querySelector('[role="dialog"]');
                          if (modal) {
                            const titleInput = modal.querySelector(
                              'input[placeholder*="Örn"]',
                            ) as HTMLInputElement;
                            const tagSelect = modal.querySelector(
                              "select",
                            ) as HTMLSelectElement;

                            if (titleInput)
                              titleInput.value = `${tag.name} Çalışması`;
                            if (tagSelect) tagSelect.value = tag.id.toString();

                            titleInput?.dispatchEvent(
                              new Event("input", { bubbles: true }),
                            );
                            tagSelect?.dispatchEvent(
                              new Event("change", { bubbles: true }),
                            );
                          }
                        }, 100);
                      }}
                      className="p-1.5 rounded text-xs font-medium text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
                      style={{ backgroundColor: tag.color }}
                      data-oid="1opzrr7"
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
                {tags.length > 4 && (
                  <p
                    className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center"
                    data-oid="r0577pz"
                  >
                    +{tags.length - 4} etiket daha
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Weekly Progress */}
          <div
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-4"
            data-oid="-puqoxs"
          >
            <h3
              className="font-semibold text-gray-800 dark:text-gray-100 mb-4"
              data-oid="egkc:m5"
            >
              Haftalık İlerleme
            </h3>
            <div
              className="flex items-end justify-between h-32 mb-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2"
              data-oid="::ix4.f"
            >
              {processedWeeklyProgress.map((day) => (
                <div
                  key={day.day}
                  className="flex flex-col items-center flex-1"
                  data-oid="4j5o_yk"
                >
                  <div
                    className="w-6 bg-gradient-to-t from-orange-500 to-orange-400 dark:from-orange-600 dark:to-orange-500 rounded-t transition-all duration-300 hover:from-orange-600 hover:to-orange-500 dark:hover:from-orange-500 dark:hover:to-orange-400 shadow-sm"
                    style={{
                      height: `${(day.value / maxProgress) * 100}px`,
                      minHeight: "8px",
                    }}
                    data-oid="s48t1:r"
                  ></div>
                  <span
                    className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium"
                    data-oid="d2uej3w"
                  >
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2"
              data-oid="u3gwelw"
            >
              <span data-oid="3d6lny0">0</span>
              <span data-oid="_._e0jx">30</span>
              <span data-oid="z0gzbk9">60</span>
              <span data-oid="cfp37u8">90</span>
              <span data-oid="m6a3hv0">120</span>
              <span data-oid="6ozru8e">150</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Plans */}
      <div
        className="mt-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6"
        data-oid="fl6dwfw"
      >
        <div
          className="flex justify-between items-center mb-4"
          data-oid="nc9ugd4"
        >
          <div className="flex items-center space-x-4" data-oid="oaq:fv3">
            <h3
              className="text-lg font-semibold text-gray-800 dark:text-gray-100"
              data-oid="fclbica"
            >
              {format(
                new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  selectedDay,
                ),
                "d MMMM yyyy",
                { locale: tr },
              )}{" "}
              Planları
            </h3>

            {/* Plan count info */}
            <div
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
              data-oid="lr80uht"
            >
              <span data-oid="h0l3kyc">
                (
                {
                  plans.filter((p) => {
                    const dayDate = format(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth(),
                        selectedDay,
                      ),
                      "yyyy-MM-dd",
                    );
                    return (
                      format(new Date(p.startTime), "yyyy-MM-dd") === dayDate
                    );
                  }).length
                }{" "}
                toplam,{" "}
                {
                  plans.filter((p) => {
                    const dayDate = format(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth(),
                        selectedDay,
                      ),
                      "yyyy-MM-dd",
                    );
                    return (
                      format(new Date(p.startTime), "yyyy-MM-dd") === dayDate &&
                      p.isCompleted
                    );
                  }).length
                }{" "}
                tamamlandı)
              </span>
            </div>

            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                showCompleted
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              data-oid="o93.rzj"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="q7u1dxs"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                  data-oid="yc:wn-i"
                />
              </svg>
              <span data-oid="_8908gp">
                {showCompleted
                  ? "Tamamlananları Gizle"
                  : "Tamamlananları Göster"}
              </span>
            </button>
          </div>
          <button
            onClick={() => setShowAddPlanModal(true)}
            className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-500 dark:to-orange-600 hover:from-orange-700 hover:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 transition-all duration-300 hover:shadow-lg text-sm transform hover:scale-105"
            data-oid="hj7-zvm"
          >
            + Yeni Plan Ekle
          </button>
        </div>

        <div className="space-y-3" data-oid="oewk995">
          {selectedDayPlans.length === 0 ? (
            <div
              className="text-center py-8 text-gray-500 dark:text-gray-400"
              data-oid="6leb5e9"
            >
              <p data-oid="etahrpn">
                {showCompleted
                  ? "Bu gün için henüz plan eklenmemiş."
                  : "Bu gün için tamamlanmamış plan yok."}
              </p>
            </div>
          ) : (
            selectedDayPlans.map((plan) => (
              <div
                key={plan.id}
                className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                  plan.isCompleted
                    ? "bg-green-50/80 dark:bg-green-900/20 border-gray-200 dark:border-gray-600 hover:bg-green-100/80 dark:hover:bg-green-900/30 border-l-green-400 dark:border-l-green-500 opacity-90"
                    : plan.isOverdue
                      ? "bg-red-50/80 dark:bg-red-900/20 border-gray-200 dark:border-gray-600 hover:bg-red-100/80 dark:hover:bg-red-900/30 border-l-red-400 dark:border-l-red-500"
                      : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/70 border-l-orange-500 dark:border-l-orange-400"
                }`}
                data-oid="y:tkjkq"
              >
                <div
                  className="flex justify-between items-start"
                  data-oid=".m2h0sb"
                >
                  <div className="flex-1" data-oid="aic9_xk">
                    <div className="flex items-center mb-2" data-oid="hvp_pnq">
                      <span
                        className={`font-bold mr-4 px-2 py-1 rounded text-sm ${
                          plan.isCompleted
                            ? "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-800/50"
                            : plan.isOverdue
                              ? "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800/50"
                              : "text-gray-800 dark:text-gray-100 bg-orange-100 dark:bg-orange-900/30"
                        }`}
                        data-oid="-w9x8c0"
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
                        data-oid="7mixeeo"
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
                        data-oid="ks-_yv7"
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
                      data-oid="c__:xm2"
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
                      data-oid="4xs3e8h"
                    >
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="3hnhnwg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          data-oid="qlzdou3"
                        />
                      </svg>
                      <span data-oid="ie0p_bs">{plan.duration} dakika</span>
                      {plan.isCompleted && (
                        <>
                          <span className="mx-2" data-oid="bjimvf9">
                            •
                          </span>
                          <span
                            className="text-green-600 dark:text-green-400 font-medium"
                            data-oid="2z6e-81"
                          >
                            ✓ Tamamlandı
                          </span>
                        </>
                      )}
                      {plan.isOverdue && !plan.isCompleted && (
                        <>
                          <span className="mx-2" data-oid="tz258yg">
                            •
                          </span>
                          <span
                            className="text-red-600 dark:text-red-400 font-medium"
                            data-oid="s72t82x"
                          >
                            ⚠️ Süresi Geçmiş
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4" data-oid="n3fqgrw">
                    {!plan.isCompleted && (
                      <button
                        onClick={() => markComplete(plan.id, true)}
                        className="text-gray-400 hover:text-green-500 transition-colors p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/30"
                        title="Tamamla"
                        data-oid="9e1u4an"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          data-oid="ndp1f79"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                            data-oid="m-.r0:r"
                          />
                        </svg>
                      </button>
                    )}
                    {plan.isCompleted && (
                      <div
                        className="text-green-500 p-1 rounded bg-green-50 dark:bg-green-900/30 cursor-not-allowed"
                        title="Tamamlanan planlar tekrar açılamaz"
                        data-oid="s9yy7kq"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          data-oid="_20eelm"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                            data-oid="qj_d95w"
                          />
                        </svg>
                      </div>
                    )}
                    <button
                      onClick={() => deletePlan(plan.id)}
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
                      data-oid="l._6csq"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="i9a5bl."
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          data-oid="6v345ag"
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
    </div>
  );
}
