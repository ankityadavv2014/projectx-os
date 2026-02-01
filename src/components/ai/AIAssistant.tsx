// ProjectX OS — AI Assistant Component
// Embedded chatbot for guiding visitors and helping learners
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { queryAI, type AIMessage, detectAction, getMockDataForAction, formatDataDisplay, type AIAction } from '@/lib/ai';

// =============================================================================
// TYPES
// =============================================================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  source?: 'ollama' | 'fallback' | 'cache';
  action?: AIAction;
}

interface QuickAction {
  label: string;
  prompt: string;
  icon: string;
}

// =============================================================================
// KNOWLEDGE BASE - Local AI responses
// =============================================================================

const KNOWLEDGE_BASE: Record<string, string> = {
  // About ProjectX
  'what is projectx': `ProjectX OS is a next-generation learning operating system that transforms how humans develop capabilities. Instead of passive courses, you work on real projects, earn XP, and build a verified portfolio.

**The Four Phases:**
1. **eXperience** - Learn through guided missions
2. **eXperiment** - Collaborate on team challenges  
3. **eXcel** - Earn credentials and opportunities
4. **eXpand** - Create impact across regions`,

  'how does it work': `Here's how ProjectX works:

1. **Start as a Student** - Join a cohort and receive missions
2. **Complete Missions** - Each mission has clear objectives and earns XP
3. **Build Portfolio** - Your work becomes verified artifacts
4. **Level Up** - Progress through phases based on achievements
5. **Graduate** - Get matched with real opportunities

Everything you do is tracked and verified, creating a trusted record of your capabilities.`,

  'missions': `**Missions** are the core learning unit in ProjectX:

- Each mission has clear objectives and deliverables
- Estimated time and XP reward shown upfront
- You submit artifacts (code, designs, documents) as proof
- Teachers review and provide feedback
- Approved missions earn XP and may unlock badges

Start with easier missions to build momentum, then tackle harder challenges!`,

  'xp': `**XP (Experience Points)** measures your progress:

- Earn XP by completing missions
- Higher difficulty = more XP reward
- XP determines your level (Rookie → Pro → Expert → Master)
- Certain XP thresholds unlock new features
- Your total XP appears on your public profile

Focus on quality work - XP follows effort!`,

  'badges': `**Badges** recognize specific achievements:

- **Skill Badges** - Demonstrate competency (e.g., "Python Proficient")
- **Achievement Badges** - Special milestones (e.g., "First Submission")
- **Phase Badges** - Progress markers (e.g., "Explorer")

Badges are verified and visible on your profile. Employers and partners can filter by badges when looking for talent.`,

  'phases': `ProjectX has **4 Phases** that represent your journey:

🟠 **Phase 1: eXperience** (Learn)
- Complete individual missions
- Build foundational skills
- Earn your first badges

🔵 **Phase 2: eXperiment** (Work)  
- Join team challenges
- Collaborate in sandbox labs
- Practice real workflows

🟣 **Phase 3: eXcel** (Earn)
- Get verified credentials
- Match with opportunities
- Start earning

🔴 **Phase 4: eXpand** (Invent)
- Create your own content
- Lead communities
- Multiply impact globally`,

  'student': `As a **Student**, you can:

✅ View assigned missions from your cohort
✅ Complete missions and submit artifacts
✅ Track your XP and level progress
✅ Earn badges for achievements
✅ See your position in the cohort leaderboard
✅ Access the ProjectX OS interface

Get started by checking your Active Missions on the dashboard!`,

  'teacher': `As a **Teacher/Facilitator**, you can:

✅ Create and assign missions to cohorts
✅ Review student submissions
✅ Provide feedback and ratings
✅ Award XP and badges
✅ Track cohort progress
✅ Generate progress reports

Teachers are the guides who ensure quality and support learning.`,

  'parent': `As a **Parent**, you can:

✅ View your child's progress dashboard
✅ See completed missions and badges
✅ Track XP growth over time
✅ Receive milestone notifications
✅ Understand the learning journey

Parents get visibility without micro-managing - trust the system!`,

  'school': `For **Schools & Partners**:

✅ Deploy ProjectX OS across classrooms
✅ Customize mission libraries
✅ Integrate with existing systems
✅ Access analytics dashboards
✅ Train facilitators
✅ Scale learning outcomes

Contact us for partnership opportunities!`,

  'help': `I can help you with:

- **Getting Started** - How ProjectX works
- **Missions** - Understanding and completing missions
- **XP & Levels** - How progression works
- **Badges** - What they mean and how to earn them
- **Phases** - The four-phase journey
- **Roles** - Student, Teacher, Parent, School info

Just ask your question and I'll guide you! 🚀`,

  'default': `I'm the ProjectX AI Assistant! I can help you:

- Understand how ProjectX works
- Navigate the platform
- Learn about missions, XP, and badges
- Get guidance on your learning journey

What would you like to know?`,
};

