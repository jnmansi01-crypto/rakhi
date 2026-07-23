// lib/types.ts – shared data types for the Rakhi experience

export type GiftType = 'voucher' | 'payment_link' | 'coupon' | 'surprise_message';
export type Locale = 'en' | 'hi';

export interface RakhiExperience {
  id: string;
  senderName: string;
  recipientName: string;
  letterText: string;
  giftType: GiftType;
  giftTitle: string;
  giftValue: string;            // URL, code, or message depending on type
  photoUrls: string[];
  voiceUrl: string | null;
  locale: Locale;
  createdAt: number;
  openedAt: number | null;
  replyMessage?: string;
}

export type ExperienceDraft = Omit<RakhiExperience, 'id' | 'createdAt' | 'openedAt'>;
