import AsyncStorage from "@react-native-async-storage/async-storage";

const CHECKOUT_DRAFT_KEY = "checkout_details_draft";

export type CheckoutDraft = {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
};

export async function saveCheckoutDraft(draft: CheckoutDraft) {
  await AsyncStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
}

export async function loadCheckoutDraft() {
  const storedDraft = await AsyncStorage.getItem(CHECKOUT_DRAFT_KEY);

  if (!storedDraft) {
    return null;
  }

  return JSON.parse(storedDraft) as CheckoutDraft;
}

export async function clearCheckoutDraft() {
  await AsyncStorage.removeItem(CHECKOUT_DRAFT_KEY);
}
