import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartList from "../../components/cart/CartList";
import CartSummary from "../../components/cart/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart";
import AppBar from "../../components/layout/AppBar";
import BottomNavBar from "../../components/layout/BottomNavBar";
import { useCart } from "../../hooks/useCart";

export default function CartScreen() {
  const {
    filteredItems,
    total,
    increaseQuantity,
    decreaseQuantity,
    deleteItem,
  } = useCart();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerWrapper}>
        <AppBar />
      </View>

      <View style={styles.content}>
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
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7F3",
  },

  headerWrapper: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  title: {
    textAlign: "center",
    fontSize: 35,
    marginTop: 50,
    fontFamily: "Itim_400Regular",
    color: "#000000",
  },
});
