'use client';
// Template 02 — Interaction: Memory Puzzle (3x3 Photo Tile Swap)
// Interactive nostalgia photo tile puzzle for Template 02.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine } from '@/shared/audio/audio';
import { useHaptics } from '@/shared/components/useHaptics';

interface MemoryPuzzleProps {
  photoUrl: string;
  onClose: () => void;
  onSolve?: () => void;
}

// Generate a valid solvable 3x3 tile permutation by performing random pairwise swaps
function generateShuffledTiles(): number[] {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  // Perform 25 random swaps from solved state
  for (let i = 0; i < 25; i++) {
    const idx1 = Math.floor(Math.random() * 9);
    let idx2 = Math.floor(Math.random() * 9);
    while (idx2 === idx1) {
      idx2 = Math.floor(Math.random() * 9);
    }
    const temp = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = temp;
  }

  // Ensure it's not already solved on spawn
  let isAlreadySolved = arr.every((val, idx) => val === idx);
  if (isAlreadySolved) {
    const temp = arr[0];
    arr[0] = arr[1];
    arr[1] = temp;
  }
  return arr;
}

export function MemoryPuzzle({ photoUrl, onClose, onSolve }: MemoryPuzzleProps) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);
  const { vibrate } = useHaptics();

  useEffect(() => {
    setTiles(generateShuffledTiles());
  }, [photoUrl]);

  const handleShuffle = () => {
    vibrate();
    audioEngine.playPaper();
    setTiles(generateShuffledTiles());
    setSelectedIndex(null);
    setMoves(0);
    setIsSolved(false);
  };

  const handleTileClick = (index: number) => {
    if (isSolved) return;
    vibrate();

    if (selectedIndex === null) {
      // First tile selected
      setSelectedIndex(index);
      audioEngine.playPaper();
    } else if (selectedIndex === index) {
      // Deselect
      setSelectedIndex(null);
      audioEngine.playPaper();
    } else {
      // Swap tiles
      audioEngine.playPaper();
      const newTiles = [...tiles];
      const temp = newTiles[selectedIndex];
      newTiles[selectedIndex] = newTiles[index];
      newTiles[index] = temp;

      setTiles(newTiles);
      setSelectedIndex(null);
      const newMoves = moves + 1;
      setMoves(newMoves);

      // Check win condition
      const checkWin = newTiles.every((val, idx) => val === idx);
      if (checkWin) {
        setIsSolved(true);
        audioEngine.playMagic();

        // Spawn confetti particles
        const colors = ['#d4af37', '#e67e22', '#e74c3c', '#9b59b6', '#3498db', '#2ecc71'];
        const newConfetti = Array.from({ length: 30 }).map((_, i) => ({
          id: i,
          x: Math.random() * 100,
          color: colors[i % colors.length],
          delay: Math.random() * 0.4,
        }));
        setConfetti(newConfetti);

        if (onSolve) {
          onSolve();
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(10, 7, 6, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        color: '#FFF8F0',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .puzzle-handwritten {
          font-family: 'Caveat', cursive;
        }
      ` }} />

      {/* Confetti Explosion Overlay */}
      {isSolved && confetti.length > 0 && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}>
          {confetti.map((p) => (
            <motion.div
              key={p.id}
              initial={{ top: '-5%', left: `${p.x}%`, opacity: 1, scale: 1, rotate: 0 }}
              animate={{
                top: '105%',
                opacity: [1, 1, 0],
                rotate: 360 * 2,
              }}
              transition={{
                duration: 2.5,
                ease: 'easeOut',
                delay: p.delay,
              }}
              style={{
                position: 'absolute',
                width: 10,
                height: 10,
                borderRadius: p.id % 2 === 0 ? '50%' : '2px',
                background: p.color,
              }}
            />
          ))}
        </div>
      )}

      {/* Top Header Card */}
      <div style={{
        textAlign: 'center',
        marginBottom: 16,
        maxWidth: 420,
        width: '100%',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(212, 175, 55, 0.15)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: 20,
          padding: '4px 14px',
          marginBottom: 8,
        }}>
          <span style={{ fontSize: 14 }}>🧩</span>
          <span style={{
            fontFamily: 'var(--font-sans), system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.04em',
            fontStyle: 'normal',
            color: '#f3d999',
          }}>
            Nostalgia Memory Puzzle
          </span>
        </div>

        <h3 style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 700,
          color: '#FFF8F0',
          letterSpacing: '-0.01em',
        }}>
          {isSolved ? '🎉 Memory Restored!' : 'Restore the Shared Memory'}
        </h3>
        <p style={{
          margin: '4px 0 0 0',
          fontSize: 13,
          color: 'rgba(255, 248, 240, 0.7)',
        }}>
          {isSolved
            ? `You completed the puzzle in ${moves} moves!`
            : 'Tap a tile, then tap another to swap them into place.'}
        </p>
      </div>

      {/* Main 3x3 Puzzle Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 340,
        aspectRatio: '1 / 1',
        background: '#2a1a15',
        borderRadius: 16,
        padding: 10,
        border: '2px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
        overflow: 'hidden',
      }}>
        {/* Hint Layer Overlay */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 10,
                zIndex: 5,
                borderRadius: 10,
                overflow: 'hidden',
                backgroundImage: `url(${photoUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 0 20px rgba(0,0,0,0.8)',
              }}
            >
              <div style={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.75)',
                color: '#fff',
                fontSize: 11,
                padding: '4px 10px',
                borderRadius: 10,
              }}>
                Peek Hint
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3x3 Grid or Seamless Solved Image */}
        {isSolved ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 10,
              overflow: 'hidden',
              border: '2px solid rgba(212, 175, 55, 0.8)',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)',
              position: 'relative',
            }}
          >
            <img
              src={photoUrl}
              alt="Restored Shared Memory"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'rgba(46, 125, 50, 0.9)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
            }}>
              ✓ Memory Restored
            </div>
          </motion.div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: 6,
            width: '100%',
            height: '100%',
          }}>
            {tiles.map((tileVal, idx) => {
              const isSelected = selectedIndex === idx;

              // Calculate background offset for 3x3 image slice
              const row = Math.floor(tileVal / 3);
              const col = tileVal % 3;
              const bgX = col * 50; // 0%, 50%, 100%
              const bgY = row * 50; // 0%, 50%, 100%

              return (
                <motion.div
                  key={`tile-${idx}`}
                  onClick={() => handleTileClick(idx)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: isSelected ? 1.05 : 1,
                    borderColor: isSelected
                      ? '#ffd700'
                      : 'rgba(255, 255, 255, 0.15)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: 8,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundImage: `url(${photoUrl})`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${bgX}% ${bgY}%`,
                    border: isSelected
                      ? '3px solid #ffd700'
                      : '1px solid rgba(255,255,255,0.2)',
                    boxShadow: isSelected
                      ? '0 0 16px rgba(255, 215, 0, 0.7)'
                      : '0 4px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Tile indicator border overlay */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(255, 215, 0, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 16 }}>✨</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Solved Banner Animation */}
      <AnimatePresence>
        {isSolved && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              marginTop: 16,
              background: 'linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(230,126,34,0.25) 100%)',
              border: '1px solid rgba(212,175,55,0.6)',
              borderRadius: 14,
              padding: '10px 20px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: '1.1rem',
              fontStyle: 'italic',
              color: '#ffeaa7',
              display: 'block',
              lineHeight: 1.4,
            }}>
              "You complete our sibling story... 🥹✨"
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <div style={{
        marginTop: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        maxWidth: 340,
        width: '100%',
        justifyContent: 'space-between',
      }}>
        {/* Moves Counter */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          padding: '6px 14px',
          borderRadius: 20,
          fontSize: 13,
          color: 'rgba(255,248,240,0.8)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          Moves: <strong style={{ color: '#ffd700' }}>{moves}</strong>
        </div>

        {/* Buttons Row */}
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Hint Toggle */}
          {!isSolved && (
            <button
              onMouseDown={() => setShowHint(true)}
              onMouseUp={() => setShowHint(false)}
              onTouchStart={() => setShowHint(true)}
              onTouchEnd={() => setShowHint(false)}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFF8F0',
                borderRadius: 20,
                padding: '6px 14px',
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              👁️ Peek
            </button>
          )}

          {/* Shuffle Button */}
          {!isSolved && (
            <button
              onClick={handleShuffle}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFF8F0',
                borderRadius: 20,
                padding: '6px 14px',
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              🔄 Shuffle
            </button>
          )}

          {/* Close / Done Button */}
          <button
            onClick={onClose}
            style={{
              background: isSolved
                ? 'linear-gradient(135deg, #d4af37 0%, #e67e22 100%)'
                : 'rgba(255,255,255,0.15)',
              border: isSolved ? 'none' : '1px solid rgba(255,255,255,0.3)',
              color: '#FFF8F0',
              borderRadius: 20,
              padding: '6px 18px',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: 700,
              boxShadow: isSolved ? '0 4px 14px rgba(212,175,55,0.4)' : 'none',
            }}
          >
            {isSolved ? 'Continue ♡' : 'Close'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
