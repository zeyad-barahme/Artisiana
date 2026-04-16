import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../api/firebase";
import CartHeader from "../../components/cart/CartHeader";
import CartList from "../../components/cart/CartList";
import CartSummary from "../../components/cart/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart";
import BottomNav from "../../components/ui/BottomNav";
import { useCart } from "../../hooks/useCart";
import AppBar from '../../components/layout/AppBar';
export default function CartScreen() {
  const router = useRouter();

  const {
    filteredItems,
    total,
    setSearch,
    increaseQuantity,
    decreaseQuantity,
    deleteItem,
  } = useCart();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppBar />

      <Text style={styles.title}>Your Cart</Text>

      {filteredItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <CartList
            items={filteredItems}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onDelete={deleteItem}
          />

          <CartSummary total={total} />
        </>
      )}

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
});
