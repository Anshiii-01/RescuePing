import React, { useEffect, useRef, useState } from 'react';
import './Starfield.css';
import logger from '../../utils/logger';

type Star = {
  x: number;
  y: number;
  baseX: number; // Original position for smooth return
  baseY: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  baseOpacity: number;
  twinkleSpeed: number;
  phase: number;
};

const STORAGE_KEY = 'starfieldEnabled';
const INTERACTION_RADIUS = 150;
const REPEL_FORCE = 2.5;
const RETURN_FORCE = 0.05;

const defaultEnabled = (() => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === null) return true;
    return v === 'true';
  } catch {
    return true;
  }
})();

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [enabled, setEnabled] = useState<boolean>(defaultEnabled);

  // Allow other components to toggle starfield via window event
  useEffect(() => {
    const onToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === 'boolean') {
        setEnabled(detail);
      }
    };
    window.addEventListener('starfield:toggle', onToggle as EventListener);
    return () => window.removeEventListener('starfield:toggle', onToggle as EventListener);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {}
  }, [enabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createStars();
    };

    const shouldAnimate = () => {
      const prm = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
      return !prm && enabled;
    };

    const createStars = () => {
      // Optimize star count based on device type for performance
      // Mobile: 50 stars, Tablet: 100 stars, Desktop: 200 stars
      let count: number;
      if (width < 768) {
        count = 50; // Mobile
      } else if (width < 1024) {
        count = 100; // Tablet
      } else {
        count = 200; // Desktop
      }

      const stars: Star[] = new Array(count).fill(0).map(() => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const baseOpacity = Math.random() * 0.3 + 0.3; // 0.3-0.6 base
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          radius: Math.random() * 2 + 0.5, // 0.5-2.5px
          vx: Math.random() * 0.2 - 0.1, // Gentle drift
          vy: Math.random() * 0.2 - 0.1,
          opacity: baseOpacity,
          baseOpacity,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          phase: Math.random() * Math.PI * 2,
        };
      });

      starsRef.current = stars;
      logger.log(`✨ Created ${count} interactive stars for ${width}x${height} canvas`);
    };

    // Mouse/touch tracking with debouncing
    let mouseMoveTimeout: NodeJS.Timeout | null = null;
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
      
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      
      mouseRef.current = { x: clientX, y: clientY };
      
      // Clear mouse position after 2 seconds of no movement
      mouseMoveTimeout = setTimeout(() => {
        mouseRef.current = { x: null, y: null };
      }, 2000);
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    const drawFrame = () => {
      // Pure black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const stars = starsRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        
        // Update twinkle phase
        s.phase += s.twinkleSpeed;
        let targetOpacity = s.baseOpacity * (0.7 + 0.3 * Math.sin(s.phase));

        // Check cursor interaction
        let isInteracting = false;
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - s.x;
          const dy = mouse.y - s.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < INTERACTION_RADIUS) {
            isInteracting = true;
            
            // Repel from cursor (gentle push)
            const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
            s.x -= (dx / distance) * REPEL_FORCE * force;
            s.y -= (dy / distance) * REPEL_FORCE * force;
            
            // Brighten stars near cursor (0.9-1.0)
            targetOpacity = 0.9 + 0.1 * (1 - distance / INTERACTION_RADIUS);
          }
        }

        // Smooth opacity transition
        s.opacity += (targetOpacity - s.opacity) * 0.1;

        if (!isInteracting) {
          // Gentle drift when not interacting
          s.x += s.vx;
          s.y += s.vy;

          // Gradually return to base position
          s.x += (s.baseX - s.x) * RETURN_FORCE;
          s.y += (s.baseY - s.y) * RETURN_FORCE;
        }

        // Wrap around screen edges
        if (s.x < -10) s.x = width + 10;
        if (s.x > width + 10) s.x = -10;
        if (s.y < -10) s.y = height + 10;
        if (s.y > height + 10) s.y = -10;

        // Draw star with subtle glow
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 3);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
        gradient.addColorStop(0.4, `rgba(255, 255, 255, ${s.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core bright point
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, s.opacity * 1.3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      if (shouldAnimate()) {
        drawFrame();
        rafRef.current = requestAnimationFrame(animate);
      } else {
        drawFrame();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    if (shouldAnimate()) {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      className="aa-starfield-canvas"
      aria-hidden
      aria-label="Interactive starfield background"
    />
  );
};

export default Starfield;
