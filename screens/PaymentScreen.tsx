import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BackButton from '../components/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

export default function PaymentScreen({ navigation }: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState('');

  const handlePay = () => {
    if (!cardNumber.trim() || !expiry.trim() || !cvc.trim()) {
      setError('All fields are required');
      return;
    }
    setError('');
    navigation.navigate('Success');
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

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="card number"
          placeholderTextColor="#9B8F86"
          value={cardNumber}
          onChangeText={setCardNumber}
        />

        <View style={styles.rowLabels}>
          <Text style={styles.label}>MM / YY</Text>
          <Text style={styles.label}>CVC</Text>
        </View>

        <View style={styles.rowInputs}>
          <TextInput
            style={[styles.input, styles.inputSmall]}
            placeholder="MM / YY"
            placeholderTextColor="#9B8F86"
            value={expiry}
            onChangeText={setExpiry}
          />
          <TextInput
            style={[styles.input, styles.inputSmall]}
            placeholder="CVC"
            placeholderTextColor="#9B8F86"
            value={cvc}
            onChangeText={setCvc}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.button} onPress={handlePay}>
          <Text style={styles.buttonText}>Pay</Text>
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
  inputSmall: {
    width: '48%',
  },
  error: {
    marginTop: 14,
    color: '#E1463A',
    textAlign: 'center',
    fontSize: 14,
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
