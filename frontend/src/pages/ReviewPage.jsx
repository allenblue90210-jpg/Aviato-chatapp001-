
import React, { useState } from 'react';
import { Search, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import ModeIndicator from '../components/availability/ModeIndicator';
import RatingModal from '../components/chat/RatingModal';

const ReviewPage = () => {
  const { users, currentUser, submitReview } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);

  // Filter users to only show those we've "chatted" with (mocked as all users for now minus self)
  const rateableUsers = users.filter(u => 
    u.id !== currentUser?.id && 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRateSubmit = (rating) => {
    if (selectedUser) {
        submitReview(selectedUser.id, rating);
    }
    setSelectedUser(null);
  };
  
  const toggleExpanded = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <h1 className="text-xl font-bold mb-4">Review</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search for people you've chatted with..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-gray-50 border-gray-200"
        />
      </div>

      <div className="space-y-3">
        {rateableUsers.map(user => {
          // Check if current user has already rated this user
          const hasRated = user.reviews?.some(r => r.raterId === currentUser?.id);
          const userReviews = user.reviews || [];

          return (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={user.profilePic} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    <ModeIndicator mode={user.availabilityMode} className="absolute -top-1 -right-1" size="small" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className={`w-3 h-3 ${star <= Math.round(user.reviewRating) ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                         {user.reviewRating}/5 • {user.reviewCount} rates
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Show toggle if user has reviews (or if user has rated them) */}
                    {(userReviews.length > 0 || hasRated) && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400"
                            onClick={() => toggleExpanded(user.id)}
                        >
                            {expandedUserId === user.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                    )}

                    <Button 
                      size="sm" 
                      variant={hasRated ? "secondary" : "outline"}
                      disabled={hasRated}
                      onClick={() => setSelectedUser(user)}
                      className={hasRated ? "bg-gray-100 text-gray-500 border-gray-100" : ""}
                    >
                      {hasRated ? "Rated" : "Rate"}
                    </Button>
                </div>
              </div>
              
              {/* Reviews List - Only visible if expanded AND (user has rated OR we decide to show always) */}
              {/* Requirement: "after i rate let it show the users that rate a person" -> Only show if hasRated is true? */}
              {/* Interpreting "only after i rate": If I haven't rated, I can't see who else rated. */}
              {expandedUserId === user.id && (
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rated By</h4>
                      {!hasRated ? (
                          <p className="text-sm text-gray-500 italic">Rate this user to see who else has reviewed them.</p>
                      ) : (
                          <div className="space-y-2">
                              {userReviews.length === 0 ? (
                                  <p className="text-sm text-gray-500 italic">No reviews yet.</p>
                              ) : (
                                  userReviews.map((review, idx) => (
                                      <div key={idx} className="flex justify-between items-center text-sm">
                                          <span className="text-gray-700 font-medium">
                                              {review.raterId === currentUser?.id ? "You" : review.raterName}
                                          </span>
                                          <div className="flex items-center gap-1">
                                              <span className="text-yellow-600 font-bold">{review.rating}</span>
                                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                          </div>
                                      </div>
                                  ))
                              )}
                          </div>
                      )}
                  </div>
              )}
            </div>
          );
        })}

        {rateableUsers.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No users found to review.
          </div>
        )}
      </div>

      {selectedUser && (
        <RatingModal 
          isOpen={!!selectedUser} 
          onClose={() => setSelectedUser(null)}
          onRate={handleRateSubmit}
          userName={selectedUser.name}
          title={`Rate ${selectedUser.name}`}
          type="review"
        />
      )}
    </div>
  );
};

export default ReviewPage;
