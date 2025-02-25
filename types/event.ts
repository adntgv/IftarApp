/**
 * Common types for the Iftar App
 */

// Attendee type definition
export type Attendee = {
  id: number;
  name: string;
  status: string;
};

// Base event type with common properties
export type BaseEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  host: string;
  description: string;
  isPublic: boolean;
  shareCode: string;
};

// Event type with attendees
export type Event = BaseEvent & {
  attendees: Attendee[];
};

// Invite type with status
export type Invite = BaseEvent & {
  status: string;
  attendees?: Attendee[];
};

// Union type for any event-like object
export type EventLike = Event | Invite; 