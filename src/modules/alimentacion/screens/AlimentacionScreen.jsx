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
import Modal from "../../../shared/components/Modal";
import Alert from "../../../shared/components/Alert";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/AlimentacionStyles";

export default function AlimentacionScreen({ navigation, onBack }) {
  const { alimentaciones, loading, error, recargar } = useAlimentacion();
  const { form, updateField, resetForm, validarForm } = useAlimentacionForm();
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});
  const [modal, setModal] = useState({ visible: false, variant: "success", mensaje: "" });

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
      setModal({ visible: true, variant: "warning", mensaje: `Por favor complete:\n${lista}` });
      return;
    }

    try {
      await alimentacionService.create(form);
      setModal({ visible: true, variant: "success", mensaje: "Alimentación registrada correctamente" });
    } catch {
      setModal({ visible: true, variant: "danger", mensaje: "No se pudo guardar el registro" });
    }
  };

  const cerrarModal = () => {
    setModal((prev) => ({ ...prev, visible: false }));
    if (modal.variant === "success") {
      resetForm();
      setSubmitted(false);
      setErrores({});
      recargar();
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
    <View style={styles.container}>
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

      <Modal visible={modal.visible} onClose={cerrarModal}>
        <Alert
          variant={modal.variant}
          message={modal.mensaje}
          textStyle={{ textAlign: "center" }}
        />
      </Modal>
    </View>
  );
}