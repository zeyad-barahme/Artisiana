import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  onSearch: (text: string) => void;
};

export default function CartHeader({ onSearch }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* LOGO */}
        <Image
          source={require("@/assets/images/Logo.png")}
          style={styles.logo}
        />

        {/* TITLE */}
        <Text style={styles.title}>Artisiana</Text>

        {/* RIGHT SECTION */}
        <View style={styles.rightSection}>
          {/* SEARCH */}
          <View style={styles.searchBox}>
            <Feather name="search" size={14} color="#FF7F50" />

            <TextInput
              placeholder="Search"
              placeholderTextColor="#FF7F50"
              style={styles.input}
              value={search}
              onChangeText={(text) => {
                setSearch(text);
                onSearch(text);
              }}
            />
          </View>

          {/* CART ICON */}
          <TouchableOpacity onPress={() => router.push("/cart")}>
            <Feather name="shopping-cart" size={24} color="#FF7F50" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#F3EAEA",
  },

  container: {
    width: "100%",
    height: 90,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  logo: {
    width: 53,
    height: 53,
    borderRadius: 25,
  },

  title: {
    fontSize: 36,
    color: "#FF5E22",
    fontFamily: "Rancho_400Regular",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    width: 150,
    height: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    paddingHorizontal: 8,
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#FF7F50",
    marginLeft: 5,
    paddingVertical: 0,
  },
});
