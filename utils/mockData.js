/**
 * Mock data for the Iftar App
 */

// Demo events
export const initialEvents = [
  {
    id: 1,
    title: "Family Iftar Gathering",
    date: "2025-03-01",
    time: "18:30",
    location: "123 Olive Street",
    host: "Ahmed",
    description: "Join us for our annual family iftar. Bring your favorite dessert!",
    isPublic: true,
    shareCode: "fam-iftar-2025",
    attendees: [
      { id: 1, name: "Fatima", status: "confirmed" },
      { id: 2, name: "Omar", status: "confirmed" },
      { id: 3, name: "Layla", status: "pending" }
    ]
  },
  {
    id: 2,
    title: "Community Iftar",
    date: "2025-03-05",
    time: "18:45",
    location: "Al-Noor Islamic Center",
    host: "Community Council",
    description: "Monthly community iftar open to all. Please RSVP to help with food preparation.",
    isPublic: true,
    shareCode: "comm-iftar-mar5",
    attendees: [
      { id: 1, name: "Yusuf", status: "confirmed" },
      { id: 4, name: "Amina", status: "declined" },
      { id: 5, name: "Ibrahim", status: "pending" }
    ]
  }
];

// Demo invites
export const initialInvites = [
  {
    id: 3,
    title: "Neighborhood Iftar",
    date: "2025-03-10",
    time: "18:30",
    location: "45 Cedar Lane",
    host: "Mustafa",
    description: "Bringing our neighborhood together for iftar. Children welcome!",
    isPublic: true,
    shareCode: "nbhd-iftar-mar10",
    status: "pending"
  }
];

// User info
export const userInfo = {
  name: "Aisha Ali",
  email: "aisha@example.com",
  stats: {
    hosted: 2,
    invites: 1
  }
};

// Helper function to generate a share code
export const generateShareCode = (title) => {
  const baseCode = title.toLowerCase().replace(/\s+/g, '-');
  const randomString = Math.random().toString(36).substr(2, 5);
  return `${baseCode}-${randomString}`;
}; 