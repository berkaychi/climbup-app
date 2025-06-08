import { useState } from "react";

export function usePlanCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

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
        0
      ).getDate();
      if (selectedDay > daysInNewMonth) {
        setSelectedDay(daysInNewMonth);
      }

      return newDate;
    });
  };

  return {
    selectedDate,
    selectedDay,
    setSelectedDay,
    navigateMonth,
  };
}
