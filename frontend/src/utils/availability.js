
import { AvailabilityMode } from '../data/mockData';

export function checkUserAvailability(user) {
  const now = new Date();
  
  if (!user) return { available: false, reason: "User not found", modeColor: "#9CA3AF", statusText: "Offline" };

  // INVISIBLE MODE (Default / Null)
  if (!user.availabilityMode) {
    return {
      available: true,
      reason: "User can receive messages",
      modeColor: "#E5E7EB", // light gray (neutral)
      statusText: "" 
    };
  }

  // Red - Locked (Blocked)
  if (user.availabilityMode === AvailabilityMode.RED) {
    return {
      available: false,
      reason: "User is locked",
      modeColor: "#DC2626", // red
      statusText: "Locked"
    };
  }
  
  // Gray - Paused (Blocked)
  if (user.availabilityMode === AvailabilityMode.GRAY) {
    return {
      available: false,
      reason: "User is paused",
      modeColor: "#9CA3AF", // gray
      statusText: "Paused"
    };
  }
  
  // Blue mode - check date (Blocked if future)
  if (user.availabilityMode === AvailabilityMode.BLUE && user.availability?.openDate) {
    const openDate = new Date(user.availability.openDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (openDate > today) {
      return {
        available: false, 
        reason: `Available from ${openDate.toLocaleDateString()}`,
        modeColor: "#0066FF", // blue
        statusText: `Active from ${openDate.toLocaleDateString()}`
      };
    }
  }
  
  // Brown mode - check time (Blocked if wrong time)
  if (user.availabilityMode === AvailabilityMode.BROWN && 
      user.availability?.timedHour !== null) {
    const availableTime = new Date();
    availableTime.setHours(user.availability.timedHour);
    availableTime.setMinutes(user.availability.timedMinute || 0);
    availableTime.setSeconds(0);
    
    // Check if current hour is before the allowed hour
    // (Simplistic check based on prompt "Available at X")
    const currentHour = now.getHours();
    
    if (currentHour < user.availability.timedHour) {
      return {
        available: false,
        reason: `Available at ${availableTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        modeColor: "#92400E", // brown
        statusText: `Until ${availableTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      };
    }
  }
  
  // Orange mode - check max contacts (Blocked if max reached)
  if (user.availabilityMode === AvailabilityMode.ORANGE) {
    if (user.availability.currentContacts >= user.availability.maxContact) {
      return {
        available: false,
        reason: "Max contacts reached",
        modeColor: "#F97316", // orange
        statusText: "Max contacts reached"
      };
    }
  }
  
  // Green, Yellow, or others meeting conditions -> Available
  return {
    available: true,
    reason: "Available now",
    modeColor: getModeColor(user.availabilityMode),
    statusText: user.availabilityMode === AvailabilityMode.GREEN ? "Online now" : "Active"
  };
}

export function getModeColor(mode) {
  const colorMap = {
    [AvailabilityMode.BLUE]: "#0066FF", // blue
    [AvailabilityMode.YELLOW]: "#FBBF24", // yellow
    [AvailabilityMode.ORANGE]: "#F97316", // orange
    [AvailabilityMode.GREEN]: "#10B981", // green
    [AvailabilityMode.RED]: "#DC2626", // red
    [AvailabilityMode.GRAY]: "#9CA3AF", // gray
    [AvailabilityMode.BROWN]: "#92400E" // brown
  };
  
  return colorMap[mode] || "#E5E7EB"; 
}

export function calculateMatchPercentage(userSelections, otherSelections) {
  if (!userSelections || !otherSelections) return 0;
  const common = userSelections.filter(item => 
    otherSelections.includes(item)
  );
  return Math.round((common.length / 5) * 100);
}

export function getApprovalColor(rating) {
  if (rating <= 0) return 'text-red-700'; // Blood red
  if (rating < 11) return 'text-yellow-500';
  return 'text-green-600';
}
