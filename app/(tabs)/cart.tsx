import { StyleSheet, Text, View } from "react-native";
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
    <View style={styles.container}>
      <AppBar />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7F3",
  },

  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  title: {
    textAlign: "center",
    fontSize: 35,
    marginTop: 30,
    fontFamily: "Itim_400Regular",
    color: "#000000",
  },
});