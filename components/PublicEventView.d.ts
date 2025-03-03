import { FC } from 'react';
import { Event } from '@/types/event';

// Declaration for the PublicEventView component
declare const PublicEventView: FC<{
  event: Event | null;
  isOpen: boolean;
  isVisible: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onRespond: (id: string, status: string) => void;
}>;

export default PublicEventView; 