import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "@/api/firebase";

const ORDERS_COLLECTION = "orders";

export type CartOrderItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

type CustomerDetails = {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
};

type PaymentInfo = {
  cardLast4: string;
  cardholderName: string;
  expireDate: string;
};

type CreateCheckoutOrderInput = {
  total: number;
  items: CartOrderItem[];
  customer: CustomerDetails;
  paymentInfo: PaymentInfo;
  userId: string | null;
};

export type CheckoutOrder = {
  id: string;
  orderId: string;
  userId: string | null;
  total: number;
  items: CartOrderItem[];
  customer: CustomerDetails;
  paymentInfo: PaymentInfo;
  orderType: string;
  status: string;
  createdAt?: unknown;
};

export async function createCheckoutOrder({
  total,
  items,
  customer,
  paymentInfo,
  userId,
}: CreateCheckoutOrderInput) {
  const orderRef = doc(collection(db, ORDERS_COLLECTION));

  await setDoc(orderRef, {
    orderId: orderRef.id,
    userId,
    total,
    items,
    customer,
    paymentInfo,
    orderType: "cart",
    status: "submitted",
    createdAt: serverTimestamp(),
  });

  return orderRef.id;
}

export async function getOrdersByUser(
  userId: string,
): Promise<CheckoutOrder[]> {
  const ordersQuery = query(
    collection(db, ORDERS_COLLECTION),
    where("userId", "==", userId),
  );

  const snapshot = await getDocs(ordersQuery);

  const orders = snapshot.docs.map((orderDoc) => ({
    id: orderDoc.id,
    ...(orderDoc.data() as Omit<CheckoutOrder, "id">),
  }));

  return orders.reverse();
}
