import React, { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetFooter
} from '../ui/sheet';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { mockInterests } from '../../data/mockData';
import { Check, X } from 'lucide-react';

const CategorySelector = ({ 
  isOpen, 
  onClose, 
  currentSelected, 
  onApply,
  maxSelections = 5,
  title = "Select any choice"
}) => {
  const [localSelected, setLocalSelected] = useState([]);

  // Sync local state with prop when sheet opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected([...currentSelected]);
    }
  }, [isOpen, currentSelected]);

  const toggleInterest = (interest) => {
    setLocalSelected(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      } else {
        if (prev.length >= maxSelections) return prev; 
        return [...prev, interest];
      }
    });
  };

  const handleClear = () => {
    setLocalSelected([]);
  };

  const handleApply = () => {
    onApply(localSelected);
    onClose(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose(false)}>
      <SheetContent 
        side="bottom" 
        className="flex flex-col rounded-t-xl bg-white p-0 [&>button]:hidden h-[85vh] max-h-[85vh]"
      >
        {/* Header - Fixed at Top */}
        <div className="flex-none h-14 border-b border-gray-100 flex items-center justify-center relative bg-white rounded-t-xl z-10 px-4">
          
          {/* Centered Title */}
          <div className="font-bold text-gray-900 text-lg">
            {title}
          </div>

          {/* Cancel Button - Absolute Right */}
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => onClose(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            Cancel
          </Button>
        </div>
        
        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-hidden relative bg-white flex flex-col">
          {/* Count & Clear - Sticky within content */}
          <div className="flex-none px-6 py-3 flex items-center justify-between bg-white z-10">
            <span className="text-sm font-medium text-gray-600">
              Selected: <span className="text-blue-600 font-bold">{localSelected.length}/{maxSelections}</span>
            </span>
            {localSelected.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClear}
                className="text-red-500 hover:text-red-600 h-8 px-2 text-xs uppercase font-bold"
              >
                Clear all
              </Button>
            )}
          </div>
          
          <ScrollArea className="flex-1 px-6 pb-4">
            <div className="flex flex-wrap gap-2 pb-4">
              {mockInterests.slice(0, 20).map((interest) => {
                const isSelected = localSelected.includes(interest);
                return (
                  <div
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`
                      cursor-pointer px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200 select-none
                      flex items-center gap-1.5
                      ${isSelected 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }
                    `}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    {interest}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Footer - Fixed at Bottom */}
        <SheetFooter className="flex-none px-6 py-4 border-t border-gray-100 bg-white flex gap-3 flex-row justify-end z-10">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none h-12 text-lg font-medium border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900" 
            onClick={() => onClose(false)}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 sm:flex-none sm:min-w-[150px] bg-blue-600 hover:bg-blue-700 h-12 text-lg font-medium shadow-md" 
            onClick={handleApply}
          >
            Apply ({localSelected.length})
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CategorySelector;
