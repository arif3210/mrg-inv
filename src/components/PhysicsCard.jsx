import React, { useState, useRef, useEffect } from 'react';

export default function PhysicsCard({ children, chaosMode, className = '', id }) {
  const [pos, setPos] = useState({ x: 0, y: 0, rot: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0, rot: 0 });
  const velocity = useRef({ vx: 0, vy: 0 });
  const lastTime = useRef(0);
  const lastCoord = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const animFrame = useRef(null);

  useEffect(() => {
    if (!chaosMode) {
      currentPos.current = { x: 0, y: 0, rot: 0 };
      velocity.current = { vx: 0, vy: 0 };
      setPos({ x: 0, y: 0, rot: 0 });
    }
  }, [chaosMode]);

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

  const handlePointerDown = (e) => {
    if (!chaosMode) return;
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

    if (e.target.setPointerCapture && e.pointerId) {
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handlePointerMove = (e) => {
    if (!chaosMode || !isDragging.current) return;
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

    currentPos.current = {
      x: newX,
      y: newY,
      rot: newX * 0.06,
    };
    setPos({ ...currentPos.current });
  };

  const handlePointerUp = () => {
    if (!chaosMode) return;
    isDragging.current = false;
  };

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      data-physics-obstacle="true"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0px) rotate(${pos.rot}deg)`,
        transition: isDragging.current || (chaosMode && (Math.abs(velocity.current.vx) > 0.1 || Math.abs(velocity.current.vy) > 0.1))
          ? 'none'
          : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: chaosMode ? 'grab' : 'default',
        touchAction: chaosMode ? 'none' : 'auto',
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
