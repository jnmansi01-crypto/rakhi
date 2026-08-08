import { NextResponse } from 'next/server';
import { getRazorpay } from '@/core/payments/razorpay';
import { getAdminDb } from '@/core/database/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cardId } = body;

    if (!cardId) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    // Default price is 299/- INR (29900 paise)
    let amountPaise = 29900; 

    // Retrieve template ID from Firestore to dynamically price the checkout order
    // Template 1 ('rakhi-2025') = 499/- INR (49900 paise)
    // Template 2 ('template-02') = 250/- INR (25000 paise)
    try {
      const db = getAdminDb();
      if (db) {
        const docSnap = await db.collection('experiences').doc(cardId).get();
        if (docSnap.exists) {
          const data = docSnap.data();
          const templateId = data?.templateId;
          if (templateId === 'rakhi-2025') {
            amountPaise = 49900;
          } else if (templateId === 'template-02') {
            amountPaise = 25000;
          }
        }
      }
    } catch (dbErr) {
      console.warn('Failed to retrieve template ID from Firestore, falling back to default price:', dbErr);
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
