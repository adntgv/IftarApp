import { FC } from 'react';
import { EventLike } from '@/types/event';

// Declaration for the EventDetails component
declare const EventDetails: FC<{
  event: EventLike | null;
  isOpen?: boolean;
  isVisible?: boolean;
  onClose: () => void;
  onShare: () => void;
  onInvite: (email: string) => void;
  onRespond: (id: string, status: string) => void;
}>;

export default EventDetails; 