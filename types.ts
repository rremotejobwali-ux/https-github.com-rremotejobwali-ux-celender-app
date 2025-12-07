export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO String
  end: string;   // ISO String
  description?: string;
  color: EventColor;
}

export enum EventColor {
  Blue = 'bg-blue-100 text-blue-700 border-blue-200',
  Red = 'bg-red-100 text-red-700 border-red-200',
  Green = 'bg-green-100 text-green-700 border-green-200',
  Purple = 'bg-purple-100 text-purple-700 border-purple-200',
  Orange = 'bg-orange-100 text-orange-700 border-orange-200',
  Gray = 'bg-gray-100 text-gray-700 border-gray-200',
}

export interface DateCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}
