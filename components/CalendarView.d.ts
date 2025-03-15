import { FC } from 'react';
import { EventLike } from '@/types/event';

// Declaration for the CalendarView component
declare const CalendarView: FC<{
  events: EventLike[];
  onOpenEvent: (event: EventLike) => void;
  onRespond: (id: string, status: string) => void;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  isLoggedIn: boolean;
}>;

export default CalendarView; 