'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale } from '@/lib/types';
import { t } from '@/lib/i18n';

interface Props {
  letterText: string;
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
}

/* ─── Ambient petals ─────────────────────────────────── */
const PETALS = [
  { id: 1, x: 6,  delay: 0.4,  dur: 11, hue: '#E8751A' },
  { id: 2, x: 82, delay: 1.3,  dur: 13, hue: '#E8961A' },
  { id: 3, x: 54, delay: 2.7,  dur: 9,  hue: '#C9A84C' },
  { id: 4, x: 23, delay: 3.9,  dur: 12, hue: '#E8751A' },
  { id: 5, x: 70, delay: 5.3,  dur: 10, hue: '#E8961A' },
  { id: 6, x: 40, delay: 6.6,  dur: 14, hue: '#C9A84C' },
  { id: 7, x: 93, delay: 0.9,  dur: 11, hue: '#FFB347' },
  { id: 8, x: 4,  delay: 4.4,  dur: 10, hue: '#FFB347' },
];

/* ─── Rupee ₹500 Note ─────────────────────────────────── */
function RupeeNote({ width = 130 }: { width?: number }) {
  const h = Math.round(width * 0.47);
  return (
    <svg width={width} height={h} viewBox="0 0 200 94"
      style={{ filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.45))', display: 'block' }}>
      <defs>
        <linearGradient id="noteG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stopColor="#9ED65A"/>
          <stop offset="50%" stopColor="#6DB33F"/>
          <stop offset="100%" stopColor="#4A8C2A"/>
        </linearGradient>
      </defs>
      {/* Body */}
      <rect width="200" height="94" rx="5" fill="url(#noteG)"/>
      {/* Left lavender band */}
      <rect width="40" height="94" rx="5" fill="#B5A0D8"/>
      <rect x="36" width="6" height="94" fill="#6DB33F"/>
      {/* Security thread */}
      <rect x="82" width="2.5" height="94" fill="#B22222" opacity="0.65"/>
      {/* Text */}
      <text x="56" y="26" fontFamily="Georgia,serif" fontSize="12" fontWeight="bold" fill="#1A3C00">&#x20B9;500</text>
      <text x="56" y="40" fontFamily="Arial,sans-serif" fontSize="5.5" fill="#1A3C00" opacity="0.75">RESERVE BANK OF INDIA</text>
      {/* Gandhi silhouette */}
      <ellipse cx="158" cy="46" rx="24" ry="28" fill="rgba(255,255,255,0.08)"/>
      <circle  cx="158" cy="36" r="11" fill="rgba(255,255,255,0.1)"/>
      {/* Ashoka pillar */}
      <rect x="16" y="28" width="9" height="34" rx="2.5" fill="rgba(255,255,255,0.25)"/>
      <ellipse cx="20.5" cy="28" rx="8" ry="3" fill="rgba(255,255,255,0.25)"/>
      {/* ₹ symbol */}
      <text x="14" y="22" fontFamily="Georgia,serif" fontSize="14" fontWeight="bold" fill="rgba(255,255,255,0.75)">&#x20B9;</text>
      {/* Footer */}
      <text x="56" y="82" fontFamily="Arial,sans-serif" fontSize="5" fill="#1A3C00" opacity="0.6">FIVE HUNDRED RUPEES</text>
      {/* Border */}
      <rect x="1" y="1" width="198" height="92" rx="4.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
    </svg>
  );
}

