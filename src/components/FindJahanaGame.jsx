import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Star
} from 'lucide-react';
import { playSound } from '../utils/audioFx';

// Dynamic Seeded Maze Generator (Randomized on every page load & reset, 100% solvable)
function generateRandomMaze(rows, cols) {
  let seed = Math.floor(Math.random() * 9000000) + 1000000;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const grid = Array.from({ length: rows }, () => Array(cols).fill(1));

  function carve(r, c) {
    grid[r][c] = 0;
    const dirs = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ].sort(() => rng() - 0.5);

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && grid[nr][nc] === 1) {
        grid[r + dr / 2][c + dc / 2] = 0;
        carve(nr, nc);
      }
    }
  }

  carve(1, 1);
  grid[rows - 2][cols - 2] = 0; // ensure target cell is open
  return grid;
}

// Randomly place gifts in reachable dead-end alcoves
function pickRandomAlcoves(grid, startR, startC, targetR, targetC, count) {
  const alcoves = [];
  const rows = grid.length;
  const cols = grid[0].length;

  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (grid[r][c] === 0) {
        if ((r === startR && c === startC) || (r === targetR && c === targetC)) continue;

        let wallCount = 0;
        if (grid[r - 1][c] === 1) wallCount++;
        if (grid[r + 1][c] === 1) wallCount++;
        if (grid[r][c - 1] === 1) wallCount++;
        if (grid[r][c + 1] === 1) wallCount++;

        if (wallCount >= 3) {
          alcoves.push({ r, c });
        }
      }
    }
  }

  // Shuffle alcoves randomly on every refresh
  for (let i = alcoves.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [alcoves[i], alcoves[j]] = [alcoves[j], alcoves[i]];
  }

  const icons = ['🌸', '💍', '💌', '🎁'];
  const picked = [];
  for (let i = 0; i < Math.min(count, alcoves.length); i++) {
    picked.push({
      ...alcoves[i],
      icon: icons[i % icons.length],
    });
  }
  return picked;
}

const LEVEL_CONFIGS = [
  {
    name: 'Level 1: Courtyard Maze',
    difficulty: 'Tough',
    size: 15,
    giftCount: 3,
  },
  {
    name: 'Level 2: Palace Labyrinth',
    difficulty: 'Harder',
    size: 17,
    giftCount: 3,
  },
  {
    name: 'Level 3: Royal Wedding Maze',
    difficulty: 'Mastery',
    size: 21,
    giftCount: 4,
  },
];

