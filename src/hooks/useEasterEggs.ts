"use client";

import { useEffect, useRef, useCallback } from "react";
import { useXPStore } from "@/stores/xp-store";
import { EASTER_EGGS } from "@/lib/constants";

/**
 * Hook to detect and handle easter eggs
 */
export function useEasterEggs() {
  const { findEasterEgg, hasFoundEasterEgg } = useXPStore();
  const konamiIndex = useRef(0);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<NodeJS.Timeout | null>(null);

  // Konami code detection
  const handleKonami = useCallback(
    (e: KeyboardEvent) => {
      if (hasFoundEasterEgg("konami")) return;

      const expectedKey = EASTER_EGGS.konamiCode[konamiIndex.current];

      if (e.code === expectedKey) {
        konamiIndex.current++;

        if (konamiIndex.current === EASTER_EGGS.konamiCode.length) {
          // Konami code complete!
          findEasterEgg("konami");
          konamiIndex.current = 0;

          // Trigger visual effect
          triggerKonamiEffect();
        }
      } else {
        konamiIndex.current = 0;
      }
    },
    [findEasterEgg, hasFoundEasterEgg]
  );

  // Logo click detection
  const handleLogoClick = useCallback(() => {
    if (hasFoundEasterEgg("logo-click")) return;

    logoClickCount.current++;

    // Reset after delay
    if (logoClickTimer.current) {
      clearTimeout(logoClickTimer.current);
    }
    logoClickTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 2000);

    if (logoClickCount.current >= EASTER_EGGS.logoClicks) {
      findEasterEgg("logo-click");
      logoClickCount.current = 0;
      triggerGlitchEffect();
    }
  }, [findEasterEgg, hasFoundEasterEgg]);

  // Console message easter egg
  useEffect(() => {
    if (hasFoundEasterEgg("console")) return;

    // Check if DevTools is open (approximate detection)
    const devToolsCheck = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        if (!hasFoundEasterEgg("console")) {
          findEasterEgg("console");
          printConsoleMessage();
        }
      }
    };

    window.addEventListener("resize", devToolsCheck);
    devToolsCheck();

    // Also print message anyway for those who already have DevTools open
    printConsoleMessage();

    return () => {
      window.removeEventListener("resize", devToolsCheck);
    };
  }, [findEasterEgg, hasFoundEasterEgg]);

  // Set up keyboard listener for Konami code
  useEffect(() => {
    window.addEventListener("keydown", handleKonami);
    return () => window.removeEventListener("keydown", handleKonami);
  }, [handleKonami]);

  return { handleLogoClick };
}

// Visual effect for Konami code
function triggerKonamiEffect() {
  // Create matrix rain overlay
  const overlay = document.createElement("div");
  overlay.id = "konami-overlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #0a0a0f;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease-out;
  `;

  overlay.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 64px; margin-bottom: 24px;">🔮</div>
      <h2 style="font-size: 32px; color: #00ff41; font-family: monospace; margin-bottom: 16px;">
        KONAMI CODE ACTIVATED
      </h2>
      <p style="color: #00d4ff; font-size: 18px;">
        +200 XP • Secret Finder Achievement Unlocked!
      </p>
      <p style="color: #666; margin-top: 24px; font-size: 14px;">
        The Matrix has you...
      </p>
    </div>
  `;

  document.body.appendChild(overlay);

  // Remove after delay
  setTimeout(() => {
    overlay.style.animation = "fadeOut 0.5s ease-out";
    setTimeout(() => {
      overlay.remove();
    }, 500);
  }, 3000);
}

// Glitch effect for logo click
function triggerGlitchEffect() {
  const body = document.body;
  body.style.animation = "glitch 0.3s ease-out";

  // Create notification
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    padding: 24px 48px;
    background: rgba(26, 26, 46, 0.95);
    border: 1px solid #ff6b35;
    border-radius: 16px;
    text-align: center;
    animation: scaleIn 0.3s ease-out;
  `;

  notification.innerHTML = `
    <div style="font-size: 48px; margin-bottom: 16px;">✨</div>
    <h3 style="color: #ff6b35; font-size: 20px; margin-bottom: 8px;">
      Hidden Secret Found!
    </h3>
    <p style="color: #e0e0e0; font-size: 14px;">
      +200 XP
    </p>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
    body.style.animation = "";
  }, 2000);
}

// Console message
function printConsoleMessage() {
  const styles = {
    logo: "font-size: 24px; font-weight: bold; color: #ff6b35;",
    text: "font-size: 14px; color: #e0e0e0;",
    highlight: "font-size: 14px; color: #00d4ff;",
    secret: "font-size: 12px; color: #00ff41; font-family: monospace;",
  };

  console.log("%c🔥 ProjectX OS", styles.logo);
  console.log("%cWelcome to the Experience OS", styles.text);
  console.log("");
  console.log(
    "%cLooking for something? 👀",
    styles.highlight
  );
  console.log(
    "%cHint: The curious are rewarded. Try: ↑↑↓↓←→←→BA",
    styles.secret
  );
  console.log("");
  console.log(
    "%cInterested in building the future? We're hiring!",
    styles.text
  );
  console.log("%chttps://projectx.com/careers", styles.highlight);
}

// Add keyframe animations to document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    @keyframes glitch {
      0%, 100% { transform: translate(0); }
      10% { transform: translate(-5px, 5px); }
      20% { transform: translate(5px, -5px); }
      30% { transform: translate(-5px, -5px); }
      40% { transform: translate(5px, 5px); }
      50% { transform: translate(-5px, 5px); }
      60% { transform: translate(5px, -5px); }
      70% { transform: translate(-5px, -5px); }
      80% { transform: translate(5px, 5px); }
      90% { transform: translate(-5px, 0); }
    }
  `;
  document.head.appendChild(style);
}
