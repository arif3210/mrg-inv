import React, { useState, useRef, useEffect } from 'react';

export default function SpatialCard3D({
  children,
  chaosMode = false,
  className = '',
  id,
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, isHovered: false });

  // Physics drag states when chaosMode is enabled
  const [pos, setPos] = useState({ x: 0, y: 0, rot: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0, rot: 0 });
  const velocity = useRef({ vx: 0, vy: 0 });
  const lastTime = useRef(0);
  const lastCoord = useRef({ x: 0, y: 0 });
  const animFrame = useRef(null);

  // Reset physics when chaosMode turns off
  useEffect(() => {
    if (!chaosMode) {
      currentPos.current = { x: 0, y: 0, rot: 0 };
      velocity.current = { vx: 0, vy: 0 };
      setPos({ x: 0, y: 0, rot: 0 });
    }
  }, [chaosMode]);

  // Inertial physics loop in chaosMode
  useEffect(() => {
    if (!chaosMode) return;
    const friction = 0.94;
    const updatePhysics = () => {
      if (!isDragging.current) {
        if (Math.abs(velocity.current.vx) > 0.05 || Math.abs(velocity.current.vy) > 0.05) {
          velocity.current.vx *= friction;
          velocity.current.vy *= friction;

          currentPos.current.x += velocity.current.vx;
          currentPos.current.y += velocity.current.vy;
          currentPos.current.rot += velocity.current.vx * 0.08;

          const bounds = 250;
          if (Math.abs(currentPos.current.x) > bounds) {
            velocity.current.vx = -velocity.current.vx * 0.7;
          }
          if (Math.abs(currentPos.current.y) > bounds) {
            velocity.current.vy = -velocity.current.vy * 0.7;
          }

          setPos({ ...currentPos.current });
        }
      }
      animFrame.current = requestAnimationFrame(updatePhysics);
    };

    animFrame.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animFrame.current);
  }, [chaosMode]);

  // 3D Spatial Tilt & Glare Tracking (Desktop & Mobile)
  const handlePointerMove = (e) => {
    if (chaosMode) {
      // Handle chaos mode dragging
      if (!isDragging.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const newX = clientX - dragStart.current.x;
      const newY = clientY - dragStart.current.y;
      const now = performance.now();
      const dt = Math.max(1, now - lastTime.current);
      velocity.current = {
        vx: ((clientX - lastCoord.current.x) / dt) * 16,
        vy: ((clientY - lastCoord.current.y) / dt) * 16,
      };
      lastCoord.current = { x: clientX, y: clientY };
      lastTime.current = now;
      currentPos.current = { x: newX, y: newY, rot: newX * 0.06 };
      setPos({ ...currentPos.current });
      return;
    }

    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (!clientX || !clientY) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Gentle maximum 6-degree 3D tilt for Apple-like refined spatial feel
    const rotX = -((y - centerY) / centerY) * 5;
    const rotY = ((x - centerX) / centerX) * 5;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotX, rotY, glareX, glareY, isHovered: true });
  };

  const handlePointerDown = (e) => {
    if (chaosMode) {
      isDragging.current = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      dragStart.current = {
        x: clientX - currentPos.current.x,
        y: clientY - currentPos.current.y,
      };
      lastCoord.current = { x: clientX, y: clientY };
      lastTime.current = performance.now();
      velocity.current = { vx: 0, vy: 0 };
    }
  };

  const handlePointerLeave = () => {
    if (chaosMode) {
      isDragging.current = false;
      return;
    }
    // Return gently to flat resting state
    setTilt({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerLeave}
      className={`relative [perspective:1200px] ${className}`}
      id={id}
    >
      <div
        className="transition-transform duration-300 ease-out [transform-style:preserve-3d] will-change-transform rounded-[32px] overflow-hidden"
        style={{
          transform: chaosMode
            ? `translate3d(${pos.x}px, ${pos.y}px, 0px) rotate(${pos.rot}deg)`
            : `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) translateZ(${tilt.isHovered ? 12 : 0}px)`,
          boxShadow: tilt.isHovered && !chaosMode
            ? '0 30px 60px -12px rgba(184, 149, 98, 0.15), 0 18px 36px -18px rgba(0, 0, 0, 0.08)'
            : '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Dynamic Specular Glare Sheen across glass surface */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-500 rounded-[32px]"
          style={{
            opacity: tilt.isHovered && !chaosMode ? 0.35 : 0,
            background: `radial-gradient(circle 350px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.8), transparent 70%)`,
          }}
        />

        {children}
      </div>
    </div>
  );
}
