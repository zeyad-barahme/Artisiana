import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../../components/ui/BottomNav";
import CartHeader from "../../components/ui/CartHeader";
import CartItem from "../../components/ui/CartItem";

export default function CartScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <CartHeader />

      <Text style={styles.title}>Your Cart</Text>

      <View style={styles.itemsContainer}>
        <CartItem
          image={require("@/assets/images/item1.png")}
          title="Ceramic Bears"
          price={5}
          quantity={1}
        />

        <CartItem
          image={require("@/assets/images/item2.png")}
          title="Ceramic Vase"
          price={20}
          quantity={1}
        />

        <CartItem
          image={require("@/assets/images/item3.png")}
          title="Woven Basket Set"
          price={14}
          quantity={2}
        />
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total :</Text>
        <Text style={styles.totalPrice}>$47</Text>
      </View>

      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={() => {
          console.log("Checkout pressed");
        }}
      >
        <Text style={styles.checkoutText}>Checkout</Text>
      </TouchableOpacity>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
  },

  title: {
    textAlign: "center",
    fontSize: 35,
    marginTop: 50,
    fontFamily: "Itim_400Regular",
    color: "#000000",
  },

  itemsContainer: {
    paddingHorizontal: 27,
    marginTop: 50,
  },

  totalContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  totalText: {
    fontSize: 30,
    color: "#000000",
    marginRight: 20,
    marginTop: -50,
    fontFamily: "Inter_400Regular",
  },

  totalPrice: {
    fontSize: 28,
    color: "#3EAC28",
    fontWeight: "600",
    marginTop: -50,
    marginRight: 250,
    fontFamily: "Inter_400Regular",
  },

  checkoutBtn: {
    marginTop: 50,
    alignSelf: "center",
    backgroundColor: "#FF7F50",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  checkoutText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Inter_400Regular",
  },
});
