import { FC } from 'react';
import { EventLike } from '@/types/event';

// Declaration for the CalendarView component
declare const CalendarView: FC<{
  events: EventLike[];
}>;

export default CalendarView; 