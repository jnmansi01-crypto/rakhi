// src/shared/utils/downloadExperiencePDF.ts
// Generates a multi-page keepsake PDF of the full Rakhi gift experience.
// Pages: Cover → Letter → Photos (optional) → Gift Reveal
// Uses jsPDF (browser-only, lazy-loaded to avoid SSR issues).

import type { RakhiExperience } from '@/lib/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Fetch a remote image URL and return a base64 data string, or null on failure */
async function urlToBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/** Format a Unix timestamp to a readable date string */
function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

/** Wrap text to fit within a given width in jsPDF */
function addWrappedText(
  doc: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const lines: string[] = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line: string, i: number) => {
    doc.text(line, x, y + i * lineHeight);
  });
  return y + lines.length * lineHeight;
}

// ── Color palette ─────────────────────────────────────────────────────────────
const COLORS = {
  pageBg:       [10, 5, 10]    as [number, number, number],
  accent:       [201, 168, 76] as [number, number, number],
  accentLight:  [229, 201, 122] as [number, number, number],
  cream:        [255, 248, 240] as [number, number, number],
  muted:        [180, 160, 130] as [number, number, number],
  crimson:      [155, 34, 71]  as [number, number, number],
};

// ── Page builders ─────────────────────────────────────────────────────────────

function drawPageBackground(doc: any, pageW: number, pageH: number) {
  doc.setFillColor(...COLORS.pageBg);
  doc.rect(0, 0, pageW, pageH, 'F');
  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.5);
  doc.rect(8, 8, pageW - 16, pageH - 16, 'S');
  doc.setDrawColor(...COLORS.accentLight);
  doc.setLineWidth(0.2);
  doc.rect(12, 12, pageW - 24, pageH - 24, 'S');
  const corners = [[14, 14], [pageW - 14, 14], [14, pageH - 14], [pageW - 14, pageH - 14]];
  doc.setFillColor(...COLORS.accent);
  corners.forEach(([cx, cy]) => doc.circle(cx, cy, 1.2, 'F'));
}

function drawFooter(doc: any, pageW: number, pageH: number) {
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.text('loment.in', pageW / 2, pageH - 18, { align: 'center' });
  doc.text('RAKSHA BANDHAN 2026', pageW / 2, pageH - 13, { align: 'center' });
}

function drawDivider(doc: any, y: number, pageW: number) {
  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.3);
  doc.line(22, y, pageW - 22, y);
  doc.setFillColor(...COLORS.accent);
  doc.circle(pageW / 2, y, 1.5, 'F');
}

// ── PAGE 1: COVER ─────────────────────────────────────────────────────────────

function buildCoverPage(doc: any, experience: RakhiExperience, pageW: number, pageH: number) {
  drawPageBackground(doc, pageW, pageH);
  const cx = pageW / 2;

  doc.setFontSize(9);
  doc.setTextColor(...COLORS.accent);
  doc.setFont('helvetica', 'bold');
  doc.text('LOMENT', cx, 36, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.text('RAKSHA BANDHAN 2026', cx, 46, { align: 'center' });

  drawDivider(doc, 54, pageW);

  // Decorative Rakhi mandala
  const rakhiY = pageH * 0.38;
  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.3);
  doc.circle(cx, rakhiY, 30, 'S');
  doc.circle(cx, rakhiY, 22, 'S');
  doc.setFillColor(...COLORS.crimson);
  doc.circle(cx, rakhiY, 8, 'F');
  doc.setDrawColor(...COLORS.accentLight);
  doc.setLineWidth(0.5);
  doc.circle(cx, rakhiY, 8, 'S');
  doc.setFillColor(...COLORS.cream);
  doc.circle(cx, rakhiY, 3, 'F');
  const pearlAngles = Array.from({ length: 12 }, (_, i) => (i * 30 * Math.PI) / 180);
  doc.setFillColor(...COLORS.cream);
  pearlAngles.forEach((angle) => {
    doc.circle(cx + 22 * Math.cos(angle), rakhiY + 22 * Math.sin(angle), 1.5, 'F');
  });
  doc.setDrawColor(...COLORS.crimson);
  doc.setLineWidth(1.2);
  doc.line(cx - 30, rakhiY + 2, cx - 50, rakhiY + 2);
  doc.line(cx + 30, rakhiY + 2, cx + 50, rakhiY + 2);

  doc.setFontSize(22);
  doc.setTextColor(...COLORS.cream);
  doc.setFont('times', 'bold');
  doc.text('A Gift From the Heart', cx, pageH * 0.58, { align: 'center' });

  const blockY = pageH * 0.66;
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.text('FROM', cx - 28, blockY, { align: 'right' });
  doc.text('TO', cx - 28, blockY + 12, { align: 'right' });

  doc.setFontSize(13);
  doc.setTextColor(...COLORS.accentLight);
  doc.setFont('times', 'bold');
  doc.text(experience.senderName, cx - 24, blockY + 1);

  doc.setFontSize(13);
  doc.setTextColor(...COLORS.cream);
  doc.text(experience.recipientName, cx - 24, blockY + 13);

  drawDivider(doc, pageH * 0.78, pageW);
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.text(`Opened on ${formatDate(experience.createdAt)}`, cx, pageH * 0.82, { align: 'center' });

  drawFooter(doc, pageW, pageH);
}

