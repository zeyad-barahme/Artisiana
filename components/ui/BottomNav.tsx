import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function BottomNav() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/")}>
        <Feather name="home" size={24} color="#FF7F50" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/checkout")}>
        <Feather name="grid" size={24} color="#FF7F50" />
      </TouchableOpacity>

      <View style={styles.centerLogo}>
        <Image
          source={require('../../assets/images/Logo.png')}
          style={styles.logo}
        />
      </View>

      <TouchableOpacity onPress={() => router.push("/checkout")}>
        <Feather name="bell" size={24} color="#FF7F50" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/checkout")}>
        <Feather name="user" size={24} color="#FF7F50" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    height: 70,
    backgroundColor: "#FFFFFF",

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  centerLogo: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#F3EAEA",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});
