import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
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
  updatedAt?: unknown;
  receivedAt?: unknown;
};

const getTimestampMillis = (value: unknown) => {
  if (
    value &&
    typeof value === "object" &&
    "toMillis" in value &&
    typeof value.toMillis === "function"
  ) {
    return value.toMillis();
  }

  return 0;
};

const sortOrdersByNewest = (orders: CheckoutOrder[]) => {
  return orders.sort((a, b) => {
    return getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt);
  });
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
    updatedAt: serverTimestamp(),
  });

  return orderRef.id;
}

export async function getOrdersByUser(
  userId: string
): Promise<CheckoutOrder[]> {
  const ordersQuery = query(
    collection(db, ORDERS_COLLECTION),
    where("userId", "==", userId),
    where("orderType", "==", "cart")
  );

  const snapshot = await getDocs(ordersQuery);

  const orders = snapshot.docs.map((orderDoc) => ({
    id: orderDoc.id,
    ...(orderDoc.data() as Omit<CheckoutOrder, "id">),
  }));

  return sortOrdersByNewest(orders);
}

export function listenToUserOrders(
  userId: string,
  onChange: (orders: CheckoutOrder[]) => void,
  onError?: (error: unknown) => void
) {
  const ordersQuery = query(
    collection(db, ORDERS_COLLECTION),
    where("userId", "==", userId),
    where("orderType", "==", "cart")
  );

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      const orders = snapshot.docs.map((orderDoc) => ({
        id: orderDoc.id,
        ...(orderDoc.data() as Omit<CheckoutOrder, "id">),
      }));

      onChange(sortOrdersByNewest(orders));
    },
    (error) => {
      console.log("Orders listener error:", error);
      onError?.(error);
    }
  );
}

export async function markOrderAsReceived(orderId: string) {
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    status: "received",
    receivedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}