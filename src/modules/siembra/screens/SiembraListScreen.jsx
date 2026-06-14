/**
 * Pantalla: SiembraListScreen
 *
 * Muestra el listado de siembras activas registradas en el módulo de siembra.
 *
 * Funcionalidades principales:
 * - Visualizar las siembras activas.
 * - Mostrar información resumida de cada siembra mediante tarjetas.
 * - Acceder al detalle o edición de una siembra.
 *
 * Componentes utilizados:
 * - Navbar: encabezado principal de la pantalla.
 * - Button: acción para crear una nueva siembra.
 * - SiembraCard: tarjeta reutilizable para mostrar cada siembra.
 */
import { View, Text, ScrollView, StyleSheet } from "react-native";

import Navbar from "../../../shared/components/Navbar";
import Button from "../../../shared/components/Button";
import SiembraCard from "../components/SiembraCard";
import { obtenerSiembras } from "../services/SiembraService";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { useRouter } from "expo-router";

export default function SiembraListScreen() {
  const siembras = obtenerSiembras();
  const router = useRouter();

  const handleNuevaSiembra = () => {
   router.push("/siembra/nueva");
  };

  const handleDetalleSiembra = (siembraId) => {
    router.push("/siembra/detalle");
  };

  const renderSiembraCard = (siembra) => (
    <SiembraCard
      key={siembra.siembraId}
      siembraId={siembra.siembraId}
      estanque={siembra.estanque}
      finca={siembra.finca}
      diasCultivo={siembra.diasCultivo}
      diasMaduracion={siembra.diasMaduracion}
      cantidadSembrada={siembra.cantidadSembrada}
      estado={siembra.estado}
      onPress={() => handleDetalleSiembra(siembra.siembraId)}
    />
  );

  return (
    <View style={styles.screen}>
      <Navbar title="Siembra" style={styles.header} titleStyle={styles.title}>
        <Text style={styles.moduleText}>Módulo</Text>
      </Navbar>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapper}>
          <View style={styles.contentHeader}>
            <Text style={styles.sectionTitle}>
              Siembras activas ({siembras.length})
            </Text>

            <Button
              onPress={handleNuevaSiembra}
              style={styles.newButton}
              textStyle={styles.newButtonText}
            >
              + Nueva Siembra
            </Button>
          </View>

          {siembras.map(renderSiembraCard)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    borderBottomWidth: 0,
  },

  moduleText: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    opacity: 0.85,
  },

  title: {
    color: COLORS.white,
    fontSize: 26,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  wrapper: {
    flex: 1,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  contentHeader: {
    paddingTop: 22,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    flex: 1,
  },
  newButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 0,
  },
  newButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
});
