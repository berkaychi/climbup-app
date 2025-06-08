"use client";

import { useState, useEffect } from "react";
import { useTags } from "@/hooks/useTags";
import { format } from "date-fns";
import { CreatePlanRequest } from "@/types/plan";

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planData: CreatePlanRequest) => Promise<void>;
  selectedDate: Date;
  selectedDay: number;
}

export default function AddPlanModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
  selectedDay,
}: AddPlanModalProps) {
  const { tags } = useTags();

  // Calculate default date (the day user clicked on)
  const defaultDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDay
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
        selectedDay
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
          startDateTime.getTime() + formData.duration * 60000
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        role="dialog"
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Yeni Plan Ekle
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="w-6 h-6"
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Başlangıç saati
                </span>
                <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full font-medium">
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
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.hasStartTime ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {formData.hasStartTime && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
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
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                  📅 Planlı çalışma için daha etkili
                </p>
              </div>
            )}
            {!formData.hasStartTime && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                Saat belirtmezseniz varsayılan olarak 09:00&apos;da başlayacak
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hedef çalışma süresi
                </span>
                <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-medium">
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
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.hasDuration ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {formData.hasDuration && (
              <div>
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
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
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    dakika
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>⚡ Odaklanma süresi</span>
                  <span>
                    {Math.floor(formData.duration / 60)}s{" "}
                    {formData.duration % 60}dk
                  </span>
                </div>
              </div>
            )}
            {!formData.hasDuration && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                Süre hedefi motivasyonunuzu artırır ve ilerlemenizi takip
                etmenizi sağlar
              </p>
            )}
          </div>

          {tags && tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Etiket
              </label>
              <select
                value={formData.tagId}
                onChange={(e) =>
                  setFormData({ ...formData, tagId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Etiket seçiniz</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id.toString()}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Renk
            </label>
            <div className="flex space-x-2">
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
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Ekleniyor..." : "Plan Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
