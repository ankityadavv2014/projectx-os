// ProjectX OS - Cyberpunk Desktop Experience
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, logout as authLogout } from '@/lib/auth';
import { missionsStore, assignmentsStore, submissionsStore } from '@/lib/domain/store';
import { getLevelForXP, getXPProgress } from '@/lib/domain/types';
import type { Mission, Assignment } from '@/lib/domain/types';
import Link from 'next/link';
import { LogOut, Power } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface DockApp {
  id: string;
  name: string;
  icon: string;
  badge?: number;
  route?: string;
}

interface Window {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
  isMinimized: boolean;
  zIndex: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function OSDesktop() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [windows, setWindows] = useState<Window[]>([]);
  const [highestZ, setHighestZ] = useState(100);
  const [bootComplete, setBoot] = useState(false);
  const [todaysMissions, setTodaysMissions] = useState<{ mission: Mission; assignment: Assignment }[]>([]);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);
  
  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Boot animation
  useEffect(() => {
    const timer = setTimeout(() => setBoot(true), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Load missions
  useEffect(() => {
    if (!user) return;
    
    if (user.role === 'student') {
      const cohortIds = user.cohortIds || [];
      const allAssignments: Assignment[] = [];
      cohortIds.forEach(cohortId => {
        allAssignments.push(...assignmentsStore.getByCohort(cohortId));
      });
      
      const missions = missionsStore.getAll();
      const submissions = submissionsStore.getByStudent(user.id);
      
      const pending = allAssignments
        .filter(a => a.status === 'active')
        .map(assignment => {
          const mission = missions.find(m => m.id === assignment.missionId);
          const hasSubmission = submissions.some(s => s.missionId === assignment.missionId && s.status !== 'draft');
          return mission && !hasSubmission ? { mission, assignment } : null;
        })
        .filter(Boolean) as { mission: Mission; assignment: Assignment }[];
      
      setTodaysMissions(pending.slice(0, 3));
    }
    
    if (user.role === 'teacher' || user.role === 'admin') {
      const pending = submissionsStore.getPending().length;
      setPendingReviewCount(pending);
    }
  }, [user]);
  
  // Dock apps based on role
  const getDockApps = (): DockApp[] => {
    const base: DockApp[] = [
      { id: 'missions', name: 'Missions', icon: '🎯', route: '/student' },
      { id: 'portfolio', name: 'Portfolio', icon: '📁' },
      { id: 'badges', name: 'Badges', icon: '🏆' },
    ];
    
    if (user?.role === 'teacher' || user?.role === 'admin') {
      base.unshift({ 
        id: 'review', 
        name: 'Review Queue', 
        icon: '📝', 
        badge: pendingReviewCount,
        route: '/teacher'
      });
    }
    
    if (user?.role === 'admin') {
      base.push({ id: 'admin', name: 'Admin', icon: '⚙️', route: '/admin' });
    }
    
    base.push({ id: 'orb', name: 'AI Orb', icon: '🔮' });
    
    return base;
  };
  
  // Window management
  const openWindow = (id: string, title: string, icon: string, content: React.ReactNode) => {
    const existing = windows.find(w => w.id === id);
    if (existing) {
      bringToFront(id);
      return;
    }
    
    setHighestZ(z => z + 1);
    setWindows(prev => [...prev, {
      id,
      title,
      icon,
      content,
      isMinimized: false,
      zIndex: highestZ + 1,
    }]);
  };
  
  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };
  
  const handleLogout = () => {
    authLogout();
    router.push('/');
  };
  
  const bringToFront = (id: string) => {
    setHighestZ(z => z + 1);
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: highestZ + 1, isMinimized: false } : w
    ));
  };
  
  // Loading state
  if (authLoading) {
    return (
      <div className="h-screen bg-[var(--deep-space)] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-2 border-[var(--molten-orange)] border-t-transparent rounded-full"
        />
      </div>
    );
  }
  
  const level = user ? getLevelForXP(user.xp) : null;
  const progress = user ? getXPProgress(user.xp) : null;
  
  return (
    <div className="h-screen bg-[var(--deep-space)] overflow-hidden flex flex-col">
      {/* Boot Animation */}
      <AnimatePresence>
        {!bootComplete && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-[9999] bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl font-bold text-[var(--molten-orange)] mb-4"
              >
                ProjectX OS
              </motion.div>
              <div className="text-gray-500 text-sm">Loading experience...</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Top Bar */}
      <header className="h-10 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <span className="text-[var(--molten-orange)] font-bold text-sm">ProjectX</span>
          
          {user && (
            <span className="text-xs text-gray-400">
              {user.role === 'student' ? 'Student' : user.role === 'teacher' ? 'Teacher' : user.role === 'admin' ? 'Admin' : user.role}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* XP Bar (students) */}
          {user?.role === 'student' && level && progress && (
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1">
              <span className="text-xs text-[var(--sacred-gold)]">Lv{level.level}</span>
              <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs text-gray-400">{user.xp} XP</span>
            </div>
          )}
          
          {/* Time */}
          <div className="text-xs text-gray-400">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          
          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-white/5"
            title="Logout"
          >
            <Power className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </motion.button>
        </div>
      </header>
      
      {/* Desktop Area */}
      <main className="flex-1 relative overflow-hidden">
        {/* Wallpaper */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2f] to-[#0a0a0f]">
          <div className="absolute inset-0 opacity-30">
            {/* Animated grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,107,53,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.03) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>
        </div>
        
        {/* Welcome Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: bootComplete ? 1 : 0, y: bootComplete ? 0 : 20 }}
          transition={{ delay: 0.2 }}
          className="absolute top-8 left-8 max-w-md"
        >
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-1">
              {getGreeting()}, {user?.displayName?.split(' ')[0] || 'Explorer'}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              {user?.role === 'student' && todaysMissions.length > 0
                ? `You have ${todaysMissions.length} mission${todaysMissions.length > 1 ? 's' : ''} to complete`
                : user?.role === 'teacher' && pendingReviewCount > 0
                ? `${pendingReviewCount} submission${pendingReviewCount > 1 ? 's' : ''} awaiting review`
                : 'Ready to build something amazing?'}
            </p>
            
            {/* Today's Missions (Students) */}
            {user?.role === 'student' && todaysMissions.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Today&apos;s Missions</div>
                {todaysMissions.map(({ mission }) => (
                  <motion.button
                    key={mission.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openWindow(
                      `mission-${mission.id}`,
                      mission.title,
                      '🎯',
                      <MissionContent mission={mission} />
                    )}
                    className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{mission.title}</div>
                        <div className="text-xs text-gray-400">+{mission.xpReward} XP</div>
                      </div>
                      <span className="text-[var(--molten-orange)]">→</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
            
            {/* Quick Actions (Teachers/Admins) */}
            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <div className="flex gap-2 mt-2">
                <Link href="/teacher">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-[var(--molten-orange)] rounded-lg text-sm font-semibold"
                  >
                    Review Queue →
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Quick Stats Widget */}
        {user?.role === 'student' && level && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: bootComplete ? 1 : 0, x: bootComplete ? 0 : 20 }}
            transition={{ delay: 0.4 }}
            className="absolute top-8 right-8"
          >
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 w-48">
              <div className="text-center mb-3">
                <div className="text-3xl mb-1">🏅</div>
                <div className="text-lg font-bold text-[var(--sacred-gold)]">{level.name}</div>
                <div className="text-xs text-gray-400">Level {level.level} • {level.tier}</div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total XP</span>
                  <span className="text-white font-semibold">{user.xp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Next Level</span>
                  <span className="text-white">{progress?.required} XP</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Windows */}
        <AnimatePresence>
          {windows.map(window => (
            <OSWindow
              key={window.id}
              {...window}
              onClose={() => closeWindow(window.id)}
              onFocus={() => bringToFront(window.id)}
            />
          ))}
        </AnimatePresence>
      </main>
      
      {/* Dock */}
      <nav className="h-16 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-2 px-4">
        {getDockApps().map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: bootComplete ? 1 : 0, y: bootComplete ? 0 : 20 }}
            transition={{ delay: 0.1 * i }}
          >
            {app.route ? (
              <Link href={app.route}>
                <DockIcon app={app} />
              </Link>
            ) : (
              <DockIcon 
                app={app} 
                onClick={() => openWindow(app.id, app.name, app.icon, <AppPlaceholder name={app.name} />)}
              />
            )}
          </motion.div>
        ))}
      </nav>
    </div>
  );
}

