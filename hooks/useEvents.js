import { create } from 'zustand';
import eventService from '../utils/eventService';
import useAuthStore from './useAuth';

// Create events store
const useEventsStore = create((set, get) => ({
  events: [],
  invitations: [],
  publicEvents: [],
  attendingEvents: [],
  selectedEvent: null,
  isLoading: false,
  error: null,
  isCreating: false,
  viewMode: 'list',
  animation: '',

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),

  // Set animation
  setAnimation: (animation) => {
    set({ animation });
    // Reset animation after a short delay
    if (animation) {
      setTimeout(() => {
        set({ animation: '' });
      }, 500);
    }
  },

  // Toggle view mode between list and calendar
  toggleViewMode: () => {
    const currentMode = get().viewMode;
    const newMode = currentMode === 'list' ? 'calendar' : 'list';
    set({ viewMode: newMode });
    get().setAnimation('toggle');
  },

  // Set selected event
  setSelectedEvent: (event) => {
    set({ selectedEvent: event });
    if (event) {
      get().setAnimation('open');
    }
  },

  // Set creating state
  setIsCreating: (isCreating) => set({ isCreating }),

  // Fetch user events (events you host)
  fetchUserEvents: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      console.log('No user found');
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const events = await eventService.getUserEvents(user.userId);
      
      // For each event, fetch the attendees
      const eventsWithAttendees = await Promise.all(
        events.map(async (event) => {
          const attendees = await eventService.getEventAttendees(event.$id);
          return {
            ...event,
            attendees
          };
        })
      );
      
      set({ events: eventsWithAttendees, isLoading: false });
      
      return eventsWithAttendees;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  // Fetch all public events
  fetchPublicEvents: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      console.log('No user found');
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const allPublicEvents = await eventService.getPublicEvents();
      
      // Filter out user's own events
      const filteredPublicEvents = allPublicEvents.filter(
        event => event.hostId !== user.userId
      );
      
      // For each event, fetch the attendees
      const publicEventsWithAttendees = await Promise.all(
        filteredPublicEvents.map(async (event) => {
          const attendees = await eventService.getEventAttendees(event.$id);
          return {
            ...event,
            attendees,
            isPublic: true,
            isOtherUserEvent: true
          };
        })
      );
      
      set({ publicEvents: publicEventsWithAttendees, isLoading: false });
      
      return publicEventsWithAttendees;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },
  
  // Fetch events the user is attending
  fetchAttendingEvents: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      console.log('No user found');
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const attending = await eventService.getAttendingEvents(user.userId);
      
      // Filter out user's own events
      const filteredAttendingEvents = attending.filter(
        event => event.hostId !== user.userId
      );
      
      // For each event, fetch the attendees
      const attendingEventsWithAttendees = await Promise.all(
        filteredAttendingEvents.map(async (event) => {
          const attendees = await eventService.getEventAttendees(event.$id);
          return {
            ...event,
            attendees,
            isAttending: true,
            isOtherUserEvent: true
          };
        })
      );
      
      set({ attendingEvents: attendingEventsWithAttendees, isLoading: false });
      
      return attendingEventsWithAttendees;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  // Fetch user invitations
  fetchUserInvitations: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      console.log('No user found');
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const invitations = await eventService.getUserInvitations(user.userId);
      set({ invitations, isLoading: false });
      
      return invitations;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  // Create a new event
  createEvent: async (eventData) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      const newEvent = await eventService.createEvent(
        eventData,
        user.userId,
        user.name
      );
      
      // Refresh the user events
      await get().fetchUserEvents();
      
      set({ isLoading: false, isCreating: false });
      get().setAnimation('create');
      return newEvent;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Respond to an invitation
  respondToInvitation: async (invitation, status) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      await eventService.respondToInvitation(
        invitation.$id,
        status,
        user.userId,
        user.name,
        invitation.eventId,
        invitation.event.hostId
      );
      
      // Update local state
      set((state) => ({
        invitations: state.invitations.map(inv => 
          inv.$id === invitation.$id ? { ...inv, status } : inv
        ),
        isLoading: false
      }));
      
      get().setAnimation('respond');
      await get().fetchUserInvitations();
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update attendance status for any event (not just invitations)
  updateAttendanceStatus: async (eventId, status) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      // If status is 'not-attending', check if there's a record to delete
      if (status === 'not-attending') {
        const currentStatus = await eventService.getUserAttendanceStatus(eventId, user.userId);
        // If user was already not attending, no action needed
        if (currentStatus === 'not-attending') {
          set({ isLoading: false });
          return true;
        }
      }

      // Get the event to get the host ID
      const event = await eventService.getEventById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Update attendance status in Appwrite
      await eventService.addAttendee(
        eventId,
        user.userId,
        user.name,
        status,
        event.hostId
      );
      
      // Immediately update local state for a better UI experience
      set(state => {
        // First, find the event in each category and update its attendance status
        const updateEventInArray = (events) => {
          return events.map(evt => 
            evt.$id === eventId ? { ...evt, attendanceStatus: status } : evt
          );
        };
        
        // Update all events arrays
        const updatedEvents = updateEventInArray(state.events);
        const updatedPublicEvents = updateEventInArray(state.publicEvents);
        const updatedAttendingEvents = updateEventInArray(state.attendingEvents);
        
        // If attending status changed to 'confirmed', add to attending events if not there
        const shouldBeInAttending = status === 'confirmed';
        
        // If it should be in attending but isn't, add it (after ensuring we have the event)
        let finalAttendingEvents = updatedAttendingEvents;
        if (shouldBeInAttending && !finalAttendingEvents.some(e => e.$id === eventId)) {
          const eventToAdd = [...updatedEvents, ...updatedPublicEvents].find(e => e.$id === eventId);
          if (eventToAdd) {
            finalAttendingEvents = [...finalAttendingEvents, {...eventToAdd, attendanceStatus: 'confirmed', isAttending: true}];
          }
        }
        
        // If it shouldn't be in attending but is, remove it
        if (!shouldBeInAttending) {
          finalAttendingEvents = finalAttendingEvents.filter(e => e.$id !== eventId);
        }
        
        return {
          events: updatedEvents,
          publicEvents: updatedPublicEvents,
          attendingEvents: finalAttendingEvents,
          isLoading: false
        };
      });
      
      // Still do a fetch to ensure our data is synced with the server
      // but do it in the background
      Promise.all([
        get().fetchUserEvents(),
        get().fetchAttendingEvents()
      ]).catch(error => {
        console.error('Background fetch error:', error);
      });
      
      get().setAnimation('respond');
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Invite a user to an event
  inviteToEvent: async (eventId, email) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      await eventService.createInvitation(
        eventId,
        user.userId,
        email
      );
      
      set({ isLoading: false });
      get().setAnimation('invite');
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Get event by share code
  getEventByShareCode: async (shareCode) => {
    set({ isLoading: true, error: null });
    try {
      const event = await eventService.getEventByShareCode(shareCode);
      
      // Get attendees
      if (event) {
        const attendees = await eventService.getEventAttendees(event.$id);
        event.attendees = attendees;
      }
      
      set({ isLoading: false });
      return event;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // Delete an event
  deleteEvent: async (eventId) => {
    set({ isLoading: true, error: null });
    try {
      await eventService.deleteEvent(eventId);
      
      // Update local state
      set(state => ({
        events: state.events.filter(event => event.$id !== eventId),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update an event
  updateEvent: async (eventId, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedEvent = await eventService.updateEvent(eventId, updateData);
      
      // Update local state
      set(state => ({
        events: state.events.map(event => 
          event.$id === eventId ? { ...event, ...updatedEvent } : event
        ),
        selectedEvent: state.selectedEvent && state.selectedEvent.$id === eventId 
          ? { ...state.selectedEvent, ...updatedEvent }
          : state.selectedEvent,
        isLoading: false
      }));
      
      return updatedEvent;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Reset store state
  resetStore: () => {
    set({
      events: [],
      invitations: [],
      publicEvents: [],
      attendingEvents: [],
      selectedEvent: null,
      isLoading: false,
      error: null,
      isCreating: false
    });
  },

  // Combine all events for display
  getAllEvents: () => {
    const { user } = useAuthStore.getState();
    if (!user) return [];
    
    // Start with user's own events
    const allEvents = [...get().events];
    
    // Add public events that aren't already in the list
    if (get().publicEvents && get().publicEvents.length > 0) {
      get().publicEvents.forEach((pubEvent) => {
        if (!allEvents.some(e => e.$id === pubEvent.$id)) {
          allEvents.push(pubEvent);
        }
      });
    }
    
    // Add attending events that aren't already in the list
    if (get().attendingEvents && get().attendingEvents.length > 0) {
      get().attendingEvents.forEach((attEvent) => {
        if (!allEvents.some(e => e.$id === attEvent.$id)) {
          allEvents.push(attEvent);
        } else {
          // If the event exists, make sure we use the attending version
          // which has the most accurate attendance status
          const index = allEvents.findIndex(e => e.$id === attEvent.$id);
          if (index !== -1) {
            allEvents[index] = attEvent;
          }
        }
      });
    }
    
    // Find the user's attendance status for each event
    // This is already done for 'attending' events, but not for others
    return allEvents.map(event => {
      // If this is an event with attendance info already set, use that
      if (event.attendanceStatus) {
        return event;
      }
      
      // If the user is the host, mark it as their own event
      if (event.hostId === user.userId) {
        return { 
          ...event, 
          attendanceStatus: 'confirmed',
          isOwnEvent: true,  // Add flag to indicate this is the user's own event
        };
      }
      
      // If this is an event with attendance info, use that
      if (event.isAttending) {
        return { ...event, attendanceStatus: 'confirmed' };
      }
      
      // Check the attendees list to see if the user is in it and what their status is
      if (event.attendees && Array.isArray(event.attendees)) {
        const userAttendance = event.attendees.find(att => att.userId === user.userId);
        if (userAttendance) {
          return { ...event, attendanceStatus: userAttendance.status };
        }
      }
      
      // Default to not attending
      return { ...event, attendanceStatus: 'not-attending' };
    });
  }
}));

export default useEventsStore;
