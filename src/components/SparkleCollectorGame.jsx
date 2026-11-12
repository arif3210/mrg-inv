import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Trophy, Play, RotateCcw, Heart, Volume2, VolumeX } from 'lucide-react';
import { playSound } from '../utils/audioFx';

export default function SparkleCollectorGame() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('wedding_sparkle_highscore') || '0', 10);
  });

  const basketX = useRef(150);
  const animFrame = useRef(null);
  const itemsRef = useRef([]);

  const startGame = () => {
    if (soundEnabled) playSound.gameStart();
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    itemsRef.current = [];
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          setGameOver(true);
          if (soundEnabled) playSound.celebration();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, soundEnabled]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('wedding_sparkle_highscore', score.toString());
    }
  }, [gameOver, score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = 320);
    basketX.current = width / 2;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 320;
    };
    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      basketX.current = Math.max(35, Math.min(width - 35, clientX - rect.left));
    };

    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('touchmove', handlePointerMove, { passive: true });
    canvas.addEventListener('touchstart', handlePointerMove, { passive: true });

    let lastSpawn = 0;

    const loop = (timestamp) => {
      ctx.clearRect(0, 0, width, height);

      // Clean fluid background
      ctx.fillStyle = '#f8f8fa';
      ctx.fillRect(0, 0, width, height);

      // Apple minimalist collector dish (graphite rounded capsule)
      const bx = basketX.current;
      const by = height - 28;
      const bWidth = 68;

      ctx.save();
      ctx.fillStyle = '#1d1d1f';
      ctx.beginPath();
      ctx.roundRect(bx - bWidth / 2, by - 6, bWidth, 12, 6);
      ctx.fill();

      // Subtle champagne accent dot in middle
      ctx.fillStyle = '#b89562';
      ctx.beginPath();
      ctx.arc(bx, by, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (isPlaying) {
        if (timestamp - lastSpawn > 420) {
          lastSpawn = timestamp;
          const types = [
            { type: 'crystal', points: 10, color: '#b89562', radius: 5, speed: 2.2, pitch: 1 },
            { type: 'pearl', points: 15, color: '#1d1d1f', radius: 5.5, speed: 2.7, pitch: 1.25 },
            { type: 'star', points: 25, color: '#d4af37', radius: 6.5, speed: 3.2, pitch: 1.5 },
          ];
          const chosen = types[Math.floor(Math.random() * types.length)];
          itemsRef.current.push({
            x: Math.random() * (width - 40) + 20,
            y: -10,
            ...chosen,
          });
        }

        const items = itemsRef.current;
        for (let i = items.length - 1; i >= 0; i--) {
          const item = items[i];
          item.y += item.speed;

          const distToBasket = Math.hypot(item.x - bx, item.y - by);
          if (distToBasket < bWidth / 2 + item.radius && item.y >= by - 12 && item.y <= by + 14) {
            setScore((s) => s + item.points);
            if (soundEnabled) {
              playSound.crystalCatch(item.pitch);
            }
            items.splice(i, 1);
            continue;
          }

          if (item.y > height + 20) {
            items.splice(i, 1);
            continue;
          }

          // Draw falling crystal
          ctx.save();
          ctx.fillStyle = item.color;
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(item.x - 1.2, item.y - 1.2, item.radius * 0.35, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animFrame.current = requestAnimationFrame(loop);
    };

    animFrame.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrame.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('touchmove', handlePointerMove);
      canvas.removeEventListener('touchstart', handlePointerMove);
    };
  }, [isPlaying, soundEnabled]);

  return (
    <div className="apple-card rounded-3xl p-5 sm:p-6 text-center max-w-lg mx-auto w-full relative overflow-hidden" data-physics-obstacle="true">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#b89562]" />
          <h3 className="font-serif text-base font-bold text-[#1d1d1f]">
            Crystal Catcher
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-[#86868b] hover:text-[#1d1d1f] transition-colors p-1"
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
          <div className="flex items-center gap-1.5 text-xs text-[#86868b] font-medium">
            <Trophy className="w-3.5 h-3.5 text-[#b89562]" />
            <span>Best: {highScore}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#6e6e73] mb-4">
        Glide the capsule to catch sinking crystals and gather blessings for Arif & Jahana.
      </p>

      {/* Stats bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#f5f5f7] rounded-xl mb-3 text-xs font-semibold">
        <div className="text-[#1d1d1f]">
          Blessings: <span className="text-[#b89562] font-bold text-sm">{score}</span>
        </div>
        <div className="text-[#86868b]">
          Time: <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-[#1d1d1f]'}`}>{timeLeft}s</span>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-black/[0.04] touch-none">
        <canvas ref={canvasRef} className="w-full block cursor-ew-resize" />

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/85 backdrop-blur-sm p-4">
            <h4 className="font-serif text-lg text-[#1d1d1f] font-bold mb-1">Catch Sinking Crystals</h4>
            <p className="text-xs text-[#6e6e73] max-w-xs mb-4">
              Touch or drag to steer the capsule through the water currents.
            </p>
            <button
              onClick={startGame}
              className="apple-pill-btn px-6 py-2.5 text-xs flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start</span>
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md p-4 animate-fade-in-up">
            <Heart className="w-8 h-8 text-[#b89562] mb-2 fill-current" />
            <h4 className="font-serif text-xl text-[#1d1d1f] font-bold mb-1">Mabrook!</h4>
            <p className="text-xs text-[#6e6e73] mb-4">
              You collected <strong className="text-[#1d1d1f]">{score}</strong> blessings for Arif & Jahana
            </p>
            <button
              onClick={startGame}
              className="apple-pill-btn px-5 py-2 text-xs flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
