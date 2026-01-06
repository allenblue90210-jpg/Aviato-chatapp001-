
export const getInitialMockConversations = () => {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;
  
  return [
    {
      id: "c1",
      userId: "1", // Asuab (Green)
      messages: [
        { id: "m1", senderId: "1", text: "Hey! How's it going?", timestamp: now - (2.5 * hour) - 600000, read: true },
        { id: "m2", senderId: "current-user", text: "Pretty good! Just working on some projects", timestamp: now - (2.5 * hour) - 300000, read: true },
        { id: "m3", senderId: "1", text: "Nice! What kind of projects?", timestamp: now - (2.5 * hour) - 180000, read: true },
        { id: "m4", senderId: "current-user", text: "Building a new app, it's been fun", timestamp: now - (2.5 * hour) - 60000, read: true },
        { id: "m5", senderId: "1", text: "That's awesome! Would love to hear more about it", timestamp: now - (2.5 * hour), read: true },
        { id: "m6", senderId: "current-user", text: "I'll show you the prototype soon", timestamp: now - (0.1 * hour), read: true },
        { id: "m7", senderId: "1", text: "Hey, how are you doing?", timestamp: now, read: false }
      ],
      timerStarted: null, // Timer not started - starts when user sends message
      timerExpired: false,
      rated: false,
      lastMessage: "Hey, how are you doing?",
      lastMessageTime: now,
      lastMessageSenderId: "1",
      waitingForResponse: false,
      theyRespondedLast: true,
      previousMode: "green"
    },
    {
      id: "c2",
      userId: "2", // Sussie (Yellow)
      messages: [
        { id: "m1", senderId: "2", text: "Hi there! Nice vibe.", timestamp: now - (6 * hour), read: true },
        { id: "m2", senderId: "current-user", text: "Thanks! You too.", timestamp: now - (5.8 * hour), read: true },
        { id: "m3", senderId: "2", text: "Do you like hiking?", timestamp: now - (5.5 * hour), read: true },
        { id: "m4", senderId: "current-user", text: "Love it. Going this weekend actually.", timestamp: now - (5.2 * hour), read: true },
        { id: "m5", senderId: "2", text: "Thanks for the recommendation!", timestamp: now - (5.1 * hour), read: true }
      ],
      timerStarted: null, // Timer not started - starts when user sends message
      timerExpired: false,
      rated: false,
      lastMessage: "Thanks for the recommendation!",
      lastMessageTime: now - (5.1 * hour),
      lastMessageSenderId: "2",
      waitingForResponse: false,
      theyRespondedLast: true,
      previousMode: "yellow"
    },
    {
      id: "c3",
      userId: "6", // John (Green)
      messages: [
        { id: "m1", senderId: "6", text: "Yo, nice photos.", timestamp: now - (24 * hour), read: true },
        { id: "m2", senderId: "current-user", text: "Appreciate it man. You shoot too?", timestamp: now - (23.5 * hour), read: true },
        { id: "m3", senderId: "6", text: "Yeah, mostly street photography.", timestamp: now - (23 * hour), read: true },
        { id: "m4", senderId: "current-user", text: "See you later", timestamp: now - (5.5 * hour), read: true }
      ],
      timerStarted: null, // Timer not started - starts when user sends message
      timerExpired: false,
      rated: false,
      lastMessage: "You: See you later",
      lastMessageTime: now - (5.5 * hour),
      lastMessageSenderId: "current-user",
      waitingForResponse: true,
      theyRespondedLast: false,
      previousMode: "green"
    },
    {
      id: "c4",
      userId: "5", // Billie (Red - Locked)
      messages: [
        { id: "m1", senderId: "5", text: "Catch up soon!", timestamp: now - (3 * day), read: true }
      ],
      timerStarted: null,
      timerExpired: false,
      rated: false,
      lastMessage: "Catch up soon!",
      lastMessageTime: now - (3 * day),
      lastMessageSenderId: "5",
      waitingForResponse: false,
      theyRespondedLast: true,
      previousMode: "red"
    },
    {
      id: "c5",
      userId: "3", // Katie (Orange)
      messages: [
        { id: "m1", senderId: "3", text: "Resident Evil 4 remake is amazing.", timestamp: now - (5 * day), read: true },
        { id: "m2", senderId: "current-user", text: "I know right??", timestamp: now - (5 * day) + 60000, read: true },
        { id: "m3", senderId: "3", text: "That sounds amazing!", timestamp: now - (5 * day) + 120000, read: true }
      ],
      timerStarted: null,
      timerExpired: false,
      rated: false,
      lastMessage: "That sounds amazing!",
      lastMessageTime: now - (5 * day) + 120000,
      lastMessageSenderId: "3",
      waitingForResponse: false,
      theyRespondedLast: true,
      previousMode: "orange"
    },
    {
      id: "c6",
      userId: "7", // Emma (Brown - Timed)
      messages: [
        { id: "m1", senderId: "7", text: "Are you free later?", timestamp: now - (2 * day), read: true },
        { id: "m2", senderId: "current-user", text: "Let me know when", timestamp: now - (2 * day) + 60000, read: true }
      ],
      timerStarted: null,
      timerExpired: false,
      rated: false,
      lastMessage: "You: Let me know when",
      lastMessageTime: now - (2 * day) + 60000,
      lastMessageSenderId: "current-user",
      waitingForResponse: true,
      theyRespondedLast: false,
      previousMode: "brown"
    },
    {
      id: "c7",
      userId: "8", // Marcus (Gray - Paused)
      messages: [
        { id: "m1", senderId: "8", text: "Did you hear the new album?", timestamp: now - (4.25 * hour), read: true },
        { id: "m2", senderId: "current-user", text: "Not yet! Is it good?", timestamp: now - (4.2 * hour), read: true },
        { id: "m3", senderId: "8", text: "Love that track!", timestamp: now - (4.15 * hour), read: true }
      ],
      timerStarted: null,
      timerExpired: false,
      rated: false,
      lastMessage: "Love that track!",
      lastMessageTime: now - (4.15 * hour),
      lastMessageSenderId: "8",
      waitingForResponse: false,
      theyRespondedLast: true,
      previousMode: "gray"
    }
  ];
};
