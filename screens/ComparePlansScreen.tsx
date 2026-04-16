import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BackButton from '../components/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'ComparePlans'>;

export default function ComparePlansScreen({ navigation, route }: Props) {
  const { selectedPlan, selectedPrice } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.backButton}>
            <BackButton onPress={() => navigation.goBack()} />
          </View>
          <Text style={styles.title}>Compare Plans</Text>
        </View>

        <View style={styles.spacer} />

        <Text style={styles.selectedPlanText}>
          You are Selected: {selectedPlan} ({selectedPrice}/month)
        </Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <View style={styles.labelCol} />
            <Text style={styles.colHeader}>Basic</Text>
            <Text style={styles.colHeader}>Premium</Text>
            <Text style={styles.colHeader}>VIP</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Browse handmade products</Text>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.check}>✓</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Save favorite items</Text>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.check}>✓</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Chat with sellers</Text>
            <Text style={styles.x}>✕</Text>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.check}>✓</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Priority support</Text>
            <Text style={styles.x}>✕</Text>
            <Text style={styles.x}>✕</Text>
            <Text style={styles.check}>✓</Text>
          </View>
        </View>

        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate('Payment', {
              selectedPlan,
              selectedPrice,
            })
          }
        >
          <Text style={styles.buttonText}>Continue</Text>
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
    height: 50,
  },
  selectedPlanText: {
    marginBottom: 18,
    color: '#4A3A33',
    fontSize: 16,
    textAlign: 'center',
  },
  table: {
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  labelCol: {
    flex: 2.3,
  },
  rowLabel: {
    flex: 2.3,
    color: '#4A3A33',
    fontSize: 14,
  },
  colHeader: {
    flex: 1,
    textAlign: 'center',
    color: '#FF8A5B',
    fontSize: 16,
    fontWeight: '600',
  },
  check: {
    flex: 1,
    textAlign: 'center',
    color: '#4A3A33',
    fontSize: 22,
    fontWeight: '600',
  },
  x: {
    flex: 1,
    textAlign: 'center',
    color: '#E1463A',
    fontSize: 22,
    fontWeight: '700',
  },
  button: {
    alignSelf: 'center',
    marginTop: 40,
    backgroundColor: '#FF8A5B',
    paddingVertical: 12,
    paddingHorizontal: 38,
    borderRadius: 18,
    minWidth: 150,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
