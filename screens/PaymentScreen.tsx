import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useStripe } from '@stripe/stripe-react-native';

import { RootStackParamList } from '../navigation/AppNavigator';
import BackButton from '../components/BackButton';
import { auth } from '../api/firebase';
import {
  createPendingOrder,
  updateOrderPaymentState,
} from '../services/orders/order.service';
import {
  createPaymentSheet,
  getStripePublishableKey,
  handleStripePayment,
  parsePriceToAmount,
} from '../services/payments/payment.service';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

export default function PaymentScreen({ navigation, route }: Props) {
  const { selectedPlan, selectedPrice } = route.params;
  const [isSaving, setIsSaving] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handlePay = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    let orderId: string | null = null;
    let stripePaymentIntentId: string | null = null;

    try {
      if (!getStripePublishableKey()) {
        throw new Error(
          'Missing EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY. Add your Stripe publishable key before opening payments.',
        );
      }

      const amount = parsePriceToAmount(selectedPrice);
      orderId = await createPendingOrder({
        amount,
        currency: 'usd',
        selectedPlan,
        selectedPrice,
        userId: auth.currentUser?.uid ?? null,
      });

      const paymentSheet = await createPaymentSheet({
        amount,
        currency: 'usd',
        orderId,
        selectedPlan,
        userId: auth.currentUser?.uid ?? null,
        initPaymentSheet,
      });
      stripePaymentIntentId = paymentSheet.stripePaymentIntentId;

      await updateOrderPaymentState({
        orderId,
        paymentStatus: 'pending',
        stripePaymentIntentId,
      });

      const paymentResult = await handleStripePayment(presentPaymentSheet);

      if (paymentResult.status === 'completed') {
        await updateOrderPaymentState({
          orderId,
          paymentStatus: 'processing_verification',
          stripePaymentIntentId,
        });

        navigation.navigate('Success');
        return;
      }

      await updateOrderPaymentState({
        orderId,
        paymentStatus:
          paymentResult.status === 'cancelled' ? 'cancelled' : 'failed',
        stripePaymentIntentId,
      });

      Alert.alert(
        paymentResult.status === 'cancelled'
          ? 'Payment cancelled'
          : 'Payment failed',
        paymentResult.message,
      );
    } catch (error) {
      console.error('Failed to start Stripe payment:', error);

      if (orderId) {
        try {
          await updateOrderPaymentState({
            orderId,
            paymentStatus: 'failed',
            stripePaymentIntentId,
          });
        } catch (updateError) {
          console.error('Failed to update order after payment error:', updateError);
        }
      }

      Alert.alert(
        'Payment unavailable',
        error instanceof Error
          ? error.message
          : 'We could not start your payment. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.backButton}>
            <BackButton onPress={() => navigation.goBack()} />
          </View>
          <Text style={styles.title}>Payment</Text>
        </View>

        <View style={styles.spacer} />

        <Text style={styles.selectedText}>
          You are Selected: {selectedPlan} ({selectedPrice.trim()}/month)
        </Text>

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          editable={false}
          selectTextOnFocus={false}
          style={styles.input}
          placeholder="entered securely in Stripe"
          placeholderTextColor="#9B8F86"
        />

        <View style={styles.rowLabels}>
          <Text style={styles.label}>MM / YY</Text>
          <Text style={styles.label}>CVC</Text>
        </View>

        <View style={styles.rowInputs}>
          <View style={styles.inputGroup}>
            <TextInput
              editable={false}
              selectTextOnFocus={false}
              style={[styles.input, styles.inputSmall]}
              placeholder="Stripe Sheet"
              placeholderTextColor="#9B8F86"
            />
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              editable={false}
              selectTextOnFocus={false}
              style={[styles.input, styles.inputSmall]}
              placeholder="Stripe Sheet"
              placeholderTextColor="#9B8F86"
            />
          </View>
        </View>

        <Text style={styles.helperText}>
          Your payment details are collected in Stripe&apos;s secure payment sheet after you tap Pay.
        </Text>

        <Pressable style={styles.button} onPress={handlePay} disabled={isSaving}>
          <Text style={styles.buttonText}>
            {isSaving ? 'Processing...' : 'Pay'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F6F3EF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 26,
  },
  header: {
    marginTop: 6,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    color: '#4A3A33',
    fontWeight: '600',
  },
  spacer: {
    height: 60,
  },
  selectedText: {
    color: '#4A3A33',
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    color: '#4A3A33',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E4DCD4',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#4A3A33',
    backgroundColor: '#F8F6F4',
  },
  rowLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 34,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  inputGroup: {
    width: '48%',
  },
  inputSmall: {
    width: '100%',
  },
  helperText: {
    marginTop: 16,
    color: '#7A6D64',
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    alignSelf: 'center',
    marginTop: 24,
    backgroundColor: '#FF8A5B',
    paddingVertical: 12,
    paddingHorizontal: 44,
    borderRadius: 18,
    minWidth: 140,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
