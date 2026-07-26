// lib/i18n.ts – English + Hindi strings

export type I18nKey =
  | 'tagline' | 'cta_create' | 'from' | 'to' | 'slide_to_open'
  | 'a_letter_for_you' | 'continue' | 'listen' | 'your_gift'
  | 'share_now' | 'copy_link' | 'copied' | 'celebrating'
  | 'step_names' | 'step_letter' | 'step_photos' | 'step_voice'
  | 'step_gift' | 'step_preview' | 'send_gift' | 'sending'
  | 'gift_sent' | 'share_link_hint' | 'recipient_name' | 'sender_name'
  | 'write_letter' | 'add_photos' | 'record_voice' | 'choose_gift_type'
  | 'rakhi_mubarak' | 'tie_rakhi_hint' | 'lift_to_reveal';

const strings: Record<I18nKey, { en: string; hi: string }> = {
  tagline:          { en: 'A gift that feels like home.',           hi: 'एक उपहार जो घर जैसा लगे।' },
  cta_create:       { en: 'Create your Rakhi Gift →',              hi: 'राखी का उपहार बनाएं →' },
  from:             { en: 'From',                                   hi: 'से' },
  to:               { en: 'To',                                     hi: 'को' },
  slide_to_open:    { en: 'slide to open',                         hi: 'खोलने के लिए स्लाइड करें' },
  a_letter_for_you: { en: 'A letter, just for you',                hi: 'एक पत्र, सिर्फ तुम्हारे लिए' },
  continue:         { en: 'Continue ✦',                            hi: 'आगे बढ़ें ✦' },
  listen:           { en: 'Tap to listen',                         hi: 'सुनने के लिए टैप करें' },
  your_gift:        { en: 'Your gift awaits',                      hi: 'तुम्हारा उपहार इंतज़ार कर रहा है' },
  share_now:        { en: 'Share',                                  hi: 'शेयर करें' },
  copy_link:        { en: 'Copy Link',                             hi: 'लिंक कॉपी करें' },
  copied:           { en: 'Copied!',                               hi: 'कॉपी हो गया!' },
  celebrating:      { en: '🎉 Happy Raksha Bandhan!',              hi: '🎉 राखी की हार्दिक शुभकामनाएं!' },
  step_names:       { en: 'Who is this for?',                      hi: 'यह किसके लिए है?' },
  step_letter:      { en: 'Write from the heart',                  hi: 'दिल से लिखें' },
  step_photos:      { en: 'Add memories',                          hi: 'यादें जोड़ें' },
  step_voice:       { en: 'Record your voice',                     hi: 'अपनी आवाज़ रिकॉर्ड करें' },
  step_gift:        { en: 'Choose a gift',                         hi: 'उपहार चुनें' },
  step_preview:     { en: 'Preview & Send',                        hi: 'देखें और भेजें' },
  send_gift:        { en: 'Create Rakhi Gift 🎁',                  hi: 'राखी का उपहार बनाएं 🎁' },
  sending:          { en: 'Creating...',                           hi: 'बना रहे हैं...' },
  gift_sent:        { en: 'Gift sent! Share the link below.',      hi: 'उपहार भेजा गया! नीचे लिंक शेयर करें।' },
  share_link_hint:  { en: 'Send this link to your sibling',        hi: 'यह लिंक अपने भाई/बहन को भेजें' },
  recipient_name:   { en: "Your sibling's name",                   hi: 'भाई/बहन का नाम' },
  sender_name:      { en: 'Your name',                             hi: 'आपका नाम' },
  write_letter:     { en: 'Write a heartfelt letter…',             hi: 'एक भावपूर्ण पत्र लिखें…' },
  add_photos:       { en: 'Add your favourite photos together',    hi: 'अपनी पसंदीदा तस्वीरें जोड़ें' },
  record_voice:     { en: 'Record a voice message',                hi: 'एक वॉइस मैसेज रिकॉर्ड करें' },
  choose_gift_type: { en: 'What would you like to gift?',         hi: 'आप क्या गिफ्ट करना चाहते हैं?' },
  rakhi_mubarak:    { en: 'Rakhi Mubarak! 🌸',                    hi: 'राखी मुबारक! 🌸' },
  tie_rakhi_hint:   { en: 'Hold to tie the Rakhi',                hi: 'राखी बांधने के लिए दबाए रखें' },
  lift_to_reveal:   { en: 'Lift to reveal your gift',             hi: 'उपहार देखने के लिए उठाएं' },
};

export function t(key: I18nKey, locale: 'en' | 'hi' = 'en'): string {
  return strings[key]?.[locale] ?? strings[key]?.en ?? key;
}