// Quick actions for different contexts
const QUICK_ACTIONS: Record<string, QuickAction[]> = {
  landing: [
    { label: 'What is ProjectX?', prompt: 'what is projectx', icon: '🎯' },
    { label: 'How does it work?', prompt: 'how does it work', icon: '⚙️' },
    { label: 'Show me the phases', prompt: 'phases', icon: '📊' },
    { label: 'I need help', prompt: 'help', icon: '❓' },
  ],
  student: [
    { label: 'How do missions work?', prompt: 'missions', icon: '🎯' },
    { label: 'What is XP?', prompt: 'xp', icon: '⚡' },
    { label: 'How to earn badges?', prompt: 'badges', icon: '🏆' },
    { label: 'I need help', prompt: 'help', icon: '❓' },
  ],
  mission: [
    { label: 'How to complete this?', prompt: 'missions', icon: '✅' },
    { label: 'What happens after I submit?', prompt: 'how does it work', icon: '📤' },
    { label: 'How much XP will I earn?', prompt: 'xp', icon: '⚡' },
    { label: 'I need help', prompt: 'help', icon: '❓' },
  ],
  default: [
    { label: 'What is ProjectX?', prompt: 'what is projectx', icon: '🎯' },
    { label: 'Help me navigate', prompt: 'help', icon: '🧭' },
  ],
};

// =============================================================================
// SUGGESTED FOLLOW-UP PROMPTS - Context-aware conversation continuers
// =============================================================================

interface SuggestedPrompt {
  label: string;
  prompt: string;
}

// Map response topics to relevant follow-ups
const FOLLOW_UP_SUGGESTIONS: Record<string, SuggestedPrompt[]> = {
  'what is projectx': [
    { label: '🚀 How do I get started?', prompt: 'how does it work' },
    { label: '📊 Tell me about the phases', prompt: 'phases' },
    { label: '🎯 What are missions?', prompt: 'missions' },
  ],
  'how does it work': [
    { label: '⚡ How do I earn XP?', prompt: 'xp' },
    { label: '🏆 What are badges?', prompt: 'badges' },
    { label: '👤 What can students do?', prompt: 'student' },
  ],
  'phases': [
    { label: '🎯 Start with missions', prompt: 'missions' },
    { label: '💼 How do I get jobs?', prompt: 'jobs and careers' },
    { label: '👥 Can I work in teams?', prompt: 'team collaboration' },
  ],
  'missions': [
    { label: '⚡ How much XP per mission?', prompt: 'xp' },
    { label: '🏆 Do I earn badges?', prompt: 'badges' },
    { label: '📤 What happens after I submit?', prompt: 'how does it work' },
  ],
  'xp': [
    { label: '🏆 Tell me about badges', prompt: 'badges' },
    { label: '📊 What are the phases?', prompt: 'phases' },
    { label: '🎯 How do missions work?', prompt: 'missions' },
  ],
  'badges': [
    { label: '⚡ How do I earn XP?', prompt: 'xp' },
    { label: '💼 Do badges help get jobs?', prompt: 'jobs and careers' },
    { label: '🎯 How do I complete missions?', prompt: 'missions' },
  ],
  'student': [
    { label: '🎯 View my missions', prompt: 'missions' },
    { label: '📊 Check my progress', prompt: 'xp' },
    { label: '👩‍🏫 Who is my teacher?', prompt: 'teacher' },
  ],
  'teacher': [
    { label: '👤 What can students do?', prompt: 'student' },
    { label: '🏫 School partnerships', prompt: 'school' },
    { label: '🎯 How do missions work?', prompt: 'missions' },
  ],
  'parent': [
    { label: '👤 What does my child do?', prompt: 'student' },
    { label: '📊 How does progress work?', prompt: 'xp' },
    { label: '🏆 What are badges?', prompt: 'badges' },
  ],
  'school': [
    { label: '👩‍🏫 Teacher capabilities', prompt: 'teacher' },
    { label: '🎯 How do missions work?', prompt: 'missions' },
    { label: '📊 What are the phases?', prompt: 'phases' },
  ],
  'default': [
    { label: '🎯 What is ProjectX?', prompt: 'what is projectx' },
    { label: '🚀 How do I get started?', prompt: 'how does it work' },
    { label: '❓ I need help', prompt: 'help' },
  ],
};

