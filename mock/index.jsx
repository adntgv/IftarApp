import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Send, Check, X, Plus, Moon, Home, User, Bell, ChevronRight, ChevronLeft, Share2, Copy, LogIn, ExternalLink, MapPin, Heart, Info, Edit } from 'lucide-react';

// Demo data
const initialEvents = [
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

const initialInvites = [
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

// Reusable Components
const Button = ({ children, variant = 'primary', icon, onClick, disabled, className = '', fullWidth = false }) => {
  const baseClasses = "rounded-lg transition-all duration-200 flex items-center justify-center";
  const sizeClasses = icon && !children ? "p-2" : "px-4 py-2";
  const widthClass = fullWidth ? "w-full" : "";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    link: "text-blue-600 hover:underline bg-transparent",
    icon: "text-gray-500 hover:bg-gray-100 rounded-full p-2"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]} ${widthClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon && <span className={children ? "mr-2" : ""}>{icon}</span>}
      {children}
    </button>
  );
};

const Card = ({ children, onClick, borderColor, className = '', animate = '' }) => {
  const animationClass = animate === 'pulse' ? 'animate-pulse' : animate === 'fade' ? 'animate-fade-in' : '';
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-md p-4 border-l-4 ${borderColor} transition-all duration-300 hover:shadow-lg ${animationClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        required={required}
        rows="3"
      ></textarea>
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        required={required}
      />
    )}
  </div>
);

