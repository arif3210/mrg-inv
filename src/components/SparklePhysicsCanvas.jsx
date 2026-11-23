import React, { useEffect, useRef } from 'react';

export default function SparklePhysicsCanvas() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0, isDown: false });
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
    };

    window.addEventListener('resize', handleResize);

    // Number of sand crystals
    const particleCount = window.innerWidth < 768 ? 140 : 260;
    const particles = [];

    // Different shining levels:
    // 0: Fine matte ivory/sand grain
    // 1: Champagne gold shimmer
    // 2: Radiant golden crystal
    // 3: Brilliant diamond/specular highlight (intense glint)
    const shinePalettes = [
      { color: 'rgba(215, 200, 175, 0.50)', coreColor: 'rgba(235, 225, 205, 0.70)', blur: 0 },
      { color: 'rgba(200, 165, 110, 0.65)', coreColor: 'rgba(240, 215, 170, 0.85)', blur: 2 },
      { color: 'rgba(184, 149, 98, 0.85)',  coreColor: 'rgba(255, 235, 195, 0.95)', blur: 3 },
      { color: 'rgba(255, 255, 255, 0.95)', coreColor: 'rgba(255, 255, 255, 1.0)',  blur: 4 },
    ];

    const createCrystal = (x, y, isDispersed = false) => {
      const shineLevel = Math.random() < 0.45 ? 0 : Math.random() < 0.75 ? 1 : Math.random() < 0.92 ? 2 : 3;
      const palette = shinePalettes[shineLevel];
      
      const size = Math.random() * 1.3 + 0.85;
      const terminalVelocity = Math.random() * 1.3 + 0.8;

      return {
        x: x ?? Math.random() * width,
        y: y ?? -10 - Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.4,
        vy: isDispersed ? (Math.random() - 0.5) * 4 : terminalVelocity,
        terminalVelocity,
        size,
        shineLevel,
        palette,
        // Natural swaying / flutter motion
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.012,
        swayAmplitude: Math.random() * 0.45 + 0.15,
        // Twinkle / glint animation
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.05 + 0.02,
        baseAlpha: Math.random() * 0.35 + 0.45,
        alpha: 0.7,
      };
    };

    // Distribute evenly across the initial screen
    for (let i = 0; i < particleCount; i++) {
      particles.push(createCrystal(Math.random() * width, Math.random() * height));
    }
    particlesRef.current = particles;

    // Fluid drag & wake on touch/mouse
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

      const plumeCount = 16;
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

    // Pure Free-Falling Rain Simulation Loop (NO COLLIDERS)
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Smooth falling physics
        p.vy += (p.terminalVelocity - p.vy) * 0.06;
        p.vx *= 0.96;

        // Flutter sway
        p.swayPhase += p.swaySpeed;
        const sway = Math.sin(p.swayPhase) * p.swayAmplitude;

        p.x += p.vx + sway;
        p.y += p.vy;

        // Pointer wake displacement
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const wakeRadius = mouse.isDown ? 110 : 70;

        if (dist < wakeRadius && dist > 0) {
          const force = (1 - dist / wakeRadius) * (mouse.isDown ? 3.5 : 1.8);
          const nx = dx / dist;
          const ny = dy / dist;
          p.vx += nx * force + mouse.vx * 0.08;
          p.vy += ny * force * 0.5 + mouse.vy * 0.08;
        }

        // Shimmer / Twinkle calculation
        p.twinklePhase += p.twinkleSpeed;
        const twinkle = Math.sin(p.twinklePhase);
        p.alpha = Math.max(0.18, Math.min(1.0, p.baseAlpha + twinkle * 0.35));

        // Recycle particle when reaching bottom (pure continuous rain)
        if (p.y > height + 15 || p.x < -25 || p.x > width + 25) {
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
        if (p.shineLevel === 3 && twinkle > 0.25) {
          ctx.fillStyle = '#ffffff';
          const glintSize = p.size * 1.85;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - glintSize);
          ctx.lineTo(p.x + glintSize * 0.28, p.y);
          ctx.lineTo(p.x, p.y + glintSize);
          ctx.lineTo(p.x - glintSize * 0.28, p.y);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          if (p.shineLevel >= 1) {
            ctx.fillStyle = p.palette.coreColor;
            ctx.beginPath();
            ctx.arc(p.x - p.size * 0.25, p.y - p.size * 0.25, p.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }

      // Keep particle pool clean
      if (particles.length > particleCount + 40) {
        particles.splice(0, particles.length - particleCount);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
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
