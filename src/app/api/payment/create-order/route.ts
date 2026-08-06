import { NextResponse } from 'next/server';
import { getRazorpay, SHARE_PRICE } from '@/core/payments/razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cardId } = body;

    if (!cardId) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    if (SHARE_PRICE < 100) {
      return NextResponse.json({ error: 'Amount must be at least 100 paise' }, { status: 400 });
    }

    // Create a Razorpay order
    const options = {
      amount: SHARE_PRICE, // amount in the smallest currency unit (paise)
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
