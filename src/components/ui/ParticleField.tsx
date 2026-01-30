"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  colors?: string[];
  speed?: number;
  maxOpacity?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

export function ParticleField({
  className,
  particleCount = 50,
  colors = ["#ff6b35", "#00d4ff", "#ffd700"],
  speed = 1,
  maxOpacity = 0.5,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const createParticle = useCallback((): Particle => {
    return {
      x: Math.random() * dimensionsRef.current.width,
      y: Math.random() * dimensionsRef.current.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * maxOpacity,
    };
  }, [colors, speed, maxOpacity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      dimensionsRef.current.width = window.innerWidth;
      dimensionsRef.current.height = window.innerHeight;
      canvas.width = dimensionsRef.current.width;
      canvas.height = dimensionsRef.current.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, createParticle);

    const updateParticle = (p: Particle) => {
      p.x += p.speedX;
      p.y += p.speedY;

      const { width, height } = dimensionsRef.current;
      if (p.x > width) p.x = 0;
      if (p.x < 0) p.x = width;
      if (p.y > height) p.y = 0;
      if (p.y < 0) p.y = height;

      p.opacity += (Math.random() - 0.5) * 0.02;
      p.opacity = Math.max(0.1, Math.min(maxOpacity, p.opacity));
    };

    const drawParticle = (p: Particle) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    };

    const connectParticles = () => {
      const particles = particlesRef.current;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = particles[a].color;
            ctx.globalAlpha = (1 - distance / 100) * 0.2;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        updateParticle(p);
        drawParticle(p);
      });

      connectParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, createParticle, maxOpacity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("fixed inset-0 pointer-events-none", className)}
      style={{ zIndex: 0 }}
    />
  );
}
