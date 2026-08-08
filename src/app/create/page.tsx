'use client';
import { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createExperience } from '@/core/database/storage';
import { compressImage } from '@/core/uploads/imageUtils';
import { uploadMedia } from '@/core/uploads/cloudinary';
import { useAudioRecorder } from '@/shared/uploader/useAudioRecorder';
import { usePayment } from '@/core/payments/usePayment';
import type { GiftType, ExperienceDraft, Locale } from '@/lib/types';
import { t } from '@/lib/i18n';
import { getTemplate } from '@/template-engine/index';
import type { TemplatePlugin } from '@/template-engine/types';

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

import { NavBtn } from '@/shared/buttons/NavBtn';
import { Row, labelStyle, inputStyle, btnStyle } from '@/shared/inputs/inputs';

// ─── Main CreatePage ──────────────────────────────────────────
export default function CreatePage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', background: '#080408', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF8F0', fontFamily: 'var(--font-sans)'
      }}>
        Loading...
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  );
}

function CreatePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('template') || 'rakhi-2025';
  const [templateConfig, setTemplateConfig] = useState<TemplatePlugin | null>(null);

  useEffect(() => {
    getTemplate(templateId).then(setTemplateConfig);
  }, [templateId]);

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
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [showFailureScreen, setShowFailureScreen] = useState(false);

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
        templateId:    templateId,
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

    letter: (() => {
      const configTemplates = templateConfig?.createConfig?.letterTemplates;
      const TEMPLATES = configTemplates ? configTemplates.map(tpl => ({
        emoji: tpl.emoji,
        title: locale === 'hi' ? tpl.titleHi : tpl.titleEn,
        preview: locale === 'hi' ? tpl.previewHi : tpl.previewEn,
        text: locale === 'hi' ? tpl.textHi : tpl.textEn,
      })) : (locale === 'hi' ? [
        {
          emoji: '💛',
          title: 'दिल से',
          preview: 'हमेशा मेरा साथ देने के लिए...',
          text: `प्रिय भाई/बहन,\n\nरक्षाबंधन की बहुत-बहुत शुभकामनाएँ! 🌸\n\nहमेशा मेरा साथ देने के लिए, हर मुश्किल में खड़े रहने के लिए, और मुझे हमेशा हँसाने के लिए — शुक्रिया। हम भले ही छोटी-छोटी बातों पर झगड़ते हों, लेकिन मैं जानता/जानती हूँ कि तुम हमेशा मेरे साथ हो।\n\nतुम्हारे होने से मेरी ज़िंदगी बहुत खूबसूरत है। यह राखी उस प्यार का एक छोटा सा इज़हार है।\n\nहमेशा तुम्हारा/तुम्हारी ❤️`,
        },
        {
          emoji: '😄',
          title: 'मज़ेदार',
          preview: 'याद है जब हमने मम्मी का...',
          text: `हे भाई/बहन,\n\nरक्षाबंधन मुबारक! 🎉\n\nयाद है जब हमने मम्मी का खाना चुराया था और एक-दूसरे पर इल्ज़ाम लगाया था? या जब हम TV रिमोट के लिए घंटों लड़ते थे?\n\nसच में, तुम मेरे सबसे पहले दोस्त हो — और सबसे पक्के भी। इस साल की राखी पर, मैं promise करता/करती हूँ कि... थोड़ा कम झगड़ूँगा/झगड़ूँगी। थोड़ा ही! 😄\n\nतुम्हारा/तुम्हारी, हमेशा ❤️`,
        },
        {
          emoji: '🌟',
          title: 'भावुक',
          preview: 'दूरी कितनी भी हो...',
          text: `मेरे प्यारे भाई/बहन,\n\nआज इस खास दिन पर, मैं चाहता/चाहती हूँ कि तुम जानो — चाहे दूरी कितनी भी हो, तुम हमेशा मेरे दिल के करीब हो।\n\nहर सपने में तुमने साथ दिया, हर तकलीफ में हिम्मत बँधाई। तुम सिर्फ मेरे भाई/बहन नहीं, मेरी ताकत हो।\n\nयह राखी उस अटूट रिश्ते की निशानी है। 🌸\n\nतुम्हारा/तुम्हारी, सदा ❤️`,
        },
      ] : [
        {
          emoji: '💛',
          title: 'Heartfelt',
          preview: 'Thank you for always being there...',
          text: `Dear brother/sister,\n\nHappy Raksha Bandhan! 🌸\n\nThank you for always being my biggest supporter, my partner in crime, and my best friend. Even though we fight over silly things, I know I can always count on you.\n\nI am so lucky to have you in my life. This Rakhi is a small token of the huge love I carry for you.\n\nAlways yours ❤️`,
        },
        {
          emoji: '😄',
          title: 'Funny',
          preview: 'Remember when we blamed each other...',
          text: `Hey bro/sis,\n\nHappy Raksha Bandhan! 🎉\n\nRemember when we used to blame each other for eating the last biscuit? Or when we'd fight over the TV remote for hours on end?\n\nYou were my first best friend — and honestly, my most permanent one. This year, I promise to fight with you a little less. Just a little. 😄\n\nYours forever ❤️`,
        },
        {
          emoji: '🌟',
          title: 'Emotional',
          preview: 'No matter the distance between us...',
          text: `My dearest brother/sister,\n\nOn this special day, I want you to know — no matter the miles between us, you are always close to my heart.\n\nYou've cheered on every dream I've chased, held me up through every storm, and made every ordinary day feel special. You are not just my sibling — you are my strength.\n\nThis Rakhi is a symbol of that unbreakable bond. 🌸\n\nForever yours ❤️`,
        },
      ]);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={labelStyle}>{t('write_letter', locale)}</label>

          {/* Template Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', margin: 0 }}>
              ✨ {locale === 'hi' ? 'एक टेम्पलेट चुनें या खुद लिखें' : 'Pick a template or write your own'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {TEMPLATES.map((tpl, i) => {
                const isSelected = form.letterText === tpl.text;
                return (
                  <button
                    key={i}
                    onClick={() => update('letterText', isSelected ? '' : tpl.text)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: 12,
                      cursor: 'pointer',
                      border: `1.5px solid ${isSelected ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
                      background: isSelected ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      textAlign: 'center', transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{tpl.emoji}</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, color: isSelected ? 'var(--gold)' : '#FFF8F0', letterSpacing: '0.04em' }}>
                      {tpl.title}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', color: 'rgba(255,248,240,0.45)', lineHeight: 1.4 }}>
                      {tpl.preview}
                    </span>
                  </button>
                );
              })}
            </div>
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
      );
    })(),


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

        {form.voiceUrl && form.voiceUrl.startsWith('blob:') && !recording && (
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

    preview: showSuccessScreen ? (
      /* ── PAYMENT SUCCESS SCREEN ─────────────────────── */
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: '5rem' }}
        >
          🌸
        </motion.div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#FFF8F0', fontStyle: 'italic', margin: 0 }}>
          {locale === 'hi' 
            ? 'पैक किया गया राखी बॉक्स!' 
            : 'Thank you for your purchase with a rakhi, roli and chawal packed in a transparent box'}
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'rgba(255,248,240,0.7)', margin: 0 }}>
          {locale === 'hi' 
            ? 'आपका गिफ्ट तैयार है, अब अपने भाई या बहन के साथ साझा करें।'
            : 'Your gift is ready. You can now share the link with your sibling.'}
        </p>

        <button
          onClick={share}
          style={{ ...btnStyle, width: '100%', background: 'linear-gradient(135deg, var(--saffron), var(--deep-red))', border: 'none', color: '#fff' }}
        >
          {locale === 'hi' ? 'लिंक साझा करें ↗' : 'Share your link ↗'}
        </button>
      </div>
    ) : showFailureScreen ? (
      /* ── PAYMENT FAILURE SCREEN ─────────────────────── */
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: '5rem' }}
        >
          ⚠️
        </motion.div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#ff4d4f', fontStyle: 'italic', margin: 0 }}>
          {locale === 'hi' ? 'ओह! आपका भुगतान विफल रहा' : 'Oh! Your payment failed'}
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'rgba(255,248,240,0.7)', margin: 0 }}>
          {locale === 'hi' 
            ? 'कृपया दोबारा प्रयास करें। आपके विवरण सुरक्षित सहेज लिए गए हैं।'
            : 'Please check your connection or payment method and try again. Your draft details are saved.'}
        </p>

        <button
          onClick={() => {
            if (cardId) {
              setShowFailureScreen(false);
              payAndShare(
                cardId, 
                false, 
                () => {
                  setIsCardPaid(true);
                  setShowSuccessScreen(true);
                },
                () => {
                  setShowFailureScreen(true);
                }
              );
            }
          }}
          disabled={paymentLoading}
          style={{ ...btnStyle, width: '100%', background: 'linear-gradient(135deg, var(--saffron), var(--deep-red))', border: 'none', color: '#fff', opacity: paymentLoading ? 0.7 : 1 }}
        >
          {paymentLoading
            ? (paymentStatusMessage || (locale === 'hi' ? 'प्रोसेस हो रहा है...' : 'Processing...'))
            : (locale === 'hi' ? 'पुनः प्रयास करें 🔄' : 'Try Again 🔄')}
        </button>
      </div>
    ) : shareUrl ? (
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
          {locale === 'hi' ? 'आपका गिफ्ट ड्राफ्ट तैयार हो चुका है 🌸' : 'Your gift draft has been created 🌸'}
        </motion.p>

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
                payAndShare(
                  cardId, 
                  false, 
                  () => {
                    setIsCardPaid(true);
                    router.push(`/payment-success?cardId=${cardId}&locale=${locale}`);
                  },
                  () => {
                    router.push(`/payment-failed?cardId=${cardId}&locale=${locale}`);
                  }
                );
              }
            }}
            disabled={paymentLoading}
            style={{ ...btnStyle, flex: 1, background: 'linear-gradient(135deg, var(--saffron), var(--deep-red))', border: 'none', color: '#fff', opacity: paymentLoading ? 0.7 : 1 }}
          >
            {paymentLoading
              ? (paymentStatusMessage || (locale === 'hi' ? 'प्रोसेस हो रहा है...' : 'Processing...'))
              : (locale === 'hi' ? '₹299 का भुगतान करें 🌸' : 'Pay ₹299 & Send 🌸')
            }
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
            <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Outer pulsing glow */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.45, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', width: 140, height: 140, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)',
                  filter: 'blur(10px)'
                }}
              />
              {/* Premium Rotating Geometric Mandala rings */}
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', width: 130, height: 130 }}
                viewBox="0 0 100 100"
              >
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(201,168,76,0.18)" strokeWidth="0.8" strokeDasharray="3 6" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(201,168,76,0.35)" strokeWidth="1" strokeDasharray="15 5" />
              </motion.svg>
              <motion.svg
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', width: 90, height: 90 }}
                viewBox="0 0 100 100"
              >
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(229,201,122,0.4)" strokeWidth="1.2" strokeDasharray="4 8" />
              </motion.svg>
              {/* Center custom vector golden polaroid Loment logo icon (NO Emojis) */}
              <motion.div
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img 
                  src="/images/loment-logo.svg" 
                  alt="Loment Loading Logo" 
                  style={{ width: 44, height: 44, objectFit: 'contain' }}
                />
              </motion.div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, zIndex: 2 }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#FFF8F0', letterSpacing: '0.04em', margin: 0 }}>
                {locale === 'hi' ? 'आपका उपहार तैयार हो रहा है...' : 'Crafting your experience...'}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'rgba(201,168,76,0.6)', letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>
                {locale === 'hi' ? 'कृपया प्रतीक्षा करें' : 'creating your keepsake link'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────

