"use client";

import { format } from "date-fns";
import { Plan } from "@/types/plan";

interface CalendarDay {
  day: number | null;
  isCurrentMonth: boolean;
  hasEvent?: boolean;
  isToday?: boolean;
}

interface PlanCalendarProps {
  selectedDate: Date;
  selectedDay: number;
  plans: Plan[];
  onDateNavigation: (direction: "prev" | "next") => void;
  onDaySelect: (day: number) => void;
}

export default function PlanCalendar({
  selectedDate,
  selectedDay,
  plans,
  onDateNavigation,
  onDaySelect,
}: PlanCalendarProps) {
  const getCalendarDays = (): CalendarDay[] => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();
    const calendarDays: CalendarDay[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push({ day: null, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = format(new Date(year, month, day), "yyyy-MM-dd");
      const hasEvent = plans.some(
        (plan) => format(new Date(plan.startTime), "yyyy-MM-dd") === dayDate
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

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => onDateNavigation("prev")}
          className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-full transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          {selectedDate.toLocaleDateString("tr-TR", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={() => onDateNavigation("next")}
          className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-full transition-colors"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
          <div
            key={day}
            className="text-center text-gray-500 dark:text-gray-400 font-medium py-2 text-sm"
          >
            {day}
          </div>
        ))}

        {getCalendarDays().map((day, index) => {
          const { day: dayNum, isCurrentMonth, hasEvent, isToday } = day;

          return (
            <div
              key={index}
              onClick={() => isCurrentMonth && dayNum && onDaySelect(dayNum)}
              className={`h-12 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 text-sm relative ${
                isCurrentMonth
                  ? "hover:bg-orange-50 dark:hover:bg-orange-900/30 text-gray-700 dark:text-gray-200"
                  : "text-gray-300 dark:text-gray-600"
              } ${
                isToday
                  ? "bg-orange-500 dark:bg-orange-600 text-white font-bold shadow-lg"
                  : ""
              }`}
            >
              {dayNum && (
                <>
                  <span className="font-medium">{dayNum}</span>
                  {hasEvent && !isToday && (
                    <div className="w-1.5 h-1.5 bg-orange-500 dark:bg-orange-400 rounded-full absolute bottom-1"></div>
                  )}
                  {hasEvent && isToday && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full absolute bottom-1"></div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