/* ─── Botanical floral cluster (top-right of envelope) ── */
function Floral() {
  return (
    <svg width="90" height="80" viewBox="0 0 90 80" style={{ pointerEvents: 'none' }}>
      {/* Stems */}
      <path d="M45 75 Q30 55 14 35" fill="none" stroke="#4A3818" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M45 75 Q42 50 36 22" fill="none" stroke="#4A3818" strokeWidth="0.9" strokeLinecap="round"/>
      <path d="M45 75 Q58 52 72 32" fill="none" stroke="#4A3818" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M45 75 Q68 62 80 50" fill="none" stroke="#4A3818" strokeWidth="0.7" strokeLinecap="round"/>
      {/* Leaves */}
      <ellipse cx="24" cy="52" rx="8" ry="3.5" fill="#5C7035" transform="rotate(-38 24 52)" opacity="0.82"/>
      <ellipse cx="60" cy="55" rx="7" ry="3"   fill="#5C7035" transform="rotate(28 60 55)"  opacity="0.78"/>
      <ellipse cx="40" cy="38" rx="6" ry="2.5" fill="#6B8040" transform="rotate(-12 40 38)" opacity="0.7"/>
      {/* Baby's breath */}
      {[[14,30],[22,20],[34,12],[58,18],[70,26],[79,44]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2.4" fill="rgba(255,246,238,0.88)"/>
      ))}
      {/* Main rose */}
      {[0,55,110,165,220,275].map((a,i) => {
        const r=a*Math.PI/180;
        return <ellipse key={i} cx={14+9*Math.cos(r)} cy={32+9*Math.sin(r)} rx="4.5" ry="2.8"
          fill="#C9587A" opacity="0.72" transform={`rotate(${a} ${14+9*Math.cos(r)} ${32+9*Math.sin(r)})`}/>;
      })}
      <circle cx="14" cy="32" r="9"  fill="#D4688A" opacity="0.9"/>
      <circle cx="14" cy="32" r="6"  fill="#E890A8"/>
      <circle cx="14" cy="32" r="3"  fill="#FFBDCE"/>
      <circle cx="14" cy="32" r="1.2" fill="#FFE0E8"/>
      {/* Bud */}
      <ellipse cx="68" cy="28" rx="5" ry="6.5" fill="#B0506A" opacity="0.85"/>
      <ellipse cx="68" cy="28" rx="3" ry="4.5" fill="#C86880"/>
      {/* Eucalyptus */}
      {[79,82,85].map((x,i) => (
        <ellipse key={i} cx={x} cy={50+i*7} rx="4.5" ry="2.5" fill="#6A885A" opacity="0.72"
          transform={`rotate(${-15+i*12} ${x} ${50+i*7})`}/>
      ))}
    </svg>
  );
}

