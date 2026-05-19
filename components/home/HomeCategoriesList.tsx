import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import CategoryCard from "../common/CategoryCard";

const PRIMARY = "#F47C48";

type Category = {
  id: string;
  title: string;
  image: string;
};

type HomeCategoriesListProps = {
  categories: Category[];
  isLoading: boolean;
  onSelectCategory?: (category: Category) => void;
};

export default function HomeCategoriesList({
  categories,
  isLoading,
  onSelectCategory,
}: HomeCategoriesListProps) {
  if (isLoading) {
    return (
      <ActivityIndicator size="small" color={PRIMARY} style={styles.loader} />
    );
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectCategory?.(item)}
        >
          <CategoryCard title={item.title} image={item.image} />
        </TouchableOpacity>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesListContent}
    />
  );
}

const styles = StyleSheet.create({
  categoriesListContent: {
    paddingRight: 12,
    gap: 12,
  },

  loader: {
    marginVertical: 20,
  },
});