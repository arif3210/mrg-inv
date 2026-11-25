import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// --------------------------------------------------------------------------
// 1. Intertwined 3D Metallic Wedding Rings (Arif & Jahana)
// --------------------------------------------------------------------------
function WeddingRings({ scrollProgress, mousePos }) {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Autonomous slow rotation
    groupRef.current.rotation.y += delta * 0.25;

    // Responsive mouse tilt
    const targetRotX = mousePos.current.y * 0.35 + scrollProgress.current * 0.5;
    const targetRotZ = mousePos.current.x * 0.2;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.05);

    // Dynamic vertical position based on scroll
    // Near top, rings rest right behind couple's names; as you scroll, they drift upwards into atmospheric depth
    const targetY = 1.2 - scrollProgress.current * 8;
    const targetZ = -0.5 - scrollProgress.current * 4;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.08);
  });

  return (
    <group ref={groupRef} position={[0, 1.2, -0.5]} scale={[1.1, 1.1, 1.1]}>
      {/* Ring 1 - Arif (Slightly larger, angled) */}
      <mesh ref={ring1Ref} position={[-0.45, 0, 0]} rotation={[0.45, 0.3, 0.2]} castShadow receiveShadow>
        <torusGeometry args={[0.95, 0.09, 32, 100]} />
        <meshStandardMaterial
          color="#f4cf70"
          metalness={0.96}
          roughness={0.16}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* Ring 2 - Jahana (Interlocking with Ring 1, elegant angle) */}
      <mesh ref={ring2Ref} position={[0.45, 0.1, 0]} rotation={[-0.45, -0.3, -0.2]} castShadow receiveShadow>
        <torusGeometry args={[0.88, 0.085, 32, 100]} />
        <meshStandardMaterial
          color="#fbe49c"
          metalness={0.98}
          roughness={0.12}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* Subtle Diamond / Gem accent on Jahana's ring */}
      <mesh position={[0.45, 0.98, 0.1]} rotation={[0.2, 0.3, 0]}>
        <octahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.05}
          metalness={0.1}
          emissive="#ffffff"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

// --------------------------------------------------------------------------
// 2. 3D Floating Golden Bokeh Orbs
// --------------------------------------------------------------------------
function BokehOrbs({ count = 18 }) {
  const orbs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 18 - 4,
        (Math.random() - 0.5) * 10 - 2,
      ],
      scale: Math.random() * 0.45 + 0.15,
      speed: Math.random() * 0.5 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((mesh, i) => {
      const orb = orbs[i];
      if (!orb) return;
      mesh.position.y += Math.sin(t * orb.speed + orb.phase) * 0.003;
      mesh.position.x += Math.cos(t * orb.speed * 0.7 + orb.phase) * 0.002;
    });
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position} scale={orb.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#dfb879"
            emissive="#b89562"
            emissiveIntensity={0.5}
            transparent
            opacity={0.35}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// --------------------------------------------------------------------------
// 3. Scroll & Parallax Camera Controller
// --------------------------------------------------------------------------
function CameraRig({ scrollProgress, mousePos, isOrbitMode }) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (isOrbitMode) return; // OrbitControls take over

    // Camera moves gracefully along Z and Y as the guest scrolls
    const p = scrollProgress.current;
    
    // Y position smoothly tracks down the sections
    const targetY = -p * 10;
    
    // Subtle focal depth push/pull
    const targetZ = 7.5 + Math.sin(p * Math.PI) * 1.2;

    // Mouse parallax for tactile spatial feel
    const targetX = mousePos.current.x * 0.6;
    const finalTargetY = targetY - mousePos.current.y * 0.4;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, finalTargetY, 0.06);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);

    camera.lookAt(0, camera.position.y * 0.9, 0);
  });

  return null;
}

// --------------------------------------------------------------------------
// 4. Main Spatial 3D Canvas Scene
// --------------------------------------------------------------------------
export default function Spatial3DCanvas({ isOrbitMode = false, onToggleOrbit }) {
  const scrollProgress = useRef(0);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress.current = Math.min(1, Math.max(0, scrollY / maxScroll));
    };

    const handleMouseMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mousePos.current = {
          x: (e.touches[0].clientX / window.innerWidth) * 2 - 1,
          y: (e.touches[0].clientY / window.innerHeight) * 2 - 1,
        };
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${
        isOrbitMode ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : ''
      }`}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        {/* Luxury Lighting Scheme */}
        <ambientLight color="#fffbf0" intensity={0.8} />
        
        {/* Main Sun / Key Light */}
        <directionalLight
          position={[5, 8, 6]}
          intensity={1.8}
          color="#ffffff"
          castShadow
        />

        {/* Warm Golden Rim Light */}
        <pointLight
          position={[-6, -2, 4]}
          intensity={1.4}
          color="#dfb879"
          distance={16}
        />

        {/* Soft Fill Light from beneath */}
        <pointLight
          position={[0, -8, 2]}
          intensity={1.0}
          color="#ffe2a4"
          distance={14}
        />

        {/* 3D Intertwined Wedding Rings */}
        <WeddingRings scrollProgress={scrollProgress} mousePos={mousePos} />

        {/* 3D Floating Gold Sparkles / Starfield in depth */}
        <Sparkles
          count={120}
          scale={[14, 24, 12]}
          size={3.8}
          speed={0.4}
          color="#f4d375"
          opacity={0.85}
        />
        <Sparkles
          count={80}
          scale={[10, 20, 8]}
          size={2.2}
          speed={0.6}
          color="#ffffff"
          opacity={0.7}
        />

        {/* 3D Floating Bokeh Orbs */}
        <BokehOrbs count={16} />

        {/* Camera Rig & Orbit Controls */}
        <CameraRig
          scrollProgress={scrollProgress}
          mousePos={mousePos}
          isOrbitMode={isOrbitMode}
        />

        {isOrbitMode && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.8}
            maxDistance={14}
            minDistance={3}
          />
        )}
      </Canvas>
    </div>
  );
}