// Navigation suggestions based on context
const NAVIGATION_SUGGESTIONS: Record<string, SuggestedPrompt[]> = {
  landing: [
    { label: '🚪 Enter the Experience', prompt: 'take me to login' },
    { label: '📜 Read the Manifesto', prompt: 'show me the manifesto' },
  ],
  student: [
    { label: '🎯 View my missions', prompt: 'show my active missions' },
    { label: '📊 Check my XP', prompt: 'what is my current XP level' },
    { label: '🏆 See my badges', prompt: 'show my earned badges' },
  ],
  mission: [
    { label: '📤 Submit my work', prompt: 'how do I submit this mission' },
    { label: '💬 Ask my teacher', prompt: 'how do I contact my teacher' },
  ],
  default: [
    { label: '🏠 Go to homepage', prompt: 'take me home' },
  ],
};

function getSuggestedPrompts(lastQuery: string, context: string): SuggestedPrompt[] {
  const normalizedQuery = lastQuery.toLowerCase();
  
  // Find matching follow-ups based on the topic discussed
  for (const [key, suggestions] of Object.entries(FOLLOW_UP_SUGGESTIONS)) {
    if (normalizedQuery.includes(key)) {
      // Mix topic follow-ups with one navigation suggestion
      const navSuggestions = NAVIGATION_SUGGESTIONS[context] || NAVIGATION_SUGGESTIONS.default;
      return [...suggestions.slice(0, 2), navSuggestions[0]].filter(Boolean);
    }
  }
  
  // Default suggestions
  return FOLLOW_UP_SUGGESTIONS.default;
}

// =============================================================================
// LOCAL AI RESPONSE GENERATOR
// =============================================================================

