// ProjectX OS — AI Actions
// Enables AI to perform actions for users (navigation, data display, tasks)

export type AIActionType = 
  | 'navigate' 
  | 'display_data' 
  | 'show_component' 
  | 'confirm_action'
  | 'text_only';

export interface AIAction {
  type: AIActionType;
  payload: Record<string, unknown>;
  label?: string; // Human-readable action description
}

export interface ActionableResponse {
  text: string;
  action?: AIAction;
  suggestions?: string[];
}

// =============================================================================
// ACTION PATTERNS - Detect user intent and map to actions
// =============================================================================

interface ActionPattern {
  patterns: RegExp[];
  action: AIAction;
  response: string;
}

const ACTION_PATTERNS: ActionPattern[] = [
  // Navigation actions
  {
    patterns: [
      /take me to (login|sign in)/i,
      /go to (login|sign in)/i,
      /i want to (login|sign in)/i,
    ],
    action: { type: 'navigate', payload: { path: '/login' }, label: 'Go to Login' },
    response: "Taking you to the login page now...",
  },
  {
    patterns: [
      /take me to (my )?missions/i,
      /show (my )?missions/i,
      /go to (my )?missions/i,
    ],
    action: { type: 'navigate', payload: { path: '/student' }, label: 'View Missions' },
    response: "Opening your missions dashboard...",
  },
  {
    patterns: [
      /take me to (my )?dashboard/i,
      /show (my )?dashboard/i,
      /go to dashboard/i,
    ],
    action: { type: 'navigate', payload: { path: '/student' }, label: 'View Dashboard' },
    response: "Opening your dashboard...",
  },
  {
    patterns: [
      /take me to review/i,
      /show review queue/i,
      /pending reviews/i,
    ],
    action: { type: 'navigate', payload: { path: '/teacher' }, label: 'Teacher Review' },
    response: "Opening the review queue...",
  },
  {
    patterns: [
      /show (the )?manifesto/i,
      /read (the )?manifesto/i,
      /take me to manifesto/i,
    ],
    action: { type: 'navigate', payload: { path: '/manifesto' }, label: 'Read Manifesto' },
    response: "Opening the ProjectX Manifesto...",
  },
  {
    patterns: [
      /go (to )?(home|homepage)/i,
      /take me home/i,
      /back to home/i,
    ],
    action: { type: 'navigate', payload: { path: '/' }, label: 'Go Home' },
    response: "Taking you back to the homepage...",
  },
  
  // Data display actions
  {
    patterns: [
      /what('?s| is) my xp/i,
      /show (my )?xp/i,
      /how much xp/i,
      /my (current )?level/i,
    ],
    action: { 
      type: 'display_data', 
      payload: { dataType: 'xp_stats' },
      label: 'Show XP Stats' 
    },
    response: "Here are your current stats:",
  },
  {
    patterns: [
      /show (my )?badges/i,
      /what badges/i,
      /my (earned )?badges/i,
    ],
    action: { 
      type: 'display_data', 
      payload: { dataType: 'badges' },
      label: 'Show Badges' 
    },
    response: "Here are your earned badges:",
  },
  {
    patterns: [
      /my progress/i,
      /show progress/i,
      /how am i doing/i,
    ],
    action: { 
      type: 'display_data', 
      payload: { dataType: 'progress' },
      label: 'Show Progress' 
    },
    response: "Here's your learning progress:",
  },
  
  // Task actions (require confirmation)
  {
    patterns: [
      /submit (my |this )?mission/i,
      /how do i submit/i,
    ],
    action: { 
      type: 'confirm_action', 
      payload: { actionType: 'submit_mission' },
      label: 'Submit Mission' 
    },
    response: "To submit your mission, click the 'Submit' button on the mission page. Make sure you've completed all required deliverables!",
  },
  {
    patterns: [
      /sign out/i,
      /log ?out/i,
      /logout/i,
    ],
    action: { 
      type: 'confirm_action', 
      payload: { actionType: 'logout', path: '/login' },
      label: 'Sign Out' 
    },
    response: "Would you like to sign out?",
  },
];

// =============================================================================
// ACTION DETECTOR
// =============================================================================

export function detectAction(query: string): ActionableResponse | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  for (const pattern of ACTION_PATTERNS) {
    for (const regex of pattern.patterns) {
      if (regex.test(normalizedQuery)) {
        return {
          text: pattern.response,
          action: pattern.action,
          suggestions: getFollowUpSuggestions(pattern.action.type),
        };
      }
    }
  }
  
  return null;
}

// =============================================================================
// FOLLOW-UP SUGGESTIONS BASED ON ACTION TYPE
// =============================================================================

function getFollowUpSuggestions(actionType: AIActionType): string[] {
  switch (actionType) {
    case 'navigate':
      return [
        "What else can I help with?",
        "Show me around",
        "What's my progress?",
      ];
    case 'display_data':
      return [
        "How do I earn more XP?",
        "Show my missions",
        "Take me to my dashboard",
      ];
    case 'confirm_action':
      return [
        "Yes, do it",
        "No, cancel",
        "Tell me more",
      ];
    default:
      return [
        "What is ProjectX?",
        "How do missions work?",
        "Take me to login",
      ];
  }
}

// =============================================================================
// MOCK DATA FOR DISPLAY ACTIONS
// =============================================================================

export function getMockDataForAction(dataType: string): Record<string, unknown> {
  switch (dataType) {
    case 'xp_stats':
      return {
        currentXP: 2450,
        level: 'Explorer',
        nextLevel: 'Adventurer',
        xpToNext: 550,
        rank: 12,
        totalStudents: 45,
      };
    case 'badges':
      return {
        earned: [
          { name: 'First Mission', icon: '🎯', date: '2026-01-15' },
          { name: 'Quick Learner', icon: '⚡', date: '2026-01-20' },
          { name: 'Team Player', icon: '🤝', date: '2026-01-25' },
        ],
        available: 12,
      };
    case 'progress':
      return {
        missionsCompleted: 5,
        missionsActive: 2,
        totalMissions: 15,
        streak: 7,
        phase: 'eXperience',
      };
    default:
      return {};
  }
}

// =============================================================================
// FORMAT DATA FOR DISPLAY
// =============================================================================

export function formatDataDisplay(dataType: string, data: Record<string, unknown>): string {
  switch (dataType) {
    case 'xp_stats':
      return `**Your Stats:**
⚡ **${data.currentXP} XP** • Level: ${data.level}
📊 ${data.xpToNext} XP to reach ${data.nextLevel}
🏆 Rank #${data.rank} of ${data.totalStudents} students`;

    case 'badges':
      const badges = data.earned as Array<{ name: string; icon: string }>;
      const badgeList = badges.map(b => `${b.icon} ${b.name}`).join('\n');
      return `**Your Badges (${badges.length}/${data.available}):**
${badgeList}`;

    case 'progress':
      return `**Your Progress:**
✅ ${data.missionsCompleted} missions completed
🎯 ${data.missionsActive} active missions
🔥 ${data.streak}-day streak
📍 Phase: ${data.phase}`;

    default:
      return JSON.stringify(data, null, 2);
  }
}
