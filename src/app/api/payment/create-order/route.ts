import { NextResponse } from 'next/server';
import { getRazorpay } from '@/core/payments/razorpay';
import { getAdminDb } from '@/core/database/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cardId, templateId: bodyTemplateId } = body;

    if (!cardId) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    // Default price is 150/- INR (15000 paise)
    let amountPaise = 15000; 

    // Retrieve template ID from body or fall back to Firestore if undefined
    let templateId = bodyTemplateId;

    if (!templateId) {
      try {
        const db = getAdminDb();
        if (db) {
          const docSnap = await db.collection('experiences').doc(cardId).get();
          if (docSnap.exists) {
            const data = docSnap.data();
            templateId = data?.templateId;
          }
        }
      } catch (dbErr) {
        console.warn('Failed to retrieve template ID from Firestore:', dbErr);
      }
    }

    // Assign template pricing (Template 1 = 150/- INR, Template 2 = 150/- INR)
    if (templateId === 'rakhi-2025') {
      amountPaise = 15000;
    } else if (templateId === 'template-02') {
      amountPaise = 15000;
    }

    // Create a Razorpay order
    const options = {
      amount: amountPaise, // amount in the smallest currency unit (paise)
      currency: 'INR',
      notes: {
        cardId: cardId, // Store cardId in notes for reference
      },
    };

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
