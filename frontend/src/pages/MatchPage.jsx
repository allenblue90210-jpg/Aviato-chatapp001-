import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { 
  MessageSquare, 
  Lock, 
  Calendar, 
  Clock, 
  Users, 
  PauseCircle,
  ThumbsUp,
  Star,
  Filter
} from 'lucide-react';
import { checkUserAvailability, getModeColor, getApprovalColor } from '../utils/availability';
import { AvailabilityMode } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import CategorySelector from '../components/availability/CategorySelector';

export default function MatchPage() {
  const navigate = useNavigate();
  const { 
    users, 
    currentUser, 
    currentSelections, 
    addSelection, 
    removeSelection, 
    clearSelections, 
    findMatches,
    setSelections
  } = useAppContext();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // If we have selections, show matches. Otherwise show browsing.
  // Sort users by approval rating (highest first)
  const displayUsers = currentSelections.length > 0 
    ? findMatches() 
    : [...users].sort((a, b) => b.approvalRating - a.approvalRating);

  const handleMessage = (userId) => {
    navigate(`/chat/${userId}`);
  };

  const handleApplyFilters = (newSelections) => {
    setSelections(newSelections);
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header - Replaced Aviato Logo with Match Features */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b border-gray-200 flex justify-between items-center shadow-sm">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Find your Vibe</h1>
          <p className="text-xs text-gray-500">
            {currentSelections.length > 0 
              ? `${currentSelections.length} interests selected`
              : "Select interests to match"
            }
          </p>
        </div>
        <Button 
          onClick={() => setIsFilterOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
        >
          <Filter className="w-4 h-4" />
          <span>Filter</span>
          {currentSelections.length > 0 && (
            <Badge variant="secondary" className="bg-blue-200 text-blue-800 hover:bg-blue-200 ml-1 h-5 px-1.5 min-w-[20px] justify-center">
              {currentSelections.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Selected Categories Horizontal Scroll */}
      {currentSelections.length > 0 && (
        <div className="bg-white px-4 py-2 border-b border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex gap-2">
            {currentSelections.map(item => (
              <Badge 
                key={item} 
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200 px-3 py-1 text-sm font-medium"
                onClick={() => removeSelection(item)}
              >
                {item} ×
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-4">
        {displayUsers.length === 0 ? (
           <div className="text-center py-10 text-gray-500">
             No matches found with these interests.
           </div>
        ) : (
          displayUsers.filter(u => u.id !== currentUser?.id).map(user => (
            <MatchCard 
              key={user.id} 
              user={user} 
              onMessage={() => handleMessage(user.id)} 
            />
          ))
        )}
      </div>

      {/* Category Selector Sheet */}
      <CategorySelector 
        isOpen={isFilterOpen}
        onClose={setIsFilterOpen}
        currentSelected={currentSelections}
        onApply={handleApplyFilters}
        maxSelections={5}
      />
    </div>
  );
}

function MatchCard({ user, onMessage }) {
  const { available, reason, modeColor, statusText } = checkUserAvailability(user);
  
  const canMessage = available;

  const getStatusIcon = () => {
    switch(user.availabilityMode) {
      case AvailabilityMode.RED: return <Lock className="w-4 h-4" />;
      case AvailabilityMode.GRAY: return <PauseCircle className="w-4 h-4" />;
      case AvailabilityMode.BLUE: return <Calendar className="w-4 h-4" />;
      case AvailabilityMode.YELLOW: return <Clock className="w-4 h-4" />;
      case AvailabilityMode.BROWN: return <Clock className="w-4 h-4" />;
      case AvailabilityMode.ORANGE: return <Users className="w-4 h-4" />;
      case AvailabilityMode.GREEN: return null; 
      default: return null; 
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex gap-4">
        {/* Avatar with Mode Indicator */}
        <div className="relative">
          <img 
            src={user.profilePic} 
            alt={user.name} 
            className="w-16 h-16 rounded-full object-cover"
          />
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white"
            style={{ backgroundColor: modeColor }}
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.vibe} • {user.location}</p>
            </div>
            {user.matchPercentage !== undefined && (
              <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-bold">
                {user.matchPercentage}% Match
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center gap-4 text-sm">
            <div className={`flex items-center gap-1 ${getApprovalColor(user.approvalRating)}`}>
              <ThumbsUp className="w-3 h-3" />
              <span className="font-bold">{user.approvalRating > 0 ? `+${user.approvalRating}` : user.approvalRating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Star className="w-3 h-3 text-yellow-400" />
              <span>{user.reviewRating} ({user.reviewCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Common Interests Preview if matched */}
      {user.matchPercentage !== undefined && (
          <div className="mt-3 flex gap-1 flex-wrap">
             {user.selections?.slice(0, 5).map(interest => (
                 <span key={interest} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                     {interest}
                 </span>
             ))}
             {user.selections?.length > 5 && (
                 <span className="text-[10px] text-gray-400 px-1 py-0.5">+{user.selections.length - 5} more</span>
             )}
          </div>
      )}

      {/* Status & Action */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2 text-sm">
          {getStatusIcon()}
          <span style={{ color: modeColor }} className="font-medium">
            {statusText || reason}
          </span>
        </div>

        <button
          onClick={onMessage}
          disabled={!canMessage}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors
            ${canMessage 
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {canMessage ? (
            <>
              <MessageSquare className="w-4 h-4" />
              Message
            </>
          ) : (
            'Unavailable'
          )}
        </button>
      </div>
    </div>
  );
}
