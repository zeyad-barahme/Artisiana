import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';

import { getStripePublishableKey } from '@/services/payments/payment.service';

export default function RootLayout() {
  const publishableKey = getStripePublishableKey();
  const scheme = Constants.expoConfig?.scheme;
  const urlScheme = Array.isArray(scheme) ? scheme[0] : scheme;

  return (
    <StripeProvider publishableKey={publishableKey} urlScheme={urlScheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </StripeProvider>
  );
}
