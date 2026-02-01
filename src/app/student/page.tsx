// ProjectX OS - Student Dashboard (Pilot-Compliant)
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  getSession,
  getCurrentUser,
  getTeacherForStudent,
  hasRole,
  canBootOS,
} from '@/lib/auth';
import {
  getSubmissionsForStudent,
  getStudentStats,
  getMissionsWithProgress,
  getStatusInfo,
} from '@/lib/domain';
import type { MissionWithProgress, GoLiveUser, Mission } from '@/types/go-live';
import { useEffect, useState, useCallback } from 'react';
import { GraduationDashboard } from '@/components/graduation';
import { AIAssistant } from '@/components/ai';
import { 
  Zap, 
  BarChart3, 
  CheckCircle2, 
  Target, 
  BookOpen, 
  Trophy,
  Clock,
  ListChecks,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Award,
  User
} from 'lucide-react';

// =============================================================================
// MISSION STATUS DEFINITIONS (Pilot: Clear States)
// =============================================================================

const MISSION_STATES = {
  'not-started': { 
    label: 'Available', 
    color: 'text-gray-400', 
    bgColor: 'bg-gray-500/10', 
    borderColor: 'border-gray-500/30',
    icon: BookOpen 
  },
  'in-progress': { 
    label: 'In Progress', 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/10', 
    borderColor: 'border-blue-500/30',
    icon: Target 
  },
  'submitted': { 
    label: 'Awaiting Review', 
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-500/10', 
    borderColor: 'border-yellow-500/30',
    icon: Clock 
  },
  'reviewed': { 
    label: 'Needs Revision', 
    color: 'text-orange-400', 
    bgColor: 'bg-orange-500/10', 
    borderColor: 'border-orange-500/30',
    icon: RefreshCw 
  },
  'approved': { 
    label: 'Completed', 
    color: 'text-green-400', 
    bgColor: 'bg-green-500/10', 
    borderColor: 'border-green-500/30',
    icon: CheckCircle2 
  },
} as const;

