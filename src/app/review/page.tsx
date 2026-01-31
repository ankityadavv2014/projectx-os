// ProjectX OS — Teacher Review Queue
// Review submissions, provide feedback, approve/request revisions

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth, useRequireRole } from '@/lib/auth';
import { 
  submissionsStore, 
  missionsStore, 
  usersStore, 
  xpEventsStore,
  reviewsStore,
  artifactsStore,
  type Submission, 
  type Mission, 
  type User,
  type Review,
  type XPEvent,
  type Artifact,
} from '@/lib/domain';
import { events as analytics } from '@/lib/analytics';

// =============================================================================
// TYPES
// =============================================================================

interface SubmissionWithDetails extends Submission {
  mission: Mission;
  student: User;
  loadedArtifacts: Artifact[];
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ReviewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const canReview = useRequireRole(['teacher', 'facilitator', 'admin']);
  
  const [submissions, setSubmissions] = useState<SubmissionWithDetails[]>([]);
  const [selected, setSelected] = useState<SubmissionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Review form state
  const [feedback, setFeedback] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Load pending submissions
  useEffect(() => {
    if (!canReview) {
      router.push('/');
      return;
    }
    
    const allSubmissions = submissionsStore.getAll();
    const pending = allSubmissions
      .filter((s: Submission) => s.status === 'submitted')
      .map((s: Submission) => {
        const mission = missionsStore.getById(s.missionId);
        const student = usersStore.getById(s.studentId);
        const loadedArtifacts = artifactsStore.getBySubmission(s.id);
        if (mission && student) {
          return { ...s, mission, student, loadedArtifacts };
        }
        return null;
      })
      .filter((s): s is SubmissionWithDetails => s !== null);
    
    setSubmissions(pending);
    if (pending.length > 0) {
      setSelected(pending[0]);
    }
    setLoading(false);
  }, [canReview, router]);
  
