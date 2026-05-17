import { Image, StyleSheet, Text, View } from "react-native";

const CARD = "#FFFFFF";

export default function HomeHero() {
  return (
    <View style={styles.heroCard}>
      <View style={styles.heroTextWrapper}>
        <Text style={styles.heroText}>
          Explore unique handmade crafts created by talented artisans, featuring
          carefully designed products that celebrate creativity and authenticity.
        </Text>
      </View>

      <Image
        source={require("../../assets/images/hero_image.png")}
        style={styles.heroImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    marginTop: 18,
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroTextWrapper: {
    flex: 1,
    paddingRight: 12,
    justifyContent: "center",
  },

  heroText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4A4A4A",
    fontWeight: "500",
  },

  heroImage: {
    width: 135,
    height: 155,
    borderRadius: 16,
  },
});