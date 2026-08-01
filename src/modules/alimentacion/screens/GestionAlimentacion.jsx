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
import { styles } from "../styles/AlimentacionStyles";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons.js";
import Icon from "../../../shared/components/Icons.jsx";
import Alert from "../../../shared/components/Alert.jsx";
import Footer from "../../../shared/components/Footer";
import Button from "../../../shared/components/Button";
import { STYLE } from "../../../theme/style";

export default function GestionAlimentacion({
  alimentaciones,
  form,
  updateField,
  submitted,
  errores,
  handleGuardar,
  alerta,
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
    <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
      <View style={STYLE.contentWrapper}>
        <AlimentacionStats {...calcularStats(alimentaciones)} />

        <AlimentacionForm
          form={form}
          updateField={updateField}
          submitted={submitted}
          errores={errores}
        />

        {alerta.visible && (
  <Alert
    variant={alerta.variant}
    message={alerta.mensaje}
    style={styles.alert}
  />
)}
          <Button variant="outline" onPress={handleGuardar} style={styles.submitButton}>
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} size={24} color={COLORS.primary}/>
              <Text style={styles.buttonText}>
                Guardar
              </Text>
            </View>
          </Button>
        {/* <Text style={styles.secLabel}>
          REGISTROS DEL DÍA
        </Text>

        <AlimentacionList alimentaciones={alimentaciones} /> */}

        <View style={styles.spacer} />
      </View>
    </ScrollView>
  );
}