type MissionState = keyof typeof MISSION_STATES;

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<GoLiveUser | null>(null);
  const [teacher, setTeacher] = useState<GoLiveUser | null>(null);
  const [missions, setMissions] = useState<MissionWithProgress[]>([]);
  const [stats, setStats] = useState({ total: 0, draft: 0, pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Data loading function
  const loadData = useCallback(async (currentUser: GoLiveUser) => {
    const [assignedTeacher, studentMissions, studentStats] = await Promise.all([
      getTeacherForStudent(currentUser.id),
      getMissionsWithProgress(currentUser.id, currentUser.schoolId),
      getStudentStats(currentUser.id),
    ]);
    
    setTeacher(assignedTeacher);
    setMissions(studentMissions);
    setStats(studentStats);
  }, []);
  
  // Refresh function
  const handleRefresh = useCallback(async () => {
    if (!user || isRefreshing) return;
    setIsRefreshing(true);
    await loadData(user);
    setIsRefreshing(false);
  }, [user, isRefreshing, loadData]);
  
  useEffect(() => {
    const init = async () => {
      // Pilot: Validate session before boot
      const bootCheck = canBootOS();
      if (!bootCheck.ready) {
        router.push(bootCheck.reason === 'no_persona' ? '/' : '/login');
        return;
      }
      
      const session = getSession();
      if (!session || !hasRole('student')) {
        router.push('/login');
        return;
      }
      
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      
      setUser(currentUser);
      await loadData(currentUser);
      setIsLoading(false);
    };
    
    init();
    
    // Refresh on visibility change
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && user) {
        handleRefresh();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [router, loadData, user, handleRefresh]);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full"
        />
      </div>
    );
  }
  
  const activeMissions = missions.filter(m => m.submission && !['APPROVED', 'REJECTED'].includes(m.submission.status));
  const completedMissions = missions.filter(m => m.submission?.status === 'APPROVED');
  const availableMissions = missions.filter(m => !m.submission);
  
  // Get mission state for Pilot clarity
  const getMissionState = (m: MissionWithProgress): MissionState => {
    if (!m.submission) return 'not-started';
    switch (m.submission.status) {
      case 'DRAFT': return 'in-progress';
      case 'SUBMITTED': 
      case 'UNDER_REVIEW': return 'submitted';
      case 'FEEDBACK_REQUESTED': 
      case 'RESUBMITTED': return 'reviewed';
      case 'APPROVED': return 'approved';
      case 'REJECTED': return 'not-started';
      default: return 'not-started';
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* AI Assistant */}
      <AIAssistant context="student" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg font-bold">
                X
              </div>
              <span className="font-bold text-lg hidden sm:block">ProjectX</span>
            </Link>
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full flex items-center gap-1">
              <User className="w-3 h-3" />
              Student
            </span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* XP Display */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 px-3 py-2 rounded-lg">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-bold">{user.xp} XP</span>
              <span className="text-gray-400 text-sm hidden sm:inline">Lv.{user.level}</span>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <Link 
              href="/os"
              className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors border border-white/10 rounded-lg hover:bg-white/5 flex items-center gap-1"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">OS Hub</span>
            </Link>
            
            <button
              onClick={() => {
                localStorage.removeItem('projectx_session');
                sessionStorage.removeItem('projectx_persona_intent');
                router.push('/');
              }}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            Welcome back, {user.displayName}!
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            {activeMissions.length > 0 
              ? `You have ${activeMissions.length} active mission${activeMissions.length !== 1 ? 's' : ''}`
              : 'No active missions. Start one below!'}
          </p>
        </motion.div>
        
        {/* Assigned Teacher Card */}
        {teacher && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center font-bold text-lg">
                {teacher.displayName.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-purple-400">Your Teacher</p>
                <h3 className="font-semibold">{teacher.displayName}</h3>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total XP" value={user.xp} icon={Zap} color="cyan" />
          <StatCard label="Level" value={user.level} icon={TrendingUp} color="blue" />
          <StatCard label="Completed" value={stats.approved} icon={CheckCircle2} color="green" />
          <StatCard label="In Progress" value={stats.pending + stats.draft} icon={Target} color="yellow" />
        </div>
        
        {/* Active Missions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Active Missions
          </h2>
          
          {isLoading ? (
            <div className="text-gray-400">Loading...</div>
          ) : activeMissions.length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center text-gray-400">
              No active missions. Start a new one below!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeMissions.map((missionData) => {
                const state = getMissionState(missionData);
                const stateInfo = MISSION_STATES[state];
                return (
                  <MissionCard 
                    key={missionData.mission.id} 
                    mission={missionData.mission}
                    state={state}
                    stateInfo={stateInfo}
                  />
                );
              })}
            </div>
          )}
        </section>
        
        {/* Available Missions */}
        {availableMissions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Available Missions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableMissions.map(({ mission }) => (
                <MissionCard 
                  key={mission.id} 
                  mission={mission}
                  state="not-started"
                  stateInfo={MISSION_STATES['not-started']}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Completed Missions */}
        {completedMissions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-green-400" />
              Completed Missions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedMissions.map(({ mission, submission }) => (
                <div 
                  key={mission.id} 
                  className="bg-green-500/10 border border-green-500/30 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold">{mission.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{mission.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 text-sm flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      Approved
                    </span>
                    <span className="text-cyan-400 text-sm flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      +{submission?.xpEarned || mission.xpReward} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Graduation Progress */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Your Journey
          </h2>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400">Overall Progress</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {stats.approved}/{stats.total} Missions
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// =============================================================================
// COMPONENTS
// =============================================================================

import type { LucideIcon } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color }: { 
  label: string; 
  value: number | string; 
  icon: LucideIcon;
  color: 'cyan' | 'blue' | 'green' | 'yellow';
}) {
  const colors = {
    cyan: 'from-cyan-500/20 to-transparent border-cyan-500/30 text-cyan-400',
    blue: 'from-blue-500/20 to-transparent border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-transparent border-green-500/30 text-green-400',
    yellow: 'from-yellow-500/20 to-transparent border-yellow-500/30 text-yellow-400',
  };
  
  const iconColors = {
    cyan: 'text-cyan-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-2xl font-bold ${iconColors[color]}`}>{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
        <Icon className={`w-8 h-8 ${iconColors[color]}`} />
      </div>
    </motion.div>
  );
}

function MissionCard({ mission, state, stateInfo }: { 
  mission: Mission; 
  state: MissionState;
  stateInfo: typeof MISSION_STATES[MissionState];
}) {
  const StateIcon = stateInfo.icon;
  
  const difficultyColors: Record<number, string> = {
    1: 'bg-green-500/20 text-green-400',
    2: 'bg-green-500/20 text-green-400',
    3: 'bg-yellow-500/20 text-yellow-400',
    4: 'bg-orange-500/20 text-orange-400',
    5: 'bg-red-500/20 text-red-400',
  };
  
  return (
    <Link href={`/mission/${mission.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`bg-gray-900/50 border ${stateInfo.borderColor} rounded-xl p-4 cursor-pointer hover:border-cyan-500/50 transition-all`}
      >
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[mission.difficulty] || difficultyColors[1]}`}>
            Level {mission.difficulty}
          </span>
          <span className="text-sm text-cyan-400 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" />
            +{mission.xpReward} XP
          </span>
        </div>
        
        <h3 className="font-semibold mb-1">{mission.title}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{mission.description}</p>
        
        {/* State Badge - Pilot: Clear Mission States */}
        <div className={`mb-3 px-2 py-1 rounded-lg text-xs ${stateInfo.bgColor} ${stateInfo.color} inline-flex items-center gap-1`}>
          <StateIcon className="w-3 h-3" />
          {stateInfo.label}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {mission.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <ListChecks className="w-3 h-3" />
            {mission.steps?.length || 0} steps
          </span>
        </div>
        
        <div className="w-full py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-semibold hover:bg-cyan-500/30 transition-colors text-center flex items-center justify-center gap-1">
          {state === 'not-started' ? 'Start Mission' : 'Continue'}
          <ChevronRight className="w-4 h-4" />
        </div>
      </motion.div>
    </Link>
  );
}
