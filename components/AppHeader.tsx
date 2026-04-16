import { View, Text, StyleSheet, Image } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function AppHeader() {

  const router = useRouter();

  return (
    <Appbar.Header style={styles.header}>

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/A1/85baf6ab0c07af4b4fc9f32f981b7edb09861f2c.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>Artisiana</Text>
      </View>

      <View style={styles.icons}>
        <Appbar.Action
        icon="magnify"
        color="#FF5E22"
        onPress={() => router.push('/temp')}
       />

       <Appbar.Action
        icon="cart-outline"
        color="#FF5E22"
        onPress={() => router.push('/temp')}
       />

      </View>

    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, borderRadius: 20 },
  appName: { fontSize: 22, color: '#FF5E22', marginLeft: 10 },
  icons: { flexDirection: 'row' },
});
