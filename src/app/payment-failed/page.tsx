'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { usePayment } from '@/core/payments/usePayment';

export default function FailurePage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', background: '#080408', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF8F0', fontFamily: 'var(--font-sans)'
      }}>
        Loading...
      </div>
    }>
      <FailurePageContent />
    </Suspense>
  );
}

function FailurePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cardId = searchParams.get('cardId') || '';
  const locale = searchParams.get('locale') || 'en';
  const queryTemplateId = searchParams.get('template') || searchParams.get('templateId') || 'rakhi-2025';

  const { loading: paymentLoading, error: paymentError, paymentStatusMessage, payAndShare } = usePayment();
  const [templateId, setTemplateId] = useState<string>(queryTemplateId);

  // Load experience data to determine templateId if query parameter was missing
  useEffect(() => {
    if (!cardId || queryTemplateId !== 'rakhi-2025') return;
    import('@/core/database/storage').then(({ getExperience }) => {
      getExperience(cardId).then((exp) => {
        if (exp?.templateId) {
          setTemplateId(exp.templateId);
        }
      });
    });
  }, [cardId, queryTemplateId]);

  const handleRetry = () => {
    if (!cardId) return;
    payAndShare(
      cardId,
      false,
      () => {
        router.push(`/payment-success?cardId=${cardId}&locale=${locale}&template=${templateId}`);
      },
      () => {
        // Stay on failure page on repeat failures
      },
      templateId
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 55% 15%, #2A0D1E 0%, #160818 50%, #080408 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: 'var(--font-sans)',
      color: '#FFF8F0',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(201,168,76,0.15)',
        borderRadius: 24,
        padding: '40px 24px',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}>
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
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'rgba(255,248,240,0.7)', margin: 0, lineHeight: 1.5 }}>
          {locale === 'hi' 
            ? 'कृपया दोबारा प्रयास करें। आपके विवरण सुरक्षित सहेज लिए गए हैं।'
            : 'Please check your connection or payment method and try again. Your draft details are saved.'}
        </p>

        <button
          onClick={handleRetry}
          disabled={paymentLoading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #e8751a, #a11b1b)',
            border: 'none',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '16px',
            borderRadius: 12,
            cursor: paymentLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 24px rgba(232,117,26,0.3)',
            opacity: paymentLoading ? 0.7 : 1,
          }}
        >
          {paymentLoading
            ? (paymentStatusMessage || (locale === 'hi' ? 'प्रोसेस हो रहा है...' : 'Processing...'))
            : (locale === 'hi' ? 'पुनः प्रयास करें 🔄' : 'Try Again 🔄')}
        </button>

        {paymentError && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#ff4d4f', margin: 0 }}>
            {paymentError}
          </p>
        )}
      </div>
    </div>
  );
}
