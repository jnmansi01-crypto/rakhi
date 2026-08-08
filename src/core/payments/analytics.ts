/**
 * Custom GTM Data Layer Analytics Helper
 * 
 * Centralizes tracking behaviors for Loment Rakhi gifts.
 * Directly pushes analytical payload details into the GTM dataLayer.
 * Does not call Google Analytics or Meta Pixel directly.
 */

// Define explicit DataLayer type structure
export interface DataLayerEvent {
  event: string;
  currency: string;
  value: number;
  product_name: string;
  [key: string]: any;
}

// Safely access dataLayer
const getDataLayer = (): any[] => {
  if (typeof window !== 'undefined') {
    (window as any).dataLayer = (window as any).dataLayer || [];
    return (window as any).dataLayer;
  }
  return [];
};

// Tracks checkout initiation before opening Razorpay
export function trackInitiateCheckout(amountPaise: number, templateId: string) {
  try {
    const valueRupees = amountPaise / 100;
    
    // Set descriptive product names per template
    let productName = 'Loment Raksha Bandhan Experience';
    if (templateId === 'rakhi-2025') {
      productName = 'Loment Premium Rakhi Card (Template 1)';
    } else if (templateId === 'template-02') {
      productName = 'Loment Cosmic Scrapbook (Template 2)';
    }

    const payload: DataLayerEvent = {
      event: 'initiate_checkout',
      currency: 'INR',
      value: valueRupees,
      product_name: productName,
    };

    const dl = getDataLayer();
    dl.push(payload);
    console.log('[Analytics] Pushed to dataLayer:', payload);
  } catch (err) {
    console.error('[Analytics] Failed to push to dataLayer:', err);
  }
}
