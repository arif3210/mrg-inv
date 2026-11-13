import React, { useEffect, useRef, useState } from 'react';
import { X, RotateCcw, Heart } from 'lucide-react';

export default function LimboEasterEgg({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioCtxRef = useRef(null);
  const [showFinaleUI, setShowFinaleUI] = useState(false);
  const [startTime, setStartTime] = useState(() => Date.now());

  // Web Audio Synthesizer for High-Speed Combat & Limbo Environment
  const playSound = useRef({
    step: () => {
      try {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (e) {}
    },
    dash: () => {
      try {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.21);
      } catch (e) {}
    },
    whoosh: (pitch = 500) => {
      try {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(pitch * 2.2, ctx.currentTime + 0.08);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.21);
      } catch (e) {}
    },
    hit: () => {
      try {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        // Punch impact (heavy martial arts impact crack)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.45, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } catch (e) {}
    },
    roseReveal: () => {
      try {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.09);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.7);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.09);
          osc.stop(ctx.currentTime + i * 0.09 + 0.75);
        });
      } catch (e) {}
    },
    tomJerryPop: () => {
      try {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.18);
        osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.32);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.42);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.44);

        [0.32, 0.52].forEach((delay) => {
          const hOsc = ctx.createOscillator();
          const hGain = ctx.createGain();
          hOsc.type = 'sine';
          hOsc.frequency.setValueAtTime(80, ctx.currentTime + delay);
          hOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + delay + 0.16);
          hGain.gain.setValueAtTime(0.45, ctx.currentTime + delay);
          hGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.17);
          hOsc.connect(hGain);
          hGain.connect(ctx.destination);
          hOsc.start(ctx.currentTime + delay);
          hOsc.stop(ctx.currentTime + delay + 0.18);
        });
      } catch (e) {}
    },
  }).current;

  // Audio Context management
  useEffect(() => {
    if (isOpen) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [isOpen]);

  const restartAnimation = () => {
    setStartTime(Date.now());
    setShowFinaleUI(false);
  };

  useEffect(() => {
    if (!isOpen) return;

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

    const audioFired = {
      dash1: false,
      climb1: false,
      kick1: false,
      hit1: false,
      dash2: false,
      airKick: false,
      hit2: false,
      rose: false,
      pop: false,
    };

    // Parallax background layers
    const mistParticles = Array.from({ length: 45 }, () => ({
      x: Math.random() * 4000,
      y: height - Math.random() * 260,
      radius: Math.random() * 90 + 50,
      vx: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.14 + 0.05,
    }));

    // Motion blur afterimage history for Arif
    const afterimages = [];
    const impactSparks = [];

    // Helper: Draw Polygon Limb (Solid Athletic Silhouette, Not Stickman)
    const drawSolidLimb = (x1, y1, x2, y2, w1, w2) => {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const perp = angle + Math.PI / 2;

      const p1x = x1 + Math.cos(perp) * (w1 / 2);
      const p1y = y1 + Math.sin(perp) * (w1 / 2);
      const p2x = x1 - Math.cos(perp) * (w1 / 2);
      const p2y = y1 - Math.sin(perp) * (w1 / 2);
      const p3x = x2 - Math.cos(perp) * (w2 / 2);
      const p3y = y2 - Math.sin(perp) * (w2 / 2);
      const p4x = x2 + Math.cos(perp) * (w2 / 2);
      const p4y = y2 + Math.sin(perp) * (w2 / 2);

      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.lineTo(p3x, p3y);
      ctx.lineTo(p4x, p4y);
      ctx.closePath();
      ctx.fill();

      // Rounded joint caps
      ctx.beginPath();
      ctx.arc(x1, y1, w1 / 2, 0, Math.PI * 2);
      ctx.arc(x2, y2, w2 / 2, 0, Math.PI * 2);
      ctx.fill();
    };

    // Realistic Anatomical Shadow Silhouette Fighter (Limbo / Shadow Fight style)
    const drawShadowMartialArtist = (x, y, scale, pose, isHero = false, facingRight = true, alpha = 1) => {
      ctx.save();
      ctx.translate(x, y);
      if (!facingRight) ctx.scale(-1, 1);
      ctx.globalAlpha = alpha;

      const s = scale;
      ctx.fillStyle = '#08090c'; // Solid deep shadow silhouette

      // Head & Sleek Ninja/Martial arts hair silhouette
      ctx.beginPath();
      ctx.ellipse(0, -56 * s, 8.5 * s, 10 * s, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Martial Arts Headband / Scarf tails fluttering in the wind
      if (isHero) {
        ctx.beginPath();
        const scarfWiggle = Math.sin(Date.now() * 0.018) * 4 * s;
        ctx.moveTo(-6 * s, -56 * s);
        ctx.quadraticCurveTo(-22 * s, -58 * s + scarfWiggle, -38 * s, -54 * s + scarfWiggle * 2);
        ctx.lineTo(-34 * s, -51 * s + scarfWiggle * 2);
        ctx.quadraticCurveTo(-18 * s, -53 * s + scarfWiggle, -6 * s, -52 * s);
        ctx.closePath();
        ctx.fill();

        // Glowing white Limbo eyes
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 9;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(4 * s, -57 * s, 2.2 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#08090c';
      }

      // Torso: Athletic V-Tapered Chest & Waist
      ctx.beginPath();
      ctx.moveTo(-11 * s, -46 * s); // Left shoulder
      ctx.lineTo(11 * s, -46 * s);  // Right shoulder
      ctx.lineTo(6 * s, -18 * s);   // Right waist
      ctx.lineTo(-6 * s, -18 * s);  // Left waist
      ctx.closePath();
      ctx.fill();

      // Billowing martial arts jacket tail / coat
      ctx.beginPath();
      const coatWiggle = Math.sin(Date.now() * 0.015) * 5 * s;
      ctx.moveTo(-6 * s, -20 * s);
      ctx.lineTo(6 * s, -20 * s);
      ctx.lineTo(10 * s + coatWiggle * 0.5, -4 * s);
      ctx.lineTo(-14 * s - coatWiggle, -2 * s);
      ctx.closePath();
      ctx.fill();

      // Muscular Arms (Solid anatomical polygons)
      // Front Arm
      drawSolidLimb(0, -42 * s, pose.elbow1X * s, pose.elbow1Y * s, 7.5 * s, 6.0 * s);
      drawSolidLimb(pose.elbow1X * s, pose.elbow1Y * s, pose.hand1X * s, pose.hand1Y * s, 6.0 * s, 5.0 * s);

      // Back Arm
      drawSolidLimb(0, -42 * s, pose.elbow2X * s, pose.elbow2Y * s, 7.0 * s, 5.5 * s);
      drawSolidLimb(pose.elbow2X * s, pose.elbow2Y * s, pose.hand2X * s, pose.hand2Y * s, 5.5 * s, 4.5 * s);

      // Athletic Legs (Thigh & Calf polygons)
      // Leg 1
      drawSolidLimb(0, -18 * s, pose.knee1X * s, pose.knee1Y * s, 9.5 * s, 7.5 * s);
      drawSolidLimb(pose.knee1X * s, pose.knee1Y * s, pose.foot1X * s, pose.foot1Y * s, 7.5 * s, 6.0 * s);

      // Leg 2
      drawSolidLimb(0, -18 * s, pose.knee2X * s, pose.knee2Y * s, 9.5 * s, 7.5 * s);
      drawSolidLimb(pose.knee2X * s, pose.knee2Y * s, pose.foot2X * s, pose.foot2Y * s, 7.5 * s, 6.0 * s);

      ctx.restore();
    };

    // Realistic Jahana Silhouette (Royal Wedding Gown & Flowing Veil)
    const drawJahanaSilhouette = (x, y, scale) => {
      ctx.save();
      ctx.translate(x, y);
      const s = scale;

      ctx.fillStyle = '#060709';

      // Head
      ctx.beginPath();
      ctx.arc(0, -58 * s, 8.5 * s, 0, Math.PI * 2);
      ctx.fill();

      // Flowing Ethereal Wedding Veil
      ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.moveTo(-4 * s, -60 * s);
      ctx.quadraticCurveTo(-26 * s, -35 * s, -22 * s, 12 * s);
      ctx.lineTo(-8 * s, 10 * s);
      ctx.quadraticCurveTo(-14 * s, -25 * s, 0, -52 * s);
      ctx.fill();

      // Elegant Royal Wedding Gown Silhouette
      ctx.fillStyle = '#060709';
      ctx.beginPath();
      ctx.moveTo(-8 * s, -48 * s);
      ctx.lineTo(8 * s, -48 * s);
      ctx.lineTo(6 * s, -24 * s);
      ctx.lineTo(24 * s, 8 * s);  // Flared royal dress
      ctx.lineTo(-24 * s, 8 * s);
      ctx.lineTo(-6 * s, -24 * s);
      ctx.closePath();
      ctx.fill();

      // Graceful outstretched arms receiving the rose
      drawSolidLimb(0, -44 * s, -10 * s, -28 * s, 5.5 * s, 4.5 * s);
      drawSolidLimb(-10 * s, -28 * s, -18 * s, -24 * s, 4.5 * s, 3.5 * s);

      // Glowing Diamond Tiara
      ctx.fillStyle = '#fef08a';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -65 * s, 2.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    };

    // Red Rose Blooming
    const drawRedRose = (x, y, scale = 1, bloom = 1) => {
      ctx.save();
      ctx.translate(x, y);

      // Stem & Thorn
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(5 * scale, 14 * scale, 2 * scale, 28 * scale);
      ctx.stroke();

      // Leaf
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(6 * scale, 14 * scale, 6 * scale, 3 * scale, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Crimson Blooming Rose
      const r = 11 * scale * bloom;
      ctx.fillStyle = '#dc2626';
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#ef4444';

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.arc(-2 * scale, -2 * scale, r * 0.72, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.arc(1.5 * scale, -1.5 * scale, r * 0.38, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Terrain Elevation Function: Cliffs, Rooftops & Steps
    const baseGroundY = height - 90;
    const getTerrainHeight = (worldX) => {
      // 0 - 500: Ground Valley
      if (worldX < 500) return baseGroundY;
      // 500 - 650: Climbing cliff wall up to terrace
      if (worldX < 650) {
        const t = (worldX - 500) / 150;
        return baseGroundY - t * 85;
      }
      // 650 - 1200: High terrace / cliff top
      if (worldX < 1200) return baseGroundY - 85;
      // 1200 - 1350: Roof jump across
      if (worldX < 1350) return baseGroundY - 110;
      // 1350 - 1900: Elevated pagodas / stone bridges
      if (worldX < 1900) return baseGroundY - 75;
      // 1900 - 2150: Stone steps descending into garden
      if (worldX < 2150) {
        const t = (worldX - 1900) / 250;
        return (baseGroundY - 75) + t * 75;
      }
      // 2150+: Grand Sanctuary Court leading to Jahana
      return baseGroundY;
    };

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      ctx.clearRect(0, 0, width, height);

      // Total journey: 2850 world pixels across 20 seconds
      // Fast, accurate, high-velocity trajectory
      let arifWorldX = 0;
      let arifWorldY = baseGroundY;
      let arifPose = {};
      let isHeroAirborne = false;

      // --------------------------------------------------------------------
      // HIGH-SPEED SCROLLING CHOREOGRAPHY TIMELINE (20+ SECONDS)
      // --------------------------------------------------------------------

      // STAGE 1: HIGH SPEED SPRINT IN FOREST (0s - 4.0s)
      if (elapsed < 4.0) {
        const t = elapsed / 4.0;
        arifWorldX = 80 + t * 450;
        arifWorldY = getTerrainHeight(arifWorldX);

        if (elapsed > 0.5 && !audioFired.dash1) {
          playSound.dash();
          audioFired.dash1 = true;
        }

        // Running cycle with high knee lift (fast ninja sprint)
        const sprintFreq = elapsed * 18;
        const legSwing = Math.sin(sprintFreq);
        if (Math.abs(legSwing) > 0.95 && Math.random() < 0.25) playSound.step();

        arifWorldY -= Math.abs(Math.cos(sprintFreq)) * 8;
        arifPose = {
          elbow1X: legSwing * 18,
          elbow1Y: -32,
          hand1X: legSwing * 32,
          hand1Y: -26,
          elbow2X: -legSwing * 18,
          elbow2Y: -32,
          hand2X: -legSwing * 32,
          hand2Y: -26,
          knee1X: -legSwing * 20,
          knee1Y: -8,
          foot1X: -legSwing * 36,
          foot1Y: 0,
          knee2X: legSwing * 20,
          knee2Y: -8,
          foot2X: legSwing * 36,
          foot2Y: 0,
        };
      }

      // STAGE 2: CLIMBING CLIFF WALL & VAULTING (4.0s - 7.5s)
      else if (elapsed < 7.5) {
        const t = (elapsed - 4.0) / 3.5;
        arifWorldX = 530 + t * 480;

        if (!audioFired.climb1) {
          playSound.whoosh(480);
          audioFired.climb1 = true;
        }

        if (t < 0.35) {
          // Wall run / parkour climbing up vertical cliff
          isHeroAirborne = true;
          const climbT = t / 0.35;
          arifWorldY = baseGroundY - climbT * 95;
          arifPose = {
            elbow1X: 18,
            elbow1Y: -44,
            hand1X: 24,
            hand1Y: -55,
            elbow2X: -12,
            elbow2Y: -30,
            hand2X: -16,
            hand2Y: -38,
            knee1X: 16,
            knee1Y: -16,
            foot1X: 20,
            foot1Y: -4,
            knee2X: -6,
            knee2Y: 10,
            foot2X: -10,
            foot2Y: 20,
          };
        } else {
          // Sprint along terrace
          arifWorldY = getTerrainHeight(arifWorldX);
          const sprintFreq = elapsed * 18;
          const legSwing = Math.sin(sprintFreq);
          arifWorldY -= Math.abs(Math.cos(sprintFreq)) * 7;
          arifPose = {
            elbow1X: legSwing * 18,
            elbow1Y: -32,
            hand1X: legSwing * 32,
            hand1Y: -26,
            elbow2X: -legSwing * 18,
            elbow2Y: -32,
            hand2X: -legSwing * 32,
            hand2Y: -26,
            knee1X: -legSwing * 20,
            knee1Y: -8,
            foot1X: -legSwing * 36,
            foot1Y: 0,
            knee2X: legSwing * 20,
            knee2Y: -8,
            foot2X: legSwing * 36,
            foot2Y: 0,
          };
        }
      }

      // STAGE 3: DUEL WITH VILLAIN 1 ON TERRACE - FLYING DRAGON KICK (7.5s - 11.5s)
      else if (elapsed < 11.5) {
        const t = (elapsed - 7.5) / 4.0;
        arifWorldX = 1010 + t * 440;
        const groundH = getTerrainHeight(arifWorldX);

        if (t < 0.45) {
          // Slide & jump attack
          if (!audioFired.kick1 && t > 0.25) {
            playSound.whoosh(650);
            audioFired.kick1 = true;
          }
          isHeroAirborne = true;
          const jumpArc = Math.sin((t / 0.45) * Math.PI) * 55;
          arifWorldY = groundH - jumpArc - 20;

          // Flying Kung Fu Kick Pose
          arifPose = {
            elbow1X: -16,
            elbow1Y: -46,
            hand1X: -26,
            hand1Y: -50,
            elbow2X: 14,
            elbow2Y: -34,
            hand2X: 22,
            hand2Y: -30,
            knee1X: 24,
            knee1Y: -24,
            foot1X: 46,
            foot1Y: -24, // High-speed kick extension!
            knee2X: -12,
            knee2Y: 4,
            foot2X: -18,
            foot2Y: 12,
          };

          if (!audioFired.hit1 && t > 0.38) {
            playSound.hit();
            audioFired.hit1 = true;
            for (let s = 0; s < 25; s++) {
              impactSparks.push({
                x: arifWorldX + 45,
                y: arifWorldY - 20,
                vx: (Math.random() + 0.3) * 9,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
              });
            }
          }
        } else {
          // Fast landing dash across bridge
          isHeroAirborne = false;
          arifWorldY = groundH;
          const sprintFreq = elapsed * 18;
          const legSwing = Math.sin(sprintFreq);
          arifPose = {
            elbow1X: legSwing * 18,
            elbow1Y: -32,
            hand1X: legSwing * 32,
            hand1Y: -26,
            elbow2X: -legSwing * 18,
            elbow2Y: -32,
            hand2X: -legSwing * 32,
            hand2Y: -26,
            knee1X: -legSwing * 20,
            knee1Y: -8,
            foot1X: -legSwing * 36,
            foot1Y: 0,
            knee2X: legSwing * 20,
            knee2Y: -8,
            foot2X: legSwing * 36,
            foot2Y: 0,
          };
        }
      }

      // STAGE 4: AMBUSH DUEL & AERIAL TAKEDOWN (11.5s - 15.5s)
      else if (elapsed < 15.5) {
        const t = (elapsed - 11.5) / 4.0;
        arifWorldX = 1450 + t * 500;
        const groundH = getTerrainHeight(arifWorldX);

        if (t < 0.4) {
          // Aerial Double Strike
          if (!audioFired.airKick && t > 0.15) {
            playSound.whoosh(750);
            audioFired.airKick = true;
          }
          isHeroAirborne = true;
          const jumpArc = Math.sin((t / 0.4) * Math.PI) * 70;
          arifWorldY = groundH - jumpArc - 25;

          // Aerial split kick
          arifPose = {
            elbow1X: -20,
            elbow1Y: -48,
            hand1X: -30,
            hand1Y: -54,
            elbow2X: 20,
            elbow2Y: -48,
            hand2X: 30,
            hand2Y: -54,
            knee1X: 25,
            knee1Y: -26,
            foot1X: 48,
            foot1Y: -22,
            knee2X: -25,
            knee2Y: -26,
            foot2X: -48,
            foot2Y: -22,
          };

          if (!audioFired.hit2 && t > 0.28) {
            playSound.hit();
            audioFired.hit2 = true;
            for (let s = 0; s < 30; s++) {
              impactSparks.push({
                x: arifWorldX + 35,
                y: arifWorldY - 20,
                vx: (Math.random() - 0.4) * 9,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
              });
            }
          }
        } else {
          // Landing & speeding down stone steps
          isHeroAirborne = false;
          arifWorldY = groundH;
          const sprintFreq = elapsed * 18;
          const legSwing = Math.sin(sprintFreq);
          arifPose = {
            elbow1X: legSwing * 18,
            elbow1Y: -32,
            hand1X: legSwing * 32,
            hand1Y: -26,
            elbow2X: -legSwing * 18,
            elbow2Y: -32,
            hand2X: -legSwing * 32,
            hand2Y: -26,
            knee1X: -legSwing * 20,
            knee1Y: -8,
            foot1X: -legSwing * 36,
            foot1Y: 0,
            knee2X: legSwing * 20,
            knee2Y: -8,
            foot2X: legSwing * 36,
            foot2Y: 0,
          };
        }
      }

      // STAGE 5: SPRINTING INTO THE SANCTUARY (15.5s - 18.0s)
      else if (elapsed < 18.0) {
        // Slowing down to a dignified noble walk towards Jahana
        const t = (elapsed - 15.5) / 2.5;
        arifWorldX = 1950 + t * 700;
        arifWorldY = baseGroundY;

        const walkFreq = elapsed * 7;
        const legSwing = Math.sin(walkFreq);
        if (Math.abs(legSwing) > 0.95 && Math.random() < 0.2) playSound.step();

        arifPose = {
          elbow1X: legSwing * 8,
          elbow1Y: -30,
          hand1X: legSwing * 16,
          hand1Y: -22,
          elbow2X: -legSwing * 8,
          elbow2Y: -30,
          hand2X: -legSwing * 16,
          hand2Y: -22,
          knee1X: -legSwing * 12,
          knee1Y: -8,
          foot1X: -legSwing * 20,
          foot1Y: 0,
          knee2X: legSwing * 12,
          knee2Y: -8,
          foot2X: legSwing * 20,
          foot2Y: 0,
        };
      }

      // STAGE 6: REACHING JAHANA & PRESENTING THE RED ROSE (18.0s - 22s)
      else {
        arifWorldX = 2690;
        arifWorldY = baseGroundY;

        if (!audioFired.rose) {
          playSound.roseReveal();
          audioFired.rose = true;
        }

        // Noble gentleman pose extending the red rose
        arifPose = {
          elbow1X: 14,
          elbow1Y: -32,
          hand1X: 24,
          hand1Y: -28, // Hand extending rose
          elbow2X: -8,
          elbow2Y: -28,
          hand2X: -14,
          hand2Y: -20,
          knee1X: 10,
          knee1Y: -8,
          foot1X: 14,
          foot1Y: 0,
          knee2X: -10,
          knee2Y: -8,
          foot2X: -16,
          foot2Y: 0,
        };
      }

      // --------------------------------------------------------------------
      // DYNAMIC SMOOTH SCROLLING CAMERA (Tracks Arif across the vast world)
      // --------------------------------------------------------------------
      // Camera centers on Arif, so Jahana (at x=2750) is completely out of frame initially!
      const targetCamX = Math.max(0, arifWorldX - width * 0.32);
      const camX = targetCamX;

      ctx.save();
      ctx.translate(-camX, 0);

      // PARALLAX BACKGROUND 1: Sky & Moonlight
      const skyGrad = ctx.createLinearGradient(camX, 0, camX, height);
      skyGrad.addColorStop(0, '#040507');
      skyGrad.addColorStop(0.65, '#0b0f16');
      skyGrad.addColorStop(1, '#020305');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(camX, 0, width, height);

      // Celestial Moon over Sanctuary (Far on the right)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(2800, height * 0.28, 120, 0, Math.PI * 2);
      ctx.fill();

      // PARALLAX BACKGROUND 2: Distant Mountains (Moves at 0.3x)
      ctx.fillStyle = '#06080d';
      ctx.beginPath();
      ctx.moveTo(camX * 0.3 - 200, height);
      for (let mx = -200; mx < 4500; mx += 300) {
        ctx.lineTo(mx, baseGroundY - 140 - Math.sin(mx * 0.005) * 60);
      }
      ctx.lineTo(4500, height);
      ctx.fill();

      // PARALLAX BACKGROUND 3: Midground Ancient Pagodas & Gnarled Trees (0.7x)
      ctx.fillStyle = '#05070a';
      for (let px = 200; px < 3500; px += 380) {
        // Draw gnarled shadow tree
        ctx.beginPath();
        ctx.moveTo(px, baseGroundY - 40);
        ctx.lineTo(px + 8, baseGroundY - 150);
        ctx.lineTo(px + 30, baseGroundY - 180);
        ctx.lineTo(px + 12, baseGroundY - 150);
        ctx.lineTo(px - 20, baseGroundY - 170);
        ctx.lineTo(px, baseGroundY - 150);
        ctx.lineTo(px + 16, baseGroundY - 40);
        ctx.fill();
      }

      // MIST PARTICLES
      mistParticles.forEach((m) => {
        m.x += m.vx;
        ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // FOREGROUND TERRAIN (Cliffs, Wall Barriers, Terraces, Stairs & Bridge)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(-100, height);
      for (let tx = -100; tx <= 3300; tx += 20) {
        ctx.lineTo(tx, getTerrainHeight(tx));
      }
      ctx.lineTo(3300, height);
      ctx.closePath();
      ctx.fill();

      // Obstacle Structures (Cliff Wall, Terraces, Rooftop Spikes, Hanging Lanterns)
      // Cliff wall barrier at 500-650
      ctx.fillStyle = '#07080a';
      ctx.fillRect(520, baseGroundY - 85, 30, 85);

      // Terrace Pagoda Pillars at 1200-1350
      ctx.fillRect(1220, baseGroundY - 140, 24, 140);
      ctx.fillRect(1330, baseGroundY - 140, 24, 140);
      // Pagoda roof
      ctx.beginPath();
      ctx.moveTo(1190, baseGroundY - 140);
      ctx.lineTo(1287, baseGroundY - 175);
      ctx.lineTo(1380, baseGroundY - 140);
      ctx.fill();

      // Grand Sanctuary Archway over Jahana at 2750
      ctx.fillStyle = '#0a0c10';
      ctx.fillRect(2640, baseGroundY - 160, 22, 160);
      ctx.fillRect(2850, baseGroundY - 160, 22, 160);
      // Floral dome arch
      ctx.beginPath();
      ctx.moveTo(2620, baseGroundY - 160);
      ctx.quadraticCurveTo(2745, baseGroundY - 220, 2870, baseGroundY - 160);
      ctx.lineTo(2850, baseGroundY - 145);
      ctx.quadraticCurveTo(2745, baseGroundY - 200, 2640, baseGroundY - 145);
      ctx.fill();

      // Warm glowing lanterns on sanctuary arch
      [2650, 2840].forEach((lx) => {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
        ctx.beginPath();
        ctx.arc(lx, baseGroundY - 140, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(lx, baseGroundY - 140, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // --------------------------------------------------------------------
      // DRAW CHARACTERS
      // --------------------------------------------------------------------

      // Motion Blur Afterimage Trails for Arif when sprinting or executing flying kicks
      if (elapsed < 18.0) {
        afterimages.push({
          x: arifWorldX,
          y: arifWorldY,
          pose: { ...arifPose },
          time: Date.now(),
        });
      }

      // Render 2 fading shadow afterimages
      const now = Date.now();
      for (let a = afterimages.length - 1; a >= 0; a--) {
        const ghost = afterimages[a];
        const age = now - ghost.time;
        if (age > 160) {
          afterimages.splice(a, 1);
        } else {
          const alpha = (1 - age / 160) * 0.25;
          drawShadowMartialArtist(ghost.x, ghost.y, 1.05, ghost.pose, true, true, alpha);
        }
      }

      // Draw Main Arif Shadow Figure
      drawShadowMartialArtist(arifWorldX, arifWorldY, 1.08, arifPose, true, true, 1.0);

      // Draw Jahana (At x=2750 in the Sanctuary)
      drawJahanaSilhouette(2750, baseGroundY, 1.08);

      // Draw Blooming Red Rose between them
      if (elapsed >= 18.0) {
        const roseBloom = Math.min(1, (elapsed - 18.0) / 1.5);
        drawRedRose(arifWorldX + 24, baseGroundY - 26, 1.15, roseBloom);
      }

      // Draw Defeated Villains (Physics reactions)
      // Villain 1 (On terrace at 1100)
      if (elapsed > 7.0 && elapsed < 11.5) {
        const v1T = elapsed - 8.5;
        if (v1T > 0) {
          // Being launched flying through the air
          const v1X = 1200 + v1T * 180;
          const v1Y = baseGroundY - 85 - Math.sin(v1T * 1.8) * 80 + v1T * 40;
          drawShadowMartialArtist(v1X, v1Y, 0.95, {
            elbow1X: 16,
            elbow1Y: -38,
            hand1X: 24,
            hand1Y: -44,
            elbow2X: 10,
            elbow2Y: -28,
            hand2X: 16,
            hand2Y: -22,
            knee1X: 12,
            knee1Y: 8,
            foot1X: 20,
            foot1Y: 18,
            knee2X: 6,
            knee2Y: 6,
            foot2X: 12,
            foot2Y: 14,
          }, false, false);
        } else {
          drawShadowMartialArtist(1200, baseGroundY - 85, 1.0, {
            elbow1X: -16,
            elbow1Y: -34,
            hand1X: -26,
            hand1Y: -30,
            elbow2X: 10,
            elbow2Y: -28,
            hand2X: 18,
            hand2Y: -24,
            knee1X: -12,
            knee1Y: -4,
            foot1X: -18,
            foot1Y: 0,
            knee2X: 10,
            knee2Y: -4,
            foot2X: 16,
            foot2Y: 0,
          }, false, false);
        }
      }

      // Villain 2 (At 1680)
      if (elapsed > 11.0 && elapsed < 15.5) {
        const v2T = elapsed - 12.5;
        if (v2T > 0) {
          const v2X = 1680 + v2T * 190;
          const v2Y = baseGroundY - 75 - Math.sin(v2T * 1.8) * 70 + v2T * 35;
          drawShadowMartialArtist(v2X, v2Y, 0.95, {
            elbow1X: 14,
            elbow1Y: -40,
            hand1X: 22,
            hand1Y: -45,
            elbow2X: 8,
            elbow2Y: -30,
            hand2X: 14,
            hand2Y: -25,
            knee1X: 10,
            knee1Y: 10,
            foot1X: 18,
            foot1Y: 20,
            knee2X: 4,
            knee2Y: 6,
            foot2X: 8,
            foot2Y: 15,
          }, false, false);
        } else {
          drawShadowMartialArtist(1680, baseGroundY - 75, 1.0, {
            elbow1X: -16,
            elbow1Y: -34,
            hand1X: -26,
            hand1Y: -30,
            elbow2X: 10,
            elbow2Y: -28,
            hand2X: 18,
            hand2Y: -24,
            knee1X: -12,
            knee1Y: -4,
            foot1X: -18,
            foot1Y: 0,
            knee2X: 10,
            knee2Y: -4,
            foot2X: 16,
            foot2Y: 0,
          }, false, false);
        }
      }

      // Combat impact sparks
      for (let s = impactSparks.length - 1; s >= 0; s--) {
        const sp = impactSparks[s];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life--;
        ctx.fillStyle = `rgba(255, 235, 150, ${sp.life / 30})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        if (sp.life <= 0) impactSparks.splice(s, 1);
      }

      // --------------------------------------------------------------------
      // TOM & JERRY CARTOON POPPING HEART (At 20+ Seconds)
      // --------------------------------------------------------------------
      if (elapsed >= 20.0) {
        if (!audioFired.pop) {
          playSound.tomJerryPop();
          audioFired.pop = true;
          setShowFinaleUI(true);
        }

        const heartElapsed = elapsed - 20.0;
        let heartScale = 1.0;
        if (heartElapsed < 0.25) {
          heartScale = (heartElapsed / 0.25) * 1.5;
        } else if (heartElapsed < 0.45) {
          heartScale = 1.5 - ((heartElapsed - 0.25) / 0.2) * 0.6; // 0.9
        } else if (heartElapsed < 0.65) {
          heartScale = 0.9 + ((heartElapsed - 0.45) / 0.2) * 0.25; // 1.15
        } else if (heartElapsed < 0.85) {
          heartScale = 1.15 - ((heartElapsed - 0.65) / 0.2) * 0.15; // 1.0
        } else {
          heartScale = 1.0 + Math.sin(heartElapsed * 6) * 0.08;
        }

        const hX = (arifWorldX + 2750) / 2;
        const hY = baseGroundY - 110;

        ctx.save();
        ctx.translate(hX, hY);
        ctx.scale(heartScale, heartScale);

        ctx.fillStyle = '#ef4444';
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#dc2626';

        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.bezierCurveTo(-26, -20, -44, -52, -18, -65);
        ctx.bezierCurveTo(-6, -70, 0, -54, 0, -48);
        ctx.bezierCurveTo(0, -54, 6, -70, 18, -65);
        ctx.bezierCurveTo(44, -52, 26, -20, 0, 10);
        ctx.closePath();
        ctx.fill();

        // Cartoon specular shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(-12, -48, 6, 12, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      ctx.restore(); // Restore camera translation

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, startTime]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden animate-fade-in-up select-none">
      {/* 60FPS Limbo Scrolling Camera Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all shadow-lg active:scale-95"
        aria-label="Close Easter Egg"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Secret Badge in corner */}
      <div className="absolute top-6 left-6 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-mono backdrop-blur-sm pointer-events-none">
        <span>⚔️ The Journey: Conquering the Shadows</span>
      </div>

      {/* Finale Congratulatory Card after Rose & Heart */}
      {showFinaleUI && (
        <div className="absolute bottom-8 inset-x-4 max-w-sm mx-auto text-center z-40 bg-black/75 backdrop-blur-md p-5 rounded-3xl border border-white/15 text-white animate-fade-in-up shadow-2xl">
          <div className="flex items-center justify-center gap-1.5 text-red-500 mb-1">
            <Heart className="w-5 h-5 fill-current animate-pulse" />
            <span className="font-serif text-lg font-bold text-white tracking-wide">
              Arif & Jahana
            </span>
            <Heart className="w-5 h-5 fill-current animate-pulse" />
          </div>

          <p className="text-xs text-white/70 italic mb-4 leading-relaxed">
            "A journey through shadows, obstacles, and trials — overcome with love, strength, and unwavering devotion."
          </p>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={restartAnimation}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-all text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-all"
            >
              Return to Site
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
