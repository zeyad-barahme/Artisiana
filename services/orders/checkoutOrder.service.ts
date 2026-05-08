import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc
} from "firebase/firestore";

import { db } from "@/api/firebase";

const ORDERS_COLLECTION = "orders";
const CART_COLLECTION = "cart";

type CartOrderItem = {
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

export async function clearCartItems() {
  const cartSnapshot = await getDocs(collection(db, CART_COLLECTION));

  //const deletePromises = cartSnapshot.docs.map((cartDoc) =>
  //deleteDoc(doc(db, CART_COLLECTION, cartDoc.id)),
  //);

  //await Promise.all(deletePromises);
}
