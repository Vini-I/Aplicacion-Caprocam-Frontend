import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Text from "../../../shared/components/Text";
import Alert from "../../../shared/components/Alert";
import { COLORS } from "../../../theme/colors";

import Chip from "../components/Chip";
import ModuloCard from "../components/ModuloCard";
import useRegistro from "../hooks/useRegistro";
import { MODULOS, FINCAS } from "./RegistroData";
import { styles } from "../styles/RegistroStyles";

export default function RegistroScreen({
  onFisicoQuimica,
  onAlimentacion,
  onDensidadPoblacional,
  onCrecimiento,
  onEnfermedades,
  onParasitologia,
  onRaleo,
  onReporteria,
  successMessage = "",
}) {
  const {
    fincaSeleccionada,
    estanqueSeleccionado,
    setEstanqueSeleccionado,
    estanques,
    finca,
    estanque,
    handleFinca,
  } = useRegistro();

  function obtenerAccionModulo(moduloId) {
    let accion = null;

    if (moduloId === "fisicoquimica") {
      accion = onFisicoQuimica;
    }

    if (moduloId === "alimentacion") {
      accion = onAlimentacion;
    }

    if (moduloId === "densidadPoblacional") {
      accion = onDensidadPoblacional;
    }

    if (moduloId === "crecimiento") {
      accion = onCrecimiento;
    }

    if (moduloId === "enfermedades") {
      accion = onEnfermedades;
    }

    if (moduloId === "parasitologia") {
      accion = onParasitologia;
    }

    if (moduloId === "raleo") {
      accion = onRaleo;
    }

    if (moduloId === "reporteria") {
      accion = onReporteria;
    }

    return accion;
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {Boolean(successMessage) && (
          <Alert
            variant="success"
            message={successMessage}
            style={{ marginBottom: 16 }}
          />
        )}
        {/* Modulos */}
        <Text
          size={11}
          weight="600"
          color={COLORS.textTertiary}
          style={styles.seccionLabel}
        >
          MODULOS DEL REGISTRO
        </Text>

        <View style={styles.grilla}>
          {MODULOS.map((m) => (
            <ModuloCard
              key={m.id}
              modulo={m}
              onPress={obtenerAccionModulo(m.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