  // Handle approval
  const handleApprove = async () => {
    if (!selected || !user) return;
    
    setSubmitting(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const now = new Date().toISOString();
    
    // Update submission status
    submissionsStore.update(selected.id, {
      status: 'approved',
      approvedAt: now,
    });
    
    // Create review record
    const review: Review = {
      id: crypto.randomUUID(),
      submissionId: selected.id,
      reviewerId: user.id,
      reviewerRole: user.role as 'teacher' | 'admin' | 'facilitator',
      rubricId: selected.mission.rubricId,
      scores: Object.entries(scores).map(([id, score]) => ({
        criterionId: id,
        score,
      })),
      totalScore: Object.values(scores).reduce((a, b) => a + b, 0),
      feedback,
      decision: 'approved',
      createdAt: now,
    };
    reviewsStore.create(review);
    
    // Get current XP for event
    const student = usersStore.getById(selected.studentId);
    const currentXp = student?.xp || 0;
    
    // Award XP
    const xpEvent: XPEvent = {
      id: crypto.randomUUID(),
      userId: selected.studentId,
      amount: selected.mission.xpReward,
      source: 'mission',
      sourceId: selected.missionId,
      sourceDescription: `Completed mission: ${selected.mission.title}`,
      totalBefore: currentXp,
      totalAfter: currentXp + selected.mission.xpReward,
      createdAt: now,
    };
    xpEventsStore.create(xpEvent);
    
    // Update student XP
    if (student) {
      usersStore.update(selected.studentId, {
        xp: currentXp + selected.mission.xpReward,
      });
    }
    
    // Track analytics
    analytics.submissionApproved(
      selected.id, 
      selected.missionId, 
      selected.studentId, 
      selected.mission.xpReward, 
      []
    );
    
    // Update UI
    setSuccessMessage(`Approved! ${selected.student.displayName} earned +${selected.mission.xpReward} XP`);
    setShowSuccess(true);
    
    // Remove from queue
    const remaining = submissions.filter(s => s.id !== selected.id);
    setSubmissions(remaining);
    setSelected(remaining.length > 0 ? remaining[0] : null);
    
    // Reset form
    setFeedback('');
    setScores({});
    setSubmitting(false);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  // Handle revision request
  const handleRequestRevision = async () => {
    if (!selected || !user || !feedback) return;
    
    setSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const now = new Date().toISOString();
    
    // Update submission
    submissionsStore.update(selected.id, {
      status: 'revision_requested',
    });
    
    // Create review
    const review: Review = {
      id: crypto.randomUUID(),
      submissionId: selected.id,
      reviewerId: user.id,
      reviewerRole: user.role as 'teacher' | 'admin' | 'facilitator',
      rubricId: selected.mission.rubricId,
      scores: [],
      totalScore: 0,
      feedback,
      decision: 'revision_requested',
      createdAt: now,
    };
    reviewsStore.create(review);
    
    // Track analytics
    analytics.submissionRevisionRequested(
      selected.id,
      selected.missionId,
      selected.studentId,
      feedback
    );
    
    // Update UI
    setSuccessMessage('Revision requested. Student will be notified.');
    setShowSuccess(true);
    
    const remaining = submissions.filter(s => s.id !== selected.id);
    setSubmissions(remaining);
    setSelected(remaining.length > 0 ? remaining[0] : null);
    
    setFeedback('');
    setScores({});
    setSubmitting(false);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  if (!canReview) return null;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-[#ff6b35] border-t-transparent rounded-full"
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]" />
      
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/teacher')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold">Review Queue</h1>
            <span className="px-2 py-1 bg-[#ff6b35]/20 text-[#ff6b35] rounded text-sm">
              {submissions.length} pending
            </span>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
            <p className="text-gray-400">No pending submissions to review.</p>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Submission List */}
            <div className="space-y-4">
              <h2 className="text-sm text-gray-400 uppercase tracking-wider mb-4">Submissions</h2>
              
              {submissions.map(sub => (
                <motion.button
                  key={sub.id}
                  onClick={() => setSelected(sub)}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected?.id === sub.id 
                      ? 'bg-[#ff6b35]/10 border-[#ff6b35]' 
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🎯</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{sub.mission.title}</p>
                      <p className="text-sm text-gray-400">{sub.student.displayName}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Submitted {new Date(sub.submittedAt!).toLocaleDateString()}</span>
                    <span className="text-[#ffd700]">+{sub.mission.xpReward} XP</span>
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* Review Panel */}
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Submission Details */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="text-4xl">🎯</span>
                    <div>
                      <h2 className="text-xl font-bold">{selected.mission.title}</h2>
                      <p className="text-gray-400">
                        by <span className="text-[#00d4ff]">{selected.student.displayName}</span>
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-[#ffd700] font-bold">+{selected.mission.xpReward} XP</p>
                      <p className="text-xs text-gray-500">
                        {selected.mission.difficulty}
                      </p>
                    </div>
                  </div>
                  
                  {/* Artifacts */}
                  <div className="mb-6">
                    <h3 className="text-sm text-gray-400 mb-3">Submitted Work</h3>
                    <div className="space-y-2">
                      {selected.loadedArtifacts.map((artifact: Artifact) => (
                        <a
                          key={artifact.id}
                          href={artifact.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-colors"
                        >
                          <span className="text-xl">📎</span>
                          <span className="flex-1 truncate">{artifact.url}</span>
                          <span className="text-[#00d4ff]">Open →</span>
                        </a>
                      ))}
                      {selected.loadedArtifacts.length === 0 && (
                        <p className="text-gray-500 italic">No artifacts submitted</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Student Reflection */}
                  {selected.reflection && (
                    <div className="mb-6">
                      <h3 className="text-sm text-gray-400 mb-3">Student Reflection</h3>
                      <div className="p-4 bg-black/30 rounded-lg italic text-gray-300">
                        &quot;{selected.reflection}&quot;
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Review Form */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold mb-4">Your Review</h3>
                  
                  {/* Quick Scores */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {['Quality', 'Creativity', 'Effort'].map(criterion => (
                      <div key={criterion}>
                        <label className="text-sm text-gray-400 mb-2 block">{criterion}</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(score => (
                            <button
                              key={score}
                              onClick={() => setScores(prev => ({ ...prev, [criterion.toLowerCase()]: score }))}
                              className={`flex-1 py-2 rounded ${
                                scores[criterion.toLowerCase()] >= score
                                  ? 'bg-[#ffd700] text-black'
                                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Feedback */}
                  <div className="mb-6">
                    <label className="text-sm text-gray-400 mb-2 block">Feedback</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share constructive feedback..."
                      rows={4}
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white
                               focus:border-[#00d4ff] focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleRequestRevision}
                      disabled={submitting || !feedback}
                      className="flex-1 px-6 py-3 border border-yellow-500 text-yellow-500 rounded-lg
                               hover:bg-yellow-500/10 transition-colors
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Request Revision
                    </button>
                    
                    <button
                      onClick={handleApprove}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg font-bold
                               hover:shadow-lg hover:shadow-green-500/30 transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Processing...' : 'Approve & Award XP'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
