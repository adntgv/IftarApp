import { create } from 'zustand';
import eventService from '../utils/eventService';
import useAuthStore from './useAuth';

// Create events store
const useEventsStore = create((set, get) => ({
  events: [],
  invitations: [],
  selectedEvent: null,
  isLoading: false,
  error: null,
  isCreating: false,
  viewMode: 'card',
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

  // Toggle view mode between card and list
  toggleViewMode: () => {
    const newMode = get().viewMode === 'card' ? 'list' : 'card';
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
    if (!user) return;

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
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch user invitations
  fetchUserInvitations: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      const invitations = await eventService.getUserInvitations(user.userId);
      set({ invitations, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
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
      selectedEvent: null,
      isLoading: false,
      error: null,
      isCreating: false
    });
  }
}));

export default useEventsStore;
