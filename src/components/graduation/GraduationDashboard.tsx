'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phase, 
  PHASE_DISPLAY, 
  GRADUATION_REQUIREMENTS, 
  getNextPhase,
  getGraduationProgress,
  type PhaseProgress,
  type PhaseRequirement,
} from '@/lib/domain/types';

interface GraduationDashboardProps {
  currentPhase: Phase;
  progress?: PhaseProgress;
  onGraduate?: () => void;
}

export function GraduationDashboard({ 
  currentPhase, 
  progress,
  onGraduate 
}: GraduationDashboardProps) {
  const nextPhase = getNextPhase(currentPhase);
  const currentPhaseInfo = PHASE_DISPLAY[currentPhase];
  const nextPhaseInfo = nextPhase ? PHASE_DISPLAY[nextPhase] : null;
  const requirements = nextPhase ? GRADUATION_REQUIREMENTS[nextPhase] : [];
  
  // Calculate progress
  const completedReqs = progress?.completedRequirements || [];
  const progressPercentage = progress ? getGraduationProgress(progress) : 0;
  const canGraduate = progressPercentage === 100 && nextPhase;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
      {/* Background glow */}
      <div 
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{ background: currentPhaseInfo.color }}
      />
      
      {/* Current Phase */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{currentPhaseInfo.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-white">
              {currentPhaseInfo.name}
            </h3>
            <p className="text-sm text-white/60">
              Current Phase: <span className="font-mono text-[var(--sacred-gold)]">{currentPhaseInfo.verb}</span>
            </p>
          </div>
        </div>
        <p className="text-sm text-white/40 italic">
          &ldquo;{currentPhaseInfo.tagline}&rdquo;
        </p>
      </div>

      {/* Progress to Next Phase */}
      {nextPhase && nextPhaseInfo && (
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{nextPhaseInfo.icon}</span>
              <span className="text-sm font-medium text-white/80">
                Progress to {nextPhaseInfo.verb}
              </span>
            </div>
            <span className="text-sm font-mono text-white/60">
              {progressPercentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 rounded-full bg-white/10 overflow-hidden mb-6">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${currentPhaseInfo.color}, ${nextPhaseInfo.color})` 
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Requirements Checklist */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              Graduation Requirements
            </h4>
            {requirements.map((req) => (
              <RequirementItem
                key={req.id}
                requirement={req}
                completed={completedReqs.includes(req.id)}
                current={progress?.[req.type as keyof PhaseProgress] as number | undefined}
              />
            ))}
          </div>

          {/* Graduate Button */}
          <AnimatePresence>
            {canGraduate && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={onGraduate}
                className="mt-6 w-full py-4 rounded-xl font-bold text-lg relative overflow-hidden group"
                style={{ 
                  background: `linear-gradient(135deg, ${currentPhaseInfo.color}, ${nextPhaseInfo.color})` 
                }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  🎓 Graduate to {nextPhaseInfo.name}
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Max Level Reached */}
      {!nextPhase && (
        <div className="relative z-10 text-center py-8">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            👑
          </motion.div>
          <h3 className="text-xl font-bold text-[var(--sacred-gold)] mb-2">
            Maximum Phase Reached
          </h3>
          <p className="text-white/60">
            You are a builder of builders. Lead the expansion.
          </p>
        </div>
      )}

      {/* Trust Score */}
      {progress && (
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Trust Score</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: progress.trustScore >= 70 
                      ? 'var(--neon-blue)' 
                      : progress.trustScore >= 40 
                        ? 'var(--molten-orange)' 
                        : '#ff4444'
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.trustScore}%` }}
                />
              </div>
              <span className="text-sm font-mono text-white/80">
                {progress.trustScore}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RequirementItem({ 
  requirement, 
  completed,
  current 
}: { 
  requirement: PhaseRequirement; 
  completed: boolean;
  current?: number;
}) {
  const progress = current !== undefined 
    ? Math.min((current / requirement.target) * 100, 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        flex items-center gap-3 p-3 rounded-lg transition-colors
        ${completed 
          ? 'bg-[var(--neon-blue)]/10 border border-[var(--neon-blue)]/30' 
          : 'bg-white/5 border border-white/10'
        }
      `}
    >
      {/* Checkbox */}
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
        ${completed 
          ? 'bg-[var(--neon-blue)] text-white' 
          : 'bg-white/10 text-white/30'
        }
      `}>
        {completed ? (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </motion.svg>
        ) : (
          <span className="text-xs">{current ?? 0}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${completed ? 'text-[var(--neon-blue)]' : 'text-white/80'}`}>
            {requirement.label}
          </span>
          {!completed && (
            <span className="text-xs font-mono text-white/40">
              {current ?? 0}/{requirement.target}
            </span>
          )}
        </div>
        <p className="text-xs text-white/40 truncate">
          {requirement.description}
        </p>
        
        {/* Mini progress bar */}
        {!completed && current !== undefined && (
          <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-white/30"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
