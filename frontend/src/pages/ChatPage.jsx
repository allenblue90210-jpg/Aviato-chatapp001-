
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Plus, Smile, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import RatingModal from '../components/chat/RatingModal';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import ModeIndicator from '../components/availability/ModeIndicator';
import { checkUserAvailability } from '../utils/availability';

// Popular emojis organized by category
const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😋', '😜', '🤪', '😎', '🤩', '🥳'],
  'Gestures': ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👋', '🙌', '👏', '🤝', '💪', '🙏', '✋', '🖐️', '👊', '✊', '🫶', '❤️'],
  'Faces': ['😢', '😭', '😤', '😠', '🤬', '😈', '💀', '🤡', '👻', '😱', '😨', '😰', '🥺', '😩', '😫', '🥱', '😴', '🤮', '🤧', '🤒'],
  'Objects': ['🎉', '🎊', '🎁', '🎈', '💯', '🔥', '⭐', '✨', '💫', '🌟', '💥', '💢', '💬', '💭', '🗯️', '📱', '💻', '🎮', '🎵', '🎶'],
  'Love': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️']
};

const ChatPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { 
    getUserById, 
    getConversation, 
    sendMessage, 
    receiveMessage, 
    startChat, 
    rateConversation,
    currentUser 
  } = useAppContext();
  
  const [text, setText] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasRatedCurrentSession, setHasRatedCurrentSession] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Smileys');
  const scrollRef = useRef(null);
  const emojiPickerRef = useRef(null);
  
  const otherUser = getUserById ? getUserById(userId) : null;
  const conversation = getConversation ? getConversation(userId) : null;
  const availabilityStatus = otherUser ? checkUserAvailability(otherUser) : { available: false, reason: 'Offline' };

  const TIMER_DURATION = 2 * 60 * 1000; // 2 minutes

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const handleEmojiClick = (emoji) => {
    setText(prev => prev + emoji);
  };

  // 1. INITIALIZATION: Ensure conversation exists (but don't auto-start timer)
  useEffect(() => {
    if (userId && startChat) {
      startChat(userId);
    }
  }, [userId, startChat]);

  // Reset session rating flag when conversation is rated (so new session can trigger modal)
  useEffect(() => {
    if (conversation?.rated) {
      setHasRatedCurrentSession(true);
    }
  }, [conversation?.rated]);

  // Reset rating flag when timer restarts (new message sent after rating)
  useEffect(() => {
    if (conversation?.timerStarted && !conversation?.rated && hasRatedCurrentSession) {
      // Timer was restarted, reset the session flag
      setHasRatedCurrentSession(false);
    }
  }, [conversation?.timerStarted, conversation?.rated, hasRatedCurrentSession]);

  // 2. CALCULATION - Timer only runs if timerStarted is set
  const calculateRemaining = useCallback(() => {
      // Timer not started yet -> show full duration (2:00)
      if (!conversation || conversation.timerStarted === null || conversation.timerStarted === undefined) {
        return TIMER_DURATION;
      }
      
      // If rated, show 00:00
      if (conversation.rated) {
        return 0;
      }
      
      const elapsed = Date.now() - conversation.timerStarted;
      return Math.max(0, TIMER_DURATION - elapsed);
  }, [conversation, TIMER_DURATION]);

  const [timeRemaining, setTimeRemaining] = useState(calculateRemaining());

  // 3. INTERVAL - Timer logic
  useEffect(() => {
    if (!conversation) return;

    // If timer not started, show full duration (2:00)
    if (!conversation.timerStarted) {
        setTimeRemaining(TIMER_DURATION);
        return;
    }
    
    // If already rated, show 00:00
    if (conversation.rated) {
        setTimeRemaining(0);
        return;
    }

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeRemaining(remaining);

      // Trigger Modal when timer expires
      if (remaining <= 0) {
         clearInterval(interval);
         // Only show modal if not already rated and not already shown this session
         if (!conversation.rated && !hasRatedCurrentSession) {
             setShowRatingModal(true);
         }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [conversation, calculateRemaining, hasRatedCurrentSession]); 

  // 4. AUTO-REPLY
  useEffect(() => {
    if (!conversation) return;
    if (userId !== '1') return; // Only Asuab
    
    const messages = conversation.messages;
    if (messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.senderId === currentUser?.id) {
      const timer = setTimeout(() => {
        if (receiveMessage) receiveMessage(userId, 'k');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [conversation?.messages, userId, receiveMessage, currentUser?.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [conversation?.messages]);

  const formatTime = (ms) => {
    if (isNaN(ms) || ms < 0) return "00:00"; 
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    // Timer not started - show gray
    if (!conversation?.timerStarted) {
      return 'text-gray-400';
    }
    // Timer rated/done
    if (conversation?.rated) {
      return 'text-green-600';
    }
    if (timeRemaining <= 10000) return 'text-red-600 animate-pulse';
    if (timeRemaining <= 30000) return 'text-orange-500';
    return 'text-gray-700';
  };

  const getTimerDisplay = () => {
    // Timer not started yet - show 2:00
    if (!conversation?.timerStarted) {
      return '⏸ 02:00';
    }
    // Timer rated/stopped
    if (conversation?.rated) {
      return '✓ Done';
    }
    // Timer running or expired
    return formatTime(timeRemaining);
  };

  const handleRate = useCallback((isGood, reason) => {
    if (rateConversation) {
        rateConversation(userId, isGood, reason);
    }
    setHasRatedCurrentSession(true);
    setShowRatingModal(false);
    // After rating, timer logic will see conversation.rated = true and set 00:00
  }, [rateConversation, userId]);

  const handleSendMessage = () => {
    if (!text.trim() || !availabilityStatus.available) return;
    if (sendMessage) sendMessage(userId, text);
    setText('');
  };

  if (!otherUser) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] bg-white">
      <div className="border-b border-gray-100 p-3 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <img src={otherUser.profilePic} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
            <ModeIndicator mode={otherUser.availabilityMode} className="absolute -top-1 -right-1" size="small" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">{otherUser.name}</h2>
            <div className="text-xs text-gray-500">
                {availabilityStatus.available ? 'Online' : availabilityStatus.statusText || 'Offline'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <span className={`text-sm font-mono font-bold ${getTimerColor()}`}>
            {getTimerDisplay()}
          </span>
          {timeRemaining <= 0 && conversation?.timerStarted && !conversation?.rated && <span className="text-xs">⌛</span>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50" ref={scrollRef}>
        {(!conversation?.messages || conversation.messages.length === 0) && (
           <div className="text-center text-gray-400 text-sm mt-10">
             Start a conversation with {otherUser.name}.<br/>
             {conversation?.timerStarted ? 'Timer is running!' : 'Timer starts when you send a message.'}
           </div>
        )}
        {conversation?.messages?.map((msg) => {
          const isMe = msg.senderId === currentUser?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  isMe ? 'bg-mode-blue text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                <p>{msg.text}</p>
                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                  {isMe && (
                    <span className="ml-1">
                      {msg.seen ? <span className="text-blue-200">Seen</span> : '✓✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-3 border-t border-gray-100 flex items-center gap-2 relative">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600" disabled={!availabilityStatus.available}>
          <Plus className="w-5 h-5" />
        </Button>
        <div className="flex-1 relative">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={availabilityStatus.available ? "Type message..." : `⛔ ${availabilityStatus.reason || "User Unavailable"}`}
            className="pr-10 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-all"
            disabled={!availabilityStatus.available}
          />
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`absolute right-3 top-2.5 w-5 h-5 transition-colors ${showEmojiPicker ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
            disabled={!availabilityStatus.available}
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>
        <Button onClick={handleSendMessage} disabled={!text.trim() || !availabilityStatus.available} size="icon" className="bg-mode-blue hover:bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-sm">
            <Send className="w-4 h-4 text-white ml-0.5" />
        </Button>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div 
            ref={emojiPickerRef}
            className="absolute bottom-16 right-2 bg-white rounded-xl shadow-xl border border-gray-200 w-72 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
              <span className="text-sm font-semibold text-gray-700">Emojis</span>
              <button 
                onClick={() => setShowEmojiPicker(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            {/* Category Tabs */}
            <div className="flex gap-1 px-2 py-2 border-b border-gray-100 overflow-x-auto scrollbar-hide">
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Emoji Grid */}
            <div className="p-2 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-8 gap-1">
                {EMOJI_CATEGORIES[selectedCategory].map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiClick(emoji)}
                    className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showRatingModal && (
        <RatingModal
          isOpen={showRatingModal}
          userName={otherUser.name}
          otherUserReplied={conversation?.messages.some(m => m.senderId === userId)}
          onRate={handleRate}
          onClose={() => {
            setShowRatingModal(false);
            setHasRatedCurrentSession(true);
          }}
          onGoBack={() => navigate(-1)}
        />
      )}
    </div>
  );
};

export default ChatPage;
