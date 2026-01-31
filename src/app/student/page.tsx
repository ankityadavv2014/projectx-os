// ProjectX OS - Student Dashboard
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { missionsStore, assignmentsStore, submissionsStore, userBadgesStore, badgesStore } from '@/lib/domain/store';
import { getLevelForXP, getXPProgress, GRADUATION_REQUIREMENTS, createDefaultPhaseProgress } from '@/lib/domain/types';
import { useEffect, useState } from 'react';
import type { Mission, Assignment, Submission, Badge, PhaseProgress } from '@/lib/domain/types';
import { GraduationDashboard } from '@/components/graduation';

interface AssignedMission {
  mission: Mission;
  assignment: Assignment;
  submission?: Submission;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [assignedMissions, setAssignedMissions] = useState<AssignedMission[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    // Get assignments for student's cohorts
    const cohortIds = user.cohortIds || [];
    const allAssignments: Assignment[] = [];
    cohortIds.forEach(cohortId => {
      allAssignments.push(...assignmentsStore.getByCohort(cohortId));
    });
    
    // Get missions and submissions
    const missions = missionsStore.getAll();
    const submissions = submissionsStore.getByStudent(user.id);
    
    const assigned = allAssignments.map(assignment => {
      const mission = missions.find(m => m.id === assignment.missionId);
      const submission = submissions.find(s => s.missionId === assignment.missionId);
      return mission ? { mission, assignment, submission } : null;
    }).filter(Boolean) as AssignedMission[];
    
    setAssignedMissions(assigned);
    
    // Get earned badges
    const userBadgeRecords = userBadgesStore.getByUser(user.id);
    const badges = badgesStore.getAll();
    const earned = userBadgeRecords.map(ub => badges.find(b => b.id === ub.badgeId)).filter(Boolean) as Badge[];
    setEarnedBadges(earned);
    
    setIsLoading(false);
  }, [user]);
  
  if (!user) return null;
  
  const level = getLevelForXP(user.xp);
  const progress = getXPProgress(user.xp);
  
  const pendingMissions = assignedMissions.filter(am => !am.submission || am.submission.status === 'draft');
  const submittedMissions = assignedMissions.filter(am => am.submission?.status === 'submitted' || am.submission?.status === 'in_review');
  const completedMissions = assignedMissions.filter(am => am.submission?.status === 'approved');
  
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-[var(--molten-orange)]">
              ProjectX
            </Link>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
              Student
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* XP Display */}
            <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2">
              <div className="text-right">
                <div className="text-xs text-gray-400">Level {level.level}</div>
                <div className="text-sm font-semibold text-[var(--sacred-gold)]">{level.name}</div>
              </div>
              <div className="w-24">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{progress.current} XP</span>
                  <span>{progress.required} XP</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] rounded-full"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <Link href="/os" className="px-4 py-2 bg-[var(--molten-orange)] rounded-lg text-sm font-semibold hover:bg-[var(--molten-orange)]/80 transition-colors">
              Enter OS →
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.displayName}! 👋</h1>
          <p className="text-gray-400">
            You have {pendingMissions.length} mission{pendingMissions.length !== 1 ? 's' : ''} to complete
          </p>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total XP" value={user.xp} icon="⚡" color="orange" />
          <StatCard label="Level" value={level.level} icon="📊" color="blue" />
          <StatCard label="Completed" value={completedMissions.length} icon="✅" color="green" />
          <StatCard label="Badges" value={earnedBadges.length} icon="🏆" color="gold" />
        </div>
        
        {/* Today's Missions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            🎯 Active Missions
          </h2>
          
          {isLoading ? (
            <div className="text-gray-400">Loading...</div>
          ) : pendingMissions.length === 0 ? (
            <div className="bg-white/5 rounded-lg p-6 text-center text-gray-400">
              No pending missions. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingMissions.map(({ mission, assignment }) => (
                <MissionCard 
                  key={mission.id} 
                  mission={mission} 
                  dueDate={assignment.dueDate} 
                />
              ))}
            </div>
          )}
        </section>
        
        {/* Submitted (Awaiting Review) */}
        {submittedMissions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              ⏳ Awaiting Review
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {submittedMissions.map(({ mission, submission }) => (
                <div key={mission.id} className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{mission.title}</h3>
                  <p className="text-sm text-gray-400">Submitted for review</p>
                  <div className="mt-2 text-xs text-yellow-400">🔄 {submission?.status}</div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Recent Badges */}
        {earnedBadges.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🏅 Your Badges
            </h2>
            <div className="flex flex-wrap gap-4">
              {earnedBadges.map(badge => (
                <div 
                  key={badge.id} 
                  className="bg-white/5 border border-white/10 rounded-lg p-4 text-center w-32"
                  style={{ borderColor: badge.color }}
                >
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-sm font-semibold">{badge.name}</div>
                  <div className="text-xs text-gray-400">{badge.rarity}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Phase Progression */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            🚀 Your Journey
          </h2>
          <div className="max-w-xl">
            <GraduationDashboard 
              currentPhase={user.currentPhase}
              progress={user.phaseProgress || createDefaultPhaseProgress()}
            />
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
  color: 'orange' | 'blue' | 'green' | 'gold';
}) {
  const colors = {
    orange: 'from-orange-500/20 to-transparent border-orange-500/30',
    blue: 'from-blue-500/20 to-transparent border-blue-500/30',
    green: 'from-green-500/20 to-transparent border-green-500/30',
    gold: 'from-yellow-500/20 to-transparent border-yellow-500/30',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-lg p-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </motion.div>
  );
}

function MissionCard({ mission, dueDate }: { mission: Mission; dueDate?: string }) {
  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    hard: 'bg-red-500/20 text-red-400',
  };
  
  return (
    <Link href={`/mission/${mission.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:border-[var(--molten-orange)]/50 transition-all"
      >
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[mission.difficulty]}`}>
            {mission.difficulty}
          </span>
          <span className="text-sm text-[var(--sacred-gold)]">+{mission.xpReward} XP</span>
        </div>
        
        <h3 className="font-semibold mb-1">{mission.title}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{mission.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>⏱️ {mission.estimatedMinutes} min</span>
          {dueDate && (
            <span>📅 Due: {new Date(dueDate).toLocaleDateString()}</span>
          )}
        </div>
        
        <div className="w-full mt-3 py-2 bg-[var(--molten-orange)]/20 text-[var(--molten-orange)] rounded-lg text-sm font-semibold hover:bg-[var(--molten-orange)]/30 transition-colors text-center">
          Start Mission →
        </div>
      </motion.div>
    </Link>
  );
}
