'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with backend
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--neon-blue)]/10 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            Get in{' '}
            <span className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--molten-orange)] bg-clip-text text-transparent">
              Touch
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/70 max-w-2xl mx-auto"
          >
            Questions? Ideas? Partnership proposals? We&apos;d love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
            >
              <div className="text-6xl mb-6">✨</div>
              <h2 className="text-2xl font-bold mb-4">Message Received!</h2>
              <p className="text-white/70 mb-8">
                We&apos;ll get back to you as soon as possible. 
                In the meantime, explore the OS.
              </p>
              <a
                href="/os"
                className="inline-flex px-8 py-3 rounded-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] text-[var(--deep-space)] font-semibold"
              >
                Enter ProjectX OS
              </a>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12"
            >
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--molten-orange)] transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--molten-orange)] transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>

                {/* Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-2">
                    I&apos;m reaching out about...
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[var(--molten-orange)] transition-colors"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="school">School Partnership</option>
                    <option value="organization">Organization Partnership</option>
                    <option value="mentor">Becoming a Mentor</option>
                    <option value="investor">Investment</option>
                    <option value="careers">Careers</option>
                    <option value="press">Press & Media</option>
                    <option value="support">Support</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--molten-orange)] transition-colors resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full px-8 py-4 rounded-lg bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] text-[var(--deep-space)] font-semibold hover:opacity-90 transition-opacity"
                >
                  Send Message
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-white/60">hello@theprojectx.co</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-3xl mb-3">🐦</div>
              <h3 className="font-bold mb-2">Twitter</h3>
              <p className="text-white/60">@theprojectxco</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="font-bold mb-2">LinkedIn</h3>
              <p className="text-white/60">The ProjectX Co.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
