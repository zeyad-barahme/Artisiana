import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SubscriptionPlansScreen from '../screens/SubscriptionPlansScreen';
import ComparePlansScreen from '../screens/ComparePlansScreen';
import PaymentScreen from '../screens/PaymentScreen';
import SuccessScreen from '../screens/SuccessScreen';

export type RootStackParamList = {
  SubscriptionPlans: undefined;
  ComparePlans: {
    selectedPlan: string;
    selectedPrice: string;
  };
  Payment: {
    selectedPlan: string;
    selectedPrice: string;
  };
  Success: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
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
