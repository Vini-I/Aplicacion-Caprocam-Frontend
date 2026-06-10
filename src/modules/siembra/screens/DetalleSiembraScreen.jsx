import { View, Text, ScrollView, StyleSheet } from "react-native";

import ProgressBar from "../../../shared/components/ProgressBar";
import SiembraInfoRow from "../components/SiembraInfoRow";
import { obtenerSiembraPorId } from "../services/SiembraService";

/**
 * Pantalla de detalle de una siembra.
 * Muestra información general, avance del ciclo y datos productivos de siembra.
 */
export default function DetalleSiembraScreen() {
  const siembraId = 25;
  const siembra = obtenerSiembraPorId(siembraId);

  if (!siembra) {
    return renderError();
  }

  const avanceCiclo = calcularAvanceCiclo(siembra);

  return (
    <View style={styles.screen}>
      {renderHeader(siembra)}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderResumenSiembra(siembra, avanceCiclo)}
        {renderInformacionSiembra(siembra)}
      </ScrollView>
    </View>
  );
}

function calcularAvanceCiclo(siembra) {
  return Math.round((siembra.diasCultivo / siembra.diasMaduracion) * 100);
}

function renderError() {
  return (
    <View style={styles.screen}>
      <Text style={styles.errorText}>No se encontró la siembra.</Text>
    </View>
  );
}

function renderHeader(siembra) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerLabel}>Detalle de Siembra</Text>
      <Text style={styles.headerTitle}>
        {siembra.estanque} — {siembra.finca}
      </Text>
    </View>
  );
}

function renderResumenSiembra(siembra, avanceCiclo) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>🦐</Text>
        </View>

        <View>
          <Text style={styles.dayBadge}>
            Día {siembra.diasCultivo} de {siembra.diasMaduracion}
          </Text>

          <Text style={styles.title}>Siembra #{siembra.siembraId}</Text>
        </View>
      </View>

      <ProgressBar label="Avance del ciclo" value={avanceCiclo} />
    </View>
  );
}

function renderInformacionSiembra(siembra) {
  return (
    <View style={styles.infoCard}>
      <SiembraInfoRow label="Fecha de siembra" value={siembra.fechaSiembra} />

      <SiembraInfoRow
        label="Camarones sembrados"
        value={`${(siembra.cantidadSembrada ?? 0).toLocaleString()} camarones`}
      />

      <SiembraInfoRow label="Área del estanque" value={siembra.areaEstanque} />

      <SiembraInfoRow label="Densidad de siembra" value={siembra.densidad} />

      <SiembraInfoRow
        label="Certificado de larva"
        value={siembra.certificadoLarva}
      />

      <SiembraInfoRow
        label="Técnica de cultivo"
        value={siembra.tecnicaCultivo}
      />

      <SiembraInfoRow label="Especie" value={siembra.especie} />

      <SiembraInfoRow
        label="Producción estimada"
        value={siembra.produccionEstimada}
      />
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
  headerLabel: {
    color: "#E0F2FE",
    fontSize: 13,
    fontWeight: "600",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#009EF5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  iconText: {
    fontSize: 24,
  },
  dayBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E0F2FE",
    color: "#009EF5",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  title: {
    color: "#0F172A",
    fontSize: 24,
    fontWeight: "800",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  errorText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "600",
    margin: 24,
  },
});
