import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SubscriptionPlansScreen from '@/screens/SubscriptionPlansScreen';
import ComparePlansScreen from '@/screens/ComparePlansScreen';
import PaymentScreen from '@/screens/PaymentScreen';
import SuccessScreen from '@/screens/SuccessScreen';
import { RootStackParamList } from '@/navigation/AppNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function SubscriptionStack() {
  return (
    <Stack.Navigator
      initialRouteName="SubscriptionPlans"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlansScreen} />
      <Stack.Screen name="ComparePlans" component={ComparePlansScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
    </Stack.Navigator>
  );
}
