/** Seed chat messages — keys are conversation ids (member id or 'general') */
export function buildInitialChat(team) {
  const now = Date.now();
  const hour = 60 * 60 * 1000;

  return {
    general: {
      messages: [
        {
          id: 1,
          senderId: 1,
          senderName: 'Alex Turner',
          text: 'Good morning team! Standup in 15 minutes.',
          createdAt: now - 3 * hour,
          read: true,
        },
        {
          id: 2,
          senderId: 3,
          senderName: 'Mike Chen',
          text: 'On it — finishing the API integration review.',
          createdAt: now - 2.5 * hour,
          read: true,
        },
        {
          id: 3,
          senderId: 6,
          senderName: 'Lisa Park',
          text: 'QA sprint for Mobile App MVP starts today.',
          createdAt: now - 2 * hour,
          read: false,
        },
      ],
      unread: 1,
    },
    '3': {
      messages: [
        {
          id: 10,
          senderId: 3,
          senderName: 'Mike Chen',
          text: 'Hey! Can you review the PR for the auth module?',
          createdAt: now - 1.5 * hour,
          read: false,
        },
      ],
      unread: 1,
    },
    '2': {
      messages: [
        {
          id: 20,
          senderId: 2,
          senderName: 'Sarah Kim',
          text: 'Updated the homepage wireframes — ready for feedback.',
          createdAt: now - 4 * hour,
          read: true,
        },
      ],
      unread: 0,
    },
    '5': {
      messages: [
        {
          id: 30,
          senderId: 5,
          senderName: 'Sam Rivera',
          text: 'CRM Dashboard deadline moved to Aug 15. Please adjust tasks.',
          createdAt: now - 5 * hour,
          read: false,
        },
      ],
      unread: 1,
    },
  };
}

export const CHAT_GENERAL_ID = 'general';
