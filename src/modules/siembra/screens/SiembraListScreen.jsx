import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import SiembraCard from "../components/SiembraCard";
import { obtenerSiembras } from "../services/SiembraService";

/**
 * Pantalla principal del módulo de siembra.
 * Muestra las siembras activas y permite iniciar el registro de una nueva siembra.
 */
export default function SiembraListScreen() {
  const siembras = obtenerSiembras();

  const handleNuevaSiembra = () => {
    console.log("Ir a nueva siembra");
  };

  const handleDetalleSiembra = (siembraId) => {
    console.log("Ir al detalle de la siembra:", siembraId);
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
      produccionEstimada={siembra.produccionEstimada}
      estado={siembra.estado}
      onPress={() => handleDetalleSiembra(siembra.siembraId)}
    />
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.moduleText}>Módulo</Text>

        <Text style={styles.title}>Siembra</Text>
      </View>

      <View style={styles.contentHeader}>
        <Text style={styles.sectionTitle}>
          Siembras activas ({siembras.length})
        </Text>

        <TouchableOpacity
          style={styles.newButton}
          onPress={handleNuevaSiembra}
          activeOpacity={0.7}
        >
          <Text style={styles.newButtonText}>+ Nueva Siembra</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {siembras.map(renderSiembraCard)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EEF2FF",
  },

  header: {
    backgroundColor: "#009EF5",
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  moduleText: {
    color: "#E0F2FE",
    fontSize: 13,
    fontWeight: "600",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
  },

  contentHeader: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "800",
  },

  newButton: {
    backgroundColor: "#009EF5",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  newButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
