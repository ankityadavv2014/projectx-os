// ProjectX OS - Student Dashboard (Go-Live Ready)
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  getSession,
  getCurrentUser,
  getTeacherForStudent,
  hasRole,
} from '@/lib/auth';
import {
  getSubmissionsForStudent,
  getStudentStats,
  getMissionsWithProgress,
  getStatusInfo,
} from '@/lib/domain';
import type { MissionWithProgress, GoLiveUser, Mission } from '@/types/go-live';
import { useEffect, useState } from 'react';
import { GraduationDashboard } from '@/components/graduation';
import { AIAssistant } from '@/components/ai';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<GoLiveUser | null>(null);
  const [teacher, setTeacher] = useState<GoLiveUser | null>(null);
  const [missions, setMissions] = useState<MissionWithProgress[]>([]);
  const [stats, setStats] = useState({ total: 0, draft: 0, pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const init = async () => {
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
      
      // Load student data using Go-Live services
      const [assignedTeacher, studentMissions, studentStats] = await Promise.all([
        getTeacherForStudent(currentUser.id),
        getMissionsWithProgress(currentUser.id, currentUser.schoolId),
        getStudentStats(currentUser.id),
      ]);
      
      setTeacher(assignedTeacher);
      setMissions(studentMissions);
      setStats(studentStats);
      setIsLoading(false);
    };
    
    init();
  }, [router]);
  
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
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
              Student
            </span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* XP Display */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 px-3 py-2 rounded-lg">
              <span className="text-cyan-400 font-bold">⚡ {user.xp} XP</span>
              <span className="text-gray-400 text-sm hidden sm:inline">Level {user.level}</span>
            </div>
            
            <button
              onClick={() => {
                localStorage.removeItem('projectx_session');
                router.push('/login');
              }}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign Out
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
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user.displayName}! 👋</h1>
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
          <StatCard label="Total XP" value={user.xp} icon="⚡" color="cyan" />
          <StatCard label="Level" value={user.level} icon="📊" color="blue" />
          <StatCard label="Completed" value={stats.approved} icon="✅" color="green" />
          <StatCard label="In Progress" value={stats.pending} icon="🎯" color="yellow" />
        </div>
        
        {/* Active Missions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            🎯 Active Missions
          </h2>
          
          {isLoading ? (
            <div className="text-gray-400">Loading...</div>
          ) : activeMissions.length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center text-gray-400">
              No active missions. Start a new one below!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeMissions.map(({ mission, submission }) => {
                const statusInfo = submission ? getStatusInfo(submission.status) : null;
                return (
                  <MissionCard 
                    key={mission.id} 
                    mission={mission}
                    progress={submission ? 50 : 0}
                    status={statusInfo}
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
              📚 Available Missions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableMissions.map(({ mission }) => (
                <MissionCard 
                  key={mission.id} 
                  mission={mission}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Completed Missions */}
        {completedMissions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              ✅ Completed Missions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedMissions.map(({ mission, submission }) => (
                <div 
                  key={mission.id} 
                  className="bg-green-500/10 border border-green-500/30 rounded-xl p-4"
                >
                  <h3 className="font-semibold mb-1">{mission.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{mission.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 text-sm">✅ Approved</span>
                    <span className="text-cyan-400 text-sm">+{submission?.xpEarned || mission.xpReward} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Graduation Progress */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            🚀 Your Journey
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

function StatCard({ label, value, icon, color }: { 
  label: string; 
  value: number | string; 
  icon: string;
  color: 'cyan' | 'blue' | 'green' | 'yellow';
}) {
  const colors = {
    cyan: 'from-cyan-500/20 to-transparent border-cyan-500/30 text-cyan-400',
    blue: 'from-blue-500/20 to-transparent border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-transparent border-green-500/30 text-green-400',
    yellow: 'from-yellow-500/20 to-transparent border-yellow-500/30 text-yellow-400',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-2xl font-bold ${colors[color].split(' ').pop()}`}>{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </motion.div>
  );
}

function MissionCard({ mission, progress, status }: { 
  mission: Mission; 
  progress?: number;
  status?: { label: string; color: string; bgColor: string; icon: string } | null;
}) {
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
        className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-cyan-500/50 transition-all"
      >
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[mission.difficulty] || difficultyColors[1]}`}>
            Level {mission.difficulty}
          </span>
          <span className="text-sm text-cyan-400 font-semibold">+{mission.xpReward} XP</span>
        </div>
        
        <h3 className="font-semibold mb-1">{mission.title}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{mission.description}</p>
        
        {status && (
          <div className={`mb-3 px-2 py-1 rounded-lg text-xs ${status.bgColor} ${status.color} inline-flex items-center gap-1`}>
            {status.icon} {status.label}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>⏱️ {mission.estimatedMinutes} min</span>
          <span>📋 {mission.steps?.length || 0} steps</span>
        </div>
        
        {progress !== undefined && progress > 0 && (
          <div className="mb-3">
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="w-full py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-semibold hover:bg-cyan-500/30 transition-colors text-center">
          {progress ? 'Continue →' : 'Start Mission →'}
        </div>
      </motion.div>
    </Link>
  );
}
