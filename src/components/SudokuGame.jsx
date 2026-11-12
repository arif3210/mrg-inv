import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Trophy, RotateCcw, Volume2, VolumeX, Lightbulb, Eraser, Heart, CheckCircle2 } from 'lucide-react';
import { playSound } from '../utils/audioFx';

// Curated playable Sudoku boards (Easy & Accessible for wedding guests on mobile)
const PUZZLE_EASY = {
  initial: [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ],
  solution: [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ],
};

const PUZZLE_MEDIUM = {
  initial: [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0],
  ],
  solution: [
    [4, 3, 5, 2, 6, 9, 7, 8, 1],
    [6, 8, 2, 5, 7, 1, 4, 9, 3],
    [1, 9, 7, 8, 3, 4, 5, 6, 2],
    [8, 2, 6, 1, 9, 5, 3, 4, 7],
    [3, 7, 4, 6, 8, 2, 9, 1, 5],
    [9, 5, 1, 7, 4, 3, 6, 2, 8],
    [5, 1, 9, 3, 2, 6, 8, 7, 4],
    [2, 4, 8, 9, 5, 7, 1, 3, 6],
    [7, 6, 3, 4, 1, 8, 2, 5, 9],
  ],
};

export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState('easy');
  const [board, setBoard] = useState(() => cloneGrid(PUZZLE_EASY.initial));
  const [initialBoard, setInitialBoard] = useState(() => cloneGrid(PUZZLE_EASY.initial));
  const [selectedCell, setSelectedCell] = useState([0, 0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);

  function cloneGrid(grid) {
    return grid.map((row) => [...row]);
  }

  const currentPuzzle = difficulty === 'easy' ? PUZZLE_EASY : PUZZLE_MEDIUM;

  const loadPuzzle = useCallback((diff) => {
    const p = diff === 'easy' ? PUZZLE_EASY : PUZZLE_MEDIUM;
    setDifficulty(diff);
    setInitialBoard(cloneGrid(p.initial));
    setBoard(cloneGrid(p.initial));
    setSelectedCell([0, 0]);
    setTime(0);
    setIsActive(true);
    setIsCompleted(false);
    setHintsLeft(3);
    if (soundEnabled) playSound.gameStart();
  }, [soundEnabled]);

  // Timer
  useEffect(() => {
    let interval = null;
    if (isActive && !isCompleted) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isCompleted]);

  // Check board completion
  useEffect(() => {
    let filled = true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0 || board[r][c] !== currentPuzzle.solution[r][c]) {
          filled = false;
          break;
        }
      }
      if (!filled) break;
    }

    if (filled && !isCompleted) {
      setIsCompleted(true);
      setIsActive(false);
      if (soundEnabled) playSound.celebration();
    }
  }, [board, currentPuzzle, isCompleted, soundEnabled]);

  // Handle cell selection
  const handleCellClick = (r, c) => {
    setSelectedCell([r, c]);
    if (soundEnabled) playSound.tileTap();
  };

  // Place number into selected cell
  const handleNumberInput = (num) => {
    if (isCompleted || !selectedCell) return;
    const [r, c] = selectedCell;

    // Do not overwrite initial puzzle numbers
    if (initialBoard[r][c] !== 0) {
      if (soundEnabled) playSound.error();
      return;
    }

    const newBoard = cloneGrid(board);
    newBoard[r][c] = num;
    setBoard(newBoard);

    if (soundEnabled) {
      if (num > 0) {
        playSound.numberPlaced(num);
      } else {
        playSound.erase();
      }
    }
  };

  // Use hint
  const handleHint = () => {
    if (hintsLeft <= 0 || !selectedCell || isCompleted) return;
    const [r, c] = selectedCell;
    if (initialBoard[r][c] !== 0) return;

    const correctVal = currentPuzzle.solution[r][c];
    const newBoard = cloneGrid(board);
    newBoard[r][c] = correctVal;
    setBoard(newBoard);
    setHintsLeft((h) => h - 1);
    if (soundEnabled) playSound.numberPlaced(correctVal);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedCell || isCompleted) return;
      const [r, c] = selectedCell;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        handleNumberInput(0);
      } else if (e.key === 'ArrowUp') {
        setSelectedCell([Math.max(0, r - 1), c]);
      } else if (e.key === 'ArrowDown') {
        setSelectedCell([Math.min(8, r + 1), c]);
      } else if (e.key === 'ArrowLeft') {
        setSelectedCell([r, Math.max(0, c - 1)]);
      } else if (e.key === 'ArrowRight') {
        setSelectedCell([r, Math.min(8, c + 1)]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, isCompleted, board, initialBoard]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const selectedValue = selectedCell ? board[selectedCell[0]][selectedCell[1]] : null;

  return (
    <div className="apple-card rounded-3xl p-4 sm:p-6 text-center max-w-lg mx-auto w-full relative overflow-hidden" data-physics-obstacle="true">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#b89562]" />
          <h3 className="font-serif text-base font-bold text-[#1d1d1f]">
            Wedding Sudoku
          </h3>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-[#86868b] hover:text-[#1d1d1f] transition-colors p-1"
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
          
          <div className="text-xs text-[#86868b] font-medium bg-[#f5f5f7] px-2.5 py-1 rounded-full border border-black/[0.04]">
            ⏱️ {formatTime(time)}
          </div>
        </div>
      </div>

      <p className="text-xs text-[#6e6e73] mb-3">
        Solve the wedding puzzle for Arif & Jahana. Touch a tile and select a number below.
      </p>

      {/* Difficulty & Controls bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex gap-1.5 p-1 bg-[#f5f5f7] rounded-xl text-xs font-semibold">
          <button
            onClick={() => loadPuzzle('easy')}
            className={`px-3 py-1 rounded-lg transition-all ${
              difficulty === 'easy' ? 'bg-white text-[#1d1d1f] shadow-sm font-bold' : 'text-[#86868b]'
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => loadPuzzle('medium')}
            className={`px-3 py-1 rounded-lg transition-all ${
              difficulty === 'medium' ? 'bg-white text-[#1d1d1f] shadow-sm font-bold' : 'text-[#86868b]'
            }`}
          >
            Medium
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleHint}
            disabled={hintsLeft <= 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-black/[0.08] text-xs font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] disabled:opacity-40"
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#b89562]" />
            <span>Hint ({hintsLeft})</span>
          </button>
          <button
            onClick={() => loadPuzzle(difficulty)}
            className="p-1.5 rounded-xl bg-white border border-black/[0.08] text-[#1d1d1f] hover:bg-[#f5f5f7]"
            title="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SUDOKU 9x9 GRID */}
      <div className="relative mx-auto max-w-[340px] aspect-square bg-[#1d1d1f] p-1.5 rounded-2xl shadow-apple-card border border-black/[0.08]">
        <div className="grid grid-cols-9 h-full w-full gap-[1px] bg-[#d2d2d7] rounded-xl overflow-hidden">
          {board.map((row, r) =>
            row.map((val, c) => {
              const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c;
              const isSameRowCol = selectedCell && (selectedCell[0] === r || selectedCell[1] === c);
              const isSameBox =
                selectedCell &&
                Math.floor(selectedCell[0] / 3) === Math.floor(r / 3) &&
                Math.floor(selectedCell[1] / 3) === Math.floor(c / 3);
              const isMatchingNum = selectedValue && val === selectedValue && val > 0;
              const isGiven = initialBoard[r][c] !== 0;

              // 3x3 block borders
              const borderRight = c % 3 === 2 && c !== 8 ? 'border-r-2 border-r-[#1d1d1f]' : '';
              const borderBottom = r % 3 === 2 && r !== 8 ? 'border-b-2 border-b-[#1d1d1f]' : '';

              let cellBg = 'bg-white';
              if (isSelected) {
                cellBg = 'bg-[#b89562]/25 ring-2 ring-[#b89562] z-10';
              } else if (isMatchingNum) {
                cellBg = 'bg-[#b89562]/15';
              } else if (isSameRowCol || isSameBox) {
                cellBg = 'bg-[#f7f7f9]';
              }

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`flex items-center justify-center font-display text-sm sm:text-base transition-colors duration-100 ${cellBg} ${borderRight} ${borderBottom} ${
                    isGiven ? 'font-black text-[#1d1d1f]' : 'font-semibold text-[#b89562]'
                  }`}
                >
                  {val > 0 ? val : ''}
                </button>
              );
            })
          )}
        </div>

        {/* Victory Celebration Modal */}
        {isCompleted && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-4 animate-fade-in-up z-20">
            <Heart className="w-10 h-10 text-[#b89562] fill-current mb-2 animate-bounce" />
            <h4 className="font-serif text-2xl text-[#1d1d1f] font-bold mb-1">Mabrook!</h4>
            <p className="text-xs text-[#6e6e73] mb-1">
              You completed the Wedding Sudoku in <strong>{formatTime(time)}</strong>!
            </p>
            <p className="text-[11px] text-[#86868b] italic mb-4 max-w-xs">
              "May Allah bless Arif & Jahana with love, wisdom, and eternal joy."
            </p>
            <button
              onClick={() => loadPuzzle(difficulty)}
              className="apple-pill-btn px-6 py-2.5 text-xs flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>

      {/* MOBILE NUMBER PAD (1-9 & Erase) */}
      <div className="mt-4 max-w-[340px] mx-auto space-y-2">
        <div className="grid grid-cols-9 gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              className="py-2.5 rounded-xl bg-white border border-black/[0.08] hover:bg-[#f5f5f7] active:scale-95 text-[#1d1d1f] font-display font-bold text-sm shadow-sm transition-all"
            >
              {num}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleNumberInput(0)}
          className="w-full py-2 rounded-xl bg-[#f5f5f7] hover:bg-[#e8e8ed] text-xs font-semibold text-[#6e6e73] flex items-center justify-center gap-1.5 transition-colors"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Erase Number</span>
        </button>
      </div>
    </div>
  );
}
