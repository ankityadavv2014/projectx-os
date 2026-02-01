// ProjectX OS - Admin Dashboard
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { 
  orgsStore,
  cohortsStore, 
  usersStore,
  submissionsStore, 
  missionsStore 
} from '@/lib/domain/store';
import { useEffect, useState } from 'react';
import type { Organization, Cohort } from '@/lib/domain/types';

interface OrgStats {
  totalStudents: number;
  totalTeachers: number;
  totalCohorts: number;
  totalMissions: number;
  totalSubmissions: number;
  approvedSubmissions: number;
  weeklyActiveStudents: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [org, setOrg] = useState<Organization | null>(null);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [stats, setStats] = useState<OrgStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    // Get organization
    const organization = orgsStore.getById(user.orgId);
    setOrg(organization);
    
    // Get cohorts
    const orgCohorts = cohortsStore.getByOrg(user.orgId);
    setCohorts(orgCohorts);
    
    // Calculate stats
    const allUsers = usersStore.getAll().filter(u => u.orgId === user.orgId);
    const allSubmissions = submissionsStore.getAll();
    const allMissions = missionsStore.getAll();
    
    setStats({
      totalStudents: allUsers.filter(u => u.role === 'student').length,
      totalTeachers: allUsers.filter(u => u.role === 'teacher').length,
      totalCohorts: orgCohorts.length,
      totalMissions: allMissions.filter(m => m.status === 'published').length,
      totalSubmissions: allSubmissions.length,
      approvedSubmissions: allSubmissions.filter(s => s.status === 'approved').length,
      weeklyActiveStudents: allUsers.filter(u => 
        u.role === 'student' && 
        u.lastActiveAt && 
        new Date(u.lastActiveAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
    });
    
    setIsLoading(false);
  }, [user]);
  
  if (!user) return null;
  
  const completionRate = stats 
    ? Math.round((stats.approvedSubmissions / Math.max(stats.totalSubmissions, 1)) * 100)
    : 0;
  
  const adoptionRate = stats
    ? Math.round((stats.weeklyActiveStudents / Math.max(stats.totalStudents, 1)) * 100)
    : 0;
  
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-[var(--molten-orange)]">
              ProjectX
            </Link>
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
              Admin
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{org?.name || 'Organization'}</span>
            <Link href="/os" className="px-4 py-2 bg-[var(--molten-orange)] rounded-lg text-sm font-semibold hover:bg-[var(--molten-orange)]/80 transition-colors">
              OS Hub
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('projectx_session');
                router.push('/');
              }}
              className="text-sm text-gray-400 hover:text-red-400 transition-colors"
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
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard ⚙️</h1>
          <p className="text-gray-400">
            Organization overview and management
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              <MetricCard label="Students" value={stats?.totalStudents || 0} icon="🎓" />
              <MetricCard label="Teachers" value={stats?.totalTeachers || 0} icon="👨‍🏫" />
              <MetricCard label="Cohorts" value={stats?.totalCohorts || 0} icon="📚" />
              <MetricCard label="Missions" value={stats?.totalMissions || 0} icon="🎯" />
              <MetricCard label="Completion" value={`${completionRate}%`} icon="✅" />
              <MetricCard label="Adoption" value={`${adoptionRate}%`} icon="📈" highlight />
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Adoption Chart Placeholder */}
              <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">📊 Weekly Adoption</h3>
                <div className="h-48 flex items-end justify-around gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-12 bg-gradient-to-t from-orange-500 to-yellow-500 rounded-t"
                        style={{ height: `${30 + Math.random() * 70}%` }}
                      />
                      <span className="text-xs text-gray-400">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">📋 Quick Stats</h3>
                <div className="space-y-4">
                  <QuickStat 
                    label="Submissions Today" 
                    value="12" 
                    trend="+3 from yesterday"
                    positive 
                  />
                  <QuickStat 
                    label="Pending Reviews" 
                    value="8" 
                    trend="Average 4hr wait"
                  />
                  <QuickStat 
                    label="New Students This Week" 
                    value="15" 
                    trend="+25% vs last week"
                    positive
                  />
                  <QuickStat 
                    label="Badge Unlocks" 
                    value="34" 
                    trend="This week"
                  />
                </div>
              </div>
            </div>
            
            {/* Cohorts Management */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  📚 Cohorts
                </h2>
                <button className="px-4 py-2 bg-[var(--molten-orange)] rounded-lg text-sm font-semibold">
                  + Create Cohort
                </button>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-sm font-semibold text-gray-400">Cohort</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-400">Code</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-400">Students</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-400">Teachers</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohorts.map(cohort => (
                      <tr key={cohort.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <div className="font-semibold">{cohort.name}</div>
                          <div className="text-sm text-gray-400">Grade {cohort.gradeLevel}</div>
                        </td>
                        <td className="p-4">
                          <code className="text-[var(--neon-blue)]">{cohort.code}</code>
                        </td>
                        <td className="p-4">{cohort.studentCount || 0}</td>
                        <td className="p-4">{cohort.teacherIds.length}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="px-2 py-1 bg-white/10 rounded text-xs hover:bg-white/20">
                              Edit
                            </button>
                            <button className="px-2 py-1 bg-white/10 rounded text-xs hover:bg-white/20">
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            
            {/* Quick Actions */}
            <section>
              <h2 className="text-xl font-semibold mb-4">⚡ Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <QuickAction icon="👨‍🏫" label="Invite Teacher" />
                <QuickAction icon="📚" label="New Cohort" />
                <QuickAction icon="🎯" label="Create Mission" />
                <QuickAction icon="📊" label="View Reports" />
                <QuickAction icon="📤" label="Export Data" />
                <QuickAction icon="⚙️" label="Settings" />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

// =============================================================================
// COMPONENTS
// =============================================================================

function MetricCard({ label, value, icon, highlight }: { 
  label: string; 
  value: number | string; 
  icon: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-lg p-4 ${
        highlight 
          ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30' 
          : 'bg-white/5 border border-white/10'
      }`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </motion.div>
  );
}

function QuickStat({ label, value, trend, positive }: {
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-400">{label}</div>
        <div className="text-lg font-bold">{value}</div>
      </div>
      <div className={`text-xs ${positive ? 'text-green-400' : 'text-gray-400'}`}>
        {trend}
      </div>
    </div>
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