// ── PAGE 2: LETTER ────────────────────────────────────────────────────────────

function buildLetterPage(doc: any, experience: RakhiExperience, pageW: number, pageH: number) {
  drawPageBackground(doc, pageW, pageH);
  const cx = pageW / 2;

  doc.setFontSize(8);
  doc.setTextColor(...COLORS.accent);
  doc.setFont('helvetica', 'bold');
  doc.text('A LETTER FOR YOU', cx, 34, { align: 'center' });

  drawDivider(doc, 42, pageW);

  doc.setFontSize(12);
  doc.setTextColor(...COLORS.accentLight);
  doc.setFont('times', 'italic');
  const salutation = experience.locale === 'hi'
    ? `My dearest ${experience.recipientName},`
    : `My dearest ${experience.recipientName},`;
  doc.text(salutation, 24, 56);

  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.cream);
  doc.setFont('times', 'normal');
  doc.setFillColor(...COLORS.accent);
  doc.rect(20, 62, 1.5, pageH - 100, 'F');

  const bodyY = addWrappedText(doc, experience.letterText, 26, 68, pageW - 50, 6.5);

  const sigY = Math.min(bodyY + 14, pageH - 50);
  drawDivider(doc, sigY, pageW);
  doc.setFontSize(13);
  doc.setFont('times', 'italic');
  doc.setTextColor(...COLORS.accentLight);
  doc.text(`— ${experience.senderName}`, pageW - 24, sigY + 14, { align: 'right' });

  drawFooter(doc, pageW, pageH);
}

// ── PAGE 3: PHOTOS ────────────────────────────────────────────────────────────

async function buildPhotosPage(doc: any, experience: RakhiExperience, pageW: number, pageH: number): Promise<void> {
  drawPageBackground(doc, pageW, pageH);
  const cx = pageW / 2;

  doc.setFontSize(8);
  doc.setTextColor(...COLORS.accent);
  doc.setFont('helvetica', 'bold');
  doc.text('MEMORIES', cx, 34, { align: 'center' });

  drawDivider(doc, 42, pageW);

  const photos = experience.photoUrls.slice(0, 3);
  const margin = 22;
  const availW = pageW - margin * 2;
  const cols = photos.length === 1 ? 1 : 2;
  const imgW = cols === 1 ? availW * 0.7 : (availW - 8) / 2;
  const imgH = imgW * 0.75;

  let row = 0;
  let col = 0;

  for (let i = 0; i < photos.length; i++) {
    const b64 = await urlToBase64(photos[i]);
    const x = margin + col * (imgW + 8);
    const y = 52 + row * (imgH + 10);

    if (b64) {
      doc.setFillColor(255, 255, 255);
      doc.rect(x - 2, y - 2, imgW + 4, imgH + 4, 'F');
      doc.addImage(b64, 'JPEG', x, y, imgW, imgH);
      doc.setDrawColor(...COLORS.accent);
      doc.setLineWidth(0.3);
      doc.rect(x - 2, y - 2, imgW + 4, imgH + 4, 'S');
    } else {
      doc.setFillColor(30, 20, 30);
      doc.rect(x, y, imgW, imgH, 'F');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.muted);
      doc.text('Photo unavailable', x + imgW / 2, y + imgH / 2, { align: 'center' });
    }

    col++;
    if (col >= cols) { col = 0; row++; }
  }

  drawFooter(doc, pageW, pageH);
}

