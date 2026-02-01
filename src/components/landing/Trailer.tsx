"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useXPStore } from "@/stores/xp-store";

// Animated scenes for the trailer - Focus on the FEELING, not the phases
const trailerScenes = [
  {
    id: 1,
    title: "CURIOSITY",
    subtitle: "It starts with a question",
    icon: "�",
    color: "#00d4ff",
    description: "What if learning felt like play?",
  },
  {
    id: 2,
    title: "CREATION",
    subtitle: "You don't consume. You build.",
    icon: "🔨",
    color: "#ff6b35",
    description: "Every mission produces something real",
  },
  {
    id: 3,
    title: "GROWTH",
    subtitle: "Watch yourself evolve",
    icon: "�",
    color: "#ffd700",
    description: "XP tracks what grades never could",
  },
  {
    id: 4,
    title: "IMPACT",
    subtitle: "Teach others. Change the world.",
    icon: "🌍",
    color: "#a855f7",
    description: "The final level is giving back",
  },
];

// Floating particles component
function TrailerParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

// XP bar animation
function XPBarAnimation({ progress }: { progress: number }) {
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64">
      <div className="flex justify-between text-xs text-white/60 mb-2 font-mono">
        <span>LEVEL {Math.floor(progress / 25) + 1}</span>
        <span>{Math.floor(progress * 50)} XP</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

// Scene component
function TrailerScene({ scene, isActive }: { scene: typeof trailerScenes[0]; isActive: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={scene.id}
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background glow */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, ${scene.color}20 0%, transparent 60%)`,
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Icon */}
          <motion.div
            className="text-7xl mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            {scene.icon}
          </motion.div>

          {/* Title */}
          <motion.h3
            className="text-3xl md:text-4xl font-bold font-mono tracking-wider mb-2"
            style={{ color: scene.color }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {scene.title}
          </motion.h3>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-white/80 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {scene.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-white/50 text-sm font-mono"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {scene.description}
          </motion.p>

          {/* Animated lines */}
          <motion.div
            className="absolute left-8 top-1/2 w-16 h-[1px]"
            style={{ backgroundColor: scene.color }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          <motion.div
            className="absolute right-8 top-1/2 w-16 h-[1px]"
            style={{ backgroundColor: scene.color }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Trailer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const { completeMission, isMissionCompleted } = useXPStore();

  // Auto-advance scenes when playing
  useEffect(() => {
    if (!isPlaying) return;

    const sceneInterval = setInterval(() => {
      setCurrentScene((prev) => {
        if (prev >= trailerScenes.length - 1) {
          // Loop back or stop
          return 0;
        }
        return prev + 1;
      });
    }, 3000); // 3 seconds per scene

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 120); // Smooth progress

    return () => {
      clearInterval(sceneInterval);
      clearInterval(progressInterval);
    };
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentScene(0);
    setProgress(0);
    
    if (!isMissionCompleted("trailer-watcher")) {
      setTimeout(() => {
        completeMission("trailer-watcher");
      }, 12000); // Award after watching full loop
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <section
      id="trailer"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-4"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--deep-space)]" />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto"
        variants={staggerContainer}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        {/* Section label */}
        <motion.div
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <span className="text-[var(--neon-blue)] font-mono text-sm tracking-wider uppercase">
            [ THE VISION ]
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 text-white">
            See the Future
          </h2>
        </motion.div>

        {/* Video container */}
        <motion.div
          variants={fadeInUp}
          className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a0a1a] to-[#1a0a2a] border border-white/10 shadow-2xl shadow-[var(--molten-orange)]/10"
        >
          {!isPlaying ? (
            // Preview state with play button
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Animated preview background */}
              <div className="absolute inset-0">
                <TrailerParticles />
                
                {/* Gradient orbs */}
                <motion.div
                  className="absolute w-64 h-64 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)",
                    left: "20%",
                    top: "30%",
                  }}
                  animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute w-48 h-48 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 70%)",
                    right: "20%",
                    bottom: "30%",
                  }}
                  animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />

                {/* Preview text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    ✦
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white/80 mb-2">
                    Project<span className="text-[var(--molten-orange)]">X</span> OS
                  </h3>
                  <p className="text-white/40 font-mono text-sm">
                    The Human Upgrade Experience
                  </p>
                </div>
              </div>

              {/* Play button */}
              <button
                onClick={handlePlay}
                className="relative group z-20"
                aria-label="Play trailer"
              >
                <motion.div 
                  className="absolute -inset-4 rounded-full bg-[var(--molten-orange)]/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <div className="relative w-24 h-24 rounded-full bg-[var(--molten-orange)] flex items-center justify-center group-hover:shadow-[0_0_60px_rgba(255,107,53,0.8)] transition-all duration-300 group-hover:scale-110">
                  <svg
                    className="w-10 h-10 text-[var(--deep-space)] ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                <div className="absolute inset-0 rounded-full border-2 border-[var(--molten-orange)] animate-ping opacity-30" />
              </button>

              {/* Duration indicator */}
              <div className="absolute bottom-8 left-0 right-0 text-center z-10">
                <p className="text-white/60 font-mono text-sm">
                  Click to experience the journey • 12s
                </p>
              </div>
            </div>
          ) : (
            // Playing state - animated scenes
            <div className="absolute inset-0">
              <TrailerParticles />
              
              {/* Scenes */}
              {trailerScenes.map((scene, index) => (
                <TrailerScene
                  key={scene.id}
                  scene={scene}
                  isActive={currentScene === index}
                />
              ))}

              {/* XP progress bar */}
              <XPBarAnimation progress={progress} />

              {/* Scene indicators */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-3">
                {trailerScenes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentScene(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentScene === index
                        ? "bg-[var(--molten-orange)] w-6"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              {/* Pause button */}
              <button
                onClick={handlePause}
                className="absolute top-8 right-8 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Pause"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              </button>

              {/* Replay indicator */}
              <div className="absolute bottom-8 right-8 text-white/40 font-mono text-xs">
                Scene {currentScene + 1} / {trailerScenes.length}
              </div>
            </div>
          )}

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[var(--molten-orange)]/50 pointer-events-none z-20" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[var(--molten-orange)]/50 pointer-events-none z-20" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[var(--molten-orange)]/50 pointer-events-none z-20" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[var(--molten-orange)]/50 pointer-events-none z-20" />
        </motion.div>

        {/* Caption */}
        <motion.p
          variants={fadeInUp}
          className="text-center mt-8 text-[var(--light-gray)]/60 italic"
        >
          &ldquo;The future belongs to those who dare to evolve.&rdquo;
        </motion.p>
      </motion.div>
    </section>
  );
}
