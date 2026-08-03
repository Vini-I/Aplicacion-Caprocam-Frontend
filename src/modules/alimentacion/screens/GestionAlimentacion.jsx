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
 
import React, { useEffect, useRef } from "react";
import { View, ScrollView } from "react-native";

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
  form,
  updateField,
  submitted,
  errores,
  alerta,
  handleGuardar,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (alerta.visible) {
      scrollRef.current?.scrollToEnd({
        animated: true,
      });
    }
  }, [alerta.visible]);

  const calcularStats = (registros = []) => {
    const registrosHoy = registros.length;

    const kgSuministrados = registros.reduce((total, registro) => {
      return total + Number(registro.cantidadKg || 0);
    }, 0);

    const estanquesActivos = new Set(
      registros
        .map((registro) => registro.estanque)
        .filter(Boolean)
    ).size;

    return {
      registrosHoy,
      kgSuministrados,
      estanquesActivos,
    };
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={STYLE.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={STYLE.contentWrapper}>
        <AlimentacionStats
          {...calcularStats(alimentaciones)}
        />

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