function generateResponse(input: string): string {
  const query = input.toLowerCase().trim();
  
  // Check for direct matches
  for (const [key, response] of Object.entries(KNOWLEDGE_BASE)) {
    if (query.includes(key)) {
      return response;
    }
  }
  
  // Fuzzy matching for common questions
  if (query.includes('start') || query.includes('begin') || query.includes('new')) {
    return KNOWLEDGE_BASE['how does it work'];
  }
  if (query.includes('level') || query.includes('progress') || query.includes('advance')) {
    return KNOWLEDGE_BASE['xp'];
  }
  if (query.includes('certificate') || query.includes('credential') || query.includes('verify')) {
    return KNOWLEDGE_BASE['badges'];
  }
  if (query.includes('team') || query.includes('collaborate') || query.includes('group')) {
    return `Team collaboration happens in **Phase 2: eXperiment**!

Once you've proven individual capabilities in Phase 1, you'll join team challenges where you:
- Work with other learners on complex projects
- Use real collaboration tools
- Practice professional workflows
- Build interpersonal skills

Keep progressing through missions to unlock team features!`;
  }
  if (query.includes('job') || query.includes('career') || query.includes('work') || query.includes('employ')) {
    return `ProjectX connects your learning to real opportunities:

**Phase 3: eXcel** is where learning becomes earning:
- Your verified portfolio speaks for itself
- Partners can discover talent by skills and badges
- Opportunity matching based on your capabilities
- Real freelance and employment pathways

Build your portfolio now, unlock opportunities later!`;
  }
  if (query.includes('cost') || query.includes('price') || query.includes('free') || query.includes('pay')) {
    return `ProjectX is designed to be accessible:

- **Basic access** is free for learners
- **Schools** have partnership options
- **Premium features** may have costs

Our goal is capability development for everyone. Contact us for specific pricing!`;
  }
  
  // Default response
  return KNOWLEDGE_BASE['default'];
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface AIAssistantProps {
  context?: 'landing' | 'student' | 'teacher' | 'mission' | 'default';
  minimized?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  missionContext?: {
    missionId?: string;
    missionTitle?: string;
    subject?: string;
    stage?: string;
  };
}

// Transformation tools (Pilot: AI assists, human decides)
const TRANSFORMATION_TOOLS = [
  { id: 'explain', label: 'Explain', icon: '💡', prompt: 'Can you explain this concept in simpler terms?' },
  { id: 'summarize', label: 'Summarize', icon: '📝', prompt: 'Can you summarize this information?' },
  { id: 'notes', label: 'Make Notes', icon: '📋', prompt: 'Convert this into study notes format' },
  { id: 'share', label: 'Share Format', icon: '🔗', prompt: 'Format this as shareable insights' },
];

// Pilot: Hard stops - things AI must refuse
const HARD_STOP_PATTERNS = [
  /complete.*assignment/i,
  /do.*homework/i,
  /write.*essay.*for me/i,
  /solve.*problem.*for me/i,
  /give.*answer/i,
  /finish.*project/i,
  /submit.*for me/i,
];

const HARD_STOP_RESPONSE = `I'm designed to **guide**, not complete work for you.

**What I CAN do:**
- Explain concepts in different ways
- Break down complex problems
- Suggest approaches
- Review your thinking

**What I WON'T do:**
- Complete assignments for you
- Generate final answers
- Submit work on your behalf

Learning happens when **you** do the work. How can I help you understand the problem better?`;

function checkHardStop(query: string): boolean {
  return HARD_STOP_PATTERNS.some(pattern => pattern.test(query));
}

export function AIAssistant({ 
  context = 'default',
  minimized: initialMinimized = true,
  position = 'bottom-right',
  missionContext
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(!initialMinimized);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastQuery, setLastQuery] = useState<string>('');
  const [showTools, setShowTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const quickActions = QUICK_ACTIONS[context] || QUICK_ACTIONS.default;
  const suggestedPrompts = lastQuery ? getSuggestedPrompts(lastQuery, context) : [];
  const router = useRouter();
  
  // Build context string for AI
  const contextString = missionContext 
    ? `[Mission: ${missionContext.missionTitle || 'Unknown'}, Subject: ${missionContext.subject || 'General'}, Stage: ${missionContext.stage || 'learning'}]`
    : `[Context: ${context}]`;
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);
  
  // Execute AI action
  const executeAction = useCallback((action: AIAction) => {
    switch (action.type) {
      case 'navigate':
        const path = action.payload.path as string;
        router.push(path);
        break;
      case 'display_data':
        // Data is already formatted in the message
        break;
      case 'confirm_action':
        if (action.payload.actionType === 'logout') {
          // Could integrate with auth service
          router.push('/login');
        }
        break;
      default:
        break;
    }
  }, [router]);
  
  // Send message - uses live AI service with fallback, now with actions
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setLastQuery(text.trim()); // Track for suggested prompts
    
    try {
      // Pilot: Check hard stops first
      if (checkHardStop(text.trim())) {
        const hardStopMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: HARD_STOP_RESPONSE,
          timestamp: new Date(),
          source: 'fallback',
        };
        setMessages(prev => [...prev, hardStopMessage]);
        setIsTyping(false);
        return;
      }
      
      // First, check if this is an actionable request
      const actionResult = detectAction(text.trim());
      
      if (actionResult) {
        // Handle actionable response
        let responseText = actionResult.text;
        
        // If it's a data display action, fetch and format the data
        if (actionResult.action?.type === 'display_data') {
          const dataType = actionResult.action.payload.dataType as string;
          const data = getMockDataForAction(dataType);
          responseText += '\n\n' + formatDataDisplay(dataType, data);
        }
        
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
          source: 'fallback',
          action: actionResult.action,
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Auto-execute navigation after a brief delay
        if (actionResult.action?.type === 'navigate') {
          setTimeout(() => {
            executeAction(actionResult.action!);
          }, 1500);
        }
        
        setIsTyping(false);
        return;
      }
      
      // Build conversation history for context
      const conversationHistory: AIMessage[] = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
      }));
      conversationHistory.push({ role: 'user', content: text.trim() });
      
      // Query AI service (tries Ollama first, falls back to local knowledge)
      const response = await queryAI(conversationHistory);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        source: response.source,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI query failed:', error);
      // Fallback to local response
      const fallbackResponse = generateResponse(text);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
        source: 'fallback',
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, executeAction]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  
  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };
  
  const positionClasses = position === 'bottom-right' 
    ? 'right-4 md:right-6' 
    : 'left-4 md:left-6';
  
  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-4 md:bottom-6 ${positionClasses} z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[var(--molten-orange)] to-[var(--sacred-gold)] shadow-lg shadow-[var(--molten-orange)]/30 flex items-center justify-center hover:scale-110 transition-transform`}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-2xl md:text-3xl"
            >
              🤖
            </motion.div>
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[var(--molten-orange)]"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-4 md:bottom-6 ${positionClasses} z-50 w-[calc(100vw-2rem)] md:w-[400px] max-h-[70vh] md:max-h-[600px] bg-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50 flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-[var(--molten-orange)]/20 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--molten-orange)] to-[var(--sacred-gold)] flex items-center justify-center text-lg">
                  🤖
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">ProjectX Guide</h3>
                  <p className="text-white/50 text-xs">
                    {missionContext?.missionTitle 
                      ? `📚 ${missionContext.missionTitle}` 
                      : context === 'student' ? '🎓 Student Mode' 
                      : context === 'teacher' ? '👩‍🏫 Teacher Mode'
                      : 'AI Assistant'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Tools toggle - only show in mission/student context */}
                {(context === 'student' || context === 'mission') && (
                  <button
                    onClick={() => setShowTools(!showTools)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors ${showTools ? 'bg-[var(--molten-orange)]/30 text-[var(--molten-orange)]' : 'bg-white/10 hover:bg-white/20'}`}
                    title="Transformation Tools"
                  >
                    ⚡
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Transformation Tools Bar */}
            <AnimatePresence>
              {showTools && (context === 'student' || context === 'mission') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-white/10 overflow-hidden"
                >
                  <div className="p-2 flex gap-2">
                    {TRANSFORMATION_TOOLS.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => sendMessage(tool.prompt)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs transition-all"
                      >
                        <span>{tool.icon}</span>
                        <span className="hidden sm:inline">{tool.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
              {messages.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">👋</div>
                  <h4 className="text-white font-semibold mb-1">Hi there!</h4>
                  <p className="text-white/50 text-sm mb-4">
                    I&apos;m here to help you navigate ProjectX
                  </p>
                  
                  {/* Quick actions */}
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleQuickAction(action.prompt)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs transition-all text-left"
                      >
                        <span>{action.icon}</span>
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${message.role === 'user' ? '' : ''}`}>
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                          message.role === 'user'
                            ? 'bg-[var(--molten-orange)] text-white rounded-br-none'
                            : 'bg-white/10 text-white/90 rounded-bl-none'
                        }`}
                      >
                        {message.content}
                      </div>
                      
                      {/* Action button for actionable responses */}
                      {message.action && message.action.type === 'navigate' && (
                        <motion.button
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          onClick={() => executeAction(message.action!)}
                          className="mt-2 px-4 py-2 rounded-lg bg-[var(--molten-orange)]/20 hover:bg-[var(--molten-orange)]/30 border border-[var(--molten-orange)]/50 text-[var(--molten-orange)] text-xs font-medium transition-all flex items-center gap-2"
                        >
                          <span>🚀</span>
                          <span>{message.action.label || 'Go'}</span>
                        </motion.button>
                      )}
                      
                      {/* Confirm/Cancel for confirmation actions */}
                      {message.action && message.action.type === 'confirm_action' && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-2 flex gap-2"
                        >
                          <button
                            onClick={() => executeAction(message.action!)}
                            className="px-3 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 text-xs font-medium transition-all"
                          >
                            ✓ Confirm
                          </button>
                          <button
                            onClick={() => {}} // Just close/ignore
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 text-white/60 text-xs font-medium transition-all"
                          >
                            ✕ Cancel
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-white/50"
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-white/30"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                  <span className="text-xs">Thinking...</span>
                </motion.div>
              )}
              
              {/* Suggested follow-up prompts */}
              {!isTyping && messages.length > 0 && suggestedPrompts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2"
                >
                  <p className="text-white/40 text-xs mb-2">Continue the conversation:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((suggestion, idx) => (
                      <motion.button
                        key={suggestion.prompt}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        onClick={() => handleQuickAction(suggestion.prompt)}
                        className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-[var(--molten-orange)]/20 border border-white/10 hover:border-[var(--molten-orange)]/50 text-white/70 hover:text-white text-xs transition-all"
                      >
                        {suggestion.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--molten-orange)]/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-xl bg-[var(--molten-orange)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIAssistant;
