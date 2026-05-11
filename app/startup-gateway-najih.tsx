import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/api/firebase";
import EntryGateScreen from "./entry-gate";

export default function StartupGatewayNajih() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/discover" as Href);
        return;
      }
      setCheckingSession(false);
    });

    return unsubscribe;
  }, [router]);

  if (checkingSession) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F47C4C" />
      </View>
    );
  }

  return <EntryGateScreen />;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
  },
});
