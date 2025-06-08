"use client";

interface WeeklyProgressData {
  day: string;
  value: number;
}

interface WeeklyProgressProps {
  weeklyProgress: WeeklyProgressData[];
}

export default function WeeklyProgress({
  weeklyProgress,
}: WeeklyProgressProps) {
  const maxProgress = Math.max(...weeklyProgress.map((p) => p.value), 1);

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-4">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Haftalık İlerleme
      </h3>
      <div className="flex items-end justify-between h-32 mb-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
        {weeklyProgress.map((day) => (
          <div key={day.day} className="flex flex-col items-center flex-1">
            <div
              className="w-6 bg-gradient-to-t from-orange-500 to-orange-400 dark:from-orange-600 dark:to-orange-500 rounded-t transition-all duration-300 hover:from-orange-600 hover:to-orange-500 dark:hover:from-orange-500 dark:hover:to-orange-400 shadow-sm"
              style={{
                height: `${(day.value / maxProgress) * 100}px`,
                minHeight: "8px",
              }}
            ></div>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
              {day.day}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2">
        <span>0</span>
        <span>30</span>
        <span>60</span>
        <span>90</span>
        <span>120</span>
        <span>150</span>
      </div>
    </div>
  );
}
