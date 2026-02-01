// ProjectX OS - Community Hub Component
// Pilot: Community = shared growth, not competition
// No vanity metrics, no infinite scrolling, constructive feedback only
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Target, 
  MessageCircle, 
  Sparkles, 
  ChevronRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Heart,
  Lightbulb,
  type LucideIcon
} from 'lucide-react';
import { useMyCohorts } from '@/hooks/useCohorts';
import { useCurrentUser } from '@/hooks/useUser';
import type { User, Mission } from '@/lib/domain/types';

// =============================================================================
// TYPES
// =============================================================================

interface CohortMember {
  user: User;
  status: 'active' | 'working' | 'completed';
  currentMission?: string;
  recentAchievement?: string;
}

interface GroupMission {
  id: string;
  title: string;
  description: string;
  participants: CohortMember[];
  progress: number;
  dueDate?: string;
}

interface FeedbackPrompt {
  id: string;
  type: 'encourage' | 'celebrate' | 'help';
  icon: LucideIcon;
  label: string;
  message: string;
}

// =============================================================================
// PILOT: FEEDBACK PROMPTS (constructive only)
// =============================================================================

const FEEDBACK_PROMPTS: FeedbackPrompt[] = [
  {
    id: 'encourage',
    type: 'encourage',
    icon: Heart,
    label: 'Encourage',
    message: 'You\'re doing great! Keep going!',
  },
  {
    id: 'celebrate',
    type: 'celebrate',
    icon: Sparkles,
    label: 'Celebrate',
    message: 'Amazing work on your mission!',
  },
  {
    id: 'help',
    type: 'help',
    icon: Lightbulb,
    label: 'Offer Help',
    message: 'Need any help? I\'m here!',
  },
];

// =============================================================================
// COHORT MEMBER CARD (no ranking, just presence)
// =============================================================================

interface MemberCardProps {
  member: CohortMember;
  onFeedback?: (memberId: string, prompt: FeedbackPrompt) => void;
}

function MemberCard({ member, onFeedback }: MemberCardProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  
  const statusConfig = {
    active: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'Active' },
    working: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'In Mission' },
    completed: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Just Finished!' },
  };
  
  const config = statusConfig[member.status];
  
  return (
    <motion.div
      className="relative p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--molten-orange)] to-[var(--sacred-gold)] flex items-center justify-center text-white font-semibold">
          {member.user.displayName.charAt(0).toUpperCase()}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{member.user.displayName}</p>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-xs ${config.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${config.bg.replace('/20', '')}`} />
              {config.label}
            </span>
            {member.currentMission && (
              <span className="text-xs text-white/40 truncate">• {member.currentMission}</span>
            )}
          </div>
        </div>
        
        {/* Feedback button */}
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
          title="Send encouragement"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>
      
      {/* Recent achievement */}
      {member.recentAchievement && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-[var(--sacred-gold)]/10 border border-[var(--sacred-gold)]/20">
          <p className="text-xs text-[var(--sacred-gold)]">
            🎉 {member.recentAchievement}
          </p>
        </div>
      )}
      
      {/* Feedback panel */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
              {FEEDBACK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => {
                    onFeedback?.(member.user.id, prompt);
                    setShowFeedback(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-white/5 hover:bg-[var(--molten-orange)]/20 text-white/60 hover:text-white text-xs transition-all"
                >
                  <prompt.icon className="w-3 h-3" />
                  <span>{prompt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// =============================================================================
// GROUP MISSION CARD
// =============================================================================

interface GroupMissionCardProps {
  mission: GroupMission;
  onClick?: () => void;
}

function GroupMissionCard({ mission, onClick }: GroupMissionCardProps) {
  const activeCount = mission.participants.filter(p => p.status === 'working').length;
  const completedCount = mission.participants.filter(p => p.status === 'completed').length;
  
  return (
    <motion.div
      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--molten-orange)]/50 transition-all cursor-pointer"
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-[var(--molten-orange)]" />
            <h4 className="text-white font-semibold">{mission.title}</h4>
          </div>
          <p className="text-sm text-white/60 line-clamp-2">{mission.description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-white/30" />
      </div>
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-white/50">Group Progress</span>
          <span className="text-white/70">{Math.round(mission.progress * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)]"
            initial={{ width: 0 }}
            animate={{ width: `${mission.progress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* Participants summary */}
      <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {mission.participants.length} members
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-yellow-400" />
          {activeCount} working
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-green-400" />
          {completedCount} done
        </span>
      </div>
    </motion.div>
  );
}

