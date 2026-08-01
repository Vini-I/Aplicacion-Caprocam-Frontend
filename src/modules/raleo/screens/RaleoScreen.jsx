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
import { useError } from "../../../shared/context/ErrorContext.js";

export default function RaleoScreen() {
  const { form, updateField, resetForm, validarForm } = useRaleo();
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState({ visible: false, variant: "success", mensaje: "" });
  const { mostrarError} = useError();
//Constantes para el calculo de biomasa estimada
const biomasaActual = Number(form.biomasaActual);
const porcentaje = Number(form.porcentajeRaleo);

const biomasaRestante =
  form.biomasaActual !== "" &&
  form.porcentajeRaleo !== ""
    ? biomasaActual * (1 - porcentaje / 100)
    : "";

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

function convertirFecha(fecha) {
  const [dia, mes, año] = fecha.split("/");

  return `${año}-${mes}-${dia}`;
}

  const handleGuardar = async () => {
    setSubmitted(true);
    const { valido, errores: erroresValidacion } = validarForm();
    setErrores(erroresValidacion);

    if (!valido) {
      setAlerta({ visible: true, variant: "danger", mensaje: "Rellenar campos obligatorios." });
      return;
    }

    try {
      const registro = {
        idFinca: form.finca,
        idEstanque: form.estanque,
        fecha: convertirFecha(form.fecha),
        porcentaje: Number(form.porcentajeRaleo),
        pesoEstimado: Number(form.pesoPromedio),
        biomasaEstimado: Number(form.biomasaActual),
        objetivo: form.objetivo,
        metodo: form.metodo,
        observaciones: form.observaciones?.trim()
          ? form.observaciones
          : "No se realizan observaciones",
      };
      await raleoService.create(registro);
      setAlerta({ visible: true, variant: "success", mensaje: "Raleo registrado correctamente" });
    } catch (error) {
      mostrarError(error);
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


    <ScrollView
      contentContainerStyle={STYLE.contentWrapper}
      showsVerticalScrollIndicator={false}
    >
        <RaleoForm
          form={form}
          updateField={updateField}
          submitted={submitted}
          errores={errores}
          biomasaCalculada={biomasaRestante}
        />

        <View style={styles.contenido}>
          <View style={STYLE.contentWrapper}>
        {alerta.visible && (
          <Alert
            variant={alerta.variant}
            message={alerta.mensaje}
            style={styles.alert}
          />
        )}
      </View>
      <Button variant="outline" onPress={handleGuardar} style={styles.submitButton}>
        <View style={styles.buttonContent}>
          <Icon icon={ICONS.save} size={24} color={COLORS.primary}/>
          <Text style={styles.buttonText}>
            Guardar
          </Text>
        </View>
      </Button>
      </View>
    </ScrollView>
  </View>
  </>
  );
}