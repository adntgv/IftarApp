import { databases, ID, Query } from './appwrite';
import { 
  EVENTS_COLLECTION_ID, 
  ATTENDEES_COLLECTION_ID, 
  INVITATIONS_COLLECTION_ID 
} from './appwrite';
import ENV from './env';
import { format } from 'date-fns';

// Helper function to generate a share code
const generateShareCode = (title) => {
  const baseCode = title.toLowerCase().replace(/\s+/g, '-');
  const randomString = Math.random().toString(36).substring(2, 7);
  return `${baseCode}-${randomString}`;
};

/**
 * Create a new event
 */
export const createEvent = async (eventData, userId, userName) => {
  try {
    const shareCode = generateShareCode(eventData.title);
    
    const event = await databases.createDocument(
      ENV.DATABASE_ID,
      EVENTS_COLLECTION_ID,
      ID.unique(),
      {
        title: eventData.title,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        description: eventData.description || '',
        isPublic: eventData.isPublic || false,
        hostId: userId,
        hostName: userName,
        shareCode,
        createdAt: new Date().toISOString(),
      }
    );
    
    return event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Get all events hosted by a user
 */
export const getUserEvents = async (userId) => {
  try {
    const response = await databases.listDocuments(
      ENV.DATABASE_ID,
      EVENTS_COLLECTION_ID,
      [Query.equal('hostId', userId)]
    );
    
    return response.documents;
  } catch (error) {
    console.error('Error fetching user events:', error);
    throw error;
  }
};

/**
 * Get all public events
 */
export const getPublicEvents = async () => {
  console.log('getPublicEvents');
  try {
    const response = await databases.listDocuments(
      ENV.DATABASE_ID,
      EVENTS_COLLECTION_ID
    );
    
    return response.documents;
  } catch (error) {
    console.error('Error fetching public events:', error);
    throw error;
  }
};

/**
 * Get events the user is attending
 */
export const getAttendingEvents = async (userId) => {
  try {
    // Get all attendees for this user
    const attendees = await databases.listDocuments(
      ENV.DATABASE_ID,
      ATTENDEES_COLLECTION_ID,
      [
        Query.equal('userId', userId),
        Query.equal('status', 'confirmed')
      ]
    );
    
    // Fetch the event details for each attendance
    const events = await Promise.all(
      attendees.documents.map(async (attendee) => {
        try {
          return await getEventById(attendee.eventId);
        } catch (error) {
          console.error(`Error fetching event ${attendee.eventId}:`, error);
          return null;
        }
      })
    );
    
    // Filter out any null values from events that couldn't be fetched
    return events.filter(event => event !== null);
  } catch (error) {
    console.error('Error fetching attending events:', error);
    throw error;
  }
};

/**
 * Get an event by ID
 */
export const getEventById = async (eventId) => {
  try {
    const event = await databases.getDocument(
      ENV.DATABASE_ID,
      EVENTS_COLLECTION_ID,
      eventId
    );
    
    return event;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};

/**
 * Get an event by share code
 */
export const getEventByShareCode = async (shareCode) => {
  try {
    const response = await databases.listDocuments(
      ENV.DATABASE_ID,
      EVENTS_COLLECTION_ID,
      [Query.equal('shareCode', shareCode)]
    );
    
    if (response.documents.length === 0) {
      throw new Error('Event not found');
    }
    
    return response.documents[0];
  } catch (error) {
    console.error('Error fetching event by share code:', error);
    throw error;
  }
};

/**
 * Update an event
 */
export const updateEvent = async (eventId, updateData) => {
  try {
    const event = await databases.updateDocument(
      ENV.DATABASE_ID,
      EVENTS_COLLECTION_ID,
      eventId,
      updateData
    );
    
    return event;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

/**
 * Delete an event
 */
export const deleteEvent = async (eventId) => {
  try {
    // First, delete all attendees for this event
    const attendees = await databases.listDocuments(
      ENV.DATABASE_ID,
      ATTENDEES_COLLECTION_ID,
      [Query.equal('eventId', eventId)]
    );
    
    for (const attendee of attendees.documents) {
      await databases.deleteDocument(
        ENV.DATABASE_ID,
        ATTENDEES_COLLECTION_ID,
        attendee.$id
      );
    }
    
    // Delete all invitations for this event
    const invitations = await databases.listDocuments(
      ENV.DATABASE_ID,
      INVITATIONS_COLLECTION_ID,
      [Query.equal('eventId', eventId)]
    );
    
    for (const invitation of invitations.documents) {
      await databases.deleteDocument(
        ENV.DATABASE_ID,
        INVITATIONS_COLLECTION_ID,
        invitation.$id
      );
    }
    
    // Finally, delete the event
    await databases.deleteDocument(
      ENV.DATABASE_ID,
      EVENTS_COLLECTION_ID,
      eventId
    );
    
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

/**
 * Get all attendees for an event
 */
export const getEventAttendees = async (eventId) => {
  try {
    const response = await databases.listDocuments(
      ENV.DATABASE_ID,
      ATTENDEES_COLLECTION_ID,
      [Query.equal('eventId', eventId)]
    );
    
    return response.documents;
  } catch (error) {
    console.error('Error fetching event attendees:', error);
    throw error;
  }
};

/**
 * Add an attendee to an event
 */
export const addAttendee = async (eventId, userId, name, status = 'pending', hostId) => {
  try {
    // Check if the user is already an attendee
    const existingAttendees = await databases.listDocuments(
      ENV.DATABASE_ID,
      ATTENDEES_COLLECTION_ID,
      [
        Query.equal('eventId', eventId),
        Query.equal('userId', userId)
      ]
    );
    
    // For 'not-attending' status
    if (status === 'not-attending') {
      // If the user is already an attendee, delete the record
      if (existingAttendees.documents.length > 0) {
        await databases.deleteDocument(
          ENV.DATABASE_ID,
          ATTENDEES_COLLECTION_ID,
          existingAttendees.documents[0].$id
        );
        return { status: 'not-attending' };
      }
      // If they're not an attendee, they're already 'not attending'
      return { status: 'not-attending' };
    }
    
    // If the user is already an attendee, update their status
    if (existingAttendees.documents.length > 0) {
      return await databases.updateDocument(
        ENV.DATABASE_ID,
        ATTENDEES_COLLECTION_ID,
        existingAttendees.documents[0].$id,
        { status }
      );
    }
    
    // Otherwise, add them as a new attendee
    const attendee = await databases.createDocument(
      ENV.DATABASE_ID,
      ATTENDEES_COLLECTION_ID,
      ID.unique(),
      {
        eventId,
        userId,
        name,
        status,
        eventHostId: hostId,
        createdAt: new Date().toISOString(),
      }
    );
    
    return attendee;
  } catch (error) {
    console.error('Error adding attendee:', error);
    throw error;
  }
};

/**
 * Update an attendee's status
 */
export const updateAttendeeStatus = async (eventId, userId, status) => {
  try {
    const existingAttendees = await databases.listDocuments(
      ENV.DATABASE_ID,
      ATTENDEES_COLLECTION_ID,
      [
        Query.equal('eventId', eventId),
        Query.equal('userId', userId)
      ]
    );
    
    if (existingAttendees.documents.length === 0) {
      throw new Error('Attendee not found');
    }
    
    const attendee = await databases.updateDocument(
      ENV.DATABASE_ID,
      ATTENDEES_COLLECTION_ID,
      existingAttendees.documents[0].$id,
      { status }
    );
    
    return attendee;
  } catch (error) {
    console.error('Error updating attendee status:', error);
    throw error;
  }
};

/**
 * Get all invitations for a user
 */
export const getUserInvitations = async (userId) => {
  try {
    const response = await databases.listDocuments(
      ENV.DATABASE_ID,
      INVITATIONS_COLLECTION_ID,
      [Query.equal('inviteeId', userId)]
    );
    
    // Enhance invitations with event details
    const enhancedInvitations = await Promise.all(
      response.documents.map(async (invitation) => {
        try {
          const event = await getEventById(invitation.eventId);
          return {
            ...invitation,
            event
          };
        } catch (error) {
          console.error(`Error fetching event for invitation ${invitation.$id}:`, error);
          return invitation;
        }
      })
    );
    
    return enhancedInvitations;
  } catch (error) {
    console.error('Error fetching user invitations:', error);
    throw error;
  }
};

/**
 * Create an invitation
 */
export const createInvitation = async (eventId, inviterId, inviteeEmail) => {
  try {
    // Check if user with this email exists
    const userResponse = await databases.listDocuments(
      ENV.DATABASE_ID,
      'users',
      [Query.equal('email', inviteeEmail)]
    );
    
    let inviteeId = '';
    
    if (userResponse.documents.length > 0) {
      inviteeId = userResponse.documents[0].userId;
    }
    
    const invitation = await databases.createDocument(
      ENV.DATABASE_ID,
      INVITATIONS_COLLECTION_ID,
      ID.unique(),
      {
        eventId,
        inviterId,
        inviteeId,
        inviteeEmail,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    );
    
    return invitation;
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }
};

/**
 * Respond to an invitation
 */
export const respondToInvitation = async (invitationId, status, userId, userName, eventId, hostId) => {
  try {
    // Update the invitation status
    const invitation = await databases.updateDocument(
      ENV.DATABASE_ID,
      INVITATIONS_COLLECTION_ID,
      invitationId,
      { status }
    );
    
    // If the user accepted, add them as an attendee
    if (status === 'confirmed') {
      await addAttendee(eventId, userId, userName, status, hostId);
    }
    
    return invitation;
  } catch (error) {
    console.error('Error responding to invitation:', error);
    throw error;
  }
};

/**
 * Get user's attendance status for a specific event
 */
export const getUserAttendanceStatus = async (eventId, userId) => {
  try {
    // Check if the user is an attendee for this event
    const existingAttendees = await databases.listDocuments(
      ENV.DATABASE_ID,
      ATTENDEES_COLLECTION_ID,
      [
        Query.equal('eventId', eventId),
        Query.equal('userId', userId)
      ]
    );
    
    // If the user is an attendee, return their status
    if (existingAttendees.documents.length > 0) {
      return existingAttendees.documents[0].status;
    }
    
    // If the user is not an attendee, return 'not-attending'
    return 'not-attending';
  } catch (error) {
    console.error('Error checking user attendance status:', error);
    throw error;
  }
};

export default {
  createEvent,
  getUserEvents,
  getPublicEvents,
  getAttendingEvents,
  getEventById,
  getEventByShareCode,
  updateEvent,
  deleteEvent,
  getEventAttendees,
  addAttendee,
  updateAttendeeStatus,
  getUserInvitations,
  createInvitation,
  respondToInvitation,
  getUserAttendanceStatus
}; 