// =============================================================================
// COHORT SUMMARY (not a leaderboard)
// =============================================================================

interface CohortSummaryProps {
  name: string;
  memberCount: number;
  activeMissions: number;
  recentCompletions: number;
}

function CohortSummary({ name, memberCount, activeMissions, recentCompletions }: CohortSummaryProps) {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--molten-orange)]/10 to-[var(--sacred-gold)]/10 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-3">{name}</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-white/10 mb-2">
            <Users className="w-5 h-5 text-white/70" />
          </div>
          <p className="text-xl font-bold text-white">{memberCount}</p>
          <p className="text-xs text-white/50">Members</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-white/10 mb-2">
            <Target className="w-5 h-5 text-[var(--molten-orange)]" />
          </div>
          <p className="text-xl font-bold text-white">{activeMissions}</p>
          <p className="text-xs text-white/50">Active</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-white/10 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-xl font-bold text-white">{recentCompletions}</p>
          <p className="text-xs text-white/50">This Week</p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMMUNITY HUB COMPONENT
// =============================================================================

interface CommunityHubProps {
  className?: string;
}

export function CommunityHub({ className }: CommunityHubProps) {
  const { user } = useCurrentUser();
  const { cohorts, isLoading } = useMyCohorts();
  const [activeTab, setActiveTab] = useState<'members' | 'missions'>('members');
  
  // Mock data for demo (would come from stores in production)
  const [members] = useState<CohortMember[]>([
    { user: { id: '1', displayName: 'Alex Chen', xp: 500 } as User, status: 'working', currentMission: 'Build a Calculator' },
    { user: { id: '2', displayName: 'Sam Rivera', xp: 750 } as User, status: 'completed', recentAchievement: 'Completed Python Basics!' },
    { user: { id: '3', displayName: 'Jordan Lee', xp: 420 } as User, status: 'active' },
    { user: { id: '4', displayName: 'Taylor Kim', xp: 890 } as User, status: 'working', currentMission: 'Design a Logo' },
  ]);
  
  const [groupMissions] = useState<GroupMission[]>([
    {
      id: 'gm-1',
      title: 'Team Website Project',
      description: 'Build a collaborative website showcasing your cohort\'s work',
      participants: members.slice(0, 3),
      progress: 0.65,
      dueDate: '2025-02-15',
    },
    {
      id: 'gm-2',
      title: 'Community Challenge: Sustainability',
      description: 'Research and present solutions for local sustainability issues',
      participants: members,
      progress: 0.3,
      dueDate: '2025-03-01',
    },
  ]);
  
  const handleFeedback = (memberId: string, prompt: FeedbackPrompt) => {
    // In production, this would send the feedback
    console.log(`Sending ${prompt.type} to ${memberId}: ${prompt.message}`);
    // Could show a toast notification here
  };
  
  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-32 rounded-xl bg-white/5" />
      </div>
    );
  }
  
  const currentCohort = cohorts[0];
  
  return (
    <div className={className}>
      {/* Cohort Summary */}
      <CohortSummary
        name={currentCohort?.name || 'My Cohort'}
        memberCount={members.length}
        activeMissions={groupMissions.length}
        recentCompletions={members.filter(m => m.status === 'completed').length}
      />
      
      {/* Tabs */}
      <div className="mt-6 flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'members'
              ? 'text-[var(--molten-orange)] border-b-2 border-[var(--molten-orange)]'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 inline-block mr-2" />
          Cohort Members
        </button>
        <button
          onClick={() => setActiveTab('missions')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'missions'
              ? 'text-[var(--molten-orange)] border-b-2 border-[var(--molten-orange)]'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4 inline-block mr-2" />
          Group Missions
        </button>
      </div>
      
      {/* Content */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'members' ? (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Pilot notice */}
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                💡 Community is about shared growth. Send encouragement to your peers!
              </div>
              
              {members.map((member) => (
                <MemberCard
                  key={member.user.id}
                  member={member}
                  onFeedback={handleFeedback}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="missions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {groupMissions.map((mission) => (
                <GroupMissionCard
                  key={mission.id}
                  mission={mission}
                  onClick={() => console.log('View mission:', mission.id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CommunityHub;
