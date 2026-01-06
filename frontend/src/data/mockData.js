
export const AvailabilityMode = {
  BLUE: 'blue', // Open mode - date picker
  YELLOW: 'yellow', // Later mode - duration
  ORANGE: 'orange', // Max contact mode
  GREEN: 'green', // Available now (online)
  RED: 'red', // Locked indefinitely
  GRAY: 'gray', // Paused indefinitely
  BROWN: 'brown' // Timed mode - specific time
};

export const mockUsers = [
  {
    id: "1",
    name: "Asuab",
    location: "Los Angeles",
    vibe: "Vibe coder",
    profilePic: "https://i.pravatar.cc/150?u=1",
    selections: ["Metal Gear 1", "Metal Gear 2", "Zelda", "Mario", "Pokemon"],
    approvalRating: 54,
    reviewRating: 4.5,
    reviewCount: 12,
    availabilityMode: AvailabilityMode.GREEN, 
    availability: {
      openDate: null,
      laterMinutes: 0,
      maxContact: 10,
      currentContacts: 2,
      timedHour: null,
      timedMinute: null
    }
  },
  {
    id: "2",
    name: "Sussie",
    location: "Miami",
    vibe: "Vibe coder",
    profilePic: "https://i.pravatar.cc/150?u=2",
    selections: ["Metal Gear 1", "Metal Gear 2", "Metal Gear 3", "Final Fantasy", "Sonic"],
    approvalRating: 89,
    reviewRating: 4.8,
    reviewCount: 25,
    availabilityMode: AvailabilityMode.YELLOW, 
    availability: {
      openDate: null,
      laterMinutes: 120,
      maxContact: 10,
      currentContacts: 5,
      timedHour: null,
      timedMinute: null
    }
  },
  {
    id: "3",
    name: "Katie",
    location: "Charlotte",
    vibe: "Gamer",
    profilePic: "https://i.pravatar.cc/150?u=3",
    selections: ["Resident Evil", "Silent Hill", "Metal Gear 3", "Pokemon", "Zelda"],
    approvalRating: 99,
    reviewRating: 4.9,
    reviewCount: 45,
    availabilityMode: AvailabilityMode.ORANGE, 
    availability: {
      openDate: null,
      laterMinutes: 0,
      maxContact: 3,
      currentContacts: 3, 
      timedHour: null,
      timedMinute: null
    }
  },
  {
    id: "4",
    name: "Sadie",
    location: "Sofia",
    vibe: "Designer",
    profilePic: "https://i.pravatar.cc/150?u=4",
    selections: ["Art", "Design", "Photography", "Travel", "Music"],
    approvalRating: 75,
    reviewRating: 4.3,
    reviewCount: 18,
    availabilityMode: AvailabilityMode.BLUE, 
    availability: {
      openDate: "2026-01-20", 
      laterMinutes: 0,
      maxContact: 7,
      currentContacts: 0,
      timedHour: null,
      timedMinute: null
    }
  },
  {
    id: "5",
    name: "Billie",
    location: "Kiev",
    vibe: "Developer",
    profilePic: "https://i.pravatar.cc/150?u=5",
    selections: ["Coding", "Music", "Gaming", "Sports", "Travel"],
    approvalRating: 10,
    reviewRating: 2.1,
    reviewCount: 8,
    availabilityMode: AvailabilityMode.RED, 
    availability: {
      openDate: null,
      laterMinutes: 0,
      maxContact: 0,
      currentContacts: 0,
      timedHour: null,
      timedMinute: null
    }
  },
  {
    id: "6",
    name: "John",
    location: "New York",
    vibe: "Photographer",
    profilePic: "https://i.pravatar.cc/150?u=6",
    selections: ["Photography", "Art", "Travel", "Music", "Design"],
    approvalRating: 120,
    reviewRating: 4.9,
    reviewCount: 67,
    availabilityMode: AvailabilityMode.GREEN, 
    availability: {
      openDate: null,
      laterMinutes: 0,
      maxContact: 15,
      currentContacts: 8,
      timedHour: null,
      timedMinute: null
    }
  },
  {
    id: "7",
    name: "Emma",
    location: "London",
    vibe: "Writer",
    profilePic: "https://i.pravatar.cc/150?u=7",
    selections: ["Writing", "Reading", "Coffee", "Music", "Travel"],
    approvalRating: 85,
    reviewRating: 4.6,
    reviewCount: 32,
    availabilityMode: AvailabilityMode.BROWN, 
    availability: {
      openDate: null,
      laterMinutes: 0,
      maxContact: 8,
      currentContacts: 3,
      timedHour: 21, 
      timedMinute: 0
    }
  },
  {
    id: "8",
    name: "Marcus",
    location: "Berlin",
    vibe: "DJ",
    profilePic: "https://i.pravatar.cc/150?u=8",
    selections: ["Music", "DJing", "Nightlife", "Travel", "Art"],
    approvalRating: 45,
    reviewRating: 3.2,
    reviewCount: 15,
    availabilityMode: AvailabilityMode.GRAY, 
    availability: {
      openDate: null,
      laterMinutes: 0,
      maxContact: 20,
      currentContacts: 0,
      timedHour: null,
      timedMinute: null
    }
  },
  {
    id: "9",
    name: "Sophia",
    location: "Tokyo",
    vibe: "Anime Fan",
    profilePic: "https://i.pravatar.cc/150?u=9",
    selections: ["Anime", "Gaming", "Cosplay", "Art", "Japanese Culture"],
    approvalRating: 95,
    reviewRating: 4.7,
    reviewCount: 28,
    availabilityMode: AvailabilityMode.YELLOW, 
    availability: {
      openDate: null,
      laterMinutes: 45,
      maxContact: 6,
      currentContacts: 2,
      timedHour: null,
      timedMinute: null
    }
  },
  {
    id: "10",
    name: "David",
    location: "Sydney",
    vibe: "Surfer",
    profilePic: "https://i.pravatar.cc/150?u=10",
    selections: ["Surfing", "Beach", "Travel", "Photography", "Nature"],
    approvalRating: -15,
    reviewRating: 1.8,
    reviewCount: 22,
    availabilityMode: AvailabilityMode.BLUE, 
    availability: {
      openDate: "2026-01-10",
      laterMinutes: 0,
      maxContact: 2,
      currentContacts: 0,
      timedHour: null,
      timedMinute: null
    }
  }
];

export const mockInterests = [
  "Metal Gear 1", "Metal Gear 2", "Metal Gear 3", "Metal Gear 4", "Metal Gear 5",
  "Zelda", "Mario", "Pokemon", "Final Fantasy", "Sonic",
  "Resident Evil", "Silent Hill", "Call of Duty", "FIFA", "GTA",
  "Coding", "Music", "Gaming", "Sports", "Travel",
  "Art", "Design", "Photography", "Reading", "Writing",
  "Coffee", "Nightlife", "Beach", "Hiking", "Cooking",
  "Fitness", "Yoga", "Dancing", "Singing", "Drawing",
  "Anime", "Movies", "TV Shows", "Cosplay", "Japanese Culture",
  "Fashion", "Food", "Wine", "Beer", "Technology"
];
