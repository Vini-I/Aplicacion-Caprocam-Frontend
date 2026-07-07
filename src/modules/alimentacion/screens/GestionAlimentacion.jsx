/**
 * ============================================================
 * SCREEN GESTIONALIMENTACION
 * ============================================================
 *
 * Compone las estadísticas del día, el formulario de registro y
 * la lista de registros ya guardados dentro de la pantalla de
 * Alimentación. No contiene lógica de negocio propia: recibe
 * todo (datos, callbacks y estado de validación) desde
 * AlimentacionScreen.
 *
 * Props principales:
 * - alimentaciones: lista de registros ya guardados.
 * - form / updateField: estado y setter del formulario.
 * - submitted / errores: estado de validación, se reenvían tal
 *   cual a AlimentacionForm.
 * - handleGuardar: callback del botón de guardar.
 * - onBack: callback opcional de navegación hacia atrás.
 *
 * Ejemplo:
 * <GestionAlimentacion
 *   alimentaciones={alimentaciones}
 *   form={form}
 *   updateField={updateField}
 *   submitted={submitted}
 *   errores={errores}
 *   handleGuardar={handleGuardar}
 * />
 */

import React from "react";
import { View, ScrollView } from "react-native";
import AlimentacionStats from "../components/AlimentacionStats";
import AlimentacionList from "../components/AlimentacionList";
import AlimentacionForm from "../components/AlimentacionForm";
import Text from "../../../shared/components/Text";
import { styles } from "../styles/alimentacionStyles";
import { COLORS } from "../../../theme/colors";
import Footer from "../../../shared/components/Footer";
import Button from "../../../shared/components/Button";

export default function GestionAlimentacion({
  alimentaciones,
  form,
  updateField,
  submitted,
  errores,
  handleGuardar,
  onBack,
}) {
  const calcularStats = (data) => ({
    registrosHoy: data.length,
    kgSuministrados: data.reduce(
      (acc, a) => acc + Number(a.cantidadKg || 0),
      0,
    ),
    estanquesActivos: new Set(data.map((a) => a.estanque)).size,
  });

  return (
    <ScrollView style={styles.contenido}>
      <View style={styles.alimentacionContent}>
      <AlimentacionStats {...calcularStats(alimentaciones)} />

      <AlimentacionForm
        form={form}
        updateField={updateField}
        submitted={submitted}
        errores={errores}
      />

      <Text tamano="xs" style={styles.secLabel}>
        REGISTROS DEL DÍA
      </Text>

      <AlimentacionList alimentaciones={alimentaciones} />

      <View style={styles.spacer} />

      <Footer
        children={
          <Button variant="outline" onPress={handleGuardar}>
            Guardar Registro
          </Button>
        }
        fixedBottom={true}
      />
    </View>
    </ScrollView>
  );
}
