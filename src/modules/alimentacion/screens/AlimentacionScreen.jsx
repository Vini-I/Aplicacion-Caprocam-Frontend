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
 * - El feedback de guardado (éxito, campos incompletos, error de
 *   guardado) se muestra con los componentes globales Modal +
 *   Alert de shared/components/, en vez de window.alert/
 *   Alert.alert nativos. cerrarModal() solo dispara el reset del
 *   formulario (resetForm/submitted/errores/recargar) cuando el
 *   modal se cierra estando en variant "success".
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
import { View } from "react-native";
import useAlimentacion from "../hooks/useAlimentacion";
import useAlimentacionForm from "../hooks/useAlimentacionForm";
import alimentacionService from "../services/Alimentacion.service";
import Spinner from "../../../shared/components/Spinner";
import Text from "../../../shared/components/Text";
import GestionAlimentacion from "./GestionAlimentacion";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Alert from "../../../shared/components/Alert";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/AlimentacionStyles";
import { STYLE } from "../../../theme/style"

export default function AlimentacionScreen({ navigation, onBack }) {
  const { alimentaciones, loading, error, recargar } = useAlimentacion();
  const { form, updateField, resetForm, validarForm } = useAlimentacionForm();
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState({ visible: false, variant: "success", mensaje: "" });

  useEffect(() => {
    const unsub = navigation?.addListener("focus", recargar);
    return unsub;
  }, [navigation, recargar]);

  useEffect(() => {
  if (!alerta.visible) return;

  const timer = setTimeout(() => {
    if (alerta.variant === "success") {
      resetForm();
      setSubmitted(false);
      setErrores({});
      recargar();
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
      setAlerta({ visible: true, variant: "danger", mensaje: "Rellenar campos obligatorios." });
      return;
    }

    try {
      await alimentacionService.create(form);
      setAlerta({ visible: true, variant: "success", mensaje: "Alimentación registrada correctamente" });
    } catch {
      setAlerta({ visible: true, variant: "danger", mensaje: "No se pudo guardar el registro" });
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
  <>
    <NavbarRegistro
      Titulo="Alimentación"
      Subtitulo="Registro de alimentación"
      Icono="food"
    />

    <View style={STYLE.container}>
      <GestionAlimentacion
        alimentaciones={alimentaciones}
        form={form}
        updateField={updateField}
        submitted={submitted}
        errores={errores}
        handleGuardar={handleGuardar}
        alerta={alerta}
        onBack={onBack}
      />
    </View>
  </>
  );
}