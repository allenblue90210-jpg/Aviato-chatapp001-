
import React, { useState } from 'react';
import { Search, Star } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import ModeIndicator from '../components/availability/ModeIndicator';
import RatingModal from '../components/chat/RatingModal';

const ReviewPage = () => {
  const { users, currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter users to only show those we've "chatted" with (mocked as all users for now minus self)
  const rateableUsers = users.filter(u => 
    u.id !== currentUser?.id && 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRateSubmit = (rating) => {
    console.log(`Rated ${selectedUser.name} with ${rating} stars`);
    setSelectedUser(null);
    // Here we would call context to update the rating
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
        {rateableUsers.map(user => (
          <div key={user.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
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
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setSelectedUser(user)}
            >
              Rate
            </Button>
          </div>
        ))}

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
          onSubmit={handleRateSubmit}
          userName={selectedUser.name}
          type="review"
        />
      )}
    </div>
  );
};

export default ReviewPage;
