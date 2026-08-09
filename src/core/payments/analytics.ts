/**
 * Custom GTM Data Layer Analytics Helper
 * 
 * Centralizes tracking behaviors for Loment Rakhi gifts.
 * Directly pushes analytical payload details into the GTM dataLayer.
 * Does not call Google Analytics or Meta Pixel directly.
 */

// Define GA4 Item schema
export interface GA4EcommerceItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}

// Define explicit DataLayer type structure with dynamic properties
export interface DataLayerEvent {
  event: string;
  currency: string;
  value: number;
  product_name: string;
  transaction_id?: string;
  items?: GA4EcommerceItem[];
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

// Maps template IDs to dynamic product names
export function getProductDetails(templateId: string): { name: string } {
  if (templateId === 'rakhi-2025') {
    return { name: 'Loment Premium Rakhi Card (Template 1)' };
  } else if (templateId === 'template-02') {
    return { name: 'Loment Premium Rakhi Card (Template 2)' };
  }
  // Fallback for custom or future templates dynamically
  const cleanId = templateId.replace('template-', 'Template ');
  const formattedId = cleanId.charAt(0).toUpperCase() + cleanId.slice(1);
  return { name: `Loment Premium Rakhi Card (${formattedId})` };
}

// Get price dynamically for a given template
export function getTemplatePrice(templateId: string): number {
  if (templateId === 'rakhi-2025') return 2;
  if (templateId === 'template-02') return 1;
  return 2; // Default fallback
}

// Tracks checkout initiation before opening Razorpay (GTM Data Layer + GA4 Ecommerce)
export function trackInitiateCheckout(amountPaise: number, templateId: string) {
  try {
    const valueRupees = amountPaise / 100;
    const { name: productName } = getProductDetails(templateId);

    const payload: DataLayerEvent = {
      event: 'initiate_checkout',
      currency: 'INR',
      value: valueRupees,
      product_name: productName,
      items: [
        {
          item_id: templateId,
          item_name: productName,
          price: valueRupees,
          quantity: 1,
        }
      ]
    };

    const dl = getDataLayer();
    dl.push(payload);
    console.log('[Analytics] Pushed initiate_checkout to dataLayer:', payload);
  } catch (err) {
    console.error('[Analytics] Failed to push initiate_checkout to dataLayer:', err);
  }
}

// Tracks payment completion inside verify handler (GTM Data Layer + GA4 Ecommerce)
export function trackPurchase(amountPaise: number, templateId: string, razorpayPaymentId: string) {
  try {
    const valueRupees = amountPaise / 100;
    const { name: productName } = getProductDetails(templateId);

    const payload: DataLayerEvent = {
      event: 'purchase',
      transaction_id: razorpayPaymentId,
      currency: 'INR',
      value: valueRupees,
      product_name: productName,
      items: [
        {
          item_id: templateId,
          item_name: productName,
          price: valueRupees,
          quantity: 1,
        }
      ]
    };

    const dl = getDataLayer();
    dl.push(payload);
    console.log('[Analytics] Pushed purchase to dataLayer:', payload);
  } catch (err) {
    console.error('[Analytics] Failed to push purchase to dataLayer:', err);
  }
}

// Tracks template selection on the gallery page
export function trackSelectItem(templateId: string) {
  try {
    const templatePrice = getTemplatePrice(templateId);
    const { name: productName } = getProductDetails(templateId);

    const payload = {
      event: 'select_item',
      currency: 'INR',
      value: templatePrice,
      items: [
        {
          item_id: templateId,
          item_name: productName,
          price: templatePrice,
          quantity: 1,
        }
      ]
    };

    const dl = getDataLayer();
    dl.push(payload);
    console.log('[Analytics] Pushed select_item to dataLayer:', payload);
  } catch (err) {
    console.error('[Analytics] Failed to push select_item to dataLayer:', err);
  }
}

// Tracks viewing the Create Editor once loaded and template configuration exists
export function trackViewItem(templateId: string) {
  try {
    const templatePrice = getTemplatePrice(templateId);
    const { name: productName } = getProductDetails(templateId);

    const payload = {
      event: 'view_item',
      currency: 'INR',
      value: templatePrice,
      items: [
        {
          item_id: templateId,
          item_name: productName,
          price: templatePrice,
          quantity: 1,
        }
      ]
    };

    const dl = getDataLayer();
    dl.push(payload);
    console.log('[Analytics] Pushed view_item to dataLayer:', payload);
  } catch (err) {
    console.error('[Analytics] Failed to push view_item to dataLayer:', err);
  }
}

// Tracks card creation completion right after the experience draft has been successfully saved
export function trackCreateCard(templateId: string, cardId: string) {
  try {
    const templatePrice = getTemplatePrice(templateId);
    const { name: productName } = getProductDetails(templateId);

    const payload = {
      event: 'create_card',
      card_id: cardId,
      currency: 'INR',
      value: templatePrice,
      items: [
        {
          item_id: templateId,
          item_name: productName,
          price: templatePrice,
          quantity: 1,
        }
      ]
    };

    const dl = getDataLayer();
    dl.push(payload);
    console.log('[Analytics] Pushed create_card to dataLayer:', payload);
  } catch (err) {
    console.error('[Analytics] Failed to push create_card to dataLayer:', err);
  }
}

// Tracks clicking WhatsApp sharing
export function trackShare(templateId: string) {
  try {
    const payload = {
      event: 'share',
      method: 'whatsapp',
      content_type: 'rakhi_card',
      item_id: templateId,
    };

    const dl = getDataLayer();
    dl.push(payload);
    console.log('[Analytics] Pushed share to dataLayer:', payload);
  } catch (err) {
    console.error('[Analytics] Failed to push share to dataLayer:', err);
  }
}

// Tracks when a recipient successfully opens a shared experience
export function trackExperienceOpened(cardId: string, templateId: string) {
  try {
    const { name: productName } = getProductDetails(templateId);

    const payload = {
      event: 'experience_opened',
      card_id: cardId,
      template_id: templateId,
      product_name: productName,
    };

    const dl = getDataLayer();
    dl.push(payload);
    console.log('[Analytics] Pushed experience_opened to dataLayer:', payload);
  } catch (err) {
    console.error('[Analytics] Failed to push experience_opened to dataLayer:', err);
  }
}

// Tracks when a recipient reaches the final scene/completion page of the experience
export function trackExperienceCompleted(cardId: string, templateId: string) {
  try {
    const { name: productName } = getProductDetails(templateId);

    const payload = {
      event: 'experience_completed',
      card_id: cardId,
      template_id: templateId,
      product_name: productName,
    };

    const dl = getDataLayer();
    dl.push(payload);
    console.log('[Analytics] Pushed experience_completed to dataLayer:', payload);
  } catch (err) {
    console.error('[Analytics] Failed to push experience_completed to dataLayer:', err);
  }
}
