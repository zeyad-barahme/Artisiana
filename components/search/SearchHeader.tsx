import type { RefObject } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const PRIMARY = "#F47C48";

type SearchHeaderProps = {
  search: string;
  onChangeSearch: (text: string) => void;
  onClearSearch: () => void;
  searchInputRef: RefObject<TextInput | null>;
};

export default function SearchHeader({
  search,
  onChangeSearch,
  onClearSearch,
  searchInputRef,
}: SearchHeaderProps) {
  return (
    <>
      <Text style={styles.title}>Search</Text>

      <View style={styles.searchWrapper}>
        <TextInput
          ref={searchInputRef}
          style={styles.input}
          placeholder="Search handmade products..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={onChangeSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {search.length > 0 ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={onClearSearch}
            activeOpacity={0.8}
          >
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    color: "#222",
  },

  searchWrapper: {
    position: "relative",
    marginBottom: 12,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EAD4C9",
    paddingHorizontal: 14,
    paddingRight: 42,
    paddingVertical: 14,
    fontSize: 15,
    color: "#222",
  },

  clearButton: {
    position: "absolute",
    right: 12,
    top: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F6E7DF",
    alignItems: "center",
    justifyContent: "center",
  },

  clearText: {
    fontSize: 22,
    color: PRIMARY,
    lineHeight: 24,
    fontWeight: "600",
  },
});