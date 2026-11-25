import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import {
  Sparkles as SparklesIcon,
  Calendar,
  MapPin,
  Clock,
  Navigation,
  CheckCircle,
  CalendarPlus,
  Share2,
  Gamepad2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Compass
} from 'lucide-react';
import CountdownTimer from '../CountdownTimer';
import SparkleCollectorGame from '../SparkleCollectorGame';
import SudokuGame from '../SudokuGame';
import FindJahanaGame from '../FindJahanaGame';

// ---------------------------------------------------------------------------
// 1. Grand Minimalist Stone Archway (Travertine / Limestone)
// ---------------------------------------------------------------------------
function GrandArch({ zPosition, archScale = 1 }) {
  return (
    <group position={[0, 0, zPosition]} scale={[archScale, archScale, archScale]}>
      {/* Left Pillar */}
      <mesh position={[-2.4, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 4.4, 0.55]} />
        <meshStandardMaterial
          color="#ebe5dc"
          roughness={0.65}
          metalness={0.06}
        />
      </mesh>

      {/* Right Pillar */}
      <mesh position={[2.4, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 4.4, 0.55]} />
        <meshStandardMaterial
          color="#ebe5dc"
          roughness={0.65}
          metalness={0.06}
        />
      </mesh>

      {/* Top Crossbeam / Lintel */}
      <mesh position={[0, 4.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.35, 0.45, 0.65]} />
        <meshStandardMaterial
          color="#eae4db"
          roughness={0.65}
          metalness={0.06}
        />
      </mesh>

      {/* Gold Trim Inlay Band across top lintel */}
      <mesh position={[0, 4.28, 0]}>
        <boxGeometry args={[5.38, 0.05, 0.68]} />
        <meshStandardMaterial
          color="#dfb879"
          metalness={0.92}
          roughness={0.25}
        />
      </mesh>

      {/* Decorative Pillar Capital Blocks */}
      <mesh position={[-2.4, 4.15, 0]}>
        <boxGeometry args={[0.7, 0.15, 0.7]} />
        <meshStandardMaterial color="#dfb879" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[2.4, 4.15, 0]}>
        <boxGeometry args={[0.7, 0.15, 0.7]} />
        <meshStandardMaterial color="#dfb879" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. Sanctuary Architecture: Colonnade, Water Canal, & Pavement
// ---------------------------------------------------------------------------
function SanctuaryEnvironment() {
  const waterRef = useRef();

  useFrame((state) => {
    if (waterRef.current) {
      // Subtle gentle water shimmer
      const t = state.clock.getElapsedTime();
      waterRef.current.position.y = -0.05 + Math.sin(t * 1.5) * 0.005;
    }
  });

  return (
    <group>
      {/* Grand Archways along the Z-axis promenade */}
      <GrandArch zPosition={2.5} />
      <GrandArch zPosition={-5.5} />
      <GrandArch zPosition={-13.5} />
      <GrandArch zPosition={-21.5} />
      <GrandArch zPosition={-29.5} />

      {/* Left Stone Promenade Walkway */}
      <mesh position={[-2.5, -0.05, -14]} receiveShadow>
        <boxGeometry args={[3.2, 0.2, 42]} />
        <meshStandardMaterial color="#f0eae1" roughness={0.7} metalness={0.04} />
      </mesh>

      {/* Right Stone Promenade Walkway */}
      <mesh position={[2.5, -0.05, -14]} receiveShadow>
        <boxGeometry args={[3.2, 0.2, 42]} />
        <meshStandardMaterial color="#f0eae1" roughness={0.7} metalness={0.04} />
      </mesh>

      {/* Central Reflecting Water Canal */}
      <mesh ref={waterRef} position={[0, -0.05, -14]} receiveShadow>
        <planeGeometry args={[1.8, 42]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color="#3c4d5c"
          roughness={0.12}
          metalness={0.88}
        />
      </mesh>

      {/* Gold Canal Edge Borders */}
      <mesh position={[-0.92, 0.05, -14]}>
        <boxGeometry args={[0.06, 0.05, 42]} />
        <meshStandardMaterial color="#dfb879" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0.92, 0.05, -14]}>
        <boxGeometry args={[0.06, 0.05, 42]} />
        <meshStandardMaterial color="#dfb879" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. Floating 3D Intertwined Gold Rings (Entrance Sanctuary)
// ---------------------------------------------------------------------------
function FloatingWeddingRings({ zPosition = 0.5 }) {
  const ringGroup = useRef();

  useFrame((_, delta) => {
    if (!ringGroup.current) return;
    ringGroup.current.rotation.y += delta * 0.35;
    ringGroup.current.rotation.x = Math.sin(ringGroup.current.rotation.y * 0.7) * 0.15;
  });

  return (
    <group ref={ringGroup} position={[0, 4.3, zPosition]} scale={[0.8, 0.8, 0.8]}>
      {/* Ring 1 - Arif */}
      <mesh position={[-0.45, 0, 0]} rotation={[0.45, 0.3, 0.2]} castShadow>
        <torusGeometry args={[0.95, 0.1, 32, 100]} />
        <meshStandardMaterial color="#f4cf70" metalness={0.96} roughness={0.16} />
      </mesh>

      {/* Ring 2 - Jahana */}
      <mesh position={[0.45, 0.1, 0]} rotation={[-0.45, -0.3, -0.2]} castShadow>
        <torusGeometry args={[0.88, 0.09, 32, 100]} />
        <meshStandardMaterial color="#fbe49c" metalness={0.98} roughness={0.12} />
      </mesh>

      {/* Diamond Accent */}
      <mesh position={[0.45, 0.98, 0.1]}>
        <octahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Smooth Cinematic Camera Controller
// ---------------------------------------------------------------------------
function SanctuaryCameraController({ currentStation, mousePos }) {
  const { camera } = useThree();

  // Station camera target Z-positions:
  // Station 0: Welcome (Z = 0) -> Cam Z = 4.2
  // Station 1: Date & Countdown (Z = -8) -> Cam Z = -3.8
  // Station 2: Venue & Location (Z = -16) -> Cam Z = -11.8
  // Station 3: Mini-Games (Z = -24) -> Cam Z = -19.8
  const stationZOffsets = [4.2, -3.8, -11.8, -19.8];

  useFrame((_, delta) => {
    const targetZ = stationZOffsets[currentStation] ?? 4.2;
    const targetY = 2.1;
    
    // Parallax sway
    const targetX = mousePos.current.x * 0.45;
    const finalTargetY = targetY - mousePos.current.y * 0.25;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 3.2);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, finalTargetY, delta * 3.2);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 3.2);

    // Look toward station center
    const lookAtZ = targetZ - 4.5;
    camera.lookAt(0, 2.0, lookAtZ);
  });

  return null;
}

// ---------------------------------------------------------------------------
// 5. Main Architectural Sanctuary Component
// ---------------------------------------------------------------------------
export default function ArchitecturalSanctuary({
  namesRef,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handleAmpersandClick,
  handleAddToCalendar,
  handleShare,
  venueGoogleMapsUrl,
  activeGameTab,
  setActiveGameTab,
}) {
  const [station, setStation] = useState(0); // 0: Welcome, 1: Date & Countdown, 2: Venue, 3: Games
  const mousePos = useRef({ x: 0, y: 0 });
  const touchStartY = useRef(0);
  const isTransitioning = useRef(false);

  // Wheel & touch navigation between stations
  useEffect(() => {
    const handleWheel = (e) => {
      if (isTransitioning.current) return;
      if (Math.abs(e.deltaY) < 35) return;

      if (e.deltaY > 0) {
        // Scroll forward
        setStation((prev) => Math.min(3, prev + 1));
      } else {
        // Scroll backward
        setStation((prev) => Math.max(0, prev - 1));
      }

      isTransitioning.current = true;
      setTimeout(() => {
        isTransitioning.current = false;
      }, 700);
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isTransitioning.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          setStation((prev) => Math.min(3, prev + 1));
        } else {
          setStation((prev) => Math.max(0, prev - 1));
        }
        isTransitioning.current = true;
        setTimeout(() => {
          isTransitioning.current = false;
        }, 700);
      }
    };

    const handleMouseMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const stationTitles = [
    'The Welcome',
    'Date & Countdown',
    'Location & Venue',
    'Celebration Games',
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#fbf9f5] via-[#f5f0e6] to-[#ebe3d5] select-none">
      {/* 3D WebGL Architectural World */}
      <Canvas
        camera={{ position: [0, 2.1, 4.2], fov: 44 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        className="w-full h-full block"
      >
        {/* Soft Dreamy Fog blending into morning mist */}
        <fog attach="fog" args={['#f5efe6', 7, 34]} />

        {/* Ambient Morning Light */}
        <ambientLight color="#fff8ed" intensity={0.9} />

        {/* Golden Sun Key Light */}
        <directionalLight
          position={[7, 10, 6]}
          intensity={2.4}
          color="#ffffff"
          castShadow
        />

        {/* Soft Golden Fill Light */}
        <pointLight position={[-5, 4, -4]} intensity={1.5} color="#dfb879" distance={18} />
        <pointLight position={[5, 4, -12]} intensity={1.5} color="#ffe2a4" distance={18} />

        {/* Floating Golden Dust Particles drifting in sunbeams */}
        <Sparkles
          count={140}
          scale={[10, 8, 36]}
          position={[0, 3, -12]}
          size={3.4}
          speed={0.4}
          color="#f4d375"
          opacity={0.8}
        />

        {/* Architectural Environment (Pillars, Arches, Water Canal) */}
        <SanctuaryEnvironment />

        {/* Floating Wedding Rings at Station 0 Entrance */}
        <FloatingWeddingRings zPosition={0.5} />

        {/* ------------------------------------------------------------- */}
        {/* STATION 0: The Welcome & Holy Union (Z = 0)                   */}
        {/* ------------------------------------------------------------- */}
        <group position={[0, 2.0, 0]}>
          <Html
            transform
            distanceFactor={3.6}
            position={[0, 0, 0]}
            className={`transition-opacity duration-700 w-[420px] max-w-[92vw] ${
              station === 0 ? 'opacity-100 pointer-events-auto' : 'opacity-10 pointer-events-none'
            }`}
          >
            <div className="bg-white/85 backdrop-blur-2xl rounded-[32px] p-7 sm:p-9 text-center shadow-2xl border border-white/60 font-sans">
              <div className="space-y-3 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-[11px] font-semibold text-[#86868b] tracking-widest uppercase">
                  <SparklesIcon className="w-3 h-3 text-[#b89562]" />
                  <span>The Wedding Celebration</span>
                </div>

                <div className="font-arabic text-2xl text-[#1d1d1f] font-normal tracking-wide">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>

                <p className="font-cormorant italic text-sm text-[#6e6e73] leading-relaxed max-w-xs mx-auto">
                  "And He has put between you affection and mercy"
                  <span className="block text-[11px] font-sans not-italic text-[#86868b] mt-0.5">
                    Surah Ar-Rum 30:21
                  </span>
                </p>
              </div>

              {/* Couple Names */}
              <div
                ref={namesRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="my-6 space-y-1 select-none touch-none cursor-pointer"
              >
                <h1 className="font-luxury text-5xl font-normal text-[#1d1d1f] tracking-wide pointer-events-none">
                  Arif
                </h1>

                <div className="flex items-center justify-center gap-3 my-1.5 text-[#b89562]">
                  <span className="h-[1px] w-12 bg-black/[0.08]" />
                  <span
                    onClick={handleAmpersandClick}
                    className="font-cormorant italic text-2xl text-[#b89562] select-none hover:scale-110 active:scale-95 transition-transform"
                  >
                    &
                  </span>
                  <span className="h-[1px] w-12 bg-black/[0.08]" />
                </div>

                <h1 className="font-luxury text-5xl font-normal text-[#1d1d1f] tracking-wide pointer-events-none">
                  Jahana
                </h1>
              </div>

              <p className="text-xs text-[#86868b] tracking-wider uppercase font-medium">
                Together with their families, request the honour of your presence & prayers
              </p>

              {/* Next Step Guidance Button */}
              <div className="pt-6">
                <button
                  onClick={() => setStation(1)}
                  className="apple-pill-btn px-6 py-2.5 text-xs font-semibold tracking-wider inline-flex items-center gap-2 shadow-md"
                >
                  <span>Step Forward: The Date</span>
                  <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                </button>
              </div>
            </div>
          </Html>
        </group>

        {/* ------------------------------------------------------------- */}
        {/* STATION 1: Date & Countdown Pavilion (Z = -8)                 */}
        {/* ------------------------------------------------------------- */}
        <group position={[0, 2.0, -8]}>
          <Html
            transform
            distanceFactor={3.6}
            position={[0, 0, 0]}
            className={`transition-opacity duration-700 w-[420px] max-w-[92vw] ${
              station === 1 ? 'opacity-100 pointer-events-auto' : 'opacity-10 pointer-events-none'
            }`}
          >
            <div className="bg-white/85 backdrop-blur-2xl rounded-[32px] p-7 sm:p-9 text-center shadow-2xl border border-white/60 font-sans space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-[11px] font-semibold text-[#86868b] tracking-wider uppercase">
                <Calendar className="w-3.5 h-3.5 text-[#b89562]" />
                <span>Ceremony Timeline</span>
              </div>

              <div>
                <h2 className="font-serif text-3xl font-bold text-[#1d1d1f] tracking-tight">
                  December 24, 2026
                </h2>
                <p className="text-xs text-[#6e6e73] mt-1">
                  Thursday Morning • Kozhikode, Kerala
                </p>
              </div>

              {/* Countdown Component */}
              <div className="pt-2 scale-105">
                <CountdownTimer targetDate="2026-12-24T10:00:00" />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={handleAddToCalendar}
                  className="apple-pill-btn px-5 py-2.5 text-xs tracking-wider flex items-center gap-2 shadow-sm"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Save Date</span>
                </button>

                <button
                  onClick={handleShare}
                  className="apple-secondary-btn px-4 py-2.5 text-xs tracking-wider flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#6e6e73]" />
                  <span>Share</span>
                </button>
              </div>

              {/* Navigation Prompt */}
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => setStation(0)}
                  className="text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] px-3 py-1"
                >
                  ← Welcome
                </button>
                <button
                  onClick={() => setStation(2)}
                  className="apple-pill-btn px-4 py-1.5 text-xs flex items-center gap-1"
                >
                  <span>Venue & Location</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </Html>
        </group>

        {/* ------------------------------------------------------------- */}
        {/* STATION 2: The Venue & Location Pavilion (Z = -16)            */}
        {/* ------------------------------------------------------------- */}
        <group position={[0, 2.0, -16]}>
          <Html
            transform
            distanceFactor={3.6}
            position={[0, 0, 0]}
            className={`transition-opacity duration-700 w-[440px] max-w-[92vw] ${
              station === 2 ? 'opacity-100 pointer-events-auto' : 'opacity-10 pointer-events-none'
            }`}
          >
            <div className="bg-white/85 backdrop-blur-2xl rounded-[32px] p-7 sm:p-9 shadow-2xl border border-white/60 font-sans space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                  Location & Schedule
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#1d1d1f]">
                  Where & When
                </h2>
              </div>

              {/* Venue Card */}
              <div className="bg-[#f5f5f7]/85 rounded-2xl p-5 border border-black/[0.04] space-y-2">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs border border-black/[0.04]">
                  <MapPin className="w-4 h-4 text-[#b89562]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#1d1d1f]">
                    Al Fitra Auditorium
                  </h3>
                  <p className="text-xs text-[#6e6e73] mt-0.5 leading-relaxed">
                    East Kizhakkoth, Kozhikode, Kerala
                  </p>
                  <p className="text-[11px] text-[#86868b] mt-1 leading-normal">
                    Incorporated with Kids Park (Listed on Maps as <span className="font-medium text-[#1d1d1f]">Kids Park - Al Fitrah</span>)
                  </p>
                </div>
                <a
                  href={venueGoogleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d1d1f] hover:text-[#b89562] pt-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>

              {/* Timing Card */}
              <div className="bg-[#f5f5f7]/85 rounded-2xl p-4 border border-black/[0.04] space-y-1.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#b89562]" />
                  <span className="text-xs font-bold text-[#1d1d1f]">Thursday, Dec 24, 2026</span>
                </div>
                <div className="text-xs text-[#6e6e73] space-y-1 pl-5">
                  <p className="flex justify-between">
                    <span>Nikah & Reception:</span>
                    <strong className="text-[#1d1d1f]">10:30 AM</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Traditional Lunch:</span>
                    <strong className="text-[#1d1d1f]">12:30 PM</strong>
                  </p>
                </div>
              </div>

              {/* Direct Maps Action */}
              <a
                href={venueGoogleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block py-3 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8e8ed] text-center text-[#1d1d1f] text-xs font-semibold tracking-wide border border-black/[0.04] transition-colors"
              >
                Open Location in Google Maps (Kids Park - Al Fitrah)
              </a>

              {/* Next Button */}
              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => setStation(1)}
                  className="text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f]"
                >
                  ← Date & Time
                </button>
                <button
                  onClick={() => setStation(3)}
                  className="apple-pill-btn px-4 py-1.5 text-xs flex items-center gap-1"
                >
                  <span>Celebration Games</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </Html>
        </group>

        {/* ------------------------------------------------------------- */}
        {/* STATION 3: The Celebration Terrace / Mini-Games (Z = -24)     */}
        {/* ------------------------------------------------------------- */}
        <group position={[0, 2.0, -24]}>
          <Html
            transform
            distanceFactor={3.6}
            position={[0, 0, 0]}
            className={`transition-opacity duration-700 w-[450px] max-w-[92vw] ${
              station === 3 ? 'opacity-100 pointer-events-auto' : 'opacity-10 pointer-events-none'
            }`}
          >
            <div className="bg-white/85 backdrop-blur-2xl rounded-[32px] p-7 shadow-2xl border border-white/60 font-sans space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/[0.06] text-[11px] font-semibold text-[#86868b] uppercase tracking-wider shadow-xs">
                  <Gamepad2 className="w-3 h-3 text-[#b89562]" />
                  <span>Celebration Mini-Games</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#1d1d1f]">
                  Guest Activities
                </h2>
                <p className="text-xs text-[#6e6e73]">
                  Play interactive mini-games to send blessings to Arif & Jahana
                </p>
              </div>

              {/* Game Tabs */}
              <div className="flex gap-1.5 p-1 bg-[#f5f5f7] rounded-xl border border-black/[0.04]">
                <button
                  onClick={() => setActiveGameTab('sparkles')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    activeGameTab === 'sparkles'
                      ? 'bg-white text-[#1d1d1f] shadow-xs font-bold'
                      : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  Crystals
                </button>
                <button
                  onClick={() => setActiveGameTab('sudoku')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    activeGameTab === 'sudoku'
                      ? 'bg-white text-[#1d1d1f] shadow-xs font-bold'
                      : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  Sudoku
                </button>
                <button
                  onClick={() => setActiveGameTab('findJahana')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    activeGameTab === 'findJahana'
                      ? 'bg-white text-[#1d1d1f] shadow-xs font-bold'
                      : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  Reach Jahana
                </button>
              </div>

              {/* Active Game Container */}
              <div className="max-h-[310px] overflow-y-auto rounded-2xl">
                {activeGameTab === 'sparkles' && <SparkleCollectorGame />}
                {activeGameTab === 'sudoku' && <SudokuGame />}
                {activeGameTab === 'findJahana' && <FindJahanaGame />}
              </div>

              {/* Return to Entrance */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => setStation(0)}
                  className="apple-secondary-btn px-5 py-2 text-xs font-semibold"
                >
                  ↺ Return to Welcome Entrance
                </button>
              </div>
            </div>
          </Html>
        </group>

        {/* Camera Rig interpolating through Sanctuary */}
        <SanctuaryCameraController currentStation={station} mousePos={mousePos} />
      </Canvas>

      {/* Floating Sanctuary Chapter Timeline Controller (Bottom Center) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 sm:gap-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-black/[0.08] shadow-xl">
        {stationTitles.map((title, idx) => (
          <button
            key={idx}
            onClick={() => setStation(idx)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1.5 ${
              station === idx
                ? 'bg-[#1d1d1f] text-white shadow-md scale-105'
                : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.03]'
            }`}
          >
            <span className="font-mono text-[9px] opacity-60">0{idx + 1}</span>
            <span className="hidden sm:inline">{title}</span>
          </button>
        ))}
      </div>

      {/* Side Quick Navigation Arrows */}
      <div className="fixed inset-y-0 left-4 z-40 flex items-center pointer-events-none">
        {station > 0 && (
          <button
            onClick={() => setStation((p) => p - 1)}
            className="pointer-events-auto p-2.5 rounded-full bg-white/85 hover:bg-white backdrop-blur-md shadow-md border border-black/[0.06] text-[#1d1d1f] transition-transform active:scale-95"
            aria-label="Previous Station"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="fixed inset-y-0 right-4 z-40 flex items-center pointer-events-none">
        {station < 3 && (
          <button
            onClick={() => setStation((p) => p + 1)}
            className="pointer-events-auto p-2.5 rounded-full bg-white/85 hover:bg-white backdrop-blur-md shadow-md border border-black/[0.06] text-[#1d1d1f] transition-transform active:scale-95"
            aria-label="Next Station"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Subtle Scroll Hint */}
      <div className="fixed top-5 left-5 z-40 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-black/[0.06] shadow-xs text-[11px] font-semibold text-[#86868b] flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#b89562]" />
          <span>3D Sanctuary Walkthrough</span>
        </div>
      </div>
    </div>
  );
}
