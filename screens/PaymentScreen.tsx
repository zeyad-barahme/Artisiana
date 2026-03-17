import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BackButton from '../components/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

type Errors = {
  cardNumber: string;
  expiry: string;
  cvc: string;
};

export default function PaymentScreen({ navigation }: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [errors, setErrors] = useState<Errors>({
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const validateFields = () => {
    const nextErrors: Errors = {
      cardNumber: '',
      expiry: '',
      cvc: '',
    };

    if (!/^\d{16}$/.test(cardNumber)) {
      nextErrors.cardNumber = 'Card Number must be exactly 16 digits';
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      nextErrors.expiry = 'Expiry Date must be in MM/YY format';
    } else {
      const month = Number(expiry.slice(0, 2));
      if (month < 1 || month > 12) {
        nextErrors.expiry = 'Month must be between 01 and 12';
      }
    }

    if (!/^\d{3}$/.test(cvc)) {
      nextErrors.cvc = 'CVC must be exactly 3 digits';
    }

    setErrors(nextErrors);
    return !nextErrors.cardNumber && !nextErrors.expiry && !nextErrors.cvc;
  };

  const handlePay = () => {
    if (!validateFields()) {
      return;
    }

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
          keyboardType="number-pad"
        />
        {errors.cardNumber ? <Text style={styles.fieldError}>{errors.cardNumber}</Text> : null}

        <View style={styles.rowLabels}>
          <Text style={styles.label}>MM / YY</Text>
          <Text style={styles.label}>CVC</Text>
        </View>

        <View style={styles.rowInputs}>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, styles.inputSmall]}
              placeholder="MM / YY"
              placeholderTextColor="#9B8F86"
              value={expiry}
              onChangeText={setExpiry}
            />
            {errors.expiry ? <Text style={styles.fieldError}>{errors.expiry}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, styles.inputSmall]}
              placeholder="CVC"
              placeholderTextColor="#9B8F86"
              value={cvc}
              onChangeText={setCvc}
              keyboardType="number-pad"
            />
            {errors.cvc ? <Text style={styles.fieldError}>{errors.cvc}</Text> : null}
          </View>
        </View>

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
  inputGroup: {
    width: '48%',
  },
  inputSmall: {
    width: '100%',
  },
  fieldError: {
    marginTop: 6,
    color: '#E1463A',
    fontSize: 12,
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
