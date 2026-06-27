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

    return accion;
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Seleccion */}
        <View style={styles.seccion}>
          <Text
            size={11}
            weight="600"
            color={COLORS.textTertiary}
            style={styles.seccionLabel}
          >
            SELECCION
          </Text>

          <Text size={13} color={COLORS.textSecondary} style={styles.subLabel}>
            Finca
          </Text>

          <View style={styles.chips}>
            {FINCAS.map((f) => (
              <Chip
                key={f.id}
                label={f.nombre}
                selected={fincaSeleccionada === f.id}
                onPress={() => handleFinca(f.id)}
              />
            ))}
          </View>

          <Text size={13} color={COLORS.textSecondary} style={styles.subLabel}>
            Estanque
          </Text>

          <View style={styles.chips}>
            {estanques.map((e) => (
              <Chip
                key={e.id}
                label={e.id}
                selected={estanqueSeleccionado === e.id}
                onPress={() => setEstanqueSeleccionado(e.id)}
              />
            ))}
          </View>

          {finca && estanque && (
            <Text size={12} color={COLORS.textTertiary}>
              {finca.nombre} - {estanque.id} - {estanque.especie}
            </Text>
          )}
        </View>

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
