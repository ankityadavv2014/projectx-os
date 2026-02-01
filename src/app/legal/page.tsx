'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-black mb-6"
          >
            Privacy & Terms
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            Transparency is one of our core values. Here&apos;s how we handle your data.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Privacy Policy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-[var(--molten-orange)]">Privacy Policy</h2>
            <div className="prose prose-invert max-w-none space-y-6 text-white/80">
              <p><strong>Last Updated:</strong> January 2026</p>
              
              <h3 className="text-xl font-semibold text-white">Data We Collect</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (name, email, role)</li>
                <li>Learning progress and mission completions</li>
                <li>Submitted artifacts and portfolio content</li>
                <li>Analytics for improving the experience</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white">How We Use Your Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personalize your learning journey</li>
                <li>Track progress and award XP/badges</li>
                <li>Improve our platform and missions</li>
                <li>Communicate updates and opportunities</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white">Data Protection</h3>
              <p>
                We use industry-standard encryption and security practices. 
                Your data is stored securely and never sold to third parties.
              </p>
              
              <h3 className="text-xl font-semibold text-white">Your Rights</h3>
              <p>
                You can request access to, correction of, or deletion of your data 
                at any time by contacting us at privacy@theprojectx.co.
              </p>
            </div>
          </motion.div>

          {/* Terms of Service */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-[var(--neon-blue)]">Terms of Service</h2>
            <div className="prose prose-invert max-w-none space-y-6 text-white/80">
              <p><strong>Last Updated:</strong> January 2026</p>
              
              <h3 className="text-xl font-semibold text-white">Acceptance</h3>
              <p>
                By using ProjectX OS, you agree to these terms. 
                If you&apos;re under 18, your parent or guardian must consent.
              </p>
              
              <h3 className="text-xl font-semibold text-white">Your Content</h3>
              <p>
                You retain ownership of content you create. By submitting artifacts, 
                you grant us a license to display them within the platform and for 
                educational purposes.
              </p>
              
              <h3 className="text-xl font-semibold text-white">Acceptable Use</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be respectful to other learners and mentors</li>
                <li>Submit original work only</li>
                <li>Do not attempt to bypass security measures</li>
                <li>Do not misrepresent your identity</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white">Account Termination</h3>
              <p>
                We may suspend or terminate accounts that violate these terms. 
                You can delete your account at any time.
              </p>
            </div>
          </motion.div>

          {/* Cookie Policy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6 text-[var(--sacred-gold)]">Cookie Policy</h2>
            <div className="prose prose-invert max-w-none space-y-6 text-white/80">
              <p>
                We use cookies to improve your experience, remember preferences, 
                and analyze usage. You can manage cookie settings in your browser.
              </p>
            </div>
          </motion.div>

          {/* Contact */}
          <div className="mt-16 text-center">
            <p className="text-white/60 mb-4">Questions about our policies?</p>
            <Link
              href="/contact"
              className="text-[var(--molten-orange)] hover:underline"
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
