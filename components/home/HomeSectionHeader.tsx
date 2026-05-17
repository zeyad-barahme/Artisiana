import { StyleSheet, Text, View } from "react-native";

const TEXT = "#222222";

type HomeSectionHeaderProps = {
  title: string;
};

export default function HomeSectionHeader({ title }: HomeSectionHeaderProps) {
  return (
    <View style={styles.centerSectionHeader}>
      <Text style={styles.centerSectionTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerSectionHeader: {
    marginTop: 30,
    marginBottom: 14,
    alignItems: "center",
  },

  centerSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT,
  },
});