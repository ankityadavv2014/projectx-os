// ProjectX OS — Mission Detail Page (Dynamic)
// Full mission view with step-by-step execution and AI guidance

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
import { MissionExecutor, type MissionData, type MissionStep } from '@/components/mission';
import { AIAssistant } from '@/components/ai';

// =============================================================================
// TYPES
// =============================================================================

interface PageProps {
  params: Promise<{ id: string }>;
}

type ViewStatus = 'overview' | 'executing' | 'submitted' | 'approved';

// =============================================================================
// HELPER: Convert store mission to MissionData with steps
// =============================================================================

function convertToMissionData(mission: Mission): MissionData {
  // Create structured steps from mission data
  const steps: MissionStep[] = [];
  
  // Step 1: Read the objective
  steps.push({
    id: 'objective',
    title: 'Understand the Mission',
    description: 'Read through the mission objective and understand what you need to accomplish.',
    type: 'read',
    content: `<h3>Mission: ${mission.title}</h3><p>${mission.description}</p><h4>Your Objective</h4><p>${mission.objective}</p>`,
    estimatedMinutes: 2,
  });
  
  // Step 2: Review materials if any
  if (mission.materials && mission.materials.length > 0) {
    steps.push({
      id: 'materials',
      title: 'Review Resources',
      description: 'Check out the materials and resources that will help you complete this mission.',
      type: 'read',
      content: `<h4>Available Resources</h4><ul>${mission.materials.map(m => `<li>${m}</li>`).join('')}</ul>`,
      estimatedMinutes: 3,
    });
  }
  
  // Step 3: Execute the steps (combine into practice tasks)
  if (mission.steps && mission.steps.length > 0) {
    steps.push({
      id: 'practice',
      title: 'Complete the Tasks',
      description: 'Work through each task step by step. Mark each one as complete when done.',
      type: 'do',
      content: 'Complete each checkpoint below by doing the required work.',
      checkpoints: mission.steps.map(s => s.title || s.content),
      estimatedMinutes: Math.max(mission.estimatedMinutes - 10, 5),
    });
  } else {
    // Default practice step if no structured steps
    steps.push({
      id: 'practice',
      title: 'Do the Work',
      description: 'Complete the mission objective. Take your time and do your best work.',
      type: 'do',
      content: mission.objective,
      checkpoints: [
        'I understand what I need to do',
        'I have gathered the necessary resources',
        'I have completed the main task',
        'I have reviewed my work for quality',
      ],
      estimatedMinutes: mission.estimatedMinutes - 10,
    });
  }
  
  // Step 4: Submit artifact
  steps.push({
    id: 'submit',
    title: 'Submit Your Work',
    description: 'Share a link to your completed work.',
    type: 'submit',
    content: 'Provide a URL to your work - this could be a GitHub repo, Figma file, Google Doc, video link, or any relevant artifact.',
    estimatedMinutes: 2,
  });
  
  // Step 5: Reflect
  steps.push({
    id: 'reflect',
    title: 'Reflect on Your Learning',
    description: 'Take a moment to think about what you learned.',
    type: 'reflect',
    content: 'Reflecting on your work helps solidify learning. What did you discover? What was challenging? How will you apply this?',
    estimatedMinutes: 3,
  });
  
  return {
    id: mission.id,
    title: mission.title,
    description: mission.description,
    difficulty: mission.difficulty,
    xpReward: mission.xpReward,
    estimatedMinutes: mission.estimatedMinutes,
    steps,
  };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function MissionDetailPage({ params }: PageProps) {
  const { id: missionId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  
  const [mission, setMission] = useState<Mission | null>(null);
  const [missionData, setMissionData] = useState<MissionData | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [status, setStatus] = useState<ViewStatus>('overview');
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Load mission and existing submission
  useEffect(() => {
    const m = missionsStore.getById(missionId);
    setMission(m);
    
    if (m) {
      setMissionData(convertToMissionData(m));
      
      if (user) {
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
          }
        }
        
        // Track view
        analytics.missionViewed(missionId, m.title, true);
      }
    }
    
    setLoading(false);
  }, [missionId, user]);
  
  // Handle mission completion
  const handleComplete = async (artifactUrl: string, reflection: string) => {
    if (!mission || !user) return;
    
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
    
    // Hide success after delay
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  // Exit mission execution
  const handleExit = () => {
    setStatus('overview');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--deep-space)] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-[var(--molten-orange)] border-t-transparent rounded-full"
        />
      </div>
    );
  }
  
  if (!mission || !missionData) {
    return (
      <div className="min-h-screen bg-[var(--deep-space)] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Mission Not Found</h1>
        <button
          onClick={() => router.push('/student')}
          className="px-6 py-3 bg-[var(--molten-orange)] rounded-lg hover:opacity-90 transition-opacity"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  // Show MissionExecutor when executing
  if (status === 'executing') {
    return (
      <>
        <MissionExecutor
          mission={missionData}
          onComplete={handleComplete}
          onExit={handleExit}
        />
        <AIAssistant context="mission" />
      </>
    );
  }
  
  // Overview / Submitted / Approved states
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--deep-space)] via-[#1a1a2e] to-[var(--deep-space)]" />
      
      {/* AI Assistant */}
      <AIAssistant context="mission" />
      
      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-[#1a1a2e] rounded-2xl p-8 md:p-12 text-center border border-[var(--neon-blue)]"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-[var(--neon-blue)] mb-2">Mission Submitted!</h2>
              <p className="text-white/60">Your work is now pending review.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/student')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-2 md:gap-3">
            <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium
              ${mission.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : ''}
              ${mission.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : ''}
              ${mission.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' : ''}
            `}>
              {mission.difficulty}
            </span>
            <span className="text-[var(--sacred-gold)] font-bold text-sm md:text-base">+{mission.xpReward} XP</span>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Mission Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl md:text-5xl">🎯</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{mission.title}</h1>
              <p className="text-white/60 text-sm md:text-base">
                {mission.difficulty} • ~{mission.estimatedMinutes} min
              </p>
            </div>
          </div>
          
          <p className="text-base md:text-lg text-white/70 mb-6 md:mb-8">{mission.description}</p>
          
          {/* Objective */}
          <div className="bg-[var(--molten-orange)]/10 border border-[var(--molten-orange)]/30 rounded-xl p-4 md:p-6 mb-6">
            <h3 className="text-lg font-bold mb-2 text-[var(--molten-orange)]">🎯 Objective</h3>
            <p className="text-white/80">{mission.objective}</p>
          </div>
          
          {/* What you'll do - Preview of steps */}
          <div className="bg-white/5 rounded-xl p-4 md:p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">📋 What You&apos;ll Do</h3>
            <div className="space-y-3">
              {missionData.steps.map((step, i) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-white/50">~{step.estimatedMinutes} min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </motion.div>
        
        {/* Status-based UI */}
        {status === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={() => {
                setStatus('executing');
                analytics.missionStarted(missionId, mission.title);
              }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] rounded-xl font-bold text-lg
                       hover:shadow-lg hover:shadow-[var(--molten-orange)]/30 transition-all transform hover:scale-105"
            >
              Start Mission →
            </button>
            <p className="text-white/40 text-sm mt-3">
              You&apos;ll be guided through each step
            </p>
          </motion.div>
        )}
        
        {status === 'submitted' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-xl p-6 md:p-8 border border-[var(--neon-blue)]/30 text-center"
          >
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-xl font-bold mb-2 text-[var(--neon-blue)]">Pending Review</h2>
            <p className="text-white/60 mb-6">
              Your submission is being reviewed by your teacher.
            </p>
            
            {submission && (
              <div className="bg-black/30 rounded-lg p-4 text-left">
                <p className="text-sm text-white/50 mb-2">
                  Submitted on {new Date(submission.submittedAt!).toLocaleDateString()}
                </p>
                {artifacts.length > 0 && (
                  <a
                    href={artifacts[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--neon-blue)] hover:underline"
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
            className="bg-white/5 rounded-xl p-6 md:p-8 border border-[var(--sacred-gold)]/30 text-center"
          >
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-xl font-bold mb-2 text-[var(--sacred-gold)]">Mission Complete!</h2>
            <p className="text-white/60 mb-6">
              Congratulations! You earned <span className="text-[var(--sacred-gold)] font-bold">+{mission.xpReward} XP</span>
            </p>
            
            <button
              onClick={() => router.push('/student')}
              className="px-6 py-3 bg-[var(--molten-orange)] rounded-lg hover:opacity-90 transition-opacity"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
