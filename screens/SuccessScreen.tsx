import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BackButton from '../components/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

export default function SuccessScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.backButton}>
            <BackButton onPress={() => navigation.goBack()} />
          </View>
          <Text style={styles.title}>Success</Text>
        </View>

        <View style={styles.spacer} />

        <View style={styles.circle}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.message}>Subscription Successful</Text>

        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('SubscriptionPlans')}
        >
          <Text style={styles.buttonText}>Done</Text>
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
    alignItems: 'center',
  },
  header: {
    marginTop: 6,
    height: 44,
    alignSelf: 'stretch',
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
    height: 70,
  },
  circle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#AEEB90',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    fontSize: 64,
    color: '#2F3B2B',
    fontWeight: '700',
  },
  message: {
    marginTop: 30,
    fontSize: 18,
    color: '#4A3A33',
    textAlign: 'center',
  },
  button: {
    marginTop: 80,
    backgroundColor: '#FF8A5B',
    paddingVertical: 12,
    paddingHorizontal: 46,
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
