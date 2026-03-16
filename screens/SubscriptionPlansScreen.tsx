import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BackButton from '../components/BackButton';

const plans = [
  { title: 'Basic', price: '$5 / month' },
  { title: 'Premium', price: '$10 / month' },
  { title: 'VIP', price: '$20 / month' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'SubscriptionPlans'>;

export default function SubscriptionPlansScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.backButton}>
            <BackButton onPress={() => navigation.goBack()} />
          </View>
          <Text style={styles.title}>Subscription Plans</Text>
        </View>

        <View style={styles.spacer} />

        {plans.map((plan) => (
          <View key={plan.title} style={styles.card}>
            <Text style={styles.cardTitle}>{plan.title}</Text>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.bodyText}>Browse handmade products</Text>
            <Text style={styles.bodyText}>Save favorite items</Text>
            <Pressable style={styles.button} onPress={() => navigation.navigate('ComparePlans')}>
              <Text style={styles.buttonText}>Select</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F6F3EF',
  },
  container: {
    paddingHorizontal: 26,
    paddingBottom: 40,
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
    height: 32,
  },
  card: {
    alignSelf: 'center',
    width: '78%',
    borderWidth: 1,
    borderColor: '#E4DCD4',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 26,
    backgroundColor: '#F8F6F4',
  },
  cardTitle: {
    fontSize: 24,
    color: '#4A3A33',
    fontWeight: '600',
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    color: '#FF8A5B',
    fontWeight: '600',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    color: '#4A3A33',
    marginBottom: 6,
  },
  button: {
    alignSelf: 'center',
    marginTop: 12,
    backgroundColor: '#FF8A5B',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 18,
    minWidth: 120,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
