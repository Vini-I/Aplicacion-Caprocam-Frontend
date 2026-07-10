import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Text from "../../../shared/components/Text";
import { COLORS } from "../../../theme/colors";

import Chip from "../components/Chip";
import ModuloCard from "../components/ModuloCard";
import useRegistro from "../hooks/useRegistro";
import { MODULOS, FINCAS } from "./RegistroData";
import { styles } from "../styles/RegistroStyles";

/**
 * ============================================================
 * PANTALLA REGISTRO
 * ============================================================
 *
 * Punto de entrada del flujo de registro: el usuario elige
 * finca + estanque y luego un modulo para registrar informacion.
 *
 * El estado de seleccion de finca/estanque vive en useRegistro().
 * Los datos estaticos vienen desde RegistroData.js.
 *
 * La navegacion entre modulos NO la maneja esta pantalla.
 * RegistroScreen solo ejecuta los callbacks que recibe por props.
 *
 * Modulos conectados:
 * - Fisico-Quimica
 * - Alimentacion
 * - Mortalidad
 * - Crecimiento
 * - Enfermedades
 * - Parasitologia
 */

export default function RegistroScreen({
  onFisicoQuimica,
  onAlimentacion,
  onDensidadPoblacional,
  onCrecimiento,
  onEnfermedades,
  onParasitologia,
  onRaleo,
  onDetalleRegistro
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

  /**
   * ============================================================
   * OBTENER ACCION DEL MODULO
   * ============================================================
   *
   * Retorna la funcion de navegacion correspondiente segun
   * el modulo seleccionado.
   */

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

    if (moduloId === "detalleRegistro") {
      accion = onDetalleRegistro;
    }

    return accion;
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
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
