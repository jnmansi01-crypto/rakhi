'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createExperience } from '@/lib/storage';
import { compressImage } from '@/lib/imageUtils';
import { uploadMedia } from '@/lib/cloudinary';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { usePayment } from '@/hooks/usePayment';
import type { GiftType, ExperienceDraft, Locale } from '@/lib/types';
import { t } from '@/lib/i18n';

// ─── Step config ─────────────────────────────────────────────
const STEPS = ['names','letter','photos','voice','gift','preview'] as const;
type Step = typeof STEPS[number];

interface FormState {
  senderName: string;
  recipientName: string;
  letterText: string;
  photos: File[];
  voiceBlob: Blob | null;
  voiceUrl: string | null; // local preview
  giftType: GiftType;
  giftTitle: string;
  giftValue: string;
  locale: Locale;
}

const INITIAL: FormState = {
  senderName: '', recipientName: '', letterText: '',
  photos: [], voiceBlob: null, voiceUrl: null,
  giftType: 'surprise_message', giftTitle: '', giftValue: '',
  locale: 'en',
};

const GIFT_OPTIONS: { type: GiftType; icon: string; label: string; hint: string }[] = [
  { type: 'voucher',          icon: '🎁', label: 'Gift Voucher',    hint: 'Paste a gift card / voucher link' },
  { type: 'payment_link',     icon: '💸', label: 'Send Money',      hint: 'e.g. 1100' },
  { type: 'coupon',           icon: '🎟️', label: 'Coupon Code',    hint: 'Enter the coupon/promo code' },
  { type: 'surprise_message', icon: '💌', label: 'Secret Message',  hint: 'Write a hidden surprise message' },
];

// ─── Progress bar ─────────────────────────────────────────────
function ProgressBar({ step }: { step: Step }) {
  const idx = STEPS.indexOf(step);
  const pct = ((idx) / (STEPS.length - 1)) * 100;
  return (
    <div style={{ height: 3, background: 'rgba(201,168,76,0.15)', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
      <motion.div
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ height: '100%', background: 'linear-gradient(90deg, var(--saffron), var(--gold))' }}
      />
    </div>
  );
}

import { NavBtn, Row, labelStyle, inputStyle, btnStyle } from './shared';