export default function FindJahanaGame() {
  const [levelIdx, setLevelIdx] = useState(0);
  const config = LEVEL_CONFIGS[levelIdx];

  // Random level state generated fresh on every mount / refresh
  const createLevelState = useCallback((idx) => {
    const cfg = LEVEL_CONFIGS[idx];
    const grid = generateRandomMaze(cfg.size, cfg.size);
    const start = [1, 1];
    const target = [cfg.size - 2, cfg.size - 2];
    const items = pickRandomAlcoves(grid, start[0], start[1], target[0], target[1], cfg.giftCount);
    return { grid, start, target, items };
  }, []);

  const [levelData, setLevelData] = useState(() => createLevelState(0));
  const [playerPos, setPlayerPos] = useState([1, 1]);
  const [collectedItems, setCollectedItems] = useState(new Set());
  const [visitedTiles, setVisitedTiles] = useState(new Set(['1,1']));
  const [moves, setMoves] = useState(0);
  const [levelWon, setLevelWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const holdIntervalRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Load new or re-randomized level
  const loadLevel = useCallback(
    (idx) => {
      const data = createLevelState(idx);
      setLevelIdx(idx);
      setLevelData(data);
      setPlayerPos(data.start);
      setCollectedItems(new Set());
      setVisitedTiles(new Set([`${data.start[0]},${data.start[1]}`]));
      setMoves(0);
      setLevelWon(false);
      setAllLevelsComplete(false);
      if (soundEnabled) playSound.gameStart();
    },
    [createLevelState, soundEnabled]
  );

  // Single step movement
  const stepMove = useCallback(
    (dRow, dCol) => {
      if (levelWon || allLevelsComplete) return false;

      let moved = false;
      setPlayerPos((curr) => {
        const [r, c] = curr;
        const nr = r + dRow;
        const nc = c + dCol;

        // Check bounds and walls
        if (
          nr < 0 ||
          nr >= levelData.grid.length ||
          nc < 0 ||
          nc >= levelData.grid[0].length ||
          levelData.grid[nr][nc] === 1
        ) {
          return curr; // blocked by wall
        }

        moved = true;
        setMoves((m) => m + 1);

        // Record visited trail
        setVisitedTiles((prev) => {
          const next = new Set(prev);
          next.add(`${nr},${nc}`);
          return next;
        });

        // Collect gift
        const gift = levelData.items.find(
          (it) => it.r === nr && it.c === nc && !collectedItems.has(`${nr},${nc}`)
        );
        if (gift) {
          setCollectedItems((prev) => new Set(prev).add(`${nr},${nc}`));
          if (soundEnabled) playSound.itemCollect();
        } else {
          if (soundEnabled) playSound.step();
        }

        // Reached Jahana!
        if (nr === levelData.target[0] && nc === levelData.target[1]) {
          if (levelIdx === LEVEL_CONFIGS.length - 1) {
            setAllLevelsComplete(true);
          } else {
            setLevelWon(true);
          }
          if (soundEnabled) {
            playSound.winMusic();
          }
        }

        return [nr, nc];
      });

      return moved;
    },
    [levelWon, allLevelsComplete, levelData, collectedItems, soundEnabled, levelIdx]
  );

  // Corridor sliding on touch swipe
  const slideMove = useCallback(
    (dRow, dCol) => {
      if (levelWon || allLevelsComplete) return;

      let [r, c] = playerPos;
      let count = 0;
      const maxSlide = 10;

      while (count < maxSlide) {
        const nr = r + dRow;
        const nc = c + dCol;
        if (
          nr < 0 ||
          nr >= levelData.grid.length ||
          nc < 0 ||
          nc >= levelData.grid[0].length ||
          levelData.grid[nr][nc] === 1
        ) {
          break; // wall reached
        }

        r = nr;
        c = nc;
        count++;

        // Stop if reached gift or destination
        const hasGift = levelData.items.some(
          (it) => it.r === r && it.c === c && !collectedItems.has(`${r},${c}`)
        );
        if (hasGift || (r === levelData.target[0] && c === levelData.target[1])) {
          break;
        }

        // Stop at junction
        let openNeighbors = 0;
        if (levelData.grid[r - 1]?.[c] === 0) openNeighbors++;
        if (levelData.grid[r + 1]?.[c] === 0) openNeighbors++;
        if (levelData.grid[r]?.[c - 1] === 0) openNeighbors++;
        if (levelData.grid[r]?.[c + 1] === 0) openNeighbors++;
        if (openNeighbors > 2) break;
      }

      if (count > 0) {
        setPlayerPos([r, c]);
        setMoves((m) => m + count);

        setVisitedTiles((prev) => {
          const next = new Set(prev);
          next.add(`${r},${c}`);
          return next;
        });

        const gift = levelData.items.find(
          (it) => it.r === r && it.c === c && !collectedItems.has(`${r},${c}`)
        );
        if (gift) {
          setCollectedItems((prev) => new Set(prev).add(`${r},${c}`));
          if (soundEnabled) playSound.itemCollect();
        } else {
          if (soundEnabled) playSound.step();
        }

        if (r === levelData.target[0] && c === levelData.target[1]) {
          if (levelIdx === LEVEL_CONFIGS.length - 1) {
            setAllLevelsComplete(true);
          } else {
            setLevelWon(true);
          }
          if (soundEnabled) {
            playSound.winMusic();
          }
        }
      }
    },
    [playerPos, levelData, levelWon, allLevelsComplete, collectedItems, soundEnabled, levelIdx]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        stepMove(-1, 0);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        stepMove(1, 0);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        stepMove(0, -1);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        stepMove(0, 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepMove]);

  // Touch Swipe
  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 18) {
      if (absDx > absDy) {
        slideMove(0, dx > 0 ? 1 : -1);
      } else {
        slideMove(dy > 0 ? 1 : -1, 0);
      }
    }
  };

  // Hold-to-glide on D-Pad buttons
  const startHoldMove = (dRow, dCol) => {
    stepMove(dRow, dCol);
    clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = setInterval(() => {
      stepMove(dRow, dCol);
    }, 110);
  };

  const stopHoldMove = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopHoldMove();
  }, []);

  const cols = levelData.grid[0].length;
  const rows = levelData.grid.length;

  return (
    <div
      className="apple-card rounded-3xl p-4 sm:p-6 text-center max-w-lg mx-auto w-full relative overflow-hidden"
      data-physics-obstacle="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#b89562]" />
          <h3 className="font-serif text-base font-bold text-[#1d1d1f]">
            Journey to Jahana
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-[#86868b] hover:text-[#1d1d1f] transition-colors p-1"
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>

          <span className="text-[11px] font-semibold text-[#86868b] bg-[#f5f5f7] px-2.5 py-1 rounded-full border border-black/[0.04]">
            {config.name.split(':')[0]} ({cols}×{rows})
          </span>
        </div>
      </div>

      <p className="text-xs text-[#6e6e73] mb-3">
        Navigate the random labyrinth to guide Arif to reach Jahana!
      </p>

      {/* Stats bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#f5f5f7] rounded-xl mb-3 text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-[#1d1d1f]">
          <span>Gifts:</span>
          <span className="text-[#b89562] font-bold">
            {collectedItems.size} / {levelData.items.length}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[#86868b]">
          <span>Moves:</span>
          <span className="text-[#1d1d1f] font-bold">{moves}</span>
        </div>

        <button
          onClick={() => loadLevel(levelIdx)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-black/[0.08] text-[11px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
          title="Regenerate random labyrinth"
        >
          <RotateCcw className="w-3 h-3" />
          <span>New Maze</span>
        </button>
      </div>

      {/* MAZE BOARD CONTAINER */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative mx-auto max-w-[340px] sm:max-w-[360px] aspect-square bg-[#fbfbfd] p-1.5 rounded-2xl shadow-apple-card border border-black/[0.08] select-none touch-none overflow-hidden"
      >
        {/* INNER BOUNDING BOX FOR PERFECT ZERO-PADDING ALIGNMENT */}
        <div className="relative w-full h-full">
          {/* Maze Grid */}
          <div
            className="grid w-full h-full"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
          >
            {levelData.grid.map((rowArr, r) =>
              rowArr.map((cell, c) => {
                const isWall = cell === 1;
                const isTarget = levelData.target[0] === r && levelData.target[1] === c;
                const hasGift = levelData.items.find(
                  (it) => it.r === r && it.c === c && !collectedItems.has(`${r},${c}`)
                );
                const isVisited = visitedTiles.has(`${r},${c}`);

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`relative flex items-center justify-center box-border ${
                      isWall
                        ? 'bg-[#1d1d1f]' // Thin architectural block
                        : isVisited
                        ? 'bg-[#f6ebd8]/55' // Subtle golden trail
                        : 'bg-white'
                    }`}
                  >
                    {/* Destination: Jahana */}
                    {isTarget && (
                      <div className="flex items-center justify-center w-full h-full animate-pulse z-0">
                        <span className="text-[12px] sm:text-sm filter drop-shadow leading-none">👰</span>
                      </div>
                    )}

                    {/* Collectible gifts */}
                    {hasGift && !isTarget && (
                      <span className="text-[9px] sm:text-[11px] animate-bounce select-none leading-none">
                        {hasGift.icon}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* PERFECTLY CENTERED & SMOOTH ARIF AVATAR */}
          <div
            className="absolute pointer-events-none flex items-center justify-center z-10 will-change-transform"
            style={{
              left: `${(playerPos[1] / cols) * 100}%`,
              top: `${(playerPos[0] / rows) * 100}%`,
              width: `${(1 / cols) * 100}%`,
              height: `${(1 / rows) * 100}%`,
              transition: 'top 0.12s cubic-bezier(0.2, 0.9, 0.4, 1), left 0.12s cubic-bezier(0.2, 0.9, 0.4, 1)',
            }}
          >
            <div className="w-[82%] h-[82%] rounded-full bg-[#b89562] flex items-center justify-center shadow-md ring-1 ring-white/95">
              <span className="text-[9px] sm:text-[11px] leading-none select-none flex items-center justify-center">🤵</span>
            </div>
          </div>
        </div>

        {/* Level Won Modal */}
        {levelWon && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-4 animate-fade-in-up z-20">
            <Heart className="w-8 h-8 text-[#b89562] fill-current mb-2 animate-bounce" />
            <h4 className="font-serif text-lg text-[#1d1d1f] font-bold mb-1">
              Courtyard Cleared!
            </h4>
            <p className="text-xs text-[#6e6e73] mb-3">
              Arif reached Jahana in {moves} moves with {collectedItems.size} gifts!
            </p>

            <div className="flex gap-1 text-amber-400 mb-4">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>

            <button
              onClick={() => loadLevel(levelIdx + 1)}
              className="apple-pill-btn px-6 py-2.5 text-xs flex items-center gap-1.5 shadow-apple-pill"
            >
              <span>Next Labyrinth ({LEVEL_CONFIGS[levelIdx + 1].size}×{LEVEL_CONFIGS[levelIdx + 1].size})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Finale Modal with Wedding Music */}
        {allLevelsComplete && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-4 animate-fade-in-up z-20">
            <div className="flex items-center gap-1 text-2xl mb-1">
              <span>🤵</span>
              <Heart className="w-6 h-6 text-red-500 fill-current animate-pulse mx-1" />
              <span>👰</span>
            </div>

            <h4 className="font-serif text-2xl text-[#1d1d1f] font-bold mb-1">
              Mabrook!
            </h4>

            <p className="text-xs text-[#1d1d1f] font-semibold mb-1">
              Arif & Jahana are together!
            </p>

            <p className="text-[11px] text-[#6e6e73] italic mb-4 max-w-xs text-center leading-relaxed">
              "And He placed between you affection and mercy." All labyrinths conquered on the path to Al Fitra Auditorium!
            </p>

            <button
              onClick={() => loadLevel(0)}
              className="apple-pill-btn px-6 py-2.5 text-xs flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again (New Mazes)</span>
            </button>
          </div>
        )}
      </div>

      {/* TACTILE D-PAD (SUPPORTS TAP & HOLD-TO-GLIDE) */}
      <div className="mt-4 max-w-[210px] mx-auto">
        <div className="grid grid-cols-3 gap-1.5 items-center justify-center">
          <div />
          <button
            onPointerDown={() => startHoldMove(-1, 0)}
            onPointerUp={stopHoldMove}
            onPointerLeave={stopHoldMove}
            className="w-12 h-11 mx-auto rounded-xl bg-white border border-black/[0.08] active:bg-[#e8e8ed] active:scale-95 flex items-center justify-center text-[#1d1d1f] shadow-sm transition-all"
            aria-label="Move Up"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div />

          <button
            onPointerDown={() => startHoldMove(0, -1)}
            onPointerUp={stopHoldMove}
            onPointerLeave={stopHoldMove}
            className="w-12 h-11 mx-auto rounded-xl bg-white border border-black/[0.08] active:bg-[#e8e8ed] active:scale-95 flex items-center justify-center text-[#1d1d1f] shadow-sm transition-all"
            aria-label="Move Left"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onPointerDown={() => startHoldMove(1, 0)}
            onPointerUp={stopHoldMove}
            onPointerLeave={stopHoldMove}
            className="w-12 h-11 mx-auto rounded-xl bg-white border border-black/[0.08] active:bg-[#e8e8ed] active:scale-95 flex items-center justify-center text-[#1d1d1f] shadow-sm transition-all"
            aria-label="Move Down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onPointerDown={() => startHoldMove(0, 1)}
            onPointerUp={stopHoldMove}
            onPointerLeave={stopHoldMove}
            className="w-12 h-11 mx-auto rounded-xl bg-white border border-black/[0.08] active:bg-[#e8e8ed] active:scale-95 flex items-center justify-center text-[#1d1d1f] shadow-sm transition-all"
            aria-label="Move Right"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] text-[#86868b] mt-2">
          Swipe to glide or hold arrows / WASD
        </p>
      </div>
    </div>
  );
}
