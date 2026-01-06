import React from 'react';
import { Switch } from '../ui/switch';

const ModeCard = ({
  mode,
  icon,
  name,
  description,
  isActive,
  settings,
  onToggle,
  onEdit
}) => {
  return (
    <div 
      className={`
        w-full text-left p-4 rounded-lg border-2 transition-all duration-200
        ${isActive 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          {/* Mode Icon */}
          <span className="text-3xl leading-none">{icon}</span>
          
          {/* Mode Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {name}
            </h3>
            <p className="text-sm text-gray-600">
              {description}
            </p>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex flex-col items-end gap-2">
          <Switch 
            checked={isActive}
            onCheckedChange={(checked) => onToggle(mode, checked)}
            className={isActive ? "bg-blue-600" : "bg-gray-300"}
          />
          {isActive ? (
            <span className="px-3 py-1 rounded-full font-bold text-xs bg-green-100 text-green-700 border border-green-500">
              ACTIVE
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full font-bold text-xs bg-gray-100 text-gray-600 border border-gray-300">
              INACTIVE
            </span>
          )}
        </div>
      </div>

      {/* Active State Content */}
      {isActive && settings && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm text-green-700 font-medium flex items-center gap-1">
              ✓ {settings}
            </span>
            
            {onEdit && (
              <button
                onClick={() => onEdit(mode)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Active but no settings text (e.g. Green Mode) */}
      {isActive && !settings && (
        <div className="mt-3 pt-3 border-t border-blue-200">
           <span className="text-sm text-green-700 font-medium">
              ✓ Active
           </span>
        </div>
      )}
    </div>
  );
};

export default ModeCard;
