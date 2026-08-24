'use client';
// Template 02 — Scene: Interactive Sibling Vibe Check
// 3 highly interactive sibling cards with clean upright typography & 3D Stamp Placer.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine } from '@/shared/audio/audio';
import { useHaptics } from '@/shared/components/useHaptics';
import type { Locale } from '@/lib/types';

interface Props {
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
}

export function Scene_Trivia({ senderName, recipientName, locale, onComplete }: Props) {
  const [cardStep, setCardStep] = useState<1 | 2 | 3>(1);
  const [selectedDuo, setSelectedDuo] = useState<string | null>(null);
  const [selectedPower, setSelectedPower] = useState<string | null>(null);
  const [isStamping, setIsStamping] = useState(false);
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
      setIsPactStamped(true);
      setShowConfetti(true);
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
      descEn: 'Constant bickering, but zero life without each other!',
      descHi: 'लगातार नोंक-झोंक, पर एक-दूसरे के बिना अधूरे!',
    },
    {
      id: 'partners_crime',
      icon: '🕵️‍♂️🕵️‍♀️',
      titleEn: 'Partners in Crime',
      titleHi: 'पार्टनर्स इन क्राइम',
      descEn: 'Co-conspirators of midnight snack raids & secret keeping.',
      descHi: 'रात में स्नैक्स चोरी और हर शैतानी के पक्के राजदार!',
    },
    {
      id: 'mastermind_minion',
      icon: '😈👑',
      titleEn: 'Mastermind & Minion',
      titleHi: 'बॉस और चेला',
      descEn: 'One commands with authority, the other reluctantly agrees!',
      descHi: 'एक हुक्म चलाता है, दूसरा मुस्कुराकर मान लेता है!',
    },
  ];

  const POWERS = [
    {
      id: 'telepathic_eyes',
      icon: '🙄',
      titleEn: 'Telepathic Eye-Rolls',
      titleHi: 'इशारों की भाषा',
      descEn: 'Sharing full gossip across a crowded room in just one glance.',
      descHi: 'एक नज़र में ही पूरे कमरे की सीक्रेट बात समझ जाना।',
    },
    {
      id: 'snack_teleport',
      icon: '🍕',
      titleEn: 'Snack Teleportation',
      titleHi: 'स्नैक चोरी की कला',
      descEn: 'Making chocolates & treats vanish from the fridge invisibly.',
      descHi: 'फ्रिज से चुपके से पसंदीदा मिठाइयां गायब कर देना।',
    },
    {
      id: 'invincible_vault',
      icon: '🤫',
      titleEn: 'Invincible Vault',
      titleHi: 'सीक्रेट तिजोरी',
      descEn: 'Keeping each other’s deepest secrets safe forever.',
      descHi: 'एक-दूसरे के सारे राज़ हमेशा के लिए सुरक्षित रखना।',
    },
  ];

  // Confetti particles for pact seal
  const confettiParticles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#d4af37', '#e67e22', '#e74c3c', '#9b59b6', '#3498db'][i % 5],
    delay: Math.random() * 0.3,
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
              initial={{ top: '-5%', left: `${p.x}%`, opacity: 1, scale: 1, rotate: 0 }}
              animate={{
                top: '105%',
                opacity: [1, 1, 0],
                rotate: 360 * 2,
              }}
              transition={{
                duration: 2.4,
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

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#f2e6cf',
          backgroundImage: 'radial-gradient(circle at center, #f7eee0 0%, #ebe0c6 100%)',
          borderRadius: 20,
          padding: '28px 20px',
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
          background: 'rgba(242,238,209,0.7)',
          border: '1px dashed rgba(0,0,0,0.1)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }} />

        {/* Clean Upright Step Header Badge (No Italics) */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(163, 111, 77, 0.15)',
          border: '1px solid rgba(163, 111, 77, 0.3)',
          borderRadius: 20,
          padding: '6px 16px',
          marginBottom: 16,
        }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#8a5330',
            letterSpacing: '0.04em',
            fontStyle: 'normal',
          }}>
            {cardStep === 1
              ? (locale === 'hi' ? 'कार्ड 1 / 3: भाई-बहन की जोड़ी' : 'Card 1 of 3: Sibling Duo Type')
              : cardStep === 2
              ? (locale === 'hi' ? 'कार्ड 2 / 3: हमारी सुपरपॉवर' : 'Card 2 of 3: Joint Superpower')
              : (locale === 'hi' ? 'कार्ड 3 / 3: रक्षाबंधन संधि' : 'Card 3 of 3: Sibling Truce Pact')}
          </span>
        </div>

        {/* Step 1: Duo Archetype Picker */}
        <AnimatePresence mode="wait">
          {cardStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 700, color: '#3d2b1f', fontStyle: 'normal' }}>
                {locale === 'hi' ? 'हमारी ऑफिशियल जोड़ी चुनें!' : 'Pick Our Official Duo Dynamic!'}
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.82rem', color: '#7a6250', fontStyle: 'normal' }}>
                {locale === 'hi' ? 'हमारा असली रिश्ता कैसा है?' : 'What best describes our sibling bond?'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                        gap: 12,
                        padding: '12px 14px',
                        borderRadius: 14,
                        background: isSelected ? 'rgba(199, 151, 116, 0.25)' : '#fff',
                        border: isSelected ? '2px solid #8a5330' : '1px solid rgba(199, 151, 116, 0.4)',
                        color: '#3d2b1f',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                      }}
                    >
                      <span style={{ fontSize: '1.8rem' }}>{d.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#3d2b1f', fontStyle: 'normal' }}>
                          {locale === 'hi' ? d.titleHi : d.titleEn}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#6e5645', marginTop: 2, fontStyle: 'normal' }}>
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 700, color: '#3d2b1f', fontStyle: 'normal' }}>
                {locale === 'hi' ? 'हमारी सीक्रेट सुपरपॉवर क्या है?' : 'Select Our Joint Sibling Superpower!'}
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.82rem', color: '#7a6250', fontStyle: 'normal' }}>
                {locale === 'hi' ? 'कौन सी जादू शक्ति हम दोनों में है?' : 'Which superpower do we share best?'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                        gap: 12,
                        padding: '12px 14px',
                        borderRadius: 14,
                        background: isSelected ? 'rgba(199, 151, 116, 0.25)' : '#fff',
                        border: isSelected ? '2px solid #8a5330' : '1px solid rgba(199, 151, 116, 0.4)',
                        color: '#3d2b1f',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                      }}
                    >
                      <span style={{ fontSize: '1.8rem' }}>{p.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#3d2b1f', fontStyle: 'normal' }}>
                          {locale === 'hi' ? p.titleHi : p.titleEn}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#6e5645', marginTop: 2, fontStyle: 'normal' }}>
                          {locale === 'hi' ? p.descHi : p.descEn}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 3: Interactive 3D Truce Seal Stamp */}
          {cardStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
            >
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontWeight: 700, color: '#3d2b1f', fontStyle: 'normal' }}>
                {isPactStamped
                  ? (locale === 'hi' ? '🎉 हमारा बॉन्ड पक्का! यादें अनलॉक हुईं' : '🎉 Our Bond Sealed! Memories Unlocked')
                  : (locale === 'hi' ? 'रक्षाबंधन संधि पर मुहर लगाएं! 📜' : 'Seal Our Unbreakable Sibling Bond! 📜')}
              </h3>

              <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#6e5645', lineHeight: 1.4, fontStyle: 'normal' }}>
                {isPactStamped
                  ? (locale === 'hi'
                    ? 'हमारा बॉन्ड हमेशा अटूट रहेगा... चलिए पुरानी यादों का एल्बम देखें! 🥹✨'
                    : 'Our bond remains 100% unbreakable... Let\'s open our nostalgic memory album! 🥹✨')
                  : (locale === 'hi'
                    ? 'नीचे बटन पर टैप करें - 3D मुहर से संधि पक्की होगी!'
                    : 'Tap the button below to bring down the 3D Stamp and seal our bond!')}
              </p>

              {/* 3D Stamp Tool Placer (Facing Card, Zooms from Viewer Screen onto Parchment Card) */}
              <AnimatePresence>
                {isStamping && (
                  <motion.div
                    initial={{ scale: 3.6, opacity: 0, y: -60, rotate: -8 }}
                    animate={{
                      scale: [3.6, 0.92, 1],
                      opacity: [0, 1, 1],
                      y: [-60, 8, 0],
                      rotate: [-8, 2, 0],
                    }}
                    exit={{ scale: 3.8, opacity: 0, y: -40 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: 'absolute',
                      top: '18%',
                      zIndex: 45,
                      pointerEvents: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.75))',
                    }}
                  >
                    {/* Top: Wooden Handle Grip (Facing Viewer) */}
                    <div style={{
                      width: 44,
                      height: 65,
                      background: 'radial-gradient(circle at 40% 30%, #6e462b 0%, #3e2413 70%, #201007 100%)',
                      borderRadius: '24px 24px 10px 10px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.6), inset 0 3px 6px rgba(255,255,255,0.3)',
                      border: '1.5px solid #8c5d3b',
                    }} />

                    {/* Middle: Heavy Polished Brass Neck Collar */}
                    <div style={{
                      width: 60,
                      height: 18,
                      background: 'linear-gradient(90deg, #aa820a 0%, #ffd700 45%, #e5c97a 60%, #866418 100%)',
                      borderRadius: 6,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
                      marginTop: -2,
                    }} />

                    {/* Bottom: Brass Circular Stamping Die Plate (Facing Down onto Card) */}
                    <div style={{
                      width: 114,
                      height: 114,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 40% 35%, #ffd700 0%, #d4af37 40%, #aa820a 85%, #664d05 100%)',
                      border: '4px solid #866418',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.6), inset 0 3px 8px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.7)',
                      marginTop: -8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4a3602',
                    }}>
                      <div style={{
                        width: 90, height: 90, borderRadius: '50%',
                        border: '2px dashed #866418',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '0.1em',
                        fontStyle: 'normal',
                      }}>
                        OUR BOND
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Unstamped Interactive Button vs Stamped 3D Burgundy Wax Seal */}
              {!isPactStamped ? (
                /* Unstamped State: Sleek Golden Interactive Button */
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStampPact}
                  disabled={isStamping}
                  style={{
                    padding: '14px 28px',
                    borderRadius: 30,
                    background: 'linear-gradient(135deg, #8a5330 0%, #5c351e 100%)',
                    border: '2px solid #d4af37',
                    color: '#ffeaa7',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: '0 8px 22px rgba(92, 53, 30, 0.45), inset 0 1px 2px rgba(255,255,255,0.25)',
                    marginBottom: 24,
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>📜</span>
                  <span className="stamp-serif" style={{ letterSpacing: '0.06em', fontStyle: 'normal' }}>
                    {locale === 'hi' ? 'सीक्रेट संधि पर मुहर लगाएं' : 'PRESS TO SEAL OUR BOND'}
                  </span>
                </motion.button>
              ) : (
                /* Stamped State: Authentic 3D Circular Burgundy Wax Seal */
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 15 }}
                  style={{
                    width: 132,
                    height: 132,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%, #5e1825 0%, #3e0e18 55%, #22060c 100%)',
                    border: '5px solid #4a101b',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.65), inset 0 3px 6px rgba(255,255,255,0.28), inset 0 -6px 14px rgba(0,0,0,0.85), 0 0 24px rgba(110,26,40,0.45)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                    marginBottom: 22,
                    position: 'relative',
                  }}
                >
                  {/* Outer Indented Concentric Wax Ring */}
                  <div style={{
                    position: 'absolute',
                    inset: 9,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)',
                    pointerEvents: 'none',
                  }} />

                  {/* Inner Indented Wax Ring */}
                  <div style={{
                    position: 'absolute',
                    inset: 13,
                    borderRadius: '50%',
                    border: '1px solid rgba(0, 0, 0, 0.5)',
                    pointerEvents: 'none',
                  }} />

                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 -1px 1px rgba(255,255,255,0.2))',
                  }}>
                    <span style={{ fontSize: 26, lineHeight: 1 }}>🌹</span>
                    <span className="stamp-serif" style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: '#ebd3d8',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 -1px 1px rgba(255,255,255,0.25)',
                      marginTop: 3,
                      fontStyle: 'normal',
                    }}>
                      OUR BOND
                    </span>
                    <span style={{
                      fontSize: 8,
                      color: 'rgba(235,211,216,0.75)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginTop: 1,
                      fontStyle: 'normal',
                    }}>
                      SEALED WITH LOVE
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Continue Button */}
              {isPactStamped && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContinue}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: 24,
                    background: 'linear-gradient(135deg, #c79774 0%, #8a5330 100%)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(138, 83, 48, 0.35)',
                    fontStyle: 'normal',
                  }}
                >
                  {locale === 'hi' ? 'यादें देखें →' : 'View Memories →'}
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
