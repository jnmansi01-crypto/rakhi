import type { GiftType, Locale } from '@/lib/types';

export const STEPS = ['names','letter','photos','voice','gift','preview'] as const;
export type Step = typeof STEPS[number];

export interface FormState {
  senderName: string;
  recipientName: string;
  letterText: string;
  photos: File[];
  voiceBlob: Blob | null;
  voiceUrl: string | null;
  giftType: GiftType;
  giftTitle: string;
  giftValue: string;
  locale: Locale;
}

export interface StepProps {
  form: FormState;
  update: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  goNext: () => void;
  goBack: () => void;
  locale: Locale;
}
