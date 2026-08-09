import { useState, useCallback } from 'react';
import type { OrderResponse, VerifyResponse, CheckoutOptions, RazorpayPaymentResponse } from '@/types/payment';
import { trackInitiateCheckout, trackPurchase } from './analytics';

// Add Razorpay to window interface
declare global {
  interface Window {
    Razorpay: any;
  }
}

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentStatusMessage, setPaymentStatusMessage] = useState<string | null>(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payAndShare = useCallback(async (
    cardId: string, 
    isPaidLocally: boolean, 
    onSuccess: () => void, 
    onFailure?: (msg: string) => void,
    templateId: string = 'rakhi-2025' // Default fallback template ID
  ) => {
    if (!cardId) {
      setError('Card ID is missing.');
      if (onFailure) onFailure('Card ID is missing.');
      return;
    }

    if (isPaidLocally) {
      // Already paid for this card, bypass payment
      onSuccess();
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentStatusMessage('Initializing secure payment...');

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        throw new Error('Razorpay SDK failed to load. Are you offline?');
      }

      // Create Order
      setPaymentStatusMessage('Creating order...');
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, templateId }),
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create payment order. Please try again.');
      }

      const orderData: OrderResponse = await orderRes.json();

      setPaymentStatusMessage('Awaiting payment...');
      const options: CheckoutOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Rakhi Card',
        description: 'Unlock sharing for your Rakhi Card',
        order_id: orderData.id,
        handler: async function (response: RazorpayPaymentResponse) {
          try {
            setLoading(true);
            setPaymentStatusMessage('Verifying payment securely...');
            
            // Verify Signature
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                cardId,
              }),
            });

            const verifyData: VerifyResponse = await verifyRes.json();

            if (verifyData.success) {
              setSuccess(true);
              setPaymentStatusMessage('Payment verified successfully!');
              
              // ─── Analytics Tracking (GTM Data Layer) ───
              // Trigger dynamic purchase tracking event on successful Razorpay verification
              trackPurchase(orderData.amount, templateId, response.razorpay_payment_id);
              
              onSuccess();
            } else {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
          } catch (err: any) {
            console.error('Verification error:', err);
            const errMsg = err.message || 'Payment verification failed';
            setError(errMsg);
            if (onFailure) onFailure(errMsg);
          } finally {
            setLoading(false);
            setPaymentStatusMessage(null);
          }
        },
        prefill: {
          name: 'Sender',
        },
        theme: {
          color: '#e8751a', // saffron
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setPaymentStatusMessage(null);
            setError('Payment cancelled.');
            if (onFailure) onFailure('Payment cancelled.');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: any) {
        setLoading(false);
        setPaymentStatusMessage(null);
        const failMsg = response.error.description || 'Payment failed.';
        setError(failMsg);
        if (onFailure) onFailure(failMsg);
      });

      // ─── Analytics Tracking (GTM Data Layer) ───
      // Immediately before opening the Razorpay payment modal, we push an 'initiate_checkout' 
      // event to GTM with the dynamic order value in rupees and the corresponding product template name.
      trackInitiateCheckout(orderData.amount, templateId);

      paymentObject.open();

    } catch (err: any) {
      console.error('Payment error:', err);
      const errMsg = err.message || 'An unexpected error occurred.';
      setError(errMsg);
      if (onFailure) onFailure(errMsg);
      setLoading(false);
      setPaymentStatusMessage(null);
    }
  }, [loadRazorpayScript]);

  return {
    loading,
    error,
    success,
    paymentStatusMessage,
    payAndShare,
  };
}
