import { StyleSheet, Platform, StatusBar } from "react-native";
import { COLORS } from "../../../theme/colors";

/**
 * screen        → contenedor de toda la pantalla
 * header        → barra superior con botón de volver y título
 * scroll        → ScrollView principal
 * scrollContent → contenido centrado, ancho máximo 700
 * footerContent / footerActions → botones fijos al fondo (Footer)
 * alertBox / alertText → estilos de los mensajes de confirmación
 */

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 12,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginTop: 0,
    alignSelf: "flex-start",
  },
  headerTitle: { 
    flexDirection: "row",
    alignItems: "center", 
    gap: 10 
  },
  headerTitleText: { fontSize: 22, fontWeight: "700" },

  scroll: { 
    flex: 1, 
    backgroundColor: COLORS.white 
  },

  scrollContent: {
    width: "100%",
    maxWidth: 900,
    paddingVertical: 16,
    alignSelf: "center",
    gap: 12,
  },

  footerContent: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 16,
    alignItems: "center",
  },
  footerActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    alignItems: "center",
  },
  alertBox: { width: "60%", alignSelf: "center" },
  alertText: { textAlign: "center", fontWeight: "bold" },
});
