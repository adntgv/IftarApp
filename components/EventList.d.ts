import { FC } from 'react';
import { EventLike } from '@/types/event';

// Declaration for the EventList component
declare const EventList: FC<{
  events: EventLike[];
  isInvites?: boolean;
  viewMode?: string;
  onOpenEvent: (event: EventLike) => void;
  onRespond: (id: string, status: string) => void;
  animation?: string;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  emptyMessage?: string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}>;

export default EventList; 