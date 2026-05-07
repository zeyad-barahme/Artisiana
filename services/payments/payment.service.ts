import {
  PaymentSheetError,
  type PaymentSheet,
  type StripeError,
} from '@stripe/stripe-react-native';

type CreatePaymentSheetParams = {
  amount: number;
  currency: string;
  orderId: string;
  selectedPlan: string;
  userId: string | null;
  initPaymentSheet: (
    params: PaymentSheet.SetupParams,
  ) => Promise<{ error?: StripeError<PaymentSheetError> }>;
};

type CreatePaymentIntentResponse = {
  customer: string;
  ephemeralKey: string;
  paymentIntent: string;
};

type StripePaymentResult =
  | { status: 'completed' }
  | { status: 'cancelled'; message: string }
  | { status: 'failed'; message: string };

const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? '';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ?? '';

export function getStripePublishableKey() {
  return STRIPE_PUBLISHABLE_KEY;
}

export function parsePriceToAmount(selectedPrice: string) {
  const normalizedValue = Number(selectedPrice.replace(/[^0-9.]/g, ''));

  if (!Number.isFinite(normalizedValue) || normalizedValue <= 0) {
    throw new Error('Invalid price. Please review the selected plan amount.');
  }

  return Math.round(normalizedValue * 100);
}

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error(
      'Missing EXPO_PUBLIC_API_BASE_URL. Add your backend base URL to the app environment.',
    );
  }

  return API_BASE_URL.replace(/\/+$/, '');
}

function extractPaymentIntentId(clientSecret: string) {
  return clientSecret.split('_secret_')[0] ?? clientSecret;
}

async function createPaymentIntentRequest(payload: {
  amount: number;
  currency: string;
  orderId: string;
  selectedPlan: string;
  userId: string | null;
}) {
  const response = await fetch(
    `${getApiBaseUrl()}/payments/create-payment-intent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  let responseBody: unknown = null;

  try {
    responseBody = await response.json();
  } catch {
    responseBody = null;
  }

  if (!response.ok) {
    const message =
      typeof responseBody === 'object' &&
      responseBody !== null &&
      'message' in responseBody &&
      typeof responseBody.message === 'string'
        ? responseBody.message
        : 'Could not start payment. Please try again.';

    throw new Error(message);
  }

  const result = responseBody as Partial<CreatePaymentIntentResponse> | null;

  if (
    !result?.paymentIntent ||
    !result?.ephemeralKey ||
    !result?.customer
  ) {
    throw new Error(
      'Payment service returned an incomplete Stripe session. Update the backend endpoint before taking payments.',
    );
  }

  return result as CreatePaymentIntentResponse;
}

export async function createPaymentSheet({
  amount,
  currency,
  orderId,
  selectedPlan,
  userId,
  initPaymentSheet,
}: CreatePaymentSheetParams) {
  const { customer, ephemeralKey, paymentIntent } =
    await createPaymentIntentRequest({
      amount,
      currency,
      orderId,
      selectedPlan,
      userId,
    });

  const { error } = await initPaymentSheet({
    customerEphemeralKeySecret: ephemeralKey,
    customerId: customer,
    merchantDisplayName: 'Artisiana',
    paymentIntentClientSecret: paymentIntent,
    allowsDelayedPaymentMethods: true,
    primaryButtonLabel: 'Pay',
    returnURL: 'mobileproject://stripe-redirect',
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    paymentIntentClientSecret: paymentIntent,
    stripePaymentIntentId: extractPaymentIntentId(paymentIntent),
  };
}

export async function handleStripePayment(presentPaymentSheet: () => Promise<{
  error?: StripeError<PaymentSheetError>;
}>): Promise<StripePaymentResult> {
  const { error } = await presentPaymentSheet();

  if (!error) {
    return { status: 'completed' };
  }

  if (error.code === PaymentSheetError.Canceled) {
    return {
      status: 'cancelled',
      message: error.message || 'Payment was cancelled.',
    };
  }

  return {
    status: 'failed',
    message: error.message || 'Payment failed. Please try again.',
  };
}
