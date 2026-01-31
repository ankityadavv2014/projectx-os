// ProjectX OS — Mission Detail Page (Dynamic)
// Full mission view with submission flow

'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { 
  missionsStore, 
  submissionsStore, 
  artifactsStore,
  type Mission, 
  type Submission,
  type Artifact,
} from '@/lib/domain';
import { events as analytics } from '@/lib/analytics';

// =============================================================================
// TYPES
// =============================================================================

interface PageProps {
  params: Promise<{ id: string }>;
}

type ViewStatus = 'not_started' | 'in_progress' | 'submitted' | 'approved';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function MissionDetailPage({ params }: PageProps) {
  const { id: missionId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  
  const [mission, setMission] = useState<Mission | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [status, setStatus] = useState<ViewStatus>('not_started');
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [artifactUrl, setArtifactUrl] = useState('');
  const [reflection, setReflection] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Load mission and existing submission
  useEffect(() => {
    const m = missionsStore.getById(missionId);
    setMission(m);
    
    if (m && user) {
      // Check for existing submission
      const allSubs = submissionsStore.getByStudent(user.id);
      const existingSub = allSubs.find((s: Submission) => s.missionId === missionId);
      if (existingSub) {
        setSubmission(existingSub);
        // Load artifacts
        const arts = artifactsStore.getBySubmission(existingSub.id);
        setArtifacts(arts);
        
        if (existingSub.status === 'approved') {
          setStatus('approved');
        } else if (existingSub.status === 'submitted' || existingSub.status === 'in_review') {
          setStatus('submitted');
        } else {
          setStatus('in_progress');
        }
      }
      
      // Track view
      analytics.missionViewed(missionId, m.title, true);
    }
    
    setLoading(false);
  }, [missionId, user]);
  
  // Start mission
  const handleStart = () => {
    if (!mission) return;
    setStatus('in_progress');
    analytics.missionStarted(missionId, mission.title);
  };
  
  // Submit artifact
  const handleSubmit = async () => {
    if (!mission || !user || !artifactUrl) return;
    
    setSubmitting(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const now = new Date().toISOString();
    const submissionId = crypto.randomUUID();
    
    // Create artifact first
    const artifact: Artifact = {
      id: crypto.randomUUID(),
      submissionId,
      type: 'link',
      url: artifactUrl,
      createdAt: now,
    };
    artifactsStore.create(artifact);
    
    // Create submission
    const newSubmission: Submission = {
      id: submissionId,
      missionId: mission.id,
      studentId: user.id,
      cohortId: user.cohortIds[0] || 'cohort-innovators',
      artifactIds: [artifact.id],
      reflection,
      status: 'submitted',
      createdAt: now,
      updatedAt: now,
      submittedAt: now,
    };
    
    submissionsStore.create(newSubmission);
    setSubmission(newSubmission);
    setArtifacts([artifact]);
    setStatus('submitted');
    setShowSuccess(true);
    
    // Track events
    analytics.artifactUploaded(mission.id, 'link');
    analytics.artifactSubmitted(newSubmission.id, mission.id, reflection.length > 0, reflection.length);
    
    setSubmitting(false);
    
    // Hide success after delay
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
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
  
  if (!mission) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Mission Not Found</h1>
        <button
          onClick={() => router.push('/student')}
          className="px-6 py-3 bg-[#ff6b35] rounded-lg hover:bg-[#ff8555] transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]" />
      
      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-[#1a1a2e] rounded-2xl p-12 text-center border border-[#00d4ff]"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-[#00d4ff] mb-2">Mission Submitted!</h2>
              <p className="text-gray-400">Your work is now pending review.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/student')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium
              ${mission.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : ''}
              ${mission.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : ''}
              ${mission.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' : ''}
            `}>
              {mission.difficulty}
            </span>
            <span className="text-[#ffd700] font-bold">+{mission.xpReward} XP</span>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Mission Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">🎯</span>
            <div>
              <h1 className="text-3xl font-bold">{mission.title}</h1>
              <p className="text-gray-400">{mission.difficulty} • ~{mission.estimatedMinutes} min</p>
            </div>
          </div>
          
          <p className="text-lg text-gray-300 mb-8">{mission.description}</p>
          
          {/* Objective */}
          <div className="bg-[#ff6b35]/10 border border-[#ff6b35]/30 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold mb-2 text-[#ff6b35]">Objective</h3>
            <p className="text-gray-300">{mission.objective}</p>
          </div>
          
          {/* Materials */}
          {mission.materials.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold mb-4">Materials</h3>
              <ul className="space-y-2">
                {mission.materials.map((material: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#00d4ff]">•</span>
                    <span className="text-gray-300">{material}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Steps */}
          {mission.steps.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold mb-4">Steps</h3>
              <ol className="space-y-4">
                {mission.steps.map((step, i: number) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#00d4ff]/20 text-[#00d4ff] rounded-full flex items-center justify-center font-bold text-sm">
                      {step.order}
                    </span>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-gray-400">{step.content}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </motion.div>
        
        {/* Status-based UI */}
        {status === 'not_started' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-gradient-to-r from-[#ff6b35] to-[#ff8555] rounded-xl font-bold text-lg
                       hover:shadow-lg hover:shadow-[#ff6b35]/30 transition-all transform hover:scale-105"
            >
              Start Mission
            </button>
          </motion.div>
        )}
        
        {status === 'in_progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-xl p-8 border border-white/10"
          >
            <h2 className="text-xl font-bold mb-6">Submit Your Work</h2>
            
            {/* Artifact URL */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Link to your work *</label>
              <input
                type="url"
                value={artifactUrl}
                onChange={(e) => setArtifactUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white
                         focus:border-[#00d4ff] focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                Share a link to your project, document, video, or any relevant artifact.
              </p>
            </div>
            
            {/* Reflection */}
            <div className="mb-8">
              <label className="block text-sm text-gray-400 mb-2">Reflection (optional)</label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What did you learn? What challenges did you face?"
                rows={4}
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white
                         focus:border-[#00d4ff] focus:outline-none transition-colors resize-none"
              />
            </div>
            
            {/* Submit */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStatus('not_started')}
                className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={!artifactUrl || submitting}
                className="px-8 py-3 bg-gradient-to-r from-[#00d4ff] to-[#00b4d8] rounded-lg font-bold
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:shadow-lg hover:shadow-[#00d4ff]/30 transition-all"
              >
                {submitting ? 'Submitting...' : 'Submit Mission'}
              </button>
            </div>
          </motion.div>
        )}
        
        {status === 'submitted' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-xl p-8 border border-[#00d4ff]/30 text-center"
          >
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-xl font-bold mb-2 text-[#00d4ff]">Pending Review</h2>
            <p className="text-gray-400 mb-6">
              Your submission is being reviewed by your teacher.
            </p>
            
            {submission && (
              <div className="bg-black/30 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-500 mb-2">Submitted on {new Date(submission.submittedAt!).toLocaleDateString()}</p>
                {artifacts.length > 0 && (
                  <a
                    href={artifacts[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00d4ff] hover:underline"
                  >
                    View your submission →
                  </a>
                )}
              </div>
            )}
          </motion.div>
        )}
        
        {status === 'approved' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-xl p-8 border border-[#ffd700]/30 text-center"
          >
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-xl font-bold mb-2 text-[#ffd700]">Mission Complete!</h2>
            <p className="text-gray-400 mb-6">
              Congratulations! You earned <span className="text-[#ffd700] font-bold">+{mission.xpReward} XP</span>
            </p>
            
            <button
              onClick={() => router.push('/student')}
              className="px-6 py-3 bg-[#ff6b35] rounded-lg hover:bg-[#ff8555] transition-colors"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
