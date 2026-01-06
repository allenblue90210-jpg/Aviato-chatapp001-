import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import ModeInfoDialog from '../components/profile/ModeInfoDialog';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { 
    currentUser, 
    logout, 
    deleteAllChats, 
    theme, 
    setTheme 
  } = useAppContext();
  const { toast } = useToast();
  
  // Always return to /chat as per request
  const returnTo = '/chat';
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showModeInfo, setShowModeInfo] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/signin');
    toast({ title: "Logged out successfully" });
  };

  const handleDeleteChats = () => {
    deleteAllChats();
    setShowDeleteModal(false);
    toast({ title: "All chats deleted" });
  };

  const showComingSoon = () => {
    toast({ title: "Coming soon!" });
  };

  const getModeDisplay = (mode) => {
    const modeMap = {
      green: '🟢 Available',
      red: '🔴 Locked',
      yellow: '🟡 Later',
      blue: '🔵 Open',
      orange: '🟠 Max Contact',
      gray: '⚪ Paused',
      brown: '🟤 Timed'
    };
    return modeMap[mode] || '🟢 Available';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center gap-3">
          <button 
            onClick={() => navigate(returnTo)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Profile Card */}
      <div 
        onClick={() => navigate('/profile')}
        className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
      >
        <img 
          src={currentUser?.profilePic || '/default-avatar.png'} 
          alt={currentUser?.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
        />
        <div className="flex-1">
          <div className="text-base font-semibold text-gray-900">
            {currentUser?.name || 'Allen Brown'}
          </div>
          <div className="text-sm text-gray-500">View Profile</div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Availability Section */}
      <div className="px-4 py-3 mt-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Availability
        </h2>
      </div>
      <div className="bg-white mx-4 mt-2 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => setShowModeInfo(true)}
          className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🎨</span>
            <div className="text-left">
              <div className="font-medium text-base text-gray-900">Profile Set Regulation</div>
              <div className="text-sm text-gray-500">
                Current: {getModeDisplay(currentUser?.availabilityMode)}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* App Section */}
      <div className="px-4 py-3 mt-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          App
        </h2>
      </div>
      <div className="bg-white mx-4 mt-2 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <SettingRow icon="🌐" label="Language" value="English" onClick={showComingSoon} />
        <SettingRow 
            icon="☀️" 
            label="Theme" 
            value={theme ? (theme.charAt(0).toUpperCase() + theme.slice(1)) : 'System'} 
            onClick={() => setShowThemeModal(true)} 
        />
        <SettingRow icon="🔊" label="Voice" value="Katerina" onClick={showComingSoon} />
        <SettingRow icon="🎨" label="Personalization" onClick={showComingSoon} />
      </div>

      {/* About Section */}
      <div className="px-4 py-3 mt-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          About
        </h2>
      </div>
      <div className="bg-white mx-4 mt-2 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <SettingRow icon="📚" label="Model" onClick={showComingSoon} />
        <SettingRow icon="📄" label="Terms of Service" onClick={showComingSoon} />
        <SettingRow icon="🔒" label="Privacy Policy" onClick={showComingSoon} />
        <SettingRow icon="ℹ️" label="About" onClick={showComingSoon} />
      </div>

      {/* Contact Section */}
      <div className="bg-white mx-4 mt-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <SettingRow icon="💬" label="Contact Us" onClick={showComingSoon} />
      </div>

      {/* Danger Zone */}
      <div className="bg-white mx-4 mt-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <SettingRow 
          icon="🚪" 
          label="Log out" 
          onClick={() => setShowLogoutModal(true)} 
          showArrow={false}
          isDanger={true}
        />
      </div>

      <div className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <SettingRow 
          icon="🗑️" 
          label="Delete all chats" 
          onClick={() => setShowDeleteModal(true)} 
          showArrow={false}
          isDanger={true}
        />
      </div>

      {/* Theme Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Theme</h3>
            
            <div className="space-y-2">
              {['light', 'dark', 'system'].map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => {
                    setTheme(themeOption);
                    setShowThemeModal(false);
                    toast({ title: `Theme updated to ${themeOption}` });
                  }}
                  className={`
                    w-full px-4 py-3 rounded-lg text-left flex items-center justify-between
                    transition-colors
                    ${theme === themeOption 
                      ? 'bg-blue-50 text-blue-600 border-2 border-blue-500' 
                      : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="capitalize font-medium">{themeOption}</span>
                  {theme === themeOption && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowThemeModal(false)}
              className="mt-4 w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Log out?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Delete all chats?
            </h3>
            <div className="flex items-start gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-600">
                This action cannot be undone. All your conversations will be permanently deleted.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteChats}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode Info Modal */}
      <ModeInfoDialog 
        isOpen={showModeInfo}
        onClose={() => setShowModeInfo(false)}
      />
    </div>
  );
}

function SettingRow({ 
  icon, 
  label, 
  value, 
  onClick, 
  showArrow = true,
  isDanger = false 
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full px-4 py-4 flex items-center justify-between 
        border-b border-gray-100 last:border-b-0
        transition-colors cursor-pointer
        ${isDanger 
          ? 'text-red-600 hover:bg-red-50 font-medium justify-center' 
          : 'hover:bg-gray-50 text-gray-900'
        }
      `}
    >
      {!isDanger && (
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-medium text-base">{label}</span>
        </div>
      )}
      
      {isDanger && (
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span>{label}</span>
        </div>
      )}
      
      {!isDanger && (
        <div className="flex items-center gap-2">
          {value && (
            <span className="text-sm text-gray-500">{value}</span>
          )}
          {showArrow && (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      )}
    </button>
  );
}
