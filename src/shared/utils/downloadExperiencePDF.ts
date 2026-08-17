// src/shared/utils/downloadExperiencePDF.ts
// Template-Aware HTML-to-PDF Generator for Raksha Bandhan 2026 Keepsakes.
// Faithfully renders the exact visual template (Template 1 Royal Classic or Template 2 Nostalgia Scrapbook)
// with 100% authentic backgrounds, color schemes, 3D graphics, photo frames, and gift cards (excluding voice note).

import type { RakhiExperience } from '@/lib/types';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export async function downloadExperiencePDF(experience: RakhiExperience): Promise<void> {
  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  const isTemplate02 = experience.templateId === 'template-02';
  const hasPhotos = experience.photoUrls && experience.photoUrls.length > 0;

  // Create temporary container for offscreen rendering
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '794px'; // A4 width at 96 DPI
  container.style.background = isTemplate02 ? '#110908' : '#0a0306';
  container.style.color = '#FFF8F0';

  if (isTemplate02) {
    // ═════════════════════════════════════════════════════════════════════════
    // TEMPLATE 02: NOSTALGIA SCRAPBOOK THEME
    // ═════════════════════════════════════════════════════════════════════════
    container.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Satisfy&family=Inter:wght@400;600&display=swap');
        
        .pdf-page-t2 {
          width: 794px;
          height: 1123px;
          box-sizing: border-box;
          padding: 50px 48px;
          background: radial-gradient(circle at center, #2c1b18 0%, #110908 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: 'Playfair Display', Georgia, serif;
          color: #FFF8F0;
        }

        .t2-wood-frame {
          position: absolute;
          inset: 16px;
          border: 1.5px solid rgba(199, 151, 116, 0.4);
          border-radius: 6px;
          pointer-events: none;
        }

        .t2-inner-frame {
          position: absolute;
          inset: 22px;
          border: 1px dashed rgba(199, 151, 116, 0.2);
          border-radius: 4px;
          pointer-events: none;
        }

        .t2-header-logo {
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          letter-spacing: 0.25em;
          color: #c79774;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .t2-header-sub {
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(255, 248, 240, 0.5);
          text-transform: uppercase;
        }

        .t2-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 16px 0;
        }
        .t2-divider::before, .t2-divider::after {
          content: '';
          height: 1px;
          width: 120px;
          background: linear-gradient(90deg, transparent, #c79774, transparent);
        }

        .t2-footer {
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-size: 9px;
          letter-spacing: 0.18em;
          color: rgba(199, 151, 116, 0.6);
          text-transform: uppercase;
        }
      </style>

      <!-- PAGE 1: WELCOME PARCEL -->
      <div class="pdf-page-t2">
        <div class="t2-wood-frame"></div>
        <div class="t2-inner-frame"></div>

        <div>
          <div class="t2-header-logo">✦ LOMENT ✦</div>
          <div class="t2-header-sub">Nostalgia Scrapbook · Raksha Bandhan 2026</div>
          <div class="t2-divider"></div>
        </div>

        <div style="text-align: center; padding: 20px 0;">
          <!-- 3D Wax Sealed Envelope Graphic -->
          <div style="width: 220px; height: 160px; margin: 0 auto 30px; background: #faf6ee; border: 1px solid #d4c8af; border-radius: 8px; position: relative; box-shadow: 0 16px 40px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
            <!-- Jute string cross -->
            <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
              <div style="width: 100%; height: 2px; background: #a37e58;"></div>
              <div style="height: 100%; width: 2px; background: #a37e58; position: absolute;"></div>
            </div>
            <!-- Red Wax Seal -->
            <div style="width: 56px; height: 56px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #d42617 0%, #9c150b 70%, #690a03 100%); border: 2px solid #e8a598; box-shadow: 0 6px 18px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 5;">
              <span style="font-family: 'Satisfy', cursive; font-size: 22px; color: #fff;">R</span>
            </div>
          </div>

          <h1 style="font-family: 'Playfair Display', serif; font-size: 36px; color: #FFF8F0; font-weight: 500; margin: 0 0 16px 0; font-style: italic;">
            A Parcel of Memories
          </h1>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(199,151,116,0.3); border-radius: 12px; padding: 24px 32px; max-width: 440px; margin: 0 auto;">
            <div style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.2em; color: #c79774; text-transform: uppercase; margin-bottom: 8px;">
              FROM SIBLING
            </div>
            <div style="font-family: 'Playfair Display', serif; font-size: 26px; color: #FFF8F0; font-weight: 700; margin-bottom: 16px;">
              ${experience.senderName}
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.2em; color: #c79774; text-transform: uppercase; margin-bottom: 8px;">
              PREPARED ESPECIALLY FOR
            </div>
            <div style="font-family: 'Playfair Display', serif; font-size: 26px; color: #c79774; font-weight: 700;">
              ${experience.recipientName}
            </div>
          </div>
        </div>

        <div>
          <div style="text-align: center; font-family: 'Inter', sans-serif; font-size: 11px; color: rgba(255,248,240,0.5); margin-bottom: 12px;">
            Opened on ${formatDate(experience.createdAt)}
          </div>
          <div class="t2-footer">✦ LOMENT KEEPSAKE SCRAPBOOK ✦</div>
        </div>
      </div>

      <!-- PAGE 2: SCRAPBOOK LETTER & LADDOO SWEET -->
      <div class="pdf-page-t2">
        <div class="t2-wood-frame"></div>
        <div class="t2-inner-frame"></div>

        <div>
          <div class="t2-header-logo">✧ THE HANDWRITTEN LETTER ✧</div>
          <div class="t2-divider"></div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 20px 0;">
          <!-- Vintage Parchment Card -->
          <div style="
            background: #faf6ee;
            border: 1px solid #d4c8af;
            border-radius: 12px;
            padding: 40px 36px;
            box-shadow: 0 16px 40px rgba(0,0,0,0.4);
            position: relative;
            color: #3d2b1f;
          ">
            <!-- 3D Laddoo Sweet Graphic -->
            <div style="width: 70px; height: 70px; position: absolute; top: -35px; right: 30px;">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <defs>
                  <radialGradient id="lad3d" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stop-color="#fff0ad"/>
                    <stop offset="30%" stop-color="#f5ba42"/>
                    <stop offset="70%" stop-color="#d18315"/>
                    <stop offset="100%" stop-color="#804700"/>
                  </radialGradient>
                </defs>
                <ellipse cx="50" cy="85" rx="35" ry="10" fill="rgba(0,0,0,0.2)"/>
                <circle cx="50" cy="50" r="35" fill="url(#lad3d)"/>
                <circle cx="40" cy="38" r="3" fill="#1b4d2e"/>
                <circle cx="62" cy="45" r="2.5" fill="#1b4d2e"/>
                <circle cx="48" cy="58" r="2" fill="#fff"/>
              </svg>
            </div>

            <div style="font-family: 'Satisfy', cursive; font-size: 26px; color: #804700; margin-bottom: 20px;">
              ${experience.locale === 'hi' ? `प्रिय ${experience.recipientName},` : `My dearest ${experience.recipientName},`}
            </div>

            <div style="
              font-family: 'Playfair Display', serif;
              font-size: 15px;
              line-height: 2.1;
              color: #3d2b1f;
              white-space: pre-wrap;
              font-style: italic;
              border-left: 2px solid #c79774;
              padding-left: 18px;
              margin-bottom: 28px;
            ">${experience.letterText}</div>

            <div style="text-align: right; font-family: 'Satisfy', cursive; font-size: 28px; color: #804700; font-weight: bold;">
              — ${experience.senderName}
            </div>
          </div>
        </div>

        <div class="t2-footer">✦ LOMENT SCRAPBOOK ARCHIVE ✦</div>
      </div>

      ${hasPhotos ? `
      <!-- PAGE 3: POLAROID PHOTO MEMORIES -->
      <div class="pdf-page-t2">
        <div class="t2-wood-frame"></div>
        <div class="t2-inner-frame"></div>

        <div>
          <div class="t2-header-logo">✧ POLAROID MEMORIES ✧</div>
          <div class="t2-divider"></div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px 0;">
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 28px; width: 100%;">
            ${experience.photoUrls.map((url, idx) => `
              <div style="
                background: #FFFDF8;
                padding: 12px 12px 32px 12px;
                border-radius: 4px;
                box-shadow: 0 16px 36px rgba(0,0,0,0.6);
                border: 1px solid #d4c8af;
                width: ${experience.photoUrls.length === 1 ? '460px' : '270px'};
                text-align: center;
                transform: rotate(${idx % 2 === 0 ? '-3deg' : '3deg'});
                position: relative;
              ">
                <!-- Washi tape sticker at top -->
                <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 80px; height: 20px; background: rgba(229, 201, 122, 0.4); border: 1px stroke rgba(201,168,76,0.3);"></div>
                <img src="${url}" style="width: 100%; height: ${experience.photoUrls.length === 1 ? '320px' : '200px'}; object-fit: cover; border-radius: 2px; display: block;" />
                <div style="font-family: 'Satisfy', cursive; font-size: 16px; color: #5C4033; margin-top: 12px;">
                  Precious Moments
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="t2-footer">✦ LOMENT POLAROID ALBUM ✦</div>
      </div>
      ` : ''}

      <!-- PAGE 4: RAKHI CEREMONY -->
      <div class="pdf-page-t2">
        <div class="t2-wood-frame"></div>
        <div class="t2-inner-frame"></div>

        <div>
          <div class="t2-header-logo">✧ SACRED RAKHI RITUAL ✧</div>
          <div class="t2-divider"></div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px 0;">
          <div style="
            background: #faf6ee;
            border: 1px solid #d4c8af;
            border-radius: 16px;
            padding: 40px 36px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 16px 40px rgba(0,0,0,0.5);
            color: #3d2b1f;
          ">
            <!-- Roli Chawal Thali Icon -->
            <div style="width: 120px; height: 120px; margin: 0 auto 24px;">
              <svg viewBox="0 0 120 120" width="100%" height="100%">
                <circle cx="60" cy="60" r="54" fill="#c79774" stroke="#a36f4d" stroke-width="3"/>
                <circle cx="60" cy="60" r="46" fill="#faf6ee" stroke="#c79774" stroke-width="1.5"/>
                <!-- Roli (red) bowl -->
                <circle cx="42" cy="55" r="16" fill="#d42617"/>
                <!-- Chawal (rice) bowl -->
                <circle cx="78" cy="55" r="16" fill="#fdfcf0" stroke="#d4cdab" stroke-width="1"/>
                <!-- Braided Thread -->
                <path d="M10 60 Q60 85 110 60" stroke="#d42617" stroke-width="4" fill="none"/>
                <path d="M10 60 Q60 85 110 60" stroke="#c79774" stroke-width="2" stroke-dasharray="4,2" fill="none"/>
              </svg>
            </div>

            <h3 style="font-family: 'Playfair Display', serif; font-size: 24px; color: #3d2b1f; font-weight: 600; margin: 0 0 12px 0;">
              Rakhi Tied with Love
            </h3>

            <p style="font-family: 'Playfair Display', serif; font-size: 15px; line-height: 1.9; color: #5c4033; font-style: italic; margin-bottom: 24px;">
              "No matter how far we are, the sacred thread of Rakhi keeps our hearts connected forever."
            </p>

            <div style="font-family: 'Satisfy', cursive; font-size: 22px; color: #804700;">
              For ${experience.recipientName} from ${experience.senderName}
            </div>
          </div>
        </div>

        <div class="t2-footer">✦ LOMENT RAKHI CEREMONY ✦</div>
      </div>

      <!-- PAGE 5: GIFT PARCEL -->
      <div class="pdf-page-t2">
        <div class="t2-wood-frame"></div>
        <div class="t2-inner-frame"></div>

        <div>
          <div class="t2-header-logo">✧ UNWRAPPED GIFT PARCEL ✧</div>
          <div class="t2-divider"></div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="
            background: #faf6ee;
            border: 1px solid #d4c8af;
            border-radius: 16px;
            padding: 40px 40px;
            text-align: center;
            width: 100%;
            max-width: 500px;
            box-shadow: 0 16px 40px rgba(0,0,0,0.5);
            color: #3d2b1f;
          ">
            <div style="width: 64px; height: 64px; margin: 0 auto 20px;">
              <svg viewBox="0 0 52 52" fill="none" width="100%" height="100%">
                <rect x="8" y="20" width="36" height="26" rx="2" fill="#c5906a" stroke="#a36f4d" stroke-width="1.5"/>
                <rect x="4" y="16" width="44" height="8" rx="2" fill="#a36f4d"/>
                <rect x="23" y="16" width="6" height="30" fill="#d4af37"/>
              </svg>
            </div>

            <h2 style="font-family: 'Playfair Display', serif; font-size: 26px; color: #3d2b1f; font-weight: 600; margin: 0 0 8px 0;">
              ${experience.giftTitle}
            </h2>

            <div style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.2em; color: #a36f4d; text-transform: uppercase; margin-bottom: 24px;">
              ${experience.giftType === 'surprise_message' ? 'SECRET MESSAGE' : experience.giftType === 'payment_link' ? 'GIFT MONEY' : 'GIFT VOUCHER'}
            </div>

            <div style="
              background: #f7f4ec;
              border: 1.5px dashed #c0b89f;
              border-radius: 12px;
              padding: 20px 24px;
              margin-bottom: 16px;
              word-break: break-all;
            ">
              <div style="font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #a36f4d; letter-spacing: 0.05em;">
                ${experience.giftValue}
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 9px; color: rgba(61,43,31,0.5); text-transform: uppercase; letter-spacing: 0.15em; margin-top: 6px;">
                VOUCHER CODE / VALUE
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style="text-align: center; font-family: 'Satisfy', cursive; font-size: 20px; color: #c79774; margin-bottom: 12px;">
            With love, ${experience.senderName}
          </div>
          <div class="t2-footer">✦ LOMENT KEEPSAKE PARCEL ✦</div>
        </div>
      </div>
    `;
  } else {
    // ═════════════════════════════════════════════════════════════════════════
    // TEMPLATE 01: ROYAL CLASSIC THEME
    // ═════════════════════════════════════════════════════════════════════════
    container.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Cinzel:wght@600;700&family=Inter:wght@400;600&display=swap');
        
        .pdf-page-t1 {
          width: 794px;
          height: 1123px;
          box-sizing: border-box;
          padding: 50px 48px;
          background: radial-gradient(ellipse at 50% 30%, #4a1525 0%, #1a080e 70%, #0a0306 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: 'Playfair Display', Georgia, serif;
          color: #FFF8F0;
        }

        .t1-gold-frame {
          position: absolute;
          inset: 16px;
          border: 1.5px solid rgba(201, 168, 76, 0.7);
          border-radius: 4px;
          pointer-events: none;
        }

        .t1-inner-frame {
          position: absolute;
          inset: 22px;
          border: 0.5px solid rgba(229, 201, 122, 0.3);
          border-radius: 2px;
          pointer-events: none;
        }

        .t1-header-logo {
          text-align: center;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          letter-spacing: 0.28em;
          color: #C9A84C;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .t1-header-sub {
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          letter-spacing: 0.22em;
          color: rgba(255, 248, 240, 0.6);
          text-transform: uppercase;
        }

        .t1-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 16px 0;
        }
        .t1-divider::before, .t1-divider::after {
          content: '';
          height: 1px;
          width: 120px;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
        }

        .t1-footer {
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-size: 9px;
          letter-spacing: 0.18em;
          color: rgba(201, 168, 76, 0.6);
          text-transform: uppercase;
        }
      </style>

      <!-- PAGE 1: COVER -->
      <div class="pdf-page-t1">
        <div class="t1-gold-frame"></div>
        <div class="t1-inner-frame"></div>

        <div>
          <div class="t1-header-logo">✦ LOMENT ✦</div>
          <div class="t1-header-sub">Royal Classic · Shubh Raksha Bandhan 2026</div>
          <div class="t1-divider"></div>
        </div>

        <div style="text-align: center; padding: 20px 0;">
          <!-- 3D Kundan Rakhi Medallion -->
          <div style="width: 160px; height: 160px; margin: 0 auto 30px; position: relative;">
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <defs>
                <radialGradient id="t1Gold" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stop-color="#FFE082"/>
                  <stop offset="40%" stop-color="#C9A84C"/>
                  <stop offset="100%" stop-color="#7A5C1B"/>
                </radialGradient>
                <radialGradient id="t1Ruby" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stop-color="#FF5252"/>
                  <stop offset="60%" stop-color="#9B2247"/>
                  <stop offset="100%" stop-color="#4A0B14"/>
                </radialGradient>
              </defs>
              <line x1="0" y1="50" x2="100" y2="50" stroke="#9B2247" stroke-width="4"/>
              <line x1="0" y1="50" x2="100" y2="50" stroke="url(#t1Gold)" stroke-width="1.5" stroke-dasharray="3,2"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="url(#t1Gold)" stroke-width="1"/>
              <circle cx="50" cy="50" r="32" fill="url(#t1Ruby)" stroke="url(#t1Gold)" stroke-width="1.5"/>
              <circle cx="50" cy="50" r="14" fill="url(#t1Gold)"/>
              <circle cx="50" cy="50" r="10" fill="#1A6B54" stroke="#FFF8F0" stroke-width="1"/>
              <circle cx="47" cy="47" r="3" fill="#FFFFFF" opacity="0.8"/>
            </svg>
          </div>

          <h1 style="font-family: 'Playfair Display', serif; font-size: 38px; color: #FFF8F0; font-weight: 500; margin: 0 0 16px 0; font-style: italic;">
            Royal Classic Keepsake
          </h1>

          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(201,168,76,0.3); border-radius: 12px; padding: 24px 32px; max-width: 440px; margin: 0 auto; backdrop-filter: blur(10px);">
            <div style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.2em; color: #C9A84C; text-transform: uppercase; margin-bottom: 8px;">
              A GIFT FROM
            </div>
            <div style="font-family: 'Playfair Display', serif; font-size: 26px; color: #FFF8F0; font-weight: 700; margin-bottom: 16px;">
              ${experience.senderName}
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.2em; color: #C9A84C; text-transform: uppercase; margin-bottom: 8px;">
              ESPECIALLY CRAFTED FOR
            </div>
            <div style="font-family: 'Playfair Display', serif; font-size: 26px; color: #E5C97A; font-weight: 700;">
              ${experience.recipientName}
            </div>
          </div>
        </div>

        <div>
          <div style="text-align: center; font-family: 'Inter', sans-serif; font-size: 11px; color: rgba(255,248,240,0.5); margin-bottom: 12px;">
            Opened on ${formatDate(experience.createdAt)}
          </div>
          <div class="t1-footer">✦ LOMENT DIGITAL RITUAL ✦</div>
        </div>
      </div>

      <!-- PAGE 2: LETTER & SHAGUN -->
      <div class="pdf-page-t1">
        <div class="t1-gold-frame"></div>
        <div class="t1-inner-frame"></div>

        <div>
          <div class="t1-header-logo">✧ THE PARCHMENT LETTER ✧</div>
          <div class="t1-divider"></div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 20px 0;">
          <div style="
            background: linear-gradient(135deg, #FFE2D1 0%, #FFB799 50%, #FF9973 100%);
            border: 1px solid rgba(255,255,255,0.4);
            border-radius: 16px;
            padding: 44px 40px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.6);
            position: relative;
            color: #3D2B1F;
          ">
            <div style="font-family: 'Playfair Display', serif; font-size: 22px; color: #9B2247; font-style: italic; margin-bottom: 24px;">
              ${experience.locale === 'hi' ? `प्रिय ${experience.recipientName},` : `My dearest ${experience.recipientName},`}
            </div>

            <div style="
              font-family: 'Playfair Display', serif;
              font-size: 16px;
              line-height: 2.1;
              color: #3D2B1F;
              white-space: pre-wrap;
              border-left: 2px solid rgba(201,168,76,0.8);
              padding-left: 20px;
              margin-bottom: 32px;
              font-style: italic;
            ">${experience.letterText}</div>

            <div style="text-align: right; font-family: 'Playfair Display', serif; font-size: 24px; color: #9B2247; font-weight: bold; font-style: italic;">
              — ${experience.senderName}
            </div>
          </div>
        </div>

        <div class="t1-footer">✦ LOMENT ROYAL ARCHIVE ✦</div>
      </div>

      ${hasPhotos ? `
      <!-- PAGE 3: PHOTOS -->
      <div class="pdf-page-t1">
        <div class="t1-gold-frame"></div>
        <div class="t1-inner-frame"></div>

        <div>
          <div class="t1-header-logo">✧ ROYAL MEMORIES ✧</div>
          <div class="t1-divider"></div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px 0;">
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; width: 100%;">
            ${experience.photoUrls.map(url => `
              <div style="
                background: #FFFDF8;
                padding: 12px 12px 28px 12px;
                border-radius: 4px;
                box-shadow: 0 12px 30px rgba(0,0,0,0.5);
                border: 1px solid rgba(201,168,76,0.6);
                width: ${experience.photoUrls.length === 1 ? '480px' : '280px'};
                text-align: center;
              ">
                <img src="${url}" style="width: 100%; height: ${experience.photoUrls.length === 1 ? '340px' : '200px'}; object-fit: cover; border-radius: 2px; display: block;" />
                <div style="font-family: 'Playfair Display', serif; font-size: 11px; color: #5C4033; margin-top: 10px; font-style: italic;">
                  Shubh Raksha Bandhan 2026
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="t1-footer">✦ LOMENT MEMORIES ✦</div>
      </div>
      ` : ''}

      <!-- PAGE 4: RAKHI CEREMONY -->
      <div class="pdf-page-t1">
        <div class="t1-gold-frame"></div>
        <div class="t1-inner-frame"></div>

        <div>
          <div class="t1-header-logo">✧ SACRED THREAD RITUAL ✧</div>
          <div class="t1-divider"></div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px 0;">
          <div style="
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(201,168,76,0.4);
            border-radius: 16px;
            padding: 40px 36px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          ">
            <div style="width: 140px; height: 140px; margin: 0 auto 24px;">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#C9A84C" stroke-width="1.5"/>
                <circle cx="50" cy="50" r="34" fill="#9B2247" stroke="#C9A84C" stroke-width="1.5"/>
                <circle cx="50" cy="50" r="16" fill="#C9A84C"/>
                <circle cx="50" cy="50" r="10" fill="#1A6B54" stroke="#FFF8F0" stroke-width="1"/>
                <line x1="0" y1="50" x2="100" y2="50" stroke="#9B2247" stroke-width="4"/>
              </svg>
            </div>

            <h3 style="font-family: 'Playfair Display', serif; font-size: 26px; color: #FFF8F0; font-weight: 600; margin: 0 0 12px 0;">
              Rakhi Tied with Blessings
            </h3>

            <p style="font-family: 'Playfair Display', serif; font-size: 15px; line-height: 1.9; color: #E5C97A; font-style: italic; margin-bottom: 24px;">
              "May the sacred thread of Rakhi protect you and bring endless happiness into your life."
            </p>

            <div style="font-family: 'Playfair Display', serif; font-size: 18px; color: #FFF8F0;">
              For ${experience.recipientName} from ${experience.senderName}
            </div>
          </div>
        </div>

        <div class="t1-footer">✦ LOMENT RAKHI CEREMONY ✦</div>
      </div>

      <!-- PAGE 5: GIFT REVEAL -->
      <div class="pdf-page-t1">
        <div class="t1-gold-frame"></div>
        <div class="t1-inner-frame"></div>

        <div>
          <div class="t1-header-logo">✧ THE SURPRISE GIFT ✧</div>
          <div class="t1-divider"></div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="
            background: linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(155,34,71,0.25) 100%);
            border: 1px solid rgba(201,168,76,0.6);
            border-radius: 20px;
            padding: 40px 48px;
            text-align: center;
            width: 100%;
            max-width: 520px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          ">
            <div style="width: 72px; height: 72px; margin: 0 auto 20px;">
              <svg viewBox="0 0 64 64" width="100%" height="100%">
                <rect x="10" y="24" width="44" height="34" rx="4" fill="#9B2247" stroke="#C9A84C" stroke-width="2"/>
                <rect x="6" y="16" width="52" height="10" rx="3" fill="#C9A84C"/>
                <rect x="28" y="16" width="8" height="42" fill="#E5C97A"/>
              </svg>
            </div>

            <h2 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #FFF8F0; font-weight: 600; margin: 0 0 8px 0;">
              ${experience.giftTitle}
            </h2>

            <div style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.22em; color: #C9A84C; text-transform: uppercase; margin-bottom: 28px;">
              ${experience.giftType === 'surprise_message' ? 'SECRET MESSAGE' : experience.giftType === 'payment_link' ? 'GIFT MONEY' : 'GIFT VOUCHER'}
            </div>

            <div style="
              background: #0d060e;
              border: 1.5px dashed #C9A84C;
              border-radius: 12px;
              padding: 20px 24px;
              margin-bottom: 16px;
              word-break: break-all;
            ">
              <div style="font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #E5C97A; letter-spacing: 0.05em;">
                ${experience.giftValue}
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 9px; color: rgba(255,248,240,0.5); text-transform: uppercase; letter-spacing: 0.15em; margin-top: 6px;">
                VOUCHER CODE / VALUE
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style="text-align: center; font-family: 'Playfair Display', serif; font-size: 16px; font-style: italic; color: #E5C97A; margin-bottom: 12px;">
            With love, ${experience.senderName}
          </div>
          <div class="t1-footer">✦ LOMENT KEEPSAKE ARCHIVE ✦</div>
        </div>
      </div>
    `;
  }

  document.body.appendChild(container);

  try {
    // Wait for images to load
    const images = Array.from(container.querySelectorAll('img'));
    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve(true);
            else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
            }
          }),
      ),
    );

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pages = container.querySelectorAll(isTemplate02 ? '.pdf-page-t2' : '.pdf-page-t1');

    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i] as HTMLElement;
      const canvas = await html2canvas(pageEl, {
        scale: 2, // 2x Crisp High DPI Canvas
        useCORS: true,
        allowTaint: true,
        backgroundColor: isTemplate02 ? '#110908' : '#0a0306',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      if (i > 0) doc.addPage();
      doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    }

    const safeSender = experience.senderName.replace(/[^a-zA-Z0-9]/g, '_');
    const safeRecipient = experience.recipientName.replace(/[^a-zA-Z0-9]/g, '_');
    const templateTag = isTemplate02 ? 'NostalgiaScrapbook' : 'RoyalClassic';
    const filename = `Loment_${templateTag}_RakshaBandhan2026_${safeSender}_to_${safeRecipient}.pdf`;

    const isIOS =
      typeof navigator !== 'undefined' &&
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as any).MSStream;

    if (isIOS) {
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } else {
      doc.save(filename);
    }
  } finally {
    document.body.removeChild(container);
  }
}
