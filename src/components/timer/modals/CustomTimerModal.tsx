"use client";

import { useState, useEffect } from "react";

interface CustomTimerModalProps {
  isOpen: boolean;
  initialDuration: number;
  onClose: () => void;
  onSave: (duration: number) => void;
}

export default function CustomTimerModal({
  isOpen,
  initialDuration,
  onClose,
  onSave,
}: CustomTimerModalProps) {
  const [customWorkDurationInput, setCustomWorkDurationInput] =
    useState<string>(initialDuration.toString());

  // Reset input when modal opens or initialDuration changes
  useEffect(() => {
    setCustomWorkDurationInput(initialDuration.toString());
  }, [initialDuration, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Özel Zamanlayıcı Ayarla
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Kendi çalışma sürenizi belirleyin
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Çalışma Süresi (dakika)
            </label>
            <div className="relative">
              <input
                type="number"
                value={customWorkDurationInput}
                onChange={(e) => setCustomWorkDurationInput(e.target.value)}
                min="1"
                max="180"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="25"
              />

              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">
                dk
              </div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Min: 1 dk
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Max: 180 dk (3 saat)
              </span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Hızlı Seçenekler
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 25, 45, 60].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setCustomWorkDurationInput(preset.toString())}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    customWorkDurationInput === preset.toString()
                      ? "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-2 border-orange-300 dark:border-orange-600"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  {preset}dk
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Önizleme
              </div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {(Number(customWorkDurationInput) || 0)
                  .toString()
                  .padStart(2, "0")}
                :00
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {customWorkDurationInput || 0} dakikalık çalışma süresi
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={() => onSave(Number(customWorkDurationInput))}
            disabled={
              !customWorkDurationInput ||
              isNaN(Number(customWorkDurationInput)) ||
              Number(customWorkDurationInput) < 1 ||
              Number(customWorkDurationInput) > 180
            }
            className="flex-1 px-6 py-3 text-white rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ backgroundColor: "#F96943" }}
          >
            Ayarla
          </button>
        </div>
      </div>
    </div>
  );
}
