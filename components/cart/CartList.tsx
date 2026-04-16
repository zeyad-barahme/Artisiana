import React from "react";
import { FlatList, StyleSheet } from "react-native";
import CartItem from "./CartItem";

export default function CartList({
  items,
  onIncrease,
  onDecrease,
  onDelete,
}: any) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <CartItem
          image={item.image}
          title={item.title}
          price={item.price}
          quantity={item.quantity}
          onIncrease={() => onIncrease(item.id)}
          onDecrease={() => onDecrease(item.id)}
          onDelete={() => onDelete(item.id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 27,
    marginTop: 50,
    paddingBottom: 120,
  },
});
