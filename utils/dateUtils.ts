import { DateCell } from "../types";

export const getDaysInMonth = (date: Date): DateCell[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days: DateCell[] = [];
  
  // Padding for previous month
  const startPad = firstDay.getDay(); // 0 is Sunday
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, isCurrentMonth: false, isToday: isSameDay(d, new Date()) });
  }
  
  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    days.push({ date: d, isCurrentMonth: true, isToday: isSameDay(d, new Date()) });
  }
  
  // Padding for next month to complete the grid (up to 42 cells typically)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    days.push({ date: d, isCurrentMonth: false, isToday: isSameDay(d, new Date()) });
  }
  
  return days;
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const formatTime = (isoString: string): string => {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDateForInput = (d: Date): string => {
  // Returns YYYY-MM-DDTHH:mm
  const offset = d.getTimezoneOffset() * 60000;
  const localIso = new Date(d.getTime() - offset).toISOString().slice(0, 16);
  return localIso;
};
