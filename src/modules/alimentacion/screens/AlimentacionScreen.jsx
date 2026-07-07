/**
 * ============================================================
 * SCREEN ALIMENTACIONSCREEN
 * ============================================================
 *
 * Pantalla principal del módulo de Alimentación. Orquesta la
 * carga de registros (useAlimentacion), el estado del
 * formulario (useAlimentacionForm) y el guardado del registro.
 *
 * Funcionalidad:
 * - Mantiene el estado `submitted` (booleano): se activa recién
 *   dentro de handleGuardar, ANTES de validar, para que
 *   GestionAlimentacion/AlimentacionForm sepan cuándo mostrar
 *   los bordes rojos y mensajes de error de validarForm().
 * - Usa NavbarRegistro (header celeste con botón volver) en vez
 *   del Header.jsx compartido: Header.jsx está diseñado para
 *   pantallas de login (logo + título + subtítulo centrados),
 *   no para navegación con botón volver + ruta contextual.
 *
 * Props principales:
 * - navigation: objeto de navegación (opcional, usado para
 *   recargar datos al enfocar la pantalla).
 * - onBack: callback opcional para volver atrás.
 *
 * Ejemplo:
 * <AlimentacionScreen navigation={navigation} />
 */

import React, { useEffect, useState } from "react";
import { View, Platform, Alert } from "react-native";
import useAlimentacion from "../hooks/useAlimentacion";
import useAlimentacionForm from "../hooks/useAlimentacionForm";
import alimentacionService from "../services/alimentacion.service";
import Spinner from "../../../shared/components/Spinner";
import Text from "../../../shared/components/Text";
import GestionAlimentacion from "./GestionAlimentacion";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/alimentacionStyles";

const showAlert = (title, message, buttons) => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    buttons?.[0]?.onPress?.();
  } else {
    Alert.alert(title, message, buttons);
  }
};

export default function AlimentacionScreen({ navigation, onBack }) {
  const { alimentaciones, loading, error, recargar } = useAlimentacion();
  const { form, updateField, resetForm, validarForm } = useAlimentacionForm();
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const unsub = navigation?.addListener("focus", recargar);
    return unsub;
  }, [navigation, recargar]);

  const handleGuardar = async () => {
    setSubmitted(true);
    const { valido, errores: erroresValidacion } = validarForm();
    setErrores(erroresValidacion);

    if (!valido) {
      const lista = Object.values(erroresValidacion)
        .map((e) => `• ${e}`)
        .join("\n");
      showAlert("Campos incompletos", `Por favor complete:\n${lista}`);
      return;
    }

    try {
      await alimentacionService.create(form);
      showAlert("Éxito", "Alimentación registrada correctamente", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            setSubmitted(false);
            setErrores({});
            recargar();
          },
        },
      ]);
    } catch {
      showAlert("Error", "No se pudo guardar el registro");
    }
  };

  if (loading) return <Spinner />;

  if (error)
    return (
      <Text color={COLORS.error} alineacion="center">
        {error}
      </Text>
    );

  return (
    <View style={styles.screen}>
      <NavbarRegistro
        Titulo="Alimentación"
        Subtitulo="Registro de alimentación"
        Icono="food"
      />
      <GestionAlimentacion
        alimentaciones={alimentaciones}
        form={form}
        updateField={updateField}
        submitted={submitted}
        errores={errores}
        handleGuardar={handleGuardar}
        onBack={onBack}
      />
    </View>
  );
}