const Badge = ({ status, text }) => {
  const colors = {
    confirmed: "bg-green-100 text-green-600",
    declined: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-600"
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {text || status}
    </span>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md z-10"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

// Main App Component
const IftarApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [events, setEvents] = useState(initialEvents);
  const [invites, setInvites] = useState(initialInvites);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    isPublic: true
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('card');
  const [animation, setAnimation] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to logged in for demo
  const [showLogin, setShowLogin] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ email: "", password: "" });
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPublicView, setShowPublicView] = useState(false);
  const [publicViewEvent, setPublicViewEvent] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Animation effect
  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => {
        setAnimation('');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  // Copy link effect
  useEffect(() => {
    if (linkCopied) {
      const timer = setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [linkCopied]);

  // Create new event
  const handleCreateEvent = () => {
    const shareCode = `${newEvent.title.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 5)}`;
    const event = {
      id: events.length + invites.length + 1,
      ...newEvent,
      host: "You",
      shareCode,
      attendees: []
    };
    setEvents([...events, event]);
    setNewEvent({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      isPublic: true
    });
    setIsCreating(false);
    setActiveTab('home');
    setAnimation('create');
  };

  // Respond to invitation
  const handleRespond = (id, status) => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    
    const updatedInvites = invites.map(invite => 
      invite.id === id ? { ...invite, status } : invite
    );
    setInvites(updatedInvites);
    setAnimation('respond');
  };

  // Open event details
  const handleOpenEvent = (event) => {
    setSelectedEvent(event);
    setAnimation('open');
  };

  // Close event details
  const handleCloseEvent = () => {
    setSelectedEvent(null);
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'card' ? 'list' : 'card');
    setAnimation('toggle');
  };

  // Handle login
  const handleLogin = () => {
    // In a real app, validate credentials here
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  // Copy share link
  const handleCopyLink = (shareCode) => {
    const shareLink = `https://iftar-app.example.com/event/${shareCode}`;
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
  };

  // View public event
  const handleViewPublicEvent = (event) => {
    setPublicViewEvent(event);
    setShowPublicView(true);
  };

  // Tab navigation components
  const Navigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around items-center">
      <Button 
        variant="icon" 
        icon={<Home size={24} />} 
        onClick={() => setActiveTab('home')} 
        className={activeTab === 'home' ? 'bg-blue-100 text-blue-600' : ''}
      />
      <Button 
        variant="icon" 
        icon={<Bell size={24} />} 
        onClick={() => setActiveTab('invites')} 
        className={activeTab === 'invites' ? 'bg-blue-100 text-blue-600' : ''}
      />
      <Button 
        variant="primary" 
        icon={<Plus size={24} />} 
        onClick={() => {setIsCreating(true); setActiveTab('create');}} 
        className="p-4 rounded-full shadow-lg transform transition hover:scale-105"
      />
      <Button 
        variant="icon" 
        icon={<Calendar size={24} />} 
        onClick={() => setActiveTab('calendar')} 
        className={activeTab === 'calendar' ? 'bg-blue-100 text-blue-600' : ''}
      />
      <Button 
        variant="icon" 
        icon={<User size={24} />} 
        onClick={() => setActiveTab('profile')} 
        className={activeTab === 'profile' ? 'bg-blue-100 text-blue-600' : ''}
      />
    </div>
  );

  // Header component
  const Header = ({ title, action }) => (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
      <h1 className="text-xl font-semibold text-gray-800 flex items-center">
        <Moon className="mr-2 text-blue-600" size={24} /> 
        {title}
      </h1>
      {action && (
        <Button 
          variant="link" 
          onClick={action}
        >
          {viewMode === 'card' ? 'List View' : 'Card View'}
        </Button>
      )}
    </div>
  );

  // Event card component
  const EventCard = ({ event, isInvite = false }) => {
    const borderColor = isInvite 
      ? event.status === 'confirmed' 
        ? 'border-green-500' 
        : event.status === 'declined' 
          ? 'border-red-500' 
          : 'border-yellow-500'
      : 'border-blue-500';
      
    return (
      <Card 
        borderColor={borderColor} 
        onClick={() => handleOpenEvent(event)} 
        animate={animation === 'create' || animation === 'respond' ? 'pulse' : ''}
        className="mb-4"
      >
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
          <div className="text-xs text-gray-500">{isInvite ? `Invited by ${event.host}` : 'You host'}</div>
        </div>
        
        <div className="mt-3 flex items-center text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span>{event.date}</span>
        </div>
        
        <div className="mt-2 flex items-center text-gray-600">
          <Clock size={16} className="mr-2" />
          <span>{event.time}</span>
        </div>
        
        <div className="mt-2 flex items-center text-gray-600">
          <MapPin size={16} className="mr-2" />
          <span className="truncate">{event.location}</span>
        </div>
        
        {!isInvite && (
          <div className="mt-3 flex items-center text-gray-600">
            <Users size={16} className="mr-2" />
            <span>{event.attendees.filter(a => a.status === 'confirmed').length} confirmed</span>
          </div>
        )}
        
        {isInvite && (
          <div className="mt-4 flex justify-between">
            <Button 
              variant={event.status === 'confirmed' ? 'success' : 'secondary'}
              icon={<Check size={14} />}
              onClick={(e) => {e.stopPropagation(); handleRespond(event.id, 'confirmed')}}
            >
              Accept
            </Button>
            <Button 
              variant={event.status === 'declined' ? 'danger' : 'secondary'}
              icon={<X size={14} />}
              onClick={(e) => {e.stopPropagation(); handleRespond(event.id, 'declined')}}
            >
              Decline
            </Button>
          </div>
        )}
      </Card>
    );
  };

  // Event list component
  const EventList = ({ events, isInvites = false }) => (
    <div className={`mt-2 ${animation === 'toggle' ? 'animate-fade-in' : ''}`}>
      {events.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {isInvites ? "No invitations yet" : "No events yet"}
        </div>
      ) : (
        viewMode === 'card' ? (
          <div className="grid grid-cols-1 gap-4">
            {events.map(event => (
              <EventCard key={event.id} event={event} isInvite={isInvites} />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {events.map(event => (
              <div 
                key={event.id} 
                className="py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => handleOpenEvent(event)}
              >
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );

  // Event creation form
  const CreateEventForm = () => (
    <div className="p-4 bg-white rounded-xl shadow-md mt-4 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Create Iftar Event</h2>
      
      <Input
        label="Event Title"
        value={newEvent.title}
        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
        placeholder="Family Iftar Dinner"
        required
      />
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input
          label="Date"
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
          required
        />
        <Input
          label="Time"
          type="time"
          value={newEvent.time}
          onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
          required
        />
      </div>
      
      <Input
        label="Location"
        value={newEvent.location}
        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
        placeholder="123 Main Street"
        required
      />
      
      <Input
        label="Description"
        type="textarea"
        value={newEvent.description}
        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
        placeholder="Join us for a special iftar meal..."
      />
      
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={newEvent.isPublic}
            onChange={(e) => setNewEvent({...newEvent, isPublic: e.target.checked})}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Make event publicly viewable (anyone with the link can see details)</span>
        </label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          variant="secondary"
          onClick={() => {setIsCreating(false); setActiveTab('home');}}
        >
          Cancel
        </Button>
        <Button 
          variant="primary"
          icon={<Check size={18} />}
          onClick={handleCreateEvent}
          disabled={!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location}
        >
          Create Event
        </Button>
      </div>
    </div>
  );

  // Share modal component
  const ShareModal = ({ event }) => {
    const shareLink = `https://iftar-app.example.com/event/${event.shareCode}`;
    
    return (
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Share this Event</h2>
          
          <p className="text-gray-600 mb-4">
            Anyone with this link can view the event details. 
            {event.isPublic ? ' They can also RSVP after logging in.' : ''}
          </p>
          
          <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-gray-50 mb-4">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-grow bg-transparent border-none focus:outline-none text-gray-700"
            />
            <Button 
              variant="secondary"
              icon={<Copy size={16} />}
              onClick={() => handleCopyLink(event.shareCode)}
              className={linkCopied ? 'bg-green-100 text-green-600 border-green-300' : ''}
            >
              {linkCopied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            People who receive this link will need to log in to respond to the invitation.
          </p>
          
          <div className="flex space-x-2">
            <Button 
              variant="secondary"
              icon={<Share2 size={16} />}
              fullWidth
            >
              Share via Message
            </Button>
            <Button 
              variant="primary"
              icon={<ExternalLink size={16} />}
              onClick={() => {
                handleViewPublicEvent(event);
                setShowShareModal(false);
              }}
              fullWidth
            >
              Preview Public View
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  // Login modal component
  const LoginModal = () => (
    <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Sign In</h2>
        
        <p className="text-gray-600 mb-6 text-center">
          Please sign in to respond to invitations
        </p>
        
        <Input
          label="Email"
          type="email"
          value={loginCredentials.email}
          onChange={(e) => setLoginCredentials({...loginCredentials, email: e.target.value})}
          placeholder="your@email.com"
          required
        />
        
        <Input
          label="Password"
          type="password"
          value={loginCredentials.password}
          onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
          placeholder="••••••••"
          required
        />
        
        <Button 
          variant="primary"
          icon={<LogIn size={18} />}
          onClick={handleLogin}
          fullWidth
          className="mt-2"
        >
          Sign In
        </Button>
        
        <div className="mt-4 text-center">
          <Button variant="link">Forgot Password?</Button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-2">Don't have an account?</p>
          <Button variant="secondary" fullWidth>Create Account</Button>
        </div>
      </div>
    </Modal>
  );

  // Public event view component
  const PublicEventView = () => {
    if (!publicViewEvent) return null;
    
    // Calculate days until event
    const eventDate = new Date(publicViewEvent.date);
    const today = new Date();
    const diffTime = Math.abs(eventDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate sunset time (example)
    const sunsetTime = "18:23";
    
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-fade-in">
        <div className="relative">
          {/* Header background */}
          <div className="h-64 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
            
            {/* Moon icon animation */}
            <div className="absolute top-12 right-12 w-24 h-24 rounded-full bg-yellow-100 opacity-90 animate-float">
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-blue-800"></div>
            </div>
            
            <div className="absolute top-4 left-4 z-10">
              <Button 
                variant="secondary" 
                icon={<X size={20} />}
                onClick={() => setShowPublicView(false)}
                className="bg-white bg-opacity-90"
              />
            </div>
          </div>
          
          {/* Event title section */}
          <div className="px-6 -mt-16 relative z-10">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-800">{publicViewEvent.title}</h1>
              <p className="text-gray-600">Hosted by {publicViewEvent.host}</p>
              
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Days Until Iftar</p>
                  <p className="text-2xl font-bold text-blue-600">{diffDays}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Sunset</p>
                  <p className="text-2xl font-bold text-purple-600">{sunsetTime}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Attending</p>
                  <p className="text-2xl font-bold text-green-600">
                    {publicViewEvent.attendees 
                      ? publicViewEvent.attendees.filter(a => a.status === 'confirmed').length 
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Event details */}
          <div className="px-6 mt-4">
            <Card className="mb-4" borderColor="border-blue-500">
              <h2 className="text-lg font-semibold mb-3 flex items-center">
                <Info size={18} className="mr-2 text-blue-600" /> 
                Event Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar size={20} className="mt-1 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-gray-600">{publicViewEvent.date} at {publicViewEvent.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin size={20} className="mt-1 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{publicViewEvent.location}</p>
                    <Button 
                      variant="link" 
                      className="mt-1 text-sm"
                      icon={<ExternalLink size={14} />}
                    >
                      View on Maps
                    </Button>
                  </div>
                </div>
                
                {publicViewEvent.description && (
                  <div className="flex items-start">
                    <Edit size={20} className="mt-1 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Description</p>
                      <p className="text-gray-600">{publicViewEvent.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          {/* Host information and RSVP */}
          <div className="px-6 mb-24">
            <Card className="border-l-0 p-0 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold">About the Host</h2>
              </div>
              <div className="p-4 flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <User size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{publicViewEvent.host}</p>
                  <p className="text-sm text-gray-500">Event Organizer</p>
                </div>
              </div>
              
              <div className="p-6 bg-blue-50 flex flex-col items-center">
                <p className="text-center text-gray-600 mb-4">
                  Would you like to attend this iftar event?
                </p>
                
                {isLoggedIn ? (
                  <div className="flex space-x-3">
                    <Button 
                      variant="success" 
                      icon={<Check size={18} />}
                      onClick={() => {
                        if (publicViewEvent.status) {
                          handleRespond(publicViewEvent.id, 'confirmed');
                        }
                        setShowPublicView(false);
                      }}
                    >
                      I'll Attend
                    </Button>
                    <Button 
                      variant="danger" 
                      icon={<X size={18} />}
                      onClick={() => {
                        if (publicViewEvent.status) {
                          handleRespond(publicViewEvent.id, 'declined');
                        }
                        setShowPublicView(false);
                      }}
                    >
                      I Can't Attend
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    icon={<LogIn size={18} />}
                    onClick={() => {
                      setShowLogin(true);
                    }}
                  >
                    Sign in to RSVP
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Event details modal
  const EventDetails = ({ event }) => {
    const [showInvite, setShowInvite] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    
    return (
      <Modal isOpen={selectedEvent !== null} onClose={handleCloseEvent}>
        <div className="relative">
          <div className="h-32 bg-blue-600 rounded-t-xl"></div>
          <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Moon size={32} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="pt-12 p-6">
          <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
          <p className="text-gray-500">Hosted by {event.host}</p>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-start">
              <Calendar size={20} className="mt-1 mr-3 text-gray-500" />
              <div>
                <p className="font-medium">Date & Time</p>
                <p className="text-gray-600">{event.date} at {event.time}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin size={20} className="mt-1 mr-3 text-gray-500" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>
            
            {event.description && (
              <div className="flex items-start">
                <Edit size={20} className="mt-1 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Description</p>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              </div>
            )}
            
            {event.attendees && (
              <div className="flex items-start">
                <Users size={20} className="mt-1 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Guests</p>
                  <div className="mt-2 space-y-1">
                    {event.attendees.map(attendee => (
                      <div key={attendee.id} className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          attendee.status === 'confirmed' ? 'bg-green-500' : 
                          attendee.status === 'declined' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></span>
                        <span>{attendee.name}</span>
                        <Badge 
                          status={attendee.status} 
                          text={
                            attendee.status === 'confirmed' ? 'Going' : 
                            attendee.status === 'declined' ? 'Not going' : 'Pending'
                          }
                          className="ml-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {!event.status && (
            <div className="mt-8 space-y-4">
              {showInvite ? (
                <div className="space-y-4">
                  <Input
                    label="Email or Name"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="friend@example.com"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="secondary"
                      onClick={() => setShowInvite(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary"
                      icon={<Send size={14} />}
                      onClick={() => {
                        setShowInvite(false);
                        setInviteEmail('');
                        setAnimation('invite');
                      }}
                      disabled={!inviteEmail}
                    >
                      Send Invite
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    variant="primary"
                    icon={<Send size={18} />}
                    onClick={() => setShowInvite(true)}
                    fullWidth
                  >
                    Invite Guests
                  </Button>
                  <Button 
                    variant="secondary"
                    icon={<Share2 size={18} />}
                    onClick={() => {
                      setSelectedEvent(null);
                      setShowShareModal(true);
                    }}
                    fullWidth
                  >
                    Share Link
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {event.status === 'pending' && (
            <div className="mt-8 flex space-x-2">
              <Button 
                variant="success"
                icon={<Check size={18} />}
                onClick={() => {
                  handleRespond(event.id, 'confirmed');
                  handleCloseEvent();
                }}
                fullWidth
              >
                Accept
              </Button>
              <Button 
                variant="danger"
                icon={<X size={18} />}
                onClick={() => {
                  handleRespond(event.id, 'declined');
                  handleCloseEvent();
                }}
                fullWidth
              >
                Decline
              </Button>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  // Simple calendar view (placeholder)
  const CalendarView = () => (
    <div className="p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="icon" icon={<ChevronLeft size={20} />} />
          <h3 className="font-medium">March 2025</h3>
          <Button variant="icon" icon={<ChevronRight size={20} />} />
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="p-2 text-gray-500 font-medium">{day}</div>
          ))}
          
          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
            <div 
              key={day} 
              className={`p-2 rounded-full cursor-pointer ${
                day === 1 || day === 5 || day === 10 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="p-2 border-l-4 border-blue-500 bg-blue-50 rounded">
            <p className="font-medium">Family Iftar Gathering</p>
            <p className="text-sm text-gray-600">March 1, 2025 at 18:30</p>
          </div>
          <div className="p-2 border-l-4 border-blue-500 bg-blue-50 rounded">
            <p className="font-medium">Community Iftar</p>
            <p className="text-sm text-gray-600">March 5, 2025 at 18:45</p>
          </div>
          <div className="p-2 border-l-4 border-yellow-500 bg-yellow-50 rounded">
            <p className="font-medium">Neighborhood Iftar</p>
            <p className="text-sm text-gray-600">March 10, 2025 at 18:30</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Simple profile view (placeholder)
  const ProfileView = () => (
    <div className="p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-bold">Aisha Ali</h2>
        <p className="text-gray-500">aisha@example.com</p>
        
        <div className="mt-6 text-left">
          <h3 className="font-medium mb-2">Your Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-600">Hosted Events</p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-gray-600">Invitations</p>
              <p className="text-2xl font-bold">{invites.length}</p>
            </div>
          </div>
        </div>
        
        {/* <div className="mt-6 space-y-2 text-left">
          <h3 className="font-medium mb-2">Preferences</h3>
          <div className="flex items-center justify-between">
            <span>Notification Settings</span>
            <Button variant="link">Edit</Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Theme Options</span>
            <Button variant="link">Edit</Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Language</span>
            <Button variant="link">Edit</Button>
          </div>
        </div> */}
        
        <Button 
          variant="secondary"
          onClick={() => setIsLoggedIn(false)}
          fullWidth
          className="mt-8"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      {activeTab === 'home' && <Header title="Your Iftar Events" action={toggleViewMode} />}
      {activeTab === 'invites' && <Header title="Your Invitations" action={toggleViewMode} />}
      {activeTab === 'create' && <Header title="Create Event" />}
      {activeTab === 'calendar' && <Header title="Calendar" />}
      {activeTab === 'profile' && <Header title="Profile" />}
      
      <div className="pt-16 pb-20 px-4">
        {activeTab === 'home' && <EventList events={events} />}
        {activeTab === 'invites' && <EventList events={invites} isInvites={true} />}
        {activeTab === 'create' && <CreateEventForm />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'profile' && <ProfileView />}
      </div>
      
      <Navigation />
      
      {selectedEvent && <EventDetails event={selectedEvent} />}
      {selectedEvent && <ShareModal event={selectedEvent} />}
      <LoginModal />
      <PublicEventView />

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 0.5s ease-in-out;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default IftarApp;