// =============================================================================
// COMPONENTS
// =============================================================================

function DockIcon({ app, onClick }: { app: DockApp; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.2, y: -5 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="relative w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-2xl transition-colors"
      title={app.name}
    >
      {app.icon}
      {app.badge !== undefined && app.badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {app.badge > 9 ? '9+' : app.badge}
        </span>
      )}
    </motion.button>
  );
}

function OSWindow({ 
  id, title, icon, content, zIndex, onClose, onFocus 
}: Window & { onClose: () => void; onFocus: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{ zIndex }}
      onClick={onFocus}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-[90vw] bg-black/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl"
    >
      {/* Title Bar */}
      <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-xs"
        >
          ✕
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {content}
      </div>
    </motion.div>
  );
}

function MissionContent({ mission }: { mission: Mission }) {
  return (
    <div>
      <p className="text-gray-300 mb-4">{mission.description}</p>
      
      <div className="bg-white/5 rounded-lg p-3 mb-4">
        <div className="text-sm font-semibold mb-1">🎯 Objective</div>
        <p className="text-sm text-gray-400">{mission.objective}</p>
      </div>
      
      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-[var(--sacred-gold)]">+{mission.xpReward} XP</span>
        <span className="text-gray-400">⏱️ {mission.estimatedMinutes} min</span>
      </div>
      
      <button className="w-full py-2 bg-[var(--molten-orange)] rounded-lg font-semibold hover:bg-[var(--molten-orange)]/80 transition-colors">
        Start Mission →
      </button>
    </div>
  );
}

function AppPlaceholder({ name }: { name: string }) {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-4">🚧</div>
      <div className="text-lg font-semibold mb-2">{name}</div>
      <p className="text-sm text-gray-400">Coming soon...</p>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
