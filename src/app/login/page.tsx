'use client';

import { useState, useEffect, type ReactNode, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { login, loginAsRole, getDashboardForRole } from '@/lib/auth';
import type { GoLiveRole } from '@/types/go-live';
import { GraduationCap, UserCheck, Building2, Zap, BookOpen, Heart, ArrowLeft } from 'lucide-react';

// Persona display configuration
const personaConfig = {
  student: { label: 'Student', icon: GraduationCap, color: 'from-cyan-500 to-blue-600', role: 'student' as GoLiveRole },
  teacher: { label: 'Teacher', icon: BookOpen, color: 'from-purple-500 to-pink-600', role: 'teacher' as GoLiveRole },
  parent: { label: 'Parent', icon: Heart, color: 'from-amber-500 to-orange-600', role: 'student' as GoLiveRole }, // Parents see student view
  school: { label: 'School Admin', icon: Building2, color: 'from-orange-500 to-red-600', role: 'school_admin' as GoLiveRole },
};

/**
 * Login Page
 *
 * Persona-aware login for Pilot system.
 * Captures persona from URL params and stores in session.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingState />}>
      <LoginContent />
    </Suspense>
  );
}

// Loading state while suspense resolves
function LoginLoadingState() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  
  // Get persona from URL params (set by landing page)
  const personaParam = searchParams.get('persona') as keyof typeof personaConfig | null;
  const persona = personaParam && personaConfig[personaParam] ? personaConfig[personaParam] : null;
  
  // Store persona intent in sessionStorage for auth-service to pick up
  useEffect(() => {
    if (personaParam) {
      sessionStorage.setItem('projectx_persona_intent', personaParam);
    }
  }, [personaParam]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email);
      if (result.success && result.session) {
        // Redirect to role-specific dashboard (persona is now in session)
        router.push(getDashboardForRole(result.session.role));
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: GoLiveRole) => {
    setError(null);
    setLoading(true);

    try {
      const result = await loginAsRole(role);
      if (result.success && result.session) {
        // Redirect to role-specific dashboard (persona is now in session)
        router.push(getDashboardForRole(result.session.role));
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // When persona is set, show the appropriate role only
  const quickAccessRoles: { role: GoLiveRole; label: string; icon: ReactNode; color: string }[] = persona 
    ? [{ role: persona.role, label: persona.label, icon: <persona.icon className="w-5 h-5" />, color: persona.color }]
    : [
        { role: 'student', label: 'Student', icon: <GraduationCap className="w-5 h-5" />, color: 'from-cyan-500 to-blue-600' },
        { role: 'teacher', label: 'Teacher', icon: <UserCheck className="w-5 h-5" />, color: 'from-purple-500 to-pink-600' },
        { role: 'school_admin', label: 'School Admin', icon: <Building2 className="w-5 h-5" />, color: 'from-orange-500 to-red-600' },
        { role: 'super_admin', label: 'Super Admin', icon: <Zap className="w-5 h-5" />, color: 'from-yellow-500 to-orange-600' },
      ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${persona ? persona.color : 'from-cyan-500 to-purple-600'} mb-4`}
          >
            {persona ? (
              <persona.icon className="w-10 h-10 text-white" />
            ) : (
              <span className="text-4xl font-bold text-white">X</span>
            )}
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {persona ? `Welcome, ${persona.label}` : 'ProjectX OS'}
          </h1>
          <p className="text-gray-400">
            {persona ? 'Sign in to start your journey' : 'Sign in to continue your journey'}
          </p>
          {persona && (
            <motion.a
              href="/"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-1 mt-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Not you? Choose different path
            </motion.a>
          )}
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl"
        >
          {/* Email Login */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-500">or</span>
            </div>
          </div>

          {/* Quick Access Toggle */}
          <button
            onClick={() => setShowQuickAccess(!showQuickAccess)}
            className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showQuickAccess ? '▲ Hide' : '▼ Show'} {persona ? 'Quick Login' : 'Demo Quick Access'}
          </button>

          {/* Quick Access Buttons */}
          <AnimatePresence>
            {showQuickAccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-2"
              >
                <p className="text-xs text-gray-500 text-center mb-3">
                  {persona 
                    ? `Continue as ${persona.label}:` 
                    : 'For demo purposes only. Click to login as:'}
                </p>
                <div className={`grid ${persona ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                  {quickAccessRoles.map((item) => (
                    <motion.button
                      key={item.role}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickLogin(item.role)}
                      disabled={loading}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r ${item.color} text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{persona ? `Enter as ${item.label}` : item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Demo credentials hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500">
            Demo emails: alex@projectx.school, ms.patel@projectx.school, admin@projectx.school
          </p>
        </motion.div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-center"
        >
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-cyan-400 transition-colors"
          >
            ← Back to home
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
