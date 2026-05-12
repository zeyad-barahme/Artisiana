import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/api/firebase';

const ORDERS_COLLECTION = 'orders';

export type PaymentStatus =
  | 'pending'
  | 'processing_verification'
  | 'paid'
  | 'failed'
  | 'cancelled';

type CreatePendingOrderInput = {
  amount: number;
  currency: string;
  selectedPlan: string;
  selectedPrice: string;
  userId: string | null;
};

type UpdateOrderPaymentStateInput = {
  orderId: string;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string | null;
};

export async function createPendingOrder({
  amount,
  currency,
  selectedPlan,
  selectedPrice,
  userId,
}: CreatePendingOrderInput) {
  const orderRef = doc(collection(db, ORDERS_COLLECTION));

  await setDoc(orderRef, {
    orderId: orderRef.id,
    userId,
    amount,
    currency,
    paymentStatus: 'pending',
    stripePaymentIntentId: null,
    orderType: 'subscription',
    planName: selectedPlan,
    priceLabel: selectedPrice,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return orderRef.id;
}

export async function updateOrderPaymentState({
  orderId,
  paymentStatus,
  stripePaymentIntentId,
}: UpdateOrderPaymentStateInput) {
  const updates: {
    paymentStatus: PaymentStatus;
    updatedAt: ReturnType<typeof serverTimestamp>;
    stripePaymentIntentId?: string | null;
  } = {
    paymentStatus,
    updatedAt: serverTimestamp(),
  };

  if (stripePaymentIntentId !== undefined) {
    updates.stripePaymentIntentId = stripePaymentIntentId;
  }

  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), updates);
}
