/**
 * ============================================================
 * SCREEN RALEOSCREEN
 * ============================================================
 *
 * Pantalla principal del módulo de Raleo. Orquesta el estado del
 * formulario (useRaleo) y el guardado real del registro.
 *
 * Funcionalidad:
 * - BUG FUNCIONAL GRAVE corregido: el botón "Registrar Raleo"
 *   tenía onPress={() => {}} y no guardaba ni validaba nada.
 *   Ahora handleGuardar activa `submitted = true`, valida con
 *   validarForm() de useRaleo, y solo si es válido persiste el
 *   registro con Raleo.service.js, muestra el modal de éxito y
 *   reinicia el formulario (resetForm + submitted=false).
 * - El feedback de guardado (éxito, campos incompletos, error de
 *   guardado) se muestra con los componentes globales Modal +
 *   Alert de shared/components/, en vez de window.alert/
 *   Alert.alert nativos (mismo patrón de AlimentacionScreen.jsx).
 * - `observaciones` no es obligatorio: si el usuario no escribe
 *   nada, handleGuardar lo completa con "No se realizan
 *   observaciones" antes de persistir el registro.
 * - Usa NavbarRegistro (header celeste con botón volver) en vez
 *   del Header.jsx compartido, igual que Alimentación y Densidad
 *   Poblacional: Header.jsx está diseñado para pantallas de
 *   login, no para navegación con botón volver + ruta contextual.
 *
 * Ejemplo:
 * <RaleoScreen />
 */

import React, { useState,useEffect } from "react";
import { View, ScrollView } from "react-native";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import Text from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import RaleoForm from "../components/RaleoForm";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Alert from "../../../shared/components/Alert";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/RaleoStyles";
import { STYLE } from "../../../theme/style";
import useRaleo from "../hooks/useRaleo";
import raleoService from "../services/Raleo.service";

export default function RaleoScreen() {
  const { form, updateField, resetForm, validarForm } = useRaleo();
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState({ visible: false, variant: "success", mensaje: "" });

useEffect(() => {
  if (!alerta.visible) return;

  const timer = setTimeout(() => {
    if (alerta.variant === "success") {
      resetForm();
      setSubmitted(false);
      setErrores({});
    }

    setAlerta((prev) => ({
      ...prev,
      visible: false,
    }));
  }, 3000);

  return () => clearTimeout(timer);
}, [alerta.visible]);

  const handleGuardar = async () => {
    setSubmitted(true);
    const { valido, errores: erroresValidacion } = validarForm();
    setErrores(erroresValidacion);

    if (!valido) {
      setAlerta({ visible: true, variant: "danger", mensaje: "Por favor complete todos los campos obligatorios." });
      return;
    }

    try {
      const registro = {
        ...form,
        observaciones: form.observaciones?.trim()
          ? form.observaciones
          : "No se realizan observaciones",
      };
      await raleoService.create(registro);
      setAlerta({ visible: true, variant: "success", mensaje: "Raleo registrado correctamente" });
    } catch {
      setAlerta({ visible: true, variant: "danger", mensaje: "No se pudo guardar el registro" });
    }
  };

  return (
    <>
    <NavbarRegistro
      Titulo="Raleo"
      Subtitulo="Cosecha parcial y densidad"
      Icono="raleo"
    />

    <View style={STYLE.container}>
      <View style={STYLE.contentWrapper}>
        {alerta.visible && (
          <Alert
            variant={alerta.variant}
            message={alerta.mensaje}
            style={styles.alert}
          />
        )}
      </View>

    <ScrollView
      contentContainerStyle={STYLE.contentWrapper}
      showsVerticalScrollIndicator={false}
    >
        <RaleoForm
          form={form}
          updateField={updateField}
          submitted={submitted}
          errores={errores}
        />

        <View style={styles.contenido}>
        <Button
          variant="outline"
          onPress={handleGuardar}
          style={styles.saveButton}
        >
          <View style={styles.saveBtnContent}>
            <Icon
              icon={ICONS.save}
              size={18}
              color={COLORS.primary}
            />

            <Text
              size={16}
              color={COLORS.primary}
              style={styles.saveBtnText}
            >
              Registrar Raleo
            </Text>
          </View>
        </Button>
      </View>
    </ScrollView>
  </View>
  </>
  );
}