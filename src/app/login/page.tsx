'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { login, loginAsRole, getDashboardForRole } from '@/lib/auth';
import type { GoLiveRole } from '@/types/go-live';

/**
 * Login Page
 *
 * Demo login for Go-Live testing.
 * In production: Replace with Clerk, Auth.js, or your auth provider.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQuickAccess, setShowQuickAccess] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email);
      if (result.success && result.session) {
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

  const quickAccessRoles: { role: GoLiveRole; label: string; icon: string; color: string }[] = [
    { role: 'student', label: 'Student', icon: '🎓', color: 'from-cyan-500 to-blue-600' },
    { role: 'teacher', label: 'Teacher', icon: '👩‍🏫', color: 'from-purple-500 to-pink-600' },
    { role: 'school_admin', label: 'School Admin', icon: '🏫', color: 'from-orange-500 to-red-600' },
    { role: 'super_admin', label: 'Super Admin', icon: '⚡', color: 'from-yellow-500 to-orange-600' },
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
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 mb-4"
          >
            <span className="text-4xl font-bold text-white">X</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">ProjectX OS</h1>
          <p className="text-gray-400">Sign in to continue your journey</p>
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
            {showQuickAccess ? '▲ Hide' : '▼ Show'} Demo Quick Access
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
                  For demo purposes only. Click to login as:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickAccessRoles.map((item) => (
                    <motion.button
                      key={item.role}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickLogin(item.role)}
                      disabled={loading}
                      className={`flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r ${item.color} text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
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
