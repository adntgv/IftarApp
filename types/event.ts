/**
 * Common types for the Iftar App
 */

// Attendee type definition
export type Attendee = {
  $id: string;
  userId: string;
  name: string;
  status: string;
  eventId: string;
  eventHostId: string;
  createdAt: string;
};

// Base event type with common properties
export type BaseEvent = {
  $id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  hostId: string;
  hostName: string;
  description: string;
  isPublic: boolean;
  shareCode: string;
  createdAt: string;
};

// Event type with attendees
export type Event = BaseEvent & {
  attendees: Attendee[];
};

// Invitation type 
export type Invitation = {
  $id: string;
  eventId: string;
  inviterId: string;
  inviteeId: string;
  inviteeEmail: string;
  status: string;
  createdAt: string;
  event?: BaseEvent;
};

// Union type for any event-like object
export type EventLike = Event | Invitation; 