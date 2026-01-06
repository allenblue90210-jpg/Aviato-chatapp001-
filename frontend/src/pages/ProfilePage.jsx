import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Settings, Camera, Edit2, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import ModeCard from '../components/profile/ModeCard';
import ModeSettingsDialog from '../components/profile/ModeSettingsDialog';
import CategorySelector from '../components/availability/CategorySelector';
import { AvailabilityMode } from '../data/mockData';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, setAvailabilityMode, showToast, updateUserSelections } = useAppContext();
  
  // State for modals
  const [deactivateMode, setDeactivateMode] = useState(null);
  const [settingsMode, setSettingsMode] = useState(null);
  const [confirmRedMode, setConfirmRedMode] = useState(false);
  const [isInterestsOpen, setIsInterestsOpen] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const currentMode = currentUser.availabilityMode;

  const handleInterestsApply = (newSelections) => {
    updateUserSelections(newSelections);
  };

  const modes = [
    {
      mode: AvailabilityMode.GREEN,
      icon: '🟢',
      name: 'Available Mode',
      description: 'Online and ready to chat',
      color: '#10B981'
    },
    {
      mode: AvailabilityMode.BLUE,
      icon: '🔵',
      name: 'Open Mode',
      description: 'Available from specific date',
      color: '#0066FF'
    },
    {
      mode: AvailabilityMode.YELLOW,
      icon: '🟡',
      name: 'Later Mode',
      description: 'Available for limited duration',
      color: '#FBBF24'
    },
    {
      mode: AvailabilityMode.ORANGE,
      icon: '🟠',
      name: 'Max Contact Mode',
      description: 'Limit number of contacts',
      color: '#F97316'
    },
    {
      mode: AvailabilityMode.RED,
      icon: '🔴',
      name: 'Locked Mode',
      description: 'Completely unavailable',
      color: '#DC2626'
    },
    {
      mode: AvailabilityMode.GRAY,
      icon: '⚪',
      name: 'Pause Mode',
      description: 'Temporarily paused',
      color: '#9CA3AF'
    },
    {
      mode: AvailabilityMode.BROWN,
      icon: '🟤',
      name: 'Timed Mode',
      description: 'Available at specific time',
      color: '#92400E'
    }
  ];

  const getModeName = (mode) => {
    const found = modes.find(m => m.mode === mode);
    return found ? found.name : 'Unknown Mode';
  };

  const handleToggle = (mode, checked) => {
    if (checked) {
      // Activating Logic
      const needsSettings = [
        AvailabilityMode.BLUE,
        AvailabilityMode.YELLOW,
        AvailabilityMode.ORANGE,
        AvailabilityMode.BROWN
      ].includes(mode);

      if (needsSettings) {
        setSettingsMode(mode);
      } else if (mode === AvailabilityMode.RED) {
        setConfirmRedMode(true);
      } else {
        // Green or Gray - Activate immediately
        setAvailabilityMode(mode, { suppressToast: true });
        
        if (mode === AvailabilityMode.GREEN) {
           showToast('✅ Green Mode is now ACTIVE!\nVisible to everyone', 'success');
        } else {
           showToast(`✅ ${getModeName(mode)} is now ACTIVE!`, 'success');
        }
      }
    } else {
      // Deactivating Logic
      setDeactivateMode(mode);
    }
  };

  const confirmDeactivate = () => {
    if (deactivateMode) {
      setAvailabilityMode(null); // Set to Invisible (null)
      showToast(`✅ ${getModeName(deactivateMode)} is now INACTIVE!\nYou are now Invisible`, 'success');
      setDeactivateMode(null);
    }
  };

  const handleEdit = (mode) => {
    setSettingsMode(mode);
  };

  // Helper function to get settings text for active mode
  const getActiveSettings = (mode) => {
    if (currentUser.availabilityMode !== mode) return undefined;

    switch(mode) {
      case AvailabilityMode.BLUE:
        return currentUser.availability.openDate 
          ? `Opens ${new Date(currentUser.availability.openDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
          : undefined;
      
      case AvailabilityMode.YELLOW:
        if (currentUser.availability.laterStartTime) {
            const elapsed = Math.floor((Date.now() - currentUser.availability.laterStartTime) / 60000);
            const remaining = Math.max(0, currentUser.availability.laterMinutes - elapsed);
            return `Expires in ${remaining} minutes`;
        }
        return currentUser.availability.laterMinutes 
          ? `Expires in ${currentUser.availability.laterMinutes} minutes`
          : undefined;
      
      case AvailabilityMode.ORANGE:
        return `${currentUser.availability.currentContacts}/${currentUser.availability.maxContact} slots available`;
      
      case AvailabilityMode.BROWN:
        return currentUser.availability.timedHour !== null
          ? `Opens at ${formatTime(currentUser.availability.timedHour, currentUser.availability.timedMinute || 0)}`
          : undefined;
      
      case AvailabilityMode.GREEN:
        return 'Visible to everyone';
      
      case AvailabilityMode.RED:
        return 'All messaging blocked';
      
      case AvailabilityMode.GRAY:
        return 'Messaging paused';
      
      default:
        return undefined;
    }
  };

  const formatTime = (hour, minute) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  // Helper for mode colors/emojis
  function getModeColor(mode) {
    const colors = {
      blue: '#0066FF',
      yellow: '#FBBF24',
      orange: '#F97316',
      green: '#10B981',
      red: '#DC2626',
      gray: '#9CA3AF',
      brown: '#92400E'
    };
    return colors[mode] || '#10B981';
  }

  function getModeEmoji(mode) {
    const emojis = {
      blue: '🔵',
      yellow: '🟡',
      orange: '🟠',
      green: '🟢',
      red: '🔴',
      gray: '⚪',
      brown: '🟤'
    };
    return emojis[mode] || '🟢';
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Top Bar */}
      <div className="bg-white p-4 sticky top-0 border-b border-gray-100 z-10 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <Settings className="w-6 h-6 text-gray-700" />
          </Button>
          <Button variant="ghost" size="icon">
            <Camera className="w-6 h-6 text-gray-700" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Info */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <img 
              src={currentUser.profilePic} 
              alt="Profile" 
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md" 
            />
            <div 
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-md border border-gray-100"
            >
              <span className="text-sm font-medium text-gray-600">Edit</span>
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{currentUser.name}</h2>
          <p className="text-gray-500">{currentUser.location || 'San Francisco, CA'}</p>
        </div>

        {/* My Vibe / Interests Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg text-gray-900">My Vibe ({currentUser.selections?.length || 0}/5)</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
              onClick={() => setIsInterestsOpen(true)}
            >
              {currentUser.selections?.length > 0 ? 'Edit' : 'Add'}
            </Button>
          </div>
          
          <div 
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm min-h-[80px] cursor-pointer hover:border-blue-300 transition-colors"
            onClick={() => setIsInterestsOpen(true)}
          >
            {currentUser.selections?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentUser.selections.map((interest) => (
                  <Badge 
                    key={interest} 
                    variant="secondary" 
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 px-3 py-1"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 text-gray-400 gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-sm">Add up to 5 interests to find matches</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Set Regulation */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Profile Set Regulation</h3>
          
          {/* VISIBILITY STATUS BANNER */}
          <div className="mb-6 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">YOUR VISIBILITY STATUS</h4>
            </div>
            
            {currentMode ? (
               <div className="p-4 flex items-center gap-3 bg-white">
                 <div 
                   className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                   style={{ backgroundColor: getModeColor(currentMode) + '20' }}
                 >
                   {getModeEmoji(currentMode)}
                 </div>
                 <div>
                   <div className="font-bold text-gray-900">{getModeName(currentMode)} - ACTIVE</div>
                   <div className="text-sm text-green-600 font-medium">{getActiveSettings(currentMode) || 'Active'}</div>
                 </div>
               </div>
            ) : (
               <div className="p-4 bg-white">
                 <div className="flex items-center gap-3 mb-2">
                   <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                     👻
                   </div>
                   <div>
                     <div className="font-bold text-gray-900">Invisible Mode - ACTIVE</div>
                     <div className="text-xs text-gray-500">Default State</div>
                   </div>
                 </div>
                 <p className="text-sm text-gray-600 leading-relaxed">
                   You can <span className="font-semibold text-green-700">receive messages</span> but appear <span className="font-semibold text-gray-700">offline</span> to others.
                 </p>
               </div>
            )}
          </div>
          
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Select Your Availability Mode</h4>
          
          <div className="space-y-3">
            {modes.map((modeData) => (
              <ModeCard
                key={modeData.mode}
                mode={modeData.mode}
                icon={modeData.icon}
                name={modeData.name}
                description={modeData.description}
                color={modeData.color}
                isActive={currentUser.availabilityMode === modeData.mode}
                settings={getActiveSettings(modeData.mode)}
                onToggle={handleToggle}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <ModeSettingsDialog 
         mode={settingsMode}
         isOpen={!!settingsMode}
         onClose={() => setSettingsMode(null)}
      />

      {/* Interests Selector Modal */}
      <CategorySelector
        isOpen={isInterestsOpen}
        onClose={setIsInterestsOpen}
        currentSelected={currentUser.selections || []}
        onApply={handleInterestsApply}
        maxSelections={5}
        title="My Vibe (Max 5)"
      />

      {/* Red Mode Confirmation */}
      <AlertDialog open={confirmRedMode} onOpenChange={setConfirmRedMode}>
        <AlertDialogContent className="max-w-[90vw] w-full rounded-xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Activate Locked Mode?</AlertDialogTitle>
            <AlertDialogDescription>
              All messaging will be blocked. You will not receive any new messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2 justify-end">
            <AlertDialogCancel className="mt-0 flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setAvailabilityMode(AvailabilityMode.RED, { suppressToast: true });
                showToast('✅ Locked Mode is now ACTIVE!\nAll messaging blocked', 'success');
                setConfirmRedMode(false);
              }} 
              className="bg-red-600 hover:bg-red-700 text-white flex-1"
            >
              Lock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate Confirmation */}
      <AlertDialog open={!!deactivateMode} onOpenChange={(open) => !open && setDeactivateMode(null)}>
        <AlertDialogContent className="max-w-[90vw] w-full rounded-xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate {deactivateMode && getModeName(deactivateMode)}?</AlertDialogTitle>
            <AlertDialogDescription>
              You will switch to Invisible Mode 👻.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2 justify-end">
            <AlertDialogCancel className="mt-0 flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeactivate} 
              className="bg-red-600 hover:bg-red-700 text-white flex-1"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
