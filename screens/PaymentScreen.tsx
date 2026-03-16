import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BackButton from '../components/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

export default function PaymentScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.title}>Payment</Text>
        </View>

        <View style={styles.spacer} />

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="card number"
          placeholderTextColor="#9B8F86"
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
          />
          <TextInput
            style={[styles.input, styles.inputSmall]}
            placeholder="CVC"
            placeholderTextColor="#9B8F86"
          />
        </View>

        <Pressable style={styles.button} onPress={() => navigation.navigate('Success')}>
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
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
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
  button: {
    alignSelf: 'center',
    marginTop: 70,
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