// ─── Main CreatePage ──────────────────────────────────────────
export default function CreatePage() {
  const [step, setStep]         = useState<Step>('names');
  const [form, setForm]         = useState<FormState>(INITIAL);
  const [submitting, setSub]    = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const [isCardPaid, setIsCardPaid] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [copied, setCopied]     = useState(false);
  const { loading: paymentLoading, error: paymentError, paymentStatusMessage, payAndShare } = usePayment();
  const { recording, startRecording, stopRecording } = useAudioRecorder((blob, url) => {
    update('voiceBlob', blob);
    update('voiceUrl', url);
  });
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  // Allow scrolling on create page
  useEffect(() => {
    document.body.classList.add('sender-flow');
    
    // Listen for closePreview from iframe
    const handleMessage = (e: MessageEvent) => {
      if (e.data === 'closePreview') {
        setIsPreviewModalOpen(false);
      }
    };
    window.addEventListener('message', handleMessage);
    
    return () => {
      document.body.classList.remove('sender-flow');
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Handle photo previews and memory cleanup
  useEffect(() => {
    const newPreviews = form.photos.map(f => URL.createObjectURL(f));
    setPhotoPreviews(newPreviews);
    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [form.photos]);

  const update = useCallback(<K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm(f => ({ ...f, [key]: val }));
  }, []);

  const goNext = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };
  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };



  // ─── Submit ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSub(true);
    try {
      // 1. Upload photos and voice to Cloudinary
      const photoUrls = await Promise.all(
        form.photos.map(f => uploadMedia(f, 'image'))
      );
      
      const voiceUrl = form.voiceBlob 
        ? await uploadMedia(form.voiceBlob, 'video')
        : null;

      // 2. Add Base64 data directly to the draft
      const draft: ExperienceDraft = {
        senderName:    form.senderName,
        recipientName: form.recipientName,
        letterText:    form.letterText,
        giftType:      form.giftType,
        giftTitle:     form.giftTitle,
        giftValue:     form.giftValue,
        photoUrls:     photoUrls,
        voiceUrl:      voiceUrl,
        locale:        form.locale,
      };
      
      const id = await createExperience(draft);

      const base = typeof window !== 'undefined' ? window.location.origin : '';
      setCardId(id);
      setIsCardPaid(false); // Reset for new cards
      setShareUrl(`${base}/gift/${id}`);
      setStep('preview');
    } catch (err: any) {
      console.error('Failed to create:', err);
      if (err.message === 'DATABASE_UNAVAILABLE') {
        alert('Unable to connect to server. Please check your connection and try again.');
      } else {
        alert(`Error: ${err.message || 'Something went wrong. Please try again.'}`);
      }
    } finally {
      setSub(false);
    }
  };

  const copyLink = () => {
    if (!shareUrl) return;
    
    const shareText = locale === 'hi'
      ? `मैंने आपके लिए एक डिजिटल राखी गिफ्ट बनाया है! 🌸 इसे खोलने के लिए यहाँ क्लिक करें: ${shareUrl}`
      : `I made a digital Rakhi gift for you! 🌸 Click here to open it: ${shareUrl}`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareText).catch(() => {});
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const share = async () => {
    if (!shareUrl) return;
    
    const shareText = locale === 'hi'
      ? `मैंने आपके लिए एक डिजिटल राखी गिफ्ट बनाया है! 🌸 इसे खोलने के लिए यहाँ क्लिक करें:`
      : `I made a digital Rakhi gift for you! 🌸 Click here to open it:`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (navigator.share && window.isSecureContext) {
      navigator.share({ 
        title: 'Your Rakhi Gift 🌸', 
        text: shareText,
        url: shareUrl
      }).catch(() => {});
    } else if (isMobile) {
      window.location.href = `whatsapp://send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    } else {
      window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    }
  };

  // ─── Label helpers ────────────────────────────────────────────
  const locale = form.locale;

  // ─── Steps ───────────────────────────────────────────────────
  const steps: Record<Step, React.ReactNode> = {
    names: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Language toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
          {(['en','hi'] as Locale[]).map(l => (
            <button key={l} onClick={() => update('locale', l)} style={{
              padding: '6px 16px', borderRadius: 100, cursor: 'pointer',
              border: '1.5px solid rgba(201,168,76,0.4)',
              background: locale === l ? 'var(--gold)' : 'transparent',
              color: locale === l ? '#fff' : 'var(--gold)',
              fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.1em',
            }}>
              {l === 'en' ? 'English' : 'हिन्दी'}
            </button>
          ))}
        </div>

        <div>
          <label style={labelStyle}>{t('sender_name', locale)}</label>
          <input
            style={inputStyle}
            value={form.senderName}
            onChange={e => update('senderName', e.target.value)}
            placeholder={locale === 'hi' ? 'आपका नाम' : 'Your name'}
          />
        </div>
        <div>
          <label style={labelStyle}>{t('recipient_name', locale)}</label>
          <input
            style={inputStyle}
            value={form.recipientName}
            onChange={e => update('recipientName', e.target.value)}
            placeholder={locale === 'hi' ? 'भाई/बहन का नाम' : "Brother's / Sister's name"}
          />
        </div>
        <NavBtn
          onNext={() => form.senderName && form.recipientName ? goNext() : null}
          disabled={!form.senderName || !form.recipientName}
          locale={locale}
        />
      </div>
    ),

    letter: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={labelStyle}>{t('write_letter', locale)}</label>
          <button 
            onClick={() => update('letterText', locale === 'hi' 
              ? "रक्षाबंधन की बहुत-बहुत शुभकामनाएँ! 🌸 हमेशा मेरा साथ देने के लिए धन्यवाद। हम भले ही छोटी-छोटी बातों पर लड़ते हों, लेकिन मैं जानता/जानती हूँ कि हम हमेशा एक-दूसरे के साथ खड़े हैं।\n\nमुझे अपनी ज़िंदगी में तुम्हारे होने की बहुत ख़ुशी है। चलो हमेशा एक-दूसरे का साथ निभाने का वादा करें!"
              : "Happy Raksha Bandhan! 🌸 Thank you for always being my biggest supporter, my partner in crime, and my best friend. Even though we fight over silly things, I know I can always count on you.\n\nI am so lucky to have you in my life. Let's promise to always have each other's backs!"
            )}
            style={{ 
              background: 'rgba(201,168,76,0.15)', border: '1px solid var(--gold)', 
              color: 'var(--gold)', padding: '4px 10px', borderRadius: 20, 
              fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' 
            }}
          >
            ✨ {locale === 'hi' ? 'टेम्पलेट का उपयोग करें' : 'Use Template'}
          </button>
        </div>
        <textarea
          style={{ ...inputStyle, height: 200, resize: 'none', lineHeight: 1.8 }}
          value={form.letterText}
          onChange={e => update('letterText', e.target.value)}
          placeholder={locale === 'hi'
            ? 'प्रिय भाई/बहन, याद है जब हम टीवी के रिमोट के लिए लड़ते थे? हमेशा मेरा साथ देने के लिए शुक्रिया...'
            : 'Dear brother/sister, remember when we used to fight over the TV remote? Thank you for always protecting me...'}
        />
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(255,248,240,0.5)', marginTop: -8 }}>
          {form.letterText.length} characters
        </p>
        <NavBtn onNext={goNext} onBack={goBack} disabled={form.letterText.length < 10} locale={locale} />
      </div>
    ),

    photos: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <label style={labelStyle}>{t('add_photos', locale)}</label>
        <label style={{
          ...inputStyle,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 12, height: 140, cursor: 'pointer',
          borderStyle: 'dashed', textAlign: 'center',
        }}>
          <span style={{ fontSize: '2.4rem' }}>📷</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'rgba(255,248,240,0.5)' }}>
            {isCompressing 
              ? (locale === 'hi' ? 'कंप्रेस कर रहे हैं...' : 'Compressing...') 
              : (locale === 'hi' ? 'फ़ोटो चुनें (अधिकतम 5)' : 'Choose photos (max 5)')}
          </span>
          <input
            type="file" accept="image/*" multiple style={{ display: 'none' }}
            disabled={isCompressing}
            onChange={async e => {
              const files = Array.from(e.target.files ?? []).slice(0, 5);
              if (files.length === 0) return;
              setIsCompressing(true);
              try {
                const compressedFiles = await Promise.all(files.map(f => compressImage(f)));
                update('photos', compressedFiles);
              } catch (err) {
                console.error(err);
              } finally {
                setIsCompressing(false);
              }
            }}
          />
        </label>

        {/* Photo previews */}
        {photoPreviews.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {photoPreviews.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover',
                  boxShadow: '0 2px 12px rgba(26,42,74,0.15)', border: '2px solid rgba(201,168,76,0.3)' }}
              />
            ))}
          </div>
        )}
        <NavBtn onNext={goNext} onBack={goBack} locale={locale} />
      </div>
    ),

    voice: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <label style={labelStyle}>{t('record_voice', locale)}</label>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={recording ? stopRecording : startRecording}
          style={{
            height: 120, borderRadius: 20, border: 'none', cursor: 'pointer',
            background: recording
              ? 'radial-gradient(circle at 40% 35%, var(--saffron), var(--deep-red))'
              : 'rgba(201,168,76,0.08)',
            borderWidth: 1.5, borderStyle: 'dashed', borderColor: recording ? 'transparent' : 'rgba(201,168,76,0.4)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>{recording ? '⏹' : '🎙'}</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
            color: recording ? '#FFF8F0' : 'rgba(255,248,240,0.5)',
            letterSpacing: '0.08em' }}>
            {recording
              ? (locale === 'hi' ? 'रोकने के लिए टैप करें' : 'Tap to stop')
              : form.voiceUrl
              ? (locale === 'hi' ? 'फिर से रिकॉर्ड करें' : 'Re-record')
              : (locale === 'hi' ? 'रिकॉर्ड करने के लिए टैप करें' : 'Tap to record')}
          </span>
        </motion.button>

        {form.voiceUrl && !recording && (
          <audio controls src={form.voiceUrl}
            style={{ width: '100%', borderRadius: 8 }} />
        )}

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(255,248,240,0.5)' }}>
          {locale === 'hi' ? 'वैकल्पिक – छोड़ सकते हैं' : 'Optional — you can skip this'}
        </p>
        <NavBtn 
          onNext={() => {
            if (recording) stopRecording();
            goNext();
          }} 
          onBack={goBack} 
          locale={locale} 
        />
      </div>
    ),

    gift: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={labelStyle}>{t('choose_gift_type', locale)}</label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {GIFT_OPTIONS.map(opt => (
            <button
              key={opt.type}
              onClick={() => update('giftType', opt.type)}
              style={{
                padding: '16px 12px', borderRadius: 16, cursor: 'pointer',
                border: `2px solid ${form.giftType === opt.type ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
                background: form.giftType === opt.type ? 'rgba(255,255,255,0.05)' : 'transparent',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '2rem' }}>{opt.icon}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#FFF8F0', fontWeight: 500 }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        {/* Gift details */}
        <div>
          <label style={labelStyle}>
            {locale === 'hi' ? 'उपहार का नाम / शीर्षक' : 'Gift title'}
          </label>
          <input
            style={inputStyle}
            value={form.giftTitle}
            onChange={e => update('giftTitle', e.target.value)}
            placeholder={
              form.giftType === 'voucher' ? (locale === 'hi' ? 'उदा. Amazon Gift Card' : 'e.g. Amazon Gift Card') :
              form.giftType === 'payment_link' ? (locale === 'hi' ? 'उदा. राखी शगुन' : 'e.g. Rakhi Shagun') :
              form.giftType === 'coupon' ? (locale === 'hi' ? 'उदा. Zara पर 20% छूट' : 'e.g. 20% off at Zara') :
              (locale === 'hi' ? 'उदा. एक प्यारा सा सरप्राइज' : 'e.g. A sweet surprise message')
            }
          />
        </div>

        <div>
          <label style={labelStyle}>
            {form.giftType === 'coupon'           ? (locale === 'hi' ? 'कूपन कोड' : 'Coupon code') :
             form.giftType === 'surprise_message' ? (locale === 'hi' ? 'सरप्राइज संदेश' : 'Surprise message') :
             form.giftType === 'payment_link'     ? (locale === 'hi' ? 'राशि (₹)' : 'Amount (₹)') :
             (locale === 'hi' ? 'लिंक' : 'Link (URL)')}
          </label>
          {form.giftType === 'surprise_message' ? (
            <textarea
              style={{ ...inputStyle, height: 100, resize: 'none' }}
              value={form.giftValue}
              onChange={e => update('giftValue', e.target.value)}
              placeholder={locale === 'hi' ? 'मैं तुम्हें बहुत प्यार करता/करती हूँ...' : 'I love you so much and I am so proud of you...'}
            />
          ) : (
            <input
              style={inputStyle}
              value={form.giftValue}
              onChange={e => update('giftValue', e.target.value)}
              placeholder={
                form.giftType === 'voucher' ? (locale === 'hi' ? 'https://...' : 'https://...') :
                form.giftType === 'payment_link' ? (locale === 'hi' ? 'उदा. 1100' : 'e.g. 1100') :
                form.giftType === 'coupon' ? 'RAKHI2025' :
                (locale === 'hi' ? 'यहां दर्ज करें...' : 'Enter here...')
              }
              type={form.giftType === 'payment_link' ? 'number' : 'text'}
            />
          )}
        </div>

        <NavBtn
          onNext={goNext} onBack={goBack}
          disabled={!form.giftTitle || !form.giftValue}
          locale={locale}
        />
      </div>
    ),

    preview: shareUrl ? (
      /* ── SHARE SCREEN ──────────────────────────────── */
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: '5rem' }}
        >
          🎁
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#FFF8F0', fontStyle: 'italic' }}
        >
          {t('gift_sent', locale)}
        </motion.p>
        {/* Link is hidden per user request */}

        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <button
            onClick={() => {
              if (shareUrl) setIsPreviewModalOpen(true);
            }}
            style={{ ...btnStyle, flex: 1, background: 'transparent', color: 'var(--gold)' }}
          >
            {locale === 'hi' ? 'पूर्वावलोकन' : 'Preview'}
          </button>
          <button
            onClick={() => {
              if (cardId) {
                if (isCardPaid) {
                  share();
                } else {
                  payAndShare(cardId, false, () => {
                    setIsCardPaid(true);
                    // Do not call share() here because the browser blocks navigator.share() 
                    // without an immediate, synchronous user click.
                  });
                }
              }
            }}
            disabled={paymentLoading}
            style={{ ...btnStyle, flex: 1, background: 'linear-gradient(135deg, var(--saffron), var(--deep-red))', border: 'none', color: '#fff', opacity: paymentLoading ? 0.7 : 1 }}
          >
            {paymentLoading ? (paymentStatusMessage || 'Processing...') : (isCardPaid ? `${t('share_now', locale)} ↗` : `${t('share_now', locale)} ↗`)}
          </button>
        </div>
        
        {paymentError && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#ff4d4f', marginTop: 8 }}>
            {paymentError}
          </p>
        )}
      </div>
    ) : (
      /* ── PREVIEW / SEND ──────────────────────────────── */
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{
          background: 'rgba(201,168,76,0.06)',
          border: '1.5px solid rgba(201,168,76,0.2)',
          borderRadius: 16, padding: '20px',
        }}>
          <Row label="To"     value={form.recipientName} />
          <Row label="From"   value={form.senderName} />
          <Row label="Gift"   value={`${form.giftTitle} (${form.giftType})`} />
          <Row label="Photos" value={form.photos.length > 0 ? `${form.photos.length} photos` : 'None'} />
          <Row label="Voice"  value={form.voiceUrl ? 'Recorded ✓' : 'None'} />
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={submitting}
          onClick={handleSubmit}
          style={{
            ...btnStyle,
            background: 'linear-gradient(135deg, var(--saffron), var(--deep-red))',
            border: 'none', color: '#FFF8F0',
            fontSize: '1rem', padding: '16px',
            boxShadow: '0 8px 30px rgba(232,117,26,0.35)',
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 8 }}>
              <span>{t('sending', locale)}</span>
            </div>
          ) : t('send_gift', locale)}
        </motion.button>

        <button onClick={goBack} style={{ ...btnStyle, background: 'transparent' }}>
          ← {locale === 'hi' ? 'वापस जाएं' : 'Back'}
        </button>
      </div>
    ),
  };

  const stepLabels: Record<Step, string> = {
    names:   locale === 'hi' ? 'नाम'         : 'Names',
    letter:  locale === 'hi' ? 'पत्र'        : 'Letter',
    photos:  locale === 'hi' ? 'फ़ोटो'       : 'Photos',
    voice:   locale === 'hi' ? 'आवाज़'       : 'Voice',
    gift:    locale === 'hi' ? 'उपहार'       : 'Gift',
    preview: locale === 'hi' ? 'बनाएं'       : 'Create',
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'radial-gradient(ellipse at 55% 15%, #2A0D1E 0%, #160818 50%, #080408 100%)',
      padding: '0 0 40px',
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,4,8,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '16px 24px 12px',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.15rem', color: '#FFF8F0' }}>
            🌸 Rakhi
          </span>
          <div style={{ flex: 1 }} />
          <span className="hint-text">{stepLabels[step]}</span>
        </div>
        <ProgressBar step={step} />
      </div>

      {/* Step content */}
      <div style={{ padding: '28px 24px', maxWidth: 480, margin: '0 auto' }}>
        {/* Step title */}
        <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontStyle: 'italic',
            color: '#FFF8F0', marginBottom: 24,
          }}>
            {stepLabels[step]}
          </p>
          {steps[step]}
        </motion.div>
      </div>

      {/* Preview Modal */}
      {isPreviewModalOpen && shareUrl && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}>
          <div style={{ 
            padding: '16px 24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <span style={{ color: '#FFF8F0', fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 500 }}>
              {locale === 'hi' ? 'पूर्वावलोकन' : 'Preview'}
            </span>
            <button 
              onClick={() => setIsPreviewModalOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none',
                width: 36, height: 36, borderRadius: 18,
                color: '#fff', fontSize: '1.2rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>
          <iframe 
            src={shareUrl + '?preview=true'} 
            style={{ flex: 1, width: '100%', height: '100%', border: 'none', background: '#fff' }}
            title="Preview"
          />
        </div>
      )}

      {/* Submitting Overlay */}
      <AnimatePresence>
        {submitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'radial-gradient(ellipse at 50% 60%, #2A0D1E 0%, #160818 50%, #080408 100%)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 32,
              padding: '0 24px', textAlign: 'center',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {[120, 160, 200].map((size, i) => (
                <motion.div key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10 + i * 5, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    width: size, height: size,
                    borderRadius: '50%',
                    border: '1px dashed rgba(201,168,76,0.3)',
                    borderTopColor: 'rgba(232,117,26,0.8)'
                  }}
                />
              ))}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: '3.5rem' }}
              >
                🪔
              </motion.div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.5rem', color: '#FFF8F0' }}>
                {locale === 'hi' ? 'आपका उपहार तैयार हो रहा है...' : 'Crafting your gift...'}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'rgba(255,248,240,0.6)' }}>
                {locale === 'hi' ? 'इसमें कुछ सेकंड लग सकते हैं' : 'This might take a few seconds'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────

