// ProjectX OS - Teacher Dashboard
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { 
  cohortsStore, 
  submissionsStore, 
  missionsStore, 
  usersStore,
  assignmentsStore 
} from '@/lib/domain/store';
import { useEffect, useState } from 'react';
import type { Cohort, Submission, Mission, User } from '@/lib/domain/types';

interface SubmissionWithDetails {
  submission: Submission;
  mission: Mission;
  student: User;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [pendingReviews, setPendingReviews] = useState<SubmissionWithDetails[]>([]);
  const [stats, setStats] = useState({ students: 0, submissions: 0, approved: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    // Get teacher's cohorts
    const teacherCohorts = cohortsStore.getAll().filter(c => 
      c.teacherIds.includes(user.id)
    );
    setCohorts(teacherCohorts);
    
    // Get all submissions from teacher's cohorts
    const allSubmissions: Submission[] = [];
    teacherCohorts.forEach(cohort => {
      allSubmissions.push(...submissionsStore.getByCohort(cohort.id));
    });
    
    // Get pending reviews
    const pending = allSubmissions
      .filter(s => s.status === 'submitted')
      .map(submission => {
        const mission = missionsStore.getById(submission.missionId);
        const student = usersStore.getById(submission.studentId);
        return mission && student ? { submission, mission, student } : null;
      })
      .filter(Boolean) as SubmissionWithDetails[];
    
    setPendingReviews(pending);
    
    // Calculate stats
    const allStudents = new Set<string>();
    teacherCohorts.forEach(cohort => {
      usersStore.getByCohort(cohort.id).forEach(s => allStudents.add(s.id));
    });
    
    setStats({
      students: allStudents.size,
      submissions: allSubmissions.length,
      approved: allSubmissions.filter(s => s.status === 'approved').length,
    });
    
    setIsLoading(false);
  }, [user]);
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-[var(--molten-orange)]">
              ProjectX
            </Link>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              Teacher
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user.displayName}</span>
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
          <h1 className="text-3xl font-bold mb-2">Teacher Dashboard 👨‍🏫</h1>
          <p className="text-gray-400">
            {pendingReviews.length} submission{pendingReviews.length !== 1 ? 's' : ''} awaiting review
          </p>
        </motion.div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Cohorts" value={cohorts.length} icon="📚" />
          <StatCard label="Students" value={stats.students} icon="👥" />
          <StatCard label="Pending Reviews" value={pendingReviews.length} icon="📝" highlight />
          <StatCard label="Approved" value={stats.approved} icon="✅" />
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
                className="px-4 py-2 bg-[var(--molten-orange)] rounded-lg text-sm font-semibold hover:bg-[var(--molten-orange)]/80 transition-colors"
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
              {pendingReviews.map(({ submission, mission, student }) => (
                <Link 
                  key={submission.id}
                  href="/review"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between hover:border-[var(--molten-orange)]/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-lg">
                        {student.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{student.displayName}</div>
                        <div className="text-sm text-gray-400">{mission.title}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Submitted</div>
                        <div className="text-sm">
                          {submission.submittedAt 
                            ? new Date(submission.submittedAt).toLocaleDateString()
                            : 'Recently'}
                        </div>
                      </div>
                      <div className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                        Review
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </section>
        
        {/* Cohorts */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              📚 Your Cohorts
            </h2>
            <button className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
              + Assign Mission
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cohorts.map(cohort => (
              <CohortCard key={cohort.id} cohort={cohort} />
            ))}
          </div>
        </section>
        
        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction icon="📝" label="Review Submissions" />
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
      className={`rounded-lg p-4 ${
        highlight 
          ? 'bg-orange-500/20 border border-orange-500/30' 
          : 'bg-white/5 border border-white/10'
      }`}
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

function CohortCard({ cohort }: { cohort: Cohort }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-blue-500/50 transition-all cursor-pointer"
    >
      <h3 className="font-semibold mb-1">{cohort.name}</h3>
      <div className="text-sm text-gray-400 mb-3">
        Code: <span className="font-mono text-[var(--neon-blue)]">{cohort.code}</span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">{cohort.studentCount || 0} students</span>
        <span className="text-gray-400">Grade {cohort.gradeLevel}</span>
      </div>
    </motion.div>
  );
}

function QuickAction({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:bg-white/10 hover:border-white/20 transition-all">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm">{label}</div>
    </button>
  );
}
