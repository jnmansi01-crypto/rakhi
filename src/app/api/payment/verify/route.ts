import { NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { getAdminDb } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cardId } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !cardId) {
      return NextResponse.json({ success: false, message: 'Missing payment details' }, { status: 400 });
    }

    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (isValid) {
      // Mark card as paid in Firestore
      try {
        const db = getAdminDb();
        if (db) {
          await db.collection('experiences').doc(cardId).update({
            isPaid: true,
            paymentDetails: {
              orderId: razorpay_order_id,
              paymentId: razorpay_payment_id,
              paidAt: new Date().toISOString(),
            }
          });
        } else {
          console.warn('Skipping Firestore update because admin DB is not configured.');
        }
      } catch (dbError) {
        console.error('Error updating document in Firestore:', dbError);
        // Even if DB fails, payment was successful. Depending on strictness, we might still return success.
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
