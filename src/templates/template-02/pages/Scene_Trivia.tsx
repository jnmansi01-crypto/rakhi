'use client';
// Template 02 — Scene: Interactive Sibling Vibe Check
// Perfect 1px Alignment between 3D Brass Stamp Tool and 3D Burgundy Wax Seal inside a shared 110x110 staging slot.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine } from '@/shared/audio/audio';
import { useHaptics } from '@/shared/components/useHaptics';
import { SwipeIndicator } from '../components/SwipeIndicator';
import type { Locale } from '@/lib/types';

interface Props {
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
  onBack?: () => void;
}

export function Scene_Trivia({ senderName, recipientName, locale, onComplete, onBack }: Props) {
  const [cardStep, setCardStep] = useState<1 | 2 | 3>(1);
  const [selectedDuo, setSelectedDuo] = useState<string | null>(null);
  const [selectedPower, setSelectedPower] = useState<string | null>(null);
  const [isStamping, setIsStamping] = useState(false);
  const [isImpact, setIsImpact] = useState(false);
  const [isPactStamped, setIsPactStamped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { vibrate } = useHaptics();

  const handlePickDuo = (id: string) => {
    vibrate();
    audioEngine.playPaper?.();
    setSelectedDuo(id);
    setTimeout(() => {
      setCardStep(2);
    }, 450);
  };

  const handlePickPower = (id: string) => {
    vibrate();
    audioEngine.playPaper?.();
    setSelectedPower(id);
    setTimeout(() => {
      setCardStep(3);
    }, 450);
  };

  const handleStampPact = () => {
    if (isPactStamped || isStamping) return;
    vibrate();
    audioEngine.playPaper?.();
    setIsStamping(true);

    // Stamping impact moment (t = 0.45s)
    setTimeout(() => {
      vibrate();
      audioEngine.playMagic?.();
      setIsImpact(true);
      setIsPactStamped(true);
      setShowConfetti(true);

      setTimeout(() => setIsImpact(false), 350);
    }, 450);

    // Lift stamp tool away (t = 0.9s)
    setTimeout(() => {
      setIsStamping(false);
    }, 900);
  };

  const handleContinue = () => {
    vibrate();
    audioEngine.playSwoosh?.();
    onComplete();
  };

  const DUOS = [
    {
      id: 'tom_jerry',
      icon: '🐱🐭',
      titleEn: 'Tom & Jerry',
      titleHi: 'टॉम और जेरी',
      descEn: 'Constant Bickering, Endless Love',
      descHi: 'लगातार नोंक-झोंक, अटूट प्यार',
    },
    {
      id: 'partners_crime',
      icon: '🕶️',
      titleEn: 'Partners in Crime',
      titleHi: 'पार्टनर्स इन क्राइम',
      descEn: 'Midnight Raids & Secret Keepers',
      descHi: 'रात में स्नैक्स चोरी और सीक्रेट्स',
    },
    {
      id: 'mastermind_minion',
      icon: '👑',
      titleEn: 'Mastermind & Minion',
      titleHi: 'बॉस और चेला',
      descEn: 'One Bosses, One Reluctantly Obeys',
      descHi: 'एक हुक्म चलाए, दूसरा मुस्कुराए',
    },
  ];

  const POWERS = [
    {
      id: 'telepathic_eyes',
      icon: '🙄',
      titleEn: 'Telepathic Eye-Rolls',
      titleHi: 'इशारों की भाषा',
      descEn: 'Full Gossip in Just One Glance',
      descHi: 'एक नज़र में पूरे कमरे की गॉसिप',
    },
    {
      id: 'snack_teleport',
      icon: '🍕',
      titleEn: 'Snack Teleportation',
      titleHi: 'स्नैक चोरी की कला',
      descEn: 'Making Treats Vanish Invisibly',
      descHi: 'फ्रिज से चीज़ें गायब करने की कला',
    },
    {
      id: 'invincible_vault',
      icon: '🤫',
      titleEn: 'Secret Vault',
      titleHi: 'सीक्रेट तिजोरी',
      descEn: 'Keeping Deepest Secrets Safe',
      descHi: 'सारे राज़ हमेशा महफ़ूज़ रखना',
    },
  ];

  // Confetti particles for pact seal
  const confettiParticles = Array.from({ length: 35 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#d4af37', '#e67e22', '#e74c3c', '#9b59b6', '#3498db', '#f1c40f'][i % 6],
    delay: Math.random() * 0.35,
  }));

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#120e0d',
      backgroundImage: 'radial-gradient(circle at center, #1f1412 0%, #080606 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
      overflowY: 'auto',
      color: '#FFF8F0',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .stamp-serif {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: normal;
        }
      ` }} />

      {/* Confetti Explosion Overlay */}
      {showConfetti && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}>
          {confettiParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ top: '40%', left: `${p.x}%`, opacity: 1, scale: 0.8, rotate: 0 }}
              animate={{
                top: ['40%', `${Math.random() * 100}%`],
                opacity: [1, 1, 0],
                rotate: 360 * 2,
              }}
              transition={{
                duration: 2.2,
                ease: 'easeOut',
                delay: p.delay,
              }}
              style={{
                position: 'absolute',
                width: 10,
                height: 10,
                borderRadius: p.id % 2 === 0 ? '50%' : '2px',
                background: p.color,
                boxShadow: '0 0 6px ' + p.color,
              }}
            />
          ))}
        </div>
      )}

      {/* Top-Left Swiftly Moving Animated Back Arrow Button */}
      {(onBack || cardStep > 1) && (
        <motion.button
          onClick={() => {
            vibrate();
            audioEngine.playSwoosh?.();
            if (cardStep > 1) {
              setCardStep((prev) => (prev - 1) as 1 | 2 | 3);
            } else if (onBack) {
              onBack();
            }
          }}
          animate={{ x: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'absolute', top: 16, left: 16,
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(242, 230, 207, 0.15)',
            border: '1px solid rgba(199, 151, 116, 0.4)',
            color: '#f2e6cf', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', cursor: 'pointer', zIndex: 30,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
          title="Go Back"
        >
          ←
        </motion.button>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={isImpact ? { scale: [1, 0.94, 1.05, 1], rotate: [0, -1.5, 1, 0] } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          maxWidth: 390,
          background: '#f2e6cf',
          backgroundImage: 'radial-gradient(circle at center, #f7eee0 0%, #ebe0c6 100%)',
          borderRadius: 20,
          padding: '32px 22px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.65), inset 0 0 40px rgba(0,0,0,0.06)',
          border: '1px solid rgba(199,151,116,0.4)',
          position: 'relative',
          color: '#3d2b1f',
          textAlign: 'center',
          overflow: 'visible',
        }}
      >
        {/* Scrapbook Tape Accent */}
        <div style={{
          position: 'absolute',
          top: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 90,
          height: 24,
          background: 'rgba(242,238,209,0.85)',
          border: '1px dashed rgba(0,0,0,0.12)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }} />

        {/* Clean Upright Step Header Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(163, 111, 77, 0.15)',
          border: '1px solid rgba(163, 111, 77, 0.3)',
          borderRadius: 20,
          padding: '6px 18px',
          marginBottom: 18,
        }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#8a5330',
            letterSpacing: '0.04em',
            fontStyle: 'normal',
          }}>
            {cardStep === 1
              ? (locale === 'hi' ? 'कार्ड 1 / 3: भाई-बहन की जोड़ी' : 'Card 1 of 3: Duo Dynamic')
              : cardStep === 2
              ? (locale === 'hi' ? 'कार्ड 2 / 3: हमारी सुपरपॉवर' : 'Card 2 of 3: Sibling Superpower')
              : (locale === 'hi' ? 'कार्ड 3 / 3: रक्षाबंधन संधि' : 'Card 3 of 3: Sibling Truce Pact')}
          </span>
        </div>

        {/* Step 1: Duo Archetype Picker */}
        <AnimatePresence mode="wait">
          {cardStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, rotateY: 90, scale: 0.94 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.94 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 700, color: '#3d2b1f', fontStyle: 'normal' }}>
                {locale === 'hi' ? 'हमारी जोड़ी चुनें!' : 'Pick Our Duo Dynamic!'}
              </h3>
              <p style={{ margin: '0 0 18px 0', fontSize: '0.82rem', color: '#7a6250', fontStyle: 'normal' }}>
                {locale === 'hi' ? 'हमारा असली रिश्ता कैसा है?' : 'What best describes our sibling bond?'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {DUOS.map((d) => {
                  const isSelected = selectedDuo === d.id;
                  return (
                    <motion.button
                      key={d.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePickDuo(d.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 16px',
                        borderRadius: 14,
                        background: isSelected ? 'rgba(199, 151, 116, 0.25)' : '#fff',
                        border: isSelected ? '2px solid #8a5330' : '1px solid rgba(199, 151, 116, 0.4)',
                        color: '#3d2b1f',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    >
                      <span style={{ fontSize: '2.2rem' }}>{d.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#3d2b1f', fontStyle: 'normal' }}>
                          {locale === 'hi' ? d.titleHi : d.titleEn}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#8a5330', marginTop: 2, fontWeight: 600, fontStyle: 'normal' }}>
                          {locale === 'hi' ? d.descHi : d.descEn}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Joint Superpower Picker */}
          {cardStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, rotateY: 90, scale: 0.94 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.94 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 700, color: '#3d2b1f', fontStyle: 'normal' }}>
                {locale === 'hi' ? 'हमारी सीक्रेट सुपरपॉवर क्या है?' : 'Select Our Sibling Superpower!'}
              </h3>
              <p style={{ margin: '0 0 18px 0', fontSize: '0.82rem', color: '#7a6250', fontStyle: 'normal' }}>
                {locale === 'hi' ? 'कौन सी जादू शक्ति हम दोनों में है?' : 'Which superpower do we share best?'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {POWERS.map((p) => {
                  const isSelected = selectedPower === p.id;
                  return (
                    <motion.button
                      key={p.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePickPower(p.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 16px',
                        borderRadius: 14,
                        background: isSelected ? 'rgba(199, 151, 116, 0.25)' : '#fff',
                        border: isSelected ? '2px solid #8a5330' : '1px solid rgba(199, 151, 116, 0.4)',
                        color: '#3d2b1f',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    >
                      <span style={{ fontSize: '2.2rem' }}>{p.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#3d2b1f', fontStyle: 'normal' }}>
                          {locale === 'hi' ? p.titleHi : p.titleEn}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#8a5330', marginTop: 2, fontWeight: 600, fontStyle: 'normal' }}>
                          {locale === 'hi' ? p.descHi : p.descEn}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 3: Perfectly Aligned 3D Stamp & Sealed Bond Page */}
          {cardStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, rotateY: 90, scale: 0.94 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.94 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontWeight: 700, color: '#3d2b1f', fontStyle: 'normal' }}>
                {isPactStamped
                  ? (locale === 'hi' ? '🎉 हमारा बॉन्ड पक्का! यादें अनलॉक हुईं' : '🎉 Our Bond Sealed! Memories Unlocked')
                  : (locale === 'hi' ? 'रक्षाबंधन संधि पर मुहर लगाएं! 📜' : 'Seal Our Unbreakable Sibling Bond! 📜')}
              </h3>

              <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: '#6e5645', lineHeight: 1.4, fontStyle: 'normal', padding: '0 10px' }}>
                {isPactStamped
                  ? (locale === 'hi'
                    ? 'हमारा बॉन्ड हमेशा अटूट रहेगा... चलिए पुरानी यादों का एल्बम देखें! 🥹✨'
                    : 'Our bond remains 100% unbreakable... Let\'s open our nostalgic memory album! 🥹✨')
                  : (locale === 'hi'
                    ? 'नीचे बटन पर टैप करें - 3D मुहर से संधि पक्की होगी!'
                    : 'Tap the button below to bring down the 3D Stamp and seal our bond!')}
              </p>

              {/* Screen Impact Flash Effect */}
              <AnimatePresence>
                {isImpact && (
                  <motion.div
                    initial={{ scale: 0.2, opacity: 0.9 }}
                    animate={{ scale: 2.8, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      top: '40%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 140, height: 140, borderRadius: '50%',
                      border: '4px solid #ffd700',
                      boxShadow: '0 0 35px #ffd700, inset 0 0 20px #e74c3c',
                      pointerEvents: 'none',
                      zIndex: 45,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* SHARED CENTER STAGING SLOT (110px x 110px): Guaranteed 100% 1px Perfect Alignment */}
              <div style={{
                position: 'relative',
                width: 110,
                height: 110,
                margin: '10px auto 24px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* 3D Brass Stamp Tool Placer (Matching Reference Screenshot 3) */}
                <AnimatePresence>
                  {isStamping && (
                    <motion.div
                      initial={{ scale: 3.6, opacity: 0, y: -70 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 1.8, opacity: 0, y: -30 }}
                      transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 110,
                        height: 110,
                        zIndex: 50,
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Brass Stamp Handle */}
                      <div style={{
                        width: 44,
                        height: 64,
                        background: 'linear-gradient(180deg, #d4af37 0%, #aa820a 50%, #634b04 100%)',
                        borderRadius: '22px 22px 6px 6px',
                        boxShadow: '0 18px 36px rgba(0,0,0,0.65), inset 0 2px 4px rgba(255,255,255,0.7)',
                        border: '2px solid #ffeaa7',
                      }} />

                      {/* Stamp Head Ring reading OUR BOND */}
                      <div style={{
                        width: 90,
                        height: 90,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #ffeaa7 0%, #d4af37 60%, #856414 100%)',
                        border: '2px solid #fff',
                        marginTop: -18,
                        boxShadow: '0 12px 24px rgba(0,0,0,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.68rem', fontWeight: 900, color: '#3d2b1f', letterSpacing: '0.08em',
                      }}>
                        OUR BOND
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 3D Round Burgundy Wax Seal (Matching Reference Screenshot 2) */}
                {isPactStamped && (
                  <motion.div
                    initial={{ scale: 3.2, opacity: 0, rotate: -20 }}
                    animate={{ scale: [3.2, 0.88, 1.12, 1], opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 30%, #6e1c24 0%, #4a1016 65%, #29060a 100%)',
                      border: '3px solid #5a1418',
                      boxShadow: '0 14px 35px rgba(0,0,0,0.65), inset 0 3px 6px rgba(255,255,255,0.3), inset 0 -4px 8px rgba(0,0,0,0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffeaa7',
                      position: 'relative',
                    }}
                  >
                    <span style={{ fontSize: 20, marginBottom: 2, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.6))' }}>🌹</span>
                    <span style={{
                      fontSize: 7.5, fontWeight: 900, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: '#ffeaa7', textAlign: 'center',
                      lineHeight: 1.2, textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    }}>
                      OUR BOND<br />
                      <span style={{ fontSize: 6, opacity: 0.85, fontWeight: 700 }}>SEALED WITH LOVE</span>
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Action Button: Warm Leather Pill Button (Matching Screenshots 1 & 2) */}
              {!isPactStamped ? (
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 10px 25px rgba(110,61,35,0.5)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleStampPact}
                  disabled={isStamping}
                  style={{
                    padding: '14px 32px',
                    borderRadius: 30,
                    background: 'linear-gradient(135deg, #6e3d23 0%, #422312 100%)',
                    color: '#e8c68c',
                    border: '1.5px solid #d4af37',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>📜 PRESS TO SEAL OUR BOND</span>
                </motion.button>
              ) : (
                <div style={{ marginTop: 4 }}>
                  <SwipeIndicator
                    label={locale === 'hi' ? 'स्वाइप' : 'Swipe'}
                    onClick={handleContinue}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
