import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, ContactShadows, Float, Sparkles, OrbitControls } from '@react-three/drei';
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
  Eye,
  RotateCcw,
  Box,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import CountdownTimer from '../CountdownTimer';
import SparkleCollectorGame from '../SparkleCollectorGame';
import SudokuGame from '../SudokuGame';
import FindJahanaGame from '../FindJahanaGame';

// ---------------------------------------------------------------------------
// 1. 3D Golden Wax Seal / Royal Monogram Clasp
// ---------------------------------------------------------------------------
function GoldenSeal({ isOpen, onOpen, isHovered, setIsHovered }) {
  const sealRef = useRef();

  useFrame((state, delta) => {
    if (!sealRef.current) return;
    // Gentle floating shimmer when closed
    if (!isOpen) {
      sealRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group
      ref={sealRef}
      position={[0, 0.28, 2.3]}
      onClick={onOpen}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      cursor="pointer"
    >
      {/* Outer scalloped wax seal base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.58, 0.08, 36]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.92}
          roughness={0.22}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* Inner embossed crest ring */}
      <mesh position={[0, 0.045, 0]} castShadow>
        <torusGeometry args={[0.42, 0.03, 16, 40]} />
        <meshStandardMaterial
          color="#fbe49c"
          metalness={0.98}
          roughness={0.15}
          envMapIntensity={3.0}
        />
      </mesh>

      {/* Center Royal Monogram "A & J" / Star Motif */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.85}
          roughness={0.1}
          emissive="#e5c158"
          emissiveIntensity={isHovered ? 0.8 : 0.3}
        />
      </mesh>

      {/* Floating Prompt Pill when closed */}
      {!isOpen && (
        <Html position={[0, 0.6, 0]} center distanceFactor={10} className="pointer-events-none select-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-[#b89562]/30 text-[11px] font-semibold text-[#1d1d1f] tracking-wide whitespace-nowrap animate-bounce">
            <SparklesIcon className="w-3.5 h-3.5 text-[#b89562] animate-spin" />
            <span>Click to Break Seal & Unfold</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. 3D Luxury Box (Base + Hinged Lid)
// ---------------------------------------------------------------------------
function LuxuryBox({ isOpen, onOpen }) {
  const lidHingeRef = useRef();
  const [sealHovered, setSealHovered] = useState(false);

  useFrame((_, delta) => {
    if (!lidHingeRef.current) return;
    // Lid opens backwards by ~115 degrees (-2.0 rad)
    const targetRotX = isOpen ? -Math.PI * 0.64 : 0;
    lidHingeRef.current.rotation.x = THREE.MathUtils.lerp(
      lidHingeRef.current.rotation.x,
      targetRotX,
      delta * 2.8
    );
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Box Base Tray */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.4, 5.2]} />
        <meshStandardMaterial
          color="#f8f6f0"
          roughness={0.4}
          metalness={0.15}
        />
      </mesh>

      {/* Gold Trim around Base Rim */}
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[3.84, 0.02, 5.24]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>

      {/* Interior Velvet Lining (Inside bottom of box) */}
      <mesh position={[0, -0.005, 0]}>
        <planeGeometry args={[3.6, 5.0]} />
        <meshStandardMaterial
          color="#2a2219"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Hinged Lid (Hinged along rear top edge Z = -2.6) */}
      <group ref={lidHingeRef} position={[0, 0.02, -2.6]}>
        {/* Lid Body positioned forward relative to hinge */}
        <mesh position={[0, 0.12, 2.6]} castShadow receiveShadow>
          <boxGeometry args={[3.86, 0.24, 5.26]} />
          <meshStandardMaterial
            color="#fdfbf7"
            roughness={0.35}
            metalness={0.18}
          />
        </mesh>

        {/* Gold Border Relief on Lid Top */}
        <mesh position={[0, 0.25, 2.6]}>
          <boxGeometry args={[3.6, 0.01, 5.0]} />
          <meshStandardMaterial
            color="#e2c16d"
            metalness={0.88}
            roughness={0.25}
          />
        </mesh>

        {/* Embossed Royal Monogram & Gold Inscription on Lid */}
        <mesh position={[0, 0.26, 2.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 0.95, 48]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.95}
            roughness={0.18}
          />
        </mesh>

        {/* Interactive Wax Seal Clasp on the front edge of the lid */}
        <GoldenSeal
          isOpen={isOpen}
          onOpen={onOpen}
          isHovered={sealHovered}
          setIsHovered={setSealHovered}
        />
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. 3D Unfolding Folio (Center Hero, Left Venue, Right Activities)
// ---------------------------------------------------------------------------
function UnfoldingFolio({
  isOpen,
  activePanel,
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
  const folioGroupRef = useRef();
  const leftHingeRef = useRef();
  const rightHingeRef = useRef();

  useFrame((_, delta) => {
    if (!folioGroupRef.current || !leftHingeRef.current || !rightHingeRef.current) return;

    // Folio rises up from inside the box when opening
    const targetY = isOpen ? 1.55 : 0.08;
    const targetZ = isOpen ? 0.35 : 0;
    const targetScale = isOpen ? 1.0 : 0.75;

    folioGroupRef.current.position.y = THREE.MathUtils.lerp(
      folioGroupRef.current.position.y,
      targetY,
      delta * 2.4
    );
    folioGroupRef.current.position.z = THREE.MathUtils.lerp(
      folioGroupRef.current.position.z,
      targetZ,
      delta * 2.4
    );
    const s = THREE.MathUtils.lerp(folioGroupRef.current.scale.x, targetScale, delta * 2.4);
    folioGroupRef.current.scale.set(s, s, s);

    // Left panel unfolds from +170deg (folded inward) to -0.3rad (-17deg concave view)
    const targetLeftRotY = isOpen ? -0.32 : Math.PI * 0.96;
    leftHingeRef.current.rotation.y = THREE.MathUtils.lerp(
      leftHingeRef.current.rotation.y,
      targetLeftRotY,
      delta * 2.2
    );

    // Right panel unfolds from -170deg (folded inward) to +0.3rad (+17deg concave view)
    const targetRightRotY = isOpen ? 0.32 : -Math.PI * 0.96;
    rightHingeRef.current.rotation.y = THREE.MathUtils.lerp(
      rightHingeRef.current.rotation.y,
      targetRightRotY,
      delta * 2.2
    );
  });

  return (
    <group ref={folioGroupRef} position={[0, 0.08, 0]}>
      {/* ----------------------------------------------------------------- */}
      {/* CENTER PANEL: Royal Invitation & Hero Section                    */}
      {/* ----------------------------------------------------------------- */}
      <group position={[0, 0, 0]}>
        {/* Physical 3D Cardboard Slab with Gold Foil Edge */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 4.4, 0.06]} />
          <meshStandardMaterial
            color="#fffef9"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
        
        {/* Gold Leaf Trim around Center Card */}
        <mesh position={[0, 0, 0.032]}>
          <boxGeometry args={[3.12, 4.32, 0.005]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.92}
            roughness={0.2}
          />
        </mesh>

        {/* Interactive Native HTML Invitation Content Mounted Directly in 3D */}
        <Html
          transform
          distanceFactor={3.2}
          position={[0, 0, 0.036]}
          className="w-[380px] select-none"
        >
          <div className="bg-[#fffef9]/95 rounded-[26px] p-6 text-center shadow-lg border border-[#b89562]/20 font-sans">
            {/* Header Tag & Bismillah */}
            <div className="space-y-2 mb-4">
              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-[10px] font-semibold text-[#86868b] uppercase tracking-wider">
                <SparklesIcon className="w-3 h-3 text-[#b89562]" />
                <span>The Wedding Celebration</span>
              </div>

              <div className="font-arabic text-xl text-[#1d1d1f] font-normal tracking-wide">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>

              <p className="font-cormorant italic text-xs text-[#6e6e73] leading-relaxed">
                "And He has put between you affection and mercy"
                <span className="block text-[10px] font-sans not-italic text-[#86868b] mt-0.5">
                  Surah Ar-Rum 30:21
                </span>
              </p>
            </div>

            {/* Couple Names (Gesture detection for secret easter egg preserved) */}
            <div
              ref={namesRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="my-5 space-y-1 select-none touch-none cursor-pointer"
            >
              <h1 className="font-luxury text-4xl font-normal text-[#1d1d1f] tracking-wide pointer-events-none">
                Arif
              </h1>

              <div className="flex items-center justify-center gap-2 my-1 text-[#b89562]">
                <span className="h-[1px] w-8 bg-black/[0.08]" />
                <span
                  onClick={handleAmpersandClick}
                  className="font-cormorant italic text-lg text-[#b89562] hover:scale-110 active:scale-95 transition-transform"
                >
                  &
                </span>
                <span className="h-[1px] w-8 bg-black/[0.08]" />
              </div>

              <h1 className="font-luxury text-4xl font-normal text-[#1d1d1f] tracking-wide pointer-events-none">
                Jahana
              </h1>
            </div>

            <p className="text-[10px] text-[#86868b] uppercase tracking-wider font-medium mb-3">
              Together with their families, request the honour of your presence
            </p>

            {/* Wedding Date */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f5f7] border border-black/[0.04] mb-3">
              <Calendar className="w-3.5 h-3.5 text-[#b89562]" />
              <span className="font-serif text-xs font-semibold text-[#1d1d1f]">
                December 24, 2026
              </span>
            </div>

            {/* Countdown */}
            <div className="mb-4 scale-95">
              <CountdownTimer targetDate="2026-12-24T10:00:00" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleAddToCalendar}
                className="apple-pill-btn px-4 py-2 text-[10px] tracking-wider flex items-center gap-1.5 shadow-sm"
              >
                <CalendarPlus className="w-3 h-3" />
                <span>Save Date</span>
              </button>

              <button
                onClick={handleShare}
                className="apple-secondary-btn px-3.5 py-2 text-[10px] tracking-wider flex items-center gap-1.5"
              >
                <Share2 className="w-3 h-3 text-[#6e6e73]" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </Html>
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* LEFT PANEL: Location & Schedule (Hinged at X = -1.6)              */}
      {/* ----------------------------------------------------------------- */}
      <group ref={leftHingeRef} position={[-1.6, 0, 0]}>
        {/* Physical 3D Cardboard Slab (shifted -1.45 so hinge is on the right) */}
        <mesh position={[-1.45, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.9, 4.4, 0.05]} />
          <meshStandardMaterial
            color="#fffef9"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>

        {/* Gold Border Trim */}
        <mesh position={[-1.45, 0, 0.027]}>
          <boxGeometry args={[2.82, 4.32, 0.005]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.92}
            roughness={0.2}
          />
        </mesh>

        {/* Content Projection on Left Panel */}
        <Html
          transform
          distanceFactor={3.2}
          position={[-1.45, 0, 0.032]}
          className="w-[340px] select-none"
        >
          <div className="bg-[#fffef9]/95 rounded-[26px] p-5 shadow-lg border border-[#b89562]/20 font-sans space-y-4">
            <div className="text-center space-y-0.5">
              <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider">
                Location & Schedule
              </span>
              <h2 className="font-serif text-lg font-bold text-[#1d1d1f]">
                Where & When
              </h2>
            </div>

            {/* Venue Card */}
            <div className="bg-[#f5f5f7]/80 rounded-2xl p-4 border border-black/[0.04] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-xs border border-black/[0.04]">
                <MapPin className="w-3.5 h-3.5 text-[#b89562]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xs text-[#1d1d1f]">
                  Al Fitra Auditorium
                </h3>
                <p className="text-[11px] text-[#6e6e73] leading-relaxed">
                  East Kizhakkoth, Kozhikode, Kerala
                </p>
                <p className="text-[10px] text-[#86868b] mt-1 leading-normal">
                  Incorporated with Kids Park (Listed on Maps as <span className="font-medium text-[#1d1d1f]">Kids Park - Al Fitrah</span>)
                </p>
              </div>

              <a
                href={venueGoogleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1d1d1f] hover:text-[#b89562] pt-1"
              >
                <Navigation className="w-3 h-3" />
                <span>Get Directions</span>
              </a>
            </div>

            {/* Timing Card */}
            <div className="bg-[#f5f5f7]/80 rounded-2xl p-4 border border-black/[0.04] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-xs border border-black/[0.04]">
                <Clock className="w-3.5 h-3.5 text-[#b89562]" />
              </div>
              <h3 className="font-serif font-bold text-xs text-[#1d1d1f]">
                Thursday, Dec 24, 2026
              </h3>
              <div className="text-[11px] text-[#6e6e73] space-y-1">
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

            {/* Direct Map Callout */}
            <a
              href={venueGoogleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block py-2.5 rounded-xl bg-[#f5f5f7] hover:bg-[#e8e8ed] text-center text-[#1d1d1f] text-[10px] font-semibold tracking-wide border border-black/[0.04] transition-colors"
            >
              Open Location in Google Maps (Kids Park)
            </a>
          </div>
        </Html>
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* RIGHT PANEL: Guest Mini-Games & Activities (Hinged at X = +1.6)  */}
      {/* ----------------------------------------------------------------- */}
      <group ref={rightHingeRef} position={[1.6, 0, 0]}>
        {/* Physical 3D Cardboard Slab (shifted +1.45 so hinge is on the left) */}
        <mesh position={[1.45, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.9, 4.4, 0.05]} />
          <meshStandardMaterial
            color="#fffef9"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>

        {/* Gold Border Trim */}
        <mesh position={[1.45, 0, 0.027]}>
          <boxGeometry args={[2.82, 4.32, 0.005]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.92}
            roughness={0.2}
          />
        </mesh>

        {/* Content Projection on Right Panel */}
        <Html
          transform
          distanceFactor={3.2}
          position={[1.45, 0, 0.032]}
          className="w-[340px] select-none"
        >
          <div className="bg-[#fffef9]/95 rounded-[26px] p-5 shadow-lg border border-[#b89562]/20 font-sans space-y-3">
            <div className="text-center space-y-0.5">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-black/[0.06] text-[9px] font-semibold text-[#86868b] uppercase tracking-wider shadow-xs">
                <Gamepad2 className="w-2.5 h-2.5 text-[#b89562]" />
                <span>Guest Activities</span>
              </div>
              <h2 className="font-serif text-lg font-bold text-[#1d1d1f]">
                Mini-Games
              </h2>
            </div>

            {/* Game Tabs */}
            <div className="flex gap-1 p-1 bg-[#f5f5f7] rounded-xl border border-black/[0.04]">
              <button
                onClick={() => setActiveGameTab('sparkles')}
                className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                  activeGameTab === 'sparkles'
                    ? 'bg-white text-[#1d1d1f] shadow-xs font-bold'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                Crystals
              </button>
              <button
                onClick={() => setActiveGameTab('sudoku')}
                className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                  activeGameTab === 'sudoku'
                    ? 'bg-white text-[#1d1d1f] shadow-xs font-bold'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                Sudoku
              </button>
              <button
                onClick={() => setActiveGameTab('findJahana')}
                className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                  activeGameTab === 'findJahana'
                    ? 'bg-white text-[#1d1d1f] shadow-xs font-bold'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                Reach Jahana
              </button>
            </div>

            {/* Active Game Container */}
            <div className="max-h-[300px] overflow-y-auto rounded-xl p-1">
              {activeGameTab === 'sparkles' && <SparkleCollectorGame />}
              {activeGameTab === 'sudoku' && <SudokuGame />}
              {activeGameTab === 'findJahana' && <FindJahanaGame />}
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Smooth Camera Director for Panel Focusing & Studio Angles
// ---------------------------------------------------------------------------
function CameraDirector({ isOpen, activePanel, isOrbitFree }) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (isOrbitFree) return; // OrbitControls manage view when freely spinning

    let targetCamPos = [0, 3.8, 6.2];
    let targetLookAt = [0, 0, 0];

    if (isOpen) {
      if (activePanel === 'left') {
        // Focus on Venue & Schedule
        targetCamPos = [-2.4, 1.6, 4.8];
        targetLookAt = [-2.4, 1.6, 0.4];
      } else if (activePanel === 'right') {
        // Focus on Activities & Games
        targetCamPos = [2.4, 1.6, 4.8];
        targetLookAt = [2.4, 1.6, 0.4];
      } else if (activePanel === 'center') {
        // Focus on Royal Invitation (Center)
        targetCamPos = [0, 1.6, 4.6];
        targetLookAt = [0, 1.6, 0.4];
      } else {
        // Overview of entire triptych
        targetCamPos = [0, 1.7, 7.2];
        targetLookAt = [0, 1.5, 0.3];
      }
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamPos[0], delta * 3);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamPos[1], delta * 3);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamPos[2], delta * 3);

    // Smoothly interpolate lookAt
    camera.lookAt(targetLookAt[0], targetLookAt[1], targetLookAt[2]);
  });

  return null;
}

// ---------------------------------------------------------------------------
// 5. Complete 3D Luxury Box Experience Component
// ---------------------------------------------------------------------------
export default function LuxuryFolioScene({
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
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('overview'); // 'overview' | 'left' | 'center' | 'right'
  const [isOrbitFree, setIsOrbitFree] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#fbfbfd] via-[#f7f4ee] to-[#ece5da]">
      {/* 3D WebGL Canvas Viewport */}
      <Canvas
        camera={{ position: [0, 3.8, 6.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        className="w-full h-full block"
      >
        {/* Luxury Studio Ambient Lighting */}
        <ambientLight color="#fffcf5" intensity={0.9} />

        {/* Warm Golden Key Light */}
        <directionalLight
          position={[6, 9, 7]}
          intensity={2.2}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Champagne Fill Rim Light */}
        <pointLight
          position={[-6, 4, 3]}
          intensity={1.5}
          color="#dfb879"
          distance={15}
        />

        {/* Under-glow Fill */}
        <pointLight
          position={[0, -2, 4]}
          intensity={0.8}
          color="#ffe7ba"
          distance={10}
        />

        {/* Floating Ambient Sparkles in 3D Space */}
        <Sparkles
          count={100}
          scale={[10, 8, 8]}
          size={3.2}
          speed={0.4}
          color="#f4d375"
          opacity={0.8}
        />

        {/* 3D Luxury Presentation Box */}
        <LuxuryBox isOpen={isOpen} onOpen={() => setIsOpen(true)} />

        {/* 3D Unfolding Folio Card (Hero, Venue, Games) */}
        <UnfoldingFolio
          isOpen={isOpen}
          activePanel={activePanel}
          namesRef={namesRef}
          handlePointerDown={handlePointerDown}
          handlePointerMove={handlePointerMove}
          handlePointerUp={handlePointerUp}
          handleAmpersandClick={handleAmpersandClick}
          handleAddToCalendar={handleAddToCalendar}
          handleShare={handleShare}
          venueGoogleMapsUrl={venueGoogleMapsUrl}
          activeGameTab={activeGameTab}
          setActiveGameTab={setActiveGameTab}
        />

        {/* Realistic Contact Shadow on Ground */}
        <ContactShadows
          position={[0, -0.41, 0]}
          opacity={0.5}
          scale={14}
          blur={2.4}
          far={6}
          color="#1e160e"
        />

        {/* Dynamic Camera Director */}
        <CameraDirector
          isOpen={isOpen}
          activePanel={activePanel}
          isOrbitFree={isOrbitFree}
        />

        {/* Free Orbit Controls (Enabled when requested) */}
        {isOrbitFree && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={2.5}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />
        )}
      </Canvas>

      {/* Floating HUD Controls */}
      <div className="absolute top-5 left-5 z-40 flex items-center gap-2">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-[#1d1d1f] shadow-md border border-[#b89562]/30 hover:bg-white flex items-center gap-2 transition-all active:scale-95"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-[#b89562] animate-spin" />
            <span>Open Invitation Box</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-md p-1.5 rounded-full border border-black/[0.08] shadow-md">
            <button
              onClick={() => setActivePanel('left')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                activePanel === 'left' ? 'bg-[#1d1d1f] text-white shadow-xs' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              Venue
            </button>
            <button
              onClick={() => setActivePanel('center')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                activePanel === 'center' ? 'bg-[#1d1d1f] text-white shadow-xs' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              Invitation
            </button>
            <button
              onClick={() => setActivePanel('right')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                activePanel === 'right' ? 'bg-[#1d1d1f] text-white shadow-xs' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              Games
            </button>
            <button
              onClick={() => setActivePanel('overview')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                activePanel === 'overview' ? 'bg-[#b89562] text-white shadow-xs' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              All 3
            </button>
          </div>
        )}
      </div>

      {/* Re-fold Box & Free Orbit View Buttons at Top-Right */}
      <div className="absolute top-5 right-16 z-40 flex items-center gap-2">
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-[11px] font-semibold text-[#6e6e73] hover:text-[#1d1d1f] border border-black/[0.06] shadow-xs flex items-center gap-1.5 transition-all"
            title="Close and Re-seal Box"
          >
            <RotateCcw className="w-3 h-3 text-[#b89562]" />
            <span>Re-fold</span>
          </button>
        )}

        <button
          onClick={() => setIsOrbitFree(!isOrbitFree)}
          className={`px-3.5 py-1.5 rounded-full backdrop-blur-md text-[11px] font-semibold border transition-all flex items-center gap-1.5 ${
            isOrbitFree
              ? 'bg-[#1d1d1f] text-white border-black shadow-md'
              : 'bg-white/80 hover:bg-white text-[#1d1d1f] border-black/[0.06] shadow-xs'
          }`}
          title="Toggle Free 360 Orbit"
        >
          <Box className={`w-3 h-3 ${isOrbitFree ? 'text-[#e5c158]' : 'text-[#b89562]'}`} />
          <span>{isOrbitFree ? 'Exit Orbit' : 'Free 3D Orbit'}</span>
        </button>
      </div>

      {/* Instructions pill at bottom */}
      <div className="absolute bottom-4 inset-x-0 mx-auto w-max z-30 pointer-events-none">
        <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 text-[10px] tracking-wide font-mono flex items-center gap-2 shadow-lg">
          <Eye className="w-3 h-3 text-[#e5c158]" />
          <span>
            {isOpen
              ? '✨ Drag to rotate 3D Folio • Tap panels to inspect'
              : '🎁 Click the golden royal seal to open the invitation'}
          </span>
        </div>
      </div>
    </div>
  );
}
