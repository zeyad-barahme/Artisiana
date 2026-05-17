import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TEXT = "#222222";
const PRIMARY = "#F47C48";

type HomeFooterProps = {
  onOpenLink: (url: string) => void;
};

export default function HomeFooter({ onOpenLink }: HomeFooterProps) {
  return (
    <View style={styles.footer}>
      <View style={styles.footerTopBox}>
        <Text style={styles.footerBrand}>Artisiana</Text>

        <Text style={styles.footerSubtitle}>
          Handmade crafts made with love and authenticity.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.contactButton}
        activeOpacity={0.85}
        onPress={() => onOpenLink("tel:+972592129473")}
      >
        <View style={styles.contactIconBox}>
          <Feather name="phone" size={17} color={PRIMARY} />
        </View>

        <Text style={styles.contactText}>
          Contact us : <Text style={styles.contactNumber}>+972592129473</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.followSection}>
        <Text style={styles.followText}>Follow us</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialButton}
            activeOpacity={0.8}
            onPress={() =>
              onOpenLink(
                "https://www.facebook.com/share/18V5FmJ7Xt/?mibextid=wwXIfr"
              )
            }
          >
            <Text style={styles.socialText}>f</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            activeOpacity={0.8}
            onPress={() =>
              onOpenLink(
                "https://www.instagram.com/zeyad_barahme?igsh=aW1kang2MThnd2do"
              )
            }
          >
            <Feather name="instagram" size={17} color={PRIMARY} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            activeOpacity={0.8}
            onPress={() => onOpenLink("https://wa.me/972592129473")}
          >
            <Feather name="message-circle" size={17} color={PRIMARY} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            activeOpacity={0.8}
            onPress={() => onOpenLink("https://x.com")}
          >
            <Text style={styles.xText}>𝕏</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footerDivider} />

      <Text style={styles.copyRight}>© 2026 Artisiana. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 34,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#F1E1D8",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  footerTopBox: {
    alignItems: "center",
  },

  footerBrand: {
    fontSize: 24,
    color: PRIMARY,
    fontWeight: "800",
    fontStyle: "italic",
    textAlign: "center",
  },

  footerSubtitle: {
    marginTop: 5,
    fontSize: 12,
    color: "#777",
    lineHeight: 17,
    textAlign: "center",
    maxWidth: 260,
  },

  contactButton: {
    marginTop: 14,
    backgroundColor: "#FFF7F3",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  contactIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFE7DD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  contactText: {
    flex: 1,
    fontSize: 14,
    color: TEXT,
    fontWeight: "700",
  },

  contactNumber: {
    color: PRIMARY,
    fontWeight: "900",
  },

  followSection: {
    marginTop: 16,
    alignItems: "center",
  },

  followText: {
    fontSize: 14,
    fontWeight: "800",
    color: TEXT,
    textAlign: "center",
    marginBottom: 10,
  },

  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  socialButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFF7F3",
    borderWidth: 1,
    borderColor: "#FFE0D3",
    alignItems: "center",
    justifyContent: "center",
  },

  socialText: {
    fontSize: 20,
    color: PRIMARY,
    fontWeight: "900",
  },

  xText: {
    fontSize: 16,
    color: PRIMARY,
    fontWeight: "900",
  },

  footerDivider: {
    height: 1,
    backgroundColor: "#F1E1D8",
    marginTop: 14,
    marginBottom: 10,
  },

  copyRight: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
  },
});