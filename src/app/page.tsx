"use client";

import { Hero } from "@/components/landing/Hero";
import { Manifesto } from "@/components/landing/Manifesto";
import { Trailer } from "@/components/landing/Trailer";
import { EnterOS } from "@/components/landing/EnterOS";
import { ParticleField } from "@/components/ui/ParticleField";
import { XPBar } from "@/components/xp/XPBar";

export default function LandingPage() {
  return (
    <main id="main-content" className="relative">
      {/* Particle background */}
      <ParticleField 
        particleCount={40} 
        colors={["#ff6b35", "#00d4ff", "#ffd700"]}
        speed={0.5}
        maxOpacity={0.3}
      />

      {/* XP Bar - Fixed position */}
      <div className="fixed top-4 right-4 z-50 hidden md:block">
        <XPBar compact />
      </div>

      {/* Sections */}
      <Hero />
      <Manifesto />
      <Trailer />
      <EnterOS />

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 text-center border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <p className="text-[var(--light-gray)]/40 text-sm">
            © {new Date().getFullYear()} ProjectX. All rights reserved.
          </p>
          <p className="text-[var(--light-gray)]/20 text-xs mt-2 font-mono">
            Built with 🔥 for the human upgrade
          </p>
        </div>
      </footer>
    </main>
  );
}
