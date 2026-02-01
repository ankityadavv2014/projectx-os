// ProjectX OS - Parent Dashboard
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { 
  usersStore, 
  submissionsStore, 
  missionsStore, 
  userBadgesStore,
  badgesStore,
  reviewsStore
} from '@/lib/domain/store';
import { getLevelForXP, getXPProgress } from '@/lib/domain/types';
import { useEffect, useState } from 'react';
import type { User, Mission, Badge } from '@/lib/domain/types';
import { AIAssistant } from '@/components/ai';

interface ChildProgress {
  child: User;
  level: ReturnType<typeof getLevelForXP>;
  progress: ReturnType<typeof getXPProgress>;
  recentActivity: ActivityItem[];
  badges: Badge[];
}

interface ActivityItem {
  type: 'submission' | 'badge' | 'xp';
  title: string;
  description: string;
  date: string;
  status?: string;
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState<ChildProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user || !user.linkedChildIds) return;
    
    const childProgress: ChildProgress[] = user.linkedChildIds.map(childId => {
      const child = usersStore.getById(childId);
      if (!child) return null;
      
      const level = getLevelForXP(child.xp);
      const progress = getXPProgress(child.xp);
      
      // Get recent activity
      const submissions = submissionsStore.getByStudent(childId);
      const missions = missionsStore.getAll();
      const allBadges = badgesStore.getAll();
      const userBadgeRecords = userBadgesStore.getByUser(childId);
      
      const recentActivity: ActivityItem[] = [];
      
      // Add approved submissions
      submissions
        .filter(s => s.status === 'approved')
        .slice(0, 5)
        .forEach(submission => {
          const mission = missions.find(m => m.id === submission.missionId);
          const review = reviewsStore.getBySubmission(submission.id);
          if (mission) {
            recentActivity.push({
              type: 'submission',
              title: mission.title,
              description: review?.feedback || 'Completed successfully',
              date: submission.approvedAt || submission.updatedAt,
              status: 'approved',
            });
          }
        });
      
      // Get earned badges
      const badges = userBadgeRecords
        .map(ub => allBadges.find(b => b.id === ub.badgeId))
        .filter(Boolean) as Badge[];
      
      return {
        child,
        level,
        progress,
        recentActivity,
        badges,
      };
    }).filter(Boolean) as ChildProgress[];
    
    setChildren(childProgress);
    setIsLoading(false);
  }, [user]);
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* AI Assistant for Parents */}
      <AIAssistant context="default" />
      
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/" className="text-lg md:text-xl font-bold text-[var(--molten-orange)]">
              ProjectX
            </Link>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
              Parent
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm md:text-base">{user.displayName}</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Parent Dashboard 👨‍👩‍👧</h1>
          <p className="text-gray-400">
            Track your child&apos;s learning progress and achievements
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : children.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🔗</div>
            <h2 className="text-xl font-semibold mb-2">No Children Linked</h2>
            <p className="text-gray-400 mb-4">
              Enter your child&apos;s link code to connect your accounts
            </p>
            <button className="px-6 py-2 bg-[var(--molten-orange)] rounded-lg font-semibold">
              Link Child Account
            </button>
          </div>
        ) : (
          children.map(({ child, level, progress, recentActivity, badges }) => (
            <div key={child.id} className="mb-8">
              {/* Child Header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-6 mb-6"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
                    {child.displayName.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{child.displayName}</h2>
                    <p className="text-gray-400">
                      Grade {child.profile?.gradeLevel || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-3 bg-black/30 rounded-lg px-4 py-2">
                      <div>
                        <div className="text-sm text-gray-400">Level {level.level}</div>
                        <div className="text-lg font-semibold text-[var(--sacred-gold)]">{level.name}</div>
                      </div>
                      <div className="w-24">
                        <div className="text-xs text-gray-400 mb-1">{child.xp} XP</div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">📚 Recent Activity</h3>
                  
                  {recentActivity.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-gray-400">
                      No recent activity yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((activity, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white/5 border border-white/10 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-green-400">✅</span>
                                <span className="font-semibold">{activity.title}</span>
                              </div>
                              <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(activity.date).toLocaleDateString()}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Badges */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">🏆 Badges Earned</h3>
                  
                  {badges.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-gray-400">
                      No badges yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {badges.map(badge => (
                        <div 
                          key={badge.id}
                          className="bg-white/5 border rounded-lg p-3 text-center"
                          style={{ borderColor: badge.color }}
                        >
                          <div className="text-2xl mb-1">🏆</div>
                          <div className="text-sm font-semibold">{badge.name}</div>
                          <div className="text-xs text-gray-400">{badge.rarity}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Trust Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-white/5 border border-white/10 rounded-lg px-6 py-4">
            <div className="text-lg font-semibold mb-1">🔒 Your child&apos;s data is secure</div>
            <p className="text-sm text-gray-400">
              ProjectX is FERPA and COPPA compliant. Only you can see your linked child&apos;s progress.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
