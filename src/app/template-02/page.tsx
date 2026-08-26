'use client';
// src/app/template-02/page.tsx
// Dedicated Mobile-First Landing Page for Template 02 ("Nostalgia Scrapbook")
// Creative Hook Alignment: "What if your Rakhi gift had a plot twist?"
// Plays '/AI Ad Loment.MP4' inside 3D Smartphone Mockup for Receiver & Sender Experience.

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { trackSelectItem } from '@/core/payments/analytics';

export default function Template02LandingPage() {
  const router = useRouter();
  const { vibrate } = useHaptics();
  const [locale, setLocale] = useState<'en' | 'hi'>('en');
  const [activeMediaTab, setActiveMediaTab] = useState<'receiver' | 'sender'>('receiver');
  const [isMuted, setIsMuted] = useState(false);
  const [isReceiverPlaying, setIsReceiverPlaying] = useState(false);
  const [senderStepIdx, setSenderStepIdx] = useState(0);

  const receiverVideoRef = useRef<HTMLVideoElement>(null);
  const senderVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.classList.add('sender-flow');
    return () => {
      document.body.classList.remove('sender-flow');
    };
  }, []);

  // Automated cycling for Sender Creation Video slideshow (fallback)
  useEffect(() => {
    if (activeMediaTab !== 'sender') return;
    const interval = setInterval(() => {
      setSenderStepIdx(prev => (prev + 1) % SENDER_DEMO_STEPS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [activeMediaTab]);

  const toggleMute = () => {
    vibrate();
    setIsMuted(prev => {
      const next = !prev;
      if (receiverVideoRef.current) receiverVideoRef.current.muted = next;
      if (senderVideoRef.current) senderVideoRef.current.muted = next;
      return next;
    });
  };

  const handleStartReceiverVideo = () => {
    vibrate();
    setIsReceiverPlaying(true);
    if (receiverVideoRef.current) {
      receiverVideoRef.current.play().catch(() => {});
    }
  };

  // ── 24-Hour Offer Countdown Timer ────────────────────────────
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 54,
    seconds: 12,
  });

  useEffect(() => {
    const defaultDuration = (23 * 3600 + 54 * 60 + 12) * 1000;
    let endTime: number;
    const stored = typeof window !== 'undefined' ? localStorage.getItem('loment_select_offer_end_time') : null;
    
    if (stored) {
      endTime = parseInt(stored, 10);
      if (endTime < Date.now()) {
        endTime = Date.now() + defaultDuration;
        if (typeof window !== 'undefined') {
          localStorage.setItem('loment_select_offer_end_time', endTime.toString());
        }
      }
    } else {
      endTime = Date.now() + defaultDuration;
      if (typeof window !== 'undefined') {
        localStorage.setItem('loment_select_offer_end_time', endTime.toString());
      }
    }

    const interval = setInterval(() => {
      let diff = Math.floor((endTime - Date.now()) / 1000);
      
      if (diff <= 0) {
        // Reset the timer
        endTime = Date.now() + defaultDuration;
        if (typeof window !== 'undefined') {
          localStorage.setItem('loment_select_offer_end_time', endTime.toString());
        }
        diff = Math.floor((endTime - Date.now()) / 1000);
      }
      
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ── Dynamic Slot Claim Reduction (Every 45 mins) ───────────────
  const [claimOffset, setClaimOffset] = useState(0);

  useEffect(() => {
    let startTime: number;
    const stored = typeof window !== 'undefined' ? localStorage.getItem('loment_slot_claim_start_time') : null;
    if (stored) {
      startTime = parseInt(stored, 10);
    } else {
      startTime = Date.now();
      if (typeof window !== 'undefined') {
        localStorage.setItem('loment_slot_claim_start_time', startTime.toString());
      }
    }

    const updateOffset = () => {
      const elapsedMs = Math.max(0, Date.now() - startTime);
      const blocks45Mins = Math.floor(elapsedMs / (45 * 60 * 1000));
      setClaimOffset(blocks45Mins * 4);
    };

    updateOffset();
    const interval = setInterval(updateOffset, 60000);
    return () => clearInterval(interval);
  }, []);

  const t2ClaimedNum = Math.min(1493, 1140 + claimOffset);
  const t2RemainingNum = Math.max(7, 1500 - t2ClaimedNum);
  const t2PercentNum = Math.min(99, Math.round((t2ClaimedNum / 1500) * 100));

  const handleCreate = () => {
    vibrate();
    trackSelectItem('template-02');
    router.push('/create?template=template-02');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Caveat:wght@600;700&family=Yatra+One&display=swap');

        html, body {
          overflow-y: auto !important;
          height: auto !important;
          touch-action: auto !important;
          background: #f5efe6 !important;
          color: #2b231d !important;
          font-family: var(--font-sans);
        }
        .tpl2-landing-page {
          min-height: 100vh;
          background: #f5efe6;
          background-image: radial-gradient(circle at top center, #fdfbf7 0%, #eae1d2 100%);
          color: #2b231d;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 64px 18px 110px 18px;
          overflow-x: hidden;
          position: relative;
        }
        .craft-cardstock-light {
          background: #fcf8f2;
          background-image: radial-gradient(circle at center, #ffffff 0%, #f4ede2 100%);
          color: #2b231d;
          border: 1.5px solid rgba(199, 151, 116, 0.45);
          border-radius: 20px;
          box-shadow: 
            0 12px 35px rgba(74, 52, 43, 0.08),
            inset 0 0 15px rgba(255, 255, 255, 0.9),
            3px 3px 0 #e5dac9;
        }
        .handwritten-text {
          font-family: 'Caveat', cursive !important;
        }
        /* 3D Mobile Phone Frame */
        .phone-mockup-3d-wide {
          position: relative;
          width: 100%;
          max-width: 390px;
          height: 560px;
          background: #1c1412;
          border-radius: 40px;
          padding: 10px;
          border: 3.5px solid #c79774;
          box-shadow: 
            0 25px 65px rgba(74, 52, 43, 0.25),
            0 0 35px rgba(199, 151, 116, 0.3),
            inset 0 0 0 2px rgba(244, 237, 226, 0.6);
          transform: perspective(1000px) rotateX(1.5deg);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .phone-mockup-3d-wide:hover {
          transform: perspective(1000px) rotateX(0deg) scale(1.01);
          box-shadow: 
            0 30px 75px rgba(74, 52, 43, 0.35),
            0 0 45px rgba(199, 151, 116, 0.45);
        }
        .phone-notch {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          width: 96px;
          height: 18px;
          background: #1c1412;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .phone-camera-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0d0706;
          border: 1px solid rgba(199,151,116,0.4);
        }
        .phone-screen {
          width: 100%;
          height: 100%;
          border-radius: 32px;
          overflow: hidden;
          background: #0d0706;
          position: relative;
        }
      ` }} />

      {/* ── FIXED TOP FLASH SALE COUNTDOWN BAR ── */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        background: 'linear-gradient(90deg, #4a1c14 0%, #8a2b1a 40%, #5c2014 70%, #4a1c14 100%)',
        borderBottom: '2px solid #c79774',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(138,43,26,0.3)',
      }}>
        <span style={{ fontSize: '0.78rem', color: '#ffd700', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {locale === 'hi' ? '📜 प्लॉट ट्विस्ट ऑफर • 75% डिस्काउंट' : '📜 RAKHI PLOT TWIST OFFER • 75% OFF'}
        </span>
        <span style={{ height: 12, width: 1, background: 'rgba(255,255,255,0.4)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'monospace', fontWeight: 800, fontSize: '0.85rem', color: '#fff' }}>
          <span style={{ background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(199,151,116,0.5)', color: '#ffd700' }}>
            {String(timeLeft.hours).padStart(2, '0')}h
          </span>
          :
          <span style={{ background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(199,151,116,0.5)', color: '#ffd700' }}>
            {String(timeLeft.minutes).padStart(2, '0')}m
          </span>
          :
          <span style={{ background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(199,151,116,0.5)', color: '#ffd700' }}>
            {String(timeLeft.seconds).padStart(2, '0')}s
          </span>
        </div>
      </div>

      <div className="tpl2-landing-page">
        {/* Top Brand & Language Bar */}
        <div style={{ width: '100%', maxWidth: 480, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/images/loment-logo.svg" alt="Loment Logo" style={{ width: 22, height: 22, objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2b231d', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Loment
            </span>
          </div>

          <button
            onClick={() => { vibrate(); setLocale(l => l === 'en' ? 'hi' : 'en'); }}
            style={{
              background: '#ffffff',
              border: '1.5px solid rgba(199,151,116,0.5)',
              color: '#8a2b1a',
              borderRadius: 20, padding: '5px 14px',
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            {locale === 'en' ? 'हिन्दी' : 'English'}
          </button>
        </div>

        {/* ── HERO SECTION ── */}
        <div style={{ textAlign: 'center', width: '100%', maxWidth: 480, marginBottom: 20 }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ffffff', border: '1.5px solid rgba(199,151,116,0.5)', borderRadius: 20, padding: '4px 14px', marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '0.72rem', color: '#8a2b1a', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              📜 TEMPLATE 02 • THE NOSTALGIA SCRAPBOOK
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 'clamp(1.9rem, 6vw, 2.6rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: 10,
            color: '#2b231d',
          }}>
            {locale === 'hi' 
              ? 'क्या हो अगर आपके राखी गिफ्ट में एक प्लॉट ट्विस्ट हो? 📜✨'
              : 'What if your Rakhi gift had a plot twist? 📜✨'}
          </h1>

          <p className="handwritten-text" style={{
            fontSize: '1.38rem',
            color: '#8a2b1a',
            lineHeight: 1.3,
            marginBottom: 12,
            fontWeight: 700,
          }}>
            {locale === 'hi'
              ? '"कोई नुकसान नहीं, बस अनमोल यादों का प्यारा सरप्राइज! 🤫"'
              : '"No siblings were harmed making this, but core memories were unlocked 🤫✨"'}
          </p>

          <p style={{
            fontSize: '0.88rem',
            color: 'rgba(43,35,29,0.8)',
            lineHeight: 1.55,
            margin: '0 auto 18px auto',
            maxWidth: 430,
          }}>
            {locale === 'hi'
              ? 'एक और साधारण मिठाई या राखी भेजने के बजाय, उन्हें कुछ ऐसा दें जो उन्होंने कभी नहीं देखा: 3D पोलरॉइड यादें, छिपा हुआ खत और सरप्राइज पार्सल।'
              : 'Instead of sending another plain box, give your sibling a feeling they’ve never experienced before—a personalized 3D memory scrapbook wrapped with a real plot twist.'}
          </p>

          {/* ── PROMINENT DIGITAL COUNTDOWN HERO CLOCK ── */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'linear-gradient(135deg, #4a1c14 0%, #2b130e 100%)',
              border: '1.5px solid #c79774',
              borderRadius: 20,
              padding: '16px 18px',
              marginBottom: 18,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 12px 35px rgba(74,28,20,0.25)',
              color: '#FFF8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: '#ff8a65', fontWeight: 800, letterSpacing: '0.04em' }}>
                {locale === 'hi' ? '⚡ रक्षाबंधन स्पेशल ऑफर' : '⚡ RAKSHA BANDHAN FESTIVAL OFFER'}
              </span>
              <span style={{ background: '#c79774', color: '#0d0706', fontSize: '0.65rem', fontWeight: 900, padding: '2px 8px', borderRadius: 12, textTransform: 'uppercase' }}>
                75% OFF
              </span>
            </div>
            
            {/* Big Flip Digital Countdown Clock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: '#0e0706', border: '1px solid #c79774', borderRadius: 8, padding: '6px 12px', fontSize: '1.35rem', fontWeight: 800, color: '#ffd700', fontFamily: 'monospace', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,248,240,0.6)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>HOURS</span>
              </div>
              <span style={{ fontSize: '1.3rem', color: '#c79774', fontWeight: 800, marginBottom: 14 }}>:</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: '#0e0706', border: '1px solid #c79774', borderRadius: 8, padding: '6px 12px', fontSize: '1.35rem', fontWeight: 800, color: '#ffd700', fontFamily: 'monospace', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,248,240,0.6)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MINUTES</span>
              </div>
              <span style={{ fontSize: '1.3rem', color: '#c79774', fontWeight: 800, marginBottom: 14 }}>:</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: '#0e0706', border: '1px solid #c79774', borderRadius: 8, padding: '6px 12px', fontSize: '1.35rem', fontWeight: 800, color: '#ff8a65', fontFamily: 'monospace', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,248,240,0.6)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SECONDS</span>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'rgba(255,248,240,0.85)', margin: 0 }}>
              {locale === 'hi'
                ? '⚠️ टाइमर समाप्त होने पर कीमत ₹999 पर वापस आ जाएगी!'
                : '⚠️ Price reverts to ₹999 when timer expires!'}
            </p>
          </motion.div>

          {/* ── PRICE & SCARCITY CRAFT CARD ── */}
          <div className="craft-cardstock-light" style={{
            padding: '16px 18px',
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontSize: '1rem', color: 'rgba(43,35,29,0.5)', textDecoration: 'line-through', fontWeight: 500 }}>
                ₹999/-
              </span>
              <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#8a2b1a', fontFamily: 'Playfair Display, Georgia, serif' }}>
                ₹250/-
              </span>
              <span style={{ background: '#8a2b1a', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '3px 9px', borderRadius: 12 }}>
                SAVE 75%
              </span>
            </div>

            {/* Urgency Meter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8a2b1a', fontWeight: 700 }}>
                <span>🔥 {t2ClaimedNum.toLocaleString()} / 1,500 slots claimed</span>
                <span>{t2PercentNum}% full</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'rgba(43,35,29,0.12)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${t2PercentNum}%`, height: '100%', background: 'linear-gradient(90deg, #c79774, #8a2b1a)', borderRadius: 3 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(43,35,29,0.75)' }}>
                <span>⚡ 184 people creating right now</span>
                <span style={{ color: '#2e7d32', fontWeight: 700 }}>Only {t2RemainingNum} left at ₹250!</span>
              </div>
            </div>
          </div>

          {/* Main CTA */}
          <motion.button
            onClick={handleCreate}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            style={{
              width: '100%',
              padding: '16px 24px',
              borderRadius: 100,
              background: 'linear-gradient(135deg, #8a2b1a 0%, #5c1b10 100%)',
              color: '#FFF8F0',
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              border: '1.5px solid #c79774',
              boxShadow: '0 6px 20px rgba(138,43,26,0.35)',
              cursor: 'pointer',
            }}
          >
            {locale === 'hi' ? 'गिफ्ट में एक प्लॉट ट्विस्ट दें (₹250/-) →' : 'GIVE THEM A PLOT TWIST (₹250/-) →'}
          </motion.button>
        </div>

        {/* ── 3D MOBILE DEVICE FRAME SHOWCASE ── */}
        <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}>
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.3rem', fontWeight: 700, color: '#2b231d', marginBottom: 4 }}>
              {locale === 'hi' ? 'देखें प्लॉट ट्विस्ट कैसे काम करता है 🎬' : 'Watch The Plot Twist Unfold 🎬'}
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'rgba(43,35,29,0.75)', margin: 0 }}>
              {locale === 'hi' ? 'आरव और अनन्या का सैंपल अनुभव यहाँ देखें:' : 'Showing Aarav & Ananya’s Rakhi gift sample:'}
            </p>
          </div>

          {/* Segmented Control Tabs */}
          <div style={{ display: 'flex', width: '100%', maxWidth: 390, background: '#ffffff', borderRadius: 14, padding: 4, marginBottom: 16, border: '1.5px solid rgba(199,151,116,0.4)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <button
              onClick={() => { vibrate(); setActiveMediaTab('receiver'); }}
              style={{
                flex: 1, padding: '9px 12px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
                background: activeMediaTab === 'receiver' ? 'linear-gradient(135deg, #8a2b1a 0%, #5c1b10 100%)' : 'transparent',
                color: activeMediaTab === 'receiver' ? '#FFF8F0' : 'rgba(43,35,29,0.7)',
              }}
            >
              📱 {locale === 'hi' ? 'प्राप्तकर्ता का अनुभव' : 'Receiver View'}
            </button>
            <button
              onClick={() => { vibrate(); setActiveMediaTab('sender'); }}
              style={{
                flex: 1, padding: '9px 12px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
                background: activeMediaTab === 'sender' ? 'linear-gradient(135deg, #8a2b1a 0%, #5c1b10 100%)' : 'transparent',
                color: activeMediaTab === 'sender' ? '#FFF8F0' : 'rgba(43,35,29,0.7)',
              }}
            >
              ✍️ {locale === 'hi' ? 'बनाने का तरीका' : 'Sender Creation'}
            </button>
          </div>

          {/* ── 3D PHONE MOCKUP FRAME ── */}
          <div className="phone-mockup-3d-wide">
            {/* Top camera notch */}
            <div className="phone-notch">
              <div className="phone-camera-dot" />
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleMute}
              style={{
                position: 'absolute', top: 20, right: 20,
                background: 'rgba(0,0,0,0.85)',
                border: '1px solid rgba(199,151,116,0.6)',
                color: '#FFF8F0', borderRadius: 20, padding: '4px 10px',
                fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer',
                backdropFilter: 'blur(8px)', zIndex: 30, pointerEvents: 'auto',
              }}
            >
              {isMuted ? '🔇 Audio Off' : '🔊 Audio On'}
            </button>

            {/* Screen Media Container */}
            <div className="phone-screen">
              {activeMediaTab === 'receiver' ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  {isReceiverPlaying ? (
                    <video
                      ref={receiverVideoRef}
                      src="/Receiver view.mp4"
                      controls
                      autoPlay
                      loop
                      playsInline
                      muted={isMuted}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'radial-gradient(circle at center, #23120f 0%, #090403 100%)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      padding: 24, textAlign: 'center', zIndex: 25,
                      pointerEvents: 'auto', color: '#FFF8F0',
                    }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📜✨</div>
                      <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.25rem', color: '#FFF8F0', fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>
                        Aarav & Ananya’s Experience
                      </h3>
                      <p style={{ fontSize: '0.78rem', color: 'rgba(255,248,240,0.7)', marginBottom: 22, textAlign: 'center', lineHeight: 1.45 }}>
                        Tap below to watch the full Receiver Experience Video (Crafting to Final Gift Unboxing)!
                      </p>

                      <motion.button
                        onClick={handleStartReceiverVideo}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '14px 24px',
                          borderRadius: 100,
                          background: 'linear-gradient(135deg, #c79774 0%, #8c5d3b 100%)',
                          color: '#0d0706',
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          border: '1.5px solid #ffd700',
                          boxShadow: '0 8px 25px rgba(199,151,116,0.5)',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}
                      >
                        <span>▶ PLAY EXPERIENCE</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              ) : (
                <AutomatedSenderVideoSlide stepIdx={senderStepIdx} />
              )}
            </div>
          </div>
        </div>

        {/* ── 4 CORE FEATURES GRID (THE PLOT TWIST ELEMENTS) ── */}
        <div style={{ width: '100%', maxWidth: 480, marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.25rem', fontWeight: 700, textAlign: 'center', marginBottom: 16, color: '#2b231d' }}>
            {locale === 'hi' ? 'इस अनुभव में क्या-क्या खास है?' : 'What Makes This Experience Special?'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: '📜', title: 'Unfiltered Note', desc: 'Say what you never say out loud (zero corporate cringe)' },
              { icon: '📸', title: 'Memory Trap', desc: '5 3D polaroid flips bringing back core childhood memories' },
              { icon: '🧩', title: 'Secret Jigsaw', desc: 'Make them solve a photo puzzle before opening the gift' },
              { icon: '📦', title: 'Twine Unboxing', desc: 'Organic string-wrapped parcel with custom ice cream voucher' },
            ].map((feat, i) => (
              <div key={i} className="craft-cardstock-light" style={{
                padding: '14px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}>
                <span style={{ fontSize: '1.4rem' }}>{feat.icon}</span>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '0.92rem', fontWeight: 700, color: '#8a2b1a', margin: 0 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.74rem', color: 'rgba(43,35,29,0.8)', lineHeight: 1.4, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3-STEP WALKTHROUGH (CRAFT CARDSTOCK STYLING) ── */}
        <div className="craft-cardstock-light" style={{
          width: '100%', maxWidth: 480,
          padding: '20px 18px',
          marginBottom: 32,
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.2rem', fontWeight: 700, textAlign: 'center', marginBottom: 16, color: '#2b231d' }}>
            {locale === 'hi' ? '3 आसान चरणों में तैयार करें' : 'Create In 3 Simple Steps'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { num: '1', title: 'Set Up The Plot Twist', desc: 'Enter Aarav & Ananya’s names, select pre-written note & upload photos.' },
              { num: '2', title: 'Unlock Special Price (₹250/-)', desc: 'Instant activation with 75% festival offer discount.' },
              { num: '3', title: 'Drop It On WhatsApp', desc: 'Send your custom digital Rakhi parcel link directly.' },
            ].map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8a2b1a 0%, #5c1b10 100%)',
                  color: '#FFF8F0', fontWeight: 800, fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {step.num}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#8a2b1a', margin: '0 0 2px 0' }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: '0.76rem', color: 'rgba(43,35,29,0.8)', margin: 0, lineHeight: 1.4 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM STICKY FLOATING CTA BAR (MOBILE) ── */}
        <div style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          background: 'rgba(252, 248, 242, 0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1.5px solid rgba(199,151,116,0.4)',
          padding: '12px 18px',
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          boxShadow: '0 -10px 30px rgba(74,52,43,0.15)',
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(43,35,29,0.65)' }}>
              {locale === 'hi' ? 'ऑफर मूल्य:' : 'Special Offer:'}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(43,35,29,0.4)', textDecoration: 'line-through' }}>₹999</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#8a2b1a', fontFamily: 'Playfair Display, Georgia, serif' }}>₹250/-</span>
            </div>
          </div>

          <motion.button
            onClick={handleCreate}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            style={{
              flex: 1,
              maxWidth: 240,
              padding: '12px 18px',
              borderRadius: 100,
              background: 'linear-gradient(135deg, #8a2b1a 0%, #5c1b10 100%)',
              color: '#FFF8F0',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              border: '1px solid #c79774',
              boxShadow: '0 4px 15px rgba(138,43,26,0.3)',
              cursor: 'pointer',
            }}
          >
            {locale === 'hi' ? 'गिफ्ट में बताओ →' : 'GIVE A PLOT TWIST →'}
          </motion.button>
        </div>
      </div>
    </>
  );
}

// ── AUTOMATED SENDER VIDEO SLIDESHOW COMPONENT (FALLBACK DEMO) ──
const SENDER_DEMO_STEPS = [
  {
    step: 'Step 1: Enter Names',
    badge: '✍️ SENDER SETUP',
    title: 'Aarav & Ananya',
    subtitle: 'Your Name: Aarav • Sibling: Ananya',
    preview: (
      <div style={{ background: '#2b1f1d', borderRadius: 16, padding: 16, border: '1px solid #c79774', color: '#FFF8F0' }}>
        <div style={{ fontSize: '0.72rem', color: '#c79774', marginBottom: 4 }}>YOUR NAME</div>
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 12px', borderRadius: 8, fontSize: '0.9rem', color: '#ffd700', fontWeight: 600, marginBottom: 12 }}>Aarav</div>
        <div style={{ fontSize: '0.72rem', color: '#c79774', marginBottom: 4 }}>SIBLING NAME</div>
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 12px', borderRadius: 8, fontSize: '0.9rem', color: '#ffd700', fontWeight: 600 }}>Ananya</div>
      </div>
    )
  },
  {
    step: 'Step 2: Choose Note',
    badge: '📜 HEARTFELT LETTER',
    title: 'Pre-written Letter Selected',
    subtitle: '"Thank you for always being my partner in crime..."',
    preview: (
      <div style={{ background: '#f4ede2', borderRadius: 16, padding: 16, border: '1px solid #b8a68f', color: '#2b231d' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8a2b1a', marginBottom: 6 }}>Happy Raksha Bandhan! 🌸</div>
        <div style={{ fontSize: '0.74rem', lineHeight: 1.4, color: '#2b231d', fontStyle: 'italic' }}>
          "Thank you for always being my biggest supporter, my partner in crime, and my best friend..."
        </div>
      </div>
    )
  },
  {
    step: 'Step 3: Upload Photos',
    badge: '📸 POLAROID MEMORIES',
    title: '5 Memories Uploaded',
    subtitle: 'Childhood photo album ready for 3D page-flip',
    preview: (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', overflow: 'hidden' }}>
        {['/Image 2.png', '/Image 4.png', '/Image 5.png'].map((img, i) => (
          <img key={i} src={img} alt="Memory" style={{ width: 70, height: 90, objectFit: 'cover', borderRadius: 8, border: '3px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }} />
        ))}
      </div>
    )
  },
  {
    step: 'Step 4: Jigsaw Puzzle',
    badge: '🧩 SURPRISE PUZZLE',
    title: 'Jigsaw Photo Added',
    subtitle: 'Ananya will solve the puzzle to unlock the gift!',
    preview: (
      <div style={{ textAlign: 'center' }}>
        <img src="/Jigsaw.png" alt="Jigsaw Puzzle" style={{ width: 140, height: 110, objectFit: 'cover', borderRadius: 12, border: '2px dashed #c79774' }} />
      </div>
    )
  },
  {
    step: 'Step 5: Voice Note',
    badge: '🎙️ AUDIO MEMORY',
    title: 'Voice Message Recorded',
    subtitle: 'Personal audio note attached for Ananya',
    preview: (
      <div style={{ background: '#2b1f1d', borderRadius: 16, padding: 14, border: '1px solid #c79774', color: '#FFF8F0', textAlign: 'center' }}>
        <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>🎙️ 🎵 0:15</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffd700' }}>"Happy Raksha Bandhan Ananya!"</div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,248,240,0.6)', marginTop: 2 }}>Voice Note Recording Attached</div>
      </div>
    )
  },
  {
    step: 'Step 6: Gift Parcel',
    badge: '📦 GIFT SURPRISE',
    title: 'Ice Cream Voucher Added',
    subtitle: 'Surprise gift parcel ready to unwrap!',
    preview: (
      <div style={{ background: 'linear-gradient(135deg, #4a1c14 0%, #2b130e 100%)', borderRadius: 16, padding: 14, border: '1px solid #c79774', color: '#ffd700', textAlign: 'center' }}>
        <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>🎁</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Baskin Robbins Ice Cream Voucher</div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,248,240,0.6)' }}>Value: ₹500</div>
      </div>
    )
  },
  {
    step: 'Step 7: Share Link',
    badge: '🚀 CARD READY',
    title: 'WhatsApp Gift Link Generated',
    subtitle: 'Send directly to Ananya via WhatsApp!',
    preview: (
      <div style={{ background: '#25D366', borderRadius: 16, padding: 14, color: '#fff', textAlign: 'center', fontWeight: 800, fontSize: '0.88rem' }}>
        📲 SEND ON WHATSAPP NOW
      </div>
    )
  }
];

function AutomatedSenderVideoSlide({ stepIdx }: { stepIdx: number }) {
  const current = SENDER_DEMO_STEPS[stepIdx];
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#0d0706',
      backgroundImage: 'radial-gradient(circle at center, #23120f 0%, #090403 100%)',
      padding: '50px 18px 20px 18px',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
      color: '#FFF8F0',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
    }}>
      {/* Progress Dots Bar */}
      <div style={{ position: 'absolute', top: 38, left: 16, right: 16, display: 'flex', gap: 4 }}>
        {SENDER_DEMO_STEPS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i === stepIdx ? '#c79774' : 'rgba(255,255,255,0.15)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>

      <div>
        <span style={{ fontSize: '0.65rem', background: 'rgba(199,151,116,0.2)', border: '1px solid rgba(199,151,116,0.4)', color: '#c79774', padding: '3px 8px', borderRadius: 10, fontWeight: 700 }}>
          {current.badge}
        </span>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', color: '#FFF8F0', margin: '8px 0 2px 0', fontWeight: 600 }}>
          {current.title}
        </h3>
        <p style={{ fontSize: '0.74rem', color: 'rgba(255,248,240,0.6)', margin: 0 }}>
          {current.subtitle}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIdx}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          style={{ margin: '14px 0' }}
        >
          {current.preview}
        </motion.div>
      </AnimatePresence>

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(199,151,116,0.3)',
        borderRadius: 12, padding: '10px 12px',
        textAlign: 'center', fontSize: '0.74rem', color: '#c79774', fontWeight: 600,
      }}>
        {current.step} • Sender Demo 🎬
      </div>
    </div>
  );
}
