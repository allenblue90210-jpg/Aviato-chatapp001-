
import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';

const BAD_REPLY_REASONS = [
  { label: 'No response / Ghosted', penalty: -15 },
  { label: 'Rude or disrespectful', penalty: -20 },
  { label: 'Spam messages', penalty: -25 },
  { label: 'Inappropriate content', penalty: -30 },
  { label: 'One-word answers', penalty: -10 }
];

const RatingModal = ({ 
  userName, 
  otherUserReplied = true, 
  onRate, 
  onClose,
  onGoBack,
  isOpen 
}) => {
  const [showReasonSelector, setShowReasonSelector] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // CRITICAL FIX: If not open, don't render
  if (!isOpen) return null;

  const handleCancel = () => {
    setShowReasonSelector(false);
    setSelectedReason(null);
  };

  // Success state
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-sm w-full p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Done!</h2>
            <p className="text-sm text-gray-600 mb-4">Rating submitted</p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Stay
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onGoBack) onGoBack();
                }}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reason selector for bad reply
  if (showReasonSelector) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => {
          // Close if clicking outside modal
          if (e.target === e.currentTarget) {
            handleCancel();
          }
        }}
      >
        <div className="bg-white rounded-xl max-w-sm w-full p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Select reason</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 p-1"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 mb-3">
            {BAD_REPLY_REASONS.map((reason) => (
              <button
                key={reason.label}
                onClick={() => setSelectedReason(reason.label)}
                type="button"
                className={`w-full p-2.5 rounded-lg border text-left text-sm transition-all ${
                  selectedReason === reason.label
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{reason.label}</span>
                  <span className="text-xs text-red-600 font-semibold">
                    {reason.penalty}%
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              type="button"
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedReason) {
                  onRate(false, selectedReason);
                  setShowReasonSelector(false);
                  setShowSuccess(true);
                }
              }}
              type="button"
              disabled={!selectedReason}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedReason
                  ? 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Scenario A: Good/Bad choice - MAIN SCREEN
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        // Close if clicking outside
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl max-w-sm w-full p-5">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Timer Expired!</h2>
          <p className="text-sm text-gray-600">Rate this conversation</p>
        </div>

        <div className="flex gap-3">
          {/* Good Reply Button */}
          <button
            onClick={() => {
              onRate(true);
              setShowSuccess(true);
            }}
            type="button"
            className="flex-1 p-4 rounded-lg border-2 border-green-200 hover:border-green-500 hover:bg-green-50 active:bg-green-100 transition-all"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ThumbsUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900 block">Good reply</span>
            <p className="text-xs text-green-600 mt-1">+10%</p>
          </button>

          {/* Bad Reply Button */}
          <button
            onClick={() => setShowReasonSelector(true)}
            type="button"
            className="flex-1 p-4 rounded-lg border-2 border-red-200 hover:border-red-500 hover:bg-red-50 active:bg-red-100 transition-all"
          >
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ThumbsDown className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900 block">Bad reply</span>
            <p className="text-xs text-red-600 mt-1">-10 to -30%</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
