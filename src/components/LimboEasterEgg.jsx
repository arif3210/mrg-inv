import React, { useEffect, useRef, useState } from 'react';
import { X, RotateCcw, Heart } from 'lucide-react';

export default function LimboEasterEgg({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioCtxRef = useRef(null);
  const [showFinaleUI, setShowFinaleUI] = useState(false);
  const [startTime, setStartTime] = useState(() => Date.now());

  // Web Audio Synthesizer: Martial arts vocals, combat hits, and cartoon heart pop
  const audioFx = useRef({
    // Synthesized Martial Arts Voice Shouts (Formant Vocal tract synthesis)
    kungFuVoice: (type = 'hya') => {
      try {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const f1 = ctx.createBiquadFilter();
        const f2 = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';

        if (type === 'hup') {
          // Quick athletic jump grunt: "Hup!"
          osc.frequency.setValueAtTime(190, now);
          osc.frequency.exponentialRampToValueAtTime(270, now + 0.06);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);

          f1.type = 'bandpass';
          f1.frequency.setValueAtTime(450, now);
          f1.Q.setValueAtTime(3.5, now);

          f2.type = 'bandpass';
          f2.frequency.setValueAtTime(850, now);
          f2.Q.setValueAtTime(4.0, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          osc.connect(f1);
          f1.connect(f2);
          f2.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.16);
        } else if (type === 'watah') {
          // Classic martial arts kick shout: "Wa-tah!"
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
          osc.frequency.exponentialRampToValueAtTime(210, now + 0.28);

          f1.type = 'bandpass';
          f1.frequency.setValueAtTime(750, now);
          f1.Q.setValueAtTime(4.0, now);

          f2.type = 'bandpass';
          f2.frequency.setValueAtTime(1350, now);
          f2.Q.setValueAtTime(4.5, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.24, now + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

          osc.connect(f1);
          f1.connect(f2);
          f2.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.31);
        } else if (type === 'ha') {
          // Sharp punch grunt: "Ha!"
          osc.frequency.setValueAtTime(240, now);
          osc.frequency.exponentialRampToValueAtTime(160, now + 0.14);

          f1.type = 'bandpass';
          f1.frequency.setValueAtTime(680, now);
          f1.Q.setValueAtTime(3.5, now);

          f2.type = 'bandpass';
          f2.frequency.setValueAtTime(1150, now);
          f2.Q.setValueAtTime(4.0, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          osc.connect(f1);
          f1.connect(f2);
          f2.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.16);
        } else {
          // Flying Dragon Kick shout: "Hyaa!"
          osc.frequency.setValueAtTime(340, now);
          osc.frequency.exponentialRampToValueAtTime(420, now + 0.05);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.26);

          f1.type = 'bandpass';
          f1.frequency.setValueAtTime(800, now);
          f1.Q.setValueAtTime(3.8, now);

          f2.type = 'bandpass';
          f2.frequency.setValueAtTime(1400, now);
          f2.Q.setValueAtTime(4.2, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.22, now + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

          osc.connect(f1);
          f1.connect(f2);
          f2.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.29);
        }
      } catch (e) {}
    },

    step: () => {
      try {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.045);
      } catch (e) {}
    },
    dash: () => {
      try {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.17);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } catch (e) {}
    },
    whoosh: (pitch = 450) => {
      try {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(pitch * 2, ctx.currentTime + 0.08);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.14, ctx.currentTime);
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
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.13);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch (e) {}
    },
    roseReveal: () => {
      try {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.09);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.09);
          osc.stop(ctx.currentTime + i * 0.09 + 0.65);
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
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.18);
        osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.32);
        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.42);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.44);

        [0.32, 0.52].forEach((delay) => {
          const hOsc = ctx.createOscillator();
          const hGain = ctx.createGain();
          hOsc.type = 'sine';
          hOsc.frequency.setValueAtTime(75, ctx.currentTime + delay);
          hOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + delay + 0.16);
          hGain.gain.setValueAtTime(0.28, ctx.currentTime + delay);
          hGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.17);
          hOsc.connect(hGain);
          hGain.connect(ctx.destination);
          hOsc.start(ctx.currentTime + delay);
          hOsc.stop(ctx.currentTime + delay + 0.18);
        });
      } catch (e) {}
    },
  }).current;

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
      voiceSlide1: false,
      hit1: false,
      voiceClimb1: false,
      voiceKick2: false,
      hit2: false,
      voiceClash3: false,
      hit3: false,
      voiceDualKick: false,
      hit4: false,
      rose: false,
      pop: false,
    };

    // Soft Bokeh Circles drifting in the atmospheric background (Low Brightness)
    const bokehOrbs = Array.from({ length: 48 }, () => ({
      x: Math.random() * 4500,
      y: Math.random() * (height - 60),
      radius: Math.random() * 55 + 18,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.2,
      // Translucent warm champagne, moonlight slate & amber
      color: Math.random() < 0.45 ? 'rgba(184, 149, 98, ' : Math.random() < 0.75 ? 'rgba(148, 163, 184, ' : 'rgba(251, 191, 36, ',
      alpha: Math.random() * 0.08 + 0.03, // Low subtle brightness
      hasRim: Math.random() < 0.3,
    }));

    const mistParticles = Array.from({ length: 35 }, () => ({
      x: Math.random() * 4500,
      y: height - Math.random() * 240,
      radius: Math.random() * 80 + 50,
      vx: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.10 + 0.04,
    }));

    const afterimages = [];
    const impactSparks = [];

    // Helper: Draw Solid Polygon Limb
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

      ctx.beginPath();
      ctx.arc(x1, y1, w1 / 2, 0, Math.PI * 2);
      ctx.arc(x2, y2, w2 / 2, 0, Math.PI * 2);
      ctx.fill();
    };

    // Realistic Anatomical Shadow Fighter (Crisp Silhouette with Rim Highlights)
    const drawShadowFighter = (x, y, scale, pose, isHero = false, facingRight = true, alpha = 1) => {
      ctx.save();
      ctx.translate(x, y);
      if (!facingRight) ctx.scale(-1, 1);
      ctx.globalAlpha = alpha;

      const s = scale;
      ctx.fillStyle = '#060709'; // Solid silhouette

      // Head
      ctx.beginPath();
      ctx.ellipse(0, -56 * s, 8.5 * s, 10 * s, pose.headTilt || 0.08, 0, Math.PI * 2);
      ctx.fill();

      // Fluid Wind-blown Headband Tails for Hero
      if (isHero) {
        ctx.beginPath();
        const scarfWiggle = Math.sin(Date.now() * 0.02) * 5 * s;
        ctx.moveTo(-6 * s, -56 * s);
        ctx.quadraticCurveTo(-24 * s, -58 * s + scarfWiggle, -42 * s, -52 * s + scarfWiggle * 2);
        ctx.lineTo(-38 * s, -48 * s + scarfWiggle * 2);
        ctx.quadraticCurveTo(-18 * s, -53 * s + scarfWiggle, -6 * s, -51 * s);
        ctx.closePath();
        ctx.fill();

        // Glowing white Limbo eyes
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(4 * s, -57 * s, 2.2 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#060709';
      }

      // Torso: Athletic V-Tapered Chest
      ctx.beginPath();
      ctx.moveTo(-11 * s, -46 * s);
      ctx.lineTo(11 * s, -46 * s);
      ctx.lineTo(6 * s, -18 * s);
      ctx.lineTo(-6 * s, -18 * s);
      ctx.closePath();
      ctx.fill();

      // Flapping jacket tail
      ctx.beginPath();
      const coatWiggle = Math.sin(Date.now() * 0.016) * 6 * s;
      ctx.moveTo(-6 * s, -20 * s);
      ctx.lineTo(6 * s, -20 * s);
      ctx.lineTo(12 * s + coatWiggle * 0.5, -3 * s);
      ctx.lineTo(-14 * s - coatWiggle, -2 * s);
      ctx.closePath();
      ctx.fill();

      // Arms (Biomechanical upper arm + forearm)
      drawSolidLimb(0, -42 * s, pose.elbow1X * s, pose.elbow1Y * s, 7.5 * s, 6.0 * s);
      drawSolidLimb(pose.elbow1X * s, pose.elbow1Y * s, pose.hand1X * s, pose.hand1Y * s, 6.0 * s, 4.8 * s);

      drawSolidLimb(0, -42 * s, pose.elbow2X * s, pose.elbow2Y * s, 7.0 * s, 5.5 * s);
      drawSolidLimb(pose.elbow2X * s, pose.elbow2Y * s, pose.hand2X * s, pose.hand2Y * s, 5.5 * s, 4.4 * s);

      // Legs (Thigh + Calf with realistic knee bend)
      drawSolidLimb(0, -18 * s, pose.knee1X * s, pose.knee1Y * s, 9.5 * s, 7.5 * s);
      drawSolidLimb(pose.knee1X * s, pose.knee1Y * s, pose.foot1X * s, pose.foot1Y * s, 7.5 * s, 5.8 * s);

      drawSolidLimb(0, -18 * s, pose.knee2X * s, pose.knee2Y * s, 9.5 * s, 7.5 * s);
      drawSolidLimb(pose.knee2X * s, pose.knee2Y * s, pose.foot2X * s, pose.foot2Y * s, 7.5 * s, 5.8 * s);

      ctx.restore();
    };

    // Realistic Jahana Silhouette (Royal Gown & Long Flowing Veil)
    const drawJahanaSilhouette = (x, y, scale) => {
      ctx.save();
      ctx.translate(x, y);
      const s = scale;

      ctx.fillStyle = '#050608';

      // Head
      ctx.beginPath();
      ctx.arc(0, -58 * s, 8.5 * s, 0, Math.PI * 2);
      ctx.fill();

      // Flowing Ethereal Veil
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(-4 * s, -60 * s);
      ctx.quadraticCurveTo(-28 * s, -35 * s, -24 * s, 14 * s);
      ctx.lineTo(-8 * s, 10 * s);
      ctx.quadraticCurveTo(-14 * s, -25 * s, 0, -52 * s);
      ctx.fill();

      // Royal Gown Silhouette
      ctx.fillStyle = '#050608';
      ctx.beginPath();
      ctx.moveTo(-8 * s, -48 * s);
      ctx.lineTo(8 * s, -48 * s);
      ctx.lineTo(6 * s, -24 * s);
      ctx.lineTo(26 * s, 8 * s);
      ctx.lineTo(-26 * s, 8 * s);
      ctx.lineTo(-6 * s, -24 * s);
      ctx.closePath();
      ctx.fill();

      // Arms receiving the rose
      drawSolidLimb(0, -44 * s, -10 * s, -28 * s, 5.5 * s, 4.5 * s);
      drawSolidLimb(-10 * s, -28 * s, -18 * s, -24 * s, 4.5 * s, 3.5 * s);

      // Glowing Tiara
      ctx.fillStyle = '#fef08a';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -65 * s, 2.8 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    };

    // Red Rose
    const drawRedRose = (x, y, scale = 1, bloom = 1) => {
      ctx.save();
      ctx.translate(x, y);

      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(5 * scale, 14 * scale, 2 * scale, 28 * scale);
      ctx.stroke();

      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(6 * scale, 14 * scale, 6 * scale, 3 * scale, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      const r = 11 * scale * bloom;
      ctx.fillStyle = '#dc2626';
      ctx.shadowBlur = 18;
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

    // Terrain Elevation Function
    const baseGroundY = height - 90;
    const getTerrainHeight = (worldX) => {
      if (worldX < 600) return baseGroundY;
      if (worldX < 750) {
        const t = (worldX - 600) / 150;
        return baseGroundY - t * 90;
      }
      if (worldX < 1300) return baseGroundY - 90;
      if (worldX < 1450) return baseGroundY - 115;
      if (worldX < 1950) return baseGroundY - 80;
      if (worldX < 2250) {
        const t = (worldX - 1950) / 300;
        return (baseGroundY - 80) + t * 80;
      }
      return baseGroundY;
    };

    // --------------------------------------------------------------------
    // BIOMECHANICAL GAIT GENERATORS (Smooth Running & Walking Kinematics)
    // --------------------------------------------------------------------
    const getRunningGait = (phase) => {
      const leg1Angle = Math.sin(phase) * 0.72;
      const knee1Bend = Math.max(0, -Math.sin(phase)) * 0.95;
      const leg2Angle = Math.sin(phase + Math.PI) * 0.72;
      const knee2Bend = Math.max(0, -Math.sin(phase + Math.PI)) * 0.95;

      const arm1Angle = -leg1Angle * 0.9;
      const arm2Angle = -leg2Angle * 0.9;

      return {
        headTilt: 0.1,
        elbow1X: Math.sin(arm1Angle) * 16,
        elbow1Y: -42 + Math.cos(arm1Angle) * 16,
        hand1X: Math.sin(arm1Angle + 0.6) * 32,
        hand1Y: -42 + Math.cos(arm1Angle + 0.6) * 26,
        elbow2X: Math.sin(arm2Angle) * 16,
        elbow2Y: -42 + Math.cos(arm2Angle) * 16,
        hand2X: Math.sin(arm2Angle + 0.6) * 32,
        hand2Y: -42 + Math.cos(arm2Angle + 0.6) * 26,
        knee1X: Math.sin(leg1Angle) * 20,
        knee1Y: -18 + Math.cos(leg1Angle) * 18,
        foot1X: Math.sin(leg1Angle - knee1Bend) * 36,
        foot1Y: -18 + Math.cos(leg1Angle - knee1Bend) * 36,
        knee2X: Math.sin(leg2Angle) * 20,
        knee2Y: -18 + Math.cos(leg2Angle) * 18,
        foot2X: Math.sin(leg2Angle - knee2Bend) * 36,
        foot2Y: -18 + Math.cos(leg2Angle - knee2Bend) * 36,
      };
    };

    const getWalkingGait = (phase) => {
      const leg1Angle = Math.sin(phase) * 0.42;
      const knee1Bend = Math.max(0, -Math.sin(phase)) * 0.4;
      const leg2Angle = Math.sin(phase + Math.PI) * 0.42;
      const knee2Bend = Math.max(0, -Math.sin(phase + Math.PI)) * 0.4;

      const arm1Angle = -leg1Angle * 0.7;
      const arm2Angle = -leg2Angle * 0.7;

      return {
        headTilt: 0.04,
        elbow1X: Math.sin(arm1Angle) * 12,
        elbow1Y: -42 + Math.cos(arm1Angle) * 14,
        hand1X: Math.sin(arm1Angle + 0.4) * 22,
        hand1Y: -42 + Math.cos(arm1Angle + 0.4) * 26,
        elbow2X: Math.sin(arm2Angle) * 12,
        elbow2Y: -42 + Math.cos(arm2Angle) * 14,
        hand2X: Math.sin(arm2Angle + 0.4) * 22,
        hand2Y: -42 + Math.cos(arm2Angle + 0.4) * 26,
        knee1X: Math.sin(leg1Angle) * 16,
        knee1Y: -18 + Math.cos(leg1Angle) * 16,
        foot1X: Math.sin(leg1Angle - knee1Bend) * 32,
        foot1Y: -18 + Math.cos(leg1Angle - knee1Bend) * 34,
        knee2X: Math.sin(leg2Angle) * 16,
        knee2Y: -18 + Math.cos(leg2Angle) * 16,
        foot2X: Math.sin(leg2Angle - knee2Bend) * 32,
        foot2Y: -18 + Math.cos(leg2Angle - knee2Bend) * 34,
      };
    };

    // --------------------------------------------------------------------
    // MAIN 60FPS CHOREOGRAPHY (NO WIDE LEGS, AUTHENTIC KUNG FU & SOUNDS)
    // --------------------------------------------------------------------
    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      ctx.clearRect(0, 0, width, height);

      let arifWorldX = 0;
      let arifWorldY = baseGroundY;
      let arifPose = {};

      // SCENE 1: ATHLETIC SPRINT & SLIDE TACKLE ON VILLAIN 1 (0s - 4.5s)
      if (elapsed < 4.5) {
        const t = elapsed / 4.5;
        arifWorldX = 60 + t * 500;
        const groundH = getTerrainHeight(arifWorldX);

        if (elapsed > 0.4 && !audioFired.dash1) {
          audioFx.dash();
          audioFired.dash1 = true;
        }

        if (elapsed > 2.6 && elapsed < 3.8) {
          // Low Kung Fu Slide Tackle underneath ancient pillar & striking Villain 1
          if (!audioFired.voiceSlide1) {
            audioFx.whoosh(520);
            audioFx.kungFuVoice('ha');
            audioFired.voiceSlide1 = true;
          }
          if (elapsed > 3.0 && !audioFired.hit1) {
            audioFx.hit();
            audioFired.hit1 = true;
            for (let s = 0; s < 20; s++) {
              impactSparks.push({
                x: arifWorldX + 40,
                y: groundH - 12,
                vx: (Math.random() + 0.4) * 8,
                vy: (Math.random() - 0.5) * 6,
                life: 25,
              });
            }
          }
          arifWorldY = groundH + 6;
          // Compact slide: rear leg tucked in under hip, lead leg extended
          arifPose = {
            headTilt: -0.3,
            elbow1X: -18, elbow1Y: -22, hand1X: -26, hand1Y: -12,
            elbow2X: 14, elbow2Y: -20, hand2X: 24, hand2Y: -14,
            knee1X: 24, knee1Y: -4, foot1X: 42, foot1Y: 2, // Slide leg
            knee2X: -8, knee2Y: -4, foot2X: -16, foot2Y: 0, // Tucked compactly
          };
        } else {
          // Running cycle
          const runPhase = elapsed * 16;
          arifWorldY = groundH - Math.abs(Math.sin(runPhase)) * 8;
          arifPose = getRunningGait(runPhase);
          if (Math.abs(Math.sin(runPhase)) > 0.95 && Math.random() < 0.25) audioFx.step();
        }
      }

      // SCENE 2: PARKOUR WALL-RUN & MANTLE (TIGHT TUCK JUMP, NO WIDE LEGS) (4.5s - 7.5s)
      else if (elapsed < 7.5) {
        const t = (elapsed - 4.5) / 3.0;
        arifWorldX = 560 + t * 400;

        if (t < 0.45) {
          // Wall run & climb: legs tucked compactly under body in athletic vault
          if (!audioFired.voiceClimb1) {
            audioFx.whoosh(480);
            audioFx.kungFuVoice('hup');
            audioFired.voiceClimb1 = true;
          }
          const climbT = t / 0.45;
          arifWorldY = baseGroundY - climbT * 92;
          arifPose = {
            headTilt: -0.1,
            elbow1X: 18, elbow1Y: -46, hand1X: 24, hand1Y: -58,
            elbow2X: -14, elbow2Y: -32, hand2X: -18, hand2Y: -42,
            // Tight tuck vault (both knees pulled towards chest, NO wide spread)
            knee1X: 12, knee1Y: -24, foot1X: 14, foot1Y: -8,
            knee2X: 6, knee2Y: -20, foot2X: 8, foot2Y: -4,
          };
        } else {
          // Vault onto terrace and sprint
          const groundH = getTerrainHeight(arifWorldX);
          const runPhase = elapsed * 16;
          arifWorldY = groundH - Math.abs(Math.sin(runPhase)) * 8;
          arifPose = getRunningGait(runPhase);
        }
      }

      // SCENE 3: FLYING DRAGON KICK ON VILLAIN 2 (CLASSIC BRUCE LEE TUCKED POSE) (7.5s - 11.0s)
      else if (elapsed < 11.0) {
        const t = (elapsed - 7.5) / 3.5;
        arifWorldX = 960 + t * 440;
        const groundH = getTerrainHeight(arifWorldX);

        if (t < 0.45) {
          // Flying Dragon Kick: Kicking leg razor straight, back leg TUCKED under hip!
          if (!audioFired.voiceKick2 && t > 0.15) {
            audioFx.whoosh(620);
            audioFx.kungFuVoice('watah'); // Real kung fu voice shout!
            audioFired.voiceKick2 = true;
          }
          if (!audioFired.hit2 && t > 0.35) {
            audioFx.hit();
            audioFired.hit2 = true;
            for (let s = 0; s < 25; s++) {
              impactSparks.push({
                x: arifWorldX + 45,
                y: groundH - 45,
                vx: (Math.random() + 0.4) * 9,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
              });
            }
          }
          const jumpArc = Math.sin((t / 0.45) * Math.PI) * 65;
          arifWorldY = groundH - jumpArc - 15;

          // Authentic Bruce Lee / Shaolin Flying Side Kick
          arifPose = {
            headTilt: 0.15,
            elbow1X: -16, elbow1Y: -46, hand1X: -26, hand1Y: -48,
            elbow2X: 16, elbow2Y: -36, hand2X: 24, hand2Y: -30,
            // Lead kicking leg extended straight
            knee1X: 26, knee1Y: -24, foot1X: 50, foot1Y: -24,
            // Trailing leg tightly tucked in under hip (NO wide leg widening!)
            knee2X: -6, knee2Y: -6, foot2X: -14, foot2Y: 4,
          };
        } else {
          // Landing & sprint across pagoda bridge
          arifWorldY = groundH;
          const runPhase = elapsed * 16;
          arifPose = getRunningGait(runPhase);
        }
      }

      // SCENE 4: ROOF GAP JUMP & MID-AIR KUNG FU STRIKE ON VILLAIN 3 (11.0s - 14.5s)
      else if (elapsed < 14.5) {
        const t = (elapsed - 11.0) / 3.5;
        arifWorldX = 1400 + t * 480;
        const groundH = getTerrainHeight(arifWorldX);

        if (t < 0.5) {
          // Parkour roof gap leap & mid-air forward punch
          if (!audioFired.voiceClash3 && t > 0.15) {
            audioFx.whoosh(720);
            audioFx.kungFuVoice('hya');
            audioFired.voiceClash3 = true;
          }
          if (!audioFired.hit3 && t > 0.32) {
            audioFx.hit();
            audioFired.hit3 = true;
            for (let s = 0; s < 30; s++) {
              impactSparks.push({
                x: arifWorldX + 38,
                y: groundH - 55,
                vx: (Math.random() - 0.4) * 9,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
              });
            }
          }
          const jumpArc = Math.sin((t / 0.5) * Math.PI) * 75;
          arifWorldY = groundH - jumpArc - 20;

          // Mid-air flying forward punch with compact, athletic tucked legs
          arifPose = {
            headTilt: 0.1,
            elbow1X: 22, elbow1Y: -38, hand1X: 38, hand1Y: -36, // Straight punch
            elbow2X: -18, elbow2Y: -44, hand2X: -26, hand2Y: -48,
            // Compact scissor jump: lead knee tucked up, back foot trailing slightly behind (NO wide split)
            knee1X: 16, knee1Y: -22, foot1X: 20, foot1Y: -6,
            knee2X: -10, knee2Y: -14, foot2X: -18, foot2Y: 2,
          };
        } else {
          // Landing & stride down stairs
          const runPhase = elapsed * 16;
          arifWorldY = groundH - Math.abs(Math.sin(runPhase)) * 8;
          arifPose = getRunningGait(runPhase);
        }
      }

      // SCENE 5: DUAL AMBUSH (VILLAINS 4 & 5) - DUAL LOW SPIN SWEEP (14.5s - 17.5s)
      else if (elapsed < 17.5) {
        const t = (elapsed - 14.5) / 3.0;
        arifWorldX = 1880 + t * 480;
        const groundH = getTerrainHeight(arifWorldX);

        if (t < 0.4) {
          // Compact low martial arts dragon sweep (low center of gravity, no flailing legs)
          if (!audioFired.voiceDualKick && t > 0.1) {
            audioFx.whoosh(680);
            audioFx.kungFuVoice('watah');
            audioFired.voiceDualKick = true;
          }
          if (!audioFired.hit4 && t > 0.25) {
            audioFx.hit();
            audioFired.hit4 = true;
            for (let s = 0; s < 35; s++) {
              impactSparks.push({
                x: arifWorldX + 30,
                y: groundH - 30,
                vx: (Math.random() - 0.5) * 11,
                vy: (Math.random() - 0.5) * 8,
                life: 35,
              });
            }
          }
          const jumpArc = Math.sin((t / 0.4) * Math.PI) * 40;
          arifWorldY = groundH - jumpArc - 12;
          arifPose = {
            headTilt: -0.2,
            elbow1X: -20, elbow1Y: -38, hand1X: -28, hand1Y: -42,
            elbow2X: 20, elbow2Y: -38, hand2X: 28, hand2Y: -42,
            // Ground sweep: right leg sweeps forward, left leg tucked supporting
            knee1X: 26, knee1Y: -12, foot1X: 44, foot1Y: -2,
            knee2X: -10, knee2Y: -10, foot2X: -16, foot2Y: 4,
          };
        } else {
          const runPhase = elapsed * 15;
          arifWorldY = groundH - Math.abs(Math.sin(runPhase)) * 6;
          arifPose = getRunningGait(runPhase);
        }
      }

      // SCENE 6: DIGNIFIED NOBLE WALK TOWARD JAHANA (17.5s - 20.0s)
      else if (elapsed < 20.0) {
        // Slowing down to a graceful, dignified, noble walk
        const t = (elapsed - 17.5) / 2.5;
        arifWorldX = 2360 + t * 440;
        arifWorldY = baseGroundY;

        const walkPhase = elapsed * 6;
        arifWorldY -= Math.abs(Math.sin(walkPhase)) * 3;
        arifPose = getWalkingGait(walkPhase);
        if (Math.abs(Math.sin(walkPhase)) > 0.95 && Math.random() < 0.2) audioFx.step();
      }

      // SCENE 7: REACHING JAHANA & PRESENTING THE RED ROSE (20.0s+)
      else {
        arifWorldX = 2810;
        arifWorldY = baseGroundY;

        if (!audioFired.rose) {
          audioFx.roseReveal();
          audioFired.rose = true;
        }

        arifPose = {
          headTilt: 0.08,
          elbow1X: 14, elbow1Y: -32, hand1X: 24, hand1Y: -28,
          elbow2X: -8, elbow2Y: -28, hand2X: -14, hand2Y: -20,
          knee1X: 10, knee1Y: -8, foot1X: 14, foot1Y: 0,
          knee2X: -10, knee2Y: -8, foot2X: -16, foot2Y: 0,
        };
      }

      // --------------------------------------------------------------------
      // DYNAMIC SMOOTH SCROLLING CAMERA (Jahana is completely offscreen initially!)
      // --------------------------------------------------------------------
      const targetCamX = Math.max(0, arifWorldX - width * 0.32);
      const camX = targetCamX;

      ctx.save();
      ctx.translate(-camX, 0);

      // PARALLAX 1: Sky & Atmosphere
      const skyGrad = ctx.createLinearGradient(camX, 0, camX, height);
      skyGrad.addColorStop(0, '#040507');
      skyGrad.addColorStop(0.65, '#0b0f16');
      skyGrad.addColorStop(1, '#020305');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(camX, 0, width, height);

      // Distant Full Moon over Sanctuary
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(2950, height * 0.28, 125, 0, Math.PI * 2);
      ctx.fill();

      // PARALLAX 2: Distant Mountain Ridge (0.3x)
      ctx.fillStyle = '#06080d';
      ctx.beginPath();
      ctx.moveTo(camX * 0.3 - 200, height);
      for (let mx = -200; mx < 4500; mx += 260) {
        ctx.lineTo(mx, baseGroundY - 140 - Math.sin(mx * 0.005) * 60);
      }
      ctx.lineTo(4500, height);
      ctx.fill();

      // PARALLAX 3: Midground Gnarled Trees & Ancient Pagodas (0.7x)
      ctx.fillStyle = '#05070a';
      for (let px = 180; px < 3800; px += 350) {
        ctx.beginPath();
        ctx.moveTo(px, baseGroundY - 40);
        ctx.lineTo(px + 8, baseGroundY - 150);
        ctx.lineTo(px + 32, baseGroundY - 180);
        ctx.lineTo(px + 12, baseGroundY - 150);
        ctx.lineTo(px - 22, baseGroundY - 170);
        ctx.lineTo(px, baseGroundY - 150);
        ctx.lineTo(px + 16, baseGroundY - 40);
        ctx.fill();
      }

      // LOW-BRIGHTNESS SOFT BOKEH CIRCLES (Cinematic out-of-focus camera light orbs)
      bokehOrbs.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < camX - 100) b.x = camX + width + 100;
        if (b.x > camX + width + 100) b.x = camX - 100;

        ctx.save();
        ctx.fillStyle = `${b.color}${b.alpha})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle soft rim on larger bokeh
        if (b.hasRim) {
          ctx.strokeStyle = `${b.color}${b.alpha * 1.8})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.restore();
      });

      // MIST PARTICLES
      mistParticles.forEach((m) => {
        m.x += m.vx;
        ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // --------------------------------------------------------------------
      // ILLUMINATED WALKING PATH & TERRAIN (CONTRAST SO CHARACTERS ARE CLEAR)
      // --------------------------------------------------------------------
      // Atmospheric rim backlight right above the walking path so figures POP sharply
      const pathBacklight = ctx.createLinearGradient(0, baseGroundY - 160, 0, baseGroundY + 20);
      pathBacklight.addColorStop(0, 'rgba(0, 0, 0, 0)');
      pathBacklight.addColorStop(0.7, 'rgba(184, 149, 98, 0.12)'); // Soft warm champagne backlight
      pathBacklight.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
      ctx.fillStyle = pathBacklight;
      ctx.fillRect(camX - 50, baseGroundY - 160, width + 100, 180);

      // Foreground stone path with illuminated surface
      ctx.fillStyle = '#0f141c'; // Elevated from pitch black to rich illuminated dark slate
      ctx.beginPath();
      ctx.moveTo(-100, height);
      for (let tx = -100; tx <= 3600; tx += 20) {
        ctx.lineTo(tx, getTerrainHeight(tx));
      }
      ctx.lineTo(3600, height);
      ctx.closePath();
      ctx.fill();

      // Luminous walking edge / path rim highlight (Makes feet & movement crystal clear)
      ctx.strokeStyle = 'rgba(184, 149, 98, 0.35)'; // Champagne edge line
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let tx = -100; tx <= 3600; tx += 20) {
        if (tx === -100) ctx.moveTo(tx, getTerrainHeight(tx));
        else ctx.lineTo(tx, getTerrainHeight(tx));
      }
      ctx.stroke();

      // Ruined Fallen Column Obstacle at x=280
      ctx.fillStyle = '#141a24';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.save();
      ctx.translate(270, baseGroundY - 32);
      ctx.rotate(0.2);
      ctx.fillRect(0, 0, 70, 26);
      ctx.strokeRect(0, 0, 70, 26);
      ctx.restore();

      // Cliff Wall Barrier at x=600
      ctx.fillStyle = '#141a24';
      ctx.fillRect(600, baseGroundY - 90, 35, 90);
      ctx.strokeRect(600, baseGroundY - 90, 35, 90);

      // Pagoda Rooftop Pillars at 1300-1450
      ctx.fillRect(1320, baseGroundY - 140, 22, 140);
      ctx.fillRect(1430, baseGroundY - 140, 22, 140);
      ctx.beginPath();
      ctx.moveTo(1290, baseGroundY - 140);
      ctx.lineTo(1385, baseGroundY - 175);
      ctx.lineTo(1480, baseGroundY - 140);
      ctx.fill();

      // Grand Sanctuary Archway over Jahana at x=2870
      ctx.fillStyle = '#161c27';
      ctx.fillRect(2760, baseGroundY - 160, 22, 160);
      ctx.fillRect(2970, baseGroundY - 160, 22, 160);
      ctx.beginPath();
      ctx.moveTo(2740, baseGroundY - 160);
      ctx.quadraticCurveTo(2865, baseGroundY - 225, 2990, baseGroundY - 160);
      ctx.lineTo(2970, baseGroundY - 145);
      ctx.quadraticCurveTo(2865, baseGroundY - 205, 2760, baseGroundY - 145);
      ctx.fill();

      // Warm glowing lanterns on sanctuary arch
      [2770, 2960].forEach((lx) => {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
        ctx.beginPath();
        ctx.arc(lx, baseGroundY - 140, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(lx, baseGroundY - 140, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // --------------------------------------------------------------------
      // DRAW 5 VILLAIN SHADOW FIGHTERS (Clearly Visible Against Backlight)
      // --------------------------------------------------------------------
      // Villain 1 (At x=340, knocked by slide sweep)
      if (elapsed > 2.0 && elapsed < 5.5) {
        const v1T = elapsed - 3.0;
        if (v1T > 0) {
          drawShadowFighter(340 + v1T * 160, baseGroundY - Math.sin(v1T * 2) * 50 + v1T * 30, 0.95, {
            elbow1X: 16, elbow1Y: -38, hand1X: 24, hand1Y: -44,
            elbow2X: 10, elbow2Y: -28, hand2X: 16, hand2Y: -22,
            knee1X: 12, knee1Y: 8, foot1X: 20, foot1Y: 18,
            knee2X: 6, knee2Y: 6, foot2X: 12, foot2Y: 14,
          }, false, false);
        } else {
          drawShadowFighter(340, baseGroundY, 1.0, {
            elbow1X: -16, elbow1Y: -34, hand1X: -26, hand1Y: -30,
            elbow2X: 10, elbow2Y: -28, hand2X: 18, hand2Y: -24,
            knee1X: -12, knee1Y: -4, foot1X: -18, foot1Y: 0,
            knee2X: 10, knee2Y: -4, foot2X: 16, foot2Y: 0,
          }, false, false);
        }
      }

      // Villain 2 (At x=1150 on terrace, launched by flying dragon kick)
      if (elapsed > 7.0 && elapsed < 11.5) {
        const v2T = elapsed - 8.8;
        if (v2T > 0) {
          drawShadowFighter(1150 + v2T * 180, baseGroundY - 90 - Math.sin(v2T * 1.8) * 80 + v2T * 40, 0.95, {
            elbow1X: 16, elbow1Y: -38, hand1X: 24, hand1Y: -44,
            elbow2X: 10, elbow2Y: -28, hand2X: 16, hand2Y: -22,
            knee1X: 12, knee1Y: 8, foot1X: 20, foot1Y: 18,
            knee2X: 6, knee2Y: 6, foot2X: 12, foot2Y: 14,
          }, false, false);
        } else {
          drawShadowFighter(1150, baseGroundY - 90, 1.0, {
            elbow1X: -16, elbow1Y: -34, hand1X: -26, hand1Y: -30,
            elbow2X: 10, elbow2Y: -28, hand2X: 18, hand2Y: -24,
            knee1X: -12, knee1Y: -4, foot1X: -18, foot1Y: 0,
            knee2X: 10, knee2Y: -4, foot2X: 16, foot2Y: 0,
          }, false, false);
        }
      }

      // Villain 3 (At x=1640 roof gap, mid-air clash)
      if (elapsed > 10.5 && elapsed < 15.0) {
        const v3T = elapsed - 12.2;
        if (v3T > 0) {
          drawShadowFighter(1640 + v3T * 190, baseGroundY - 80 - Math.sin(v3T * 1.8) * 70 + v3T * 35, 0.95, {
            elbow1X: 14, elbow1Y: -40, hand1X: 22, hand1Y: -45,
            elbow2X: 8, elbow2Y: -30, hand2X: 14, hand2Y: -25,
            knee1X: 10, knee1Y: 10, foot1X: 18, foot1Y: 20,
            knee2X: 4, knee2Y: 6, foot2X: 8, foot2Y: 15,
          }, false, false);
        } else {
          drawShadowFighter(1640, baseGroundY - 80, 1.0, {
            elbow1X: -16, elbow1Y: -34, hand1X: -26, hand1Y: -30,
            elbow2X: 10, elbow2Y: -28, hand2X: 18, hand2Y: -24,
            knee1X: -12, knee1Y: -4, foot1X: -18, foot1Y: 0,
            knee2X: 10, knee2Y: -4, foot2X: 16, foot2Y: 0,
          }, false, false);
        }
      }

      // Villains 4 & 5 (At x=2080 and x=2120 at bridge, dual sweep)
      if (elapsed > 14.0 && elapsed < 18.0) {
        const v4T = elapsed - 15.3;
        if (v4T > 0) {
          drawShadowFighter(2080 - v4T * 130, baseGroundY - 20 - Math.sin(v4T * 1.8) * 60, 0.9, {
            elbow1X: -14, elbow1Y: -38, hand1X: -22, hand1Y: -42,
            elbow2X: 8, elbow2Y: -28, hand2X: 14, hand2Y: -22,
            knee1X: -10, knee1Y: 8, foot1X: -18, foot1Y: 16,
            knee2X: -6, knee2Y: 6, foot2X: -12, foot2Y: 12,
          }, false, true);

          drawShadowFighter(2120 + v4T * 160, baseGroundY - 20 - Math.sin(v4T * 1.8) * 70, 0.9, {
            elbow1X: 14, elbow1Y: -38, hand1X: 22, hand1Y: -42,
            elbow2X: 8, elbow2Y: -28, hand2X: 14, hand2Y: -22,
            knee1X: 10, knee1Y: 8, foot1X: 18, foot1Y: 16,
            knee2X: 6, knee2Y: 6, foot2X: 12, foot2Y: 12,
          }, false, false);
        } else {
          drawShadowFighter(2080, baseGroundY - 20, 0.95, {
            elbow1X: -14, elbow1Y: -32, hand1X: -22, hand1Y: -28,
            elbow2X: 8, elbow2Y: -26, hand2X: 16, hand2Y: -22,
            knee1X: -10, knee1Y: -4, foot1X: -16, foot1Y: 0,
            knee2X: 10, knee2Y: -4, foot2X: 16, foot2Y: 0,
          }, false, false);

          drawShadowFighter(2120, baseGroundY - 20, 0.95, {
            elbow1X: -14, elbow1Y: -32, hand1X: -22, hand1Y: -28,
            elbow2X: 8, elbow2Y: -26, hand2X: 16, hand2Y: -22,
            knee1X: -10, knee1Y: -4, foot1X: -16, foot1Y: 0,
            knee2X: 10, knee2Y: -4, foot2X: 16, foot2Y: 0,
          }, false, false);
        }
      }

      // --------------------------------------------------------------------
      // DRAW HERO & JAHANA
      // --------------------------------------------------------------------
      if (elapsed < 17.5) {
        afterimages.push({
          x: arifWorldX,
          y: arifWorldY,
          pose: { ...arifPose },
          time: Date.now(),
        });
      }

      const now = Date.now();
      for (let a = afterimages.length - 1; a >= 0; a--) {
        const ghost = afterimages[a];
        const age = now - ghost.time;
        if (age > 150) {
          afterimages.splice(a, 1);
        } else {
          const alpha = (1 - age / 150) * 0.22;
          drawShadowFighter(ghost.x, ghost.y, 1.06, ghost.pose, true, true, alpha);
        }
      }

      // Main Arif (Crisp Shadow Silhouette)
      drawShadowFighter(arifWorldX, arifWorldY, 1.08, arifPose, true, true, 1.0);

      // Jahana (At x=2870 in the Sanctuary)
      drawJahanaSilhouette(2870, baseGroundY, 1.08);

      // Red Rose
      if (elapsed >= 19.5) {
        const roseBloom = Math.min(1, (elapsed - 19.5) / 1.5);
        drawRedRose(arifWorldX + 24, baseGroundY - 26, 1.15, roseBloom);
      }

      // Impact Sparks
      for (let s = impactSparks.length - 1; s >= 0; s--) {
        const sp = impactSparks[s];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life--;
        ctx.fillStyle = `rgba(255, 235, 150, ${sp.life / 35})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        if (sp.life <= 0) impactSparks.splice(s, 1);
      }

      // --------------------------------------------------------------------
      // TOM & JERRY CARTOON POPPING HEART (At 21s+)
      // --------------------------------------------------------------------
      if (elapsed >= 21.0) {
        if (!audioFired.pop) {
          audioFx.tomJerryPop();
          audioFired.pop = true;
          setShowFinaleUI(true);
        }

        const heartElapsed = elapsed - 21.0;
        let heartScale = 1.0;
        if (heartElapsed < 0.25) {
          heartScale = (heartElapsed / 0.25) * 1.5;
        } else if (heartElapsed < 0.45) {
          heartScale = 1.5 - ((heartElapsed - 0.25) / 0.2) * 0.6;
        } else if (heartElapsed < 0.65) {
          heartScale = 0.9 + ((heartElapsed - 0.45) / 0.2) * 0.25;
        } else if (heartElapsed < 0.85) {
          heartScale = 1.15 - ((heartElapsed - 0.65) / 0.2) * 0.15;
        } else {
          heartScale = 1.0 + Math.sin(heartElapsed * 6) * 0.08;
        }

        const hX = (arifWorldX + 2870) / 2;
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

        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(-12, -48, 6, 12, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      ctx.restore();

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
