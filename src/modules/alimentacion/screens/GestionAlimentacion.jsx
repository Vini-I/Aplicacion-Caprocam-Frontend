/**
 * ============================================================
 * SCREEN GESTIONALIMENTACION
 * ============================================================
 *
 * Compone las estadísticas del día, el formulario de registro y
 * la lista de registros ya guardados dentro de la pantalla de
 * Alimentación. No contiene lógica de negocio propia: los datos y
 * callbacks del formulario llegan desde AlimentacionScreen, y el
 * cálculo de estadísticas, los errores de catálogos, la
 * resolución de la alerta y el auto-scroll viven en
 * hooks/useGestionAlimentacion.js.
 *
 * Props principales:
 * - alimentaciones: lista de registros ya guardados.
 * - errorListado: mensaje de error al cargar el listado, o null.
 * - form / updateField: estado y setter del formulario.
 * - submitted / errores: estado de validación, se reenvían tal
 *   cual a AlimentacionForm.
 * - alerta: { visible, variant, mensaje } del feedback de guardado.
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

import useGestionAlimentacion from "../hooks/useGestionAlimentacion";
import AlimentacionStats from "../components/AlimentacionStats";
import AlimentacionForm from "../components/AlimentacionForm";

import Text from "../../../shared/components/Text";
import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";

import { styles } from "../styles/AlimentacionStyles";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

export default function GestionAlimentacion({
  alimentaciones,
  errorListado,
  form,
  updateField,
  submitted,
  errores,
  alerta,
  handleGuardar,
}) {
  const {
    scrollRef,
    stats,
    alertVisible,
    alertVariant,
    alertMessage,
    handleCatalogoErrorChange,
  } = useGestionAlimentacion({
    alimentaciones,
    errorListado,
    alerta,
  });

  return (
    <ScrollView
      ref={scrollRef}
      style={STYLE.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={STYLE.contentWrapper}>
        <AlimentacionStats {...stats} />

        <AlimentacionForm
          form={form}
          updateField={updateField}
          submitted={submitted}
          errores={errores}
          onCatalogoErrorChange={handleCatalogoErrorChange}
        />

        {alertVisible && (
          <Alert
            variant={alertVariant}
            message={alertMessage}
            style={styles.alert}
          />
        )}

        <Button
          variant="outline"
          onPress={handleGuardar}
          style={styles.submitButton}
        >
          <View style={styles.buttonContent}>
            <Icon
              icon={ICONS.save}
              size={24}
              color={COLORS.primary}
            />

            <Text style={styles.buttonText}>
              Registrar Alimentación
            </Text>
          </View>
        </Button>

        <View style={styles.spacer} />
      </View>
    </ScrollView>
  );
}
