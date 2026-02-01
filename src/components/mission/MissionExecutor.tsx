// ProjectX OS — Interactive Mission Component
// Step-by-step mission execution with AI guidance
'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// TYPES
// =============================================================================

export interface MissionStep {
  id: string;
  title: string;
  description: string;
  type: 'read' | 'watch' | 'do' | 'submit' | 'reflect';
  content?: string;
  videoUrl?: string;
  checkpoints?: string[];
  estimatedMinutes: number;
}

export interface MissionData {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  estimatedMinutes: number;
  steps: MissionStep[];
  requirements?: string[];
  skills?: string[];
}

interface MissionExecutorProps {
  mission: MissionData;
  onComplete: (artifactUrl: string, reflection: string) => void;
  onExit: () => void;
}

// =============================================================================
// STEP ICONS
// =============================================================================

const stepIcons: Record<string, string> = {
  read: '📖',
  watch: '🎬',
  do: '⚡',
  submit: '📤',
  reflect: '💭',
};

const stepLabels: Record<string, string> = {
  read: 'Read',
  watch: 'Watch',
  do: 'Practice',
  submit: 'Submit',
  reflect: 'Reflect',
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function MissionExecutor({ mission, onComplete, onExit }: MissionExecutorProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [checkpointStates, setCheckpointStates] = useState<Record<string, boolean>>({});
  const [artifactUrl, setArtifactUrl] = useState('');
  const [reflection, setReflection] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  const currentStep = mission.steps[currentStepIndex];
  const progress = (completedSteps.size / mission.steps.length) * 100;
  const isLastStep = currentStepIndex === mission.steps.length - 1;
  const allCheckpointsComplete = currentStep.checkpoints
    ? currentStep.checkpoints.every((_, i) => checkpointStates[`${currentStep.id}-${i}`])
    : true;
  
  // Mark step as complete
  const completeStep = useCallback(() => {
    setCompletedSteps(prev => new Set([...prev, currentStep.id]));
    
    if (isLastStep) {
      setShowSubmitModal(true);
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStep.id, isLastStep]);
  
  // Toggle checkpoint
  const toggleCheckpoint = (index: number) => {
    const key = `${currentStep.id}-${index}`;
    setCheckpointStates(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  // Navigate steps
  const goToStep = (index: number) => {
    if (index <= completedSteps.size) {
      setCurrentStepIndex(index);
    }
  };
  
  // Final submission
  const handleFinalSubmit = () => {
    if (!artifactUrl.trim()) return;
    onComplete(artifactUrl, reflection);
  };
  
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* Header with progress */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onExit}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Exit Mission
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/60">Progress</span>
              <span className="text-[var(--sacred-gold)] font-semibold">{Math.round(progress)}%</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Step indicators */}
          <div className="flex items-center justify-between mt-3 overflow-x-auto pb-2">
            {mission.steps.map((step, index) => {
              const isComplete = completedSteps.has(step.id);
              const isCurrent = index === currentStepIndex;
              const isAccessible = index <= completedSteps.size;
              
              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  disabled={!isAccessible}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-[var(--molten-orange)] text-white'
                      : isComplete
                      ? 'bg-green-500/20 text-green-400'
                      : isAccessible
                      ? 'bg-white/5 text-white/60 hover:bg-white/10'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <span>{stepIcons[step.type]}</span>
                  <span className="hidden md:inline">{step.title}</span>
                  <span className="md:hidden">{index + 1}</span>
                  {isComplete && <span className="text-green-400">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Step header */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{stepIcons[currentStep.type]}</span>
                <div className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/60">
                  {stepLabels[currentStep.type]} • ~{currentStep.estimatedMinutes} min
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{currentStep.title}</h1>
              <p className="text-white/70 text-base md:text-lg">{currentStep.description}</p>
            </div>
            
            {/* Step content based on type */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
              {currentStep.type === 'read' && currentStep.content && (
                <div 
                  className="prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentStep.content }}
                />
              )}
              
              {currentStep.type === 'watch' && currentStep.videoUrl && (
                <div className="aspect-video bg-black rounded-xl overflow-hidden">
                  <iframe
                    src={currentStep.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              
              {currentStep.type === 'do' && (
                <div className="space-y-4">
                  <div className="text-white/70">{currentStep.content}</div>
                  
                  {/* Checkpoints */}
                  {currentStep.checkpoints && currentStep.checkpoints.length > 0 && (
                    <div className="space-y-3 mt-6">
                      <h3 className="text-lg font-semibold text-[var(--sacred-gold)]">
                        ✅ Checkpoints
                      </h3>
                      <p className="text-sm text-white/50">
                        Mark each checkpoint as you complete it
                      </p>
                      <div className="space-y-2">
                        {currentStep.checkpoints.map((checkpoint, index) => {
                          const key = `${currentStep.id}-${index}`;
                          const isChecked = checkpointStates[key];
                          
                          return (
                            <button
                              key={key}
                              onClick={() => toggleCheckpoint(index)}
                              className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${
                                isChecked
                                  ? 'bg-green-500/10 border-green-500/30'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                isChecked
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-white/30'
                              }`}>
                                {isChecked && (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className={isChecked ? 'text-green-400' : 'text-white/70'}>
                                {checkpoint}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {currentStep.type === 'submit' && (
                <div className="space-y-6">
                  <div className="text-white/70">{currentStep.content || 'Share your work by providing a link to your artifact.'}</div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Artifact URL *
                      </label>
                      <input
                        type="url"
                        value={artifactUrl}
                        onChange={(e) => setArtifactUrl(e.target.value)}
                        placeholder="https://github.com/your-project or https://figma.com/..."
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[var(--molten-orange)]/50"
                      />
                      <p className="text-xs text-white/40 mt-1">
                        Link to your GitHub repo, Figma file, Google Doc, or any relevant URL
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep.type === 'reflect' && (
                <div className="space-y-4">
                  <div className="text-white/70">{currentStep.content || 'Reflect on what you learned and how you can apply it.'}</div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Your Reflection
                    </label>
                    <textarea
                      value={reflection}
                      onChange={(e) => setReflection(e.target.value)}
                      placeholder="What did you learn? What was challenging? How will you apply this?"
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[var(--molten-orange)]/50 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <button
                onClick={completeStep}
                disabled={currentStep.type === 'do' && !allCheckpointsComplete}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  (currentStep.type === 'do' && !allCheckpointsComplete)
                    ? 'bg-white/10 text-white/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] text-white hover:opacity-90'
                }`}
              >
                {isLastStep ? 'Complete Mission' : 'Continue'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Final submit modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a2e] rounded-2xl p-8 max-w-md w-full border border-[var(--molten-orange)]/30"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold mb-2">Ready to Submit?</h2>
                <p className="text-white/60">
                  You&apos;re about to submit your work for &quot;{mission.title}&quot;
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-sm text-white/50 mb-1">Your Artifact</div>
                  <div className="text-white truncate">{artifactUrl || 'No artifact provided'}</div>
                </div>
                
                {reflection && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-sm text-white/50 mb-1">Your Reflection</div>
                    <div className="text-white text-sm line-clamp-3">{reflection}</div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-[var(--sacred-gold)]">
                  <span>⚡</span>
                  <span>+{mission.xpReward} XP upon approval</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={!artifactUrl.trim()}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  Submit Mission
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MissionExecutor;