export function Scene2_Envelope({
  letterText, senderName, recipientName, locale, onComplete,
}: Props) {
  const [phase, setPhase] = useState<'idle'|'sliding'|'spinning'|'revealed'>('idle');
  const [slideProgress, setSlideProgress] = useState(0);
  const { vibrate } = useHaptics();
  const envelopeControls = useAnimation();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isDragging  = useRef(false);
  const startX      = useRef(0);
  const currentProg = useRef(0);
  const MAX         = 220;
  const THRESHOLD   = 0.58;

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    vibrate('LIGHT');
  }, [vibrate]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const p = Math.max(0, Math.min((e.clientX - startX.current) / MAX, 1));
    currentProg.current = p;
    setSlideProgress(p);
    if (p > 0.5) vibrate('LIGHT');
  }, [vibrate]);

  const onPointerUp = useCallback(async () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (currentProg.current >= THRESHOLD) {
      vibrate('REVEAL');
      setSlideProgress(1);
      setPhase('spinning');
      audioEngine.playPaper();
      // Spin the envelope on Y-axis and shrink it away
      await envelopeControls.start({
        rotateY: [0, 180, 360],
        scale:   [1, 1.05, 0.0],
        opacity: [1, 1,    0],
        transition: { duration: 1.5, ease: [0.4, 0, 0.6, 1] },
      });
      setPhase('revealed');
    } else {
      setSlideProgress(0);
      currentProg.current = 0;
    }
  }, [vibrate, envelopeControls]);

  const beadFracs  = [0.16, 0.37, 0.63, 0.84];
  const beadColors = ['#C9A84C','#9B2247','#E8751A','#C9A84C'];

  // Neatly stacked rupee notes (vertical cascading stack)
  const NOTES = [
    { rotate: -90, x: 0, y: -45 },
    { rotate: -90, x: 0, y: -15 },
    { rotate: -90, x: 0, y: 15 },
  ];

  return (
    <div className="scene" style={{
      background: 'radial-gradient(ellipse at 55% 15%, #2A0D1E 0%, #160818 50%, #080408 100%)',
      overflow: 'hidden',
    }}>

      {/* Damask watermark */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:`url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 8 C56 24 72 28 88 26 C72 36 56 40 50 56 C44 40 28 36 12 26 C28 28 44 24 50 8Z' fill='rgba(160,60,90,0.06)'/%3E%3C/svg%3E")`,
        backgroundSize:'100px 100px', pointerEvents:'none',
      }}/>

      {/* Corner glows */}
      <div style={{ position:'absolute', top:'-12%', right:'-10%', width:380, height:380, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(155,60,80,0.09) 0%, transparent 70%)', pointerEvents:'none'}}/>
      <div style={{ position:'absolute', bottom:'-12%', left:'-10%', width:340, height:340, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents:'none'}}/>

      {/* Sparkle stars */}
      {[
        {x:'7%', y:'14%', d:0.4},{x:'91%',y:'11%',d:1.2},{x:'4%', y:'72%',d:2.0},
        {x:'94%',y:'68%',d:0.8},{x:'47%',y:'91%',d:2.7},{x:'22%',y:'84%',d:1.6},
        {x:'76%',y:'87%',d:3.2},
      ].map((s,i) => (
        <motion.div key={i}
          initial={{opacity:0,scale:0}}
          animate={{opacity:[0,1,0],scale:[0,1.4,0]}}
          transition={{duration:1.8,delay:s.d,repeat:Infinity,repeatDelay:5+i*0.8,ease:'easeOut'}}
          style={{
            position:'absolute',left:s.x,top:s.y,
            width:4,height:4,borderRadius:'50%',background:'#FFD700',
            boxShadow:'0 0 8px #FFD700,0 0 20px rgba(255,215,0,0.5)',pointerEvents:'none',
          }}/>
      ))}

      {/* Petals */}
      {PETALS.map(p => (
        <motion.div key={p.id}
          initial={{y:-20,x:`${p.x}vw`,opacity:0,rotate:0}}
          animate={{
            y:'110vh',
            x:[`${p.x}vw`,`${p.x+7}vw`,`${p.x-4}vw`,`${p.x}vw`],
            opacity:[0,0.8,0.8,0],rotate:[0,180,360,540],
          }}
          transition={{duration:p.dur,delay:p.delay,repeat:Infinity,repeatDelay:3,ease:'linear',times:[0,0.08,0.9,1]}}
          style={{
            position:'absolute',top:0,width:11,height:15,borderRadius:'50% 0 50% 0',
            background:`linear-gradient(135deg,${p.hue},${p.hue}aa)`,
            boxShadow:`0 0 8px ${p.hue}88`,pointerEvents:'none',
          }}/>
      ))}

      {/* ── PAGE TITLE ── */}
      <motion.div
        initial={{opacity:0,y:-20}}
        animate={{opacity:1,y:0}}
        transition={{duration:1,delay:0.3,ease:[0.16,1,0.3,1]}}
        style={{position:'absolute',top:'6%',textAlign:'center',width:'100%',pointerEvents:'none'}}
      >
        <p style={{
          fontFamily:'var(--font-serif)',fontStyle:'italic',
          fontSize:'0.72rem',letterSpacing:'0.24em',
          color:'rgba(201,168,76,0.7)',textTransform:'uppercase',margin:'0 0 6px',
        }}>
          ✦&ensp;{locale==='hi' ? 'आपका आशीर्वाद' : 'Your Blessing'}&ensp;✦
        </p>
        <p style={{
          fontFamily:'var(--font-script)',fontSize:'2.8rem',
          color:'#FFD9A0',lineHeight:1.05,margin:0,
          textShadow:'0 0 36px rgba(201,168,76,0.45),0 3px 10px rgba(0,0,0,0.7)',
        }}>
          {recipientName}
        </p>
        <div style={{width:80,height:1.5,margin:'9px auto 0',background:'linear-gradient(90deg,transparent,#C9A84C,transparent)'}}/>
        <p style={{
          fontFamily:'var(--font-sans)',fontSize:'0.62rem',
          letterSpacing:'0.22em',color:'rgba(255,217,160,0.45)',
          marginTop:7,textTransform:'uppercase',
        }}>
          {locale==='hi' ? `— ${senderName} की ओर से` : `— from ${senderName} with love`}
        </p>
      </motion.div>

      {/* ══════════ ENVELOPE ══════════ */}
      <AnimatePresence>
        {phase !== 'revealed' && (
          <motion.div
            animate={envelopeControls}
            style={{
              position:'relative',
              width:360, height:230,
              perspective:1000,
              transformStyle:'preserve-3d',
            }}
          >
            {/* Gold outer glow */}
            <motion.div
              animate={{opacity:[0.3,0.55,0.3],scale:[1,1.08,1]}}
              transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}
              style={{
                position:'absolute',inset:-30,borderRadius:'50%',
                background:'radial-gradient(circle,rgba(201,168,76,0.16) 0%,rgba(155,60,80,0.06) 55%,transparent 72%)',
                filter:'blur(22px)',pointerEvents:'none',
              }}/>

            {/* ── BODY ── */}
            <div style={{
              position:'absolute',inset:0,
              backgroundImage:'url(/images/envelope-bg.png)',
              backgroundSize:'360px 360px',
              backgroundPosition:'top center',
              backgroundRepeat: 'no-repeat',
              borderRadius:14,
              boxShadow:'0 24px 72px rgba(0,0,0,0.72), 0 0 0 2px rgba(212,175,55,0.5), inset 0 2px 10px rgba(255,255,255,0.1), inset 0 -4px 15px rgba(0,0,0,0.6)',
              overflow:'hidden',
            }}>

              {/* ── TOP GOLD FOIL BAND ── */}
              <div style={{
                position:'absolute',top:0,left:0,right:0,height:6,
                background:'linear-gradient(90deg,#6A4800,#C9A84C,#F0D080,#F5E090,#F0D080,#C9A84C,#6A4800)',
                borderRadius:'14px 14px 0 0',
                boxShadow:'0 2px 6px rgba(0,0,0,0.4)',
                zIndex: 2,
              }}/>

              {/* ── BOTTOM GOLD FOIL BAND ── */}
              <div style={{
                position:'absolute',bottom:0,left:0,right:0,height:6,
                background:'linear-gradient(90deg,#6A4800,#C9A84C,#F0D080,#F5E090,#F0D080,#C9A84C,#6A4800)',
                borderRadius:'0 0 14px 14px',
                boxShadow:'0 -2px 6px rgba(0,0,0,0.4)',
                zIndex: 2,
              }}/>

              {/* ── INNER GOLD FRAME ── */}
              <div style={{
                position:'absolute',inset:10,borderRadius:8,
                border:'1px solid rgba(212,175,55,0.4)',
                boxShadow:'inset 0 0 8px rgba(0,0,0,0.3), 0 0 5px rgba(212,175,55,0.2)',
                pointerEvents:'none',
              }}/>

              {/* ── BEST COMPLIMENTS TEXT ── */}
              <div style={{
                position:'absolute',top:24,left:40,right:40,
                textAlign:'center',pointerEvents:'none',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 75%)',
                padding: '10px 0',
              }}>
                <p style={{
                  fontFamily:'var(--font-serif)',fontStyle:'italic',
                  fontSize:'0.6rem',letterSpacing:'0.2em',
                  color:'#F5E090',textTransform:'uppercase',margin:'0 0 4px',
                  textShadow:'0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)'
                }}>
                  {locale==='hi' ? 'सादर समर्पित' : 'With Best Compliments'}
                </p>
                <p style={{
                  fontFamily:'var(--font-script)',fontSize:'1.1rem',
                  color:'#F5E090',margin:0,lineHeight:1.1,
                  textShadow:'0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)'
                }}>
                  {senderName}
                </p>
              </div>

              {/* ── GOLD SEPARATOR LINE ── */}
              <div style={{position:'absolute',top:110,left:14,right:14, filter:'drop-shadow(0 3px 4px rgba(0,0,0,0.5))'}}>
                <svg width="332" height="12" viewBox="0 0 332 12">
                  <line x1="0" y1="6" x2="157" y2="6" stroke="rgba(212,175,55,0.7)" strokeWidth="1"/>
                  <polygon points="166,2 172,6 166,10 160,6" fill="rgba(212,175,55,0.9)"/>
                  <line x1="175" y1="6" x2="332" y2="6" stroke="rgba(212,175,55,0.7)" strokeWidth="1"/>
                </svg>
              </div>

              {/* ── SLIDE-TO-OPEN TRACK ── */}
              <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                style={{
                  position:'absolute',bottom:18,left:16,right:16,
                  height:52,borderRadius:26,cursor:'ew-resize',
                  touchAction:'none',userSelect:'none',
                  background:`rgba(0,0,0,${0.18+slideProgress*0.08})`,
                  border:`1.5px solid rgba(212,175,55,${0.38+slideProgress*0.52})`,
                  overflow:'hidden',
                  boxShadow:'inset 0 1px 0 rgba(255,220,100,0.08)',
                }}
              >
                {/* Progress fill */}
                <div style={{
                  position:'absolute',left:0,top:0,bottom:0,
                  width:`${slideProgress*100}%`,
                  background:'linear-gradient(90deg,rgba(90,58,90,0.5),rgba(201,168,76,0.42))',
                  borderRadius:26,
                  transition:slideProgress===0?'width 0.4s ease':'none',
                }}/>

                {/* Gold wax seal knob */}
                <motion.div
                  style={{
                    position:'absolute',top:3,bottom:3,
                    left:3+slideProgress*(328-48-6),
                    width:46,height:46,borderRadius:'50%',
                    background:'radial-gradient(circle at 38% 28%, #FFF0A0 0%, #D4AF37 42%, #8B6810 100%)',
                    boxShadow:`0 4px 18px rgba(212,175,55,${0.45+slideProgress*0.45}),inset 0 1px 0 rgba(255,255,255,0.45),inset 0 -2px 4px rgba(0,0,0,0.22)`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    transition:slideProgress===0?'left 0.4s ease':'none',
                  }}
                  animate={phase==='idle'||phase==='sliding' ? {rotate:[0,5,-5,0]} : {rotate:0}}
                  transition={{duration:2.5,repeat:Infinity,ease:'easeInOut'}}
                >
                  <svg width="26" height="26" viewBox="0 0 26 26">
                    <circle cx="13" cy="13" r="10.5" fill="none" stroke="rgba(100,40,0,0.45)" strokeWidth="0.8"/>
                    <text x="13" y="18.5" textAnchor="middle"
                      fontFamily="serif" fontSize="14" fill="rgba(80,0,0,0.88)" fontWeight="bold">&#x950;</text>
                  </svg>
                </motion.div>

                {/* "Open your Shagun" label */}
                <AnimatePresence>
                  {(phase==='idle'||phase==='sliding') && (
                    <motion.div
                      initial={{opacity:0}}
                      animate={{opacity:slideProgress>0.15?0:[0.5,1,0.5]}}
                      exit={{opacity:0}}
                      transition={{duration:1.8,repeat:slideProgress===0?Infinity:0}}
                      style={{
                        position:'absolute',right:14,
                        top:'50%',transform:'translateY(-50%)',
                        display:'flex',alignItems:'center',gap:5,
                        pointerEvents:'none',
                      }}
                    >
                      <span style={{
                        fontFamily:'var(--font-script)',fontSize:'1rem',fontWeight:'bold',
                        color:'#FFFFFF',letterSpacing:'0.04em',
                        textShadow:'0 1px 4px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.8)'
                      }}>
                        {locale==='hi' ? 'आशीर्वाद पढ़ें' : 'Open your Blessing'}
                      </span>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))'}}>
                        <path d="M2 6.5h9M7 3l3.5 3.5L7 10" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>{/* body */}

            {/* ── ENVELOPE FLAP ── */}
            <motion.div
              style={{
                position:'absolute',top:0,left:-2,right:-2,
                height:125,transformOrigin:'top center',zIndex:4,
                pointerEvents:'none',
                filter: 'drop-shadow(0 20px 24px rgba(0,0,0,0.85)) drop-shadow(0 6px 10px rgba(0,0,0,0.6))',
              }}
              animate={(['spinning'] as string[]).includes(phase)
                ? {rotateX:-175,y:-20,opacity:0}
                : {rotateX:0,y:0,opacity:1}
              }
              transition={{duration:0.5,ease:[0.34,1.56,0.64,1]}}
            >
              <svg width="364" height="125" viewBox="0 0 364 125" style={{overflow:'visible'}}>
                <defs>
                  <pattern id="flapImg" patternUnits="userSpaceOnUse" width="364" height="360">
                    <image href="/images/envelope-bg.png" x="2" y="0" width="360" height="360" preserveAspectRatio="none" />
                  </pattern>
                  <linearGradient id="topBand" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#6A4800"/>
                    <stop offset="25%"  stopColor="#C9A84C"/>
                    <stop offset="50%"  stopColor="#F0D080"/>
                    <stop offset="75%"  stopColor="#C9A84C"/>
                    <stop offset="100%" stopColor="#6A4800"/>
                  </linearGradient>
                  <clipPath id="flapC2"><path d="M14 0 L350 0 Q364 0 364 14 L185 106 Q182 108 179 106 L0 14 Q0 0 14 0 Z"/></clipPath>
                </defs>

                {/* Flap fill */}
                <path d="M14 0 L350 0 Q364 0 364 14 L185 106 Q182 108 179 106 L0 14 Q0 0 14 0 Z"
                  fill="url(#flapImg)" stroke="rgba(212,175,55,0.72)" strokeWidth="1.5"/>

                {/* ── BOLD TRADITIONAL FOIL MOTIF (Edges only) ── */}
                <g opacity="0.85" clipPath="url(#flapC2)">
                  {/* Thick Double Border tracing the V-edge */}
                  <path d="M 18 10 L 182 92 L 346 10" fill="none" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M 28 15 L 182 85 L 336 15" fill="none" stroke="#F5E090" strokeWidth="1.5" strokeDasharray="4 5" strokeLinecap="round"/>
                  <path d="M 36 20 L 182 78 L 328 20" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.6"/>
                </g>

                {/* Top gold band */}
                <path d="M14 2 L350 2 Q362 2 362 14" stroke="url(#topBand)" fill="none" strokeWidth="4"/>
                <path d="M14 2 Q2 2 2 14" stroke="url(#topBand)" fill="none" strokeWidth="4"/>

                {/* Central wax medallion */}
                <circle cx="182" cy="103" r="12"  fill="#D4AF37"/>
                <circle cx="182" cy="103" r="9.5" fill="#4A2A4E"/>
                <text x="182" y="108" textAnchor="middle"
                  fontFamily="serif" fontSize="11" fill="#D4AF37">&#x950;</text>
              </svg>
            </motion.div>


            {/* Instruction Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0.7, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: 1 }}
              style={{
                position: 'absolute', bottom: '-20%', width: '100%', textAlign: 'center',
                fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.1em',
                color: 'rgba(201,168,76,0.8)', pointerEvents: 'none', textTransform: 'uppercase'
              }}
            >
              {locale === 'hi' ? 'आशीर्वाद पाने के लिए ॐ को स्वाइप करें' : 'Swipe the ॐ symbol to receive your blessings'}
            </motion.p>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ REVEALED STATE: notes left + letter right ══════════ */}
      <AnimatePresence>
        {phase === 'revealed' && (
          <motion.div
            key="revealed"
            initial={{opacity:0}}
            animate={{opacity:1}}
            transition={{duration:0.4}}
          >
           <div style={{
            position:'relative', zIndex:10,
            display:'flex', flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? 16 : 40,
            width:'100%', maxWidth:800, padding: isMobile ? '0 10px' : '0 20px',
          }}>
            {/* ── LEFT: Fanned rupee notes ── */}
            <motion.div
              initial={{opacity:0,x:-60}}
              animate={{opacity:1,x:0}}
              transition={{duration:0.7,delay:0.2,ease:[0.16,1,0.3,1]}}
              style={{
                position:'relative',
                width: isMobile ? 70 : 120,
                height: 280,
                flexShrink:0,
              }}
            >
              {NOTES.map((n,i) => (
                <motion.div key={i}
                  initial={{opacity:0,rotate:0,x:0,y:40,scale:0.7}}
                  animate={{opacity:1,rotate:n.rotate,x:n.x,y:n.y,scale:1}}
                  transition={{duration:0.65,delay:0.3+i*0.12,ease:[0.34,1.56,0.64,1]}}
                  style={{
                    position:'absolute',top:'50%',left:'50%',
                    marginLeft:-100, marginTop: -40, // Adjust centering
                    transformOrigin:'center center',
                  }}
                >
                  <motion.div
                    animate={{x:[0, -8, 0]}} // local x axis handles up/down bobbing because of -90deg rotation
                    transition={{duration:2.8+i*0.4,repeat:Infinity,ease:'easeInOut',delay:i*0.3}}
                  >
                    <RupeeNote width={200}/>
                  </motion.div>
                </motion.div>
              ))}

              {/* Shagun label below notes */}
              <motion.div
                initial={{opacity:0}}
                animate={{opacity:1}}
                transition={{delay:0.9,duration:0.6}}
                style={{
                  position:'absolute',bottom:-80,left:0,right:0,
                  textAlign:'center',
                }}
              >
                <p style={{
                  fontFamily:'var(--font-script)',fontSize:'1.1rem',
                  color:'#D4AF37',margin:0,
                  textShadow:'0 0 12px rgba(212,175,55,0.5)',
                }}>
                  {locale==='hi' ? 'आशीर्वाद 🪙' : 'Blessing 🪙'}
                </p>
              </motion.div>
            </motion.div>

            {/* ── RIGHT: Pillow Message Box ── */}
            <motion.div
              initial={{opacity:0,x:60,scale:0.9}}
              animate={{opacity:1,x:0,scale:1}}
              transition={{duration:0.8,delay:0.25,ease:[0.16,1,0.3,1]}}
              style={{
                flex:1,
                maxHeight: isMobile ? 280 : '72vh',
                height: isMobile ? 280 : 'auto',
                overflow: 'hidden',
                
                // Luxury Suede Display Board
                background: 'linear-gradient(135deg, #FFE2D1 0%, #FFB799 50%, #FF9973 100%)',
                borderRadius: 16,
                padding: isMobile ? '16px' : '28px',
                position: 'relative',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.4)',
              }}
            >
              {/* Suede Noise Texture */}
              <div style={{
                position:'absolute', inset:0, borderRadius:16,
                backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.15, pointerEvents:'none', mixBlendMode:'overlay'
              }}/>
              
              {/* Metallic Gold Foil Border */}
              <div style={{
                position:'absolute', inset: isMobile ? 5 : 8, borderRadius: 10,
                border: '2px solid rgba(201,168,76,0.8)',
                boxShadow: 'inset 0 0 10px rgba(201,168,76,0.3), 0 0 10px rgba(201,168,76,0.3)',
                pointerEvents: 'none',
              }}/>

              {/* Tied SVG Rakhi overlaying the board */}
              <motion.div
                initial={{opacity:0, scale:0.9}}
                animate={{opacity:1, scale:1}}
                transition={{delay:0.5,duration:0.7}}
                style={{ position:'absolute', top: 10, left: -25, right: -25, height: 60, textAlign:'center', zIndex: 20, pointerEvents: 'none' }}
              >
                {/* Thick Braided Thread */}
                <div style={{
                  position:'absolute', top:'50%', left:0, right:0, height: 8,
                  background:'linear-gradient(90deg, #9B2247 0%, #D4AF37 20%, #E8751A 50%, #D4AF37 80%, #9B2247 100%)',
                  boxShadow:'0 4px 6px rgba(0,0,0,0.4), inset 0 2px 3px rgba(255,255,255,0.4)',
                  transform: 'translateY(-50%)',
                  borderRadius: 4
                }}/>
                <div style={{
                  position:'absolute', top:'50%', left:0, right:0, height: 2,
                  background:'#FFF', opacity: 0.4,
                  transform: 'translateY(1px)',
                }}/>
                
                {/* Central Premium Kundan Jewel */}
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex: 2 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <defs>
                      <filter id="kundanShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.5"/>
                      </filter>
                      <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFF2A8"/>
                        <stop offset="70%" stopColor="#D4AF37"/>
                        <stop offset="100%" stopColor="#997A15"/>
                      </radialGradient>
                    </defs>
                    {/* Outer Gold Base */}
                    <circle cx="40" cy="40" r="32" fill="url(#goldGrad)" filter="url(#kundanShadow)"/>
                    {/* Deep Ruby Center */}
                    <circle cx="40" cy="40" r="26" fill="#7A102A"/>
                    {/* Intricate Gold Filigree */}
                    <circle cx="40" cy="40" r="22" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeDasharray="3 4"/>
                    {/* Center Emerald */}
                    <circle cx="40" cy="40" r="12" fill="#1A6B54" stroke="#FFF2A8" strokeWidth="1.5"/>
                    <circle cx="40" cy="40" r="5" fill="#FFF"/>
                    
                    {/* Outer Pearl Ring */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => (
                       <circle key={a} cx={40+27*Math.cos(a*Math.PI/180)} cy={40+27*Math.sin(a*Math.PI/180)} r="3" fill="#FFF" stroke="#D4AF37" strokeWidth="0.5"/>
                    ))}
                    {/* Inner Gold Beads */}
                    {[15, 75, 135, 195, 255, 315].map(a => (
                       <circle key={`in_${a}`} cx={40+18*Math.cos(a*Math.PI/180)} cy={40+18*Math.sin(a*Math.PI/180)} r="2" fill="#D4AF37"/>
                    ))}
                  </svg>
                </div>
              </motion.div>

              {/* Frosted Glass Message Plate */}
              <div style={{
                position:'relative', zIndex: 10,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 8,
                padding: isMobile ? '36px 12px 12px' : '40px 16px 16px', // Extra top padding to clear Rakhi
                marginTop: '10px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.5)',
                // Scroll settings for mobile viewport clearance
                maxHeight: isMobile ? 210 : 'none',
                overflowY: isMobile ? 'auto' : 'visible',
                touchAction: isMobile ? 'pan-y' : 'auto',
              }}>

                  {/* Shubh badge */}
                  <motion.div
                    initial={{opacity:0,scale:0.92}} animate={{opacity:1,scale:1}}
                    transition={{delay:0.65,duration:0.6}}
                    style={{textAlign:'center',marginBottom:14}}
                  >
                    <p style={{fontFamily:'var(--font-serif)',fontSize:'0.6rem',letterSpacing:'0.26em',
                      textTransform:'uppercase',color:'#9B2247',marginBottom:4,fontWeight:700}}>
                      ✦ {locale==='hi'?'शुभ रक्षा बंधन':'Shubh Raksha Bandhan'} ✦
                    </p>
                    <svg width="160" height="10" viewBox="0 0 160 10" style={{display:'block',margin:'0 auto'}}>
                      <path d="M0 5 Q40 0 80 5 Q120 10 160 5" fill="none" stroke="#C9A84C" strokeWidth="0.9"/>
                      <circle cx="80" cy="5" r="2.5" fill="#C9A84C"/>
                      <circle cx="40" cy="2.5" r="1.3" fill="#E8751A"/>
                      <circle cx="120" cy="7.5" r="1.3" fill="#E8751A"/>
                    </svg>
                  </motion.div>

                  {/* Salutation */}
                  <motion.p
                    initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                    transition={{delay:0.8,duration:0.55}}
                    style={{fontFamily:'var(--font-script)',fontSize:'1.15rem',
                      color:'#9B2247',marginBottom:12,lineHeight:1.3}}
                  >
                    {locale==='hi'?`प्रिय ${recipientName},`:`My dearest ${recipientName},`}
                  </motion.p>

                  {/* Letter body */}
                  <motion.p
                    initial={{opacity:0}} animate={{opacity:1}}
                    transition={{delay:0.95,duration:0.75}}
                    style={{
                      fontFamily:'var(--font-serif)',fontSize:'0.88rem',
                      color:'#3D2B1F',lineHeight:1.9,fontStyle:'italic',
                      whiteSpace:'pre-wrap',paddingLeft:9,
                      borderLeft:'2px solid rgba(201,168,76,0.42)',
                    }}
                  >
                    {letterText}
                  </motion.p>

                  {/* Signature */}
                  <motion.div
                    initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                    transition={{delay:1.1,duration:0.55}}
                  >
                    <svg width="100%" height="8" viewBox="0 0 280 8" style={{marginTop:16,display:'block'}}>
                      <path d="M0 4 Q70 0 140 4 Q210 8 280 4" fill="none" stroke="rgba(201,168,76,0.38)" strokeWidth="0.9"/>
                    </svg>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginTop:10}}>
                      <div style={{display:'flex',gap:3}}>
                        {/* Emojis removed for a more premium look */}
                      </div>
                      <p style={{fontFamily:'var(--font-script)',fontSize:'1.2rem',color:'#9B2247',margin:0, fontWeight:'bold'}}>
                        — {senderName}
                      </p>
                    </div>
                  </motion.div>

              </div>


            </motion.div>
           </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONTINUE BUTTON ── */}
      <AnimatePresence>
        {phase==='revealed' && (
          <motion.button
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.8,delay:2.0}}
            onClick={onComplete}
            style={{
              position:'absolute',bottom:'5%',
              background:'linear-gradient(135deg,#C9A84C 0%,#F0D080 50%,#C9A84C 100%)',
              border:'1px solid rgba(201,168,76,0.55)',
              borderRadius:100,padding:'12px 44px',
              fontFamily:'var(--font-sans)',fontSize:'0.72rem',
              letterSpacing:'0.22em',textTransform:'uppercase',
              color:'#3D1A00',cursor:'pointer',fontWeight:700,
              boxShadow:'0 8px 28px rgba(201,168,76,0.45)',
            }}
          >
            {t('continue',locale)}
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