// ── PAGE 4: GIFT REVEAL ───────────────────────────────────────────────────────

function buildGiftPage(doc: any, experience: RakhiExperience, pageW: number, pageH: number) {
  drawPageBackground(doc, pageW, pageH);
  const cx = pageW / 2;

  doc.setFontSize(8);
  doc.setTextColor(...COLORS.accent);
  doc.setFont('helvetica', 'bold');
  doc.text('YOUR GIFT', cx, 34, { align: 'center' });

  drawDivider(doc, 42, pageW);

  // Gift box decoration
  const boxX = cx;
  const boxY = pageH * 0.28;
  doc.setFillColor(155, 34, 71);
  doc.rect(boxX - 20, boxY - 16, 40, 28, 'F');
  doc.setFillColor(200, 50, 90);
  doc.rect(boxX - 20, boxY - 21, 40, 9, 'F');
  doc.setFillColor(...COLORS.accent);
  doc.rect(boxX - 3, boxY - 21, 6, 33, 'F');
  doc.rect(boxX - 20, boxY - 14, 40, 5, 'F');
  doc.setFillColor(...COLORS.accentLight);
  doc.ellipse(boxX - 10, boxY - 22, 8, 5, 'F');
  doc.ellipse(boxX + 10, boxY - 22, 8, 5, 'F');
  doc.setFillColor(...COLORS.accent);
  doc.circle(boxX, boxY - 22, 3, 'F');

  doc.setFontSize(16);
  doc.setTextColor(...COLORS.cream);
  doc.setFont('times', 'bold');
  const titleLines = doc.splitTextToSize(experience.giftTitle, pageW - 48);
  doc.text(titleLines, cx, pageH * 0.46, { align: 'center' });

  const giftTypeLabel =
    experience.giftType === 'surprise_message' ? 'Secret Message' :
    experience.giftType === 'payment_link' ? 'Gift Money' :
    experience.giftType === 'coupon' ? 'Special Coupon' : 'Gift Voucher';

  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.text(giftTypeLabel.toUpperCase(), cx, pageH * 0.52, { align: 'center' });

  const valBoxY = pageH * 0.56;
  doc.setFillColor(20, 10, 20);
  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.4);
  doc.roundedRect(cx - 55, valBoxY, 110, 30, 4, 4, 'FD');

  doc.setFontSize(13);
  doc.setFont('times', 'bold');
  doc.setTextColor(...COLORS.accentLight);
  const valDisplay = experience.giftValue.length > 38
    ? experience.giftValue.slice(0, 36) + '...'
    : experience.giftValue;
  doc.text(valDisplay, cx, valBoxY + 13, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('VOUCHER CODE / VALUE', cx, valBoxY + 24, { align: 'center' });

  const noteY = pageH * 0.74;
  drawDivider(doc, noteY, pageW);
  doc.setFontSize(9);
  doc.setFont('times', 'italic');
  doc.setTextColor(...COLORS.muted);
  doc.text(`With love, ${experience.senderName}`, cx, noteY + 12, { align: 'center' });

  drawFooter(doc, pageW, pageH);
}

// ── Main exported function ────────────────────────────────────────────────────

export async function downloadExperiencePDF(experience: RakhiExperience): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  buildCoverPage(doc, experience, pageW, pageH);

  doc.addPage();
  buildLetterPage(doc, experience, pageW, pageH);

  if (experience.photoUrls && experience.photoUrls.length > 0) {
    doc.addPage();
    await buildPhotosPage(doc, experience, pageW, pageH);
  }

  doc.addPage();
  buildGiftPage(doc, experience, pageW, pageH);

  const safeSender = experience.senderName.replace(/[^a-zA-Z0-9]/g, '_');
  const safeRecipient = experience.recipientName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Loment_RakshaBandhan2026_${safeSender}_to_${safeRecipient}.pdf`;

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
}
