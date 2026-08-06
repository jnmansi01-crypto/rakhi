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
  /**
   * Which template plugin rendered this experience.
   * Optional for backwards compatibility — legacy records without this
   * field default to 'rakhi-2025' at render time.
   */
  templateId?: string;
}

export type ExperienceDraft = Omit<RakhiExperience, 'id' | 'createdAt' | 'openedAt'>;
