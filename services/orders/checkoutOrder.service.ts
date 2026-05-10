import axiosClient from "@/api/axiosClient";
import { collection, doc, getDocs } from "firebase/firestore";

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

function stringField(value: string) {
  return {
    stringValue: value,
  };
}

function numberField(value: number) {
  return {
    doubleValue: value,
  };
}

function integerField(value: number) {
  return {
    integerValue: String(value),
  };
}

function nullableStringField(value: string | null) {
  if (value) {
    return {
      stringValue: value,
    };
  }

  return {
    nullValue: null,
  };
}

function createOrderPayload({
  total,
  items,
  customer,
  paymentInfo,
  userId,
  orderId,
}: CreateCheckoutOrderInput & { orderId: string }) {
  return {
    fields: {
      orderId: stringField(orderId),

      userId: nullableStringField(userId),

      total: numberField(total),

      orderType: stringField("cart"),

      status: stringField("submitted"),

      createdAt: {
        timestampValue: new Date().toISOString(),
      },

      customer: {
        mapValue: {
          fields: {
            fullName: stringField(customer.fullName),
            phoneNumber: stringField(customer.phoneNumber),
            address: stringField(customer.address),
            city: stringField(customer.city),
          },
        },
      },

      paymentInfo: {
        mapValue: {
          fields: {
            cardLast4: stringField(paymentInfo.cardLast4),
            cardholderName: stringField(paymentInfo.cardholderName),
            expireDate: stringField(paymentInfo.expireDate),
          },
        },
      },

      items: {
        arrayValue: {
          values: items.map((item) => ({
            mapValue: {
              fields: {
                id: stringField(item.id),
                title: stringField(item.title),
                price: numberField(item.price),
                quantity: integerField(item.quantity),
                image: stringField(item.image ?? ""),
              },
            },
          })),
        },
      },
    },
  };
}

export async function createCheckoutOrder({
  total,
  items,
  customer,
  paymentInfo,
  userId,
}: CreateCheckoutOrderInput) {
  const orderId = doc(collection(db, ORDERS_COLLECTION)).id;

  await axiosClient.post(
    `/${ORDERS_COLLECTION}?documentId=${orderId}`,
    createOrderPayload({
      orderId,
      total,
      items,
      customer,
      paymentInfo,
      userId,
    }),
  );

  return orderId;
}

export async function clearCartItems() {
  const cartSnapshot = await getDocs(collection(db, CART_COLLECTION));

  // const deletePromises = cartSnapshot.docs.map((cartDoc) =>
  //   deleteDoc(doc(db, CART_COLLECTION, cartDoc.id)),
  // );

  // await Promise.all(deletePromises);
}
