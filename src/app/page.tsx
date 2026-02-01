"use client";

import { Hero } from "@/components/landing/Hero";
import { Manifesto } from "@/components/landing/Manifesto";
import { PhaseJourney } from "@/components/landing/PhaseJourney";
import { PersonaPathways } from "@/components/landing/PersonaPathways";
import { Trailer } from "@/components/landing/Trailer";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { AIAssistant } from "@/components/ai";
import Link from "next/link";
import { Target, Zap, Award } from "lucide-react";

// =============================================================================
// LANDING PAGE - Clean, Professional, Focused
// =============================================================================

export default function LandingPage() {
  return (
    <main id="main-content" className="relative bg-[#0a0a0f]">
      {/* Minimal top bar - clean status */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-white/40 text-xs font-mono uppercase tracking-wider">System Online</span>
        </div>
        <div className="flex items-center gap-6">
          <Link 
            href="/manifesto" 
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            Manifesto
          </Link>
          <Link 
            href="/login" 
            className="px-4 py-1.5 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm transition-all"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* AI Assistant - conversational guide */}
      <AIAssistant context="landing" />

      {/* Clean section flow */}
      <Hero />
      
      {/* Why ProjectX - simplified */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Why <span className="text-[var(--molten-orange)]">ProjectX</span>?
          </h2>
          <p className="text-lg text-white/50 mb-12 max-w-2xl mx-auto">
            Education is broken. Degrees don&apos;t guarantee capability. 
            ProjectX replaces passive learning with real experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Mission-Based", desc: "Learn by doing real projects" },
              { icon: Zap, title: "XP Progression", desc: "Track growth with visible progress" },
              { icon: Award, title: "Verified Skills", desc: "Earn credentials that matter" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="mb-4">
                  <item.icon className="w-8 h-8 text-[var(--molten-orange)]" />
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="manifesto"><Manifesto /></section>
      <section id="phases"><PhaseJourney /></section>
      <section id="trailer"><Trailer /></section>
      <section id="personas"><PersonaPathways /></section>
      <section id="cta"><FinalCTA /></section>

      {/* Minimal footer */}
      <footer className="relative py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-[var(--molten-orange)] mb-1">
                Project<span className="text-white">X</span>
              </h3>
              <p className="text-white/30 text-sm">
                The Human Upgrade • Built in India
              </p>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-white/40">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
              <Link href="/legal" className="hover:text-white transition-colors">Legal</Link>
            </div>
            
            <p className="text-white/20 text-xs">
              © {new Date().getFullYear()} The ProjectX Co.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
