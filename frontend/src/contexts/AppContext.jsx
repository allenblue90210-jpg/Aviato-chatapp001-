
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockUsers, mockInterests, AvailabilityMode } from '../data/mockData';
import { getInitialMockConversations } from '../data/mockConversations';
import { checkUserAvailability, calculateMatchPercentage } from '../utils/availability';
import { useToast } from '../hooks/use-toast';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);
export const useApp = useAppContext;

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aviato_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  });
  
  const { toast } = useToast();
  
  const showToast = useCallback((message, type = 'info') => {
    let variant = "default";
    if (type === 'error') variant = "destructive";
    toast({
      variant: variant,
      description: <div className="whitespace-pre-line font-medium">{message}</div>, 
      duration: 3000,
    });
  }, [toast]);

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('aviato_users');
      return saved ? JSON.parse(saved) : mockUsers;
    } catch (error) {
      console.error(error);
      return mockUsers;
    }
  });
  
  // Persist users to localStorage when they change
  useEffect(() => {
    if (users && users.length > 0) {
      localStorage.setItem('aviato_users', JSON.stringify(users));
    }
  }, [users]);
  
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('aviato_conversations');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });
  
  const [currentSelections, setCurrentSelections] = useState([]);
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aviato_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aviato_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('aviato_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const login = async (email, password) => {
    const mockUser = { 
        ...mockUsers[0], 
        id: "current-user", 
        name: "You", 
        email,
        availabilityMode: AvailabilityMode.GREEN,
        availability: {
            openDate: null,
            laterMinutes: 0,
            laterStartTime: null,
            maxContact: 5,
            currentContacts: 0,
            timedHour: null,
            timedMinute: null
        }
    }; 
    setCurrentUser(mockUser);
    const initialConversations = getInitialMockConversations();
    setConversations(initialConversations);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setConversations([]);
    setCurrentSelections([]);
    setUsers(mockUsers); // Reset users to default
    localStorage.removeItem('aviato_current_user');
    localStorage.removeItem('aviato_conversations');
    localStorage.removeItem('aviato_users');
  };

  const deleteAllChats = () => setConversations([]);

  const addSelection = (item) => {
    if (!currentSelections.includes(item)) {
      setCurrentSelections(prev => [...prev, item]);
    }
  };

  const setSelections = (items) => {
    setCurrentSelections(items);
  };

  const removeSelection = (item) => {
    setCurrentSelections(currentSelections.filter(i => i !== item));
  };
  
  const clearSelections = () => setCurrentSelections([]);

  const findMatches = () => {
    return users.map(user => ({
      ...user,
      matchPercentage: calculateMatchPercentage(currentSelections, user.selections)
    })).sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  // --- CHAT LOGIC ---

  const startChat = (userId) => {
    const now = Date.now();
    
    const user = users.find(u => u.id === userId);

    setConversations(prev => {
      const existing = prev.find(c => c.userId === userId);
      
      if (existing) {
        // Don't auto-restart timer on page load - timer only starts when user sends message
        return prev;
      }
      
      // NEW CHAT - timer starts as null (will start when user sends first message)
      return [{
        id: Date.now().toString(),
        userId,
        messages: [],
        timerStarted: null, // Timer doesn't start until user sends a message
        timerExpired: false,
        rated: false,
        hasOtherUserReplied: false,
        lastMessage: "",
        lastMessageTime: now,
        lastMessageSenderId: null,
        waitingForResponse: false,
        theyRespondedLast: false,
        previousMode: user?.availabilityMode || 'green'
      }, ...prev];
    });
  };

  // Explicit timer update not needed for Wall Clock
  const updateConversationTimer = useCallback(() => {}, []);

  const sendMessage = (userId, text) => {
    if (!currentUser) return; // Guard against null currentUser
    
    setConversations(prev => {
      const updated = prev.map(c => {
        if (c.userId === userId) {
          const now = Date.now();
          const newMessage = {
            id: now.toString(),
            senderId: currentUser.id,
            text,
            timestamp: now,
            read: false,
            seen: false
          };
          
          const TIMER_DURATION = 2 * 60 * 1000; // 2 minutes
          const elapsed = now - (c.timerStarted || 0);
          const isExpired = !c.timerStarted || elapsed >= TIMER_DURATION;
          
          let newTimerStarted = c.timerStarted;
          let newRated = c.rated;
          
          // Start/Restart timer when user sends a message:
          // - Timer not started yet (null)
          // - Timer has expired
          // - Previous session was rated (completed)
          if (!c.timerStarted || c.rated || isExpired) {
              newTimerStarted = now;
              newRated = false;
          }
          
          return {
            ...c,
            messages: [...c.messages, newMessage],
            lastMessage: `You: ${text}`,
            lastMessageTime: now,
            lastMessageSenderId: currentUser.id,
            waitingForResponse: true, 
            theyRespondedLast: false, 
            timerStarted: newTimerStarted,
            rated: newRated,
            timerExpired: false
          };
        }
        return c;
      });
      
      // Move the conversation to top
      const convIndex = updated.findIndex(c => c.userId === userId);
      if (convIndex > 0) {
        const [conv] = updated.splice(convIndex, 1);
        updated.unshift(conv);
      }
      
      return updated;
    });
  };
  
  const receiveMessage = (userId, text) => {
    setConversations(prev => {
      const updated = prev.map(c => {
        if (c.userId === userId) {
          const now = Date.now();
          const newMessage = {
            id: now.toString(),
            senderId: userId,
            text,
            timestamp: now,
            read: false
          };
          
          // Mark all previous messages from current user as seen
          const updatedMessages = c.messages.map(msg => {
            if (msg.senderId === currentUser?.id && !msg.seen) {
              return { ...msg, seen: true };
            }
            return msg;
          });
          
          // Don't restart timer on received messages - timer only starts when current user sends
          // Just add the message
          return {
            ...c,
            messages: [...updatedMessages, newMessage],
            hasOtherUserReplied: true, 
            lastMessage: text,
            lastMessageTime: now,
            lastMessageSenderId: userId, 
            waitingForResponse: false, 
            theyRespondedLast: true
          };
        }
        return c;
      });
      
      // Move the conversation to top when receiving a message
      const convIndex = updated.findIndex(c => c.userId === userId);
      if (convIndex > 0) {
        const [conv] = updated.splice(convIndex, 1);
        updated.unshift(conv);
      }
      
      return updated;
    });
  };
  
  const markConversationRated = (userId, isGood, reason = null) => {
    setConversations(prev => prev.map(c => {
      if (c.userId === userId) {
        return {
          ...c,
          rated: true,
          timerExpired: true,
          ratingType: isGood ? 'good' : 'bad',
          ratingReason: reason
        };
      }
      return c;
    }));
  };
  
  const updateUserApproval = useCallback((userId, change) => {
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          approvalRating: u.approvalRating + change
        };
      }
      return u;
    }));
  }, []);

  const rateConversation = useCallback((userId, isGood, reason = null) => {
    const conversation = conversations.find(c => c.userId === userId);
    if (!conversation) return;

    let change;
    if (isGood) {
      change = 10;
    } else {
      const penalties = {
        'No response / Ghosted': -15,
        'Rude or disrespectful': -20,
        'Spam messages': -25,
        'Inappropriate content': -30,
        'One-word answers': -10
      };
      change = reason ? (penalties[reason] || -10) : -10;
    }

    updateUserApproval(userId, change);
    markConversationRated(userId, isGood, reason);
    
    if (isGood) {
        showToast(`Rated positively! +${change}% approval`, 'success');
    } else {
        showToast(`Rated negatively: ${change}% approval`, 'error');
    }

  }, [conversations, updateUserApproval, showToast]);

  const getConversation = (userId) => conversations.find(c => c.userId === userId);
  const getUserById = (userId) => users.find(u => u.id === userId);

  const setAvailabilityMode = useCallback((mode, settings = {}) => {
    if (!currentUser) return;
    const { suppressToast, ...modeSettings } = settings;
    
    const updatedUser = {
        ...currentUser,
        availabilityMode: mode,
        availability: { ...currentUser.availability, ...modeSettings }
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    if (!suppressToast) showToast('Mode updated', 'success');
  }, [currentUser, showToast]);

  const updateUserSelections = useCallback((newSelections) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, selections: newSelections };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    showToast('Profile selections updated', 'success');
  }, [currentUser, showToast]);

  const getCurrentMode = (userId) => {
    const user = userId === currentUser?.id ? currentUser : users.find(u => u.id === userId);
    if (!user) return { displayMode: AvailabilityMode.GRAY, canMessage: false, statusText: "Unknown" };
    const status = checkUserAvailability(user);
    return { displayMode: user.availabilityMode, canMessage: status.available, statusText: status.statusText };
  };

  const value = {
    currentUser, isAuthenticated: !!currentUser, login, logout,
    users, getUserById, currentSelections, addSelection, removeSelection, clearSelections, findMatches,
    conversations, startChat, updateConversationTimer, sendMessage, receiveMessage, 
    markConversationRated, updateUserApproval, rateConversation, getConversation,
    setAvailabilityMode, getCurrentMode, theme, setTheme, deleteAllChats, showToast, setSelections, updateUserSelections 
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
