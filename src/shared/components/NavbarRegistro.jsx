import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../../theme/colors";
import { ICONS } from "../../theme/icons";
import { TYPOGRAPHY } from "../../theme/typography";
import Icon from "./Icons";
import Text from "./Text";
import Title from "./Title";
import Button from "./Button";


export default function NavbarRegistros({ Titulo, Subtitulo, Icono }) {

  const router = useRouter();

  return (
    <View style={styles.header}>
      <Button variant="outline" onPress={() => router.back()} style={styles.backBtn}>
        <View style={styles.backBtnContent}>
          <Icon icon={ICONS.exit} size={18} color={COLORS.white} />
          <Text size={16} color={COLORS.white} style={styles.backBtnText}>Volver</Text>
        </View>
      </Button>

      <View style={styles.headerTitle}>
        <View style={styles.headerIcon}>
          <Icon icon={ICONS[Icono]} size={28} color={COLORS.primary} />
        </View>

        <View>
          <Title level={3} color={COLORS.white}>{Titulo}</Title>
          <Text size={14} color={COLORS.white}>{Subtitulo}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  backBtn: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
    marginBottom: 20,
  },

  backBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  backBtnText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  
  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
})

