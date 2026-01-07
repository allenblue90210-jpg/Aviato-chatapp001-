
import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';

const RatingModal = ({ 
  userName, 
  onRate, 
  onClose,
  onGoBack,
  isOpen,
  title = "Rate Conversation"
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating > 0) {
      onRate(rating);
      setShowSuccess(true);
    }
  };

  // Success state
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Thanks!</h2>
            <p className="text-sm text-gray-600 mb-4">You rated {userName} {rating} stars.</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Close
              </Button>
              {onGoBack && (
                <Button
                  onClick={() => {
                    onClose();
                    onGoBack();
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Go Back
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rating Selection Screen
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-sm text-gray-500">
            How was your experience with <span className="font-semibold text-gray-700">{userName}</span>?
          </p>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="transition-transform hover:scale-110 focus:outline-none"
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setRating(star)}
            >
              <Star 
                className={`w-10 h-10 transition-colors duration-200 ${
                  star <= (hoveredStar || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-200'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Rating Description Label (Optional feedback) */}
        <div className="text-center h-6 mb-6">
          <span className="text-sm font-medium text-gray-600">
            {hoveredStar === 1 && "Terrible"}
            {hoveredStar === 2 && "Bad"}
            {hoveredStar === 3 && "Okay"}
            {hoveredStar === 4 && "Good"}
            {hoveredStar === 5 && "Excellent!"}
            {!hoveredStar && rating > 0 && (
                <>
                    {rating === 1 && "Terrible"}
                    {rating === 2 && "Bad"}
                    {rating === 3 && "Okay"}
                    {rating === 4 && "Good"}
                    {rating === 5 && "Excellent!"}
                </>
            )}
            {!hoveredStar && rating === 0 && "Tap a star to rate"}
          </span>
        </div>

        <div className="flex gap-3">
            <Button 
                variant="ghost" 
                className="flex-1 text-gray-500 hover:text-gray-700"
                onClick={onClose}
            >
                Skip
            </Button>
            <Button 
                className={`flex-1 ${rating > 0 ? 'bg-mode-blue text-white' : 'bg-gray-100 text-gray-400'}`}
                disabled={rating === 0}
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
