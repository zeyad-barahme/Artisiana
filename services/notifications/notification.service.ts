import { db } from "@/api/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export type NotificationType =
  | "order"
  | "payment"
  | "review"
  | "offer"
  | "subscription"
  | "profile"
  | "cart"
  | "system";

type CreateNotificationInput = {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedScreen?: string;
  relatedId?: string;
  time?: string;
};

export async function createNotification({
  userId,
  title,
  message,
  type,
  relatedScreen = "",
  relatedId = "",
  time = "Just now",
}: CreateNotificationInput) {
  await addDoc(collection(db, "notifications"), {
    userId,
    title,
    message,
    type,
    isRead: false,
    relatedScreen,
    relatedId,
    time,
    createdAt: serverTimestamp(),
  });
}

export async function notifyAccountCreated(userId: string) {
  await createNotification({
    userId,
    title: "Welcome to Artisiana",
    message: "Your account is ready. Start exploring handmade crafts.",
    type: "system",
    relatedScreen: "profile",
    relatedId: userId,
  });
}

export async function notifyOrderPlaced(input: {
  userId: string;
  orderId: string;
  total: number;
}) {
  await createNotification({
    userId: input.userId,
    title: "Order placed",
    message: `Your order was placed successfully. Total: $${input.total.toFixed(2)}.`,
    type: "order",
    relatedScreen: "orders",
    relatedId: input.orderId,
  });
}

export async function notifyPaymentReceived(input: {
  userId: string;
  orderId: string;
  total: number;
}) {
  await createNotification({
    userId: input.userId,
    title: "Payment received",
    message: `We received your payment of $${input.total.toFixed(2)}.`,
    type: "payment",
    relatedScreen: "payment",
    relatedId: input.orderId,
  });
}

export async function notifySubscriptionActivated(input: {
  userId: string;
  subscriptionId: string;
  plan: string;
}) {
  await createNotification({
    userId: input.userId,
    title: "Subscription activated",
    message: `Your ${input.plan} subscription is now active.`,
    type: "subscription",
    relatedScreen: "subscription",
    relatedId: input.subscriptionId,
  });
}

export async function notifyReviewSubmitted(input: {
  userId: string;
  productId: string;
  rating: number;
}) {
  await createNotification({
    userId: input.userId,
    title: "Review submitted",
    message: `Thanks for rating this product ${input.rating}/5.`,
    type: "review",
    relatedScreen: "reviews",
    relatedId: input.productId,
  });
}

export async function notifyProfileUpdated(userId: string) {
  await createNotification({
    userId,
    title: "Profile updated",
    message: "Your profile changes were saved successfully.",
    type: "profile",
    relatedScreen: "profile",
    relatedId: userId,
  });
}

export async function notifyCartItemAdded(input: {
  userId: string;
  productId: string;
  productTitle: string;
}) {
  await createNotification({
    userId: input.userId,
    title: "Added to cart",
    message: `${input.productTitle} was added to your cart.`,
    type: "cart",
    relatedScreen: "cart",
    relatedId: input.productId,
  });
}

export async function notifyOfferAddedToCart(input: {
  userId: string;
  productId: string;
  productTitle: string;
}) {
  await createNotification({
    userId: input.userId,
    title: "Special offer added",
    message: `${input.productTitle} was added with the special offer price.`,
    type: "offer",
    relatedScreen: "cart",
    relatedId: input.productId,
  });
}
