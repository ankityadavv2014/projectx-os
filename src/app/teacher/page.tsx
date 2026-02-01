// ProjectX OS - Teacher Dashboard (Go-Live Ready)
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  getSession,
  getCurrentUser,
  getStudentsForTeacher,
  hasRole,
} from '@/lib/auth';
import {
  getPendingReviewQueue,
  getTeacherStats,
  getStatusInfo,
} from '@/lib/domain';
import type { Submission, GoLiveUser } from '@/types/go-live';
import { useEffect, useState } from 'react';

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<GoLiveUser | null>(null);
  const [pendingReviews, setPendingReviews] = useState<Submission[]>([]);
  const [students, setStudents] = useState<GoLiveUser[]>([]);
  const [stats, setStats] = useState({ 
    pendingReviews: 0, 
    reviewedToday: 0, 
    totalReviewed: 0,
    averageReviewTime: 0 
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const init = async () => {
      const session = getSession();
      if (!session || !hasRole('teacher')) {
        router.push('/login');
        return;
      }
      
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      
      setUser(currentUser);
      
      // Load teacher data using Go-Live services
      const [assignedStudents, reviewQueue, teacherStats] = await Promise.all([
        getStudentsForTeacher(currentUser.id),
        getPendingReviewQueue(currentUser.id),
        getTeacherStats(currentUser.id),
      ]);
      
      setStudents(assignedStudents);
      setPendingReviews(reviewQueue);
      setStats(teacherStats);
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
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-lg font-bold">
                X
              </div>
              <span className="font-bold text-lg">ProjectX</span>
            </Link>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
              Teacher
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user.displayName}</span>
            <button
              onClick={() => {
                localStorage.removeItem('projectx_session');
                router.push('/login');
              }}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
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
          <h1 className="text-3xl font-bold mb-2">Teacher Dashboard 👩‍🏫</h1>
          <p className="text-gray-400">
            {stats.pendingReviews} submission{stats.pendingReviews !== 1 ? 's' : ''} awaiting review
          </p>
        </motion.div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Pending Reviews" value={stats.pendingReviews} icon="📋" highlight />
          <StatCard label="Reviewed Today" value={stats.reviewedToday} icon="✅" />
          <StatCard label="Total Reviewed" value={stats.totalReviewed} icon="📊" />
          <StatCard label="Assigned Students" value={students.length} icon="👥" />
        </div>
        
        {/* Review Queue */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              📝 Review Queue
            </h2>
            {pendingReviews.length > 0 && (
              <Link 
                href="/review"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                Start Reviewing →
              </Link>
            )}
          </div>
          
          {isLoading ? (
            <div className="text-gray-400">Loading...</div>
          ) : pendingReviews.length === 0 ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">✨</div>
              <div className="text-green-400 font-semibold">All caught up!</div>
              <div className="text-gray-400 text-sm">No pending reviews</div>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReviews.map((submission) => {
                const statusInfo = getStatusInfo(submission.status);
                return (
                  <Link key={submission.id} href="/review">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-cyan-500/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-lg">
                          {submission.userId.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold">Student: {submission.userId}</div>
                          <div className="text-sm text-gray-400">Mission: {submission.missionId}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-lg text-xs ${statusInfo.bgColor} ${statusInfo.color}`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">Submitted</div>
                          <div className="text-sm">
                            {submission.submittedAt 
                              ? new Date(submission.submittedAt).toLocaleDateString()
                              : 'Recently'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
        
        {/* My Students */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            👥 My Students
          </h2>
          
          {students.length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center text-gray-400">
              No students assigned yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map(student => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </section>
        
        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/review">
              <QuickAction icon="📝" label="Review Submissions" />
            </Link>
            <QuickAction icon="🎯" label="Assign Mission" />
            <QuickAction icon="📊" label="View Progress" />
            <QuickAction icon="📤" label="Export Report" />
          </div>
        </section>
      </main>
    </div>
  );
}

// =============================================================================
// COMPONENTS
// =============================================================================

function StatCard({ label, value, icon, highlight }: { 
  label: string; 
  value: number; 
  icon: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl p-4 ${
        highlight 
          ? 'bg-yellow-500/10 border border-yellow-500/30' 
          : 'bg-gray-900/50 border border-gray-800'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-2xl font-bold ${highlight ? 'text-yellow-400' : ''}`}>{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </motion.div>
  );
}

function StudentCard({ student }: { student: GoLiveUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-purple-500/50 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
          {student.displayName.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold">{student.displayName}</h3>
          <p className="text-sm text-gray-400">{student.email}</p>
        </div>
      </div>
      
      <div className="mt-3 flex items-center gap-4 text-sm">
        <span className="text-cyan-400">⚡ {student.xp} XP</span>
        <span className="text-purple-400">🎯 Level {student.level}</span>
      </div>
    </motion.div>
  );
}

function QuickAction({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center hover:bg-gray-800/50 hover:border-gray-700 transition-all cursor-pointer"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm">{label}</div>
    </motion.div>
  );
}
