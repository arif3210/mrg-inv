import React, { useEffect, useRef } from 'react';

export default function SparklePhysicsCanvas({ chaosMode, setChaosMode }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0, isDown: false });
  const obstaclesRef = useRef([]);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      updateObstacles();
    };
    window.addEventListener('resize', handleResize);

    // Track obstacles (cards, headings)
    const updateObstacles = () => {
      const elements = document.querySelectorAll('[data-physics-obstacle="true"]');
      const obs = [];
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          obs.push({
            x: rect.left,
            y: rect.top,
            w: rect.width,
            h: rect.height,
          });
        }
      });
      obstaclesRef.current = obs;
    };

    updateObstacles();
    const obsInterval = setInterval(updateObstacles, 800);

    // Number of sand crystals (high density for sand effect)
    const particleCount = window.innerWidth < 768 ? 160 : 320;
    const particles = [];

    // Different shining levels:
    // 0: Fine matte ivory/sand grain
    // 1: Champagne gold shimmer
    // 2: Radiant golden crystal
    // 3: Brilliant diamond/specular highlight (intense glint)
    const shinePalettes = [
      { color: 'rgba(215, 200, 175, 0.45)', coreColor: 'rgba(230, 220, 200, 0.7)', blur: 0 },
      { color: 'rgba(200, 165, 110, 0.65)', coreColor: 'rgba(240, 215, 170, 0.85)', blur: 2 },
      { color: 'rgba(184, 149, 98, 0.85)',  coreColor: 'rgba(255, 235, 195, 0.95)', blur: 3 },
      { color: 'rgba(255, 255, 255, 0.95)', coreColor: 'rgba(255, 255, 255, 1.0)',  blur: 4 },
    ];

    const createCrystal = (x, y, isDispersed = false) => {
      const shineLevel = Math.random() < 0.45 ? 0 : Math.random() < 0.75 ? 1 : Math.random() < 0.92 ? 2 : 3;
      const palette = shinePalettes[shineLevel];
      
      // Micro sand crystal size: 0.8px to 2.2px
      const size = Math.random() * 1.4 + 0.75;
      
      // Sinking terminal velocity in water: 0.65px to 2.1px per frame
      const terminalVelocity = Math.random() * 1.3 + 0.7;

      return {
        x: x ?? Math.random() * width,
        y: y ?? -10 - Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.4,
        vy: isDispersed ? (Math.random() - 0.5) * 4 : terminalVelocity,
        terminalVelocity,
        size,
        shineLevel,
        palette,
        // Water turbulence / sway parameters
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.012,
        swayAmplitude: Math.random() * 0.5 + 0.2,
        // Twinkle / glint animation
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.05 + 0.02,
        baseAlpha: Math.random() * 0.4 + 0.4,
        alpha: 0.7,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createCrystal(Math.random() * width, Math.random() * height));
    }
    particlesRef.current = particles;

    // Fluid drag & water wake interaction on touch/mouse
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const mouse = mouseRef.current;
      mouse.vx = clientX - mouse.lastX;
      mouse.vy = clientY - mouse.lastY;
      mouse.x = clientX;
      mouse.y = clientY;
      mouse.lastX = clientX;
      mouse.lastY = clientY;
    };

    const handlePointerDown = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      mouseRef.current.isDown = true;
      mouseRef.current.x = clientX;
      mouseRef.current.y = clientY;

      // Disperse a delicate plume of sand crystals through the water
      const plumeCount = 20;
      for (let i = 0; i < plumeCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 25;
        particles.push(createCrystal(clientX + Math.cos(angle) * dist, clientY + Math.sin(angle) * dist, true));
      }
    };

    const handlePointerUp = () => {
      mouseRef.current.isDown = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    // Water Physics Simulation Loop
    const fluidViscosity = 0.94; // Water drag

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const obstacles = obstaclesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Sinking physics in water:
        // Sand crystals gently accelerate towards their terminal sinking velocity
        p.vy += (p.terminalVelocity - p.vy) * 0.08;
        p.vx *= fluidViscosity;

        // Fluid swaying motion (fluttering like sand sinking in water)
        p.swayPhase += p.swaySpeed;
        const fluidSway = Math.sin(p.swayPhase) * p.swayAmplitude;

        p.x += p.vx + fluidSway;
        p.y += p.vy;

        // Water Wake Displacement (User hand / mouse moving through water)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const waterRadius = mouse.isDown ? 110 : 75;

        if (dist < waterRadius && dist > 0) {
          const force = (1 - dist / waterRadius) * (mouse.isDown ? 3.5 : 1.8);
          const nx = dx / dist;
          const ny = dy / dist;
          p.vx += nx * force + mouse.vx * 0.08;
          p.vy += ny * force * 0.5 + mouse.vy * 0.08;
        }

        // Sand flow around obstacles (Cards / Elements)
        // In water, sand crystals slide or deflect around submerged surfaces
        for (let j = 0; j < obstacles.length; j++) {
          const obs = obstacles[j];
          if (
            p.x >= obs.x - 3 &&
            p.x <= obs.x + obs.w + 3 &&
            p.y >= obs.y - 2 &&
            p.y <= obs.y + obs.h
          ) {
            // Deflect gently towards the closest side edge like fluid runoff
            const toLeft = p.x - obs.x;
            const toRight = obs.x + obs.w - p.x;
            
            if (p.y < obs.y + 12) {
              // Top edge: roll sideways along top surface
              p.vy *= 0.3;
              p.vx += toLeft < toRight ? -0.45 : 0.45;
            } else {
              // Side deflection
              p.vx += toLeft < toRight ? -0.6 : 0.6;
            }
          }
        }

        // Shimmer / Twinkle calculation (light refracting on crystals)
        p.twinklePhase += p.twinkleSpeed;
        const twinkle = Math.sin(p.twinklePhase);
        p.alpha = Math.max(0.15, Math.min(1.0, p.baseAlpha + twinkle * 0.35));

        // Recycle sand particle when reaching bottom
        if (p.y > height + 15 || p.x < -20 || p.x > width + 20) {
          p.x = Math.random() * width;
          p.y = -10 - Math.random() * 20;
          p.vx = (Math.random() - 0.5) * 0.3;
          p.vy = p.terminalVelocity;
        }

        // DRAW SAND CRYSTAL
        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.palette.blur > 0) {
          ctx.shadowBlur = p.palette.blur;
          ctx.shadowColor = p.palette.color;
        }

        ctx.fillStyle = p.palette.color;

        // Faceted crystal glint
        if (p.shineLevel === 3 && twinkle > 0.3) {
          // Specular 4-point micro-glint on top-tier crystal
          ctx.fillStyle = '#ffffff';
          const glintSize = p.size * 1.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - glintSize);
          ctx.lineTo(p.x + glintSize * 0.3, p.y);
          ctx.lineTo(p.x, p.y + glintSize);
          ctx.lineTo(p.x - glintSize * 0.3, p.y);
          ctx.closePath();
          ctx.fill();
        } else {
          // Micro spherical / diamond sand crystal
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Bright pinpoint specular core
          if (p.shineLevel >= 1) {
            ctx.fillStyle = p.palette.coreColor;
            ctx.beginPath();
            ctx.arc(p.x - p.size * 0.25, p.y - p.size * 0.25, p.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }

      // Keep particle pool clean if extra particles were added
      if (particles.length > particleCount + 40) {
        particles.splice(0, particles.length - particleCount);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearInterval(obsInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <canvas
      id="sparkle-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
    />
  );
}
