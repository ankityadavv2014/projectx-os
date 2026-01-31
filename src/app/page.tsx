"use client";

import { Hero } from "@/components/landing/Hero";
import { Manifesto } from "@/components/landing/Manifesto";
import { PhaseJourney } from "@/components/landing/PhaseJourney";
import { PersonaPathways } from "@/components/landing/PersonaPathways";
import { SocialProof } from "@/components/landing/SocialProof";
import { Trailer } from "@/components/landing/Trailer";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { ParticleField } from "@/components/ui/ParticleField";

export default function LandingPage() {
  return (
    <main id="main-content" className="relative">
      {/* Particle background */}
      <ParticleField 
        particleCount={50} 
        colors={["#ff6b35", "#00d4ff", "#ffd700"]}
        speed={0.3}
        maxOpacity={0.4}
      />

      {/* Sections - The Journey */}
      <Hero />
      <SocialProof />
      <Manifesto />
      <PhaseJourney />
      <PersonaPathways />
      <Trailer />
      <FinalCTA />

      {/* Footer */}
      <footer className="relative z-10 py-16 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-black text-[var(--molten-orange)] mb-4">
                Project<span className="text-white">✦</span>X
              </h3>
              <p className="text-white/50 max-w-sm mb-4">
                The Human Upgrade Operating System. Building the future of 
                learning, one human at a time.
              </p>
              <p className="text-white/30 text-sm font-mono">
                In the Age of Machines, We Build Humans.
              </p>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li><a href="/os" className="hover:text-white transition-colors">Enter OS</a></li>
                <li><a href="/student" className="hover:text-white transition-colors">For Students</a></li>
                <li><a href="/teacher" className="hover:text-white transition-colors">For Teachers</a></li>
                <li><a href="/parent" className="hover:text-white transition-colors">For Parents</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li><a href="#manifesto" className="hover:text-white transition-colors">Manifesto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} The ProjectX Co. All rights reserved.
            </p>
            <p className="text-white/20 text-xs font-mono">
              Built with 🔥 for the human upgrade
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
